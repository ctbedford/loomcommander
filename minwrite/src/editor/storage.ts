const STORAGE_KEY = 'minwrite:content';
const THEME_KEY = 'minwrite:theme';

export type Theme = 'light' | 'dark';

export function loadContent(): string {
  return localStorage.getItem(STORAGE_KEY) ?? '';
}

export function saveContent(content: string): void {
  localStorage.setItem(STORAGE_KEY, content);
}

export function loadTheme(): Theme | null {
  const theme = localStorage.getItem(THEME_KEY);
  return theme === 'light' || theme === 'dark' ? theme : null;
}

export function saveTheme(theme: Theme | null): void {
  if (theme === null) {
    localStorage.removeItem(THEME_KEY);
  } else {
    localStorage.setItem(THEME_KEY, theme);
  }
}
