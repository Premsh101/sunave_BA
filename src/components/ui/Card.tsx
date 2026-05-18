'use client';

import React, { useState, type CSSProperties, type ReactNode } from 'react';
import { gradients, shadows, borderRadius, transitions, semantic } from '@/styles/theme';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'outline' | 'gradient';
  hoverable?: boolean;
  padding?: string;
  style?: CSSProperties;
  onClick?: () => void;
  className?: string;
}

export default function Card({
  children,
  variant = 'default',
  hoverable = false,
  padding = '1.5rem',
  style,
  onClick,
}: CardProps) {
  const [hovered, setHovered] = useState(false);

  const getVariantStyles = (): CSSProperties => {
    switch (variant) {
      case 'glass':
        return {
          background: hovered && hoverable ? gradients.cardHover : gradients.glass,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${hovered && hoverable ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)'}`,
          boxShadow: hovered && hoverable ? shadows.cardHover : shadows.card,
        };
      case 'elevated':
        return {
          background: semantic.bg.elevated,
          border: `1px solid ${semantic.border.subtle}`,
          boxShadow: hovered && hoverable ? shadows.lg : shadows.md,
        };
      case 'outline':
        return {
          background: 'transparent',
          border: `1px solid ${hovered && hoverable ? semantic.border.brandSubtle : semantic.border.primary}`,
        };
      case 'gradient':
        return {
          background: hovered && hoverable ? gradients.cardHover : gradients.card,
          border: `1px solid rgba(255,255,255,0.08)`,
          boxShadow: hovered && hoverable ? shadows.cardHover : shadows.card,
        };
      default:
        return {
          background: semantic.bg.tertiary,
          border: `1px solid ${semantic.border.primary}`,
          boxShadow: hovered && hoverable ? shadows.md : shadows.sm,
        };
    }
  };

  const cardStyle: CSSProperties = {
    borderRadius: borderRadius.xl,
    padding,
    transition: transitions.smooth,
    cursor: hoverable || onClick ? 'pointer' : 'default',
    transform: hovered && hoverable ? 'translateY(-2px)' : 'none',
    ...getVariantStyles(),
    ...style,
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
