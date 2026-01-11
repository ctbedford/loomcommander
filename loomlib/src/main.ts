import './ui/styles.css';
import './ui/card.css';
import './ui/list.css';
import './ui/editor.css';
import './ui/triage.css';
import './ui/constellation.css';
import './ui/flow.css';
import './ui/spatial.css';
import './ui/deck.css';
import './ui/kanban.css';
import './ui/palette.css';

import { Shell } from './layout/shell.ts';
import { TriageModal } from './components/triage-modal.ts';
import { CommandPalette } from './components/command-palette.ts';
import { createDocument, listDomainDocuments, updateDocEmbedding } from './data/documents.ts';
import { syncSeedData } from './data/seed.ts';
import { hasApiKey, setApiKey } from './data/embeddings.ts';
import { getAllEmbeddings, migrateDocsToDomain } from './data/db.ts';
import { recomputeUmapCoords } from './data/umap.ts';
import { getCurrentDomain } from './types.ts';

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

// Ensure all documents have embeddings (runs in background, domain-scoped)
async function ensureEmbeddings(): Promise<void> {
  if (!hasApiKey()) {
    console.debug('[ensureEmbeddings] No API key set, skipping');
    return;
  }

  const domain = getCurrentDomain();
  const docs = await listDomainDocuments(domain);
  const embeddings = await getAllEmbeddings();

  // Find docs without embeddings (in current domain)
  const missing = docs.filter(d => !embeddings.has(d.id) && d.content.trim().length >= 10);

  if (missing.length === 0) {
    console.debug(`[ensureEmbeddings] All ${domain} docs have embeddings`);
    return;
  }

  console.log(`[ensureEmbeddings] Embedding ${missing.length} ${domain} documents...`);

  // Embed sequentially to avoid rate limits
  for (const doc of missing) {
    await updateDocEmbedding(doc.id, doc.content);
    // Small delay between requests
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('[ensureEmbeddings] Done');
}

// Prompt for API key if not set
function checkApiKey(): void {
  if (hasApiKey()) return;

  // Only prompt once per session
  const prompted = sessionStorage.getItem('loomlib:api-key-prompted');
  if (prompted) return;

  sessionStorage.setItem('loomlib:api-key-prompted', 'true');

  // Delayed prompt to not block initial load
  setTimeout(() => {
    const key = prompt(
      'Enter Voyage AI API key for semantic siblings in flow view.\n\n' +
      'Get one at: https://www.voyageai.com/\n\n' +
      '(Leave blank to skip)'
    );
    if (key?.trim()) {
      setApiKey(key.trim());
      ensureEmbeddings(); // Start embedding in background
    }
  }, 1000);
}

// Bootstrap application
async function init(): Promise<void> {
  loadTheme();

  const app = document.getElementById('app');
  if (!app) {
    throw new Error('App container not found');
  }

  const domain = getCurrentDomain();
  console.log(`[init] Starting loomlib with domain: ${domain}`);

  // Run migration to backfill domain field on existing docs
  await migrateDocsToDomain();

  // Sync seed-data documents to IndexedDB (domain-scoped)
  await syncSeedData(domain);

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

  // Check for API key and prompt if needed
  checkApiKey();

  // Ensure all docs have embeddings (runs in background)
  ensureEmbeddings();

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

// Debug utilities exposed to window for checking embeddings
declare global {
  interface Window {
    loomlib: {
      checkEmbeddings: () => Promise<{ total: number; withEmbeddings: number; missing: string[] }>;
      setApiKey: (key: string) => void;
      getApiKey: () => string | null;
      embedAll: () => Promise<void>;
      recomputeUmap: () => Promise<void>;
    };
  }
}

window.loomlib = {
  async checkEmbeddings() {
    const domain = getCurrentDomain();
    const docs = await listDomainDocuments(domain);
    const embeddings = await getAllEmbeddings();
    const missing = docs.filter(d => !embeddings.has(d.id)).map(d => d.id);
    return {
      domain,
      total: docs.length,
      withEmbeddings: embeddings.size,
      missing,
    };
  },
  setApiKey(key: string) {
    setApiKey(key);
    console.log('API key set. Run loomlib.embedAll() to embed all docs.');
  },
  getApiKey() {
    return hasApiKey() ? '(set)' : null;
  },
  async embedAll() {
    await ensureEmbeddings();
  },
  async recomputeUmap() {
    console.log('Recomputing UMAP with collision resolution...');
    await recomputeUmapCoords();
    console.log('Done. Refresh spatial view (Cmd+Shift+S) to see changes.');
  },
};
