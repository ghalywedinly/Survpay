import { Locale } from './types';

export function formatSar(amount: number, locale: Locale = 'en', withSign = false) {
  const sign = withSign && amount > 0 ? '+' : '';
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const negative = amount < 0 ? '-' : '';
  const label = locale === 'ar' ? 'ر.س' : 'SAR';
  return locale === 'ar' ? `${negative}${sign}${formatted} ${label}` : `${negative}${sign}${label} ${formatted}`;
}

export function formatNumber(value: number, locale: Locale = 'en') {
  return value.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US');
}

// `ar-SA` defaults to the Hijri (islamic-umalqura) calendar per CLDR, and
// Node's ICU and the browser's ICU don't always agree on that default —
// which produces a server/client hydration mismatch (one renders a
// Gregorian date, the other Hijri). Force the Gregorian calendar explicitly
// via the `-u-ca-gregory` Unicode extension so both sides always agree.
const AR_DATE_LOCALE = 'ar-SA-u-ca-gregory';

export function formatDate(date: string | Date, locale: Locale = 'en') {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale === 'ar' ? AR_DATE_LOCALE : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date, locale: Locale = 'en') {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(locale === 'ar' ? AR_DATE_LOCALE : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function timeAgo(date: string | Date, locale: Locale = 'en') {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale === 'ar' ? 'ar' : 'en', { numeric: 'auto' });
  const divisions: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'seconds'],
    [60, 'minutes'],
    [24, 'hours'],
    [7, 'days'],
    [4.34524, 'weeks'],
    [12, 'months'],
    [Infinity, 'years'],
  ];
  let duration = seconds;
  for (const [amount, unit] of divisions) {
    if (Math.abs(duration) < amount) return rtf.format(-Math.round(duration), unit);
    duration /= amount;
  }
  return '';
}
