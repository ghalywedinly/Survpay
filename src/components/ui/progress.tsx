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
  /** Brand-accent (purple) progress — profile completion, survey progress.
   * Otherwise the default "quota fill" blue. */
  gradient?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={clsx('h-2 w-full overflow-hidden rounded-none bg-ink-100', trackClassName, className)}>
      <div
        className={clsx('h-full transition-all duration-500 ease-out', gradient ? 'bg-brand-500' : 'bg-signal-500', barClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/** The "response scale" motif — five blocks, one ramp, light to dark.
 * Doubles as a rating display, a loading state, and a bullet. */
export function ResponseScale({
  filled,
  total = 5,
  size = 'md',
  className,
}: {
  filled: number;
  total?: number;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const cellClass = size === 'sm' ? 'h-2 w-4' : 'h-2.5 w-6';
  return (
    <div className={clsx('flex gap-1', className)}>
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const active = step <= filled;
        // Light-to-dark purple ramp across the filled blocks.
        const shade = ['bg-brand-200', 'bg-brand-300', 'bg-brand-400', 'bg-brand-500', 'bg-brand-600'][
          Math.min(step - 1, 4)
        ];
        return <span key={i} className={clsx(cellClass, active ? shade : 'bg-ink-100')} />;
      })}
    </div>
  );
}
