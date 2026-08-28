'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Send } from 'lucide-react';
import { clsx } from 'clsx';
import { Avatar } from '@/components/ui/avatar';
import { Agent, AgentMessage, Locale } from '@/lib/types';
import { sendAgentMessageAction } from '@/app/actions/studio';
import { timeAgo } from '@/lib/format';

export function AgentChat({
  projectId,
  agents,
  messagesByAgent,
}: {
  projectId: string;
  agents: Agent[];
  messagesByAgent: Record<string, AgentMessage[]>;
}) {
  const t = useTranslations('studio');
  const locale = useLocale() as Locale;
  const [activeAgentId, setActiveAgentId] = useState(agents[0]?.id ?? '');
  const [messages, setMessages] = useState(messagesByAgent);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);

  const activeAgent = agents.find((a) => a.id === activeAgentId);
  const activeMessages = messages[activeAgentId] ?? [];

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeMessages.length, activeAgentId]);

  function onSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    const agentId = activeAgent?.id;
    if (!text || !agentId) return;
    setInput('');
    startTransition(async () => {
      const res = await sendAgentMessageAction(projectId, agentId, text);
      if (res.ok) {
        setMessages((prev) => ({
          ...prev,
          [agentId]: [...(prev[agentId] ?? []), res.userMessage, res.agentMessage],
        }));
      }
    });
  }

  if (agents.length === 0) return null;

  return (
    <div className="card flex h-[32rem] flex-col !p-0">
      <div className="scrollbar-thin flex gap-2 overflow-x-auto border-b border-ink-100 p-3">
        {agents.map((agent) => (
          <button
            key={agent.id}
            type="button"
            onClick={() => setActiveAgentId(agent.id)}
            className={clsx(
              'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
              agent.id === activeAgentId ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100'
            )}
          >
            <Avatar name={agent.name} color={agent.color} size={22} />
            {agent.name}
          </button>
        ))}
      </div>

      <div ref={listRef} className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4">
        {activeMessages.map((m) => (
          <div key={m.id} className={clsx('flex items-end gap-2', m.sender === 'user' && 'flex-row-reverse')}>
            <Avatar
              name={m.sender === 'user' ? t('you') : activeAgent?.name ?? ''}
              color={m.sender === 'user' ? '#181b35' : activeAgent?.color}
              size={28}
            />
            <div
              className={clsx(
                'max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm',
                m.sender === 'user' ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-800'
              )}
            >
              <p className="leading-relaxed">{m.content}</p>
              <p
                className={clsx('mt-1 text-[10px] font-medium', m.sender === 'user' ? 'text-white/60' : 'text-ink-400')}
                suppressHydrationWarning
              >
                {timeAgo(m.createdAt, locale)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={onSend} className="flex items-center gap-2 border-t border-ink-100 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('messagePlaceholder')}
          className="h-11 flex-1 rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
        />
        <button
          type="submit"
          disabled={isPending || !input.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-white transition-opacity disabled:opacity-50"
        >
          <Send size={16} className="flip-rtl" />
        </button>
      </form>
    </div>
  );
}
