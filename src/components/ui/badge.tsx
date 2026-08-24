import { clsx } from 'clsx';

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand';

const STYLES: Record<BadgeVariant, string> = {
  neutral: 'bg-ink-100 text-ink-700',
  success: 'bg-money-100 text-money-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-sky-100 text-sky-700',
  brand: 'bg-brand-100 text-brand-800',
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
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        STYLES[variant],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
