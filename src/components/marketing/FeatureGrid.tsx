'use client';

import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Video, FileText, MessageSquare, LayoutTemplate, ArrowRight, Mic, Zap, CheckSquare } from 'lucide-react';
import { colors, typography, semantic, borderRadius, gradients } from '@/styles/theme';
import { container } from '@/styles/mixins';

const FEATURES = [
  {
    id: 'transcription',
    icon: <Mic size={28} />,
    eyebrow: 'LIVE TRANSCRIPTION',
    title: 'Bot-Free Meeting Transcription',
    description:
      'Record and transcribe your meetings in real-time — right in the browser, with zero bots joining your call. Supports speaker identification, so every voice is attributed automatically.',
    color: colors.accent[400],
    glow: 'rgba(6,182,212,0.2)',
    gradient: `linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(99,102,241,0.05) 100%)`,
    features: [
      { icon: <Mic size={14} />, text: 'Native browser recording — no install needed' },
      { icon: <Zap size={14} />, text: 'Real-time transcript as you speak' },
      { icon: <CheckSquare size={14} />, text: 'Speaker identification & labelling' },
      { icon: <Video size={14} />, text: 'Works with any video call platform' },
    ],
  },
  {
    id: 'documents',
    icon: <FileText size={28} />,
    eyebrow: 'AI DOCUMENT GENERATION',
    title: 'Turn Transcripts Into Structured Docs',
    description:
      'One click turns your meeting transcript into a polished, structured document. Generate MOMs, BRDs, User Stories, PRDs, Sprint Plans, and more — all tailored to your team\'s format.',
    color: colors.brand[400],
    glow: 'rgba(99,102,241,0.2)',
    gradient: `linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(6,182,212,0.05) 100%)`,
    features: [
      { icon: <FileText size={14} />, text: 'MOM, BRD, PRD, User Stories & more' },
      { icon: <Zap size={14} />, text: 'Generated in seconds from any transcript' },
      { icon: <CheckSquare size={14} />, text: 'Customizable tone — professional to executive' },
      { icon: <MessageSquare size={14} />, text: 'Export as markdown or plain text' },
    ],
  },
  {
    id: 'templates',
    icon: <LayoutTemplate size={28} />,
    eyebrow: 'TEMPLATE STUDIO',
    title: 'Custom Document Templates',
    description:
      'Build and save reusable document templates that match your team\'s standards. Define exactly what sections, headings, and fields your documents should contain.',
    color: colors.success[400],
    glow: 'rgba(74,222,128,0.2)',
    gradient: `linear-gradient(135deg, rgba(74,222,128,0.1) 0%, rgba(6,182,212,0.05) 100%)`,
    features: [
      { icon: <LayoutTemplate size={14} />, text: 'Create and save custom templates' },
      { icon: <CheckSquare size={14} />, text: 'Apply templates to any meeting transcript' },
      { icon: <Zap size={14} />, text: 'Pre-built templates for common use cases' },
      { icon: <FileText size={14} />, text: 'Shared across your whole team' },
    ],
  },
  {
    id: 'prompts',
    icon: <MessageSquare size={28} />,
    eyebrow: 'PROMPT STUDIO',
    title: 'Fine-Tune Your AI Behaviour',
    description:
      'Control exactly how Sunave\'s AI writes your documents. View and customise the AI prompts behind each document type to match your organisation\'s voice and requirements.',
    color: colors.warning[400],
    glow: 'rgba(251,191,36,0.2)',
    gradient: `linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(99,102,241,0.05) 100%)`,
    features: [
      { icon: <MessageSquare size={14} />, text: 'View all AI prompts used for generation' },
      { icon: <CheckSquare size={14} />, text: 'Customise tone and output style per doc type' },
      { icon: <Zap size={14} />, text: 'Instant preview of prompt changes' },
      { icon: <LayoutTemplate size={14} />, text: 'Combine with templates for full control' },
    ],
  },
];

function FeatureCard({ feature, active, index }: { feature: typeof FEATURES[number]; active: boolean; index: number }) {
  const [hovered, setHovered] = useState(false);

  const cardStyle: CSSProperties = {
    borderRadius: borderRadius['2xl'],
    background: hovered ? feature.gradient : 'rgba(255,255,255,0.025)',
    border: `1px solid ${hovered ? `${feature.color}35` : 'rgba(255,255,255,0.07)'}`,
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    opacity: active ? 1 : 0,
    transform: active ? 'none' : 'translateY(30px)',
    transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${index * 0.12}s, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${index * 0.12}s, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease`,
    boxShadow: hovered ? `0 28px 56px -14px rgba(0,0,0,0.4), 0 0 40px ${feature.glow}` : 'none',
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
    background: `${feature.color}15`,
    border: `1px solid ${feature.color}25`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: feature.color,
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
      {hovered && (
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${feature.glow} 0%, transparent 70%)`, pointerEvents: 'none' }} />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
        <div style={iconWrapStyle}>{feature.icon}</div>
        <div>
          <div style={{ fontSize: typography.fontSize.xs, color: feature.color, fontWeight: typography.fontWeight.semibold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
            {feature.eyebrow}
          </div>
          <h3 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, lineHeight: 1.25 }}>
            {feature.title}
          </h3>
        </div>
      </div>

      <p style={{ fontSize: typography.fontSize.base, color: semantic.text.secondary, lineHeight: 1.7 }}>
        {feature.description}
      </p>

      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {feature.features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: typography.fontSize.sm, color: semantic.text.tertiary }}>
            <span style={{ color: feature.color, flexShrink: 0 }}>{f.icon}</span>
            {f.text}
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: feature.color, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, marginTop: 'auto' }}>
        Learn more
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
    <section style={sectionStyle} id="features" ref={sectionRef}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(6,182,212,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.04) 0%, transparent 50%)', pointerEvents: 'none' }} />

      <div style={container}>
        <div style={headerStyle}>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.accent[400], fontWeight: typography.fontWeight.semibold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            PRODUCT FEATURES
          </div>
          <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.75rem)', fontWeight: typography.fontWeight.bold, color: semantic.text.primary, letterSpacing: typography.letterSpacing.tight, marginBottom: '1rem' }}>
            Everything you need for <span style={gradientTextStyle}>meeting intelligence</span>
          </h2>
          <p style={{ fontSize: typography.fontSize.lg, color: semantic.text.muted, maxWidth: '600px', margin: '0 auto', lineHeight: 1.65 }}>
            From live transcription to polished documents — Sunave handles the full workflow so your team can focus on what matters.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
          {FEATURES.map((feat, idx) => (
            <FeatureCard key={feat.id} feature={feat} active={active} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

