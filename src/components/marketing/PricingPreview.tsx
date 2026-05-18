'use client';

import React, { type CSSProperties } from 'react';
import { Check } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { colors, typography, semantic } from '@/styles/theme';
import { container, grid } from '@/styles/mixins';

export default function PricingPreview() {
  const sectionStyle: CSSProperties = {
    padding: '8rem 0',
    background: semantic.bg.secondary,
  };

  const headerStyle: CSSProperties = {
    textAlign: 'center',
    marginBottom: '4rem',
  };

  const titleStyle: CSSProperties = {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: semantic.text.primary,
    marginBottom: '1rem',
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

  return (
    <section style={sectionStyle} id="pricing">
      <div style={container}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Simple, transparent pricing</h2>
          <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.lg }}>
            Start for free, upgrade when you need enterprise power.
          </p>
        </div>

        <div style={grid(3, '2rem')}>
          {/* Free Plan */}
          <Card variant="elevated">
            <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: 600, color: semantic.text.primary }}>Free</h3>
            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: typography.fontSize['4xl'], fontWeight: 700, color: semantic.text.primary }}>₹0</span>
              <span style={{ color: semantic.text.muted }}>/mo</span>
            </div>
            <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm }}>
              Perfect for trying out Sunave's core transcription.
            </p>
            
            <ul style={listStyle}>
              <li style={itemStyle}><Check size={18} color={colors.success[500]} /> 5 meetings/month</li>
              <li style={itemStyle}><Check size={18} color={colors.success[500]} /> Basic transcription</li>
              <li style={itemStyle}><Check size={18} color={colors.success[500]} /> Bot-Free mode only</li>
              <li style={itemStyle}><Check size={18} color={colors.success[500]} /> Markdown exports</li>
            </ul>
            
            <Button variant="secondary" fullWidth>Get Started</Button>
          </Card>

          {/* Pro Plan */}
          <Card variant="gradient" style={{ position: 'relative', transform: 'scale(1.05)', zIndex: 10 }}>
            <div style={{
              position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
              background: colors.brand[500], color: '#fff', padding: '4px 12px',
              borderRadius: '999px', fontSize: '12px', fontWeight: 600
            }}>
              MOST POPULAR
            </div>
            <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: 600, color: semantic.text.primary }}>Pro</h3>
            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: typography.fontSize['4xl'], fontWeight: 700, color: semantic.text.primary }}>₹1,499</span>
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
            
            <Button variant="primary" fullWidth>Start Pro Trial</Button>
          </Card>

          {/* Enterprise Plan */}
          <Card variant="elevated">
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
            
            <Button variant="secondary" fullWidth>Contact Sales</Button>
          </Card>
        </div>
      </div>
    </section>
  );
}
