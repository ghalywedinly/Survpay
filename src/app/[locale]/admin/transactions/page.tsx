import { getTranslations, getLocale } from 'next-intl/server';
import { listAllTransactions } from '@/lib/services/admin';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatSar, formatDateTime } from '@/lib/format';
import { Locale, TransactionStatus } from '@/lib/types';

const STATUS_VARIANT: Record<TransactionStatus, 'success' | 'warning' | 'danger'> = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
};

export default async function AdminTransactionsPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('adminTransactions');
  const tType = await getTranslations('txType');
  const tStatus = await getTranslations('txStatus');
  const rows = (await listAllTransactions()).slice(0, 150);

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>

      <div className="mt-6 card !p-0">
        <Table>
          <Thead>
            <tr>
              <Th>{t('user')}</Th>
              <Th>{t('type')}</Th>
              <Th className="text-end">{t('amount')}</Th>
              <Th>{t('status')}</Th>
              <Th>{t('date')}</Th>
            </tr>
          </Thead>
          <Tbody>
            {rows.map(({ transaction, user }) => (
              <Tr key={transaction.id}>
                <Td className="font-medium text-ink-900">{user?.name ?? '—'}</Td>
                <Td className="text-ink-500">{tType(transaction.type)}</Td>
                <Td className={`text-end font-semibold ${transaction.amount >= 0 ? 'text-money-600' : 'text-ink-700'}`}>
                  {formatSar(transaction.amount, locale, true)}
                </Td>
                <Td>
                  <Badge variant={STATUS_VARIANT[transaction.status]}>{tStatus(transaction.status)}</Badge>
                </Td>
                <Td className="whitespace-nowrap">{formatDateTime(transaction.createdAt, locale)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
}
