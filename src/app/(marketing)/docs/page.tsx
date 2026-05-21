import type { Metadata } from 'next';
import React, { type CSSProperties } from 'react';
import { BookOpen, Code2, Terminal, Zap, ArrowRight, FileText, Mic, Settings } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors, typography, semantic, borderRadius } from '@/styles/theme';
import { container, grid, gradientText } from '@/styles/mixins';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Sunave developer documentation, API reference, and guides for integrating AI meeting intelligence into your workflow.',
};

const sections = [
  {
    icon: <Zap size={28} color={colors.brand[400]} />,
    title: 'Quick start',
    description: 'Get up and running with Sunave in under 5 minutes. Create an account, record your first meeting, and generate your first AI document.',
    tag: 'Beginner',
  },
  {
    icon: <Mic size={28} color={colors.accent[400]} />,
    title: 'Transcription API',
    description: 'Stream or upload audio to Sunave\'s transcription endpoint. Supports WebRTC, file uploads, and live browser capture.',
    tag: 'API',
  },
  {
    icon: <FileText size={28} color={colors.brand[400]} />,
    title: 'Document generation',
    description: 'Trigger AI document creation via REST. Configure templates, glossaries, and output formats programmatically.',
    tag: 'API',
  },
  {
    icon: <Settings size={28} color={colors.accent[400]} />,
    title: 'Webhooks',
    description: 'Subscribe to real-time events — transcript complete, document ready, meeting ended — and push them to your own systems.',
    tag: 'Integration',
  },
  {
    icon: <Code2 size={28} color={colors.brand[400]} />,
    title: 'REST API reference',
    description: 'Full OpenAPI reference for every endpoint: authentication, meetings, transcripts, documents, templates, and more.',
    tag: 'Reference',
  },
  {
    icon: <BookOpen size={28} color={colors.accent[400]} />,
    title: 'SDK & libraries',
    description: 'Official TypeScript/JavaScript SDK and community-maintained Python and Go clients for faster integration.',
    tag: 'SDK',
  },
];

const guides = [
  { title: 'Integrating with Slack', time: '10 min' },
  { title: 'Exporting to Notion', time: '8 min' },
  { title: 'Setting up SSO with Okta', time: '15 min' },
  { title: 'Custom AI prompts and templates', time: '12 min' },
  { title: 'Bulk import historical meetings', time: '7 min' },
  { title: 'Org-wide analytics with the API', time: '20 min' },
];

export default function DocsPage() {
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

  const tagStyle: CSSProperties = {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    background: semantic.bg.brandSubtle,
    color: colors.brand[400],
    marginBottom: '0.75rem',
  };

  return (
    <>
      {/* Hero */}
      <section style={heroStyle}>
        <div style={container}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Badge variant="brand" icon={<BookOpen size={12} />}>Documentation</Badge>
          </div>
          <h1 style={titleStyle}>
            Everything you need to{' '}
            <span style={gradientText()}>build with Sunave</span>
          </h1>
          <p style={{ fontSize: typography.fontSize.xl, color: semantic.text.secondary, maxWidth: '650px', margin: '0 auto 2.5rem', lineHeight: typography.lineHeight.relaxed }}>
            Guides, API reference, and SDKs to integrate Sunave&apos;s AI meeting intelligence into your products and workflows.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/signup">
              <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
                Start building free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section style={{ padding: '4rem 0 6rem', background: semantic.bg.secondary }}>
        <div style={container}>
          <h2 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, textAlign: 'center', marginBottom: '1rem' }}>
            Documentation sections
          </h2>
          <p style={{ color: semantic.text.secondary, textAlign: 'center', fontSize: typography.fontSize.lg, marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
            Everything from first login to production-grade API integrations.
          </p>
          <div style={grid(3, '1.5rem')}>
            {sections.map((s) => (
              <Card key={s.title} variant="elevated" hoverable>
                <span style={tagStyle}>{s.tag}</span>
                <div style={iconWrapperStyle}>{s.icon}</div>
                <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: semantic.text.primary, marginBottom: '0.5rem' }}>
                  {s.title}
                </h3>
                <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm, lineHeight: 1.65 }}>
                  {s.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular guides */}
      <section style={{ padding: '6rem 0', background: semantic.bg.primary }}>
        <div style={container}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
              <Terminal size={22} color={colors.brand[400]} />
              <h2 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary }}>
                Popular guides
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {guides.map((guide) => (
                <div
                  key={guide.title}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderRadius: borderRadius.lg,
                    background: semantic.bg.secondary,
                    border: `1px solid ${semantic.border.subtle}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.brand[400], flexShrink: 0 }} />
                    <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: semantic.text.primary }}>
                      {guide.title}
                    </span>
                  </div>
                  <span style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted }}>
                    {guide.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 0', background: semantic.bg.secondary, textAlign: 'center' }}>
        <div style={container}>
          <h2 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, marginBottom: '1rem' }}>
            Can&apos;t find what you need?
          </h2>
          <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.lg, marginBottom: '2rem' }}>
            Our support team is happy to help.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
              Contact support
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
