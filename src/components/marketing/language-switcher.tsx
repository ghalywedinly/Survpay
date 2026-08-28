'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';
import { useTransition } from 'react';

// "Language toggle always visible in the header, labelled in the target
// language — عربي / EN." One capsule, one label: what it switches to.
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const target = locale === 'ar' ? 'en' : 'ar';

  function toggle() {
    startTransition(() => {
      router.replace({ pathname, query: Object.fromEntries(searchParams.entries()) } as never, { locale: target });
    });
  }

  return (
    <button
      onClick={toggle}
      aria-busy={isPending}
      className={clsx(
        'inline-flex items-center rounded-full border-2 border-ink-900 px-4 py-1.5 text-sm font-bold text-ink-900 transition-colors hover:bg-ink-100',
        className
      )}
    >
      {target === 'ar' ? 'عربي' : 'EN'}
    </button>
  );
}
