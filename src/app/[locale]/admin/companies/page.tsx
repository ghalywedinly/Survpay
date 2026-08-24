import { getTranslations, getLocale } from 'next-intl/server';
import { listCompanies } from '@/lib/services/admin';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatSar, formatNumber } from '@/lib/format';
import { Locale, CompanyPlan } from '@/lib/types';

const PLAN_VARIANT: Record<CompanyPlan, 'neutral' | 'brand' | 'success'> = {
  starter: 'neutral',
  growth: 'brand',
  enterprise: 'success',
};

export default async function AdminCompaniesPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('adminCompanies');
  const tPlan = await getTranslations('companyBilling.plans');
  const rows = await listCompanies();

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>

      <div className="mt-6 card !p-0">
        <Table>
          <Thead>
            <tr>
              <Th>{t('name')}</Th>
              <Th>{t('industry')}</Th>
              <Th>{t('plan')}</Th>
              <Th className="text-end">{t('surveys')}</Th>
              <Th className="text-end">{t('active')}</Th>
              <Th className="text-end">{t('spent')}</Th>
            </tr>
          </Thead>
          <Tbody>
            {rows.map(({ company, surveyCount, activeCount }) => (
              <Tr key={company.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={company.name} color={company.logoColor} size={32} />
                    <span className="font-semibold text-ink-900">{company.name}</span>
                  </div>
                </Td>
                <Td className="text-ink-500">{company.industry}</Td>
                <Td>
                  <Badge variant={PLAN_VARIANT[company.plan]}>{tPlan(company.plan)}</Badge>
                </Td>
                <Td className="text-end">{formatNumber(surveyCount, locale)}</Td>
                <Td className="text-end">{formatNumber(activeCount, locale)}</Td>
                <Td className="text-end font-semibold">{formatSar(company.totalSpent, locale)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
}
