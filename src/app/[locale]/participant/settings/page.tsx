import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/auth';
import { SettingsPanel } from '@/components/dashboard/settings-panel';

export default async function ParticipantSettingsPage() {
  const session = await getSession();
  const t = await getTranslations('settingsPage');

  return (
    <div className="container-app max-w-2xl py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>
      <div className="mt-6">
        <SettingsPanel email={session!.email} />
      </div>
    </div>
  );
}
