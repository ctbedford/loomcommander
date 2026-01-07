import { loadDocument, saveDocument } from '../data/documents.ts';
import type { Document } from '../types.ts';
import { deriveTitle, getDocumentIcon, getDocumentColor } from '../types.ts';

const DEBOUNCE_MS = 500;

export interface EditorOptions {
  onBack: () => void;
  onTriage: (docId: string) => void;
  onGoToList: () => void;
  onGoToConstellation: () => void;
}

export class Editor {
  private container: HTMLElement;
  private textarea: HTMLTextAreaElement;
  private titleDisplay: HTMLElement;
  private saveStatus: HTMLElement;
  private metaBar: HTMLElement;
  private options: EditorOptions;
  private currentDoc: Document | null = null;
  private currentDocId: string | null = null;
  private saveTimeout: number | null = null;
  private saveStatusTimeout: number | null = null;
  private isDirty = false;

  constructor(container: HTMLElement, options: EditorOptions) {
    this.container = container;
    this.options = options;

    // Create structure
    this.container.classList.add('editor-view');
    this.container.innerHTML = `
      <div class="editor-view__header">
        <div class="editor-view__nav">
          <button class="editor-view__nav-btn editor-view__nav-btn--list" title="List view (Esc)">☰</button>
          <button class="editor-view__nav-btn editor-view__nav-btn--constellation" title="Constellation view">◎</button>
        </div>
        <div class="editor-view__title-area">
          <div class="editor-view__title"></div>
          <div class="editor-view__save-status"></div>
        </div>
        <button class="editor-view__triage-btn">Triage</button>
      </div>
      <div class="editor-view__meta"></div>
      <textarea class="editor-view__textarea" placeholder="Start writing..."></textarea>
    `;

    this.textarea = this.container.querySelector('.editor-view__textarea')!;
    this.titleDisplay = this.container.querySelector('.editor-view__title')!;
    this.saveStatus = this.container.querySelector('.editor-view__save-status')!;
    this.metaBar = this.container.querySelector('.editor-view__meta')!;
    const listBtn = this.container.querySelector('.editor-view__nav-btn--list')!;
    const constellationBtn = this.container.querySelector('.editor-view__nav-btn--constellation')!;
    const triageBtn = this.container.querySelector('.editor-view__triage-btn')!;

    // Event handlers
    this.textarea.addEventListener('input', this.handleInput);
    this.textarea.addEventListener('keydown', this.handleKeydown);
    listBtn.addEventListener('click', () => this.handleBack());
    constellationBtn.addEventListener('click', () => {
      this.flush();
      this.options.onGoToConstellation();
    });
    triageBtn.addEventListener('click', () => {
      if (this.currentDocId) {
        this.options.onTriage(this.currentDocId);
      }
    });
  }

  async load(docId: string): Promise<void> {
    // Save any pending changes first
    await this.flush();

    const doc = await loadDocument(docId);
    if (!doc) {
      console.error('Document not found:', docId);
      return;
    }

    this.currentDoc = doc;
    this.currentDocId = doc.id;
    this.textarea.value = doc.content;
    this.titleDisplay.textContent = doc.title || deriveTitle(doc.content);
    this.isDirty = false;
    this.renderMetaBar();
    this.textarea.focus();
  }

  private renderMetaBar(): void {
    if (!this.currentDoc) {
      this.metaBar.innerHTML = '';
      return;
    }

    const doc = this.currentDoc;
    const icon = getDocumentIcon(doc);
    const color = getDocumentColor(doc);
    const typeLabel = doc.type + (doc.framework_kind ? ` / ${doc.framework_kind}` : '');
    const tags = doc.tags.length > 0
      ? doc.tags.map(t => `<span class="editor-view__tag">${t}</span>`).join('')
      : '';

    this.metaBar.innerHTML = `
      <span class="editor-view__type-icon" style="color: ${color}">${icon}</span>
      <span class="editor-view__type-label">${typeLabel}</span>
      <span class="editor-view__status editor-view__status--${doc.status}">${doc.status}</span>
      ${tags ? `<span class="editor-view__tags">${tags}</span>` : ''}
    `;
  }

  async reload(): Promise<void> {
    if (this.currentDocId) {
      const doc = await loadDocument(this.currentDocId);
      if (doc) {
        this.currentDoc = doc;
        this.renderMetaBar();
      }
    }
  }

  private handleInput = (): void => {
    this.isDirty = true;
    this.showSaveStatus('unsaved');

    // Update title display
    this.titleDisplay.textContent = deriveTitle(this.textarea.value);

    // Debounced save
    if (this.saveTimeout !== null) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = window.setTimeout(() => {
      this.save();
    }, DEBOUNCE_MS);
  };

  private handleKeydown = (e: KeyboardEvent): void => {
    // Handle tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = this.textarea.selectionStart;
      const end = this.textarea.selectionEnd;
      const value = this.textarea.value;

      this.textarea.value = value.substring(0, start) + '\t' + value.substring(end);
      this.textarea.selectionStart = this.textarea.selectionEnd = start + 1;
      this.handleInput();
    }
  };

  private async save(): Promise<void> {
    if (!this.currentDocId || !this.isDirty) return;

    this.showSaveStatus('saving');

    try {
      await saveDocument(this.currentDocId, this.textarea.value);
      this.isDirty = false;
      this.showSaveStatus('saved');
    } catch (err) {
      console.error('Failed to save:', err);
      this.showSaveStatus('error');
    }
  }

  private showSaveStatus(status: 'unsaved' | 'saving' | 'saved' | 'error'): void {
    // Clear any pending status timeout
    if (this.saveStatusTimeout !== null) {
      clearTimeout(this.saveStatusTimeout);
      this.saveStatusTimeout = null;
    }

    // Update status element
    this.saveStatus.className = 'editor-view__save-status';

    switch (status) {
      case 'unsaved':
        this.saveStatus.textContent = '●';
        this.saveStatus.classList.add('editor-view__save-status--unsaved');
        break;
      case 'saving':
        this.saveStatus.textContent = 'Saving...';
        this.saveStatus.classList.add('editor-view__save-status--saving');
        break;
      case 'saved':
        this.saveStatus.textContent = 'Saved';
        this.saveStatus.classList.add('editor-view__save-status--saved');
        // Auto-hide after 2 seconds
        this.saveStatusTimeout = window.setTimeout(() => {
          this.saveStatus.textContent = '';
          this.saveStatus.className = 'editor-view__save-status';
        }, 2000);
        break;
      case 'error':
        this.saveStatus.textContent = 'Save failed';
        this.saveStatus.classList.add('editor-view__save-status--error');
        break;
    }
  }

  async flush(): Promise<void> {
    if (this.saveTimeout !== null) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    await this.save();
  }

  private async handleBack(): Promise<void> {
    await this.flush();
    this.options.onBack();
  }

  focus(): void {
    this.textarea.focus();
  }

  show(): void {
    this.container.classList.add('shell__view--visible');
  }

  hide(): void {
    this.container.classList.remove('shell__view--visible');
  }

  getCurrentDocId(): string | null {
    return this.currentDocId;
  }
}
