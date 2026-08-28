'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { PlusCircle } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/routing';
import { createProjectAction } from '@/app/actions/studio';

const EMPTY_FORM = { name: '', tagline: '', description: '', repoUrl: '', liveUrl: '', stack: '' };

export function NewProjectButton() {
  const t = useTranslations('studio');
  const tc = useTranslations('common');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function close() {
    setOpen(false);
    setForm(EMPTY_FORM);
    setError(null);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await createProjectAction(form);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      close();
      router.push(`/admin/projects/${res.projectId}` as never);
      router.refresh();
    });
  }

  return (
    <>
      <Button variant="secondary" icon={<PlusCircle size={16} />} onClick={() => setOpen(true)}>
        {t('newProject')}
      </Button>
      <Modal open={open} onClose={close} title={t('newProjectTitle')} size="lg">
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label={t('name')}
            placeholder={t('namePlaceholder')}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            label={t('tagline')}
            placeholder={t('taglinePlaceholder')}
            value={form.tagline}
            onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
            required
          />
          <Textarea
            label={t('description')}
            placeholder={t('descriptionPlaceholder')}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={t('repoUrl')}
              placeholder="https://github.com/…"
              value={form.repoUrl}
              onChange={(e) => setForm((f) => ({ ...f, repoUrl: e.target.value }))}
            />
            <Input
              label={t('liveUrl')}
              placeholder="https://…"
              value={form.liveUrl}
              onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
            />
          </div>
          <Input
            label={t('stack')}
            hint={t('stackHint')}
            value={form.stack}
            onChange={(e) => setForm((f) => ({ ...f, stack: e.target.value }))}
          />

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={close}>
              {tc('cancel')}
            </Button>
            <Button type="submit" loading={isPending}>
              {isPending ? t('creating') : t('create')}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
