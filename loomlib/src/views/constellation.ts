import type {
  Document,
  GraphNode,
  GraphEdge,
  RelationshipCategory,
  SlotLimits,
  LensId,
} from '../types.ts';
import type { CategorizedDocs } from '../data/graph.ts';
import { getDocumentIcon, getDocumentColor, getIntentIcon, getExecutionDots } from '../types.ts';
import { listDocuments } from '../data/documents.ts';
import {
  computeGraph,
  categorizeDocs,
  computeVisibleDocs,
  getProductionFormula,
  getParentIds,
} from '../data/graph.ts';
import {
  getAdaptiveLimits,
  getLensById,
  DEFAULT_SLOT_LIMITS,
} from '../data/constellation-config.ts';

const CATEGORY_ORDER: RelationshipCategory[] = ['parent', 'child', 'sibling', 'distant'];
import { LensPicker } from '../components/lens-picker.ts';
import { FormulaBar } from '../components/formula-bar.ts';

export interface ConstellationViewOptions {
  onDocumentSelect: (doc: Document) => void;
  onDocumentOpen: (doc: Document) => void;
}

export class ConstellationView {
  private container: HTMLElement;
  private canvas: HTMLElement;
  private svg: SVGSVGElement;
  private preview: HTMLElement;
  private options: ConstellationViewOptions;

  private docs: Document[] = [];
  private nodes: GraphNode[] = [];
  private edges: GraphEdge[] = [];
  private focusedId: string | null = null;
  private focusedIndex = 0;
  private hidePreviewTimeout: number | null = null;

  // DOM element cache for animation (keeps nodes between renders)
  private nodeElements: Map<string, HTMLElement> = new Map();

  // Slot system state (simplified 4 categories)
  private slotOffsets: Record<RelationshipCategory, number> = {
    parent: 0,
    child: 0,
    sibling: 0,
    distant: 0,
  };
  private slotLimits: SlotLimits = DEFAULT_SLOT_LIMITS;
  private categorizedDocs: CategorizedDocs | null = null;
  private activeSlot: RelationshipCategory = 'child';

  // Lens system state
  private activeLens: LensId = 'default';
  private lensIndicator: HTMLElement | null = null;
  private lensPicker: LensPicker | null = null;
  private formulaBar: FormulaBar | null = null;

  constructor(container: HTMLElement, options: ConstellationViewOptions) {
    this.container = container;
    this.options = options;

    this.container.classList.add('constellation-view');
    this.container.innerHTML = `
      <svg class="constellation-tethers"></svg>
      <div class="constellation-canvas"></div>
      <div class="constellation-preview"></div>
      <div class="formula-bar"></div>
      <div class="constellation-lens-indicator"></div>
      <div class="constellation-lens-picker"></div>
    `;

    this.svg = this.container.querySelector('.constellation-tethers')!;
    this.canvas = this.container.querySelector('.constellation-canvas')!;
    this.preview = this.container.querySelector('.constellation-preview')!;

    // Initialize formula bar
    const formulaBarContainer = this.container.querySelector('.formula-bar')!;
    this.formulaBar = new FormulaBar(formulaBarContainer as HTMLElement);

    this.lensIndicator = this.container.querySelector('.constellation-lens-indicator')!;
    this.updateLensIndicator();

    // Set up lens indicator click handler
    this.lensIndicator.addEventListener('click', () => this.showLensPicker());

    // Set up lens picker
    const pickerContainer = this.container.querySelector('.constellation-lens-picker')!;
    this.lensPicker = new LensPicker(pickerContainer as HTMLElement, {
      onSelect: (lensId) => {
        this.setLens(lensId);
        this.lensPicker?.hide();
        this.container.focus();
      },
      onClose: () => {
        this.lensPicker?.hide();
        this.container.focus();
      },
    });

    // Event handlers
    this.container.addEventListener('keydown', this.handleKeydown);
    this.container.setAttribute('tabindex', '0');

    // Keep preview visible when hovering over it
    this.preview.addEventListener('mouseenter', () => {
      if (this.hidePreviewTimeout !== null) {
        clearTimeout(this.hidePreviewTimeout);
        this.hidePreviewTimeout = null;
      }
    });

    this.preview.addEventListener('mouseleave', () => {
      this.scheduleHidePreview();
    });
  }

  async refresh(): Promise<void> {
    this.docs = await listDocuments();

    // Default focus to first document if none selected
    if (!this.focusedId && this.docs.length > 0) {
      this.focusedId = this.docs[0].id;
      this.focusedIndex = 0;
    }

    // Clear node cache on data refresh (documents may have changed)
    this.nodeElements.clear();
    this.canvas.innerHTML = '';

    this.computeLayout();
    this.render();
  }

  private computeLayout(): void {
    const rect = this.container.getBoundingClientRect();
    const width = rect.width || 800;
    const height = rect.height || 600;

    const focusDoc = this.docs.find(d => d.id === this.focusedId);
    const lens = getLensById(this.activeLens);

    // Apply lens filter
    let filteredDocs = this.docs;
    if (focusDoc && this.activeLens !== 'default') {
      filteredDocs = this.docs.filter(d =>
        d.id === this.focusedId || lens.filter(d, focusDoc)
      );
    }

    // Apply lens sort
    if (focusDoc) {
      filteredDocs = [...filteredDocs].sort((a, b) => {
        if (a.id === this.focusedId) return -1;
        if (b.id === this.focusedId) return 1;
        return lens.sort(a, b, focusDoc);
      });
    }

    // Get adaptive limits based on doc count
    this.slotLimits = getAdaptiveLimits(filteredDocs.length);

    // Categorize all docs using simplified 4 categories
    this.categorizedDocs = categorizeDocs(filteredDocs, this.focusedId);

    // Update formula bar
    if (focusDoc && this.focusedId) {
      const formula = getProductionFormula(this.docs, this.focusedId);
      this.formulaBar?.update(focusDoc, formula);
    } else {
      this.formulaBar?.hide();
    }

    // Get visible subset based on offsets
    const visibleDocs = computeVisibleDocs(
      this.categorizedDocs,
      this.slotLimits,
      this.slotOffsets
    );

    // Compute graph with only visible docs (plus focus)
    const allVisible = [
      ...(focusDoc ? [focusDoc] : []),
      ...visibleDocs.parent,
      ...visibleDocs.child,
      ...visibleDocs.sibling,
      ...visibleDocs.distant,
    ];

    const result = computeGraph(allVisible, this.focusedId, width, height);
    this.nodes = result.nodes;
    this.edges = result.edges;
  }

  private render(): void {
    this.renderTethers();
    this.renderNodes();
    this.renderSlotIndicators();
  }

  private renderTethers(): void {
    // Clear existing tethers
    this.svg.innerHTML = '';

    // Create SVG defs for glow filter
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <filter id="tether-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    `;
    this.svg.appendChild(defs);

    // Create node position map
    const nodeMap = new Map(this.nodes.map((n) => [n.doc.id, n]));
    const focusDoc = this.docs.find(d => d.id === this.focusedId);

    // Render edges - only those connected to focus
    for (const edge of this.edges) {
      // Filter: only render tethers where at least one endpoint is focused
      if (edge.source !== this.focusedId && edge.target !== this.focusedId) {
        continue;
      }

      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);

      if (!sourceNode || !targetNode) continue;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(sourceNode.x));
      line.setAttribute('y1', String(sourceNode.y));
      line.setAttribute('x2', String(targetNode.x));
      line.setAttribute('y2', String(targetNode.y));
      line.setAttribute('class', 'tether');

      // Determine relationship type for coloring
      if (focusDoc) {
        const otherDoc = sourceNode.doc.id === this.focusedId ? targetNode.doc : sourceNode.doc;
        const relType = this.getTetherRelationType(focusDoc, otherDoc);
        if (relType) {
          line.classList.add(`tether--${relType}`);
        }
      }

      // Highlight tethers connected to focus
      if (sourceNode.doc.id === this.focusedId || targetNode.doc.id === this.focusedId) {
        line.classList.add('tether--focused');
      }

      this.svg.appendChild(line);
    }
  }

  private getTetherRelationType(focusDoc: Document, otherDoc: Document): string | null {
    // Check if other doc is a parent (focus references it via upstream or legacy fields)
    const focusParentIds = getParentIds(focusDoc);
    if (focusParentIds.includes(otherDoc.id)) {
      // Determine specific parent type from upstream relation or fall back to framework_kind
      if (focusDoc.upstream && focusDoc.upstream.length > 0) {
        const ref = focusDoc.upstream.find(r => r.doc === otherDoc.id);
        if (ref?.relation === 'source') return 'source';
      }
      // Fallback: check legacy source_id
      if (focusDoc.source_id === otherDoc.id) return 'source';
      // Otherwise categorize by framework_kind
      return otherDoc.framework_kind === 'domain' ? 'domain' : 'toolkit';
    }

    // Check if other doc is a child (it references focus via upstream or legacy fields)
    const otherParentIds = getParentIds(otherDoc);
    if (otherParentIds.includes(focusDoc.id)) {
      return 'child';
    }

    // Check siblings
    if (focusDoc.perspective && otherDoc.perspective === focusDoc.perspective) {
      return 'perspective';
    }
    if (focusDoc.output && otherDoc.output === focusDoc.output) {
      return 'channel';
    }

    return null;
  }

  private renderNodes(): void {
    const currentIds = new Set(this.nodes.map(n => n.doc.id));

    // Remove nodes that are no longer visible
    for (const [id, element] of this.nodeElements) {
      if (!currentIds.has(id)) {
        element.remove();
        this.nodeElements.delete(id);
      }
    }

    // Update or create nodes
    for (const node of this.nodes) {
      let card = this.nodeElements.get(node.doc.id);

      if (card) {
        // Update existing node position and layer (CSS will animate)
        card.style.left = `${node.x}px`;
        card.style.top = `${node.y}px`;
        card.dataset.layer = node.layer;
        card.dataset.status = node.doc.status;
      } else {
        // Create new node
        card = this.createNodeCard(node);
        this.canvas.appendChild(card);
        this.nodeElements.set(node.doc.id, card);
      }
    }
  }

  private renderSlotIndicators(): void {
    // Remove existing indicators
    this.container.querySelectorAll('.constellation-slot-indicator').forEach(el => el.remove());

    if (!this.categorizedDocs) return;

    for (const cat of CATEGORY_ORDER) {
      const total = this.categorizedDocs[cat].length;
      const max = this.slotLimits[cat];
      const offset = this.slotOffsets[cat];

      if (total <= max) continue; // no overflow, no indicator needed

      const indicator = document.createElement('div');
      indicator.className = `constellation-slot-indicator constellation-slot-indicator--${cat}`;
      if (cat === this.activeSlot) {
        indicator.classList.add('constellation-slot-indicator--active');
      }

      // Human-readable category names
      const categoryNames: Record<RelationshipCategory, string> = {
        parent: 'Parents',
        child: 'Children',
        sibling: 'Siblings',
        distant: 'Distant',
      };

      indicator.innerHTML = `
        <span class="constellation-slot-indicator__label">${categoryNames[cat]}</span>
        <button class="constellation-slot-indicator__prev" ${offset === 0 ? 'disabled' : ''}>‹</button>
        <span class="constellation-slot-indicator__count">
          ${offset + 1}–${Math.min(offset + max, total)} of ${total}
        </span>
        <button class="constellation-slot-indicator__next" ${offset + max >= total ? 'disabled' : ''}>›</button>
      `;

      // Click handlers
      indicator.querySelector('.constellation-slot-indicator__prev')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.scrollSlot(cat, -1);
      });
      indicator.querySelector('.constellation-slot-indicator__next')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.scrollSlot(cat, 1);
      });

      this.canvas.appendChild(indicator);
    }
  }

  private scrollSlot(category: RelationshipCategory, direction: -1 | 1): void {
    if (!this.categorizedDocs) return;

    const total = this.categorizedDocs[category].length;
    const max = this.slotLimits[category];
    const current = this.slotOffsets[category];

    const newOffset = Math.max(0, Math.min(current + direction, total - max));

    if (newOffset !== current) {
      this.slotOffsets[category] = newOffset;
      this.computeLayout();
      this.render();
    }
  }

  private cycleActiveSlot(direction: -1 | 1): void {
    const currentIndex = CATEGORY_ORDER.indexOf(this.activeSlot);
    const newIndex = (currentIndex + direction + CATEGORY_ORDER.length) % CATEGORY_ORDER.length;
    this.activeSlot = CATEGORY_ORDER[newIndex];
    this.render(); // re-render to highlight active slot
  }

  private updateLensIndicator(): void {
    if (!this.lensIndicator) return;
    const lens = getLensById(this.activeLens);
    this.lensIndicator.innerHTML = `
      <span class="constellation-lens-indicator__icon">${lens.icon}</span>
      <span class="constellation-lens-indicator__name">${lens.name}</span>
      <span class="constellation-lens-indicator__shortcut">⌘L</span>
    `;
  }

  setLens(lensId: LensId): void {
    this.activeLens = lensId;
    this.updateLensIndicator();

    // Reset scroll offsets when changing lens
    this.slotOffsets = {
      parent: 0,
      child: 0,
      sibling: 0,
      distant: 0,
    };

    this.computeLayout();
    this.render();
  }

  getActiveLens(): LensId {
    return this.activeLens;
  }

  showLensPicker(): void {
    this.lensPicker?.show(this.activeLens);
  }

  hideLensPicker(): void {
    this.lensPicker?.hide();
  }

  private createNodeCard(node: GraphNode): HTMLElement {
    const card = document.createElement('div');
    card.className = 'constellation-node';
    card.dataset.id = node.doc.id;
    card.dataset.layer = node.layer;
    card.dataset.status = node.doc.status;
    card.dataset.executionState = node.doc.execution_state ?? 'pending';

    // Position
    card.style.left = `${node.x}px`;
    card.style.top = `${node.y}px`;

    // Icon
    const icon = document.createElement('span');
    icon.className = 'constellation-node__icon';
    icon.textContent = getDocumentIcon(node.doc);
    icon.style.color = getDocumentColor(node.doc);
    card.appendChild(icon);

    // Intent icon
    const intentIcon = document.createElement('span');
    intentIcon.className = 'constellation-node__intent';
    intentIcon.textContent = getIntentIcon(node.doc);
    card.appendChild(intentIcon);

    // Title
    const title = document.createElement('span');
    title.className = 'constellation-node__title';
    title.textContent = node.doc.title || 'Untitled';
    card.appendChild(title);

    // Execution state dots
    const stateDots = document.createElement('span');
    stateDots.className = 'constellation-node__state';
    stateDots.textContent = getExecutionDots(node.doc);
    stateDots.dataset.state = node.doc.execution_state ?? 'pending';
    card.appendChild(stateDots);

    // Click immediately focuses (no delay)
    // Double-click opens document
    card.addEventListener('click', () => {
      // If clicking the already-focused node, open it
      if (node.doc.id === this.focusedId) {
        this.options.onDocumentOpen(node.doc);
      } else {
        // Focus new node immediately
        this.setFocus(node.doc.id);
        this.options.onDocumentSelect(node.doc);
      }
    });

    // Native double-click also opens (works on any node)
    card.addEventListener('dblclick', () => {
      this.options.onDocumentOpen(node.doc);
    });

    // Hover preview for all nodes
    card.addEventListener('mouseenter', () => {
      this.showPreview(node.doc, card);
    });

    card.addEventListener('mouseleave', () => {
      this.scheduleHidePreview();
    });

    return card;
  }

  private showPreview(doc: Document, card: HTMLElement): void {
    // Cancel any pending hide
    if (this.hidePreviewTimeout !== null) {
      clearTimeout(this.hidePreviewTimeout);
      this.hidePreviewTimeout = null;
    }

    // Get content preview (first 200 chars, strip markdown)
    const contentPreview = doc.content
      .replace(/^#+\s*/gm, '') // Remove headers
      .replace(/\*\*/g, '')    // Remove bold
      .replace(/\*/g, '')      // Remove italic
      .replace(/`/g, '')       // Remove code
      .trim()
      .slice(0, 200);

    // Build preview HTML
    const icon = getDocumentIcon(doc);
    const color = getDocumentColor(doc);
    const tags = doc.tags.length > 0
      ? `<div class="constellation-preview__tags">${doc.tags.map(t => `<span class="constellation-preview__tag">${t}</span>`).join('')}</div>`
      : '';

    this.preview.innerHTML = `
      <div class="constellation-preview__header">
        <span class="constellation-preview__icon" style="color: ${color}">${icon}</span>
        <span class="constellation-preview__title">${doc.title || 'Untitled'}</span>
      </div>
      <div class="constellation-preview__meta">
        <span class="constellation-preview__type">${doc.type}${doc.framework_kind ? ` / ${doc.framework_kind}` : ''}</span>
        <span class="constellation-preview__status constellation-preview__status--${doc.status}">${doc.status}</span>
      </div>
      ${tags}
      <div class="constellation-preview__content">${contentPreview}${contentPreview.length >= 200 ? '...' : ''}</div>
    `;

    // Position preview near the card
    const cardRect = card.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    const previewWidth = 280;
    const previewHeight = 200; // approximate

    // Calculate position relative to container
    let left = cardRect.right - containerRect.left + 12;
    let top = cardRect.top - containerRect.top;

    // Flip to left side if too close to right edge
    if (left + previewWidth > containerRect.width - 20) {
      left = cardRect.left - containerRect.left - previewWidth - 12;
    }

    // Adjust vertical if too close to bottom
    if (top + previewHeight > containerRect.height - 20) {
      top = containerRect.height - previewHeight - 20;
    }

    // Ensure not above top
    if (top < 20) top = 20;

    this.preview.style.left = `${left}px`;
    this.preview.style.top = `${top}px`;
    this.preview.classList.add('constellation-preview--visible');
  }

  private scheduleHidePreview(): void {
    // Small delay to allow moving to preview panel
    this.hidePreviewTimeout = window.setTimeout(() => {
      this.preview.classList.remove('constellation-preview--visible');
    }, 150);
  }

  private setFocus(id: string): void {
    this.focusedId = id;
    this.focusedIndex = this.docs.findIndex((d) => d.id === id);
    this.computeLayout();
    this.render();
  }

  private handleKeydown = (e: KeyboardEvent): void => {
    // Cmd/Ctrl+L to open lens picker
    if (e.key === 'l' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (this.lensPicker?.isVisible()) {
        this.hideLensPicker();
      } else {
        this.showLensPicker();
      }
      return;
    }

    // If lens picker is visible, don't handle other keys
    if (this.lensPicker?.isVisible()) {
      return;
    }

    if (this.docs.length === 0) return;

    // Slot scroll: [ and ]
    if (e.key === '[') {
      e.preventDefault();
      this.scrollSlot(this.activeSlot, -1);
      return;
    }
    if (e.key === ']') {
      e.preventDefault();
      this.scrollSlot(this.activeSlot, 1);
      return;
    }

    // Cycle active slot: Tab / Shift+Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      this.cycleActiveSlot(e.shiftKey ? -1 : 1);
      return;
    }

    let newIndex = this.focusedIndex;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        newIndex = Math.min(this.focusedIndex + 1, this.docs.length - 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        newIndex = Math.max(this.focusedIndex - 1, 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (this.focusedId) {
          const doc = this.docs.find((d) => d.id === this.focusedId);
          if (doc) {
            this.options.onDocumentOpen(doc);
          }
        }
        return;
      default:
        return;
    }

    if (newIndex !== this.focusedIndex && this.docs[newIndex]) {
      this.setFocus(this.docs[newIndex].id);
    }
  };

  focus(): void {
    this.container.focus();
  }

  show(): void {
    this.container.classList.add('shell__view--visible');
    this.refresh();
  }

  hide(): void {
    this.container.classList.remove('shell__view--visible');
  }

  getFocusedId(): string | null {
    return this.focusedId;
  }

  /**
   * Check if any overlay (lens picker, etc.) is currently open.
   * Used by Shell to determine if Escape should be handled locally.
   */
  hasOpenOverlay(): boolean {
    return this.lensPicker?.isVisible() ?? false;
  }
}
