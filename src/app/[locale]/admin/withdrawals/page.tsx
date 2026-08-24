import { getTranslations } from 'next-intl/server';
import { listWithdrawals } from '@/lib/services/admin';
import { WithdrawalsTable } from '@/components/admin/withdrawals-table';

export default async function AdminWithdrawalsPage() {
  const t = await getTranslations('adminWithdrawals');
  const rows = await listWithdrawals();

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>
      <div className="mt-6">
        <WithdrawalsTable rows={rows} />
      </div>
    </div>
  );
}
