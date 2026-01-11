---
id: inst-survey-conducting-frontmatter-deps
title: "Survey: Conducting Frontmatter Dependencies"
type: instance
framework_kind: null
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [survey, frontmatter, conducting, dependencies, implementation]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: resolved
upstream:
  - doc: fw-survey-method
    relation: method
  - doc: fw-conducting-frontmatter
    relation: informs
downstream:
  - doc: inst-scope-conducting-frontmatter-implementation
    relation: informs
---
# Survey: Conducting Frontmatter Dependencies

**Date:** 2026-01-08
**Subject:** Implementation dependencies for Conducting Frontmatter schema
**Method:** Survey Method (static analysis)
**Precursor:** fw-conducting-frontmatter

---

## Survey

The Conducting Frontmatter framework (`fw-conducting-frontmatter`) defines a schema extension for making documents operational in Claude Code. This survey maps where changes would be needed to implement it.

### Relevant Files

| File | Role | Change Required |
|------|------|-----------------|
| `loomlib/src/types.ts` | Document interface definition | **Critical** — extend Document type |
| `loomlib/vite-plugin-docs-api.ts` | Dev API frontmatter parsing | **Critical** — parse new fields |
| `loomlib/scripts/generate-seed.ts` | Build-time seed generation | **Critical** — validate + serialize new fields |
| `loomlib/src/data/db.ts` | IndexedDB schema | **Moderate** — new indexes for queries |
| `loomlib/src/data/documents.ts` | Document CRUD operations | **Moderate** — filter by conducting fields |
| `loomlib/src/components/triage-modal.ts` | Metadata editing UI | **Moderate** — UI for conducting fields |
| `.claude/commands/loomlib*.md` | Claude Code commands | **Moderate** — generate conducting frontmatter |
| `loomlib/src/data/seed.ts` | Sync layer | **Minimal** — pass-through only |
| `loomlib/src/views/constellation.ts` | Graph visualization | **Optional** — show execution state |

---

## Core Sample

### Entry Point: Type System (`src/types.ts:108-122`)

Current `Document` interface:

```typescript
export interface Document {
  id: string;
  title: string;
  content: string;
  type: DocumentType;
  framework_kind: FrameworkKind | null;
  perspective: string | null;
  framework_ids: string[];
  source_id: string | null;
  output: string | null;
  status: DocumentStatus;
  tags: string[];
  createdAt: number;
  modifiedAt: number;
}
```

**All fields are descriptive.** No conducting fields exist.

### Entry Point: Frontmatter Parsing (`vite-plugin-docs-api.ts:69-98`)

```typescript
function parseMarkdownFile(filePath: string): ApiDocument | null {
  const parsed = matter(raw);
  const data = parsed.data;

  // Validate required fields
  if (!data.id || !data.title || !data.type || !data.status) {
    return null;
  }

  return {
    id: String(data.id),
    title: String(data.title),
    type: data.type as DocumentType,
    // ... only descriptive fields extracted
  };
}
```

**New conducting fields would be ignored** until parsing is extended.

### Entry Point: Seed Generation (`scripts/generate-seed.ts:56-121`)

```typescript
function validateDocument(filePath: string, data: Record<string, unknown>, content: string) {
  // Required fields
  if (!data.id || typeof data.id !== 'string') errors.push('Missing id');
  // ... validates descriptive fields only

  // Build document
  const doc: SeedDoc = {
    id: String(data.id),
    // ... only descriptive fields
  };
}
```

**Validation would pass** (new fields aren't required), but **fields would be dropped** on serialization.

---

## Stratigraphy

### Data Flow: Command → Markdown → App

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│ Claude Code     │      │ Markdown File    │      │ Loomlib App     │
│ Command         │  →   │ (docs/{type}/)   │  →   │ (IndexedDB)     │
└─────────────────┘      └──────────────────┘      └─────────────────┘
    generates                stored with              loaded via
    frontmatter              frontmatter              vite-plugin-docs-api
                                                      or generate-seed.ts
```

### Parsing Chain

1. **Commands** generate YAML frontmatter (`.claude/commands/loomlib*.md`)
2. **gray-matter** parses YAML in both:
   - `vite-plugin-docs-api.ts` (dev mode)
   - `scripts/generate-seed.ts` (production build)
3. **Document object** constructed from parsed data
4. **IndexedDB** stores via `putDoc()` in `db.ts`
5. **UI components** read and display via `documents.ts`

### State Location

| State | Location | How Accessed |
|-------|----------|--------------|
| Document content | Markdown files (source of truth) | Read by vite-plugin or generate-seed |
| Document metadata | YAML frontmatter | Parsed by gray-matter |
| Runtime state | IndexedDB | Queried via db.ts functions |
| UI state | Component instances | View layer (constellation, editor, list) |

### Boundary Conditions

**What's inside the system:**
- All loomlib source code
- Claude Code commands
- Markdown documents in `loomlib/docs/`

**What's outside:**
- Claude Code runtime (reads commands, executes them)
- Browser (runs the Vite app)
- User (triggers commands, edits in UI)

---

## Findings

### How the System Works

Loomlib is a two-mode document system. In **dev mode**, documents are read directly from markdown files via a Vite plugin API (`/api/docs`), allowing live sync between Claude Code commands and the browser. In **production mode**, documents are pre-compiled into `seed-data.ts` at build time.

The Document interface in `types.ts` defines the schema. Frontmatter is parsed by `gray-matter` in two places: the Vite plugin (dev) and the seed generator (prod). Both must be updated in lockstep.

IndexedDB (`db.ts`) stores runtime documents with indexes for common queries (type, status, output, modifiedAt). New queryable fields require new indexes.

The triage modal (`triage-modal.ts`) provides UI for editing document metadata. It hardcodes the current field set.

### Key Files

| File | Role |
|------|------|
| `src/types.ts` | Schema definition — the single source of truth for Document shape |
| `vite-plugin-docs-api.ts` | Dev-mode frontmatter parsing and API |
| `scripts/generate-seed.ts` | Build-time frontmatter parsing and validation |
| `src/data/db.ts` | IndexedDB schema and operations |
| `src/components/triage-modal.ts` | UI for document metadata editing |

### Dependencies (Internal)

```
types.ts ← vite-plugin-docs-api.ts
         ← scripts/generate-seed.ts
         ← src/data/db.ts
         ← src/data/documents.ts
         ← src/components/triage-modal.ts
         ← src/views/*.ts
```

Everything depends on the type definition. Change flows outward from `types.ts`.

### Dependencies (External)

| Dependency | Usage | Version |
|------------|-------|---------|
| `gray-matter` | YAML frontmatter parsing | ^4.0.3 |
| `idb` | (not used — raw IndexedDB) | N/A |
| `vite` | Dev server + build | 5.x |

### Complexity Hotspots

1. **Dual Parsing Path**: Both `vite-plugin-docs-api.ts` and `generate-seed.ts` parse frontmatter independently. Changes must be synchronized.

2. **IndexedDB Schema Versioning**: `db.ts` uses version 1. Adding indexes requires version bump + migration logic.

3. **Triage Modal State**: Hardcoded field lists in `triage-modal.ts`. Adding conducting fields requires significant UI work.

4. **Command Templates**: 12 commands with YAML templates. Each needs updating to optionally include conducting fields.

---

## Implementation Order

Based on dependency analysis:

### Phase 1: Schema Extension (Critical Path)

**File:** `src/types.ts`

```typescript
// New types for conducting frontmatter
type Intent = 'research' | 'build' | 'configure' | 'deploy' | 'verify' | 'resolve';
type Trigger = 'on_create' | 'on_demand' | 'on_schedule' | 'on_condition';
type ExecutionState = 'pending' | 'in_progress' | 'blocked' | 'completed' | 'failed';

interface Entrypoint {
  type: 'command' | 'script' | 'workflow' | 'manual';
  value: string;
}

interface Requirements {
  docs?: string[];
  files?: string[];
  state?: string[];
  tools?: string[];
}

interface Completion {
  criteria: string[];
  produces?: { type: string; path?: string; id?: string; name?: string }[];
  next?: string | null;
}

interface ExecutionTracking {
  state: ExecutionState;
  started_at?: string | null;
  completed_at?: string | null;
  blocked_by?: string | null;
  attempts: number;
  last_error?: string | null;
}

interface Dependency {
  doc?: string;
  target?: string;
  relation: string;
}

interface Outputs {
  primary: string;
  secondary?: string[];
  channel?: string | null;
}

// Extended Document interface
export interface Document {
  // Existing descriptive fields
  id: string;
  title: string;
  content: string;
  type: DocumentType;
  framework_kind: FrameworkKind | null;
  perspective: string | null;
  framework_ids: string[];
  source_id: string | null;
  output: string | null;
  status: DocumentStatus;
  tags: string[];
  createdAt: number;
  modifiedAt: number;

  // New conducting fields (all optional for backward compatibility)
  actionable?: boolean;
  intent?: Intent | null;
  entrypoint?: Entrypoint | null;
  trigger?: Trigger;
  requires?: Requirements | null;
  completion?: Completion | null;
  execution?: ExecutionTracking;
  upstream?: Dependency[];
  downstream?: Dependency[];
  outputs?: Outputs | null;
}
```

**Backward compatibility:** All new fields optional with sensible defaults.

### Phase 2: Parsing Extension (Critical Path)

**Files:** `vite-plugin-docs-api.ts`, `scripts/generate-seed.ts`

Both need updated:
1. Type definitions (can share via import or duplicate)
2. `parseMarkdownFile()` / `validateDocument()` to extract new fields
3. `serializeToMarkdown()` to write new fields

**Key insight:** These parse independently. Must change both or dev/prod will diverge.

### Phase 3: Storage Extension

**File:** `src/data/db.ts`

Add indexes for queryable conducting fields:

```typescript
// In onupgradeneeded, DB_VERSION = 2
store.createIndex('actionable', 'actionable', { unique: false });
store.createIndex('execution_state', 'execution.state', { unique: false });
```

**Migration:** Existing documents get `actionable: false`, `execution: { state: 'completed', attempts: 0 }`.

### Phase 4: Command Templates

**Files:** `.claude/commands/loomlib:scope.md`, `loomlib:survey.md`, `loomlib:excavate.md`

Update actionable commands to generate conducting frontmatter:

```yaml
# ─── CONDUCTING (new) ─────────────────────────────────────
actionable: true
intent: research
entrypoint:
  type: workflow
  value: "## Protocol"
trigger: on_demand
completion:
  criteria:
    - "Audit section complete"
    - "Requirements have acceptance criteria"
```

**Non-actionable commands** (`:source`, `:index`, `:framework`) get `actionable: false` or omit entirely.

### Phase 5: Query Layer

**File:** `src/data/documents.ts`

Extend `FilterCriteria` and `filterDocuments()`:

```typescript
interface FilterCriteria {
  // Existing
  types?: DocumentType[];
  statuses?: DocumentStatus[];
  // New
  actionable?: boolean;
  executionState?: ExecutionState;
  intent?: Intent;
}
```

### Phase 6: UI Extension (Optional)

**File:** `src/components/triage-modal.ts`

Add fields for:
- `actionable` toggle
- `intent` selector
- `trigger` selector
- `execution.state` display (read-only in triage, managed by system)

**Complexity:** Significant UI work. Could defer to Phase 2 of implementation.

### Phase 7: Visualization (Optional)

**File:** `src/views/constellation.ts`

Show execution state visually:
- Color coding by state (pending=gray, in_progress=blue, blocked=orange, completed=green, failed=red)
- Edge styles for upstream/downstream dependencies

---

## Open Questions

1. **Execution engine scope:** Does Claude Code read conducting frontmatter and act on it, or is it purely documentation? The framework implies the former, but no execution layer exists yet.

2. ~~**State mutation:** Who updates `execution.state`? Claude Code commands? The browser UI? Both?~~ → Resolved

3. **Dependency resolution:** How does the system know when `requires.docs` preconditions are met? Manual check or automated query?

4. ~~**Backward compatibility migration:** Existing documents have no conducting fields. Should they get defaults, or remain untouched until edited?~~ → Resolved

5. ~~**Command template complexity:** Adding conducting frontmatter makes templates longer. Should it be optional (only generated when `--actionable` flag passed)?~~ → Resolved

---

## Decisions

Decisions required before implementation. These resolve open questions and establish implementation constraints.

| Question | Options | Decision | Rationale |
|----------|---------|----------|-----------|
| Who mutates `execution.state`? | Claude commands / Browser UI / Both | **Claude commands** | UI is display-only for v1. Keeps state mutation in one place. Future: UI could allow manual transitions for blocked→pending. |
| Backward compatibility? | Defaults on load / Untouched until edit / Migration script | **Defaults on load** | Per `fw-conducting-frontmatter`: documents without conducting fields default to `actionable: false`, `execution.state: 'completed'`. No migration needed—computed at read time. |
| Opt-in per command? | Always generate / Flag `--actionable` / Per document type | **Per document type** | Actionable types (scope, survey, excavate) get conducting frontmatter by default. Non-actionable types (source, index, framework, note) omit conducting fields. Simpler than flags. |
| Execution engine scope? | Documentation only / Full orchestration / Hybrid | **Deferred** | Phase 1-4 implement schema + persistence. Execution engine (Phase 5+) is separate scope. Conducting frontmatter has value as documentation even without automation. |
| Dependency resolution? | Manual check / Automated query / Hybrid | **Deferred** | Requires execution engine. For v1, `requires` fields are documentation for humans/Claude to check manually before running. |

### Implementation Constraints (from decisions)

1. **Schema changes are additive** — no breaking changes to existing Document interface
2. **Parsing is defensive** — missing conducting fields → sensible defaults, not errors
3. **Commands are authoritative** — only Claude commands write `execution.*` fields
4. **Type determines actionability** — no per-document flag needed in v1

---

## Summary

Implementing Conducting Frontmatter requires changes to:

| Layer | Files | Effort |
|-------|-------|--------|
| **Schema** | `types.ts` | Low |
| **Parsing** | `vite-plugin-docs-api.ts`, `generate-seed.ts` | Medium |
| **Storage** | `db.ts` | Low |
| **Commands** | 12 command files | Medium |
| **Query** | `documents.ts` | Low |
| **UI** | `triage-modal.ts` | High (optional) |
| **Visualization** | `constellation.ts` | Medium (optional) |

**Minimum viable:** Phases 1-4 (schema + parsing + storage + commands). Documents will have conducting frontmatter that persists and syncs.

**Full implementation:** All phases, including UI and visualization for execution state tracking.

**Critical path:** `types.ts` → parsing (both files) → commands. These must change together or the system will be inconsistent.

---

## Survey Status

**Status:** verified → resolved

**Decisions resolved:**
- [x] State mutation: Claude commands only
- [x] Backward compatibility: defaults on load
- [x] Opt-in strategy: per document type
- [x] Execution engine: deferred to later phase (as planned)
- [x] Dependency resolution: deferred to later phase (as planned)

**Resolution criteria met:**
- [x] Phase 1-4 implemented (schema + parsing + commands)
- [x] Documents successfully use conducting frontmatter

---

## Resolution

**Date:** 2026-01-08
**Status:** resolved

### What Was Done

Survey dependencies were addressed during implementation:
- `types.ts` — extended with conducting fields
- `vite-plugin-docs-api.ts` — parsing/serialization added
- Commands — all 8 updated with Discovery + Conducting output

### Outcome

Survey accurately identified critical path. Implementation followed phases as mapped.

### Remaining Items

None — survey findings acted upon. Deferred items (execution engine, dependency resolution) remain out of scope as planned.
