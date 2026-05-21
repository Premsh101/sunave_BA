'use client';

import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Users, CheckSquare, ArrowRight, Clock, Database, Shield, PhoneCall, FileCheck } from 'lucide-react';
import { colors, typography, semantic, borderRadius, gradients } from '@/styles/theme';
import { container } from '@/styles/mixins';

const USE_CASES = [
  {
    id: 'recruitment',
    icon: <Users size={28} />,
    eyebrow: 'TALENT ACQUISITION',
    title: 'Automated High-Volume Recruitment',
    description:
      'Pre-screen candidates at scale without overwhelming your HR team. Sunave voicebots initiate intelligent screening calls, confirm availability, assess basic qualifications, and sync structured data directly to your ATS — all in under a minute per candidate.',
    color: colors.accent[400],
    glow: 'rgba(6,182,212,0.2)',
    gradient: `linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(99,102,241,0.05) 100%)`,
    features: [
      { icon: <Clock size={14} />, text: 'Instant candidate screening calls' },
      { icon: <Database size={14} />, text: 'Auto-sync to ATS on call end' },
      { icon: <CheckSquare size={14} />, text: 'Structured availability & skills capture' },
      { icon: <PhoneCall size={14} />, text: 'Handles 1,000+ concurrent calls' },
    ],
  },
  {
    id: 'verification',
    icon: <FileCheck size={28} />,
    eyebrow: 'MERCHANT ONBOARDING',
    title: 'Merchant & Small Business Verification',
    description:
      'Streamline merchant onboarding with rapid automated verification calls. Sunave validates business identity, confirms GSTIN and bank details, runs fraud detection, and activates profiles — reducing manual review time from days to minutes.',
    color: colors.brand[400],
    glow: 'rgba(99,102,241,0.2)',
    gradient: `linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(6,182,212,0.05) 100%)`,
    features: [
      { icon: <Shield size={14} />, text: 'Real-time fraud detection scoring' },
      { icon: <CheckSquare size={14} />, text: 'GSTIN & bank account validation' },
      { icon: <Clock size={14} />, text: 'End-to-end verification in < 60s' },
      { icon: <Database size={14} />, text: 'Instant profile activation on pass' },
    ],
  },
];

function UseCaseCard({ useCase, active, index }: { useCase: typeof USE_CASES[number]; active: boolean; index: number }) {
  const [hovered, setHovered] = useState(false);

  const cardStyle: CSSProperties = {
    borderRadius: borderRadius['2xl'],
    background: hovered ? useCase.gradient : 'rgba(255,255,255,0.025)',
    border: `1px solid ${hovered ? `${useCase.color}35` : 'rgba(255,255,255,0.07)'}`,
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    opacity: active ? 1 : 0,
    transform: active ? 'none' : 'translateY(30px)',
    transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${index * 0.15}s, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${index * 0.15}s, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease`,
    boxShadow: hovered ? `0 28px 56px -14px rgba(0,0,0,0.4), 0 0 40px ${useCase.glow}` : 'none',
    cursor: 'default',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    position: 'relative',
    overflow: 'hidden',
  };

  const iconWrapStyle: CSSProperties = {
    width: 60,
    height: 60,
    borderRadius: borderRadius.xl,
    background: `${useCase.color}15`,
    border: `1px solid ${useCase.color}25`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: useCase.color,
    transition: 'transform 0.3s ease',
    transform: hovered ? 'scale(1.08) rotate(-4deg)' : 'none',
    flexShrink: 0,
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Corner shine */}
      {hovered && (
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${useCase.glow} 0%, transparent 70%)`, pointerEvents: 'none' }} />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
        <div style={iconWrapStyle}>{useCase.icon}</div>
        <div>
          <div style={{ fontSize: typography.fontSize.xs, color: useCase.color, fontWeight: typography.fontWeight.semibold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
            {useCase.eyebrow}
          </div>
          <h3 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, lineHeight: 1.25 }}>
            {useCase.title}
          </h3>
        </div>
      </div>

      <p style={{ fontSize: typography.fontSize.base, color: semantic.text.secondary, lineHeight: 1.7 }}>
        {useCase.description}
      </p>

      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {useCase.features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: typography.fontSize.sm, color: semantic.text.tertiary }}>
            <span style={{ color: useCase.color, flexShrink: 0 }}>{f.icon}</span>
            {f.text}
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: useCase.color, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, marginTop: 'auto' }}>
        Explore use case
        <ArrowRight size={14} style={{ transition: 'transform 0.2s ease', transform: hovered ? 'translateX(4px)' : 'none' }} />
      </div>
    </div>
  );
}

export default function FeatureGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const sectionStyle: CSSProperties = {
    padding: '7rem 0',
    background: semantic.bg.primary,
    position: 'relative',
    overflow: 'hidden',
  };

  const headerStyle: CSSProperties = {
    textAlign: 'center',
    marginBottom: '4rem',
    opacity: active ? 1 : 0,
    transform: active ? 'none' : 'translateY(20px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
  };

  const gradientTextStyle: CSSProperties = {
    background: `linear-gradient(135deg, ${colors.accent[300]} 0%, ${colors.brand[400]} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  return (
    <section style={sectionStyle} id="solutions" ref={sectionRef}>
      {/* Background mesh */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(6,182,212,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.04) 0%, transparent 50%)', pointerEvents: 'none' }} />

      <div style={container}>
        <div style={headerStyle}>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.accent[400], fontWeight: typography.fontWeight.semibold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            CORE USE CASES
          </div>
          <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.75rem)', fontWeight: typography.fontWeight.bold, color: semantic.text.primary, letterSpacing: typography.letterSpacing.tight, marginBottom: '1rem' }}>
            Voice automation for <span style={gradientTextStyle}>high-stakes workflows</span>
          </h2>
          <p style={{ fontSize: typography.fontSize.lg, color: semantic.text.muted, maxWidth: '600px', margin: '0 auto', lineHeight: 1.65 }}>
            Production-grade voicebots that handle mission-critical recruitment and verification pipelines without human intervention.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {USE_CASES.map((uc, idx) => (
            <UseCaseCard key={uc.id} useCase={uc} active={active} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

