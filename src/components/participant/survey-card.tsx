import { Clock, ListChecks, ArrowRight } from 'lucide-react';
import { Survey, Locale } from '@/lib/types';
import { pick } from '@/lib/i18n-utils';
import { CATEGORY_META } from '@/lib/constants';
import { formatSar } from '@/lib/format';
import { Badge } from '@/components/ui/badge';

export function SurveyCard({
  survey,
  locale,
  companyName,
  categoryLabel,
  minLabel,
  questionsLabel,
  ctaLabel,
  href,
  as,
}: {
  survey: Survey;
  locale: Locale;
  companyName?: string;
  categoryLabel: string;
  minLabel: string;
  questionsLabel: string;
  ctaLabel: string;
  href?: string;
  as?: React.ElementType;
}) {
  const meta = CATEGORY_META[survey.category];
  const Icon = meta.icon;
  const Comp = as || 'div';

  const card = (
    <Comp
      {...(href ? { href } : {})}
      className="group flex h-full flex-col rounded-none border-2 border-ink-900 bg-paper p-5 transition-colors hover:bg-ink-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Icon size={18} className="shrink-0 text-ink-400" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-400">{categoryLabel}</p>
            {companyName && <p className="text-xs font-medium text-ink-400">{companyName}</p>}
          </div>
        </div>
        <Badge variant="brand">{formatSar(survey.rewardPerResponse, locale)}</Badge>
      </div>

      <h3 className="mt-4 line-clamp-2 text-base font-bold leading-snug text-ink-900">{pick(survey.title, locale)}</h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">{pick(survey.description, locale)}</p>

      <div className="mt-4 flex items-center gap-4 text-xs font-medium text-ink-400">
        <span className="inline-flex items-center gap-1.5">
          <Clock size={14} /> {survey.estimatedMinutes} {minLabel}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ListChecks size={14} /> {survey.questions.length} {questionsLabel}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t-2 border-ink-900 pt-4">
        <span className="text-sm font-bold text-aqua-800">{formatSar(survey.rewardPerResponse, locale)}</span>
        <span className="inline-flex items-center gap-1 text-sm font-bold text-ink-900 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
          {ctaLabel} <ArrowRight size={15} className="flip-rtl" />
        </span>
      </div>
    </Comp>
  );

  return card;
}
