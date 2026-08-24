import { getTranslations, getLocale } from 'next-intl/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/data/store';
import { listAvailableSurveys } from '@/lib/services/participant';
import { SurveyMarketplace } from '@/components/participant/survey-marketplace';
import { Locale } from '@/lib/types';

export default async function AvailableSurveysPage() {
  const locale = (await getLocale()) as Locale;
  const session = await getSession();
  const t = await getTranslations('participantSurveys');
  const [surveys, db] = await Promise.all([listAvailableSurveys(session!.uid), getDb()]);
  const companyNames = Object.fromEntries(db.companies.map((c) => [c.id, c.name]));

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>
      <div className="mt-6">
        <SurveyMarketplace surveys={surveys} locale={locale} companyNames={companyNames} />
      </div>
    </div>
  );
}
