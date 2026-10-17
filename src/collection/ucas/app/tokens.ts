/**
 * App Design Tokens & Brand Specification
 * 
 * Defines the concrete visual identity and design system for the App UCA:
 * - Brand identity (borderless U mark + UCA wordmark)
 * - Pure matte background (#0a0c10) without gradients
 * - Monochromatic clean headings (#e2e8f0)
 * - JavaScript IDE syntax highlighting for body copy and code tokens
 * - Contrast-positive buttons with blue positive hover and garnet destructive hover
 */

export {
  BRAND_ASSETS,
  ICON_ASSETS,
} from './assets.js';

export const BRAND_TOKENS = {
  logo: {
    symbol: 'U',
    wordmark: 'UCA',
    color: '#e2e8f0',
  },
} as const;

export const COLOR_TOKENS = {
  canvas: {
    background: '#0a0c10',
    surface: '#13171f',
    surfaceHover: '#1c212c',
    surfaceActive: '#222936',
    border: '#1e2430',
    borderMuted: '#161a22',
  },
  text: {
    primary: '#e2e8f0',
    secondary: '#cbd5e1',
    muted: '#64748b',
    disabled: '#475569',
  },
  syntax: {
    keyword: '#ff7b72',
    function: '#79c0ff',
    string: '#a5d6ff',
    type: '#d2a8ff',
    constant: '#ffa657',
    number: '#7ee787',
    comment: '#6e7681',
    operator: '#ff7b72',
    variable: '#e2e8f0',
  },
  button: {
    resting: {
      background: '#13171f',
      text: '#e2e8f0',
      border: '#1e2430',
    },
    hoverPositive: {
      background: '#1d4ed8',
      text: '#ffffff',
      border: '#2563eb',
    },
    hoverDestructive: {
      background: '#831843',
      text: '#ffffff',
      border: '#9f1239',
    },
  },
} as const;

export const TYPOGRAPHY_TOKENS = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "Geist Mono", "Fira Code", monospace',
  },
  fontSize: {
    hero: '2.75rem',
    title: '1.75rem',
    body: '1rem',
    code: '0.9rem',
    caption: '0.8rem',
  },
  heading: {
    color: '#e2e8f0',
    letterSpacing: '-0.02em',
    fontWeight: '700',
  },
} as const;

export const BREAKPOINT_TOKENS = {
  sm: '640px',   // Mobile landscape / Small tablets
  md: '768px',   // Tablets
  lg: '1024px',  // Small desktops / Laptops
  xl: '1280px',  // Standard desktops
  '2xl': '1536px', // Large screens / Wide monitors
} as const;

export const LAYOUT_TOKENS = {
  containerMaxWidth: '1200px',
  headerHeight: '64px',
  gutter: {
    mobile: '16px',
    tablet: '24px',
    desktop: '32px',
  },
} as const;

