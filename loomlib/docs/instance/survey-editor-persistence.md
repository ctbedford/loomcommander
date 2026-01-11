---
id: inst-survey-editor-persistence
title: "Survey: Editor Persistence Bug"
type: instance
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [survey, editor, persistence, indexeddb, bug]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-survey-method
    relation: method
downstream: []
---

# Survey: Editor Persistence Bug

**Date:** 2026-01-07
**Subject:** Why editor changes don't survive browser refresh
**Method:** Survey Method (static analysis)

---

## Survey

Relevant files:
- `loomlib/src/views/editor.ts` — Editor UI, debounced save logic
- `loomlib/src/data/documents.ts` — Document CRUD operations
- `loomlib/src/data/db.ts` — IndexedDB wrapper
- `loomlib/src/data/seed.ts` — Seed data sync on startup
- `loomlib/src/data/seed-data.ts` — Authoritative document definitions (auto-generated)
- `loomlib/src/main.ts` — App initialization, calls `syncSeedData()`

---

## Core Sample

### Entry Points
- **App load:** `main.ts:init()` → `syncSeedData()` → `Shell.init()`
- **Editor save:** `Editor.handleInput()` → debounce → `Editor.save()` → `saveDocument()` → `putDoc()`
- **Document load:** `Editor.load()` → `loadDocument()` → `getDoc()`

### Data Flow
```
User types → handleInput() → 500ms debounce → save() → saveDocument() → putDoc(IndexedDB)
                    ↓
           Shows "Saved" status
```

### Key Abstractions
- **Debounced autosave:** 500ms delay after input before IndexedDB write
- **`putDoc()`:** Upserts document to IndexedDB by `id` keyPath
- **`syncSeedData()`:** Compares seed-data against IndexedDB on every app load

---

## Stratigraphy

### Call Hierarchy (App Startup)
```
init()
  ├── syncSeedData()           ← RUNS FIRST, BEFORE SHELL
  │     └── for each seedDoc:
  │           ├── getDoc(id)
  │           └── if content differs → putDoc({...existing, ...seedDoc, modifiedAt: now})
  └── Shell.init()
        └── ListView.refresh()
              └── getAllDocs()
```

### State Location
- **IndexedDB:** `loomlib` database, `documents` object store
- **seed-data.ts:** Compile-time document definitions (authoritative source)
- **Editor state:** `this.currentDoc`, `this.isDirty`, `this.textarea.value`

### Boundary Conditions
- `syncSeedData()` checks: `existing.content !== seedDoc.content`
- If content differs, the **seed-data wins** — it overwrites the IndexedDB document

---

## Findings

**Root Cause:** The `syncSeedData()` function runs on every page load and compares each seed document's content against what's stored in IndexedDB. When it finds a difference, it **overwrites the IndexedDB document with the seed-data version**, preserving only `createdAt`. User edits are treated as "drift from authoritative source" and are silently reverted.

This is **working as designed** for managed frameworks (which should be controlled via markdown files and the sync workflow), but creates unexpected behavior:
1. User edits content in browser
2. Editor saves to IndexedDB (works correctly)
3. User refreshes browser
4. `syncSeedData()` detects content mismatch
5. Seed-data overwrites the IndexedDB version
6. User's changes are lost

### Key Files

| File | Role |
|------|------|
| `seed.ts:28-38` | Overwrites documents when `existing.content !== seedDoc.content` |
| `seed-data.ts` | Auto-generated, defines authoritative content for managed documents |
| `editor.ts:243-256` | Save function (works correctly, writes to IndexedDB) |
| `main.ts:40` | Calls `syncSeedData()` before any UI interaction |

### Dependencies
- Internal: `db.ts` (IndexedDB operations)
- External: Browser IndexedDB API

### Complexity Hotspots
- **Managed vs. user documents:** No distinction in data model between documents that should be sync'd and documents that are user-owned
- **Sync timing:** Happens synchronously at app load, before user can interact

---

## Open Questions

- **Intentional design?** Should managed documents (frameworks, core instances) always reflect seed-data, preventing browser-based editing?
- **User documents:** Where should user-created documents live if seed-data overwrites everything with matching IDs?
- **Edit workflow:** Is the intended flow: edit markdown → run `/loomlib:sync` → refresh app? If so, browser editing is read-only for seeded documents.
- **ID collision:** What happens if a user creates a document with an ID that later appears in seed-data?

---

## Diagnosis

The editor **is** saving correctly. The persistence layer works. The issue is the **sync-on-load design pattern** that treats `seed-data.ts` as the authoritative source for all documents with matching IDs.

**This is not a bug — it's a design decision.** The question is whether it matches user expectations for browser-based editing.
