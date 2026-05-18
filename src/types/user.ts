// Sunave — User & Organization Types

export interface SunaveUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
  plan: 'free' | 'pro' | 'enterprise';
  organizationId?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  preferences: UserPreferences;
  usage: UserUsage;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  language: 'en' | 'hi' | 'hinglish';
  transcriptionMode: 'bot-free' | 'ai-assistant';
  aiTone: 'professional' | 'casual' | 'technical' | 'executive';
  layoutDensity: 'compact' | 'comfortable' | 'spacious';
  sidebarCollapsed: boolean;
  dashboardWidgets: string[];
  notifications: {
    email: boolean;
    inApp: boolean;
    transcriptionComplete: boolean;
    documentGenerated: boolean;
  };
}

export interface UserUsage {
  meetingsThisMonth: number;
  aiTokensUsed: number;
  storageUsedMB: number;
  transcriptionMinutes: number;
  documentsGenerated: number;
  lastResetDate: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoURL?: string;
  ownerId: string;
  members: OrganizationMember[];
  settings: OrganizationSettings;
  plan: 'free' | 'pro' | 'enterprise';
  subscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  uid: string;
  email: string;
  displayName: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

export interface OrganizationSettings {
  branding: {
    primaryColor: string;
    accentColor: string;
    logoURL?: string;
    companyName: string;
  };
  compliance: {
    consentBannerEnabled: boolean;
    dataRetentionDays: number;
    autoDeleteTranscripts: boolean;
  };
  ai: {
    defaultTone: string;
    defaultLanguage: string;
    customVocabulary: string[];
    domainTerms: Record<string, string>;
  };
  templates: {
    enforceOrganizationTemplates: boolean;
    allowCustomTemplates: boolean;
  };
}
