'use client';

import { LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { Link, usePathname } from '@/i18n/routing';
import { Logo } from '@/components/brand/logo';
import { logoutAction } from '@/app/actions/auth';
import { ICONS, IconKey } from './icon-registry';

export interface NavItem {
  href: string;
  label: string;
  icon: IconKey;
}

export function Sidebar({
  items,
  homeHref,
  logoutLabel,
  footer,
}: {
  items: NavItem[];
  homeHref: string;
  logoutLabel: string;
  footer?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 flex-col border-e border-ink-100 bg-white lg:flex">
      <div className="flex h-16 items-center px-6">
        <Link href={homeHref}>
          <Logo size={24} />
        </Link>
      </div>
      <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = ICONS[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href as never}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                active ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
              )}
            >
              <Icon size={18} className={active ? 'text-white' : 'text-ink-400'} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-3 border-t border-ink-100 p-4">
        {footer}
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
          >
            <LogOut size={18} className="text-ink-400" />
            {logoutLabel}
          </button>
        </form>
      </div>
    </aside>
  );
}
