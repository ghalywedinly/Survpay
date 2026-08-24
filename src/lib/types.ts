export type Role = 'participant' | 'company' | 'admin';
export type Locale = 'ar' | 'en';

export interface LocalizedText {
  en: string;
  ar: string;
}

export type Gender = 'male' | 'female';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
export type EmploymentStatus = 'employed' | 'self_employed' | 'unemployed' | 'student' | 'retired';
export type IncomeRange = 'under_5k' | '5k_10k' | '10k_15k' | '15k_25k' | '25k_plus';

export type InterestKey =
  | 'technology'
  | 'gaming'
  | 'sports'
  | 'travel'
  | 'fashion'
  | 'food'
  | 'finance'
  | 'cars'
  | 'shopping';

export type DeviceKey = 'iphone' | 'android' | 'computer' | 'tablet';

export const SAUDI_CITIES = [
  'Riyadh',
  'Jeddah',
  'Mecca',
  'Medina',
  'Dammam',
  'Khobar',
  'Taif',
  'Buraidah',
  'Tabuk',
  'Abha',
  'Khamis Mushait',
  'Hail',
  'Najran',
  'Jubail',
  'Yanbu',
] as const;
export type SaudiCity = (typeof SAUDI_CITIES)[number];

export interface User {
  id: string;
  role: Role;
  email: string;
  passwordHash: string;
  name: string;
  avatarColor: string;
  createdAt: string;
  status: 'active' | 'suspended' | 'pending_verification';
  emailVerified: boolean;
  locale: Locale;
}

export interface ParticipantProfile {
  userId: string;
  dateOfBirth: string;
  gender: Gender;
  city: SaudiCity;
  householdSize: number;
  maritalStatus: MaritalStatus;
  children: number;
  employmentStatus: EmploymentStatus;
  industry: string;
  jobTitle: string;
  incomeRange: IncomeRange;
  interests: InterestKey[];
  devices: DeviceKey[];
  balanceAvailable: number;
  balancePending: number;
  totalEarned: number;
  surveysCompleted: number;
  riskScore: 'low' | 'medium' | 'high';
  fraudFlags: FraudFlag[];
}

export type CompanyPlan = 'starter' | 'growth' | 'enterprise';

export interface Company {
  id: string;
  userId: string;
  name: string;
  logoColor: string;
  industry: string;
  website: string;
  plan: CompanyPlan;
  walletBalance: number;
  totalSpent: number;
  createdAt: string;
  teamMembers: { id: string; name: string; email: string; role: 'owner' | 'admin' | 'analyst' }[];
}

export type SurveyCategory =
  | 'shopping'
  | 'food'
  | 'technology'
  | 'finance'
  | 'travel'
  | 'entertainment'
  | 'healthcare'
  | 'automotive'
  | 'lifestyle'
  | 'other';

export type SurveyStatus = 'draft' | 'active' | 'paused' | 'completed';

export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'rating'
  | 'yes_no'
  | 'text'
  | 'demographic';

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  prompt: LocalizedText;
  options?: LocalizedText[];
  required: boolean;
  isAttentionCheck?: boolean;
}

export interface TargetAudience {
  ageMin: number;
  ageMax: number;
  genders: Gender[];
  cities: SaudiCity[];
  incomeRanges: IncomeRange[];
  employmentStatuses: EmploymentStatus[];
  interests: InterestKey[];
  householdSizeMin?: number;
  householdSizeMax?: number;
}

export interface Survey {
  id: string;
  companyId: string;
  title: LocalizedText;
  description: LocalizedText;
  category: SurveyCategory;
  estimatedMinutes: number;
  rewardPerResponse: number;
  targetResponses: number;
  responseCount: number;
  status: SurveyStatus;
  targetAudience: TargetAudience;
  questions: SurveyQuestion[];
  createdAt: string;
  launchedAt?: string;
  completedAt?: string;
  costPerResponse: number;
}

export type SurveyResponseStatus = 'in_progress' | 'completed' | 'disqualified';

export interface SurveyAnswer {
  questionId: string;
  value: string | string[] | number;
  timeSpentSeconds: number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  participantId: string;
  status: SurveyResponseStatus;
  answers: SurveyAnswer[];
  startedAt: string;
  completedAt?: string;
  rewardAmount: number;
  totalTimeSeconds?: number;
}

export type TransactionType = 'survey_reward' | 'withdrawal' | 'bonus' | 'adjustment' | 'company_charge' | 'company_topup';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  description: string;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
  relatedSurveyId?: string;
}

export type WithdrawalMethod = 'bank_transfer' | 'stc_pay';
export type WithdrawalStatus = 'pending' | 'approved' | 'paid' | 'rejected';

export interface Withdrawal {
  id: string;
  participantId: string;
  amount: number;
  method: WithdrawalMethod;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
  destination: string;
}

export type NotificationKind =
  | 'new_survey'
  | 'reward_earned'
  | 'withdrawal_processed'
  | 'survey_progress'
  | 'survey_completed'
  | 'system';

// `messageKey` indexes into the `notificationMsgs` message namespace
// (`{messageKey}Title` / `{messageKey}Body`) so notifications are translated
// at render time in the viewer's current locale, instead of being baked
// into a fixed language when they're created server-side.
export interface Notification {
  id: string;
  userId: string;
  kind: NotificationKind;
  messageKey: string;
  params?: Record<string, string | number>;
  createdAt: string;
  read: boolean;
  href?: string;
}

export interface FraudFlag {
  id: string;
  userId: string;
  type:
    | 'multiple_accounts'
    | 'fast_completion'
    | 'repeated_answers'
    | 'device_pattern'
    | 'failed_attention_check'
    | 'abnormal_behavior';
  description: string;
  detectedAt: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
}
