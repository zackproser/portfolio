// Shared theme colors for demo pages
// Hex values for SVG/inline styles — must match tailwind.config.ts

export const THEME_HEX = {
  burnt400: '#e67e22',
  burnt500: '#d35400',
  amber400: '#f39c12',
  amber500: '#f59e0b',
  amber600: '#d97706',
  parchment50: '#fefdfb',
  parchment100: '#fbf7f0',
  parchment600: '#8b7355',
  charcoal: '#2a2a2a',
} as const;

// Token highlighting pastels (14 warm-family colors)
export const TOKEN_HIGHLIGHT_COLORS = [
  '#f5e6d3', '#fce8c8', '#e8d5c0', '#f0dcc8', '#ddd0c0',
  '#e5d8c8', '#f8eed8', '#ebe0d0', '#d8cbb8', '#f0e4d0',
  '#e0d4c4', '#f5ead8', '#ddd2c2', '#e8dcd0',
] as const;
