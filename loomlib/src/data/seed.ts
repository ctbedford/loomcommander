// Browser-compatible seed function
import { seedData } from './seed-data.ts';
import { putDoc, getDoc } from './db.ts';

/**
 * Sync all seed-data documents to IndexedDB.
 * - Adds documents that don't exist
 * - Updates documents whose content has changed
 * - Leaves user-created documents (not in seed-data) untouched
 */
export async function syncSeedData(): Promise<{ added: number; updated: number }> {
  const now = Date.now();
  let added = 0;
  let updated = 0;

  for (const seedDoc of seedData) {
    const existing = await getDoc(seedDoc.id);

    if (!existing) {
      // New document - add it
      await putDoc({
        ...seedDoc,
        createdAt: now,
        modifiedAt: now,
      });
      added++;
      console.log(`Added: ${seedDoc.title}`);
    } else if (existing.content !== seedDoc.content) {
      // Content changed - update it
      await putDoc({
        ...existing,
        ...seedDoc,
        createdAt: existing.createdAt, // preserve original creation time
        modifiedAt: now,
      });
      updated++;
      console.log(`Updated: ${seedDoc.title}`);
    }
  }

  if (added > 0 || updated > 0) {
    console.log(`Sync complete: ${added} added, ${updated} updated`);
  }
  return { added, updated };
}
