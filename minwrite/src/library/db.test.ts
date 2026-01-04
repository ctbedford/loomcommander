import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { openDB, getAllDocs, getDoc, putDoc, deleteDoc, _resetDB, Document } from './db';

// Helper to delete database and wait for completion
async function clearDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase('minwrite');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve(); // Proceed even if blocked
  });
}

describe('db', () => {
  beforeEach(async () => {
    await _resetDB();
    await clearDatabase();
  });

  it('openDB creates database and object store', async () => {
    const db = await openDB();
    expect(db.name).toBe('minwrite');
    expect(db.objectStoreNames.contains('documents')).toBe(true);
  });

  it('putDoc stores a document', async () => {
    const doc: Document = {
      id: 'test-1',
      content: 'Hello',
      createdAt: 1000,
      modifiedAt: 1000,
    };
    await putDoc(doc);
    const retrieved = await getDoc('test-1');
    expect(retrieved).toEqual(doc);
  });

  it('getDoc returns undefined for non-existent document', async () => {
    const result = await getDoc('does-not-exist');
    expect(result).toBeUndefined();
  });

  it('getAllDocs returns documents sorted by modifiedAt descending', async () => {
    const doc1: Document = { id: '1', content: 'a', createdAt: 1000, modifiedAt: 1000 };
    const doc2: Document = { id: '2', content: 'b', createdAt: 2000, modifiedAt: 3000 };
    const doc3: Document = { id: '3', content: 'c', createdAt: 3000, modifiedAt: 2000 };

    await putDoc(doc1);
    await putDoc(doc2);
    await putDoc(doc3);

    const all = await getAllDocs();
    expect(all.length).toBe(3);
    expect(all[0].id).toBe('2'); // modifiedAt: 3000
    expect(all[1].id).toBe('3'); // modifiedAt: 2000
    expect(all[2].id).toBe('1'); // modifiedAt: 1000
  });

  it('deleteDoc removes a document', async () => {
    const doc: Document = { id: 'to-delete', content: 'bye', createdAt: 1000, modifiedAt: 1000 };
    await putDoc(doc);
    expect(await getDoc('to-delete')).toBeDefined();

    await deleteDoc('to-delete');
    expect(await getDoc('to-delete')).toBeUndefined();
  });

  it('putDoc updates existing document', async () => {
    const doc: Document = { id: 'update-me', content: 'v1', createdAt: 1000, modifiedAt: 1000 };
    await putDoc(doc);

    const updated = { ...doc, content: 'v2', modifiedAt: 2000 };
    await putDoc(updated);

    const retrieved = await getDoc('update-me');
    expect(retrieved?.content).toBe('v2');
    expect(retrieved?.modifiedAt).toBe(2000);
  });
});
