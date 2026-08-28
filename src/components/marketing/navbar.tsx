'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Logo } from '@/components/brand/logo';
import { LanguageSwitcher } from './language-switcher';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/#how-it-works', label: t('howItWorks') },
    { href: '/#earn', label: t('earnMoney') },
    { href: '/#companies', label: t('forCompanies') },
    { href: '/#faq', label: t('faq') },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink-900 bg-paper">
      <nav className="container-app flex h-16 items-center justify-between">
        <Link href="/" className="shrink-0">
          <Logo size={26} />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-semibold text-ink-600 transition-colors hover:text-ink-900">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Link href="/login" className="text-sm font-semibold text-ink-700 hover:text-ink-900">
            {t('login')}
          </Link>
          <Link href="/signup">
            <Button size="sm" variant="secondary" icon={<ArrowRight size={15} className="flip-rtl" />}>
              {t('signup')}
            </Button>
          </Link>
        </div>

        <button className="p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 bg-paper lg:hidden">
          <div className="container-app flex h-16 items-center justify-between border-b-2 border-ink-900">
            <Logo size={26} />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2">
              <X size={22} />
            </button>
          </div>
          <div className="container-app flex flex-col gap-1 py-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-none px-3 py-3 text-base font-bold text-ink-700 hover:bg-ink-50"
              >
                {l.label}
              </a>
            ))}
            <div className="my-3 h-px bg-ink-100" />
            <LanguageSwitcher className="mb-3 self-start" />
            <Link href="/login" className="rounded-none px-3 py-3 text-base font-bold text-ink-700 hover:bg-ink-50">
              {t('login')}
            </Link>
            <Link href="/signup" className="mt-2">
              <Button fullWidth variant="secondary">
                {t('signup')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
