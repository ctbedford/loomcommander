import type { Document, DocumentType, DocumentStatus } from '../types.ts';
import { createEmptyDocument, deriveTitle, getCurrentDomain } from '../types.ts';
import { getDoc, putDoc, deleteDoc, getAllDocs, getDocsByType, getDocsByFrameworkId, getDocsByDomain, putEmbedding, deleteEmbedding } from './db.ts';
import { getEmbedding, hasApiKey } from './embeddings.ts';

// Re-export db functions for convenience
export { getDoc as loadDocument, getAllDocs as listDocuments, getDocsByType, getDocsByFrameworkId, getDocsByDomain };

/**
 * List documents in the current domain (domain-scoped version of listDocuments)
 * @param domain - Domain to list (defaults to current domain from env)
 */
export async function listDomainDocuments(domain?: string): Promise<Document[]> {
  const targetDomain = domain ?? getCurrentDomain();
  return getDocsByDomain(targetDomain);
}

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

// Update embedding for a document (fire-and-forget)
// Exported for bulk embedding on startup
export async function updateDocEmbedding(docId: string, content: string): Promise<void> {
  if (!hasApiKey()) return;

  try {
    const embedding = await getEmbedding(content);
    if (embedding) {
      await putEmbedding(docId, embedding);
      console.debug('[updateDocEmbedding] Updated:', docId);
    }
  } catch (err) {
    console.warn('[updateDocEmbedding] Error:', err);
  }
}

// Save document to markdown via dev server API (fire-and-forget, logs errors)
async function saveToMarkdown(doc: Document): Promise<void> {
  // Only attempt in development (API endpoint only exists in dev server)
  if (import.meta.env.PROD) return;

  try {
    const res = await fetch(`/api/docs/${encodeURIComponent(doc.id)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    if (!res.ok) {
      const err = await res.json();
      console.warn('[saveToMarkdown] API error:', err);
    }
  } catch (err) {
    // API not available (e.g., production build) - silently ignore
    console.debug('[saveToMarkdown] API unavailable:', err);
  }
}

// Save document content (updates modifiedAt, syncs to markdown in dev)
export async function saveDocument(id: string, content: string): Promise<void> {
  const doc = await getDoc(id);
  if (!doc) {
    throw new Error(`Document not found: ${id}`);
  }

  // Update title if it was derived or empty
  const newTitle = doc.title || deriveTitle(content);

  const updated: Document = {
    ...doc,
    content,
    title: newTitle,
    modifiedAt: Date.now(),
  };

  // Save to IndexedDB (primary storage)
  await putDoc(updated);

  // Also save to markdown file (dev only, fire-and-forget)
  saveToMarkdown(updated);

  // Update embedding (fire-and-forget)
  updateDocEmbedding(id, content);
}

// Update document metadata (for triage, syncs to markdown in dev)
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

  // Save to IndexedDB (primary storage)
  await putDoc(updated);

  // Also save to markdown file (dev only, fire-and-forget)
  saveToMarkdown(updated);

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

  // Also delete embedding (fire-and-forget)
  deleteEmbedding(id).catch(() => {});

  return { success: true };
}

// Get all frameworks (for triage modal picker)
// @param domain - Domain to filter by (defaults to current domain)
export async function getFrameworks(domain?: string): Promise<Document[]> {
  const targetDomain = domain ?? getCurrentDomain();
  const docs = await getDocsByDomain(targetDomain);
  return docs.filter(d => d.type === 'framework');
}

// Get all sources (for note triage)
// @param domain - Domain to filter by (defaults to current domain)
export async function getSources(domain?: string): Promise<Document[]> {
  const targetDomain = domain ?? getCurrentDomain();
  const docs = await getDocsByDomain(targetDomain);
  return docs.filter(d => d.type === 'source');
}

// Get unique perspectives (for autocomplete)
// @param domain - Domain to filter by (defaults to current domain)
export async function getUniquePerspectives(domain?: string): Promise<string[]> {
  const targetDomain = domain ?? getCurrentDomain();
  const docs = await getDocsByDomain(targetDomain);
  const perspectives = new Set<string>();
  for (const doc of docs) {
    if (doc.perspective) {
      perspectives.add(doc.perspective);
    }
  }
  return Array.from(perspectives).sort();
}

// Get unique outputs (for autocomplete)
// @param domain - Domain to filter by (defaults to current domain)
export async function getUniqueOutputs(domain?: string): Promise<string[]> {
  const targetDomain = domain ?? getCurrentDomain();
  const docs = await getDocsByDomain(targetDomain);
  const outputs = new Set<string>();
  for (const doc of docs) {
    if (doc.output) {
      outputs.add(doc.output);
    }
  }
  return Array.from(outputs).sort();
}

// Get unique tags (for autocomplete)
// @param domain - Domain to filter by (defaults to current domain)
export async function getUniqueTags(domain?: string): Promise<string[]> {
  const targetDomain = domain ?? getCurrentDomain();
  const docs = await getDocsByDomain(targetDomain);
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
  domain?: string; // Domain to filter by (defaults to current domain)
}

export async function filterDocuments(criteria: FilterCriteria): Promise<Document[]> {
  // Use domain-scoped query instead of getAllDocs()
  const targetDomain = criteria.domain ?? getCurrentDomain();
  let docs = await getDocsByDomain(targetDomain);

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
