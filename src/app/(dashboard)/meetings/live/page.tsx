'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Monitor, Square, Save, Languages, Volume2, VolumeX, UserCircle } from 'lucide-react';
import { useTranscription, type CaptureMode } from '@/features/transcription/useTranscription';
import { useTextToSpeech } from '@/features/speech/useTextToSpeech';
import GenerateDocumentModal from '@/components/ui/GenerateDocumentModal';

export default function LiveMeeting() {
  const [language, setLanguage] = useState('en-US');
  const [mode, setMode] = useState<'bot-free' | 'ai-assistant'>('bot-free');
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const { isRecording, isSupported, startRecording, stopRecording, transcript, interimTranscript, error } = useTranscription(language);
  const { speak, stop: stopSpeaking, isSpeaking, isSupported: ttsSupported } = useTextToSpeech(language);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, interimTranscript]);

  const handleStart = (captureMode: CaptureMode) => {
    // Never read aloud while capturing — the mic would transcribe the TTS voice.
    if (isSpeaking) stopSpeaking();
    startRecording(captureMode);
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak([transcript, interimTranscript].filter(Boolean).join(' ').trim());
    }
  };

  const handleSaveAndGenerate = () => {
    if (isRecording) stopRecording();
    if (isSpeaking) stopSpeaking();
    setShowGenerateModal(true);
  };

  const hasTranscript = Boolean(transcript || interimTranscript);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-app-bg">
      {/* Header */}
      <div className="px-4 md:px-6 py-4 border-b border-app-outline/50 flex flex-wrap justify-between items-center gap-3 bg-app-surface-low/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-app-fg">New Live Meeting</h1>
          {isRecording ? (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-app-error/10 border border-app-error/30 text-app-error text-xs font-semibold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-app-error opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-app-error" />
              </span>
              Transcribing Live
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-app-surface-highest border border-app-outline/50 text-app-fg-variant text-xs font-semibold uppercase tracking-wider">
              Ready
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mode toggle */}
          <div className="flex items-center bg-app-surface rounded-lg p-1 border border-app-outline/40">
            {(
              [
                { key: 'bot-free', label: 'Bot-Free Mode' },
                { key: 'ai-assistant', label: 'AI Assistant Mode' },
              ] as const
            ).map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`px-4 py-2 rounded-md text-sm transition-all ${
                  mode === m.key
                    ? 'bg-app-surface-highest text-app-fg font-medium shadow-sm'
                    : 'text-app-fg-variant hover:text-app-fg'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Language */}
          <div className="flex items-center gap-2 bg-app-surface px-4 py-2 rounded-lg border border-app-outline/40">
            <Languages size={16} className="text-app-fg-variant" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isRecording}
              className="bg-transparent border-none text-app-fg text-sm outline-none disabled:opacity-50"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="hi-IN">Hindi / Hinglish</option>
              <option value="es-ES">Spanish</option>
            </select>
          </div>

          {ttsSupported && (
            <button
              onClick={handleReadAloud}
              disabled={isRecording || !hasTranscript}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-app-outline text-app-fg text-sm font-medium hover:bg-app-surface-high transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
            </button>
          )}

          <button
            onClick={handleSaveAndGenerate}
            disabled={!hasTranscript}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-action hover:bg-action-hover text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(99,102,241,0.25)]"
          >
            <Save size={16} />
            Save &amp; Generate
          </button>
        </div>
      </div>

      {/* Transcript area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 flex flex-col" ref={scrollRef}>
        {!hasTranscript && !isRecording && (
          <div className="m-auto text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-app-primary-container/20 border border-app-primary/20 mx-auto mb-6 flex items-center justify-center">
              <Mic size={32} className="text-app-primary" />
            </div>
            <h2 className="text-xl font-semibold text-app-fg mb-2">Start Transcription</h2>
            <p className="text-app-fg-variant mb-8">
              Speech recognition runs natively in your browser — no bots, no cloud keys.
              &quot;Capture Everything&quot; hears both the meeting (share the tab, keep audio on
              speakers — not headphones) and your own voice through the microphone.
            </p>
          </div>
        )}

        {!isSupported && (
          <div className="p-4 bg-app-error/10 border border-app-error/25 rounded-lg text-app-error mb-8 text-sm">
            Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.
          </div>
        )}

        {error && (
          <div className="p-4 bg-app-error/10 border border-app-error/25 rounded-lg text-app-error mb-8 text-sm">
            Error: {error}
          </div>
        )}

        {transcript && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <UserCircle size={20} className="text-app-fg-variant" />
              <span className="font-semibold text-app-fg text-sm">Speaker 1</span>
            </div>
            <p className="text-app-fg text-lg leading-relaxed pl-7">{transcript}</p>
          </div>
        )}

        {interimTranscript && (
          <div className="mb-6 opacity-70">
            <div className="flex items-center gap-3 mb-2">
              <UserCircle size={20} className="text-app-fg-variant" />
              <span className="font-semibold text-app-fg text-sm">Speaker (Live)</span>
            </div>
            <p className="text-app-fg-variant text-lg leading-relaxed pl-7">{interimTranscript}</p>
          </div>
        )}
      </div>

      {/* Bottom control bar */}
      <div className="px-4 md:px-8 py-4 bg-app-surface-low border-t border-app-outline/50 flex justify-center items-center">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {!isRecording ? (
            <>
              <button
                onClick={() => handleStart('both')}
                disabled={!isSupported}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-action hover:bg-action-hover text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              >
                <Monitor size={18} />
                Capture Everything (Meeting + My Mic)
              </button>
              <button
                onClick={() => handleStart('mic')}
                disabled={!isSupported}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-app-outline text-app-fg text-sm font-medium hover:bg-app-surface-high transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Mic size={18} />
                Microphone Only
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mr-8 text-app-fg-variant text-sm">
                <Volume2 size={16} className="text-app-primary animate-pulse" /> Capturing Audio
              </div>
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-app-error/90 hover:bg-app-error text-[#450a0a] text-sm font-semibold transition-colors"
              >
                <Square size={18} />
                Stop Transcription
              </button>
            </>
          )}
        </div>
      </div>

      {/* Generate Document Modal */}
      {showGenerateModal && (
        <GenerateDocumentModal
          preloadedTranscript={[transcript, interimTranscript].filter(Boolean).join(' ').trim()}
          onClose={() => setShowGenerateModal(false)}
          onGenerated={() => {
            setShowGenerateModal(false);
          }}
        />
      )}
    </div>
  );
}
