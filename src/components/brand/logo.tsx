import { clsx } from 'clsx';

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  const id = 'survpay-grad';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="78" y1="10" x2="24" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#12e5da" />
          <stop offset="0.52" stopColor="#b32be0" />
          <stop offset="1" stopColor="#3229f2" />
        </linearGradient>
      </defs>
      <path
        d="M72 18 C 44 18, 40 40, 56 48 C 74 57, 70 82, 32 82"
        stroke={`url(#${id})`}
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({
  size = 28,
  showWordmark = true,
  className,
  wordmarkClassName,
}: {
  size?: number;
  showWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={clsx('inline-flex items-center gap-2', className)}>
      <LogoMark size={size} />
      {showWordmark && (
        <span
          className={clsx('font-sans text-xl font-extrabold tracking-tight', wordmarkClassName)}
          style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
        >
          Survpay
        </span>
      )}
    </span>
  );
}
