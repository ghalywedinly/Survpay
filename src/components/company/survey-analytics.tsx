'use client';

import { useTranslations } from 'next-intl';
import { Download, MessageSquareText, Clock, Percent, Coins } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { BarList } from '@/components/dashboard/bar-list';
import { Button } from '@/components/ui/button';
import { pick } from '@/lib/i18n-utils';
import { formatSar, formatNumber } from '@/lib/format';
import { Locale, Survey } from '@/lib/types';

interface QuestionBreakdownItem {
  question: Survey['questions'][number];
  kind: 'rating' | 'text' | 'choice';
  average?: number;
  count?: number;
  samples?: string[];
  counts?: Record<string, number>;
}

export function SurveyAnalytics({
  survey,
  locale,
  totalResponses,
  avgTime,
  completionRate,
  demographics,
  questionBreakdown,
}: {
  survey: Survey;
  locale: Locale;
  totalResponses: number;
  avgTime: number;
  completionRate: number;
  demographics: { gender: Record<string, number>; city: Record<string, number>; income: Record<string, number>; age: Record<string, number> };
  questionBreakdown: QuestionBreakdownItem[];
}) {
  const t = useTranslations('companyReports');
  const tGender = useTranslations('gender');
  const tIncome = useTranslations('income');
  const tCity = useTranslations('cities');
  const tc = useTranslations('common');

  function exportCsv() {
    const rows = [['Metric', 'Value']];
    rows.push(['Survey', pick(survey.title, locale)]);
    rows.push(['Total Responses', String(totalResponses)]);
    rows.push(['Completion Rate', `${completionRate}%`]);
    rows.push(['Avg Time (s)', String(avgTime)]);
    rows.push(['Cost Per Response', String(survey.costPerResponse)]);
    rows.push([]);
    rows.push(['Question', 'Answer', 'Count']);
    questionBreakdown.forEach((qb) => {
      if (qb.kind === 'choice' && qb.counts) {
        Object.entries(qb.counts).forEach(([answer, count]) => {
          rows.push([pick(qb.question.prompt, locale), answer, String(count)]);
        });
      } else if (qb.kind === 'rating') {
        rows.push([pick(qb.question.prompt, locale), 'Average rating', String(qb.average)]);
      }
    });
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${survey.id}-results.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink-900">{t('title')}</h2>
        <Button variant="outline" size="sm" icon={<Download size={15} />} onClick={exportCsv}>
          {t('exportResults')}
        </Button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('totalResponses')} value={formatNumber(totalResponses, locale)} icon={MessageSquareText} accent="brand" />
        <StatCard label={t('completionRate')} value={`${completionRate}%`} icon={Percent} />
        <StatCard label={t('avgTime')} value={`${Math.round(avgTime / 60)}m`} icon={Clock} />
        <StatCard label={t('costPerResponse')} value={formatSar(survey.costPerResponse, locale)} icon={Coins} accent="money" />
      </div>

      <div className="mt-6 card">
        <h3 className="text-base font-bold text-ink-900">{t('demographics')}</h3>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-400">{t('gender')}</p>
            <BarList data={Object.entries(demographics.gender).map(([k, v]) => ({ key: k, value: v }))} formatLabel={(k) => tGender(k as never)} color="#AA52F7" />
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-400">{t('age')}</p>
            <BarList data={Object.entries(demographics.age).map(([k, v]) => ({ key: k, value: v }))} />
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-400">{t('city')}</p>
            <BarList data={Object.entries(demographics.city).map(([k, v]) => ({ key: k, value: v }))} formatLabel={(k) => tCity(k as never)} />
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-400">{t('income')}</p>
            <BarList data={Object.entries(demographics.income).map(([k, v]) => ({ key: k, value: v }))} formatLabel={(k) => tIncome(k as never)} color="#20d9d5" />
          </div>
        </div>
      </div>

      <div className="mt-6 card">
        <h3 className="text-base font-bold text-ink-900">{t('questionBreakdown')}</h3>
        <div className="mt-5 space-y-6">
          {questionBreakdown.map((qb, i) => (
            <div key={i} className="border-b border-ink-100 pb-6 last:border-0 last:pb-0">
              <p className="text-sm font-bold text-ink-900">{pick(qb.question.prompt, locale)}</p>
              {qb.kind === 'choice' && qb.counts && (
                <div className="mt-3">
                  <BarList data={Object.entries(qb.counts).map(([k, v]) => ({ key: k, value: v }))} />
                </div>
              )}
              {qb.kind === 'rating' && (
                <div className="mt-3 flex items-center gap-3">
                  <p className="text-2xl font-extrabold text-brand-700">{qb.average?.toFixed(1)}</p>
                  <p className="text-sm text-ink-500">
                    {t('avgRating')} · {qb.count} {t('responses')}
                  </p>
                </div>
              )}
              {qb.kind === 'text' && qb.samples && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold text-ink-400">{t('sampleAnswers')}</p>
                  {qb.samples.length === 0 && <p className="text-sm text-ink-400">{tc('noResults')}</p>}
                  {qb.samples.map((s, si) => (
                    <p key={si} className="rounded-none border border-ink-100 bg-ink-50 px-3 py-2 text-sm text-ink-600">
                      &ldquo;{s}&rdquo;
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
