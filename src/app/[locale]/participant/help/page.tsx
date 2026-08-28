import { getTranslations } from 'next-intl/server';
import { LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function ParticipantHelpPage() {
  const t = await getTranslations('helpPage');
  const faqs = [1, 2, 3, 4].map((i) => ({ q: t(`q${i}`), a: t(`a${i}`) }));

  return (
    <div className="container-app max-w-2xl py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>

      <div className="mt-6 divide-y-2 divide-ink-900 rounded-none border-2 border-ink-900 bg-paper">
        {faqs.map((f, i) => (
          <details key={i} className="group px-5 py-4 open:bg-ink-50/50">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-ink-900">
              {f.q}
              <span className="ms-4 shrink-0 text-ink-400 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-6 card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center border-2 border-ink-900 text-ink-900">
            <LifeBuoy size={20} />
          </span>
          <div>
            <p className="text-sm font-bold text-ink-900">{t('contactTitle')}</p>
            <p className="text-xs text-ink-500">{t('contactBody')}</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          {t('contactCta')}
        </Button>
      </div>
    </div>
  );
}
