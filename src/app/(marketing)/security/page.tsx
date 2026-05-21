import type { Metadata } from 'next';
import React, { type CSSProperties } from 'react';
import { Shield, Lock, Eye, Server, Key, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors, typography, semantic, borderRadius } from '@/styles/theme';
import { container, grid, gradientText } from '@/styles/mixins';

export const metadata: Metadata = {
  title: 'Security',
  description: 'Sunave is built for enterprise-grade security. End-to-end encryption, data privacy, SOC 2-aligned controls, and compliance-ready data management.',
};

const securityPillars = [
  {
    icon: <Lock size={28} color={colors.brand[400]} />,
    title: 'End-to-End Encryption',
    description: 'All meeting data is encrypted in transit (TLS 1.3) and at rest (AES-256). Audio, transcripts, and documents are never stored unencrypted.',
  },
  {
    icon: <Eye size={28} color={colors.accent[400]} />,
    title: 'Data Privacy',
    description: 'You own your data. We never sell or train on your meeting content. GDPR and CCPA compliant with right-to-erasure support built in.',
  },
  {
    icon: <Shield size={28} color={colors.brand[400]} />,
    title: 'Access Control',
    description: 'Role-based access control with fine-grained permissions. SSO/SAML support for enterprise identity providers including Okta and Azure AD.',
  },
  {
    icon: <Server size={28} color={colors.accent[400]} />,
    title: 'Infrastructure Security',
    description: 'Hosted on Google Cloud with regional data residency options. VPC isolation, private networking, and regular penetration testing.',
  },
  {
    icon: <Key size={28} color={colors.brand[400]} />,
    title: 'Authentication',
    description: 'Multi-factor authentication (MFA), session management, token rotation, and brute-force protection on all accounts.',
  },
  {
    icon: <CheckCircle size={28} color={colors.accent[400]} />,
    title: 'Compliance & Audit',
    description: 'Detailed audit logs for all user actions, customizable data retention policies, and export tools to support compliance audits.',
  },
];

const certifications = [
  { name: 'SOC 2 Type II', status: 'In Progress', desc: 'Security, availability, and confidentiality controls.' },
  { name: 'GDPR', status: 'Compliant', desc: 'EU General Data Protection Regulation compliance.' },
  { name: 'CCPA', status: 'Compliant', desc: 'California Consumer Privacy Act compliance.' },
  { name: 'ISO 27001', status: 'Planned', desc: 'International information security standard.' },
];

const faqs = [
  {
    q: 'Where is my meeting data stored?',
    a: 'By default, all data is stored in Google Cloud data centers in the United States. Enterprise customers can request EU or APAC regional data residency.',
  },
  {
    q: 'Do you train AI models on our meeting content?',
    a: 'Never. Your meeting data is never used to train or fine-tune any AI models. We use established third-party models via encrypted API calls with zero data retention agreements.',
  },
  {
    q: 'How long is meeting data retained?',
    a: 'Free and Pro plans retain data for 90 days. Enterprise customers can configure custom retention periods from 7 days to 7 years, or opt for immediate deletion post-processing.',
  },
  {
    q: 'Can we self-host Sunave?',
    a: 'Yes. Enterprise customers can deploy Sunave on-premises or in their own cloud environment (AWS, GCP, Azure) with full source access under an enterprise license agreement.',
  },
];

export default function SecurityPage() {
  const heroStyle: CSSProperties = {
    padding: '8rem 0 5rem',
    textAlign: 'center',
    background: semantic.bg.primary,
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

  const faqItemStyle: CSSProperties = {
    padding: '1.5rem',
    borderRadius: borderRadius.lg,
    background: semantic.bg.secondary,
    border: `1px solid ${semantic.border.subtle}`,
    marginBottom: '1rem',
  };

  return (
    <>
      {/* Hero */}
      <section style={heroStyle}>
        <div style={container}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Badge variant="brand" icon={<Shield size={12} />}>
              Enterprise Security
            </Badge>
          </div>
          <h1 style={{
            fontSize: typography.fontSize['5xl'],
            fontWeight: typography.fontWeight.extrabold,
            color: semantic.text.primary,
            marginBottom: '1rem',
            letterSpacing: typography.letterSpacing.tighter,
          }}>
            Built for{' '}
            <span style={gradientText()}>enterprise trust</span>
          </h1>
          <p style={{ fontSize: typography.fontSize.xl, color: semantic.text.secondary, maxWidth: '640px', margin: '0 auto 2.5rem' }}>
            Sunave is designed from the ground up to meet the security and compliance requirements of the world's most security-conscious organizations.
          </p>
          <Link href="/enterprise">
            <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
              Talk to our security team
            </Button>
          </Link>
        </div>
      </section>

      {/* Security Pillars */}
      <section style={{ padding: '6rem 0', background: semantic.bg.secondary }}>
        <div style={container}>
          <h2 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, textAlign: 'center', marginBottom: '4rem' }}>
            Security by design
          </h2>
          <div style={grid(3, '1.5rem')}>
            {securityPillars.map((pillar) => (
              <Card key={pillar.title} variant="elevated" hoverable>
                <div style={iconWrapStyle}>{pillar.icon}</div>
                <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: semantic.text.primary, marginBottom: '0.75rem' }}>
                  {pillar.title}
                </h3>
                <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm, lineHeight: 1.65 }}>
                  {pillar.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section style={{ padding: '6rem 0', background: semantic.bg.primary }}>
        <div style={container}>
          <h2 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, textAlign: 'center', marginBottom: '1rem' }}>
            Compliance & certifications
          </h2>
          <p style={{ color: semantic.text.secondary, textAlign: 'center', fontSize: typography.fontSize.lg, marginBottom: '4rem' }}>
            We hold and pursue industry-standard compliance certifications.
          </p>
          <div style={grid(4, '1.5rem')}>
            {certifications.map((cert) => (
              <Card key={cert.name} variant="elevated">
                <div style={{
                  display: 'inline-block',
                  padding: '3px 12px',
                  borderRadius: borderRadius.full,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.semibold,
                  background: cert.status === 'Compliant'
                    ? 'rgba(34,197,94,0.12)'
                    : cert.status === 'In Progress'
                    ? 'rgba(99,102,241,0.12)'
                    : 'rgba(245,158,11,0.12)',
                  color: cert.status === 'Compliant'
                    ? colors.success[400]
                    : cert.status === 'In Progress'
                    ? colors.brand[400]
                    : colors.warning[400],
                  marginBottom: '1rem',
                }}>
                  {cert.status}
                </div>
                <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: semantic.text.primary, marginBottom: '0.5rem' }}>
                  {cert.name}
                </h3>
                <p style={{ color: semantic.text.muted, fontSize: typography.fontSize.sm }}>
                  {cert.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '6rem 0', background: semantic.bg.secondary }}>
        <div style={container}>
          <h2 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, textAlign: 'center', marginBottom: '3rem' }}>
            Security FAQ
          </h2>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            {faqs.map((faq) => (
              <div key={faq.q} style={faqItemStyle}>
                <h3 style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: semantic.text.primary, marginBottom: '0.75rem' }}>
                  {faq.q}
                </h3>
                <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm, lineHeight: 1.65 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 0', background: semantic.bg.primary, textAlign: 'center' }}>
        <div style={container}>
          <h2 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, marginBottom: '1rem' }}>
            Have security questions?
          </h2>
          <p style={{ color: semantic.text.secondary, marginBottom: '2rem' }}>
            Our security team is ready to answer your questions and provide detailed documentation.
          </p>
          <Link href="/enterprise">
            <Button variant="primary" iconRight={<ArrowRight size={16} />}>Contact security team</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
