'use client';

import React, { useState, type CSSProperties, type InputHTMLAttributes, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { colors, borderRadius, typography, transitions, semantic } from '@/styles/theme';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  icon,
  fullWidth = true,
  type,
  style,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const wrapperStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
    width: fullWidth ? '100%' : 'auto',
  };

  const labelStyle: CSSProperties = {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: error ? semantic.text.danger : semantic.text.secondary,
    transition: transitions.fast,
  };

  const inputWrapperStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    background: semantic.bg.tertiary,
    color: semantic.text.primary,
    border: `1px solid ${error ? semantic.border.danger : focused ? semantic.border.brand : semantic.border.primary}`,
    borderRadius: borderRadius.lg,
    padding: icon ? '0.75rem 1rem 0.75rem 2.75rem' : '0.75rem 1rem',
    paddingRight: isPassword ? '2.75rem' : '1rem',
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.sans,
    transition: transitions.base,
    outline: 'none',
    boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)'}` : 'none',
    ...style,
  };

  const iconStyle: CSSProperties = {
    position: 'absolute',
    left: '0.875rem',
    color: focused ? semantic.text.brand : semantic.text.muted,
    transition: transitions.fast,
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
  };

  const passwordToggleStyle: CSSProperties = {
    position: 'absolute',
    right: '0.5rem',
    background: 'none',
    border: 'none',
    color: semantic.text.muted,
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    borderRadius: borderRadius.base,
    transition: transitions.fast,
  };

  const hintStyle: CSSProperties = {
    fontSize: typography.fontSize.xs,
    color: error ? semantic.text.danger : semantic.text.muted,
  };

  return (
    <div style={wrapperStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={inputWrapperStyle}>
        {icon && <span style={iconStyle}>{icon}</span>}
        <input
          ref={ref}
          type={inputType}
          style={inputStyle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            style={passwordToggleStyle}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {(error || hint) && <span style={hintStyle}>{error || hint}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
