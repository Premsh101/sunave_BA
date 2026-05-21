// Sunave — Firestore Collection References
import { collection, doc } from 'firebase/firestore';
import { db } from './client';

// Collection names as constants
export const COLLECTIONS = {
  USERS: 'users',
  ORGANIZATIONS: 'organizations',
  MEETINGS: 'meetings',
  TRANSCRIPTS: 'transcripts',
  TRANSCRIPT_SEGMENTS: 'transcript_segments',
  AI_DOCUMENTS: 'ai_documents',
  DOCUMENT_TEMPLATES: 'document_templates',
  TEMPLATE_SECTIONS: 'template_sections',
  ORGANIZATION_TEMPLATES: 'organization_templates',
  GENERATED_DOCUMENTS: 'generated_documents',
  DOCUMENT_VERSIONS: 'document_versions',
  PROMPT_TEMPLATES: 'prompt_templates',
  WORKSPACE_SETTINGS: 'workspace_settings',
  EXPORTS: 'exports',
  SUBSCRIPTIONS: 'subscriptions',
  PAYMENTS: 'payments',
  USAGE: 'usage',
} as const;

const getDb = () => {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  return db;
};

// Typed collection references
export const usersRef = () => collection(getDb(), COLLECTIONS.USERS);
export const organizationsRef = () => collection(getDb(), COLLECTIONS.ORGANIZATIONS);
export const meetingsRef = () => collection(getDb(), COLLECTIONS.MEETINGS);
export const transcriptsRef = () => collection(getDb(), COLLECTIONS.TRANSCRIPTS);
export const aiDocumentsRef = () => collection(getDb(), COLLECTIONS.AI_DOCUMENTS);
export const documentTemplatesRef = () => collection(getDb(), COLLECTIONS.DOCUMENT_TEMPLATES);
export const promptTemplatesRef = () => collection(getDb(), COLLECTIONS.PROMPT_TEMPLATES);
export const workspaceSettingsRef = () => collection(getDb(), COLLECTIONS.WORKSPACE_SETTINGS);
export const exportsRef = () => collection(getDb(), COLLECTIONS.EXPORTS);
export const subscriptionsRef = () => collection(getDb(), COLLECTIONS.SUBSCRIPTIONS);
export const paymentsRef = () => collection(getDb(), COLLECTIONS.PAYMENTS);
export const usageRef = () => collection(getDb(), COLLECTIONS.USAGE);

// Document references
export const userDoc = (uid: string) => doc(getDb(), COLLECTIONS.USERS, uid);
export const organizationDoc = (id: string) => doc(getDb(), COLLECTIONS.ORGANIZATIONS, id);
export const meetingDoc = (id: string) => doc(getDb(), COLLECTIONS.MEETINGS, id);
export const transcriptDoc = (id: string) => doc(getDb(), COLLECTIONS.TRANSCRIPTS, id);
export const aiDocumentDoc = (id: string) => doc(getDb(), COLLECTIONS.AI_DOCUMENTS, id);
export const templateDoc = (id: string) => doc(getDb(), COLLECTIONS.DOCUMENT_TEMPLATES, id);
export const promptDoc = (id: string) => doc(getDb(), COLLECTIONS.PROMPT_TEMPLATES, id);
export const settingsDoc = (id: string) => doc(getDb(), COLLECTIONS.WORKSPACE_SETTINGS, id);
export const subscriptionDoc = (id: string) => doc(getDb(), COLLECTIONS.SUBSCRIPTIONS, id);
