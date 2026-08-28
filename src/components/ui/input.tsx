import { clsx } from 'clsx';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leadingIcon?: React.ReactNode;
  trailingSlot?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, error, hint, leadingIcon, trailingSlot, id, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-bold text-ink-700">
          {label}
        </label>
      )}
      <div className="relative">
        {leadingIcon && (
          <span className="pointer-events-none absolute inset-y-0 start-3.5 flex items-center text-ink-400">
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'h-11 w-full rounded-none border-2 bg-paper px-3.5 text-sm text-ink-900 placeholder:text-ink-400',
            'transition-colors focus:outline-none',
            error ? 'border-danger-500 focus:border-danger-500' : 'border-ink-200 focus:border-ink-900',
            leadingIcon && 'ps-10',
            trailingSlot && 'pe-10',
            className
          )}
          {...props}
        />
        {trailingSlot && (
          <span className="absolute inset-y-0 end-3.5 flex items-center text-ink-400">{trailingSlot}</span>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-bold text-danger-600">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
    </div>
  );
});

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, label, error, hint, id, children, ...props },
  ref
) {
  const selectId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-bold text-ink-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={clsx(
          'h-11 w-full rounded-none border-2 bg-paper px-3.5 text-sm text-ink-900',
          'transition-colors focus:outline-none appearance-none',
          error ? 'border-danger-500' : 'border-ink-200 focus:border-ink-900',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs font-bold text-danger-600">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
    </div>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }>(
  function Textarea({ className, label, id, ...props }, ref) {
    const areaId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={areaId} className="mb-1.5 block text-sm font-bold text-ink-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          className={clsx(
            'w-full rounded-none border-2 border-ink-200 bg-paper px-3.5 py-3 text-sm text-ink-900 placeholder:text-ink-400',
            'transition-colors focus:outline-none focus:border-ink-900',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
