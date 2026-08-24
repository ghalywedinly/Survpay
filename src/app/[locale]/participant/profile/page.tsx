import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/auth';
import { getParticipantProfile } from '@/lib/data/store';
import { ProfileForm } from '@/components/participant/profile-form';

export default async function ProfilePage() {
  const session = await getSession();
  const t = await getTranslations('participantProfile');
  const profile = await getParticipantProfile(session!.uid);
  if (!profile) return null;

  return (
    <div className="container-app max-w-3xl py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>
      <div className="mt-6">
        <ProfileForm profile={profile} name={session!.name} />
      </div>
    </div>
  );
}
