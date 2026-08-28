'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';
import { Smartphone, Laptop, Tablet, Apple } from 'lucide-react';
import { Input, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress';
import { useToast } from '@/components/ui/toast';
import {
  ParticipantProfile,
  SAUDI_CITIES,
} from '@/lib/types';
import {
  INTEREST_KEYS,
  DEVICE_KEYS,
  INCOME_RANGES,
  EMPLOYMENT_STATUSES,
  MARITAL_STATUSES,
  INDUSTRIES,
} from '@/lib/constants';
import { updateProfileAction, ProfileFormInput } from '@/app/actions/profile';
import { profileCompletionPercent } from '@/lib/profile-completion';

const DEVICE_ICONS = { iphone: Apple, android: Smartphone, computer: Laptop, tablet: Tablet };

export function ProfileForm({ profile, name }: { profile: ParticipantProfile; name: string }) {
  const t = useTranslations('participantProfile');
  const tCity = useTranslations('cities');
  const tGender = useTranslations('gender');
  const tMarital = useTranslations('marital');
  const tEmployment = useTranslations('employment');
  const tIncome = useTranslations('income');
  const tInterest = useTranslations('interests');
  const tDevice = useTranslations('devices');
  const toast = useToast();

  const [form, setForm] = useState<ProfileFormInput>({
    dateOfBirth: profile.dateOfBirth,
    gender: profile.gender,
    city: profile.city,
    householdSize: profile.householdSize,
    maritalStatus: profile.maritalStatus,
    children: profile.children,
    employmentStatus: profile.employmentStatus,
    industry: profile.industry,
    jobTitle: profile.jobTitle,
    incomeRange: profile.incomeRange,
    interests: profile.interests,
    devices: profile.devices,
  });
  const [saving, setSaving] = useState(false);

  const completion = profileCompletionPercent(form);

  function toggleInterest(key: (typeof INTEREST_KEYS)[number]) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(key) ? f.interests.filter((i) => i !== key) : [...f.interests, key],
    }));
  }
  function toggleDevice(key: (typeof DEVICE_KEYS)[number]) {
    setForm((f) => ({
      ...f,
      devices: f.devices.includes(key) ? f.devices.filter((d) => d !== key) : [...f.devices, key],
    }));
  }

  async function onSave() {
    setSaving(true);
    const res = await updateProfileAction(form);
    setSaving(false);
    if (res.ok) toast.push({ variant: 'success', title: t('saved'), description: t('savedBody') });
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-900">{t('completion')}</p>
            <p className="text-xs text-ink-500">{name}</p>
          </div>
          <span className="text-xl font-extrabold text-brand-700">{completion}%</span>
        </div>
        <ProgressBar value={completion} gradient className="mt-3" />
      </div>

      <div className="card">
        <h3 className="text-base font-bold text-ink-900">{t('personalInfo')}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label={t('dob')} type="date" value={form.dateOfBirth} onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))} />
          <Select label={t('gender')} value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as never }))}>
            <option value="male">{tGender('male')}</option>
            <option value="female">{tGender('female')}</option>
          </Select>
          <Select label={t('city')} value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value as never }))}>
            {SAUDI_CITIES.map((c) => (
              <option key={c} value={c}>
                {tCity(c)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="card">
        <h3 className="text-base font-bold text-ink-900">{t('household')}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Input
            label={t('householdSize')}
            type="number"
            min={1}
            value={form.householdSize}
            onChange={(e) => setForm((f) => ({ ...f, householdSize: Number(e.target.value) }))}
          />
          <Select label={t('maritalStatus')} value={form.maritalStatus} onChange={(e) => setForm((f) => ({ ...f, maritalStatus: e.target.value as never }))}>
            {MARITAL_STATUSES.map((m) => (
              <option key={m} value={m}>
                {tMarital(m)}
              </option>
            ))}
          </Select>
          <Input
            label={t('children')}
            type="number"
            min={0}
            value={form.children}
            onChange={(e) => setForm((f) => ({ ...f, children: Number(e.target.value) }))}
          />
        </div>
      </div>

      <div className="card">
        <h3 className="text-base font-bold text-ink-900">{t('employment')}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Select
            label={t('employmentStatus')}
            value={form.employmentStatus}
            onChange={(e) => setForm((f) => ({ ...f, employmentStatus: e.target.value as never }))}
          >
            {EMPLOYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {tEmployment(s)}
              </option>
            ))}
          </Select>
          <Select label={t('industry')} value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}>
            <option value="">—</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </Select>
          <Input label={t('jobTitle')} value={form.jobTitle} onChange={(e) => setForm((f) => ({ ...f, jobTitle: e.target.value }))} />
          <Select label={t('incomeRange')} value={form.incomeRange} onChange={(e) => setForm((f) => ({ ...f, incomeRange: e.target.value as never }))}>
            {INCOME_RANGES.map((i) => (
              <option key={i} value={i}>
                {tIncome(i)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="card">
        <h3 className="text-base font-bold text-ink-900">{t('interests')}</h3>
        <p className="mt-1 text-sm text-ink-500">{t('interestsBody')}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {INTEREST_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => toggleInterest(key)}
              className={clsx(
                'rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors',
                form.interests.includes(key) ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink-200 text-ink-500 hover:border-ink-900'
              )}
            >
              {tInterest(key)}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-base font-bold text-ink-900">{t('devices')}</h3>
        <p className="mt-1 text-sm text-ink-500">{t('devicesBody')}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DEVICE_KEYS.map((key) => {
            const Icon = DEVICE_ICONS[key];
            const active = form.devices.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleDevice(key)}
                className={clsx(
                  'flex flex-col items-center gap-2 rounded-none border-2 py-4 text-sm font-bold transition-colors',
                  active ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink-200 text-ink-500 hover:border-ink-900'
                )}
              >
                <Icon size={20} />
                {tDevice(key)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="lg" variant="secondary" onClick={onSave} loading={saving}>
          {t('saveChanges')}
        </Button>
      </div>
    </div>
  );
}
