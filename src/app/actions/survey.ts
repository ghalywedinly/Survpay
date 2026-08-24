'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { completeSurvey } from '@/lib/services/participant';
import { SurveyAnswer } from '@/lib/types';

export async function completeSurveyAction(surveyId: string, answers: SurveyAnswer[]) {
  const session = await getSession();
  if (!session || session.role !== 'participant') return { ok: false as const, error: 'unauthorized' };

  const result = await completeSurvey(session.uid, surveyId, answers);
  if (result.ok) {
    revalidatePath('/[locale]/participant/dashboard', 'page');
    revalidatePath('/[locale]/participant/surveys', 'page');
    revalidatePath('/[locale]/participant/earnings', 'page');
  }
  return result;
}
