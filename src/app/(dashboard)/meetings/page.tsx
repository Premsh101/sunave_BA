'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Video, Plus, Clock, Search, Filter } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { useAuth } from '@/features/auth/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { typography, semantic } from '@/styles/theme';
import type { Meeting } from '@/types/meeting';

function formatDuration(seconds?: number): string {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

const statusVariant: Record<string, 'success' | 'danger' | 'neutral' | 'warning' | 'brand'> = {
  completed: 'success',
  live: 'danger',
  processing: 'warning',
  scheduled: 'brand',
  failed: 'neutral',
};

export default function MeetingsPage() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user || !db) {
      Promise.resolve().then(() => setLoading(false));
      return;
    }
    const q = query(
      collection(db, COLLECTIONS.MEETINGS),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
    );
    getDocs(q)
      .then((snap) => {
        setMeetings(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Meeting)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = meetings.filter((m) =>
    m.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: typography.fontSize['2xl'], fontWeight: 700, color: semantic.text.primary, marginBottom: '0.25rem' }}>
            Meetings
          </h1>
          <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm }}>
            All your meetings and transcripts
          </p>
        </div>
        <Link href="/meetings/live">
          <Button variant="primary" icon={<Plus size={16} />}>
            New Meeting
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', background: semantic.bg.secondary, border: `1px solid ${semantic.border.primary}`, borderRadius: '8px', padding: '0.5rem 1rem', marginBottom: '1.5rem', gap: '0.5rem', maxWidth: '400px' }}>
        <Search size={16} color={semantic.text.muted} />
        <input
          type="text"
          placeholder="Search meetings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: semantic.text.primary, fontSize: typography.fontSize.sm, width: '100%' }}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Spinner size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: semantic.bg.brandSubtle, margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Video size={28} color={semantic.text.brand} />
          </div>
          <h2 style={{ fontSize: typography.fontSize.xl, fontWeight: 600, color: semantic.text.primary, marginBottom: '0.5rem' }}>
            {search ? 'No meetings found' : 'No meetings yet'}
          </h2>
          <p style={{ color: semantic.text.secondary, marginBottom: '1.5rem' }}>
            {search ? 'Try a different search term.' : 'Start your first live meeting to get a transcript.'}
          </p>
          {!search && (
            <Link href="/meetings/live">
              <Button variant="primary" icon={<Plus size={16} />}>Start Meeting</Button>
            </Link>
          )}
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((meeting) => (
            <Card key={meeting.id} hoverable style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: semantic.bg.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Video size={18} color={semantic.text.secondary} />
                </div>
                <div>
                  <div style={{ fontWeight: 500, color: semantic.text.primary }}>{meeting.title || 'Untitled Meeting'}</div>
                  <div style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <Clock size={12} />
                    {formatDate(meeting.createdAt)} • {formatDuration(meeting.duration)}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Badge variant={statusVariant[meeting.status] ?? 'neutral'}>
                  {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                </Badge>
                {meeting.transcriptId && (
                  <Link href={`/documents?meetingId=${meeting.id}`}>
                    <Button variant="secondary" size="sm">Generate Doc</Button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
