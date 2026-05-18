'use client';

import React, { type CSSProperties, type ReactNode } from 'react';
import { colors, borderRadius, typography, semantic } from '@/styles/theme';

type BadgeVariant = 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  icon?: ReactNode;
  style?: CSSProperties;
}

export default function Badge({
  children,
  variant = 'brand',
  size = 'md',
  dot = false,
  icon,
  style,
}: BadgeProps) {
  const bgMap: Record<BadgeVariant, string> = {
    brand: semantic.bg.brandSubtle,
    accent: semantic.bg.accentSubtle,
    success: semantic.bg.success,
    warning: semantic.bg.warning,
    danger: semantic.bg.danger,
    neutral: semantic.bg.tertiary,
  };

  const textMap: Record<BadgeVariant, string> = {
    brand: semantic.text.brand,
    accent: semantic.text.accent,
    success: semantic.text.success,
    warning: semantic.text.warning,
    danger: semantic.text.danger,
    neutral: semantic.text.secondary,
  };

  const dotColorMap: Record<BadgeVariant, string> = {
    brand: colors.brand[400],
    accent: colors.accent[400],
    success: colors.success[400],
    warning: colors.warning[400],
    danger: colors.danger[400],
    neutral: colors.neutral[400],
  };

  const badgeStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: size === 'sm' ? '0.125rem 0.5rem' : '0.25rem 0.75rem',
    borderRadius: borderRadius.full,
    fontSize: size === 'sm' ? typography.fontSize.xs : typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    background: bgMap[variant],
    color: textMap[variant],
    letterSpacing: '0.01em',
    lineHeight: 1.5,
    ...style,
  };

  const dotStyle: CSSProperties = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: dotColorMap[variant],
    flexShrink: 0,
  };

  return (
    <span style={badgeStyle}>
      {dot && <span style={dotStyle} />}
      {icon}
      {children}
    </span>
  );
}
