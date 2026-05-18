// Sunave — Meeting & Transcript Types

export type TranscriptionMode = 'bot-free' | 'ai-assistant';
export type MeetingStatus = 'scheduled' | 'live' | 'processing' | 'completed' | 'failed';
export type MeetingPlatform = 'google-meet' | 'zoom' | 'teams' | 'slack-huddle' | 'other';

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  userId: string;
  organizationId?: string;
  platform: MeetingPlatform;
  meetingLink?: string;
  transcriptionMode: TranscriptionMode;
  status: MeetingStatus;
  startedAt?: string;
  endedAt?: string;
  duration?: number; // seconds
  participants: MeetingParticipant[];
  transcriptId?: string;
  documentIds: string[];
  tags: string[];
  bookmarks: MeetingBookmark[];
  analytics?: MeetingAnalytics;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingParticipant {
  id: string;
  label: string; // "Speaker 1", or user-assigned name
  customName?: string;
  speakingDuration?: number; // seconds
  segmentCount?: number;
}

export interface MeetingBookmark {
  id: string;
  timestamp: number; // seconds from start
  label: string;
  segmentId: string;
  createdAt: string;
}

export interface MeetingAnalytics {
  productivityScore?: number; // 0-100
  sentimentOverall?: 'positive' | 'neutral' | 'negative';
  topicsDiscussed: string[];
  actionItemCount: number;
  participationBalance: Record<string, number>; // speakerId -> percentage
  keyDecisions: string[];
}

export interface Transcript {
  id: string;
  meetingId: string;
  userId: string;
  organizationId?: string;
  segments: TranscriptSegment[];
  fullText: string;
  language: string;
  duration: number;
  wordCount: number;
  speakerCount: number;
  speakers: TranscriptSpeaker[];
  status: 'live' | 'processing' | 'completed' | 'edited';
  createdAt: string;
  updatedAt: string;
}

export interface TranscriptSegment {
  id: string;
  speakerId: string;
  speakerLabel: string;
  text: string;
  startTime: number; // seconds
  endTime: number; // seconds
  confidence: number; // 0-1
  language?: string;
  words?: TranscriptWord[];
  isEdited: boolean;
  originalText?: string;
  bookmarked: boolean;
  highlighted: boolean;
  tags: string[];
}

export interface TranscriptWord {
  word: string;
  startTime: number;
  endTime: number;
  confidence: number;
  speakerId?: string;
}

export interface TranscriptSpeaker {
  id: string;
  label: string; // auto-assigned "Speaker 1"
  customName?: string; // user-renamed
  totalDuration: number;
  segmentCount: number;
}

// Streaming types
export interface StreamingTranscriptResult {
  isFinal: boolean;
  transcript: string;
  confidence: number;
  speakerId?: string;
  startTime: number;
  endTime: number;
  words: TranscriptWord[];
  language?: string;
}

export interface AudioCaptureConfig {
  mode: TranscriptionMode;
  sampleRate: number;
  channelCount: number;
  encoding: 'LINEAR16' | 'WEBM_OPUS';
  language: string;
  alternativeLanguages?: string[];
  enableDiarization: boolean;
  maxSpeakers: number;
  enableAutoPunctuation: boolean;
  enableWordTimestamps: boolean;
  customVocabulary?: string[];
}
