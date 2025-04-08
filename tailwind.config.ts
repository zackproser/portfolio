import typographyPlugin from '@tailwindcss/typography'
import { type Config } from 'tailwindcss'

import typographyStyles from './typography'

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  plugins: [typographyPlugin],
  theme: {
    fontSize: {
      xs: ['0.8125rem', { lineHeight: '1.5rem' }],
      sm: ['1rem', { lineHeight: '1.5rem' }],
      base: ['1.25rem', { lineHeight: '1.75rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '2rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '3.5rem' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    typography: typographyStyles,
    extend: {
      colors: {
        // Light mode colors
        neutral: {
          50: '#fafafa', // Main background
        },
        // Dark mode colors added to support the new scheme
        gray: {
          900: '#171717', // Dark mode main background
          800: '#1f1f1f', // Dark mode panel background
          700: '#404040', // Dark mode panel border
          100: '#f5f5f5', // Dark mode text color
        },
        blue: {
          900: '#1e3a8a', // Header gradient end
          800: '#1e40af', // Header gradient start
          600: '#2563eb', // Light mode accent text
          500: '#3b82f6', // Light mode accent border
          400: '#60a5fa', // Dark mode accent text/border
          100: '#dbeafe', // Dark mode header text
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      textShadow: {
        DEFAULT: '2px 2px 0 rgba(0, 0, 0, 0.5)',
      },
      clipPath: {
        'polygon': 'polygon(0 0, 50% 40%, 100% 0, 100% 40%, 50% 80%, 0 40%)',
      }
    }
  },
} satisfies Config
