'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { Check, CreditCard, ExternalLink } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/features/auth/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { typography, semantic, colors, gradients } from '@/styles/theme';
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
            window.location.reload();
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
      <div style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: typography.fontSize['2xl'], fontWeight: 700, color: semantic.text.primary, marginBottom: '0.25rem' }}>
            Billing & Plans
          </h1>
          <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm }}>
            Manage your subscription and billing details
          </p>
        </div>

        {/* Current Plan Banner */}
        <Card style={{ background: semantic.bg.secondary, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: semantic.bg.brandSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={20} color={colors.brand[400]} />
            </div>
            <div>
              <div style={{ fontSize: typography.fontSize.sm, color: semantic.text.muted }}>Current Plan</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: typography.fontSize.lg, fontWeight: 600, color: semantic.text.primary }}>
                  {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
                </span>
                <Badge variant={currentPlan === 'free' ? 'neutral' : 'brand'}>
                  {currentPlan === 'free' ? 'Free' : 'Active'}
                </Badge>
              </div>
            </div>
          </div>
          {currentPlan === 'free' && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Badge variant="warning">5 meetings/month</Badge>
              <Badge variant="warning">3 AI docs/month</Badge>
            </div>
          )}
        </Card>

        {payError && (
          <div style={{ marginBottom: '1.5rem', padding: '0.875rem 1.25rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: semantic.text.danger, fontSize: typography.fontSize.sm }}>
            {payError}
          </div>
        )}

        {/* Plans */}
        <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, color: semantic.text.primary, marginBottom: '1.5rem' }}>
          Available Plans
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          {PLANS.map((plan) => {
            const isCurrent = plan.tier === currentPlan;
            const isPayingThis = payingPlanId === plan.id;
            return (
              <Card
                key={plan.id}
                variant={plan.isPopular ? 'gradient' : 'elevated'}
                style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}
              >
                {plan.isPopular && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: colors.brand[500], color: '#fff', padding: '3px 14px',
                    borderRadius: '999px', fontSize: typography.fontSize.xs, fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: 600, color: plan.isPopular ? '#fff' : semantic.text.primary }}>
                      {plan.name}
                    </h3>
                    {isCurrent && <Badge variant="success">Current</Badge>}
                  </div>
                  <div style={{ marginTop: '0.75rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{ fontSize: typography.fontSize['3xl'], fontWeight: 700, color: plan.isPopular ? '#fff' : semantic.text.primary }}>
                      {formatPrice(plan.priceMonthly)}
                    </span>
                    {plan.priceMonthly >= 0 && plan.priceMonthly > 0 && (
                      <span style={{ color: plan.isPopular ? 'rgba(255,255,255,0.7)' : semantic.text.muted, fontSize: typography.fontSize.sm }}>/mo</span>
                    )}
                  </div>
                  <p style={{ fontSize: typography.fontSize.sm, color: plan.isPopular ? 'rgba(255,255,255,0.75)' : semantic.text.secondary }}>
                    {plan.description}
                  </p>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
                  {plan.features.map((feature) => (
                    <div key={feature.name} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <Check size={15} color={plan.isPopular ? '#fff' : feature.included ? colors.success[400] : semantic.text.muted} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: typography.fontSize.sm, color: plan.isPopular ? (feature.included ? '#fff' : 'rgba(255,255,255,0.5)') : (feature.included ? semantic.text.primary : semantic.text.muted) }}>
                        {feature.name}
                        {feature.detail && <span style={{ color: plan.isPopular ? 'rgba(255,255,255,0.6)' : semantic.text.muted }}> — {feature.detail}</span>}
                      </span>
                    </div>
                  ))}
                </div>

                {isCurrent ? (
                  <Button variant="secondary" fullWidth disabled>Current Plan</Button>
                ) : plan.tier === 'enterprise' ? (
                  <Link href="/enterprise">
                    <Button variant={plan.isPopular ? 'primary' : 'secondary'} fullWidth iconRight={<ExternalLink size={14} />}>
                      Contact Sales
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant={plan.isPopular ? 'primary' : 'secondary'}
                    fullWidth
                    loading={isPayingThis}
                    onClick={() => handleUpgrade(plan.id, plan.name, plan.priceMonthly)}
                  >
                    {currentPlan === 'free' ? `Upgrade to ${plan.name}` : 'Switch Plan'}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        {/* Usage Summary */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, color: semantic.text.primary, marginBottom: '1.25rem' }}>
            Usage This Month
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Meetings', used: user?.usage?.meetingsThisMonth ?? 0, limit: currentPlan === 'free' ? 5 : -1 },
              { label: 'AI Documents', used: user?.usage?.documentsGenerated ?? 0, limit: currentPlan === 'free' ? 3 : -1 },
              { label: 'Transcription Minutes', used: user?.usage?.transcriptionMinutes ?? 0, limit: currentPlan === 'free' ? 300 : -1 },
            ].map(({ label, used, limit }) => (
              <Card key={label} style={{ background: semantic.bg.secondary }}>
                <div style={{ fontSize: typography.fontSize.sm, color: semantic.text.secondary, marginBottom: '0.5rem' }}>{label}</div>
                <div style={{ fontSize: typography.fontSize.xl, fontWeight: 600, color: semantic.text.primary, marginBottom: '0.5rem' }}>
                  {used}
                  {limit > 0 && <span style={{ fontSize: typography.fontSize.sm, fontWeight: 400, color: semantic.text.muted }}> / {limit}</span>}
                  {limit === -1 && <span style={{ fontSize: typography.fontSize.sm, fontWeight: 400, color: semantic.text.muted }}> / ∞</span>}
                </div>
                {limit > 0 && (
                  <div style={{ width: '100%', height: 4, background: semantic.bg.tertiary, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, (used / limit) * 100)}%`, height: '100%', background: used >= limit ? colors.danger[500] : gradients.brand }} />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
