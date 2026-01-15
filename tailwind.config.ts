import typographyPlugin from '@tailwindcss/typography'
import { type Config } from 'tailwindcss'

import typographyStyles from './typography'

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  plugins: [
    typographyPlugin,
    require('@tailwindcss/aspect-ratio'),
  ],
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
      fontFamily: {
        serif: ['var(--font-source-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Parchment theme - Authority glow-up palette
        parchment: {
          50: '#fefdfb',
          100: '#fbf7f0',  // Main light mode background
          200: '#f5f0e6',  // Secondary light background
          300: '#e8e0d0',  // Light borders
          400: '#d1c7b7',  // Pencil gray / subtle borders
          500: '#b8a88f',  // Muted text
          600: '#8b7355',  // Darker accents
        },
        charcoal: {
          50: '#2c3e50',   // Light text on dark
          100: '#1f2d3d',
          200: '#1a2533',
          300: '#16213e',  // Secondary dark background
          400: '#1a1a2e',  // Main dark mode background
          500: '#141428',
          600: '#0f0f1f',  // Deepest dark
        },
        burnt: {
          50: '#fef3e2',
          100: '#fde4c4',
          200: '#fbd38d',
          300: '#f6ad55',
          400: '#e67e22',  // Primary accent - Anthropic-inspired
          500: '#d35400',  // Hover state
          600: '#b84a00',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#f39c12',  // Dark mode accent - glowing amber
          500: '#f59e0b',
          600: '#d97706',
        },
        // Keep existing colors for backwards compatibility
        neutral: {
          50: '#fafafa', // Main background
        },
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
        'shine': 'shine 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '0 0' },
        },
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
