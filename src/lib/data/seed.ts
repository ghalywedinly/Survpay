import { hashPassword } from '../session';
import { makeRng } from './rng';
import { MALE_NAMES, FEMALE_NAMES, COMPANY_CONTACT_NAMES, AVATAR_COLORS } from './names';
import { SURVEY_CATALOG } from './survey-catalog';
import { QUESTION_BANK } from './question-bank';
import { SAUDI_CITIES, SurveyCategory } from '../types';
import { INTEREST_KEYS, DEVICE_KEYS, INDUSTRIES, INCOME_RANGES, EMPLOYMENT_STATUSES, MARITAL_STATUSES } from '../constants';
import { isEligible } from '../services/eligibility';
import type {
  User,
  ParticipantProfile,
  Company,
  Survey,
  SurveyResponse,
  Transaction,
  Withdrawal,
  Notification,
  FraudFlag,
  TargetAudience,
  Gender,
  Project,
  Agent,
  AgentMessage,
} from '../types';

export interface Database {
  users: User[];
  participants: ParticipantProfile[];
  companies: Company[];
  surveys: Survey[];
  responses: SurveyResponse[];
  transactions: Transaction[];
  withdrawals: Withdrawal[];
  notifications: Notification[];
  projects: Project[];
  agents: Agent[];
  agentMessages: AgentMessage[];
}

const DEMO_PASSWORD = 'Survpay2026!';

const COMPANY_SEEDS: {
  name: string;
  industry: string;
  website: string;
  categories: SurveyCategory[];
  plan: 'starter' | 'growth' | 'enterprise';
}[] = [
  { name: 'Nova Retail Group', industry: 'Retail', website: 'novaretail.sa', categories: ['shopping', 'lifestyle'], plan: 'growth' },
  { name: "Ru'ya Financial", industry: 'Banking & Finance', website: 'ruyafinancial.sa', categories: ['finance'], plan: 'enterprise' },
  { name: 'STC Digital Labs', industry: 'Telecommunications', website: 'stcdigitallabs.sa', categories: ['technology'], plan: 'enterprise' },
  { name: 'Elite Foods Co.', industry: 'Hospitality', website: 'elitefoods.sa', categories: ['food'], plan: 'growth' },
  { name: 'Red Sea Travel', industry: 'Hospitality', website: 'redseatravel.sa', categories: ['travel', 'entertainment'], plan: 'starter' },
  { name: 'Riyadh Auto Group', industry: 'Retail', website: 'riyadhauto.sa', categories: ['automotive', 'healthcare', 'other'], plan: 'growth' },
];

function randomAudience(rng: ReturnType<typeof makeRng>): TargetAudience {
  const ageMin = rng.pick([18, 20, 22, 25]);
  const genders: Gender[] = rng.bool(0.7) ? ['male', 'female'] : [rng.pick<Gender>(['male', 'female'])];
  return {
    ageMin,
    ageMax: ageMin + rng.pick([15, 20, 25, 30]),
    genders,
    cities: rng.bool(0.5) ? [...SAUDI_CITIES] : rng.pickMany(SAUDI_CITIES, rng.int(3, 7)),
    incomeRanges: rng.bool(0.4) ? [...INCOME_RANGES] : rng.pickMany(INCOME_RANGES, rng.int(2, 4)),
    employmentStatuses: rng.bool(0.4) ? [...EMPLOYMENT_STATUSES] : rng.pickMany(EMPLOYMENT_STATUSES, rng.int(2, 3)),
    interests: rng.pickMany(INTEREST_KEYS, rng.int(2, 4)),
  };
}

function estimateAudienceSize(audience: TargetAudience) {
  let size = 32000;
  size *= audience.genders.length / 2;
  size *= Math.min(1, audience.cities.length / SAUDI_CITIES.length + 0.15);
  size *= Math.min(1, audience.incomeRanges.length / INCOME_RANGES.length + 0.2);
  size *= Math.min(1, audience.employmentStatuses.length / EMPLOYMENT_STATUSES.length + 0.2);
  const ageSpan = audience.ageMax - audience.ageMin;
  size *= Math.min(1, ageSpan / 40 + 0.25);
  return Math.max(150, Math.round(size / 50) * 50);
}

export async function buildDatabase(): Promise<Database> {
  const rng = makeRng(2026);
  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const now = Date.now();

  const users: User[] = [];
  const participants: ParticipantProfile[] = [];
  const companies: Company[] = [];
  const surveys: Survey[] = [];
  const responses: SurveyResponse[] = [];
  const transactions: Transaction[] = [];
  const withdrawals: Withdrawal[] = [];
  const notifications: Notification[] = [];

  // ---------- Admin ----------
  users.push({
    id: 'user-admin-1',
    role: 'admin',
    email: 'admin@survpay.com',
    passwordHash,
    name: 'فريق سرفباي',
    avatarColor: '#3229f2',
    createdAt: new Date(now - 500 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    emailVerified: true,
    locale: 'ar',
  });
  users.push({
    id: 'user-admin-2',
    role: 'admin',
    email: 'sara.admin@survpay.com',
    passwordHash,
    name: 'سارة الفهد',
    avatarColor: '#b32be0',
    createdAt: new Date(now - 300 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    emailVerified: true,
    locale: 'ar',
  });

  // ---------- Companies ----------
  COMPANY_SEEDS.forEach((seed, idx) => {
    const isDemo = idx === 0;
    const userId = isDemo ? 'user-company-demo' : `user-company-${idx + 1}`;
    const companyId = isDemo ? 'company-demo' : `company-${idx + 1}`;
    users.push({
      id: userId,
      role: 'company',
      email: isDemo ? 'company@survpay.com' : `hello@${seed.website}`,
      passwordHash,
      name: COMPANY_CONTACT_NAMES[idx % COMPANY_CONTACT_NAMES.length],
      avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
      createdAt: new Date(now - rng.int(80, 700) * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      emailVerified: true,
      locale: 'ar',
    });
    companies.push({
      id: companyId,
      userId,
      name: seed.name,
      logoColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
      industry: seed.industry,
      website: seed.website,
      plan: seed.plan,
      walletBalance: rng.int(5000, 45000),
      totalSpent: 0,
      createdAt: new Date(now - rng.int(80, 700) * 24 * 60 * 60 * 1000).toISOString(),
      teamMembers: [
        { id: `${companyId}-tm-1`, name: COMPANY_CONTACT_NAMES[idx % COMPANY_CONTACT_NAMES.length], email: isDemo ? 'company@survpay.com' : `hello@${seed.website}`, role: 'owner' },
        { id: `${companyId}-tm-2`, name: COMPANY_CONTACT_NAMES[(idx + 2) % COMPANY_CONTACT_NAMES.length], email: `research@${seed.website}`, role: 'analyst' },
      ],
    });
  });

  // ---------- Surveys ----------
  const statusCycle: Survey['status'][] = ['active', 'active', 'active', 'paused', 'completed', 'completed', 'draft'];

  let surveyCounter = 0;
  for (const bp of SURVEY_CATALOG) {
    const eligibleCompanies = companies
      .map((c, i) => ({ c, i }))
      .filter(({ i }) => COMPANY_SEEDS[i].categories.includes(bp.category));
    const target = eligibleCompanies.length > 0 ? rng.pick(eligibleCompanies) : { c: companies[0], i: 0 };
    const company = target.c;

    const status = statusCycle[surveyCounter % statusCycle.length];
    const targetResponses = rng.pick([300, 500, 750, 1000, 1500, 2000]);
    const responseCount =
      status === 'completed'
        ? targetResponses
        : status === 'draft'
        ? 0
        : Math.round(targetResponses * rng.float() * (status === 'paused' ? 0.6 : 0.85));
    const rewardPerResponse = Number((bp.minutes * rng.float() * 0.9 + bp.minutes * 1.1).toFixed(2));
    const costPerResponse = Number((rewardPerResponse * 1.55 + 0.3).toFixed(2));

    const bank = QUESTION_BANK[bp.category];
    const otherBank = QUESTION_BANK.other;
    const numQuestions = Math.max(4, Math.min(bank.length + 1, Math.round(bp.minutes * 1.1)));
    const questionTemplates = [...bank];
    if (rng.bool(0.5)) questionTemplates.push(otherBank[1]); // attention check
    const chosen = questionTemplates.slice(0, numQuestions);

    const survey: Survey = {
      id: `survey-${surveyCounter + 1}`,
      companyId: company.id,
      title: bp.title,
      description: bp.description,
      category: bp.category,
      estimatedMinutes: bp.minutes,
      rewardPerResponse,
      targetResponses,
      responseCount,
      status,
      targetAudience: randomAudience(rng),
      questions: chosen.map((q, qi) => ({
        id: `survey-${surveyCounter + 1}-q${qi + 1}`,
        type: q.type,
        prompt: q.prompt,
        options: q.options,
        required: true,
        isAttentionCheck: q.isAttentionCheck,
      })),
      createdAt: rng.dateWithinDays(200),
      launchedAt: status === 'draft' ? undefined : rng.dateWithinDays(150),
      completedAt: status === 'completed' ? rng.dateWithinDays(20) : undefined,
      costPerResponse,
    };
    surveys.push(survey);
    surveyCounter++;
  }

  companies.forEach((company) => {
    const companySurveys = surveys.filter((s) => s.companyId === company.id);
    company.totalSpent = Math.round(
      companySurveys.reduce((sum, s) => sum + s.responseCount * s.costPerResponse, 0)
    );
  });

  // ---------- Demo participant ----------
  const demoParticipantId = 'user-participant-demo';
  users.push({
    id: demoParticipantId,
    role: 'participant',
    email: 'participant@survpay.com',
    passwordHash,
    name: 'عبدالله الحربي',
    avatarColor: '#12b35e',
    createdAt: new Date(now - 260 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    emailVerified: true,
    locale: 'ar',
  });

  const demoProfile: ParticipantProfile = {
    userId: demoParticipantId,
    dateOfBirth: '1996-04-12',
    gender: 'male',
    city: 'Riyadh',
    householdSize: 4,
    maritalStatus: 'married',
    children: 1,
    employmentStatus: 'employed',
    industry: 'Technology',
    jobTitle: 'Software Engineer',
    incomeRange: '15k_25k',
    interests: ['technology', 'shopping', 'food', 'finance'],
    devices: ['iphone', 'computer'],
    balanceAvailable: 245.5,
    balancePending: 45.0,
    totalEarned: 1245.5,
    surveysCompleted: 24,
    riskScore: 'low',
    fraudFlags: [],
  };
  participants.push(demoProfile);

  // Reserve a handful of active surveys the demo participant is actually
  // eligible for, so the marketplace still has fresh, never-attempted
  // opportunities to show — not just any active survey, since most surveys
  // are demographically targeted and wouldn't otherwise match this profile.
  const eligibleActiveSurveys = surveys.filter((s) => s.status === 'active' && isEligible(demoProfile, s.targetAudience));
  const reserveCandidates = eligibleActiveSurveys.length > 0 ? eligibleActiveSurveys : surveys.filter((s) => s.status === 'active');
  const reservedForMarketplace = new Set(
    rng.pickMany(reserveCandidates, Math.min(8, reserveCandidates.length)).map((s) => s.id)
  );
  const responsePoolCandidates = surveys.filter((s) => !reservedForMarketplace.has(s.id));

  // 24 completed responses summing to 1245.50, last 3 pending (45.00)
  const pool = rng.pickMany(responsePoolCandidates, Math.min(26, responsePoolCandidates.length));
  let earnedSoFar = 0;
  const rewardAmounts: number[] = [];
  for (let i = 0; i < 23; i++) {
    const amt = Number((6 + rng.float() * 20).toFixed(2));
    rewardAmounts.push(amt);
    earnedSoFar += amt;
  }
  rewardAmounts.push(Number((1200.5 - earnedSoFar).toFixed(2)));
  const pendingAmounts = [15.0, 15.0, 15.0];

  let txCounter = 1;
  pool.slice(0, 24).forEach((survey, i) => {
    const isPending = i >= 21;
    const amount = isPending ? pendingAmounts[i - 21] : rewardAmounts[i];
    const daysAgo = 60 - i * 2;
    const respId = `resp-demo-${i + 1}`;
    responses.push({
      id: respId,
      surveyId: survey.id,
      participantId: demoParticipantId,
      status: 'completed',
      answers: survey.questions.map((q) => ({
        questionId: q.id,
        value: q.options?.[0]?.en ?? 'Yes',
        timeSpentSeconds: rng.int(8, 40),
      })),
      startedAt: rng.dateWithinDays(daysAgo + 1),
      completedAt: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      rewardAmount: amount,
      totalTimeSeconds: survey.estimatedMinutes * 60 - rng.int(0, 60),
    });
    transactions.push({
      id: `tx-demo-${txCounter++}`,
      userId: demoParticipantId,
      type: 'survey_reward',
      description: survey.title.en,
      amount,
      status: isPending ? 'pending' : 'completed',
      createdAt: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      relatedSurveyId: survey.id,
    });
  });

  // withdrawals summing to 955.00
  const wDates = [40, 15];
  const wAmounts = [500, 455];
  wDates.forEach((d, i) => {
    const wid = `wd-demo-${i + 1}`;
    withdrawals.push({
      id: wid,
      participantId: demoParticipantId,
      amount: wAmounts[i],
      method: i === 0 ? 'bank_transfer' : 'stc_pay',
      status: 'paid',
      requestedAt: new Date(now - (d + 2) * 24 * 60 * 60 * 1000).toISOString(),
      processedAt: new Date(now - d * 24 * 60 * 60 * 1000).toISOString(),
      destination: i === 0 ? 'SA** **** **** 4821' : 'STC Pay •• 5521',
    });
    transactions.push({
      id: `tx-demo-w${i + 1}`,
      userId: demoParticipantId,
      type: 'withdrawal',
      description: 'Withdrawal',
      amount: -wAmounts[i],
      status: 'completed',
      createdAt: new Date(now - d * 24 * 60 * 60 * 1000).toISOString(),
    });
  });

  // notifications for demo participant
  const shoppingHabitsSurvey = surveys.find((s) => s.title.en === 'Saudi Consumer Shopping Habits');
  const smartphoneSurvey = surveys.find((s) => s.title.en === 'Smartphone Usage & Upgrade Plans');
  notifications.push(
    {
      id: 'notif-demo-1',
      userId: demoParticipantId,
      kind: 'reward_earned',
      messageKey: 'rewardEarned',
      params: {
        amount: 12.5,
        surveyTitleEn: shoppingHabitsSurvey?.title.en ?? 'Saudi Consumer Shopping Habits',
        surveyTitleAr: shoppingHabitsSurvey?.title.ar ?? 'عادات التسوق لدى المستهلك السعودي',
      },
      createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 'notif-demo-2',
      userId: demoParticipantId,
      kind: 'new_survey',
      messageKey: 'newSurvey',
      params: {
        surveyTitleEn: smartphoneSurvey?.title.en ?? 'Smartphone Usage & Upgrade Plans',
        surveyTitleAr: smartphoneSurvey?.title.ar ?? 'استخدام الهواتف الذكية وخطط الترقية',
      },
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 'notif-demo-3',
      userId: demoParticipantId,
      kind: 'withdrawal_processed',
      messageKey: 'withdrawalPaid',
      params: { amount: 455, destination: 'STC Pay •• 5521' },
      createdAt: new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 'notif-demo-4',
      userId: demoParticipantId,
      kind: 'system',
      messageKey: 'profileIncomplete',
      params: { percent: 85 },
      createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    }
  );

  // ---------- Other participants ----------
  const allNames = [...MALE_NAMES.map((n) => ({ n, g: 'male' as Gender })), ...FEMALE_NAMES.map((n) => ({ n, g: 'female' as Gender }))];
  allNames.forEach(({ n, g }, idx) => {
    const uid = `user-participant-${idx + 1}`;
    const status = rng.bool(0.92) ? 'active' : rng.bool(0.5) ? 'suspended' : 'pending_verification';
    users.push({
      id: uid,
      role: 'participant',
      email: `participant${idx + 1}@example.com`,
      passwordHash,
      name: n,
      avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
      createdAt: rng.dateWithinDays(400),
      status,
      emailVerified: rng.bool(0.9),
      locale: rng.bool(0.75) ? 'ar' : 'en',
    });
    const surveysCompleted = rng.int(0, 60);
    const totalEarned = Number((surveysCompleted * rng.int(8, 18)).toFixed(2));
    const pending = Number((rng.float() * 30).toFixed(2));
    const available = Number(Math.max(0, totalEarned * rng.float() * 0.4).toFixed(2));
    const risk = rng.bool(0.82) ? 'low' : rng.bool(0.6) ? 'medium' : 'high';
    const flags: FraudFlag[] = [];
    if (risk !== 'low') {
      const flagTypes: FraudFlag['type'][] = ['fast_completion', 'repeated_answers', 'device_pattern', 'multiple_accounts', 'failed_attention_check'];
      const count = risk === 'high' ? rng.int(2, 4) : 1;
      for (let f = 0; f < count; f++) {
        const type = rng.pick(flagTypes);
        flags.push({
          id: `flag-${uid}-${f}`,
          userId: uid,
          type,
          description: FLAG_DESCRIPTIONS[type],
          detectedAt: rng.dateWithinDays(60),
          severity: risk === 'high' ? 'high' : 'medium',
          resolved: rng.bool(0.3),
        });
      }
    }
    participants.push({
      userId: uid,
      dateOfBirth: `${1985 + rng.int(0, 22)}-${String(rng.int(1, 12)).padStart(2, '0')}-${String(rng.int(1, 28)).padStart(2, '0')}`,
      gender: g,
      city: rng.pick(SAUDI_CITIES),
      householdSize: rng.int(1, 7),
      maritalStatus: rng.pick(MARITAL_STATUSES),
      children: rng.int(0, 4),
      employmentStatus: rng.pick(EMPLOYMENT_STATUSES),
      industry: rng.pick(INDUSTRIES),
      jobTitle: rng.pick(['Analyst', 'Teacher', 'Engineer', 'Coordinator', 'Consultant', 'Manager', 'Designer', 'Student']),
      incomeRange: rng.pick(INCOME_RANGES),
      interests: rng.pickMany(INTEREST_KEYS, rng.int(2, 5)),
      devices: rng.pickMany(DEVICE_KEYS, rng.int(1, 3)),
      balanceAvailable: available,
      balancePending: pending,
      totalEarned,
      surveysCompleted,
      riskScore: risk,
      fraudFlags: flags,
    });

    // sprinkle a few transactions/responses for realism on random users
    if (surveysCompleted > 0) {
      const nTx = Math.min(4, surveysCompleted);
      for (let k = 0; k < nTx; k++) {
        const survey = rng.pick(surveys);
        const amt = Number((survey.rewardPerResponse).toFixed(2));
        transactions.push({
          id: `tx-${uid}-${k}`,
          userId: uid,
          type: 'survey_reward',
          description: survey.title.en,
          amount: amt,
          status: 'completed',
          createdAt: rng.dateWithinDays(120),
          relatedSurveyId: survey.id,
        });
      }
    }
    if (rng.bool(0.15) && available > 50) {
      withdrawals.push({
        id: `wd-${uid}`,
        participantId: uid,
        amount: Math.round(available * 0.6),
        method: rng.pick(['bank_transfer', 'stc_pay']),
        status: rng.pick(['pending', 'approved', 'paid', 'paid']),
        requestedAt: rng.dateWithinDays(30),
        destination: 'SA** **** **** ' + rng.int(1000, 9999),
      });
    }
  });

  // ---------- Backfill synthetic historical responses for analytics/charts ----------
  const backfillParticipantIds = participants.map((p) => p.userId).filter((id) => id !== demoParticipantId);
  for (const survey of surveys) {
    if (survey.responseCount <= 0) continue;
    const sampleSize = Math.min(survey.responseCount, 180);
    const windowStart = survey.launchedAt ? new Date(survey.launchedAt).getTime() : now - 90 * 24 * 60 * 60 * 1000;
    const windowEnd = survey.completedAt ? new Date(survey.completedAt).getTime() : now;
    for (let i = 0; i < sampleSize; i++) {
      const participantId = rng.pick(backfillParticipantIds);
      const completedAt = new Date(windowStart + rng.float() * Math.max(1, windowEnd - windowStart)).toISOString();
      const timeSeconds = Math.max(20, Math.round(survey.estimatedMinutes * 60 * (0.6 + rng.float() * 0.7)));
      responses.push({
        id: `resp-syn-${survey.id}-${i}`,
        surveyId: survey.id,
        participantId,
        status: 'completed',
        answers: survey.questions.map((q) => ({
          questionId: q.id,
          value: q.options?.length ? rng.pick(q.options).en : q.type === 'rating' ? rng.int(1, 5) : 'Yes',
          timeSpentSeconds: rng.int(5, 30),
        })),
        startedAt: completedAt,
        completedAt,
        rewardAmount: survey.rewardPerResponse,
        totalTimeSeconds: timeSeconds,
      });
    }
  }

  // --- Studio seed: the founder's own product portfolio -------------------
  // Starts with just Survpay itself (this app), tracked design -> coding ->
  // publishing. More of the founder's companies get added the same way
  // later, from the Studio "New project" form.
  const survpayProject: Project = {
    id: 'project-survpay',
    name: 'Survpay',
    tagline: 'Saudi Arabia survey rewards marketplace',
    description:
      'A full-stack MVP where companies create targeted surveys, participants answer them and get paid in SAR, and an internal admin team runs the platform. Arabic-first, fully bilingual with RTL support.',
    color: '#3229f2',
    repoUrl: 'https://github.com/ghalywedinly/survpay',
    stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'next-intl', 'Recharts'],
    stages: [
      { key: 'design', status: 'done', updatedAt: new Date(now - 60 * 24 * 60 * 60 * 1000).toISOString() },
      { key: 'coding', status: 'in_progress', updatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { key: 'publishing', status: 'not_started', updatedAt: new Date(now - 60 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    createdAt: new Date(now - 60 * 24 * 60 * 60 * 1000).toISOString(),
  };
  const projects: Project[] = [survpayProject];

  const AGENT_SEEDS: { id: string; role: Agent['role']; name: string; color: string; description: string }[] = [
    {
      id: 'agent-survpay-design',
      role: 'design',
      name: 'Design Agent',
      color: '#b32be0',
      description: 'Brand, UI/UX, and visual design for Survpay.',
    },
    {
      id: 'agent-survpay-coding',
      role: 'coding',
      name: 'Coding Agent',
      color: '#3229f2',
      description: 'Builds and ships features across the Survpay codebase.',
    },
    {
      id: 'agent-survpay-publishing',
      role: 'publishing',
      name: 'Publishing Agent',
      color: '#12b35e',
      description: 'Handles deployment, launch checklist, and go-live for Survpay.',
    },
  ];
  const agents: Agent[] = AGENT_SEEDS.map((a) => ({ ...a, projectId: survpayProject.id }));

  const AGENT_WELCOME: Record<string, string> = {
    'agent-survpay-design':
      "Hey! I'm the Design Agent for Survpay. Ask me about the brand, UI components, or anything on the design backlog.",
    'agent-survpay-coding':
      "Hey! I'm the Coding Agent for Survpay. Ask me about the codebase, a feature you want built, or a bug to fix.",
    'agent-survpay-publishing':
      "Hey! I'm the Publishing Agent for Survpay. Ask me about the launch checklist, hosting, or going live.",
  };
  const agentMessages: AgentMessage[] = agents.map((agent, i) => ({
    id: `msg-welcome-${agent.id}`,
    projectId: agent.projectId,
    agentId: agent.id,
    sender: 'agent',
    content: AGENT_WELCOME[agent.id],
    createdAt: new Date(now - (60 - i) * 60 * 1000).toISOString(),
  }));
  return {
    users,
    participants,
    companies,
    surveys,
    responses,
    transactions,
    withdrawals,
    notifications,
    projects,
    agents,
    agentMessages,
  };
}

const FLAG_DESCRIPTIONS: Record<FraudFlag['type'], string> = {
  multiple_accounts: 'Multiple accounts detected from the same device fingerprint.',
  fast_completion: 'Survey completed significantly faster than the median completion time.',
  repeated_answers: 'Answer pattern is nearly identical across multiple recent surveys.',
  device_pattern: 'Unusual number of accounts sharing the same IP address range.',
  failed_attention_check: 'Failed one or more attention-check questions.',
  abnormal_behavior: 'Response behavior flagged by the automated quality model.',
};

export { DEMO_PASSWORD };
