import { loadTheme, saveTheme, Theme, getCurrentDocId, setCurrentDocId } from './storage';
import { markdownToHtml } from './markdown';
import { CommandPalette } from './palette';
import {
  createDocument,
  loadDocument,
  saveDocument,
  listDocuments,
  migrateFromLocalStorage,
} from '../library/documents';

const DEBOUNCE_MS = 500;

export class Editor {
  private textarea: HTMLTextAreaElement;
  private preview: HTMLElement;
  private saveTimeout: number | null = null;
  private currentTheme: Theme | null = null;
  private helpOverlay: HTMLElement;
  private isPreviewMode = false;
  private currentDocId: string | null = null;
  private palette: CommandPalette;

  constructor(container: HTMLElement) {

    this.textarea = document.createElement('textarea');
    this.textarea.className = 'editor';
    this.textarea.placeholder = 'Start writing...';
    this.textarea.autofocus = true;

    this.preview = document.createElement('div');
    this.preview.className = 'preview';

    this.helpOverlay = this.createHelpOverlay();

    this.palette = new CommandPalette(container, (id) => this.handlePaletteSelect(id));

    this.textarea.addEventListener('input', this.handleInput);
    this.textarea.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('keydown', this.handleGlobalKeydown);

    container.appendChild(this.textarea);
    container.appendChild(this.preview);
    container.appendChild(this.helpOverlay);

    this.initTheme();
  }

  async init(): Promise<void> {
    // Try to migrate from old localStorage format
    const migratedId = await migrateFromLocalStorage();
    if (migratedId) {
      this.currentDocId = migratedId;
      setCurrentDocId(migratedId);
    } else {
      // Check for existing current doc
      this.currentDocId = getCurrentDocId();
    }

    // Load current doc or create new one
    if (this.currentDocId) {
      const doc = await loadDocument(this.currentDocId);
      if (doc) {
        this.textarea.value = doc.content;
      } else {
        // Doc was deleted, create new
        await this.newDocument();
      }
    } else {
      // No current doc, create new
      await this.newDocument();
    }

    this.textarea.focus();
  }

  private async newDocument(): Promise<void> {
    await this.saveCurrentDocument();
    const doc = await createDocument();
    this.currentDocId = doc.id;
    setCurrentDocId(doc.id);
    this.textarea.value = '';
    this.textarea.focus();
  }

  private async switchToDocument(id: string): Promise<void> {
    if (id === this.currentDocId) return;
    await this.saveCurrentDocument();
    const doc = await loadDocument(id);
    if (doc) {
      this.currentDocId = doc.id;
      setCurrentDocId(doc.id);
      this.textarea.value = doc.content;
      this.textarea.focus();
    }
  }

  private async saveCurrentDocument(): Promise<void> {
    if (this.currentDocId && this.textarea.value) {
      await saveDocument(this.currentDocId, this.textarea.value);
    }
  }

  private async handlePaletteSelect(id: string | null): Promise<void> {
    if (id === null) {
      await this.newDocument();
    } else {
      await this.switchToDocument(id);
    }
  }

  private async openPalette(): Promise<void> {
    const docs = await listDocuments();
    this.palette.open(docs, this.currentDocId);
  }

  private async closeDocument(): Promise<void> {
    await this.saveCurrentDocument();
    const docs = await listDocuments();
    const otherDocs = docs.filter((d) => d.id !== this.currentDocId);
    if (otherDocs.length > 0) {
      await this.switchToDocument(otherDocs[0].id);
    } else {
      await this.newDocument();
    }
  }

  private createHelpOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = 'help-overlay';
    const isMac = navigator.platform.includes('Mac');
    const mod = isMac ? '⌘' : 'Ctrl+';
    overlay.innerHTML = `
      <div class="help-content">
        <dl>
          <dt>${mod}O</dt><dd>Open document</dd>
          <dt>${mod}N</dt><dd>New document</dd>
          <dt>${mod}W</dt><dd>Close document</dd>
          <dt>${mod}P</dt><dd>Toggle preview</dd>
          <dt>${mod}Shift+L</dt><dd>Toggle dark/light</dd>
          <dt>${mod}/</dt><dd>Show help</dd>
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
      if (this.currentDocId) {
        saveDocument(this.currentDocId, this.textarea.value);
      }
      this.saveTimeout = null;
    }, DEBOUNCE_MS);
  };

  private handleKeydown = (e: KeyboardEvent): void => {
    // Palette is handled by its own keydown listener
    if (this.palette.isOpen()) {
      return;
    }

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
    // Palette takes precedence
    if (this.palette.isOpen()) {
      return;
    }

    // Open palette: Cmd/Ctrl+O
    if (e.key === 'o' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this.openPalette();
      return;
    }

    // New document: Cmd/Ctrl+N
    if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this.newDocument();
      return;
    }

    // Close document: Cmd/Ctrl+W
    if (e.key === 'w' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this.closeDocument();
      return;
    }

    // Toggle preview: Cmd/Ctrl+P (works from both edit and preview modes)
    if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this.togglePreview();
    }
  };
}
