// Sunave — Billing & Subscription Types

export type PlanTier = 'free' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing' | 'paused';

export interface Plan {
  id: string;
  tier: PlanTier;
  name: string;
  description: string;
  priceMonthly: number; // in paise for INR
  priceYearly: number;
  currency: 'INR';
  features: PlanFeature[];
  limits: PlanLimits;
  razorpayPlanId?: string;
  isPopular: boolean;
}

export interface PlanFeature {
  name: string;
  included: boolean;
  detail?: string;
}

export interface PlanLimits {
  meetingsPerMonth: number; // -1 for unlimited
  transcriptionMinutesPerMonth: number;
  aiDocumentsPerMonth: number;
  storageGB: number;
  customTemplates: number;
  teamMembers: number;
  exportFormats: string[];
  botMode: boolean;
  promptStudio: boolean;
  organizationTemplates: boolean;
  prioritySupport: boolean;
  ssoEnabled: boolean;
  complianceMode: boolean;
  apiAccess: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  organizationId?: string;
  planId: string;
  planTier: PlanTier;
  status: SubscriptionStatus;
  razorpaySubscriptionId?: string;
  razorpayCustomerId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  subscriptionId: string;
  userId: string;
  amount: number; // paise
  currency: string;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  invoiceURL?: string;
  createdAt: string;
}

export interface UsageRecord {
  userId: string;
  organizationId?: string;
  period: string; // "2024-01" format
  meetings: number;
  transcriptionMinutes: number;
  aiDocuments: number;
  aiTokensUsed: number;
  storageUsedMB: number;
  exportCount: number;
  lastUpdated: string;
}

// Pricing display helpers
export const PLANS: Plan[] = [
  {
    id: 'free',
    tier: 'free',
    name: 'Free',
    description: 'Get started with basic transcription',
    priceMonthly: 0,
    priceYearly: 0,
    currency: 'INR',
    isPopular: false,
    features: [
      { name: '5 meetings/month', included: true },
      { name: 'Basic transcription', included: true },
      { name: 'Bot-Free mode only', included: true },
      { name: 'Limited exports (Markdown)', included: true },
      { name: 'AI documents', included: false, detail: 'Upgrade to Pro' },
      { name: 'Custom templates', included: false },
      { name: 'Prompt Studio', included: false },
      { name: 'Team workspaces', included: false },
    ],
    limits: {
      meetingsPerMonth: 5,
      transcriptionMinutesPerMonth: 300,
      aiDocumentsPerMonth: 3,
      storageGB: 1,
      customTemplates: 0,
      teamMembers: 1,
      exportFormats: ['markdown', 'plain-text'],
      botMode: false,
      promptStudio: false,
      organizationTemplates: false,
      prioritySupport: false,
      ssoEnabled: false,
      complianceMode: false,
      apiAccess: false,
    },
  },
  {
    id: 'pro',
    tier: 'pro',
    name: 'Pro',
    description: 'Everything you need for AI-powered meetings',
    priceMonthly: 149900, // ₹1,499
    priceYearly: 1438800, // ₹14,388 (₹1,199/mo)
    currency: 'INR',
    isPopular: true,
    features: [
      { name: 'Unlimited meetings', included: true },
      { name: 'Unlimited transcription', included: true },
      { name: 'Bot-Free + AI Assistant modes', included: true },
      { name: 'All export formats', included: true },
      { name: 'Unlimited AI documents', included: true },
      { name: 'Custom templates', included: true, detail: 'Up to 50' },
      { name: 'Prompt Studio', included: true },
      { name: 'Team workspaces (up to 10)', included: true },
    ],
    limits: {
      meetingsPerMonth: -1,
      transcriptionMinutesPerMonth: -1,
      aiDocumentsPerMonth: -1,
      storageGB: 50,
      customTemplates: 50,
      teamMembers: 10,
      exportFormats: ['pdf', 'docx', 'markdown', 'plain-text', 'jira', 'azure-devops'],
      botMode: true,
      promptStudio: true,
      organizationTemplates: false,
      prioritySupport: false,
      ssoEnabled: false,
      complianceMode: false,
      apiAccess: true,
    },
  },
  {
    id: 'enterprise',
    tier: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    priceMonthly: -1, // custom
    priceYearly: -1,
    currency: 'INR',
    isPopular: false,
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Unlimited team members', included: true },
      { name: 'Organization templates', included: true },
      { name: 'SSO / SAML', included: true },
      { name: 'Compliance mode', included: true },
      { name: 'Priority support', included: true },
      { name: 'Dedicated onboarding', included: true },
      { name: 'Custom deployment', included: true },
    ],
    limits: {
      meetingsPerMonth: -1,
      transcriptionMinutesPerMonth: -1,
      aiDocumentsPerMonth: -1,
      storageGB: -1,
      customTemplates: -1,
      teamMembers: -1,
      exportFormats: ['pdf', 'docx', 'markdown', 'plain-text', 'jira', 'azure-devops'],
      botMode: true,
      promptStudio: true,
      organizationTemplates: true,
      prioritySupport: true,
      ssoEnabled: true,
      complianceMode: true,
      apiAccess: true,
    },
  },
];
