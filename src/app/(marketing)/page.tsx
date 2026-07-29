import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  AudioLines,
  PlayCircle,
  BrainCircuit,
  FileText,
  ListTodo,
  Layers,
  MessagesSquare,
  Shield,
  Terminal,
} from 'lucide-react';
import ShaderBackground from '@/components/marketing/ShaderBackground';
import Hero3DPipeline from '@/components/marketing/Hero3DPipeline';
import Reveal from '@/components/marketing/Reveal';

const chartBars = [
  { height: '30%', primary: false },
  { height: '60%', primary: false },
  { height: '45%', primary: false },
  { height: '85%', primary: true },
  { height: '50%', primary: false },
];

export default function MarketingHome() {
  return (
    <>
      <ShaderBackground />
      <div className="relative z-10 pt-16 pb-16">
        {/* Hero */}
        <section className="min-h-[92vh] flex flex-col items-center justify-center px-4 md:px-6 max-w-[1440px] mx-auto relative -mt-16 pt-28 pb-8 lg:pt-20">
          <div className="text-center z-20 max-w-4xl mx-auto mb-4 md:mb-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel mb-8">
              <span className="w-2 h-2 rounded-full bg-mk-teal animate-pulse shadow-[0_0_8px_#5eead4]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-eyebrow">
                Introducing Sunave 2.0
              </span>
            </div>
            <h1 className="font-display text-[52px] md:text-[72px] leading-[1.02] mb-6 italic text-luminous drop-shadow-[0_0_40px_rgba(139,92,246,0.25)]">
              Your meetings,
              <br />
              distilled to brilliance.
            </h1>
            <p className="text-lg text-mk-body max-w-2xl mx-auto mb-8 font-light">
              Sunave listens to the whole room, transcribes it live in your browser, and hands back
              the requirements documents you would otherwise have written by hand.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto text-sm bg-mk-primary text-white px-8 py-4 rounded-xl glow-button flex items-center justify-center gap-2 font-medium"
              >
                Start Your Free Trial
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/features"
                className="w-full sm:w-auto text-sm glass-panel text-mk-fg px-8 py-4 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                <PlayCircle size={18} />
                View Demo
              </Link>
            </div>
          </div>

          {/* 3D pipeline: soundwave enters the engine, documents come out */}
          <div className="relative w-full max-w-6xl mx-auto">
            <Hero3DPipeline className="h-[260px] sm:h-[320px] md:h-[380px] w-full" />

            {/* Stage captions, aligned under the three zones of the scene */}
            <div className="grid grid-cols-3 gap-2 md:gap-8 mt-2 md:-mt-4 px-2">
              {[
                { icon: AudioLines, label: 'Meeting audio in', tint: 'text-mk-primary-light' },
                { icon: BrainCircuit, label: 'Sunave engine', tint: 'text-mk-fg' },
                { icon: FileText, label: 'Documents out', tint: 'text-mk-teal' },
              ].map((stage) => (
                <div key={stage.label} className="flex flex-col items-center gap-2 text-center">
                  <stage.icon size={16} className={stage.tint} />
                  <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.16em] text-mk-muted">
                    {stage.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-6 py-16">
          <Reveal>
            <div className="text-center mb-24">
              <h2 className="font-display text-[40px] md:text-[48px] text-luminous mb-6">
                Intelligence at every layer
              </h2>
              <p className="text-lg text-mk-secondary max-w-2xl mx-auto font-light">
                Sunave&apos;s architecture is designed to understand context, extract nuance, and
                generate comprehensive documentation instantly.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(320px,auto)]">
              {/* Feature 1: Contextual Conversation Parsing */}
              <div className="md:col-span-2 glass-panel rounded-2xl p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-mk-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-mk-primary/10 transition-colors duration-700 pointer-events-none" />
                <div className="w-12 h-12 rounded-xl bg-mk-primary/10 flex items-center justify-center mb-6">
                  <MessagesSquare size={22} className="text-mk-primary" />
                </div>
                <h3 className="font-display text-[32px] text-mk-fg mb-4">
                  Contextual Conversation Parsing
                </h3>
                <p className="text-mk-secondary font-light">
                  Our models don&apos;t just transcribe; they understand intent, tone, and implicit
                  agreements, turning messy discussions into structured data.
                </p>
                <div className="mt-12 h-40 rounded-xl border border-white/5 relative overflow-hidden flex items-end p-6 gap-3 bg-black/20">
                  {chartBars.map((bar, i) => (
                    <div
                      key={i}
                      className={`w-10 rounded-t ${
                        bar.primary ? 'bg-mk-primary/30 animate-pulse' : 'bg-white/5'
                      }`}
                      style={{ height: bar.height }}
                    />
                  ))}
                </div>
              </div>

              {/* Feature 2: Template Studio */}
              <div className="glass-panel rounded-2xl p-10">
                <div className="w-12 h-12 rounded-xl bg-mk-primary/10 flex items-center justify-center mb-6">
                  <Layers size={22} className="text-mk-primary" />
                </div>
                <h3 className="font-display text-[32px] text-mk-fg mb-4">Template Studio</h3>
                <p className="text-mk-secondary font-light mb-8">
                  Define exactly how your outputs should look. Sunave shapes every meeting into your
                  organization&apos;s formats automatically.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-black/20 rounded-xl px-4 py-3">
                    <FileText size={16} className="text-mk-primary" />
                    <span className="text-sm text-mk-fg">PRD Output</span>
                  </div>
                  <div className="flex items-center gap-3 bg-black/20 rounded-xl px-4 py-3">
                    <ListTodo size={16} className="text-mk-primary" />
                    <span className="text-sm text-mk-fg">Jira Tickets</span>
                  </div>
                </div>
              </div>

              {/* Feature 3: Enterprise Grade */}
              <div className="glass-panel rounded-2xl p-10 relative">
                <span className="absolute top-6 right-6 text-[10px] uppercase tracking-widest text-mk-primary-light bg-mk-primary/10 border border-mk-primary/20 px-3 py-1 rounded-full">
                  SOC2 Type II
                </span>
                <div className="w-12 h-12 rounded-xl bg-mk-primary/10 flex items-center justify-center mb-6">
                  <Shield size={22} className="text-mk-primary" />
                </div>
                <h3 className="font-display text-[32px] text-mk-fg mb-4">Enterprise Grade</h3>
                <p className="text-mk-secondary font-light">
                  Your data remains yours. End-to-end encryption with zero-retention policies
                  available.
                </p>
              </div>

              {/* Feature 4: Prompt Studio Environment */}
              <div className="md:col-span-2 glass-panel rounded-2xl p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-mk-primary/10 flex items-center justify-center mb-6">
                    <Terminal size={22} className="text-mk-primary" />
                  </div>
                  <h3 className="font-display text-[32px] text-mk-fg mb-4">
                    Prompt Studio Environment
                  </h3>
                  <p className="text-mk-secondary font-light mb-6">
                    Craft, test, and version the prompts that power your document generation. Full
                    control for power users, sensible defaults for everyone else.
                  </p>
                  <Link
                    href="/prompt-studio"
                    className="inline-flex items-center gap-2 text-sm text-mk-primary-light hover:text-mk-primary transition-colors"
                  >
                    Explore Studio
                    <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="rounded-xl bg-[#020408] border border-white/5 p-5 font-mono text-xs leading-relaxed overflow-x-auto">
                  <div className="flex gap-1.5 mb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <pre className="text-mk-secondary whitespace-pre">
                    <code>
                      <span className="text-mk-primary-light">import</span>
                      {' { MeetingAnalyzer } '}
                      <span className="text-mk-primary-light">from</span>{' '}
                      <span className="text-emerald-400">&apos;@sunave/core&apos;</span>;{'\n\n'}
                      <span className="text-mk-primary-light">const</span>
                      {' analyzer = '}
                      <span className="text-mk-primary-light">new</span>
                      {' MeetingAnalyzer();\n'}
                      <span className="text-mk-primary-light">const</span>
                      {' insights = '}
                      <span className="text-mk-primary-light">await</span>
                      {' analyzer.extract({\n  type: document.type.PRD,\n  confidenceThreshold: '}
                      <span className="text-emerald-400">0.98</span>
                      {',\n});'}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
}
