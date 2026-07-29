'use client';

import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Folder,
  ChevronDown,
  History,
  Save,
  Play,
  SlidersHorizontal,
  MessagesSquare,
  Brain,
  Copy,
  RotateCcw,
  Loader2,
  Check,
} from 'lucide-react';
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

const SAMPLE_TRANSCRIPT = `Priya: Thanks everyone for joining. Today we need to finalize the scope for the customer portal revamp.
Daniel: The main ask from sales is single sign-on and a self-service billing page.
Priya: Agreed. Let's commit to SSO for Q3. Daniel, can you own the vendor evaluation by next Friday?
Daniel: Yes, I'll have a shortlist ready.
Meera: One risk — the billing API is still on the legacy stack. We may need a migration first.
Priya: Noted. Let's flag that as a dependency and revisit in Thursday's architecture sync.`;

const MODEL_OPTIONS = [
  { value: 'auto', label: 'Auto (OpenRouter → Local → OpenAI → Gemini → Claude)' },
  { value: 'openrouter', label: 'OpenRouter' },
  { value: 'local', label: 'Local LLM' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'claude', label: 'Claude' },
];

interface RunMeta {
  provider?: string;
  model?: string;
  elapsedMs: number;
}

export default function PromptStudioPage() {
  const [overrides, setOverrides] = useState<Record<string, Partial<PromptConfig>>>({});
  const [selectedType, setSelectedType] = useState<DocumentType>('brd');
  const [treeOpen, setTreeOpen] = useState(true);

  // Draft state: null = untouched (mirror the saved/resolved config)
  const [draftLabel, setDraftLabel] = useState<string | null>(null);
  const [draftRole, setDraftRole] = useState<string | null>(null);
  const [draftText, setDraftText] = useState<string | null>(null);

  // Model configuration (session-local — the original page did not persist these)
  const [model, setModel] = useState('auto');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [responseFormat, setResponseFormat] = useState('markdown');

  // Test area / output
  const [testText, setTestText] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [runMeta, setRunMeta] = useState<RunMeta | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOverrides(loadOverrides());
  }, []);

  const getConfig = (cfg: PromptConfig): PromptConfig => {
    const override = overrides[cfg.type];
    return override ? { ...cfg, ...override } : cfg;
  };

  const selectedDefault = DEFAULT_PROMPT_CONFIGS.find((c) => c.type === selectedType) ?? DEFAULT_PROMPT_CONFIGS[0];
  const resolved = getConfig(selectedDefault);
  const resolvedText = resolved.keyInstructions.join('\n');

  const label = draftLabel ?? resolved.label;
  const role = draftRole ?? resolved.systemRole;
  const editorText = draftText ?? resolvedText;
  const isDirty = label !== resolved.label || role !== resolved.systemRole || editorText !== resolvedText;
  const isModified = !!overrides[selectedType];

  const selectPrompt = (type: DocumentType) => {
    setSelectedType(type);
    setDraftLabel(null);
    setDraftRole(null);
    setDraftText(null);
  };

  const saveEdit = () => {
    const keyInstructions = editorText.split('\n').map((l) => l.replace(/^[-•]\s*/, '').trim()).filter(Boolean);
    const newOverrides = {
      ...overrides,
      [selectedType]: { label: label.trim() || resolved.label, systemRole: role, keyInstructions },
    };
    setOverrides(newOverrides);
    saveOverrides(newOverrides);
    setDraftLabel(null);
    setDraftRole(null);
    setDraftText(null);
  };

  const resetToDefault = () => {
    const newOverrides = { ...overrides };
    delete newOverrides[selectedType];
    setOverrides(newOverrides);
    saveOverrides(newOverrides);
    setDraftLabel(null);
    setDraftRole(null);
    setDraftText(null);
  };

  const runTest = async () => {
    if (!testText.trim() || running) return;
    setRunning(true);
    setRunError(null);
    setRunMeta(null);
    const start = performance.now();
    try {
      const systemInstructions = `You are a ${role}.\n\nKey Instructions:\n${editorText
        .split('\n')
        .map((l) => l.replace(/^[-•]\s*/, '').trim())
        .filter(Boolean)
        .map((l) => `- ${l}`)
        .join('\n')}`;
      const res = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: testText,
          customPrompt: `${systemInstructions}\n\nTranscript:\n"""${testText}"""`,
        }),
      });
      const data: { document?: string; provider?: string; model?: string; error?: string } = await res.json();
      const elapsedMs = Math.round(performance.now() - start);
      if (!res.ok) {
        setRunError(data.error || `Request failed (${res.status})`);
        setRunMeta({ elapsedMs });
      } else {
        setOutput(data.document || '');
        setRunMeta({ provider: data.provider, model: data.model, elapsedMs });
      }
    } catch (err) {
      setRunError(err instanceof Error ? err.message : 'Network request failed');
      setRunMeta({ elapsedMs: Math.round(performance.now() - start) });
    } finally {
      setRunning(false);
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  };

  const lineCount = Math.max(editorText.split('\n').length, 8);

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden text-app-fg">
      {/* LEFT PANE — Explorer */}
      <aside className="hidden lg:flex w-[280px] shrink-0 flex-col bg-app-surface-low border-r border-app-outline">
        <div className="h-10 flex items-center justify-between px-4 border-b border-app-outline/50">
          <span className="text-xs font-semibold uppercase tracking-widest text-app-fg-variant">Explorer</span>
          <div className="flex items-center gap-1">
            <button
              onClick={resetToDefault}
              disabled={!isModified}
              title="Reset selected prompt to default"
              aria-label="Reset selected prompt to default"
              className="w-6 h-6 flex items-center justify-center rounded text-app-fg-variant hover:text-app-primary hover:bg-app-surface-high disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2 px-2">
          <button
            onClick={() => setTreeOpen(!treeOpen)}
            className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-app-fg-variant hover:text-app-fg transition-colors"
          >
            <ChevronDown size={14} className={`transition-transform ${treeOpen ? '' : '-rotate-90'}`} />
            <Folder size={14} className="text-app-tertiary" />
            <span className="uppercase tracking-wide">Document Prompts</span>
          </button>
          {treeOpen && (
            <div className="mt-1 flex flex-col gap-0.5 pl-3">
              {DEFAULT_PROMPT_CONFIGS.map((cfg) => {
                const c = getConfig(cfg);
                const active = selectedType === cfg.type;
                const modified = !!overrides[cfg.type];
                return (
                  <button
                    key={cfg.type}
                    onClick={() => selectPrompt(cfg.type)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-left text-[13px] transition-colors ${
                      active
                        ? 'bg-app-inverse-primary/10 text-app-primary border border-app-inverse-primary/20'
                        : 'text-app-fg-variant border border-transparent hover:bg-app-surface-high hover:text-app-fg'
                    }`}
                  >
                    <Terminal size={13} className={active ? 'text-app-primary' : 'text-app-outline-strong'} />
                    <span className="truncate flex-1">{c.label}</span>
                    {modified && <span className="w-1.5 h-1.5 rounded-full bg-app-tertiary shrink-0" title="Modified" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-app-outline/50 text-[11px] text-app-outline-strong leading-relaxed">
          Changes are saved locally to your browser. Reset restores the built-in defaults.
        </div>
      </aside>

      {/* CENTER PANE — Editor */}
      <section className="flex-1 min-w-0 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 shrink-0 border-b border-app-outline bg-app-bg flex items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Terminal size={18} className="text-app-primary shrink-0" />
            <input
              value={label}
              onChange={(e) => setDraftLabel(e.target.value)}
              aria-label="Prompt name"
              className="bg-transparent text-lg md:text-xl font-semibold text-app-fg outline-none min-w-0 flex-1 focus:border-b focus:border-app-primary/40"
            />
            {isDirty && (
              <span className="hidden sm:inline-flex shrink-0 items-center px-2.5 py-1 rounded-full bg-app-surface-highest border border-app-outline text-xs text-app-fg-variant">
                Unsaved Changes
              </span>
            )}
            {isModified && !isDirty && (
              <span className="hidden sm:inline-flex shrink-0 items-center px-2.5 py-1 rounded-full bg-app-tertiary/10 border border-app-tertiary/30 text-xs text-app-tertiary">
                Modified
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-app-outline text-xs font-medium text-app-fg-variant hover:text-app-fg hover:bg-app-surface-high transition-colors"
              title="Version history"
            >
              <History size={14} />
              Versions
            </button>
            <button
              onClick={saveEdit}
              disabled={!isDirty}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-app-inverse-primary text-white text-xs font-medium hover:brightness-110 disabled:opacity-40 transition-all"
            >
              <Save size={14} />
              Save
            </button>
            <button
              onClick={runTest}
              disabled={running || !testText.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-action hover:bg-action-hover text-white text-xs font-medium disabled:opacity-40 transition-colors"
              title={testText.trim() ? 'Run the prompt against the test transcript' : 'Paste a transcript in the Test Area first'}
            >
              {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              Run Test
            </button>
          </div>
        </div>

        {/* Role field */}
        <div className="shrink-0 border-b border-app-outline bg-app-surface-lowest px-4 md:px-6 py-2.5 flex items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-app-outline-strong shrink-0">AI Role</span>
          <input
            value={role}
            onChange={(e) => setDraftRole(e.target.value)}
            placeholder="e.g. Expert Business Analyst"
            aria-label="AI role / persona"
            className="flex-1 bg-transparent font-mono text-sm text-app-primary outline-none placeholder:text-app-outline-strong"
          />
        </div>

        {/* Editor area — key instructions, one per line */}
        <div className="flex-1 min-h-0 bg-app-surface-lowest relative">
          <div className="absolute inset-y-0 left-0 w-12 bg-app-surface border-r border-app-outline/50 pt-4 text-right pr-2 select-none overflow-hidden" aria-hidden="true">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="font-mono text-xs leading-6 text-app-outline-strong/60">{i + 1}</div>
            ))}
          </div>
          <textarea
            value={editorText}
            onChange={(e) => setDraftText(e.target.value)}
            spellCheck={false}
            aria-label="Key AI instructions, one per line"
            placeholder="One key instruction per line…"
            className="w-full h-full bg-transparent font-mono text-sm leading-6 text-app-fg resize-none outline-none p-4 pl-16 placeholder:text-app-outline-strong"
          />
        </div>

        {/* Config panel */}
        <div className="h-48 shrink-0 border-t border-app-outline bg-app-surface flex flex-col overflow-y-auto">
          <div className="flex items-center gap-2 px-4 md:px-6 pt-3 pb-2">
            <SlidersHorizontal size={14} className="text-app-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-app-fg-variant">Model Configuration</span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-4 md:px-6 pb-4">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-app-outline-strong">Model</span>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-app-surface-lowest border border-app-outline rounded-lg px-2.5 py-1.5 text-xs text-app-fg outline-none focus:border-action"
              >
                {MODEL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-app-outline-strong">Temperature — {temperature.toFixed(1)}</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="accent-action mt-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-app-outline-strong">Max Tokens</span>
              <input
                type="number"
                min={256}
                max={32768}
                step={256}
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="bg-app-surface-lowest border border-app-outline rounded-lg px-2.5 py-1.5 text-xs text-app-fg outline-none focus:border-action"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-app-outline-strong">Response Format</span>
              <select
                value={responseFormat}
                onChange={(e) => setResponseFormat(e.target.value)}
                className="bg-app-surface-lowest border border-app-outline rounded-lg px-2.5 py-1.5 text-xs text-app-fg outline-none focus:border-action"
              >
                <option value="markdown">Markdown</option>
                <option value="json">JSON</option>
                <option value="text">Text</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      {/* RIGHT PANE — Test Area + AI Output */}
      <aside className="hidden xl:flex w-[420px] shrink-0 flex-col border-l border-app-outline">
        {/* Test Area */}
        <div className="h-1/2 flex flex-col border-b border-app-outline">
          <div className="h-10 shrink-0 flex items-center justify-between px-4 bg-app-surface-low border-b border-app-outline/50">
            <div className="flex items-center gap-2">
              <MessagesSquare size={14} className="text-app-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-app-fg-variant">Test Area (Transcript)</span>
            </div>
            <button
              onClick={() => setTestText(SAMPLE_TRANSCRIPT)}
              className="text-[11px] font-medium text-app-primary hover:underline"
            >
              Load Sample
            </button>
          </div>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            spellCheck={false}
            placeholder="Paste sample transcript here to test the prompt..."
            className="flex-1 bg-app-surface-lowest text-sm text-app-fg-variant font-mono resize-none outline-none p-4 placeholder:text-app-outline-strong"
          />
        </div>

        {/* AI Output */}
        <div className="h-1/2 flex flex-col">
          <div className="h-10 shrink-0 flex items-center justify-between px-4 bg-app-surface-low border-b border-app-outline/50">
            <div className="flex items-center gap-2">
              <Brain size={14} className="text-app-tertiary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-app-fg-variant">AI Output</span>
            </div>
            <button
              onClick={copyOutput}
              disabled={!output}
              className="w-6 h-6 flex items-center justify-center rounded text-app-fg-variant hover:text-app-primary hover:bg-app-surface-high disabled:opacity-30 transition-colors"
              title="Copy output"
              aria-label="Copy output"
            >
              {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            </button>
          </div>
          <div className="flex-1 overflow-auto bg-[#0d1117] p-4">
            {running ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-app-fg-variant">
                <Loader2 size={22} className="animate-spin text-app-primary" />
                <span className="text-xs">Generating document…</span>
              </div>
            ) : runError ? (
              <pre className="font-mono text-xs leading-5 text-app-error whitespace-pre-wrap">{runError}</pre>
            ) : output ? (
              <pre className="font-mono text-xs leading-5 text-app-fg whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-app-outline-strong">
                Run a test to see generated output here.
              </div>
            )}
          </div>
          {/* Status bar */}
          <div className="h-8 shrink-0 bg-app-surface-lowest border-t border-app-outline flex items-center justify-between px-4 text-[11px] text-app-fg-variant">
            <div className="flex items-center gap-1.5">
              {running ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-app-tertiary animate-pulse" />
                  <span>Running…</span>
                </>
              ) : runError ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-app-error" />
                  <span className="text-app-error">Error{runMeta ? ` (${runMeta.elapsedMs}ms)` : ''}</span>
                </>
              ) : runMeta ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span>Success ({runMeta.elapsedMs}ms)</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-app-outline-strong" />
                  <span>Idle</span>
                </>
              )}
            </div>
            <span className="truncate max-w-[220px] font-mono">
              {runMeta?.provider ? `${runMeta.provider}${runMeta.model ? ` · ${runMeta.model}` : ''}` : ''}
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
