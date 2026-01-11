---
id: fw-conducting-frontmatter
title: Conducting Frontmatter
type: framework
framework_kind: toolkit
framework_ids: []
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [frontmatter, orchestration, discovery, claude-code, schema]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: build
execution_state: resolved
upstream: []
downstream:
  - doc: inst-scope-conducting-frontmatter-implementation
    relation: informs
  - doc: inst-survey-conducting-frontmatter-implementation
    relation: informs
---
# Conducting Frontmatter

**Type:** Toolkit Framework
**Purpose:** Extend frontmatter so Claude Code can discover related documents and track production flow

---

## The Core Insight

Every loomlib command produces a document. Every document:
- Was informed by something (upstream)
- Enables something (downstream)
- Has production state (status + execution)

**Descriptive frontmatter** answers: *What is this?*
**Conducting frontmatter** answers: *What produced this? What does it enable?*

---

## The Two Additions

### 1. Discovery (Before Production)

Before creating a document, query the API for related work:

```bash
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.title | test("topic"; "i"))]'
```

This answers:
- Does related work already exist?
- What should this document reference as upstream?
- Am I duplicating effort?

### 2. Conducting Fields (In Output)

Add fields that track production flow:

```yaml
# ─── CONDUCTING ─────────────────────────────────────────────
intent: research | build | capture | organize | produce
execution_state: pending | in_progress | completed | resolved
upstream:
  - doc: inst-survey-editor
    relation: informs
downstream: []
```

---

## The Schema

### Conducting Fields

```yaml
# Every document gets these (extend existing frontmatter)

intent: research | build | capture | organize | produce
# What kind of production is this?
# research  = understanding before acting (survey, scope, excavate)
# build     = creating reusable artifact (framework)
# capture   = recording material (source, note)
# organize  = curating existing docs (index)
# produce   = applying frameworks to make content (instance)

execution_state: pending | in_progress | completed | resolved
# Where is this document in its lifecycle?
# pending     = not yet started (rare for docs created by commands)
# in_progress = being worked on
# completed   = done, available for downstream use
# resolved    = closed out via /loomlib:resolve

upstream:
  - doc: {document-id}
    relation: informs | method | source | prior
# What documents informed this one?
# informs = content from this doc shaped the output
# method  = framework that guided production
# source  = reference material used
# prior   = earlier version or related work

downstream: []
# What does this document enable?
# Populated when other docs reference this as upstream
```

### Intent by Document Type

| Document Type | Intent | Typical Upstream |
|---------------|--------|------------------|
| **survey** | research | prior surveys, related scopes |
| **scope** | research | surveys on topic |
| **excavate** | research | prior excavations, sources |
| **framework** | build | other frameworks, sources |
| **instance** | produce | frameworks (method), sources |
| **source** | capture | (external material) |
| **note** | capture | (raw thought) |
| **index** | organize | documents being indexed |

### Full Frontmatter Example

```yaml
---
# ─── DESCRIPTIVE (existing) ─────────────────────────────────
id: inst-scope-editor-persistence
title: "Scope: Editor Persistence"
type: instance
framework_kind: null
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [scope, editor, persistence]

# ─── CONDUCTING (new) ───────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: inst-survey-editor-persistence
    relation: informs
  - doc: fw-scope-method
    relation: method
downstream: []
---
```

---

## The Command Pattern

Every loomlib command follows this pattern:

### 1. Discovery

```markdown
## Discovery

Query API for related documents:

1. **Check for related work:**
   ```bash
   curl -s http://localhost:5173/api/docs | jq '[.[] | select(.title | test("{topic}"; "i"))]'
   ```

2. **Report findings:**
   - What exists
   - What state it's in (status, execution_state)
   - Whether to use as upstream

3. **Decide:**
   - Reference existing work as upstream
   - Or proceed fresh if nothing relevant
```

### 2. Protocol

(The existing method steps — Survey Method, Scope Method, etc.)

### 3. Output with Conducting Fields

```yaml
---
# Descriptive fields...

# Conducting fields
intent: {appropriate for this type}
execution_state: completed
upstream:
  - doc: {discovered-doc-id}
    relation: {relationship}
downstream: []
---
```

### 4. Composition Report

```markdown
## Composition

**Upstream (what informed this):**
- [Doc Title](doc-id) — what it contributed

**Downstream (what this enables):**
- Next steps, related work

**Related (discovered but not upstream):**
- Other docs found during discovery
```

---

## How Claude Code Uses This

### During Production

1. **Discovery phase** queries API
2. **Protocol phase** follows method
3. **Output phase** writes conducting fields
4. **Report phase** explains composition

### When Resolving

`/loomlib:resolve` updates:
```yaml
execution_state: resolved
```

This closes the production loop.

### For Finding Work

Query for documents by state:
```bash
# Find pending work
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.execution_state == "pending")]'

# Find completed surveys (ready for scoping)
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.id | contains("survey")) | select(.execution_state == "completed")]'
```

---

## The Minimal Schema

For implementation, these fields extend the Document interface:

```typescript
interface Document {
  // ... existing fields ...

  // Conducting fields (all optional, backward compatible)
  intent?: 'research' | 'build' | 'capture' | 'organize' | 'produce';
  execution_state?: 'pending' | 'in_progress' | 'completed' | 'resolved';
  upstream?: Array<{ doc: string; relation: string }>;
  downstream?: Array<{ doc: string; relation: string }>;
}
```

**Defaults for documents without conducting fields:**
- `intent`: inferred from type (survey→research, framework→build, etc.)
- `execution_state`: 'completed' (existing docs are assumed done)
- `upstream`: [] (no tracked lineage)
- `downstream`: [] (no tracked dependents)

---

## What We Removed

The original framework was over-engineered. Removed:

| Removed | Why |
|---------|-----|
| `actionable: true/false` | All documents are actionable — they all produce output |
| `entrypoint`, `trigger` | Commands already have protocols; don't need meta-protocol |
| `requires.files`, `requires.tools` | Over-specification; Discovery handles this naturally |
| `completion.criteria` | Document body already has acceptance criteria |
| `execution.attempts`, `last_error` | Debugging state belongs in resolution, not frontmatter |
| Complex `outputs` object | `downstream` captures this simply |

**What remains is minimal:**
- `intent` — what kind of production
- `execution_state` — where in lifecycle
- `upstream` — what informed this
- `downstream` — what this enables

---

## The Value

### For Claude Code

1. **Discovery** — Know what exists before producing
2. **Composition** — Reference upstream work explicitly
3. **State** — Track what's done vs pending
4. **Flow** — See production genealogy

### For Humans

1. **Visibility** — See document state at a glance
2. **Lineage** — Understand what produced what
3. **Navigation** — Follow upstream/downstream links

### For the System

1. **Queryable** — Filter by intent, state, relationships
2. **Graphable** — Constellation can show production flow
3. **Closeable** — Resolve command marks work complete

---

## Implementation

### Phase 1: Schema + Parsing

1. Add fields to `types.ts`
2. Parse in `vite-plugin-docs-api.ts`
3. Parse in `scripts/generate-seed.ts`

### Phase 2: Commands

1. Add Discovery section to all document-producing commands
2. Add conducting fields to output templates
3. Add Composition section to outputs

### Phase 3: Resolution

1. Update `/loomlib:resolve` to set `execution_state: resolved`
2. Optionally update downstream references

---

## Framework Status

**Status:** verified

**Verification criteria:**
- [x] Schema implemented in types.ts
- [x] API returns conducting fields
- [x] All commands have Discovery section
- [x] All commands output conducting fields
- [x] Resolve command updates execution_state

**Verified:** End-to-end flow works (survey → scope → resolve)

---

## Resolution

**Date:** 2026-01-08
**Status:** resolved

### What Was Done

Full implementation of conducting frontmatter system:

1. **Schema** (`types.ts`): Added `DocumentIntent`, `ExecutionState`, `RelationType`, `UpstreamRef` types and extended `Document` interface with 4 optional fields
2. **Parsing** (`vite-plugin-docs-api.ts`): Added parsing and serialization of conducting fields with backward-compatible defaults
3. **Commands**: Updated 8 commands with Discovery sections and Conducting output templates
4. **Resolution**: Updated resolve command to set `execution_state: resolved`

### Changes Made

- `loomlib/src/types.ts` — conducting field types and Document extension
- `loomlib/vite-plugin-docs-api.ts` — parse/serialize conducting frontmatter
- `.claude/commands/loomlib:survey.md` — added Discovery section
- `.claude/commands/loomlib:instance.md` — added Discovery + Conducting
- `.claude/commands/loomlib:framework.md` — added Discovery + Conducting
- `.claude/commands/loomlib:note.md` — added Discovery + Conducting
- `.claude/commands/loomlib:source.md` — added Discovery + Conducting
- `.claude/commands/loomlib:index.md` — added Discovery + Conducting
- `.claude/commands/loomlib:excavate.md` — added Discovery + Conducting
- `.claude/commands/loomlib:resolve.md` — added execution_state update

### Outcome

Conducting frontmatter system is fully operational. Commands query API for related documents, output conducting frontmatter, and report composition.

### Remaining Items

None — all verification criteria met.
