'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import * as studio from '@/lib/services/studio';
import { ProjectStageKey, ProjectStageStatus } from '@/lib/types';

const PROJECT_COLORS = ['#3229f2', '#b32be0', '#12b35e', '#12e5da', '#8636e8', '#f59e0b'];
let colorCursor = 0;

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') return null;
  return session;
}

const createProjectSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(60),
  tagline: z.string().trim().min(2, 'Tagline is required').max(120),
  description: z.string().trim().max(600).optional().default(''),
  repoUrl: z.string().trim().url('Enter a valid URL').optional().or(z.literal('')),
  liveUrl: z.string().trim().url('Enter a valid URL').optional().or(z.literal('')),
  stack: z.string().trim().optional().default(''),
});

export async function createProjectAction(input: {
  name: string;
  tagline: string;
  description?: string;
  repoUrl?: string;
  liveUrl?: string;
  stack?: string;
}) {
  const session = await requireAdmin();
  if (!session) return { ok: false as const, error: 'Unauthorized' };

  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const stack = parsed.data.stack
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const color = PROJECT_COLORS[colorCursor % PROJECT_COLORS.length];
  colorCursor += 1;

  const project = await studio.createProject({
    name: parsed.data.name,
    tagline: parsed.data.tagline,
    description: parsed.data.description,
    repoUrl: parsed.data.repoUrl || undefined,
    liveUrl: parsed.data.liveUrl || undefined,
    stack,
    color,
  });

  revalidatePath('/[locale]/admin/projects', 'page');
  return { ok: true as const, projectId: project.id };
}

export async function updateStageAction(projectId: string, stage: ProjectStageKey, status: ProjectStageStatus) {
  const session = await requireAdmin();
  if (!session) return { ok: false as const, error: 'Unauthorized' };

  const result = await studio.updateStageStatus(projectId, stage, status);
  if (!result) return { ok: false as const, error: 'Project not found' };

  revalidatePath('/[locale]/admin/projects/[id]', 'page');
  revalidatePath('/[locale]/admin/projects', 'page');
  return { ok: true as const };
}

export async function sendAgentMessageAction(projectId: string, agentId: string, content: string) {
  const session = await requireAdmin();
  if (!session) return { ok: false as const, error: 'Unauthorized' };

  const text = content.trim();
  if (!text) return { ok: false as const, error: 'Message is empty' };

  const result = await studio.sendMessage(projectId, agentId, text);
  if (!result) return { ok: false as const, error: 'Conversation not found' };

  revalidatePath('/[locale]/admin/projects/[id]', 'page');
  return { ok: true as const, ...result };
}
