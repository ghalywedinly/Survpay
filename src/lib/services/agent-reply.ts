import 'server-only';
import { Agent, AgentRole, Project } from '../types';

// Mock reply engine for the Studio chat. Keyword-matched, deterministic,
// offline templates per agent role — consistent with the rest of this repo's
// "no external services" mock backend. Swap this for a real LLM call (e.g.
// the Anthropic Messages API) when wiring Studio up to a real model; the
// call site (`services/studio.ts` -> `sendMessage`) is the only place that
// needs to change.

interface Rule {
  test: RegExp;
  reply: (project: string) => string;
}

const RULES_BY_ROLE: Record<AgentRole, Rule[]> = {
  design: [
    { test: /logo|brand|colou?r|palette/i, reply: (p) => `On it — I'll pull together a few directions for ${p}'s branding and share mockups here.` },
    { test: /mobile|responsive/i, reply: (p) => `Good catch. I'll audit ${p}'s key screens for responsive/mobile issues and list fixes.` },
    { test: /flow|ux|user experience|wireframe/i, reply: (p) => `I'll sketch the user flow for that and walk through the edge cases before we build it.` },
  ],
  coding: [
    { test: /bug|broken|error|crash/i, reply: (p) => `Thanks for flagging it — I'll reproduce the issue in ${p} and push a fix.` },
    { test: /deploy|ship|release/i, reply: () => `That's more of a Publishing Agent question — but I'll make sure the build is green before it goes out.` },
    { test: /feature|build|add|implement/i, reply: (p) => `Got it. I'll scope that feature for ${p}, break it into steps, and start on the first one.` },
    { test: /test|coverage/i, reply: (p) => `I'll add test coverage for that path in ${p} and report back what I find.` },
  ],
  publishing: [
    { test: /deploy|launch|live|go live|publish/i, reply: (p) => `I'll walk through the launch checklist for ${p} — domain, env vars, monitoring — and flag anything missing.` },
    { test: /domain|dns/i, reply: (p) => `I'll check ${p}'s domain/DNS setup and confirm it's pointed correctly before launch.` },
    { test: /cost|pricing|hosting/i, reply: (p) => `I'll put together a hosting cost estimate for ${p} based on expected traffic.` },
  ],
  general: [],
};

const GENERIC_FALLBACKS: Record<AgentRole, string[]> = {
  design: ["Noted — I'll factor that into the design work.", "Good point, I'll take a look and follow up with options."],
  coding: ["Got it, I'll dig into the code and get back to you.", "Makes sense — I'll pick that up next."],
  publishing: ["Noted — I'll fold that into the launch plan.", "Got it, checking that against the deployment setup now."],
  general: ["Got it, thanks for the update.", "Noted — I'll keep that in mind."],
};

let fallbackCursor = 0;

export function craftAgentReply(agent: Agent | undefined, project: Project | undefined, message: string): string {
  const role = agent?.role ?? 'general';
  const projectName = project?.name ?? 'the project';

  for (const rule of RULES_BY_ROLE[role]) {
    if (rule.test.test(message)) return rule.reply(projectName);
  }

  const fallbacks = GENERIC_FALLBACKS[role];
  const reply = fallbacks[fallbackCursor % fallbacks.length];
  fallbackCursor += 1;
  return reply;
}
