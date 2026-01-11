// Spatial Canvas View
// UMAP-projected document positions with overlay system

import type { Document, UmapCoord, OverlayId, Viewport } from '../types.ts';
import { getDocumentIcon, getDocumentColor, getIntentIcon, getExecutionDots } from '../types.ts';
import { listDocuments } from '../data/documents.ts';
import { getUmapCoords } from '../data/umap.ts';
import { getAllEmbeddings } from '../data/db.ts';

export interface SpatialViewOptions {
  onDocumentSelect: (doc: Document) => void;
  onDocumentOpen: (doc: Document) => void;
}

// Overlay definitions
const OVERLAYS: { id: OverlayId; name: string; key: string; icon: string }[] = [
  { id: 'type', name: 'Type', key: '1', icon: '◧' },
  { id: 'state', name: 'State', key: '2', icon: '●' },
  { id: 'intent', name: 'Intent', key: '3', icon: '⚡' },
  { id: 'recency', name: 'Recency', key: '4', icon: '◔' },
  { id: 'lineage', name: 'Lineage', key: '5', icon: '↗' },
];

// Recency buckets (ms)
const RECENCY_BUCKETS = {
  fresh: 24 * 60 * 60 * 1000,      // < 1 day
  recent: 7 * 24 * 60 * 60 * 1000, // < 1 week
  aging: 30 * 24 * 60 * 60 * 1000, // < 1 month
  // stale: > 1 month
};

export class SpatialView {
  private container: HTMLElement;
  private canvas: HTMLElement;
  private options: SpatialViewOptions;

  private docs: Document[] = [];
  private coords: Map<string, UmapCoord> = new Map();
  private hasEmbeddings = false;

  // Viewport state
  private viewport: Viewport = { x: 0, y: 0, zoom: 1 };
  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private viewportStart = { x: 0, y: 0 };

  // Selection state
  private focusedId: string | null = null;

  // Overlay state
  private activeOverlays: Set<OverlayId> = new Set(['type']);

  // Node element cache
  private nodeElements: Map<string, HTMLElement> = new Map();

  constructor(container: HTMLElement, options: SpatialViewOptions) {
    this.container = container;
    this.options = options;

    this.container.classList.add('spatial-view');
    this.container.innerHTML = `
      <div class="spatial-view__canvas"></div>
      <div class="spatial-view__overlay-bar"></div>
      <div class="spatial-view__status"></div>
      <div class="spatial-view__empty">
        <div class="spatial-view__empty-icon">🌌</div>
        <div class="spatial-view__empty-text">No embeddings available</div>
        <div class="spatial-view__empty-hint">Configure Voyage API key to enable semantic positioning</div>
      </div>
    `;

    this.canvas = this.container.querySelector('.spatial-view__canvas')!;

    // Event handlers
    this.container.setAttribute('tabindex', '0');
    this.container.addEventListener('keydown', this.handleKeydown);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('wheel', this.handleWheel, { passive: false });

    // Render overlay bar
    this.renderOverlayBar();
  }

  async refresh(): Promise<void> {
    // Fetch docs
    this.docs = await listDocuments();

    // Check if we have embeddings
    const embeddings = await getAllEmbeddings();
    this.hasEmbeddings = embeddings.size > 0;

    if (!this.hasEmbeddings) {
      this.showEmptyState();
      return;
    }

    // Get UMAP coords (computes if needed)
    this.coords = await getUmapCoords();

    // Hide empty state
    this.container.querySelector('.spatial-view__empty')?.classList.remove('spatial-view__empty--visible');

    // Default focus
    if (!this.focusedId && this.docs.length > 0) {
      this.focusedId = this.docs[0].id;
    }

    this.render();
    this.updateStatus();
  }

  private showEmptyState(): void {
    this.container.querySelector('.spatial-view__empty')?.classList.add('spatial-view__empty--visible');
  }

  private renderOverlayBar(): void {
    const bar = this.container.querySelector('.spatial-view__overlay-bar')!;
    bar.innerHTML = OVERLAYS.map(overlay => `
      <button
        class="spatial-view__overlay-btn ${this.activeOverlays.has(overlay.id) ? 'spatial-view__overlay-btn--active' : ''}"
        data-overlay="${overlay.id}"
        title="${overlay.name} (${overlay.key})"
      >
        <span class="spatial-view__overlay-icon">${overlay.icon}</span>
        <span class="spatial-view__overlay-key">${overlay.key}</span>
      </button>
    `).join('');

    // Click handlers
    bar.querySelectorAll('.spatial-view__overlay-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = (btn as HTMLElement).dataset.overlay as OverlayId;
        this.toggleOverlay(id);
      });
    });
  }

  private toggleOverlay(id: OverlayId): void {
    if (this.activeOverlays.has(id)) {
      this.activeOverlays.delete(id);
    } else {
      this.activeOverlays.add(id);
    }
    this.renderOverlayBar();
    this.applyOverlays();
  }

  private updateStatus(): void {
    const status = this.container.querySelector('.spatial-view__status')!;
    const docCount = this.docs.length;
    const embeddingCount = this.coords.size;
    const zoomPercent = Math.round(this.viewport.zoom * 100);

    status.innerHTML = `
      <span class="spatial-view__status-item">${embeddingCount}/${docCount} positioned</span>
      <span class="spatial-view__status-item">${zoomPercent}%</span>
    `;
  }

  private render(): void {
    const currentIds = new Set<string>();

    // Canvas dimensions (use available space with padding)
    const padding = 60;
    const canvasWidth = this.container.clientWidth - padding * 2;
    const canvasHeight = this.container.clientHeight - padding * 2;

    for (const doc of this.docs) {
      const coord = this.coords.get(doc.id);
      if (!coord) continue;

      currentIds.add(doc.id);

      // Convert normalized coords [0,1] to pixel positions
      const x = padding + coord.x * canvasWidth;
      const y = padding + coord.y * canvasHeight;

      let node = this.nodeElements.get(doc.id);

      if (node) {
        // Update existing node position
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
      } else {
        // Create new node
        node = this.createNode(doc, x, y);
        this.canvas.appendChild(node);
        this.nodeElements.set(doc.id, node);
      }

      // Update focus state
      node.classList.toggle('spatial-node--focused', doc.id === this.focusedId);
    }

    // Remove nodes no longer in view
    for (const [id, node] of this.nodeElements) {
      if (!currentIds.has(id)) {
        node.remove();
        this.nodeElements.delete(id);
      }
    }

    // Apply viewport transform
    this.applyViewport();

    // Apply overlays
    this.applyOverlays();
  }

  private createNode(doc: Document, x: number, y: number): HTMLElement {
    const node = document.createElement('div');
    node.className = 'spatial-node';
    node.dataset.id = doc.id;
    node.dataset.type = doc.type;
    node.dataset.status = doc.status;
    node.dataset.state = doc.execution_state ?? 'pending';
    node.dataset.intent = doc.intent ?? 'capture';

    node.style.left = `${x}px`;
    node.style.top = `${y}px`;

    // Recency bucket
    const age = Date.now() - doc.modifiedAt;
    let recency = 'stale';
    if (age < RECENCY_BUCKETS.fresh) recency = 'fresh';
    else if (age < RECENCY_BUCKETS.recent) recency = 'recent';
    else if (age < RECENCY_BUCKETS.aging) recency = 'aging';
    node.dataset.recency = recency;

    // Icon
    const icon = document.createElement('span');
    icon.className = 'spatial-node__icon';
    icon.textContent = getDocumentIcon(doc);
    icon.style.color = getDocumentColor(doc);
    node.appendChild(icon);

    // Title
    const title = document.createElement('span');
    title.className = 'spatial-node__title';
    title.textContent = doc.title || 'Untitled';
    node.appendChild(title);

    // Intent indicator
    const intent = document.createElement('span');
    intent.className = 'spatial-node__intent';
    intent.textContent = getIntentIcon(doc);
    node.appendChild(intent);

    // State dots
    const state = document.createElement('span');
    state.className = 'spatial-node__state';
    state.textContent = getExecutionDots(doc);
    state.dataset.state = doc.execution_state ?? 'pending';
    node.appendChild(state);

    // Click handlers
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      if (doc.id === this.focusedId) {
        this.options.onDocumentOpen(doc);
      } else {
        this.setFocus(doc.id);
        this.options.onDocumentSelect(doc);
      }
    });

    node.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      this.options.onDocumentOpen(doc);
    });

    return node;
  }

  private setFocus(id: string): void {
    this.focusedId = id;
    // Update focus class on all nodes
    for (const [nodeId, node] of this.nodeElements) {
      node.classList.toggle('spatial-node--focused', nodeId === id);
    }
  }

  private applyOverlays(): void {
    // Update overlay classes on canvas
    for (const overlay of OVERLAYS) {
      this.canvas.classList.toggle(`spatial-canvas--overlay-${overlay.id}`, this.activeOverlays.has(overlay.id));
    }
  }

  private applyViewport(): void {
    const { x, y, zoom } = this.viewport;
    this.canvas.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
    this.canvas.style.transformOrigin = 'center center';
  }

  // ─────────────────────────────────────────────────────────────────────
  // Event Handlers
  // ─────────────────────────────────────────────────────────────────────

  private handleKeydown = (e: KeyboardEvent): void => {
    // Number keys for overlays
    const key = e.key;
    const overlay = OVERLAYS.find(o => o.key === key);
    if (overlay) {
      e.preventDefault();
      this.toggleOverlay(overlay.id);
      return;
    }

    // Zoom with +/-
    if (key === '=' || key === '+') {
      e.preventDefault();
      this.zoom(1.2);
      return;
    }
    if (key === '-') {
      e.preventDefault();
      this.zoom(0.8);
      return;
    }

    // Reset view with 0
    if (key === '0') {
      e.preventDefault();
      this.resetViewport();
      return;
    }

    // Arrow keys to pan
    const panAmount = 50;
    if (key === 'ArrowLeft') {
      e.preventDefault();
      this.pan(panAmount, 0);
    } else if (key === 'ArrowRight') {
      e.preventDefault();
      this.pan(-panAmount, 0);
    } else if (key === 'ArrowUp') {
      e.preventDefault();
      this.pan(0, panAmount);
    } else if (key === 'ArrowDown') {
      e.preventDefault();
      this.pan(0, -panAmount);
    }

    // Enter to open focused doc
    if (key === 'Enter' && this.focusedId) {
      e.preventDefault();
      const doc = this.docs.find(d => d.id === this.focusedId);
      if (doc) {
        this.options.onDocumentOpen(doc);
      }
    }
  };

  private handleMouseDown = (e: MouseEvent): void => {
    // Only pan on direct canvas click (not on nodes)
    if ((e.target as HTMLElement).classList.contains('spatial-view__canvas')) {
      this.isDragging = true;
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.viewportStart = { x: this.viewport.x, y: this.viewport.y };
      this.canvas.style.cursor = 'grabbing';

      const handleMouseMove = (e: MouseEvent) => {
        if (!this.isDragging) return;
        const dx = e.clientX - this.dragStart.x;
        const dy = e.clientY - this.dragStart.y;
        this.viewport.x = this.viewportStart.x + dx;
        this.viewport.y = this.viewportStart.y + dy;
        this.applyViewport();
      };

      const handleMouseUp = () => {
        this.isDragging = false;
        this.canvas.style.cursor = '';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  private handleWheel = (e: WheelEvent): void => {
    e.preventDefault();

    // Zoom with scroll
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    this.zoom(zoomFactor);
  };

  private pan(dx: number, dy: number): void {
    this.viewport.x += dx;
    this.viewport.y += dy;
    this.applyViewport();
  }

  private zoom(factor: number): void {
    const newZoom = Math.max(0.2, Math.min(3, this.viewport.zoom * factor));
    this.viewport.zoom = newZoom;
    this.applyViewport();
    this.updateStatus();
  }

  private resetViewport(): void {
    this.viewport = { x: 0, y: 0, zoom: 1 };
    this.applyViewport();
    this.updateStatus();
  }

  // ─────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────

  show(): void {
    this.container.classList.add('shell__view--visible');
    this.refresh();
  }

  hide(): void {
    this.container.classList.remove('shell__view--visible');
  }

  focus(): void {
    this.container.focus();
  }

  getFocusedId(): string | null {
    return this.focusedId;
  }

  setFocusedId(id: string): void {
    this.focusedId = id;
  }

  hasOpenOverlay(): boolean {
    return false; // No modal overlays in spatial view
  }
}
