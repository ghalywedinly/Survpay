'use client';

import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { Link, usePathname } from '@/i18n/routing';
import { Logo } from '@/components/brand/logo';
import { NavItem } from './sidebar';
import { ICONS } from './icon-registry';

export function MobileDrawer({ open, onClose, items }: { open: boolean; onClose: () => void; items: NavItem[] }) {
  const pathname = usePathname();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-ink-950/50" onClick={onClose} />
      <div className="absolute inset-y-0 start-0 w-72 animate-fade-in bg-white p-4 shadow-2xl">
        <div className="flex items-center justify-between px-2 py-2">
          <Logo size={22} />
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-ink-100">
            <X size={18} />
          </button>
        </div>
        <nav className="mt-3 space-y-1">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = ICONS[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href as never}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold',
                  active ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100'
                )}
              >
                <Icon size={18} className={active ? 'text-white' : 'text-ink-400'} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
