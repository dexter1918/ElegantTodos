import React, { useEffect } from 'react';
import { useThemeStore } from '@/hooks/use-theme-store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { darkMode } = useThemeStore();

  useEffect(() => {
    // Apply the dark class to the document when darkMode is true
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return <>{children}</>;
}