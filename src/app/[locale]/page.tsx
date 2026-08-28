import { getTranslations, getLocale } from 'next-intl/server';
import { ArrowRight, Wallet, CheckCircle2, TrendingUp, ListChecks, ShieldCheck, Zap, Scale, Users2, Search, MessageSquareQuote, Star } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';
import { Section, Eyebrow } from '@/components/marketing/reveal';
import { Button } from '@/components/ui/button';
import { SurveyCard } from '@/components/participant/survey-card';
import { getDb } from '@/lib/data/store';
import { pick } from '@/lib/i18n-utils';
import { formatSar, formatNumber } from '@/lib/format';
import { Locale } from '@/lib/types';

const COMPANY_LOGOS = ['Nova Retail Group', "Ru'ya Financial", 'STC Digital Labs', 'Elite Foods Co.', 'Red Sea Travel', 'Riyadh Auto Group'];

export default async function LandingPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('landing');
  const tc = await getTranslations('common');
  const tCat = await getTranslations('categories');
  const tNav = await getTranslations('nav');
  const db = await getDb();

  const demo = db.participants.find((p) => p.userId === 'user-participant-demo')!;
  const previewSurveys = db.surveys.filter((s) => s.status === 'active').slice(0, 3);
  const availableSurveysCount = db.surveys.filter((s) => s.status === 'active').length;

  const steps = [
    { icon: Search, title: t('howItWorks.step1Title'), body: t('howItWorks.step1Body') },
    { icon: MessageSquareQuote, title: t('howItWorks.step2Title'), body: t('howItWorks.step2Body') },
    { icon: Wallet, title: t('howItWorks.step3Title'), body: t('howItWorks.step3Body') },
  ];

  const earnPoints = [
    { icon: Wallet, title: t('earn.point1Title'), body: t('earn.point1Body') },
    { icon: TrendingUp, title: t('earn.point2Title'), body: t('earn.point2Body') },
    { icon: ListChecks, title: t('earn.point3Title'), body: t('earn.point3Body') },
  ];

  const companyPoints = [
    { icon: Users2, title: t('companies.point1Title'), body: t('companies.point1Body') },
    { icon: TrendingUp, title: t('companies.point2Title'), body: t('companies.point2Body') },
    { icon: ShieldCheck, title: t('companies.point3Title'), body: t('companies.point3Body') },
  ];

  const whyCards = [
    { icon: Zap, title: t('why.card1Title'), body: t('why.card1Body') },
    { icon: Scale, title: t('why.card2Title'), body: t('why.card2Body') },
    { icon: ShieldCheck, title: t('why.card3Title'), body: t('why.card3Body') },
    { icon: CheckCircle2, title: t('why.card4Title'), body: t('why.card4Body') },
  ];

  const testimonials = [
    { quote: t('testimonials.t1Quote'), name: t('testimonials.t1Name'), role: t('testimonials.t1Role') },
    { quote: t('testimonials.t2Quote'), name: t('testimonials.t2Name'), role: t('testimonials.t2Role') },
    { quote: t('testimonials.t3Quote'), name: t('testimonials.t3Name'), role: t('testimonials.t3Role') },
  ];

  const faqs = [1, 2, 3, 4, 5].map((i) => ({ q: t(`faq.q${i}`), a: t(`faq.a${i}`) }));

  return (
    <>
      <Navbar />
      <main>
        {/* HERO — instrument, not personality: ground, ink, one purple field. */}
        <Section className="!pb-16 !pt-16 sm:!pt-20">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <Eyebrow>{t('hero.eyebrow')}</Eyebrow>
              <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
                {t('hero.headline')}
              </h1>
              <p className="mt-5 max-w-lg text-balance text-lg leading-relaxed text-ink-600">{t('hero.subheadline')}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup?role=participant">
                  <Button size="lg" variant="secondary" fullWidth icon={<ArrowRight size={18} className="flip-rtl" />}>
                    {t('hero.ctaPrimary')}
                  </Button>
                </Link>
                <Link href="/signup?role=company">
                  <Button size="lg" variant="outline" fullWidth>
                    {t('hero.ctaSecondary')}
                  </Button>
                </Link>
              </div>
              <p className="mt-5 text-sm text-ink-500">{t('hero.trustNote')}</p>
            </div>

            <div className="mx-auto w-full max-w-md rounded-none border-2 border-ink-900 bg-paper p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-500">{t('hero.dashboardTitle')}</p>
              <div className="mt-4 rounded-none bg-aqua-500 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-900/70">{t('hero.availableBalance')}</p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight text-ink-900">{formatSar(demo.balanceAvailable, locale)}</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-px bg-ink-200">
                <div className="bg-paper p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-500">{t('hero.completedSurveys')}</p>
                  <p className="mt-1 text-xl font-bold text-ink-900">{formatNumber(demo.surveysCompleted, locale)}</p>
                </div>
                <div className="bg-paper p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-500">{t('hero.totalEarnings')}</p>
                  <p className="mt-1 text-xl font-bold text-ink-900">{formatSar(demo.totalEarned, locale)}</p>
                </div>
              </div>
              <div className="mt-px flex items-center justify-between border-t-2 border-ink-900 bg-paper pt-4">
                <span className="text-xs font-bold uppercase tracking-wide text-ink-500">{t('hero.availableSurveys')}</span>
                <span className="text-lg font-bold text-ink-900">{formatNumber(availableSurveysCount, locale)}+</span>
              </div>
            </div>
          </div>
        </Section>

        {/* LOGOS */}
        <Section className="!py-10">
          <p className="text-center text-xs font-bold uppercase tracking-wide text-ink-400">{t('logos.title')}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {COMPANY_LOGOS.map((name) => (
              <span key={name} className="text-lg font-extrabold text-ink-300">
                {name}
              </span>
            ))}
          </div>
        </Section>

        {/* HOW IT WORKS */}
        <Section id="how-it-works">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{t('howItWorks.title')}</h2>
            <p className="mt-3 text-lg text-ink-500">{t('howItWorks.subtitle')}</p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={i} className="relative rounded-none border-2 border-ink-900 bg-paper p-7">
                <span className="text-5xl font-extrabold text-ink-100">{String(i + 1).padStart(2, '0')}</span>
                <div className="mt-3 flex h-11 w-11 items-center justify-center border-2 border-ink-900 text-ink-900">
                  <s.icon size={20} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* EARN MONEY */}
        <Section id="earn" className="bg-ground">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <Eyebrow>{tc('getStarted')}</Eyebrow>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{t('earn.title')}</h2>
              <p className="mt-3 text-lg text-ink-500">{t('earn.subtitle')}</p>
              <div className="mt-8 space-y-6">
                {earnPoints.map((p, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center text-ink-900">
                      <p.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-ink-900">{p.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-ink-500">{p.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/signup?role=participant" className="mt-8 inline-block">
                <Button size="lg" variant="primary" icon={<ArrowRight size={18} className="flip-rtl" />}>
                  {t('earn.cta')}
                </Button>
              </Link>
            </div>
            <div className="grid gap-4">
              {previewSurveys.map((s) => (
                <SurveyCard
                  key={s.id}
                  survey={s}
                  locale={locale}
                  categoryLabel={tCat(s.category)}
                  minLabel={tc('min')}
                  questionsLabel={tc('questions')}
                  ctaLabel={t('marketplace.startSurvey')}
                />
              ))}
            </div>
          </div>
        </Section>

        {/* FOR COMPANIES — knockout on ink, the mark's alternate ground. */}
        <Section id="companies">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="order-2 rounded-none border-2 border-ink-900 bg-ink-900 p-7 text-white lg:order-1">
              <p className="text-sm font-bold text-ink-300">Nova Retail Group</p>
              <h4 className="mt-1 text-xl font-bold">Saudi Consumer Shopping Habits</h4>
              <div className="mt-5 grid grid-cols-3 gap-px bg-white/15">
                <div className="bg-ink-900 p-3 text-center">
                  <p className="text-xl font-extrabold">1,000</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-ink-300">Target</p>
                </div>
                <div className="bg-ink-900 p-3 text-center">
                  <p className="text-xl font-extrabold">742</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-ink-300">Responses</p>
                </div>
                <div className="bg-ink-900 p-3 text-center">
                  <p className="text-xl font-extrabold">74%</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-ink-300">Complete</p>
                </div>
              </div>
              <div className="mt-5 h-2 w-full overflow-hidden bg-white/10">
                <div className="h-full w-[74%] bg-brand-500" />
              </div>
              <p className="mt-5 text-sm text-ink-300">Estimated eligible participants</p>
              <p className="text-2xl font-extrabold">24,500</p>
            </div>
            <div className="order-1 lg:order-2">
              <Eyebrow>{tNav('forCompanies')}</Eyebrow>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{t('companies.title')}</h2>
              <p className="mt-3 text-lg text-ink-500">{t('companies.subtitle')}</p>
              <div className="mt-8 space-y-6">
                {companyPoints.map((p, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center text-brand-500">
                      <p.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-ink-900">{p.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-ink-500">{p.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/signup?role=company" className="mt-8 inline-block">
                <Button size="lg" variant="primary" icon={<ArrowRight size={18} className="flip-rtl" />}>
                  {t('companies.cta')}
                </Button>
              </Link>
            </div>
          </div>
        </Section>

        {/* MARKETPLACE PREVIEW */}
        <Section className="bg-ground">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{t('marketplace.title')}</h2>
              <p className="mt-3 max-w-xl text-lg text-ink-500">{t('marketplace.subtitle')}</p>
            </div>
            <Link href="/signup?role=participant">
              <Button variant="outline">{tc('seeAll')}</Button>
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {db.surveys
              .filter((s) => s.status === 'active')
              .slice(0, 6)
              .map((s) => {
                const company = db.companies.find((c) => c.id === s.companyId);
                return (
                  <SurveyCard
                    key={s.id}
                    survey={s}
                    locale={locale}
                    companyName={company?.name}
                    categoryLabel={tCat(s.category)}
                    minLabel={tc('min')}
                    questionsLabel={tc('questions')}
                    ctaLabel={t('marketplace.startSurvey')}
                  />
                );
              })}
          </div>
        </Section>

        {/* WHY SURVPAY */}
        <Section>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{t('why.title')}</h2>
            <p className="mt-3 text-lg text-ink-500">{t('why.subtitle')}</p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((c, i) => (
              <div key={i} className="rounded-none border-2 border-ink-900 bg-paper p-6">
                <div className="flex h-10 w-10 items-center justify-center bg-ink-900 text-white">
                  <c.icon size={18} />
                </div>
                <h4 className="mt-4 font-bold text-ink-900">{c.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{c.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* TESTIMONIALS — knockout on ink. */}
        <Section className="bg-ink-900">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{t('testimonials.title')}</h2>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((tm, i) => (
              <div key={i} className="rounded-none border-2 border-white/20 p-6">
                <div className="flex gap-0.5 text-aqua-500">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-100">&ldquo;{tm.quote}&rdquo;</p>
                <p className="mt-5 text-sm font-bold text-white">{tm.name}</p>
                <p className="text-xs text-ink-400">{tm.role}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* FAQ */}
        <Section id="faq">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{t('faq.title')}</h2>
            <div className="mt-10 divide-y-2 divide-ink-900 rounded-none border-2 border-ink-900 bg-paper">
              {faqs.map((f, i) => (
                <details key={i} className="group px-6 py-5 open:bg-ink-50">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-ink-900">
                    {f.q}
                    <span className="ms-4 shrink-0 text-ink-400 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>

        {/* CTA — the last word, ink knockout. */}
        <Section className="bg-ink-900">
          <div className="flex flex-col items-center px-6 py-8 text-center">
            <h2 className="max-w-2xl text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{t('cta.title')}</h2>
            <p className="mt-4 max-w-xl text-balance text-lg text-ink-300">{t('cta.subtitle')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup?role=participant">
                <Button size="lg" variant="secondary" icon={<ArrowRight size={18} className="flip-rtl" />}>
                  {t('cta.primary')}
                </Button>
              </Link>
              <Link href="/signup?role=company">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  {t('cta.secondary')}
                </Button>
              </Link>
            </div>
          </div>
        </Section>

        {/* The closing device — purple, blue, aqua, ink at 1:1:1:3. Appears once. */}
        <div className="three-colour-bar h-1.5 w-full" />
      </main>
      <Footer />
    </>
  );
}
