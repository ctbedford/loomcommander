import type { Document, DocumentType, FrameworkKind, DocumentStatus } from '../types.ts';
import {
  loadDocument,
  updateDocumentMetadata,
  getFrameworks,
  getSources,
  getUniquePerspectives,
  getUniqueOutputs,
  getUniqueTags,
} from '../data/documents.ts';

export interface TriageModalOptions {
  onSave: (doc: Document) => void;
  onCancel: () => void;
}

const DOCUMENT_TYPES: { value: DocumentType; label: string; description: string }[] = [
  { value: 'source', label: 'Source', description: 'External input' },
  { value: 'note', label: 'Note', description: 'Captured fragment' },
  { value: 'framework', label: 'Framework', description: 'Crystallized prompt' },
  { value: 'instance', label: 'Instance', description: 'Output of framework(s)' },
  { value: 'index', label: 'Index', description: 'Map of terrain' },
];

const FRAMEWORK_KINDS: { value: FrameworkKind; label: string; description: string }[] = [
  { value: 'toolkit', label: 'Toolkit', description: 'Portable, reusable method' },
  { value: 'domain', label: 'Domain', description: 'Perspective-specific lens' },
];

const STATUS_OPTIONS: { value: DocumentStatus; label: string }[] = [
  { value: 'incubating', label: 'Incubating' },
  { value: 'draft', label: 'Draft' },
  { value: 'verified', label: 'Verified' },
  { value: 'captured', label: 'Captured' },
];

export class TriageModal {
  private container: HTMLElement;
  private backdrop: HTMLElement;
  private modal: HTMLElement;
  private options: TriageModalOptions;

  private docId: string | null = null;
  private currentDoc: Document | null = null;

  // Form state
  private selectedType: DocumentType = 'note';
  private selectedFrameworkKind: FrameworkKind = 'toolkit';
  private selectedPerspective: string = '';
  private selectedFrameworkIds: string[] = [];
  private selectedSourceId: string | null = null;
  private selectedOutput: string = '';
  private selectedStatus: DocumentStatus = 'incubating';
  private selectedTags: string[] = [];
  private titleInput: string = '';

  // Available options
  private frameworks: Document[] = [];
  private sources: Document[] = [];
  private perspectives: string[] = [];
  private outputs: string[] = [];
  private existingTags: string[] = [];

  constructor(container: HTMLElement, options: TriageModalOptions) {
    this.container = container;
    this.options = options;

    // Create backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'triage-modal-backdrop';
    this.backdrop.addEventListener('click', () => this.options.onCancel());

    // Create modal
    this.modal = document.createElement('div');
    this.modal.className = 'triage-modal';
    this.modal.addEventListener('click', (e) => e.stopPropagation());

    this.backdrop.appendChild(this.modal);
    this.container.appendChild(this.backdrop);

    // Keyboard handler
    document.addEventListener('keydown', this.handleKeydown);
  }

  async open(docId: string): Promise<void> {
    this.docId = docId;
    this.currentDoc = await loadDocument(docId) ?? null;

    if (!this.currentDoc) {
      console.error('Document not found:', docId);
      return;
    }

    // Load available options
    [this.frameworks, this.sources, this.perspectives, this.outputs, this.existingTags] =
      await Promise.all([
        getFrameworks(),
        getSources(),
        getUniquePerspectives(),
        getUniqueOutputs(),
        getUniqueTags(),
      ]);

    // Initialize form state from document
    this.selectedType = this.currentDoc.type;
    this.selectedFrameworkKind = this.currentDoc.framework_kind ?? 'toolkit';
    this.selectedPerspective = this.currentDoc.perspective ?? '';
    this.selectedFrameworkIds = [...this.currentDoc.framework_ids];
    this.selectedSourceId = this.currentDoc.source_id;
    this.selectedOutput = this.currentDoc.output ?? '';
    this.selectedStatus = this.currentDoc.status;
    this.selectedTags = [...this.currentDoc.tags];
    this.titleInput = this.currentDoc.title;

    this.render();
    this.show();
  }

  private render(): void {
    this.modal.innerHTML = `
      <div class="triage-modal__header">
        <h2>Classify Document</h2>
      </div>
      <div class="triage-modal__body">
        ${this.renderTitleField()}
        ${this.renderTypeSelector()}
        ${this.selectedType === 'framework' ? this.renderFrameworkKindSelector() : ''}
        ${this.selectedType === 'framework' && this.selectedFrameworkKind === 'domain' ? this.renderPerspectiveField() : ''}
        ${this.selectedType === 'instance' ? this.renderFrameworkPicker() : ''}
        ${this.selectedType === 'note' ? this.renderSourcePicker() : ''}
        ${this.renderOutputField()}
        ${this.renderStatusSelector()}
        ${this.renderTagsField()}
      </div>
      <div class="triage-modal__footer">
        <button class="triage-modal__btn triage-modal__btn--cancel">Cancel</button>
        <button class="triage-modal__btn triage-modal__btn--save">Save</button>
      </div>
    `;

    // Bind events
    this.bindEvents();
  }

  private renderTitleField(): string {
    return `
      <div class="triage-field">
        <label class="triage-field__label">Title</label>
        <input type="text" class="triage-field__input" data-field="title"
               value="${this.escapeHtml(this.titleInput)}" placeholder="Document title...">
      </div>
    `;
  }

  private renderTypeSelector(): string {
    return `
      <div class="triage-field">
        <label class="triage-field__label">What kind of document is this?</label>
        <div class="triage-radio-group">
          ${DOCUMENT_TYPES.map(
            (t) => `
            <label class="triage-radio ${this.selectedType === t.value ? 'triage-radio--selected' : ''}">
              <input type="radio" name="type" value="${t.value}" ${this.selectedType === t.value ? 'checked' : ''}>
              <span class="triage-radio__label">${t.label}</span>
              <span class="triage-radio__desc">${t.description}</span>
            </label>
          `
          ).join('')}
        </div>
      </div>
    `;
  }

  private renderFrameworkKindSelector(): string {
    return `
      <div class="triage-field">
        <label class="triage-field__label">What kind of framework?</label>
        <div class="triage-radio-group">
          ${FRAMEWORK_KINDS.map(
            (k) => `
            <label class="triage-radio ${this.selectedFrameworkKind === k.value ? 'triage-radio--selected' : ''}">
              <input type="radio" name="framework_kind" value="${k.value}" ${this.selectedFrameworkKind === k.value ? 'checked' : ''}>
              <span class="triage-radio__label">${k.label}</span>
              <span class="triage-radio__desc">${k.description}</span>
            </label>
          `
          ).join('')}
        </div>
      </div>
    `;
  }

  private renderPerspectiveField(): string {
    return `
      <div class="triage-field">
        <label class="triage-field__label">Which perspective?</label>
        <input type="text" class="triage-field__input" data-field="perspective"
               value="${this.escapeHtml(this.selectedPerspective)}"
               placeholder="e.g., economic genealogy"
               list="perspectives-list">
        <datalist id="perspectives-list">
          ${this.perspectives.map((p) => `<option value="${this.escapeHtml(p)}">`).join('')}
        </datalist>
      </div>
    `;
  }

  private renderFrameworkPicker(): string {
    return `
      <div class="triage-field">
        <label class="triage-field__label">Which frameworks shaped this?</label>
        <div class="triage-checkbox-group">
          ${this.frameworks.map(
            (fw) => `
            <label class="triage-checkbox ${this.selectedFrameworkIds.includes(fw.id) ? 'triage-checkbox--selected' : ''}">
              <input type="checkbox" name="framework_ids" value="${fw.id}"
                     ${this.selectedFrameworkIds.includes(fw.id) ? 'checked' : ''}>
              <span class="triage-checkbox__icon">${fw.framework_kind === 'domain' ? '▣' : '⚙'}</span>
              <span class="triage-checkbox__label">${this.escapeHtml(fw.title || 'Untitled')}</span>
            </label>
          `
          ).join('')}
          ${this.frameworks.length === 0 ? '<p class="triage-field__empty">No frameworks available</p>' : ''}
        </div>
      </div>
    `;
  }

  private renderSourcePicker(): string {
    return `
      <div class="triage-field">
        <label class="triage-field__label">From which source? (optional)</label>
        <select class="triage-field__select" data-field="source_id">
          <option value="">None</option>
          ${this.sources.map(
            (s) => `
            <option value="${s.id}" ${this.selectedSourceId === s.id ? 'selected' : ''}>
              ${this.escapeHtml(s.title || 'Untitled')}
            </option>
          `
          ).join('')}
        </select>
      </div>
    `;
  }

  private renderOutputField(): string {
    return `
      <div class="triage-field">
        <label class="triage-field__label">Output channel (optional)</label>
        <input type="text" class="triage-field__input" data-field="output"
               value="${this.escapeHtml(this.selectedOutput)}"
               placeholder="e.g., etymon, loomcommander"
               list="outputs-list">
        <datalist id="outputs-list">
          ${this.outputs.map((o) => `<option value="${this.escapeHtml(o)}">`).join('')}
        </datalist>
      </div>
    `;
  }

  private renderStatusSelector(): string {
    return `
      <div class="triage-field">
        <label class="triage-field__label">Status</label>
        <select class="triage-field__select" data-field="status">
          ${STATUS_OPTIONS.map(
            (s) => `
            <option value="${s.value}" ${this.selectedStatus === s.value ? 'selected' : ''}>
              ${s.label}
            </option>
          `
          ).join('')}
        </select>
      </div>
    `;
  }

  private renderTagsField(): string {
    return `
      <div class="triage-field">
        <label class="triage-field__label">Tags (comma-separated)</label>
        <input type="text" class="triage-field__input" data-field="tags"
               value="${this.escapeHtml(this.selectedTags.join(', '))}"
               placeholder="research, ux, api"
               list="tags-list">
        <datalist id="tags-list">
          ${this.existingTags.map((t) => `<option value="${this.escapeHtml(t)}">`).join('')}
        </datalist>
      </div>
    `;
  }

  private bindEvents(): void {
    // Type selector
    const typeRadios = this.modal.querySelectorAll('input[name="type"]');
    typeRadios.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        this.selectedType = (e.target as HTMLInputElement).value as DocumentType;
        this.render();
      });
    });

    // Framework kind selector
    const kindRadios = this.modal.querySelectorAll('input[name="framework_kind"]');
    kindRadios.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        this.selectedFrameworkKind = (e.target as HTMLInputElement).value as FrameworkKind;
        this.render();
      });
    });

    // Framework checkboxes
    const fwCheckboxes = this.modal.querySelectorAll('input[name="framework_ids"]');
    fwCheckboxes.forEach((cb) => {
      cb.addEventListener('change', (e) => {
        const value = (e.target as HTMLInputElement).value;
        const checked = (e.target as HTMLInputElement).checked;
        if (checked) {
          this.selectedFrameworkIds.push(value);
        } else {
          this.selectedFrameworkIds = this.selectedFrameworkIds.filter((id) => id !== value);
        }
      });
    });

    // Text inputs
    const titleInput = this.modal.querySelector('[data-field="title"]') as HTMLInputElement;
    titleInput?.addEventListener('input', (e) => {
      this.titleInput = (e.target as HTMLInputElement).value;
    });

    const perspectiveInput = this.modal.querySelector('[data-field="perspective"]') as HTMLInputElement;
    perspectiveInput?.addEventListener('input', (e) => {
      this.selectedPerspective = (e.target as HTMLInputElement).value;
    });

    const outputInput = this.modal.querySelector('[data-field="output"]') as HTMLInputElement;
    outputInput?.addEventListener('input', (e) => {
      this.selectedOutput = (e.target as HTMLInputElement).value;
    });

    const tagsInput = this.modal.querySelector('[data-field="tags"]') as HTMLInputElement;
    tagsInput?.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      this.selectedTags = value.split(',').map((t) => t.trim()).filter(Boolean);
    });

    // Selects
    const sourceSelect = this.modal.querySelector('[data-field="source_id"]') as HTMLSelectElement;
    sourceSelect?.addEventListener('change', (e) => {
      const value = (e.target as HTMLSelectElement).value;
      this.selectedSourceId = value || null;
    });

    const statusSelect = this.modal.querySelector('[data-field="status"]') as HTMLSelectElement;
    statusSelect?.addEventListener('change', (e) => {
      this.selectedStatus = (e.target as HTMLSelectElement).value as DocumentStatus;
    });

    // Buttons
    const cancelBtn = this.modal.querySelector('.triage-modal__btn--cancel');
    cancelBtn?.addEventListener('click', () => this.options.onCancel());

    const saveBtn = this.modal.querySelector('.triage-modal__btn--save');
    saveBtn?.addEventListener('click', () => this.save());
  }

  private async save(): Promise<void> {
    if (!this.docId || !this.currentDoc) return;

    const updated = await updateDocumentMetadata(this.docId, {
      title: this.titleInput || this.currentDoc.title,
      type: this.selectedType,
      framework_kind: this.selectedType === 'framework' ? this.selectedFrameworkKind : null,
      perspective:
        this.selectedType === 'framework' && this.selectedFrameworkKind === 'domain'
          ? this.selectedPerspective || null
          : null,
      framework_ids: this.selectedType === 'instance' ? this.selectedFrameworkIds : [],
      source_id: this.selectedType === 'note' ? this.selectedSourceId : null,
      output: this.selectedOutput || null,
      status: this.selectedStatus,
      tags: this.selectedTags,
    });

    this.options.onSave(updated);
  }

  private handleKeydown = (e: KeyboardEvent): void => {
    if (!this.isVisible()) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      this.options.onCancel();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this.save();
    }
  };

  show(): void {
    this.backdrop.classList.add('triage-modal-backdrop--visible');
  }

  hide(): void {
    this.backdrop.classList.remove('triage-modal-backdrop--visible');
  }

  isVisible(): boolean {
    return this.backdrop.classList.contains('triage-modal-backdrop--visible');
  }

  private escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  destroy(): void {
    document.removeEventListener('keydown', this.handleKeydown);
    this.backdrop.remove();
  }
}
