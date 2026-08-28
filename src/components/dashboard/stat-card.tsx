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
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-500">{label}</p>
        {/* Icons are ink by default, never filled, never in a coloured circle. */}
        {Icon && <Icon size={18} className={clsx('shrink-0', accent === 'brand' ? 'text-brand-500' : 'text-ink-400')} />}
      </div>
      <div className="mt-2.5 flex items-end gap-2">
        <p className="text-2xl font-extrabold tracking-tight text-ink-900">{value}</p>
        {suffix}
      </div>
      {trend && (
        <div className={clsx('mt-2 inline-flex items-center gap-1 text-xs font-bold', trend.positive ? 'text-aqua-800' : 'text-danger-600')}>
          {trend.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trend.value}
        </div>
      )}
    </div>
  );
}
