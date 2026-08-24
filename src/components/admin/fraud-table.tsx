'use client';

import { useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ShieldAlert } from 'lucide-react';
import { FraudFlag, User, Locale } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { resolveFraudFlagAction } from '@/app/actions/admin';

const SEVERITY_VARIANT = { low: 'warning', medium: 'warning', high: 'danger' } as const;

export function FraudTable({ rows }: { rows: { flag: FraudFlag; user?: User }[] }) {
  const t = useTranslations('adminFraud');
  const tType = useTranslations('flagType');
  const tSeverity = useTranslations('severity');
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  if (rows.length === 0) {
    return <EmptyState icon={ShieldAlert} title={t('empty')} />;
  }

  return (
    <div className="card !p-0">
      <Table>
        <Thead>
          <tr>
            <Th>{t('user')}</Th>
            <Th>{t('type')}</Th>
            <Th>{t('description')}</Th>
            <Th>{t('severity')}</Th>
            <Th>{t('detected')}</Th>
            <Th>{t('status')}</Th>
            <Th />
          </tr>
        </Thead>
        <Tbody>
          {rows.map(({ flag, user }) => (
            <Tr key={flag.id}>
              <Td className="font-medium text-ink-900">
                {user ? (
                  <Link href={`/admin/users/${user.id}` as never} className="hover:underline">
                    {user.name}
                  </Link>
                ) : (
                  '—'
                )}
              </Td>
              <Td className="whitespace-nowrap text-ink-500">{tType(flag.type)}</Td>
              <Td className="max-w-xs text-ink-500">{flag.description}</Td>
              <Td>
                <Badge variant={SEVERITY_VARIANT[flag.severity]}>{tSeverity(flag.severity)}</Badge>
              </Td>
              <Td className="whitespace-nowrap">{formatDate(flag.detectedAt, locale)}</Td>
              <Td>{flag.resolved ? <Badge variant="success">✓</Badge> : <Badge variant="neutral">—</Badge>}</Td>
              <Td>
                {!flag.resolved && user && (
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<CheckCircle2 size={13} />}
                    loading={isPending}
                    onClick={() => startTransition(async () => { await resolveFraudFlagAction(user.id, flag.id); })}
                  >
                    {t('resolve')}
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}
