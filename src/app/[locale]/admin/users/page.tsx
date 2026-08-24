import { getTranslations } from 'next-intl/server';
import { listUsers } from '@/lib/services/admin';
import { UsersTable } from '@/components/admin/users-table';

export default async function AdminUsersPage() {
  const t = await getTranslations('adminUsers');
  const rows = await listUsers();

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>
      <div className="mt-6">
        <UsersTable rows={rows} />
      </div>
    </div>
  );
}
