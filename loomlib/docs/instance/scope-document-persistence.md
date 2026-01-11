---
id: inst-scope-document-persistence
title: "Scope: Document Persistence"
type: instance
status: verified
framework_kind: null
perspective: null
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
tags: [scope, ux, persistence, editor, sync]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-scope-method
    relation: method
downstream: []
---

# Scope: Document Persistence

**Date:** 2026-01-08
**Subject:** How saving should work across CC commands, markdown files, seed-data, and browser editor
**Method:** Scope Method (UX analysis)

---

## Audit

### Current Data Flow

```
┌─────────────────┐     generate:seed      ┌──────────────┐
│  loomlib/docs/  │ ──────────────────────▶│ seed-data.ts │
│  (markdown)     │                        │  (generated) │
└─────────────────┘                        └──────────────┘
       ▲                                          │
       │                                          │ syncSeedData()
       │ CC commands write here                   │ on every app load
       │                                          ▼
       │                                   ┌──────────────┐
       ✗ No path back                      │  IndexedDB   │◀──┐
                                           │  (browser)   │   │
                                           └──────────────┘   │
                                                  │           │
                                                  │ load      │ save
                                                  ▼           │
                                           ┌──────────────┐   │
                                           │   Editor     │───┘
                                           │  (browser)   │
                                           └──────────────┘
```

### Current UX Flows

**Flow A: CC Command → App** (works)
1. User runs `/loomlib:instance` or similar
2. Claude writes markdown to `loomlib/docs/{type}/{slug}.md`
3. User runs `npm run generate:seed`
4. `seed-data.ts` regenerates with new document
5. App loads, `syncSeedData()` adds document to IndexedDB
6. Document appears in list/constellation

**Flow B: Browser Edit → Persist** (broken)
1. User opens document in browser editor
2. User types changes
3. Editor shows "Saved" after 500ms debounce
4. IndexedDB stores the changes
5. User refreshes browser
6. `syncSeedData()` runs, sees content differs from seed-data
7. **IndexedDB is overwritten with seed-data version**
8. User's changes are lost

### Key Interactions

| Action | Feedback | Reality |
|--------|----------|---------|
| Type in editor | "Saved" indicator | Saves to IndexedDB only |
| Refresh page | Document loads | But from seed-data, not IndexedDB |
| Cmd+S | Shows "Saved" | Cosmetic only (autosave handles real saves) |

---

## Affordances

### What the UI Promises

The editor UI promises **persistence**:
- Save status indicator ("Saving...", "Saved")
- Debounced autosave behavior
- No "export" or "download" buttons suggesting transience
- Standard text editor mental model

The UI does NOT communicate:
- That this is a read-only view of seed-data
- That changes are temporary
- That markdown is the source of truth
- Any relationship between browser and filesystem

### Mental Model Invoked

**Expected:** Google Docs / Notion — edits persist automatically, accessible anywhere
**Actual:** Code editor preview — view of source files, changes require external action

### Conventions Broken

- Autosave without persistence violates user trust
- "Saved" status is misleading when refresh loses changes
- No visible export/sync workflow in UI

---

## Expectations

### Natural User Flows

1. **Quick edit flow**: Open doc → edit → close → expect changes to persist
2. **Multi-session flow**: Edit today → come back tomorrow → expect to see my changes
3. **Triage flow**: Create note → triage to instance → edit content → persist
4. **Review flow**: Browse docs → fix typo → move on

### What Users Would Expect

- Edits saved in browser should survive refresh
- If edits require export, there should be an obvious export button
- If browser is read-only, it should be clearly labeled
- Changes should sync back to markdown (the "source of truth")

### Information Needed

- Where is my data actually stored?
- How do I get my browser edits into the markdown files?
- What's the relationship between what I see and the files on disk?

---

## Gaps

| Gap | Type | Description |
|-----|------|-------------|
| **Silent overwrite** | Blocking | User edits in browser are silently lost on refresh |
| **Misleading save status** | Blocking | "Saved" implies persistence but doesn't deliver it |
| **No export path** | Blocking | No way to get browser edits back to markdown |
| **No sync status** | Friction | User can't tell if document matches seed-data |
| **No source indicator** | Friction | No visibility into markdown ↔ IndexedDB relationship |

---

## Requirements

### Must Have (Blocking)

**Option A: Accept Browser as Read-Only**
- [ ] Remove or relabel save status — *Acceptance: No "Saved" indicator for seeded docs*
- [ ] Add "Read-only" badge for seed-data documents — *Acceptance: Visual indicator on seeded docs*
- [ ] Add "Edit in Claude Code" guidance — *Acceptance: Help text explaining workflow*

**Option B: Enable Browser → Markdown Export**
- [ ] Add "Export to Markdown" button — *Acceptance: Downloads .md file with frontmatter*
- [ ] Add "Copy to Clipboard" for content — *Acceptance: One-click copy of document*
- [ ] Show "Unsaved changes" warning on refresh — *Acceptance: beforeunload prompt if dirty*

**Option C: Enable Two-Way Sync (requires dev server)**
- [ ] Add write endpoint to Vite dev server — *Acceptance: POST /api/docs/:id saves to markdown*
- [ ] Editor saves to both IndexedDB AND markdown — *Acceptance: Changes persist across refresh*
- [ ] Remove syncSeedData overwrite for user-modified docs — *Acceptance: IndexedDB wins if newer*

### Should Have (Friction)

- [ ] Show sync status badge (in-sync / local-only / modified) — *Acceptance: Visual indicator per document*
- [ ] Distinguish "seeded" vs "user-created" documents — *Acceptance: Different treatment for each*
- [ ] Add document history/undo across sessions — *Acceptance: Can recover previous versions*

### Could Have (Polish)

- [ ] Real-time sync indicator showing markdown ↔ browser state
- [ ] Conflict resolution UI when seed-data and IndexedDB differ
- [ ] "Push changes" button to explicitly sync to markdown

### Out of Scope

- Cloud sync / multi-device persistence
- Collaborative editing
- Version control integration (beyond what CC provides)
- Production deployment (this is a local dev tool)

---

## Analysis

### The Fundamental Constraint

Browsers cannot write to the local filesystem without:
1. **File System Access API** — requires user permission grant per session
2. **Dev server endpoint** — requires backend component
3. **Export/download** — manual user action

### Recommended Approach

**For MVP: Option B (Export workflow)**
- Lowest implementation cost
- Makes data model explicit to users
- Fits existing "CC is authoring tool, browser is viewing tool" pattern

**For better UX: Option C (Dev server sync)**
- Best user experience
- Matches "just works" expectation
- Requires adding API endpoint to Vite config

### Decision Matrix

| Approach | UX Quality | Implementation Cost | Fits Mental Model |
|----------|------------|---------------------|-------------------|
| A: Read-only | Poor | Low | No (why have editor?) |
| B: Export | Acceptable | Medium | Partial |
| C: Two-way sync | Good | High | Yes |

---

## Notes

**Why does syncSeedData overwrite?**
Original design treated seed-data as authoritative — managed frameworks should always reflect the markdown source. This makes sense for "canonical" content but breaks user editing expectations.

**Potential hybrid approach:**
- Seeded documents (in seed-data.ts): read-only in browser, source of truth is markdown
- User documents (created in browser): persist to IndexedDB only, never seeded
- This requires tracking document origin

**File System Access API consideration:**
Modern browsers support `showSaveFilePicker()` — could prompt user to save markdown file on demand. Doesn't enable auto-sync but allows explicit export without download.

---

## Resolution

**Date:** 2026-01-08
**Status:** resolved

### What Was Done

Implemented **Option C (Two-Way Sync)** with an improved architecture that reads directly from markdown in dev mode, eliminating the need for seed regeneration and forced page refreshes.

### Final Architecture

```
Dev Mode:
┌──────────────┐     GET /api/docs      ┌──────────────┐
│   Browser    │ ◄────────────────────  │  Markdown    │
│  (IndexedDB) │                        │   Files      │
└──────────────┘                        └──────────────┘
       │                                       ▲
       │ Browser edit                          │
       └───────────────── POST /api/docs/:id ──┘

Production:
  seed-data.ts (pre-compiled) → IndexedDB
```

### Changes Made

| File | Change |
|------|--------|
| `vite-plugin-docs-api.ts` | Full CRUD API: `GET /api/docs` (list all), `GET /api/docs/:id`, `POST /api/docs/:id` |
| `src/data/documents.ts` | Added `saveToMarkdown()` — saves to API on every edit |
| `src/data/seed.ts` | Dev mode fetches from API; compares content to detect CC updates |
| `vite.config.ts` | Added `docsApiPlugin()` |
| `tsconfig.json` | Added `vite/client` types |

### Outcome

- [x] Browser edits save to both IndexedDB AND markdown file
- [x] Edits persist across browser refresh (no forced refresh)
- [x] CC commands write markdown → refresh shows changes
- [x] Triage/metadata changes also sync to markdown
- [x] No `npm run generate:seed` needed in dev mode
- [x] Production builds still use seed-data.ts

### How It Works

1. **Browser edit** → `saveDocument()` → IndexedDB + `POST /api/docs/:id` → markdown file
2. **On refresh** → `syncSeedData()` → `GET /api/docs` → reads current markdown
3. **Content comparison** → if IndexedDB matches markdown, skip; if different (CC updated), apply
4. **No HMR trigger** → markdown changes don't cause page reload

### Remaining Items

**Should Have (deferred):**
- [ ] Sync status badge (in-sync / modified)
- [ ] Distinguish seeded vs user-created documents

**Could Have (not planned):**
- [ ] Real-time sync indicator
- [ ] Conflict resolution UI

testing if this works