import 'server-only';
import { getDb } from '../data/store';
import { notify } from './notifications';

export async function getPlatformStats() {
  const db = await getDb();
  const totalUsers = db.users.filter((u) => u.role === 'participant').length;
  const activeUsers = db.participants.filter((p) => p.surveysCompleted > 0).length;
  const totalCompanies = db.companies.length;
  const activeSurveys = db.surveys.filter((s) => s.status === 'active').length;
  const totalResponses = db.responses.filter((r) => r.status === 'completed').length;
  const totalRewardsPaid = Number(
    db.transactions
      .filter((t) => t.type === 'survey_reward' && t.status === 'completed')
      .reduce((s, t) => s + t.amount, 0)
      .toFixed(2)
  );
  const revenue = Number(db.companies.reduce((s, c) => s + c.totalSpent, 0).toFixed(2));
  const platformProfit = Number((revenue - totalRewardsPaid).toFixed(2));

  return {
    totalUsers,
    activeUsers,
    totalCompanies,
    activeSurveys,
    totalResponses,
    totalRewardsPaid,
    revenue,
    platformProfit,
  };
}

export async function userGrowthSeries(days = 30) {
  const db = await getDb();
  const buckets: Record<string, number> = {};
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    buckets[d.toISOString().slice(0, 10)] = 0;
  }
  db.users
    .filter((u) => u.role === 'participant')
    .forEach((u) => {
      const key = u.createdAt.slice(0, 10);
      if (key in buckets) buckets[key] += 1;
    });
  let running = 0;
  return Object.entries(buckets).map(([date, count]) => {
    running += count;
    return { date, count, cumulative: running };
  });
}

export async function listUsers() {
  const db = await getDb();
  return db.users
    .filter((u) => u.role === 'participant')
    .map((u) => {
      const profile = db.participants.find((p) => p.userId === u.id);
      return { user: u, profile };
    });
}

export async function getUserDetail(userId: string) {
  const db = await getDb();
  const user = db.users.find((u) => u.id === userId);
  const profile = db.participants.find((p) => p.userId === userId);
  const responses = db.responses.filter((r) => r.participantId === userId);
  const transactions = db.transactions.filter((t) => t.userId === userId);
  const withdrawals = db.withdrawals.filter((w) => w.participantId === userId);
  return { user, profile, responses, transactions, withdrawals };
}

export async function setUserStatus(userId: string, status: 'active' | 'suspended') {
  const db = await getDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw new Error('not_found');
  user.status = status;
  return user;
}

export async function verifyUser(userId: string) {
  const db = await getDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw new Error('not_found');
  user.emailVerified = true;
  return user;
}

export async function resolveFraudFlag(userId: string, flagId: string) {
  const db = await getDb();
  const profile = db.participants.find((p) => p.userId === userId);
  if (!profile) throw new Error('not_found');
  const flag = profile.fraudFlags.find((f) => f.id === flagId);
  if (flag) flag.resolved = true;
  const unresolved = profile.fraudFlags.filter((f) => !f.resolved).length;
  profile.riskScore = unresolved >= 3 ? 'high' : unresolved >= 1 ? 'medium' : 'low';
  return profile;
}

export async function listAllFraudFlags() {
  const db = await getDb();
  const flags = db.participants.flatMap((p) =>
    p.fraudFlags.map((f) => ({ flag: f, user: db.users.find((u) => u.id === p.userId), profile: p }))
  );
  return flags.sort((a, b) => new Date(b.flag.detectedAt).getTime() - new Date(a.flag.detectedAt).getTime());
}

export async function listWithdrawals() {
  const db = await getDb();
  return db.withdrawals
    .map((w) => ({ withdrawal: w, user: db.users.find((u) => u.id === w.participantId) }))
    .sort((a, b) => new Date(b.withdrawal.requestedAt).getTime() - new Date(a.withdrawal.requestedAt).getTime());
}

export async function processWithdrawal(id: string, action: 'approve' | 'reject' | 'paid') {
  const db = await getDb();
  const withdrawal = db.withdrawals.find((w) => w.id === id);
  if (!withdrawal) throw new Error('not_found');
  const profile = db.participants.find((p) => p.userId === withdrawal.participantId);

  if (action === 'approve') {
    withdrawal.status = 'approved';
  } else if (action === 'reject') {
    withdrawal.status = 'rejected';
    if (profile) profile.balanceAvailable = Number((profile.balanceAvailable + withdrawal.amount).toFixed(2));
    const tx = db.transactions.find(
      (t) => t.userId === withdrawal.participantId && t.type === 'withdrawal' && t.amount === -withdrawal.amount && t.status === 'pending'
    );
    if (tx) tx.status = 'failed';
    await notify(withdrawal.participantId, {
      kind: 'withdrawal_processed',
      messageKey: 'withdrawalRejected',
      params: { amount: withdrawal.amount },
      href: '/participant/withdraw',
    });
  } else if (action === 'paid') {
    withdrawal.status = 'paid';
    withdrawal.processedAt = new Date().toISOString();
    const tx = db.transactions.find(
      (t) => t.userId === withdrawal.participantId && t.type === 'withdrawal' && t.amount === -withdrawal.amount && t.status === 'pending'
    );
    if (tx) tx.status = 'completed';
    await notify(withdrawal.participantId, {
      kind: 'withdrawal_processed',
      messageKey: 'withdrawalPaid',
      params: { amount: withdrawal.amount, destination: withdrawal.destination },
      href: '/participant/withdraw',
    });
  }
  return withdrawal;
}

export async function listCompanies() {
  const db = await getDb();
  return db.companies.map((c) => ({
    company: c,
    surveyCount: db.surveys.filter((s) => s.companyId === c.id).length,
    activeCount: db.surveys.filter((s) => s.companyId === c.id && s.status === 'active').length,
  }));
}

export async function listAllSurveys() {
  const db = await getDb();
  return db.surveys
    .map((s) => ({ survey: s, company: db.companies.find((c) => c.id === s.companyId) }))
    .sort((a, b) => new Date(b.survey.createdAt).getTime() - new Date(a.survey.createdAt).getTime());
}

export async function platformResponsesOverTime(days = 30) {
  const db = await getDb();
  const buckets: Record<string, number> = {};
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    buckets[d.toISOString().slice(0, 10)] = 0;
  }
  db.responses
    .filter((r) => r.status === 'completed' && r.completedAt)
    .forEach((r) => {
      const key = r.completedAt!.slice(0, 10);
      if (key in buckets) buckets[key] += 1;
    });
  return Object.entries(buckets).map(([date, count]) => ({ date, count }));
}

export async function surveysByCategory() {
  const db = await getDb();
  const out: Record<string, number> = {};
  db.surveys.forEach((s) => {
    out[s.category] = (out[s.category] || 0) + 1;
  });
  return out;
}

export async function listAllTransactions() {
  const db = await getDb();
  return db.transactions
    .map((t) => ({ transaction: t, user: db.users.find((u) => u.id === t.userId) }))
    .sort((a, b) => new Date(b.transaction.createdAt).getTime() - new Date(a.transaction.createdAt).getTime());
}
