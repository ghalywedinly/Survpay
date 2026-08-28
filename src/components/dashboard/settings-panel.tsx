'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, AlertTriangle } from 'lucide-react';
import { LanguageSwitcher } from '@/components/marketing/language-switcher';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-brand-500' : 'bg-ink-200'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  );
}

export function SettingsPanel({ email }: { email: string }) {
  const t = useTranslations('settingsPage');
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-base font-bold text-ink-900">{t('account')}</h3>
        <div className="mt-4">
          <Input label={t('email')} defaultValue={email} leadingIcon={<Mail size={16} />} disabled />
        </div>
        <div className="mt-4">
          <p className="mb-1.5 text-sm font-medium text-ink-700">{t('language')}</p>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="card">
        <h3 className="text-base font-bold text-ink-900">{t('notifications')}</h3>
        <div className="mt-4 flex items-center justify-between py-2">
          <span className="text-sm font-medium text-ink-700">{t('emailNotifications')}</span>
          <Toggle checked={emailNotif} onChange={setEmailNotif} />
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-medium text-ink-700">{t('pushNotifications')}</span>
          <Toggle checked={pushNotif} onChange={setPushNotif} />
        </div>
      </div>

      <div className="card border-danger-100 bg-danger-50/40">
        <h3 className="flex items-center gap-2 text-base font-bold text-danger-700">
          <AlertTriangle size={17} /> {t('dangerZone')}
        </h3>
        <p className="mt-2 text-sm text-danger-700/80">{t('deactivateBody')}</p>
        <Button variant="danger" size="sm" className="mt-4" disabled>
          {t('deactivate')}
        </Button>
      </div>
    </div>
  );
}
