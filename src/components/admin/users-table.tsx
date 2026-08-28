'use client';

import { useMemo, useState, useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Search, MoreHorizontal, Eye, Ban, CheckCircle2, BadgeCheck } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { User, ParticipantProfile, Locale } from '@/lib/types';
import { formatSar, formatDate } from '@/lib/format';
import { setUserStatusAction } from '@/app/actions/admin';

const STATUS_VARIANT = { active: 'success', suspended: 'danger', pending_verification: 'warning' } as const;
const RISK_VARIANT = { low: 'success', medium: 'warning', high: 'danger' } as const;

function RowActions({ user }: { user: User }) {
  const t = useTranslations('adminUsers');
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen((o) => !o)} className="rounded-full p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700" disabled={isPending}>
        <MoreHorizontal size={17} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute end-0 top-8 z-50 w-48 rounded-none border-2 border-ink-900 bg-paper p-1.5 shadow-overlay">
            <Link href={`/admin/users/${user.id}` as never} className="flex items-center gap-2 rounded-none px-2.5 py-2 text-sm font-bold text-ink-700 hover:bg-ink-100">
              <Eye size={15} /> {t('actionView')}
            </Link>
            {user.status === 'active' ? (
              <button
                onClick={() => startTransition(async () => { await setUserStatusAction(user.id, 'suspended'); setOpen(false); })}
                className="flex w-full items-center gap-2 rounded-none px-2.5 py-2 text-sm font-bold text-danger-600 hover:bg-danger-50"
              >
                <Ban size={15} /> {t('actionSuspend')}
              </button>
            ) : (
              <button
                onClick={() => startTransition(async () => { await setUserStatusAction(user.id, 'active'); setOpen(false); })}
                className="flex w-full items-center gap-2 rounded-none px-2.5 py-2 text-sm font-bold text-money-700 hover:bg-money-50"
              >
                <CheckCircle2 size={15} /> {t('actionActivate')}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function UsersTable({ rows }: { rows: { user: User; profile?: ParticipantProfile }[] }) {
  const t = useTranslations('adminUsers');
  const tStatus = useTranslations('userStatus');
  const tCity = useTranslations('cities');
  const tRisk = useTranslations('riskLevel');
  const locale = useLocale() as Locale;
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) => r.user.name.toLowerCase().includes(q) || r.user.email.toLowerCase().includes(q));
  }, [rows, query]);

  return (
    <div>
      <Input value={query} onChange={(e) => setQuery(e.target.value)} leadingIcon={<Search size={16} />} placeholder={t('searchPlaceholder')} className="max-w-xs" />
      <div className="mt-4 card !p-0">
        <Table>
          <Thead>
            <tr>
              <Th>{t('name')}</Th>
              <Th>{t('city')}</Th>
              <Th className="text-end">{t('completed')}</Th>
              <Th className="text-end">{t('balance')}</Th>
              <Th>{t('riskScore') || 'Risk'}</Th>
              <Th>{t('status')}</Th>
              <Th>{t('joined')}</Th>
              <Th />
            </tr>
          </Thead>
          <Tbody>
            {filtered.map(({ user, profile }) => (
              <Tr key={user.id}>
                <Td>
                  <Link href={`/admin/users/${user.id}` as never} className="flex items-center gap-3 hover:underline">
                    <Avatar name={user.name} color={user.avatarColor} size={32} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink-900">
                        {user.name} {user.emailVerified && <BadgeCheck size={13} className="inline text-brand-600" />}
                      </p>
                      <p className="truncate text-xs text-ink-400">{user.email}</p>
                    </div>
                  </Link>
                </Td>
                <Td>{profile ? tCity(profile.city) : '—'}</Td>
                <Td className="text-end">{profile?.surveysCompleted ?? 0}</Td>
                <Td className="text-end font-semibold">{formatSar(profile?.balanceAvailable ?? 0, locale)}</Td>
                <Td>
                  <Badge variant={RISK_VARIANT[profile?.riskScore ?? 'low']}>{tRisk(profile?.riskScore ?? 'low')}</Badge>
                </Td>
                <Td>
                  <Badge variant={STATUS_VARIANT[user.status]}>{tStatus(user.status)}</Badge>
                </Td>
                <Td className="whitespace-nowrap">{formatDate(user.createdAt, locale)}</Td>
                <Td>
                  <RowActions user={user} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
}
