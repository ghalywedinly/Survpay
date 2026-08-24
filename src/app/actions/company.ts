'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { getCompanyByUserId } from '@/lib/data/store';
import { setSurveyStatus, duplicateSurvey, createSurvey, CreateSurveyInput } from '@/lib/services/company';
import { SurveyStatus } from '@/lib/types';

async function requireCompanyId() {
  const session = await getSession();
  if (!session || session.role !== 'company') throw new Error('unauthorized');
  const company = await getCompanyByUserId(session.uid);
  if (!company) throw new Error('company_not_found');
  return company.id;
}

export async function setSurveyStatusAction(surveyId: string, status: SurveyStatus) {
  const companyId = await requireCompanyId();
  await setSurveyStatus(companyId, surveyId, status);
  revalidatePath('/[locale]/company/surveys', 'page');
  revalidatePath('/[locale]/company/dashboard', 'page');
}

export async function duplicateSurveyAction(surveyId: string) {
  const companyId = await requireCompanyId();
  await duplicateSurvey(companyId, surveyId);
  revalidatePath('/[locale]/company/surveys', 'page');
}

export async function createSurveyAction(input: CreateSurveyInput) {
  const session = await getSession();
  if (!session || session.role !== 'company') return { ok: false as const, error: 'unauthorized' };
  const survey = await createSurvey(session.uid, input);
  revalidatePath('/[locale]/company/surveys', 'page');
  revalidatePath('/[locale]/company/dashboard', 'page');
  return { ok: true as const, surveyId: survey.id };
}
