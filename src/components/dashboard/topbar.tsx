'use client';

import { Menu } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { NotificationBell } from './notification-bell';
import { UserMenu } from './user-menu';
import { Notification } from '@/lib/types';
import { IconKey } from './icon-registry';

export function Topbar({
  onMenuClick,
  notifications,
  unreadCount,
  notificationsHref,
  user,
  userLinks,
  logoutLabel,
  extra,
  showLogo,
}: {
  onMenuClick?: () => void;
  notifications: Notification[];
  unreadCount: number;
  notificationsHref: string;
  user: { name: string; email: string; avatarColor: string };
  userLinks: { href: string; label: string; icon: IconKey }[];
  logoutLabel: string;
  extra?: React.ReactNode;
  showLogo?: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b-2 border-ink-900 bg-paper px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button onClick={onMenuClick} className="rounded-full p-2 text-ink-600 hover:bg-ink-100 lg:hidden" aria-label="Menu">
            <Menu size={20} />
          </button>
        )}
        {showLogo && <Logo size={22} className="lg:hidden" />}
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        {extra}
        <NotificationBell notifications={notifications} unreadCount={unreadCount} seeAllHref={notificationsHref} />
        <UserMenu name={user.name} email={user.email} avatarColor={user.avatarColor} links={userLinks} logoutLabel={logoutLabel} />
      </div>
    </header>
  );
}
