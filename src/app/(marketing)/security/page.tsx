import type { Metadata } from 'next';
import React from 'react';
import { Shield, Lock, CheckCircle2, KeyRound, Users, Trash2, Server } from 'lucide-react';
import Reveal from '@/components/marketing/Reveal';

export const metadata: Metadata = {
  title: 'Security',
  description:
    'Sunave is built for high-stakes business environments. Local browser transcription, zero audio retention, end-to-end encryption, and compliance-ready controls.',
};

const privacyChecklist = [
  {
    title: 'Zero Audio Retention',
    desc: 'We do not store, process, or transmit raw audio files to our servers.',
  },
  {
    title: 'Local Transcription',
    desc: 'Speech-to-text happens entirely within your browser.',
  },
];

const complianceBadges = ['SOC2 Type II', 'GDPR', 'ISO 27001'];

const practices = [
  {
    icon: Lock,
    title: 'Encryption in Transit',
    desc: 'All traffic between your browser and our services is protected with TLS 1.3.',
  },
  {
    icon: Server,
    title: 'Encryption at Rest',
    desc: 'Transcripts and generated documents are encrypted at rest with AES-256.',
  },
  {
    icon: Users,
    title: 'Access Controls',
    desc: 'Role-based access with fine-grained permissions, MFA, and SSO for enterprise identity providers.',
  },
  {
    icon: Trash2,
    title: 'Data Deletion',
    desc: 'Right-to-erasure built in. Configure retention windows or delete your data on demand at any time.',
  },
];

export default function SecurityPage() {
  return (
    <div className="relative pt-24 pb-12 px-4 md:px-8 max-w-[1440px] mx-auto w-full flex flex-col gap-16">
      {/* Blur orb backdrop */}
      <div className="absolute inset-x-0 top-0 -z-10 flex justify-center opacity-20 pointer-events-none overflow-hidden">
        <div className="w-[700px] h-[500px] bg-mk-primary rounded-full blur-[130px] mix-blend-screen -translate-y-1/3" />
      </div>

      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto pt-8">
        <h1 className="font-display text-[56px] md:text-[72px] leading-[1.0] mb-8 bg-gradient-to-r from-mk-primary to-mk-primary-light bg-clip-text text-transparent">
          Uncompromising Security.
        </h1>
        <p className="text-lg text-mk-secondary font-light">
          Built for high-stakes business environments. We engineered Sunave AI from the ground up
          to ensure your most sensitive conversations remain private, compliant, and under your
          control.
        </p>
      </section>

      {/* Privacy anchor panel */}
      <Reveal>
        <section className="glass-panel rounded-xl p-8 md:p-16 relative overflow-hidden">
          <Shield
            size={280}
            className="absolute -top-10 -right-10 text-mk-primary opacity-10 pointer-events-none"
            strokeWidth={1}
          />
          <div className="relative max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-mk-primary/10 flex items-center justify-center shrink-0">
                <Lock size={22} className="text-mk-primary" />
              </div>
              <h2 className="font-display text-[32px] md:text-[40px] leading-tight text-mk-primary">
                Audio Never Leaves Your Browser.
              </h2>
            </div>
            <p className="text-mk-secondary font-light mb-10">
              Our core processing engine runs on the browser&apos;s native speech APIs. Voice is
              transcribed locally in your browser before text is sent to our secure AI models for
              insight generation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {privacyChecklist.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-mk-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-mk-fg font-medium mb-1">{item.title}</p>
                    <p className="text-sm text-mk-secondary font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Compliance badges */}
      <Reveal>
        <section className="flex flex-wrap items-center justify-center gap-4">
          {complianceBadges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-2 glass-panel rounded-full px-5 py-2.5 text-sm text-mk-fg"
            >
              <KeyRound size={14} className="text-mk-primary" />
              {badge}
            </span>
          ))}
        </section>
      </Reveal>

      {/* Practices grid */}
      <Reveal>
        <section>
          <h2 className="font-display text-[36px] md:text-[44px] text-mk-fg text-center mb-12">
            Security practices at every layer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {practices.map((practice) => (
              <div key={practice.title} className="glass-panel rounded-xl p-8">
                <div className="w-12 h-12 rounded-xl bg-mk-primary/10 flex items-center justify-center mb-6">
                  <practice.icon size={22} className="text-mk-primary" />
                </div>
                <h3 className="font-display text-xl text-mk-fg mb-3">{practice.title}</h3>
                <p className="text-sm text-mk-secondary font-light leading-relaxed">
                  {practice.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
