// Document loading - uses API in dev mode, seed-data in production
import { seedData } from './seed-data.ts';
import { putDoc, getDoc, getDocsByDomain } from './db.ts';
import type { Document } from '../types.ts';
import { getCurrentDomain } from '../types.ts';

type ApiDocument = Omit<Document, 'createdAt' | 'modifiedAt'>;

/**
 * Check if we're in dev mode with API available.
 */
function isDevMode(): boolean {
  // In production builds, API is not available
  return !import.meta.env.PROD;
}

/**
 * Fetch all documents from the dev API.
 */
async function fetchDocsFromApi(): Promise<ApiDocument[]> {
  const res = await fetch('/api/docs');
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

/**
 * Get the domain for a document (from doc.domain, doc.output, or default)
 */
function getDocDomain(doc: ApiDocument | Document): string {
  return (doc as Document).domain ?? doc.output ?? 'etymon';
}

/**
 * Sync documents to IndexedDB.
 *
 * In dev mode: Fetches from /api/docs (reads markdown files directly)
 * In production: Uses seed-data.ts (pre-built at compile time)
 *
 * Logic:
 * - Only syncs documents matching the current domain
 * - New documents: add to IndexedDB
 * - Existing documents with different content: update from source
 *   (Browser edits sync to markdown, so if content differs, it means
 *    CC command updated the markdown and we should apply that change)
 * - Existing documents with same content: skip (already in sync)
 *
 * @param domain - Domain to sync (defaults to current domain from env)
 */
export async function syncSeedData(domain?: string): Promise<{ added: number; updated: number; skipped: number; source: 'api' | 'seed-data'; domain: string }> {
  const now = Date.now();
  let added = 0;
  let updated = 0;
  let skipped = 0;

  // Use provided domain or get from env
  const targetDomain = domain ?? getCurrentDomain();

  // Determine source
  const devMode = isDevMode();
  const source = devMode ? 'api' : 'seed-data';

  let allDocs: ApiDocument[];
  if (devMode) {
    console.log('[seed] Dev mode: fetching documents from API...');
    allDocs = await fetchDocsFromApi();
    console.log(`[seed] Fetched ${allDocs.length} total documents from markdown files`);
  } else {
    allDocs = seedData;
  }

  // Filter to only documents in the target domain
  const docs = allDocs.filter(doc => getDocDomain(doc) === targetDomain);
  console.log(`[seed] Filtering to domain '${targetDomain}': ${docs.length} documents`);

  // Get existing documents for comparison (domain-scoped)
  const existingDocs = await getDocsByDomain(targetDomain);
  const existingById = new Map(existingDocs.map(d => [d.id, d]));

  for (const doc of docs) {
    const existing = existingById.get(doc.id);

    if (!existing) {
      // New document - add it with domain field
      await putDoc({
        ...doc,
        domain: targetDomain,
        createdAt: now,
        modifiedAt: now,
      });
      added++;
      console.log(`[seed] Added: ${doc.title}`);
    } else if (existing.content !== doc.content) {
      // Content differs - update from source
      // (Browser edits also update markdown via API, so if content differs,
      // it means CC command updated the file)
      console.log(`[seed] Content differs for ${doc.id}:`);
      console.log(`[seed]   IndexedDB length: ${existing.content.length}`);
      console.log(`[seed]   Markdown length: ${doc.content.length}`);
      await putDoc({
        ...existing,
        ...doc,
        domain: targetDomain,
        createdAt: existing.createdAt,
        modifiedAt: now,
      });
      updated++;
      console.log(`[seed] Updated: ${doc.title}`);
    } else {
      // Already in sync
      skipped++;
    }
  }

  if (added > 0 || updated > 0) {
    console.log(`[seed] Sync complete (${source}, domain: ${targetDomain}): ${added} added, ${updated} updated, ${skipped} unchanged`);
  }

  return { added, updated, skipped, source, domain: targetDomain };
}

/**
 * Force refresh a document from markdown (dev mode only).
 * Useful when CC command updates a file and you want to see the change.
 */
export async function refreshDocFromMarkdown(docId: string): Promise<Document | null> {
  if (import.meta.env.PROD) {
    console.warn('[seed] refreshDocFromMarkdown only works in dev mode');
    return null;
  }

  try {
    const res = await fetch(`/api/docs/${encodeURIComponent(docId)}`);
    if (!res.ok) {
      console.error(`[seed] Failed to fetch ${docId}: ${res.status}`);
      return null;
    }

    const apiDoc: ApiDocument = await res.json();
    const existing = await getDoc(docId);

    const doc: Document = {
      ...apiDoc,
      createdAt: existing?.createdAt ?? Date.now(),
      modifiedAt: Date.now(),
    };

    await putDoc(doc);
    console.log(`[seed] Refreshed from markdown: ${doc.title}`);
    return doc;
  } catch (err) {
    console.error(`[seed] Failed to refresh ${docId}:`, err);
    return null;
  }
}
