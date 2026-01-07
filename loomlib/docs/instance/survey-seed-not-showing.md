---
id: inst-survey-seed-not-showing
title: "Survey: Why Synced Documents Don't Appear"
type: instance
framework_kind: null
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [survey, seed, sync, indexeddb, bug-analysis]
---

# Survey: Why Synced Documents Don't Appear

**Date:** 2026-01-07
**Subject:** Why documents added via /loomlib:sync don't appear in the app
**Method:** Survey Method (static analysis)

---

## Survey

Relevant files:
- `loomlib/src/data/seed.ts` — Seed and update logic
- `loomlib/src/data/seed-data.ts` — Document definitions (just updated with 3 new docs)
- `loomlib/src/data/db.ts` — IndexedDB CRUD operations
- `loomlib/src/main.ts` — Application bootstrap

---

## Core Sample

### Entry Points

**Bootstrap sequence (main.ts:31-42):**
```
init() →
  1. loadTheme()
  2. seedIfEmpty()           ← ONLY seeds if DB is empty
  3. updateManagedFrameworks() ← ONLY updates 8 hardcoded framework IDs
```

### Data Flow

```
seed-data.ts (30 documents including 3 new)
      ↓
seedIfEmpty() ← BLOCKED: DB has existing docs
      ↓
updateManagedFrameworks() ← BLOCKED: only looks at 8 specific IDs
      ↓
IndexedDB (still has old 27 documents, never gets 3 new ones)
```

### Key Abstractions

**The problem is in seed.ts lines 6-17 and 19-24:**

```typescript
// Only these 8 IDs get auto-updated
const MANAGED_FRAMEWORK_IDS = [
  'fw-etymon-method',
  'fw-invariants-variants',
  'fw-diagnostic-frames',
  'fw-reading-10k',
  'fw-oikonomia-chrematistics',
  'fw-four-knowings',
  'fw-agonal-identity',
  'fw-context-weaving',
];

// seedIfEmpty() only runs when DB is empty
export async function seedIfEmpty(): Promise<boolean> {
  const existing = await getAllDocs();
  if (existing.length > 0) {  // ← BLOCKS because DB already has docs
    console.log(`Database has ${existing.length} documents, skipping seed.`);
    return false;
  }
  // ... never reaches seeding code
}
```

---

## Stratigraphy

### Call Hierarchy

```
main.ts:init()
  │
  ├── seedIfEmpty()
  │     └── getAllDocs() returns 27 docs
  │     └── if (27 > 0) → return false  ← STOPS HERE
  │     └── (seed loop never runs)
  │
  └── updateManagedFrameworks()
        └── for id in MANAGED_FRAMEWORK_IDS (8 IDs only)
        │     └── 'fw-survey-method' NOT in list → skipped
        │     └── 'inst-survey-*' NOT in list → skipped
        └── (only checks 8 predefined frameworks)
```

### State Location

| State | Location | Problem |
|-------|----------|---------|
| New docs in seed-data.ts | TypeScript file | ✓ Present |
| Existing docs in IndexedDB | Browser storage | 27 docs, never cleared |
| MANAGED_FRAMEWORK_IDS | Hardcoded array | Only 8 frameworks, no instances |

### Boundary Conditions

**Two gates block new documents:**

1. **seedIfEmpty() gate:** Only seeds if `getAllDocs().length === 0`. Since the DB already has documents from a previous seed, this never runs.

2. **MANAGED_FRAMEWORK_IDS gate:** Only 8 specific framework IDs are "managed" (auto-updated). The new documents we added are:
   - `fw-survey-method` — NOT in the list
   - `inst-survey-loomlib-startup` — NOT in the list (instances never managed)
   - `inst-survey-data-sync-gap` — NOT in the list (instances never managed)

---

## Findings

**The sync worked correctly — seed-data.ts has the new documents.** The problem is the app's seeding logic:

1. `seedIfEmpty()` only runs when IndexedDB is completely empty. If you've ever loaded the app before, it already has documents, so this function returns early without adding new ones.

2. `updateManagedFrameworks()` only updates 8 hardcoded framework IDs. It was designed to keep core frameworks in sync with seed-data.ts, but:
   - `fw-survey-method` is not in the list
   - Instance documents are never managed (the list only has `fw-*` IDs)

**To see the new documents, the user must clear their IndexedDB** — either through browser DevTools or by calling `_resetDB()`. On the next page load, `seedIfEmpty()` will run and insert all documents including the new ones.

### Key Files

| File | Role |
|------|------|
| `src/data/seed.ts:6-17` | **MANAGED_FRAMEWORK_IDS** — hardcoded list of 8 frameworks |
| `src/data/seed.ts:19-24` | **seedIfEmpty()** — only seeds empty DB |
| `src/data/seed.ts:42-79` | **updateManagedFrameworks()** — only updates listed IDs |

### Dependencies

- **Internal:** seed.ts depends on seed-data.ts for content, db.ts for storage
- **External:** Browser IndexedDB API

### Complexity Hotspots

- **MANAGED_FRAMEWORK_IDS is manually maintained** — every new framework requires editing this list
- **No mechanism for adding new documents to non-empty DB** — sync adds to seed-data.ts but the app ignores it
- **Instance documents are never auto-updated** — they fall outside the managed framework pattern

---

## Open Questions

1. **What should the sync behavior be?**
   - Option A: Add missing documents (compare seed-data IDs to IndexedDB IDs)
   - Option B: Update all documents like managed frameworks do (compare content)
   - Option C: Full sync (add missing, update changed, optionally remove orphaned)

2. **Should all documents be "managed" or just frameworks?**
   - Currently: only 8 frameworks
   - Alternative: all documents in seed-data.ts

3. **What about user-created documents?**
   - If sync updates all seed-data docs, user edits to those docs would be overwritten
   - Need to distinguish "seed documents" from "user documents"?

4. **Immediate workaround:**
   - Clear IndexedDB in browser DevTools → Application → IndexedDB → loomlib → Delete
   - Refresh page → seedIfEmpty() runs → all 30 docs appear

---

## Root Cause Summary

```
seed-data.ts has 30 documents (including 3 new)
                ↓
          seedIfEmpty()
                ↓
     DB has 27 docs? → YES → return (skip seeding)
                ↓
     updateManagedFrameworks()
                ↓
     Is 'fw-survey-method' in MANAGED_FRAMEWORK_IDS? → NO → skip
     Is 'inst-survey-*' in MANAGED_FRAMEWORK_IDS? → NO → skip
                ↓
     IndexedDB still has only 27 documents
```

**Fix options:**
1. Add `fw-survey-method` to MANAGED_FRAMEWORK_IDS (doesn't help instances)
2. Create `seedMissingDocuments()` function that adds docs not yet in IndexedDB
3. Make all seed-data docs "managed" (update on every load if changed)

---

## Resolution (2026-01-07)

**Fix option #3 was implemented.**

The old `seedIfEmpty()` + `updateManagedFrameworks()` pattern was replaced with a single `syncSeedData()` function in `loomlib/src/data/seed.ts`:

```typescript
export async function syncSeedData(): Promise<{ added: number; updated: number }> {
  // For each doc in seedData:
  // - If not in IndexedDB: add it
  // - If content differs: update it
  // - User-created docs (not in seedData): untouched
}
```

**Result:** After running `/loomlib:sync`, a browser refresh immediately shows new documents. No need to clear IndexedDB.

The `MANAGED_FRAMEWORK_IDS` array was deleted — all seed-data documents are now managed.
