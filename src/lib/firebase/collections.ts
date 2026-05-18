// Sunave — Firestore Collection References
import { collection, doc, type CollectionReference, type DocumentReference } from 'firebase/firestore';
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

// Typed collection references
export const usersRef = () => collection(db, COLLECTIONS.USERS);
export const organizationsRef = () => collection(db, COLLECTIONS.ORGANIZATIONS);
export const meetingsRef = () => collection(db, COLLECTIONS.MEETINGS);
export const transcriptsRef = () => collection(db, COLLECTIONS.TRANSCRIPTS);
export const aiDocumentsRef = () => collection(db, COLLECTIONS.AI_DOCUMENTS);
export const documentTemplatesRef = () => collection(db, COLLECTIONS.DOCUMENT_TEMPLATES);
export const promptTemplatesRef = () => collection(db, COLLECTIONS.PROMPT_TEMPLATES);
export const workspaceSettingsRef = () => collection(db, COLLECTIONS.WORKSPACE_SETTINGS);
export const exportsRef = () => collection(db, COLLECTIONS.EXPORTS);
export const subscriptionsRef = () => collection(db, COLLECTIONS.SUBSCRIPTIONS);
export const paymentsRef = () => collection(db, COLLECTIONS.PAYMENTS);
export const usageRef = () => collection(db, COLLECTIONS.USAGE);

// Document references
export const userDoc = (uid: string) => doc(db, COLLECTIONS.USERS, uid);
export const organizationDoc = (id: string) => doc(db, COLLECTIONS.ORGANIZATIONS, id);
export const meetingDoc = (id: string) => doc(db, COLLECTIONS.MEETINGS, id);
export const transcriptDoc = (id: string) => doc(db, COLLECTIONS.TRANSCRIPTS, id);
export const aiDocumentDoc = (id: string) => doc(db, COLLECTIONS.AI_DOCUMENTS, id);
export const templateDoc = (id: string) => doc(db, COLLECTIONS.DOCUMENT_TEMPLATES, id);
export const promptDoc = (id: string) => doc(db, COLLECTIONS.PROMPT_TEMPLATES, id);
export const settingsDoc = (id: string) => doc(db, COLLECTIONS.WORKSPACE_SETTINGS, id);
export const subscriptionDoc = (id: string) => doc(db, COLLECTIONS.SUBSCRIPTIONS, id);
