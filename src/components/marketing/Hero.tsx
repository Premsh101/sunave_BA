'use client';

import React, { useEffect, useRef, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { typography, semantic, spacing, colors, borderRadius } from '@/styles/theme';
import { container, flexColumn } from '@/styles/mixins';
import animations from '@/styles/animations';

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
    maxWidth: '900px',
    animation: animations.fadeInUp(0.1),
  };

  const gradientTextStyle: CSSProperties = {
    background: 'var(--gradient-hero-text)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const subtitleStyle: CSSProperties = {
    fontSize: typography.fontSize.xl,
    color: semantic.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
    maxWidth: '680px',
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

  const mockupContainerStyle: CSSProperties = {
    marginTop: '5rem',
    width: '100%',
    maxWidth: '1080px',
    borderRadius: borderRadius['2xl'],
    border: `1px solid ${semantic.border.subtle}`,
    background: 'var(--bg-hero-mockup)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 32px 64px -16px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.08)',
    overflow: 'hidden',
    position: 'relative',
    animation: animations.fadeInUp(0.5),
  };

  const mockupHeaderStyle: CSSProperties = {
    padding: '1rem 1.5rem',
    borderBottom: `1px solid ${semantic.border.subtle}`,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: semantic.bg.secondary,
  };

  const dotStyle = (color: string): CSSProperties => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: color,
  });

  const skeletonStyle = (w: string, h = '12px'): CSSProperties => ({
    width: w,
    height: h,
    background: semantic.bg.surface,
    borderRadius: '6px',
  });

  return (
    <section style={heroStyle} ref={heroRef}>
      {/* Ambient orbs */}
      <div className="hero-orb-1" style={{ position: 'absolute', top: '-10%', left: '10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 65%)', zIndex: 0, pointerEvents: 'none', transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)', borderRadius: '50%' }} />
      <div className="hero-orb-2" style={{ position: 'absolute', bottom: '5%', right: '5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 65%)', zIndex: 0, pointerEvents: 'none', transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)', borderRadius: '50%' }} />
      <div className="hero-orb-3" style={{ position: 'absolute', top: '30%', right: '15%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none', transition: 'transform 1s cubic-bezier(0.25,0.46,0.45,0.94)', borderRadius: '50%' }} />

      <div style={{ ...container, ...flexColumn, alignItems: 'center', position: 'relative', zIndex: 1 }}>

        <div style={{ animation: animations.fadeInUp(0), marginBottom: spacing[6] }}>
          <Badge variant="brand" icon={<Sparkles size={12} />}>
            Sunave 2.0 is now live
          </Badge>
        </div>

        <h1 style={titleStyle}>
          Turn Meetings Into <br />
          <span style={gradientTextStyle}>Execution</span>
        </h1>

        <p style={subtitleStyle}>
          The enterprise-grade AI meeting intelligence and dynamic documentation operating system.
          Support for bot-free and bot-assisted workflows.
        </p>

        <div style={buttonGroupStyle}>
          <Link href="/signup">
            <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
              Start Free Trial
            </Button>
          </Link>
          <Button variant="secondary" size="lg" icon={<Play size={18} />}>
            Watch Demo
          </Button>
        </div>

        {/* Trusted by */}
        <div style={{ marginTop: '3rem', animation: animations.fadeInUp(0.45) }}>
          <p style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Trusted by forward-thinking teams
          </p>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Accenture', 'Deloitte', 'KPMG', 'PwC', 'McKinsey'].map((name) => (
              <span key={name} style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: semantic.text.muted, letterSpacing: '0.04em', opacity: 0.6 }}>
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Abstract UI Mockup */}
        <div style={mockupContainerStyle}>
          <div style={mockupHeaderStyle}>
            <div style={dotStyle('#EF4444')} />
            <div style={dotStyle('#F59E0B')} />
            <div style={dotStyle('#10B981')} />
            <div style={{ flex: 1 }} />
            <div style={{ width: 120, height: 8, background: semantic.bg.surface, borderRadius: 4 }} />
          </div>

          <div style={{ padding: '2rem', height: '420px', display: 'flex', gap: '1.5rem' }}>
            {/* Left panel — transcript */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.success[500], animation: 'pulse 2s ease-in-out infinite' }} />
                <div style={skeletonStyle('80px', '8px')} />
              </div>
              {[100, 80, 95, 65, 85, 70, 90, 50].map((w, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: i % 2 === 0 ? colors.brand[500] : colors.accent[500], flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={skeletonStyle(`${w}%`, '10px')} />
                    {i % 3 === 0 && <div style={skeletonStyle(`${w - 20}%`, '10px')} />}
                  </div>
                </div>
              ))}
            </div>

            {/* Right panel — AI summary */}
            <div style={{ width: '320px', background: semantic.bg.secondary, borderRadius: borderRadius.xl, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 20, height: 20, borderRadius: borderRadius.base, background: 'linear-gradient(135deg, #6366F1, #22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={10} color="#fff" />
                </div>
                <div style={skeletonStyle('100px', '8px')} />
              </div>
              <div style={{ background: semantic.bg.brandSubtle, borderRadius: borderRadius.lg, padding: '0.75rem', border: `1px solid ${semantic.border.brandSubtle}` }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={skeletonStyle('90%', '8px')} />
                  <div style={skeletonStyle('75%', '8px')} />
                  <div style={skeletonStyle('60%', '8px')} />
                </div>
              </div>
              {['Action Items', 'Key Decisions', 'Next Steps'].map((label) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ fontSize: typography.fontSize.xs, color: semantic.text.brand, fontWeight: 600 }}>{label}</div>
                  <div style={skeletonStyle('90%', '8px')} />
                  <div style={skeletonStyle('70%', '8px')} />
                </div>
              ))}
            </div>
          </div>
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
