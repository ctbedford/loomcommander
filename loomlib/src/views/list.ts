import type { Document, ExecutionState, DocumentIntent } from '../types.ts';
import { INTENT_ICONS, EXECUTION_STATE_DOTS, DEFAULT_INTENT } from '../types.ts';
import { listDocuments } from '../data/documents.ts';
import { renderCardList, renderSkeletonList } from '../components/document-card.ts';

export interface ListViewOptions {
  onDocumentSelect: (doc: Document) => void;
  onNewDocument: () => void;
}

// Filter chip definitions
const EXECUTION_STATES: ExecutionState[] = ['pending', 'in_progress', 'completed', 'resolved'];
const INTENTS: DocumentIntent[] = ['research', 'build', 'capture', 'organize', 'produce'];

export class ListView {
  private container: HTMLElement;
  private listContainer: HTMLElement;
  private searchInput: HTMLInputElement;
  private options: ListViewOptions;
  private docs: Document[] = [];
  private filteredDocs: Document[] = [];
  private selectedIndex = -1;

  // Active filters
  private activeStateFilters: Set<ExecutionState> = new Set();
  private activeIntentFilters: Set<DocumentIntent> = new Set();

  constructor(container: HTMLElement, options: ListViewOptions) {
    this.container = container;
    this.options = options;

    // Create structure
    this.container.classList.add('list-view');
    this.container.innerHTML = `
      <div class="list-view__header">
        <input type="text" class="list-view__search" placeholder="Search documents..." />
        <div class="list-view__filters">
          <div class="list-view__filter-group list-view__filter-group--state"></div>
          <div class="list-view__filter-group list-view__filter-group--intent"></div>
        </div>
      </div>
      <div class="list-view__list"></div>
      <div class="list-view__footer">
        <button class="list-view__new-btn">+ New Document</button>
      </div>
    `;

    this.searchInput = this.container.querySelector('.list-view__search')!;
    this.listContainer = this.container.querySelector('.list-view__list')!;
    const newBtn = this.container.querySelector('.list-view__new-btn')!;

    // Render filter chips
    this.renderFilterChips();

    // Event handlers
    this.searchInput.addEventListener('input', this.handleSearch);
    this.searchInput.addEventListener('keydown', this.handleKeydown);
    newBtn.addEventListener('click', () => this.options.onNewDocument());
  }

  private renderFilterChips(): void {
    const stateGroup = this.container.querySelector('.list-view__filter-group--state')!;
    const intentGroup = this.container.querySelector('.list-view__filter-group--intent')!;

    // Execution state chips
    stateGroup.innerHTML = EXECUTION_STATES.map(state => `
      <button class="list-view__chip list-view__chip--state" data-state="${state}" title="${state.replace('_', ' ')}">
        ${EXECUTION_STATE_DOTS[state]}
      </button>
    `).join('');

    // Intent chips
    intentGroup.innerHTML = INTENTS.map(intent => `
      <button class="list-view__chip list-view__chip--intent" data-intent="${intent}" title="${intent}">
        ${INTENT_ICONS[intent]}
      </button>
    `).join('');

    // Bind click handlers
    stateGroup.querySelectorAll('.list-view__chip--state').forEach(chip => {
      chip.addEventListener('click', () => {
        const state = (chip as HTMLElement).dataset.state as ExecutionState;
        this.toggleStateFilter(state);
      });
    });

    intentGroup.querySelectorAll('.list-view__chip--intent').forEach(chip => {
      chip.addEventListener('click', () => {
        const intent = (chip as HTMLElement).dataset.intent as DocumentIntent;
        this.toggleIntentFilter(intent);
      });
    });
  }

  private toggleStateFilter(state: ExecutionState): void {
    if (this.activeStateFilters.has(state)) {
      this.activeStateFilters.delete(state);
    } else {
      this.activeStateFilters.add(state);
    }
    this.updateFilterChipStyles();
    this.applyFilters();
  }

  private toggleIntentFilter(intent: DocumentIntent): void {
    if (this.activeIntentFilters.has(intent)) {
      this.activeIntentFilters.delete(intent);
    } else {
      this.activeIntentFilters.add(intent);
    }
    this.updateFilterChipStyles();
    this.applyFilters();
  }

  private updateFilterChipStyles(): void {
    // Update state chips
    this.container.querySelectorAll('.list-view__chip--state').forEach(chip => {
      const state = (chip as HTMLElement).dataset.state as ExecutionState;
      chip.classList.toggle('list-view__chip--active', this.activeStateFilters.has(state));
    });

    // Update intent chips
    this.container.querySelectorAll('.list-view__chip--intent').forEach(chip => {
      const intent = (chip as HTMLElement).dataset.intent as DocumentIntent;
      chip.classList.toggle('list-view__chip--active', this.activeIntentFilters.has(intent));
    });
  }

  private applyFilters(): void {
    const query = this.searchInput.value.toLowerCase();

    this.filteredDocs = this.docs.filter(doc => {
      // Text search
      if (query) {
        const matchesQuery =
          doc.title.toLowerCase().includes(query) ||
          doc.content.toLowerCase().includes(query) ||
          doc.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }

      // Execution state filter
      if (this.activeStateFilters.size > 0) {
        const docState = doc.execution_state ?? 'pending';
        if (!this.activeStateFilters.has(docState)) return false;
      }

      // Intent filter
      if (this.activeIntentFilters.size > 0) {
        const docIntent = doc.intent ?? DEFAULT_INTENT[doc.type];
        if (!this.activeIntentFilters.has(docIntent)) return false;
      }

      return true;
    });

    this.selectedIndex = this.filteredDocs.length > 0 ? 0 : -1;
    this.render();
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
    this.applyFilters();
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
