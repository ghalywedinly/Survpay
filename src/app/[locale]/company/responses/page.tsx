import { getTranslations, getLocale } from 'next-intl/server';
import { MessageSquareText } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { getDb, getCompanyByUserId } from '@/lib/data/store';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { pick } from '@/lib/i18n-utils';
import { formatDateTime } from '@/lib/format';
import { Locale } from '@/lib/types';

export default async function CompanyResponsesPage() {
  const locale = (await getLocale()) as Locale;
  const session = await getSession();
  const t = await getTranslations('companyResponses');

  const [company, db] = await Promise.all([getCompanyByUserId(session!.uid), getDb()]);
  const surveyIds = new Set(db.surveys.filter((s) => s.companyId === company?.id).map((s) => s.id));
  const surveyMap = Object.fromEntries(db.surveys.map((s) => [s.id, s]));

  const responses = db.responses
    .filter((r) => surveyIds.has(r.surveyId) && r.status === 'completed')
    .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())
    .slice(0, 100);

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>

      <div className="mt-6 card !p-0">
        {responses.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={MessageSquareText} title={t('empty')} />
          </div>
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>{t('survey')}</Th>
                <Th>{t('participant')}</Th>
                <Th>{t('completedAt')}</Th>
                <Th className="text-end">{t('duration')}</Th>
              </tr>
            </Thead>
            <Tbody>
              {responses.map((r) => (
                <Tr key={r.id}>
                  <Td className="max-w-[220px] truncate font-medium text-ink-900">{pick(surveyMap[r.surveyId].title, locale)}</Td>
                  <Td className="text-ink-500">#{r.participantId.slice(-6)}</Td>
                  <Td>{r.completedAt && formatDateTime(r.completedAt, locale)}</Td>
                  <Td className="text-end">{r.totalTimeSeconds ? `${Math.round(r.totalTimeSeconds / 60)}m` : '—'}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </div>
    </div>
  );
}
