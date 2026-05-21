'use client';

import React, { useState } from 'react';
import { User, Bell, Globe, Palette, Shield, Eye, EyeOff, Check } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/features/auth/AuthContext';
import { useTheme, THEMES } from '@/features/theme/ThemeContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { typography, semantic, colors } from '@/styles/theme';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  linkWithCredential,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

const SECTION_ICONS: Record<string, React.ReactNode> = {
  profile: <User size={18} />,
  notifications: <Bell size={18} />,
  language: <Globe size={18} />,
  appearance: <Palette size={18} />,
  security: <Shield size={18} />,
};

const SECTIONS = ['profile', 'notifications', 'appearance', 'security'] as const;
type Section = typeof SECTIONS[number];

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
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setPwError('Current password is incorrect.');
      } else if (err.code === 'auth/provider-already-linked') {
        setPwError('Email/password is already linked. Use the update flow instead.');
      } else {
        setPwError(err.message || 'Failed to update password.');
      }
    } finally {
      setPwLoading(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize.sm,
    fontWeight: 500,
    color: semantic.text.secondary,
    marginBottom: '0.5rem',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.625rem 0.875rem',
    background: semantic.bg.tertiary,
    border: `1px solid ${semantic.border.primary}`,
    borderRadius: '8px',
    color: semantic.text.primary,
    fontSize: typography.fontSize.sm,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const sidebarLinkStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.625rem 0.875rem',
    borderRadius: '8px',
    fontSize: typography.fontSize.sm,
    fontWeight: active ? 500 : 400,
    color: active ? semantic.text.brand : semantic.text.secondary,
    background: active ? semantic.bg.brandSubtle : 'transparent',
    cursor: 'pointer',
    border: 'none',
    textAlign: 'left',
    width: '100%',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: typography.fontSize['2xl'], fontWeight: 700, color: semantic.text.primary, marginBottom: '0.25rem' }}>
          Settings
        </h1>
        <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm }}>
          Manage your account, preferences, and notifications
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem' }}>
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {SECTIONS.map((s) => (
            <button key={s} style={sidebarLinkStyle(activeSection === s)} onClick={() => setActiveSection(s)}>
              <span style={{ color: activeSection === s ? semantic.text.brand : semantic.text.muted }}>
                {SECTION_ICONS[s]}
              </span>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <Card>
          {activeSection === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, color: semantic.text.primary }}>Profile</h2>

              <div>
                <label style={labelStyle}>Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={inputStyle}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  style={{ ...inputStyle, opacity: 0.6 }}
                />
                <p style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, marginTop: '0.375rem' }}>
                  Email is managed through your Google account.
                </p>
              </div>

              <div>
                <label style={labelStyle}>Plan</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Badge variant="brand">{user?.plan?.toUpperCase() || 'FREE'}</Badge>
                  <span style={{ fontSize: typography.fontSize.sm, color: semantic.text.muted }}>
                    {user?.plan === 'free' ? 'Upgrade to Pro for unlimited access' : 'Active subscription'}
                  </span>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Default AI Tone</label>
                <select value={aiTone} onChange={(e) => setAiTone(e.target.value as 'professional' | 'casual' | 'technical' | 'executive')} style={inputStyle}>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="technical">Technical</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Default Transcription Mode</label>
                <select value={transcriptionMode} onChange={(e) => setTranscriptionMode(e.target.value as 'bot-free' | 'ai-assistant')} style={inputStyle}>
                  <option value="bot-free">Bot-Free Mode</option>
                  <option value="ai-assistant">AI Assistant Mode</option>
                </select>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, color: semantic.text.primary }}>Notifications</h2>

              {[
                { label: 'Email notifications', key: 'email', value: emailNotif, setter: setEmailNotif },
                { label: 'In-app notifications', key: 'inApp', value: inAppNotif, setter: setInAppNotif },
              ].map(({ label, key, value, setter }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: semantic.bg.tertiary, borderRadius: '8px' }}>
                  <span style={{ fontSize: typography.fontSize.sm, color: semantic.text.primary }}>{label}</span>
                  <button
                    onClick={() => setter(!value)}
                    aria-checked={value}
                    role="switch"
                    aria-label={label}
                    style={{
                      width: 44, height: 24, borderRadius: 12,
                      background: value ? colors.brand[500] : semantic.bg.elevated,
                      border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', background: '#fff',
                      position: 'absolute', top: 3, left: value ? 23 : 3, transition: 'left 0.2s',
                    }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'appearance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, color: semantic.text.primary }}>Appearance</h2>
              <div>
                <label style={{ ...labelStyle, marginBottom: '1rem' }}>Theme</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {THEMES.map((t) => {
                    const isActive = theme === t.value;
                    return (
                      <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem',
                          padding: '1rem',
                          background: isActive ? semantic.bg.brandSubtle : semantic.bg.tertiary,
                          border: `2px solid ${isActive ? semantic.border.brand : semantic.border.primary}`,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s',
                          position: 'relative',
                        }}
                      >
                        {/* Theme preview swatch */}
                        <div style={{
                          width: '100%',
                          height: 56,
                          borderRadius: 6,
                          background: t.preview.bg,
                          border: `1px solid rgba(128,128,128,0.2)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          overflow: 'hidden',
                        }}>
                          <div style={{ width: 32, height: 6, borderRadius: 3, background: t.preview.accent }} />
                          <div style={{ width: 20, height: 6, borderRadius: 3, background: t.preview.text, opacity: 0.5 }} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 600, fontSize: typography.fontSize.sm, color: semantic.text.primary }}>{t.label}</span>
                            {isActive && <Check size={14} color={colors.brand[400]} />}
                          </div>
                          <div style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, marginTop: '0.25rem' }}>{t.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, color: semantic.text.primary }}>Security</h2>

              {/* Auth method */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: semantic.bg.tertiary, borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: typography.fontSize.sm, fontWeight: 500, color: semantic.text.primary }}>Google Sign-In</div>
                  <div style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted }}>Connected via {user?.email}</div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>

              {/* Change / Set Password */}
              <div style={{ padding: '1.25rem', background: semantic.bg.tertiary, borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: typography.fontSize.sm, fontWeight: 600, color: semantic.text.primary, marginBottom: '0.25rem' }}>
                    {isGoogleOnly ? 'Set a Password' : 'Change Password'}
                  </div>
                  <div style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted }}>
                    {isGoogleOnly
                      ? 'Add an email/password sign-in option to your account.'
                      : 'Update your account password.'}
                  </div>
                </div>

                {!isGoogleOnly && (
                  <div>
                    <label style={labelStyle}>Current Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        style={{ ...inputStyle, paddingRight: '2.5rem', background: semantic.bg.elevated }}
                        placeholder="Current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: semantic.text.muted }}
                      >
                        {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label style={labelStyle}>{isGoogleOnly ? 'New Password' : 'New Password'}</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ ...inputStyle, paddingRight: '2.5rem', background: semantic.bg.elevated }}
                      placeholder="At least 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: semantic.text.muted }}
                    >
                      {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ ...inputStyle, background: semantic.bg.elevated }}
                    placeholder="Repeat new password"
                  />
                </div>

                {pwError && (
                  <div style={{ padding: '0.625rem 0.875rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: semantic.text.danger, fontSize: typography.fontSize.sm }}>
                    {pwError}
                  </div>
                )}
                {pwSuccess && (
                  <div style={{ padding: '0.625rem 0.875rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '6px', color: semantic.text.success, fontSize: typography.fontSize.sm }}>
                    {pwSuccess}
                  </div>
                )}

                <Button
                  variant="primary"
                  onClick={handleChangePassword}
                  loading={pwLoading}
                  style={{ alignSelf: 'flex-start' }}
                >
                  {isGoogleOnly ? 'Set Password' : 'Update Password'}
                </Button>
              </div>
            </div>
          )}

          {activeSection !== 'security' && activeSection !== 'appearance' && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${semantic.border.primary}`, display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center' }}>
              {saved && <span style={{ fontSize: typography.fontSize.sm, color: colors.success[400] }}>Changes saved ✓</span>}
              <Button variant="primary" onClick={handleSave} loading={saving}>
                Save Changes
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
