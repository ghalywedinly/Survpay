import { getTranslations, getLocale } from 'next-intl/server';
import { CreateSurveyWizard } from '@/components/company/create-survey-wizard';
import { Locale } from '@/lib/types';

export default async function CreateSurveyPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('createSurvey');

  return (
    <div className="container-app max-w-3xl py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <div className="mt-6">
        <CreateSurveyWizard locale={locale} />
      </div>
    </div>
  );
}
