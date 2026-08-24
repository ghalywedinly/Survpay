'use client';

import { useState, useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { MoreHorizontal, Eye, Pause, Play, Copy, Download, Pencil } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { ListChecks } from 'lucide-react';
import { Survey, SurveyStatus, Locale } from '@/lib/types';
import { pick } from '@/lib/i18n-utils';
import { formatSar, formatNumber, formatDate } from '@/lib/format';
import { setSurveyStatusAction, duplicateSurveyAction } from '@/app/actions/company';
import { ProgressBar } from '@/components/ui/progress';

const STATUS_VARIANT: Record<SurveyStatus, 'success' | 'warning' | 'neutral' | 'info'> = {
  active: 'success',
  paused: 'warning',
  draft: 'neutral',
  completed: 'info',
};

function RowActions({ survey }: { survey: Survey }) {
  const t = useTranslations('companySurveys');
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative inline-block text-start">
      <button onClick={() => setOpen((o) => !o)} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700" disabled={isPending}>
        <MoreHorizontal size={17} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute end-0 top-8 z-50 w-44 rounded-xl border border-ink-100 bg-white p-1.5 shadow-2xl">
            <Link
              href={`/company/surveys/${survey.id}` as never}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
            >
              <Eye size={15} /> {t('actionView')}
            </Link>
            {survey.status === 'draft' && (
              <Link
                href={`/company/surveys/create?draft=${survey.id}` as never}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
              >
                <Pencil size={15} /> {t('actionEdit')}
              </Link>
            )}
            {survey.status === 'active' && (
              <button
                onClick={() => startTransition(async () => { await setSurveyStatusAction(survey.id, 'paused'); setOpen(false); })}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
              >
                <Pause size={15} /> {t('actionPause')}
              </button>
            )}
            {survey.status === 'paused' && (
              <button
                onClick={() => startTransition(async () => { await setSurveyStatusAction(survey.id, 'active'); setOpen(false); })}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
              >
                <Play size={15} /> {t('actionResume')}
              </button>
            )}
            <button
              onClick={() => startTransition(async () => { await duplicateSurveyAction(survey.id); setOpen(false); })}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
            >
              <Copy size={15} /> {t('actionDuplicate')}
            </button>
            <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100">
              <Download size={15} /> {t('actionExport')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function SurveysTable({ surveys }: { surveys: Survey[] }) {
  const t = useTranslations('companySurveys');
  const tStatus = useTranslations('surveyStatus');
  const locale = useLocale() as Locale;

  if (surveys.length === 0) {
    return <EmptyState icon={ListChecks} title={t('empty')} description={t('emptyBody')} />;
  }

  return (
    <div className="card !p-0">
      <Table>
        <Thead>
          <tr>
            <Th>{t('table.survey')}</Th>
            <Th>{t('table.status')}</Th>
            <Th>{t('table.responses')}</Th>
            <Th className="text-end">{t('table.spent')}</Th>
            <Th>{t('table.created')}</Th>
            <Th />
          </tr>
        </Thead>
        <Tbody>
          {surveys.map((s) => (
            <Tr key={s.id}>
              <Td className="max-w-[220px]">
                <Link href={`/company/surveys/${s.id}` as never} className="truncate font-semibold text-ink-900 hover:underline block">
                  {pick(s.title, locale)}
                </Link>
              </Td>
              <Td>
                <Badge variant={STATUS_VARIANT[s.status]}>{tStatus(s.status)}</Badge>
              </Td>
              <Td className="min-w-[140px]">
                <div className="flex items-center justify-between text-xs text-ink-500">
                  <span>
                    {formatNumber(s.responseCount, locale)}/{formatNumber(s.targetResponses, locale)}
                  </span>
                </div>
                <ProgressBar value={(s.responseCount / s.targetResponses) * 100} className="mt-1 w-28" />
              </Td>
              <Td className="text-end font-semibold">{formatSar(s.responseCount * s.costPerResponse, locale)}</Td>
              <Td className="whitespace-nowrap">{formatDate(s.createdAt, locale)}</Td>
              <Td>
                <RowActions survey={s} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}
