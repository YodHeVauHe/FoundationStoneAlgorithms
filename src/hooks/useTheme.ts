import { useEffect } from 'react';

export function useTheme() {
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    localStorage.setItem('theme', 'dark');
  }, []);

  return { theme: 'dark' as const, toggleTheme: () => undefined };
}
