import { getTranslations } from 'next-intl/server';
import { listAllFraudFlags } from '@/lib/services/admin';
import { FraudTable } from '@/components/admin/fraud-table';

export default async function AdminFraudPage() {
  const t = await getTranslations('adminFraud');
  const rows = await listAllFraudFlags();

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>
      <div className="mt-6">
        <FraudTable rows={rows} />
      </div>
    </div>
  );
}
