import { getTranslations, getLocale } from 'next-intl/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/data/store';
import { getMyResponses } from '@/lib/services/participant';
import { MySurveysView } from '@/components/participant/my-surveys-view';
import { Locale, Survey } from '@/lib/types';

export default async function MySurveysPage() {
  const locale = (await getLocale()) as Locale;
  const session = await getSession();
  const t = await getTranslations('mySurveys');
  const [responses, db] = await Promise.all([getMyResponses(session!.uid), getDb()]);
  const surveyMap: Record<string, Survey> = Object.fromEntries(db.surveys.map((s) => [s.id, s]));

  const inProgress = responses.filter((r) => r.status === 'in_progress');
  const completed = responses.filter((r) => r.status === 'completed');

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>
      <div className="mt-6">
        <MySurveysView inProgress={inProgress} completed={completed} surveyMap={surveyMap} locale={locale} />
      </div>
    </div>
  );
}
