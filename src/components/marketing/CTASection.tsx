'use client';

import React, { type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import { typography, semantic, gradients, borderRadius } from '@/styles/theme';
import { container } from '@/styles/mixins';

export default function CTASection() {
  const sectionStyle: CSSProperties = {
    padding: '8rem 0',
    background: semantic.bg.primary,
  };

  const cardStyle: CSSProperties = {
    background: gradients.brandDark,
    borderRadius: borderRadius['2xl'],
    padding: '4rem 2rem',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    border: `1px solid ${semantic.border.brandSubtle}`,
  };

  const titleStyle: CSSProperties = {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: semantic.text.primary,
    marginBottom: '1.5rem',
  };

  const subtitleStyle: CSSProperties = {
    fontSize: typography.fontSize.lg,
    color: semantic.text.secondary,
    maxWidth: '600px',
    margin: '0 auto 2.5rem',
  };

  return (
    <section style={sectionStyle}>
      <div style={container}>
        <div style={cardStyle}>
          {/* Decorative glow */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)',
            width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          
          <h2 style={titleStyle}>Ready to upgrade your workflow?</h2>
          <p style={subtitleStyle}>
            Join innovative enterprise teams using Sunave to turn their conversations into structured, actionable documentation instantly.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/signup">
              <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', borderColor: 'rgba(255,255,255,0.1)' }}>
                Contact Sales
              </Button>
            </Link>
          </div>
          
          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: semantic.text.muted, fontSize: typography.fontSize.sm }}>
            <Zap size={14} color="#FBBF24" /> No credit card required. 14-day free trial on Pro.
          </div>
        </div>
      </div>
    </section>
  );
}
