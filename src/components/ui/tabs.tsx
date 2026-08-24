'use client';

import { clsx } from 'clsx';

export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { value: string; label: string; count?: number }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={clsx('scrollbar-thin flex gap-1 overflow-x-auto rounded-xl bg-ink-100 p-1', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={clsx(
            'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors',
            value === tab.value ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-800'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={clsx(
                'rounded-full px-1.5 py-0.5 text-xs',
                value === tab.value ? 'bg-ink-100 text-ink-600' : 'bg-ink-200/70 text-ink-500'
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
