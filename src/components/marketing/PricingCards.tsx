'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

type Billing = 'monthly' | 'annual';
type Currency = 'USD' | 'INR';

interface Plan {
  name: string;
  description: string;
  price: Record<Currency, Record<Billing, string>>;
  period: string;
  cta: string;
  ctaHref: string;
  featuresIntro?: string;
  features: string[];
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Free',
    description: "Perfect for trying out Sunave's basic capabilities.",
    price: {
      USD: { monthly: '$0', annual: '$0' },
      INR: { monthly: '₹0', annual: '₹0' },
    },
    period: '/mo',
    cta: 'Get Started Free',
    ctaHref: '/signup',
    features: ['2 Transcription Hours/mo', 'Basic AI Document Types', 'Community Support'],
  },
  {
    name: 'Pro',
    description: 'For analysts needing serious data density.',
    price: {
      USD: { monthly: '$49', annual: '$39' },
      INR: { monthly: '₹1,499', annual: '₹1,199' },
    },
    period: '/mo',
    cta: 'Start Free 14-Day Trial',
    ctaHref: '/signup',
    featuresIntro: 'Everything in Free, plus:',
    features: [
      '50 Transcription Hours/mo',
      'All AI Document Types',
      'Custom Prompt Studio',
      'Priority Email Support',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    description: 'Scalable security and control for large organizations.',
    price: {
      USD: { monthly: 'Custom', annual: 'Custom' },
      INR: { monthly: 'Custom', annual: 'Custom' },
    },
    period: '',
    cta: 'Contact Sales',
    ctaHref: '/enterprise#contact',
    featuresIntro: 'Everything in Pro, plus:',
    features: [
      'Unlimited Transcription',
      'SSO (SAML/Okta)',
      'Dedicated Success Manager',
      'Advanced Admin Controls',
    ],
  },
];

export default function PricingCards() {
  const [billing, setBilling] = useState<Billing>('monthly');
  const [currency, setCurrency] = useState<Currency>('USD');

  return (
    <div className="w-full flex flex-col items-center">
      {/* Billing toggle */}
      <div className="relative glass-panel rounded-full p-1 flex items-center mb-4">
        <span
          className={`absolute top-1 bottom-1 rounded-full bg-mk-primary transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
            billing === 'monthly' ? 'left-1 w-[104px]' : 'left-[105px] w-[168px]'
          }`}
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={() => setBilling('monthly')}
          className={`relative z-10 w-[104px] py-2 rounded-full text-sm font-medium transition-colors ${
            billing === 'monthly' ? 'text-white' : 'text-mk-secondary hover:text-mk-fg'
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setBilling('annual')}
          className={`relative z-10 w-[168px] py-2 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            billing === 'annual' ? 'text-white' : 'text-mk-secondary hover:text-mk-fg'
          }`}
        >
          Annual
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
              billing === 'annual' ? 'bg-white/20 text-white' : 'bg-mk-primary/10 text-mk-primary-light'
            }`}
          >
            Save 20%
          </span>
        </button>
      </div>

      {/* Currency switch */}
      <div className="flex items-center gap-1 text-xs text-mk-secondary mb-14">
        {(['USD', 'INR'] as const).map((c, i) => (
          <React.Fragment key={c}>
            {i > 0 && <span className="text-mk-outline">|</span>}
            <button
              type="button"
              onClick={() => setCurrency(c)}
              className={`px-2 py-1 rounded-md transition-colors ${
                currency === c ? 'text-mk-primary-light font-semibold' : 'hover:text-mk-fg'
              }`}
            >
              {c}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Pricing grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-start">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl p-8 flex flex-col ${
              plan.highlighted
                ? 'glass-panel md:-translate-y-4 border !border-mk-primary shadow-[0_0_40px_rgba(139,92,246,0.25)]'
                : 'glass-panel'
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-mk-primary text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                Best Value
              </span>
            )}
            <h3
              className={`font-display text-2xl mb-2 ${
                plan.highlighted ? 'text-mk-primary-light' : 'text-mk-fg'
              }`}
            >
              {plan.name}
            </h3>
            <p className="text-sm text-mk-secondary font-light mb-6 min-h-10">{plan.description}</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-semibold text-mk-fg">
                {plan.price[currency][billing]}
              </span>
              {plan.period && <span className="text-sm text-mk-secondary">{plan.period}</span>}
            </div>
            <Link
              href={plan.ctaHref}
              className={`w-full text-center text-sm px-6 py-3 rounded-xl font-medium transition-all mb-8 ${
                plan.highlighted
                  ? 'bg-mk-primary text-white glow-button'
                  : 'border border-mk-outline text-mk-fg hover:bg-white/5 hover:border-mk-primary/50'
              }`}
            >
              {plan.cta}
            </Link>
            {plan.featuresIntro && (
              <p className="text-xs text-mk-secondary uppercase tracking-widest mb-4">
                {plan.featuresIntro}
              </p>
            )}
            <ul className="flex flex-col gap-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-mk-secondary">
                  <Check size={16} className="text-mk-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
