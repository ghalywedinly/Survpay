'use client';

import { useState } from 'react';
import { Sidebar, NavItem } from './sidebar';
import { MobileDrawer } from './mobile-drawer';
import { Topbar } from './topbar';
import { Notification } from '@/lib/types';
import { IconKey } from './icon-registry';

export function DashboardShell({
  items,
  homeHref,
  notifications,
  unreadCount,
  notificationsHref,
  user,
  userLinks,
  logoutLabel,
  extra,
  bottomNav,
  sidebarFooter,
  children,
}: {
  items: NavItem[];
  homeHref: string;
  notifications: Notification[];
  unreadCount: number;
  notificationsHref: string;
  user: { name: string; email: string; avatarColor: string };
  userLinks: { href: string; label: string; icon: IconKey }[];
  logoutLabel: string;
  extra?: React.ReactNode;
  bottomNav?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ground">
      <Sidebar items={items} homeHref={homeHref} logoutLabel={logoutLabel} footer={sidebarFooter} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} items={items} />
      <div className="lg:ps-64">
        <Topbar
          onMenuClick={() => setDrawerOpen(true)}
          notifications={notifications}
          unreadCount={unreadCount}
          notificationsHref={notificationsHref}
          user={user}
          userLinks={userLinks}
          logoutLabel={logoutLabel}
          extra={extra}
          showLogo
        />
        <main className={bottomNav ? 'pb-24 lg:pb-0' : ''}>{children}</main>
      </div>
      {bottomNav}
    </div>
  );
}
