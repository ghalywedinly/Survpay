import { getTranslations, getLocale } from 'next-intl/server';
import { ListChecks, MessageSquareText, Wallet, Coins, PlusCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getSession } from '@/lib/auth';
import { getCompanyByUserId } from '@/lib/data/store';
import { getCompanySurveys, getCompanyStats, responsesOverTime } from '@/lib/services/company';
import { StatCard } from '@/components/dashboard/stat-card';
import { TrendChart } from '@/components/dashboard/trend-chart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { formatSar, formatNumber, formatDate } from '@/lib/format';
import { pick } from '@/lib/i18n-utils';
import { Locale, SurveyStatus } from '@/lib/types';

const STATUS_VARIANT: Record<SurveyStatus, 'success' | 'warning' | 'neutral' | 'info'> = {
  active: 'success',
  paused: 'warning',
  draft: 'neutral',
  completed: 'info',
};

export default async function CompanyDashboardPage() {
  const locale = (await getLocale()) as Locale;
  const session = await getSession();
  const t = await getTranslations('companyDashboard');
  const tStatus = await getTranslations('surveyStatus');
  const tTable = await getTranslations('companySurveys.table');

  const company = await getCompanyByUserId(session!.uid);
  const [surveys, stats, trend] = await Promise.all([
    getCompanySurveys(company!.id),
    getCompanyStats(company!.id),
    responsesOverTime(company!.id),
  ]);

  return (
    <div className="container-app py-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('greeting', { name: session!.name.split(' ')[0] })}</h1>
          <p className="mt-1 text-sm text-ink-500">{t('subtitle', { company: company?.name ?? '' })}</p>
        </div>
        <Link href="/company/surveys/create">
          <Button variant="secondary" icon={<PlusCircle size={17} />}>
            {t('createSurvey')}
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('activeSurveys')} value={formatNumber(stats.activeSurveys, locale)} icon={ListChecks} accent="brand" />
        <StatCard label={t('totalResponses')} value={formatNumber(stats.totalResponses, locale)} icon={MessageSquareText} />
        <StatCard label={t('totalSpent')} value={formatSar(stats.totalSpent, locale)} icon={Coins} accent="money" />
        <StatCard label={t('avgCostPerResponse')} value={formatSar(stats.avgCostPerResponse, locale)} icon={Wallet} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="card">
          <h2 className="text-base font-bold text-ink-900">{t('responsesOverTime')}</h2>
          <div className="mt-4">
            <TrendChart data={trend} />
          </div>
        </div>
        <div className="card">
          <h2 className="text-base font-bold text-ink-900">{t('walletBalance')}</h2>
          <p className="mt-3 text-3xl font-extrabold text-brand-700">{formatSar(company?.walletBalance ?? 0, locale)}</p>
          <Link href="/company/billing" className="mt-4 block">
            <Button variant="outline" fullWidth>
              {t('topUp')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-ink-900">{t('recentSurveys')}</h2>
        {surveys.length === 0 ? (
          <div className="mt-4">
            <EmptyState icon={ListChecks} title={t('createSurvey')} />
          </div>
        ) : (
          <div className="mt-4 card !p-0">
            <Table>
              <Thead>
                <tr>
                  <Th>{tTable('survey')}</Th>
                  <Th>{tTable('status')}</Th>
                  <Th className="text-end">{tTable('responses')}</Th>
                  <Th className="text-end">{tTable('spent')}</Th>
                  <Th>{tTable('created')}</Th>
                </tr>
              </Thead>
              <Tbody>
                {surveys.slice(0, 6).map((s) => (
                  <Tr key={s.id}>
                    <Td className="max-w-xs truncate font-semibold text-ink-900">
                      <Link href={`/company/surveys/${s.id}` as never} className="hover:underline">
                        {pick(s.title, locale)}
                      </Link>
                    </Td>
                    <Td>
                      <Badge variant={STATUS_VARIANT[s.status]}>{tStatus(s.status)}</Badge>
                    </Td>
                    <Td className="text-end">
                      {formatNumber(s.responseCount, locale)}/{formatNumber(s.targetResponses, locale)}
                    </Td>
                    <Td className="text-end">{formatSar(s.responseCount * s.costPerResponse, locale)}</Td>
                    <Td>{formatDate(s.createdAt, locale)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
