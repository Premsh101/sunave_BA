'use client';

import React, { useState } from 'react';
import { User, Bell, Globe, Palette, Shield } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/features/auth/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { typography, semantic, colors } from '@/styles/theme';

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
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [aiTone, setAiTone] = useState(user?.preferences?.aiTone || 'professional');
  const [transcriptionMode, setTranscriptionMode] = useState(user?.preferences?.transcriptionMode || 'bot-free');
  const [emailNotif, setEmailNotif] = useState(user?.preferences?.notifications?.email ?? true);
  const [inAppNotif, setInAppNotif] = useState(user?.preferences?.notifications?.inApp ?? true);

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, color: semantic.text.primary }}>Appearance</h2>
              <div style={{ padding: '1rem', background: semantic.bg.tertiary, borderRadius: '8px', color: semantic.text.secondary, fontSize: typography.fontSize.sm }}>
                Sunave uses a dark theme optimized for focus. Light mode and additional themes are coming soon.
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, color: semantic.text.primary }}>Security</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: semantic.bg.tertiary, borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: typography.fontSize.sm, fontWeight: 500, color: semantic.text.primary }}>Google Sign-In</div>
                  <div style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted }}>Connected via {user?.email}</div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <p style={{ fontSize: typography.fontSize.sm, color: semantic.text.muted }}>
                Authentication is managed securely through Firebase. Password management and 2FA are handled by your Google account.
              </p>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${semantic.border.primary}`, display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center' }}>
            {saved && <span style={{ fontSize: typography.fontSize.sm, color: colors.success[400] }}>Changes saved ✓</span>}
            <Button variant="primary" onClick={handleSave} loading={saving}>
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
