'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Clock, ListChecks } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CATEGORY_META } from '@/lib/constants';
import { pick } from '@/lib/i18n-utils';
import { formatSar, formatDate } from '@/lib/format';
import { Survey, SurveyResponse, Locale } from '@/lib/types';

export function MySurveysView({
  inProgress,
  completed,
  surveyMap,
  locale,
}: {
  inProgress: SurveyResponse[];
  completed: SurveyResponse[];
  surveyMap: Record<string, Survey>;
  locale: Locale;
}) {
  const t = useTranslations('mySurveys');
  const tCat = useTranslations('categories');
  const [tab, setTab] = useState<'in_progress' | 'completed'>(completed.length && !inProgress.length ? 'completed' : 'in_progress');

  const list = tab === 'in_progress' ? inProgress : completed;

  return (
    <div>
      <Tabs
        value={tab}
        onChange={(v) => setTab(v as 'in_progress' | 'completed')}
        tabs={[
          { value: 'in_progress', label: t('tabInProgress'), count: inProgress.length },
          { value: 'completed', label: t('tabCompleted'), count: completed.length },
        ]}
        className="max-w-sm"
      />

      {list.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={ListChecks}
            title={t('empty')}
            description={t('emptyBody')}
            action={
              <Link href="/participant/surveys">
                <Button variant="secondary">{t('browseSurveys')}</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {list.map((r) => {
            const survey = surveyMap[r.surveyId];
            if (!survey) return null;
            const meta = CATEGORY_META[survey.category];
            const Icon = meta.icon;
            return (
              <div key={r.id} className="card flex items-center gap-4 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-ink-200 text-ink-500">
                  <Icon size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink-900">{pick(survey.title, locale)}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{tCat(survey.category)}</p>
                </div>
                {r.status === 'completed' ? (
                  <div className="text-end">
                    <Badge variant="success" dot>
                      <CheckCircle2 size={12} /> {t('earned')} {formatSar(r.rewardAmount, locale)}
                    </Badge>
                    <p className="mt-1 text-[11px] text-ink-400">{r.completedAt && t('completedOn', { date: formatDate(r.completedAt, locale) })}</p>
                  </div>
                ) : (
                  <Link href={`/participant/surveys/${survey.id}` as never}>
                    <Button size="sm" variant="outline" icon={<Clock size={14} />}>
                      {t('tabInProgress')}
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
