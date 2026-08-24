// Pure helper — safe to import from both client and server code.
export function profileCompletionPercent(profile: {
  dateOfBirth: string;
  city: string;
  jobTitle: string;
  industry: string;
  interests: unknown[];
  devices: unknown[];
}) {
  const fields = [
    !!profile.dateOfBirth,
    !!profile.city,
    !!profile.jobTitle,
    !!profile.industry,
    profile.interests.length > 0,
    profile.devices.length > 0,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}
