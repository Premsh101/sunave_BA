// Sunave Design System — Theme Tokens
// All styling uses inline styles referencing these tokens. NO Tailwind.

export const colors = {
  // Brand
  brand: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
    950: '#1E1B4B',
  },
  // Accent — Cyan/Teal for energy
  accent: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },
  // Success
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
  },
  // Warning
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
  },
  // Danger
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
  },
  // Neutral — Dark mode first
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    850: '#1F1F23',
    900: '#18181B',
    925: '#121215',
    950: '#09090B',
  },
} as const;

export const gradients = {
  brand: `linear-gradient(135deg, ${colors.brand[500]} 0%, ${colors.accent[500]} 100%)`,
  brandSubtle: `linear-gradient(135deg, ${colors.brand[600]} 0%, ${colors.brand[400]} 100%)`,
  brandDark: `linear-gradient(135deg, ${colors.brand[900]} 0%, ${colors.neutral[950]} 100%)`,
  hero: `linear-gradient(135deg, ${colors.brand[600]} 0%, ${colors.accent[600]} 50%, ${colors.brand[500]} 100%)`,
  heroRadial: `radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.1) 0%, transparent 50%)`,
  glass: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
  glassDark: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
  sidebar: `linear-gradient(180deg, ${colors.neutral[925]} 0%, ${colors.neutral[950]} 100%)`,
  card: `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)`,
  cardHover: `linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(6,182,212,0.04) 100%)`,
  text: `linear-gradient(135deg, ${colors.brand[400]} 0%, ${colors.accent[400]} 100%)`,
  textHero: `linear-gradient(135deg, ${colors.neutral[0]} 0%, ${colors.neutral[300]} 100%)`,
  glow: `radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)`,
  mesh: `
    radial-gradient(at 40% 20%, rgba(99,102,241,0.12) 0px, transparent 50%),
    radial-gradient(at 80% 0%, rgba(6,182,212,0.08) 0px, transparent 50%),
    radial-gradient(at 0% 50%, rgba(99,102,241,0.06) 0px, transparent 50%),
    radial-gradient(at 80% 50%, rgba(6,182,212,0.04) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(99,102,241,0.08) 0px, transparent 50%)
  `,
  pricing: `linear-gradient(135deg, ${colors.brand[500]} 0%, ${colors.accent[500]} 50%, ${colors.brand[400]} 100%)`,
} as const;

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    display: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  64: '16rem',
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0,0,0,0.3)',
  base: '0 1px 3px 0 rgba(0,0,0,0.4), 0 1px 2px -1px rgba(0,0,0,0.4)',
  md: '0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.4)',
  lg: '0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -4px rgba(0,0,0,0.4)',
  xl: '0 20px 25px -5px rgba(0,0,0,0.4), 0 8px 10px -6px rgba(0,0,0,0.4)',
  '2xl': '0 25px 50px -12px rgba(0,0,0,0.5)',
  inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.3)',
  glow: `0 0 20px rgba(99,102,241,0.3), 0 0 40px rgba(99,102,241,0.1)`,
  glowAccent: `0 0 20px rgba(6,182,212,0.3), 0 0 40px rgba(6,182,212,0.1)`,
  glowBrand: `0 0 30px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.15)`,
  card: '0 0 0 1px rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.3)',
  cardHover: '0 0 0 1px rgba(99,102,241,0.2), 0 8px 32px rgba(0,0,0,0.4)',
  button: '0 0 0 1px rgba(99,102,241,0.5), 0 2px 8px rgba(99,102,241,0.2)',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  base: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.25rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const transitions = {
  fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  base: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  bounce: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
  toast: 700,
  max: 9999,
} as const;

// Semantic tokens — references CSS variables for theming support
// CSS variables are defined per-theme in globals.css
export const semantic = {
  bg: {
    primary: 'var(--bg-primary)',
    secondary: 'var(--bg-secondary)',
    tertiary: 'var(--bg-tertiary)',
    elevated: 'var(--bg-elevated)',
    surface: 'var(--bg-surface)',
    surfaceHover: 'var(--bg-surface-hover)',
    overlay: 'var(--bg-overlay)',
    brand: 'var(--bg-brand)',
    brandSubtle: 'var(--bg-brand-subtle)',
    accent: 'var(--bg-accent)',
    accentSubtle: 'var(--bg-accent-subtle)',
    success: 'var(--bg-success)',
    warning: 'var(--bg-warning)',
    danger: 'var(--bg-danger)',
  },
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    tertiary: 'var(--text-tertiary)',
    muted: 'var(--text-muted)',
    brand: 'var(--text-brand)',
    accent: 'var(--text-accent)',
    success: 'var(--text-success)',
    warning: 'var(--text-warning)',
    danger: 'var(--text-danger)',
    inverse: 'var(--text-inverse)',
  },
  border: {
    primary: 'var(--border-primary)',
    secondary: 'var(--border-secondary)',
    subtle: 'var(--border-subtle)',
    brand: 'var(--border-brand)',
    brandSubtle: 'var(--border-brand-subtle)',
    focus: 'var(--border-focus)',
    danger: 'var(--border-danger)',
  },
} as const;

export const theme = {
  colors,
  gradients,
  typography,
  spacing,
  shadows,
  borderRadius,
  breakpoints,
  transitions,
  zIndex,
  semantic,
} as const;

export default theme;
