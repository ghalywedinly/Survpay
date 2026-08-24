import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Logo } from '@/components/brand/logo';

export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  const columns = [
    {
      title: t('participants'),
      links: [
        { href: '/#earn', label: nav('earnMoney') },
        { href: '/#how-it-works', label: nav('howItWorks') },
        { href: '/signup', label: t('participants') },
      ],
    },
    {
      title: t('companies'),
      links: [
        { href: '/#companies', label: nav('forCompanies') },
        { href: '/signup', label: t('companies') },
      ],
    },
    {
      title: t('company'),
      links: [
        { href: '/#faq', label: t('about') },
        { href: '/#faq', label: t('terms') },
        { href: '/#faq', label: t('privacy') },
        { href: '/#faq', label: t('contact') },
      ],
    },
  ];

  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="container-app grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo size={26} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">{t('description')}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-bold text-ink-900">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l, i) => (
                <li key={i}>
                  <Link href={l.href as never} className="text-sm text-ink-500 hover:text-ink-900">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-100 py-6">
        <p className="container-app text-center text-xs text-ink-400">
          © {new Date().getFullYear()} Survpay. {t('rights')}
        </p>
      </div>
    </footer>
  );
}
