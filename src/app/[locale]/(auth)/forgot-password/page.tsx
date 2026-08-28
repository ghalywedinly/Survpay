'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, ArrowLeft, MailCheck } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center border-2 border-ink-900 bg-aqua-500 text-ink-900">
          <MailCheck size={26} />
        </div>
        <h1 className="mt-4 text-xl font-extrabold text-ink-900">{t('resetPassword')}</h1>
        <p className="mt-2 text-sm text-ink-500">{t('resetSent')}</p>
        <Link href="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900">
          <ArrowLeft size={15} className="flip-rtl" /> {t('backToLogin')}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('resetPassword')}</h1>
      <p className="mt-1.5 text-sm text-ink-500">{t('resetSubtitle')}</p>
      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <Input name="email" type="email" required label={t('email')} leadingIcon={<Mail size={16} />} placeholder="you@example.com" />
        <Button type="submit" fullWidth size="lg" variant="secondary" loading={loading}>
          {t('sendResetLink')}
        </Button>
      </form>
      <Link href="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-ink-900">
        <ArrowLeft size={15} className="flip-rtl" /> {t('backToLogin')}
      </Link>
    </div>
  );
}
