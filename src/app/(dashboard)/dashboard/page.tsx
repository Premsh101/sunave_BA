'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthContext';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { Video, FileText, MessageSquare, Clock, LayoutTemplate, Plus } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import GenerateDocumentModal from '@/components/ui/GenerateDocumentModal';
import { typography, semantic, gradients, colors } from '@/styles/theme';
import { grid } from '@/styles/mixins';
import type { Meeting } from '@/types/meeting';
import type { AIDocument } from '@/types/document';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

const statusVariant: Record<string, 'success' | 'danger' | 'neutral' | 'warning' | 'brand'> = {
  completed: 'success',
  live: 'danger',
  processing: 'warning',
  scheduled: 'brand',
  failed: 'neutral',
};

export default function DashboardHome() {
  const { user } = useAuth();
  const router = useRouter();
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([]);
  const [recentDocs, setRecentDocs] = useState<AIDocument[]>([]);
  const [loadingMeetings, setLoadingMeetings] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  useEffect(() => {
    if (!user || !db) {
      Promise.resolve().then(() => setLoadingMeetings(false));
      return;
    }
    const meetingsQuery = query(
      collection(db, COLLECTIONS.MEETINGS),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(3),
    );
    const docsQuery = query(
      collection(db, COLLECTIONS.AI_DOCUMENTS),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(3),
    );
    Promise.all([getDocs(meetingsQuery), getDocs(docsQuery)])
      .then(([mSnap, dSnap]) => {
        setRecentMeetings(mSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Meeting)));
        setRecentDocs(dSnap.docs.map((d) => ({ id: d.id, ...d.data() } as AIDocument)));
      })
      .catch(console.error)
      .finally(() => setLoadingMeetings(false));
  }, [user]);

  const isPro = user?.plan === 'pro' || user?.plan === 'enterprise';

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Welcome Section */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: typography.fontSize['3xl'], fontWeight: 700, color: semantic.text.primary, marginBottom: '0.5rem' }}>
            Welcome back, {user?.displayName?.split(' ')[0] || 'User'} 👋
          </h1>
          <p style={{ color: semantic.text.secondary }}>
            {recentMeetings.length > 0
              ? `You have ${recentMeetings.length} recent meeting${recentMeetings.length > 1 ? 's' : ''}.`
              : 'Start your first meeting to get going.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/template-studio">
            <Button variant="secondary" icon={<LayoutTemplate size={16} />}>
              Templates
            </Button>
          </Link>
          <Link href="/meetings/live">
            <Button variant="primary" icon={<Video size={16} />}>
              Start Meeting
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={grid(3, '1.5rem')}>
        <Link href="/meetings/live" style={{ textDecoration: 'none' }}>
          <Card variant="gradient" hoverable style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Video size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600, color: '#fff' }}>New Live Meeting</div>
              <div style={{ fontSize: typography.fontSize.sm, color: 'rgba(255,255,255,0.7)' }}>Start bot-free transcription</div>
            </div>
          </Card>
        </Link>

        <Card
          hoverable
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }}
          onClick={() => setShowGenerateModal(true)}
        >
          <div style={{ width: 40, height: 40, borderRadius: 12, background: semantic.bg.brandSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} color={colors.brand[400]} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: semantic.text.primary }}>Generate Document</div>
            <div style={{ fontSize: typography.fontSize.sm, color: semantic.text.secondary }}>BRD, MOM, User Stories & more</div>
          </div>
        </Card>

        <Link href="/prompt-studio" style={{ textDecoration: 'none' }}>
          <Card hoverable style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: semantic.bg.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: semantic.text.primary }}>
              <MessageSquare size={20} color={semantic.text.secondary} />
            </div>
            <div>
              <div style={{ fontWeight: 600, color: semantic.text.primary }}>Prompt Studio</div>
              <div style={{ fontSize: typography.fontSize.sm, color: semantic.text.secondary }}>View AI prompt configurations</div>
            </div>
          </Card>
        </Link>
      </div>

      <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

        {/* Recent Meetings */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, color: semantic.text.primary }}>Recent Meetings</h2>
            <Link href="/meetings" style={{ fontSize: typography.fontSize.sm, color: semantic.text.brand, textDecoration: 'none' }}>View all</Link>
          </div>

          {loadingMeetings ? (
            <Card style={{ padding: '2rem', textAlign: 'center' }}>
              <span style={{ color: semantic.text.muted, fontSize: typography.fontSize.sm }}>Loading…</span>
            </Card>
          ) : recentMeetings.length === 0 ? (
            <Card style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ color: semantic.text.muted, fontSize: typography.fontSize.sm, marginBottom: '1rem' }}>
                No meetings yet. Start your first meeting to see it here.
              </div>
              <Link href="/meetings/live">
                <Button variant="secondary" size="sm" icon={<Plus size={14} />}>Start Meeting</Button>
              </Link>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentMeetings.map((meeting) => (
                <Card key={meeting.id} hoverable style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: semantic.bg.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Video size={18} color={semantic.text.secondary} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, color: semantic.text.primary }}>{meeting.title || 'Untitled Meeting'}</div>
                      <div style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <Clock size={12} />
                        {formatDate(meeting.createdAt)}
                        {meeting.duration ? ` • ${formatDuration(meeting.duration)}` : ''}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Badge variant={statusVariant[meeting.status] ?? 'neutral'}>
                      {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                    </Badge>
                    <Link href="/documents">
                      <Button variant="secondary" size="sm">Docs</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Usage Widget */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, color: semantic.text.primary }}>Usage</h2>
          </div>

          <Card style={{ background: semantic.bg.secondary }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontSize: typography.fontSize.sm, color: semantic.text.secondary }}>Plan</div>
              <Badge variant={isPro ? 'brand' : 'neutral'}>
                {(user?.plan || 'free').charAt(0).toUpperCase() + (user?.plan || 'free').slice(1)}
              </Badge>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: typography.fontSize.sm, marginBottom: '0.5rem' }}>
                <span style={{ color: semantic.text.primary }}>AI Documents</span>
                <span style={{ color: semantic.text.muted }}>
                  {user?.usage?.documentsGenerated ?? 0} / {isPro ? '∞' : '3'}
                </span>
              </div>
              <div style={{ width: '100%', height: 6, background: semantic.bg.tertiary, borderRadius: 3, overflow: 'hidden' }}>
                {!isPro && (
                  <div style={{ width: `${Math.min(100, ((user?.usage?.documentsGenerated ?? 0) / 3) * 100)}%`, height: '100%', background: gradients.brand }} />
                )}
                {isPro && <div style={{ width: '15%', height: '100%', background: gradients.brand }} />}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: typography.fontSize.sm, marginBottom: '0.5rem' }}>
                <span style={{ color: semantic.text.primary }}>Meetings This Month</span>
                <span style={{ color: semantic.text.muted }}>
                  {user?.usage?.meetingsThisMonth ?? 0} / {isPro ? '∞' : '5'}
                </span>
              </div>
              <div style={{ width: '100%', height: 6, background: semantic.bg.tertiary, borderRadius: 3, overflow: 'hidden' }}>
                {!isPro && (
                  <div style={{ width: `${Math.min(100, ((user?.usage?.meetingsThisMonth ?? 0) / 5) * 100)}%`, height: '100%', background: gradients.brand }} />
                )}
                {isPro && <div style={{ width: '10%', height: '100%', background: gradients.brand }} />}
              </div>
            </div>

            <Link href="/billing">
              <Button variant="secondary" fullWidth style={{ fontSize: typography.fontSize.xs }}>
                View billing & plans
              </Button>
            </Link>
          </Card>
        </div>

      </div>

      {/* Generate Document Modal */}
      {showGenerateModal && (
        <GenerateDocumentModal
          onClose={() => setShowGenerateModal(false)}
          onGenerated={(doc) => {
            setShowGenerateModal(false);
            router.push('/documents');
          }}
        />
      )}
    </div>
  );
}
