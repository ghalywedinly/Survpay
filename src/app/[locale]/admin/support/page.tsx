import { getTranslations } from 'next-intl/server';
import { LifeBuoy } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export default async function AdminSupportPage() {
  const t = await getTranslations('adminSupport');

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>
      <div className="mt-6">
        <EmptyState icon={LifeBuoy} title={t('empty')} description={t('emptyBody')} />
      </div>
    </div>
  );
}
