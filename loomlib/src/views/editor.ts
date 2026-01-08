import { loadDocument, saveDocument, updateDocumentMetadata, listDocuments } from '../data/documents.ts';
import { getParentIds } from '../data/graph.ts';
import type { ExecutionState } from '../types.ts';
import type { Document } from '../types.ts';
import { deriveTitle, getDocumentIcon, getDocumentColor, getIntentIcon, getExecutionDots } from '../types.ts';
import { marked } from 'marked';

const DEBOUNCE_MS = 500;

// Configure marked for safe rendering
marked.setOptions({
  gfm: true,
  breaks: true,
});

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
  private relationsBar: HTMLElement;
  private options: EditorOptions;
  private allDocs: Document[] = [];
  private currentDoc: Document | null = null;
  private currentDocId: string | null = null;
  private saveTimeout: number | null = null;
  private saveStatusTimeout: number | null = null;
  private isDirty = false;
  private isFocusMode = false;
  private showPreview = false;
  private previewPane: HTMLElement | null = null;
  private previewToggle: HTMLElement | null = null;

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
        <div class="editor-view__actions">
          <button class="editor-view__preview-toggle" title="Toggle preview (Cmd+P)">Preview</button>
          <button class="editor-view__triage-btn">Triage</button>
        </div>
      </div>
      <div class="editor-view__meta"></div>
      <div class="editor-view__relations"></div>
      <div class="editor-view__content">
        <textarea class="editor-view__textarea" placeholder="Start writing..."></textarea>
        <div class="editor-view__preview"></div>
      </div>
    `;

    this.textarea = this.container.querySelector('.editor-view__textarea')!;
    this.titleDisplay = this.container.querySelector('.editor-view__title')!;
    this.saveStatus = this.container.querySelector('.editor-view__save-status')!;
    this.metaBar = this.container.querySelector('.editor-view__meta')!;
    this.relationsBar = this.container.querySelector('.editor-view__relations')!;
    this.previewPane = this.container.querySelector('.editor-view__preview')!;
    this.previewToggle = this.container.querySelector('.editor-view__preview-toggle')!;
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
    this.previewToggle.addEventListener('click', () => this.togglePreview());
  }

  async load(docId: string): Promise<void> {
    // Save any pending changes first
    await this.flush();

    // Fetch doc and all docs for relation lookups
    const [doc, allDocs] = await Promise.all([
      loadDocument(docId),
      listDocuments(),
    ]);

    if (!doc) {
      console.error('Document not found:', docId);
      return;
    }

    this.currentDoc = doc;
    this.currentDocId = doc.id;
    this.allDocs = allDocs;
    this.textarea.value = doc.content;
    this.titleDisplay.textContent = doc.title || deriveTitle(doc.content);
    this.isDirty = false;
    // Exit focus mode when loading a new document
    if (this.isFocusMode) {
      this.toggleFocusMode();
    }
    this.renderMetaBar();
    this.renderRelationsBar();
    // Update preview if visible
    if (this.showPreview) {
      this.updatePreview();
    }
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
    const intentIcon = getIntentIcon(doc);
    const executionDots = getExecutionDots(doc);
    const executionState = doc.execution_state ?? 'pending';
    const typeLabel = doc.type + (doc.framework_kind ? ` / ${doc.framework_kind}` : '');
    const tags = doc.tags.length > 0
      ? doc.tags.map(t => `<span class="editor-view__tag">${t}</span>`).join('')
      : '';

    this.metaBar.innerHTML = `
      <span class="editor-view__type-icon" style="color: ${color}">${icon}</span>
      <span class="editor-view__intent" title="${doc.intent ?? 'capture'}">${intentIcon}</span>
      <span class="editor-view__type-label">${typeLabel}</span>
      <span class="editor-view__status editor-view__status--${doc.status}">${doc.status}</span>
      <span class="editor-view__execution editor-view__execution--${executionState}" data-state="${executionState}" title="Click to cycle: ${executionState}">${executionDots}</span>
      ${tags ? `<span class="editor-view__tags">${tags}</span>` : ''}
    `;

    // Bind click handler for execution state cycling
    const executionEl = this.metaBar.querySelector('.editor-view__execution');
    if (executionEl) {
      executionEl.addEventListener('click', () => this.cycleExecutionState());
    }
  }

  private async cycleExecutionState(): Promise<void> {
    if (!this.currentDoc || !this.currentDocId) return;

    const states: ExecutionState[] = ['pending', 'in_progress', 'completed', 'resolved'];
    const currentState = this.currentDoc.execution_state ?? 'pending';
    const currentIndex = states.indexOf(currentState);
    const nextState = states[(currentIndex + 1) % states.length];

    // Update document
    this.currentDoc = await updateDocumentMetadata(this.currentDocId, {
      execution_state: nextState,
    });

    // Re-render meta bar
    this.renderMetaBar();
  }

  private renderRelationsBar(): void {
    if (!this.currentDoc) {
      this.relationsBar.innerHTML = '';
      this.relationsBar.style.display = 'none';
      return;
    }

    const doc = this.currentDoc;
    const upstream = doc.upstream ?? [];
    const downstream = doc.downstream ?? [];

    // Also count children (docs that reference this via upstream or legacy fields)
    const children = this.allDocs.filter(d => {
      const parentIds = getParentIds(d);
      return parentIds.includes(doc.id);
    });

    if (upstream.length === 0 && downstream.length === 0 && children.length === 0) {
      this.relationsBar.innerHTML = '';
      this.relationsBar.style.display = 'none';
      return;
    }

    this.relationsBar.style.display = 'flex';

    // Build upstream links
    const upstreamHtml = upstream.map(ref => {
      const upDoc = this.allDocs.find(d => d.id === ref.doc);
      const title = upDoc?.title ?? ref.doc;
      const icon = upDoc ? getDocumentIcon(upDoc) : '?';
      return `<span class="editor-view__rel-link" data-doc-id="${ref.doc}" title="${ref.relation}: ${title}">${icon} ${title}</span>`;
    }).join('');

    // Build downstream/children count
    const downstreamCount = downstream.length + children.length;

    this.relationsBar.innerHTML = `
      ${upstream.length > 0 ? `<span class="editor-view__rel-label">⤴</span>${upstreamHtml}` : ''}
      ${upstream.length > 0 && downstreamCount > 0 ? '<span class="editor-view__rel-divider">→</span>' : ''}
      ${downstreamCount > 0 ? `<span class="editor-view__rel-downstream">↴ ${downstreamCount} ${downstreamCount === 1 ? 'child' : 'children'}</span>` : ''}
    `;

    // Bind click handlers for upstream links
    this.relationsBar.querySelectorAll('.editor-view__rel-link').forEach(el => {
      el.addEventListener('click', () => {
        const docId = (el as HTMLElement).dataset.docId;
        if (docId) {
          this.load(docId);
        }
      });
    });
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

    // Update preview if visible
    if (this.showPreview) {
      this.updatePreview();
    }

    // Debounced save
    if (this.saveTimeout !== null) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = window.setTimeout(() => {
      this.save();
    }, DEBOUNCE_MS);
  };

  private handleKeydown = (e: KeyboardEvent): void => {
    const isMod = e.metaKey || e.ctrlKey;

    // Cmd+. to toggle focus mode
    if (isMod && e.key === '.') {
      e.preventDefault();
      this.toggleFocusMode();
      return;
    }

    // Escape exits focus mode first, then navigates
    if (e.key === 'Escape') {
      if (this.isFocusMode) {
        e.preventDefault();
        this.toggleFocusMode();
        return;
      }
      // Let shell handle navigation if not in focus mode
    }

    // Cmd+S to acknowledge save (muscle memory)
    if (isMod && e.key === 's') {
      e.preventDefault();
      this.showSaveStatus('saved');
      return;
    }

    // Cmd+P to toggle preview
    if (isMod && e.key === 'p') {
      e.preventDefault();
      this.togglePreview();
      return;
    }

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

  private toggleFocusMode(): void {
    this.isFocusMode = !this.isFocusMode;
    this.container.classList.toggle('editor-view--focus', this.isFocusMode);
  }

  private togglePreview(): void {
    this.showPreview = !this.showPreview;
    this.container.classList.toggle('editor-view--preview', this.showPreview);
    this.previewToggle?.classList.toggle('editor-view__preview-toggle--active', this.showPreview);

    if (this.showPreview) {
      this.updatePreview();
    }
  }

  private updatePreview(): void {
    if (!this.previewPane || !this.showPreview) return;

    const content = this.textarea.value;
    // marked.parse returns string | Promise<string>, we use sync mode
    const html = marked.parse(content) as string;
    this.previewPane.innerHTML = html;
  }

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
    // Exit focus mode when leaving editor
    if (this.isFocusMode) {
      this.toggleFocusMode();
    }
  }

  getCurrentDocId(): string | null {
    return this.currentDocId;
  }

  isInFocusMode(): boolean {
    return this.isFocusMode;
  }
}
