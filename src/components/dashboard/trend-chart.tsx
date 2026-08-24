'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useLocale } from 'next-intl';
import { Locale } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';

export function TrendChart({ data, color = '#8636e8' }: { data: { date: string; count: number }[]; color?: string }) {
  const locale = useLocale() as Locale;
  // Recharts measures the container via the DOM, which isn't available
  // during SSR — render a placeholder until mounted to avoid a hydration
  // mismatch, then swap in the real chart client-side only.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }

  return (
    <div className="h-64 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f6" />
          <XAxis
            dataKey="date"
            tickFormatter={(d) => formatDate(d, locale).split(',')[0]}
            tick={{ fontSize: 11, fill: '#9ba1c6' }}
            axisLine={false}
            tickLine={false}
            minTickGap={30}
          />
          <YAxis tick={{ fontSize: 11, fill: '#9ba1c6' }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
          <Tooltip
            labelFormatter={(d) => formatDate(d as string, locale)}
            contentStyle={{ borderRadius: 12, border: '1px solid #e7e9f2', fontSize: 12 }}
          />
          <Area type="monotone" dataKey="count" stroke={color} strokeWidth={2.5} fill="url(#trendFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
