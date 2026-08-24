import { notFound } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import { Clock, ListChecks } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { getCompanyByUserId } from '@/lib/data/store';
import { getSurveyAnalytics } from '@/lib/services/company';
import { Badge } from '@/components/ui/badge';
import { SurveyAnalytics } from '@/components/company/survey-analytics';
import { pick } from '@/lib/i18n-utils';
import { Locale, SurveyStatus } from '@/lib/types';

const STATUS_VARIANT: Record<SurveyStatus, 'success' | 'warning' | 'neutral' | 'info'> = {
  active: 'success',
  paused: 'warning',
  draft: 'neutral',
  completed: 'info',
};

export default async function CompanySurveyDetailPage({ params }: { params: { id: string } }) {
  const locale = (await getLocale()) as Locale;
  const session = await getSession();
  const tStatus = await getTranslations('surveyStatus');
  const tCat = await getTranslations('categories');
  const tc = await getTranslations('common');

  const company = await getCompanyByUserId(session!.uid);
  const analytics = await getSurveyAnalytics(params.id);
  if (!analytics || analytics.survey.companyId !== company?.id) notFound();

  const { survey, totalResponses, avgTime, completionRate, demographics, questionBreakdown } = analytics;

  return (
    <div className="container-app py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{pick(survey.title, locale)}</h1>
            <Badge variant={STATUS_VARIANT[survey.status]}>{tStatus(survey.status)}</Badge>
          </div>
          <p className="mt-1 max-w-xl text-sm text-ink-500">{pick(survey.description, locale)}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-ink-400">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} /> {survey.estimatedMinutes} {tc('min')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ListChecks size={13} /> {survey.questions.length} {tc('questions')}
            </span>
            <span className="rounded-full bg-ink-100 px-2.5 py-1 font-semibold text-ink-600">{tCat(survey.category)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <SurveyAnalytics
          survey={survey}
          locale={locale}
          totalResponses={totalResponses}
          avgTime={avgTime}
          completionRate={completionRate}
          demographics={demographics}
          questionBreakdown={questionBreakdown}
        />
      </div>
    </div>
  );
}
