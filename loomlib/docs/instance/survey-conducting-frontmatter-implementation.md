---
id: inst-survey-conducting-frontmatter-implementation
title: "Survey: Conducting Frontmatter Implementation"
type: instance
framework_kind: null
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [survey, conducting, frontmatter, implementation, schema]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: resolved
upstream:
  - doc: fw-survey-method
    relation: method
  - doc: idx-conducting-frontmatter-system
    relation: informs
downstream:
  - doc: fw-conducting-frontmatter
    relation: informs
---

# Survey: Conducting Frontmatter Implementation

**Date:** 2026-01-08
**Subject:** What code changes are needed to implement conducting frontmatter
**Method:** Survey Method (static analysis)

---

## Survey

Relevant files for conducting frontmatter implementation:

**Schema Layer:**
- `loomlib/src/types.ts` — Document interface, type definitions
- `loomlib/vite-plugin-docs-api.ts` — API parsing/serialization

**Data Layer:**
- `loomlib/src/data/seed-data.ts` — Generated seed data (auto-generated)
- `loomlib/src/data/seed.ts` — Sync logic between API/IndexedDB
- `loomlib/src/data/documents.ts` — Document CRUD operations

**Graph Layer:**
- `loomlib/src/data/graph.ts` — Graph computation, relationships

**Commands (need Discovery + Conducting output):**
- `.claude/commands/loomlib:scope.md` — ✅ Has Discovery + Conducting
- `.claude/commands/loomlib:survey.md` — Partial (has Decisions section, no Discovery)
- `.claude/commands/loomlib:instance.md` — No Discovery/Conducting
- `.claude/commands/loomlib:framework.md` — No Discovery/Conducting
- `.claude/commands/loomlib:note.md` — No Discovery/Conducting
- `.claude/commands/loomlib:source.md` — No Discovery/Conducting
- `.claude/commands/loomlib:index.md` — No Discovery/Conducting
- `.claude/commands/loomlib:excavate.md` — No Discovery/Conducting
- `.claude/commands/loomlib:resolve.md` — No execution_state update

**Documentation:**
- `loomlib/docs/framework/conducting-frontmatter.md` — The framework definition
- `loomlib/docs/index/conducting-frontmatter-system.md` — System overview

---

## Core Sample

### Entry Points

**For schema changes:** `loomlib/src/types.ts:108-122`
- The `Document` interface is the central type
- Currently has 12 fields, missing 4 conducting fields

**For API parsing:** `loomlib/vite-plugin-docs-api.ts:69-98`
- `parseMarkdownFile()` extracts frontmatter via gray-matter
- Returns `ApiDocument` type (matches Document minus timestamps)
- Currently parses 10 frontmatter fields, missing 4 conducting fields

**For API serialization:** `loomlib/vite-plugin-docs-api.ts:129-148`
- `serializeToMarkdown()` writes frontmatter back to files
- Currently writes 10 fields, missing 4 conducting fields

### Data Flow

```
Markdown files (source of truth in dev)
    ↓ parseMarkdownFile()
ApiDocument (no timestamps)
    ↓ syncSeedData()
Document (with timestamps) → IndexedDB
    ↓ getDoc/getAllDocs
UI components
    ↓ updateDocumentMetadata()
Document → putDoc() + saveToMarkdown()
    ↓
Markdown files (round-trip complete)
```

### Key Abstractions

1. **Document interface** — Central type shared across codebase
2. **ApiDocument** — Document without timestamps (API boundary)
3. **gray-matter** — YAML frontmatter parsing library
4. **Separate parsing in plugin vs types** — Plugin duplicates type definitions

---

## Stratigraphy

### Call Hierarchy

```
vite-plugin-docs-api.ts
├── parseMarkdownFile() — reads markdown, returns ApiDocument
├── readAllDocs() — calls parseMarkdownFile for all files
├── serializeToMarkdown() — writes Document to markdown
└── configureServer() — sets up GET/POST /api/docs endpoints

types.ts
├── Document interface — THE central type
├── createEmptyDocument() — factory with defaults
└── (no conducting fields yet)

documents.ts
├── saveDocument() — saves content, calls saveToMarkdown()
├── updateDocumentMetadata() — saves metadata, calls saveToMarkdown()
└── createDocument() — uses createEmptyDocument()

graph.ts
├── computeEdges() — uses framework_ids, source_id (not upstream/downstream)
├── computeLayers() — uses framework_ids, source_id
└── categorizeDocsSemantic() — uses framework_ids, source_id
```

### State Location

1. **Markdown files** — Source of truth in dev mode
2. **IndexedDB** — Runtime storage (hydrated from markdown/seed-data)
3. **seed-data.ts** — Build-time snapshot for production

### Boundary Conditions

- **New fields must be optional** — Backward compatible with existing docs
- **Parsing must have defaults** — Docs without conducting fields should work
- **Serialization must preserve fields** — Round-trip without loss
- **Graph could optionally use upstream/downstream** — Future enhancement

---

## Findings

The conducting frontmatter system requires changes at three layers: **schema** (add 4 fields to Document interface), **parsing** (extract fields in API plugin), and **commands** (add Discovery section + Conducting output to 7 commands). The graph layer could optionally be extended to use `upstream`/`downstream` for relationship computation, but this is not required — the existing `framework_ids`/`source_id` relationships are a subset of what conducting tracks.

The current architecture cleanly separates concerns: types define the shape, the Vite plugin handles markdown ↔ API translation, and documents.ts handles IndexedDB operations. Adding conducting fields follows this same pattern without architectural changes.

### Key Files

| File | Role | Changes Needed |
|------|------|----------------|
| `loomlib/src/types.ts` | Document interface definition | Add 4 optional fields + types |
| `loomlib/vite-plugin-docs-api.ts` | Markdown parsing/serialization | Parse + serialize 4 new fields |
| `.claude/commands/loomlib:survey.md` | Survey command template | Add Discovery section |
| `.claude/commands/loomlib:instance.md` | Instance command template | Add Discovery + Conducting |
| `.claude/commands/loomlib:framework.md` | Framework command template | Add Discovery + Conducting |
| `.claude/commands/loomlib:note.md` | Note command template | Add Discovery + Conducting |
| `.claude/commands/loomlib:source.md` | Source command template | Add Discovery + Conducting |
| `.claude/commands/loomlib:index.md` | Index command template | Add Discovery + Conducting |
| `.claude/commands/loomlib:excavate.md` | Excavate command template | Add Discovery + Conducting |
| `.claude/commands/loomlib:resolve.md` | Resolve command | Update execution_state |

### Dependencies

- **Internal:** types.ts → documents.ts, seed.ts, graph.ts, views/*
- **External:** gray-matter (YAML parsing), Vite (plugin API)

### Complexity Hotspots

1. **Type duplication in vite-plugin-docs-api.ts** — Plugin defines its own Document interface instead of importing from types.ts. This means changes must be made in two places. Consider importing from types.ts in a future refactor.

2. **Upstream/downstream serialization** — These are arrays of objects `{doc, relation}`. Need careful YAML serialization to preserve structure.

3. **Command updates** — 8 commands need updating. Each has different structure but needs same Discovery pattern added.

---

## Open Questions

1. **Should graph.ts use upstream/downstream for edges?** The existing `framework_ids`/`source_id` graph relationships are production lineage. The new `upstream`/`downstream` fields could enable richer graph traversal (e.g., "show me what informed this document"). This is optional but would unlock constellation visualization of the conducting graph.

2. **Should seed-data generation script also be updated?** There's a reference to `scripts/generate-seed.ts` in the framework doc but it doesn't exist in the glob results. Need to check if build process uses a different mechanism.

3. **How should defaults work for existing documents?** Framework suggests:
   - `intent`: inferred from type (survey→research, framework→build)
   - `execution_state`: 'completed' (assume existing docs are done)
   - `upstream`/`downstream`: [] (no tracked lineage)

---

## Decisions

Decisions required before implementation:

| Question | Options | Decision | Rationale |
|----------|---------|----------|-----------|
| Graph integration | A) Skip for now / B) Add upstream/downstream edges | **A) Skip for now** | Keep scope minimal — existing framework_ids graph is sufficient. Can add conducting graph view later. |
| Type duplication | A) Keep duplicate types / B) Import from types.ts | **A) Keep duplicates for now** | Plugin runs at build time, types.ts is runtime. Would require build config changes. Note for future refactor. |
| Default inference | A) Explicit defaults in code / B) Leave undefined | **A) Explicit defaults** | Better DX — existing docs work without modification |
| Command update order | A) All at once / B) Incrementally | **A) All at once** | Commands are templates, not runtime code. Single coherent update is cleaner. |

### Implementation Constraints (from decisions)

1. Schema changes are backward compatible (all new fields optional)
2. No graph.ts changes in this phase
3. Keep type duplication in plugin (note for future)
4. Provide sensible defaults for existing documents
5. Update all commands in single pass for consistency

---

## Implementation Order

Based on findings and decisions:

### Phase 1: Schema + Parsing (required for everything else)

1. **`types.ts`** — Add conducting field types and extend Document interface
2. **`vite-plugin-docs-api.ts`** — Parse conducting fields from YAML, serialize to YAML

### Phase 2: Commands (enables producing documents with conducting frontmatter)

3. **`loomlib:survey.md`** — Add Discovery section
4. **`loomlib:instance.md`** — Add Discovery + Conducting output
5. **`loomlib:framework.md`** — Add Discovery + Conducting output
6. **`loomlib:note.md`** — Add Discovery + Conducting output
7. **`loomlib:source.md`** — Add Discovery + Conducting output
8. **`loomlib:index.md`** — Add Discovery + Conducting output
9. **`loomlib:excavate.md`** — Add Discovery + Conducting output

### Phase 3: Resolution (closes the loop)

10. **`loomlib:resolve.md`** — Update to set `execution_state: resolved`

---

## Verification Criteria

Survey is verified when:
- [x] All relevant files identified
- [x] Data flow mapped
- [x] Complexity hotspots noted
- [x] Open questions documented
- [x] Decisions made with rationale
- [x] Implementation order specified

---

## Resolution

**Date:** 2026-01-08
**Status:** resolved

### What Was Done

Survey findings were used to implement the conducting frontmatter system. All phases completed as specified:
- Phase 1: Schema + Parsing ✅
- Phase 2: Commands (8 updated) ✅
- Phase 3: Resolution command ✅

### Outcome

Survey accurately mapped the implementation path. Decisions held:
- Skipped graph.ts changes (as decided)
- Kept type duplication (as decided)
- Used explicit defaults (as decided)
- Updated all commands at once (as decided)

### Remaining Items

None — survey findings acted upon.
