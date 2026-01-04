const STORAGE_KEY = 'minwrite:content';

export function loadContent(): string {
  return localStorage.getItem(STORAGE_KEY) ?? '';
}

export function saveContent(content: string): void {
  localStorage.setItem(STORAGE_KEY, content);
}
