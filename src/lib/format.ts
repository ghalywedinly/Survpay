import { Locale } from './types';

// Digit rule (Typography · Data language): "Western Arabic (0-9) in charts,
// tables and dashboards." Survpay's Arabic UI is overwhelmingly dashboard
// and data surfaces, so every numeral in the app — balances, dates, counts,
// relative time — renders in Western digits via the `-u-nu-latn` Unicode
// extension, even under the `ar-SA` locale (which otherwise defaults to
// Eastern Arabic-Indic digits). `-u-ca-gregory` also pins the Gregorian
// calendar: `ar-SA` defaults to Hijri per CLDR, and Node's ICU and the
// browser's ICU don't always agree on that default, which would otherwise
// produce a server/client hydration mismatch.
const AR_LOCALE = 'ar-SA-u-ca-gregory-nu-latn';

export function formatSar(amount: number, locale: Locale = 'en', withSign = false) {
  const sign = withSign && amount > 0 ? '+' : '';
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString(locale === 'ar' ? AR_LOCALE : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const negative = amount < 0 ? '-' : '';
  const label = locale === 'ar' ? 'ر.س' : 'SAR';
  return locale === 'ar' ? `${negative}${sign}${formatted} ${label}` : `${negative}${sign}${label} ${formatted}`;
}

export function formatNumber(value: number, locale: Locale = 'en') {
  return value.toLocaleString(locale === 'ar' ? AR_LOCALE : 'en-US');
}

export function formatDate(date: string | Date, locale: Locale = 'en') {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale === 'ar' ? AR_LOCALE : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date, locale: Locale = 'en') {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(locale === 'ar' ? AR_LOCALE : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function timeAgo(date: string | Date, locale: Locale = 'en') {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale === 'ar' ? 'ar-SA-u-nu-latn' : 'en', { numeric: 'auto' });
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
