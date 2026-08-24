'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { clsx } from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Notification, Locale } from '@/lib/types';
import { timeAgo } from '@/lib/format';
import { NOTIFICATION_ICONS } from './notification-icons';
import { useNotificationText } from './use-notification-text';

export function NotificationBell({
  notifications,
  unreadCount,
  seeAllHref,
}: {
  notifications: Notification[];
  unreadCount: number;
  seeAllHref: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const resolveText = useNotificationText();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute end-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute end-0 top-12 z-50 w-80 animate-fade-in rounded-2xl border border-ink-100 bg-white p-2 shadow-2xl sm:w-96">
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && <p className="px-3 py-8 text-center text-sm text-ink-400">{t('noResults')}</p>}
            {notifications.slice(0, 6).map((n) => {
              const Icon = NOTIFICATION_ICONS[n.kind];
              const { title, body } = resolveText(n);
              return (
                <div
                  key={n.id}
                  className={clsx('flex gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-ink-50', !n.read && 'bg-brand-50/60')}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-600">
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">{title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-ink-500">{body}</p>
                    <p className="mt-1 text-[11px] text-ink-400">{timeAgo(n.createdAt, locale)}</p>
                  </div>
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                </div>
              );
            })}
          </div>
          <Link
            href={seeAllHref as never}
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-xl px-3 py-2.5 text-center text-sm font-semibold text-brand-700 hover:bg-brand-50"
          >
            {t('seeAll')}
          </Link>
        </div>
      )}
    </div>
  );
}
