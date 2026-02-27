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

// Token highlighting pastels (14 distinct-hue colors)
export const TOKEN_HIGHLIGHT_COLORS = [
  '#fce8c8', // warm peach
  '#d4edda', // soft green
  '#d6e9f8', // light blue
  '#f0d0e0', // pink
  '#fff3cd', // pale yellow
  '#e0d4f5', // lavender
  '#d4f0ed', // mint
  '#fde2c8', // apricot
  '#cce5ff', // sky blue
  '#f5e6d3', // tan
  '#e8d5f5', // lilac
  '#d0f0d0', // pale green
  '#ffe0e0', // blush
  '#e0e8d0', // sage
] as const;
