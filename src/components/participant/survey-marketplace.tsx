'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Survey, Locale, SurveyCategory } from '@/lib/types';
import { SurveyCard } from './survey-card';
import { Input, Select } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { ListChecks } from 'lucide-react';
import { SURVEY_CATEGORIES } from '@/lib/constants';

type SortKey = 'recommended' | 'reward' | 'time' | 'newest';

export function SurveyMarketplace({
  surveys,
  locale,
  companyNames,
}: {
  surveys: Survey[];
  locale: Locale;
  companyNames: Record<string, string>;
}) {
  const t = useTranslations('participantSurveys');
  const tCat = useTranslations('categories');
  const tc = useTranslations('common');
  const tSurvey = useTranslations('surveyCard');

  const [sort, setSort] = useState<SortKey>('recommended');
  const [category, setCategory] = useState<SurveyCategory | 'all'>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let list = [...surveys];
    if (category !== 'all') list = list.filter((s) => s.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((s) => s.title.en.toLowerCase().includes(q) || s.title.ar.includes(q) || s.description.en.toLowerCase().includes(q));
    }
    switch (sort) {
      case 'reward':
        list.sort((a, b) => b.rewardPerResponse - a.rewardPerResponse);
        break;
      case 'time':
        list.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        list.sort((a, b) => b.rewardPerResponse / b.estimatedMinutes - a.rewardPerResponse / a.estimatedMinutes);
    }
    return list;
  }, [surveys, sort, category, query]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leadingIcon={<Search size={16} />}
          placeholder={t('searchPlaceholder')}
          className="sm:max-w-xs"
        />
        <Select value={category} onChange={(e) => setCategory(e.target.value as SurveyCategory | 'all')} className="sm:w-48">
          <option value="all">{tc('all')}</option>
          {SURVEY_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {tCat(c)}
            </option>
          ))}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="sm:w-56">
          <option value="recommended">{t('sortRecommended')}</option>
          <option value="reward">{t('sortHighestReward')}</option>
          <option value="time">{t('sortShortestTime')}</option>
          <option value="newest">{t('sortNewest')}</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={ListChecks} title={tc('noResults')} />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <Link key={s.id} href={`/participant/surveys/${s.id}` as never}>
              <SurveyCard
                survey={s}
                locale={locale}
                companyName={companyNames[s.companyId]}
                categoryLabel={tCat(s.category)}
                minLabel={tc('min')}
                questionsLabel={tc('questions')}
                ctaLabel={tSurvey('startSurvey')}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
