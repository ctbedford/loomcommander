---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-scope-conducting-frontmatter-implementation
title: "Scope: Conducting Frontmatter Implementation Across Commands"
type: instance
framework_kind: null
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [scope, conducting, frontmatter, commands, implementation]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: resolved
upstream:
  - doc: fw-conducting-frontmatter
    relation: method
  - doc: inst-survey-conducting-frontmatter-deps
    relation: informs
  - doc: inst-scope-command-discovery-patterns
    relation: informs
downstream: []
---
# Scope: Conducting Frontmatter Implementation Across Commands

**Date:** 2026-01-08
**Subject:** Implementing Discovery + Conducting frontmatter across all 12 loomlib commands
**Method:** Scope Method (implementation planning)

---

## Audit

### Command Inventory

| Command | Current State | Purpose |
|---------|--------------|---------|
| `loomlib.md` | Router, no output | Routes to specific commands |
| `loomlib:scope.md` | ✅ Has Discovery + Conducting | UX requirements |
| `loomlib:survey.md` | Has Decisions section only | Codebase investigation |
| `loomlib:excavate.md` | No conducting | Etymon Method research |
| `loomlib:framework.md` | No conducting | Create reusable method/lens |
| `loomlib:instance.md` | No conducting | Generic instance creation |
| `loomlib:source.md` | No conducting | Document external material |
| `loomlib:index.md` | No conducting | Curate document collections |
| `loomlib:note.md` | No conducting | Raw capture |
| `loomlib:promote.md` | No conducting | Status workflow |
| `loomlib:resolve.md` | No conducting | Close out documents |
| `loomlib:triage.md` | No conducting | Classify material |

### Current Pattern (scope command)

The updated `loomlib:scope.md` has:
1. **Discovery section** — API queries before protocol
2. **Conducting frontmatter in output** — `actionable`, `intent`, `execution_state`, `upstream`
3. **Composition section** — Documents relationships in body
4. **Post-completion reporting** — What was discovered, what this enables

---

## Affordances

### Document Types by Actionability

Based on `fw-conducting-frontmatter`:

| Type | Actionable? | Intent | Rationale |
|------|-------------|--------|-----------|
| **scope** | Yes | research | Produces requirements, enables implementation |
| **survey** | Yes | research | Produces understanding, enables scoping |
| **excavate** | Yes | research | Produces etymology findings, enables instances |
| **framework** | No | — | Informational, reusable lens |
| **source** | No | — | Reference material |
| **index** | No | — | Navigation aid |
| **note** | No | — | Raw capture, pre-triage |

### Command Types by Role

| Role | Commands | Needs Discovery? | Writes Conducting? |
|------|----------|------------------|-------------------|
| **Produces actionable docs** | scope, survey, excavate | Yes | Yes |
| **Produces informational docs** | framework, instance, source, index, note | No | No (or `actionable: false`) |
| **Meta operations** | resolve, promote, triage | Yes (finds docs) | Updates existing |
| **Router** | loomlib | No | No |

---

## Expectations

### What Each Command Needs

#### Tier 1: Full Discovery + Conducting (3 commands)

**`loomlib:scope.md`** ✅ DONE
- Discovery: Check for surveys on topic
- Output: `actionable: true`, `intent: research`, `upstream: [survey]`

**`loomlib:survey.md`** — NEEDS UPDATE
- Discovery: Check for existing surveys on same topic
- Output: `actionable: true`, `intent: research`, `upstream: []` (surveys start fresh)
- Note: Already has Decisions section from earlier update

**`loomlib:excavate.md`** — NEEDS UPDATE
- Discovery: Check for prior excavations of same term
- Output: `actionable: true`, `intent: research`
- Note: Output is research notes, may produce instance later

#### Tier 2: Conducting Fields Only (5 commands)

**`loomlib:framework.md`** — NEEDS UPDATE
- Discovery: Not needed (frameworks are unique)
- Output: Add `actionable: false` to frontmatter template

**`loomlib:instance.md`** — NEEDS UPDATE
- Discovery: Could check for related frameworks/sources
- Output: `actionable: false` (generic instances are informational)

**`loomlib:source.md`** — NEEDS UPDATE
- Discovery: Not needed
- Output: `actionable: false`

**`loomlib:index.md`** — NEEDS UPDATE
- Discovery: Could query for documents to include
- Output: `actionable: false`

**`loomlib:note.md`** — NEEDS UPDATE
- Discovery: Not needed (raw capture)
- Output: `actionable: false`

#### Tier 3: Meta Operations (3 commands)

**`loomlib:resolve.md`** — NEEDS UPDATE (CRITICAL)
- Discovery: Yes — finds document to resolve via API
- Action: Updates `execution_state: resolved` in target document
- This is the command that CLOSES conducting documents

**`loomlib:promote.md`** — NEEDS UPDATE
- Discovery: Yes — finds document to promote
- Action: Updates `status` field (existing) + could update `execution_state`

**`loomlib:triage.md`** — NEEDS UPDATE
- Discovery: Yes — could show existing docs of each type
- Output: May produce note or route to other command

#### Tier 4: Router (1 command)

**`loomlib.md`** — MINOR UPDATE
- Add note that actionable commands will run Discovery
- No other changes needed

---

## Gaps

| Gap | Type | Description |
|-----|------|-------------|
| **No schema in types.ts** | Blocking | Conducting fields don't exist in app yet |
| **No parsing in vite-plugin** | Blocking | API won't return conducting fields |
| **survey missing Discovery** | Friction | Should check for existing surveys |
| **excavate missing Discovery** | Friction | Should check for prior excavations |
| **resolve doesn't update execution_state** | Friction | Resolution should close out conducting state |
| **Non-actionable commands missing field** | Polish | Should explicitly state `actionable: false` |
| **No API query helper** | Polish | Commands repeat same jq patterns |

---

## Requirements

### Must Have (Blocking → Functional)

#### 1. Schema Implementation

Update `loomlib/src/types.ts`:
```typescript
interface Document {
  // ... existing fields ...

  // Conducting fields (all optional for backward compat)
  actionable?: boolean;
  intent?: 'research' | 'build' | 'configure' | 'deploy' | 'verify' | 'resolve';
  execution_state?: 'pending' | 'in_progress' | 'blocked' | 'completed' | 'resolved';
  upstream?: Array<{ doc: string; relation: string }>;
  downstream?: Array<{ doc: string; relation: string }>;
}
```

*Acceptance: Conducting fields exist in Document interface*

#### 2. Parsing Implementation

Update `loomlib/vite-plugin-docs-api.ts`:
```typescript
function parseMarkdownFile(filePath: string): ApiDocument | null {
  // ... existing parsing ...

  // Add conducting fields
  actionable: data.actionable ?? false,
  intent: data.intent ?? null,
  execution_state: data.execution_state ?? null,
  upstream: Array.isArray(data.upstream) ? data.upstream : [],
  downstream: Array.isArray(data.downstream) ? data.downstream : [],
}
```

*Acceptance: API returns conducting fields, query works*

#### 3. Survey Command Update

Add Discovery section + Conducting frontmatter to `loomlib:survey.md`:
- Query API for existing surveys on topic
- Add conducting fields to output template
- Already has Decisions section

*Acceptance: `/loomlib:survey X` checks for existing surveys first*

#### 4. Excavate Command Update

Add Discovery section + Conducting frontmatter to `loomlib:excavate.md`:
- Query API for prior excavations
- Add conducting fields to output template

*Acceptance: `/loomlib:excavate term` checks for prior excavations*

#### 5. Resolve Command Update

Update `loomlib:resolve.md` to:
- Query API to find document
- Update `execution_state: resolved` when resolving
- Show conducting state in resolution report

*Acceptance: `/loomlib:resolve doc` updates execution_state*

### Should Have (Friction → Pleasant)

#### 6. Non-Actionable Commands

Add `actionable: false` to output templates:
- `loomlib:framework.md`
- `loomlib:source.md`
- `loomlib:index.md`
- `loomlib:note.md`
- `loomlib:instance.md`

*Acceptance: All commands produce documents with explicit actionable field*

#### 7. Promote Command Enhancement

Update `loomlib:promote.md` to optionally update execution_state when promoting.

#### 8. Router Note

Update `loomlib.md` to mention Discovery pattern for actionable commands.

### Could Have (Polish)

#### 9. Shared Discovery Helper

Create reusable jq patterns or document common queries:
```bash
# Find related surveys
alias loomlib-surveys='curl -s http://localhost:5173/api/docs | jq "[.[] | select(.id | contains(\"survey\"))]"'
```

#### 10. Index Command Discovery

`loomlib:index.md` could query API to suggest documents to include in collection.

### Out of Scope

- Execution engine (automatic state transitions)
- Dependency blocking (prevent scope if survey incomplete)
- Cross-document validation
- IndexedDB schema changes (API-only for now)

---

## Implementation Sequence

### Phase 1: Schema + Parsing (Foundation)

1. Update `types.ts` with conducting fields
2. Update `vite-plugin-docs-api.ts` to parse/return fields
3. Update `scripts/generate-seed.ts` for production builds
4. Test: API returns conducting fields for existing docs (defaults)

### Phase 2: Actionable Commands (Core)

1. ✅ `loomlib:scope.md` — already done
2. Update `loomlib:survey.md` — add Discovery, Conducting output
3. Update `loomlib:excavate.md` — add Discovery, Conducting output

### Phase 3: Meta Commands (Completion)

1. Update `loomlib:resolve.md` — update execution_state on resolve
2. Update `loomlib:promote.md` — optionally update execution_state
3. Update `loomlib:triage.md` — API discovery for classification

### Phase 4: Non-Actionable Commands (Consistency)

1. Update `loomlib:framework.md` — add `actionable: false`
2. Update `loomlib:source.md` — add `actionable: false`
3. Update `loomlib:index.md` — add `actionable: false`, optional discovery
4. Update `loomlib:note.md` — add `actionable: false`
5. Update `loomlib:instance.md` — add `actionable: false`

### Phase 5: Polish

1. Update `loomlib.md` router with Discovery note
2. Document common API queries
3. Test end-to-end: survey → scope → resolve cycle

---

## Composition

**Upstream (what informed this scope):**
- [Conducting Frontmatter](fw-conducting-frontmatter) — the schema definition
- [Survey: Conducting Frontmatter Dependencies](inst-survey-conducting-frontmatter-deps) — implementation map
- [Scope: Command Discovery Patterns](inst-scope-command-discovery-patterns) — pattern definition

**Downstream (what this scope enables):**
- Schema implementation in types.ts
- Command template updates
- Working conducting frontmatter system

**Related:**
- [Scope: Conducting Frontmatter Agent POV](inst-scope-conducting-frontmatter-agent-pov) — why this matters

---

## Notes

- This scope covers **command template changes**, not app features
- Schema changes are minimal (optional fields, backward compatible)
- Discovery is guidance to Claude Code, not enforcement
- The resolve command becomes critical — it closes the loop

---

## Verification Checklist

- [x] `types.ts` has conducting fields
- [x] API returns conducting fields
- [x] `loomlib:survey.md` has Discovery section
- [x] `loomlib:excavate.md` has Discovery section
- [x] `loomlib:resolve.md` updates execution_state
- [x] All commands produce conducting frontmatter
- [x] End-to-end test: survey → scope → implement → resolve

---

## Resolution

**Date:** 2026-01-08
**Status:** resolved

### What Was Done

Implemented the conducting frontmatter system as specified in this scope:

**Phase 1 (Schema + Parsing):** ✅
- Added conducting fields to `types.ts`
- Updated `vite-plugin-docs-api.ts` with parsing/serialization

**Phase 2 (Actionable Commands):** ✅
- `loomlib:scope.md` — already done
- `loomlib:survey.md` — added Discovery, Conducting output
- `loomlib:excavate.md` — added Discovery, Conducting output

**Phase 3 (Meta Commands):** ✅
- `loomlib:resolve.md` — updates execution_state on resolve

**Phase 4 (Non-Actionable Commands):** ✅
- Updated framework, instance, source, index, note commands with Discovery + Conducting

**Deviation from scope:** Used `intent` field instead of `actionable` boolean, following the simplified schema in `fw-conducting-frontmatter`. All document types now have Discovery sections, not just "actionable" ones.

### Changes Made

See `fw-conducting-frontmatter` Resolution section for full file list.

### Outcome

All verification criteria met. Conducting frontmatter system is operational.

### Remaining Items

None — scope fully implemented.
