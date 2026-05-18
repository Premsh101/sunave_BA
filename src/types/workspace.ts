// Sunave — Workspace & Settings Types

export interface WorkspaceSettings {
  id: string;
  userId: string;
  organizationId?: string;
  branding: BrandingSettings;
  sidebar: SidebarSettings;
  dashboard: DashboardSettings;
  theme: ThemeSettings;
  ai: AISettings;
  privacy: PrivacySettings;
  updatedAt: string;
}

export interface BrandingSettings {
  companyName: string;
  logoURL?: string;
  primaryColor: string;
  accentColor: string;
  showPoweredBy: boolean;
}

export interface SidebarSettings {
  collapsed: boolean;
  visibleItems: string[];
  pinnedItems: string[];
  customLinks: { label: string; url: string; icon?: string }[];
}

export interface DashboardSettings {
  layout: 'grid' | 'list';
  widgets: DashboardWidget[];
  showRecentMeetings: boolean;
  showUsageStats: boolean;
  showQuickActions: boolean;
}

export interface DashboardWidget {
  id: string;
  type: 'recent-meetings' | 'usage-stats' | 'quick-actions' | 'recent-documents' | 'calendar' | 'ai-insights';
  position: number;
  size: 'small' | 'medium' | 'large';
  isVisible: boolean;
}

export interface ThemeSettings {
  mode: 'dark' | 'light' | 'system';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  density: 'compact' | 'comfortable' | 'spacious';
  animations: boolean;
}

export interface AISettings {
  defaultTone: 'professional' | 'casual' | 'technical' | 'executive';
  defaultLanguage: string;
  autoSummarize: boolean;
  enableSentimentAnalysis: boolean;
  enableTopicDetection: boolean;
  customVocabulary: string[];
}

export interface PrivacySettings {
  consentBannerEnabled: boolean;
  dataRetentionDays: number;
  autoDeleteTranscripts: boolean;
  anonymizeParticipants: boolean;
  recordingConsent: 'always-ask' | 'auto-accept' | 'disabled';
}

// Index type for re-exports
export * from './user';
export * from './meeting';
export * from './document';
export * from './billing';
