---
id: inst-survey-loomlib-startup
title: "Survey: How to Start Loomlib"
type: instance
framework_kind: null
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [survey, startup, development, vite]
---

# Survey: How to Start Loomlib

**Date:** 2026-01-07
**Subject:** Loomlib application startup process
**Method:** Survey Method (static analysis)

---

## Survey

Relevant files:
- `loomlib/package.json` — npm scripts for dev, build, test
- `loomlib/index.html` — HTML entry point, loads `/src/main.ts`
- `loomlib/vite.config.ts` — Vite configuration (base path, build output)
- `loomlib/src/main.ts` — Application bootstrap
- `loomlib/src/data/db.ts` — IndexedDB initialization
- `loomlib/src/data/seed.ts` — Database seeding logic
- `loomlib/src/data/seed-data.ts` — Authoritative document definitions
- `loomlib/src/layout/shell.ts` — Main UI orchestration
- `loomlib/src/types.ts` — Core type definitions

---

## Core Sample

### Entry Points

**npm scripts (package.json:5-11):**
```
npm run dev      → vite          (development server)
npm run build    → tsc && vite build
npm run preview  → vite preview  (production preview)
npm run test     → vitest run
```

**HTML → TypeScript:**
`index.html` loads `/src/main.ts` as ES module.

**Application bootstrap (main.ts:31-106):**
```
init() →
  1. loadTheme()
  2. seedIfEmpty()           ← seeds if IndexedDB empty
  3. updateManagedFrameworks() ← always updates 8 core frameworks
  4. new Shell(app)          ← creates views
  5. new TriageModal()
  6. new CommandPalette()
  7. shell.init()            ← loads list view
  8. Global keyboard handlers
```

### Data Flow

```
seed-data.ts (TypeScript objects)
      ↓
seed.ts (seedIfEmpty, updateManagedFrameworks)
      ↓
db.ts (putDoc → IndexedDB)
      ↓
Shell → ListView/ConstellationView/Editor
      ↓
Browser DOM
```

### Key Abstractions

1. **Document** — Core entity with `id`, `title`, `content`, `type`, `framework_ids`, `status`, etc.
2. **Shell** — View orchestrator managing list/constellation/editor transitions
3. **IndexedDB singleton** — Lazy-opened database with indexes on `modifiedAt`, `type`, `status`, `output`
4. **Managed frameworks** — 8 framework IDs that auto-update on every app load

---

## Stratigraphy

### Call Hierarchy

```
index.html
  └── /src/main.ts
        └── init()
              ├── loadTheme() ← localStorage read
              ├── seedIfEmpty() ← db.ts → IndexedDB
              ├── updateManagedFrameworks() ← always runs
              ├── new Shell()
              │     ├── new ListView()
              │     ├── new ConstellationView()
              │     └── new Editor()
              ├── new TriageModal()
              ├── new CommandPalette()
              └── shell.init()
                    └── listView.refresh()
```

### State Location

| State | Location | Persistence |
|-------|----------|-------------|
| Theme | `localStorage['loomlib:theme']` | Persistent |
| Documents | IndexedDB `loomlib.documents` | Persistent |
| Current view | `Shell.currentView` | Session |
| Open document | `Editor` instance | Session |

### Boundary Conditions

- **No dependencies** — Zero npm runtime deps (devDeps only: fake-indexeddb, TypeScript, Vite, Vitest)
- **Browser-only** — Uses IndexedDB, localStorage, DOM APIs
- **Base path** — Configured for `/loomcommander/loomlib/` (GitHub Pages deployment)

---

## Findings

Loomlib starts as a standard Vite application. The HTML entry point loads `main.ts`, which orchestrates a sequential bootstrap: theme loading from localStorage, database seeding if empty, forced update of 8 "managed" framework documents to ensure they always reflect the latest TypeScript definitions, and finally Shell initialization which creates the three main views (list, constellation, editor) and shows the list view. The application is deliberately dependency-free at runtime, relying only on browser APIs (IndexedDB, localStorage, DOM). State is divided between persistent (IndexedDB for documents, localStorage for theme) and ephemeral (current view mode, open document).

### Key Files

| File | Role |
|------|------|
| `package.json` | Defines `npm run dev` as Vite dev server |
| `main.ts` | Bootstrap: theme → seed → shell → modals → keyboard |
| `db.ts` | IndexedDB CRUD with lazy singleton pattern |
| `seed.ts` | Seeds empty DB, updates managed frameworks |
| `seed-data.ts` | Authoritative document content (TypeScript) |
| `shell.ts` | View orchestration, keyboard shortcuts |
| `types.ts` | Document type, ViewMode, TypeScript interfaces |

### Dependencies

- **Internal:** Shell → ListView, ConstellationView, Editor; all views → db.ts
- **External:** Browser IndexedDB API, localStorage API

### Complexity Hotspots

- **seed-data.ts** — Single point of truth for all document content; will grow large
- **Managed framework sync** — Runs on every load, compares content for changes
- **No markdown sync** — Markdown files in `/docs/` are not auto-imported (manual process)

---

## Open Questions

- Does `updateManagedFrameworks()` need to run on every page load, or only when seed-data.ts changes?
- What's the planned mechanism for `/loomlib:sync` to import markdown from `/docs/` into `seed-data.ts`?
- Should theme loading block the rest of init, or can it be parallel?
- How will the app handle IndexedDB quota limits as document count grows?

---

## Resolution (2026-01-07)

**Questions 1-2 have been answered:**

1. **`updateManagedFrameworks()` was deleted.** It was replaced by `syncSeedData()`, which runs on every page load and syncs ALL seed-data documents (not just 8 hardcoded frameworks).

2. **`/loomlib:sync` now exists.** It reads markdown from `loomlib/docs/`, parses YAML frontmatter, and generates `seed-data.ts`.

**Updated bootstrap sequence (main.ts):**
```
init() →
  1. loadTheme()
  2. syncSeedData()  ← replaces seedIfEmpty + updateManagedFrameworks
  3. new Shell(app)
  ...
```

Questions 3-4 remain open.
