import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getProject, listAgents, listMessages } from '@/lib/services/studio';
import { StageTracker } from '@/components/studio/stage-tracker';
import { AgentChat } from '@/components/studio/agent-chat';
import { AgentMessage } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);
  if (!project) notFound();

  const t = await getTranslations('studio');
  const agents = await listAgents(project.id);
  const messagesByAgent: Record<string, AgentMessage[]> = {};
  await Promise.all(
    agents.map(async (agent) => {
      messagesByAgent[agent.id] = await listMessages(project.id, agent.id);
    })
  );

  return (
    <div className="container-app py-8">
      <Link href="/admin/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900">
        <ArrowLeft size={15} className="flip-rtl" /> {t('backToProjects')}
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-extrabold text-white"
            style={{ backgroundColor: project.color }}
          >
            {project.name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{project.name}</h1>
            <p className="mt-0.5 text-sm text-ink-500">{project.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50"
            >
              <Github size={15} /> {t('repository')}
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50"
            >
              <ExternalLink size={15} /> {t('liveSite')}
            </a>
          )}
        </div>
      </div>

      {project.description && <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-600">{project.description}</p>}

      {project.stack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="rounded-md bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-600">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6">
        <StageTracker project={project} />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-base font-bold text-ink-900">{t('agentsTitle')}</h2>
        <AgentChat projectId={project.id} agents={agents} messagesByAgent={messagesByAgent} />
      </div>
    </div>
  );
}
