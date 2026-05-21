'use client';

import React, { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react';
import { Play, Pause, Video, FileText, TerminalSquare } from 'lucide-react';
import { colors, typography, semantic, borderRadius } from '@/styles/theme';
import animations from '@/styles/animations';

const TABS = [
  { id: 'transcript', label: 'Live Transcription' },
  { id: 'document', label: 'AI Document Generation' },
] as const;

type TabId = typeof TABS[number]['id'];

const TRANSCRIPT_LINES = [
  { speaker: 'Sarah (PM)', text: 'Let\'s start by reviewing the Q3 requirements for the checkout flow.' },
  { speaker: 'Raj (Dev)', text: 'Sure. The main ask is reducing drop-off during payment — specifically on mobile.' },
  { speaker: 'Sarah (PM)', text: 'Right. Customers need a one-tap payment option. That\'s the top priority.' },
  { speaker: 'Priya (Design)', text: 'I can prototype the new payment sheet by Thursday. We should also handle error states.' },
  { speaker: 'Raj (Dev)', text: 'Agreed. I estimate 3 sprints for the backend changes and 1 sprint for the UI.' },
  { speaker: 'Sarah (PM)', text: 'Perfect. Let\'s set the acceptance criteria: 95% success rate and under 2s load time.' },
  { speaker: 'Raj (Dev)', text: 'We\'ll also need a fallback for when the payment gateway is down.' },
  { speaker: 'Sarah (PM)', text: 'Noted. Priya, can you add edge cases to the design spec?' },
  { speaker: 'Priya (Design)', text: 'Will do. I\'ll share the Figma link in Slack before EOD.' },
];

const DOCUMENT_LINES = [
  '# Meeting Notes — Checkout Flow Sprint Planning',
  '',
  '**Date:** Today  **Attendees:** Sarah (PM), Raj (Dev), Priya (Design)',
  '',
  '## Summary',
  'Sprint planning for the Q3 checkout flow redesign, focused on',
  'reducing mobile payment drop-off.',
  '',
  '## Decisions',
  '• Implement one-tap payment as top priority feature',
  '• Target: 95% success rate, < 2s load time',
  '• Fallback flow required for gateway downtime',
  '',
  '## Action Items',
  '• [ ] Priya: Prototype payment sheet (by Thursday)',
  '• [ ] Priya: Add edge cases to design spec (EOD today)',
  '• [ ] Raj: Backend changes — 3 sprints',
  '• [ ] Raj: UI integration — 1 sprint',
  '',
  '## Acceptance Criteria',
  '• Payment success rate ≥ 95%',
  '• Page load time < 2 seconds on mobile',
  '• Graceful fallback on gateway failure',
];

const TRANSCRIPT_INTERVAL_MS = 900;
const DOCUMENT_INTERVAL_MS = 350;
  const [activeTab, setActiveTab] = useState<TabId>('transcript');
  const [playing, setPlaying] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopStreaming = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startStreaming = useCallback((tab: TabId) => {
    const sourceLines =
      tab === 'transcript'
        ? TRANSCRIPT_LINES.map((l) => `${l.speaker}: ${l.text}`)
        : DOCUMENT_LINES;
    let idx = 0;
    setLines([]);
    setLineIndex(0);
    intervalRef.current = setInterval(() => {
      if (idx < sourceLines.length) {
        setLines((prev) => [...prev, sourceLines[idx]]);
        setLineIndex(idx + 1);
        idx++;
      } else {
        stopStreaming();
      }
    }, tab === 'transcript' ? TRANSCRIPT_INTERVAL_MS : DOCUMENT_INTERVAL_MS);
  }, [stopStreaming]);

  useEffect(() => {
    if (playing) {
      startStreaming(activeTab);
    } else {
      stopStreaming();
    }
    return stopStreaming;
  }, [playing, activeTab, startStreaming, stopStreaming]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleTabChange = (id: TabId) => {
    setActiveTab(id);
    setPlaying(false);
    setLines([]);
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

  const controlsAreaStyle: CSSProperties = {
    flex: '0 0 200px',
    padding: '1.5rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    borderRight: '1px solid rgba(255,255,255,0.06)',
  };

  const contentAreaStyle: CSSProperties = {
    flex: 1,
    padding: '1rem 1.25rem',
    fontFamily: activeTab === 'document' ? typography.fontFamily.mono : typography.fontFamily.sans,
    fontSize: activeTab === 'document' ? '0.72rem' : typography.fontSize.sm,
    color: activeTab === 'document' ? colors.accent[300] : semantic.text.secondary,
    overflowY: 'auto',
    maxHeight: 300,
    lineHeight: 1.6,
  };

  return (
    <div style={containerStyle}>
      {/* Window chrome */}
      <div style={headerStyle}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
        <div style={{ flex: 1 }} />
        <Video size={13} color={colors.accent[400]} />
        <span style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, fontFamily: typography.fontFamily.mono }}>
          sunave · meeting-intelligence
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
        {/* Controls */}
        <div style={controlsAreaStyle}>
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
            aria-label={playing ? 'Pause demo' : 'Play demo'}
          >
            {playing ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}
          </button>

          <div>
            <div style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, marginBottom: '0.5rem' }}>
              {playing ? (
                activeTab === 'transcript' ? 'Transcribing meeting...' : 'Generating document...'
              ) : 'Press play to demo'}
            </div>
            {activeTab === 'transcript' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {[
                  { label: 'Speakers', value: '3' },
                  { label: 'Lines', value: `${lineIndex} / ${TRANSCRIPT_LINES.length}` },
                ].map((stat) => (
                  <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: semantic.text.muted, fontFamily: typography.fontFamily.mono }}>
                    <span>{stat.label}</span>
                    <span style={{ color: colors.accent[400] }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'document' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {[
                  { label: 'Type', value: 'MOM' },
                  { label: 'Lines', value: `${lineIndex} / ${DOCUMENT_LINES.length}` },
                ].map((stat) => (
                  <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: semantic.text.muted, fontFamily: typography.fontFamily.mono }}>
                    <span>{stat.label}</span>
                    <span style={{ color: colors.brand[400] }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginTop: 'auto' }}>
            {(['MOM', 'BRD', 'User Stories', 'PRD'] as const).map((type) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.68rem', color: semantic.text.muted }}>
                <FileText size={10} color={colors.brand[400]} />
                {type}
              </div>
            ))}
          </div>
        </div>

        {/* Content stream */}
        <div style={contentAreaStyle} ref={scrollRef} className="demo-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <TerminalSquare size={12} color={colors.accent[400]} />
            <span style={{ fontSize: '0.65rem', color: semantic.text.muted, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: typography.fontFamily.mono }}>
              {activeTab === 'transcript' ? 'Live Transcript' : 'Generated Document'}
            </span>
          </div>

          {lines.length === 0 ? (
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontFamily: typography.fontFamily.mono }}>
              {'> Press play to start the demo...'}
            </span>
          ) : (
            lines.map((line, i) => (
              <div
                key={i}
                style={{
                  marginBottom: activeTab === 'transcript' ? '0.75rem' : '0.2rem',
                  animation: i === lines.length - 1 ? 'fadeIn 0.3s ease both' : 'none',
                  color:
                    activeTab === 'transcript'
                      ? i === lines.length - 1 ? semantic.text.primary : semantic.text.secondary
                      : i === lines.length - 1 ? colors.accent[300] : 'rgba(34,211,238,0.6)',
                  wordBreak: 'break-word',
                }}
              >
                {activeTab === 'transcript' ? (
                  <>
                    <span style={{ color: colors.accent[400], fontWeight: 600, fontSize: '0.72rem' }}>
                      {line.split(': ')[0]}:{' '}
                    </span>
                    {line.split(': ').slice(1).join(': ')}
                  </>
                ) : (
                  line
                )}
              </div>
            ))
          )}
          {playing && (
            <span style={{ color: colors.accent[400], animation: animations.pulse(1), fontFamily: typography.fontFamily.mono }}>█</span>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .demo-content { font-size: 0.7rem !important; }
        }
      `}</style>
    </div>
  );
}
