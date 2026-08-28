import 'server-only';
import { getDb } from '../data/store';
import { nextId } from '../data/ids';
import { PROJECT_STAGE_ORDER } from '../constants';
import { Project, ProjectStageKey, ProjectStageStatus, Agent, AgentMessage, AgentRole } from '../types';
import { craftAgentReply } from './agent-reply';

export async function listProjects() {
  const db = await getDb();
  return [...db.projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getProject(id: string) {
  const db = await getDb();
  return db.projects.find((p) => p.id === id) ?? null;
}

export async function listAgents(projectId: string) {
  const db = await getDb();
  return db.agents.filter((a) => a.projectId === projectId);
}

export async function listMessages(projectId: string, agentId: string) {
  const db = await getDb();
  return db.agentMessages
    .filter((m) => m.projectId === projectId && m.agentId === agentId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

const AGENT_ROLE_SEEDS: { role: AgentRole; name: string; color: string; description: string }[] = [
  { role: 'design', name: 'Design Agent', color: '#b32be0', description: 'Brand, UI/UX, and visual design.' },
  { role: 'coding', name: 'Coding Agent', color: '#3229f2', description: 'Builds and ships features.' },
  { role: 'publishing', name: 'Publishing Agent', color: '#12b35e', description: 'Deployment and launch.' },
];

export async function createProject(input: {
  name: string;
  tagline: string;
  description: string;
  color: string;
  repoUrl?: string;
  liveUrl?: string;
  stack: string[];
}) {
  const db = await getDb();
  const now = new Date().toISOString();
  const project: Project = {
    id: nextId('project'),
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    color: input.color,
    repoUrl: input.repoUrl,
    liveUrl: input.liveUrl,
    stack: input.stack,
    stages: PROJECT_STAGE_ORDER.map((key) => ({ key, status: 'not_started' as ProjectStageStatus, updatedAt: now })),
    createdAt: now,
  };
  db.projects.unshift(project);

  for (const seed of AGENT_ROLE_SEEDS) {
    const agent: Agent = {
      id: nextId('agent'),
      projectId: project.id,
      role: seed.role,
      name: seed.name,
      color: seed.color,
      description: seed.description,
    };
    db.agents.push(agent);
    const welcome: AgentMessage = {
      id: nextId('msg'),
      projectId: project.id,
      agentId: agent.id,
      sender: 'agent',
      content: `Hey! I'm the ${seed.name} for ${project.name}. Ask me anything and I'll help out.`,
      createdAt: now,
    };
    db.agentMessages.push(welcome);
  }

  return project;
}

export async function updateStageStatus(projectId: string, stage: ProjectStageKey, status: ProjectStageStatus) {
  const db = await getDb();
  const project = db.projects.find((p) => p.id === projectId);
  if (!project) return null;
  const target = project.stages.find((s) => s.key === stage);
  if (!target) return null;
  target.status = status;
  target.updatedAt = new Date().toISOString();
  return project;
}

export async function sendMessage(projectId: string, agentId: string, content: string) {
  const db = await getDb();
  const project = db.projects.find((p) => p.id === projectId);
  const agent = db.agents.find((a) => a.id === agentId && a.projectId === projectId);
  if (!project || !agent) return null;

  const now = Date.now();
  const userMessage: AgentMessage = {
    id: nextId('msg'),
    projectId,
    agentId,
    sender: 'user',
    content,
    createdAt: new Date(now).toISOString(),
  };
  db.agentMessages.push(userMessage);

  const agentMessage: AgentMessage = {
    id: nextId('msg'),
    projectId,
    agentId,
    sender: 'agent',
    content: craftAgentReply(agent, project, content),
    createdAt: new Date(now + 400).toISOString(),
  };
  db.agentMessages.push(agentMessage);

  return { userMessage, agentMessage };
}
