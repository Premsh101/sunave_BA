import type { Metadata } from 'next';
import React, { type CSSProperties } from 'react';
import { Check, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors, typography, semantic, gradients, borderRadius } from '@/styles/theme';
import { container, grid } from '@/styles/mixins';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for every team. Start free, upgrade when you need enterprise power.',
};

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: '/mo',
    description: 'Perfect for trying out Sunave\'s core transcription.',
    features: [
      '5 meetings/month',
      'Basic AI transcription',
      'Bot-Free mode only',
      'Markdown exports',
      '1 workspace',
    ],
    cta: 'Get Started Free',
    ctaHref: '/signup',
    variant: 'elevated' as const,
    popular: false,
  },
  {
    name: 'Pro',
    price: '₹1,499',
    period: '/mo',
    description: 'Everything you need for AI-powered meeting workflows.',
    features: [
      'Unlimited transcription',
      'Unlimited AI documents',
      'Bot-Free + Bot Assistant modes',
      'Custom templates & prompts',
      'PDF, Word, Notion exports',
      'Priority support',
      '3 workspaces',
    ],
    cta: 'Start Pro Trial',
    ctaHref: '/signup',
    variant: 'gradient' as const,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations requiring security and scale.',
    features: [
      'Everything in Pro',
      'Single Sign-On (SSO)',
      'Custom data retention policies',
      'Organization-wide templates',
      'Dedicated success manager',
      'SLA + uptime guarantee',
      'Unlimited workspaces',
    ],
    cta: 'Contact Sales',
    ctaHref: '/enterprise',
    variant: 'elevated' as const,
    popular: false,
  },
];

const featureComparison = [
  { feature: 'Monthly meetings', free: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'AI document generation', free: 'Basic', pro: 'Advanced', enterprise: 'Custom AI' },
  { feature: 'Bot-Free transcription', free: '✓', pro: '✓', enterprise: '✓' },
  { feature: 'AI Bot Assistant', free: '✗', pro: '✓', enterprise: '✓' },
  { feature: 'Custom templates', free: '✗', pro: '✓', enterprise: '✓' },
  { feature: 'Export formats', free: 'Markdown', pro: 'All formats', enterprise: 'All + custom' },
  { feature: 'SSO / SAML', free: '✗', pro: '✗', enterprise: '✓' },
  { feature: 'Data retention control', free: '✗', pro: '✗', enterprise: '✓' },
  { feature: 'Support', free: 'Community', pro: 'Priority email', enterprise: 'Dedicated CSM' },
];

export default function PricingPage() {
  const heroStyle: CSSProperties = {
    padding: '8rem 0 4rem',
    textAlign: 'center',
    background: semantic.bg.primary,
  };

  const titleStyle: CSSProperties = {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.extrabold,
    color: semantic.text.primary,
    marginBottom: '1rem',
    letterSpacing: typography.letterSpacing.tighter,
  };

  const subtitleStyle: CSSProperties = {
    fontSize: typography.fontSize.xl,
    color: semantic.text.secondary,
    maxWidth: '600px',
    margin: '0 auto 3rem',
  };

  const listStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem',
    margin: '1.5rem 0 2rem',
  };

  const itemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: semantic.text.secondary,
    fontSize: typography.fontSize.sm,
  };

  const tableStyle: CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '2rem',
  };

  const thStyle: CSSProperties = {
    padding: '1rem',
    textAlign: 'center',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: semantic.text.primary,
    borderBottom: `1px solid ${semantic.border.subtle}`,
  };

  const tdStyle: CSSProperties = {
    padding: '0.875rem 1rem',
    textAlign: 'center',
    fontSize: typography.fontSize.sm,
    color: semantic.text.secondary,
    borderBottom: `1px solid ${semantic.border.subtle}`,
  };

  const tdLabelStyle: CSSProperties = {
    ...tdStyle,
    textAlign: 'left',
    color: semantic.text.primary,
    fontWeight: typography.fontWeight.medium,
  };

  return (
    <>
      <section style={heroStyle}>
        <div style={container}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Badge variant="brand" icon={<Zap size={12} />}>
              14-day free trial on Pro
            </Badge>
          </div>
          <h1 style={titleStyle}>Simple, transparent pricing</h1>
          <p style={subtitleStyle}>
            Start for free, upgrade when you need enterprise power. No hidden fees.
          </p>

          <div style={{ ...grid(3, '2rem'), alignItems: 'start' }}>
            {plans.map((plan) => (
              <div key={plan.name} style={{ position: 'relative' }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                    background: colors.brand[500], color: '#fff', padding: '4px 14px',
                    borderRadius: borderRadius.full, fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.semibold, zIndex: 10,
                    whiteSpace: 'nowrap',
                  }}>
                    MOST POPULAR
                  </div>
                )}
                <Card
                  variant={plan.variant}
                  style={plan.popular ? { transform: 'scale(1.04)', zIndex: 5 } : {}}
                >
                  <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: semantic.text.primary }}>
                    {plan.name}
                  </h3>
                  <div style={{ margin: '1rem 0 0.5rem', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary }}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span style={{ color: semantic.text.muted, fontSize: typography.fontSize.base }}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm, marginBottom: '0.5rem' }}>
                    {plan.description}
                  </p>
                  <ul style={listStyle}>
                    {plan.features.map((f) => (
                      <li key={f} style={itemStyle}>
                        <Check size={16} color={plan.popular ? colors.brand[400] : colors.success[500]} style={{ flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.ctaHref}>
                    <Button variant={plan.popular ? 'primary' : 'secondary'} fullWidth>
                      {plan.cta}
                    </Button>
                  </Link>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature comparison table */}
      <section style={{ padding: '6rem 0', background: semantic.bg.secondary }}>
        <div style={container}>
          <h2 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, textAlign: 'center', marginBottom: '3rem' }}>
            Full feature comparison
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, textAlign: 'left' }}>Feature</th>
                  <th style={thStyle}>Free</th>
                  <th style={{ ...thStyle, color: colors.brand[400] }}>Pro</th>
                  <th style={thStyle}>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((row) => (
                  <tr key={row.feature}>
                    <td style={tdLabelStyle}>{row.feature}</td>
                    <td style={tdStyle}>{row.free}</td>
                    <td style={{ ...tdStyle, color: colors.brand[300] }}>{row.pro}</td>
                    <td style={tdStyle}>{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ / CTA */}
      <section style={{ padding: '6rem 0', background: semantic.bg.primary, textAlign: 'center' }}>
        <div style={container}>
          <h2 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, marginBottom: '1rem' }}>
            Still have questions?
          </h2>
          <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.lg, marginBottom: '2rem' }}>
            Talk to our team and we'll find the right plan for you.
          </p>
          <Link href="/enterprise">
            <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
              Contact Sales
            </Button>
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
