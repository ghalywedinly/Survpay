import { getTranslations, getLocale } from 'next-intl/server';
import { getPlatformStats, platformResponsesOverTime, surveysByCategory } from '@/lib/services/admin';
import { StatCard } from '@/components/dashboard/stat-card';
import { TrendChart } from '@/components/dashboard/trend-chart';
import { BarList } from '@/components/dashboard/bar-list';
import { MessageSquareText, Coins, TrendingUp } from 'lucide-react';
import { formatSar, formatNumber } from '@/lib/format';
import { Locale } from '@/lib/types';

export default async function AdminReportsPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('adminReports');
  const tDash = await getTranslations('adminDashboard');
  const tCat = await getTranslations('categories');

  const [stats, trend, categories] = await Promise.all([getPlatformStats(), platformResponsesOverTime(), surveysByCategory()]);

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label={tDash('totalResponses')} value={formatNumber(stats.totalResponses, locale)} icon={MessageSquareText} accent="brand" />
        <StatCard label={tDash('totalRewardsPaid')} value={formatSar(stats.totalRewardsPaid, locale)} icon={Coins} accent="money" />
        <StatCard label={tDash('revenue')} value={formatSar(stats.revenue, locale)} icon={TrendingUp} />
      </div>

      <div className="mt-6 card">
        <h2 className="text-base font-bold text-ink-900">{tDash('totalResponses')}</h2>
        <div className="mt-4">
          <TrendChart data={trend} color="#12b35e" valueLabel={tDash('totalResponses')} />
        </div>
      </div>

      <div className="mt-6 card">
        <h2 className="mb-4 text-base font-bold text-ink-900">{t('surveyVolumeByCategory')}</h2>
        <BarList data={Object.entries(categories).map(([k, v]) => ({ key: k, value: v }))} formatLabel={(k) => tCat(k as never)} color="#8636e8" />
      </div>
    </div>
  );
}
