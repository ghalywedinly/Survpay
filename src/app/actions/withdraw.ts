'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { requestWithdrawal } from '@/lib/services/participant';
import { WithdrawalMethod } from '@/lib/types';

export async function requestWithdrawalAction(amount: number, method: WithdrawalMethod, destination: string) {
  const session = await getSession();
  if (!session || session.role !== 'participant') return { ok: false as const, error: 'unauthorized' };
  const result = await requestWithdrawal(session.uid, amount, method, destination);
  if (result.ok) {
    revalidatePath('/[locale]/participant/withdraw', 'page');
    revalidatePath('/[locale]/participant/dashboard', 'page');
    revalidatePath('/[locale]/participant/earnings', 'page');
  }
  return result;
}
