import { getTranslations, getLocale } from 'next-intl/server';
import { Wallet, Clock, TrendingUp } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { getDb, getParticipantProfile } from '@/lib/data/store';
import { StatCard } from '@/components/dashboard/stat-card';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { formatSar, formatDate } from '@/lib/format';
import { localizeTransactionDescription } from '@/lib/i18n-utils';
import { Locale, Survey, TransactionStatus } from '@/lib/types';

const STATUS_VARIANT: Record<TransactionStatus, 'success' | 'warning' | 'danger'> = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
};

export default async function EarningsPage() {
  const locale = (await getLocale()) as Locale;
  const session = await getSession();
  const t = await getTranslations('participantEarnings');
  const tTx = await getTranslations('txStatus');
  const tTxType = await getTranslations('txType');

  const [profile, db] = await Promise.all([getParticipantProfile(session!.uid), getDb()]);
  const surveysById: Record<string, Survey> = Object.fromEntries(db.surveys.map((s) => [s.id, s]));
  const transactions = db.transactions
    .filter((tx) => tx.userId === session!.uid)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label={t('availableBalance')} value={formatSar(profile?.balanceAvailable ?? 0, locale)} icon={Wallet} accent="money" />
        <StatCard label={t('pending')} value={formatSar(profile?.balancePending ?? 0, locale)} icon={Clock} />
        <StatCard label={t('totalEarned')} value={formatSar(profile?.totalEarned ?? 0, locale)} icon={TrendingUp} accent="brand" />
      </div>

      <div className="mt-8 card !p-0">
        <div className="p-5 sm:p-6">
          <h2 className="text-base font-bold text-ink-900">{t('history')}</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="px-6 pb-6">
            <EmptyState icon={Wallet} title={t('empty')} description={t('emptyBody')} />
          </div>
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>{t('date')}</Th>
                <Th>{t('description')}</Th>
                <Th className="text-end">{t('amount')}</Th>
                <Th>{t('status')}</Th>
              </tr>
            </Thead>
            <Tbody>
              {transactions.map((tx) => (
                <Tr key={tx.id}>
                  <Td className="whitespace-nowrap">{formatDate(tx.createdAt, locale)}</Td>
                  <Td className="font-medium text-ink-900">{localizeTransactionDescription(tx, surveysById, locale, tTxType(tx.type))}</Td>
                  <Td className={`text-end font-bold whitespace-nowrap ${tx.amount >= 0 ? 'text-money-600' : 'text-ink-700'}`}>
                    {formatSar(tx.amount, locale, true)}
                  </Td>
                  <Td>
                    <Badge variant={STATUS_VARIANT[tx.status]}>{tTx(tx.status)}</Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </div>
    </div>
  );
}
