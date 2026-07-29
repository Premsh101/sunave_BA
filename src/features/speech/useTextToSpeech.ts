'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

// Chrome silently cuts off long utterances (~15s), so long text is split
// into sentence-sized chunks and queued back-to-back.
const MAX_CHUNK_LENGTH = 200;

function chunkText(text: string): string[] {
  const chunks: string[] = [];
  // Split on sentence boundaries first, then hard-wrap anything still too long.
  const sentences = text.match(/[^.!?\n]+[.!?]*\s*/g) ?? [text];

  let current = '';
  for (const sentence of sentences) {
    if ((current + sentence).length > MAX_CHUNK_LENGTH && current) {
      chunks.push(current.trim());
      current = '';
    }
    if (sentence.length > MAX_CHUNK_LENGTH) {
      for (let i = 0; i < sentence.length; i += MAX_CHUNK_LENGTH) {
        chunks.push(sentence.slice(i, i + MAX_CHUNK_LENGTH).trim());
      }
    } else {
      current += sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  return chunks.filter(Boolean);
}

function hasSpeechSynthesis(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Static store subscription for useSyncExternalStore — browser capability
// never changes during a session, so there is nothing to subscribe to.
function subscribeNever(): () => void {
  return () => {};
}

/**
 * Text-to-speech powered entirely by the browser's native speechSynthesis
 * engine — no server, no cloud credentials. Picks the best available voice
 * for the requested language and works around Chrome's long-utterance and
 * auto-pause quirks.
 */
export function useTextToSpeech(language = 'en-US') {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Client-only capability check; assume supported during SSR so the
  // hydrated markup matches supporting browsers.
  const isSupported = useSyncExternalStore(subscribeNever, hasSpeechSynthesis, () => true);

  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const languageRef = useRef(language);
  const speakingSessionRef = useRef(0);
  const resumeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    if (!hasSpeechSynthesis()) return;

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    // Voices load asynchronously in Chrome.
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearInterval(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    speakingSessionRef.current++;
    clearResumeTimer();
    if (hasSpeechSynthesis()) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [clearResumeTimer]);

  const pickVoice = useCallback((): SpeechSynthesisVoice | null => {
    const voices = voicesRef.current.length
      ? voicesRef.current
      : window.speechSynthesis.getVoices();
    const lang = languageRef.current.toLowerCase();
    const prefix = lang.split('-')[0];

    return (
      voices.find((v) => v.lang.toLowerCase() === lang && v.localService) ||
      voices.find((v) => v.lang.toLowerCase() === lang) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ||
      null
    );
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!hasSpeechSynthesis()) return;

      const trimmed = text.trim();
      if (!trimmed) return;

      // Cancel anything already queued, then start a new session.
      window.speechSynthesis.cancel();
      clearResumeTimer();
      const session = ++speakingSessionRef.current;

      const voice = pickVoice();
      const chunks = chunkText(trimmed);

      chunks.forEach((chunk, index) => {
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.lang = languageRef.current;
        if (voice) utterance.voice = voice;

        if (index === chunks.length - 1) {
          utterance.onend = () => {
            if (speakingSessionRef.current !== session) return;
            clearResumeTimer();
            setIsSpeaking(false);
          };
        }
        utterance.onerror = () => {
          if (speakingSessionRef.current !== session) return;
          clearResumeTimer();
          setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
      });

      // Chrome pauses synthesis after ~15s of continuous speech;
      // periodically nudging it with resume() keeps long reads going.
      resumeTimerRef.current = setInterval(() => {
        if (speakingSessionRef.current !== session) return;
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) return;
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }, 5000);

      setIsSpeaking(true);
    },
    [clearResumeTimer, pickVoice]
  );

  // Stop speech if the component unmounts mid-read.
  useEffect(() => {
    return () => {
      clearResumeTimer();
      if (hasSpeechSynthesis()) {
        window.speechSynthesis.cancel();
      }
    };
  }, [clearResumeTimer]);

  return { speak, stop, isSpeaking, isSupported };
}
