import { getTranslations, getLocale } from 'next-intl/server';
import { Users, UserCheck, Building2, ListChecks, MessageSquareText, Coins, TrendingUp, PiggyBank } from 'lucide-react';
import { getPlatformStats, userGrowthSeries } from '@/lib/services/admin';
import { StatCard } from '@/components/dashboard/stat-card';
import { TrendChart } from '@/components/dashboard/trend-chart';
import { BarList } from '@/components/dashboard/bar-list';
import { formatNumber, formatSar } from '@/lib/format';
import { Locale } from '@/lib/types';

export default async function AdminDashboardPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('adminDashboard');

  const [stats, growth] = await Promise.all([getPlatformStats(), userGrowthSeries()]);

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('totalUsers')} value={formatNumber(stats.totalUsers, locale)} icon={Users} accent="brand" />
        <StatCard label={t('activeUsers')} value={formatNumber(stats.activeUsers, locale)} icon={UserCheck} />
        <StatCard label={t('totalCompanies')} value={formatNumber(stats.totalCompanies, locale)} icon={Building2} />
        <StatCard label={t('activeSurveys')} value={formatNumber(stats.activeSurveys, locale)} icon={ListChecks} />
        <StatCard label={t('totalResponses')} value={formatNumber(stats.totalResponses, locale)} icon={MessageSquareText} />
        <StatCard label={t('totalRewardsPaid')} value={formatSar(stats.totalRewardsPaid, locale)} icon={Coins} accent="money" />
        <StatCard label={t('revenue')} value={formatSar(stats.revenue, locale)} icon={TrendingUp} accent="brand" />
        <StatCard label={t('platformProfit')} value={formatSar(stats.platformProfit, locale)} icon={PiggyBank} accent="money" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="card">
          <h2 className="text-base font-bold text-ink-900">{t('userGrowth')}</h2>
          <div className="mt-4">
            <TrendChart
              data={growth.map((g) => ({ date: g.date, count: g.cumulative }))}
              color="#3229f2"
              valueLabel={t('totalUsers')}
            />
          </div>
        </div>
        <div className="card">
          <h2 className="text-base font-bold text-ink-900">{t('revenue')}</h2>
          <div className="mt-4">
            <BarList
              data={[
                { key: t('revenue'), value: stats.revenue },
                { key: t('totalRewardsPaid'), value: stats.totalRewardsPaid },
                { key: t('platformProfit'), value: stats.platformProfit },
              ]}
              color="#12b35e"
              formatValue={(v) => formatSar(v, locale)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
