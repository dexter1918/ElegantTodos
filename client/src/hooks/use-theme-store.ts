import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleTheme: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'theme-storage',
    }
  )
);