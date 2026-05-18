'use client';

import React, { useState, type CSSProperties, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { colors, gradients, borderRadius, typography, shadows, transitions, semantic } from '@/styles/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const getVariantStyles = (variant: ButtonVariant, hovered: boolean): CSSProperties => {
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.fontWeight.semibold,
    borderRadius: borderRadius.lg,
    cursor: 'pointer',
    transition: transitions.base,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    border: 'none',
    position: 'relative',
    overflow: 'hidden',
  };

  switch (variant) {
    case 'primary':
      return {
        ...base,
        background: hovered
          ? `linear-gradient(135deg, ${colors.brand[400]} 0%, ${colors.accent[400]} 100%)`
          : gradients.brand,
        color: colors.neutral[0],
        boxShadow: hovered ? shadows.glowBrand : shadows.button,
        transform: hovered ? 'translateY(-1px)' : 'none',
      };
    case 'secondary':
      return {
        ...base,
        background: hovered ? semantic.bg.elevated : 'transparent',
        color: semantic.text.primary,
        border: `1px solid ${hovered ? semantic.border.secondary : semantic.border.primary}`,
      };
    case 'ghost':
      return {
        ...base,
        background: hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
        color: hovered ? semantic.text.primary : semantic.text.secondary,
      };
    case 'danger':
      return {
        ...base,
        background: hovered ? colors.danger[600] : colors.danger[500],
        color: colors.neutral[0],
        boxShadow: hovered ? `0 0 20px rgba(239,68,68,0.3)` : 'none',
      };
    case 'accent':
      return {
        ...base,
        background: hovered
          ? `linear-gradient(135deg, ${colors.accent[400]} 0%, ${colors.brand[400]} 100%)`
          : `linear-gradient(135deg, ${colors.accent[500]} 0%, ${colors.brand[500]} 100%)`,
        color: colors.neutral[0],
        boxShadow: hovered ? shadows.glowAccent : 'none',
        transform: hovered ? 'translateY(-1px)' : 'none',
      };
    default:
      return base;
  }
};

const getSizeStyles = (size: ButtonSize): CSSProperties => {
  switch (size) {
    case 'sm':
      return { padding: '0.5rem 1rem', fontSize: typography.fontSize.xs };
    case 'md':
      return { padding: '0.625rem 1.25rem', fontSize: typography.fontSize.sm };
    case 'lg':
      return { padding: '0.75rem 1.5rem', fontSize: typography.fontSize.base };
    case 'xl':
      return { padding: '1rem 2rem', fontSize: typography.fontSize.lg };
    default:
      return { padding: '0.625rem 1.25rem', fontSize: typography.fontSize.sm };
  }
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  disabled,
  children,
  style,
  ...props
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  const isDisabled = disabled || loading;

  const combinedStyle: CSSProperties = {
    ...getVariantStyles(variant, hovered && !isDisabled),
    ...getSizeStyles(size),
    ...(fullWidth ? { width: '100%' } : {}),
    ...(isDisabled ? { opacity: 0.5, cursor: 'not-allowed', transform: 'none' } : {}),
    ...style,
  };

  return (
    <button
      style={combinedStyle}
      disabled={isDisabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 14 : 16} style={{ animation: 'spin 1s linear infinite' }} />
      ) : icon ? (
        icon
      ) : null}
      {children}
      {iconRight && !loading ? iconRight : null}
    </button>
  );
}
