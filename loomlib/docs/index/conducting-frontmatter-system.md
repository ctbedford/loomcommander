---
id: idx-conducting-frontmatter-system
title: "Index: Conducting Frontmatter System"
type: index
framework_kind: null
framework_ids: []
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [index, conducting, frontmatter, discovery, commands, composition]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: organize
execution_state: in_progress
upstream: 
  - doc: fw-conducting-frontmatter
    relation: defines
  - doc: inst-survey-conducting-frontmatter-deps
    relation: informs
  - doc: inst-scope-command-discovery-patterns
    relation: informs
  - doc: inst-scope-conducting-frontmatter-agent-pov
    relation: informs
  - doc: inst-scope-conducting-frontmatter-implementation
    relation: informs
  - doc: inst-survey-conducting-frontmatter-implementation
    relation: informs
downstream: []
---

# Index: Conducting Frontmatter System

**Purpose:** Organize and summarize the conducting frontmatter system for loomlib — what it is, why it matters, and how commands use it.

---

## The Core Idea

Every loomlib command produces a document. Every document:
- **Was informed by something** (frameworks, surveys, sources, notes)
- **Enables something** (scopes, implementations, other instances)
- **Has production state** (pending → completed → resolved)

**Conducting frontmatter** makes this explicit and queryable.

---

## The Two Innovations

### 1. Discovery Protocol

Before producing any document, Claude Code queries the loomlib API:

```bash
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.title | test("topic"; "i"))]'
```

This enables **composition by discovery**:
- A survey command discovers related frameworks, prior surveys, relevant notes
- A scope command discovers surveys that inform the feature being scoped
- An instance command discovers frameworks to apply and sources to reference

**Discovery makes documents composable.** Instead of isolated production, each command can blend relevant context from the existing knowledge graph.

### 2. Conducting Fields

Four fields extend every document's frontmatter:

```yaml
intent: research | build | capture | organize | produce
execution_state: pending | in_progress | completed | resolved
upstream:
  - doc: {document-id}
    relation: informs | method | source | prior
downstream: []
```

**These fields answer:**
- What kind of production is this? (`intent`)
- Where is it in its lifecycle? (`execution_state`)
- What informed it? (`upstream`)
- What does it enable? (`downstream`)

---

## How Commands Use This

### The Universal Pattern

Every document-producing command follows:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DISCOVERY                                                │
│    Query API for related documents                          │
│    Report what exists, what state it's in                   │
│    Decide what to reference as upstream                     │
├─────────────────────────────────────────────────────────────┤
│ 2. PROTOCOL                                                 │
│    Execute the method (Survey Method, Scope Method, etc.)   │
│    Informed by discovered documents                         │
├��────────────────────────────────────────────────────────────┤
│ 3. OUTPUT                                                   │
│    Write document with conducting frontmatter               │
│    Include upstream references from discovery               │
├─────────────────────────────────────────────────────────────┤
│ 4. COMPOSITION REPORT                                       │
│    What informed this document                              │
│    What this document enables                               │
│    Related documents discovered but not used                │
└─────────────────────────────────────────────────────────────┘
```

### Example: Survey Informed by Frameworks

```
User: /loomlib:survey editor persistence

DISCOVERY:
├── Query: surveys about "editor"
│   └── Found: inst-survey-editor-implementation (verified)
├── Query: frameworks that might apply
│   └── Found: fw-survey-method (method to use)
├── Query: related scopes/notes
│   └── Found: inst-scope-editor-view (related feature)
│
│ Report: "Found prior survey on editor implementation.
│          Will reference as upstream context."

PROTOCOL:
├── Survey Method steps, informed by:
│   └── Prior survey findings (what's already known)
│   └── Related scope (what UX decisions exist)

OUTPUT:
├── survey-editor-persistence.md
├── upstream:
│   ├── inst-survey-editor-implementation (informs)
│   └── fw-survey-method (method)

COMPOSITION:
├── Upstream: Prior editor survey provided file mapping
├── Downstream: Enables scope-editor-persistence
├── Related: scope-editor-view (different feature, same area)
```

### Example: Scope Informed by Survey

```
User: /loomlib:scope editor persistence

DISCOVERY:
├── Query: surveys about "editor persistence"
│   └── Found: inst-survey-editor-persistence (completed)
├── Query: existing scopes
│   └── Found: inst-scope-editor-view (related)
│
│ Report: "Found completed survey. Will use as upstream."

PROTOCOL:
├── Scope Method steps, informed by:
│   └── Survey findings (file locations, architecture)
│   └── Survey open questions (what needs decision)

OUTPUT:
├── scope-editor-persistence.md
├── upstream:
│   ├── inst-survey-editor-persistence (informs)
│   └── fw-scope-method (method)

COMPOSITION:
├── Upstream: Survey provided implementation context
├── Downstream: Enables implementation work
```

---

## The Schema

### Conducting Fields

| Field | Type | Values | Purpose |
|-------|------|--------|---------|
| `intent` | enum | research, build, capture, organize, produce | What kind of production |
| `execution_state` | enum | pending, in_progress, completed, resolved | Lifecycle state |
| `upstream` | array | `[{doc, relation}]` | What informed this |
| `downstream` | array | `[{doc, relation}]` | What this enables |

### Intent by Document Type

| Document | Intent | Discovery Looks For |
|----------|--------|---------------------|
| **survey** | research | Prior surveys, related scopes, frameworks |
| **scope** | research | Surveys on topic, related scopes |
| **excavate** | research | Prior excavations, sources, etymology frameworks |
| **framework** | build | Related frameworks, sources |
| **instance** | produce | Frameworks to apply, sources to reference |
| **source** | capture | Related sources |
| **note** | capture | Related notes, potential frameworks |
| **index** | organize | Documents to include |

### Relation Types

| Relation | Meaning | Example |
|----------|---------|---------|
| `informs` | Content shaped output | Survey → Scope |
| `method` | Framework guided production | fw-scope-method → scope |
| `source` | Reference material used | src-aristotle → instance |
| `prior` | Earlier version or related | survey-v1 → survey-v2 |

---

## Implementation State

### Completed ✅

- [x] Framework defined: `fw-conducting-frontmatter`
- [x] Schema in `types.ts` — `DocumentIntent`, `ExecutionState`, `UpstreamRef` types
- [x] Parsing in `vite-plugin-docs-api.ts` — parse/serialize conducting fields
- [x] All commands updated with Discovery + Conducting output (8 commands)
- [x] Resolve command updates `execution_state`
- [x] All related documents resolved

### Resolved: 2026-01-08

The conducting frontmatter system is fully implemented. All documents in this index have been resolved.

---

## Document Collection

### Framework

| Document | Purpose |
|----------|---------|
| [fw-conducting-frontmatter](fw-conducting-frontmatter) | The schema definition — what fields, what they mean |

### Surveys & Scopes

| Document | Purpose |
|----------|---------|
| [inst-survey-conducting-frontmatter-deps](inst-survey-conducting-frontmatter-deps) | Implementation map — which files change, in what order |
| [inst-scope-conducting-frontmatter-agent-pov](inst-scope-conducting-frontmatter-agent-pov) | Agent perspective — what Claude Code needs, how it helps |
| [inst-scope-command-discovery-patterns](inst-scope-command-discovery-patterns) | Command patterns — how Discovery works in templates |
| [inst-scope-conducting-frontmatter-implementation](inst-scope-conducting-frontmatter-implementation) | Implementation scope — what to build, in what order |

### Updated Commands

| Command | State |
|---------|-------|
| `loomlib:scope.md` | ✅ Has Discovery + Conducting |
| `loomlib:survey.md` | ✅ Has Discovery + Conducting |
| `loomlib:instance.md` | ✅ Has Discovery + Conducting |
| `loomlib:framework.md` | ✅ Has Discovery + Conducting |
| `loomlib:note.md` | ✅ Has Discovery + Conducting |
| `loomlib:source.md` | ✅ Has Discovery + Conducting |
| `loomlib:index.md` | ✅ Has Discovery + Conducting |
| `loomlib:excavate.md` | ✅ Has Discovery + Conducting |
| `loomlib:resolve.md` | ✅ Updates execution_state |

---

## Why This Matters

### Before: Isolated Production

```
Command receives $ARGUMENTS
Command follows protocol
Command writes document
(No awareness of what exists)
```

### After: Composed Production

```
Command receives $ARGUMENTS
Command discovers related documents via API
Command follows protocol, informed by discoveries
Command writes document with upstream references
Command reports composition
```

### The Key Insight

**Loomlib is a knowledge graph.** Documents aren't isolated — they inform each other:
- Frameworks produce instances
- Surveys inform scopes
- Scopes enable implementations
- Sources ground excavations

**Conducting frontmatter makes this graph explicit.** Discovery queries it. Upstream/downstream edges track it. The constellation view can visualize it.

**Claude Code becomes graph-aware.** Instead of producing documents in isolation, each command:
1. Queries the graph for relevant context
2. Blends that context into production
3. Records its place in the graph

This is **knowledge work as graph construction** — each document strengthens the network.

---

## Quick Reference

### For Command Authors

Add to your command template:

```markdown
## Discovery

Query API for related documents:
1. `curl -s http://localhost:5173/api/docs | jq '[.[] | select(.title | test("{topic}"; "i"))]'`
2. Report what exists
3. Decide what to reference as upstream
```

Add to your output template:

```yaml
# ─── CONDUCTING ─────────────────────────────────────────────
intent: {research|build|capture|organize|produce}
execution_state: completed
upstream:
  - doc: {discovered-doc}
    relation: {informs|method|source|prior}
downstream: []
```

### For Document Consumers

Query documents by state:
```bash
# Find completed surveys
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.intent == "research") | select(.execution_state == "completed")]'

# Find what informed a document
curl -s http://localhost:5173/api/docs | jq '.[] | select(.id == "inst-scope-X") | .upstream'
```

### For Resolving Work

When work is complete:
```
/loomlib:resolve inst-scope-editor-persistence
```

This updates `execution_state: resolved` and closes the production loop.

---

## Summary

| Concept | Implementation |
|---------|----------------|
| **Every doc is actionable** | All commands produce output |
| **Discovery before production** | Query API for related docs |
| **Composition is explicit** | `upstream`/`downstream` fields |
| **State is tracked** | `execution_state` field |
| **Graph is queryable** | API returns all fields |
| **Resolution closes loops** | `/loomlib:resolve` command |

**The system enables:** Informed production, explicit composition, queryable state, visible genealogy.