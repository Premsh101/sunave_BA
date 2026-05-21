'use client';

import React, { useState, useEffect } from 'react';
import { LayoutTemplate, Plus, Info, Pencil, Save, X, Trash2, RotateCcw } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { typography, semantic, colors } from '@/styles/theme';
import type { DocumentType } from '@/types/document';

interface TemplateConfig {
  id: string;
  type: DocumentType | 'custom';
  label: string;
  description: string;
  sections: string[];
  isCustom?: boolean;
}

const DEFAULT_BUILT_IN_TEMPLATES: TemplateConfig[] = [
  {
    id: 'brd',
    type: 'brd',
    label: 'Business Requirements Document',
    description: 'Comprehensive BRD with objectives, scope, and functional requirements.',
    sections: ['Executive Summary', 'Business Objectives', 'Scope', 'Functional Requirements', 'Non-Functional Requirements', 'Action Items'],
  },
  {
    id: 'frd',
    type: 'frd',
    label: 'Functional Requirements Document',
    description: 'Detailed FRD with numbered requirements and integration points.',
    sections: ['Overview', 'System Context', 'Functional Requirements', 'Non-Functional Requirements', 'Data Requirements', 'Open Questions'],
  },
  {
    id: 'mom',
    type: 'mom',
    label: 'Minutes of Meeting',
    description: 'Official meeting record with decisions, action items, and next steps.',
    sections: ['Meeting Details', 'Agenda Items', 'Key Decisions', 'Action Items', 'Next Steps'],
  },
  {
    id: 'user-stories',
    type: 'user-stories',
    label: 'User Stories',
    description: 'Agile user stories in "As a / I want / So that" format with acceptance criteria.',
    sections: ['Epics Overview', 'User Stories', 'Acceptance Criteria', 'Dependencies'],
  },
  {
    id: 'sprint-tasks',
    type: 'sprint-tasks',
    label: 'Sprint Tasks',
    description: 'Sprint goal, task breakdown with estimates, and team assignments.',
    sections: ['Sprint Goal', 'Task Breakdown', 'Dependencies', 'Technical Debt', 'Definition of Done'],
  },
  {
    id: 'action-items',
    type: 'action-items',
    label: 'Action Items',
    description: 'Structured action item tracker with owners, due dates, and priority.',
    sections: ['Action Items Table', 'Summary'],
  },
  {
    id: 'stakeholder-summary',
    type: 'stakeholder-summary',
    label: 'Stakeholder Summary',
    description: 'Executive-level summary for non-technical stakeholders.',
    sections: ['Executive Summary', 'Business Impact', 'Key Decisions', 'Timeline', 'Risks', 'Next Steps'],
  },
  {
    id: 'risks-dependencies',
    type: 'risks-dependencies',
    label: 'Risks & Dependencies',
    description: 'Risk register and dependency mapping from meeting discussion.',
    sections: ['Risk Register', 'External Dependencies', 'Internal Dependencies', 'Blockers', 'Assumptions'],
  },
];

const STORAGE_KEY_BUILT_IN = 'sunave-template-overrides';
const STORAGE_KEY_CUSTOM = 'sunave-custom-templates';

function loadBuiltInOverrides(): Record<string, Partial<TemplateConfig>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BUILT_IN);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveBuiltInOverrides(overrides: Record<string, Partial<TemplateConfig>>) {
  localStorage.setItem(STORAGE_KEY_BUILT_IN, JSON.stringify(overrides));
}

function loadCustomTemplates(): TemplateConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCustomTemplates(templates: TemplateConfig[]) {
  localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(templates));
}

const inputStyle = (semantic: typeof import('@/styles/theme').semantic): React.CSSProperties => ({
  width: '100%',
  padding: '0.5rem 0.75rem',
  background: semantic.bg.elevated,
  border: `1px solid ${semantic.border.primary}`,
  borderRadius: '6px',
  color: semantic.text.primary,
  fontSize: typography.fontSize.sm,
  outline: 'none',
  boxSizing: 'border-box',
});

export default function TemplateStudioPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [builtInOverrides, setBuiltInOverrides] = useState<Record<string, Partial<TemplateConfig>>>({});
  const [customTemplates, setCustomTemplates] = useState<TemplateConfig[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);

  // Edit state
  const [editLabel, setEditLabel] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSections, setEditSections] = useState<string[]>([]);
  const [newSectionInput, setNewSectionInput] = useState('');

  // New template form
  const [newLabel, setNewLabel] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSections, setNewSections] = useState<string[]>(['']);

  useEffect(() => {
    setBuiltInOverrides(loadBuiltInOverrides());
    setCustomTemplates(loadCustomTemplates());
  }, []);

  const getBuiltInTemplate = (tmpl: TemplateConfig): TemplateConfig => {
    const override = builtInOverrides[tmpl.id];
    return override ? { ...tmpl, ...override } : tmpl;
  };

  const allTemplates: TemplateConfig[] = [
    ...DEFAULT_BUILT_IN_TEMPLATES.map(getBuiltInTemplate),
    ...customTemplates,
  ];

  const startEdit = (tmpl: TemplateConfig) => {
    setEditLabel(tmpl.label);
    setEditDescription(tmpl.description);
    setEditSections([...tmpl.sections]);
    setEditingId(tmpl.id);
    setSelectedId(tmpl.id);
  };

  const saveEdit = (tmplId: string) => {
    const isBuiltIn = DEFAULT_BUILT_IN_TEMPLATES.some((t) => t.id === tmplId);
    if (isBuiltIn) {
      const newOverrides = {
        ...builtInOverrides,
        [tmplId]: { label: editLabel, description: editDescription, sections: editSections },
      };
      setBuiltInOverrides(newOverrides);
      saveBuiltInOverrides(newOverrides);
    } else {
      const updated = customTemplates.map((t) =>
        t.id === tmplId ? { ...t, label: editLabel, description: editDescription, sections: editSections } : t,
      );
      setCustomTemplates(updated);
      saveCustomTemplates(updated);
    }
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const resetBuiltIn = (tmplId: string) => {
    const newOverrides = { ...builtInOverrides };
    delete newOverrides[tmplId];
    setBuiltInOverrides(newOverrides);
    saveBuiltInOverrides(newOverrides);
  };

  const deleteCustom = (tmplId: string) => {
    const updated = customTemplates.filter((t) => t.id !== tmplId);
    setCustomTemplates(updated);
    saveCustomTemplates(updated);
    if (selectedId === tmplId) setSelectedId(null);
  };

  const handleCreateTemplate = () => {
    const label = newLabel.trim();
    if (!label) return;
    const sections = newSections.map((s) => s.trim()).filter(Boolean);
    const newTmpl: TemplateConfig = {
      id: `custom-${Date.now()}`,
      type: 'custom',
      label,
      description: newDescription.trim(),
      sections: sections.length > 0 ? sections : ['Section 1'],
      isCustom: true,
    };
    const updated = [...customTemplates, newTmpl];
    setCustomTemplates(updated);
    saveCustomTemplates(updated);
    setNewLabel('');
    setNewDescription('');
    setNewSections(['']);
    setShowNewModal(false);
  };

  const addSectionToEdit = () => {
    if (newSectionInput.trim()) {
      setEditSections([...editSections, newSectionInput.trim()]);
      setNewSectionInput('');
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: typography.fontSize['2xl'], fontWeight: 700, color: semantic.text.primary, marginBottom: '0.25rem' }}>
            Template Studio
          </h1>
          <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm }}>
            Browse built-in templates, edit their sections, or create custom document structures
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => setShowNewModal(true)}>
          New Template
        </Button>
      </div>

      {/* Info Banner */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.875rem 1.25rem', background: semantic.bg.brandSubtle, border: `1px solid ${colors.brand[800]}`, borderRadius: '8px', marginBottom: '2rem' }}>
        <Info size={16} color={colors.brand[400]} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm, lineHeight: 1.6 }}>
          Click any template to view its sections. Use the <strong>Edit</strong> button to customise sections and descriptions. Custom templates are saved locally to your browser.
        </p>
      </div>

      {/* Template Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {allTemplates.map((tmpl) => {
          const isEditing = editingId === tmpl.id;
          const isSelected = selectedId === tmpl.id;
          const isModified = !tmpl.isCustom && !!builtInOverrides[tmpl.id];

          return (
            <Card
              key={tmpl.id}
              hoverable={!isEditing}
              style={{ cursor: isEditing ? 'default' : 'pointer', position: 'relative' }}
              onClick={() => !isEditing && setSelectedId(isSelected ? null : tmpl.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: semantic.bg.brandSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LayoutTemplate size={18} color={colors.brand[400]} />
                </div>
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {tmpl.isCustom ? (
                    <Badge variant="success">Custom</Badge>
                  ) : (
                    <>
                      <Badge variant="brand">Built-in</Badge>
                      {isModified && <Badge variant="warning">Modified</Badge>}
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, display: 'block', marginBottom: '0.25rem' }}>Label</label>
                    <input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} style={inputStyle(semantic)} />
                  </div>
                  <div>
                    <label style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, display: 'block', marginBottom: '0.25rem' }}>Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={2}
                      style={{ ...inputStyle(semantic), resize: 'vertical' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, display: 'block', marginBottom: '0.5rem' }}>Sections</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '0.5rem' }}>
                      {editSections.map((sec, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                          <input
                            value={sec}
                            onChange={(e) => {
                              const updated = [...editSections];
                              updated[i] = e.target.value;
                              setEditSections(updated);
                            }}
                            style={{ ...inputStyle(semantic), flex: 1 }}
                          />
                          <button
                            onClick={() => setEditSections(editSections.filter((_, j) => j !== i))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: semantic.text.muted, padding: '0.25rem' }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <input
                        value={newSectionInput}
                        onChange={(e) => setNewSectionInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSectionToEdit(); } }}
                        placeholder="Add section…"
                        style={{ ...inputStyle(semantic), flex: 1 }}
                      />
                      <button
                        onClick={addSectionToEdit}
                        style={{ padding: '0.375rem 0.625rem', background: semantic.bg.brandSubtle, border: `1px solid ${semantic.border.brand}`, borderRadius: '6px', color: semantic.text.brand, cursor: 'pointer', fontSize: typography.fontSize.xs }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <Button size="sm" variant="primary" icon={<Save size={13} />} onClick={() => saveEdit(tmpl.id)}>Save</Button>
                    <Button size="sm" variant="secondary" icon={<X size={13} />} onClick={cancelEdit}>Cancel</Button>
                    {isModified && (
                      <Button size="sm" variant="secondary" icon={<RotateCcw size={13} />} onClick={() => { resetBuiltIn(tmpl.id); cancelEdit(); }} title="Reset to default">Reset</Button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <h3 style={{ fontWeight: 600, color: semantic.text.primary, marginBottom: '0.375rem', fontSize: typography.fontSize.base }}>
                    {tmpl.label}
                  </h3>
                  <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm, lineHeight: 1.6, marginBottom: '0.875rem' }}>
                    {tmpl.description}
                  </p>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: isSelected ? '0.875rem' : 0 }} onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="secondary" icon={<Pencil size={13} />} onClick={() => startEdit(tmpl)}>Edit</Button>
                    {tmpl.isCustom && (
                      <Button size="sm" variant="danger" icon={<Trash2 size={13} />} onClick={() => deleteCustom(tmpl.id)}>Delete</Button>
                    )}
                    {isModified && (
                      <Button size="sm" variant="secondary" icon={<RotateCcw size={13} />} onClick={() => resetBuiltIn(tmpl.id)} title="Reset to default">Reset</Button>
                    )}
                  </div>

                  {isSelected && (
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
                </>
              )}
            </Card>
          );
        })}
      </div>

      {/* New Template Modal */}
      {showNewModal && (
        <Modal isOpen onClose={() => setShowNewModal(false)} title="Create Custom Template" size="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: 500, color: semantic.text.secondary, marginBottom: '0.375rem' }}>Template Name *</label>
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Product Specification Document"
                style={{ width: '100%', padding: '0.625rem 0.875rem', background: semantic.bg.tertiary, border: `1px solid ${semantic.border.primary}`, borderRadius: '8px', color: semantic.text.primary, fontSize: typography.fontSize.sm, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: 500, color: semantic.text.secondary, marginBottom: '0.375rem' }}>Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Brief description of this template…"
                rows={2}
                style={{ width: '100%', padding: '0.625rem 0.875rem', background: semantic.bg.tertiary, border: `1px solid ${semantic.border.primary}`, borderRadius: '8px', color: semantic.text.primary, fontSize: typography.fontSize.sm, outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: 500, color: semantic.text.secondary, marginBottom: '0.5rem' }}>Sections</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {newSections.map((sec, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                    <input
                      value={sec}
                      onChange={(e) => {
                        const updated = [...newSections];
                        updated[i] = e.target.value;
                        setNewSections(updated);
                      }}
                      placeholder={`Section ${i + 1}`}
                      style={{ flex: 1, padding: '0.5rem 0.75rem', background: semantic.bg.tertiary, border: `1px solid ${semantic.border.primary}`, borderRadius: '6px', color: semantic.text.primary, fontSize: typography.fontSize.sm, outline: 'none' }}
                    />
                    {newSections.length > 1 && (
                      <button
                        onClick={() => setNewSections(newSections.filter((_, j) => j !== i))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: semantic.text.muted }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setNewSections([...newSections, ''])}
                  style={{ alignSelf: 'flex-start', padding: '0.375rem 0.75rem', background: semantic.bg.brandSubtle, border: `1px solid ${semantic.border.brandSubtle}`, borderRadius: '6px', color: semantic.text.brand, cursor: 'pointer', fontSize: typography.fontSize.sm, display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Plus size={13} /> Add Section
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="secondary" onClick={() => setShowNewModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleCreateTemplate} disabled={!newLabel.trim()}>Create Template</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
