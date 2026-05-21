'use client';

import React, { useState } from 'react';
import { LayoutTemplate, Plus, Info } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { typography, semantic, colors } from '@/styles/theme';
import type { DocumentType } from '@/types/document';

const BUILT_IN_TEMPLATES: { type: DocumentType; label: string; description: string; sections: string[] }[] = [
  {
    type: 'brd',
    label: 'Business Requirements Document',
    description: 'Comprehensive BRD with objectives, scope, and functional requirements.',
    sections: ['Executive Summary', 'Business Objectives', 'Scope', 'Functional Requirements', 'Non-Functional Requirements', 'Action Items'],
  },
  {
    type: 'frd',
    label: 'Functional Requirements Document',
    description: 'Detailed FRD with numbered requirements and integration points.',
    sections: ['Overview', 'System Context', 'Functional Requirements', 'Non-Functional Requirements', 'Data Requirements', 'Open Questions'],
  },
  {
    type: 'mom',
    label: 'Minutes of Meeting',
    description: 'Official meeting record with decisions, action items, and next steps.',
    sections: ['Meeting Details', 'Agenda Items', 'Key Decisions', 'Action Items', 'Next Steps'],
  },
  {
    type: 'user-stories',
    label: 'User Stories',
    description: 'Agile user stories in "As a / I want / So that" format with acceptance criteria.',
    sections: ['Epics Overview', 'User Stories', 'Acceptance Criteria', 'Dependencies'],
  },
  {
    type: 'sprint-tasks',
    label: 'Sprint Tasks',
    description: 'Sprint goal, task breakdown with estimates, and team assignments.',
    sections: ['Sprint Goal', 'Task Breakdown', 'Dependencies', 'Technical Debt', 'Definition of Done'],
  },
  {
    type: 'action-items',
    label: 'Action Items',
    description: 'Structured action item tracker with owners, due dates, and priority.',
    sections: ['Action Items Table', 'Summary'],
  },
  {
    type: 'stakeholder-summary',
    label: 'Stakeholder Summary',
    description: 'Executive-level summary for non-technical stakeholders.',
    sections: ['Executive Summary', 'Business Impact', 'Key Decisions', 'Timeline', 'Risks', 'Next Steps'],
  },
  {
    type: 'risks-dependencies',
    label: 'Risks & Dependencies',
    description: 'Risk register and dependency mapping from meeting discussion.',
    sections: ['Risk Register', 'External Dependencies', 'Internal Dependencies', 'Blockers', 'Assumptions'],
  },
];

export default function TemplateStudioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof BUILT_IN_TEMPLATES[0] | null>(null);

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: typography.fontSize['2xl'], fontWeight: 700, color: semantic.text.primary, marginBottom: '0.25rem' }}>
            Template Studio
          </h1>
          <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm }}>
            Browse built-in templates or create custom document structures
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} disabled title="Custom templates coming soon">
          New Template
        </Button>
      </div>

      {/* Info Banner */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.875rem 1.25rem', background: semantic.bg.brandSubtle, border: `1px solid ${colors.brand[800]}`, borderRadius: '8px', marginBottom: '2rem' }}>
        <Info size={16} color={colors.brand[400]} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm, lineHeight: 1.6 }}>
          These built-in templates are used automatically when generating documents from the Documents page. Custom template creation will be available in a future update.
        </p>
      </div>

      {/* Template Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {BUILT_IN_TEMPLATES.map((tmpl) => (
          <Card
            key={tmpl.type}
            hoverable
            style={{ cursor: 'pointer', position: 'relative' }}
            onClick={() => setSelectedTemplate(selectedTemplate?.type === tmpl.type ? null : tmpl)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: semantic.bg.brandSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LayoutTemplate size={18} color={colors.brand[400]} />
              </div>
              <Badge variant="brand">Built-in</Badge>
            </div>
            <h3 style={{ fontWeight: 600, color: semantic.text.primary, marginBottom: '0.375rem', fontSize: typography.fontSize.base }}>
              {tmpl.label}
            </h3>
            <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm, lineHeight: 1.6, marginBottom: '1rem' }}>
              {tmpl.description}
            </p>

            {selectedTemplate?.type === tmpl.type && (
              <div style={{ borderTop: `1px solid ${semantic.border.primary}`, paddingTop: '0.875rem', marginTop: '0.25rem' }}>
                <p style={{ fontSize: typography.fontSize.xs, fontWeight: 600, color: semantic.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Sections
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {tmpl.sections.map((section, i) => (
                    <div key={section} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: typography.fontSize.sm, color: semantic.text.secondary }}>
                      <span style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, width: 20 }}>{i + 1}.</span>
                      {section}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
