import { clsx } from 'clsx';

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand';

const STYLES: Record<BadgeVariant, string> = {
  neutral: 'bg-ink-100 text-ink-700',
  success: 'bg-aqua-100 text-aqua-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-danger-100 text-danger-700',
  info: 'bg-signal-100 text-signal-700',
  brand: 'bg-brand-100 text-brand-700',
};

export function Badge({
  children,
  variant = 'neutral',
  className,
  dot,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide',
        STYLES[variant],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
