import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { _resetDB } from './db';
import {
  createDocument,
  loadDocument,
  saveDocument,
  deleteDocument,
  listDocuments,
  migrateFromLocalStorage,
} from './documents';

// Mock localStorage for Node environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Helper to delete database and wait for completion
async function clearDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase('minwrite');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}

describe('documents', () => {
  beforeEach(async () => {
    await _resetDB();
    await clearDatabase();
    localStorageMock.clear();
  });

  it('createDocument generates unique IDs', async () => {
    const doc1 = await createDocument();
    const doc2 = await createDocument();
    expect(doc1.id).not.toBe(doc2.id);
    expect(doc1.id).toMatch(/^[0-9a-f-]{36}$/); // UUID format
  });

  it('createDocument sets timestamps', async () => {
    const before = Date.now();
    const doc = await createDocument();
    const after = Date.now();

    expect(doc.createdAt).toBeGreaterThanOrEqual(before);
    expect(doc.createdAt).toBeLessThanOrEqual(after);
    expect(doc.modifiedAt).toBe(doc.createdAt);
  });

  it('createDocument stores document in DB', async () => {
    const doc = await createDocument();
    const loaded = await loadDocument(doc.id);
    expect(loaded).toEqual(doc);
  });

  it('saveDocument updates content and modifiedAt', async () => {
    const doc = await createDocument();
    const originalModifiedAt = doc.modifiedAt;

    // Wait a tick to ensure time difference
    await new Promise(r => setTimeout(r, 10));

    await saveDocument(doc.id, 'New content');
    const updated = await loadDocument(doc.id);

    expect(updated?.content).toBe('New content');
    expect(updated?.modifiedAt).toBeGreaterThan(originalModifiedAt);
    expect(updated?.createdAt).toBe(doc.createdAt); // unchanged
  });

  it('saveDocument throws for non-existent document', async () => {
    await expect(saveDocument('fake-id', 'content')).rejects.toThrow('Document not found');
  });

  it('deleteDocument removes from DB', async () => {
    const doc = await createDocument();
    expect(await loadDocument(doc.id)).toBeDefined();

    await deleteDocument(doc.id);
    expect(await loadDocument(doc.id)).toBeUndefined();
  });

  it('listDocuments returns sorted by modifiedAt desc', async () => {
    const doc1 = await createDocument();
    await new Promise(r => setTimeout(r, 10));
    const doc2 = await createDocument();
    await new Promise(r => setTimeout(r, 10));
    const doc3 = await createDocument();

    const list = await listDocuments();
    expect(list.length).toBe(3);
    expect(list[0].id).toBe(doc3.id); // most recent
    expect(list[1].id).toBe(doc2.id); // middle
    expect(list[2].id).toBe(doc1.id); // oldest
  });

  it('migrateFromLocalStorage moves content to new doc', async () => {
    localStorageMock.setItem('minwrite:content', 'Old content');

    const newId = await migrateFromLocalStorage();

    expect(newId).toBeTruthy();
    const doc = await loadDocument(newId!);
    expect(doc?.content).toBe('Old content');
  });

  it('migrateFromLocalStorage clears old localStorage key', async () => {
    localStorageMock.setItem('minwrite:content', 'To migrate');

    await migrateFromLocalStorage();

    expect(localStorageMock.getItem('minwrite:content')).toBeNull();
  });

  it('migrateFromLocalStorage returns null if no old content', async () => {
    const result = await migrateFromLocalStorage();
    expect(result).toBeNull();
  });
});
