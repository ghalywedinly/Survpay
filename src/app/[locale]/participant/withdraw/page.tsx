import { getTranslations, getLocale } from 'next-intl/server';
import { Banknote } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { getDb, getParticipantProfile } from '@/lib/data/store';
import { WithdrawForm } from '@/components/participant/withdraw-form';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { formatSar, formatDate } from '@/lib/format';
import { Locale, WithdrawalStatus } from '@/lib/types';

const STATUS_VARIANT: Record<WithdrawalStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  paid: 'success',
  approved: 'info',
  pending: 'warning',
  rejected: 'danger',
};

const METHOD_LABEL: Record<string, string> = {
  bank_transfer: 'bankTransfer',
  stc_pay: 'stcPay',
};

export default async function WithdrawPage() {
  const locale = (await getLocale()) as Locale;
  const session = await getSession();
  const t = await getTranslations('participantWithdraw');
  const tTx = await getTranslations('txStatus');

  const [profile, db] = await Promise.all([getParticipantProfile(session!.uid), getDb()]);
  const withdrawals = db.withdrawals
    .filter((w) => w.participantId === session!.uid)
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

  return (
    <div className="container-app grid gap-8 py-8 lg:grid-cols-[1fr_1.1fr]">
      <WithdrawForm availableBalance={profile?.balanceAvailable ?? 0} locale={locale} />

      <div className="card !p-0">
        <div className="p-5 sm:p-6">
          <h2 className="text-base font-bold text-ink-900">{t('history')}</h2>
        </div>
        {withdrawals.length === 0 ? (
          <div className="px-6 pb-6">
            <EmptyState icon={Banknote} title={t('empty')} />
          </div>
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>{t('amount')}</Th>
                <Th>{t('method')}</Th>
                <Th>{tTx('completed')}</Th>
              </tr>
            </Thead>
            <Tbody>
              {withdrawals.map((w) => (
                <Tr key={w.id}>
                  <Td className="font-bold text-ink-900">{formatSar(w.amount, locale)}</Td>
                  <Td>
                    <p className="text-sm">{t(METHOD_LABEL[w.method] as never)}</p>
                    <p className="text-xs text-ink-400">{formatDate(w.requestedAt, locale)}</p>
                  </Td>
                  <Td>
                    <Badge variant={STATUS_VARIANT[w.status]}>{tTx(w.status)}</Badge>
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
