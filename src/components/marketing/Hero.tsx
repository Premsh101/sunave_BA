'use client';

import React, { type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { typography, semantic, spacing } from '@/styles/theme';
import { container, flexCenter, flexColumn } from '@/styles/mixins';
import animations from '@/styles/animations';

export default function Hero() {
  const heroStyle: CSSProperties = {
    position: 'relative',
    padding: '8rem 0 6rem',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  };

  const bgGlowStyle: CSSProperties = {
    position: 'absolute',
    top: '-20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    height: '600px',
    background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.15) 0%, transparent 60%)',
    zIndex: -1,
    pointerEvents: 'none',
  };

  const titleStyle: CSSProperties = {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.extrabold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tighter,
    color: semantic.text.primary,
    marginBottom: spacing[6],
    maxWidth: '900px',
    animation: animations.fadeInUp(),
  };

  const gradientTextStyle: CSSProperties = {
    background: 'linear-gradient(135deg, #A5B4FC 0%, #67E8F9 100%)',
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
    animation: animations.fadeInUp(0.1),
  };

  const buttonGroupStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
    animation: animations.fadeInUp(0.2),
  };

  const mockupContainerStyle: CSSProperties = {
    marginTop: '5rem',
    width: '100%',
    maxWidth: '1000px',
    borderRadius: '1.5rem',
    border: `1px solid ${semantic.border.subtle}`,
    background: 'rgba(24, 24, 27, 0.6)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
    overflow: 'hidden',
    position: 'relative',
    animation: animations.fadeInUp(0.4),
  };

  const mockupHeaderStyle: CSSProperties = {
    padding: '1rem 1.5rem',
    borderBottom: `1px solid ${semantic.border.subtle}`,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(0,0,0,0.2)',
  };

  const dotStyle = (color: string): CSSProperties => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: color,
  });

  return (
    <section style={heroStyle}>
      <div style={bgGlowStyle} />
      <div style={{ ...container, ...flexColumn, alignItems: 'center' }}>
        
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
          The enterprise-grade AI meeting intelligence and dynamic documentation operating system. Support for bot-free and bot-assisted workflows.
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

        {/* Abstract UI Mockup */}
        <div style={mockupContainerStyle}>
          <div style={mockupHeaderStyle}>
            <div style={dotStyle('#EF4444')} />
            <div style={dotStyle('#F59E0B')} />
            <div style={dotStyle('#10B981')} />
          </div>
          <div style={{ padding: '2rem', height: '400px', display: 'flex', gap: '2rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ width: '40%', height: '24px', background: semantic.bg.tertiary, borderRadius: '4px' }} />
              <div style={{ width: '100%', height: '12px', background: semantic.bg.tertiary, borderRadius: '4px' }} />
              <div style={{ width: '80%', height: '12px', background: semantic.bg.tertiary, borderRadius: '4px' }} />
              <div style={{ width: '90%', height: '12px', background: semantic.bg.tertiary, borderRadius: '4px' }} />
              <div style={{ width: '60%', height: '12px', background: semantic.bg.tertiary, borderRadius: '4px' }} />
            </div>
            <div style={{ width: '300px', background: semantic.bg.tertiary, borderRadius: '8px' }} />
          </div>
        </div>

      </div>
    </section>
  );
}
