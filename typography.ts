import { type PluginUtils } from 'tailwindcss/types/config'

export default function typographyStyles({ theme }: PluginUtils) {
  return {
    invert: {
      css: {
        '--tw-prose-body': 'var(--tw-prose-invert-body)',
        '--tw-prose-headings': 'var(--tw-prose-invert-headings)',
        '--tw-prose-links': 'var(--tw-prose-invert-links)',
        '--tw-prose-links-hover': 'var(--tw-prose-invert-links-hover)',
        '--tw-prose-underline': 'var(--tw-prose-invert-underline)',
        '--tw-prose-underline-hover': 'var(--tw-prose-invert-underline-hover)',
        '--tw-prose-bold': 'var(--tw-prose-invert-bold)',
        '--tw-prose-counters': 'var(--tw-prose-invert-counters)',
        '--tw-prose-bullets': 'var(--tw-prose-invert-bullets)',
        '--tw-prose-hr': 'var(--tw-prose-invert-hr)',
        '--tw-prose-quote-borders': 'var(--tw-prose-invert-quote-borders)',
        '--tw-prose-captions': 'var(--tw-prose-invert-captions)',
        '--tw-prose-code': 'var(--tw-prose-invert-code)',
        '--tw-prose-code-bg': 'var(--tw-prose-invert-code-bg)',
        '--tw-prose-pre-code': 'var(--tw-prose-invert-pre-code)',
        '--tw-prose-pre-bg': 'var(--tw-prose-invert-pre-bg)',
        '--tw-prose-pre-border': 'var(--tw-prose-invert-pre-border)',
        '--tw-prose-th-borders': 'var(--tw-prose-invert-th-borders)',
        '--tw-prose-td-borders': 'var(--tw-prose-invert-td-borders)',
      },
    },
    DEFAULT: {
      css: {
        // Light mode - high contrast for readability
        '--tw-prose-body': theme('colors.stone.800'),
        '--tw-prose-headings': theme('colors.stone.800'),
        '--tw-prose-links': theme('colors.amber.700'),
        '--tw-prose-links-hover': theme('colors.amber.900'),
        '--tw-prose-underline': theme('colors.amber.600 / 0.3'),
        '--tw-prose-underline-hover': theme('colors.amber.700'),
        '--tw-prose-bold': theme('colors.stone.800'),
        '--tw-prose-counters': theme('colors.stone.500'),
        '--tw-prose-bullets': theme('colors.stone.400'),
        '--tw-prose-hr': theme('colors.stone.300'),
        '--tw-prose-quote-borders': theme('colors.amber.300'),
        '--tw-prose-captions': theme('colors.stone.500'),
        '--tw-prose-code': theme('colors.amber.800'),
        '--tw-prose-code-bg': theme('colors.amber.50'),
        '--tw-prose-pre-code': theme('colors.stone.200'),
        '--tw-prose-pre-bg': theme('colors.stone.800'),
        '--tw-prose-pre-border': theme('colors.stone.700'),
        '--tw-prose-th-borders': theme('colors.stone.300'),
        '--tw-prose-td-borders': theme('colors.stone.200'),

        // Dark mode - high contrast for readability
        '--tw-prose-invert-body': theme('colors.stone.200'),
        '--tw-prose-invert-headings': theme('colors.stone.100'),
        '--tw-prose-invert-links': theme('colors.sky.400'),
        '--tw-prose-invert-links-hover': theme('colors.sky.300'),
        '--tw-prose-invert-underline': theme('colors.sky.400 / 0.35'),
        '--tw-prose-invert-underline-hover': theme('colors.sky.400'),
        '--tw-prose-invert-bold': theme('colors.stone.100'),
        '--tw-prose-invert-counters': theme('colors.stone.400'),
        '--tw-prose-invert-bullets': theme('colors.stone.500'),
        '--tw-prose-invert-hr': theme('colors.stone.700'),
        '--tw-prose-invert-quote-borders': theme('colors.sky.500 / 0.5'),
        '--tw-prose-invert-captions': theme('colors.stone.400'),
        '--tw-prose-invert-code': theme('colors.amber.300'),
        '--tw-prose-invert-code-bg': theme('colors.stone.800'),
        '--tw-prose-invert-pre-code': theme('colors.stone.300'),
        '--tw-prose-invert-pre-bg': theme('colors.stone.950'),
        '--tw-prose-invert-pre-border': theme('colors.stone.800'),
        '--tw-prose-invert-th-borders': theme('colors.stone.700'),
        '--tw-prose-invert-td-borders': theme('colors.stone.800'),

        // Base - refined line height and spacing for better flow
        color: 'var(--tw-prose-body)',
        lineHeight: theme('lineHeight.relaxed'),
        '> *': {
          marginTop: theme('spacing.5'),
          marginBottom: theme('spacing.5'),
        },
        p: {
          marginTop: theme('spacing.5'),
          marginBottom: theme('spacing.5'),
        },

        // Headings - clear hierarchy with elegant spacing
        'h2, h3': {
          color: 'var(--tw-prose-headings)',
          fontWeight: theme('fontWeight.semibold'),
          letterSpacing: '-0.01em',
        },
        h2: {
          fontSize: theme('fontSize.2xl')[0],
          lineHeight: theme('lineHeight.8'),
          marginTop: theme('spacing.12'),
          marginBottom: theme('spacing.4'),
          paddingBottom: theme('spacing.2'),
          borderBottom: '1px solid',
          borderColor: 'var(--tw-prose-hr)',
        },
        h3: {
          fontSize: theme('fontSize.lg')[0],
          lineHeight: theme('lineHeight.7'),
          marginTop: theme('spacing.8'),
          marginBottom: theme('spacing.3'),
        },
        ':is(h2, h3) + *': {
          marginTop: 0,
        },

        // Images
        img: {
          borderRadius: theme('borderRadius.3xl'),
        },

        // Inline elements
        a: {
          color: 'var(--tw-prose-links)',
          fontWeight: theme('fontWeight.semibold'),
          textDecoration: 'underline',
          textDecorationColor: 'var(--tw-prose-underline)',
          transitionProperty: 'color, text-decoration-color',
          transitionDuration: theme('transitionDuration.150'),
          transitionTimingFunction: theme('transitionTimingFunction.in-out'),
        },
        'a:hover': {
          color: 'var(--tw-prose-links-hover)',
          textDecorationColor: 'var(--tw-prose-underline-hover)',
        },
        strong: {
          color: 'var(--tw-prose-bold)',
          fontWeight: theme('fontWeight.semibold'),
        },
        code: {
          display: 'inline-block',
          color: 'var(--tw-prose-code)',
          fontSize: theme('fontSize.sm')[0],
          fontWeight: theme('fontWeight.semibold'),
          backgroundColor: 'var(--tw-prose-code-bg)',
          borderRadius: theme('borderRadius.lg'),
          paddingLeft: theme('spacing.1'),
          paddingRight: theme('spacing.1'),
        },
        'a code': {
          color: 'inherit',
        },
        ':is(h2, h3) code': {
          fontWeight: theme('fontWeight.bold'),
        },

        // Quotes
        blockquote: {
          paddingLeft: theme('spacing.6'),
          borderLeftWidth: theme('borderWidth.2'),
          borderLeftColor: 'var(--tw-prose-quote-borders)',
          fontStyle: 'italic',
        },

        // Figures
        figcaption: {
          color: 'var(--tw-prose-captions)',
          fontSize: theme('fontSize.sm')[0],
          lineHeight: theme('lineHeight.6'),
          marginTop: theme('spacing.3'),
        },
        'figcaption > p': {
          margin: 0,
        },

        // Lists - tighter, more cohesive spacing for better readability
        ul: {
          listStyleType: 'disc',
        },
        ol: {
          listStyleType: 'decimal',
        },
        'ul, ol': {
          paddingLeft: theme('spacing.5'),
          marginTop: theme('spacing.4'),
          marginBottom: theme('spacing.4'),
        },
        li: {
          marginTop: theme('spacing.2'),
          marginBottom: theme('spacing.2'),
          paddingLeft: theme('spacing.2'),
        },
        'li::marker': {
          fontSize: theme('fontSize.sm')[0],
          fontWeight: theme('fontWeight.medium'),
        },
        'ol > li::marker': {
          color: 'var(--tw-prose-counters)',
        },
        'ul > li::marker': {
          color: 'var(--tw-prose-bullets)',
        },
        'li :is(ol, ul)': {
          marginTop: theme('spacing.2'),
          marginBottom: theme('spacing.2'),
        },
        'li :is(li, p)': {
          marginTop: theme('spacing.1'),
          marginBottom: theme('spacing.1'),
        },

        // Code blocks
        pre: {
          color: 'var(--tw-prose-pre-code)',
          fontSize: theme('fontSize.sm')[0],
          fontWeight: theme('fontWeight.medium'),
          backgroundColor: 'var(--tw-prose-pre-bg)',
          borderRadius: theme('borderRadius.3xl'),
          padding: theme('spacing.8'),
          overflowX: 'auto',
          border: '1px solid',
          borderColor: 'var(--tw-prose-pre-border)',
        },
        'pre code': {
          display: 'inline',
          color: 'inherit',
          fontSize: 'inherit',
          fontWeight: 'inherit',
          backgroundColor: 'transparent',
          borderRadius: 0,
          padding: 0,
        },

        // Horizontal rules
        hr: {
          marginTop: theme('spacing.20'),
          marginBottom: theme('spacing.20'),
          borderTopWidth: '1px',
          borderColor: 'var(--tw-prose-hr)',
          '@screen lg': {
            marginLeft: `calc(${theme('spacing.12')} * -1)`,
            marginRight: `calc(${theme('spacing.12')} * -1)`,
          },
        },

        // Tables
        table: {
          width: '100%',
          tableLayout: 'auto',
          textAlign: 'left',
          fontSize: theme('fontSize.sm')[0],
        },
        thead: {
          borderBottomWidth: '1px',
          borderBottomColor: 'var(--tw-prose-th-borders)',
        },
        'thead th': {
          color: 'var(--tw-prose-headings)',
          fontWeight: theme('fontWeight.semibold'),
          verticalAlign: 'bottom',
          paddingBottom: theme('spacing.2'),
        },
        'thead th:not(:first-child)': {
          paddingLeft: theme('spacing.2'),
        },
        'thead th:not(:last-child)': {
          paddingRight: theme('spacing.2'),
        },
        'tbody tr': {
          borderBottomWidth: '1px',
          borderBottomColor: 'var(--tw-prose-td-borders)',
        },
        'tbody tr:last-child': {
          borderBottomWidth: 0,
        },
        'tbody td': {
          verticalAlign: 'baseline',
        },
        tfoot: {
          borderTopWidth: '1px',
          borderTopColor: 'var(--tw-prose-th-borders)',
        },
        'tfoot td': {
          verticalAlign: 'top',
        },
        ':is(tbody, tfoot) td': {
          paddingTop: theme('spacing.2'),
          paddingBottom: theme('spacing.2'),
        },
        ':is(tbody, tfoot) td:not(:first-child)': {
          paddingLeft: theme('spacing.2'),
        },
        ':is(tbody, tfoot) td:not(:last-child)': {
          paddingRight: theme('spacing.2'),
        },
      },
    },
  }
}
