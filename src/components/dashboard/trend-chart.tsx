'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLocale } from 'next-intl';
import { Locale } from '@/lib/types';
import { formatDate, formatNumber } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';

// Data language: flush left, 2px baseline, zero radius, no gridlines, no
// decoration. Series colour default is Signal Blue; the most recent points
// can be called out in Survpay Purple (never a third colour on one chart).
export function TrendChart({
  data,
  color = '#054CF6',
  highlightColor = '#AA52F7',
  highlightLastN = 0,
  valueLabel,
}: {
  data: { date: string; count: number }[];
  color?: string;
  highlightColor?: string;
  highlightLastN?: number;
  valueLabel?: string;
}) {
  const locale = useLocale() as Locale;
  // Recharts measures the container via the DOM, which isn't available
  // during SSR — render a placeholder until mounted to avoid a hydration
  // mismatch, then swap in the real chart client-side only.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="h-64 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 4, left: -20, bottom: 0 }} barCategoryGap="18%">
          <XAxis
            dataKey="date"
            tickFormatter={(d) => formatDate(d, locale).split(',')[0]}
            tick={{ fontSize: 11, fill: '#8c83af' }}
            axisLine={{ stroke: '#14121C', strokeWidth: 2 }}
            tickLine={false}
            minTickGap={30}
          />
          <YAxis tick={{ fontSize: 11, fill: '#8c83af' }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: 'rgba(20,18,28,0.04)' }}
            labelFormatter={(d) => formatDate(d as string, locale)}
            formatter={(value: number) => [formatNumber(value, locale), valueLabel ?? '']}
            contentStyle={{ borderRadius: 0, border: '2px solid #14121C', fontSize: 12, boxShadow: 'none' }}
          />
          <Bar dataKey="count" name={valueLabel} radius={0}>
            {data.map((_, i) => (
              <Cell key={i} fill={highlightLastN > 0 && i >= data.length - highlightLastN ? highlightColor : color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
