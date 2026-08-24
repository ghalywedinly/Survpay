import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { getSession } from '@/lib/auth';
import { getDb, getParticipantProfile } from '@/lib/data/store';
import { isEligible } from '@/lib/services/eligibility';
import { redirect } from '@/i18n/routing';
import { SurveyRunner } from '@/components/participant/survey-runner';
import { Locale } from '@/lib/types';

export default async function TakeSurveyPage({ params }: { params: { id: string } }) {
  const locale = (await getLocale()) as Locale;
  const session = await getSession();
  const db = await getDb();
  const survey = db.surveys.find((s) => s.id === params.id);
  if (!survey) notFound();

  const profile = await getParticipantProfile(session!.uid);
  const alreadyDone = db.responses.some((r) => r.participantId === session!.uid && r.surveyId === survey.id && r.status === 'completed');

  if (alreadyDone || survey.status !== 'active' || !profile || !isEligible(profile, survey.targetAudience)) {
    redirect({ href: '/participant/surveys', locale });
    return null;
  }

  return <SurveyRunner survey={survey} locale={locale} />;
}
