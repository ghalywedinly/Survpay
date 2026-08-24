'use client';

import { useMemo, useState, useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Check, X, Banknote } from 'lucide-react';
import { Tabs } from '@/components/ui/tabs';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Withdrawal, User, Locale, WithdrawalStatus } from '@/lib/types';
import { formatSar, formatDate } from '@/lib/format';
import { processWithdrawalAction } from '@/app/actions/admin';

const STATUS_VARIANT: Record<WithdrawalStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  paid: 'success',
  approved: 'info',
  pending: 'warning',
  rejected: 'danger',
};

export function WithdrawalsTable({ rows }: { rows: { withdrawal: Withdrawal; user?: User }[] }) {
  const t = useTranslations('adminWithdrawals');
  const tStatus = useTranslations('txStatus');
  const tMethod = useTranslations('participantWithdraw');
  const locale = useLocale() as Locale;
  const [tab, setTab] = useState<'pending' | 'approved' | 'all'>('pending');
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    if (tab === 'all') return rows;
    if (tab === 'pending') return rows.filter((r) => r.withdrawal.status === 'pending');
    return rows.filter((r) => r.withdrawal.status === 'approved');
  }, [rows, tab]);

  function act(id: string, action: 'approve' | 'reject' | 'paid') {
    startTransition(async () => {
      await processWithdrawalAction(id, action);
    });
  }

  return (
    <div>
      <Tabs
        value={tab}
        onChange={(v) => setTab(v as never)}
        tabs={[
          { value: 'pending', label: t('tabPending'), count: rows.filter((r) => r.withdrawal.status === 'pending').length },
          { value: 'approved', label: t('tabApproved'), count: rows.filter((r) => r.withdrawal.status === 'approved').length },
          { value: 'all', label: t('tabAll'), count: rows.length },
        ]}
        className="max-w-md"
      />

      <div className="mt-4 card !p-0">
        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={Banknote} title={t('empty')} />
          </div>
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>{t('user')}</Th>
                <Th className="text-end">{t('amount')}</Th>
                <Th>{t('method')}</Th>
                <Th>{t('destination')}</Th>
                <Th>{t('requested')}</Th>
                <Th>{t('status')}</Th>
                <Th />
              </tr>
            </Thead>
            <Tbody>
              {filtered.map(({ withdrawal, user }) => (
                <Tr key={withdrawal.id}>
                  <Td className="font-medium text-ink-900">{user?.name ?? '—'}</Td>
                  <Td className="text-end font-bold">{formatSar(withdrawal.amount, locale)}</Td>
                  <Td className="text-ink-500">{withdrawal.method === 'bank_transfer' ? tMethod('bankTransfer') : tMethod('stcPay')}</Td>
                  <Td className="text-ink-500">{withdrawal.destination}</Td>
                  <Td>{formatDate(withdrawal.requestedAt, locale)}</Td>
                  <Td>
                    <Badge variant={STATUS_VARIANT[withdrawal.status]}>{tStatus(withdrawal.status)}</Badge>
                  </Td>
                  <Td>
                    {withdrawal.status === 'pending' && (
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="success" icon={<Check size={13} />} loading={isPending} onClick={() => act(withdrawal.id, 'approve')}>
                          {t('approve')}
                        </Button>
                        <Button size="sm" variant="outline" icon={<X size={13} />} loading={isPending} onClick={() => act(withdrawal.id, 'reject')}>
                          {t('reject')}
                        </Button>
                      </div>
                    )}
                    {withdrawal.status === 'approved' && (
                      <Button size="sm" variant="secondary" loading={isPending} onClick={() => act(withdrawal.id, 'paid')}>
                        {t('markPaid')}
                      </Button>
                    )}
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
