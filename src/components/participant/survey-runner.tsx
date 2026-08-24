'use client';

import { useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, PartyPopper, Wallet, Star, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from '@/i18n/routing';
import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { Survey, SurveyAnswer, Locale } from '@/lib/types';
import { pick } from '@/lib/i18n-utils';
import { formatSar } from '@/lib/format';
import { completeSurveyAction } from '@/app/actions/survey';

export function SurveyRunner({ survey, locale }: { survey: Survey; locale: Locale }) {
  const t = useTranslations('surveyFlow');
  const tc = useTranslations('common');
  const toast = useToast();

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [showRequired, setShowRequired] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ reward: number; pending: boolean; newBalance: number } | null>(null);
  const questionStart = useRef<number>(Date.now());
  const timeSpent = useRef<Record<string, number>>({});

  const question = survey.questions[index];
  const total = survey.questions.length;
  const progress = ((index + (result ? 1 : 0)) / total) * 100;

  const currentAnswer = answers[question?.id];
  const isAnswered = useMemo(() => {
    if (!question) return true;
    if (question.type === 'multiple_choice') return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    return currentAnswer !== undefined && currentAnswer !== '';
  }, [currentAnswer, question]);

  function setAnswer(value: string | string[] | number) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    setShowRequired(false);
  }

  function recordTime() {
    const elapsed = Math.round((Date.now() - questionStart.current) / 1000);
    timeSpent.current[question.id] = (timeSpent.current[question.id] || 0) + Math.max(1, elapsed);
    questionStart.current = Date.now();
  }

  function goNext() {
    if (question.required && !isAnswered) {
      setShowRequired(true);
      return;
    }
    recordTime();
    if (index < total - 1) {
      setIndex((i) => i + 1);
    } else {
      void submit();
    }
  }

  function goBack() {
    if (index === 0) return;
    recordTime();
    setIndex((i) => i - 1);
  }

  async function submit() {
    setSubmitting(true);
    const payload: SurveyAnswer[] = survey.questions.map((q) => ({
      questionId: q.id,
      value: answers[q.id] ?? '',
      timeSpentSeconds: timeSpent.current[q.id] || 5,
    }));
    const res = await completeSurveyAction(survey.id, payload);
    setSubmitting(false);
    if (res.ok) {
      setResult({ reward: res.reward, pending: res.pending, newBalance: res.newAvailableBalance });
    } else {
      toast.push({ variant: 'error', title: tc('somethingWrong') });
    }
  }

  if (result) {
    return (
      <div className="fixed inset-0 z-[70] flex flex-col bg-white">
        <div className="flex h-16 items-center justify-center border-b border-ink-100">
          <Logo size={24} />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="flex h-20 w-20 animate-pop items-center justify-center rounded-full bg-money-100 text-money-600">
            <PartyPopper size={36} />
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-ink-900">{t('completedTitle')} 🎉</h1>
          <p className="mt-2 text-lg font-semibold text-ink-700">
            {result.pending ? t('completedPendingBody', { amount: formatSar(result.reward, locale) }) : t('completedBody', { amount: formatSar(result.reward, locale) })}
          </p>
          <div className="mt-6 rounded-2xl bg-ink-50 px-6 py-4">
            <p className="text-xs font-medium text-ink-500">{t('newBalance')}</p>
            <p className="mt-1 text-2xl font-extrabold text-money-700">{formatSar(result.newBalance, locale)}</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/participant/surveys">
              <Button variant="secondary" size="lg" icon={<ArrowRight size={18} className="flip-rtl" />}>
                {t('findMore')}
              </Button>
            </Link>
            <Link href="/participant/dashboard">
              <Button variant="outline" size="lg">
                {t('backToDashboard')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-white">
      <div className="flex h-16 items-center justify-between border-b border-ink-100 px-4 sm:px-6">
        <Logo size={22} showWordmark={false} />
        <p className="text-sm font-semibold text-ink-500">{t('question', { current: index + 1, total })}</p>
        <button onClick={() => setShowExit(true)} className="rounded-full p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700" aria-label="Exit">
          <X size={20} />
        </button>
      </div>
      <ProgressBar value={progress} gradient className="!rounded-none h-1.5" />

      <div className="flex flex-1 items-start justify-center overflow-y-auto px-4 py-10 sm:px-6">
        <div key={question.id} className="w-full max-w-xl animate-fade-up">
          <h2 className="text-xl font-extrabold leading-snug text-ink-900 sm:text-2xl">{pick(question.prompt, locale)}</h2>
          {question.isAttentionCheck && (
            <p className="mt-2 text-xs font-semibold text-brand-700">{tc('required')}</p>
          )}

          <div className="mt-7">
            {(question.type === 'single_choice' || question.type === 'demographic') && (
              <div className="space-y-2.5">
                {question.options?.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setAnswer(opt.en)}
                    className={clsx(
                      'flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-start text-sm font-semibold transition-colors',
                      currentAnswer === opt.en ? 'border-brand-500 bg-brand-50 text-ink-900' : 'border-ink-100 bg-white text-ink-700 hover:border-ink-200'
                    )}
                  >
                    <span
                      className={clsx(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                        currentAnswer === opt.en ? 'border-brand-500' : 'border-ink-300'
                      )}
                    >
                      {currentAnswer === opt.en && <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />}
                    </span>
                    {pick(opt, locale)}
                  </button>
                ))}
              </div>
            )}

            {question.type === 'yes_no' && (
              <div className="grid grid-cols-2 gap-3">
                {[tc('yes'), tc('no')].map((label, i) => {
                  const val = i === 0 ? 'Yes' : 'No';
                  return (
                    <button
                      key={val}
                      onClick={() => setAnswer(val)}
                      className={clsx(
                        'rounded-xl border-2 py-5 text-base font-bold transition-colors',
                        currentAnswer === val ? 'border-brand-500 bg-brand-50 text-ink-900' : 'border-ink-100 bg-white text-ink-700 hover:border-ink-200'
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            {question.type === 'multiple_choice' && (
              <div className="space-y-2.5">
                {question.options?.map((opt, i) => {
                  const arr = Array.isArray(currentAnswer) ? currentAnswer : [];
                  const checked = arr.includes(opt.en);
                  return (
                    <button
                      key={i}
                      onClick={() => setAnswer(checked ? arr.filter((v) => v !== opt.en) : [...arr, opt.en])}
                      className={clsx(
                        'flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-start text-sm font-semibold transition-colors',
                        checked ? 'border-brand-500 bg-brand-50 text-ink-900' : 'border-ink-100 bg-white text-ink-700 hover:border-ink-200'
                      )}
                    >
                      <span
                        className={clsx(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2',
                          checked ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink-300'
                        )}
                      >
                        {checked && '✓'}
                      </span>
                      {pick(opt, locale)}
                    </button>
                  );
                })}
              </div>
            )}

            {question.type === 'rating' && (
              <div>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setAnswer(n)}
                      className={clsx(
                        'flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-2xl border-2 font-bold transition-colors sm:h-16 sm:w-16',
                        Number(currentAnswer) === n ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-100 text-ink-500 hover:border-ink-200'
                      )}
                    >
                      <Star size={16} fill={Number(currentAnswer) >= n ? 'currentColor' : 'none'} />
                      {n}
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-center text-xs text-ink-400">{t('ratingLabel')}</p>
              </div>
            )}

            {question.type === 'text' && (
              <Textarea
                rows={4}
                value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={t('typeAnswer')}
              />
            )}
          </div>

          {showRequired && <p className="mt-3 text-sm font-semibold text-red-600">{t('requiredNotice')}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-ink-100 px-4 py-4 sm:px-6">
        <Button variant="outline" onClick={goBack} disabled={index === 0}>
          {t('back')}
        </Button>
        <Button variant="secondary" onClick={goNext} loading={submitting}>
          {index === total - 1 ? t('submit') : t('next')}
        </Button>
      </div>

      <Modal open={showExit} onClose={() => setShowExit(false)} title={t('exitConfirmTitle')}>
        <p className="text-sm text-ink-500">{t('exitConfirmBody')}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowExit(false)}>
            {t('stayCta')}
          </Button>
          <Link href="/participant/surveys">
            <Button variant="danger">{t('exitConfirmCta')}</Button>
          </Link>
        </div>
      </Modal>
    </div>
  );
}
