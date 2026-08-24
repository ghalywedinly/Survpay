'use server';

import { cookies } from 'next/headers';
import { redirect } from '@/i18n/routing';
import { login, signup } from '@/lib/services/auth';
import { signSession, SESSION_COOKIE } from '@/lib/session';
import { Role } from '@/lib/types';
import { getLocale } from 'next-intl/server';

const ROLE_HOME: Record<Role, string> = {
  participant: '/participant/dashboard',
  company: '/company/dashboard',
  admin: '/admin/dashboard',
};

async function establishSession(user: { id: string; role: Role; email: string; name: string }) {
  const token = await signSession({
    uid: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
    iat: Date.now(),
  });
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const next = String(formData.get('next') || '');

  const result = await login(email, password);
  if (!result.ok) {
    return { error: result.error };
  }
  await establishSession(result.user);
  const locale = await getLocale();
  redirect({ href: next || ROLE_HOME[result.user.role], locale });
  return null;
}

export async function signupAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const role = String(formData.get('role') || 'participant') as Role;
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const companyName = String(formData.get('companyName') || '').trim();
  const industry = String(formData.get('industry') || '').trim();

  if (!name || !email || !password) return { error: 'missing_fields' };
  if (role === 'company' && !companyName) return { error: 'missing_company_name' };

  const result = await signup({ name, email, password, role, companyName, industry });
  if (!result.ok) return { error: result.error };

  await establishSession(result.user);
  const locale = await getLocale();
  redirect({ href: ROLE_HOME[result.user.role], locale });
  return null;
}

export async function logoutAction() {
  cookies().delete(SESSION_COOKIE);
  const locale = await getLocale();
  redirect({ href: '/', locale });
}

export async function demoLoginAction(role: Role): Promise<{ error?: string } | null> {
  const emailMap: Record<Role, string> = {
    participant: 'participant@survpay.com',
    company: 'company@survpay.com',
    admin: 'admin@survpay.com',
  };
  const result = await login(emailMap[role], 'Survpay2026!');
  if (!result.ok) return { error: result.error };
  await establishSession(result.user);
  const locale = await getLocale();
  redirect({ href: ROLE_HOME[result.user.role], locale });
  return null;
}
