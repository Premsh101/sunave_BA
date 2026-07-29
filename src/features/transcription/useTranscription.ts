'use client';

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from 'react';

/**
 * Minimal typings for the Web Speech API (SpeechRecognition).
 * These are not part of TypeScript's lib.dom, so we declare just
 * the surface we use.
 */
interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
  message: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as Record<string, unknown>;
  return (
    (w.SpeechRecognition as SpeechRecognitionConstructor | undefined) ||
    (w.webkitSpeechRecognition as SpeechRecognitionConstructor | undefined) ||
    null
  );
}

// Static store subscription for useSyncExternalStore — browser capability
// never changes during a session, so there is nothing to subscribe to.
function subscribeNever(): () => void {
  return () => {};
}

// If recognition keeps ending instantly (e.g. mic muted, browser throttling)
// we stop auto-restarting after this many consecutive rapid failures.
const MAX_RAPID_RESTARTS = 5;
// An "onend" arriving sooner than this after start counts as a rapid failure.
const RAPID_RESTART_WINDOW_MS = 1000;

/**
 * Live transcription powered entirely by the browser's native
 * Web Speech API (SpeechRecognition). No server round-trip, no cloud
 * credentials — recognition runs through the browser itself, which
 * captures the microphone directly and is far more resilient than
 * streaming raw PCM to a backend.
 *
 * Capture modes:
 *  - 'mic'    → recognition listens to the default microphone.
 *  - 'system' → additionally captures tab/system audio (getDisplayMedia)
 *               and plays it out through the speakers so the recognizer
 *               can hear the meeting audio. Use this for Google Meet,
 *               Teams or Zoom running in another tab; don't use headphones
 *               in this mode, since recognition listens via the microphone.
 */
export function useTranscription(language = 'en-US') {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState('');

  // Client-only capability check; assume supported during SSR so the
  // hydrated markup matches supporting browsers.
  const isSupported = useSyncExternalStore(
    subscribeNever,
    () => getSpeechRecognition() !== null,
    () => true
  );

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const isRecordingRef = useRef(false);
  const languageRef = useRef(language);
  const lastStartAtRef = useRef(0);
  const rapidRestartsRef = useRef(0);

  // System-audio playback plumbing (only used in 'system' mode)
  const displayStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const teardownSystemAudio = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (displayStreamRef.current) {
      displayStreamRef.current.getTracks().forEach((t) => t.stop());
      displayStreamRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(() => {
    isRecordingRef.current = false;
    setIsRecording(false);
    setInterimTranscript('');

    if (recognitionRef.current) {
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      recognition.onend = null;
      recognition.onresult = null;
      recognition.onerror = null;
      try {
        recognition.stop();
      } catch {
        // Already stopped — nothing to do.
      }
    }

    teardownSystemAudio();
  }, [teardownSystemAudio]);

  const startRecognizer = useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = languageRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      // Real speech is flowing — reset the failure counter.
      rapidRestartsRef.current = 0;

      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? '';
        if (result.isFinal) {
          const finalText = text.trim();
          if (finalText) {
            setTranscript((prev) => prev + finalText + ' ');
          }
        } else {
          interim += text;
        }
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      switch (event.error) {
        case 'no-speech':
        case 'aborted':
          // Benign — continuous sessions end with these all the time.
          // onend fires next and handles the restart.
          return;
        case 'not-allowed':
        case 'service-not-allowed':
          setError(
            'Microphone access was denied. Allow microphone access for this site and try again.'
          );
          break;
        case 'audio-capture':
          setError('No microphone was found. Check that a microphone is connected and enabled.');
          break;
        case 'network':
          setError(
            'The browser speech service hit a network error. Check your connection and try again.'
          );
          break;
        case 'language-not-supported':
          setError(`The selected language (${languageRef.current}) is not supported by this browser.`);
          break;
        default:
          setError(`Speech recognition error: ${event.error}`);
      }
      stopRecording();
    };

    recognition.onend = () => {
      if (!isRecordingRef.current) return;

      // Chrome ends continuous recognition after ~60s or a stretch of
      // silence. Seamlessly restart — unless it is dying instantly in a
      // loop, which means something is genuinely wrong.
      const elapsed = Date.now() - lastStartAtRef.current;
      if (elapsed < RAPID_RESTART_WINDOW_MS) {
        rapidRestartsRef.current++;
        if (rapidRestartsRef.current >= MAX_RAPID_RESTARTS) {
          setError(
            'Speech recognition keeps stopping. Check that your microphone is not muted, then start again.'
          );
          stopRecording();
          return;
        }
      }

      try {
        lastStartAtRef.current = Date.now();
        recognition.start();
      } catch {
        // start() can throw if called while a session is still winding
        // down; retry once shortly after.
        setTimeout(() => {
          if (!isRecordingRef.current || recognitionRef.current !== recognition) return;
          try {
            lastStartAtRef.current = Date.now();
            recognition.start();
          } catch {
            setError('Speech recognition could not be restarted. Please start again.');
            stopRecording();
          }
        }, 250);
      }
    };

    recognitionRef.current = recognition;
    lastStartAtRef.current = Date.now();
    rapidRestartsRef.current = 0;
    recognition.start();
  }, [stopRecording]);

  const startRecording = useCallback(
    async (mode: 'mic' | 'system') => {
      if (isRecordingRef.current) return;

      if (!getSpeechRecognition()) {
        setError(
          'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.'
        );
        return;
      }

      try {
        if (mode === 'system') {
          // Capture tab/system audio and play it out loud so the
          // microphone-based recognizer can hear the meeting.
          const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: {
              echoCancellation: false,
              noiseSuppression: false,
            },
          });

          // Browser or user may not provide an audio track (e.g. user didn't
          // tick "Share tab audio", or the OS doesn't support system capture).
          if (displayStream.getAudioTracks().length === 0) {
            displayStream.getTracks().forEach((t) => t.stop());
            setError(
              'No audio track detected. When prompted, make sure to tick "Share tab audio" (or "Share system audio"). ' +
                'Alternatively, use "Capture Microphone Only".'
            );
            return;
          }

          displayStreamRef.current = displayStream;

          const audioContext = new window.AudioContext();
          audioContextRef.current = audioContext;
          const source = audioContext.createMediaStreamSource(displayStream);
          source.connect(audioContext.destination);

          // Stop everything when the user ends the screen share from the
          // browser's own "Stop sharing" UI.
          displayStream.getVideoTracks()[0]?.addEventListener('ended', () => {
            stopRecording();
          });
        } else {
          // Prompt for mic permission up front so a denial surfaces as a
          // clear error before recognition starts.
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Recognition opens the mic itself — release our handle.
          micStream.getTracks().forEach((t) => t.stop());
        }

        isRecordingRef.current = true;
        setIsRecording(true);
        setError('');
        setInterimTranscript('');
        startRecognizer();
      } catch (err) {
        teardownSystemAudio();
        const message = err instanceof Error ? err.message : 'Failed to access audio.';
        setError(message || 'Failed to access audio.');
      }
    },
    [startRecognizer, stopRecording, teardownSystemAudio]
  );

  // Clean up if the component unmounts mid-recording.
  useEffect(() => {
    return () => {
      isRecordingRef.current = false;
      if (recognitionRef.current) {
        const recognition = recognitionRef.current;
        recognitionRef.current = null;
        recognition.onend = null;
        recognition.onresult = null;
        recognition.onerror = null;
        try {
          recognition.abort();
        } catch {
          // Already gone.
        }
      }
      teardownSystemAudio();
    };
  }, [teardownSystemAudio]);

  return {
    isRecording,
    isSupported,
    startRecording,
    stopRecording,
    transcript,
    interimTranscript,
    error,
  };
}
