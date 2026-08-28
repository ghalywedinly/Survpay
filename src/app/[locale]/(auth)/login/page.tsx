'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, Building2, ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginAction, demoLoginAction } from '@/app/actions/auth';

const ERROR_KEY: Record<string, string> = {
  invalid_credentials: 'errorInvalid',
  account_suspended: 'errorSuspended',
};

export default function LoginPage() {
  const t = useTranslations('auth');
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '';
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [demoPending, setDemoPending] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await loginAction(null, formData);
      if (res?.error) setError(t(ERROR_KEY[res.error] || 'errorGeneric'));
    });
  }

  function onDemo(role: 'participant' | 'company' | 'admin') {
    setError(null);
    setDemoPending(role);
    startTransition(async () => {
      const res = await demoLoginAction(role);
      if (res?.error) setError(t('errorGeneric'));
      setDemoPending(null);
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('loginTitle')}</h1>
      <p className="mt-1.5 text-sm text-ink-500">{t('loginSubtitle')}</p>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <input type="hidden" name="next" value={next} />
        <Input name="email" type="email" required label={t('email')} leadingIcon={<Mail size={16} />} placeholder="you@example.com" />
        <div>
          <Input
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            label={t('password')}
            leadingIcon={<Lock size={16} />}
            placeholder="••••••••"
            trailingSlot={
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="pointer-events-auto">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          <div className="mt-1.5 text-end">
            <Link href="/forgot-password" className="text-xs font-semibold text-brand-700 hover:underline">
              {t('forgotPassword')}
            </Link>
          </div>
        </div>

        {error && <p className="border-2 border-danger-500 bg-danger-50 px-3 py-2 text-sm font-bold text-danger-700">{error}</p>}

        <Button type="submit" fullWidth size="lg" variant="secondary" loading={isPending && !demoPending}>
          {t('signIn')}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-500">
        {t('noAccount')}{' '}
        <Link href="/signup" className="font-semibold text-ink-900 hover:underline">
          {t('createAccount')}
        </Link>
      </p>

      <div className="mt-8 border-2 border-ink-900 bg-ground p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-400">{t('demoAccounts')}</p>
        <p className="mt-1 text-xs text-ink-500">{t('demoAccountsBody')}</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <button
            onClick={() => onDemo('participant')}
            disabled={isPending}
            className="flex flex-col items-center gap-1.5 rounded-none border-2 border-ink-200 bg-paper py-3 text-xs font-bold text-ink-700 transition-colors hover:border-ink-900 disabled:opacity-50"
          >
            <User size={16} />
            {demoPending === 'participant' ? '…' : t('demoParticipant')}
          </button>
          <button
            onClick={() => onDemo('company')}
            disabled={isPending}
            className="flex flex-col items-center gap-1.5 rounded-none border-2 border-ink-200 bg-paper py-3 text-xs font-bold text-ink-700 transition-colors hover:border-ink-900 disabled:opacity-50"
          >
            <Building2 size={16} />
            {demoPending === 'company' ? '…' : t('demoCompany')}
          </button>
          <button
            onClick={() => onDemo('admin')}
            disabled={isPending}
            className="flex flex-col items-center gap-1.5 rounded-none border-2 border-ink-200 bg-paper py-3 text-xs font-bold text-ink-700 transition-colors hover:border-ink-900 disabled:opacity-50"
          >
            <ShieldCheck size={16} />
            {demoPending === 'admin' ? '…' : t('demoAdmin')}
          </button>
        </div>
      </div>
    </div>
  );
}
