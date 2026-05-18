'use client';

import React, { type CSSProperties } from 'react';
import { colors, borderRadius, semantic } from '@/styles/theme';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: number;
  style?: CSSProperties;
}

export default function Avatar({ src, name, size = 36, style }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const avatarStyle: CSSProperties = {
    width: size,
    height: size,
    borderRadius: borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.35,
    fontWeight: 600,
    flexShrink: 0,
    overflow: 'hidden',
    background: `linear-gradient(135deg, ${colors.brand[500]} 0%, ${colors.accent[500]} 100%)`,
    color: colors.neutral[0],
    ...style,
  };

  if (src) {
    return (
      <div style={avatarStyle}>
        <img
          src={src}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    );
  }

  return <div style={avatarStyle}>{initials}</div>;
}
