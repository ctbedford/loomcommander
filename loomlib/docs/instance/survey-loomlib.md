---
id: inst-survey-loomlib
title: "Survey: Loomlib Architecture"
type: instance
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [survey, loomlib, architecture, indexeddb, constellation]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-survey-method
    relation: method
downstream: []
---

# Survey: Loomlib Architecture

**Date:** 2026-01-07
**Subject:** Complete loomlib subsystem architecture and data flow
**Method:** Survey Method (static analysis)

---

## Survey

Relevant files:
- `src/main.ts` — Application bootstrap, theme handling, global keyboard shortcuts
- `src/types.ts` — Core type definitions: Document, SemanticCategory, Lens system
- `src/data/db.ts` — IndexedDB wrapper for document CRUD
- `src/data/documents.ts` — Document operations, filtering, metadata
- `src/data/seed.ts` — Runtime sync of seed-data to IndexedDB
- `src/data/seed-data.ts` — Auto-generated from markdown docs at build time
- `src/data/graph.ts` — Graph computation, semantic categorization, slot system
- `src/data/constellation-config.ts` — Slot limits, lens configurations
- `src/layout/shell.ts` — View orchestration (list/constellation/editor)
- `src/views/constellation.ts` — Graph visualization with tethers and nodes
- `src/views/list.ts` — Document list view
- `src/views/editor.ts` — Markdown editor
- `src/components/triage-modal.ts` — Document metadata editor
- `src/components/command-palette.ts` — Quick document search/open
- `src/components/lens-picker.ts` — Lens selection UI
- `src/components/formula-bar.ts` — Production formula display
- `scripts/generate-seed.ts` — Build-time markdown-to-TypeScript generator

---

## Core Sample

### Entry Points
1. **Build-time:** `npm run generate:seed` runs `scripts/generate-seed.ts`
   - Parses `loomlib/docs/**/*.md` with gray-matter
   - Validates frontmatter against Document schema
   - Generates `src/data/seed-data.ts`

2. **Runtime:** `src/main.ts::init()`
   - Calls `syncSeedData()` to sync seed-data to IndexedDB
   - Initializes Shell with TriageModal and CommandPalette
   - Sets up global keyboard shortcuts (Cmd+O, Cmd+Shift+L)

### Data Flow
```
loomlib/docs/*.md  --[generate-seed.ts]--> src/data/seed-data.ts
                                                |
                                      [vite build / import]
                                                |
                                                v
                                    src/data/seed.ts::syncSeedData()
                                                |
                                      [IndexedDB: loomlib]
                                                |
                                      src/data/db.ts
                                                |
                                      src/data/documents.ts
                                                |
                    +---------------------------+---------------------------+
                    |                           |                           |
              src/views/list.ts      src/views/constellation.ts   src/views/editor.ts
```

### Key Abstractions

**Document Type System:**
- 5 document types: `source | note | framework | instance | index`
- Frameworks have `framework_kind`: `toolkit | domain`
- Status progression: `incubating → draft → verified → captured`

**Semantic Relationships (8 categories):**
- `toolkitParent`, `domainParent`, `sourceParent` — parent relationships
- `child` — documents that reference focus
- `formulaSibling` — exact same framework_ids
- `channelSibling` — same output channel
- `perspectiveSibling` — same perspective
- `distant` — unrelated documents

**Lens System:**
- Switchable view modes: `default`, `formula`, `production`, `lineage`, `channel`, `perspective`, `incubating`, `recent`, `framework`, `semantic`
- Each lens has `filter()` and `sort()` functions

---

## Stratigraphy

### Call Hierarchy
```
main.ts::init()
  ├── syncSeedData() → db.ts::putDoc()
  ├── Shell.init()
  │     ├── ListView.refresh() → documents.ts::listDocuments()
  │     ├── ConstellationView.refresh()
  │     │     ├── documents.ts::listDocuments()
  │     │     ├── graph.ts::categorizeDocsSemantic()
  │     │     ├── graph.ts::computeGraph()
  │     │     └── render() → renderNodes(), renderTethers()
  │     └── Editor.load()
  ├── TriageModal.open()
  │     └── updateDocumentMetadata() → db.ts::putDoc()
  └── CommandPalette.open()
        └── filterDocuments() → db.ts::getAllDocs()
```

### State Location
- **Persistent:** IndexedDB database "loomlib", object store "documents"
  - Indexed by: id (primary), modifiedAt, type, status, output
- **UI State (per-view):**
  - Shell: `currentView` ('list' | 'constellation' | 'editor')
  - ConstellationView: `focusedId`, `activeLens`, `slotOffsets`, `categorizedDocs`
  - ListView: internal scroll/selection state
  - Editor: current document ID, content buffer

### Boundary Conditions
- **Seed sync:** Adds new docs, updates changed content, preserves user docs
- **Framework deletion:** Blocked if children exist (orphan protection)
- **Slot limits:** Adaptive based on document count (<20, 20-50, >50)
- **Graph rendering:** Only tethers connected to focus node are rendered

---

## Findings

Loomlib is a single-page application for managing a personal knowledge library organized around a "production formula" metaphor. Documents flow from sources through frameworks (toolkits + domains) to produce instances. The system uses a build-time pipeline that converts markdown files with YAML frontmatter into TypeScript, which then syncs to IndexedDB at runtime. The constellation view provides a graph-based interface with semantic categorization of relationships, allowing users to explore documents by production lineage, output channel, or perspective. The lens system enables focused exploration by filtering and sorting the graph.

### Key Files

| File | Role |
|------|------|
| `src/main.ts` | Bootstrap, global shortcuts, theme |
| `src/types.ts` | Type definitions, icons, colors |
| `src/data/db.ts` | IndexedDB operations |
| `src/data/seed.ts` | Runtime seed sync |
| `src/data/graph.ts` | Semantic categorization, graph layout |
| `src/data/constellation-config.ts` | Slot limits, lens configs |
| `src/layout/shell.ts` | View orchestration |
| `src/views/constellation.ts` | Graph visualization |
| `scripts/generate-seed.ts` | Build-time markdown→TS |

### Dependencies
- **Internal:** Clean separation between data layer (db, documents, graph) and UI layer (views, components)
- **External:**
  - Vite (bundler)
  - gray-matter (frontmatter parsing, build-time only)
  - IndexedDB (browser-native storage)
  - No runtime dependencies beyond browser APIs

### Complexity Hotspots
- `graph.ts::categorizeDocsSemantic()` — Complex 8-way classification logic
- `constellation.ts` — 600+ lines managing graph rendering, slots, lenses, previews
- `generate-seed.ts` — Validation logic duplicates type definitions from `types.ts`

---

## Open Questions

- How does the `semantic` lens (AI-inferred similarity) intend to work? Currently marked `available: false`.
- What is the `captured` status used for? Appears in types but not well-documented.
- How are `index` documents intended to function? The type exists but no special handling visible.
- Is there a migration path for IndexedDB schema changes? Current version is 1.
- The constellation slot position system (`SLOT_POSITIONS`) in config doesn't seem to be used by `graph.ts::computePositions()` which has its own positioning logic.
