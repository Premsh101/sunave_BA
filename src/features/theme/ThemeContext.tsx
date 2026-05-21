'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type AppTheme = 'dark' | 'light' | 'ocean' | 'slate';

export const THEMES: { value: AppTheme; label: string; description: string; preview: { bg: string; text: string; accent: string } }[] = [
  {
    value: 'dark',
    label: 'Dark',
    description: 'Classic dark theme — easy on the eyes',
    preview: { bg: '#09090B', text: '#FFFFFF', accent: '#818CF8' },
  },
  {
    value: 'light',
    label: 'Light',
    description: 'Clean light theme for bright environments',
    preview: { bg: '#FFFFFF', text: '#09090B', accent: '#4F46E5' },
  },
  {
    value: 'ocean',
    label: 'Ocean',
    description: 'Deep blue ocean-inspired theme',
    preview: { bg: '#0a1628', text: '#E0F2FE', accent: '#38BDF8' },
  },
  {
    value: 'slate',
    label: 'Slate',
    description: 'Cool slate with purple accents',
    preview: { bg: '#0f172a', text: '#F1F5F9', accent: '#A78BFA' },
  },
];

const THEME_STORAGE_KEY = 'sunave-theme';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>('dark');

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme | null;
    if (stored && THEMES.some((t) => t.value === stored)) {
      applyTheme(stored);
      setThemeState(stored);
    }
  }, []);

  const applyTheme = (t: AppTheme) => {
    const html = document.documentElement;
    THEMES.forEach(({ value }) => html.classList.remove(`theme-${value}`));
    html.classList.add(`theme-${t}`);
  };

  const setTheme = (t: AppTheme) => {
    applyTheme(t);
    setThemeState(t);
    localStorage.setItem(THEME_STORAGE_KEY, t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
