import { getTranslations } from 'next-intl/server';
import { UserPlus } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { getCompanyByUserId } from '@/lib/data/store';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default async function CompanyTeamPage() {
  const session = await getSession();
  const t = await getTranslations('companyTeam');
  const tRole = await getTranslations('companyTeam.roles');
  const company = await getCompanyByUserId(session!.uid);

  return (
    <div className="container-app py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{t('title')}</h1>
          <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>
        </div>
        <Button variant="secondary" icon={<UserPlus size={16} />}>
          {t('invite')}
        </Button>
      </div>

      <div className="mt-6 card !p-0">
        <Table>
          <Thead>
            <tr>
              <Th>{t('name')}</Th>
              <Th>{t('email')}</Th>
              <Th>{t('role')}</Th>
            </tr>
          </Thead>
          <Tbody>
            {company?.teamMembers.map((m) => (
              <Tr key={m.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={m.name} size={32} color={company.logoColor} />
                    <span className="font-semibold text-ink-900">{m.name}</span>
                  </div>
                </Td>
                <Td className="text-ink-500">{m.email}</Td>
                <Td>
                  <Badge variant={m.role === 'owner' ? 'brand' : 'neutral'}>{tRole(m.role)}</Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
}
