'use client';

import React, { useEffect, useRef, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, Video, ChevronDown, FileText, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { typography, semantic, spacing, colors, borderRadius, gradients } from '@/styles/theme';
import { container, flexColumn } from '@/styles/mixins';
import animations from '@/styles/animations';
import MeetingDemoWidget from '@/components/marketing/MeetingDemoWidget';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  // Parallax orbs on mouse move
  useEffect(() => {
    const section = heroRef.current;
    if (!section) return;
    const handleMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = section.getBoundingClientRect();
      const x = ((clientX - left) / width - 0.5) * 30;
      const y = ((clientY - top) / height - 0.5) * 20;
      const orb1 = section.querySelector<HTMLElement>('.hero-orb-1');
      const orb2 = section.querySelector<HTMLElement>('.hero-orb-2');
      const orb3 = section.querySelector<HTMLElement>('.hero-orb-3');
      if (orb1) orb1.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
      if (orb2) orb2.style.transform = `translate(${-x * 0.4}px, ${-y * 0.4}px)`;
      if (orb3) orb3.style.transform = `translate(${x * 0.8}px, ${y * 0.3}px)`;
    };
    section.addEventListener('mousemove', handleMove);
    return () => section.removeEventListener('mousemove', handleMove);
  }, []);

  const heroStyle: CSSProperties = {
    position: 'relative',
    padding: '9rem 0 7rem',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    background: semantic.bg.primary,
  };

  const titleStyle: CSSProperties = {
    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
    fontWeight: typography.fontWeight.extrabold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tighter,
    color: semantic.text.primary,
    marginBottom: spacing[6],
    maxWidth: '960px',
    animation: animations.fadeInUp(0.1),
  };

  const gradientTextStyle: CSSProperties = {
    background: `linear-gradient(135deg, ${colors.accent[300]} 0%, ${colors.accent[400]} 50%, ${colors.brand[400]} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const subtitleStyle: CSSProperties = {
    fontSize: typography.fontSize.xl,
    color: semantic.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
    maxWidth: '700px',
    marginBottom: spacing[10],
    animation: animations.fadeInUp(0.2),
  };

  const buttonGroupStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
    flexWrap: 'wrap',
    justifyContent: 'center',
    animation: animations.fadeInUp(0.3),
  };

  return (
    <section style={heroStyle} ref={heroRef}>
      {/* Ambient orbs */}
      <div className="hero-orb-1" style={{ position: 'absolute', top: '-10%', left: '10%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 65%)', zIndex: 0, pointerEvents: 'none', transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)', borderRadius: '50%' }} />
      <div className="hero-orb-2" style={{ position: 'absolute', bottom: '5%', right: '5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%)', zIndex: 0, pointerEvents: 'none', transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)', borderRadius: '50%' }} />
      <div className="hero-orb-3" style={{ position: 'absolute', top: '30%', right: '15%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none', transition: 'transform 1s cubic-bezier(0.25,0.46,0.45,0.94)', borderRadius: '50%' }} />

      {/* Geometric grid lines */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)', backgroundSize: '64px 64px', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ ...container, ...flexColumn, alignItems: 'center', position: 'relative', zIndex: 1 }}>

        <div style={{ animation: animations.fadeInUp(0), marginBottom: spacing[6] }}>
          <Badge variant="brand" icon={<Sparkles size={12} />}>
            AI-powered meeting intelligence
          </Badge>
        </div>

        <h1 style={titleStyle}>
          Turn Every Meeting Into<br />
          <span style={gradientTextStyle}>Actionable Documents.</span>
        </h1>

        <p style={subtitleStyle}>
          Transcribe meetings live — no bots, no interruptions. Then instantly generate
          BRDs, MOMs, User Stories, PRDs and more with AI, straight from your transcript.
        </p>

        <div style={buttonGroupStyle}>
          <Link href="/signup">
            <Button
              variant="primary"
              size="lg"
              iconRight={<ArrowRight size={18} />}
              style={{ boxShadow: '0 0 32px rgba(6,182,212,0.35), 0 0 64px rgba(99,102,241,0.2)' }}
            >
              Start for Free
            </Button>
          </Link>
          <Link href="/features">
            <Button variant="secondary" size="lg" icon={<Video size={18} />}>
              See How It Works
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', animation: animations.fadeInUp(0.45) }}>
          {[
            { icon: <Video size={13} />, text: 'Bot-free transcription' },
            { icon: <FileText size={13} />, text: 'Instant AI documents' },
            { icon: <Sparkles size={13} />, text: 'No credit card required' },
          ].map((item) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: typography.fontSize.sm, color: semantic.text.muted }}>
              <span style={{ color: colors.accent[400] }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>

        {/* Meeting Demo Widget */}
        <div style={{ marginTop: '5rem', width: '100%', maxWidth: '1080px', animation: animations.fadeInUp(0.55) }}>
          <MeetingDemoWidget />
        </div>

        {/* Scroll hint */}
        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', animation: animations.fadeIn(0.8), opacity: 0.5 }}>
          <span style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, letterSpacing: '0.06em' }}>SCROLL TO EXPLORE</span>
          <ChevronDown size={16} color={semantic.text.muted} style={{ animation: 'bounce 1.5s ease-in-out infinite' }} />
        </div>

      </div>
    </section>
  );
}
