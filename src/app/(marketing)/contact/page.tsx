import type { Metadata } from 'next';
import React, { type CSSProperties } from 'react';
import { Mail, MessageSquare, Headphones, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors, typography, semantic, borderRadius } from '@/styles/theme';
import { container, grid, gradientText } from '@/styles/mixins';

export const metadata: Metadata = {
  title: 'Contact Sunave',
  description: 'Get in touch with the Sunave team. Whether you need support, want to talk to sales, or just have a question — we\'re here to help.',
};

const contactOptions = [
  {
    icon: <Mail size={28} color={colors.brand[400]} />,
    title: 'General enquiries',
    description: 'Questions about Sunave, the product, or our company.',
    action: 'Email us',
    href: 'mailto:hello@sunave.tech',
    external: true,
  },
  {
    icon: <Headphones size={28} color={colors.accent[400]} />,
    title: 'Customer support',
    description: 'Need help with your account or a technical issue?',
    action: 'Open a ticket',
    href: 'mailto:support@sunave.tech',
    external: true,
  },
  {
    icon: <Building2 size={28} color={colors.brand[400]} />,
    title: 'Enterprise sales',
    description: 'Interested in a custom plan for your organization?',
    action: 'Talk to sales',
    href: '/enterprise',
    external: false,
  },
  {
    icon: <MessageSquare size={28} color={colors.accent[400]} />,
    title: 'Partnerships',
    description: 'Want to integrate with Sunave or explore co-marketing?',
    action: 'Get in touch',
    href: 'mailto:partnerships@sunave.tech',
    external: true,
  },
];

const faqs = [
  {
    q: 'How quickly will I get a response?',
    a: 'We aim to respond to all enquiries within one business day. Enterprise customers on a paid SLA receive responses within 1–4 hours.',
  },
  {
    q: 'Do you have a phone number?',
    a: 'We currently handle all support asynchronously via email and ticketing. Enterprise customers receive a dedicated Slack channel and CSM.',
  },
  {
    q: 'Where is Sunave headquartered?',
    a: 'Sunave is a fully remote-first company with team members across Asia, Europe, and North America.',
  },
  {
    q: 'How can I report a security vulnerability?',
    a: 'Please email security@sunave.tech with details. We take all security reports seriously and respond within 24 hours.',
  },
];

export default function ContactPage() {
  const heroStyle: CSSProperties = {
    padding: '8rem 0 5rem',
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

  const iconWrapperStyle: CSSProperties = {
    width: 56,
    height: 56,
    borderRadius: borderRadius.xl,
    background: semantic.bg.brandSubtle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
  };

  return (
    <>
      {/* Hero */}
      <section style={heroStyle}>
        <div style={container}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Badge variant="brand" icon={<Mail size={12} />}>Get in touch</Badge>
          </div>
          <h1 style={titleStyle}>
            We&apos;re here to{' '}
            <span style={gradientText()}>help</span>
          </h1>
          <p style={{ fontSize: typography.fontSize.xl, color: semantic.text.secondary, maxWidth: '600px', margin: '0 auto', lineHeight: typography.lineHeight.relaxed }}>
            Whether you need product support, want to explore enterprise options, or just have a question — our team is ready to help.
          </p>
        </div>
      </section>

      {/* Contact options */}
      <section style={{ padding: '4rem 0 6rem', background: semantic.bg.primary }}>
        <div style={container}>
          <div style={grid(4, '1.5rem')}>
            {contactOptions.map((opt) => (
              <Card key={opt.title} variant="elevated" hoverable>
                <div style={iconWrapperStyle}>{opt.icon}</div>
                <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: semantic.text.primary, marginBottom: '0.5rem' }}>
                  {opt.title}
                </h3>
                <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm, lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  {opt.description}
                </p>
                {opt.external ? (
                  <a href={opt.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.brand[400], textDecoration: 'none' }}>
                    {opt.action} <ArrowRight size={14} />
                  </a>
                ) : (
                  <Link href={opt.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.brand[400], textDecoration: 'none' }}>
                    {opt.action} <ArrowRight size={14} />
                  </Link>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '6rem 0', background: semantic.bg.secondary }}>
        <div style={container}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <h2 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, textAlign: 'center', marginBottom: '3rem' }}>
              Frequently asked questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {faqs.map((faq) => (
                <Card key={faq.q} variant="elevated">
                  <h3 style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: semantic.text.primary, marginBottom: '0.625rem' }}>
                    {faq.q}
                  </h3>
                  <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm, lineHeight: 1.7 }}>
                    {faq.a}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 0', background: semantic.bg.primary, textAlign: 'center' }}>
        <div style={container}>
          <h2 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, marginBottom: '1rem' }}>
            Ready to get started?
          </h2>
          <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.lg, marginBottom: '2rem' }}>
            Try Sunave free — no credit card required.
          </p>
          <Link href="/signup">
            <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
              Start for free
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
