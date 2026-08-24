'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { setUserStatus, verifyUser, resolveFraudFlag, processWithdrawal } from '@/lib/services/admin';

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('unauthorized');
}

export async function setUserStatusAction(userId: string, status: 'active' | 'suspended') {
  await requireAdmin();
  await setUserStatus(userId, status);
  revalidatePath('/[locale]/admin/users', 'page');
  revalidatePath('/[locale]/admin/users/[id]', 'page');
}

export async function verifyUserAction(userId: string) {
  await requireAdmin();
  await verifyUser(userId);
  revalidatePath('/[locale]/admin/users/[id]', 'page');
}

export async function resolveFraudFlagAction(userId: string, flagId: string) {
  await requireAdmin();
  await resolveFraudFlag(userId, flagId);
  revalidatePath('/[locale]/admin/fraud', 'page');
  revalidatePath('/[locale]/admin/users/[id]', 'page');
}

export async function processWithdrawalAction(id: string, action: 'approve' | 'reject' | 'paid') {
  await requireAdmin();
  await processWithdrawal(id, action);
  revalidatePath('/[locale]/admin/withdrawals', 'page');
}
