// Shared theme colors for demo pages
// Hex values for SVG/inline styles

export const THEME_HEX = {
  burnt400: '#c2956a',
  burnt500: '#a67c52',
  amber400: '#f59e0b',
  amber500: '#d97706',
  parchment50: '#faf6f0',
  parchment100: '#f5ede0',
  parchment600: '#8a7a6a',
  charcoal: '#2a2a2a',
} as const;

// 8-color data visualization palette
export const DATA_VIZ_PALETTE = [
  '#a67c52', // burnt
  '#d97706', // amber
  '#8a7a6a', // parchment-600
  '#5a8a72', // sage
  '#b85c5c', // clay
  '#5a7a8a', // slate-blue
  '#a8697a', // dusty-rose
  '#7a7a6a', // warm-stone
] as const;

// Token highlighting pastels (14 warm-family colors)
export const TOKEN_HIGHLIGHT_COLORS = [
  '#f5e6d3', '#fce8c8', '#e8d5c0', '#f0dcc8', '#ddd0c0',
  '#e5d8c8', '#f8eed8', '#ebe0d0', '#d8cbb8', '#f0e4d0',
  '#e0d4c4', '#f5ead8', '#ddd2c2', '#e8dcd0',
] as const;

// Pipeline stroke color map for RAG/Voice demos
export const PIPELINE_COLORS = {
  primary: '#a67c52',
  secondary: '#d97706',
  accent: '#c2956a',
  muted: '#8a7a6a',
} as const;

// Reusable Tailwind class constants
export const ACCENT_CLASSES = {
  text: 'text-burnt-500 dark:text-amber-400',
  textLight: 'text-burnt-400 dark:text-amber-300',
  bg: 'bg-burnt-500 dark:bg-amber-500',
  bgLight: 'bg-burnt-50 dark:bg-amber-900/20',
  border: 'border-burnt-400 dark:border-amber-500',
  gradient: 'from-burnt-500 to-amber-600',
  gradientLight: 'from-burnt-50 to-amber-50 dark:from-burnt-900/20 dark:to-amber-900/20',
} as const;
