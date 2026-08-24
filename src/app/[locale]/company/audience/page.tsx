import { getTranslations, getLocale } from 'next-intl/server';
import { Users2 } from 'lucide-react';
import { getDb } from '@/lib/data/store';
import { BarList } from '@/components/dashboard/bar-list';
import { formatNumber } from '@/lib/format';
import { Locale } from '@/lib/types';

export default async function CompanyAudiencePage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('companyAudience');
  const tCity = await getTranslations('cities');
  const tGender = await getTranslations('gender');
  const tIncome = await getTranslations('income');
  const tInterest = await getTranslations('interests');

  const db = await getDb();
  const participants = db.participants;

  function tally<T extends string>(items: T[]): Record<string, number> {
    const out: Record<string, number> = {};
    items.forEach((v) => {
      out[v] = (out[v] || 0) + 1;
    });
    return out;
  }

  const byCity = tally(participants.map((p) => p.city));
  const byGender = tally(participants.map((p) => p.gender));
  const byIncome = tally(participants.map((p) => p.incomeRange));
  const byInterest = tally(participants.flatMap((p) => p.interests));

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>

      <div className="mt-6 card flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
          <Users2 size={22} />
        </span>
        <div>
          <p className="text-xs font-medium text-ink-500">{t('totalParticipants')}</p>
          <p className="text-2xl font-extrabold text-ink-900">{formatNumber(participants.length, locale)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('byCity')}</h3>
          <BarList data={Object.entries(byCity).map(([k, v]) => ({ key: k, value: v }))} formatLabel={(k) => tCity(k as never)} color="#3229f2" />
        </div>
        <div className="card">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('byGender')}</h3>
          <BarList data={Object.entries(byGender).map(([k, v]) => ({ key: k, value: v }))} formatLabel={(k) => tGender(k as never)} color="#b32be0" />
        </div>
        <div className="card">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('byIncome')}</h3>
          <BarList data={Object.entries(byIncome).map(([k, v]) => ({ key: k, value: v }))} formatLabel={(k) => tIncome(k as never)} color="#12b35e" />
        </div>
        <div className="card">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('byInterest')}</h3>
          <BarList data={Object.entries(byInterest).map(([k, v]) => ({ key: k, value: v }))} formatLabel={(k) => tInterest(k as never)} color="#12e5da" />
        </div>
      </div>
    </div>
  );
}
