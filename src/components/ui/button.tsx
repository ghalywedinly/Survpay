import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-ink-900 text-white hover:bg-ink-800 shadow-soft focus-visible:ring-ink-900',
  secondary:
    'bg-brand-gradient text-white shadow-glow hover:opacity-95 focus-visible:ring-brand-500',
  outline:
    'border border-ink-200 bg-white text-ink-800 hover:bg-ink-50 focus-visible:ring-ink-300',
  ghost: 'text-ink-700 hover:bg-ink-100 focus-visible:ring-ink-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400',
  success: 'bg-money-600 text-white hover:bg-money-700 focus-visible:ring-money-400 shadow-soft',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm rounded-lg gap-1.5',
  md: 'h-11 px-5 text-sm rounded-xl gap-2',
  lg: 'h-13 px-7 text-base rounded-xl gap-2',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', loading, fullWidth, icon, disabled, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center whitespace-nowrap font-semibold transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'active:scale-[0.98]',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : icon}
      {children}
    </button>
  );
});
