import type { Metadata } from 'next';
import React, { type CSSProperties } from 'react';
import { MessageSquare, GitBranch, Globe, Settings, ArrowRight, Zap, Code } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors, typography, semantic, borderRadius, gradients } from '@/styles/theme';
import { container, grid, gradientText } from '@/styles/mixins';

export const metadata: Metadata = {
  title: 'Integrations',
  description: 'Connect Sunave with Slack, GitHub, Jira, Google Workspace, and more. Automate your documentation workflow with our native integrations and REST API.',
};

const integrations = [
  {
    icon: <MessageSquare size={32} color="#4A154B" />,
    bg: '#f8f0f9',
    name: 'Slack',
    category: 'Communication',
    description: 'Automatically post meeting summaries, action items, and AI documents to your Slack channels the moment a meeting ends.',
    features: ['Auto-post summaries', 'Action item notifications', 'Meeting reminders', '/sunave slash command'],
    status: 'available',
  },
  {
    icon: <GitBranch size={32} color="#fff" />,
    bg: '#24292e',
    name: 'GitHub',
    category: 'Development',
    description: 'Create GitHub issues and pull request descriptions directly from meeting action items. Keep dev and product in sync.',
    features: ['Create issues from action items', 'PR description templates', 'Sprint planning notes', 'Repo-linked workspaces'],
    status: 'available',
  },
  {
    icon: <span style={{ fontSize: 28, fontWeight: 700, color: '#0052CC' }}>J</span>,
    bg: '#E3EFFF',
    name: 'Jira',
    category: 'Project Management',
    description: 'Sync Sunave action items as Jira tickets, attach meeting transcripts to epics, and auto-update sprint boards.',
    features: ['Create Jira tickets', 'Attach transcripts to stories', 'Sprint sync', 'Bi-directional status updates'],
    status: 'available',
  },
  {
    icon: <Globe size={32} color="#4285F4" />,
    bg: '#E8F0FE',
    name: 'Google Workspace',
    category: 'Productivity',
    description: 'Export documents directly to Google Docs, schedule recordings in Google Calendar, and share via Google Drive.',
    features: ['Export to Google Docs', 'Calendar integration', 'Google Drive storage', 'Meet recording import'],
    status: 'available',
  },
  {
    icon: <span style={{ fontSize: 24, fontWeight: 800, color: '#000' }}>N</span>,
    bg: '#f5f5f5',
    name: 'Notion',
    category: 'Documentation',
    description: 'Push structured meeting notes and AI-generated documents directly into your Notion workspace with one click.',
    features: ['Push to Notion pages', 'Database sync', 'Template mapping', 'Auto-tagging'],
    status: 'available',
  },
  {
    icon: <span style={{ fontSize: 24, fontWeight: 800, color: '#7C3AED' }}>L</span>,
    bg: '#F3F0FF',
    name: 'Linear',
    category: 'Project Management',
    description: 'Convert meeting decisions into Linear issues instantly. Keep your engineering backlog up to date from every meeting.',
    features: ['Create Linear issues', 'Cycle sync', 'Project mapping', 'Roadmap updates'],
    status: 'coming-soon',
  },
];

const apiFeatures = [
  { title: 'REST API', desc: 'Full-featured REST API with JSON responses, authentication tokens, and rate limiting.' },
  { title: 'Webhooks', desc: 'Real-time event notifications for meeting start, transcription complete, and document generation.' },
  { title: 'SDKs', desc: 'Official SDKs for JavaScript/TypeScript and Python with complete TypeScript typings.' },
  { title: 'OAuth 2.0', desc: 'Industry-standard OAuth 2.0 for secure third-party application authorization.' },
];

export default function IntegrationsPage() {
  const heroStyle: CSSProperties = {
    padding: '8rem 0 5rem',
    textAlign: 'center',
    background: semantic.bg.primary,
  };

  const cardIconStyle = (bg: string): CSSProperties => ({
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    background: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
    flexShrink: 0,
  });

  const statusBadgeStyle = (status: string): CSSProperties => ({
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    background: status === 'available' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
    color: status === 'available' ? colors.success[400] : colors.warning[400],
    marginBottom: '0.75rem',
  });

  return (
    <>
      {/* Hero */}
      <section style={heroStyle}>
        <div style={container}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Badge variant="brand" icon={<Zap size={12} />}>
              6+ native integrations
            </Badge>
          </div>
          <h1 style={{
            fontSize: typography.fontSize['5xl'],
            fontWeight: typography.fontWeight.extrabold,
            color: semantic.text.primary,
            marginBottom: '1rem',
            letterSpacing: typography.letterSpacing.tighter,
          }}>
            Connect your entire{' '}
            <span style={gradientText()}>workflow</span>
          </h1>
          <p style={{ fontSize: typography.fontSize.xl, color: semantic.text.secondary, maxWidth: '620px', margin: '0 auto 2.5rem' }}>
            Sunave integrates with the tools your team already uses. Automate documentation from meeting room to backlog in minutes.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/signup">
              <Button variant="primary" size="lg">Get started free</Button>
            </Link>
            <Link href="/enterprise">
              <Button variant="secondary" size="lg">Enterprise integrations</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Integration Cards */}
      <section style={{ padding: '6rem 0', background: semantic.bg.secondary }}>
        <div style={container}>
          <h2 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, textAlign: 'center', marginBottom: '1rem' }}>
            Native integrations
          </h2>
          <p style={{ color: semantic.text.secondary, textAlign: 'center', fontSize: typography.fontSize.lg, marginBottom: '4rem', maxWidth: '560px', margin: '0 auto 4rem' }}>
            One-click setup with the platforms your team relies on every day.
          </p>
          <div style={grid(3, '1.5rem')}>
            {integrations.map((integration) => (
              <Card key={integration.name} variant="elevated" hoverable>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={cardIconStyle(integration.bg)}>{integration.icon}</div>
                  <span style={statusBadgeStyle(integration.status)}>
                    {integration.status === 'available' ? 'Available' : 'Coming Soon'}
                  </span>
                </div>
                <p style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, fontWeight: typography.fontWeight.medium, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  {integration.category}
                </p>
                <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: semantic.text.primary, marginBottom: '0.75rem' }}>
                  {integration.name}
                </h3>
                <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm, lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  {integration.description}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {integration.features.map((feat) => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: typography.fontSize.xs, color: semantic.text.muted }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: colors.brand[400], flexShrink: 0 }} />
                      {feat}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* API Section */}
      <section style={{ padding: '6rem 0', background: semantic.bg.primary }}>
        <div style={container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div>
              <Badge variant="accent" style={{ marginBottom: '1.5rem' }}>Developer API</Badge>
              <h2 style={{ fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, marginBottom: '1rem' }}>
                Build on top of Sunave
              </h2>
              <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.lg, marginBottom: '2rem', lineHeight: typography.lineHeight.relaxed }}>
                Our REST API lets you extend Sunave into any workflow. Create custom integrations, automate reporting, and build internal tools on top of your meeting data.
              </p>
              <Link href="/enterprise">
                <Button variant="primary" iconRight={<ArrowRight size={16} />}>Explore API docs</Button>
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {apiFeatures.map((f) => (
                <div key={f.title} style={{
                  padding: '1.25rem',
                  borderRadius: borderRadius.lg,
                  background: semantic.bg.secondary,
                  border: `1px solid ${semantic.border.subtle}`,
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: borderRadius.md, background: semantic.bg.brandSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Code size={16} color={colors.brand[400]} />
                  </div>
                  <div>
                    <p style={{ fontWeight: typography.fontWeight.semibold, color: semantic.text.primary, marginBottom: '0.25rem' }}>
                      {f.title}
                    </p>
                    <p style={{ color: semantic.text.muted, fontSize: typography.fontSize.sm }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .integrations-api-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .integrations-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
