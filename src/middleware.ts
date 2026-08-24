import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { verifySession, SESSION_COOKIE } from './lib/session';

const intlMiddleware = createMiddleware(routing);

const ROLE_HOME: Record<string, string> = {
  participant: '/participant/dashboard',
  company: '/company/dashboard',
  admin: '/admin/dashboard',
};

function stripLocale(pathname: string) {
  const match = pathname.match(/^\/(ar|en)(\/.*)?$/);
  if (!match) return { locale: routing.defaultLocale, rest: pathname };
  return { locale: match[1], rest: match[2] || '/' };
}

export default async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);

  const { locale, rest } = stripLocale(request.nextUrl.pathname);
  const isProtected = /^\/(participant|company|admin)(\/|$)/.test(rest);
  const isAuthPage = /^\/(login|signup|forgot-password)(\/|$)/.test(rest);

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (isProtected) {
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      url.searchParams.set('next', rest);
      return NextResponse.redirect(url);
    }
    const requiredRole = rest.split('/')[1];
    if (session.role !== requiredRole) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}${ROLE_HOME[session.role] || '/'}`;
      return NextResponse.redirect(url);
    }
  }

  if (isAuthPage && session) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${ROLE_HOME[session.role] || '/'}`;
    return NextResponse.redirect(url);
  }

  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
