import type { Metadata } from 'next';
import React from 'react';
import PricingCards from '@/components/marketing/PricingCards';
import Reveal from '@/components/marketing/Reveal';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    "Simple, transparent pricing for every team. Power your business analysis with Sunave — choose the plan that fits your team's needs.",
};

const faqs = [
  {
    q: 'Can I switch plans later?',
    a: 'Yes, you can upgrade or downgrade your plan at any time from your billing settings.',
  },
  {
    q: "What counts as a 'Transcription Hour'?",
    a: 'Any audio or video processed by our engine is billed by the minute, rounded up to the nearest minute.',
  },
];

export default function PricingPage() {
  return (
    <div className="relative pt-24 pb-16 px-4 md:px-8 max-w-[1200px] mx-auto w-full flex flex-col items-center">
      {/* Blur orb backdrop */}
      <div className="absolute inset-x-0 top-0 -z-10 flex justify-center opacity-20 pointer-events-none overflow-hidden">
        <div className="w-[600px] h-[500px] bg-mk-primary rounded-full blur-[130px] mix-blend-screen -translate-y-1/3" />
      </div>

      {/* Hero */}
      <div className="text-center mb-12 pt-8">
        <h1 className="font-display text-[48px] md:text-[64px] leading-[1.05] text-mk-fg mb-6">
          Simple, transparent pricing.
        </h1>
        <p className="text-lg text-mk-secondary max-w-xl mx-auto font-light">
          Power your business analysis with Sunave. Choose the plan that fits your team&apos;s
          needs.
        </p>
      </div>

      <Reveal className="w-full">
        <PricingCards />
      </Reveal>

      {/* FAQ */}
      <Reveal className="w-full">
        <section className="mt-24 w-full">
          <h2 className="font-display text-[36px] md:text-[40px] text-mk-fg text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq) => (
              <div key={faq.q} className="glass-panel rounded-2xl p-8">
                <h3 className="font-display text-xl text-mk-fg mb-3">{faq.q}</h3>
                <p className="text-sm text-mk-secondary font-light leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
