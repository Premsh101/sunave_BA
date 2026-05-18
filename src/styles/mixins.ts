// Sunave — Reusable Style Mixins
// Use these factories to create consistent inline style objects

import { colors, gradients, shadows, borderRadius, transitions, typography, semantic } from './theme';
import type { CSSProperties } from 'react';

// Glassmorphism card
export const glassCard = (options?: { blur?: number; opacity?: number; border?: boolean }): CSSProperties => ({
  background: gradients.glass,
  backdropFilter: `blur(${options?.blur ?? 16}px)`,
  WebkitBackdropFilter: `blur(${options?.blur ?? 16}px)`,
  border: options?.border !== false ? `1px solid rgba(255,255,255,${options?.opacity ?? 0.06})` : 'none',
  borderRadius: borderRadius.xl,
});

// Glass surface for darker elements
export const glassSurface = (options?: { blur?: number }): CSSProperties => ({
  background: gradients.glassDark,
  backdropFilter: `blur(${options?.blur ?? 12}px)`,
  WebkitBackdropFilter: `blur(${options?.blur ?? 12}px)`,
  border: `1px solid ${semantic.border.subtle}`,
  borderRadius: borderRadius.lg,
});

// Gradient text
export const gradientText = (gradient?: string): CSSProperties => ({
  background: gradient ?? gradients.text,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

// Hero heading
export const heroHeading: CSSProperties = {
  fontSize: typography.fontSize['6xl'],
  fontWeight: typography.fontWeight.extrabold,
  lineHeight: typography.lineHeight.tight,
  letterSpacing: typography.letterSpacing.tighter,
  ...gradientText(gradients.textHero),
};

// Section heading
export const sectionHeading: CSSProperties = {
  fontSize: typography.fontSize['4xl'],
  fontWeight: typography.fontWeight.bold,
  lineHeight: typography.lineHeight.tight,
  letterSpacing: typography.letterSpacing.tight,
  color: semantic.text.primary,
};

// Card with hover elevation
export const elevatedCard: CSSProperties = {
  ...glassCard(),
  boxShadow: shadows.card,
  transition: transitions.smooth,
  cursor: 'pointer',
};

// Primary button styles
export const buttonPrimary: CSSProperties = {
  background: gradients.brand,
  color: colors.neutral[0],
  border: 'none',
  borderRadius: borderRadius.lg,
  padding: '0.75rem 1.5rem',
  fontSize: typography.fontSize.sm,
  fontWeight: typography.fontWeight.semibold,
  fontFamily: typography.fontFamily.sans,
  cursor: 'pointer',
  transition: transitions.base,
  boxShadow: shadows.button,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

// Secondary button
export const buttonSecondary: CSSProperties = {
  background: 'transparent',
  color: semantic.text.primary,
  border: `1px solid ${semantic.border.secondary}`,
  borderRadius: borderRadius.lg,
  padding: '0.75rem 1.5rem',
  fontSize: typography.fontSize.sm,
  fontWeight: typography.fontWeight.medium,
  fontFamily: typography.fontFamily.sans,
  cursor: 'pointer',
  transition: transitions.base,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

// Ghost button
export const buttonGhost: CSSProperties = {
  background: 'transparent',
  color: semantic.text.secondary,
  border: 'none',
  borderRadius: borderRadius.lg,
  padding: '0.5rem 1rem',
  fontSize: typography.fontSize.sm,
  fontWeight: typography.fontWeight.medium,
  fontFamily: typography.fontFamily.sans,
  cursor: 'pointer',
  transition: transitions.base,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  textDecoration: 'none',
};

// Input field
export const inputField: CSSProperties = {
  width: '100%',
  background: semantic.bg.tertiary,
  color: semantic.text.primary,
  border: `1px solid ${semantic.border.primary}`,
  borderRadius: borderRadius.lg,
  padding: '0.75rem 1rem',
  fontSize: typography.fontSize.sm,
  fontFamily: typography.fontFamily.sans,
  transition: transitions.base,
  outline: 'none',
};

// Badge
export const badge = (variant: 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral' = 'brand'): CSSProperties => {
  const bgMap = {
    brand: semantic.bg.brandSubtle,
    accent: semantic.bg.accentSubtle,
    success: semantic.bg.success,
    warning: semantic.bg.warning,
    danger: semantic.bg.danger,
    neutral: semantic.bg.tertiary,
  };
  const textMap = {
    brand: semantic.text.brand,
    accent: semantic.text.accent,
    success: semantic.text.success,
    warning: semantic.text.warning,
    danger: semantic.text.danger,
    neutral: semantic.text.secondary,
  };
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.25rem 0.75rem',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    background: bgMap[variant],
    color: textMap[variant],
    border: `1px solid ${bgMap[variant]}`,
  };
};

// Container
export const container: CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '0 1.5rem',
  width: '100%',
};

// Section wrapper
export const section: CSSProperties = {
  padding: '6rem 0',
  position: 'relative',
};

// Flex helpers
export const flexCenter: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const flexBetween: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const flexColumn: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

// Grid
export const grid = (cols: number, gap?: string): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${cols}, 1fr)`,
  gap: gap ?? '1.5rem',
});

// Floating animation wrapper
export const floatingElement: CSSProperties = {
  animation: 'float 6s ease-in-out infinite',
};

// Shimmer effect
export const shimmer: CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
};

// Truncate text
export const truncate: CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

// Sidebar item
export const sidebarItem = (active: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.625rem 0.75rem',
  borderRadius: borderRadius.lg,
  fontSize: typography.fontSize.sm,
  fontWeight: active ? typography.fontWeight.medium : typography.fontWeight.normal,
  color: active ? semantic.text.brand : semantic.text.tertiary,
  background: active ? semantic.bg.brandSubtle : 'transparent',
  transition: transitions.fast,
  cursor: 'pointer',
  textDecoration: 'none',
  border: 'none',
  width: '100%',
  textAlign: 'left' as const,
});

// Recording bar
export const recordingBar: CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: '64px',
  background: semantic.bg.secondary,
  borderTop: `1px solid ${semantic.border.primary}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  zIndex: 200,
  backdropFilter: 'blur(16px)',
};
