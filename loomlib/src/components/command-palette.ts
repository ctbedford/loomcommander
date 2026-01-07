import type { Document, DocumentType, DocumentStatus } from '../types.ts';
import { getDocumentIcon, getDocumentColor } from '../types.ts';
import { filterDocuments } from '../data/documents.ts';
import { relativeTime } from '../utils/time.ts';

export interface CommandPaletteOptions {
  onSelect: (doc: Document | null) => void;
  onCancel: () => void;
  onNewDocument: () => void;
}

const TYPE_FILTERS: { value: DocumentType; label: string }[] = [
  { value: 'framework', label: 'Framework' },
  { value: 'instance', label: 'Instance' },
  { value: 'note', label: 'Note' },
  { value: 'source', label: 'Source' },
  { value: 'index', label: 'Index' },
];

const STATUS_FILTERS: { value: DocumentStatus; label: string }[] = [
  { value: 'incubating', label: 'Incubating' },
  { value: 'draft', label: 'Draft' },
  { value: 'verified', label: 'Verified' },
  { value: 'captured', label: 'Captured' },
];

export class CommandPalette {
  private container: HTMLElement;
  private backdrop: HTMLElement;
  private modal: HTMLElement;
  private input: HTMLInputElement;
  private filterContainer: HTMLElement;
  private resultsContainer: HTMLElement;
  private options: CommandPaletteOptions;

  private query = '';
  private selectedTypes: DocumentType[] = [];
  private selectedStatuses: DocumentStatus[] = [];
  private results: Document[] = [];
  private selectedIndex = 0;

  constructor(container: HTMLElement, options: CommandPaletteOptions) {
    this.container = container;
    this.options = options;

    // Create backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'palette-backdrop';
    this.backdrop.addEventListener('click', () => this.options.onCancel());

    // Create modal
    this.modal = document.createElement('div');
    this.modal.className = 'palette-modal';
    this.modal.addEventListener('click', (e) => e.stopPropagation());
    this.modal.innerHTML = `
      <div class="palette-header">
        <input type="text" class="palette-input" placeholder="Search documents...">
      </div>
      <div class="palette-filters"></div>
      <div class="palette-results"></div>
      <div class="palette-footer">
        <span class="palette-hint">↑↓ Navigate</span>
        <span class="palette-hint">↵ Open</span>
        <span class="palette-hint">esc Cancel</span>
      </div>
    `;

    this.backdrop.appendChild(this.modal);
    this.container.appendChild(this.backdrop);

    this.input = this.modal.querySelector('.palette-input')!;
    this.filterContainer = this.modal.querySelector('.palette-filters')!;
    this.resultsContainer = this.modal.querySelector('.palette-results')!;

    // Event handlers
    this.input.addEventListener('input', () => this.handleInput());
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));

    this.renderFilters();
  }

  private renderFilters(): void {
    this.filterContainer.innerHTML = `
      <div class="palette-filter-row">
        <span class="palette-filter-label">Type:</span>
        ${TYPE_FILTERS.map(
          (f) => `
          <button class="palette-filter-btn ${this.selectedTypes.includes(f.value) ? 'palette-filter-btn--active' : ''}"
                  data-filter="type" data-value="${f.value}">
            ${f.label}
          </button>
        `
        ).join('')}
      </div>
      <div class="palette-filter-row">
        <span class="palette-filter-label">Status:</span>
        ${STATUS_FILTERS.map(
          (f) => `
          <button class="palette-filter-btn ${this.selectedStatuses.includes(f.value) ? 'palette-filter-btn--active' : ''}"
                  data-filter="status" data-value="${f.value}">
            ${f.label}
          </button>
        `
        ).join('')}
      </div>
    `;

    // Bind filter clicks
    this.filterContainer.querySelectorAll('.palette-filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        const value = btn.getAttribute('data-value');
        if (filter === 'type') {
          this.toggleTypeFilter(value as DocumentType);
        } else if (filter === 'status') {
          this.toggleStatusFilter(value as DocumentStatus);
        }
      });
    });
  }

  private toggleTypeFilter(type: DocumentType): void {
    if (this.selectedTypes.includes(type)) {
      this.selectedTypes = this.selectedTypes.filter((t) => t !== type);
    } else {
      this.selectedTypes.push(type);
    }
    this.renderFilters();
    this.search();
  }

  private toggleStatusFilter(status: DocumentStatus): void {
    if (this.selectedStatuses.includes(status)) {
      this.selectedStatuses = this.selectedStatuses.filter((s) => s !== status);
    } else {
      this.selectedStatuses.push(status);
    }
    this.renderFilters();
    this.search();
  }

  private async handleInput(): Promise<void> {
    this.query = this.input.value;
    await this.search();
  }

  private async search(): Promise<void> {
    this.results = await filterDocuments({
      query: this.query || undefined,
      types: this.selectedTypes.length > 0 ? this.selectedTypes : undefined,
      statuses: this.selectedStatuses.length > 0 ? this.selectedStatuses : undefined,
    });
    this.selectedIndex = 0;
    this.renderResults();
  }

  private renderResults(): void {
    if (this.results.length === 0) {
      this.resultsContainer.innerHTML = `
        <div class="palette-empty">
          ${this.query ? 'No documents found' : 'Start typing to search...'}
        </div>
        <div class="palette-item palette-item--new" data-action="new">
          <span class="palette-item__icon">+</span>
          <span class="palette-item__title">Create new document</span>
        </div>
      `;
    } else {
      this.resultsContainer.innerHTML = this.results
        .map(
          (doc, i) => `
        <div class="palette-item ${i === this.selectedIndex ? 'palette-item--selected' : ''}"
             data-id="${doc.id}" data-index="${i}">
          <span class="palette-item__icon" style="color: ${getDocumentColor(doc)}">
            ${getDocumentIcon(doc)}
          </span>
          <div class="palette-item__content">
            <span class="palette-item__title">${this.highlightMatch(doc.title || 'Untitled')}</span>
            <span class="palette-item__meta">${doc.type}${doc.framework_kind ? ` / ${doc.framework_kind}` : ''}</span>
          </div>
          <span class="palette-item__time">${relativeTime(doc.modifiedAt)}</span>
        </div>
      `
        )
        .join('');
      this.resultsContainer.innerHTML += `
        <div class="palette-item palette-item--new ${this.selectedIndex === this.results.length ? 'palette-item--selected' : ''}"
             data-action="new" data-index="${this.results.length}">
          <span class="palette-item__icon">+</span>
          <span class="palette-item__title">Create new document</span>
        </div>
      `;
    }

    // Bind click handlers
    this.resultsContainer.querySelectorAll('.palette-item').forEach((item) => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        if (action === 'new') {
          this.options.onNewDocument();
        } else {
          const id = item.getAttribute('data-id');
          const doc = this.results.find((d) => d.id === id);
          if (doc) {
            this.options.onSelect(doc);
          }
        }
      });
      item.addEventListener('mouseenter', () => {
        const index = parseInt(item.getAttribute('data-index') || '0', 10);
        this.selectedIndex = index;
        this.updateSelection();
      });
    });
  }

  private handleKeydown(e: KeyboardEvent): void {
    const maxIndex = this.results.length; // +1 for "new document" item

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, maxIndex);
        this.updateSelection();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.updateSelection();
        break;
      case 'Enter':
        e.preventDefault();
        if (this.selectedIndex === this.results.length) {
          this.options.onNewDocument();
        } else if (this.results[this.selectedIndex]) {
          this.options.onSelect(this.results[this.selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.options.onCancel();
        break;
    }
  }

  private updateSelection(): void {
    const items = this.resultsContainer.querySelectorAll('.palette-item');
    items.forEach((item, i) => {
      item.classList.toggle('palette-item--selected', i === this.selectedIndex);
      if (i === this.selectedIndex) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  async open(): Promise<void> {
    this.query = '';
    this.selectedTypes = [];
    this.selectedStatuses = [];
    this.input.value = '';
    this.renderFilters();
    await this.search();
    this.show();
    this.input.focus();
  }

  show(): void {
    this.backdrop.classList.add('palette-backdrop--visible');
  }

  hide(): void {
    this.backdrop.classList.remove('palette-backdrop--visible');
  }

  isVisible(): boolean {
    return this.backdrop.classList.contains('palette-backdrop--visible');
  }

  private escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  private highlightMatch(text: string): string {
    if (!this.query) {
      return this.escapeHtml(text);
    }

    const escapedText = this.escapeHtml(text);
    const lowerText = text.toLowerCase();
    const lowerQuery = this.query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) {
      return escapedText;
    }

    // Escape each part separately, then wrap match in highlight span
    const before = this.escapeHtml(text.slice(0, index));
    const match = this.escapeHtml(text.slice(index, index + this.query.length));
    const after = this.escapeHtml(text.slice(index + this.query.length));

    return `${before}<mark class="palette-highlight">${match}</mark>${after}`;
  }

  destroy(): void {
    this.backdrop.remove();
  }
}
