/**
 * Shell - Domain-Aware View Orchestration
 *
 * The Shell reads view configuration from the current domain and only
 * instantiates the views specified in the config. This enables domain-specific
 * user experiences (ops gets List/Kanban/Deck, etymon gets the full set).
 */

import type { Document, ViewMode } from '../types.ts';
import { createDocument } from '../data/documents.ts';
import { getCurrentDomainConfig, type ViewConfig } from '../config/domains/index.ts';

// View imports
import { ListView } from '../views/list.ts';
import { Editor } from '../views/editor.ts';
import { ConstellationView } from '../views/constellation.ts';
import { FlowView } from '../views/flow.ts';
import { SpatialView } from '../views/spatial.ts';
import { DeckView } from '../views/deck.ts';
import { KanbanView } from '../views/kanban.ts';

export interface ShellOptions {
  onTriageRequest?: (docId: string | null) => void;
}

// View interface for polymorphic handling
interface View {
  show(): void;
  hide(): void;
  refresh(): Promise<void>;
  focus(): void;
  hasOpenOverlay?(): boolean;
  setFocus?(docId: string, skipRender?: boolean): void;
}

// View constructor map
const VIEW_CONSTRUCTORS: Record<ViewMode, new (container: HTMLElement, options: any) => View> = {
  list: ListView as any,
  constellation: ConstellationView as any,
  flow: FlowView as any,
  spatial: SpatialView as any,
  deck: DeckView as any,
  kanban: KanbanView as any,
  editor: Editor as any,
};

export class Shell {
  private container: HTMLElement;
  private views: Map<ViewMode, View> = new Map();
  private viewContainers: Map<ViewMode, HTMLElement> = new Map(); // Store container refs for reliable hiding
  private viewConfigs: ViewConfig[];
  private editor: Editor;
  private editorContainer: HTMLElement;
  private currentView: ViewMode = 'list';
  private options: ShellOptions;

  constructor(container: HTMLElement, options: ShellOptions = {}) {
    this.container = container;
    this.options = options;
    this.container.className = 'shell';

    // Get domain config
    const domainConfig = getCurrentDomainConfig();
    this.viewConfigs = domainConfig.views ?? [];

    console.log(`[Shell] Domain: ${domainConfig.id}, Views: ${this.viewConfigs.map(v => v.id).join(', ')}`);

    // Create view containers and instantiate views from config
    for (const viewConfig of this.viewConfigs) {
      const viewContainer = document.createElement('div');
      viewContainer.className = `shell__view shell__view--${viewConfig.id}`;
      this.container.appendChild(viewContainer);

      const ViewClass = VIEW_CONSTRUCTORS[viewConfig.id];
      if (ViewClass) {
        const view = new ViewClass(viewContainer, this.createViewOptions(viewConfig.id));
        this.views.set(viewConfig.id, view);
        this.viewContainers.set(viewConfig.id, viewContainer); // Store container ref
      } else {
        console.warn(`[Shell] Unknown view: ${viewConfig.id}`);
      }
    }

    // Editor is always available (not in views array)
    this.editorContainer = document.createElement('div');
    this.editorContainer.className = 'shell__view shell__view--editor';
    this.container.appendChild(this.editorContainer);

    this.editor = new Editor(this.editorContainer, {
      onBack: () => this.showDefaultView(),
      onTriage: (docId) => this.options.onTriageRequest?.(docId),
      onGoToList: () => this.showView('list'),
      onGoToConstellation: () => this.showView('constellation'),
      onGoToFlow: () => this.showView('flow'),
      onGoToDeck: () => this.showView('deck'),
    });

    // Determine default view
    const defaultConfig = this.viewConfigs.find(v => v.default) ?? this.viewConfigs[0];
    if (defaultConfig) {
      this.currentView = defaultConfig.id;
    }

    // Global keyboard shortcuts
    document.addEventListener('keydown', this.handleGlobalKeydown);
  }

  /**
   * Create view options based on view type
   */
  private createViewOptions(viewId: ViewMode): any {
    const baseOptions = {
      onDocumentSelect: () => {},
      onDocumentOpen: (doc: Document) => this.openDocument(doc),
    };

    switch (viewId) {
      case 'list':
        return {
          ...baseOptions,
          onDocumentSelect: (doc: Document) => this.openDocument(doc),
          onNewDocument: () => this.createNewDocument(),
          onGoToFlow: () => this.showView('flow'),
          onGoToDeck: () => this.showView('deck'),
        };
      default:
        return baseOptions;
    }
  }

  async init(): Promise<void> {
    const defaultView = this.views.get(this.currentView);
    if (defaultView) {
      await defaultView.refresh();
    }
    this.showView(this.currentView);
  }

  // ─────────────────────────────────────────────────────────────────────
  // Keyboard Handling
  // ─────────────────────────────────────────────────────────────────────

  private handleGlobalKeydown = (e: KeyboardEvent): void => {
    const isMod = e.metaKey || e.ctrlKey;

    // Cmd+Shift+{key}: View shortcuts from config
    if (isMod && e.shiftKey) {
      const key = e.key.toUpperCase();

      // Check domain view shortcuts
      for (const viewConfig of this.viewConfigs) {
        if (viewConfig.shortcut?.toUpperCase() === key) {
          e.preventDefault();
          this.showView(viewConfig.id);
          return;
        }
      }

      // Cmd+Shift+V: Toggle view cycle
      if (key === 'V') {
        e.preventDefault();
        this.toggleView();
        return;
      }
    }

    // Cmd+N: New document
    if (isMod && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      this.createNewDocument();
      return;
    }

    // Cmd+I: Re-triage current document
    if (isMod && e.key.toLowerCase() === 'i' && this.currentView === 'editor') {
      e.preventDefault();
      const docId = this.editor.getCurrentDocId();
      if (docId) {
        this.options.onTriageRequest?.(docId);
      }
      return;
    }

    // Escape: Return to default view (but respect open overlays)
    if (e.key === 'Escape') {
      const currentViewInstance = this.views.get(this.currentView);
      if (currentViewInstance?.hasOpenOverlay?.()) {
        return; // Let overlay handle it
      }

      e.preventDefault();
      if (this.currentView !== this.getDefaultViewId()) {
        this.showDefaultView();
      }
      return;
    }
  };

  // ─────────────────────────────────────────────────────────────────────
  // View Navigation
  // ─────────────────────────────────────────────────────────────────────

  private getDefaultViewId(): ViewMode {
    const defaultConfig = this.viewConfigs.find(v => v.default);
    return defaultConfig?.id ?? this.viewConfigs[0]?.id ?? 'list';
  }

  private showDefaultView(): void {
    this.showView(this.getDefaultViewId());
  }

  private toggleView(): void {
    // Cycle through configured views, then editor if doc open, then back to start
    const viewIds = this.viewConfigs.map(v => v.id);
    const currentIndex = viewIds.indexOf(this.currentView);

    if (this.currentView === 'editor') {
      // From editor, go to first view
      this.showView(viewIds[0]);
    } else if (currentIndex === viewIds.length - 1) {
      // At last view, go to editor if doc open, else first view
      const docId = this.editor.getCurrentDocId();
      if (docId) {
        this.showEditor();
      } else {
        this.showView(viewIds[0]);
      }
    } else {
      // Go to next view
      this.showView(viewIds[currentIndex + 1]);
    }
  }

  showView(viewId: ViewMode): void {
    // Check if view exists in config
    if (!this.views.has(viewId)) {
      console.warn(`[Shell] View not available in this domain: ${viewId}`);
      return;
    }

    // Hide all views first
    this.hideAllViews();

    // Show target view - clear inline styles before view.show() adds the class
    this.currentView = viewId;
    this.showViewContainer(viewId);

    const view = this.views.get(viewId);
    if (view) {
      view.show();
      view.focus();
    }
  }

  private showEditor(): void {
    this.hideAllViews();
    this.currentView = 'editor';
    this.showEditorContainer();
    this.editor.show();
    this.editor.focus();
  }

  private hideAllViews(): void {
    // Hide all views using stored container references
    // Use both class removal AND inline styles as belt-and-suspenders
    for (const [id, view] of this.views.entries()) {
      view.hide();
      const container = this.viewContainers.get(id);
      if (container) {
        container.classList.remove('shell__view--visible');
        container.style.display = 'none';
        container.style.visibility = 'hidden';
      }
    }
    // Also ensure editor container is hidden
    this.editor.hide();
    this.editorContainer.classList.remove('shell__view--visible');
    this.editorContainer.style.display = 'none';
    this.editorContainer.style.visibility = 'hidden';
  }

  private showViewContainer(viewId: ViewMode): void {
    // Clear inline styles and add visible class
    const container = this.viewContainers.get(viewId);
    if (container) {
      container.style.display = '';
      container.style.visibility = '';
      container.classList.add('shell__view--visible');
    }
  }

  private showEditorContainer(): void {
    this.editorContainer.style.display = '';
    this.editorContainer.style.visibility = '';
    this.editorContainer.classList.add('shell__view--visible');
  }

  // ─────────────────────────────────────────────────────────────────────
  // Document Operations
  // ─────────────────────────────────────────────────────────────────────

  async openDocument(doc: Document): Promise<void> {
    await this.editor.load(doc.id);
    this.showEditor();
  }

  private async createNewDocument(): Promise<void> {
    const doc = await createDocument('note');
    await this.openDocument(doc);

    if (this.options.onTriageRequest) {
      this.options.onTriageRequest(doc.id);
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────

  getCurrentView(): ViewMode {
    return this.currentView;
  }

  async refresh(): Promise<void> {
    if (this.currentView === 'editor') {
      return;
    }

    const view = this.views.get(this.currentView);
    if (view) {
      await view.refresh();
    }
  }

  /**
   * Get list of available views for this domain
   */
  getAvailableViews(): ViewConfig[] {
    return this.viewConfigs;
  }

  /**
   * Check if a view is available in this domain
   */
  hasView(viewId: ViewMode): boolean {
    return this.views.has(viewId);
  }
}
