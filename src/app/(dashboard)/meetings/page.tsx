'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, FileText, Globe, Plus, Search, Video } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { useAuth } from '@/features/auth/AuthContext';
import Spinner from '@/components/ui/Spinner';
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

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: 'numeric', minute: '2-digit',
  });
}

function formatPlatform(platform?: string): string {
  if (!platform) return 'Other';
  return platform
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const statusPill: Record<string, string> = {
  completed: 'bg-app-primary/10 text-app-primary border-app-primary/20',
  live: 'bg-app-error/10 text-app-error border-app-error/20',
  processing: 'bg-app-tertiary/10 text-app-tertiary border-app-tertiary/20',
  scheduled: 'bg-app-primary-container/20 text-app-primary border-app-primary-container/30',
  failed: 'bg-app-surface-highest text-app-fg-variant border-app-outline',
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
    <div className="px-4 md:px-8 pt-8 pb-8 max-w-[1200px] mx-auto min-h-full flex flex-col">

      {/* Header + filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-[32px] font-semibold text-app-fg mb-1">Past Meetings</h2>
          <p className="text-app-fg-variant">
            Review transcripts and generate insights from your previous sessions.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-app-outline-strong"
            />
            <input
              type="text"
              placeholder="Search meetings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 bg-app-surface border border-app-outline rounded-lg py-2 pl-10 pr-3 text-sm text-app-fg placeholder:text-app-outline-strong focus:outline-none focus:border-app-primary transition-colors"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 bg-app-surface border border-app-outline rounded-lg px-3 py-2 text-sm text-app-fg-variant hover:text-app-fg hover:border-app-primary/40 transition-colors"
          >
            <Calendar size={15} />
            All Time
          </button>
          <Link
            href="/meetings/live"
            className="inline-flex items-center justify-center gap-2 bg-action hover:bg-action-hover text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
          >
            <Plus size={15} />
            New Meeting
          </Link>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-app-outline bg-app-surface-low text-center px-8 py-16">
          <div className="w-14 h-14 rounded-2xl bg-app-primary-container/20 mx-auto mb-5 flex items-center justify-center">
            <Video size={28} className="text-app-primary" />
          </div>
          <h3 className="text-xl font-semibold text-app-fg mb-2">
            {search ? 'No meetings found' : 'No meetings yet'}
          </h3>
          <p className="text-app-fg-variant mb-6">
            {search ? 'Try a different search term.' : 'Start your first live meeting to get a transcript.'}
          </p>
          {!search && (
            <Link
              href="/meetings/live"
              className="inline-flex items-center gap-2 bg-action hover:bg-action-hover text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
            >
              <Plus size={15} />
              Start Meeting
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-app-outline bg-app-surface-low overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-app-surface border-b border-app-outline">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-app-fg-variant">
                    Meeting Details
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-app-fg-variant">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-app-fg-variant">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-app-fg-variant">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-app-fg-variant text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-outline/40">
                {filtered.map((meeting) => (
                  <tr key={meeting.id} className="group hover:bg-app-surface-high/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-app-fg group-hover:text-app-primary transition-colors">
                        {meeting.title || 'Untitled Meeting'}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-app-outline-strong mt-1">
                        <Calendar size={12} />
                        {formatDate(meeting.createdAt)}
                        <span className="text-app-outline">•</span>
                        <Clock size={12} />
                        {formatTime(meeting.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-app-fg-variant whitespace-nowrap">
                      {formatDuration(meeting.duration)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-app-fg-variant bg-app-surface-highest border border-app-outline rounded-full px-2.5 py-1 whitespace-nowrap">
                        <Globe size={12} className="text-app-primary" />
                        {formatPlatform(meeting.platform)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${
                          statusPill[meeting.status] ?? 'bg-app-surface-highest text-app-fg-variant border-app-outline'
                        }`}
                      >
                        {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {meeting.transcriptId ? (
                        <Link
                          href={`/documents?meetingId=${meeting.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-app-fg-variant border border-app-outline rounded-md px-2.5 py-1.5 hover:text-app-primary hover:border-app-primary/40 transition-all lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
                          title="Generate document from this transcript"
                        >
                          <FileText size={13} />
                          Generate Doc
                        </Link>
                      ) : (
                        <span className="text-xs text-app-outline-strong">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
