'use client';

import React, { useState, useRef, useEffect, type CSSProperties } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme, THEMES } from '@/features/theme/ThemeContext';
import { typography, borderRadius, transitions, semantic, shadows, zIndex } from '@/styles/theme';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const btnStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    background: hovered ? semantic.bg.tertiary : 'transparent',
    border: `1px solid ${hovered ? semantic.border.secondary : 'transparent'}`,
    color: semantic.text.secondary,
    cursor: 'pointer',
    transition: transitions.fast,
    position: 'relative',
  };

  const dropdownStyle: CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    minWidth: 220,
    background: semantic.bg.elevated,
    border: `1px solid ${semantic.border.primary}`,
    borderRadius: borderRadius.xl,
    boxShadow: shadows.xl,
    zIndex: zIndex.dropdown,
    overflow: 'hidden',
    animation: 'slideDown 0.18s cubic-bezier(0.4,0,0.2,1) both',
  };

  const headerStyle: CSSProperties = {
    padding: '0.625rem 0.875rem',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: semantic.text.muted,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderBottom: `1px solid ${semantic.border.subtle}`,
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        style={btnStyle}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Select theme"
        title="Change theme"
      >
        <Palette size={16} />
      </button>

      {open && (
        <div style={dropdownStyle}>
          <div style={headerStyle}>Theme</div>
          {THEMES.map((t) => (
            <ThemeOption
              key={t.value}
              t={t}
              isActive={theme === t.value}
              onSelect={() => { setTheme(t.value); setOpen(false); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeOption({
  t,
  isActive,
  onSelect,
}: {
  t: typeof THEMES[number];
  isActive: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const rowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.625rem 0.875rem',
    cursor: 'pointer',
    background: hovered || isActive ? semantic.bg.surface : 'transparent',
    transition: transitions.fast,
  };

  const previewStyle: CSSProperties = {
    width: 28,
    height: 28,
    borderRadius: borderRadius.base,
    background: t.preview.bg,
    border: `2px solid ${isActive ? t.preview.accent : 'transparent'}`,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
  };

  const dotStyle: CSSProperties = {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: t.preview.accent,
  };

  return (
    <div
      style={rowStyle}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={previewStyle}>
        <div style={dotStyle} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: semantic.text.primary }}>
          {t.label}
        </div>
        <div style={{ fontSize: typography.fontSize.xs, color: semantic.text.muted }}>
          {t.description}
        </div>
      </div>
      {isActive && <Check size={14} color={t.preview.accent} />}
    </div>
  );
}
