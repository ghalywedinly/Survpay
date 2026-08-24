import 'server-only';
import { cookies } from 'next/headers';
import { verifySession, SESSION_COOKIE } from './session';
import { getUserById } from './data/store';

export async function getSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

export async function requireUser() {
  const session = await getSession();
  if (!session) return null;
  return getUserById(session.uid);
}
