'use client';

import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { FileText, Zap, Brain, Layout } from 'lucide-react';
import { typography, semantic, colors, borderRadius, gradients } from '@/styles/theme';
import { container } from '@/styles/mixins';

const METRICS = [
  {
    icon: <Zap size={28} />,
    value: 'Instant',
    label: 'Document Generation',
    description: 'AI converts your meeting transcript into a structured document in seconds',
    color: colors.accent[400],
    glow: 'rgba(6,182,212,0.25)',
    gradient: `linear-gradient(135deg, rgba(6,182,212,0.12), rgba(6,182,212,0.04))`,
  },
  {
    icon: <FileText size={28} />,
    value: '10+',
    label: 'Document Types',
    description: 'BRD, MOMs, User Stories, PRD, Sprint Plans, Risk Registers and more',
    color: colors.brand[400],
    glow: 'rgba(99,102,241,0.25)',
    gradient: `linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))`,
  },
  {
    icon: <Brain size={28} />,
    value: '98%',
    label: 'Transcription Accuracy',
    description: 'Fine-tuned speech recognition with speaker identification support',
    color: colors.success[400],
    glow: 'rgba(74,222,128,0.2)',
    gradient: `linear-gradient(135deg, rgba(74,222,128,0.1), rgba(74,222,128,0.03))`,
  },
  {
    icon: <Layout size={28} />,
    value: 'Zero',
    label: 'Bots in Your Meetings',
    description: 'Native browser transcription — no recording bot joins your call',
    color: colors.warning[400],
    glow: 'rgba(251,191,36,0.2)',
    gradient: `linear-gradient(135deg, rgba(251,191,36,0.1), rgba(251,191,36,0.03))`,
  },
];

function MetricCard({ metric, active, index }: { metric: typeof METRICS[number]; active: boolean; index: number }) {
  const [hovered, setHovered] = useState(false);

  const cardStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem 1.75rem',
    borderRadius: borderRadius['2xl'],
    background: hovered ? metric.gradient : 'rgba(255,255,255,0.03)',
    border: `1px solid ${hovered ? `${metric.color}40` : 'rgba(255,255,255,0.07)'}`,
    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
    transform: active ? (hovered ? 'translateY(-8px)' : 'none') : 'translateY(30px)',
    opacity: active ? 1 : 0,
    boxShadow: hovered ? `0 24px 48px -12px rgba(0,0,0,0.4), 0 0 0 1px ${metric.color}20, 0 0 32px ${metric.glow}` : '0 1px 3px rgba(0,0,0,0.2)',
    cursor: 'default',
    transitionDelay: `${index * 0.1}s`,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    position: 'relative',
    overflow: 'hidden',
  };

  const iconWrapStyle: CSSProperties = {
    width: 56,
    height: 56,
    borderRadius: borderRadius.xl,
    background: `${metric.color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    color: metric.color,
    border: `1px solid ${metric.color}25`,
    transition: 'transform 0.3s ease',
    transform: hovered ? 'scale(1.08) rotate(-3deg)' : 'none',
    flexShrink: 0,
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: `radial-gradient(circle, ${metric.glow} 0%, transparent 70%)`, pointerEvents: 'none' }} />
      )}
      <div style={iconWrapStyle}>{metric.icon}</div>
      <div style={{
        fontSize: 'clamp(2.25rem, 5vw, 3rem)',
        fontWeight: typography.fontWeight.extrabold,
        color: metric.color,
        lineHeight: 1,
        marginBottom: '0.5rem',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: typography.letterSpacing.tighter,
      }}>
        {metric.value}
      </div>
      <div style={{ fontSize: typography.fontSize.lg, color: semantic.text.primary, fontWeight: typography.fontWeight.semibold, marginBottom: '0.625rem' }}>
        {metric.label}
      </div>
      <div style={{ fontSize: typography.fontSize.sm, color: semantic.text.muted, lineHeight: 1.6 }}>
        {metric.description}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const sectionStyle: CSSProperties = {
    padding: '6rem 0',
    background: semantic.bg.secondary,
    borderTop: '1px solid rgba(255,255,255,0.06)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    position: 'relative',
    overflow: 'hidden',
  };

  const headingStyle: CSSProperties = {
    textAlign: 'center',
    marginBottom: '3.5rem',
    opacity: active ? 1 : 0,
    transform: active ? 'none' : 'translateY(20px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
  };

  return (
    <section style={sectionStyle} ref={sectionRef} id="metrics">
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={container}>
        <div style={headingStyle}>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.accent[400], fontWeight: typography.fontWeight.semibold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            WHY SUNAVE
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: typography.fontWeight.bold, color: semantic.text.primary, letterSpacing: typography.letterSpacing.tight }}>
            Built for teams that move fast
          </h2>
        </div>

        <div style={gridStyle}>
          {METRICS.map((metric, i) => (
            <MetricCard key={i} metric={metric} active={active} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

