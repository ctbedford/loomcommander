import type { Document, ExecutionState, DocumentIntent } from '../types.ts';
import { INTENT_ICONS, EXECUTION_STATE_DOTS, DEFAULT_INTENT } from '../types.ts';
import { listDomainDocuments } from '../data/documents.ts';
import { renderCardList, renderSkeletonList } from '../components/document-card.ts';

export interface ListViewOptions {
  onDocumentSelect: (doc: Document) => void;
  onNewDocument: () => void;
  onGoToFlow?: () => void;
  onGoToDeck?: () => void;
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
  private activeTagFilter: string | null = null;

  constructor(container: HTMLElement, options: ListViewOptions) {
    this.container = container;
    this.options = options;

    // Create structure
    this.container.classList.add('list-view');
    this.container.innerHTML = `
      <div class="list-view__header">
        <div class="list-view__top-row">
          <input type="text" class="list-view__search" placeholder="Search documents..." />
          <div class="list-view__nav">
            <button class="list-view__nav-btn list-view__nav-btn--flow" title="Flow view">↕</button>
            <button class="list-view__nav-btn list-view__nav-btn--deck" title="Deck view (Cmd+Shift+D)">▦</button>
          </div>
        </div>
        <div class="list-view__filters">
          <div class="list-view__filter-group list-view__filter-group--state"></div>
          <div class="list-view__filter-group list-view__filter-group--intent"></div>
        </div>
        <div class="list-view__tag-filter">
          <div class="list-view__tag-selected"></div>
          <div class="list-view__tag-scroll">
            <div class="list-view__tag-scroll-inner"></div>
          </div>
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
    const flowBtn = this.container.querySelector('.list-view__nav-btn--flow');
    const deckBtn = this.container.querySelector('.list-view__nav-btn--deck');

    // Render filter chips
    this.renderFilterChips();

    // Event handlers
    this.searchInput.addEventListener('input', this.handleSearch);
    this.searchInput.addEventListener('keydown', this.handleKeydown);
    newBtn.addEventListener('click', () => this.options.onNewDocument());
    flowBtn?.addEventListener('click', () => this.options.onGoToFlow?.());
    deckBtn?.addEventListener('click', () => this.options.onGoToDeck?.());
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

  // Get tags from documents matching current state/intent filters (excludes tag filter to avoid circular dependency)
  private getContextualTags(): string[] {
    const contextDocs = this.docs.filter(doc => {
      // Apply state filter
      if (this.activeStateFilters.size > 0) {
        const docState = doc.execution_state ?? 'pending';
        if (!this.activeStateFilters.has(docState)) return false;
      }
      // Apply intent filter
      if (this.activeIntentFilters.size > 0) {
        const docIntent = doc.intent ?? DEFAULT_INTENT[doc.type];
        if (!this.activeIntentFilters.has(docIntent)) return false;
      }
      return true;
    });

    const tags = new Set<string>();
    for (const doc of contextDocs) {
      for (const tag of doc.tags) {
        tags.add(tag);
      }
    }
    // Shuffle tags randomly instead of alphabetical
    return this.shuffleArray(Array.from(tags));
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private renderTagFilter(): void {
    const tagFilter = this.container.querySelector('.list-view__tag-filter');
    if (!tagFilter) return;

    const selectedEl = tagFilter.querySelector('.list-view__tag-selected')!;
    const scrollEl = tagFilter.querySelector('.list-view__tag-scroll')!;
    const scrollInner = scrollEl.querySelector('.list-view__tag-scroll-inner')!;

    const tags = this.getContextualTags();

    // Hide entire row if no tags
    if (tags.length === 0) {
      tagFilter.classList.add('list-view__tag-filter--hidden');
      return;
    }
    tagFilter.classList.remove('list-view__tag-filter--hidden');

    // Render selected tag (if any)
    if (this.activeTagFilter) {
      selectedEl.innerHTML = `
        <button class="list-view__chip list-view__chip--tag list-view__chip--active" data-tag="${this.escapeHtml(this.activeTagFilter)}">
          ${this.escapeHtml(this.activeTagFilter)}
        </button>
      `;
      selectedEl.classList.add('list-view__tag-selected--active');
      selectedEl.querySelector('button')?.addEventListener('click', () => this.selectTag(this.activeTagFilter!));
    } else {
      selectedEl.innerHTML = '';
      selectedEl.classList.remove('list-view__tag-selected--active');
    }

    // Filter out selected tag from scroll
    const scrollTags = tags.filter(t => t !== this.activeTagFilter);

    if (scrollTags.length === 0) {
      scrollInner.innerHTML = '';
      scrollEl.classList.add('list-view__tag-scroll--empty');
      return;
    }
    scrollEl.classList.remove('list-view__tag-scroll--empty');

    // Calculate animation duration based on tag count (more tags = longer cycle)
    // Very slow scroll: 90s base, 4.5s per tag
    const duration = Math.max(90, scrollTags.length * 4.5);
    (scrollInner as HTMLElement).style.setProperty('--tag-scroll-duration', `${duration}s`);

    // Duplicate tags for seamless loop
    const tagsHtml = scrollTags.map(t => `
      <button class="list-view__chip list-view__chip--tag" data-tag="${this.escapeHtml(t)}">${this.escapeHtml(t)}</button>
    `).join('');

    scrollInner.innerHTML = tagsHtml + tagsHtml;

    // Bind click handlers
    scrollInner.querySelectorAll('.list-view__chip--tag').forEach(chip => {
      chip.addEventListener('click', () => {
        const tag = (chip as HTMLElement).dataset.tag!;
        this.selectTag(tag);
      });
    });
  }

  private selectTag(tag: string): void {
    if (this.activeTagFilter === tag) {
      this.activeTagFilter = null;
    } else {
      this.activeTagFilter = tag;
    }
    this.renderTagFilter();
    this.applyFilters();
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

      // Tag filter
      if (this.activeTagFilter) {
        if (!doc.tags.includes(this.activeTagFilter)) return false;
      }

      return true;
    });

    this.selectedIndex = this.filteredDocs.length > 0 ? 0 : -1;
    this.render();

    // Re-render tag filter (available tags may have changed based on state/intent)
    this.renderTagFilter();
  }

  async refresh(): Promise<void> {
    // Show skeleton loading state
    renderSkeletonList(this.listContainer, 5);

    this.docs = await listDomainDocuments();
    this.filteredDocs = [...this.docs];
    this.selectedIndex = -1;

    // Apply any active filters
    this.applyFilters();
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
