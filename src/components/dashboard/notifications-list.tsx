'use client';

import { useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CheckCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { Notification, Locale } from '@/lib/types';
import { timeAgo } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Bell } from 'lucide-react';
import { NOTIFICATION_ICONS } from './notification-icons';
import { useNotificationText } from './use-notification-text';
import { markAllReadAction } from '@/app/actions/notifications';

export function NotificationsList({ notifications }: { notifications: Notification[] }) {
  const t = useTranslations('notificationsPage');
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();
  const resolveText = useNotificationText();

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div>
      {unread > 0 && (
        <div className="mb-4 flex justify-end">
          <Button
            size="sm"
            variant="outline"
            icon={<CheckCheck size={15} />}
            loading={isPending}
            onClick={() => startTransition(async () => markAllReadAction())}
          >
            {t('markAllRead')}
          </Button>
        </div>
      )}
      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title={t('empty')} description={t('emptyBody')} />
      ) : (
        <div className="card !p-0 divide-y divide-ink-100">
          {notifications.map((n) => {
            const Icon = NOTIFICATION_ICONS[n.kind];
            const { title, body } = resolveText(n);
            return (
              <div key={n.id} className={clsx('flex gap-3 px-5 py-4', !n.read && 'bg-brand-50/40')}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-600">
                  <Icon size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink-900">{title}</p>
                  <p className="mt-0.5 text-sm text-ink-500">{body}</p>
                  <p className="mt-1 text-xs text-ink-400">{timeAgo(n.createdAt, locale)}</p>
                </div>
                {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
