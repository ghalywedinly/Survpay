import { getTranslations, getLocale } from 'next-intl/server';
import { Wallet, Coins, Sparkles } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { getCompanyByUserId } from '@/lib/data/store';
import { getCompanySurveys } from '@/lib/services/company';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { pick } from '@/lib/i18n-utils';
import { formatSar, formatDate } from '@/lib/format';
import { Locale, CompanyPlan } from '@/lib/types';

const PLAN_VARIANT: Record<CompanyPlan, 'neutral' | 'brand' | 'success'> = {
  starter: 'neutral',
  growth: 'brand',
  enterprise: 'success',
};

export default async function CompanyBillingPage() {
  const locale = (await getLocale()) as Locale;
  const session = await getSession();
  const t = await getTranslations('companyBilling');
  const tPlan = await getTranslations('companyBilling.plans');
  const tTable = await getTranslations('companySurveys.table');

  const company = await getCompanyByUserId(session!.uid);
  const surveys = company ? await getCompanySurveys(company.id) : [];
  const spendRows = surveys.filter((s) => s.responseCount > 0);

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm font-medium text-ink-500">{t('currentPlan')}</p>
          <div className="mt-2">
            <Badge variant={PLAN_VARIANT[company?.plan ?? 'starter']}>{tPlan(company?.plan ?? 'starter')}</Badge>
          </div>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-ink-500">{t('walletBalance')}</p>
          <p className="mt-2 text-2xl font-extrabold text-brand-700">{formatSar(company?.walletBalance ?? 0, locale)}</p>
          <Button size="sm" variant="outline" className="mt-3" icon={<Sparkles size={14} />}>
            {t('topUp')}
          </Button>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-ink-500">{t('totalSpent')}</p>
          <p className="mt-2 text-2xl font-extrabold text-ink-900">{formatSar(company?.totalSpent ?? 0, locale)}</p>
        </div>
      </div>

      <div className="mt-8 card !p-0">
        <div className="p-5 sm:p-6">
          <h2 className="text-base font-bold text-ink-900">{t('history')}</h2>
        </div>
        {spendRows.length === 0 ? (
          <div className="px-6 pb-6">
            <EmptyState icon={Wallet} title={t('empty')} />
          </div>
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>{tTable('survey')}</Th>
                <Th className="text-end">{tTable('responses')}</Th>
                <Th className="text-end">{tTable('spent')}</Th>
                <Th>{tTable('created')}</Th>
              </tr>
            </Thead>
            <Tbody>
              {spendRows.map((s) => (
                <Tr key={s.id}>
                  <Td className="max-w-[220px] truncate font-medium text-ink-900">{pick(s.title, locale)}</Td>
                  <Td className="text-end">{s.responseCount}</Td>
                  <Td className="flex items-center justify-end gap-1.5 text-end font-bold text-ink-900">
                    <Coins size={14} className="text-money-600" />
                    {formatSar(s.responseCount * s.costPerResponse, locale)}
                  </Td>
                  <Td>{formatDate(s.createdAt, locale)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </div>
    </div>
  );
}
