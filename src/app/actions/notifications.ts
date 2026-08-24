'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { markAllRead } from '@/lib/services/notifications';

export async function markAllReadAction() {
  const session = await getSession();
  if (!session) return;
  await markAllRead(session.uid);
  revalidatePath('/[locale]/participant/notifications', 'page');
  revalidatePath('/[locale]/company/notifications', 'page');
  revalidatePath('/[locale]/admin/notifications', 'page');
}
