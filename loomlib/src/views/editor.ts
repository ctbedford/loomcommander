import { loadDocument, saveDocument, updateDocumentMetadata, listDocuments } from '../data/documents.ts';
import { getParentIds } from '../data/graph.ts';
import { getAllEmbeddings } from '../data/db.ts';
import { findMostSimilar } from '../data/similarity.ts';
import type { ExecutionState, RelationType } from '../types.ts';
import type { Document } from '../types.ts';
import { deriveTitle, getDocumentIcon, getDocumentColor, getIntentIcon, getExecutionDots } from '../types.ts';
import { marked } from 'marked';

const DEBOUNCE_MS = 500;

// Configure marked for safe rendering
marked.setOptions({
  gfm: true,
  breaks: true,
});

export interface EditorOptions {
  onBack: () => void;
  onTriage: (docId: string) => void;
  onGoToList: () => void;
  onGoToConstellation: () => void;
  onGoToFlow: () => void;
  onGoToDeck: () => void;
}

export class Editor {
  private container: HTMLElement;
  private textarea: HTMLTextAreaElement;
  private titleDisplay: HTMLElement;
  private saveStatus: HTMLElement;
  private metaBar: HTMLElement;
  private relatedBar: HTMLElement;
  private relatedToggle: HTMLElement | null = null;
  private outlinePane: HTMLElement | null = null;
  private outlineToggle: HTMLElement | null = null;
  private options: EditorOptions;
  private allDocs: Document[] = [];
  private embeddings: Map<string, number[]> = new Map();
  private currentDoc: Document | null = null;
  private currentDocId: string | null = null;
  private saveTimeout: number | null = null;
  private saveStatusTimeout: number | null = null;
  private isDirty = false;
  private isFocusMode = false;
  private showPreview = true;
  private showRelated = false;
  private showOutline = false;
  private previewPane: HTMLElement | null = null;
  private previewToggle: HTMLElement | null = null;
  private headingObserver: IntersectionObserver | null = null;
  private activeHeadingId: string | null = null;

  constructor(container: HTMLElement, options: EditorOptions) {
    this.container = container;
    this.options = options;

    // Create structure
    this.container.classList.add('editor-view', 'editor-view--preview');
    this.container.innerHTML = `
      <div class="editor-view__header">
        <div class="editor-view__nav">
          <button class="editor-view__nav-btn editor-view__nav-btn--list" title="List view (Esc)">☰</button>
          <button class="editor-view__nav-btn editor-view__nav-btn--constellation" title="Constellation view">◎</button>
          <button class="editor-view__nav-btn editor-view__nav-btn--flow" title="Flow view">↕</button>
          <button class="editor-view__nav-btn editor-view__nav-btn--deck" title="Deck view (Cmd+Shift+D)">▦</button>
        </div>
        <div class="editor-view__title-area">
          <div class="editor-view__title"></div>
          <div class="editor-view__save-status"></div>
        </div>
        <div class="editor-view__actions">
          <button class="editor-view__preview-toggle editor-view__preview-toggle--active" title="Toggle preview (Cmd+P)">Editor</button>
          <button class="editor-view__outline-toggle" title="Toggle outline (Cmd+Shift+O)">§</button>
          <button class="editor-view__related-toggle" title="Toggle related (Cmd+/)">≋</button>
          <button class="editor-view__triage-btn">Triage</button>
        </div>
      </div>
      <div class="editor-view__meta"></div>
      <div class="editor-view__content">
        <div class="editor-view__outline"></div>
        <textarea class="editor-view__textarea" placeholder="Start writing..."></textarea>
        <div class="editor-view__preview"></div>
        <div class="editor-view__related"></div>
      </div>
    `;

    this.textarea = this.container.querySelector('.editor-view__textarea')!;
    this.titleDisplay = this.container.querySelector('.editor-view__title')!;
    this.saveStatus = this.container.querySelector('.editor-view__save-status')!;
    this.metaBar = this.container.querySelector('.editor-view__meta')!;
    this.relatedBar = this.container.querySelector('.editor-view__related')!;
    this.previewPane = this.container.querySelector('.editor-view__preview')!;
    this.previewToggle = this.container.querySelector('.editor-view__preview-toggle')!;
    this.relatedToggle = this.container.querySelector('.editor-view__related-toggle')!;
    this.outlinePane = this.container.querySelector('.editor-view__outline')!;
    this.outlineToggle = this.container.querySelector('.editor-view__outline-toggle')!;
    const listBtn = this.container.querySelector('.editor-view__nav-btn--list')!;
    const constellationBtn = this.container.querySelector('.editor-view__nav-btn--constellation')!;
    const flowBtn = this.container.querySelector('.editor-view__nav-btn--flow')!;
    const deckBtn = this.container.querySelector('.editor-view__nav-btn--deck')!;
    const triageBtn = this.container.querySelector('.editor-view__triage-btn')!;

    // Event handlers
    this.textarea.addEventListener('input', this.handleInput);
    this.textarea.addEventListener('keydown', this.handleKeydown);
    listBtn.addEventListener('click', () => this.handleBack());
    constellationBtn.addEventListener('click', () => {
      this.flush();
      this.options.onGoToConstellation();
    });
    flowBtn.addEventListener('click', () => {
      this.flush();
      this.options.onGoToFlow();
    });
    deckBtn.addEventListener('click', () => {
      this.flush();
      this.options.onGoToDeck();
    });
    triageBtn.addEventListener('click', () => {
      if (this.currentDocId) {
        this.options.onTriage(this.currentDocId);
      }
    });
    this.previewToggle.addEventListener('click', () => this.togglePreview());
    this.relatedToggle.addEventListener('click', () => this.toggleRelated());
    this.outlineToggle.addEventListener('click', () => this.toggleOutline());
  }

  async load(docId: string): Promise<void> {
    // Save any pending changes first
    await this.flush();

    // Fetch doc, all docs, and embeddings for relation lookups and siblings
    const [doc, allDocs, embeddings] = await Promise.all([
      loadDocument(docId),
      listDocuments(),
      getAllEmbeddings(),
    ]);

    if (!doc) {
      console.error('Document not found:', docId);
      return;
    }

    this.currentDoc = doc;
    this.currentDocId = doc.id;
    this.allDocs = allDocs;
    this.embeddings = embeddings;
    this.textarea.value = doc.content;
    this.titleDisplay.textContent = doc.title || deriveTitle(doc.content);
    this.isDirty = false;
    // Exit focus mode when loading a new document
    if (this.isFocusMode) {
      this.toggleFocusMode();
    }
    this.renderMetaBar();
    this.renderRelatedBar();
    // Update preview if visible
    if (this.showPreview) {
      this.updatePreview();
    }
    this.textarea.focus();
  }

  private renderMetaBar(): void {
    if (!this.currentDoc) {
      this.metaBar.innerHTML = '';
      return;
    }

    const doc = this.currentDoc;
    const icon = getDocumentIcon(doc);
    const color = getDocumentColor(doc);
    const intentIcon = getIntentIcon(doc);
    const executionDots = getExecutionDots(doc);
    const executionState = doc.execution_state ?? 'pending';
    const typeLabel = doc.type + (doc.framework_kind ? ` / ${doc.framework_kind}` : '');
    const tags = doc.tags.length > 0
      ? doc.tags.map(t => `<span class="editor-view__tag">${t}</span>`).join('')
      : '';

    this.metaBar.innerHTML = `
      <span class="editor-view__type-icon" style="color: ${color}">${icon}</span>
      <span class="editor-view__intent" title="${doc.intent ?? 'capture'}">${intentIcon}</span>
      <span class="editor-view__type-label">${typeLabel}</span>
      <span class="editor-view__status editor-view__status--${doc.status}">${doc.status}</span>
      <span class="editor-view__execution editor-view__execution--${executionState}" data-state="${executionState}" title="Click to cycle: ${executionState}">${executionDots}</span>
      ${tags ? `<span class="editor-view__tags">${tags}</span>` : ''}
    `;

    // Bind click handler for execution state cycling
    const executionEl = this.metaBar.querySelector('.editor-view__execution');
    if (executionEl) {
      executionEl.addEventListener('click', () => this.cycleExecutionState());
    }
  }

  private async cycleExecutionState(): Promise<void> {
    if (!this.currentDoc || !this.currentDocId) return;

    const states: ExecutionState[] = ['pending', 'in_progress', 'completed', 'resolved'];
    const currentState = this.currentDoc.execution_state ?? 'pending';
    const currentIndex = states.indexOf(currentState);
    const nextState = states[(currentIndex + 1) % states.length];

    // Update document
    this.currentDoc = await updateDocumentMetadata(this.currentDocId, {
      execution_state: nextState,
    });

    // Re-render meta bar
    this.renderMetaBar();
  }

  private getRelatedDocs(): {
    upstream: { doc: Document; relation: RelationType }[];
    downstream: Document[];
    siblings: { docs: Document[]; mode: 'semantic' | 'fallback' };
  } {
    if (!this.currentDoc) {
      return { upstream: [], downstream: [], siblings: { docs: [], mode: 'fallback' } };
    }

    const focusDoc = this.currentDoc;

    // Get upstream docs with relation labels
    const upstreamRefs = focusDoc.upstream ?? [];
    const upstream = upstreamRefs
      .map(ref => {
        const doc = this.allDocs.find(d => d.id === ref.doc);
        return doc ? { doc, relation: ref.relation } : null;
      })
      .filter((item): item is { doc: Document; relation: RelationType } => item !== null);

    // Get downstream docs (children that reference this doc)
    const downstream = this.allDocs.filter(d => {
      if (d.id === focusDoc.id) return false;
      const parentIds = getParentIds(d);
      return parentIds.includes(focusDoc.id);
    });

    // Build exclusion set for siblings
    const upstreamIds = new Set(upstream.map(u => u.doc.id));
    const downstreamIds = new Set(downstream.map(d => d.id));
    const excludeIds = new Set([focusDoc.id, ...upstreamIds, ...downstreamIds]);

    // Try semantic similarity for siblings
    let siblings: { docs: Document[]; mode: 'semantic' | 'fallback' } = { docs: [], mode: 'fallback' };
    const focusEmbedding = this.embeddings.get(focusDoc.id);

    if (focusEmbedding && this.embeddings.size > 1) {
      const similar = findMostSimilar(focusDoc.id, focusEmbedding, this.embeddings, excludeIds, 6);
      const siblingDocs = similar
        .map(({ id }) => this.allDocs.find(d => d.id === id))
        .filter((d): d is Document => d !== undefined);

      if (siblingDocs.length > 0) {
        siblings = { docs: siblingDocs, mode: 'semantic' };
      }
    }

    // Fallback: match by output or perspective
    if (siblings.docs.length === 0) {
      const fallbackSiblings: Document[] = [];
      for (const doc of this.allDocs) {
        if (excludeIds.has(doc.id)) continue;
        const sameOutput = focusDoc.output && doc.output === focusDoc.output;
        const samePerspective = focusDoc.perspective && doc.perspective === focusDoc.perspective;
        if (sameOutput || samePerspective) {
          fallbackSiblings.push(doc);
        }
      }
      siblings = { docs: fallbackSiblings.slice(0, 6), mode: 'fallback' };
    }

    return { upstream, downstream, siblings };
  }

  private renderRelatedBar(): void {
    if (!this.showRelated) {
      this.relatedBar.innerHTML = '';
      return;
    }

    const { upstream, downstream, siblings } = this.getRelatedDocs();
    const hasContent = upstream.length > 0 || downstream.length > 0 || siblings.docs.length > 0;

    if (!hasContent) {
      this.relatedBar.innerHTML = `
        <div class="editor-view__related-header">Related</div>
        <div class="editor-view__related-empty">No related documents</div>
      `;
      return;
    }

    // Build sections
    const sections: string[] = [];
    let nodeIndex = 0;

    // Upstream section
    if (upstream.length > 0) {
      const upstreamNodes = upstream.map(({ doc, relation }: { doc: Document; relation: RelationType }) => {
        const icon = getDocumentIcon(doc);
        const color = getDocumentColor(doc);
        const idx = nodeIndex++;
        return `
          <div class="editor-view__rel-node" data-doc-id="${doc.id}" style="--rel-index: ${idx}">
            <span class="editor-view__rel-icon" style="color: ${color}">${icon}</span>
            <span class="editor-view__rel-title">${doc.title || 'Untitled'}</span>
            <span class="editor-view__rel-type">${relation}</span>
          </div>
        `;
      }).join('');

      sections.push(`
        <div class="editor-view__related-section">
          <div class="editor-view__related-label">⤴ Upstream</div>
          <div class="editor-view__related-nodes">${upstreamNodes}</div>
        </div>
      `);
    }

    // Downstream section
    if (downstream.length > 0) {
      const downstreamNodes = downstream.slice(0, 6).map(doc => {
        const icon = getDocumentIcon(doc);
        const color = getDocumentColor(doc);
        const idx = nodeIndex++;
        return `
          <div class="editor-view__rel-node" data-doc-id="${doc.id}" style="--rel-index: ${idx}">
            <span class="editor-view__rel-icon" style="color: ${color}">${icon}</span>
            <span class="editor-view__rel-title">${doc.title || 'Untitled'}</span>
          </div>
        `;
      }).join('');

      const overflow = downstream.length > 6 ? `<div class="editor-view__rel-overflow">+${downstream.length - 6} more</div>` : '';

      sections.push(`
        <div class="editor-view__related-section">
          <div class="editor-view__related-label">↴ Downstream</div>
          <div class="editor-view__related-nodes">${downstreamNodes}${overflow}</div>
        </div>
      `);
    }

    // Siblings section
    if (siblings.docs.length > 0) {
      const siblingNodes = siblings.docs.map(doc => {
        const icon = getDocumentIcon(doc);
        const color = getDocumentColor(doc);
        const idx = nodeIndex++;
        return `
          <div class="editor-view__rel-node" data-doc-id="${doc.id}" style="--rel-index: ${idx}">
            <span class="editor-view__rel-icon" style="color: ${color}">${icon}</span>
            <span class="editor-view__rel-title">${doc.title || 'Untitled'}</span>
          </div>
        `;
      }).join('');

      const modeIcon = siblings.mode === 'semantic' ? '✦' : '○';
      const modeTitle = siblings.mode === 'semantic' ? 'Using AI embeddings' : 'Using output/perspective matching';

      sections.push(`
        <div class="editor-view__related-section">
          <div class="editor-view__related-label">
            ≋ Similar
            <span class="editor-view__related-mode editor-view__related-mode--${siblings.mode}" title="${modeTitle}">${modeIcon}</span>
          </div>
          <div class="editor-view__related-nodes">${siblingNodes}</div>
        </div>
      `);
    }

    this.relatedBar.innerHTML = `
      <div class="editor-view__related-header">Related</div>
      <div class="editor-view__related-content">
        ${sections.join('')}
      </div>
    `;

    // Bind click handlers
    this.relatedBar.querySelectorAll('.editor-view__rel-node').forEach(el => {
      el.addEventListener('click', () => {
        const docId = (el as HTMLElement).dataset.docId;
        if (docId) {
          this.load(docId);
        }
      });
    });
  }

  private toggleRelated(): void {
    this.showRelated = !this.showRelated;
    this.container.classList.toggle('editor-view--related', this.showRelated);
    this.relatedToggle?.classList.toggle('editor-view__related-toggle--active', this.showRelated);
    this.renderRelatedBar();
  }

  private toggleOutline(): void {
    this.showOutline = !this.showOutline;
    this.container.classList.toggle('editor-view--outline', this.showOutline);
    this.outlineToggle?.classList.toggle('editor-view__outline-toggle--active', this.showOutline);
    if (this.showOutline && this.showPreview) {
      this.renderOutline();
    }
  }

  private renderOutline(): void {
    if (!this.outlinePane || !this.previewPane || !this.showOutline) {
      if (this.outlinePane) {
        this.outlinePane.innerHTML = '';
      }
      this.cleanupHeadingObserver();
      return;
    }

    // Extract headings from preview pane (h1-h4 only)
    const headings = this.previewPane.querySelectorAll('h1, h2, h3, h4');

    if (headings.length === 0) {
      this.outlinePane.innerHTML = `
        <div class="editor-view__outline-header">Outline</div>
        <div class="editor-view__outline-empty">No headings found</div>
      `;
      this.cleanupHeadingObserver();
      return;
    }

    // Generate unique IDs for headings and build outline items
    const seenSlugs = new Map<string, number>();
    let itemIndex = 0;
    const items: string[] = [];

    headings.forEach((heading) => {
      const text = heading.textContent?.trim() || 'Untitled';
      const level = parseInt(heading.tagName.charAt(1), 10);

      // Generate slug from heading text
      let slug = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50);

      // Handle duplicate slugs
      const count = seenSlugs.get(slug) || 0;
      seenSlugs.set(slug, count + 1);
      if (count > 0) {
        slug = `${slug}-${count}`;
      }

      // Set ID on heading element for navigation
      heading.id = slug;

      const idx = itemIndex++;
      items.push(`
        <div class="editor-view__outline-item editor-view__outline-item--h${level}"
             data-heading-id="${slug}"
             style="--outline-index: ${idx}"
             title="${text}">
          <span class="editor-view__outline-text">${text}</span>
        </div>
      `);
    });

    this.outlinePane.innerHTML = `
      <div class="editor-view__outline-header">Outline</div>
      <div class="editor-view__outline-content">
        ${items.join('')}
      </div>
    `;

    // Bind click handlers for navigation
    this.outlinePane.querySelectorAll('.editor-view__outline-item').forEach(el => {
      el.addEventListener('click', () => {
        const headingId = (el as HTMLElement).dataset.headingId;
        if (headingId) {
          const heading = this.previewPane?.querySelector(`#${CSS.escape(headingId)}`);
          if (heading) {
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Setup scroll-spy with IntersectionObserver
    this.setupHeadingObserver();
  }

  private setupHeadingObserver(): void {
    this.cleanupHeadingObserver();

    if (!this.previewPane) return;

    const headings = this.previewPane.querySelectorAll('h1[id], h2[id], h3[id], h4[id]');
    if (headings.length === 0) return;

    // Track which headings are visible
    const visibleHeadings = new Set<string>();

    this.headingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visibleHeadings.add(id);
          } else {
            visibleHeadings.delete(id);
          }
        });

        // Find the first visible heading (topmost in document order)
        let activeId: string | null = null;
        headings.forEach(heading => {
          if (!activeId && visibleHeadings.has(heading.id)) {
            activeId = heading.id;
          }
        });

        // Update active state if changed
        if (activeId !== this.activeHeadingId) {
          this.activeHeadingId = activeId;
          this.updateOutlineActiveState();
        }
      },
      {
        root: this.previewPane,
        rootMargin: '-10% 0px -70% 0px', // Trigger when heading is in top 30% of viewport
        threshold: 0,
      }
    );

    headings.forEach(heading => {
      this.headingObserver?.observe(heading);
    });
  }

  private cleanupHeadingObserver(): void {
    if (this.headingObserver) {
      this.headingObserver.disconnect();
      this.headingObserver = null;
    }
    this.activeHeadingId = null;
  }

  private updateOutlineActiveState(): void {
    if (!this.outlinePane) return;

    // Remove active class from all items
    this.outlinePane.querySelectorAll('.editor-view__outline-item').forEach(el => {
      el.classList.remove('editor-view__outline-item--active');
    });

    // Add active class to current item
    if (this.activeHeadingId) {
      const activeItem = this.outlinePane.querySelector(
        `.editor-view__outline-item[data-heading-id="${CSS.escape(this.activeHeadingId)}"]`
      );
      if (activeItem) {
        activeItem.classList.add('editor-view__outline-item--active');
      }
    }
  }

  async reload(): Promise<void> {
    if (this.currentDocId) {
      const doc = await loadDocument(this.currentDocId);
      if (doc) {
        this.currentDoc = doc;
        this.renderMetaBar();
      }
    }
  }

  private handleInput = (): void => {
    this.isDirty = true;
    this.showSaveStatus('unsaved');

    // Update title display
    this.titleDisplay.textContent = deriveTitle(this.textarea.value);

    // Update preview if visible
    if (this.showPreview) {
      this.updatePreview();
    }

    // Debounced save
    if (this.saveTimeout !== null) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = window.setTimeout(() => {
      this.save();
    }, DEBOUNCE_MS);
  };

  private handleKeydown = (e: KeyboardEvent): void => {
    const isMod = e.metaKey || e.ctrlKey;

    // Cmd+. to toggle focus mode
    if (isMod && e.key === '.') {
      e.preventDefault();
      this.toggleFocusMode();
      return;
    }

    // Escape exits focus mode first, then navigates
    if (e.key === 'Escape') {
      if (this.isFocusMode) {
        e.preventDefault();
        this.toggleFocusMode();
        return;
      }
      // Let shell handle navigation if not in focus mode
    }

    // Cmd+S to acknowledge save (muscle memory)
    if (isMod && e.key === 's') {
      e.preventDefault();
      this.showSaveStatus('saved');
      return;
    }

    // Cmd+P to toggle preview
    if (isMod && e.key === 'p') {
      e.preventDefault();
      this.togglePreview();
      return;
    }

    // Cmd+/ to toggle related panel
    if (isMod && e.key === '/') {
      e.preventDefault();
      this.toggleRelated();
      return;
    }

    // Cmd+Shift+O to toggle outline panel
    if (isMod && e.shiftKey && (e.key === 'o' || e.key === 'O')) {
      e.preventDefault();
      this.toggleOutline();
      return;
    }

    // Handle tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = this.textarea.selectionStart;
      const end = this.textarea.selectionEnd;
      const value = this.textarea.value;

      this.textarea.value = value.substring(0, start) + '\t' + value.substring(end);
      this.textarea.selectionStart = this.textarea.selectionEnd = start + 1;
      this.handleInput();
    }
  };

  private toggleFocusMode(): void {
    this.isFocusMode = !this.isFocusMode;
    this.container.classList.toggle('editor-view--focus', this.isFocusMode);
  }

  private togglePreview(): void {
    this.showPreview = !this.showPreview;
    this.container.classList.toggle('editor-view--preview', this.showPreview);
    this.previewToggle?.classList.toggle('editor-view__preview-toggle--active', this.showPreview);

    if (this.previewToggle) {
      this.previewToggle.textContent = this.showPreview ? 'Editor' : 'Preview';
    }

    if (this.showPreview) {
      this.updatePreview();
    } else {
      // Clear outline when preview is hidden (outline requires preview)
      if (this.showOutline) {
        this.cleanupHeadingObserver();
        if (this.outlinePane) {
          this.outlinePane.innerHTML = '';
        }
      }
    }
  }

  private updatePreview(): void {
    if (!this.previewPane || !this.showPreview) return;

    const content = this.textarea.value;
    // marked.parse returns string | Promise<string>, we use sync mode
    const html = marked.parse(content) as string;
    this.previewPane.innerHTML = html;

    // Update outline if visible
    if (this.showOutline) {
      this.renderOutline();
    }
  }

  private async save(): Promise<void> {
    if (!this.currentDocId || !this.isDirty) return;

    this.showSaveStatus('saving');

    try {
      await saveDocument(this.currentDocId, this.textarea.value);
      this.isDirty = false;
      this.showSaveStatus('saved');
    } catch (err) {
      console.error('Failed to save:', err);
      this.showSaveStatus('error');
    }
  }

  private showSaveStatus(status: 'unsaved' | 'saving' | 'saved' | 'error'): void {
    // Clear any pending status timeout
    if (this.saveStatusTimeout !== null) {
      clearTimeout(this.saveStatusTimeout);
      this.saveStatusTimeout = null;
    }

    // Update status element
    this.saveStatus.className = 'editor-view__save-status';

    switch (status) {
      case 'unsaved':
        this.saveStatus.textContent = '●';
        this.saveStatus.classList.add('editor-view__save-status--unsaved');
        break;
      case 'saving':
        this.saveStatus.textContent = 'Saving...';
        this.saveStatus.classList.add('editor-view__save-status--saving');
        break;
      case 'saved':
        this.saveStatus.textContent = 'Saved';
        this.saveStatus.classList.add('editor-view__save-status--saved');
        // Auto-hide after 2 seconds
        this.saveStatusTimeout = window.setTimeout(() => {
          this.saveStatus.textContent = '';
          this.saveStatus.className = 'editor-view__save-status';
        }, 2000);
        break;
      case 'error':
        this.saveStatus.textContent = 'Save failed';
        this.saveStatus.classList.add('editor-view__save-status--error');
        break;
    }
  }

  async flush(): Promise<void> {
    if (this.saveTimeout !== null) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    await this.save();
  }

  private async handleBack(): Promise<void> {
    await this.flush();
    this.options.onBack();
  }

  focus(): void {
    this.textarea.focus();
  }

  show(): void {
    this.container.classList.add('shell__view--visible');
  }

  hide(): void {
    this.container.classList.remove('shell__view--visible');
    // Exit focus mode when leaving editor
    if (this.isFocusMode) {
      this.toggleFocusMode();
    }
    // Cleanup heading observer
    this.cleanupHeadingObserver();
  }

  getCurrentDocId(): string | null {
    return this.currentDocId;
  }

  isInFocusMode(): boolean {
    return this.isFocusMode;
  }
}
