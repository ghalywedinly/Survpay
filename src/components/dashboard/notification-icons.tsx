import { Wallet, FileText, Banknote, TrendingUp, PartyPopper, Bell } from 'lucide-react';
import { NotificationKind } from '@/lib/types';

export const NOTIFICATION_ICONS: Record<NotificationKind, typeof Bell> = {
  new_survey: FileText,
  reward_earned: Wallet,
  withdrawal_processed: Banknote,
  survey_progress: TrendingUp,
  survey_completed: PartyPopper,
  system: Bell,
};
