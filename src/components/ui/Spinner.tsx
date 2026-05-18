'use client';

import React, { type CSSProperties } from 'react';
import { Loader2 } from 'lucide-react';
import { colors, gradients } from '@/styles/theme';

interface SpinnerProps {
  size?: number;
  color?: string;
  style?: CSSProperties;
}

export default function Spinner({ size = 24, color, style }: SpinnerProps) {
  return (
    <Loader2
      size={size}
      style={{
        animation: 'spin 1s linear infinite',
        color: color ?? colors.brand[400],
        ...style,
      }}
    />
  );
}

// Full-page loading spinner
export function PageLoader() {
  const containerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: colors.neutral[950],
  };

  const innerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  };

  const textStyle: CSSProperties = {
    fontSize: '0.875rem',
    color: colors.neutral[400],
    letterSpacing: '0.05em',
  };

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: `3px solid ${colors.neutral[800]}`,
          borderTopColor: colors.brand[500],
          animation: 'spin 0.8s linear infinite',
        }} />
        <span style={textStyle}>Loading Sunave...</span>
      </div>
    </div>
  );
}
