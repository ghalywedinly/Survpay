import { clsx } from 'clsx';

export function ProgressBar({
  value,
  className,
  trackClassName,
  barClassName,
  gradient = false,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
  gradient?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={clsx('h-2 w-full overflow-hidden rounded-full bg-ink-100', trackClassName, className)}>
      <div
        className={clsx(
          'h-full rounded-full transition-all duration-500 ease-out',
          gradient ? 'bg-brand-gradient' : 'bg-money-500',
          barClassName
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
