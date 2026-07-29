'use client';

import React, { useState } from 'react';
import { User, Bell, Palette, Shield, Cpu, Eye, EyeOff, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useTheme, THEMES } from '@/features/theme/ThemeContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  linkWithCredential,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'providers', label: 'AI Providers', icon: Cpu },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
] as const;
type Section = (typeof SECTIONS)[number]['id'];

const SECTION_META: Record<Section, { title: string; description: string }> = {
  profile: { title: 'Profile', description: 'Your account details and default AI preferences.' },
  notifications: { title: 'Notifications', description: 'Choose how Sunave keeps you informed.' },
  providers: { title: 'AI Providers', description: 'The generation fallback chain, configured on the server.' },
  appearance: { title: 'Appearance', description: 'Personalize the look and feel of the app.' },
  security: { title: 'Security', description: 'Sign-in methods and password management.' },
};

const AI_PROVIDER_CHAIN = ['OpenRouter', 'Local LLM', 'OpenAI', 'Gemini', 'Claude'];

const inputClass =
  'w-full bg-app-surface-lowest border border-app-outline rounded-lg px-4 py-2 text-sm text-app-fg outline-none placeholder:text-app-outline-strong focus:border-action focus:ring-2 focus:ring-action/20 transition-all';
const labelClass = 'block text-sm font-medium text-app-fg-variant mb-1.5';
const panelClass = 'bg-app-surface border border-app-outline rounded-xl p-6';

export default function SettingsPage() {
  const { user, firebaseUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [aiTone, setAiTone] = useState(user?.preferences?.aiTone || 'professional');
  const [transcriptionMode, setTranscriptionMode] = useState(user?.preferences?.transcriptionMode || 'bot-free');
  const [emailNotif, setEmailNotif] = useState(user?.preferences?.notifications?.email ?? true);
  const [inAppNotif, setInAppNotif] = useState(user?.preferences?.notifications?.inApp ?? true);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const isGoogleOnly = firebaseUser?.providerData?.every((p) => p.providerId === 'google.com') ?? true;

  const handleSave = async () => {
    if (!user || !db) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, user.uid), {
        displayName,
        'preferences.aiTone': aiTone,
        'preferences.transcriptionMode': transcriptionMode,
        'preferences.notifications.email': emailNotif,
        'preferences.notifications.inApp': inAppNotif,
        updatedAt: new Date().toISOString(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPwError('');
    setPwSuccess('');
    if (!newPassword || newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match.');
      return;
    }
    if (!firebaseUser || !auth) return;
    setPwLoading(true);
    try {
      if (isGoogleOnly) {
        // Link email/password credential to Google account
        if (!currentPassword) {
          setPwError('Enter a password to set for your account.');
          setPwLoading(false);
          return;
        }
        const credential = EmailAuthProvider.credential(firebaseUser.email!, newPassword);
        await linkWithCredential(firebaseUser, credential);
        setPwSuccess('Password set successfully. You can now sign in with email and password.');
      } else {
        // Re-authenticate then update
        const credential = EmailAuthProvider.credential(firebaseUser.email!, currentPassword);
        await reauthenticateWithCredential(firebaseUser, credential);
        await updatePassword(firebaseUser, newPassword);
        setPwSuccess('Password updated successfully.');
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const { code, message } = (err ?? {}) as { code?: string; message?: string };
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setPwError('Current password is incorrect.');
      } else if (code === 'auth/provider-already-linked') {
        setPwError('Email/password is already linked. Use the update flow instead.');
      } else {
        setPwError(message || 'Failed to update password.');
      }
    } finally {
      setPwLoading(false);
    }
  };

  const meta = SECTION_META[activeSection];
  const showSaveFooter = activeSection === 'profile' || activeSection === 'notifications';

  const toggle = (value: boolean, onToggle: () => void, ariaLabel: string) => (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={value}
      aria-label={ariaLabel}
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-action' : 'bg-app-surface-highest'}`}
    >
      <span
        className="absolute rounded-full bg-white transition-all"
        style={{ top: 3, width: 18, height: 18, left: value ? 23 : 3 }}
      />
    </button>
  );

  return (
    <div className="p-4 md:p-8 flex flex-col md:flex-row gap-8 max-w-[1440px] mx-auto text-app-fg">
      {/* LEFT — tab rail */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-app-outline-strong px-3 mb-1">
          Configuration
        </span>
        {SECTIONS.map(({ id, label, icon: Icon }) => {
          const active = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                active ? 'bg-app-surface-high text-app-fg' : 'text-app-fg-variant hover:bg-app-surface-high hover:text-app-fg'
              }`}
            >
              <Icon size={17} className={active ? 'text-app-primary' : 'text-app-outline-strong'} />
              {label}
            </button>
          );
        })}
      </div>

      {/* RIGHT — content */}
      <div className="flex-1 max-w-[800px] flex flex-col gap-6 min-w-0">
        <div>
          <h3 className="text-xl font-semibold text-app-fg">{meta.title}</h3>
          <p className="text-sm text-app-fg-variant mt-1">{meta.description}</p>
        </div>

        {activeSection === 'profile' && (
          <div className={`${panelClass} flex flex-col gap-5`}>
            <div>
              <label className={labelClass}>Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={user?.email || ''} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
              <p className="text-xs text-app-outline-strong mt-1.5">Email is managed through your Google account.</p>
            </div>

            <div>
              <label className={labelClass}>Plan</label>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-app-inverse-primary/20 text-app-primary border border-app-inverse-primary/30">
                  {user?.plan?.toUpperCase() || 'FREE'}
                </span>
                <span className="text-sm text-app-outline-strong">
                  {user?.plan === 'free' ? 'Upgrade to Pro for unlimited access' : 'Active subscription'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Default AI Tone</label>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value as 'professional' | 'casual' | 'technical' | 'executive')}
                  className={inputClass}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="technical">Technical</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Default Transcription Mode</label>
                <select
                  value={transcriptionMode}
                  onChange={(e) => setTranscriptionMode(e.target.value as 'bot-free' | 'ai-assistant')}
                  className={inputClass}
                >
                  <option value="bot-free">Bot-Free Mode</option>
                  <option value="ai-assistant">AI Assistant Mode</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className={`${panelClass} flex flex-col gap-3`}>
            {[
              { label: 'Email notifications', desc: 'Summaries and generated documents in your inbox.', key: 'email', value: emailNotif, setter: setEmailNotif },
              { label: 'In-app notifications', desc: 'Alerts inside the Sunave workspace.', key: 'inApp', value: inAppNotif, setter: setInAppNotif },
            ].map(({ label, desc, key, value, setter }) => (
              <div key={key} className="flex items-center justify-between gap-4 px-4 py-3.5 bg-app-surface-lowest border border-app-outline/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-app-fg">{label}</div>
                  <div className="text-xs text-app-outline-strong mt-0.5">{desc}</div>
                </div>
                {toggle(value, () => setter(!value), label)}
              </div>
            ))}
          </div>
        )}

        {activeSection === 'providers' && (
          <div className={`${panelClass} flex flex-col gap-3`}>
            <p className="text-[13px] text-app-outline-strong">
              Document generation tries each provider in order until one succeeds.
            </p>
            {AI_PROVIDER_CHAIN.map((name, i) => (
              <div key={name} className="flex items-center gap-4 px-4 py-3.5 bg-app-surface-lowest border border-app-outline/50 rounded-lg">
                <span className="w-7 h-7 shrink-0 rounded-md bg-app-surface-high text-app-primary text-xs font-mono font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-app-fg">{name}</div>
                  <div className="text-xs text-app-outline-strong mt-0.5">Configured via server environment</div>
                </div>
                <Cpu size={16} className="text-app-outline-strong shrink-0" />
              </div>
            ))}
          </div>
        )}

        {activeSection === 'appearance' && (
          <div className={panelClass}>
            <label className={`${labelClass} mb-4`}>Theme</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEMES.map((t) => {
                const isActive = theme === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`flex flex-col gap-3 p-4 rounded-xl text-left transition-colors border-2 ${
                      isActive
                        ? 'bg-app-inverse-primary/10 border-app-inverse-primary'
                        : 'bg-app-surface-lowest border-app-outline/50 hover:border-app-outline'
                    }`}
                  >
                    <div
                      className="w-full h-14 rounded-md border border-app-outline/30 flex items-center justify-center gap-2 overflow-hidden"
                      style={{ background: t.preview.bg }}
                    >
                      <span className="w-8 h-1.5 rounded-full" style={{ background: t.preview.accent }} />
                      <span className="w-5 h-1.5 rounded-full opacity-50" style={{ background: t.preview.text }} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-app-fg">{t.label}</span>
                        {isActive && <Check size={14} className="text-app-primary" />}
                      </div>
                      <div className="text-xs text-app-outline-strong mt-1">{t.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="flex flex-col gap-6">
            {/* Auth method */}
            <div className={`${panelClass} flex items-center justify-between gap-4`}>
              <div>
                <div className="text-sm font-medium text-app-fg">Google Sign-In</div>
                <div className="text-xs text-app-outline-strong mt-0.5">Connected via {user?.email}</div>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-green-400/10 text-green-400">
                Active
              </span>
            </div>

            {/* Change / Set Password */}
            <div className={`${panelClass} flex flex-col gap-4`}>
              <div>
                <div className="text-sm font-semibold text-app-fg">
                  {isGoogleOnly ? 'Set a Password' : 'Change Password'}
                </div>
                <div className="text-xs text-app-outline-strong mt-0.5">
                  {isGoogleOnly
                    ? 'Add an email/password sign-in option to your account.'
                    : 'Update your account password.'}
                </div>
              </div>

              {!isGoogleOnly && (
                <div>
                  <label className={labelClass}>Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current password"
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-app-outline-strong hover:text-app-fg transition-colors"
                      aria-label={showCurrentPw ? 'Hide current password' : 'Show current password'}
                    >
                      {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className={labelClass}>New Password</label>
                <div className="relative">
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-app-outline-strong hover:text-app-fg transition-colors"
                    aria-label={showNewPw ? 'Hide new password' : 'Show new password'}
                  >
                    {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className={inputClass}
                />
              </div>

              {pwError && (
                <div className="px-4 py-2.5 rounded-lg bg-app-error/10 border border-app-error/30 text-sm text-app-error">
                  {pwError}
                </div>
              )}
              {pwSuccess && (
                <div className="px-4 py-2.5 rounded-lg bg-green-400/10 border border-green-400/20 text-sm text-green-400">
                  {pwSuccess}
                </div>
              )}

              <button
                onClick={handleChangePassword}
                disabled={pwLoading}
                className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-action hover:bg-action-hover text-white text-sm font-medium disabled:opacity-50 transition-colors"
              >
                {pwLoading && <Loader2 size={14} className="animate-spin" />}
                {isGoogleOnly ? 'Set Password' : 'Update Password'}
              </button>
            </div>
          </div>
        )}

        {showSaveFooter && (
          <div className="flex justify-end items-center gap-4 pt-2">
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm text-green-400">
                <Check size={14} />
                Changes saved
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-action hover:bg-action-hover text-white text-sm font-medium disabled:opacity-50 transition-colors"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
