'use client';

import React, { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { colors, typography, semantic, gradients, borderRadius } from '@/styles/theme';
import { flexCenter } from '@/styles/mixins';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    if (!auth) {
      setErrorMsg('Authentication is not available. Please check your configuration or try again later.');
      setStatus('error');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setStatus('success');
    } catch (err: unknown) {
      // Avoid leaking whether an email is registered — show a generic message
      // for all Firebase errors except network failures.
      const code = (err as { code?: string })?.code ?? '';
      if (code === 'auth/network-request-failed') {
        setErrorMsg('Network error. Please check your connection and try again.');
      } else {
        // Treat all other errors (including invalid-email, user-not-found) the
        // same way to avoid user enumeration.
        setErrorMsg('');
        setStatus('success');
        return;
      }
      setStatus('error');
    }
  };

  const logoStyle: CSSProperties = {
    position: 'absolute',
    top: '2rem',
    left: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: semantic.text.primary,
    fontWeight: typography.fontWeight.semibold,
  };

  const logoIconStyle: CSSProperties = {
    width: 28,
    height: 28,
    borderRadius: borderRadius.md,
    background: gradients.brand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: semantic.bg.primary }}>
      <div style={{ flex: 1, ...flexCenter, padding: '2rem', position: 'relative' }}>
        <Link href="/" style={logoStyle}>
          <div style={logoIconStyle}>
            <Sparkles size={14} color="#fff" />
          </div>
          Sunave
        </Link>

        <div style={{ width: '100%', maxWidth: '400px' }}>
          {status === 'success' ? (
            /* Success state */
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(34,197,94,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <CheckCircle size={32} color={colors.success[400]} />
              </div>
              <h1 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, marginBottom: '0.75rem' }}>
                Check your inbox
              </h1>
              <p style={{ color: semantic.text.secondary, lineHeight: 1.65, marginBottom: '2rem' }}>
                If an account exists for <strong style={{ color: semantic.text.primary }}>{email}</strong>, you'll receive a password reset link shortly.
              </p>
              <p style={{ fontSize: typography.fontSize.sm, color: semantic.text.muted, marginBottom: '2rem' }}>
                Didn't receive an email? Check your spam folder or{' '}
                <button
                  onClick={() => { setStatus('idle'); setEmail(''); }}
                  style={{ background: 'none', border: 'none', color: semantic.text.brand, cursor: 'pointer', fontSize: 'inherit', padding: 0 }}
                >
                  try again
                </button>
                .
              </p>
              <Link href="/login">
                <Button variant="secondary" fullWidth icon={<ArrowLeft size={16} />}>
                  Back to log in
                </Button>
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              <div style={{ marginBottom: '2rem' }}>
                <Link href="/login" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  color: semantic.text.muted,
                  textDecoration: 'none',
                  fontSize: typography.fontSize.sm,
                  marginBottom: '1.5rem',
                }}>
                  <ArrowLeft size={14} /> Back to log in
                </Link>
                <h1 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: semantic.text.primary, marginBottom: '0.5rem' }}>
                  Forgot your password?
                </h1>
                <p style={{ color: semantic.text.secondary, lineHeight: 1.6 }}>
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {status === 'error' && errorMsg && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: borderRadius.lg,
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: colors.danger[400],
                  fontSize: typography.fontSize.sm,
                  marginBottom: '1.5rem',
                }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail size={18} />}
                  required
                  autoComplete="email"
                />
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={status === 'loading'}
                  style={{ marginTop: '0.25rem' }}
                >
                  Send reset link
                </Button>
              </form>

              <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: typography.fontSize.sm, color: semantic.text.secondary }}>
                Don't have an account?{' '}
                <Link href="/signup" style={{ color: semantic.text.primary, fontWeight: typography.fontWeight.medium, textDecoration: 'none' }}>
                  Sign up
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right side visual panel */}
      <div className="forgot-visual-panel" style={{ flex: 1, background: semantic.bg.secondary, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />
        <div style={{ height: '100%', ...flexCenter, padding: '4rem', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={{ color: semantic.text.muted, fontSize: typography.fontSize.sm, textAlign: 'center', maxWidth: '260px', lineHeight: 1.65 }}>
            "Sunave has completely transformed how our BA team documents requirements. We cut documentation time by 70%."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: gradients.brand }} />
            <div>
              <p style={{ color: semantic.text.primary, fontWeight: typography.fontWeight.semibold, fontSize: typography.fontSize.sm }}>
                Sarah K.
              </p>
              <p style={{ color: semantic.text.muted, fontSize: typography.fontSize.xs }}>
                Lead BA, Fortune 500
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .forgot-visual-panel { display: none; }
        @media (min-width: 1024px) {
          .forgot-visual-panel { display: block !important; }
        }
      `}</style>
    </div>
  );
}
