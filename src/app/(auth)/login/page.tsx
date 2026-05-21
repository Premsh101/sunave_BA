'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Mail, Lock, Globe } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { colors, typography, semantic } from '@/styles/theme';
import { flexCenter } from '@/styles/mixins';
import { gradientText } from '@/styles/mixins';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithGoogle, user, loading } = useAuth();
  
  const redirect = searchParams?.get('redirect') || '/dashboard';

  // Auto-redirect already-authenticated users (e.g. after page refresh or
  // when onAuthStateChanged resolves while the user is on /login).
  useEffect(() => {
    if (!loading && user) {
      router.replace(redirect);
    }
  }, [loading, user, redirect, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!auth) {
      setError('Authentication is not available. Please check your configuration or try again later.');
      setIsLoading(false);
      return;
    }
    
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      // Ensure session cookie is set before navigating so middleware allows access.
      const idToken = await credential.user.getIdToken();
      const sessionRes = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (!sessionRes.ok) {
        throw new Error('Failed to create session. Please try again.');
      }
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);
    
    try {
      const credential = await signInWithGoogle();
      // Ensure session cookie is set before navigating so middleware allows access.
      const idToken = await credential.user.getIdToken();
      const sessionRes = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (!sessionRes.ok) {
        throw new Error('Failed to create session. Please try again.');
      }
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: semantic.bg.primary }}>
      {/* Left side - Login Form */}
      <div style={{ flex: 1, ...flexCenter, padding: '2rem', position: 'relative', zIndex: 10 }}>
        
        <Link href="/" style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: semantic.text.primary, fontWeight: 600 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${colors.brand[500]}, ${colors.accent[500]})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={14} color="#fff" />
          </div>
          Sunave
        </Link>

        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: typography.fontSize['3xl'], fontWeight: 700, color: semantic.text.primary, marginBottom: '0.5rem' }}>
              Welcome back
            </h1>
            <p style={{ color: semantic.text.secondary }}>Log in to your workspace.</p>
          </div>

          {error && (
            <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: colors.danger[400], fontSize: typography.fontSize.sm, marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          <Button 
            variant="secondary" 
            fullWidth 
            icon={<Globe size={18} />} 
            onClick={handleGoogleLogin}
            loading={isGoogleLoading}
            disabled={isLoading}
            style={{ marginBottom: '1.5rem' }}
          >
            Continue with Google
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '1px', background: semantic.border.secondary }} />
            <span style={{ fontSize: typography.fontSize.sm, color: semantic.text.muted }}>or continue with email</span>
            <div style={{ flex: 1, height: '1px', background: semantic.border.secondary }} />
          </div>

          <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input 
              type="email" 
              placeholder="name@company.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              icon={<Mail size={18} />} 
              required
            />
            <Input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              icon={<Lock size={18} />} 
              required
            />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link href="/forgot-password" style={{ fontSize: typography.fontSize.sm, color: semantic.text.brand, textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" fullWidth loading={isLoading} disabled={isGoogleLoading} style={{ marginTop: '0.5rem' }}>
              Log in
            </Button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: typography.fontSize.sm, color: semantic.text.secondary }}>
            Don't have an account?{' '}
            <Link href="/signup" style={{ color: semantic.text.primary, fontWeight: 500, textDecoration: 'none' }}>
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="login-visual-panel" style={{ flex: 1, background: semantic.bg.secondary, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />
        
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
          <Card variant="glass" style={{ width: '100%', maxWidth: '500px', transform: 'perspective(1000px) rotateY(-10deg) rotateX(5deg)', boxShadow: '20px 20px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
            </div>
            <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: 600, color: semantic.text.primary, marginBottom: '1rem' }}>
              <span style={gradientText()}>AI-Generated BRD</span>
            </h3>
            <div style={{ width: '100%', height: '16px', background: semantic.bg.tertiary, borderRadius: '4px', marginBottom: '0.5rem' }} />
            <div style={{ width: '80%', height: '16px', background: semantic.bg.tertiary, borderRadius: '4px', marginBottom: '2rem' }} />
            <div style={{ width: '40%', height: '16px', background: semantic.bg.brandSubtle, borderRadius: '4px', marginBottom: '0.5rem' }} />
            <div style={{ width: '100%', height: '16px', background: semantic.bg.tertiary, borderRadius: '4px', marginBottom: '0.5rem' }} />
            <div style={{ width: '90%', height: '16px', background: semantic.bg.tertiary, borderRadius: '4px' }} />
          </Card>
        </div>
      </div>

      <style>{`
        .login-visual-panel { display: none; }
        @media (min-width: 1024px) {
          .login-visual-panel { display: block !important; }
        }
      `}</style>
    </div>
  );
}
