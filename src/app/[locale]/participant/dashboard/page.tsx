import { getTranslations, getLocale } from 'next-intl/server';
import { Wallet, TrendingUp, ListChecks, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getSession } from '@/lib/auth';
import { getDb, getParticipantProfile } from '@/lib/data/store';
import { listAvailableSurveys } from '@/lib/services/participant';
import { profileCompletionPercent } from '@/lib/profile-completion';
import { StatCard } from '@/components/dashboard/stat-card';
import { SurveyCard } from '@/components/participant/survey-card';
import { EmptyState } from '@/components/ui/empty-state';
import { ProgressBar } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { formatSar, formatDate } from '@/lib/format';
import { localizeTransactionDescription } from '@/lib/i18n-utils';
import { Locale, Survey } from '@/lib/types';

export default async function ParticipantDashboardPage() {
  const locale = (await getLocale()) as Locale;
  const session = await getSession();
  const t = await getTranslations('participantDashboard');
  const tc = await getTranslations('common');
  const tCat = await getTranslations('categories');
  const tSurvey = await getTranslations('surveyCard');
  const tTxType = await getTranslations('txType');

  const profile = await getParticipantProfile(session!.uid);
  const [available, db] = await Promise.all([listAvailableSurveys(session!.uid), getDb()]);
  const surveysById: Record<string, Survey> = Object.fromEntries(db.surveys.map((s) => [s.id, s]));
  const recentTx = db.transactions
    .filter((tx) => tx.userId === session!.uid)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  const completion = profile
    ? profileCompletionPercent(profile)
    : 0;

  return (
    <div className="container-app py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('greeting', { name: session!.name.split(' ')[0] })}</h1>
        <p className="text-sm text-ink-500">{t('subtitle')}</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <p className="text-sm font-medium text-ink-500">{t('availableBalance')}</p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-money-700">{formatSar(profile?.balanceAvailable ?? 0, locale)}</p>
          <Link href="/participant/withdraw" className="mt-3 inline-block">
            <Button size="sm" variant="success">
              {t('withdraw')}
            </Button>
          </Link>
        </div>
        <StatCard label={t('totalEarned')} value={formatSar(profile?.totalEarned ?? 0, locale)} icon={TrendingUp} accent="brand" />
        <StatCard label={t('surveysCompleted')} value={profile?.surveysCompleted ?? 0} icon={ListChecks} />
        <StatCard label={t('pendingRewards')} value={formatSar(profile?.balancePending ?? 0, locale)} icon={Clock} />
      </div>

      {completion < 100 && (
        <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50/60 p-5 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
              <Sparkles size={18} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink-900">
                {t('profileCompletion')}: {completion}%
              </p>
              <p className="mt-0.5 max-w-md text-sm text-ink-500">{t('profileCompletionBody')}</p>
              <ProgressBar value={completion} gradient className="mt-3 w-56" />
            </div>
          </div>
          <Link href="/participant/profile" className="mt-4 block sm:mt-0">
            <Button variant="primary" size="sm">
              {t('completeProfile')}
            </Button>
          </Link>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink-900">{t('recommendedSurveys')}</h2>
        <Link href="/participant/surveys" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
          {t('seeAllSurveys')} <ArrowRight size={14} className="flip-rtl" />
        </Link>
      </div>
      {available.length === 0 ? (
        <div className="mt-4">
          <EmptyState icon={ListChecks} title={t('noSurveys')} description={t('noSurveysBody')} />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {available.slice(0, 3).map((s) => (
            <Link key={s.id} href={`/participant/surveys/${s.id}` as never}>
              <SurveyCard
                survey={s}
                locale={locale}
                categoryLabel={tCat(s.category)}
                minLabel={tc('min')}
                questionsLabel={tc('questions')}
                ctaLabel={tSurvey('startSurvey')}
              />
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-bold text-ink-900">{t('recentActivity')}</h2>
        {recentTx.length === 0 ? (
          <div className="mt-4">
            <EmptyState icon={Wallet} title={t('noActivity')} description={t('noActivityBody')} />
          </div>
        ) : (
          <div className="mt-4 card !p-0 divide-y divide-ink-100">
            {recentTx.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-ink-600">
                    <Wallet size={15} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      {localizeTransactionDescription(tx, surveysById, locale, tTxType(tx.type))}
                    </p>
                    <p className="text-xs text-ink-400">{formatDate(tx.createdAt, locale)}</p>
                  </div>
                </div>
                <p className={`text-sm font-bold ${tx.amount >= 0 ? 'text-money-600' : 'text-ink-700'}`}>
                  {formatSar(tx.amount, locale, true)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
