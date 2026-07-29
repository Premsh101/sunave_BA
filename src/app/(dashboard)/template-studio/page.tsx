'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Info,
  Save,
  X,
  Trash2,
  RotateCcw,
  Eye,
  GripVertical,
  Layers,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
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

const modalInputClass =
  'w-full bg-app-surface-lowest border border-app-outline rounded-lg px-4 py-2 text-sm text-app-fg outline-none placeholder:text-app-outline-strong focus:border-action focus:ring-2 focus:ring-action/20 transition-all';

export default function TemplateStudioPage() {
  const [selectedId, setSelectedId] = useState<string>('brd');
  const [builtInOverrides, setBuiltInOverrides] = useState<Record<string, Partial<TemplateConfig>>>({});
  const [customTemplates, setCustomTemplates] = useState<TemplateConfig[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Draft state for the detail editor: null = untouched (mirror saved template)
  const [draftLabel, setDraftLabel] = useState<string | null>(null);
  const [draftDescription, setDraftDescription] = useState<string | null>(null);
  const [draftSections, setDraftSections] = useState<string[] | null>(null);

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

  const selected = allTemplates.find((t) => t.id === selectedId) ?? allTemplates[0];
  const label = draftLabel ?? selected.label;
  const description = draftDescription ?? selected.description;
  const sections = draftSections ?? selected.sections;
  const isDirty =
    label !== selected.label ||
    description !== selected.description ||
    JSON.stringify(sections) !== JSON.stringify(selected.sections);
  const isModified = !selected.isCustom && !!builtInOverrides[selected.id];

  const clearDrafts = () => {
    setDraftLabel(null);
    setDraftDescription(null);
    setDraftSections(null);
  };

  const selectTemplate = (id: string) => {
    setSelectedId(id);
    clearDrafts();
  };

  const saveEdit = () => {
    const cleanSections = sections.map((s) => s.trim()).filter(Boolean);
    const isBuiltIn = DEFAULT_BUILT_IN_TEMPLATES.some((t) => t.id === selected.id);
    if (isBuiltIn) {
      const newOverrides = {
        ...builtInOverrides,
        [selected.id]: { label: label.trim() || selected.label, description, sections: cleanSections },
      };
      setBuiltInOverrides(newOverrides);
      saveBuiltInOverrides(newOverrides);
    } else {
      const updated = customTemplates.map((t) =>
        t.id === selected.id
          ? { ...t, label: label.trim() || selected.label, description, sections: cleanSections }
          : t,
      );
      setCustomTemplates(updated);
      saveCustomTemplates(updated);
    }
    clearDrafts();
  };

  const resetBuiltIn = () => {
    const newOverrides = { ...builtInOverrides };
    delete newOverrides[selected.id];
    setBuiltInOverrides(newOverrides);
    saveBuiltInOverrides(newOverrides);
    clearDrafts();
  };

  const deleteCustom = () => {
    const updated = customTemplates.filter((t) => t.id !== selected.id);
    setCustomTemplates(updated);
    saveCustomTemplates(updated);
    setSelectedId('brd');
    clearDrafts();
  };

  const handleCreateTemplate = () => {
    const lbl = newLabel.trim();
    if (!lbl) return;
    const secs = newSections.map((s) => s.trim()).filter(Boolean);
    const newTmpl: TemplateConfig = {
      id: `custom-${Date.now()}`,
      type: 'custom',
      label: lbl,
      description: newDescription.trim(),
      sections: secs.length > 0 ? secs : ['Section 1'],
      isCustom: true,
    };
    const updated = [...customTemplates, newTmpl];
    setCustomTemplates(updated);
    saveCustomTemplates(updated);
    setNewLabel('');
    setNewDescription('');
    setNewSections(['']);
    setShowNewModal(false);
    setSelectedId(newTmpl.id);
    clearDrafts();
  };

  const updateSection = (i: number, value: string) => {
    const next = [...sections];
    next[i] = value;
    setDraftSections(next);
  };

  const removeSection = (i: number) => {
    setDraftSections(sections.filter((_, j) => j !== i));
  };

  const moveSection = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    setDraftSections(next);
  };

  const addSection = () => {
    setDraftSections([...sections, `Section ${sections.length + 1}`]);
  };

  return (
    <div className="p-4 md:p-8 h-[calc(100vh-64px)] flex flex-col overflow-hidden text-app-fg">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 shrink-0">
        <div>
          <h2 className="text-[28px] md:text-[32px] font-semibold leading-tight">Template Studio</h2>
          <p className="text-sm text-app-fg-variant mt-1">Define and manage reusable document structures.</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-action hover:bg-action-hover text-white text-sm font-medium transition-colors shrink-0"
        >
          <Plus size={16} />
          Create Template
        </button>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* LEFT — template list */}
        <div className="col-span-12 md:col-span-4 overflow-y-auto min-h-0 pr-1 flex flex-col gap-3 max-h-56 md:max-h-none">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-app-fg-variant">Active Templates</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-app-surface-high text-app-fg-variant">{allTemplates.length}</span>
          </div>
          {allTemplates.map((tmpl) => {
            const active = tmpl.id === selected.id;
            const modified = !tmpl.isCustom && !!builtInOverrides[tmpl.id];
            return (
              <button
                key={tmpl.id}
                onClick={() => selectTemplate(tmpl.id)}
                className={`relative text-left rounded-xl p-5 transition-colors overflow-hidden ${
                  active
                    ? 'bg-app-surface-high border border-action/50'
                    : 'bg-app-bg border border-app-surface-high hover:border-app-outline hover:bg-app-surface-low'
                }`}
              >
                {active && <span className="absolute left-0 top-0 bottom-0 w-1 bg-action shadow-[0_0_12px_rgba(99,102,241,0.8)]" />}
                <Layers
                  size={72}
                  className={`absolute -top-3 -right-3 pointer-events-none ${active ? 'text-app-primary/10' : 'text-app-surface-high/60'}`}
                />
                <div className="flex items-center justify-between mb-3 relative">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${active ? 'bg-action/20 text-app-primary' : 'bg-app-surface-high text-app-fg-variant'}`}>
                    <Layers size={16} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {active && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-action/20 text-app-primary">Editing</span>
                    )}
                    {tmpl.isCustom ? (
                      <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-green-400/10 text-green-400">Custom</span>
                    ) : modified ? (
                      <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-app-tertiary/10 text-app-tertiary">Modified</span>
                    ) : null}
                  </div>
                </div>
                <h3 className={`text-sm font-semibold relative ${active ? 'text-app-fg' : 'text-app-fg-variant'}`}>{tmpl.label}</h3>
                <p className="text-[13px] text-app-outline-strong mt-1 line-clamp-2 relative">{tmpl.description || 'No description.'}</p>
                <p className="text-[11px] text-app-outline-strong mt-3 relative">
                  {tmpl.sections.length} Sections{tmpl.isCustom ? ' • Custom template' : ' • Built-in'}
                </p>
              </button>
            );
          })}
        </div>

        {/* RIGHT — detail editor */}
        <div className="col-span-12 md:col-span-8 min-h-0 bg-app-surface-low border border-app-surface-high rounded-xl flex flex-col overflow-hidden">
          {/* Editor header */}
          <div className="border-b border-app-surface-high p-4 md:p-6 bg-app-bg/80 backdrop-blur flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <input
                value={label}
                onChange={(e) => setDraftLabel(e.target.value)}
                aria-label="Template name"
                className="bg-transparent text-lg md:text-xl font-semibold text-app-fg outline-none min-w-0 flex-1 focus:border-b focus:border-app-primary/40"
              />
              {isDirty && (
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-app-surface-highest border border-app-outline text-app-fg-variant">
                  Draft
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  showPreview ? 'bg-app-surface-high text-app-primary' : 'text-app-fg-variant hover:text-app-fg hover:bg-app-surface-high'
                }`}
              >
                <Eye size={14} />
                Preview
              </button>
              {isModified && (
                <button
                  onClick={resetBuiltIn}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-app-outline text-xs font-medium text-app-fg-variant hover:text-app-fg hover:bg-app-surface-high transition-colors"
                  title="Reset to default"
                >
                  <RotateCcw size={14} />
                  Reset
                </button>
              )}
              {selected.isCustom && (
                <button
                  onClick={deleteCustom}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-app-error/40 text-xs font-medium text-app-error hover:bg-app-error/10 transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}
              <button
                onClick={saveEdit}
                disabled={!isDirty}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-app-inverse-primary bg-app-inverse-primary/20 text-xs font-medium text-app-primary hover:bg-app-inverse-primary/40 disabled:opacity-40 transition-colors"
              >
                <Save size={14} />
                Save Draft
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-3xl mx-auto flex flex-col gap-3">
              {/* Description */}
              <textarea
                value={description}
                onChange={(e) => setDraftDescription(e.target.value)}
                rows={2}
                placeholder="Brief description of this template…"
                aria-label="Template description"
                className="w-full bg-app-surface-lowest border border-app-outline rounded-lg px-4 py-2 text-sm text-app-fg-variant outline-none resize-vertical placeholder:text-app-outline-strong focus:border-action focus:ring-2 focus:ring-action/20 transition-all"
              />

              <div className="flex items-center gap-2 text-[13px] text-app-outline-strong mt-2 mb-1">
                <Info size={14} className="shrink-0" />
                Reorder sections with the arrows. Generated documents follow this hierarchy.
              </div>

              {showPreview ? (
                <div className="bg-app-bg border border-app-surface-high rounded-lg p-6">
                  <h3 className="text-base font-semibold text-app-fg mb-1">{label}</h3>
                  <p className="text-[13px] text-app-fg-variant mb-4">{description || 'No description.'}</p>
                  <ol className="flex flex-col gap-2">
                    {sections.map((section, i) => (
                      <li key={i} className="flex items-baseline gap-3 text-sm text-app-fg-variant">
                        <span className="text-xs text-app-outline-strong font-mono w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                        {section || <em className="text-app-outline-strong">Untitled section</em>}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <>
                  {sections.map((section, i) => (
                    <div
                      key={i}
                      className="group bg-app-bg border border-app-surface-high rounded-lg p-3 md:p-4 flex items-center gap-3 hover:border-action/50 transition-colors"
                    >
                      <GripVertical size={16} className="text-app-outline-strong group-hover:text-app-primary shrink-0" />
                      <span className="text-xs font-mono bg-app-surface px-1.5 py-0.5 rounded text-app-fg-variant shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <input
                        value={section}
                        onChange={(e) => updateSection(i, e.target.value)}
                        aria-label={`Section ${i + 1} title`}
                        className="flex-1 min-w-0 bg-transparent text-sm font-medium tracking-wide text-app-fg outline-none focus:border-b focus:border-app-primary/40"
                      />
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={() => moveSection(i, -1)}
                          disabled={i === 0}
                          className="w-7 h-7 flex items-center justify-center rounded text-app-fg-variant hover:text-app-primary hover:bg-app-surface-high disabled:opacity-30 transition-colors"
                          aria-label="Move section up"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={() => moveSection(i, 1)}
                          disabled={i === sections.length - 1}
                          className="w-7 h-7 flex items-center justify-center rounded text-app-fg-variant hover:text-app-primary hover:bg-app-surface-high disabled:opacity-30 transition-colors"
                          aria-label="Move section down"
                        >
                          <ChevronDown size={14} />
                        </button>
                        <button
                          onClick={() => removeSection(i)}
                          className="w-7 h-7 flex items-center justify-center rounded text-app-fg-variant hover:text-app-error hover:bg-app-error/10 transition-colors"
                          aria-label="Delete section"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add area */}
                  <button
                    onClick={addSection}
                    className="border-2 border-dashed border-app-surface-high rounded-lg h-24 md:h-32 flex flex-col items-center justify-center gap-2 text-app-outline-strong hover:text-app-primary hover:border-app-primary/50 hover:bg-action/5 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-full border border-current flex items-center justify-center">
                      <Plus size={16} />
                    </span>
                    <span className="text-sm font-medium">Add New Section Block</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Template Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNewModal(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Create Custom Template"
            className="relative w-full max-w-lg bg-app-surface border border-app-outline rounded-xl p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-app-fg">Create Custom Template</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-app-fg-variant hover:text-app-fg hover:bg-app-surface-high transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-app-fg-variant mb-1.5">Template Name *</label>
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Product Specification Document"
                className={modalInputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-app-fg-variant mb-1.5">Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Brief description of this template…"
                rows={2}
                className={`${modalInputClass} resize-vertical`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-app-fg-variant mb-2">Sections</label>
              <div className="flex flex-col gap-2">
                {newSections.map((sec, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={sec}
                      onChange={(e) => {
                        const updated = [...newSections];
                        updated[i] = e.target.value;
                        setNewSections(updated);
                      }}
                      placeholder={`Section ${i + 1}`}
                      className={modalInputClass}
                    />
                    {newSections.length > 1 && (
                      <button
                        onClick={() => setNewSections(newSections.filter((_, j) => j !== i))}
                        className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-app-fg-variant hover:text-app-error hover:bg-app-error/10 transition-colors"
                        aria-label={`Remove section ${i + 1}`}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setNewSections([...newSections, ''])}
                  className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-app-outline text-xs font-medium text-app-primary hover:bg-app-surface-high transition-colors"
                >
                  <Plus size={13} />
                  Add Section
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 rounded-lg border border-app-outline text-sm font-medium text-app-fg-variant hover:text-app-fg hover:bg-app-surface-high transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                disabled={!newLabel.trim()}
                className="px-4 py-2 rounded-lg bg-action hover:bg-action-hover text-white text-sm font-medium disabled:opacity-40 transition-colors"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
