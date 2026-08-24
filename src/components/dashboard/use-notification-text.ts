'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Notification, Locale } from '@/lib/types';
import { formatSar } from '@/lib/format';

/**
 * Notifications are stored as a `messageKey` + raw `params` (see
 * `Notification` in lib/types.ts) so they render in the viewer's current
 * locale rather than whatever locale was active when the notification was
 * created server-side. This resolves that into a displayable {title, body}.
 */
export function useNotificationText() {
  const t = useTranslations('notificationMsgs');
  const locale = useLocale() as Locale;

  return function resolve(n: Notification): { title: string; body: string } {
    const raw = n.params ?? {};
    const params: Record<string, string | number> = { ...raw };
    if (typeof raw.amount === 'number') params.amount = formatSar(raw.amount, locale);
    if (typeof raw.surveyTitleEn === 'string' || typeof raw.surveyTitleAr === 'string') {
      params.surveyTitle = (locale === 'ar' ? raw.surveyTitleAr : raw.surveyTitleEn) as string;
    }
    try {
      return { title: t(`${n.messageKey}Title` as never, params), body: t(`${n.messageKey}Body` as never, params) };
    } catch {
      return { title: n.messageKey, body: '' };
    }
  };
}
