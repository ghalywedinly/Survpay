import { notFound } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getUserDetail } from '@/lib/services/admin';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table';
import { FraudFlagList } from '@/components/admin/fraud-flag-list';
import { formatSar, formatDate } from '@/lib/format';
import { Locale } from '@/lib/types';

const STATUS_VARIANT = { active: 'success', suspended: 'danger', pending_verification: 'warning' } as const;
const RISK_VARIANT = { low: 'success', medium: 'warning', high: 'danger' } as const;

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('adminUsers');
  const tStatus = await getTranslations('userStatus');
  const tRisk = await getTranslations('riskLevel');
  const tCity = await getTranslations('cities');
  const tGender = await getTranslations('gender');
  const tEmployment = await getTranslations('employment');
  const tIncome = await getTranslations('income');
  const tTxStatus = await getTranslations('txStatus');

  const detail = await getUserDetail(params.id);
  if (!detail.user || !detail.profile) notFound();
  const { user, profile, transactions, withdrawals } = detail;

  return (
    <div className="container-app py-8">
      <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900">
        <ArrowLeft size={15} className="flip-rtl" /> {t('back')}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Avatar name={user.name} color={user.avatarColor} size={56} />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-ink-900">{user.name}</h1>
            {user.emailVerified && <ShieldCheck size={16} className="text-brand-600" />}
          </div>
          <p className="text-sm text-ink-500">{user.email}</p>
        </div>
        <div className="ms-auto flex gap-2">
          <Badge variant={STATUS_VARIANT[user.status]}>{tStatus(user.status)}</Badge>
          <Badge variant={RISK_VARIANT[profile.riskScore]}>{tRisk(profile.riskScore)}</Badge>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-xs font-medium text-ink-500">{t('completed')}</p>
          <p className="mt-1 text-xl font-extrabold text-ink-900">{profile.surveysCompleted}</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium text-ink-500">{t('balance')}</p>
          <p className="mt-1 text-xl font-extrabold text-money-700">{formatSar(profile.balanceAvailable, locale)}</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium text-ink-500">{t('joined')}</p>
          <p className="mt-1 text-xl font-extrabold text-ink-900">{formatDate(user.createdAt, locale)}</p>
        </div>
      </div>

      <div className="mt-6 card">
        <h2 className="text-base font-bold text-ink-900">{t('demographics')}</h2>
        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            [t('city'), tCity(profile.city)],
            [t('gender'), tGender(profile.gender)],
            [t('employment'), tEmployment(profile.employmentStatus)],
            [t('income'), tIncome(profile.incomeRange)],
            [t('household'), String(profile.householdSize)],
            [t('jobTitle'), profile.jobTitle || '—'],
          ].map(([label, value], i) => (
            <div key={i}>
              <dt className="text-xs font-medium text-ink-400">{label}</dt>
              <dd className="mt-0.5 text-sm font-semibold text-ink-900">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 card">
        <h2 className="text-base font-bold text-ink-900">{t('fraudFlags')}</h2>
        <div className="mt-4">
          <FraudFlagList userId={user.id} flags={profile.fraudFlags} locale={locale} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card !p-0">
          <div className="p-5">
            <h2 className="text-base font-bold text-ink-900">{t('earnings')}</h2>
          </div>
          {transactions.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-ink-400">—</p>
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>{t('date')}</Th>
                  <Th className="text-end">{t('amount')}</Th>
                  <Th>{t('status')}</Th>
                </tr>
              </Thead>
              <Tbody>
                {transactions.slice(0, 8).map((tx) => (
                  <Tr key={tx.id}>
                    <Td>{formatDate(tx.createdAt, locale)}</Td>
                    <Td className={`text-end font-semibold ${tx.amount >= 0 ? 'text-money-600' : 'text-ink-700'}`}>{formatSar(tx.amount, locale, true)}</Td>
                    <Td>
                      <Badge variant="neutral">{tTxStatus(tx.status)}</Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </div>

        <div className="card !p-0">
          <div className="p-5">
            <h2 className="text-base font-bold text-ink-900">{t('withdrawals')}</h2>
          </div>
          {withdrawals.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-ink-400">—</p>
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>{t('date')}</Th>
                  <Th className="text-end">{t('amount')}</Th>
                  <Th>{t('status')}</Th>
                </tr>
              </Thead>
              <Tbody>
                {withdrawals.map((w) => (
                  <Tr key={w.id}>
                    <Td>{formatDate(w.requestedAt, locale)}</Td>
                    <Td className="text-end font-semibold">{formatSar(w.amount, locale)}</Td>
                    <Td>
                      <Badge variant="neutral">{tTxStatus(w.status as never)}</Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
