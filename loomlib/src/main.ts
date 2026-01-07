import './ui/styles.css';
import './ui/card.css';
import './ui/list.css';
import './ui/editor.css';
import './ui/triage.css';
import './ui/constellation.css';
import './ui/palette.css';

import { Shell } from './layout/shell.ts';
import { TriageModal } from './components/triage-modal.ts';
import { CommandPalette } from './components/command-palette.ts';
import { createDocument } from './data/documents.ts';
import { syncSeedData } from './data/seed.ts';

// Theme handling
function loadTheme(): void {
  const saved = localStorage.getItem('loomlib:theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }
}

function toggleTheme(): void {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('loomlib:theme', next);
}

// Bootstrap application
async function init(): Promise<void> {
  loadTheme();

  const app = document.getElementById('app');
  if (!app) {
    throw new Error('App container not found');
  }

  // Sync seed-data documents to IndexedDB (adds missing, updates changed)
  await syncSeedData();

  // Initialize shell first
  const shell = new Shell(app, {
    onTriageRequest: (docId) => {
      if (docId) {
        triageModal.open(docId);
      }
    },
  });

  // Create triage modal
  const triageModal = new TriageModal(document.body, {
    onSave: () => {
      triageModal.hide();
      shell.refresh();
    },
    onCancel: () => {
      triageModal.hide();
    },
  });

  // Create command palette
  const palette = new CommandPalette(document.body, {
    onSelect: async (doc) => {
      palette.hide();
      if (doc) {
        shell.openDocument(doc);
      }
    },
    onCancel: () => {
      palette.hide();
    },
    onNewDocument: async () => {
      palette.hide();
      const doc = await createDocument('note');
      shell.openDocument(doc);
      triageModal.open(doc.id);
    },
  });

  await shell.init();

  // Global keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    const isMod = e.metaKey || e.ctrlKey;

    // Cmd+O: Open command palette
    if (isMod && e.key.toLowerCase() === 'o') {
      e.preventDefault();
      if (!palette.isVisible() && !triageModal.isVisible()) {
        palette.open();
      }
      return;
    }

    // Cmd+Shift+L: Toggle theme
    if (isMod && e.shiftKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      toggleTheme();
      return;
    }
  });
}

init().catch(console.error);
