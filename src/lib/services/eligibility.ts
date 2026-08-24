import { ParticipantProfile, Survey, TargetAudience } from '../types';

export function getAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const diff = Date.now() - dob.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export function isEligible(profile: ParticipantProfile, audience: TargetAudience): boolean {
  const age = getAge(profile.dateOfBirth);
  if (age < audience.ageMin || age > audience.ageMax) return false;
  if (audience.genders.length && !audience.genders.includes(profile.gender)) return false;
  if (audience.cities.length && !audience.cities.includes(profile.city)) return false;
  if (audience.incomeRanges.length && !audience.incomeRanges.includes(profile.incomeRange)) return false;
  if (audience.employmentStatuses.length && !audience.employmentStatuses.includes(profile.employmentStatus)) return false;
  if (audience.householdSizeMin && profile.householdSize < audience.householdSizeMin) return false;
  if (audience.householdSizeMax && profile.householdSize > audience.householdSizeMax) return false;
  if (audience.interests.length) {
    const overlap = profile.interests.some((i) => audience.interests.includes(i));
    if (!overlap) return false;
  }
  return true;
}

export function estimateAudienceSize(base: number, audience: TargetAudience): number {
  let size = base;
  size *= audience.genders.length ? audience.genders.length / 2 : 1;
  size *= Math.min(1, audience.cities.length / 15 + 0.15);
  size *= Math.min(1, audience.incomeRanges.length / 5 + 0.2);
  size *= Math.min(1, audience.employmentStatuses.length / 5 + 0.2);
  const ageSpan = audience.ageMax - audience.ageMin;
  size *= Math.min(1, ageSpan / 40 + 0.25);
  return Math.max(50, Math.round(size / 10) * 10);
}

export function surveysForParticipant(surveys: Survey[], profile: ParticipantProfile) {
  return surveys.filter((s) => s.status === 'active' && isEligible(profile, s.targetAudience));
}
