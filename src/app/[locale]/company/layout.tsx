import { Wallet } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/routing';
import { getSession } from '@/lib/auth';
import { getCompanyByUserId } from '@/lib/data/store';
import { listNotifications, unreadCount } from '@/lib/services/notifications';
import { DashboardShell } from '@/components/dashboard/shell';
import { NavItem } from '@/components/dashboard/sidebar';
import { formatSar } from '@/lib/format';
import { Locale } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function CompanyLayout({ children }: { children: React.ReactNode }) {
  const locale = (await getLocale()) as Locale;
  const sessionData = await getSession();
  if (!sessionData || sessionData.role !== 'company') {
    redirect({ href: '/login', locale });
    return null;
  }
  const session = sessionData;

  const [t, company, notifications, unread] = await Promise.all([
    getTranslations('companyNav'),
    getCompanyByUserId(session.uid),
    listNotifications(session.uid),
    unreadCount(session.uid),
  ]);

  const items: NavItem[] = [
    { href: '/company/dashboard', label: t('overview'), icon: 'layoutGrid' },
    { href: '/company/surveys', label: t('mySurveys'), icon: 'listChecks' },
    { href: '/company/surveys/create', label: t('createSurvey'), icon: 'plusCircle' },
    { href: '/company/responses', label: t('responses'), icon: 'messageSquareText' },
    { href: '/company/audience', label: t('audience'), icon: 'users2' },
    { href: '/company/billing', label: t('billing'), icon: 'creditCard' },
    { href: '/company/reports', label: t('reports'), icon: 'barChart3' },
    { href: '/company/team', label: t('team'), icon: 'usersRound' },
    { href: '/company/settings', label: t('settings'), icon: 'settings' },
  ];

  const userLinks: NavItem[] = [
    { href: '/company/billing', label: t('billing'), icon: 'creditCard' },
    { href: '/company/team', label: t('team'), icon: 'usersRound' },
    { href: '/company/settings', label: t('settings'), icon: 'settings' },
  ];

  return (
    <DashboardShell
      items={items}
      homeHref="/company/dashboard"
      notifications={notifications}
      unreadCount={unread}
      notificationsHref="/company/notifications"
      user={{ name: session.name, email: session.email, avatarColor: company?.logoColor || '#3229f2' }}
      userLinks={userLinks}
      logoutLabel={t('logout')}
      extra={
        company && (
          <div className="hidden items-center gap-1.5 rounded-xl bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-700 sm:flex">
            <Wallet size={15} />
            {formatSar(company.walletBalance, locale)}
          </div>
        )
      }
    >
      {children}
    </DashboardShell>
  );
}
