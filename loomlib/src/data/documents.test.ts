import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createDocument,
  saveDocument,
  updateDocumentMetadata,
  deleteDocument,
  loadDocument,
  getFrameworks,
  getUniquePerspectives,
  getUniqueOutputs,
  getUniqueTags,
  filterDocuments,
} from './documents.ts';
import { _resetDB } from './db.ts';

describe('documents', () => {
  beforeEach(async () => {
    await _resetDB();
  });

  describe('createDocument', () => {
    it('creates a document with default type note', async () => {
      const doc = await createDocument();
      expect(doc.type).toBe('note');
      expect(doc.status).toBe('incubating');
      expect(doc.id).toMatch(/^[0-9a-f-]{36}$/);
    });

    it('creates a document with specified type', async () => {
      const doc = await createDocument('framework', { framework_kind: 'toolkit' });
      expect(doc.type).toBe('framework');
      expect(doc.framework_kind).toBe('toolkit');
    });

    it('derives title from content', async () => {
      const doc = await createDocument('note', { content: '# My Title\n\nSome content' });
      expect(doc.title).toBe('My Title');
    });

    it('uses provided title over derived', async () => {
      const doc = await createDocument('note', {
        title: 'Custom Title',
        content: '# Different Title\n\nContent',
      });
      expect(doc.title).toBe('Custom Title');
    });
  });

  describe('saveDocument', () => {
    it('updates content and modifiedAt', async () => {
      const doc = await createDocument('note', { content: 'Original' });
      const originalModifiedAt = doc.modifiedAt;

      await new Promise((r) => setTimeout(r, 10)); // Ensure time difference
      await saveDocument(doc.id, 'Updated content');

      const updated = await loadDocument(doc.id);
      expect(updated?.content).toBe('Updated content');
      expect(updated?.modifiedAt).toBeGreaterThan(originalModifiedAt);
    });

    it('throws for non-existent document', async () => {
      await expect(saveDocument('non-existent', 'content')).rejects.toThrow('Document not found');
    });
  });

  describe('updateDocumentMetadata', () => {
    it('updates metadata fields', async () => {
      const doc = await createDocument('note');
      const updated = await updateDocumentMetadata(doc.id, {
        type: 'instance',
        framework_ids: ['fw-1'],
        status: 'draft',
        tags: ['research'],
      });

      expect(updated.type).toBe('instance');
      expect(updated.framework_ids).toEqual(['fw-1']);
      expect(updated.status).toBe('draft');
      expect(updated.tags).toEqual(['research']);
    });
  });

  describe('deleteDocument', () => {
    it('deletes a regular document', async () => {
      const doc = await createDocument('note');
      const result = await deleteDocument(doc.id);
      expect(result.success).toBe(true);
      expect(await loadDocument(doc.id)).toBeUndefined();
    });

    it('blocks deletion of framework with children', async () => {
      const framework = await createDocument('framework', { framework_kind: 'toolkit' });
      await createDocument('instance', { framework_ids: [framework.id] });
      await createDocument('instance', { framework_ids: [framework.id] });

      const result = await deleteDocument(framework.id);
      expect(result.success).toBe(false);
      expect(result.error).toContain('2 instance(s) use this framework');
      expect(result.childCount).toBe(2);
    });

    it('allows deletion of framework with no children', async () => {
      const framework = await createDocument('framework', { framework_kind: 'toolkit' });
      const result = await deleteDocument(framework.id);
      expect(result.success).toBe(true);
    });
  });

  describe('getFrameworks', () => {
    it('returns only framework documents', async () => {
      await createDocument('note');
      await createDocument('framework', { framework_kind: 'toolkit' });
      await createDocument('framework', { framework_kind: 'domain' });
      await createDocument('instance');

      const frameworks = await getFrameworks();
      expect(frameworks).toHaveLength(2);
      expect(frameworks.every((f) => f.type === 'framework')).toBe(true);
    });
  });

  describe('getUniquePerspectives', () => {
    it('returns unique perspectives sorted', async () => {
      await createDocument('instance', { perspective: 'economic genealogy' });
      await createDocument('instance', { perspective: 'four knowings' });
      await createDocument('instance', { perspective: 'economic genealogy' });
      await createDocument('note', { perspective: null });

      const perspectives = await getUniquePerspectives();
      expect(perspectives).toEqual(['economic genealogy', 'four knowings']);
    });
  });

  describe('getUniqueOutputs', () => {
    it('returns unique outputs sorted', async () => {
      await createDocument('instance', { output: 'etymon' });
      await createDocument('instance', { output: 'loomcommander' });
      await createDocument('instance', { output: 'etymon' });

      const outputs = await getUniqueOutputs();
      expect(outputs).toEqual(['etymon', 'loomcommander']);
    });
  });

  describe('getUniqueTags', () => {
    it('returns unique tags from all documents', async () => {
      await createDocument('note', { tags: ['research', 'ux'] });
      await createDocument('note', { tags: ['research', 'api'] });

      const tags = await getUniqueTags();
      expect(tags).toEqual(['api', 'research', 'ux']);
    });
  });

  describe('filterDocuments', () => {
    beforeEach(async () => {
      await createDocument('note', { status: 'draft', tags: ['research'] });
      await createDocument('framework', {
        framework_kind: 'toolkit',
        status: 'verified',
        output: 'etymon',
      });
      await createDocument('instance', {
        status: 'incubating',
        perspective: 'economic genealogy',
        tags: ['important'],
      });
    });

    it('filters by type', async () => {
      const docs = await filterDocuments({ types: ['note', 'instance'] });
      expect(docs).toHaveLength(2);
    });

    it('filters by status', async () => {
      const docs = await filterDocuments({ statuses: ['incubating'] });
      expect(docs).toHaveLength(1);
      expect(docs[0].status).toBe('incubating');
    });

    it('filters by output', async () => {
      const docs = await filterDocuments({ output: 'etymon' });
      expect(docs).toHaveLength(1);
      expect(docs[0].type).toBe('framework');
    });

    it('filters by perspective', async () => {
      const docs = await filterDocuments({ perspective: 'economic genealogy' });
      expect(docs).toHaveLength(1);
      expect(docs[0].type).toBe('instance');
    });

    it('filters by tag', async () => {
      const docs = await filterDocuments({ tag: 'research' });
      expect(docs).toHaveLength(1);
      expect(docs[0].type).toBe('note');
    });

    it('combines multiple filters', async () => {
      const docs = await filterDocuments({ types: ['note', 'instance'], statuses: ['draft'] });
      expect(docs).toHaveLength(1);
      expect(docs[0].type).toBe('note');
    });
  });
});
