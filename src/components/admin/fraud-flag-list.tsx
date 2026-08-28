'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FraudFlag } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { resolveFraudFlagAction } from '@/app/actions/admin';

const SEVERITY_VARIANT = { low: 'warning', medium: 'warning', high: 'danger' } as const;

export function FraudFlagList({ userId, flags, locale }: { userId: string; flags: FraudFlag[]; locale: 'ar' | 'en' }) {
  const t = useTranslations('adminUsers');
  const tType = useTranslations('flagType');
  const tSeverity = useTranslations('severity');
  const [isPending, startTransition] = useTransition();

  if (flags.length === 0) {
    return <p className="text-sm text-ink-400">{t('noFlags')}</p>;
  }

  return (
    <div className="space-y-3">
      {flags.map((f) => (
        <div key={f.id} className="flex items-start gap-3 rounded-none border-2 border-ink-200 p-4">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-danger-50 text-danger-600">
            <AlertTriangle size={15} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-ink-900">{tType(f.type)}</p>
              <Badge variant={SEVERITY_VARIANT[f.severity]}>{tSeverity(f.severity)}</Badge>
              {f.resolved && <Badge variant="success">{t('resolved')}</Badge>}
            </div>
            <p className="mt-1 text-sm text-ink-500">{f.description}</p>
            <p className="mt-1 text-xs text-ink-400">{formatDate(f.detectedAt, locale)}</p>
          </div>
          {!f.resolved && (
            <Button
              size="sm"
              variant="outline"
              icon={<CheckCircle2 size={14} />}
              loading={isPending}
              onClick={() => startTransition(async () => { await resolveFraudFlagAction(userId, f.id); })}
            >
              {t('resolve')}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
