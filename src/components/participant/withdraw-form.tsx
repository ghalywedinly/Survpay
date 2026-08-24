'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Landmark, Smartphone, CheckCircle2, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { formatSar } from '@/lib/format';
import { WithdrawalMethod, Locale } from '@/lib/types';
import { requestWithdrawalAction } from '@/app/actions/withdraw';

const MIN_WITHDRAWAL = 50;

export function WithdrawForm({ availableBalance, locale }: { availableBalance: number; locale: Locale }) {
  const t = useTranslations('participantWithdraw');
  const tc = useTranslations('common');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<WithdrawalMethod>('bank_transfer');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<number | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const value = Number(amount);
    if (!value || value < MIN_WITHDRAWAL) {
      setError(t('errorMin'));
      return;
    }
    if (value > availableBalance) {
      setError(t('errorBalance'));
      return;
    }
    setLoading(true);
    const res = await requestWithdrawalAction(value, method, destination || (method === 'bank_transfer' ? 'SA** **** **** 0000' : '05********'));
    setLoading(false);
    if (!res.ok) {
      setError(t('errorBalance'));
      return;
    }
    setSuccess(value);
    setAmount('');
    setDestination('');
  }

  return (
    <div className="card">
      <h1 className="text-xl font-extrabold text-ink-900">{t('title')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>

      <div className="mt-5 rounded-xl bg-money-50 px-4 py-3">
        <p className="text-xs font-medium text-money-700">{t('availableBalance')}</p>
        <p className="text-xl font-extrabold text-money-700">{formatSar(availableBalance, locale)}</p>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        <Input
          label={t('amount')}
          type="number"
          min={MIN_WITHDRAWAL}
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          leadingIcon={<span className="text-sm font-semibold">﷼</span>}
          placeholder="0.00"
        />

        <div>
          <p className="mb-1.5 text-sm font-medium text-ink-700">{t('method')}</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMethod('bank_transfer')}
              className={clsx(
                'flex flex-col items-center gap-1.5 rounded-xl border-2 py-4 text-sm font-semibold transition-colors',
                method === 'bank_transfer' ? 'border-brand-500 bg-brand-50 text-ink-900' : 'border-ink-100 text-ink-500 hover:border-ink-200'
              )}
            >
              <Landmark size={18} />
              {t('bankTransfer')}
            </button>
            <button
              type="button"
              onClick={() => setMethod('stc_pay')}
              className={clsx(
                'flex flex-col items-center gap-1.5 rounded-xl border-2 py-4 text-sm font-semibold transition-colors',
                method === 'stc_pay' ? 'border-brand-500 bg-brand-50 text-ink-900' : 'border-ink-100 text-ink-500 hover:border-ink-200'
              )}
            >
              <Smartphone size={18} />
              {t('stcPay')}
            </button>
          </div>
        </div>

        <Input
          label={method === 'bank_transfer' ? t('iban') : t('phone')}
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder={method === 'bank_transfer' ? 'SA00 0000 0000 0000 0000 0000' : '05XXXXXXXX'}
        />

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}

        <div className="flex items-start gap-2 rounded-xl bg-ink-50 px-3.5 py-3 text-xs text-ink-500">
          <Info size={14} className="mt-0.5 shrink-0" />
          <p>
            {t('minNotice')} {t('processingNotice')}
          </p>
        </div>

        <Button type="submit" fullWidth size="lg" variant="success" loading={loading}>
          {t('submit')}
        </Button>
      </form>

      <Modal open={success !== null} onClose={() => setSuccess(null)} title={t('successTitle')} size="sm">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-money-100 text-money-700">
            <CheckCircle2 size={26} />
          </div>
          <p className="mt-4 text-sm text-ink-600">{success !== null && t('successBody', { amount: formatSar(success, locale) })}</p>
          <Button className="mt-6" fullWidth onClick={() => setSuccess(null)}>
            {tc('close')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
