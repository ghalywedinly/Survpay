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
      {/* S-Flow, full-bleed — the identity's one decorative pattern. Body
          copy sits on the solid ink card, never on the stripes. */}
      <div className="s-flow relative hidden lg:block">
        <div className="absolute inset-0 flex flex-col items-start justify-end p-14">
          <div className="w-full max-w-md rounded-none bg-ink-900 p-6">
            <p className="text-sm font-bold text-ink-300">Saudi Consumer Shopping Habits</p>
            <p className="mt-1 text-lg font-bold text-white">8 min · SAR 12.50</p>
            <div className="mt-4 h-2 w-64 bg-white/15">
              <div className="h-full w-2/3 bg-aqua-500" />
            </div>
            <h2 className="mt-6 max-w-md text-3xl font-extrabold leading-tight text-white">Your Opinion Has Value.</h2>
            <p className="mt-3 max-w-sm text-ink-300">
              Join thousands of Saudis earning real money by sharing their opinion with the brands they use every day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
