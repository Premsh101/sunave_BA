'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Monitor, Square, Save, Languages, Volume2, VolumeX, UserCircle } from 'lucide-react';
import { useTranscription } from '@/features/transcription/useTranscription';
import { useTextToSpeech } from '@/features/speech/useTextToSpeech';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import GenerateDocumentModal from '@/components/ui/GenerateDocumentModal';
import { typography, semantic, colors, shadows } from '@/styles/theme';

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

  const handleStart = (captureMode: 'mic' | 'system') => {
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

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', background: semantic.bg.primary }}>
      
      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: `1px solid ${semantic.border.primary}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: semantic.bg.secondary }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, color: semantic.text.primary }}>New Live Meeting</h1>
          {isRecording ? (
            <Badge variant="danger" icon={<div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'pulse 1.5s infinite' }} />}>
              Transcribing Live
            </Badge>
          ) : (
            <Badge variant="neutral">Ready</Badge>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: semantic.bg.tertiary, borderRadius: '8px', padding: '4px' }}>
            <button 
              onClick={() => setMode('bot-free')}
              style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: mode === 'bot-free' ? semantic.bg.elevated : 'transparent', color: mode === 'bot-free' ? semantic.text.primary : semantic.text.muted, fontSize: typography.fontSize.sm, cursor: 'pointer', transition: 'all 0.2s', boxShadow: mode === 'bot-free' ? shadows.sm : 'none', fontWeight: mode === 'bot-free' ? 500 : 400 }}
            >
              Bot-Free Mode
            </button>
            <button 
              onClick={() => setMode('ai-assistant')}
              style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: mode === 'ai-assistant' ? semantic.bg.elevated : 'transparent', color: mode === 'ai-assistant' ? semantic.text.primary : semantic.text.muted, fontSize: typography.fontSize.sm, cursor: 'pointer', transition: 'all 0.2s', boxShadow: mode === 'ai-assistant' ? shadows.sm : 'none', fontWeight: mode === 'ai-assistant' ? 500 : 400 }}
            >
              AI Assistant Mode
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: semantic.bg.tertiary, padding: '0.5rem 1rem', borderRadius: '8px' }}>
            <Languages size={16} color={semantic.text.muted} />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isRecording}
              style={{ background: 'transparent', border: 'none', color: semantic.text.primary, fontSize: typography.fontSize.sm, outline: 'none' }}
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="hi-IN">Hindi / Hinglish</option>
              <option value="es-ES">Spanish</option>
            </select>
          </div>
          
          {ttsSupported && (
            <Button
              variant="secondary"
              size="sm"
              icon={isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
              disabled={isRecording || (!transcript && !interimTranscript)}
              onClick={handleReadAloud}
            >
              {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={<Save size={16} />}
            disabled={!transcript && !interimTranscript}
            onClick={handleSaveAndGenerate}
          >
            Save & Generate
          </Button>
        </div>
      </div>

      {/* Main Transcript Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left - Transcript */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }} ref={scrollRef}>
          
          {!transcript && !interimTranscript && !isRecording && (
            <div style={{ margin: 'auto', textAlign: 'center', maxWidth: '400px' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: semantic.bg.brandSubtle, margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mic size={32} color={colors.brand[400]} />
              </div>
          <h2 style={{ fontSize: typography.fontSize.xl, fontWeight: 600, color: semantic.text.primary, marginBottom: '0.5rem' }}>Start Transcription</h2>
              <p style={{ color: semantic.text.secondary, marginBottom: '2rem' }}>
                Speech recognition runs natively in your browser — no bots, no cloud keys.
                Perfect for Google Meet, Teams, or Zoom. For meeting audio, share the tab
                and keep it playing on your speakers.
              </p>
            </div>
          )}

          {!isSupported && (
            <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', border: `1px solid rgba(239,68,68,0.2)`, borderRadius: '8px', color: colors.danger[400], marginBottom: '2rem' }}>
              Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.
            </div>
          )}

          {error && (
            <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', border: `1px solid rgba(239,68,68,0.2)`, borderRadius: '8px', color: colors.danger[400], marginBottom: '2rem' }}>
              Error: {error}
            </div>
          )}

          {transcript && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <UserCircle size={20} color={semantic.text.muted} />
                <span style={{ fontWeight: 600, color: semantic.text.primary, fontSize: typography.fontSize.sm }}>Speaker 1</span>
              </div>
              <p style={{ color: semantic.text.primary, fontSize: typography.fontSize.lg, lineHeight: 1.6, paddingLeft: '28px' }}>
                {transcript}
              </p>
            </div>
          )}

          {interimTranscript && (
            <div style={{ marginBottom: '1.5rem', opacity: 0.7 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <UserCircle size={20} color={semantic.text.muted} />
                <span style={{ fontWeight: 600, color: semantic.text.primary, fontSize: typography.fontSize.sm }}>Speaker (Live)</span>
              </div>
              <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.lg, lineHeight: 1.6, paddingLeft: '28px' }}>
                {interimTranscript}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Recording Bar */}
      <div style={{ padding: '1rem 2rem', background: semantic.bg.elevated, borderTop: `1px solid ${semantic.border.primary}`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {!isRecording ? (
            <>
              <Button variant="primary" disabled={!isSupported} onClick={() => handleStart('system')} icon={<Monitor size={18} />}>
                Capture Tab Audio (Meet/Zoom)
              </Button>
              <Button variant="secondary" disabled={!isSupported} onClick={() => handleStart('mic')} icon={<Mic size={18} />}>
                Capture Microphone Only
              </Button>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '2rem', color: semantic.text.muted }}>
                <Volume2 size={16} /> <span style={{ fontSize: typography.fontSize.sm }}>Capturing Audio</span>
              </div>
              <Button variant="danger" onClick={stopRecording} icon={<Square size={18} />}>
                Stop Transcription
              </Button>
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


