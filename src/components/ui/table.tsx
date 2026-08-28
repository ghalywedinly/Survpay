import { clsx } from 'clsx';

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="scrollbar-thin -mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
      <table className={clsx('w-full min-w-[640px] border-collapse text-sm', className)}>{children}</table>
    </div>
  );
}

export function Thead({ children }: { children: React.ReactNode }) {
  return <thead className="border-b-2 border-ink-900 text-start text-xs font-bold uppercase tracking-wide text-ink-500">{children}</thead>;
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={clsx('py-3 pe-4 text-start font-bold', className)}>{children}</th>;
}

export function Tbody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-ink-100">{children}</tbody>;
}

export function Tr({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={clsx('transition-colors hover:bg-ink-50', className)}>{children}</tr>;
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={clsx('py-3.5 pe-4 align-middle text-ink-700', className)}>{children}</td>;
}
