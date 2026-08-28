import { clsx } from 'clsx';

// The Survpay mark: three solid capsules building one S — a response
// entering (aqua), the brand voice (purple), a payout leaving (blue).
// Drawn as one continuous stroked path so the three segments always align,
// split into discrete (non-gradient) colour bands via stroke-dasharray —
// each band gets its own rounded capsule cap where it meets the next,
// per the identity's "no gradient, no blend" misuse rule.
const S_PATH = 'M 74 18 C 46 18 42 40 58 48 C 76 57 72 82 34 82';
const STROKE = 21;

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <path d={S_PATH} pathLength={100} stroke="#65E8E5" strokeWidth={STROKE} strokeLinecap="round" strokeDasharray="25 75" strokeDashoffset="0" />
      <path d={S_PATH} pathLength={100} stroke="#AA52F7" strokeWidth={STROKE} strokeLinecap="round" strokeDasharray="50 50" strokeDashoffset="-25" />
      <path d={S_PATH} pathLength={100} stroke="#054CF6" strokeWidth={STROKE} strokeLinecap="round" strokeDasharray="25 75" strokeDashoffset="-75" />
    </svg>
  );
}

// Single-ink variants for knockout / mono use (page feet, watermarks,
// stationery on ink or purple grounds) — see "Logo · lockups" variations.
export function LogoMarkMono({ size = 32, className, color = '#14121C' }: { size?: number; className?: string; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <path d={S_PATH} stroke={color} strokeWidth={STROKE} strokeLinecap="round" />
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
    <span className={clsx('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} />
      {showWordmark && (
        <span
          className={clsx('text-xl font-extrabold tracking-tight text-ink-900', wordmarkClassName)}
          style={{ fontFamily: 'Archivo, ui-sans-serif, system-ui, sans-serif' }}
        >
          Survpay
        </span>
      )}
    </span>
  );
}
