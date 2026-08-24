import 'server-only';
import { buildDatabase, Database } from './seed';

// Module-level singleton, pinned to globalThis so it survives Next.js dev
// server hot-reloads. This is the mock "database" for the Survpay MVP —
// swap for a real database + ORM when moving to production.
const globalForDb = globalThis as unknown as { __survpayDb?: Promise<Database> };

export function getDb(): Promise<Database> {
  if (!globalForDb.__survpayDb) {
    globalForDb.__survpayDb = buildDatabase();
  }
  return globalForDb.__survpayDb;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getUserById(id: string) {
  const db = await getDb();
  return db.users.find((u) => u.id === id) ?? null;
}

export async function getParticipantProfile(userId: string) {
  const db = await getDb();
  return db.participants.find((p) => p.userId === userId) ?? null;
}

export async function getCompanyByUserId(userId: string) {
  const db = await getDb();
  return db.companies.find((c) => c.userId === userId) ?? null;
}

export async function getCompanyById(id: string) {
  const db = await getDb();
  return db.companies.find((c) => c.id === id) ?? null;
}

export async function getSurveyById(id: string) {
  const db = await getDb();
  return db.surveys.find((s) => s.id === id) ?? null;
}
