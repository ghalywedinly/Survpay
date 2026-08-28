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
  type LucideIcon,
} from 'lucide-react';
import { InterestKey, DeviceKey, SurveyCategory, IncomeRange, EmploymentStatus, MaritalStatus } from './types';

// Icons are ink by default — never filled, never in a coloured circle, never
// two-tone (Brand elements · Icons). Category is conveyed by icon shape and
// label alone, not by a rainbow of per-category colours.
export const CATEGORY_META: Record<SurveyCategory, { icon: LucideIcon }> = {
  shopping: { icon: ShoppingBag },
  food: { icon: UtensilsCrossed },
  technology: { icon: Cpu },
  finance: { icon: Landmark },
  travel: { icon: Plane },
  entertainment: { icon: Clapperboard },
  healthcare: { icon: HeartPulse },
  automotive: { icon: Car },
  lifestyle: { icon: Sparkles },
  other: { icon: Grid3x3 },
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
