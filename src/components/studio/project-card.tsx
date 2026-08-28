import { getTranslations, getLocale } from 'next-intl/server';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { PROJECT_STAGE_ORDER } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { Project, Locale, ProjectStageStatus } from '@/lib/types';

const STATUS_VARIANT: Record<ProjectStageStatus, 'neutral' | 'warning' | 'success'> = {
  not_started: 'neutral',
  in_progress: 'warning',
  done: 'success',
};

export async function ProjectCard({ project }: { project: Project }) {
  const t = await getTranslations('studio');
  const locale = (await getLocale()) as Locale;

  const stageLabel: Record<string, string> = {
    design: t('stageDesign'),
    coding: t('stageCoding'),
    publishing: t('stagePublishing'),
  };
  const statusLabel: Record<ProjectStageStatus, string> = {
    not_started: t('statusNotStarted'),
    in_progress: t('statusInProgress'),
    done: t('statusDone'),
  };

  return (
    <Link
      href={`/admin/projects/${project.id}` as never}
      className="group flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-extrabold text-white"
            style={{ backgroundColor: project.color }}
          >
            {project.name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <h3 className="text-base font-bold text-ink-900">{project.name}</h3>
            <p className="text-xs text-ink-500">{project.tagline}</p>
          </div>
        </div>
        <ArrowUpRight
          size={16}
          className="flip-rtl mt-1 shrink-0 text-ink-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {PROJECT_STAGE_ORDER.map((key) => {
          const status = project.stages.find((s) => s.key === key)?.status ?? 'not_started';
          return (
            <Badge key={key} variant={STATUS_VARIANT[status]} dot>
              {stageLabel[key]} · {statusLabel[status]}
            </Badge>
          );
        })}
      </div>

      {project.stack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((s) => (
            <span key={s} className="rounded-md bg-ink-50 px-2 py-0.5 text-xs font-medium text-ink-500">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
        <span className="text-xs text-ink-400">{t('addedOn', { date: formatDate(project.createdAt, locale) })}</span>
        <div className="flex items-center gap-2 text-ink-400">
          {project.repoUrl && <Github size={14} />}
          {project.liveUrl && <ExternalLink size={14} />}
        </div>
      </div>
    </Link>
  );
}
