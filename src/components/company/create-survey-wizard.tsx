'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { clsx } from 'clsx';
import { Check, Plus, Trash2, Sparkles, PartyPopper } from 'lucide-react';
import { Input, Select, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { SAUDI_CITIES, Gender, IncomeRange, EmploymentStatus, InterestKey, QuestionType, SurveyCategory } from '@/lib/types';
import { SURVEY_CATEGORIES, INCOME_RANGES, EMPLOYMENT_STATUSES, INTEREST_KEYS } from '@/lib/constants';
import { estimateAudienceSize } from '@/lib/services/eligibility';
import { formatSar, formatNumber } from '@/lib/format';
import { createSurveyAction } from '@/app/actions/company';
import { Locale } from '@/lib/types';

interface WizardQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options: string;
  required: boolean;
}

const QUESTION_TYPES: QuestionType[] = ['single_choice', 'multiple_choice', 'rating', 'yes_no', 'text', 'demographic'];
const NEEDS_OPTIONS: QuestionType[] = ['single_choice', 'multiple_choice'];

let qCounter = 0;
function newQuestion(): WizardQuestion {
  qCounter += 1;
  return { id: `q-${qCounter}`, type: 'single_choice', prompt: '', options: '', required: true };
}

export function CreateSurveyWizard({ locale }: { locale: Locale }) {
  const t = useTranslations('createSurvey');
  const tCat = useTranslations('categories');
  const tGender = useTranslations('gender');
  const tIncome = useTranslations('income');
  const tEmployment = useTranslations('employment');
  const tInterest = useTranslations('interests');
  const tCity = useTranslations('cities');
  const tQType = useTranslations('questionType');
  const tc = useTranslations('common');
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SurveyCategory>('shopping');
  const [duration, setDuration] = useState(6);

  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(45);
  const [genders, setGenders] = useState<Gender[]>(['male', 'female']);
  const [cities, setCities] = useState<string[]>([...SAUDI_CITIES]);
  const [incomeRanges, setIncomeRanges] = useState<IncomeRange[]>([...INCOME_RANGES]);
  const [employmentStatuses, setEmploymentStatuses] = useState<EmploymentStatus[]>([...EMPLOYMENT_STATUSES]);
  const [interests, setInterests] = useState<InterestKey[]>([]);

  const [questions, setQuestions] = useState<WizardQuestion[]>([newQuestion()]);

  const [targetResponses, setTargetResponses] = useState(500);
  const [rewardPerResponse, setRewardPerResponse] = useState(8);

  const [launching, setLaunching] = useState(false);
  const [done, setDone] = useState<{ published: boolean } | null>(null);

  const audience = useMemo(
    () =>
      estimateAudienceSize(32000, {
        ageMin,
        ageMax,
        genders,
        cities: cities as never,
        incomeRanges,
        employmentStatuses,
        interests,
      }),
    [ageMin, ageMax, genders, cities, incomeRanges, employmentStatuses, interests]
  );
  const costPerResponse = Number((rewardPerResponse * 1.55 + 0.3).toFixed(2));
  const estimatedTotal = Number((costPerResponse * targetResponses).toFixed(2));

  function toggle<T>(arr: T[], setArr: (v: T[]) => void, value: T) {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  }

  function updateQuestion(id: string, patch: Partial<WizardQuestion>) {
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  const steps = [t('step1Title'), t('step2Title'), t('step3Title'), t('step4Title'), t('step5Title')];

  const canNext =
    step === 1
      ? name.trim().length > 0 && description.trim().length > 0
      : step === 3
      ? questions.every((q) => q.prompt.trim().length > 0)
      : true;

  async function submit(publish: boolean) {
    setLaunching(true);
    const res = await createSurveyAction({
      title: name,
      description,
      category,
      estimatedMinutes: duration,
      targetAudience: {
        ageMin,
        ageMax,
        genders,
        cities: cities as never,
        incomeRanges,
        employmentStatuses,
        interests,
      },
      questions: questions.map((q) => ({
        type: q.type,
        prompt: q.prompt,
        options: NEEDS_OPTIONS.includes(q.type) ? q.options.split('\n').map((o) => o.trim()).filter(Boolean) : undefined,
        required: q.required,
      })),
      targetResponses,
      rewardPerResponse,
      publish,
    });
    setLaunching(false);
    if (res.ok) setDone({ published: publish });
  }

  if (done) {
    return (
      <Modal open onClose={() => router.push('/company/surveys')} title={done.published ? t('launched') : t('savedDraft')}>
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center border-2 border-ink-900 bg-aqua-500 text-ink-900">
            <PartyPopper size={26} />
          </div>
          <p className="mt-4 text-sm text-ink-600">{done.published ? t('launchedBody') : t('savedDraftBody')}</p>
          <Button className="mt-6" fullWidth onClick={() => router.push('/company/surveys')}>
            {t('backToSurveys')}
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <div>
      <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-2">
        {steps.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const complete = n < step;
          return (
            <button
              key={n}
              onClick={() => n < step && setStep(n)}
              className={clsx(
                'flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition-colors',
                active ? 'border-ink-900 bg-ink-900 text-white' : complete ? 'border-money-300 bg-money-50 text-money-700' : 'border-ink-200 text-ink-400'
              )}
            >
              <span className={clsx('flex h-5 w-5 items-center justify-center rounded-full text-[11px]', active ? 'bg-white text-ink-900' : complete ? 'bg-money-500 text-white' : 'bg-ink-100')}>
                {complete ? <Check size={12} /> : n}
              </span>
              {label}
            </button>
          );
        })}
      </div>

      <div className="card mt-6">
        {step === 1 && (
          <div className="space-y-5">
            <Input label={t('surveyName')} value={name} onChange={(e) => setName(e.target.value)} placeholder="Saudi Consumer Shopping Habits" />
            <Textarea label={t('description')} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Select label={t('category')} value={category} onChange={(e) => setCategory(e.target.value as SurveyCategory)}>
                {SURVEY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {tCat(c)}
                  </option>
                ))}
              </Select>
              <Input label={t('duration')} type="number" min={2} max={30} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-ink-700">{t('ageRange')}</p>
              <div className="flex items-center gap-3">
                <Input type="number" value={ageMin} onChange={(e) => setAgeMin(Number(e.target.value))} className="w-24" />
                <span className="text-ink-400">—</span>
                <Input type="number" value={ageMax} onChange={(e) => setAgeMax(Number(e.target.value))} className="w-24" />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink-700">{t('gender')}</p>
              <div className="flex gap-2">
                {(['male', 'female'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => toggle(genders, setGenders, g)}
                    className={clsx(
                      'rounded-full border-2 px-4 py-1.5 text-sm font-semibold',
                      genders.includes(g) ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-100 text-ink-500'
                    )}
                  >
                    {tGender(g)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink-700">{t('cities')}</p>
              <div className="flex flex-wrap gap-2">
                {SAUDI_CITIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggle(cities, setCities, c)}
                    className={clsx(
                      'rounded-full border-2 px-3.5 py-1.5 text-xs font-semibold',
                      cities.includes(c) ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-100 text-ink-500'
                    )}
                  >
                    {tCity(c)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink-700">{t('income')}</p>
              <div className="flex flex-wrap gap-2">
                {INCOME_RANGES.map((i) => (
                  <button
                    key={i}
                    onClick={() => toggle(incomeRanges, setIncomeRanges, i)}
                    className={clsx(
                      'rounded-full border-2 px-3.5 py-1.5 text-xs font-semibold',
                      incomeRanges.includes(i) ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-100 text-ink-500'
                    )}
                  >
                    {tIncome(i)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink-700">{t('employment')}</p>
              <div className="flex flex-wrap gap-2">
                {EMPLOYMENT_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggle(employmentStatuses, setEmploymentStatuses, s)}
                    className={clsx(
                      'rounded-full border-2 px-3.5 py-1.5 text-xs font-semibold',
                      employmentStatuses.includes(s) ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-100 text-ink-500'
                    )}
                  >
                    {tEmployment(s)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink-700">{t('interests')}</p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_KEYS.map((i) => (
                  <button
                    key={i}
                    onClick={() => toggle(interests, setInterests, i)}
                    className={clsx(
                      'rounded-full border-2 px-3.5 py-1.5 text-xs font-semibold',
                      interests.includes(i) ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-100 text-ink-500'
                    )}
                  >
                    {tInterest(i)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 border-2 border-ink-900 bg-brand-50 px-4 py-3.5">
              <Sparkles size={18} className="text-brand-700" />
              <div>
                <p className="text-xs font-semibold text-brand-700">{t('estimatedAudience')}</p>
                <p className="text-xl font-extrabold text-brand-800">{formatNumber(audience, locale)}</p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {questions.map((q, i) => (
              <div key={q.id} className="rounded-none border-2 border-ink-200 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-ink-900">
                    {i + 1}. {tQType(q.type)}
                  </p>
                  {questions.length > 1 && (
                    <button onClick={() => setQuestions((qs) => qs.filter((x) => x.id !== q.id))} className="text-ink-400 hover:text-danger-600">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-[180px_1fr]">
                  <Select value={q.type} onChange={(e) => updateQuestion(q.id, { type: e.target.value as QuestionType })}>
                    {QUESTION_TYPES.map((qt) => (
                      <option key={qt} value={qt}>
                        {tQType(qt)}
                      </option>
                    ))}
                  </Select>
                  <Input
                    value={q.prompt}
                    onChange={(e) => updateQuestion(q.id, { prompt: e.target.value })}
                    placeholder={t('questionPrompt')}
                  />
                </div>
                {NEEDS_OPTIONS.includes(q.type) && (
                  <div className="mt-3">
                    <Textarea
                      rows={3}
                      value={q.options}
                      onChange={(e) => updateQuestion(q.id, { options: e.target.value })}
                      placeholder={t('questionOptions')}
                      label={t('questionOptions')}
                    />
                  </div>
                )}
              </div>
            ))}
            <Button variant="outline" icon={<Plus size={16} />} onClick={() => setQuestions((qs) => [...qs, newQuestion()])}>
              {t('addQuestion')}
            </Button>
            <p className="text-xs text-ink-400">{t('questionsCount', { count: questions.length })}</p>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <Input
              label={t('responsesRequired')}
              type="number"
              min={50}
              step={50}
              value={targetResponses}
              onChange={(e) => setTargetResponses(Number(e.target.value))}
            />
            <Input
              label={t('rewardPerResponse')}
              type="number"
              min={1}
              step={0.5}
              value={rewardPerResponse}
              onChange={(e) => setRewardPerResponse(Number(e.target.value))}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-ink-200 bg-ink-50 px-4 py-3.5">
                <p className="text-xs font-medium text-ink-500">{t('costPerResponse')}</p>
                <p className="text-lg font-extrabold text-ink-900">{formatSar(costPerResponse, locale)}</p>
              </div>
              <div className="border-2 border-ink-900 bg-brand-50 px-4 py-3.5">
                <p className="text-xs font-medium text-brand-700">{t('estimatedTotal')}</p>
                <p className="text-lg font-extrabold text-brand-800">{formatSar(estimatedTotal, locale)}</p>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <p className="text-sm text-ink-500">{t('reviewSummary')}</p>
            <div className="rounded-none border-2 border-ink-200 p-4">
              <p className="text-lg font-extrabold text-ink-900">{name || '—'}</p>
              <p className="mt-1 text-sm text-ink-500">{description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-ink-500">
                <span className="rounded-full bg-ink-100 px-3 py-1">{tCat(category)}</span>
                <span className="rounded-full bg-ink-100 px-3 py-1">
                  {duration} {tc('min')}
                </span>
                <span className="rounded-full bg-ink-100 px-3 py-1">{questions.length} {tc('questions')}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="border-2 border-ink-200 bg-ink-50 p-3.5 text-center">
                <p className="text-xs text-ink-500">{t('estimatedAudience')}</p>
                <p className="text-base font-extrabold text-ink-900">{formatNumber(audience, locale)}</p>
              </div>
              <div className="border-2 border-ink-200 bg-ink-50 p-3.5 text-center">
                <p className="text-xs text-ink-500">{t('responsesRequired')}</p>
                <p className="text-base font-extrabold text-ink-900">{formatNumber(targetResponses, locale)}</p>
              </div>
              <div className="border-2 border-ink-200 bg-ink-50 p-3.5 text-center">
                <p className="text-xs text-ink-500">{t('costPerResponse')}</p>
                <p className="text-base font-extrabold text-ink-900">{formatSar(costPerResponse, locale)}</p>
              </div>
              <div className="border-2 border-ink-900 bg-brand-50 p-3.5 text-center">
                <p className="text-xs text-brand-700">{t('estimatedTotal')}</p>
                <p className="text-base font-extrabold text-brand-800">{formatSar(estimatedTotal, locale)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          {tc('back')}
        </Button>
        <div className="flex gap-3">
          {step === 5 && (
            <Button variant="outline" loading={launching} onClick={() => submit(false)}>
              {t('saveDraft')}
            </Button>
          )}
          {step < 5 ? (
            <Button variant="secondary" onClick={() => canNext && setStep((s) => Math.min(5, s + 1))} disabled={!canNext}>
              {tc('next')}
            </Button>
          ) : (
            <Button variant="secondary" loading={launching} onClick={() => submit(true)}>
              {t('launchSurvey')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
