const STORAGE_KEY = 'minwrite:content';
const THEME_KEY = 'minwrite:theme';
const CURRENT_DOC_KEY = 'minwrite:currentDoc';

export type Theme = 'light' | 'dark';

/** @deprecated Use documents.loadDocument() instead */
export function loadContent(): string {
  return localStorage.getItem(STORAGE_KEY) ?? '';
}

/** @deprecated Use documents.saveDocument() instead */
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

export function getCurrentDocId(): string | null {
  return localStorage.getItem(CURRENT_DOC_KEY);
}

export function setCurrentDocId(id: string): void {
  localStorage.setItem(CURRENT_DOC_KEY, id);
}
