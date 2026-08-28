'use client';

import { Home, Compass, Wallet, UserCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { Link, usePathname } from '@/i18n/routing';

export function BottomNav({
  labels,
}: {
  labels: { home: string; surveys: string; earnings: string; profile: string };
}) {
  const pathname = usePathname();
  const items = [
    { href: '/participant/dashboard', label: labels.home, icon: Home },
    { href: '/participant/surveys', label: labels.surveys, icon: Compass },
    { href: '/participant/earnings', label: labels.earnings, icon: Wallet },
    { href: '/participant/profile', label: labels.profile, icon: UserCircle },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t-2 border-ink-900 bg-paper pb-[env(safe-area-inset-bottom)] lg:hidden">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href as never}
            className={clsx('flex flex-col items-center gap-1 py-2.5 text-[11px] font-bold', active ? 'text-brand-500' : 'text-ink-400')}
          >
            <item.icon size={20} strokeWidth={active ? 2.4 : 2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
