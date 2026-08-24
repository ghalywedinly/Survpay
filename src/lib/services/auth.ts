import 'server-only';
import { getDb, getUserByEmail } from '../data/store';
import { nextId } from '../data/ids';
import { hashPassword, verifyPassword } from '../session';
import { Role, User, ParticipantProfile, Company } from '../types';
import { AVATAR_COLORS } from '../data/names';

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  companyName?: string;
  industry?: string;
}

export async function signup(input: SignupInput): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  const db = await getDb();
  const existing = await getUserByEmail(input.email);
  if (existing) return { ok: false, error: 'email_taken' };
  if (input.password.length < 8) return { ok: false, error: 'weak_password' };

  const passwordHash = await hashPassword(input.password);
  const userId = nextId('user');
  const user: User = {
    id: userId,
    role: input.role,
    email: input.email.toLowerCase(),
    passwordHash,
    name: input.name,
    avatarColor: AVATAR_COLORS[db.users.length % AVATAR_COLORS.length],
    createdAt: new Date().toISOString(),
    status: 'active',
    emailVerified: false,
    locale: 'ar',
  };
  db.users.push(user);

  if (input.role === 'participant') {
    const profile: ParticipantProfile = {
      userId,
      dateOfBirth: '2000-01-01',
      gender: 'male',
      city: 'Riyadh',
      householdSize: 1,
      maritalStatus: 'single',
      children: 0,
      employmentStatus: 'employed',
      industry: '',
      jobTitle: '',
      incomeRange: 'under_5k',
      interests: [],
      devices: [],
      balanceAvailable: 0,
      balancePending: 0,
      totalEarned: 0,
      surveysCompleted: 0,
      riskScore: 'low',
      fraudFlags: [],
    };
    db.participants.push(profile);
  } else if (input.role === 'company') {
    const companyId = nextId('company');
    const company: Company = {
      id: companyId,
      userId,
      name: input.companyName || input.name,
      logoColor: AVATAR_COLORS[db.companies.length % AVATAR_COLORS.length],
      industry: input.industry || 'Other',
      website: '',
      plan: 'starter',
      walletBalance: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
      teamMembers: [{ id: nextId('team'), name: input.name, email: input.email.toLowerCase(), role: 'owner' }],
    };
    db.companies.push(company);
  }

  return { ok: true, user };
}

export async function login(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) return { ok: false as const, error: 'invalid_credentials' };
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { ok: false as const, error: 'invalid_credentials' };
  if (user.status === 'suspended') return { ok: false as const, error: 'account_suspended' };
  return { ok: true as const, user };
}
