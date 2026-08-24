import { getTranslations } from 'next-intl/server';
import { PlusCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getSession } from '@/lib/auth';
import { getCompanyByUserId } from '@/lib/data/store';
import { getCompanySurveys } from '@/lib/services/company';
import { SurveysTable } from '@/components/company/surveys-table';
import { Button } from '@/components/ui/button';

export default async function CompanySurveysPage() {
  const session = await getSession();
  const t = await getTranslations('companySurveys');
  const tNav = await getTranslations('companyNav');
  const company = await getCompanyByUserId(session!.uid);
  const surveys = await getCompanySurveys(company!.id);

  return (
    <div className="container-app py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
          <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>
        </div>
        <Link href="/company/surveys/create">
          <Button variant="secondary" icon={<PlusCircle size={17} />}>
            {tNav('createSurvey')}
          </Button>
        </Link>
      </div>
      <div className="mt-6">
        <SurveysTable surveys={surveys} />
      </div>
    </div>
  );
}
