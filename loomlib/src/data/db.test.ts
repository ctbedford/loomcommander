import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { getDoc, putDoc, deleteDoc, getAllDocs, getDocsByType, getDocsByFrameworkId, _resetDB } from './db.ts';
import type { Document } from '../types.ts';

function createTestDoc(overrides: Partial<Document> = {}): Document {
  return {
    id: crypto.randomUUID(),
    title: 'Test Document',
    content: '# Test\n\nContent here',
    type: 'note',
    framework_kind: null,
    perspective: null,
    framework_ids: [],
    source_id: null,
    output: null,
    status: 'draft',
    tags: [],
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    ...overrides,
  };
}

describe('db', () => {
  beforeEach(async () => {
    await _resetDB();
  });

  describe('putDoc / getDoc', () => {
    it('stores and retrieves a document', async () => {
      const doc = createTestDoc({ title: 'My Note' });
      await putDoc(doc);
      const retrieved = await getDoc(doc.id);
      expect(retrieved).toEqual(doc);
    });

    it('stores all schema fields correctly', async () => {
      const doc = createTestDoc({
        type: 'instance',
        framework_kind: null,
        perspective: 'economic genealogy',
        framework_ids: ['fw-1', 'fw-2'],
        source_id: 'src-1',
        output: 'etymon',
        status: 'incubating',
        tags: ['research', 'ux'],
      });
      await putDoc(doc);
      const retrieved = await getDoc(doc.id);
      expect(retrieved).toEqual(doc);
      expect(retrieved?.framework_ids).toEqual(['fw-1', 'fw-2']);
      expect(retrieved?.tags).toEqual(['research', 'ux']);
    });

    it('returns undefined for non-existent document', async () => {
      const retrieved = await getDoc('non-existent-id');
      expect(retrieved).toBeUndefined();
    });

    it('updates existing document', async () => {
      const doc = createTestDoc();
      await putDoc(doc);

      const updated = { ...doc, title: 'Updated Title', modifiedAt: Date.now() + 1000 };
      await putDoc(updated);

      const retrieved = await getDoc(doc.id);
      expect(retrieved?.title).toBe('Updated Title');
    });
  });

  describe('deleteDoc', () => {
    it('removes a document', async () => {
      const doc = createTestDoc();
      await putDoc(doc);
      await deleteDoc(doc.id);
      const retrieved = await getDoc(doc.id);
      expect(retrieved).toBeUndefined();
    });
  });

  describe('getAllDocs', () => {
    it('returns empty array when no documents', async () => {
      const docs = await getAllDocs();
      expect(docs).toEqual([]);
    });

    it('returns all documents sorted by modifiedAt descending', async () => {
      const doc1 = createTestDoc({ title: 'First', modifiedAt: 1000 });
      const doc2 = createTestDoc({ title: 'Second', modifiedAt: 3000 });
      const doc3 = createTestDoc({ title: 'Third', modifiedAt: 2000 });

      await putDoc(doc1);
      await putDoc(doc2);
      await putDoc(doc3);

      const docs = await getAllDocs();
      expect(docs.map((d) => d.title)).toEqual(['Second', 'Third', 'First']);
    });
  });

  describe('getDocsByType', () => {
    it('filters by document type', async () => {
      const note = createTestDoc({ type: 'note' });
      const framework = createTestDoc({ type: 'framework', framework_kind: 'toolkit' });
      const instance = createTestDoc({ type: 'instance' });

      await putDoc(note);
      await putDoc(framework);
      await putDoc(instance);

      const frameworks = await getDocsByType('framework');
      expect(frameworks).toHaveLength(1);
      expect(frameworks[0].type).toBe('framework');
    });
  });

  describe('getDocsByFrameworkId', () => {
    it('finds documents that reference a framework', async () => {
      const framework = createTestDoc({ id: 'fw-1', type: 'framework', framework_kind: 'toolkit' });
      const instance1 = createTestDoc({ type: 'instance', framework_ids: ['fw-1'] });
      const instance2 = createTestDoc({ type: 'instance', framework_ids: ['fw-1', 'fw-2'] });
      const instance3 = createTestDoc({ type: 'instance', framework_ids: ['fw-2'] });

      await putDoc(framework);
      await putDoc(instance1);
      await putDoc(instance2);
      await putDoc(instance3);

      const children = await getDocsByFrameworkId('fw-1');
      expect(children).toHaveLength(2);
      expect(children.map((d) => d.id)).toContain(instance1.id);
      expect(children.map((d) => d.id)).toContain(instance2.id);
    });

    it('returns empty array when no references', async () => {
      const children = await getDocsByFrameworkId('non-existent');
      expect(children).toEqual([]);
    });
  });
});
