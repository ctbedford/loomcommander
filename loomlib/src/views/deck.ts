// Deck View
// Grid-based document browsing with lens-based sorting

import type { Document, DeckLens, DocumentType, ExecutionState, DocumentIntent } from '../types.ts';
import {
  DECK_LENS_CONFIG,
  TYPE_SORT_ORDER,
  STATE_SORT_ORDER,
  INTENT_SORT_ORDER,
  DEFAULT_INTENT,
  getDocumentIcon,
  getIntentIcon,
  getExecutionDots,
} from '../types.ts';
import { listDocuments } from '../data/documents.ts';

export interface DeckViewOptions {
  onDocumentSelect: (doc: Document) => void;
  onDocumentOpen: (doc: Document) => void;
}

// Recency buckets (ms)
const RECENCY_BUCKETS = {
  fresh: 24 * 60 * 60 * 1000,      // < 1 day
  recent: 7 * 24 * 60 * 60 * 1000, // < 1 week
  aging: 30 * 24 * 60 * 60 * 1000, // < 1 month
  // stale: > 1 month
};

// Section labels for grouped lenses
const TYPE_LABELS: Record<DocumentType, string> = {
  framework: 'Frameworks',
  instance: 'Instances',
  source: 'Sources',
  note: 'Notes',
  index: 'Indexes',
};

const STATE_LABELS: Record<ExecutionState, string> = {
  in_progress: 'In Progress',
  pending: 'Pending',
  completed: 'Completed',
  resolved: 'Resolved',
};

const INTENT_LABELS: Record<DocumentIntent, string> = {
  research: 'Research',
  build: 'Build',
  produce: 'Produce',
  capture: 'Capture',
  organize: 'Organize',
};

export class DeckView {
  private container: HTMLElement;
  private grid: HTMLElement;
  private options: DeckViewOptions;

  private docs: Document[] = [];
  private sortedDocs: Document[] = [];
  private activeLens: DeckLens = 'type';
  private focusedIndex = -1;
  private searchQuery = '';
  private activeTagFilter: string | null = null;

  // Element caches for FLIP animation
  private cardElements: Map<string, HTMLElement> = new Map();
  private oldPositions: Map<string, DOMRect> = new Map();

  constructor(container: HTMLElement, options: DeckViewOptions) {
    this.container = container;
    this.options = options;

    this.container.classList.add('deck-view');
    this.container.innerHTML = `
      <div class="deck-view__lens-bar"></div>
      <div class="deck-view__search-bar">
        <input type="text" class="deck-view__search" placeholder="Type to filter..." />
      </div>
      <div class="deck-view__tag-filter">
        <div class="deck-view__tag-selected"></div>
        <div class="deck-view__tag-scroll">
          <div class="deck-view__tag-scroll-inner"></div>
        </div>
      </div>
      <div class="deck-view__grid"></div>
      <div class="deck-view__status">
        <div class="deck-view__status-left">
          <span class="deck-view__status-count"></span>
          <span class="deck-view__status-lens"></span>
        </div>
        <div class="deck-view__status-right">
          <span>↑↓←→ navigate</span>
          <span>Enter open</span>
          <span>1-5 lens</span>
        </div>
      </div>
    `;

    this.grid = this.container.querySelector('.deck-view__grid')!;

    // Event handlers
    this.container.setAttribute('tabindex', '0');
    this.container.addEventListener('keydown', this.handleKeydown);

    // Search input
    const searchInput = this.container.querySelector('.deck-view__search') as HTMLInputElement;
    searchInput.addEventListener('input', () => {
      this.searchQuery = searchInput.value.toLowerCase();
      this.applySearch();
    });

    // Render lens bar
    this.renderLensBar();

    // Load persisted lens
    const savedLens = localStorage.getItem('loomlib:deck-lens') as DeckLens | null;
    if (savedLens && DECK_LENS_CONFIG[savedLens]) {
      this.activeLens = savedLens;
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  // Lens Bar
  // ─────────────────────────────────────────────────────────────────────

  private renderLensBar(): void {
    const bar = this.container.querySelector('.deck-view__lens-bar')!;
    const lenses = Object.entries(DECK_LENS_CONFIG) as [DeckLens, typeof DECK_LENS_CONFIG[DeckLens]][];

    bar.innerHTML = lenses.map(([id, config]) => `
      <button
        class="deck-view__lens-btn ${id === this.activeLens ? 'deck-view__lens-btn--active' : ''}"
        data-lens="${id}"
        title="${config.name} (${config.key})"
      >
        <span class="deck-view__lens-icon">${config.icon}</span>
        <span class="deck-view__lens-name">${config.name}</span>
        <span class="deck-view__lens-key">${config.key}</span>
      </button>
    `).join('');

    // Click handlers
    bar.querySelectorAll('.deck-view__lens-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lens = (btn as HTMLElement).dataset.lens as DeckLens;
        this.switchLens(lens);
      });
    });
  }

  private updateLensBarActive(): void {
    const bar = this.container.querySelector('.deck-view__lens-bar')!;
    bar.querySelectorAll('.deck-view__lens-btn').forEach(btn => {
      const lens = (btn as HTMLElement).dataset.lens as DeckLens;
      btn.classList.toggle('deck-view__lens-btn--active', lens === this.activeLens);
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // Sorting
  // ─────────────────────────────────────────────────────────────────────

  private sortByLens(docs: Document[], lens: DeckLens): Document[] {
    const sorted = [...docs];

    switch (lens) {
      case 'type':
        sorted.sort((a, b) => {
          const aIdx = TYPE_SORT_ORDER.indexOf(a.type);
          const bIdx = TYPE_SORT_ORDER.indexOf(b.type);
          if (aIdx !== bIdx) return aIdx - bIdx;
          return a.title.localeCompare(b.title);
        });
        break;

      case 'recency':
        sorted.sort((a, b) => b.modifiedAt - a.modifiedAt);
        break;

      case 'state':
        sorted.sort((a, b) => {
          const aState = a.execution_state ?? 'pending';
          const bState = b.execution_state ?? 'pending';
          const aIdx = STATE_SORT_ORDER.indexOf(aState);
          const bIdx = STATE_SORT_ORDER.indexOf(bState);
          if (aIdx !== bIdx) return aIdx - bIdx;
          return b.modifiedAt - a.modifiedAt;
        });
        break;

      case 'intent':
        sorted.sort((a, b) => {
          const aIntent = a.intent ?? DEFAULT_INTENT[a.type];
          const bIntent = b.intent ?? DEFAULT_INTENT[b.type];
          const aIdx = INTENT_SORT_ORDER.indexOf(aIntent);
          const bIdx = INTENT_SORT_ORDER.indexOf(bIntent);
          if (aIdx !== bIdx) return aIdx - bIdx;
          return a.title.localeCompare(b.title);
        });
        break;

      case 'lineage':
        sorted.sort((a, b) => {
          const aDepth = a.upstream?.length ?? 0;
          const bDepth = b.upstream?.length ?? 0;
          if (aDepth !== bDepth) return aDepth - bDepth;
          return a.title.localeCompare(b.title);
        });
        break;
    }

    return sorted;
  }

  // ─────────────────────────────────────────────────────────────────────
  // Rendering
  // ─────────────────────────────────────────────────────────────────────

  private render(): void {
    this.grid.innerHTML = '';
    this.cardElements.clear();

    // Update lens class on container
    this.container.className = 'deck-view';
    this.container.classList.add(`deck-view--lens-${this.activeLens}`);

    // Group docs if needed
    const grouped = this.shouldGroup(this.activeLens);

    if (grouped) {
      this.renderGrouped();
    } else {
      this.renderFlat();
    }

    // Update status
    this.updateStatus();

    // Render tag filter
    this.renderTagFilter();

    // Apply search filter (also applies tag filter)
    this.applySearch();

    // Reset focus if needed
    if (this.focusedIndex >= this.sortedDocs.length) {
      this.focusedIndex = Math.max(0, this.sortedDocs.length - 1);
    }
    this.updateFocus();
  }

  private shouldGroup(lens: DeckLens): boolean {
    return lens === 'type' || lens === 'state' || lens === 'intent';
  }

  private renderFlat(): void {
    for (const doc of this.sortedDocs) {
      const card = this.createCard(doc);
      this.grid.appendChild(card);
      this.cardElements.set(doc.id, card);
    }
  }

  private renderGrouped(): void {
    let currentGroup: string | null = null;

    for (const doc of this.sortedDocs) {
      const group = this.getGroup(doc);

      if (group !== currentGroup) {
        currentGroup = group;
        const header = this.createSectionHeader(group);
        this.grid.appendChild(header);
      }

      const card = this.createCard(doc);
      this.grid.appendChild(card);
      this.cardElements.set(doc.id, card);
    }
  }

  private getGroup(doc: Document): string {
    switch (this.activeLens) {
      case 'type':
        return TYPE_LABELS[doc.type];
      case 'state':
        return STATE_LABELS[doc.execution_state ?? 'pending'];
      case 'intent':
        return INTENT_LABELS[doc.intent ?? DEFAULT_INTENT[doc.type]];
      default:
        return '';
    }
  }

  private createSectionHeader(label: string): HTMLElement {
    const header = document.createElement('div');
    header.className = 'deck-view__section';

    // Count docs in this group
    const count = this.sortedDocs.filter(d => this.getGroup(d) === label).length;

    header.innerHTML = `
      <span class="deck-view__section-label">${label}</span>
      <span class="deck-view__section-count">${count}</span>
    `;

    return header;
  }

  private createCard(doc: Document): HTMLElement {
    const card = document.createElement('div');
    card.className = 'deck-card';
    card.dataset.id = doc.id;
    card.dataset.type = doc.type;
    card.dataset.state = doc.execution_state ?? 'pending';
    card.dataset.intent = doc.intent ?? DEFAULT_INTENT[doc.type];

    // Recency bucket
    const age = Date.now() - doc.modifiedAt;
    let recency = 'stale';
    if (age < RECENCY_BUCKETS.fresh) recency = 'fresh';
    else if (age < RECENCY_BUCKETS.recent) recency = 'recent';
    else if (age < RECENCY_BUCKETS.aging) recency = 'aging';
    card.dataset.recency = recency;

    // Lineage depth
    const depth = doc.upstream?.length ?? 0;
    card.dataset.depth = depth.toString();

    card.innerHTML = `
      <div class="deck-card__header">
        <span class="deck-card__icon">${getDocumentIcon(doc)}</span>
        <span class="deck-card__title">${doc.title || 'Untitled'}</span>
      </div>
      <div class="deck-card__footer">
        <span class="deck-card__state" data-state="${doc.execution_state ?? 'pending'}">${getExecutionDots(doc)}</span>
        <span class="deck-card__intent">${getIntentIcon(doc)}</span>
        <span class="deck-card__type">${doc.type}</span>
      </div>
    `;

    // Click handler - single click opens document
    card.addEventListener('click', () => {
      const idx = this.sortedDocs.findIndex(d => d.id === doc.id);
      this.focusedIndex = idx;
      this.updateFocus();
      this.options.onDocumentOpen(doc);
    });

    return card;
  }

  // ─────────────────────────────────────────────────────────────────────
  // FLIP Animation
  // ─────────────────────────────────────────────────────────────────────

  private capturePositions(): void {
    this.oldPositions.clear();
    for (const [id, el] of this.cardElements) {
      this.oldPositions.set(id, el.getBoundingClientRect());
    }
  }

  private animateFlip(): void {
    // Get new positions and animate
    for (const [id, el] of this.cardElements) {
      const oldRect = this.oldPositions.get(id);
      if (!oldRect) continue;

      const newRect = el.getBoundingClientRect();
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;

      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;

      el.classList.add('deck-card--animating');
      el.animate([
        { transform: `translate(${dx}px, ${dy}px)` },
        { transform: 'translate(0, 0)' }
      ], {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }).onfinish = () => {
        el.classList.remove('deck-card--animating');
      };
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  // Lens Switching
  // ─────────────────────────────────────────────────────────────────────

  private switchLens(lens: DeckLens): void {
    if (lens === this.activeLens) return;

    // Capture old positions for FLIP
    this.capturePositions();

    // Switch lens
    this.activeLens = lens;
    this.sortedDocs = this.sortByLens(this.docs, lens);

    // Persist
    localStorage.setItem('loomlib:deck-lens', lens);

    // Update UI
    this.updateLensBarActive();
    this.render();

    // Animate
    requestAnimationFrame(() => {
      this.animateFlip();
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // Search
  // ─────────────────────────────────────────────────────────────────────

  private applySearch(): void {
    for (const [id, el] of this.cardElements) {
      const doc = this.docs.find(d => d.id === id);
      if (!doc) continue;

      // Check search query match
      let matchesSearch = true;
      if (this.searchQuery) {
        matchesSearch =
          doc.title.toLowerCase().includes(this.searchQuery) ||
          doc.content.toLowerCase().includes(this.searchQuery) ||
          doc.tags.some(t => t.toLowerCase().includes(this.searchQuery));
      }

      // Check tag filter match
      let matchesTag = true;
      if (this.activeTagFilter) {
        matchesTag = doc.tags.includes(this.activeTagFilter);
      }

      // Dim if either filter fails
      el.classList.toggle('deck-card--dimmed', !matchesSearch || !matchesTag);
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  // Tag Filter
  // ─────────────────────────────────────────────────────────────────────

  private getContextualTags(): string[] {
    // Get all unique tags from all documents
    const tags = new Set<string>();
    for (const doc of this.docs) {
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
    const tagFilter = this.container.querySelector('.deck-view__tag-filter');
    if (!tagFilter) return;

    const selectedEl = tagFilter.querySelector('.deck-view__tag-selected')!;
    const scrollEl = tagFilter.querySelector('.deck-view__tag-scroll')!;
    const scrollInner = scrollEl.querySelector('.deck-view__tag-scroll-inner')!;

    const tags = this.getContextualTags();

    // Hide entire row if no tags
    if (tags.length === 0) {
      tagFilter.classList.add('deck-view__tag-filter--hidden');
      return;
    }
    tagFilter.classList.remove('deck-view__tag-filter--hidden');

    // Render selected tag (if any)
    if (this.activeTagFilter) {
      selectedEl.innerHTML = `
        <button class="deck-view__chip deck-view__chip--tag deck-view__chip--active" data-tag="${this.escapeHtml(this.activeTagFilter)}">
          ${this.escapeHtml(this.activeTagFilter)}
        </button>
      `;
      selectedEl.classList.add('deck-view__tag-selected--active');
      selectedEl.querySelector('button')?.addEventListener('click', () => this.selectTag(this.activeTagFilter!));
    } else {
      selectedEl.innerHTML = '';
      selectedEl.classList.remove('deck-view__tag-selected--active');
    }

    // Filter out selected tag from scroll
    const scrollTags = tags.filter(t => t !== this.activeTagFilter);

    if (scrollTags.length === 0) {
      scrollInner.innerHTML = '';
      scrollEl.classList.add('deck-view__tag-scroll--empty');
      return;
    }
    scrollEl.classList.remove('deck-view__tag-scroll--empty');

    // Calculate animation duration based on tag count
    // Very slow scroll: 90s base, 4.5s per tag
    const duration = Math.max(90, scrollTags.length * 4.5);
    (scrollInner as HTMLElement).style.setProperty('--tag-scroll-duration', `${duration}s`);

    // Duplicate tags for seamless loop
    const tagsHtml = scrollTags.map(t => `
      <button class="deck-view__chip deck-view__chip--tag" data-tag="${this.escapeHtml(t)}">${this.escapeHtml(t)}</button>
    `).join('');

    scrollInner.innerHTML = tagsHtml + tagsHtml;

    // Bind click handlers
    scrollInner.querySelectorAll('.deck-view__chip--tag').forEach(chip => {
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
    this.applySearch();
    this.updateStatus();
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ─────────────────────────────────────────────────────────────────────
  // Focus / Navigation
  // ─────────────────────────────────────────────────────────────────────

  private updateFocus(): void {
    // Remove old focus
    this.grid.querySelectorAll('.deck-card--focused').forEach(el => {
      el.classList.remove('deck-card--focused');
    });

    // Add new focus
    if (this.focusedIndex >= 0 && this.focusedIndex < this.sortedDocs.length) {
      const doc = this.sortedDocs[this.focusedIndex];
      const el = this.cardElements.get(doc.id);
      if (el) {
        el.classList.add('deck-card--focused');
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }

  private getColumnCount(): number {
    // Calculate based on grid layout
    const gridStyle = getComputedStyle(this.grid);
    const columns = gridStyle.gridTemplateColumns.split(' ').length;
    return Math.max(1, columns);
  }

  private handleKeydown = (e: KeyboardEvent): void => {
    // Number keys for lens switching
    const key = e.key;
    for (const [lens, config] of Object.entries(DECK_LENS_CONFIG)) {
      if (config.key === key) {
        e.preventDefault();
        this.switchLens(lens as DeckLens);
        return;
      }
    }

    // Grid navigation
    const columns = this.getColumnCount();
    const maxIndex = this.sortedDocs.length - 1;

    switch (key) {
      case 'ArrowRight':
        e.preventDefault();
        this.focusedIndex = Math.min(this.focusedIndex + 1, maxIndex);
        this.updateFocus();
        break;

      case 'ArrowLeft':
        e.preventDefault();
        this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
        this.updateFocus();
        break;

      case 'ArrowDown':
        e.preventDefault();
        this.focusedIndex = Math.min(this.focusedIndex + columns, maxIndex);
        this.updateFocus();
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.focusedIndex = Math.max(this.focusedIndex - columns, 0);
        this.updateFocus();
        break;

      case 'Enter':
        e.preventDefault();
        if (this.focusedIndex >= 0) {
          const doc = this.sortedDocs[this.focusedIndex];
          if (doc) {
            this.options.onDocumentOpen(doc);
          }
        }
        break;

      case 'Home':
        e.preventDefault();
        this.focusedIndex = 0;
        this.updateFocus();
        break;

      case 'End':
        e.preventDefault();
        this.focusedIndex = maxIndex;
        this.updateFocus();
        break;
    }
  };

  // ─────────────────────────────────────────────────────────────────────
  // Status
  // ─────────────────────────────────────────────────────────────────────

  private updateStatus(): void {
    const countEl = this.container.querySelector('.deck-view__status-count')!;
    const lensEl = this.container.querySelector('.deck-view__status-lens')!;

    countEl.textContent = `${this.sortedDocs.length} documents`;

    let statusText = `${DECK_LENS_CONFIG[this.activeLens].name} lens`;
    if (this.activeTagFilter) {
      statusText += ` · #${this.activeTagFilter}`;
    }
    lensEl.textContent = statusText;
  }

  // ─────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────

  async refresh(): Promise<void> {
    this.docs = await listDocuments();
    this.sortedDocs = this.sortByLens(this.docs, this.activeLens);
    this.render();
  }

  show(): void {
    this.container.classList.add('shell__view--visible');
    this.refresh();
  }

  hide(): void {
    this.container.classList.remove('shell__view--visible');
  }

  focus(): void {
    this.container.focus();
    if (this.focusedIndex < 0 && this.sortedDocs.length > 0) {
      this.focusedIndex = 0;
      this.updateFocus();
    }
  }

  getFocusedId(): string | null {
    if (this.focusedIndex >= 0 && this.focusedIndex < this.sortedDocs.length) {
      return this.sortedDocs[this.focusedIndex].id;
    }
    return null;
  }

  setFocusedId(id: string): void {
    const idx = this.sortedDocs.findIndex(d => d.id === id);
    if (idx >= 0) {
      this.focusedIndex = idx;
      this.updateFocus();
    }
  }

  hasOpenOverlay(): boolean {
    return false;
  }
}
