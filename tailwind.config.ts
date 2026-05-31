import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary, #1B4332)',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: 'var(--color-primary, #1B4332)',
          600: '#143427',
          700: '#0f261d',
          800: '#0a1a14',
          900: '#050d0a',
        },
        'brand-green': 'var(--color-primary, #1B4332)',
        'deep-green': 'var(--color-primary, #1B4332)',
        'brand-red': 'var(--color-secondary, #BC4749)',
        'brand-gray': 'var(--color-background, #F5F5F5)',
        'theme-bg': 'var(--color-background, #F8F9F7)',
        'theme-surface': 'var(--color-surface, #FFFFFF)',
        'theme-text': 'var(--color-text, #1F2937)',
        success: 'var(--color-primary, #1B4332)',
        warning: '#FFA500',
        danger: 'var(--color-secondary, #BC4749)',
        info: '#3B82F6',
      },
      borderRadius: {
        'theme-card': 'var(--radius-card, 1.5rem)',
        'theme-btn': 'var(--radius-button, 1rem)',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      direction: ['rtl'],
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        '.rtl': {
          direction: 'rtl',
        },
        '.ltr': {
          direction: 'ltr',
        },
      })
    },
  ],
}

export default config
