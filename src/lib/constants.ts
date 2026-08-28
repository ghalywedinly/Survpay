import {
  ShoppingBag,
  UtensilsCrossed,
  Cpu,
  Landmark,
  Plane,
  Clapperboard,
  HeartPulse,
  Car,
  Sparkles,
  Grid3x3,
  PenTool,
  Code2,
  Rocket,
  type LucideIcon,
} from 'lucide-react';
import {
  InterestKey,
  DeviceKey,
  SurveyCategory,
  IncomeRange,
  EmploymentStatus,
  MaritalStatus,
  ProjectStageKey,
  AgentRole,
} from './types';

export const CATEGORY_META: Record<SurveyCategory, { icon: LucideIcon; color: string }> = {
  shopping: { icon: ShoppingBag, color: '#b32be0' },
  food: { icon: UtensilsCrossed, color: '#f59e0b' },
  technology: { icon: Cpu, color: '#3229f2' },
  finance: { icon: Landmark, color: '#12b35e' },
  travel: { icon: Plane, color: '#12e5da' },
  entertainment: { icon: Clapperboard, color: '#ec4899' },
  healthcare: { icon: HeartPulse, color: '#ef4444' },
  automotive: { icon: Car, color: '#64748b' },
  lifestyle: { icon: Sparkles, color: '#8636e8' },
  other: { icon: Grid3x3, color: '#6871a3' },
};

export const SURVEY_CATEGORIES: SurveyCategory[] = [
  'shopping',
  'food',
  'technology',
  'finance',
  'travel',
  'entertainment',
  'healthcare',
  'automotive',
  'lifestyle',
  'other',
];

export const INTEREST_KEYS: InterestKey[] = [
  'technology',
  'gaming',
  'sports',
  'travel',
  'fashion',
  'food',
  'finance',
  'cars',
  'shopping',
];

export const DEVICE_KEYS: DeviceKey[] = ['iphone', 'android', 'computer', 'tablet'];

export const INCOME_RANGES: IncomeRange[] = ['under_5k', '5k_10k', '10k_15k', '15k_25k', '25k_plus'];

export const EMPLOYMENT_STATUSES: EmploymentStatus[] = ['employed', 'self_employed', 'unemployed', 'student', 'retired'];

export const MARITAL_STATUSES: MaritalStatus[] = ['single', 'married', 'divorced', 'widowed'];

export const PROJECT_STAGE_ORDER: ProjectStageKey[] = ['design', 'coding', 'publishing'];

export const PROJECT_STAGE_META: Record<ProjectStageKey, { icon: LucideIcon; color: string }> = {
  design: { icon: PenTool, color: '#b32be0' },
  coding: { icon: Code2, color: '#3229f2' },
  publishing: { icon: Rocket, color: '#12b35e' },
};

export const AGENT_ROLE_META: Record<AgentRole, { icon: LucideIcon; color: string }> = {
  design: { icon: PenTool, color: '#b32be0' },
  coding: { icon: Code2, color: '#3229f2' },
  publishing: { icon: Rocket, color: '#12b35e' },
  general: { icon: Sparkles, color: '#8636e8' },
};

export const INDUSTRIES = [
  'Retail',
  'Banking & Finance',
  'Telecommunications',
  'Healthcare',
  'Education',
  'Government',
  'Technology',
  'Hospitality',
  'Construction',
  'Oil & Gas',
  'Media',
  'Other',
];
