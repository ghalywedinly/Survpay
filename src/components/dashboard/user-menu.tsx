'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Link } from '@/i18n/routing';
import { logoutAction } from '@/app/actions/auth';
import { ICONS, IconKey } from './icon-registry';

export function UserMenu({
  name,
  email,
  avatarColor,
  links,
  logoutLabel,
}: {
  name: string;
  email: string;
  avatarColor: string;
  links: { href: string; label: string; icon: IconKey }[];
  logoutLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-xl p-1 pe-2 hover:bg-ink-100">
        <Avatar name={name} color={avatarColor} size={32} />
        <ChevronDown size={14} className="hidden text-ink-400 sm:block" />
      </button>
      {open && (
        <div className="absolute end-0 top-12 z-50 w-64 animate-fade-in rounded-2xl border border-ink-100 bg-white p-2 shadow-2xl">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar name={name} color={avatarColor} size={38} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink-900">{name}</p>
              <p className="truncate text-xs text-ink-400">{email}</p>
            </div>
          </div>
          <div className="my-1.5 h-px bg-ink-100" />
          {links.map((l) => {
            const Icon = ICONS[l.icon];
            return (
              <Link
                key={l.href}
                href={l.href as never}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold text-ink-600 hover:bg-ink-100 hover:text-ink-900"
              >
                <Icon size={16} className="text-ink-400" />
                {l.label}
              </Link>
            );
          })}
          <div className="my-1.5 h-px bg-ink-100" />
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} />
              {logoutLabel}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
