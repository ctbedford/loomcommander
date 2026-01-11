/**
 * Kanban View
 *
 * Workflow-phase based document organization for ops domain.
 * Groups documents into columns by workflow phase:
 *
 *   DEFINE    RESEARCH   EXECUTE    LEARN     ORGANIZE
 *   ───────   ────────   ───────    ─────     ────────
 *   ◇ proj    ◧ survey   ▣ plan     ⊕ dec     ⏸ chk
 *   ◈ brief              □ task     ↺ retro   ☰ idx
 *                                   ⚙ pat
 */

import type { Document } from '../types.ts';
import { getDocumentIcon, getExecutionDots } from '../types.ts';
import { listDocuments } from '../data/documents.ts';
import { getOpsWorkflowPhase, getOpsTypeIcon, getOpsTypeColor } from '../config/domains/ops.ts';

export interface KanbanViewOptions {
  onDocumentSelect: (doc: Document) => void;
  onDocumentOpen: (doc: Document) => void;
}

// Workflow phases in order
type WorkflowPhase = 'define' | 'research' | 'execute' | 'learn' | 'organize';

const PHASE_CONFIG: Record<WorkflowPhase, { label: string; icon: string; color: string }> = {
  define: { label: 'Define', icon: '◈', color: '#A37ACC' },
  research: { label: 'Research', icon: '◧', color: '#48CFAD' },
  execute: { label: 'Execute', icon: '▣', color: '#FFCE54' },
  learn: { label: 'Learn', icon: '↺', color: '#AC92EC' },
  organize: { label: 'Organize', icon: '☰', color: '#C9C9C9' },
};

const PHASE_ORDER: WorkflowPhase[] = ['define', 'research', 'execute', 'learn', 'organize'];

export class KanbanView {
  private container: HTMLElement;
  private board: HTMLElement;
  private options: KanbanViewOptions;

  private docs: Document[] = [];
  private focusedId: string | null = null;
  private focusedPhase: WorkflowPhase = 'define';

  constructor(container: HTMLElement, options: KanbanViewOptions) {
    this.container = container;
    this.options = options;

    this.container.classList.add('kanban-view');
    this.container.innerHTML = `
      <div class="kanban-view__header">
        <span class="kanban-view__title">Workflow</span>
        <span class="kanban-view__subtitle">Ops Domain</span>
      </div>
      <div class="kanban-view__board"></div>
      <div class="kanban-view__status">
        <span class="kanban-view__status-count"></span>
        <span class="kanban-view__status-hint">←→ columns · ↑↓ cards · Enter open</span>
      </div>
    `;

    this.board = this.container.querySelector('.kanban-view__board')!;

    // Create columns
    for (const phase of PHASE_ORDER) {
      const config = PHASE_CONFIG[phase];
      const column = document.createElement('div');
      column.className = 'kanban-column';
      column.dataset.phase = phase;
      column.innerHTML = `
        <div class="kanban-column__header" style="--phase-color: ${config.color}">
          <span class="kanban-column__icon">${config.icon}</span>
          <span class="kanban-column__label">${config.label}</span>
          <span class="kanban-column__count">0</span>
        </div>
        <div class="kanban-column__cards"></div>
      `;
      this.board.appendChild(column);
    }

    // Keyboard navigation
    this.container.setAttribute('tabindex', '0');
    this.container.addEventListener('keydown', this.handleKeydown);
  }

  // ─────────────────────────────────────────────────────────────────────
  // Grouping
  // ─────────────────────────────────────────────────────────────────────

  private getPhase(doc: Document): WorkflowPhase {
    // Use ops domain helper to determine phase from type
    // For ops-specific types, map directly
    const type = doc.type as string;

    // Handle ops-specific types
    switch (type) {
      case 'project':
      case 'brief':
        return 'define';
      case 'survey':
        return 'research';
      case 'plan':
      case 'task':
        return 'execute';
      case 'decision':
      case 'retro':
      case 'pattern':
        return 'learn';
      case 'checkpoint':
      case 'index':
        return 'organize';
      default:
        // Fallback: use the helper if available, or default to organize
        try {
          return getOpsWorkflowPhase(type);
        } catch {
          return 'organize';
        }
    }
  }

  private groupByPhase(docs: Document[]): Record<WorkflowPhase, Document[]> {
    const grouped: Record<WorkflowPhase, Document[]> = {
      define: [],
      research: [],
      execute: [],
      learn: [],
      organize: [],
    };

    for (const doc of docs) {
      const phase = this.getPhase(doc);
      grouped[phase].push(doc);
    }

    // Sort within each phase: in_progress first, then by modifiedAt
    for (const phase of PHASE_ORDER) {
      grouped[phase].sort((a, b) => {
        // In progress first
        const aProgress = a.execution_state === 'in_progress' ? 0 : 1;
        const bProgress = b.execution_state === 'in_progress' ? 0 : 1;
        if (aProgress !== bProgress) return aProgress - bProgress;

        // Then by recency
        return b.modifiedAt - a.modifiedAt;
      });
    }

    return grouped;
  }

  // ─────────────────────────────────────────────────────────────────────
  // Rendering
  // ─────────────────────────────────────────────────────────────────────

  private render(): void {
    const grouped = this.groupByPhase(this.docs);

    for (const phase of PHASE_ORDER) {
      const column = this.board.querySelector(`[data-phase="${phase}"]`)!;
      const cardsContainer = column.querySelector('.kanban-column__cards')!;
      const countEl = column.querySelector('.kanban-column__count')!;

      // Clear and re-render cards
      cardsContainer.innerHTML = '';
      const phaseDocs = grouped[phase];

      for (const doc of phaseDocs) {
        const card = this.createCard(doc, phase);
        cardsContainer.appendChild(card);
      }

      // Update count
      countEl.textContent = phaseDocs.length.toString();

      // Empty state
      if (phaseDocs.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'kanban-column__empty';
        empty.textContent = 'No items';
        cardsContainer.appendChild(empty);
      }
    }

    this.updateStatus();
    this.updateFocus();
  }

  private createCard(doc: Document, phase: WorkflowPhase): HTMLElement {
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.dataset.id = doc.id;
    card.dataset.phase = phase;
    card.dataset.state = doc.execution_state ?? 'pending';

    // Type-specific icon and color
    const icon = getOpsTypeIcon(doc.type as string) || getDocumentIcon(doc);
    const color = getOpsTypeColor(doc.type as string);

    // In-progress indicator
    const isActive = doc.execution_state === 'in_progress';
    if (isActive) {
      card.classList.add('kanban-card--active');
    }

    card.innerHTML = `
      <div class="kanban-card__header">
        <span class="kanban-card__icon" style="color: ${color}">${icon}</span>
        <span class="kanban-card__type">${doc.type}</span>
      </div>
      <div class="kanban-card__title">${doc.title || 'Untitled'}</div>
      <div class="kanban-card__footer">
        <span class="kanban-card__state">${getExecutionDots(doc)}</span>
        <span class="kanban-card__status">${doc.status}</span>
      </div>
    `;

    // Click handler
    card.addEventListener('click', () => {
      this.focusedId = doc.id;
      this.focusedPhase = phase;
      this.updateFocus();
      this.options.onDocumentOpen(doc);
    });

    return card;
  }

  // ─────────────────────────────────────────────────────────────────────
  // Focus / Navigation
  // ─────────────────────────────────────────────────────────────────────

  private updateFocus(): void {
    // Remove old focus
    this.board.querySelectorAll('.kanban-card--focused').forEach(el => {
      el.classList.remove('kanban-card--focused');
    });

    // Add new focus
    if (this.focusedId) {
      const el = this.board.querySelector(`[data-id="${this.focusedId}"]`);
      if (el) {
        el.classList.add('kanban-card--focused');
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }

  private handleKeydown = (e: KeyboardEvent): void => {
    const grouped = this.groupByPhase(this.docs);
    const currentDocs = grouped[this.focusedPhase];
    const currentIndex = this.focusedId
      ? currentDocs.findIndex(d => d.id === this.focusedId)
      : -1;

    switch (e.key) {
      case 'ArrowRight': {
        e.preventDefault();
        const phaseIndex = PHASE_ORDER.indexOf(this.focusedPhase);
        if (phaseIndex < PHASE_ORDER.length - 1) {
          this.focusedPhase = PHASE_ORDER[phaseIndex + 1];
          const newDocs = grouped[this.focusedPhase];
          this.focusedId = newDocs[0]?.id ?? null;
          this.updateFocus();
        }
        break;
      }

      case 'ArrowLeft': {
        e.preventDefault();
        const phaseIndex = PHASE_ORDER.indexOf(this.focusedPhase);
        if (phaseIndex > 0) {
          this.focusedPhase = PHASE_ORDER[phaseIndex - 1];
          const newDocs = grouped[this.focusedPhase];
          this.focusedId = newDocs[0]?.id ?? null;
          this.updateFocus();
        }
        break;
      }

      case 'ArrowDown': {
        e.preventDefault();
        if (currentIndex < currentDocs.length - 1) {
          this.focusedId = currentDocs[currentIndex + 1].id;
          this.updateFocus();
        }
        break;
      }

      case 'ArrowUp': {
        e.preventDefault();
        if (currentIndex > 0) {
          this.focusedId = currentDocs[currentIndex - 1].id;
          this.updateFocus();
        }
        break;
      }

      case 'Enter': {
        e.preventDefault();
        if (this.focusedId) {
          const doc = this.docs.find(d => d.id === this.focusedId);
          if (doc) {
            this.options.onDocumentOpen(doc);
          }
        }
        break;
      }

      case 'Home': {
        e.preventDefault();
        this.focusedPhase = 'define';
        const newDocs = grouped[this.focusedPhase];
        this.focusedId = newDocs[0]?.id ?? null;
        this.updateFocus();
        break;
      }

      case 'End': {
        e.preventDefault();
        this.focusedPhase = 'organize';
        const newDocs = grouped[this.focusedPhase];
        this.focusedId = newDocs[0]?.id ?? null;
        this.updateFocus();
        break;
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────────
  // Status
  // ─────────────────────────────────────────────────────────────────────

  private updateStatus(): void {
    const countEl = this.container.querySelector('.kanban-view__status-count')!;
    const inProgress = this.docs.filter(d => d.execution_state === 'in_progress').length;
    const pending = this.docs.filter(d => d.execution_state === 'pending').length;

    countEl.textContent = `${this.docs.length} docs · ${inProgress} active · ${pending} pending`;
  }

  // ─────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────

  async refresh(): Promise<void> {
    this.docs = await listDocuments();
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
    // Focus first card if none selected
    if (!this.focusedId && this.docs.length > 0) {
      const grouped = this.groupByPhase(this.docs);
      for (const phase of PHASE_ORDER) {
        if (grouped[phase].length > 0) {
          this.focusedPhase = phase;
          this.focusedId = grouped[phase][0].id;
          break;
        }
      }
      this.updateFocus();
    }
  }

  hasOpenOverlay(): boolean {
    return false;
  }
}
