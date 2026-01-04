import { loadContent, saveContent, loadTheme, saveTheme, Theme } from './storage';

const DEBOUNCE_MS = 500;

export class Editor {
  private textarea: HTMLTextAreaElement;
  private saveTimeout: number | null = null;
  private currentTheme: Theme | null = null;

  constructor(container: HTMLElement) {
    this.textarea = document.createElement('textarea');
    this.textarea.className = 'editor';
    this.textarea.placeholder = 'Start writing...';
    this.textarea.autofocus = true;
    this.textarea.value = loadContent();

    this.textarea.addEventListener('input', this.handleInput);
    this.textarea.addEventListener('keydown', this.handleKeydown);

    container.appendChild(this.textarea);
    this.textarea.focus();

    this.initTheme();
  }

  private initTheme(): void {
    this.currentTheme = loadTheme();
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.currentTheme) {
      document.documentElement.setAttribute('data-theme', this.currentTheme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  private toggleTheme(): void {
    const isDark = this.currentTheme === 'dark' ||
      (this.currentTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);

    this.currentTheme = isDark ? 'light' : 'dark';
    saveTheme(this.currentTheme);
    this.applyTheme();
  }

  private handleInput = (): void => {
    if (this.saveTimeout !== null) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = window.setTimeout(() => {
      saveContent(this.textarea.value);
      this.saveTimeout = null;
    }, DEBOUNCE_MS);
  };

  private handleKeydown = (e: KeyboardEvent): void => {
    // Toggle theme: Cmd/Ctrl+Shift+L
    if (e.key === 'L' && e.shiftKey && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this.toggleTheme();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const start = this.textarea.selectionStart;
      const end = this.textarea.selectionEnd;
      const value = this.textarea.value;

      this.textarea.value = value.slice(0, start) + '  ' + value.slice(end);
      this.textarea.selectionStart = this.textarea.selectionEnd = start + 2;
      this.handleInput();
    }
  };
}
