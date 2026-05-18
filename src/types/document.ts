// Sunave — AI Document & Template Types

export type DocumentType =
  | 'mom' // Minutes of Meeting
  | 'brd' // Business Requirements Document
  | 'frd' // Functional Requirements Document
  | 'user-stories'
  | 'acceptance-criteria'
  | 'sprint-tasks'
  | 'test-scenarios'
  | 'action-items'
  | 'risks-dependencies'
  | 'grooming-questions'
  | 'follow-up-email'
  | 'stakeholder-summary'
  | 'custom';

export type DocumentStatus = 'generating' | 'completed' | 'failed' | 'draft' | 'reviewed' | 'approved';

export interface AIDocument {
  id: string;
  meetingId: string;
  transcriptId: string;
  userId: string;
  organizationId?: string;
  type: DocumentType;
  title: string;
  templateId?: string;
  sections: DocumentSection[];
  fullContent: string;
  status: DocumentStatus;
  version: number;
  versions: DocumentVersion[];
  metadata: DocumentMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  order: number;
  isVisible: boolean;
  isRequired: boolean;
  aiInstructions?: string;
  formatting?: SectionFormatting;
}

export interface DocumentVersion {
  id: string;
  version: number;
  content: string;
  changedBy: string;
  changeNote?: string;
  createdAt: string;
}

export interface DocumentMetadata {
  wordCount: number;
  sectionCount: number;
  generationTime: number; // ms
  tokensUsed: number;
  model: string;
  promptVersion: string;
}

export interface SectionFormatting {
  type: 'prose' | 'bullet-list' | 'numbered-list' | 'table' | 'checklist';
  columns?: string[]; // for table type
}

// Template System
export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  type: DocumentType;
  userId?: string; // null for org templates
  organizationId?: string;
  isDefault: boolean;
  isShared: boolean;
  sections: TemplateSectionConfig[];
  globalPrompt?: string;
  aiSettings: TemplateAISettings;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateSectionConfig {
  id: string;
  title: string;
  order: number;
  isVisible: boolean;
  isRequired: boolean;
  blockType: TemplateBlockType;
  aiInstructions: string;
  formatting: SectionFormatting;
  placeholder?: string;
  subsections?: TemplateSectionConfig[];
}

export type TemplateBlockType =
  | 'header'
  | 'ai-section'
  | 'table'
  | 'checklist'
  | 'risk-matrix'
  | 'requirement-block'
  | 'acceptance-criteria-block'
  | 'workflow-block'
  | 'free-text';

export interface TemplateAISettings {
  tone: 'professional' | 'casual' | 'technical' | 'executive';
  detailLevel: 'summary' | 'detailed' | 'comprehensive';
  language: string;
  includeConfidenceNotes: boolean;
  customInstructions?: string;
}

// Prompt Studio
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  documentType: DocumentType;
  sectionId?: string; // null for document-level prompts
  prompt: string;
  variables: PromptVariable[];
  userId: string;
  organizationId?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromptVariable {
  name: string;
  description: string;
  defaultValue: string;
  type: 'text' | 'select' | 'boolean';
  options?: string[]; // for select type
}

// Export types
export type ExportFormat = 'pdf' | 'docx' | 'markdown' | 'plain-text' | 'jira' | 'azure-devops';

export interface ExportConfig {
  format: ExportFormat;
  documentId: string;
  includeMetadata: boolean;
  includeTimestamps: boolean;
  includeSpeakerLabels: boolean;
  brandingEnabled: boolean;
  sections?: string[]; // specific section IDs to include
}

export interface ExportRecord {
  id: string;
  documentId: string;
  userId: string;
  format: ExportFormat;
  fileName: string;
  fileSize: number;
  downloadURL?: string;
  status: 'generating' | 'completed' | 'failed';
  createdAt: string;
}
