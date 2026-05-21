import type { Metadata } from 'next';
import React, { type CSSProperties } from 'react';
import { Mic, FileText, Bot, Shield, Layout, Settings, Zap, Users, Globe, BarChart } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors, typography, semantic, gradients, borderRadius } from '@/styles/theme';
import { container, grid, gradientText } from '@/styles/mixins';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Explore Sunave\'s full suite of AI meeting intelligence, documentation, collaboration, and enterprise features.',
};

const coreFeatures = [
  {
    icon: <Mic size={28} color={colors.brand[400]} />,
    title: 'Bot-Free Transcription',
    description: 'Capture audio directly from the browser without inviting external bots to your secure meetings. Works with any conferencing platform.',
    tag: 'Recording',
  },
  {
    icon: <FileText size={28} color={colors.accent[400]} />,
    title: 'Dynamic AI Documents',
    description: 'Generate BRDs, FRDs, User Stories, MOMs, and Sprint Summaries with complete control over structure, headers, and terminology.',
    tag: 'AI Docs',
  },
  {
    icon: <Bot size={28} color={colors.brand[400]} />,
    title: 'AI Bot Assistant',
    description: 'Optionally invite the Sunave AI Assistant for superior speaker diarization, topic detection, and timeline accuracy.',
    tag: 'AI',
  },
  {
    icon: <Layout size={28} color={colors.accent[400]} />,
    title: 'Template Studio',
    description: 'Build and share custom document templates with a visual editor. Set organization-wide defaults for consistent documentation.',
    tag: 'Templates',
  },
  {
    icon: <Settings size={28} color={colors.brand[400]} />,
    title: 'Prompt Customization',
    description: 'Fine-tune AI behavior with section-level prompts, domain terminology glossaries, and brand voice configurations.',
    tag: 'Customization',
  },
  {
    icon: <Shield size={28} color={colors.accent[400]} />,
    title: 'Enterprise Security',
    description: 'Built for compliance with customizable data retention, consent management, private workspaces, and audit logs.',
    tag: 'Security',
  },
  {
    icon: <Users size={28} color={colors.brand[400]} />,
    title: 'Team Collaboration',
    description: 'Real-time co-editing, threaded comments, @mentions, and role-based access control for cross-functional teams.',
    tag: 'Collaboration',
  },
  {
    icon: <Globe size={28} color={colors.accent[400]} />,
    title: 'Integrations',
    description: 'Connect with Slack, Jira, GitHub, Google Workspace, Notion, and more through our native integrations and REST API.',
    tag: 'Integrations',
  },
  {
    icon: <BarChart size={28} color={colors.brand[400]} />,
    title: 'Analytics & Insights',
    description: 'Track meeting frequency, document output, AI usage, and team productivity across your entire organization.',
    tag: 'Analytics',
  },
];

const aiCapabilities = [
  { label: 'Auto-summarization', desc: 'Instant meeting summaries with key decisions and action items.' },
  { label: 'Speaker identification', desc: 'Distinguish who said what with AI-powered diarization.' },
  { label: 'Sentiment analysis', desc: 'Understand the tone and engagement level of each meeting.' },
  { label: 'Topic clustering', desc: 'Automatically group discussion points into structured themes.' },
  { label: 'Action item extraction', desc: 'Surface tasks, owners, and deadlines from conversation.' },
  { label: 'Smart search', desc: 'Full-text search across all your transcripts and documents.' },
];

export default function FeaturesPage() {
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
            <Badge variant="brand" icon={<Zap size={12} />}>
              Now with Sunave 2.0
            </Badge>
          </div>
          <h1 style={titleStyle}>
            Everything your team needs to{' '}
            <span style={gradientText()}>move faster</span>
          </h1>
          <p style={{ fontSize: typography.fontSize.xl, color: semantic.text.secondary, maxWidth: '650px', margin: '0 auto 2.5rem' }}>
            From bot-free transcription to enterprise compliance — Sunave covers every step of your meeting-to-document workflow.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/signup">
              <Button variant="primary" size="lg">Start Free Trial</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" size="lg">View Pricing</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section style={{ padding: '6rem 0', background: semantic.bg.secondary }}>
        <div style={container}>
          <h2 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, textAlign: 'center', marginBottom: '1rem' }}>
            Core capabilities
          </h2>
          <p style={{ color: semantic.text.secondary, textAlign: 'center', fontSize: typography.fontSize.lg, marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
            A complete suite designed for BAs, PMs, and enterprise teams.
          </p>
          <div style={grid(3, '1.5rem')}>
            {coreFeatures.map((f) => (
              <Card key={f.title} variant="elevated" hoverable>
                <span style={tagStyle}>{f.tag}</span>
                <div style={iconWrapperStyle}>{f.icon}</div>
                <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: semantic.text.primary, marginBottom: '0.5rem' }}>
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

      {/* AI Capabilities */}
      <section style={{ padding: '6rem 0', background: semantic.bg.primary }}>
        <div style={container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div>
              <Badge variant="accent" style={{ marginBottom: '1.5rem' }}>AI Intelligence</Badge>
              <h2 style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, marginBottom: '1rem', letterSpacing: typography.letterSpacing.tight }}>
                Powered by state-of-the-art AI
              </h2>
              <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.lg, marginBottom: '2rem', lineHeight: typography.lineHeight.relaxed }}>
                Our multi-model AI pipeline combines speech recognition, NLP, and large language models to deliver unmatched accuracy and insight.
              </p>
              <Link href="/signup">
                <Button variant="primary">Try it free</Button>
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {aiCapabilities.map((cap) => (
                <div key={cap.label} style={{
                  padding: '1rem 1.25rem',
                  borderRadius: borderRadius.lg,
                  background: semantic.bg.secondary,
                  border: `1px solid ${semantic.border.subtle}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.brand[400], marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: typography.fontWeight.semibold, color: semantic.text.primary, marginBottom: '0.25rem', fontSize: typography.fontSize.sm }}>
                      {cap.label}
                    </p>
                    <p style={{ color: semantic.text.muted, fontSize: typography.fontSize.sm }}>
                      {cap.desc}
                    </p>
                  </div>
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
            Ready to transform your workflows?
          </h2>
          <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.lg, marginBottom: '2rem' }}>
            Join thousands of enterprise teams already using Sunave.
          </p>
          <Link href="/signup">
            <Button variant="primary" size="lg">Get started for free</Button>
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .features-ai-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .features-core-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
