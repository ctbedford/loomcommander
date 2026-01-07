import type { Document, DocumentType, DocumentStatus } from '../types.ts';
import { createEmptyDocument, deriveTitle } from '../types.ts';
import { getDoc, putDoc, deleteDoc, getAllDocs, getDocsByType, getDocsByFrameworkId } from './db.ts';

// Re-export db functions for convenience
export { getDoc as loadDocument, getAllDocs as listDocuments, getDocsByType, getDocsByFrameworkId };

// Create a new document
export async function createDocument(
  type: DocumentType = 'note',
  overrides: Partial<Document> = {}
): Promise<Document> {
  const doc = createEmptyDocument(type);
  Object.assign(doc, overrides);

  // Derive title from content if not provided
  if (!doc.title && doc.content) {
    doc.title = deriveTitle(doc.content);
  }

  await putDoc(doc);
  return doc;
}

// Save document content (updates modifiedAt)
export async function saveDocument(id: string, content: string): Promise<void> {
  const doc = await getDoc(id);
  if (!doc) {
    throw new Error(`Document not found: ${id}`);
  }

  // Update title if it was derived or empty
  const newTitle = doc.title || deriveTitle(content);

  await putDoc({
    ...doc,
    content,
    title: newTitle,
    modifiedAt: Date.now(),
  });
}

// Update document metadata (for triage)
export async function updateDocumentMetadata(
  id: string,
  metadata: Partial<Omit<Document, 'id' | 'createdAt' | 'modifiedAt'>>
): Promise<Document> {
  const doc = await getDoc(id);
  if (!doc) {
    throw new Error(`Document not found: ${id}`);
  }

  const updated: Document = {
    ...doc,
    ...metadata,
    modifiedAt: Date.now(),
  };

  await putDoc(updated);
  return updated;
}

// Delete document with orphan check
export interface DeleteResult {
  success: boolean;
  error?: string;
  childCount?: number;
}

export async function deleteDocument(id: string): Promise<DeleteResult> {
  const doc = await getDoc(id);
  if (!doc) {
    return { success: false, error: 'Document not found' };
  }

  // Check for children if this is a framework
  if (doc.type === 'framework') {
    const children = await getDocsByFrameworkId(id);
    if (children.length > 0) {
      return {
        success: false,
        error: `${children.length} instance(s) use this framework. Re-triage them first.`,
        childCount: children.length,
      };
    }
  }

  await deleteDoc(id);
  return { success: true };
}

// Get all frameworks (for triage modal picker)
export async function getFrameworks(): Promise<Document[]> {
  return getDocsByType('framework');
}

// Get all sources (for note triage)
export async function getSources(): Promise<Document[]> {
  return getDocsByType('source');
}

// Get unique perspectives (for autocomplete)
export async function getUniquePerspectives(): Promise<string[]> {
  const docs = await getAllDocs();
  const perspectives = new Set<string>();
  for (const doc of docs) {
    if (doc.perspective) {
      perspectives.add(doc.perspective);
    }
  }
  return Array.from(perspectives).sort();
}

// Get unique outputs (for autocomplete)
export async function getUniqueOutputs(): Promise<string[]> {
  const docs = await getAllDocs();
  const outputs = new Set<string>();
  for (const doc of docs) {
    if (doc.output) {
      outputs.add(doc.output);
    }
  }
  return Array.from(outputs).sort();
}

// Get unique tags (for autocomplete)
export async function getUniqueTags(): Promise<string[]> {
  const docs = await getAllDocs();
  const tags = new Set<string>();
  for (const doc of docs) {
    for (const tag of doc.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

// Filter documents by multiple criteria
export interface FilterCriteria {
  types?: DocumentType[];
  statuses?: DocumentStatus[];
  output?: string;
  perspective?: string;
  tag?: string;
  query?: string; // Fuzzy match on title/content
}

export async function filterDocuments(criteria: FilterCriteria): Promise<Document[]> {
  let docs = await getAllDocs();

  if (criteria.types?.length) {
    docs = docs.filter((d) => criteria.types!.includes(d.type));
  }

  if (criteria.statuses?.length) {
    docs = docs.filter((d) => criteria.statuses!.includes(d.status));
  }

  if (criteria.output) {
    docs = docs.filter((d) => d.output === criteria.output);
  }

  if (criteria.perspective) {
    docs = docs.filter((d) => d.perspective === criteria.perspective);
  }

  if (criteria.tag) {
    docs = docs.filter((d) => d.tags.includes(criteria.tag!));
  }

  if (criteria.query) {
    const q = criteria.query.toLowerCase();
    docs = docs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return docs;
}
