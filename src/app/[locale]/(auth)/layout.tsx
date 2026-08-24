import { Link } from '@/i18n/routing';
import { Logo } from '@/components/brand/logo';
import { LanguageSwitcher } from '@/components/marketing/language-switcher';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Logo size={26} />
          </Link>
          <LanguageSwitcher />
        </div>
        <div className="flex flex-1 items-center py-10">
          <div className="mx-auto w-full max-w-sm">{children}</div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-brand-radial lg:block">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative flex h-full flex-col items-start justify-end p-14">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
            <p className="text-sm font-semibold text-ink-300">Saudi Consumer Shopping Habits</p>
            <p className="mt-1 text-lg font-bold text-white">8 min · SAR 12.50</p>
            <div className="mt-4 h-2 w-64 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 rounded-full bg-brand-gradient" />
            </div>
          </div>
          <h2 className="mt-8 max-w-md text-3xl font-extrabold leading-tight text-white">Your Opinion Has Value.</h2>
          <p className="mt-3 max-w-sm text-ink-300">
            Join thousands of Saudis earning real money by sharing their opinion with the brands they use every day.
          </p>
        </div>
      </div>
    </div>
  );
}
