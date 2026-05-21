'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { collection, query, where, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { useAuth } from '@/features/auth/AuthContext';
import Button from './Button';
import Modal from './Modal';
import { typography, semantic } from '@/styles/theme';
import type { AIDocument, DocumentType } from '@/types/document';
import type { Meeting } from '@/types/meeting';

const DOCUMENT_TYPES: { value: DocumentType; label: string; description: string }[] = [
  { value: 'brd', label: 'Business Requirements Document (BRD)', description: 'High-level business needs and objectives' },
  { value: 'frd', label: 'Functional Requirements Document (FRD)', description: 'Detailed functional specifications' },
  { value: 'mom', label: 'Minutes of Meeting (MOM)', description: 'Official record of meeting discussions and decisions' },
  { value: 'user-stories', label: 'User Stories', description: 'Agile user stories in standard format' },
  { value: 'acceptance-criteria', label: 'Acceptance Criteria', description: 'Testable conditions for feature completion' },
  { value: 'sprint-tasks', label: 'Sprint Tasks', description: 'Breakdown of tasks for sprint planning' },
  { value: 'test-scenarios', label: 'Test Scenarios', description: 'Test cases and scenarios for QA' },
  { value: 'action-items', label: 'Action Items', description: 'Tasks, owners, and deadlines extracted from meeting' },
  { value: 'risks-dependencies', label: 'Risks & Dependencies', description: 'Risk register and dependency tracking' },
  { value: 'grooming-questions', label: 'Grooming Questions', description: 'Clarifying questions for backlog grooming' },
  { value: 'follow-up-email', label: 'Follow-up Email', description: 'Professional follow-up email to meeting participants' },
  { value: 'stakeholder-summary', label: 'Stakeholder Summary', description: 'Executive summary for stakeholders' },
];

interface Props {
  onClose: () => void;
  onGenerated: (doc: AIDocument) => void;
  preloadedTranscript?: string;
  preloadedMeetingId?: string;
}

export default function GenerateDocumentModal({ onClose, onGenerated, preloadedTranscript, preloadedMeetingId }: Props) {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState(preloadedMeetingId || '');
  const [transcript, setTranscript] = useState(preloadedTranscript || '');
  const [docType, setDocType] = useState<DocumentType>('brd');
  const [customInstructions, setCustomInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingMeetings, setLoadingMeetings] = useState(true);

  useEffect(() => {
    if (!user || !db) { setLoadingMeetings(false); return; }
    const q = query(
      collection(db, COLLECTIONS.MEETINGS),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
    );
    getDocs(q)
      .then((snap) => setMeetings(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Meeting))))
      .catch(console.error)
      .finally(() => setLoadingMeetings(false));
  }, [user]);

  const handleGenerate = async () => {
    const transcriptText = transcript.trim();
    if (!transcriptText) {
      setError('Please provide a transcript or paste meeting notes.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcriptText,
          documentType: docType,
          customInstructions: customInstructions.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      // Save to Firestore
      let savedDoc: AIDocument | null = null;
      if (db && user) {
        const selectedType = DOCUMENT_TYPES.find((t) => t.value === docType);
        const docData: Partial<AIDocument> = {
          userId: user.uid,
          meetingId: selectedMeetingId || '',
          transcriptId: '',
          type: docType,
          title: `${selectedType?.label || docType} — ${new Date().toLocaleDateString('en-IN')}`,
          fullContent: data.document,
          sections: [],
          status: 'completed',
          version: 1,
          versions: [],
          metadata: {
            wordCount: data.document.split(/\s+/).length,
            sectionCount: 0,
            generationTime: 0,
            tokensUsed: 0,
            model: 'gemini-1.5-pro',
            promptVersion: '1.0',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const ref = await addDoc(collection(db, COLLECTIONS.AI_DOCUMENTS), docData);
        savedDoc = { id: ref.id, ...docData } as AIDocument;
      }

      if (savedDoc) onGenerated(savedDoc);
    } catch (err: any) {
      setError(err.message || 'Failed to generate document');
    } finally {
      setLoading(false);
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

  return (
    <Modal isOpen onClose={onClose} title="Generate AI Document" size="lg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Document Type */}
        <div>
          <label style={labelStyle}>Document Type</label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as DocumentType)}
            style={inputStyle}
          >
            {DOCUMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <p style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted, marginTop: '0.375rem' }}>
            {DOCUMENT_TYPES.find((t) => t.value === docType)?.description}
          </p>
        </div>

        {/* Meeting selector (if meetings exist) */}
        {!preloadedTranscript && (
          <div>
            <label style={labelStyle}>Link to Meeting (optional)</label>
            {loadingMeetings ? (
              <div style={{ color: semantic.text.muted, fontSize: typography.fontSize.sm }}>Loading meetings…</div>
            ) : (
              <select
                value={selectedMeetingId}
                onChange={(e) => setSelectedMeetingId(e.target.value)}
                style={inputStyle}
              >
                <option value="">— Select a meeting —</option>
                {meetings.map((m) => (
                  <option key={m.id} value={m.id}>{m.title || 'Untitled Meeting'}</option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Transcript */}
        <div>
          <label style={labelStyle}>
            {preloadedTranscript ? 'Transcript (auto-filled from recording)' : 'Transcript / Meeting Notes'}
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your meeting transcript or notes here…"
            rows={8}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>

        {/* Custom Instructions */}
        <div>
          <label style={labelStyle}>Additional Instructions (optional)</label>
          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="E.g. Focus on security requirements, use formal tone, include JIRA ticket format…"
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', fontSize: typography.fontSize.sm }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleGenerate}
            loading={loading}
            icon={loading ? undefined : <FileText size={16} />}
          >
            {loading ? 'Generating…' : 'Generate Document'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
