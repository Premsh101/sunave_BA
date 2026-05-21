'use client';

import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { typography, semantic, gradients, borderRadius, colors } from '@/styles/theme';
import { container } from '@/styles/mixins';

export default function CTASection() {
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
    padding: '8rem 0',
    background: semantic.bg.primary,
  };

  const cardStyle: CSSProperties = {
    background: gradients.brandDark,
    borderRadius: borderRadius['3xl'],
    padding: '5rem 2rem',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    border: `1px solid ${semantic.border.brandSubtle}`,
    opacity: active ? 1 : 0,
    transform: active ? 'none' : 'translateY(30px)',
    transition: 'opacity 0.7s ease, transform 0.7s ease',
  };

  const titleStyle: CSSProperties = {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: typography.fontWeight.extrabold,
    color: '#fff',
    marginBottom: '1.5rem',
    lineHeight: 1.15,
  };

  const subtitleStyle: CSSProperties = {
    fontSize: typography.fontSize.lg,
    color: 'rgba(255,255,255,0.75)',
    maxWidth: '600px',
    margin: '0 auto 2.5rem',
    lineHeight: 1.65,
  };

  return (
    <section style={sectionStyle} ref={sectionRef}>
      <div style={container}>
        <div style={cardStyle}>
          {/* Decorative glows */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '20%', left: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', padding: '0.375rem 1rem', marginBottom: '2rem', fontSize: typography.fontSize.sm, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
              <Sparkles size={14} color={colors.warning[400]} />
              No credit card required
            </div>

            <h2 style={titleStyle}>Ready to upgrade<br />your workflow?</h2>
            <p style={subtitleStyle}>
              Join innovative enterprise teams using Sunave to turn their conversations into structured, actionable documentation instantly.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/signup">
                <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.15)' }}>
                  Contact Sales
                </Button>
              </Link>
            </div>

            <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              {['No credit card required', '14-day free trial', 'Cancel anytime'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.6)', fontSize: typography.fontSize.sm }}>
                  <Zap size={12} color={colors.warning[400]} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
