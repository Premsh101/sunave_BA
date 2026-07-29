'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Download, Eye, FileText, Plus, Search, Trash2, X } from 'lucide-react';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { useAuth } from '@/features/auth/AuthContext';
import Spinner from '@/components/ui/Spinner';
import GenerateDocumentModal from '@/components/ui/GenerateDocumentModal';
import type { AIDocument } from '@/types/document';

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

const DOC_TYPE_BADGES: Record<string, string> = {
  mom: 'MOM',
  brd: 'BRD',
  frd: 'FRD',
  'user-stories': 'Stories',
  'acceptance-criteria': 'AC',
  'sprint-tasks': 'Tasks',
  'test-scenarios': 'Tests',
  'action-items': 'Actions',
  'risks-dependencies': 'Risks',
  'grooming-questions': 'Grooming',
  'follow-up-email': 'Email',
  'stakeholder-summary': 'Summary',
  custom: 'Custom',
};

const statusPill: Record<string, string> = {
  completed: 'bg-app-primary/10 text-app-primary border-app-primary/20',
  generating: 'bg-app-tertiary/10 text-app-tertiary border-app-tertiary/20',
  failed: 'bg-app-error/10 text-app-error border-app-error/20',
  draft: 'bg-app-surface-highest text-app-fg-variant border-app-outline',
  reviewed: 'bg-app-primary/10 text-app-primary border-app-primary/20',
  approved: 'bg-app-primary/10 text-app-primary border-app-primary/20',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<AIDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<AIDocument | null>(null);

  useEffect(() => {
    if (!user || !db) {
      Promise.resolve().then(() => setLoading(false));
      return;
    }
    const q = query(
      collection(db, COLLECTIONS.AI_DOCUMENTS),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
    );
    getDocs(q)
      .then((snap) => {
        setDocuments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AIDocument)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (docId: string) => {
    if (!db) return;
    if (!window.confirm('Delete this document? This cannot be undone.')) return;
    await deleteDoc(doc(db, COLLECTIONS.AI_DOCUMENTS, docId));
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleDownload = (document: AIDocument) => {
    const blob = new Blob([document.fullContent || ''], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.title || 'document'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const typesPresent = Array.from(new Set(documents.map((d) => d.type)));

  const filtered = documents.filter(
    (d) =>
      d.title?.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === 'all' || d.type === typeFilter),
  );

  return (
    <div className="px-4 md:px-8 pt-8 pb-8 max-w-[1200px] mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-[32px] font-bold text-app-fg mb-1">Document Repository</h2>
          <p className="text-app-fg-variant">
            Access, manage, and generate high-fidelity AI documents for your analytical workflows.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-action hover:bg-action-hover text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors shrink-0"
        >
          <Plus size={15} />
          Generate New Document
        </button>
      </div>

      {/* Search + filter chips */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
        <div className="relative shrink-0">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-app-outline-strong"
          />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-56 bg-app-surface border border-app-outline rounded-lg py-2 pl-10 pr-3 text-sm text-app-fg placeholder:text-app-outline-strong focus:outline-none focus:border-app-primary transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTypeFilter('all')}
            className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
              typeFilter === 'all'
                ? 'bg-app-surface-high border-app-primary text-app-primary'
                : 'bg-app-surface-low border-app-outline text-app-fg-variant hover:text-app-fg hover:border-app-primary/40'
            }`}
          >
            All
          </button>
          {typesPresent.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
                typeFilter === type
                  ? 'bg-app-surface-high border-app-primary text-app-primary'
                  : 'bg-app-surface-low border-app-outline text-app-fg-variant hover:text-app-fg hover:border-app-primary/40'
              }`}
            >
              {DOC_TYPE_LABELS[type] || type}
            </button>
          ))}
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
            <FileText size={28} className="text-app-primary" />
          </div>
          <h3 className="text-xl font-semibold text-app-fg mb-2">
            {search || typeFilter !== 'all' ? 'No documents found' : 'No documents yet'}
          </h3>
          <p className="text-app-fg-variant mb-6">
            {search || typeFilter !== 'all'
              ? 'Try a different search term or filter.'
              : 'Generate a document from a meeting transcript to get started.'}
          </p>
          {!search && typeFilter === 'all' && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-action hover:bg-action-hover text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
            >
              <Plus size={15} />
              Generate Document
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((document) => (
            <div
              key={document.id}
              className="glass-card rounded-xl p-4 pb-14 flex flex-col group relative overflow-hidden min-h-[160px]"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-app-primary bg-app-primary-container/20 border border-app-primary/20 rounded-md px-2 py-1">
                  <FileText size={12} />
                  {DOC_TYPE_BADGES[document.type] || document.type}
                </span>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                    statusPill[document.status] ?? 'bg-app-surface-highest text-app-fg-variant border-app-outline'
                  }`}
                >
                  {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-app-fg line-clamp-2 mb-4">
                {document.title || 'Untitled Document'}
              </h3>

              <div className="mt-auto pt-3 border-t border-app-outline/30 flex items-center gap-2 text-xs text-app-outline-strong">
                <Calendar size={12} />
                {formatDate(document.createdAt)}
                {typeof document.metadata?.wordCount === 'number' && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-app-outline inline-block" />
                    {document.metadata.wordCount} words
                  </>
                )}
              </div>

              {/* Hover action bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-app-surface-high/90 backdrop-blur-sm border-t border-app-outline/30 flex divide-x divide-app-outline/30 translate-y-0 lg:translate-y-full lg:group-hover:translate-y-0 lg:group-focus-within:translate-y-0 transition-transform duration-200">
                <button
                  onClick={() => setSelectedDoc(document)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-app-fg-variant hover:text-app-primary transition-colors"
                  title="View"
                >
                  <Eye size={14} />
                  View
                </button>
                <button
                  onClick={() => handleDownload(document)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-app-fg-variant hover:text-app-primary transition-colors"
                  title="Download"
                >
                  <Download size={14} />
                  Download
                </button>
                <button
                  onClick={() => handleDelete(document.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-app-error hover:brightness-125 transition-all"
                  title="Delete"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Document Modal */}
      {showModal && (
        <GenerateDocumentModal
          onClose={() => setShowModal(false)}
          onGenerated={(doc) => {
            setDocuments((prev) => [doc, ...prev]);
            setShowModal(false);
          }}
        />
      )}

      {/* View Document Modal */}
      {selectedDoc && (
        <div
          className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-app-surface border border-app-outline rounded-xl w-full max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-app-outline/40 flex justify-between items-center gap-4">
              <h3 className="text-lg font-semibold text-app-fg truncate">{selectedDoc.title}</h3>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-app-outline-strong hover:text-app-fg transition-colors shrink-0"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <pre className="whitespace-pre-wrap text-sm leading-7 text-app-fg font-jakarta">
                {selectedDoc.fullContent}
              </pre>
            </div>
            <div className="px-6 py-4 border-t border-app-outline/40 flex justify-end gap-3">
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-sm font-medium text-app-fg-variant border border-app-outline rounded-lg px-4 py-2 hover:text-app-fg hover:border-app-primary/40 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(selectedDoc)}
                className="inline-flex items-center gap-2 bg-action hover:bg-action-hover text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
              >
                <Download size={15} />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
