'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Check, CreditCard, ExternalLink } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { PLANS } from '@/types/billing';

declare global {
  interface Window {
    Razorpay: any;
  }
}

function formatPrice(paise: number): string {
  if (paise < 0) return 'Custom';
  if (paise === 0) return '₹0';
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

export default function BillingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const currentPlan = user?.plan || 'free';
  const [payingPlanId, setPayingPlanId] = useState<string | null>(null);
  const [payError, setPayError] = useState('');

  const handleUpgrade = async (planId: string, planName: string, amountPaise: number) => {
    if (!user) return;
    setPayError('');
    setPayingPlanId(planId);
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, amount: amountPaise, currency: 'INR', userId: user.uid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Sunave',
        description: `${planName} Plan`,
        order_id: data.orderId,
        prefill: {
          email: user.email,
          name: user.displayName,
        },
        theme: { color: '#6366F1' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                userId: user.uid,
                planId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || 'Verification failed');

            // Update local Firestore user doc so UI reflects new plan immediately
            if (db) {
              await updateDoc(doc(db, COLLECTIONS.USERS, user.uid), {
                plan: planId,
                updatedAt: new Date().toISOString(),
              });
            }
            setPayingPlanId(null);
            router.refresh();
          } catch (err: any) {
            setPayError(err.message || 'Payment verification failed. Contact support.');
          }
        },
        modal: {
          ondismiss: () => setPayingPlanId(null),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setPayError(err.message || 'Payment initiation failed. Please try again.');
      setPayingPlanId(null);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="px-4 md:px-8 pt-8 pb-12 max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-[32px] font-semibold text-app-fg mb-1">
            Billing &amp; Plans
          </h2>
          <p className="text-app-fg-variant">Manage your subscription and billing details.</p>
        </div>

        {/* Current Plan Banner */}
        <div className="rounded-xl border border-app-outline bg-app-surface-low p-5 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-app-primary-container/20 flex items-center justify-center shrink-0">
              <CreditCard size={20} className="text-app-primary" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-app-outline-strong">
                Current Plan
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-lg font-semibold text-app-fg">
                  {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
                </span>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                    currentPlan === 'free'
                      ? 'bg-app-surface-highest text-app-fg-variant border-app-outline'
                      : 'bg-app-primary/10 text-app-primary border-app-primary/20'
                  }`}
                >
                  {currentPlan === 'free' ? 'Free' : 'Active'}
                </span>
              </div>
            </div>
          </div>
          {currentPlan === 'free' && (
            <div className="flex flex-wrap gap-2">
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full border bg-app-tertiary/10 text-app-tertiary border-app-tertiary/20">
                5 meetings/month
              </span>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full border bg-app-tertiary/10 text-app-tertiary border-app-tertiary/20">
                3 AI docs/month
              </span>
            </div>
          )}
        </div>

        {payError && (
          <div className="mb-6 px-5 py-3.5 rounded-lg border border-app-error/30 bg-app-error/10 text-app-error text-sm">
            {payError}
          </div>
        )}

        {/* Plans */}
        <h3 className="text-lg font-semibold text-app-fg mb-6">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {PLANS.map((plan) => {
            const isCurrent = plan.tier === currentPlan;
            const isPayingThis = payingPlanId === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-xl border p-6 ${
                  plan.isPopular
                    ? 'border-app-primary/60 bg-app-surface shadow-[0_0_40px_rgba(128,131,255,0.12)]'
                    : 'border-app-outline bg-app-surface-low'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-action text-white px-3.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap tracking-wider">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-semibold text-app-fg">{plan.name}</h4>
                    {isCurrent && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border bg-app-primary/10 text-app-primary border-app-primary/20">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="mt-3 mb-1 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-app-fg">
                      {formatPrice(plan.priceMonthly)}
                    </span>
                    {plan.priceMonthly > 0 && (
                      <span className="text-sm text-app-outline-strong">/mo</span>
                    )}
                  </div>
                  <p className="text-sm text-app-fg-variant">{plan.description}</p>
                </div>

                <div className="flex-1 flex flex-col gap-2.5 mb-6">
                  {plan.features.map((feature) => (
                    <div key={feature.name} className="flex items-center gap-2.5">
                      <Check
                        size={15}
                        className={`shrink-0 ${
                          feature.included ? 'text-app-primary' : 'text-app-outline-strong'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          feature.included ? 'text-app-fg' : 'text-app-outline-strong'
                        }`}
                      >
                        {feature.name}
                        {feature.detail && (
                          <span className="text-app-outline-strong"> — {feature.detail}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {isCurrent ? (
                  <button
                    disabled
                    className="w-full rounded-lg bg-app-surface-highest text-app-fg-variant text-sm font-semibold py-2.5 cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : plan.tier === 'enterprise' ? (
                  <Link
                    href="/enterprise"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-app-outline text-app-fg text-sm font-semibold py-2.5 hover:border-app-primary/40 hover:text-app-primary transition-colors"
                  >
                    Contact Sales
                    <ExternalLink size={14} />
                  </Link>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id, plan.name, plan.priceMonthly)}
                    disabled={isPayingThis}
                    className={`w-full rounded-lg text-sm font-semibold py-2.5 transition-colors ${
                      plan.isPopular
                        ? 'bg-action hover:bg-action-hover text-white disabled:opacity-60'
                        : 'border border-app-outline text-app-fg hover:border-app-primary/40 hover:text-app-primary disabled:opacity-60'
                    }`}
                  >
                    {isPayingThis
                      ? 'Processing…'
                      : currentPlan === 'free'
                        ? `Upgrade to ${plan.name}`
                        : 'Switch Plan'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Usage Summary */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-app-fg mb-5">Usage This Month</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Meetings', used: user?.usage?.meetingsThisMonth ?? 0, limit: currentPlan === 'free' ? 5 : -1 },
              { label: 'AI Documents', used: user?.usage?.documentsGenerated ?? 0, limit: currentPlan === 'free' ? 3 : -1 },
              { label: 'Transcription Minutes', used: user?.usage?.transcriptionMinutes ?? 0, limit: currentPlan === 'free' ? 300 : -1 },
            ].map(({ label, used, limit }) => (
              <div key={label} className="rounded-xl border border-app-outline bg-app-surface-low p-4">
                <div className="text-sm text-app-fg-variant mb-2">{label}</div>
                <div className="text-xl font-semibold text-app-fg mb-2">
                  {used}
                  {limit > 0 && (
                    <span className="text-sm font-normal text-app-outline-strong"> / {limit}</span>
                  )}
                  {limit === -1 && (
                    <span className="text-sm font-normal text-app-outline-strong"> / ∞</span>
                  )}
                </div>
                {limit > 0 && (
                  <div className="w-full h-1 rounded-full bg-app-surface-highest overflow-hidden">
                    <div
                      className={`h-full rounded-full ${used >= limit ? 'bg-app-error' : 'bg-app-primary-container'}`}
                      style={{ width: `${Math.min(100, (used / limit) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
