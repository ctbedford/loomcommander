---
id: inst-survey-seed-architecture
title: "Survey: Seed Architecture Redundancy"
type: instance
framework_kind: null
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [survey, architecture, seed, build, redundancy]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-survey-method
    relation: method
downstream: []
---

# Survey: Seed Architecture Redundancy

**Date:** 2026-01-07
**Subject:** Why does seed-data.ts duplicate markdown content?
**Method:** Survey Method (static analysis)

---

## Survey

Relevant files:
- `loomlib/docs/**/*.md` — Markdown documents (source of truth)
- `loomlib/src/data/seed-data.ts` — 2300+ lines of duplicated content
- `loomlib/scripts/seed.ts` — Node script with its own hardcoded seedData array
- `loomlib/src/data/seed.ts` — Browser-side sync function
- `.claude/commands/loomlib:sync.md` — Claude Code command that copies md → seed-data.ts

---

## Core Sample

### Current Architecture (Redundant)

```
loomlib/docs/*.md (markdown files)
        ↓
/loomlib:sync (Claude Code command)
        ↓
seed-data.ts (2300 lines of duplicated TypeScript)
        ↓
syncSeedData() (browser)
        ↓
IndexedDB
```

**Problem:** Content exists in TWO places:
1. Markdown files (human-authored)
2. seed-data.ts (generated copy)

### scripts/seed.ts (Unused Legacy)

The `scripts/seed.ts` file has its own hardcoded `seedData` array (970 lines) that's completely separate from `src/data/seed-data.ts`. It uses `fake-indexeddb` for Node.js but is never actually used in the build pipeline.

### Key Insight

**The browser cannot read local files.** This is why seed-data.ts exists — the content must be bundled into JavaScript at build time.

But there's a better way: **generate seed-data.ts from markdown at build time**, not via a manual Claude Code command.

---

## Stratigraphy

### Current Data Flow

```
AUTHOR TIME:
  Human writes → loomlib/docs/*.md

MANUAL SYNC (via Claude Code):
  /loomlib:sync reads markdown
  /loomlib:sync writes seed-data.ts
  (This is the redundant step)

BUILD TIME:
  Vite bundles seed-data.ts into JS

RUNTIME:
  syncSeedData() → IndexedDB
```

### Better Data Flow

```
AUTHOR TIME:
  Human writes → loomlib/docs/*.md

BUILD TIME:
  npm run build:seed
    → Node script reads loomlib/docs/*.md
    → Parses YAML frontmatter
    → Generates seed-data.ts
    → Vite bundles into JS

RUNTIME:
  syncSeedData() → IndexedDB
```

### State Location

| State | Current Location | Problem |
|-------|------------------|---------|
| Document content | docs/*.md AND seed-data.ts | Duplicated |
| Document metadata | YAML frontmatter AND TypeScript | Duplicated |
| Seed logic | scripts/seed.ts AND src/data/seed.ts | Two separate implementations |

---

## Findings

**The current architecture has unnecessary redundancy.** Markdown files are the source of truth, but their content is manually duplicated into seed-data.ts via the `/loomlib:sync` Claude Code command. This creates:

1. **Maintenance burden** — Every document change requires running sync
2. **Drift risk** — Markdown and TypeScript can get out of sync
3. **Wasted context** — Claude Code spends tokens copying content
4. **Two seed scripts** — `scripts/seed.ts` (unused) and `src/data/seed.ts` (browser-side)

The solution is to make `scripts/seed.ts` a **build-time generator** that:
1. Reads all `loomlib/docs/**/*.md` files
2. Parses YAML frontmatter using a library like `gray-matter`
3. Generates `src/data/seed-data.ts`
4. Runs as part of `npm run build`

This eliminates the need for `/loomlib:sync` to copy content — it would only need to verify the markdown is valid.

### Key Files

| File | Current Role | Better Role |
|------|--------------|-------------|
| `docs/**/*.md` | Source of truth | Source of truth (unchanged) |
| `src/data/seed-data.ts` | Manual copy of markdown | **Generated** from markdown |
| `scripts/seed.ts` | Unused legacy with hardcoded data | **Build script** that generates seed-data.ts |
| `src/data/seed.ts` | Browser sync to IndexedDB | Browser sync (unchanged) |

### Dependencies

**Current:**
- Claude Code for sync (manual process)
- No build-time markdown parsing

**Better:**
- `gray-matter` npm package for YAML frontmatter parsing
- Build script runs before Vite bundle

### Complexity Hotspots

- **scripts/seed.ts** has 970 lines of hardcoded seed data that's completely out of sync with the real documents
- **seed-data.ts** is 2300+ lines and growing — all manually maintained
- **/loomlib:sync** does work that should be automated

---

## Open Questions

1. **Should this be a Vite plugin or a prebuild script?**
   - Vite plugin: integrates with dev server, hot reload
   - Prebuild script: simpler, runs before `vite build`

2. **What about the existing seed-data.ts content?**
   - 27+ documents exist in seed-data.ts that don't have markdown files
   - Need to either create markdown files for them OR keep a hybrid approach

3. **Dependencies:**
   - `gray-matter` for YAML parsing — acceptable to add?
   - Or use a simpler regex-based parser to avoid dependencies?

4. **What happens to /loomlib:sync?**
   - Could become a validation command (check markdown is valid)
   - Or could be deprecated entirely

---

## Proposed Architecture

```
loomlib/
├── docs/
│   ├── framework/*.md      ← Source of truth
│   ├── instance/*.md
│   ├── index/*.md
│   └── source/*.md
├── scripts/
│   └── generate-seed.ts    ← NEW: reads docs/, writes seed-data.ts
├── src/data/
│   ├── seed-data.ts        ← GENERATED (never hand-edit)
│   └── seed.ts             ← Browser sync (unchanged)
└── package.json
    scripts:
      "prebuild": "tsx scripts/generate-seed.ts"
      "build": "tsc && vite build"
```

**Result:**
- Markdown is single source of truth
- No manual sync step
- No Claude Code command needed for content sync
- seed-data.ts is always in sync with markdown
