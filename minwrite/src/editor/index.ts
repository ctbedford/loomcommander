import { loadContent, saveContent } from './storage';

const DEBOUNCE_MS = 500;

export class Editor {
  private textarea: HTMLTextAreaElement;
  private saveTimeout: number | null = null;

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
