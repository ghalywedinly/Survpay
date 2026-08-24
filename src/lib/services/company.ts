import 'server-only';
import { getDb, getCompanyByUserId } from '../data/store';
import { nextId } from '../data/ids';
import { Survey, SurveyQuestion, TargetAudience, SurveyCategory, LocalizedText } from '../types';
import { estimateAudienceSize } from './eligibility';

export async function getCompanySurveys(companyId: string) {
  const db = await getDb();
  return db.surveys
    .filter((s) => s.companyId === companyId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export interface CreateSurveyInput {
  title: string;
  description: string;
  category: SurveyCategory;
  estimatedMinutes: number;
  targetAudience: TargetAudience;
  questions: { type: SurveyQuestion['type']; prompt: string; options?: string[]; required: boolean }[];
  targetResponses: number;
  rewardPerResponse: number;
  publish: boolean;
}

export async function createSurvey(userId: string, input: CreateSurveyInput): Promise<Survey> {
  const db = await getDb();
  const company = await getCompanyByUserId(userId);
  if (!company) throw new Error('company_not_found');

  const asLocalized = (s: string): LocalizedText => ({ en: s, ar: s });
  const costPerResponse = Number((input.rewardPerResponse * 1.55 + 0.3).toFixed(2));

  const survey: Survey = {
    id: nextId('survey'),
    companyId: company.id,
    title: asLocalized(input.title),
    description: asLocalized(input.description),
    category: input.category,
    estimatedMinutes: input.estimatedMinutes,
    rewardPerResponse: input.rewardPerResponse,
    targetResponses: input.targetResponses,
    responseCount: 0,
    status: input.publish ? 'active' : 'draft',
    targetAudience: input.targetAudience,
    questions: input.questions.map((q, i) => ({
      id: nextId('q'),
      type: q.type,
      prompt: asLocalized(q.prompt),
      options: q.options?.map(asLocalized),
      required: q.required,
    })),
    createdAt: new Date().toISOString(),
    launchedAt: input.publish ? new Date().toISOString() : undefined,
    costPerResponse,
  };
  db.surveys.push(survey);
  return survey;
}

export async function setSurveyStatus(companyId: string, surveyId: string, status: Survey['status']) {
  const db = await getDb();
  const survey = db.surveys.find((s) => s.id === surveyId && s.companyId === companyId);
  if (!survey) throw new Error('not_found');
  survey.status = status;
  if (status === 'active' && !survey.launchedAt) survey.launchedAt = new Date().toISOString();
  return survey;
}

export async function duplicateSurvey(companyId: string, surveyId: string) {
  const db = await getDb();
  const survey = db.surveys.find((s) => s.id === surveyId && s.companyId === companyId);
  if (!survey) throw new Error('not_found');
  const copy: Survey = {
    ...survey,
    id: nextId('survey'),
    title: { en: `${survey.title.en} (Copy)`, ar: `${survey.title.ar} (نسخة)` },
    status: 'draft',
    responseCount: 0,
    createdAt: new Date().toISOString(),
    launchedAt: undefined,
    completedAt: undefined,
    questions: survey.questions.map((q) => ({ ...q, id: nextId('q') })),
  };
  db.surveys.push(copy);
  return copy;
}

export function estimateAudience(audience: TargetAudience) {
  return estimateAudienceSize(32000, audience);
}

export interface DemographicBreakdown {
  gender: Record<string, number>;
  city: Record<string, number>;
  income: Record<string, number>;
  age: Record<string, number>;
}

export async function getSurveyAnalytics(surveyId: string) {
  const db = await getDb();
  const survey = db.surveys.find((s) => s.id === surveyId);
  if (!survey) return null;
  const responses = db.responses.filter((r) => r.surveyId === surveyId && r.status === 'completed');
  const totalResponses = responses.length;
  const avgTime = totalResponses
    ? Math.round(responses.reduce((s, r) => s + (r.totalTimeSeconds || 0), 0) / totalResponses)
    : 0;
  const completionRate = survey.targetResponses ? Math.min(100, Math.round((survey.responseCount / survey.targetResponses) * 100)) : 0;

  const demographics: DemographicBreakdown = { gender: {}, city: {}, income: {}, age: {} };
  for (const r of responses) {
    const profile = db.participants.find((p) => p.userId === r.participantId);
    if (!profile) continue;
    demographics.gender[profile.gender] = (demographics.gender[profile.gender] || 0) + 1;
    demographics.city[profile.city] = (demographics.city[profile.city] || 0) + 1;
    demographics.income[profile.incomeRange] = (demographics.income[profile.incomeRange] || 0) + 1;
    const bucket = ageBucket(profile.dateOfBirth);
    demographics.age[bucket] = (demographics.age[bucket] || 0) + 1;
  }

  const questionBreakdown = survey.questions.map((q) => {
    const answersForQ = responses.map((r) => r.answers.find((a) => a.questionId === q.id)).filter(Boolean);
    if (q.type === 'rating') {
      const nums = answersForQ.map((a) => Number(a!.value)).filter((n) => !Number.isNaN(n));
      const avg = nums.length ? Number((nums.reduce((s, n) => s + n, 0) / nums.length).toFixed(2)) : 0;
      return { question: q, kind: 'rating' as const, average: avg, count: nums.length };
    }
    if (q.type === 'text') {
      return { question: q, kind: 'text' as const, samples: answersForQ.slice(0, 5).map((a) => String(a!.value)) };
    }
    const counts: Record<string, number> = {};
    answersForQ.forEach((a) => {
      const values = Array.isArray(a!.value) ? a!.value : [a!.value];
      values.forEach((v) => {
        const key = String(v);
        counts[key] = (counts[key] || 0) + 1;
      });
    });
    return { question: q, kind: 'choice' as const, counts };
  });

  return { survey, totalResponses, avgTime, completionRate, demographics, questionBreakdown };
}

function ageBucket(dob: string) {
  const age = Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  if (age < 25) return '18-24';
  if (age < 35) return '25-34';
  if (age < 45) return '35-44';
  if (age < 55) return '45-54';
  return '55+';
}

export async function getCompanyStats(companyId: string) {
  const db = await getDb();
  const surveys = db.surveys.filter((s) => s.companyId === companyId);
  const activeSurveys = surveys.filter((s) => s.status === 'active').length;
  const totalResponses = surveys.reduce((sum, s) => sum + s.responseCount, 0);
  const company = db.companies.find((c) => c.id === companyId);
  const totalSpent = company?.totalSpent ?? 0;
  const avgCostPerResponse = totalResponses ? Number((totalSpent / totalResponses).toFixed(2)) : 0;
  return { activeSurveys, totalResponses, totalSpent, avgCostPerResponse, totalSurveys: surveys.length };
}

export async function getCompanyDemographics(companyId: string) {
  const db = await getDb();
  const surveyIds = new Set(db.surveys.filter((s) => s.companyId === companyId).map((s) => s.id));
  const responses = db.responses.filter((r) => surveyIds.has(r.surveyId) && r.status === 'completed');
  const demographics: DemographicBreakdown = { gender: {}, city: {}, income: {}, age: {} };
  for (const r of responses) {
    const profile = db.participants.find((p) => p.userId === r.participantId);
    if (!profile) continue;
    demographics.gender[profile.gender] = (demographics.gender[profile.gender] || 0) + 1;
    demographics.city[profile.city] = (demographics.city[profile.city] || 0) + 1;
    demographics.income[profile.incomeRange] = (demographics.income[profile.incomeRange] || 0) + 1;
    const bucket = ageBucket(profile.dateOfBirth);
    demographics.age[bucket] = (demographics.age[bucket] || 0) + 1;
  }
  return demographics;
}

export async function responsesOverTime(companyId: string, days = 30) {
  const db = await getDb();
  const surveyIds = new Set(db.surveys.filter((s) => s.companyId === companyId).map((s) => s.id));
  const buckets: Record<string, number> = {};
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    buckets[d.toISOString().slice(0, 10)] = 0;
  }
  db.responses
    .filter((r) => surveyIds.has(r.surveyId) && r.status === 'completed' && r.completedAt)
    .forEach((r) => {
      const key = r.completedAt!.slice(0, 10);
      if (key in buckets) buckets[key] += 1;
    });
  return Object.entries(buckets).map(([date, count]) => ({ date, count }));
}
