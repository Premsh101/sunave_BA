import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  PlayCircle,
  BrainCircuit,
  FileText,
  FileCode2,
  ListTodo,
  Layers,
  MessagesSquare,
  Shield,
  Terminal,
} from 'lucide-react';
import ShaderBackground from '@/components/marketing/ShaderBackground';
import Reveal from '@/components/marketing/Reveal';

const pulseBars = [
  { width: 'w-16', delay: '0ms' },
  { width: 'w-24', delay: '100ms' },
  { width: 'w-12', delay: '200ms' },
  { width: 'w-32', delay: '300ms' },
  { width: 'w-20', delay: '400ms' },
];

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
        <section className="min-h-screen flex flex-col items-center justify-center px-4 md:px-6 max-w-[1440px] mx-auto relative -mt-16 pt-32 lg:pt-16">
          <div className="text-center z-20 max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel mb-8">
              <span className="w-2 h-2 rounded-full bg-mk-primary animate-pulse shadow-[0_0_8px_#8b5cf6]" />
              <span className="text-xs text-mk-fg tracking-wider">Introducing Sunave 2.0</span>
            </div>
            <h1 className="font-display text-[56px] md:text-[80px] leading-[1.0] mb-8 text-mk-fg drop-shadow-2xl italic">
              Your meetings,
              <br />
              distilled to brilliance.
            </h1>
            <p className="text-lg text-mk-secondary max-w-2xl mx-auto mb-10 font-light">
              Transform raw conversation into structured intelligence. Experience the clarity of
              automated documentation driven by cognitive AI.
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

          {/* Visual metaphor: sound → AI core → documents */}
          <div className="relative w-full max-w-5xl mx-auto h-[400px]">
            <div className="absolute inset-0 flex items-center justify-center gap-8 md:gap-16">
              {/* Sound (left) */}
              <div className="w-1/3 h-full flex flex-col items-end justify-center gap-2 opacity-60 pr-8 border-r border-white/10 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-32 bg-mk-primary/20 blur-[50px] rounded-full" />
                {pulseBars.map((bar) => (
                  <div
                    key={bar.delay}
                    className={`h-1 ${bar.width} bg-gradient-to-l from-mk-primary to-transparent rounded-full animate-pulse`}
                    style={{ animationDelay: bar.delay }}
                  />
                ))}
              </div>
              {/* AI core (center) */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                  <div className="w-8 h-8 rounded-full bg-mk-primary animate-ping opacity-20 absolute" />
                  <BrainCircuit size={24} className="text-white relative" />
                </div>
              </div>
              {/* Documents (right) */}
              <div className="w-1/3 h-full flex flex-col justify-center gap-6 pl-8 relative z-10">
                <div className="doc-skeleton rounded-xl p-4 w-64 transform rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                    <FileText size={16} className="text-mk-secondary" />
                    <span className="text-[10px] text-mk-secondary uppercase tracking-widest">
                      Business Requirements
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-3/4 bg-white/10 rounded" />
                    <div className="h-2 w-full bg-white/5 rounded" />
                    <div className="h-2 w-5/6 bg-white/5 rounded" />
                  </div>
                </div>
                <div className="doc-skeleton rounded-xl p-4 w-64 transform -rotate-1 hover:rotate-0 transition-transform duration-500 shadow-2xl -ml-4">
                  <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                    <FileCode2 size={16} className="text-mk-primary" />
                    <span className="text-[10px] text-mk-secondary uppercase tracking-widest">
                      Technical Spec
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-2/3 bg-white/10 rounded" />
                    <div className="h-2 w-full bg-white/5 rounded" />
                    <div className="flex gap-2">
                      <div className="h-6 w-1/3 bg-mk-primary/10 rounded border border-mk-primary/20" />
                      <div className="h-6 w-1/3 bg-mk-primary/10 rounded border border-mk-primary/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-6 py-16">
          <Reveal>
            <div className="text-center mb-24">
              <h2 className="font-display text-[40px] md:text-[48px] text-mk-fg mb-6">
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
