import { getTranslations, getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/routing';
import { getSession } from '@/lib/auth';
import { listNotifications, unreadCount } from '@/lib/services/notifications';
import { DashboardShell } from '@/components/dashboard/shell';
import { NavItem } from '@/components/dashboard/sidebar';
import { Locale } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const locale = (await getLocale()) as Locale;
  const sessionData = await getSession();
  if (!sessionData || sessionData.role !== 'admin') {
    redirect({ href: '/login', locale });
    return null;
  }
  const session = sessionData;

  const [t, notifications, unread] = await Promise.all([
    getTranslations('adminNav'),
    listNotifications(session.uid),
    unreadCount(session.uid),
  ]);

  const items: NavItem[] = [
    { href: '/admin/dashboard', label: t('overview'), icon: 'layoutGrid' },
    { href: '/admin/users', label: t('users'), icon: 'users' },
    { href: '/admin/companies', label: t('companies'), icon: 'building2' },
    { href: '/admin/surveys', label: t('surveys'), icon: 'listChecks' },
    { href: '/admin/transactions', label: t('transactions'), icon: 'receipt' },
    { href: '/admin/withdrawals', label: t('withdrawals'), icon: 'banknote' },
    { href: '/admin/reports', label: t('reports'), icon: 'barChart3' },
    { href: '/admin/fraud', label: t('fraud'), icon: 'shieldAlert' },
    { href: '/admin/support', label: t('support'), icon: 'lifeBuoy' },
    { href: '/admin/settings', label: t('settings'), icon: 'settings' },
  ];

  const userLinks: NavItem[] = [
    { href: '/admin/settings', label: t('settings'), icon: 'settings' },
    { href: '/admin/support', label: t('support'), icon: 'lifeBuoy' },
  ];

  return (
    <DashboardShell
      items={items}
      homeHref="/admin/dashboard"
      notifications={notifications}
      unreadCount={unread}
      notificationsHref="/admin/settings"
      user={{ name: session.name, email: session.email, avatarColor: '#3229f2' }}
      userLinks={userLinks}
      logoutLabel={t('logout')}
    >
      {children}
    </DashboardShell>
  );
}
