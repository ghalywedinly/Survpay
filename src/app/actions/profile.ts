'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { updateParticipantProfile } from '@/lib/services/participant';
import {
  Gender,
  SaudiCity,
  MaritalStatus,
  EmploymentStatus,
  IncomeRange,
  InterestKey,
  DeviceKey,
} from '@/lib/types';

export interface ProfileFormInput {
  dateOfBirth: string;
  gender: Gender;
  city: SaudiCity;
  householdSize: number;
  maritalStatus: MaritalStatus;
  children: number;
  employmentStatus: EmploymentStatus;
  industry: string;
  jobTitle: string;
  incomeRange: IncomeRange;
  interests: InterestKey[];
  devices: DeviceKey[];
}

export async function updateProfileAction(input: ProfileFormInput) {
  const session = await getSession();
  if (!session || session.role !== 'participant') return { ok: false as const, error: 'unauthorized' };
  await updateParticipantProfile(session.uid, input);
  revalidatePath('/[locale]/participant/profile', 'page');
  revalidatePath('/[locale]/participant/dashboard', 'page');
  revalidatePath('/[locale]/participant/surveys', 'page');
  return { ok: true as const };
}
