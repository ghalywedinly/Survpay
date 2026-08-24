import { getTranslations, getLocale } from 'next-intl/server';
import { listAllSurveys } from '@/lib/services/admin';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { pick } from '@/lib/i18n-utils';
import { formatNumber } from '@/lib/format';
import { Locale, SurveyStatus } from '@/lib/types';

const STATUS_VARIANT: Record<SurveyStatus, 'success' | 'warning' | 'neutral' | 'info'> = {
  active: 'success',
  paused: 'warning',
  draft: 'neutral',
  completed: 'info',
};

export default async function AdminSurveysPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('adminSurveys');
  const tStatus = await getTranslations('surveyStatus');
  const tCat = await getTranslations('categories');
  const rows = await listAllSurveys();

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>

      <div className="mt-6 card !p-0">
        <Table>
          <Thead>
            <tr>
              <Th>{t('survey')}</Th>
              <Th>{t('company')}</Th>
              <Th>{t('category')}</Th>
              <Th>{t('status')}</Th>
              <Th className="text-end">{t('responses')}</Th>
            </tr>
          </Thead>
          <Tbody>
            {rows.map(({ survey, company }) => (
              <Tr key={survey.id}>
                <Td className="max-w-[220px] truncate font-semibold text-ink-900">{pick(survey.title, locale)}</Td>
                <Td className="text-ink-500">{company?.name}</Td>
                <Td>
                  <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-600">{tCat(survey.category)}</span>
                </Td>
                <Td>
                  <Badge variant={STATUS_VARIANT[survey.status]}>{tStatus(survey.status)}</Badge>
                </Td>
                <Td className="text-end">
                  {formatNumber(survey.responseCount, locale)}/{formatNumber(survey.targetResponses, locale)}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
}
