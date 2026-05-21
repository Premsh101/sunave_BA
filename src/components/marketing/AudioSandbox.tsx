'use client';

import React, { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react';
import { Play, Pause, Mic, TerminalSquare } from 'lucide-react';
import { colors, typography, semantic, borderRadius } from '@/styles/theme';
import animations from '@/styles/animations';

const TABS = [
  { id: 'recruitment', label: 'Recruitment Screening Simulation' },
  { id: 'verification', label: 'Business Verification Checklist' },
] as const;

type TabId = typeof TABS[number]['id'];

const TERMINAL_LINES: Record<TabId, string[]> = {
  recruitment: [
    '{"event":"call_start","session":"rec-4x91","ts":0}',
    '{"event":"stt","text":"Hi, calling about the software engineer role","confidence":0.97,"latency_ms":148}',
    '{"event":"llm_intent","intent":"CANDIDATE_GREETING","score":0.99,"latency_ms":82}',
    '{"event":"tts","text":"Great, I can walk you through the screening.","latency_ms":94}',
    '{"event":"stt","text":"Yes, I have 5 years of React experience","confidence":0.96,"latency_ms":131}',
    '{"event":"llm_extract","field":"years_experience","value":5,"latency_ms":76}',
    '{"event":"ats_sync","record_id":"ATS-8831","status":"updated","latency_ms":205}',
    '{"event":"stt","text":"I am available to start in two weeks","confidence":0.98,"latency_ms":122}',
    '{"event":"llm_extract","field":"availability","value":"2_weeks","latency_ms":69}',
    '{"event":"pipeline","e2e_latency_ms":312,"stt_ms":148,"llm_ms":82,"tts_ms":94}',
    '{"event":"call_end","outcome":"QUALIFIED","duration_s":47,"score":0.91}',
  ],
  verification: [
    '{"event":"call_start","session":"ver-7k32","ts":0}',
    '{"event":"stt","text":"This is Priya from merchant ID 884210","confidence":0.98,"latency_ms":139}',
    '{"event":"llm_intent","intent":"MERCHANT_ONBOARDING","score":0.99,"latency_ms":74}',
    '{"event":"kyc_lookup","merchant_id":"884210","status":"found","risk":"low","latency_ms":188}',
    '{"event":"tts","text":"Confirming your GSTIN and bank account details.","latency_ms":88}',
    '{"event":"stt","text":"My GSTIN is 29ABCDE1234F1Z5","confidence":0.97,"latency_ms":144}',
    '{"event":"llm_extract","field":"gstin","value":"29ABCDE1234F1Z5","valid":true,"latency_ms":63}',
    '{"event":"fraud_check","score":0.03,"verdict":"CLEAR","latency_ms":112}',
    '{"event":"tts","text":"Verification successful. Your account is now active.","latency_ms":91}',
    '{"event":"pipeline","e2e_latency_ms":298,"stt_ms":139,"llm_ms":74,"tts_ms":88}',
    '{"event":"call_end","outcome":"VERIFIED","duration_s":38,"score":0.98}',
  ],
};

const NUM_BARS = 48;

function WaveBar({ index, playing }: { index: number; playing: boolean }) {
  const delay = (index * 0.04) % 0.8;
  const baseHeight = 4 + Math.sin(index * 0.6) * 3;
  const barStyle: CSSProperties = {
    width: 3,
    height: playing ? undefined : baseHeight,
    minHeight: baseHeight,
    borderRadius: 2,
    background: index % 3 === 0
      ? colors.accent[400]
      : index % 3 === 1
        ? colors.brand[400]
        : colors.accent[300],
    opacity: playing ? 0.9 : 0.35,
    transformOrigin: 'bottom',
    animation: playing ? `wave ${0.6 + (index % 5) * 0.12}s ease-in-out ${delay}s infinite` : 'none',
    flexShrink: 0,
  };
  return <div style={barStyle} />;
}

export default function AudioSandbox() {
  const [activeTab, setActiveTab] = useState<TabId>('recruitment');
  const [playing, setPlaying] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopStreaming = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startStreaming = useCallback((tab: TabId) => {
    const lines = TERMINAL_LINES[tab];
    let idx = 0;
    setTerminalLines([]);
    setLineIndex(0);
    intervalRef.current = setInterval(() => {
      if (idx < lines.length) {
        setTerminalLines((prev) => [...prev, lines[idx]]);
        setLineIndex(idx + 1);
        idx++;
      } else {
        stopStreaming();
      }
    }, 700);
  }, [stopStreaming]);

  useEffect(() => {
    if (playing) {
      startStreaming(activeTab);
    } else {
      stopStreaming();
    }
    return stopStreaming;
  }, [playing, activeTab, startStreaming, stopStreaming]);

  // auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const handleTabChange = (id: TabId) => {
    setActiveTab(id);
    setPlaying(false);
    setTerminalLines([]);
    setLineIndex(0);
  };

  const containerStyle: CSSProperties = {
    borderRadius: borderRadius['2xl'],
    border: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(9,9,11,0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 32px 64px -16px rgba(0,0,0,0.5), 0 0 0 1px rgba(6,182,212,0.06)',
    overflow: 'hidden',
  };

  const headerStyle: CSSProperties = {
    padding: '0.75rem 1.25rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(255,255,255,0.02)',
  };

  const tabBarStyle: CSSProperties = {
    padding: '0.875rem 1.25rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  };

  const bodyStyle: CSSProperties = {
    display: 'flex',
    gap: 0,
    minHeight: 300,
  };

  const waveAreaStyle: CSSProperties = {
    flex: 1,
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    borderRight: '1px solid rgba(255,255,255,0.06)',
  };

  const terminalStyle: CSSProperties = {
    width: '360px',
    flexShrink: 0,
    padding: '1rem',
    fontFamily: typography.fontFamily.mono,
    fontSize: '0.7rem',
    color: colors.accent[300],
    overflowY: 'auto',
    maxHeight: 300,
    background: 'rgba(0,0,0,0.3)',
  };

  return (
    <div style={containerStyle}>
      {/* Window chrome */}
      <div style={headerStyle}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
        <div style={{ flex: 1 }} />
        <Mic size={13} color={colors.accent[400]} />
        <span style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, fontFamily: typography.fontFamily.mono }}>
          sunave-voicebot · pipeline-sandbox
        </span>
        {playing && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: typography.fontSize.xs, color: colors.success[400] }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.success[400], display: 'inline-block', animation: 'recording 1.5s ease-in-out infinite' }} />
            LIVE
          </span>
        )}
      </div>

      {/* Tab bar */}
      <div style={tabBarStyle}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: borderRadius.full,
                border: `1px solid ${isActive ? colors.accent[500] : 'rgba(255,255,255,0.1)'}`,
                background: isActive ? 'rgba(6,182,212,0.1)' : 'transparent',
                color: isActive ? colors.accent[300] : semantic.text.muted,
                fontSize: typography.fontSize.xs,
                fontWeight: isActive ? typography.fontWeight.semibold : typography.fontWeight.normal,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: typography.fontFamily.sans,
                letterSpacing: '0.01em',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div style={bodyStyle}>
        {/* Wave + play area */}
        <div style={waveAreaStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Play/Pause button */}
            <button
              onClick={() => setPlaying((p) => !p)}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: 'none',
                background: playing
                  ? `linear-gradient(135deg, ${colors.accent[500]}, ${colors.brand[500]})`
                  : 'rgba(255,255,255,0.07)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: playing ? '0 0 24px rgba(6,182,212,0.4)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
              }}
              aria-label={playing ? 'Pause simulation' : 'Play simulation'}
            >
              {playing ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}
            </button>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, marginBottom: '0.375rem', fontFamily: typography.fontFamily.mono }}>
                {playing ? 'STT → LLM → TTS processing...' : 'Press play to run simulation'}
              </div>
              {/* Wave bars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 48 }}>
                {Array.from({ length: NUM_BARS }, (_, i) => (
                  <WaveBar key={i} index={i} playing={playing} />
                ))}
              </div>
            </div>
          </div>

          {/* Latency chips */}
          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
            {[
              { label: 'STT', value: playing ? '148ms' : '---', color: colors.accent[400] },
              { label: 'LLM', value: playing ? '76ms' : '---', color: colors.brand[400] },
              { label: 'TTS', value: playing ? '91ms' : '---', color: colors.success[400] },
              { label: 'E2E', value: playing ? '312ms' : '---', color: colors.warning[400] },
            ].map((chip) => (
              <div
                key={chip.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.25rem 0.625rem',
                  borderRadius: borderRadius.base,
                  border: `1px solid ${chip.color}30`,
                  background: `${chip.color}10`,
                }}
              >
                <span style={{ fontSize: '0.65rem', color: semantic.text.muted, fontFamily: typography.fontFamily.mono, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {chip.label}
                </span>
                <span style={{ fontSize: '0.75rem', color: chip.color, fontWeight: 600, fontFamily: typography.fontFamily.mono }}>
                  {chip.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal */}
        <div style={terminalStyle} ref={terminalRef} className="sandbox-terminal">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <TerminalSquare size={12} color={colors.accent[400]} />
            <span style={{ fontSize: '0.65rem', color: semantic.text.muted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Token Stream
            </span>
          </div>
          {terminalLines.length === 0 ? (
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem' }}>
              {'> Awaiting pipeline execution...'}
            </span>
          ) : (
            terminalLines.map((line, i) => (
              <div
                key={i}
                style={{
                  marginBottom: '0.4rem',
                  wordBreak: 'break-all',
                  color: i === terminalLines.length - 1 ? colors.accent[300] : 'rgba(34,211,238,0.55)',
                  lineHeight: 1.5,
                  animation: i === terminalLines.length - 1 ? 'fadeIn 0.3s ease both' : 'none',
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.2)', userSelect: 'none' }}>{'> '}</span>
                {line}
              </div>
            ))
          )}
          {playing && lineIndex < TERMINAL_LINES[activeTab].length && (
            <span style={{ color: colors.accent[400], animation: animations.pulse(1) }}>█</span>
          )}
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .sandbox-terminal { display: none !important; }
        }
      `}</style>
    </div>
  );
}
