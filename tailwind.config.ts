import type { Config } from 'tailwindcss';

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
        ink: {
          50: '#f4f5f9',
          100: '#e7e9f2',
          200: '#c8cce3',
          300: '#9ba1c6',
          400: '#6871a3',
          500: '#454d80',
          600: '#323a66',
          700: '#252a4d',
          800: '#181b35',
          900: '#11132a',
          950: '#0a0b1c',
        },
        brand: {
          cyan: '#12e5da',
          purple: '#b32be0',
          magenta: '#c026e8',
          blue: '#3229f2',
          50: '#f5f1ff',
          100: '#ece3fe',
          200: '#d6c3fd',
          300: '#b895fa',
          400: '#9b63f4',
          500: '#8636e8',
          600: '#7420cf',
          700: '#5f18a8',
          800: '#4f1888',
          900: '#42186e',
        },
        money: {
          50: '#ecfdf3',
          100: '#d1fae0',
          200: '#a7f3c6',
          300: '#6ee7a3',
          400: '#34d17c',
          500: '#12b35e',
          600: '#0a9350',
          700: '#0a7442',
          800: '#0b5c37',
          900: '#0a4b2f',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #12e5da 0%, #b32be0 55%, #3229f2 100%)',
        'brand-radial': 'radial-gradient(120% 120% at 20% 0%, #2a1a5e 0%, #170c38 45%, #12082b 100%)',
        'hero-glow': 'radial-gradient(60% 60% at 80% 10%, rgba(18,229,218,0.25) 0%, rgba(18,229,218,0) 60%), radial-gradient(50% 50% at 10% 30%, rgba(179,43,224,0.25) 0%, rgba(179,43,224,0) 60%)',
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgba(17, 19, 42, 0.08), 0 8px 24px -8px rgba(17, 19, 42, 0.08)',
        card: '0 1px 2px rgba(17,19,42,0.04), 0 8px 30px -12px rgba(17,19,42,0.12)',
        glow: '0 0 0 1px rgba(179,43,224,0.15), 0 8px 30px -8px rgba(179,43,224,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
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
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        pop: 'pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
    },
  },
  plugins: [],
};
export default config;
