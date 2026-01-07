import { describe, it, expect } from 'vitest';
import { computeEdges, computeLayers, computePositions, computeGraph, getRelatedDocs } from './graph.ts';
import type { Document } from '../types.ts';

function createDoc(overrides: Partial<Document> = {}): Document {
  return {
    id: crypto.randomUUID(),
    title: 'Test',
    content: '',
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

describe('graph', () => {
  describe('computeEdges', () => {
    it('creates edges from framework_ids', () => {
      const framework = createDoc({ id: 'fw-1', type: 'framework', framework_kind: 'toolkit' });
      const instance = createDoc({ id: 'inst-1', type: 'instance', framework_ids: ['fw-1'] });

      const edges = computeEdges([framework, instance]);

      expect(edges).toEqual([{ source: 'inst-1', target: 'fw-1' }]);
    });

    it('creates edges from source_id', () => {
      const source = createDoc({ id: 'src-1', type: 'source' });
      const note = createDoc({ id: 'note-1', type: 'note', source_id: 'src-1' });

      const edges = computeEdges([source, note]);

      expect(edges).toEqual([{ source: 'note-1', target: 'src-1' }]);
    });

    it('handles multiple framework_ids', () => {
      const fw1 = createDoc({ id: 'fw-1', type: 'framework' });
      const fw2 = createDoc({ id: 'fw-2', type: 'framework' });
      const instance = createDoc({ type: 'instance', framework_ids: ['fw-1', 'fw-2'] });

      const edges = computeEdges([fw1, fw2, instance]);

      expect(edges).toHaveLength(2);
      expect(edges).toContainEqual({ source: instance.id, target: 'fw-1' });
      expect(edges).toContainEqual({ source: instance.id, target: 'fw-2' });
    });

    it('ignores references to non-existent documents', () => {
      const instance = createDoc({ type: 'instance', framework_ids: ['non-existent'] });

      const edges = computeEdges([instance]);

      expect(edges).toEqual([]);
    });
  });

  describe('computeLayers', () => {
    it('assigns focus layer to focused document', () => {
      const doc = createDoc({ id: 'doc-1' });
      const layers = computeLayers([doc], 'doc-1');

      expect(layers.get('doc-1')).toBe('focus');
    });

    it('assigns context to parent frameworks', () => {
      const framework = createDoc({ id: 'fw-1', type: 'framework' });
      const instance = createDoc({ id: 'inst-1', type: 'instance', framework_ids: ['fw-1'] });

      const layers = computeLayers([framework, instance], 'inst-1');

      expect(layers.get('inst-1')).toBe('focus');
      expect(layers.get('fw-1')).toBe('context');
    });

    it('assigns context to child instances', () => {
      const framework = createDoc({ id: 'fw-1', type: 'framework' });
      const instance = createDoc({ id: 'inst-1', type: 'instance', framework_ids: ['fw-1'] });

      const layers = computeLayers([framework, instance], 'fw-1');

      expect(layers.get('fw-1')).toBe('focus');
      expect(layers.get('inst-1')).toBe('context');
    });

    it('assigns context to siblings with same perspective', () => {
      const doc1 = createDoc({ id: 'doc-1', perspective: 'economic genealogy' });
      const doc2 = createDoc({ id: 'doc-2', perspective: 'economic genealogy' });
      const doc3 = createDoc({ id: 'doc-3', perspective: 'other' });

      const layers = computeLayers([doc1, doc2, doc3], 'doc-1');

      expect(layers.get('doc-1')).toBe('focus');
      expect(layers.get('doc-2')).toBe('context');
      expect(layers.get('doc-3')).toBe('distant');
    });

    it('assigns context to siblings with same output', () => {
      const doc1 = createDoc({ id: 'doc-1', output: 'etymon' });
      const doc2 = createDoc({ id: 'doc-2', output: 'etymon' });
      const doc3 = createDoc({ id: 'doc-3', output: 'other' });

      const layers = computeLayers([doc1, doc2, doc3], 'doc-1');

      expect(layers.get('doc-1')).toBe('focus');
      expect(layers.get('doc-2')).toBe('context');
      expect(layers.get('doc-3')).toBe('distant');
    });

    it('assigns distant to unrelated documents', () => {
      const doc1 = createDoc({ id: 'doc-1' });
      const doc2 = createDoc({ id: 'doc-2' });

      const layers = computeLayers([doc1, doc2], 'doc-1');

      expect(layers.get('doc-1')).toBe('focus');
      expect(layers.get('doc-2')).toBe('distant');
    });

    it('handles null focus by assigning all to context', () => {
      const doc1 = createDoc({ id: 'doc-1' });
      const doc2 = createDoc({ id: 'doc-2' });

      const layers = computeLayers([doc1, doc2], null);

      expect(layers.get('doc-1')).toBe('context');
      expect(layers.get('doc-2')).toBe('context');
    });
  });

  describe('computePositions', () => {
    it('positions focus at center', () => {
      const doc = createDoc({ id: 'doc-1' });
      const positions = computePositions([doc], 'doc-1', 800, 600);

      expect(positions.get('doc-1')).toEqual({ x: 400, y: 300 });
    });

    it('positions toolkit parents above-left', () => {
      const toolkit = createDoc({ id: 'fw-1', type: 'framework', framework_kind: 'toolkit' });
      const instance = createDoc({ id: 'inst-1', type: 'instance', framework_ids: ['fw-1'] });

      const positions = computePositions([toolkit, instance], 'inst-1', 800, 600);

      const toolkitPos = positions.get('fw-1')!;
      const instancePos = positions.get('inst-1')!;

      expect(toolkitPos.x).toBeLessThan(instancePos.x); // Left of center
      expect(toolkitPos.y).toBeLessThan(instancePos.y); // Above center
    });

    it('positions domain parents above-right', () => {
      const domain = createDoc({ id: 'fw-1', type: 'framework', framework_kind: 'domain' });
      const instance = createDoc({ id: 'inst-1', type: 'instance', framework_ids: ['fw-1'] });

      const positions = computePositions([domain, instance], 'inst-1', 800, 600);

      const domainPos = positions.get('fw-1')!;
      const instancePos = positions.get('inst-1')!;

      expect(domainPos.x).toBeGreaterThan(instancePos.x); // Right of center
      expect(domainPos.y).toBeLessThan(instancePos.y); // Above center
    });

    it('positions children below', () => {
      const framework = createDoc({ id: 'fw-1', type: 'framework' });
      const instance = createDoc({ id: 'inst-1', type: 'instance', framework_ids: ['fw-1'] });

      const positions = computePositions([framework, instance], 'fw-1', 800, 600);

      const frameworkPos = positions.get('fw-1')!;
      const instancePos = positions.get('inst-1')!;

      expect(instancePos.y).toBeGreaterThan(frameworkPos.y); // Below center
    });

    it('arranges documents in circle when no focus', () => {
      const docs = [createDoc({ id: 'd1' }), createDoc({ id: 'd2' }), createDoc({ id: 'd3' })];

      const positions = computePositions(docs, null, 800, 600);

      // All should have positions
      expect(positions.size).toBe(3);
      // All should be roughly equidistant from center
      const centerX = 400;
      const centerY = 300;
      const distances = docs.map((d) => {
        const pos = positions.get(d.id)!;
        return Math.sqrt((pos.x - centerX) ** 2 + (pos.y - centerY) ** 2);
      });
      // All distances should be similar
      expect(Math.max(...distances) - Math.min(...distances)).toBeLessThan(1);
    });
  });

  describe('computeGraph', () => {
    it('returns nodes with positions and layers', () => {
      const fw = createDoc({ id: 'fw-1', type: 'framework' });
      const inst = createDoc({ id: 'inst-1', type: 'instance', framework_ids: ['fw-1'] });

      const { nodes, edges } = computeGraph([fw, inst], 'inst-1', 800, 600);

      expect(nodes).toHaveLength(2);
      expect(edges).toHaveLength(1);

      const focusNode = nodes.find((n) => n.doc.id === 'inst-1');
      expect(focusNode?.layer).toBe('focus');
      expect(focusNode?.x).toBe(400);
      expect(focusNode?.y).toBe(300);

      const parentNode = nodes.find((n) => n.doc.id === 'fw-1');
      expect(parentNode?.layer).toBe('context');
    });
  });

  describe('getRelatedDocs', () => {
    it('returns parents from framework_ids', () => {
      const fw1 = createDoc({ id: 'fw-1', type: 'framework' });
      const fw2 = createDoc({ id: 'fw-2', type: 'framework' });
      const inst = createDoc({ type: 'instance', framework_ids: ['fw-1', 'fw-2'] });

      const related = getRelatedDocs([fw1, fw2, inst], inst.id);

      expect(related.parents).toHaveLength(2);
      expect(related.parents.map((p) => p.id)).toContain('fw-1');
      expect(related.parents.map((p) => p.id)).toContain('fw-2');
    });

    it('returns children that reference focused doc', () => {
      const fw = createDoc({ id: 'fw-1', type: 'framework' });
      const inst1 = createDoc({ type: 'instance', framework_ids: ['fw-1'] });
      const inst2 = createDoc({ type: 'instance', framework_ids: ['fw-1'] });

      const related = getRelatedDocs([fw, inst1, inst2], 'fw-1');

      expect(related.children).toHaveLength(2);
    });

    it('returns siblings with same perspective', () => {
      const doc1 = createDoc({ id: 'doc-1', perspective: 'economic genealogy' });
      const doc2 = createDoc({ id: 'doc-2', perspective: 'economic genealogy' });
      const doc3 = createDoc({ id: 'doc-3', perspective: 'other' });

      const related = getRelatedDocs([doc1, doc2, doc3], 'doc-1');

      expect(related.siblings).toHaveLength(1);
      expect(related.siblings[0].id).toBe('doc-2');
    });

    it('returns siblings with same output', () => {
      const doc1 = createDoc({ id: 'doc-1', output: 'etymon' });
      const doc2 = createDoc({ id: 'doc-2', output: 'etymon' });

      const related = getRelatedDocs([doc1, doc2], 'doc-1');

      expect(related.siblings).toHaveLength(1);
      expect(related.siblings[0].id).toBe('doc-2');
    });

    it('returns empty arrays for non-existent focus', () => {
      const doc = createDoc();
      const related = getRelatedDocs([doc], 'non-existent');

      expect(related.parents).toEqual([]);
      expect(related.children).toEqual([]);
      expect(related.siblings).toEqual([]);
    });
  });
});
