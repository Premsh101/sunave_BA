'use client';

import React, { useEffect, useRef, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Mic, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { typography, semantic, spacing, colors, borderRadius, gradients } from '@/styles/theme';
import { container, flexColumn } from '@/styles/mixins';
import animations from '@/styles/animations';
import AudioSandbox from '@/components/marketing/AudioSandbox';

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
          <Badge variant="brand" icon={<Mic size={12} />}>
            Production-ready enterprise voicebots
          </Badge>
        </div>

        <h1 style={titleStyle}>
          Enterprise Voice Automation<br />
          at <span style={gradientTextStyle}>Sub-500ms Latency.</span>
        </h1>

        <p style={subtitleStyle}>
          Deploy reliable, production-ready voicebots for instant candidate recruitment onboarding
          and high-scale small business verification.
        </p>

        <div style={buttonGroupStyle}>
          <Link href="/signup">
            <Button
              variant="primary"
              size="lg"
              iconRight={<ArrowRight size={18} />}
              style={{ boxShadow: '0 0 32px rgba(6,182,212,0.35), 0 0 64px rgba(99,102,241,0.2)' }}
            >
              Build an Agent
            </Button>
          </Link>
          <Button variant="secondary" size="lg" icon={<Play size={18} />}>
            Watch System Architecture
          </Button>
        </div>

        {/* Live status indicator */}
        <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.625rem', animation: animations.fadeInUp(0.45) }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors.success[400], display: 'inline-block', animation: animations.pulse(2) }} />
          <span style={{ fontSize: typography.fontSize.sm, color: semantic.text.muted, letterSpacing: '0.03em' }}>
            All systems operational · avg latency <span style={{ color: colors.accent[400], fontWeight: 600 }}>312ms</span>
          </span>
        </div>

        {/* Audio Sandbox */}
        <div style={{ marginTop: '5rem', width: '100%', maxWidth: '1080px', animation: animations.fadeInUp(0.55) }}>
          <AudioSandbox />
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
