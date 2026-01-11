---
id: inst-survey-data-sync-gap
title: "Survey: IndexedDB Data Sync Gap"
type: instance
framework_kind: null
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [survey, sync, indexeddb, data-flow, gap-analysis]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-survey-method
    relation: method
downstream: []
---

# Survey: IndexedDB Data Sync Gap

**Date:** 2026-01-07
**Subject:** How does IndexedDB get new data from loomlib outputs?
**Method:** Survey Method (static analysis)

---

## Survey

Relevant files:
- `loomlib/src/data/seed-data.ts` — **Authoritative document definitions** (TypeScript objects)
- `loomlib/src/data/seed.ts` — Seeds empty DB, updates managed frameworks
- `loomlib/src/data/db.ts` — IndexedDB CRUD operations
- `loomlib/scripts/seed.ts` — Legacy CLI seeder (not used by app)
- `loomlib/docs/**/*.md` — Markdown document outputs (not connected to app)

---

## Core Sample

### Entry Points

**There is no sync mechanism.** The data flow is:

```
seed-data.ts (TypeScript)
       ↓
   seedIfEmpty() + updateManagedFrameworks()
       ↓
   IndexedDB
       ↓
   Browser renders
```

Markdown files in `loomlib/docs/` are **orphaned** — they exist on disk but have no path into IndexedDB.

### Data Flow

```
Currently:
┌──────────────────┐      ┌──────────────────┐
│ seed-data.ts     │ ───► │ IndexedDB        │
│ (TypeScript)     │      │ (Browser)        │
└──────────────────┘      └──────────────────┘

NOT connected:
┌──────────────────┐      ┌──────────────────┐
│ loomlib/docs/    │ ──X──│ IndexedDB        │
│ (Markdown)       │      │ (Browser)        │
└──────────────────┘      └──────────────────┘
```

### Key Abstractions

1. **seedData array** (`seed-data.ts:6`) — Static TypeScript array of `SeedDoc` objects
2. **seedIfEmpty()** (`seed.ts:19`) — Only seeds if IndexedDB is empty
3. **updateManagedFrameworks()** (`seed.ts:42`) — Updates 8 specific framework IDs on every load
4. **MANAGED_FRAMEWORK_IDS** (`seed.ts:6-17`) — Hardcoded list of frameworks that auto-update

---

## Stratigraphy

### Call Hierarchy

```
main.ts:init()
  ├── seedIfEmpty()
  │     └── if (getAllDocs().length === 0)
  │           └── for doc in seedData: putDoc(doc)
  │
  └── updateManagedFrameworks()
        └── for id in MANAGED_FRAMEWORK_IDS
              └── if content changed: putDoc(updated)
```

### State Location

| State | Location | Update Mechanism |
|-------|----------|------------------|
| Document definitions | `seed-data.ts` | Manual TypeScript editing |
| Persisted documents | IndexedDB `loomlib.documents` | App UI or seed functions |
| Markdown outputs | `loomlib/docs/*.md` | Claude Code commands |

### Boundary Conditions

**The gap:**
- Documents created via `/loomlib:*` commands go to `loomlib/docs/`
- Documents displayed in the app come from `seed-data.ts` → IndexedDB
- **These are disconnected systems**

---

## Findings

**There is no sync command.** Loomlib currently has two completely separate data stores:

1. **seed-data.ts** — The authoritative source that populates IndexedDB. Documents here appear in the app. This file is manually maintained TypeScript.

2. **loomlib/docs/** — Where `/loomlib:*` commands write markdown files. These files are never read by the app.

The survey document we created (`survey-loomlib-startup.md`) exists at `loomlib/docs/instance/survey-loomlib-startup.md` but will **never appear in the app** because:
- The app only reads from IndexedDB
- IndexedDB only gets data from `seed-data.ts`
- `seed-data.ts` doesn't know about markdown files

The current workflow requires manual intervention:
1. `/loomlib:instance` writes to `loomlib/docs/`
2. Human manually copies content into `seed-data.ts`
3. App rebuild picks up new data
4. IndexedDB updates on next load

### Key Files

| File | Role |
|------|------|
| `src/data/seed-data.ts` | **Single source of truth** for app data |
| `src/data/seed.ts` | Populates IndexedDB from seed-data.ts |
| `loomlib/docs/` | **Orphaned** markdown outputs |

### Dependencies

- **Internal:** App depends entirely on seed-data.ts for document content
- **External:** None — no markdown parser, no file system access

### Complexity Hotspots

- **seed-data.ts is 1877 lines** and growing — all documents are manually maintained in TypeScript
- **No validation** between markdown YAML frontmatter and TypeScript types
- **Drift risk** — markdown files can diverge from seed-data.ts entries

---

## Open Questions

1. **What should sync look like?**
   - Build-time script that parses `loomlib/docs/*.md` → generates `seed-data.ts`?
   - Runtime file system access (not possible in browser)?
   - Manual but assisted (Claude Code reads markdown, generates TypeScript)?

2. **Should seed-data.ts be generated or authored?**
   - Currently: authored (human writes TypeScript)
   - Alternative: generated from markdown (single source of truth in docs/)

3. **How to handle conflicts?**
   - What if markdown and seed-data.ts diverge?
   - Which is authoritative?

4. **Browser constraints:**
   - Browser can't read local files
   - Any sync must happen at build time or via manual process

---

## Confirmed Answer

**The survey doc we made doesn't appear in the app because there is no sync mechanism.**

The workflow Claude Code instructions describe — "markdown file → manual sync → seed-data.ts → app" — is accurate. The manual sync step currently means: copy-paste content from markdown into TypeScript by hand.

A `/loomlib:sync` command doesn't exist yet. It would need to:
1. Read all markdown files in `loomlib/docs/`
2. Parse YAML frontmatter
3. Generate/update `seed-data.ts` entries
4. This is a build-time operation, not runtime

---

## Resolution (2026-01-07)

**Both problems identified in this survey have been solved:**

1. **`/loomlib:sync` now exists** — Reads markdown files from `loomlib/docs/`, parses frontmatter, and generates `seed-data.ts`.

2. **`syncSeedData()` replaces the broken seeding logic** — The old `seedIfEmpty()` + `updateManagedFrameworks()` pattern was replaced with a single `syncSeedData()` function that:
   - Adds documents from seed-data.ts that don't exist in IndexedDB
   - Updates documents whose content has changed
   - Leaves user-created documents untouched

**New workflow:**
```
/loomlib:instance → writes loomlib/docs/instance/foo.md
        ↓
/loomlib:sync → generates seed-data.ts from markdown
        ↓
Browser refresh → syncSeedData() adds/updates documents
        ↓
Document appears in app ✓
```

Markdown is now the source of truth. The gap is closed.
