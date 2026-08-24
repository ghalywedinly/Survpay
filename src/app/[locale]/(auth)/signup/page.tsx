'use client';

import { useMemo, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, Wallet, Building2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from '@/i18n/routing';
import { Input, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signupAction } from '@/app/actions/auth';
import { INDUSTRIES } from '@/lib/constants';
import { Role } from '@/lib/types';

const ERROR_KEY: Record<string, string> = {
  email_taken: 'errorEmailTaken',
  weak_password: 'errorWeakPassword',
  missing_fields: 'errorMissing',
  missing_company_name: 'errorMissing',
};

export default function SignupPage() {
  const t = useTranslations('auth');
  const searchParams = useSearchParams();
  const initialRole = useMemo<Role>(() => (searchParams.get('role') === 'company' ? 'company' : 'participant'), [searchParams]);
  const [role, setRole] = useState<Role>(initialRole);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set('role', role);
    startTransition(async () => {
      const res = await signupAction(null, formData);
      if (res?.error) setError(t(ERROR_KEY[res.error] || 'errorGeneric'));
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('signupTitle')}</h1>
      <p className="mt-1.5 text-sm text-ink-500">{t('signupSubtitle')}</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRole('participant')}
          className={clsx(
            'rounded-2xl border-2 p-4 text-start transition-colors',
            role === 'participant' ? 'border-brand-500 bg-brand-50' : 'border-ink-100 bg-white hover:border-ink-200'
          )}
        >
          <Wallet size={20} className={role === 'participant' ? 'text-brand-700' : 'text-ink-400'} />
          <p className="mt-2 text-sm font-bold text-ink-900">{t('roleParticipantTitle')}</p>
          <p className="mt-0.5 text-xs text-ink-500">{t('roleParticipantBody')}</p>
        </button>
        <button
          type="button"
          onClick={() => setRole('company')}
          className={clsx(
            'rounded-2xl border-2 p-4 text-start transition-colors',
            role === 'company' ? 'border-brand-500 bg-brand-50' : 'border-ink-100 bg-white hover:border-ink-200'
          )}
        >
          <Building2 size={20} className={role === 'company' ? 'text-brand-700' : 'text-ink-400'} />
          <p className="mt-2 text-sm font-bold text-ink-900">{t('roleCompanyTitle')}</p>
          <p className="mt-0.5 text-xs text-ink-500">{t('roleCompanyBody')}</p>
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Input name="name" required label={t('fullName')} leadingIcon={<User size={16} />} placeholder="Abdullah Al-Harbi" />
        <Input name="email" type="email" required label={t('email')} leadingIcon={<Mail size={16} />} placeholder="you@example.com" />
        {role === 'company' && (
          <>
            <Input name="companyName" required label={t('companyName')} leadingIcon={<Building2 size={16} />} placeholder="Nova Retail Group" />
            <Select name="industry" label={t('industry')} defaultValue="">
              <option value="" disabled>
                {t('industry')}
              </option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          </>
        )}
        <Input
          name="password"
          type={showPassword ? 'text' : 'password'}
          required
          minLength={8}
          label={t('password')}
          leadingIcon={<Lock size={16} />}
          placeholder="••••••••"
          hint="8+ characters"
          trailingSlot={
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="pointer-events-auto">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}

        <Button type="submit" fullWidth size="lg" variant="secondary" loading={isPending}>
          {t('createAccount')}
        </Button>
        <p className="text-center text-xs text-ink-400">{t('termsNotice')}</p>
      </form>

      <p className="mt-5 text-center text-sm text-ink-500">
        {t('haveAccount')}{' '}
        <Link href="/login" className="font-semibold text-ink-900 hover:underline">
          {t('signIn')}
        </Link>
      </p>
    </div>
  );
}
