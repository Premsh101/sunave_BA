'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, Search, Download, Trash2, Eye } from 'lucide-react';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { useAuth } from '@/features/auth/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import GenerateDocumentModal from '@/components/ui/GenerateDocumentModal';
import { typography, semantic, colors } from '@/styles/theme';
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

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  completed: 'success',
  generating: 'warning',
  failed: 'danger',
  draft: 'neutral',
  reviewed: 'success',
  approved: 'success',
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
    if (!confirm('Delete this document?')) return;
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

  const filtered = documents.filter((d) =>
    d.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: typography.fontSize['2xl'], fontWeight: 700, color: semantic.text.primary, marginBottom: '0.25rem' }}>
            Documents
          </h1>
          <p style={{ color: semantic.text.secondary, fontSize: typography.fontSize.sm }}>
            AI-generated documents from your meeting transcripts
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => setShowModal(true)}>
          Generate Document
        </Button>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', background: semantic.bg.secondary, border: `1px solid ${semantic.border.primary}`, borderRadius: '8px', padding: '0.5rem 1rem', marginBottom: '1.5rem', gap: '0.5rem', maxWidth: '400px' }}>
        <Search size={16} color={semantic.text.muted} />
        <input
          type="text"
          placeholder="Search documents..."
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
            <FileText size={28} color={semantic.text.brand} />
          </div>
          <h2 style={{ fontSize: typography.fontSize.xl, fontWeight: 600, color: semantic.text.primary, marginBottom: '0.5rem' }}>
            {search ? 'No documents found' : 'No documents yet'}
          </h2>
          <p style={{ color: semantic.text.secondary, marginBottom: '1.5rem' }}>
            {search ? 'Try a different search term.' : 'Generate a document from a meeting transcript to get started.'}
          </p>
          {!search && (
            <Button variant="primary" icon={<Plus size={16} />} onClick={() => setShowModal(true)}>
              Generate Document
            </Button>
          )}
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((document) => (
            <Card key={document.id} hoverable style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: semantic.bg.brandSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} color={colors.brand[400]} />
                </div>
                <div>
                  <div style={{ fontWeight: 500, color: semantic.text.primary }}>{document.title || 'Untitled Document'}</div>
                  <div style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, marginTop: '0.25rem' }}>
                    {DOC_TYPE_LABELS[document.type] || document.type} • {formatDate(document.createdAt)}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Badge variant={statusVariant[document.status] ?? 'neutral'}>
                  {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                </Badge>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setSelectedDoc(document)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: semantic.text.secondary, padding: '4px' }}
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDownload(document)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: semantic.text.secondary, padding: '4px' }}
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(document.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.danger[400], padding: '4px' }}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
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
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          onClick={() => setSelectedDoc(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: semantic.bg.secondary, borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ padding: '1.5rem', borderBottom: `1px solid ${semantic.border.primary}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, color: semantic.text.primary }}>{selectedDoc.title}</h2>
              <button onClick={() => setSelectedDoc(null)} style={{ background: 'none', border: 'none', color: semantic.text.muted, cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              <pre style={{ whiteSpace: 'pre-wrap', color: semantic.text.primary, fontFamily: 'inherit', fontSize: typography.fontSize.sm, lineHeight: 1.7 }}>
                {selectedDoc.fullContent}
              </pre>
            </div>
            <div style={{ padding: '1rem 1.5rem', borderTop: `1px solid ${semantic.border.primary}`, display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setSelectedDoc(null)}>Close</Button>
              <Button variant="primary" icon={<Download size={16} />} onClick={() => handleDownload(selectedDoc)}>Download</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
