import type { Metadata } from 'next';
import React, { type CSSProperties } from 'react';
import { Building2, Users, Shield, Headphones, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors, typography, semantic, borderRadius, gradients } from '@/styles/theme';
import { container, grid, gradientText } from '@/styles/mixins';

export const metadata: Metadata = {
  title: 'Enterprise',
  description: 'Enterprise-grade meeting intelligence for large organizations. Custom deployment, SSO, dedicated support, and compliance built in.',
};

const enterpriseFeatures = [
  {
    icon: <Shield size={28} color={colors.brand[400]} />,
    title: 'Advanced Security & Compliance',
    description: 'SSO/SAML with Okta and Azure AD, custom data retention, audit logs, GDPR/CCPA compliance, and optional on-premises deployment.',
  },
  {
    icon: <Building2 size={28} color={colors.accent[400]} />,
    title: 'Organization-Wide Administration',
    description: 'Centralized admin console, team provisioning, bulk user management, organization-wide template control, and usage analytics.',
  },
  {
    icon: <Users size={28} color={colors.brand[400]} />,
    title: 'Dedicated Customer Success',
    description: 'A dedicated Customer Success Manager, onboarding program, quarterly business reviews, and a private Slack channel for your team.',
  },
  {
    icon: <Headphones size={28} color={colors.accent[400]} />,
    title: 'Priority SLA Support',
    description: '24/7 priority support with guaranteed response times (1hr critical, 4hr standard), escalation paths, and a named support engineer.',
  },
  {
    icon: <Zap size={28} color={colors.brand[400]} />,
    title: 'Custom AI & Integrations',
    description: "Fine-tuned AI models on your domain terminology, custom integration development, and access to Sunave's enterprise API.",
  },
  {
    icon: <CheckCircle size={28} color={colors.accent[400]} />,
    title: 'Flexible Deployment',
    description: 'Deploy in your cloud (AWS, GCP, Azure), on-premises, or via our managed SaaS. Air-gapped environments supported.',
  },
];

const proofPoints = [
  { stat: '10,000+', label: 'Enterprise users' },
  { stat: '98.9%', label: 'Uptime SLA' },
  { stat: '< 1hr', label: 'Critical response time' },
  { stat: '40+', label: 'Countries deployed' },
];

const onboardingSteps = [
  { step: '01', title: 'Discovery call', desc: 'We understand your team\'s workflow, compliance requirements, and integration needs.' },
  { step: '02', title: 'Custom configuration', desc: 'We set up SSO, configure data residency, and build custom integrations alongside your IT team.' },
  { step: '03', title: 'Pilot rollout', desc: 'A structured 2-week pilot with 20–50 users, monitored by your dedicated CSM.' },
  { step: '04', title: 'Full deployment', desc: 'Organization-wide rollout with onboarding sessions, documentation, and a success plan.' },
];

export default function EnterprisePage() {
  const heroStyle: CSSProperties = {
    padding: '8rem 0 5rem',
    background: semantic.bg.primary,
    position: 'relative',
    overflow: 'hidden',
  };

  const heroBgStyle: CSSProperties = {
    position: 'absolute',
    top: '-30%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    height: '700px',
    background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.12) 0%, transparent 65%)',
    pointerEvents: 'none',
    zIndex: 0,
  };

  const iconWrapStyle: CSSProperties = {
    width: 52,
    height: 52,
    borderRadius: borderRadius.xl,
    background: semantic.bg.brandSubtle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
  };

  const statStyle: CSSProperties = {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: borderRadius.xl,
    background: semantic.bg.secondary,
    border: `1px solid ${semantic.border.subtle}`,
  };

  return (
    <>
      {/* Hero */}
      <section style={heroStyle}>
        <div style={heroBgStyle} />
        <div style={{ ...container, position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Badge variant="brand" icon={<Building2 size={12} />}>
              Enterprise plan
            </Badge>
          </div>
          <h1 style={{
            fontSize: typography.fontSize['5xl'],
            fontWeight: typography.fontWeight.extrabold,
            color: semantic.text.primary,
            marginBottom: '1rem',
            letterSpacing: typography.letterSpacing.tighter,
            maxWidth: '800px',
            margin: '0 auto 1rem',
          }}>
            Meeting intelligence at{' '}
            <span style={gradientText()}>enterprise scale</span>
          </h1>
          <p style={{ fontSize: typography.fontSize.xl, color: semantic.text.secondary, maxWidth: '640px', margin: '1rem auto 2.5rem' }}>
            Custom deployment, dedicated support, advanced security, and the flexibility to meet the demands of any large organization.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
              Contact Sales
            </Button>
            <Link href="/pricing">
              <Button variant="secondary" size="lg">Compare plans</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section style={{ padding: '4rem 0', background: semantic.bg.secondary }}>
        <div style={container}>
          <div style={grid(4, '1.5rem')}>
            {proofPoints.map((p) => (
              <div key={p.label} style={statStyle}>
                <p style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.extrabold, color: semantic.text.primary, marginBottom: '0.25rem', ...gradientText() }}>
                  {p.stat}
                </p>
                <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm }}>
                  {p.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section style={{ padding: '6rem 0', background: semantic.bg.primary }}>
        <div style={container}>
          <h2 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, textAlign: 'center', marginBottom: '1rem' }}>
            Everything your enterprise needs
          </h2>
          <p style={{ color: semantic.text.secondary, textAlign: 'center', fontSize: typography.fontSize.lg, marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
            Purpose-built capabilities for large organizations with complex requirements.
          </p>
          <div style={grid(3, '1.5rem')}>
            {enterpriseFeatures.map((f) => (
              <Card key={f.title} variant="elevated" hoverable>
                <div style={iconWrapStyle}>{f.icon}</div>
                <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: semantic.text.primary, marginBottom: '0.75rem' }}>
                  {f.title}
                </h3>
                <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm, lineHeight: 1.65 }}>
                  {f.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding Steps */}
      <section style={{ padding: '6rem 0', background: semantic.bg.secondary }}>
        <div style={container}>
          <h2 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, textAlign: 'center', marginBottom: '4rem' }}>
            From contract to full deployment in weeks
          </h2>
          <div style={grid(4, '2rem')}>
            {onboardingSteps.map((s) => (
              <div key={s.step} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: borderRadius.full,
                  background: gradients.brand,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  fontWeight: typography.fontWeight.bold,
                  color: '#fff',
                  fontSize: typography.fontSize.base,
                }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: semantic.text.primary, marginBottom: '0.5rem' }}>
                  {s.title}
                </h3>
                <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm, lineHeight: 1.65 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 0', background: semantic.bg.primary, textAlign: 'center' }}>
        <div style={container}>
          <div style={{
            background: gradients.brandDark,
            borderRadius: borderRadius['2xl'],
            padding: '5rem 2rem',
            border: `1px solid ${semantic.border.brandSubtle}`,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <h2 style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, marginBottom: '1rem', position: 'relative' }}>
              Ready to get started?
            </h2>
            <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.lg, marginBottom: '2rem', maxWidth: '520px', margin: '0 auto 2rem', position: 'relative' }}>
              Talk to our enterprise sales team to get a custom demo and pricing for your organization.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', position: 'relative' }}>
              <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
                Request a demo
              </Button>
              <Link href="/security">
                <Button variant="secondary" size="lg">
                  View security details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
