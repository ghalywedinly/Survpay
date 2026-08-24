import { Wallet } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/routing';
import { getSession } from '@/lib/auth';
import { getParticipantProfile } from '@/lib/data/store';
import { listNotifications, unreadCount } from '@/lib/services/notifications';
import { DashboardShell } from '@/components/dashboard/shell';
import { NavItem } from '@/components/dashboard/sidebar';
import { BottomNav } from '@/components/participant/bottom-nav';
import { formatSar } from '@/lib/format';
import { Locale } from '@/lib/types';

// Authenticated, per-user data — never statically prerendered or cached.
export const dynamic = 'force-dynamic';

export default async function ParticipantLayout({ children }: { children: React.ReactNode }) {
  const locale = (await getLocale()) as Locale;
  const sessionData = await getSession();
  if (!sessionData || sessionData.role !== 'participant') {
    redirect({ href: '/login', locale });
    return null;
  }
  const session = sessionData;

  const [t, profile, notifications, unread] = await Promise.all([
    getTranslations('participantNav'),
    getParticipantProfile(session.uid),
    listNotifications(session.uid),
    unreadCount(session.uid),
  ]);

  const items: NavItem[] = [
    { href: '/participant/dashboard', label: t('overview'), icon: 'layoutGrid' },
    { href: '/participant/surveys', label: t('availableSurveys'), icon: 'compass' },
    { href: '/participant/my-surveys', label: t('mySurveys'), icon: 'listChecks' },
    { href: '/participant/earnings', label: t('earnings'), icon: 'wallet' },
    { href: '/participant/withdraw', label: t('withdraw'), icon: 'banknote' },
    { href: '/participant/profile', label: t('profile'), icon: 'userCircle' },
    { href: '/participant/notifications', label: t('notifications'), icon: 'bell' },
    { href: '/participant/help', label: t('help'), icon: 'helpCircle' },
    { href: '/participant/settings', label: t('settings'), icon: 'settings' },
  ];

  const userLinks: NavItem[] = [
    { href: '/participant/profile', label: t('profile'), icon: 'userCircle' },
    { href: '/participant/settings', label: t('settings'), icon: 'settings' },
    { href: '/participant/help', label: t('help'), icon: 'helpCircle' },
  ];

  return (
    <DashboardShell
      items={items}
      homeHref="/participant/dashboard"
      notifications={notifications}
      unreadCount={unread}
      notificationsHref="/participant/notifications"
      user={{ name: session.name, email: session.email, avatarColor: '#12b35e' }}
      userLinks={userLinks}
      logoutLabel={t('logout')}
      bottomNav={
        <BottomNav labels={{ home: t('overview'), surveys: t('availableSurveys'), earnings: t('earnings'), profile: t('profile') }} />
      }
      extra={
        profile && (
          <div className="hidden items-center gap-1.5 rounded-xl bg-money-50 px-3 py-1.5 text-sm font-bold text-money-700 sm:flex">
            <Wallet size={15} />
            {formatSar(profile.balanceAvailable, locale)}
          </div>
        )
      }
    >
      {children}
    </DashboardShell>
  );
}
