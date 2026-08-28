import type { Config } from 'tailwindcss';

// Survpay Visual Identity v1.0 — three brand colours, one ink, one ground.
// "Survpay is an instrument, not a personality." Hard 2px rules, flush-left
// type, zero radius everywhere except the capsule (buttons, tags, avatars).
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-en)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        ar: ['var(--font-ar)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ground: '#F3F2F2',
        paper: '#FFFFFF',
        // Neutral text/border ramp, tinted toward ink's hue. ink-900 is the
        // brand's literal Ink (#14121C) — all body copy, all rules.
        ink: {
          50: '#f3f3f7',
          100: '#e5e3ed',
          200: '#cecadd',
          300: '#aea8c7',
          400: '#8c83af',
          500: '#6d6298',
          600: '#564e79',
          700: '#433c5d',
          800: '#2f2a41',
          900: '#14121C',
        },
        // Survpay Purple — the brand voice. Primary actions, the mark, one
        // field per surface, never two colours touching.
        brand: {
          purple: '#AA52F7',
          50: '#faf5fe',
          100: '#f5ecfe',
          200: '#e9d4fc',
          300: '#d6acfb',
          400: '#bc77f9',
          500: '#AA52F7',
          600: '#8a1eef',
          700: '#6a01c6',
          800: '#520198',
          900: '#39006b',
        },
        // Signal Blue — precision. Data series, links, filters, anything the
        // analyst touches.
        signal: {
          blue: '#054CF6',
          50: '#eef3fe',
          100: '#ebf1fe',
          200: '#d3dffd',
          300: '#aac3fd',
          400: '#739bfc',
          500: '#054CF6',
          600: '#0041d6',
          700: '#003bc7',
          800: '#002d99',
          900: '#00206b',
        },
        // Panel Aqua — the respondent side. Rewards, completion, positive
        // delta. Never carries text at 500 — use aqua-800 or ink.
        aqua: {
          aqua: '#65E8E5',
          50: '#f2fdfc',
          100: '#eefcfb',
          200: '#d8f8f7',
          300: '#b4f4f2',
          400: '#83ecea',
          500: '#65E8E5',
          600: '#20d9d5',
          700: '#10b7b3',
          800: '#0c8d8a',
          900: '#096360',
        },
        // `money` is kept as an alias of the aqua ramp — reward/earnings/
        // success surfaces throughout the app read as the brand's aqua.
        money: {
          50: '#f2fdfc',
          100: '#eefcfb',
          200: '#d8f8f7',
          300: '#b4f4f2',
          400: '#83ecea',
          500: '#0c8d8a',
          600: '#096360',
          700: '#096360',
          800: '#075150',
          900: '#054040',
        },
        // Utility only — not a brand colour. Used sparingly for destructive
        // / rejected / high-risk states, which the identity doesn't define.
        danger: {
          50: '#fdf2f1',
          100: '#fbe1de',
          200: '#f3bcb5',
          500: '#c6402e',
          600: '#a52f20',
          700: '#7d2318',
        },
      },
      boxShadow: {
        // Elevation is reserved for true overlays (menus, modals) — surfaces
        // otherwise separate with a hard 2px ink rule, never a soft shadow.
        overlay: '0 12px 40px -12px rgba(20,18,28,0.35)',
      },
      borderRadius: {
        none: '0px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pop': {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        pop: 'pop 0.2s ease-out both',
      },
    },
  },
  plugins: [],
};
export default config;
