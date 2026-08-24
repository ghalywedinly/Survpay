export function BarList({
  data,
  color = '#8636e8',
  formatLabel,
  formatValue,
}: {
  data: { key: string; value: number }[];
  color?: string;
  formatLabel?: (key: string) => string;
  formatValue?: (value: number) => string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const sorted = [...data].sort((a, b) => b.value - a.value);

  if (sorted.length === 0) return <p className="text-sm text-ink-400">—</p>;

  return (
    <div className="space-y-3">
      {sorted.map((d) => (
        <div key={d.key}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-ink-700">{formatLabel ? formatLabel(d.key) : d.key}</span>
            <span className="font-bold text-ink-900">{formatValue ? formatValue(d.value) : d.value}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(d.value / max) * 100}%`, backgroundColor: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}
