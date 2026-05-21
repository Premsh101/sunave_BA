'use client';

import React, { useState } from 'react';
import { MessageSquare, Info, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { typography, semantic, colors } from '@/styles/theme';
import type { DocumentType } from '@/types/document';

const PROMPT_CONFIGS: {
  type: DocumentType;
  label: string;
  systemRole: string;
  keyInstructions: string[];
}[] = [
  {
    type: 'brd',
    label: 'Business Requirements Document',
    systemRole: 'Expert Enterprise Business Analyst',
    keyInstructions: [
      'Include an executive summary with business context',
      'Separate functional and non-functional requirements',
      'Call out assumptions and constraints explicitly',
      'End with prioritized action items',
    ],
  },
  {
    type: 'frd',
    label: 'Functional Requirements Document',
    systemRole: 'Senior Systems Analyst',
    keyInstructions: [
      'Number requirements as FR-001, FR-002, etc.',
      'Link requirements to business objectives where possible',
      'Highlight integration points and APIs',
      'Flag ambiguous items as open questions',
    ],
  },
  {
    type: 'mom',
    label: 'Minutes of Meeting',
    systemRole: 'Professional Meeting Secretary',
    keyInstructions: [
      'Be concise and factual — no interpretation',
      'Attribute decisions and action items to named speakers when possible',
      'Format action items with owner and due date',
      'Capture verbatim key decisions',
    ],
  },
  {
    type: 'user-stories',
    label: 'User Stories',
    systemRole: 'Agile Product Owner & Scrum Master',
    keyInstructions: [
      'Use standard format: As a [role], I want [feature] so that [benefit]',
      'Include at least 3 acceptance criteria per story',
      'Group stories under Epics',
      'Identify dependencies between stories',
    ],
  },
  {
    type: 'sprint-tasks',
    label: 'Sprint Tasks',
    systemRole: 'Experienced Scrum Master',
    keyInstructions: [
      'Decompose stories into dev-ready tasks',
      'Assign t-shirt size estimates (S/M/L/XL)',
      'Highlight blockers and dependencies',
      'Define clear definition of done',
    ],
  },
  {
    type: 'action-items',
    label: 'Action Items',
    systemRole: 'Project Coordinator',
    keyInstructions: [
      'Extract every commitment and task mentioned',
      'Assign to a named owner where possible',
      'Set priority (High/Medium/Low)',
      'Format as a markdown table',
    ],
  },
  {
    type: 'stakeholder-summary',
    label: 'Stakeholder Summary',
    systemRole: 'Executive Communication Specialist',
    keyInstructions: [
      'Keep it non-technical and concise',
      'Lead with business impact',
      'Avoid jargon',
      'Close with clear asks or approvals needed',
    ],
  },
  {
    type: 'follow-up-email',
    label: 'Follow-up Email',
    systemRole: 'Professional Business Writer',
    keyInstructions: [
      'Write a complete, ready-to-send email',
      'Include a clear subject line',
      'Personalize based on attendees mentioned',
      'Keep it brief and action-oriented',
    ],
  },
];

export default function PromptStudioPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: typography.fontSize['2xl'], fontWeight: 700, color: semantic.text.primary, marginBottom: '0.25rem' }}>
          Prompt Studio
        </h1>
        <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm }}>
          View and understand AI prompts used for each document type
        </p>
      </div>

      {/* Info Banner */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.875rem 1.25rem', background: semantic.bg.brandSubtle, border: `1px solid ${colors.brand[800]}`, borderRadius: '8px', marginBottom: '2rem' }}>
        <Info size={16} color={colors.brand[400]} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm, lineHeight: 1.6 }}>
          Each document type uses a specialized AI prompt to extract the right information from your transcript. Custom prompt editing will be available in a future update.
        </p>
      </div>

      {/* Prompt Configs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {PROMPT_CONFIGS.map((config) => (
          <Card key={config.type} style={{ padding: 0, overflow: 'hidden' }}>
            <button
              onClick={() => setExpanded(expanded === config.type ? null : config.type)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: semantic.bg.brandSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={16} color={colors.brand[400]} />
                </div>
                <div>
                  <div style={{ fontWeight: 500, color: semantic.text.primary, fontSize: typography.fontSize.sm }}>{config.label}</div>
                  <div style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted }}>Role: {config.systemRole}</div>
                </div>
              </div>
              {expanded === config.type ? (
                <ChevronUp size={16} color={semantic.text.muted} />
              ) : (
                <ChevronDown size={16} color={semantic.text.muted} />
              )}
            </button>

            {expanded === config.type && (
              <div style={{ padding: '0 1.25rem 1.25rem', borderTop: `1px solid ${semantic.border.primary}` }}>
                <div style={{ paddingTop: '1rem' }}>
                  <p style={{ fontSize: typography.fontSize.xs, fontWeight: 600, color: semantic.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                    Key AI Instructions
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {config.keyInstructions.map((instruction, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: typography.fontSize.sm, color: semantic.text.secondary }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.brand[400], marginTop: 6, flexShrink: 0 }} />
                        {instruction}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
