import type { Metadata } from 'next';
import React from 'react';
import { Lock, Globe, Headset, ArrowRight } from 'lucide-react';
import Reveal from '@/components/marketing/Reveal';
import EnterpriseForm from '@/components/marketing/EnterpriseForm';

export const metadata: Metadata = {
  title: 'Enterprise',
  description:
    'Deploy Sunave AI across your organization with enterprise-grade security, dedicated support, and scalable architecture designed for business analysts.',
};

const features = [
  {
    icon: Lock,
    title: 'SSO & Identity',
    desc: "Seamless integration with SAML, Okta, and Azure AD. Enforce your organization's security policies with zero friction.",
  },
  {
    icon: Globe,
    title: 'Data Residency',
    desc: 'Choose where your data lives. We offer secure, isolated deployments in India, EU, and US regions to meet compliance requirements.',
  },
  {
    icon: Headset,
    title: 'Dedicated Support',
    desc: '24/7 access to a dedicated Technical Account Manager. Priority resolution for analysts working on critical deliverables.',
  },
];

const caseStudies = [
  {
    eyebrow: 'Global Financial Services',
    stat: '+40%',
    label: 'Faster Data Extraction',
    desc: 'Reduced time spent manually reviewing transcripts, allowing analysts to focus on trend synthesis.',
  },
  {
    eyebrow: 'Top Tier Consultancy',
    stat: '15 hrs',
    label: 'Saved Per Week',
    desc: 'Automated meeting summaries and action items streamlined client communications across major engagements.',
  },
];

export default function EnterprisePage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <h1 className="font-display text-[48px] md:text-[64px] leading-[1.05] text-luminous mb-6">
            AI for High-Stakes Teams
          </h1>
          <p className="text-lg text-mk-secondary font-light mb-10 max-w-xl">
            Deploy Sunave AI across your organization with enterprise-grade security, dedicated
            support, and scalable architecture designed for business analysts.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm bg-mk-primary text-white px-8 py-4 rounded-xl glow-button font-medium"
          >
            Talk to Sales
            <ArrowRight size={16} />
          </a>
        </div>
        <div className="relative aspect-video rounded-xl border border-mk-outline overflow-hidden bg-mk-surface-low">
          <div className="absolute inset-0 bg-gradient-to-br from-mk-primary/25 via-transparent to-mk-primary-dark/30" />
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-mk-primary/30 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-mk-primary-dark/40 rounded-full blur-[90px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.35)]">
              <div className="w-10 h-10 rounded-full bg-mk-primary animate-ping opacity-20 absolute" />
              <Globe size={32} className="text-mk-primary-light relative" />
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <Reveal>
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass-panel rounded-xl p-8">
                <div className="w-12 h-12 rounded-lg bg-mk-primary/10 flex items-center justify-center mb-6">
                  <f.icon size={22} className="text-mk-primary" />
                </div>
                <h3 className="font-display text-2xl text-mk-fg mb-3">{f.title}</h3>
                <p className="text-sm text-mk-secondary font-light leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Case studies band */}
      <section className="bg-mk-surface-low border-y border-mk-outline/40 py-20">
        <Reveal>
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <h2 className="font-display text-[36px] md:text-[44px] text-mk-fg text-center mb-14">
              Proven ROI for Analysts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudies.map((cs) => (
                <div key={cs.eyebrow} className="glass-panel rounded-xl p-10">
                  <p className="text-[10px] text-mk-primary uppercase tracking-widest font-semibold mb-6">
                    {cs.eyebrow}
                  </p>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-display text-[48px] leading-none text-mk-fg">
                      {cs.stat}
                    </span>
                    <span className="text-mk-primary-light font-medium">{cs.label}</span>
                  </div>
                  <p className="text-sm text-mk-secondary font-light leading-relaxed mt-4">
                    {cs.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Lead form */}
      <section id="contact" className="py-24 px-4 scroll-mt-24">
        <Reveal>
          <div className="max-w-2xl mx-auto glass-panel rounded-xl p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="font-display text-[36px] md:text-[40px] text-mk-fg mb-3">
                Talk to Sales
              </h2>
              <p className="text-mk-secondary font-light">
                Request a demo or discuss custom deployment options.
              </p>
            </div>
            <EnterpriseForm />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
