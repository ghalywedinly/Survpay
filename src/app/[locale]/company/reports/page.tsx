import { getTranslations, getLocale } from 'next-intl/server';
import { MessageSquareText, Percent, Coins } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getSession } from '@/lib/auth';
import { getCompanyByUserId } from '@/lib/data/store';
import { getCompanySurveys, getCompanyStats, getCompanyDemographics, responsesOverTime } from '@/lib/services/company';
import { StatCard } from '@/components/dashboard/stat-card';
import { TrendChart } from '@/components/dashboard/trend-chart';
import { BarList } from '@/components/dashboard/bar-list';
import { formatSar, formatNumber } from '@/lib/format';
import { pick } from '@/lib/i18n-utils';
import { Locale } from '@/lib/types';

export default async function CompanyReportsPage() {
  const locale = (await getLocale()) as Locale;
  const session = await getSession();
  const t = await getTranslations('companyReports');
  const tGender = await getTranslations('gender');
  const tIncome = await getTranslations('income');
  const tCity = await getTranslations('cities');

  const company = await getCompanyByUserId(session!.uid);
  const [stats, demographics, trend, surveys] = await Promise.all([
    getCompanyStats(company!.id),
    getCompanyDemographics(company!.id),
    responsesOverTime(company!.id),
    getCompanySurveys(company!.id),
  ]);

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label={t('totalResponses')} value={formatNumber(stats.totalResponses, locale)} icon={MessageSquareText} accent="brand" />
        <StatCard
          label={t('completionRate')}
          value={`${stats.totalSurveys ? Math.round((stats.totalResponses / (stats.totalSurveys * 500)) * 100) : 0}%`}
          icon={Percent}
        />
        <StatCard label={t('costPerResponse')} value={formatSar(stats.avgCostPerResponse, locale)} icon={Coins} accent="money" />
      </div>

      <div className="mt-6 card">
        <h2 className="text-base font-bold text-ink-900">{t('title')}</h2>
        <div className="mt-4">
          <TrendChart data={trend} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('gender')}</h3>
          <BarList data={Object.entries(demographics.gender).map(([k, v]) => ({ key: k, value: v }))} formatLabel={(k) => tGender(k as never)} color="#b32be0" />
        </div>
        <div className="card">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('age')}</h3>
          <BarList data={Object.entries(demographics.age).map(([k, v]) => ({ key: k, value: v }))} color="#12e5da" />
        </div>
        <div className="card">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('city')}</h3>
          <BarList data={Object.entries(demographics.city).map(([k, v]) => ({ key: k, value: v }))} formatLabel={(k) => tCity(k as never)} color="#3229f2" />
        </div>
        <div className="card">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('income')}</h3>
          <BarList data={Object.entries(demographics.income).map(([k, v]) => ({ key: k, value: v }))} formatLabel={(k) => tIncome(k as never)} color="#12b35e" />
        </div>
      </div>

      <div className="mt-6 card">
        <h3 className="mb-4 text-sm font-bold text-ink-900">{t('selectSurvey')}</h3>
        <div className="flex flex-wrap gap-2">
          {surveys.map((s) => (
            <Link
              key={s.id}
              href={`/company/surveys/${s.id}` as never}
              className="rounded-full border border-ink-200 px-3.5 py-1.5 text-xs font-semibold text-ink-600 hover:border-brand-300 hover:bg-brand-50"
            >
              {pick(s.title, locale)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
