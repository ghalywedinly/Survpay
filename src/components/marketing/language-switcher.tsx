'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';
import { useTransition } from 'react';

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: 'ar' | 'en') {
    if (next === locale) return;
    startTransition(() => {
      router.replace({ pathname, query: Object.fromEntries(searchParams.entries()) } as never, { locale: next });
    });
  }

  return (
    <div className={clsx('inline-flex items-center rounded-full bg-ink-100 p-1 text-sm font-semibold', className)} aria-busy={isPending}>
      <button
        onClick={() => switchTo('ar')}
        className={clsx('rounded-full px-3 py-1.5 transition-colors', locale === 'ar' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500')}
      >
        العربية
      </button>
      <button
        onClick={() => switchTo('en')}
        className={clsx('rounded-full px-3 py-1.5 transition-colors', locale === 'en' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500')}
      >
        English
      </button>
    </div>
  );
}
