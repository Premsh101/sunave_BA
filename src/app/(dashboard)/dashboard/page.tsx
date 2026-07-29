'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthContext';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import {
  Calendar,
  Clock,
  CreditCard,
  FileText,
  LayoutTemplate,
  Mic,
  Plus,
  Terminal,
  Video,
} from 'lucide-react';
import GenerateDocumentModal from '@/components/ui/GenerateDocumentModal';
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

const statusPill: Record<string, string> = {
  completed: 'bg-app-primary/10 text-app-primary border-app-primary/20',
  live: 'bg-app-error/10 text-app-error border-app-error/20',
  processing: 'bg-app-tertiary/10 text-app-tertiary border-app-tertiary/20',
  scheduled: 'bg-app-primary-container/20 text-app-primary border-app-primary-container/30',
  failed: 'bg-app-surface-highest text-app-fg-variant border-app-outline',
};

const DOC_TYPE_LABELS: Record<string, string> = {
  mom: 'Minutes of Meeting',
  brd: 'Business Requirements',
  frd: 'Functional Requirements',
  'user-stories': 'User Stories',
  'acceptance-criteria': 'Acceptance Criteria',
  'sprint-tasks': 'Sprint Tasks',
  'test-scenarios': 'Test Scenarios',
  'action-items': 'Action Items',
  'risks-dependencies': 'Risks & Dependencies',
  'grooming-questions': 'Grooming Questions',
  'follow-up-email': 'Follow-up Email',
  'stakeholder-summary': 'Stakeholder Summary',
  custom: 'Custom',
};

function MicroSegments({ ratio, colorClass }: { ratio: number; colorClass: string }) {
  const filled = Math.min(5, Math.round(Math.min(1, Math.max(0, ratio)) * 5));
  return (
    <div className="flex gap-1 mt-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full ${i < filled ? colorClass : 'bg-app-surface-highest'}`}
        />
      ))}
    </div>
  );
}

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
  const meetingsThisMonth = user?.usage?.meetingsThisMonth ?? 0;
  const transcriptionMinutes = user?.usage?.transcriptionMinutes ?? 0;
  const documentsGenerated = user?.usage?.documentsGenerated ?? 0;
  const planLabel = ((user?.plan || 'free').charAt(0).toUpperCase() + (user?.plan || 'free').slice(1));

  return (
    <div className="px-4 md:px-8 pt-8 pb-12 max-w-[1200px] mx-auto">

      {/* Welcome header */}
      <div className="mb-12 md:mb-16">
        <h2 className="font-display text-4xl md:text-[48px] leading-tight text-app-fg mb-1">
          Welcome back, {user?.displayName?.split(' ')[0] || 'User'}
        </h2>
        <p className="text-lg text-app-fg-variant">
          {recentMeetings.length > 0
            ? `You have ${recentMeetings.length} recent meeting${recentMeetings.length > 1 ? 's' : ''}. Here is an overview of your activity.`
            : 'Start your first meeting to get going.'}
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        {/* Primary CTA */}
        <Link
          href="/meetings/live"
          className="md:col-span-8 group relative overflow-hidden rounded-xl border border-app-outline bg-app-surface p-6 min-h-[240px] flex flex-col justify-between transition-colors hover:border-app-primary/40"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-app-primary/10 via-transparent to-transparent pointer-events-none" />
          <Mic
            className="absolute -bottom-8 -right-8 text-app-primary opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-300 pointer-events-none"
            size={192}
            strokeWidth={1}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-app-error opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-app-error" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-app-error">
                Ready to record
              </span>
            </div>
            <h3 className="text-2xl md:text-[32px] font-semibold text-app-fg mb-2">
              Start Live Meeting
            </h3>
            <p className="text-app-fg-variant max-w-md">
              Begin real-time transcription, insights extraction, and automated note-taking.
            </p>
          </div>
          <div className="relative mt-6">
            <span className="inline-flex items-center gap-2 bg-action group-hover:bg-action-hover text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
              <Mic size={16} />
              Initialize Session
            </span>
          </div>
        </Link>

        {/* Stat tiles */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="flex-1 rounded-xl border border-app-outline bg-app-surface-low p-4 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-app-fg-variant">
                Meetings
              </span>
              <Calendar size={16} className="text-app-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-app-fg">{meetingsThisMonth}</span>
              <span className="text-sm text-app-outline-strong">this month</span>
            </div>
            <MicroSegments
              ratio={isPro ? 0.15 : meetingsThisMonth / 5}
              colorClass="bg-app-primary"
            />
          </div>
          <div className="flex-1 rounded-xl border border-app-outline bg-app-surface-low p-4 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-app-fg-variant">
                Transcribed
              </span>
              <Clock size={16} className="text-app-tertiary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-app-fg">{transcriptionMinutes}</span>
              <span className="text-sm text-app-outline-strong">mins</span>
            </div>
            <MicroSegments
              ratio={isPro ? 0.1 : transcriptionMinutes / 300}
              colorClass="bg-app-tertiary"
            />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 md:mb-16">
        <button
          onClick={() => setShowGenerateModal(true)}
          className="text-left rounded-xl border border-app-outline bg-app-surface-low p-4 hover:bg-app-surface hover:border-app-primary/40 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-app-primary-container/20 flex items-center justify-center mb-3">
            <FileText size={17} className="text-app-primary" />
          </div>
          <div className="text-sm font-semibold text-app-fg">Generate Document</div>
          <div className="text-xs text-app-fg-variant mt-0.5">BRD, MOM, User Stories &amp; more</div>
        </button>
        <Link
          href="/template-studio"
          className="rounded-xl border border-app-outline bg-app-surface-low p-4 hover:bg-app-surface hover:border-app-primary/40 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-app-primary-container/20 flex items-center justify-center mb-3">
            <LayoutTemplate size={17} className="text-app-primary" />
          </div>
          <div className="text-sm font-semibold text-app-fg">Templates</div>
          <div className="text-xs text-app-fg-variant mt-0.5">Design document templates</div>
        </Link>
        <Link
          href="/prompt-studio"
          className="rounded-xl border border-app-outline bg-app-surface-low p-4 hover:bg-app-surface hover:border-app-primary/40 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-app-primary-container/20 flex items-center justify-center mb-3">
            <Terminal size={17} className="text-app-primary" />
          </div>
          <div className="text-sm font-semibold text-app-fg">Prompt Studio</div>
          <div className="text-xs text-app-fg-variant mt-0.5">View AI prompt configurations</div>
        </Link>
        <Link
          href="/billing"
          className="rounded-xl border border-app-outline bg-app-surface-low p-4 hover:bg-app-surface hover:border-app-primary/40 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-app-primary-container/20 flex items-center justify-center mb-3">
            <CreditCard size={17} className="text-app-primary" />
          </div>
          <div className="text-sm font-semibold text-app-fg">Billing &amp; Plans</div>
          <div className="text-xs text-app-fg-variant mt-0.5">
            {planLabel} plan • {documentsGenerated}/{isPro ? '∞' : '3'} AI docs used
          </div>
        </Link>
      </div>

      {/* Two-column lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Recent Meetings */}
        <section>
          <div className="flex items-center justify-between border-b border-app-outline/40 pb-3 mb-4">
            <h3 className="text-xl font-semibold text-app-fg">Recent Meetings</h3>
            <Link
              href="/meetings"
              className="text-sm font-medium text-app-primary hover:text-app-fg transition-colors"
            >
              View All
            </Link>
          </div>

          {loadingMeetings ? (
            <div className="rounded-lg border border-app-outline bg-app-surface-low p-8 text-center text-sm text-app-outline-strong">
              Loading…
            </div>
          ) : recentMeetings.length === 0 ? (
            <div className="rounded-lg border border-app-outline bg-app-surface-low p-8 text-center">
              <p className="text-sm text-app-fg-variant mb-4">
                No meetings yet. Start your first meeting to see it here.
              </p>
              <Link
                href="/meetings/live"
                className="inline-flex items-center gap-2 bg-action hover:bg-action-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={14} />
                Start Meeting
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="rounded-lg border border-app-outline bg-app-surface-low p-4 hover:bg-app-surface transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-app-primary-container/20 flex items-center justify-center">
                      <Video size={18} className="text-app-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-app-fg truncate">
                        {meeting.title || 'Untitled Meeting'}
                      </div>
                      <div className="text-xs text-app-outline-strong flex items-center gap-1.5 mt-0.5">
                        <Clock size={12} />
                        {formatDate(meeting.createdAt)}
                        {meeting.duration ? ` • ${formatDuration(meeting.duration)}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                        statusPill[meeting.status] ?? 'bg-app-surface-highest text-app-fg-variant border-app-outline'
                      }`}
                    >
                      {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                    </span>
                    <Link
                      href="/documents"
                      className="text-xs font-medium text-app-fg-variant border border-app-outline rounded-md px-2.5 py-1 hover:text-app-primary hover:border-app-primary/40 transition-colors"
                    >
                      Docs
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Documents */}
        <section>
          <div className="flex items-center justify-between border-b border-app-outline/40 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-app-fg">Recent Documents</h3>
              <span className="text-[11px] font-semibold text-app-primary bg-app-primary-container/20 border border-app-primary/20 rounded-full px-2 py-0.5">
                {recentDocs.length}
              </span>
            </div>
            <Link
              href="/documents"
              className="text-sm font-medium text-app-primary hover:text-app-fg transition-colors"
            >
              Studio
            </Link>
          </div>

          {loadingMeetings ? (
            <div className="rounded-lg border border-app-outline bg-app-surface-low p-8 text-center text-sm text-app-outline-strong">
              Loading…
            </div>
          ) : recentDocs.length === 0 ? (
            <div className="rounded-lg border border-app-outline bg-app-surface-low p-8 text-center">
              <p className="text-sm text-app-fg-variant mb-4">
                No documents yet. Generate your first AI document from a transcript.
              </p>
              <button
                onClick={() => setShowGenerateModal(true)}
                className="inline-flex items-center gap-2 bg-action hover:bg-action-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={14} />
                Generate Document
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentDocs.map((docItem) => (
                <Link
                  key={docItem.id}
                  href="/documents"
                  className="rounded-lg border border-app-outline bg-app-surface-low p-4 hover:bg-app-surface transition-colors flex items-center gap-3"
                >
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-app-primary-container/20 flex items-center justify-center">
                    <FileText size={18} className="text-app-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-app-fg truncate">
                      {docItem.title || 'Untitled Document'}
                    </div>
                    <div className="text-xs text-app-outline-strong mt-0.5">
                      {DOC_TYPE_LABELS[docItem.type] || docItem.type} • {formatDate(docItem.createdAt)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Generate Document Modal */}
      {showGenerateModal && (
        <GenerateDocumentModal
          onClose={() => setShowGenerateModal(false)}
          onGenerated={() => {
            setShowGenerateModal(false);
            router.push('/documents');
          }}
        />
      )}
    </div>
  );
}
