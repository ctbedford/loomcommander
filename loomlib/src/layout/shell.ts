import type { Document, ViewMode } from '../types.ts';
import { createDocument } from '../data/documents.ts';
import { ListView } from '../views/list.ts';
import { Editor } from '../views/editor.ts';
import { ConstellationView } from '../views/constellation.ts';

export interface ShellOptions {
  onTriageRequest?: (docId: string | null) => void;
}

export class Shell {
  private container: HTMLElement;
  private listView: ListView;
  private constellationView: ConstellationView;
  private editor: Editor;
  private currentView: ViewMode = 'list';
  private options: ShellOptions;

  constructor(container: HTMLElement, options: ShellOptions = {}) {
    this.container = container;
    this.options = options;
    this.container.className = 'shell';

    // Create view containers
    const listContainer = document.createElement('div');
    listContainer.className = 'shell__view shell__view--list';
    this.container.appendChild(listContainer);

    const constellationContainer = document.createElement('div');
    constellationContainer.className = 'shell__view shell__view--constellation';
    this.container.appendChild(constellationContainer);

    const editorContainer = document.createElement('div');
    editorContainer.className = 'shell__view shell__view--editor';
    this.container.appendChild(editorContainer);

    // Initialize views
    this.listView = new ListView(listContainer, {
      onDocumentSelect: (doc) => this.openDocument(doc),
      onNewDocument: () => this.createNewDocument(),
    });

    this.constellationView = new ConstellationView(constellationContainer, {
      onDocumentSelect: () => {
        // Just update focus in constellation view
      },
      onDocumentOpen: (doc) => this.openDocument(doc),
    });

    this.editor = new Editor(editorContainer, {
      onBack: () => this.showList(),
      onTriage: (docId) => this.options.onTriageRequest?.(docId),
      onGoToList: () => this.showList(),
      onGoToConstellation: () => this.showConstellation(),
    });

    // Global keyboard shortcuts
    document.addEventListener('keydown', this.handleGlobalKeydown);
  }

  async init(): Promise<void> {
    await this.listView.refresh();
    this.showList();
  }

  private handleGlobalKeydown = (e: KeyboardEvent): void => {
    const isMod = e.metaKey || e.ctrlKey;

    // Cmd+Shift+V: Toggle view (list -> constellation -> editor cycle)
    if (isMod && e.shiftKey && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      this.toggleView();
      return;
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

    // Escape: Return to previous view (but respect open overlays)
    if (e.key === 'Escape') {
      // Check if constellation has an open overlay (lens picker, etc.)
      // If so, let the overlay handle its own closing - don't navigate away
      if (this.currentView === 'constellation' && this.constellationView.hasOpenOverlay()) {
        // Don't preventDefault - let the event propagate to the overlay
        return;
      }

      e.preventDefault();
      if (this.currentView === 'editor') {
        this.showList();
      } else if (this.currentView === 'constellation') {
        this.showList();
      }
      return;
    }
  };

  private toggleView(): void {
    // Cycle: list -> constellation -> editor (if doc open) -> list
    switch (this.currentView) {
      case 'list':
        this.showConstellation();
        break;
      case 'constellation':
        const docId = this.editor.getCurrentDocId();
        if (docId) {
          this.showEditor();
        } else {
          this.showList();
        }
        break;
      case 'editor':
        this.showList();
        break;
    }
  }

  private showList(): void {
    this.currentView = 'list';
    this.editor.hide();
    this.constellationView.hide();
    this.listView.show();
    this.listView.refresh();
    this.listView.focus();
  }

  private showConstellation(): void {
    this.currentView = 'constellation';
    this.listView.hide();
    this.editor.hide();
    this.constellationView.show();
    this.constellationView.focus();
  }

  private showEditor(): void {
    this.currentView = 'editor';
    this.listView.hide();
    this.constellationView.hide();
    this.editor.show();
    this.editor.focus();
  }

  async openDocument(doc: Document): Promise<void> {
    await this.editor.load(doc.id);
    this.showEditor();
  }

  private async createNewDocument(): Promise<void> {
    const doc = await createDocument('note');
    await this.openDocument(doc);

    // Trigger triage for the new doc
    if (this.options.onTriageRequest) {
      this.options.onTriageRequest(doc.id);
    }
  }

  getCurrentView(): ViewMode {
    return this.currentView;
  }

  async refresh(): Promise<void> {
    switch (this.currentView) {
      case 'list':
        await this.listView.refresh();
        break;
      case 'constellation':
        await this.constellationView.refresh();
        break;
    }
  }
}
