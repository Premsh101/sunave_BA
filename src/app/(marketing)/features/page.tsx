import type { Metadata } from 'next';
import React from 'react';
import { Mic, Volume2, Play, Check, ArrowRight } from 'lucide-react';
import Reveal from '@/components/marketing/Reveal';

export const metadata: Metadata = {
  title: 'Features',
  description:
    "Explore Sunave's full suite of AI meeting intelligence: omnidirectional capture, neural playback, and a resilient multi-provider processing core.",
};

const waveformBars = [
  { height: 'h-10', opacity: 'bg-mk-primary/40', duration: '1.1s', delay: '0s' },
  { height: 'h-20', opacity: 'bg-mk-primary/60', duration: '0.9s', delay: '0.15s' },
  { height: 'h-14', opacity: 'bg-mk-primary/50', duration: '1.3s', delay: '0.3s' },
  { height: 'h-28', opacity: 'bg-mk-primary', duration: '0.8s', delay: '0.1s' },
  { height: 'h-16', opacity: 'bg-mk-primary/70', duration: '1.2s', delay: '0.25s' },
  { height: 'h-24', opacity: 'bg-mk-primary/50', duration: '1s', delay: '0.4s' },
  { height: 'h-12', opacity: 'bg-mk-primary/40', duration: '1.4s', delay: '0.2s' },
];

const providers = [
  { name: 'OpenRouter', label: 'Primary', active: true, opacity: '' },
  { name: 'Local LLM', label: 'Fallback 1', active: false, opacity: 'opacity-80' },
  { name: 'OpenAI', label: 'Fallback 2', active: false, opacity: 'opacity-70' },
  { name: 'Gemini', label: 'Fallback 3', active: false, opacity: 'opacity-60' },
  { name: 'Claude', label: 'Fallback 4', active: false, opacity: 'opacity-50' },
];

export default function FeaturesPage() {
  return (
    <div className="relative z-10 pt-16 pb-16">
      {/* Hero */}
      <section className="flex flex-col items-center text-center mb-16 relative pt-32 lg:pt-16 px-4 max-w-[1440px] mx-auto">
        <div className="absolute inset-0 -z-10 flex justify-center items-center opacity-20 pointer-events-none">
          <div className="w-[600px] h-[600px] bg-mk-primary rounded-full blur-[120px] mix-blend-screen" />
        </div>
        <span className="text-mk-primary text-xs uppercase tracking-widest mb-2 font-semibold">
          Core Capabilities
        </span>
        <h1 className="font-display text-[56px] md:text-[80px] leading-[1.0] mb-8 text-mk-fg">
          Uncompromising <br />
          Audio Intelligence.
        </h1>
        <p className="text-lg text-mk-secondary max-w-2xl mx-auto mb-8 font-light">
          Sunave seamlessly bridges the gap between spoken word and actionable data. Capture every
          detail with pristine accuracy, synthesize it instantly, and never lose a thought.
        </p>
      </section>

      {/* Bento */}
      <section className="max-w-[1440px] mx-auto px-4 mb-16">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Omnidirectional Capture */}
            <div className="md:col-span-8 glass-panel rounded-2xl p-10 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-mk-primary/10 flex items-center justify-center mb-6">
                <Mic size={22} className="text-mk-primary" />
              </div>
              <h3 className="font-display text-[32px] text-mk-fg mb-4">Omnidirectional Capture</h3>
              <p className="text-mk-secondary font-light mb-8 max-w-xl">
                Simultaneously record browser tab audio and your local microphone. Perfect for
                hybrid meetings, webinars, and dual-source analysis without complex virtual cables.
              </p>
              <div className="h-48 bg-black/20 rounded-xl relative flex items-end justify-center gap-3 p-6 overflow-hidden">
                <div className="absolute top-4 left-4 flex items-center gap-2 glass-panel rounded-full px-3 py-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] text-mk-fg uppercase tracking-widest">
                    REC Multi-Track
                  </span>
                </div>
                {waveformBars.map((bar, i) => (
                  <div
                    key={i}
                    className={`w-3 rounded-full ${bar.height} ${bar.opacity} animate-pulse`}
                    style={{ animationDuration: bar.duration, animationDelay: bar.delay }}
                  />
                ))}
              </div>
            </div>

            {/* Neural Playback */}
            <div className="md:col-span-4 glass-panel rounded-2xl p-10 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-mk-primary/10 flex items-center justify-center mb-6">
                <Volume2 size={22} className="text-mk-primary" />
              </div>
              <h3 className="font-display text-[32px] text-mk-fg mb-4">Neural Playback</h3>
              <p className="text-mk-secondary font-light mb-8">
                Convert any generated summary, document, or transcript back into natural-sounding
                speech for hands-free review.
              </p>
              <div className="mt-auto bg-black/20 rounded-xl p-5">
                <p className="text-xs text-mk-secondary uppercase tracking-widest mb-4">
                  Summary.txt
                </p>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    aria-label="Play summary"
                    className="w-11 h-11 rounded-full bg-mk-primary flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(139,92,246,0.5)] glow-button"
                  >
                    <Play size={16} className="text-white ml-0.5" fill="currentColor" />
                  </button>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-mk-primary rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Provider Fallback */}
      <section className="mb-16 py-12 border-y border-white/5 max-w-[1440px] mx-auto px-4">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="font-display text-[40px] md:text-[48px] text-mk-fg mb-6">
              Resilient Processing Core
            </h2>
            <p className="text-lg text-mk-secondary max-w-2xl mx-auto font-light">
              Never experience downtime during critical analysis. Sunave utilizes an intelligent
              routing engine that seamlessly cascades between top-tier AI providers if latency
              spikes or limits are reached.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
            {providers.map((provider, i) => (
              <React.Fragment key={provider.name}>
                {i > 0 && (
                  <ArrowRight
                    size={20}
                    className="text-mk-secondary/50 shrink-0 rotate-90 lg:rotate-0"
                  />
                )}
                <div
                  className={`glass-panel rounded-2xl p-8 flex flex-col items-center gap-4 w-full max-w-[220px] transition-opacity duration-300 hover:opacity-100 ${
                    provider.opacity
                  } ${
                    provider.active
                      ? 'border !border-mk-primary/60 shadow-[0_0_30px_rgba(139,92,246,0.2)]'
                      : ''
                  }`}
                >
                  <span
                    className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full ${
                      provider.active
                        ? 'bg-mk-primary text-white'
                        : 'bg-white/5 text-mk-secondary border border-white/10'
                    }`}
                  >
                    {provider.label}
                  </span>
                  <div className="relative w-16 h-16 rounded-full bg-black/30 border border-white/10 flex items-center justify-center">
                    <span className="text-[11px] text-mk-fg font-semibold text-center leading-tight px-1">
                      {provider.name}
                    </span>
                    {provider.active && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-mk-secondary">
                    {provider.active ? 'Active' : 'Standby'}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
