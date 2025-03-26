/** @type {import('tailwindcss').Config} */
//import defaultTheme from 'tailwindcss/defaultTheme';

const config = {
  important: true,
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--brand-primary)',
        'brand-secondary': 'var(--brand-secondary)',
        'mui-gray': 'var(--mui-gray)',
        'shelly-gray': 'var(--shelly-gray)',
        'danger': 'var(--danger)',
        'success': 'var(--success)',
        'form': 'var(--form-bg)',
        'lightest-gray': 'var(--lightest-gray)',
        'shelly-disabled-gray': 'var(--shelly-disabled-gray)',
        'shelly-disabled-gray-text': 'var(--shelly-disabled-gray-text)',
        'brand-light': 'var(--brand-light)',
        'excel-green': 'var(--excel-green)',
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      fontWeight: {
        bold: '500',
      },
      fontSize: {
        'sm': '0.625rem',
        'base': '0.75rem', // 12px
        'lg': '0.875rem', // 14px
        'xl': '1rem', // 16px
        '2xl': '1.125rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
        '5xl': '1.75rem',
        '6xl': '2rem',
        'custom-size': '1.75rem',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};