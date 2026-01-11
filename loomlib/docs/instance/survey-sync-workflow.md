---
id: inst-survey-sync-workflow
title: "Survey: The New Sync Workflow"
type: instance
framework_kind: null
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [survey, sync, workflow, build, documentation]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-survey-method
    relation: method
downstream: []
---

# Survey: The New Sync Workflow

**Date:** 2026-01-07
**Subject:** How documents now flow from authoring to app
**Method:** Survey Method (static analysis)

---

## Survey

Relevant files:
- `loomlib/docs/**/*.md` — Source of truth (32 documents)
- `loomlib/scripts/generate-seed.ts` — Build-time generator
- `loomlib/src/data/seed-data.ts` — Generated TypeScript (never hand-edit)
- `loomlib/src/data/seed.ts` — Browser-side sync to IndexedDB
- `loomlib/package.json` — Build hooks (prebuild, predev)

---

## Core Sample

### The New Flow

```
1. AUTHOR
   Human or Claude writes → loomlib/docs/{type}/{slug}.md

2. BUILD (automatic)
   npm run dev / npm run build
       ↓
   prebuild hook runs generate-seed.ts
       ↓
   Reads all markdown, parses frontmatter
       ↓
   Generates src/data/seed-data.ts

3. BUNDLE
   Vite bundles seed-data.ts into JavaScript

4. RUNTIME
   Browser loads app
       ↓
   syncSeedData() compares seed-data to IndexedDB
       ↓
   Adds new documents, updates changed ones
       ↓
   Documents appear in UI
```

### Key Insight

**No manual sync step.** The `prebuild` and `predev` hooks in package.json ensure `generate-seed.ts` runs automatically before every build or dev server start.

---

## Stratigraphy

### Before (Old Workflow)

```
Write markdown → /loomlib:sync (manual) → seed-data.ts → app
                      ↑
              Claude Code command
              (manual, error-prone)
```

### After (New Workflow)

```
Write markdown → npm run dev → seed-data.ts → app
                      ↑
              Automatic prebuild hook
              (zero manual steps)
```

### State Location

| State | Location | Authoritative? |
|-------|----------|----------------|
| Document content | `loomlib/docs/**/*.md` | **YES** |
| Generated TypeScript | `src/data/seed-data.ts` | No (generated) |
| Runtime documents | IndexedDB | No (synced from seed-data) |

---

## Findings

**Markdown is now the single source of truth.** When you create or edit a document in `loomlib/docs/`, running `npm run dev` or `npm run build` automatically regenerates `seed-data.ts`. The browser then syncs this to IndexedDB on page load. There are no manual sync commands needed.

### Key Files

| File | Role |
|------|------|
| `loomlib/docs/**/*.md` | Source of truth for all documents |
| `scripts/generate-seed.ts` | Parses markdown, generates TypeScript |
| `src/data/seed-data.ts` | Auto-generated, bundled into app |
| `src/data/seed.ts` | `syncSeedData()` updates IndexedDB |
| `package.json` | `predev` and `prebuild` hooks |

### Commands

| Command | What It Does |
|---------|--------------|
| `npm run dev` | Regenerates seed-data.ts, starts dev server |
| `npm run build` | Regenerates seed-data.ts, builds for production |
| `npm run generate:seed` | Just regenerates seed-data.ts (no build) |

### Dependencies

- **gray-matter** — Parses YAML frontmatter from markdown
- **tsx** — Runs TypeScript build script

---

## The Workflow Now

### Creating a New Document

1. Run `/loomlib:instance` (or `:framework`, `:note`, etc.)
2. Claude writes `loomlib/docs/{type}/{slug}.md`
3. Run `npm run dev` (or it's already running — Vite will rebuild)
4. Refresh browser → document appears

### Editing an Existing Document

1. Edit the markdown file in `loomlib/docs/`
2. Save the file
3. If dev server is running, it will rebuild automatically
4. Refresh browser → changes appear

### Validating Documents

```bash
cd loomlib && npm run generate:seed
```

This will report any validation errors:
- Missing required frontmatter fields
- Invalid enum values (type, status, framework_kind)
- ID prefix mismatches
- Duplicate IDs

---

## Open Questions

1. **Should seed-data.ts be committed?**
   - Currently: Yes (committed for transparency)
   - Alternative: Add to .gitignore (cleaner diffs)

2. **Hot reload for markdown changes?**
   - Currently: Need to restart dev server or manually trigger rebuild
   - Could add: Vite plugin that watches `docs/` and regenerates

3. **What about user-created documents?**
   - `syncSeedData()` only adds/updates seed documents
   - User documents in IndexedDB are untouched
   - No way to export user documents back to markdown yet
