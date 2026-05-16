'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { themes, themeMap, defaultTheme } from '@/lib/themes';
import type { Theme, ThemeId } from '@/types/themes';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (id: ThemeId) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'nova-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    const active = stored && themeMap[stored] ? themeMap[stored] : defaultTheme;
    document.documentElement.setAttribute('data-theme', active.id);
    setThemeState(active);
  }, []);

  function setTheme(id: ThemeId) {
    const t = themeMap[id];
    if (!t) return;
    document.documentElement.setAttribute('data-theme', t.id);
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t.id);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
