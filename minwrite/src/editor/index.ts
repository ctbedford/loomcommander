import { loadContent, saveContent, loadTheme, saveTheme, Theme } from './storage';
import { markdownToHtml } from './markdown';

const DEBOUNCE_MS = 500;

export class Editor {
  private textarea: HTMLTextAreaElement;
  private preview: HTMLElement;
  private saveTimeout: number | null = null;
  private currentTheme: Theme | null = null;
  private helpOverlay: HTMLElement;
  private isPreviewMode = false;

  constructor(container: HTMLElement) {
    this.textarea = document.createElement('textarea');
    this.textarea.className = 'editor';
    this.textarea.placeholder = 'Start writing...';
    this.textarea.autofocus = true;
    this.textarea.value = loadContent();

    this.preview = document.createElement('div');
    this.preview.className = 'preview';

    this.helpOverlay = this.createHelpOverlay();

    this.textarea.addEventListener('input', this.handleInput);
    this.textarea.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('keydown', this.handleGlobalKeydown);

    container.appendChild(this.textarea);
    container.appendChild(this.preview);
    container.appendChild(this.helpOverlay);
    this.textarea.focus();

    this.initTheme();
  }

  private createHelpOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = 'help-overlay';
    const isMac = navigator.platform.includes('Mac');
    const mod = isMac ? '⌘' : 'Ctrl+';
    overlay.innerHTML = `
      <div class="help-content">
        <dl>
          <dt>${mod}/</dt><dd>Show help</dd>
          <dt>${mod}P</dt><dd>Toggle preview</dd>
          <dt>${mod}Shift+L</dt><dd>Toggle dark/light</dd>
          <dt>Tab</dt><dd>Insert 2 spaces</dd>
        </dl>
      </div>
    `;
    overlay.addEventListener('click', () => this.hideHelp());
    return overlay;
  }

  private hideHelp(): void {
    this.helpOverlay.classList.remove('visible');
  }

  private toggleHelp(): void {
    this.helpOverlay.classList.toggle('visible');
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

  private togglePreview(): void {
    this.isPreviewMode = !this.isPreviewMode;

    if (this.isPreviewMode) {
      this.preview.innerHTML = markdownToHtml(this.textarea.value);
      this.textarea.style.display = 'none';
      this.preview.classList.add('visible');
    } else {
      this.textarea.style.display = '';
      this.preview.classList.remove('visible');
      this.textarea.focus();
    }
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
    // Toggle help: Cmd/Ctrl+/
    if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this.toggleHelp();
      return;
    }

    // Dismiss help: Escape
    if (e.key === 'Escape') {
      this.hideHelp();
      return;
    }

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

  private handleGlobalKeydown = (e: KeyboardEvent): void => {
    // Toggle preview: Cmd/Ctrl+P (works from both edit and preview modes)
    if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this.togglePreview();
    }
  };
}
