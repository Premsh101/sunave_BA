import type { Metadata } from 'next';
import React, { type CSSProperties } from 'react';
import { Mic, Users, Globe, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors, typography, semantic, borderRadius, gradients } from '@/styles/theme';
import { container, grid, gradientText } from '@/styles/mixins';

export const metadata: Metadata = {
  title: 'About Sunave',
  description: 'Learn about Sunave\'s mission to transform enterprise meeting intelligence and documentation with AI.',
};

const values = [
  {
    icon: <Mic size={28} color={colors.brand[400]} />,
    title: 'Privacy-first transcription',
    description: 'We built Sunave to be bot-free so your sensitive meetings stay private. No third-party bots, no eavesdropping.',
  },
  {
    icon: <Users size={28} color={colors.accent[400]} />,
    title: 'Built for enterprise teams',
    description: 'Our entire roadmap is shaped by Business Analysts, PMs, and enterprise teams who need reliable, structured documentation.',
  },
  {
    icon: <Globe size={28} color={colors.brand[400]} />,
    title: 'Global scale',
    description: 'Deployed across 40+ countries, Sunave is built to handle multi-language meetings and comply with regional data regulations.',
  },
  {
    icon: <Heart size={28} color={colors.accent[400]} />,
    title: 'Customer obsessed',
    description: 'Every feature ships because a customer asked for it. We maintain a tight feedback loop and ship fast.',
  },
];

const stats = [
  { stat: '10,000+', label: 'Enterprise users' },
  { stat: '40+', label: 'Countries' },
  { stat: '98.9%', label: 'Service uptime' },
  { stat: '97%', label: 'Transcription accuracy' },
];

export default function AboutPage() {
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
            <Badge variant="brand" icon={<Mic size={12} />}>Our story</Badge>
          </div>
          <h1 style={titleStyle}>
            Built to make every meeting{' '}
            <span style={gradientText()}>count</span>
          </h1>
          <p style={{ fontSize: typography.fontSize.xl, color: semantic.text.secondary, maxWidth: '650px', margin: '0 auto 2.5rem', lineHeight: typography.lineHeight.relaxed }}>
            Sunave was founded with one belief: enterprise teams shouldn&apos;t have to choose between secure meetings and intelligent documentation. We built both.
          </p>
          <Link href="/signup">
            <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
              Get started free
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '4rem 0', background: semantic.bg.secondary }}>
        <div style={container}>
          <div style={{ ...grid(4, '2rem') }}>
            {stats.map((s) => (
              <div key={s.stat} style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.extrabold, background: gradients.text, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.5rem' }}>
                  {s.stat}
                </div>
                <div style={{ fontSize: typography.fontSize.sm, color: semantic.text.muted }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '6rem 0', background: semantic.bg.primary }}>
        <div style={container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div>
              <Badge variant="accent" style={{ marginBottom: '1.5rem' }}>Our mission</Badge>
              <h2 style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, marginBottom: '1.5rem', letterSpacing: typography.letterSpacing.tight }}>
                Turning conversations into clarity
              </h2>
              <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.lg, lineHeight: typography.lineHeight.relaxed, marginBottom: '1.5rem' }}>
                Every meeting is a decision. Every decision deserves a record. Sunave&apos;s AI captures your conversations in real time — without bots, without friction — and transforms them into the BRDs, MOMs, and User Stories your team actually needs.
              </p>
              <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.lg, lineHeight: typography.lineHeight.relaxed }}>
                We believe the best documentation tool is one that does the work for you, letting your team focus on what matters: building great products and serving great customers.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {values.map((v) => (
                <Card key={v.title} variant="elevated">
                  <div style={iconWrapperStyle}>{v.icon}</div>
                  <h3 style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: semantic.text.primary, marginBottom: '0.5rem' }}>
                    {v.title}
                  </h3>
                  <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm, lineHeight: 1.6 }}>
                    {v.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 0', background: semantic.bg.secondary, textAlign: 'center' }}>
        <div style={container}>
          <h2 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, marginBottom: '1rem' }}>
            Join thousands of enterprise teams
          </h2>
          <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.lg, marginBottom: '2rem' }}>
            Start for free. Upgrade when you&apos;re ready for enterprise power.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/signup">
              <Button variant="primary" size="lg">Start free trial</Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">Contact us</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
