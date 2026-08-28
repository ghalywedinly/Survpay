'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Select } from '@/components/ui/input';
import { useRouter } from '@/i18n/routing';
import { PROJECT_STAGE_ORDER, PROJECT_STAGE_META } from '@/lib/constants';
import { Project, ProjectStageKey, ProjectStageStatus } from '@/lib/types';
import { updateStageAction } from '@/app/actions/studio';

const STATUSES: ProjectStageStatus[] = ['not_started', 'in_progress', 'done'];

export function StageTracker({ project }: { project: Project }) {
  const t = useTranslations('studio');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const stageLabel: Record<ProjectStageKey, string> = {
    design: t('stageDesign'),
    coding: t('stageCoding'),
    publishing: t('stagePublishing'),
  };
  const statusLabel: Record<ProjectStageStatus, string> = {
    not_started: t('statusNotStarted'),
    in_progress: t('statusInProgress'),
    done: t('statusDone'),
  };

  function onChange(stage: ProjectStageKey, status: ProjectStageStatus) {
    startTransition(async () => {
      await updateStageAction(project.id, stage, status);
      router.refresh();
    });
  }

  return (
    <div className="card">
      <div className="grid gap-3 sm:grid-cols-3">
        {PROJECT_STAGE_ORDER.map((key) => {
          const meta = PROJECT_STAGE_META[key];
          const Icon = meta.icon;
          const stage = project.stages.find((s) => s.key === key);
          return (
            <div key={key} className="rounded-xl border border-ink-100 p-4">
              <div className="flex items-center gap-2">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
                >
                  <Icon size={16} />
                </span>
                <span className="text-sm font-bold text-ink-900">{stageLabel[key]}</span>
              </div>
              <div className="mt-3">
                <Select
                  value={stage?.status ?? 'not_started'}
                  disabled={isPending}
                  onChange={(e) => onChange(key, e.target.value as ProjectStageStatus)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {statusLabel[s]}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
