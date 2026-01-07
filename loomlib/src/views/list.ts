import type { Document } from '../types.ts';
import { listDocuments } from '../data/documents.ts';
import { renderCardList, renderSkeletonList } from '../components/document-card.ts';

export interface ListViewOptions {
  onDocumentSelect: (doc: Document) => void;
  onNewDocument: () => void;
}

export class ListView {
  private container: HTMLElement;
  private listContainer: HTMLElement;
  private searchInput: HTMLInputElement;
  private options: ListViewOptions;
  private docs: Document[] = [];
  private filteredDocs: Document[] = [];
  private selectedIndex = -1;

  constructor(container: HTMLElement, options: ListViewOptions) {
    this.container = container;
    this.options = options;

    // Create structure
    this.container.classList.add('list-view');
    this.container.innerHTML = `
      <div class="list-view__header">
        <input type="text" class="list-view__search" placeholder="Search documents..." />
      </div>
      <div class="list-view__list"></div>
      <div class="list-view__footer">
        <button class="list-view__new-btn">+ New Document</button>
      </div>
    `;

    this.searchInput = this.container.querySelector('.list-view__search')!;
    this.listContainer = this.container.querySelector('.list-view__list')!;
    const newBtn = this.container.querySelector('.list-view__new-btn')!;

    // Event handlers
    this.searchInput.addEventListener('input', this.handleSearch);
    this.searchInput.addEventListener('keydown', this.handleKeydown);
    newBtn.addEventListener('click', () => this.options.onNewDocument());
  }

  async refresh(): Promise<void> {
    // Show skeleton loading state
    renderSkeletonList(this.listContainer, 5);

    this.docs = await listDocuments();
    this.filteredDocs = [...this.docs];
    this.selectedIndex = -1;
    this.render();
  }

  private render(): void {
    renderCardList(
      this.listContainer,
      this.filteredDocs,
      this.docs,
      (doc) => this.options.onDocumentSelect(doc)
    );
    this.updateSelection();
  }

  private handleSearch = (): void => {
    const query = this.searchInput.value.toLowerCase();
    if (!query) {
      this.filteredDocs = [...this.docs];
    } else {
      this.filteredDocs = this.docs.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.content.toLowerCase().includes(query) ||
          d.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
    this.selectedIndex = this.filteredDocs.length > 0 ? 0 : -1;
    this.render();
  };

  private handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredDocs.length - 1);
      this.updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      this.updateSelection();
    } else if (e.key === 'Enter' && this.selectedIndex >= 0) {
      e.preventDefault();
      const doc = this.filteredDocs[this.selectedIndex];
      if (doc) {
        this.options.onDocumentSelect(doc);
      }
    } else if (e.key === 'Escape') {
      this.searchInput.blur();
    }
  };

  private updateSelection(): void {
    const cards = this.listContainer.querySelectorAll('.doc-card');
    cards.forEach((card, i) => {
      card.classList.toggle('doc-card--selected', i === this.selectedIndex);
      if (i === this.selectedIndex) {
        card.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  focus(): void {
    this.searchInput.focus();
  }

  show(): void {
    this.container.classList.add('shell__view--visible');
  }

  hide(): void {
    this.container.classList.remove('shell__view--visible');
  }
}
