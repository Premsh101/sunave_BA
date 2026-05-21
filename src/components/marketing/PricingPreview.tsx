'use client';

import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Check } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { colors, typography, semantic, gradients } from '@/styles/theme';
import { container, grid } from '@/styles/mixins';

export default function PricingPreview() {
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
    padding: '8rem 0',
    background: semantic.bg.secondary,
  };

  const headerStyle: CSSProperties = {
    textAlign: 'center',
    marginBottom: '4rem',
    opacity: active ? 1 : 0,
    transform: active ? 'none' : 'translateY(20px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
  };

  const titleStyle: CSSProperties = {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: semantic.text.primary,
    marginBottom: '1rem',
  };

  const gradientTextStyle: CSSProperties = {
    background: gradients.text,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const listStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '2rem',
    marginBottom: '2rem',
  };

  const itemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: semantic.text.secondary,
    fontSize: typography.fontSize.sm,
  };

  const cardReveal = (i: number): CSSProperties => ({
    opacity: active ? 1 : 0,
    transform: active ? 'none' : 'translateY(30px)',
    transition: `opacity 0.6s cubic-bezier(0.4,0,0.2,1) ${i * 0.15}s, transform 0.6s cubic-bezier(0.4,0,0.2,1) ${i * 0.15}s`,
  });

  return (
    <section style={sectionStyle} id="pricing" ref={sectionRef}>
      <div style={container}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Simple, <span style={gradientTextStyle}>transparent</span> pricing</h2>
          <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.lg }}>
            Start for free, upgrade when you need enterprise power.
          </p>
        </div>

        <div style={{ ...grid(3, '2rem'), alignItems: 'stretch' }}>
          {/* Free Plan */}
          <div style={cardReveal(0)}>
            <Card variant="elevated" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: 600, color: semantic.text.primary }}>Free</h3>
              <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: typography.fontSize['4xl'], fontWeight: 700, color: semantic.text.primary }}>₹0</span>
                <span style={{ color: semantic.text.muted }}>/mo</span>
              </div>
              <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm }}>
                Perfect for trying out Sunave&apos;s core transcription.
              </p>
              <ul style={listStyle}>
                <li style={itemStyle}><Check size={18} color={colors.success[500]} /> 5 meetings/month</li>
                <li style={itemStyle}><Check size={18} color={colors.success[500]} /> Basic transcription</li>
                <li style={itemStyle}><Check size={18} color={colors.success[500]} /> Bot-Free mode only</li>
                <li style={itemStyle}><Check size={18} color={colors.success[500]} /> Markdown exports</li>
              </ul>
              <div style={{ marginTop: 'auto' }}>
                <Button variant="secondary" fullWidth>Get Started</Button>
              </div>
            </Card>
          </div>

          {/* Pro Plan */}
          <div style={{ ...cardReveal(1), position: 'relative' }}>
            <div style={{
              position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
              background: gradients.brand, color: '#fff', padding: '4px 16px',
              borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em',
              zIndex: 1, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
            }}>
              MOST POPULAR
            </div>
            <Card variant="elevated" style={{
              height: '100%', display: 'flex', flexDirection: 'column',
              border: `2px solid ${colors.brand[500]}`,
              boxShadow: '0 0 0 4px rgba(99,102,241,0.12), 0 20px 40px -12px rgba(0,0,0,0.3)',
              transform: 'scale(1.03)',
            }}>
              <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: 600, color: semantic.text.primary }}>Pro</h3>
              <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: typography.fontSize['4xl'], fontWeight: 700, background: gradients.text, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>₹1,499</span>
                <span style={{ color: semantic.text.muted }}>/mo</span>
              </div>
              <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm }}>
                Everything you need for AI-powered meeting workflows.
              </p>
              <ul style={listStyle}>
                <li style={itemStyle}><Check size={18} color={colors.brand[400]} /> Unlimited transcription</li>
                <li style={itemStyle}><Check size={18} color={colors.brand[400]} /> Unlimited AI documents</li>
                <li style={itemStyle}><Check size={18} color={colors.brand[400]} /> Bot-Free + Bot Assistant</li>
                <li style={itemStyle}><Check size={18} color={colors.brand[400]} /> Custom templates & prompts</li>
                <li style={itemStyle}><Check size={18} color={colors.brand[400]} /> All export formats (PDF, Word)</li>
              </ul>
              <div style={{ marginTop: 'auto' }}>
                <Button variant="primary" fullWidth>Start Pro Trial</Button>
              </div>
            </Card>
          </div>

          {/* Enterprise Plan */}
          <div style={cardReveal(2)}>
            <Card variant="elevated" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: 600, color: semantic.text.primary }}>Enterprise</h3>
              <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: typography.fontSize['3xl'], fontWeight: 700, color: semantic.text.primary }}>Custom</span>
              </div>
              <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm }}>
                For large organizations requiring security and scale.
              </p>
              <ul style={listStyle}>
                <li style={itemStyle}><Check size={18} color={colors.success[500]} /> Everything in Pro</li>
                <li style={itemStyle}><Check size={18} color={colors.success[500]} /> Single Sign-On (SSO)</li>
                <li style={itemStyle}><Check size={18} color={colors.success[500]} /> Custom data retention</li>
                <li style={itemStyle}><Check size={18} color={colors.success[500]} /> Organization-wide templates</li>
                <li style={itemStyle}><Check size={18} color={colors.success[500]} /> Dedicated success manager</li>
              </ul>
              <div style={{ marginTop: 'auto' }}>
                <Button variant="secondary" fullWidth>Contact Sales</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
