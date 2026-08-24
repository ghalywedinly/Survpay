import 'server-only';
import { getDb, getParticipantProfile, getSurveyById } from '../data/store';
import { nextId } from '../data/ids';
import { surveysForParticipant } from './eligibility';
import { SurveyAnswer, Withdrawal, WithdrawalMethod, ParticipantProfile } from '../types';
import { notify } from './notifications';

export const MIN_WITHDRAWAL = 50;
const FAST_COMPLETION_RATIO = 0.35;

export async function listAvailableSurveys(userId: string) {
  const db = await getDb();
  const profile = await getParticipantProfile(userId);
  if (!profile) return [];
  const eligible = surveysForParticipant(db.surveys, profile);
  const done = new Set(
    db.responses.filter((r) => r.participantId === userId).map((r) => r.surveyId)
  );
  return eligible.filter((s) => !done.has(s.id));
}

export async function getMyResponses(userId: string) {
  const db = await getDb();
  return db.responses
    .filter((r) => r.participantId === userId)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

export async function startSurvey(userId: string, surveyId: string) {
  const db = await getDb();
  const existing = db.responses.find((r) => r.participantId === userId && r.surveyId === surveyId);
  if (existing) return existing;
  const survey = await getSurveyById(surveyId);
  if (!survey) throw new Error('survey_not_found');
  const response = {
    id: nextId('resp'),
    surveyId,
    participantId: userId,
    status: 'in_progress' as const,
    answers: [] as SurveyAnswer[],
    startedAt: new Date().toISOString(),
    rewardAmount: 0,
  };
  db.responses.push(response);
  return response;
}

export interface CompleteSurveyResult {
  ok: true;
  reward: number;
  pending: boolean;
  newAvailableBalance: number;
  newTotalEarned: number;
}

export async function completeSurvey(
  userId: string,
  surveyId: string,
  answers: SurveyAnswer[]
): Promise<CompleteSurveyResult | { ok: false; error: string }> {
  const db = await getDb();
  const survey = db.surveys.find((s) => s.id === surveyId);
  const profile = db.participants.find((p) => p.userId === userId);
  if (!survey || !profile) return { ok: false, error: 'not_found' };
  if (survey.status !== 'active') return { ok: false, error: 'survey_not_active' };

  let response = db.responses.find((r) => r.participantId === userId && r.surveyId === surveyId);
  if (!response) {
    response = {
      id: nextId('resp'),
      surveyId,
      participantId: userId,
      status: 'in_progress',
      answers: [],
      startedAt: new Date().toISOString(),
      rewardAmount: 0,
    };
    db.responses.push(response);
  }
  if (response.status === 'completed') return { ok: false, error: 'already_completed' };

  const totalTimeSeconds = answers.reduce((sum, a) => sum + a.timeSpentSeconds, 0);
  const expectedSeconds = survey.estimatedMinutes * 60;
  const isFast = totalTimeSeconds < expectedSeconds * FAST_COMPLETION_RATIO;
  const attentionQ = survey.questions.find((q) => q.isAttentionCheck);
  let failedAttention = false;
  if (attentionQ) {
    const answer = answers.find((a) => a.questionId === attentionQ.id);
    const correctIdx = 2; // "Somewhat agree" is index 2 in our bank
    const correctValue = attentionQ.options?.[correctIdx]?.en;
    if (answer && correctValue && answer.value !== correctValue) failedAttention = true;
  }

  response.status = 'completed';
  response.answers = answers;
  response.completedAt = new Date().toISOString();
  response.totalTimeSeconds = totalTimeSeconds;
  response.rewardAmount = survey.rewardPerResponse;

  const needsReview = isFast || failedAttention;

  profile.totalEarned = Number((profile.totalEarned + survey.rewardPerResponse).toFixed(2));
  profile.surveysCompleted += 1;
  if (needsReview) {
    profile.balancePending = Number((profile.balancePending + survey.rewardPerResponse).toFixed(2));
  } else {
    profile.balanceAvailable = Number((profile.balanceAvailable + survey.rewardPerResponse).toFixed(2));
  }

  if (isFast) {
    profile.fraudFlags.push({
      id: nextId('flag'),
      userId,
      type: 'fast_completion',
      description: `Completed "${survey.title.en}" in ${totalTimeSeconds}s, well under the ${expectedSeconds}s expected time.`,
      detectedAt: new Date().toISOString(),
      severity: 'medium',
      resolved: false,
    });
  }
  if (failedAttention) {
    profile.fraudFlags.push({
      id: nextId('flag'),
      userId,
      type: 'failed_attention_check',
      description: `Failed the attention-check question on "${survey.title.en}".`,
      detectedAt: new Date().toISOString(),
      severity: 'high',
      resolved: false,
    });
  }
  if (profile.fraudFlags.filter((f) => !f.resolved).length >= 3) profile.riskScore = 'high';
  else if (profile.fraudFlags.filter((f) => !f.resolved).length >= 1) profile.riskScore = 'medium';

  db.transactions.push({
    id: nextId('tx'),
    userId,
    type: 'survey_reward',
    description: survey.title.en,
    amount: survey.rewardPerResponse,
    status: needsReview ? 'pending' : 'completed',
    createdAt: new Date().toISOString(),
    relatedSurveyId: survey.id,
  });

  survey.responseCount += 1;
  const company = db.companies.find((c) => c.id === survey.companyId);
  if (company) {
    company.totalSpent = Number((company.totalSpent + survey.costPerResponse).toFixed(2));
    company.walletBalance = Number((company.walletBalance - survey.costPerResponse).toFixed(2));
  }

  const progressRatio = survey.responseCount / survey.targetResponses;
  if (survey.responseCount >= survey.targetResponses) {
    survey.status = 'completed';
    survey.completedAt = new Date().toISOString();
    if (company) {
      await notify(company.userId, {
        kind: 'survey_completed',
        messageKey: 'surveyCompleted',
        params: { surveyTitleEn: survey.title.en, surveyTitleAr: survey.title.ar, target: survey.targetResponses },
        href: `/company/surveys/${survey.id}`,
      });
    }
  } else if (progressRatio >= 0.8 && progressRatio - 1 / survey.targetResponses < 0.8 && company) {
    await notify(company.userId, {
      kind: 'survey_progress',
      messageKey: 'surveyProgress',
      params: {
        surveyTitleEn: survey.title.en,
        surveyTitleAr: survey.title.ar,
        count: survey.responseCount,
        target: survey.targetResponses,
      },
      href: `/company/surveys/${survey.id}`,
    });
  }

  await notify(userId, {
    kind: 'reward_earned',
    messageKey: needsReview ? 'rewardPending' : 'rewardEarned',
    params: { amount: survey.rewardPerResponse, surveyTitleEn: survey.title.en, surveyTitleAr: survey.title.ar },
    href: '/participant/earnings',
  });

  return {
    ok: true,
    reward: survey.rewardPerResponse,
    pending: needsReview,
    newAvailableBalance: profile.balanceAvailable,
    newTotalEarned: profile.totalEarned,
  };
}

export async function requestWithdrawal(
  userId: string,
  amount: number,
  method: WithdrawalMethod,
  destination: string
): Promise<{ ok: true; withdrawal: Withdrawal } | { ok: false; error: string }> {
  const db = await getDb();
  const profile = db.participants.find((p) => p.userId === userId);
  if (!profile) return { ok: false, error: 'not_found' };
  if (amount < MIN_WITHDRAWAL) return { ok: false, error: 'below_minimum' };
  if (amount > profile.balanceAvailable) return { ok: false, error: 'insufficient_balance' };

  profile.balanceAvailable = Number((profile.balanceAvailable - amount).toFixed(2));
  const withdrawal: Withdrawal = {
    id: nextId('wd'),
    participantId: userId,
    amount,
    method,
    status: 'pending',
    requestedAt: new Date().toISOString(),
    destination,
  };
  db.withdrawals.push(withdrawal);
  db.transactions.push({
    id: nextId('tx'),
    userId,
    type: 'withdrawal',
    description: 'Withdrawal',
    amount: -amount,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  await notify(userId, {
    kind: 'withdrawal_processed',
    messageKey: 'withdrawalSubmitted',
    params: { amount },
    href: '/participant/withdraw',
  });
  return { ok: true, withdrawal };
}

export async function updateParticipantProfile(userId: string, patch: Partial<ParticipantProfile>) {
  const db = await getDb();
  const profile = db.participants.find((p) => p.userId === userId);
  if (!profile) throw new Error('not_found');
  Object.assign(profile, patch);
  return profile;
}
