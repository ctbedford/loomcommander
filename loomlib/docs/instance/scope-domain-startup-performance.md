---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-scope-domain-startup-performance
title: "Scope: Domain Startup, Discovery, and Performance"
type: instance
framework_kind: null
framework_ids:
  - fw-scope-method
  - fw-loomlib-domains
source_id: null
output: loomcommander
perspective: null
status: draft
tags:
  - scope
  - domains
  - performance
  - architecture
  - startup
  - indexeddb

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: inst-scope-frontmatter-ui-mapping
    relation: prior
  - doc: fw-loomlib-domains
    relation: method
downstream: []
---

# Scope: Domain Startup, Discovery, and Performance

**Date:** 2025-01-11
**Intent:** Derive requirements for how loomlib identifies domain membership at startup, and address performance issues with the current 144+ document corpus.

---

## The Problem

The previous scope (`inst-scope-frontmatter-ui-mapping`) established that domains are **configurations** that control UI display. But two critical questions remain:

1. **How does loomlib know which documents belong to which domain at startup?**
2. **How do we handle the existing 144+ "Etymon" documents without breaking or slowing down?**

The screenshots show 144 documents. Users report speed issues. The current architecture loads everything into memory on startup.

---

## I. Current Architecture Analysis

### Startup Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CURRENT STARTUP                                    │
│                                                                             │
│   init() → syncSeedData() → getAllDocs() → ensureEmbeddings() → shell.init()│
│              │                   │                │                         │
│              ▼                   ▼                ▼                         │
│         Fetch ALL docs     Load ALL docs    Embed ALL docs                 │
│         from /api/docs     to memory        (if missing)                   │
│         (144+ network)     (144+ records)   (144+ API calls)               │
│                                                                             │
│   Time: ~2-5 seconds on first load; ~1-2 seconds on refresh                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Storage Structure

```
IndexedDB: 'loomlib' (version 3)
├── documents          ← All documents (144+)
│   ├── index: modifiedAt
│   ├── index: type
│   ├── index: status
│   └── index: output   ← USEFUL: could serve as domain marker
├── embeddings         ← Vector embeddings per doc
└── umap_coords        ← 2D projections per doc
```

### Performance Bottlenecks

| Function | What It Does | Cost |
|----------|--------------|------|
| `getAllDocs()` | Cursor iteration through all docs | O(n) every call |
| `syncSeedData()` | Fetches + compares all docs | O(n) network + O(n) memory |
| `ensureEmbeddings()` | Checks all docs for missing embeddings | O(n) iteration |
| `getDocsByFrameworkId()` | Loads ALL docs, filters in JS | O(n) for each call |
| `getUniqueTags()` | Loads ALL docs, extracts tags | O(n) iteration |
| `getUniquePerspectives()` | Loads ALL docs, extracts perspectives | O(n) iteration |
| `filterDocuments()` | Loads ALL docs, filters in JS | O(n) for every filter |

**Key insight:** Every view, filter, and query loads the entire corpus. With 144 docs now and growing, this doesn't scale.

### Document Interface (Current)

```typescript
interface Document {
  id: string;
  title: string;
  content: string;
  type: DocumentType;
  framework_kind: FrameworkKind | null;
  perspective: string | null;
  framework_ids: string[];
  source_id: string | null;
  output: string | null;          // ← Currently 'etymon' or 'loomcommander'
  status: DocumentStatus;
  tags: string[];
  // ... timestamps, conducting fields
}
```

**Opportunity:** The `output` field already exists and is indexed. It currently holds 'etymon' or 'loomcommander'. This could serve as domain identifier.

---

## II. Domain Identification Options

### Option A: Repurpose `output` Field

**Approach:** Rename semantically from "output channel" to "domain". Use existing index.

```typescript
// Current: output = 'etymon' | 'loomcommander' | null
// New: domain = 'etymon' | 'studio' | 'institutional' | null

// Backward compatible: treat output as domain for existing docs
const domain = doc.output ?? 'etymon';  // null → etymon (legacy)
```

**Pros:**
- No schema change
- Index already exists (`output` index)
- Existing docs already have values
- Backward compatible

**Cons:**
- Semantic confusion (output ≠ domain conceptually)
- Existing 'loomcommander' output docs would need remapping
- Mixes two concepts

### Option B: Add Explicit `domain` Field

**Approach:** Add new field, migrate existing docs.

```typescript
interface Document {
  // ... existing fields
  domain: string;  // 'etymon' | 'studio' | 'institutional' | etc.
}
```

**Migration:**
```typescript
// On startup, backfill missing domain
if (!doc.domain) {
  doc.domain = 'etymon';  // All existing docs are Etymon domain
}
```

**Pros:**
- Clear semantics
- Separate from output channel
- Clean going forward

**Cons:**
- Requires IndexedDB schema upgrade (version 4)
- Requires migration logic
- Slight startup cost for migration check

### Option C: File Path Convention

**Approach:** Store domains in separate directories.

```
loomlib/docs/
├── etymon/
│   ├── framework/
│   ├── instance/
│   └── ...
├── studio/
│   ├── framework/
│   └── ...
└── institutional/
    └── ...
```

**Pros:**
- Physical separation
- No DB changes
- Clear organization

**Cons:**
- Breaking change for existing docs
- Requires moving 144+ files
- Cross-domain references harder
- API routing more complex

### Option D: Separate IndexedDB Per Domain

**Approach:** Each domain gets its own database.

```
IndexedDB: 'loomlib-etymon'     ← 144 docs
IndexedDB: 'loomlib-studio'    ← new docs
IndexedDB: 'loomlib-inst'      ← new docs
```

**Pros:**
- Complete isolation
- No query across domains
- Each domain lightweight

**Cons:**
- Can't query across domains
- Cross-domain references broken
- Complex multi-DB management
- Doesn't solve within-domain performance

### Recommendation: Option B (Add `domain` Field)

**Rationale:**
1. Clear semantics (domain means domain)
2. Keeps `output` for actual output channel
3. Migration is one-time, low cost
4. Can add index for fast domain queries
5. Existing docs get `domain: 'etymon'` automatically

---

## III. Performance Solutions

### Problem: Everything Loads Everything

The core issue: functions like `filterDocuments()`, `getUniqueTags()`, etc. call `getAllDocs()` and filter in JavaScript. This is O(n) for every operation.

### Solution 1: Domain-Scoped Queries

```typescript
// Current
export async function getAllDocs(): Promise<Document[]> {
  // Returns ALL documents regardless of domain
}

// New
export async function getDocsByDomain(domain: string): Promise<Document[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('domain');  // New index
    const request = index.getAll(domain);
    // ...
  });
}

// App startup loads only current domain
const DOMAIN = import.meta.env.VITE_LOOMLIB_DOMAIN ?? 'etymon';
const docs = await getDocsByDomain(DOMAIN);
```

**Impact:** If Etymon has 144 docs and Studio has 20, Studio only loads 20.

### Solution 2: Lazy Loading with Pagination

```typescript
// Current: Load all, display all
const docs = await getAllDocs();
renderCards(docs);  // 144 cards

// New: Load page, display page
interface PaginatedResult {
  docs: Document[];
  cursor: IDBValidKey | null;
  hasMore: boolean;
}

async function getDocsPage(
  domain: string,
  pageSize: number = 50,
  cursor?: IDBValidKey
): Promise<PaginatedResult> {
  // Uses IndexedDB cursor with limit
}

// Deck view loads 50 at a time
const page1 = await getDocsPage('etymon', 50);
renderCards(page1.docs);
// On scroll, load more
const page2 = await getDocsPage('etymon', 50, page1.cursor);
```

**Impact:** Initial render is O(pageSize), not O(n).

### Solution 3: Cached Aggregates

```typescript
// Current: Compute every time
export async function getUniqueTags(): Promise<string[]> {
  const docs = await getAllDocs();  // Load 144 docs
  const tags = new Set<string>();
  for (const doc of docs) {
    for (const tag of doc.tags) tags.add(tag);
  }
  return Array.from(tags).sort();
}

// New: Cache and invalidate
let tagCache: { domain: string; tags: string[] } | null = null;

export async function getUniqueTags(domain: string): Promise<string[]> {
  if (tagCache?.domain === domain) {
    return tagCache.tags;
  }

  const docs = await getDocsByDomain(domain);
  const tags = new Set<string>();
  for (const doc of docs) {
    for (const tag of doc.tags) tags.add(tag);
  }

  tagCache = { domain, tags: Array.from(tags).sort() };
  return tagCache.tags;
}

// Invalidate on document save
export async function saveDocument(id: string, content: string): Promise<void> {
  // ... save logic
  tagCache = null;  // Invalidate
}
```

**Impact:** Tag/perspective/output lists computed once per session, not per render.

### Solution 4: Background Embedding with Progress

```typescript
// Current: Block startup until embeddings checked
await ensureEmbeddings();  // Blocks for all missing

// New: Non-blocking with progress
function startEmbeddingWorker(domain: string): void {
  // Runs in background, emits progress events
  const worker = new EmbeddingWorker(domain);
  worker.on('progress', (done, total) => {
    updateEmbeddingStatus(done, total);
  });
  worker.start();  // Non-blocking
}

// Startup doesn't wait
init().then(() => {
  startEmbeddingWorker(currentDomain);  // Fire and forget
});
```

**Impact:** App is interactive immediately, embeddings populate in background.

### Solution 5: Incremental Sync

```typescript
// Current: Sync all docs on startup
await syncSeedData();  // Fetches all 144 from API

// New: Sync only changed since last sync
interface SyncState {
  domain: string;
  lastSyncAt: number;
  docHashes: Map<string, string>;  // id → content hash
}

async function incrementalSync(domain: string): Promise<void> {
  const state = await getSyncState(domain);
  const apiDocs = await fetchDocsFromApi(domain);

  for (const apiDoc of apiDocs) {
    const hash = hashContent(apiDoc.content);
    if (state.docHashes.get(apiDoc.id) !== hash) {
      await putDoc(apiDoc);
      state.docHashes.set(apiDoc.id, hash);
    }
  }

  await saveSyncState(state);
}
```

**Impact:** After first load, sync only transfers changed docs.

---

## IV. Migration Strategy for Existing Documents

### The Challenge

- 144 documents exist with `output: 'etymon' | 'loomcommander' | null`
- No `domain` field exists
- Can't break existing functionality
- Users shouldn't notice the migration

### Migration Plan

#### Phase 1: Schema Upgrade (One-Time)

```typescript
// db.ts upgrade handler
request.onupgradeneeded = (event) => {
  const db = (event.target as IDBOpenDBRequest).result;

  // Version 4: Add domain index
  if (event.oldVersion < 4) {
    const store = tx.objectStore(STORE_NAME);
    store.createIndex('domain', 'domain', { unique: false });
  }
};
```

#### Phase 2: Backfill on Read

```typescript
// When loading documents, ensure domain field exists
async function normalizeDoc(doc: Document): Document {
  if (!doc.domain) {
    // Legacy doc - assign domain based on output or default
    doc.domain = doc.output ?? 'etymon';
    // Optionally persist the fix
    await putDoc(doc);
  }
  return doc;
}
```

#### Phase 3: Seed Data Update

```yaml
# Existing docs get explicit domain in frontmatter
# (can be done by claude code command)
id: fw-etymon-method
title: "Etymon Method"
domain: etymon        # ← Add explicitly
output: etymon        # ← Keep for output channel
```

#### Phase 4: Views Read Domain

```typescript
// Shell startup
const DOMAIN = import.meta.env.VITE_LOOMLIB_DOMAIN ?? 'etymon';
const docs = await getDocsByDomain(DOMAIN);
// Only Etymon docs shown when running Etymon domain
```

### Rollout Safety

1. **No breaking changes** — Old docs without `domain` field still work
2. **Automatic backfill** — Missing domain → 'etymon'
3. **Gradual migration** — Can update frontmatter over time
4. **Env-controlled** — `VITE_LOOMLIB_DOMAIN` switches domains

---

## V. Target Architecture

### Startup Flow (Improved)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          IMPROVED STARTUP                                   │
│                                                                             │
│   init() → loadDomainConfig(domain)                                        │
│              │                                                              │
│              ▼                                                              │
│         Read domain config (what fields, values, views)                    │
│              │                                                              │
│              ▼                                                              │
│         incrementalSync(domain) ← Only sync changed docs for domain        │
│              │                                                              │
│              ▼                                                              │
│         getDocsPage(domain, 50) ← Load first page only                     │
│              │                                                              │
│              ▼                                                              │
│         shell.init(config) ← Configure views from domain config            │
│              │                                                              │
│              ▼                                                              │
│         startEmbeddingWorker(domain) ← Background, non-blocking            │
│                                                                             │
│   Time: ~200-500ms (regardless of total corpus size)                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Query Pattern (Improved)

```typescript
// Every query is domain-scoped
const docs = await getDocsByDomain(currentDomain);
const tags = await getUniqueTags(currentDomain);
const frameworks = await getFrameworks(currentDomain);

// Cross-domain queries are explicit and rare
const allDocs = await getAllDocsAllDomains();  // Named to warn
```

### IndexedDB Schema (Version 4)

```typescript
// documents store
{
  id: string,           // Primary key
  domain: string,       // NEW - indexed
  // ... all existing fields
}

// Indexes
- modifiedAt (existing)
- type (existing)
- status (existing)
- output (existing)
- domain (NEW)
```

---

## VI. Implementation Requirements

### 1. Add Domain Field to Types

```typescript
// types.ts
interface Document {
  // ... existing fields
  domain: string;  // 'etymon' | 'studio' | 'institutional' | etc.
}

function createEmptyDocument(type: DocumentType = 'note'): Document {
  const DOMAIN = import.meta.env.VITE_LOOMLIB_DOMAIN ?? 'etymon';
  return {
    // ... existing defaults
    domain: DOMAIN,
  };
}
```

### 2. Add Domain Index to DB

```typescript
// db.ts - upgrade to version 4
const DB_VERSION = 4;

request.onupgradeneeded = (event) => {
  // ... existing upgrade logic

  if (event.oldVersion < 4) {
    const store = tx.objectStore(STORE_NAME);
    if (!store.indexNames.contains('domain')) {
      store.createIndex('domain', 'domain', { unique: false });
    }
  }
};
```

### 3. Add Domain-Scoped Queries

```typescript
// db.ts
export async function getDocsByDomain(domain: string): Promise<Document[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('domain');
    const request = index.getAll(domain);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}
```

### 4. Update Sync to Be Domain-Aware

```typescript
// seed.ts
export async function syncSeedData(domain: string): Promise<SyncResult> {
  // Only fetch/sync docs matching domain
  const apiDocs = await fetchDocsFromApi();
  const domainDocs = apiDocs.filter(d => (d.domain ?? d.output ?? 'etymon') === domain);
  // ... sync only domain docs
}
```

### 5. Environment Variable for Domain

```bash
# .env.local
VITE_LOOMLIB_DOMAIN=etymon

# Or for Studio
VITE_LOOMLIB_DOMAIN=studio
```

### 6. Backfill Migration

```typescript
// Run once on version upgrade
async function migrateDocsToHaveDomain(): Promise<void> {
  const docs = await getAllDocs();
  for (const doc of docs) {
    if (!doc.domain) {
      doc.domain = doc.output ?? 'etymon';
      await putDoc(doc);
    }
  }
}
```

---

## VII. Composition

**What informed this scope:**
- `inst-scope-frontmatter-ui-mapping` — established domains as configuration
- `fw-loomlib-domains` — domain variant/invariant framework
- Code analysis of `db.ts`, `documents.ts`, `seed.ts`, `main.ts`, `types.ts`

**What this scope enables:**
- Clear path to multi-domain loomlib
- Performance improvements that scale
- Migration strategy for existing 144 docs
- Foundation for lazy loading and pagination

**The key insight:** The current architecture loads everything because there was only one domain (Etymon). Adding explicit domain membership + domain-scoped queries solves both the "which docs belong here" question AND the performance problem. Every query becomes O(domain_size) instead of O(total_corpus).

---

## Summary

| Question | Answer |
|----------|--------|
| **How to identify domain?** | Add explicit `domain` field to Document interface |
| **How to store?** | IndexedDB index on `domain` field |
| **How to migrate existing?** | Backfill: `domain = output ?? 'etymon'` |
| **How to query?** | `getDocsByDomain(domain)` instead of `getAllDocs()` |
| **How to switch domains?** | `VITE_LOOMLIB_DOMAIN` environment variable |
| **How to fix performance?** | Domain-scoped queries + pagination + cached aggregates |

The path forward:
1. Add `domain` field to types
2. Add `domain` index to IndexedDB (version 4)
3. Backfill existing docs with `domain: 'etymon'`
4. Refactor queries to be domain-scoped
5. Add pagination for large domains
6. Cache aggregates (tags, perspectives)
7. Background embedding

This maintains backward compatibility while enabling multi-domain operation and fixing the performance issues that come with corpus growth.
