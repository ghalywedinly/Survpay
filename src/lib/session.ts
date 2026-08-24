// Lightweight signed-cookie session, implemented with Web Crypto so it runs
// identically in the Edge middleware and the Node server-action runtime.
// NOTE: this is a demo-grade auth layer for the Survpay MVP prototype, not a
// production security implementation. Swap for NextAuth/Clerk/etc. + a real
// database when wiring this up to production infrastructure.

export type Role = 'participant' | 'company' | 'admin';

export interface SessionPayload {
  uid: string;
  role: Role;
  email: string;
  name: string;
  iat: number;
}

const SESSION_COOKIE = 'sp_session';
const SECRET = process.env.SESSION_SECRET || 'survpay-mvp-demo-secret-do-not-use-in-prod';

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let str = '';
  for (const b of arr) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(input: string): Uint8Array {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const str = atob(padded);
  const arr = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) arr[i] = str.charCodeAt(i);
  return arr;
}

async function getKey() {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const key = await getKey();
  const body = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return `${body}.${toBase64Url(sig)}`;
}

export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  try {
    const key = await getKey();
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      fromBase64Url(sig) as BufferSource,
      new TextEncoder().encode(body)
    );
    if (!valid) return null;
    const json = new TextDecoder().decode(fromBase64Url(body) as BufferSource);
    return JSON.parse(json) as SessionPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(`survpay::${password}`));
  return toBase64Url(digest);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(password);
  return computed === hash;
}

export { SESSION_COOKIE };
