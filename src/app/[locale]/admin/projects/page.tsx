import { getTranslations } from 'next-intl/server';
import { Rocket } from 'lucide-react';
import { listProjects } from '@/lib/services/studio';
import { ProjectCard } from '@/components/studio/project-card';
import { NewProjectButton } from '@/components/studio/new-project-modal';
import { EmptyState } from '@/components/ui/empty-state';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const t = await getTranslations('studio');
  const projects = await listProjects();

  return (
    <div className="container-app py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-500">{t('subtitle')}</p>
        </div>
        <NewProjectButton />
      </div>

      {projects.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={Rocket} title={t('emptyTitle')} description={t('emptyDescription')} action={<NewProjectButton />} />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
