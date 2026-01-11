import type { Document, RelationType } from '../types.ts';
import { getDocumentIcon, getDocumentColor } from '../types.ts';
import { listDocuments } from '../data/documents.ts';
import { getAllEmbeddings } from '../data/db.ts';
import { findMostSimilar } from '../data/similarity.ts';

export interface FlowViewOptions {
  onDocumentSelect: (doc: Document) => void;
  onDocumentOpen: (doc: Document) => void;
}

interface FlowNode {
  doc: Document;
  relation?: RelationType;
}

export class FlowView {
  private container: HTMLElement;
  private options: FlowViewOptions;
  private docs: Document[] = [];
  private embeddings: Map<string, number[]> = new Map();
  private focusedId: string | null = null;

  constructor(container: HTMLElement, options: FlowViewOptions) {
    this.container = container;
    this.options = options;
    this.container.classList.add('flow-view');
  }

  async refresh(): Promise<void> {
    // Fetch docs and embeddings in parallel
    const [docs, embeddings] = await Promise.all([
      listDocuments(),
      getAllEmbeddings(),
    ]);

    this.docs = docs;
    this.embeddings = embeddings;

    if (!this.focusedId && this.docs.length > 0) {
      this.focusedId = this.docs[0].id;
    }

    this.render();
  }

  setFocus(id: string, skipRender = false): void {
    if (this.focusedId === id) return;

    // If skipRender, just set the ID (used when setting focus before show())
    if (skipRender) {
      this.focusedId = id;
      return;
    }

    // Add exit animation class to current content
    const canvas = this.container.querySelector('.flow-view__canvas');
    if (canvas) {
      canvas.classList.add('flow-view__canvas--exiting');

      // Wait for exit animation, then re-render
      setTimeout(() => {
        this.focusedId = id;
        this.render();
      }, 150);
    } else {
      this.focusedId = id;
      this.render();
    }
  }

  private getUpstream(focusDoc: Document): FlowNode[] {
    const nodes: FlowNode[] = [];
    const docMap = new Map(this.docs.map(d => [d.id, d]));

    // Get from upstream array first (preferred)
    if (focusDoc.upstream && focusDoc.upstream.length > 0) {
      for (const ref of focusDoc.upstream) {
        const doc = docMap.get(ref.doc);
        if (doc) {
          nodes.push({ doc, relation: ref.relation as RelationType });
        }
      }
    } else {
      // Fallback to legacy fields
      for (const fwId of focusDoc.framework_ids) {
        const doc = docMap.get(fwId);
        if (doc) {
          nodes.push({ doc, relation: 'method' });
        }
      }
      if (focusDoc.source_id) {
        const doc = docMap.get(focusDoc.source_id);
        if (doc) {
          nodes.push({ doc, relation: 'source' });
        }
      }
    }

    return nodes;
  }

  private getDownstream(focusDoc: Document): FlowNode[] {
    const nodes: FlowNode[] = [];

    for (const doc of this.docs) {
      if (doc.id === focusDoc.id) continue;

      // Check upstream array
      if (doc.upstream && doc.upstream.length > 0) {
        const ref = doc.upstream.find(r => r.doc === focusDoc.id);
        if (ref) {
          nodes.push({ doc, relation: ref.relation as RelationType });
          continue;
        }
      }

      // Fallback to legacy fields
      if (doc.framework_ids.includes(focusDoc.id) || doc.source_id === focusDoc.id) {
        nodes.push({ doc, relation: 'informs' });
      }
    }

    return nodes;
  }

  private getSiblings(focusDoc: Document): { docs: Document[]; mode: 'semantic' | 'fallback' } {
    const upstreamIds = new Set(this.getUpstream(focusDoc).map(n => n.doc.id));
    const downstreamIds = new Set(this.getDownstream(focusDoc).map(n => n.doc.id));
    const excludeIds = new Set([focusDoc.id, ...upstreamIds, ...downstreamIds]);

    // Try semantic similarity if we have embeddings
    const focusEmbedding = this.embeddings.get(focusDoc.id);
    if (focusEmbedding && this.embeddings.size > 1) {
      const similar = findMostSimilar(focusDoc.id, focusEmbedding, this.embeddings, excludeIds, 6);
      const siblings = similar
        .map(({ id }) => this.docs.find(d => d.id === id))
        .filter((d): d is Document => d !== undefined);

      if (siblings.length > 0) {
        return { docs: siblings, mode: 'semantic' };
      }
    }

    // Fallback: match by output or perspective
    const siblings: Document[] = [];
    for (const doc of this.docs) {
      if (excludeIds.has(doc.id)) continue;

      const sameOutput = focusDoc.output && doc.output === focusDoc.output;
      const samePerspective = focusDoc.perspective && doc.perspective === focusDoc.perspective;

      if (sameOutput || samePerspective) {
        siblings.push(doc);
      }
    }

    return { docs: siblings.slice(0, 6), mode: 'fallback' };
  }

  private render(): void {
    const focusDoc = this.docs.find(d => d.id === this.focusedId);

    if (!focusDoc) {
      this.container.innerHTML = `
        <div class="flow-view__empty">
          <p>No document selected</p>
        </div>
      `;
      return;
    }

    const upstream = this.getUpstream(focusDoc);
    const downstream = this.getDownstream(focusDoc);
    const { docs: siblings, mode: siblingsMode } = this.getSiblings(focusDoc);

    this.container.innerHTML = `
      <div class="flow-view__header">
        <div class="flow-view__lens">
          <span class="flow-view__lens-icon">↕</span>
          <span class="flow-view__lens-name">Flow View</span>
        </div>
      </div>

      <div class="flow-view__canvas">
        ${this.renderZone('upstream', 'Upstream', upstream)}

        <div class="flow-view__connector flow-view__connector--down">
          <svg viewBox="0 0 24 48" class="flow-view__arrow">
            <path d="M12 0 L12 40 M6 34 L12 40 L18 34" stroke="currentColor" fill="none" stroke-width="2"/>
          </svg>
        </div>

        <div class="flow-view__focus-zone">
          ${this.renderFocusNode(focusDoc)}
        </div>

        <div class="flow-view__connector flow-view__connector--down">
          <svg viewBox="0 0 24 48" class="flow-view__arrow">
            <path d="M12 0 L12 40 M6 34 L12 40 L18 34" stroke="currentColor" fill="none" stroke-width="2"/>
          </svg>
        </div>

        ${this.renderZone('downstream', 'Downstream', downstream.map(n => n))}

        ${siblings.length > 0 ? `
          <div class="flow-view__sidebar">
            <div class="flow-view__sidebar-label">
              Siblings
              <span class="flow-view__sidebar-mode flow-view__sidebar-mode--${siblingsMode}" title="${siblingsMode === 'semantic' ? 'Using AI embeddings' : 'Using output/perspective matching'}">
                ${siblingsMode === 'semantic' ? '✦' : '○'}
              </span>
            </div>
            <div class="flow-view__sidebar-nodes">
              ${siblings.map((doc, i) => this.renderCompactNode(doc, i)).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    this.attachEventListeners();
  }

  private renderZone(type: 'upstream' | 'downstream', label: string, nodes: FlowNode[]): string {
    // Base stagger offset: upstream starts at 0, downstream starts at 4
    const baseIndex = type === 'upstream' ? 0 : 4;

    if (nodes.length === 0) {
      return `
        <div class="flow-view__zone flow-view__zone--${type} flow-view__zone--empty">
          <div class="flow-view__zone-label">${label}</div>
          <div class="flow-view__zone-empty">None</div>
        </div>
      `;
    }

    const visibleNodes = nodes.slice(0, 4);
    const overflow = nodes.length - visibleNodes.length;

    return `
      <div class="flow-view__zone flow-view__zone--${type}">
        <div class="flow-view__zone-label">${label}</div>
        <div class="flow-view__zone-nodes">
          ${visibleNodes.map((n, i) => this.renderNode(n.doc, n.relation, baseIndex + i)).join('')}
          ${overflow > 0 ? `<div class="flow-view__overflow">+${overflow} more</div>` : ''}
        </div>
      </div>
    `;
  }

  private renderFocusNode(doc: Document): string {
    const icon = getDocumentIcon(doc);
    const color = getDocumentColor(doc);
    const stateClass = `flow-view__node--${doc.execution_state || 'completed'}`;

    return `
      <div class="flow-view__node flow-view__node--focus ${stateClass}" data-id="${doc.id}">
        <div class="flow-view__node-icon" style="color: ${color}">${icon}</div>
        <div class="flow-view__node-content">
          <div class="flow-view__node-title">${doc.title || 'Untitled'}</div>
          <div class="flow-view__node-meta">
            <span class="flow-view__node-type">${doc.type}</span>
            <span class="flow-view__node-status flow-view__node-status--${doc.status}">${doc.status}</span>
          </div>
        </div>
      </div>
    `;
  }

  private renderNode(doc: Document, relation?: RelationType, staggerIndex = 0): string {
    const icon = getDocumentIcon(doc);
    const color = getDocumentColor(doc);
    const stateClass = `flow-view__node--${doc.execution_state || 'completed'}`;
    const relationLabel = relation ? this.getRelationLabel(relation) : '';

    return `
      <div class="flow-view__node ${stateClass}" data-id="${doc.id}" style="--stagger-index: ${staggerIndex}">
        <div class="flow-view__node-icon" style="color: ${color}">${icon}</div>
        <div class="flow-view__node-content">
          <div class="flow-view__node-title">${doc.title || 'Untitled'}</div>
          ${relationLabel ? `<div class="flow-view__node-relation">${relationLabel}</div>` : ''}
        </div>
      </div>
    `;
  }

  private renderCompactNode(doc: Document, staggerIndex = 0): string {
    const icon = getDocumentIcon(doc);
    const color = getDocumentColor(doc);

    return `
      <div class="flow-view__compact-node" data-id="${doc.id}" style="--compact-index: ${staggerIndex}">
        <span class="flow-view__compact-icon" style="color: ${color}">${icon}</span>
        <span class="flow-view__compact-title">${doc.title || 'Untitled'}</span>
      </div>
    `;
  }

  private getRelationLabel(relation: RelationType): string {
    const labels: Record<RelationType, string> = {
      method: 'method',
      source: 'source',
      informs: 'informs',
      prior: 'prior',
      defines: 'defines',
    };
    return labels[relation] || relation;
  }

  private attachEventListeners(): void {
    // Regular nodes
    this.container.querySelectorAll('.flow-view__node:not(.flow-view__node--focus)').forEach(node => {
      const id = (node as HTMLElement).dataset.id;
      if (!id) return;

      node.addEventListener('click', () => {
        const doc = this.docs.find(d => d.id === id);
        if (doc) {
          this.setFocus(doc.id);
          this.options.onDocumentSelect(doc);
        }
      });

      node.addEventListener('dblclick', () => {
        const doc = this.docs.find(d => d.id === id);
        if (doc) {
          this.options.onDocumentOpen(doc);
        }
      });
    });

    // Focus node - click opens
    this.container.querySelectorAll('.flow-view__node--focus').forEach(node => {
      node.addEventListener('click', () => {
        const doc = this.docs.find(d => d.id === this.focusedId);
        if (doc) {
          this.options.onDocumentOpen(doc);
        }
      });
    });

    // Compact nodes
    this.container.querySelectorAll('.flow-view__compact-node').forEach(node => {
      const id = (node as HTMLElement).dataset.id;
      if (!id) return;

      node.addEventListener('click', () => {
        const doc = this.docs.find(d => d.id === id);
        if (doc) {
          this.setFocus(doc.id);
          this.options.onDocumentSelect(doc);
        }
      });
    });
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
  }

  getFocusedId(): string | null {
    return this.focusedId;
  }

  hasOpenOverlay(): boolean {
    return false;
  }
}
