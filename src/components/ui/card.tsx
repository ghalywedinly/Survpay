import { clsx } from 'clsx';

export function Card({
  children,
  className,
  as: Comp = 'div',
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  padded?: boolean;
}) {
  return (
    <Comp className={clsx('card', padded && 'p-5 sm:p-6', className)}>{children}</Comp>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('mb-4 flex items-start justify-between gap-4', className)}>
      <div>
        <h3 className="text-base font-bold text-ink-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
