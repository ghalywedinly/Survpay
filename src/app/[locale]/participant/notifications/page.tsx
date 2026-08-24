import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/auth';
import { listNotifications } from '@/lib/services/notifications';
import { NotificationsList } from '@/components/dashboard/notifications-list';

export default async function ParticipantNotificationsPage() {
  const session = await getSession();
  const t = await getTranslations('notificationsPage');
  const notifications = await listNotifications(session!.uid);

  return (
    <div className="container-app max-w-2xl py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>
      <div className="mt-6">
        <NotificationsList notifications={notifications} />
      </div>
    </div>
  );
}
