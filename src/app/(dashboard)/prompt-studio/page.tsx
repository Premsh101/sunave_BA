'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Info, ChevronDown, ChevronUp, Pencil, Save, X, RotateCcw } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { typography, semantic, colors } from '@/styles/theme';
import type { DocumentType } from '@/types/document';

interface PromptConfig {
  type: DocumentType;
  label: string;
  systemRole: string;
  keyInstructions: string[];
}

const DEFAULT_PROMPT_CONFIGS: PromptConfig[] = [
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

const STORAGE_KEY = 'sunave-prompt-overrides';

function loadOverrides(): Record<string, Partial<PromptConfig>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveOverrides(overrides: Record<string, Partial<PromptConfig>>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export default function PromptStudioPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, Partial<PromptConfig>>>({});

  const [editRole, setEditRole] = useState('');
  const [editInstructions, setEditInstructions] = useState<string[]>([]);
  const [newInstruction, setNewInstruction] = useState('');

  useEffect(() => {
    setOverrides(loadOverrides());
  }, []);

  const getConfig = (cfg: PromptConfig): PromptConfig => {
    const override = overrides[cfg.type];
    return override ? { ...cfg, ...override } : cfg;
  };

  const startEdit = (cfg: PromptConfig) => {
    const resolved = getConfig(cfg);
    setEditRole(resolved.systemRole);
    setEditInstructions([...resolved.keyInstructions]);
    setEditingType(cfg.type);
    setExpanded(cfg.type);
  };

  const saveEdit = (type: string) => {
    const newOverrides = {
      ...overrides,
      [type]: { systemRole: editRole, keyInstructions: editInstructions },
    };
    setOverrides(newOverrides);
    saveOverrides(newOverrides);
    setEditingType(null);
  };

  const resetToDefault = (type: string) => {
    const newOverrides = { ...overrides };
    delete newOverrides[type];
    setOverrides(newOverrides);
    saveOverrides(newOverrides);
    setEditingType(null);
  };

  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    background: semantic.bg.elevated,
    border: `1px solid ${semantic.border.primary}`,
    borderRadius: '6px',
    color: semantic.text.primary,
    fontSize: typography.fontSize.sm,
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: typography.fontSize['2xl'], fontWeight: 700, color: semantic.text.primary, marginBottom: '0.25rem' }}>
          Prompt Studio
        </h1>
        <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm }}>
          View and customise AI instructions used for each document type
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.875rem 1.25rem', background: semantic.bg.brandSubtle, border: `1px solid ${colors.brand[800]}`, borderRadius: '8px', marginBottom: '2rem' }}>
        <Info size={16} color={colors.brand[400]} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm, lineHeight: 1.6 }}>
          Click <strong>Edit</strong> on any prompt to customise the AI role and key instructions. Use <strong>Reset</strong> to restore the original defaults. Changes are saved locally.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {DEFAULT_PROMPT_CONFIGS.map((defaultCfg) => {
          const config = getConfig(defaultCfg);
          const isExpanded = expanded === config.type;
          const isEditing = editingType === config.type;
          const isModified = !!overrides[config.type];

          return (
            <Card key={config.type} style={{ padding: 0, overflow: 'hidden' }}>
              <button
                onClick={() => !isEditing && setExpanded(isExpanded ? null : config.type)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: isEditing ? 'default' : 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: semantic.bg.brandSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare size={16} color={colors.brand[400]} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 500, color: semantic.text.primary, fontSize: typography.fontSize.sm }}>{config.label}</span>
                      {isModified && <Badge variant="warning">Modified</Badge>}
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted }}>Role: {config.systemRole}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {!isEditing && (
                    <div onClick={(e) => { e.stopPropagation(); startEdit(defaultCfg); }}>
                      <Button size="sm" variant="secondary" icon={<Pencil size={13} />}>Edit</Button>
                    </div>
                  )}
                  {!isEditing && isModified && (
                    <div onClick={(e) => { e.stopPropagation(); resetToDefault(config.type); }}>
                      <Button size="sm" variant="secondary" icon={<RotateCcw size={13} />}>Reset</Button>
                    </div>
                  )}
                  {!isEditing && (isExpanded ? (
                    <ChevronUp size={16} color={semantic.text.muted} />
                  ) : (
                    <ChevronDown size={16} color={semantic.text.muted} />
                  ))}
                </div>
              </button>

              {isExpanded && (
                <div style={{ padding: '0 1.25rem 1.25rem', borderTop: `1px solid ${semantic.border.primary}` }}>
                  {isEditing ? (
                    <div style={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: typography.fontSize.xs, fontWeight: 600, color: semantic.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                          AI Role / Persona
                        </label>
                        <input
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          style={inputBase}
                          placeholder="e.g. Expert Business Analyst"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: typography.fontSize.xs, fontWeight: 600, color: semantic.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                          Key AI Instructions
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '0.5rem' }}>
                          {editInstructions.map((instr, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.375rem', alignItems: 'flex-start' }}>
                              <input
                                value={instr}
                                onChange={(e) => {
                                  const updated = [...editInstructions];
                                  updated[i] = e.target.value;
                                  setEditInstructions(updated);
                                }}
                                style={{ ...inputBase, flex: 1 }}
                              />
                              <button
                                onClick={() => setEditInstructions(editInstructions.filter((_, j) => j !== i))}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: semantic.text.muted, paddingTop: '0.5rem' }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <input
                            value={newInstruction}
                            onChange={(e) => setNewInstruction(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newInstruction.trim()) {
                                e.preventDefault();
                                setEditInstructions([...editInstructions, newInstruction.trim()]);
                                setNewInstruction('');
                              }
                            }}
                            placeholder="Add instruction…"
                            style={{ ...inputBase, flex: 1 }}
                          />
                          <button
                            onClick={() => {
                              if (newInstruction.trim()) {
                                setEditInstructions([...editInstructions, newInstruction.trim()]);
                                setNewInstruction('');
                              }
                            }}
                            style={{ padding: '0.375rem 0.75rem', background: semantic.bg.brandSubtle, border: `1px solid ${semantic.border.brandSubtle}`, borderRadius: '6px', color: semantic.text.brand, cursor: 'pointer', fontSize: typography.fontSize.xs }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button size="sm" variant="primary" icon={<Save size={13} />} onClick={() => saveEdit(config.type)}>Save</Button>
                        <Button size="sm" variant="secondary" icon={<X size={13} />} onClick={() => setEditingType(null)}>Cancel</Button>
                        {isModified && (
                          <Button size="sm" variant="secondary" icon={<RotateCcw size={13} />} onClick={() => resetToDefault(config.type)}>Reset to Default</Button>
                        )}
                      </div>
                    </div>
                  ) : (
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
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
