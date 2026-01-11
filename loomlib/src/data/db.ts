import type { Document, UmapCoord } from '../types.ts';

const DB_NAME = 'loomlib';
const DB_VERSION = 4; // v4: adds domain index
const STORE_NAME = 'documents';
const EMBEDDINGS_STORE = 'embeddings';
const UMAP_COORDS_STORE = 'umap_coords';

interface EmbeddingRecord {
  docId: string;
  embedding: number[];
  updatedAt: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const tx = (event.target as IDBOpenDBRequest).transaction!;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('modifiedAt', 'modifiedAt', { unique: false });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('output', 'output', { unique: false });
        store.createIndex('domain', 'domain', { unique: false }); // v4
      } else {
        // Upgrading existing store - add domain index if missing (v4)
        const store = tx.objectStore(STORE_NAME);
        if (!store.indexNames.contains('domain')) {
          store.createIndex('domain', 'domain', { unique: false });
        }
      }
      // Add embeddings store (version 2+)
      if (!db.objectStoreNames.contains(EMBEDDINGS_STORE)) {
        db.createObjectStore(EMBEDDINGS_STORE, { keyPath: 'docId' });
      }
      // Add UMAP coords store (version 3+)
      if (!db.objectStoreNames.contains(UMAP_COORDS_STORE)) {
        db.createObjectStore(UMAP_COORDS_STORE, { keyPath: 'docId' });
      }
    };
  });

  return dbPromise;
}

export async function getDoc(id: string): Promise<Document | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function putDoc(doc: Document): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(doc);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function deleteDoc(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getAllDocs(): Promise<Document[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('modifiedAt');
    const request = index.openCursor(null, 'prev'); // Descending by modifiedAt
    const docs: Document[] = [];

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        docs.push(cursor.value);
        cursor.continue();
      } else {
        resolve(docs);
      }
    };
  });
}

export async function getDocsByType(type: Document['type']): Promise<Document[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('type');
    const request = index.getAll(type);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function getDocsByStatus(status: Document['status']): Promise<Document[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('status');
    const request = index.getAll(status);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Get documents by domain (for multi-domain support)
export async function getDocsByDomain(domain: string): Promise<Document[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    // Check if domain index exists (v4+)
    if (!store.indexNames.contains('domain')) {
      // Fallback: filter all docs by domain
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const docs = request.result as Document[];
        // For docs without domain field, treat as 'etymon' (legacy)
        resolve(docs.filter(d => (d.domain ?? 'etymon') === domain));
      };
      return;
    }

    const index = store.index('domain');
    const request = index.getAll(domain);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const docs = request.result as Document[];
      // Also include legacy docs without domain field if querying 'etymon'
      if (domain === 'etymon') {
        const allRequest = store.getAll();
        allRequest.onerror = () => reject(allRequest.error);
        allRequest.onsuccess = () => {
          const allDocs = allRequest.result as Document[];
          const legacyDocs = allDocs.filter(d => d.domain === undefined || d.domain === null);
          const combined = [...docs, ...legacyDocs];
          // Dedupe by id
          const seen = new Set<string>();
          const unique = combined.filter(d => {
            if (seen.has(d.id)) return false;
            seen.add(d.id);
            return true;
          });
          resolve(unique);
        };
      } else {
        resolve(docs);
      }
    };
  });
}

// Find documents that reference a given framework (for orphan checking)
export async function getDocsByFrameworkId(frameworkId: string): Promise<Document[]> {
  const allDocs = await getAllDocs();
  return allDocs.filter((doc) => doc.framework_ids.includes(frameworkId));
}

// Reset database (for testing)
export async function _resetDB(): Promise<void> {
  if (dbPromise) {
    const db = await dbPromise;
    db.close();
    dbPromise = null;
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Clear all documents (for testing)
export async function _clearDocs(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// ─── Embeddings Store ────────────────────────────────────────────────────────

export async function putEmbedding(docId: string, embedding: number[]): Promise<void> {
  const db = await openDB();

  // Handle case where embeddings store doesn't exist
  if (!db.objectStoreNames.contains(EMBEDDINGS_STORE)) {
    console.warn('[putEmbedding] Embeddings store not found - DB needs upgrade');
    return;
  }

  const record: EmbeddingRecord = {
    docId,
    embedding,
    updatedAt: Date.now(),
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(EMBEDDINGS_STORE, 'readwrite');
    const store = tx.objectStore(EMBEDDINGS_STORE);
    const request = store.put(record);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getEmbeddingForDoc(docId: string): Promise<number[] | null> {
  const db = await openDB();

  if (!db.objectStoreNames.contains(EMBEDDINGS_STORE)) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(EMBEDDINGS_STORE, 'readonly');
    const store = tx.objectStore(EMBEDDINGS_STORE);
    const request = store.get(docId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const record = request.result as EmbeddingRecord | undefined;
      resolve(record?.embedding ?? null);
    };
  });
}

export async function getAllEmbeddings(): Promise<Map<string, number[]>> {
  const db = await openDB();

  // Handle case where embeddings store doesn't exist (DB needs upgrade)
  if (!db.objectStoreNames.contains(EMBEDDINGS_STORE)) {
    console.warn('[getAllEmbeddings] Embeddings store not found - DB needs upgrade. Clear IndexedDB and refresh.');
    return new Map();
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(EMBEDDINGS_STORE, 'readonly');
    const store = tx.objectStore(EMBEDDINGS_STORE);
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const records = request.result as EmbeddingRecord[];
      const map = new Map<string, number[]>();
      for (const rec of records) {
        map.set(rec.docId, rec.embedding);
      }
      resolve(map);
    };
  });
}

export async function deleteEmbedding(docId: string): Promise<void> {
  const db = await openDB();

  if (!db.objectStoreNames.contains(EMBEDDINGS_STORE)) {
    return;
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(EMBEDDINGS_STORE, 'readwrite');
    const store = tx.objectStore(EMBEDDINGS_STORE);
    const request = store.delete(docId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Clear all embeddings (for testing)
export async function _clearEmbeddings(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(EMBEDDINGS_STORE, 'readwrite');
    const store = tx.objectStore(EMBEDDINGS_STORE);
    const request = store.clear();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// ─── UMAP Coordinates Store ──────────────────────────────────────────────────

export async function putUmapCoord(coord: UmapCoord): Promise<void> {
  const db = await openDB();

  if (!db.objectStoreNames.contains(UMAP_COORDS_STORE)) {
    console.warn('[putUmapCoord] UMAP coords store not found - DB needs upgrade');
    return;
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(UMAP_COORDS_STORE, 'readwrite');
    const store = tx.objectStore(UMAP_COORDS_STORE);
    const request = store.put(coord);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function putUmapCoordsBatch(coords: UmapCoord[]): Promise<void> {
  const db = await openDB();

  if (!db.objectStoreNames.contains(UMAP_COORDS_STORE)) {
    console.warn('[putUmapCoordsBatch] UMAP coords store not found');
    return;
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(UMAP_COORDS_STORE, 'readwrite');
    const store = tx.objectStore(UMAP_COORDS_STORE);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);

    for (const coord of coords) {
      store.put(coord);
    }
  });
}

export async function getUmapCoord(docId: string): Promise<UmapCoord | null> {
  const db = await openDB();

  if (!db.objectStoreNames.contains(UMAP_COORDS_STORE)) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(UMAP_COORDS_STORE, 'readonly');
    const store = tx.objectStore(UMAP_COORDS_STORE);
    const request = store.get(docId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result ?? null);
  });
}

export async function getAllUmapCoords(): Promise<Map<string, UmapCoord>> {
  const db = await openDB();

  if (!db.objectStoreNames.contains(UMAP_COORDS_STORE)) {
    console.warn('[getAllUmapCoords] UMAP coords store not found');
    return new Map();
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(UMAP_COORDS_STORE, 'readonly');
    const store = tx.objectStore(UMAP_COORDS_STORE);
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const coords = request.result as UmapCoord[];
      const map = new Map<string, UmapCoord>();
      for (const coord of coords) {
        map.set(coord.docId, coord);
      }
      resolve(map);
    };
  });
}

export async function clearUmapCoords(): Promise<void> {
  const db = await openDB();

  if (!db.objectStoreNames.contains(UMAP_COORDS_STORE)) {
    return;
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(UMAP_COORDS_STORE, 'readwrite');
    const store = tx.objectStore(UMAP_COORDS_STORE);
    const request = store.clear();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// ─── Domain Migration ─────────────────────────────────────────────────────────

/**
 * Backfill existing documents without a domain field.
 * Sets domain based on output field, or defaults to 'etymon'.
 * Returns count of migrated docs.
 */
export async function migrateDocsToDomain(): Promise<number> {
  const docs = await getAllDocs();
  let migrated = 0;

  for (const doc of docs) {
    if (doc.domain === undefined || doc.domain === null) {
      // Use output as domain if set, otherwise default to 'etymon'
      const domain = doc.output ?? 'etymon';
      await putDoc({ ...doc, domain });
      migrated++;
    }
  }

  if (migrated > 0) {
    console.log(`[migrateDocsToDomain] Backfilled ${migrated} documents with domain field`);
  }

  return migrated;
}
