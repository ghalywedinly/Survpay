import { clsx } from 'clsx';
import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = 'default',
  suffix,
}: {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  trend?: { value: string; positive: boolean };
  accent?: 'default' | 'money' | 'brand';
  suffix?: React.ReactNode;
}) {
  const iconWrap =
    accent === 'money'
      ? 'bg-money-100 text-money-700'
      : accent === 'brand'
      ? 'bg-brand-100 text-brand-700'
      : 'bg-ink-100 text-ink-600';

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-ink-500">{label}</p>
        {Icon && (
          <span className={clsx('flex h-9 w-9 items-center justify-center rounded-xl', iconWrap)}>
            <Icon size={18} />
          </span>
        )}
      </div>
      <div className="mt-2 flex items-end gap-2">
        <p className="text-2xl font-extrabold tracking-tight text-ink-900">{value}</p>
        {suffix}
      </div>
      {trend && (
        <div
          className={clsx(
            'mt-2 inline-flex items-center gap-1 text-xs font-semibold',
            trend.positive ? 'text-money-600' : 'text-red-500'
          )}
        >
          {trend.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trend.value}
        </div>
      )}
    </div>
  );
}
