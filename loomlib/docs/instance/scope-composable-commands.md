---
id: inst-scope-composable-commands
title: "Scope: Composable Commands for Emergent Outcomes"
type: instance
framework_kind: null
framework_ids: [fw-scope-method, fw-invariants-variants]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [scope, commands, composition, emergence, ai-orchestration]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-scope-method
    relation: method
  - doc: inst-survey-ai-orchestration-evaluation
    relation: informs
  - doc: idx-conducting-frontmatter-system
    relation: informs
downstream: []
---

# Scope: Composable Commands for Emergent Outcomes

**Date:** 2026-01-08
**Subject:** What commands would enrich loomlib's ability to produce well-composed knowledge?
**Method:** Scope Method + Invariants/Variants

---

## Current State

### Existing Commands (12)

| Command | Intent | What It Does |
|---------|--------|--------------|
| `loomlib` | route | Parse intent, delegate to specialist |
| `loomlib:survey` | research | Investigate before changing |
| `loomlib:scope` | research | Derive UX requirements |
| `loomlib:excavate` | research | Etymological investigation |
| `loomlib:framework` | build | Create reusable method/lens |
| `loomlib:instance` | produce | Apply frameworks to content |
| `loomlib:note` | capture | Raw thought, pre-structure |
| `loomlib:source` | capture | External reference material |
| `loomlib:index` | organize | Curate document collections |
| `loomlib:triage` | meta | Classify document type |
| `loomlib:promote` | workflow | Advance status |
| `loomlib:resolve` | workflow | Close out document |

### Current Document Distribution

| Intent | Count | Commands Serving It |
|--------|-------|---------------------|
| research | 28 | survey, scope, excavate |
| produce | 17 | instance |
| build | 11 | framework |
| organize | 4 | index |
| capture | 3 | note, source |

### What's Working

1. **Discovery protocol** — Commands query existing docs before producing
2. **Typed relationships** — `upstream`/`downstream` create traceable lineage
3. **Specialized protocols** — Each command has its method (Survey Method, Etymon Method, etc.)
4. **Status workflow** — incubating → draft → verified progression

### What's Missing

The commands operate **document-at-a-time**. No commands for:
- Synthesizing across multiple documents
- Surfacing patterns in the graph
- Validating composition quality
- Navigating relationships
- Batch operations

---

## Proposed Commands

### Tier 1: High Impact, High Composability

#### `/loomlib:synthesize`

**Intent:** produce
**What it does:** Combine insights from multiple documents into a new synthesis

```
/loomlib:synthesize inst-excavate-feedback + inst-excavate-system + src-systems-thinking
```

**Protocol:**
1. Discover: Load specified documents + their upstreams
2. Extract: Pull key claims, vocabulary, findings from each
3. Weave: Identify tensions, complements, emergent patterns
4. Output: New instance with all inputs as upstream (relation: `synthesizes`)

**Why it matters:**
- Creates **emergent knowledge** not present in any single document
- Forces explicit integration across research
- Produces higher-order instances

**Relation type needed:** `synthesizes` (new)

---

#### `/loomlib:lineage`

**Intent:** organize
**What it does:** Trace and visualize the production genealogy of a document

```
/loomlib:lineage inst-excavate-feedback
```

**Protocol:**
1. Discover: Walk upstream recursively to sources
2. Walk downstream to what this enables
3. Output: Graph visualization (ASCII or markdown table) + narrative summary

**Why it matters:**
- Makes composition **visible**
- Answers "where did this come from?" and "what does this enable?"
- Validates that lineage claims are accurate

**Output format:**
```
src-systems-thinking
    ↓ [source]
inst-excavate-feedback
    ↓ [informs]
inst-invariants-variants-systems-thinking
```

---

#### `/loomlib:review`

**Intent:** research
**What it does:** Structured review against quality criteria for status promotion

```
/loomlib:review inst-excavate-feedback
```

**Protocol:**
1. Discover: Load document + its claimed upstreams
2. Verify: Check claims against upstream sources
3. Assess: Apply status criteria (draft → verified requires X)
4. Output: Review document with findings, recommendation (promote/revise)

**Why it matters:**
- Currently, promotion is manual and arbitrary
- Structured review creates **quality gates**
- Documents what "verified" actually means

**Quality criteria by type:**
| Type | Verified Requires |
|------|------------------|
| excavate | Etymology sourced, drift documented, recovery claim testable |
| survey | Files accurate, findings reproducible |
| scope | Expectations derived from evidence, gaps actionable |
| instance | Upstream claims verified, operator appropriate |

---

### Tier 2: Medium Impact, Structural

#### `/loomlib:compare`

**Intent:** research
**What it does:** Structured comparison of two or more documents

```
/loomlib:compare inst-excavate-feedback inst-excavate-system
```

**Protocol:**
1. Load documents
2. Align: Match vocabulary, claims, structure
3. Contrast: Identify differences, tensions, complements
4. Output: Comparison table + synthesis opportunities

**Why it matters:**
- VERSUS instances require comparison work
- Makes implicit comparison explicit
- Surfaces where synthesis would be valuable

---

#### `/loomlib:orphans`

**Intent:** organize
**What it does:** Find documents with weak or missing composition

```
/loomlib:orphans
```

**Protocol:**
1. Query all documents
2. Flag: No upstream refs, no downstream refs, missing framework_ids
3. Output: List organized by severity

**Orphan types:**
| Type | Description | Severity |
|------|-------------|----------|
| Rootless | No upstream refs | Medium |
| Dead-end | No downstream refs | Low (might be current work) |
| Unframed | instance with no framework_ids | High |
| Sourceless | Claims without source_id | Medium |

**Why it matters:**
- Surfaces **composition debt**
- Guides where to focus connection work
- Maintains graph health

---

#### `/loomlib:cluster`

**Intent:** organize
**What it does:** Find documents that should be connected but aren't

```
/loomlib:cluster --by tags
/loomlib:cluster --by perspective
```

**Protocol:**
1. Query documents by grouping dimension
2. Within each group, check for missing relationships
3. Suggest: "These 3 documents share tags but have no upstream/downstream links"

**Why it matters:**
- Surfaces **implicit clusters** that should be explicit
- Guides index creation
- Identifies synthesis opportunities

---

### Tier 3: Utility, Workflow

#### `/loomlib:status`

**Intent:** organize
**What it does:** Dashboard of current graph state

```
/loomlib:status
```

**Output:**
```
Documents: 63 total
  - verified: 38 (60%)
  - draft: 15 (24%)
  - incubating: 10 (16%)

By intent:
  - research: 28 (surveys: 15, scopes: 8, excavations: 5)
  - produce: 17
  - build: 11
  - organize: 4
  - capture: 3

Composition health:
  - Orphans: 5 (see /loomlib:orphans)
  - Avg upstream refs: 1.8
  - Most connected: idx-conducting-frontmatter-system (6 upstream)

Incubating needing attention:
  - inst-account (incubating 14 days)
  - inst-corporation (incubating 14 days)
```

**Why it matters:**
- Quick orientation to graph state
- Surfaces what needs attention
- Tracks composition quality over time

---

#### `/loomlib:batch`

**Intent:** workflow
**What it does:** Apply operation to multiple documents

```
/loomlib:batch promote --status draft --tag etymology
/loomlib:batch resolve --execution_state completed --older-than 7d
```

**Protocol:**
1. Query documents matching criteria
2. Preview: Show what would change
3. Confirm: User approves
4. Execute: Apply operation to all

**Why it matters:**
- Currently, every status change is manual
- Batch operations for hygiene tasks
- Dangerous, so requires preview + confirm

---

### Tier 4: Experimental

#### `/loomlib:similar`

**Intent:** research
**What it does:** Find semantically similar documents (when embeddings available)

```
/loomlib:similar inst-excavate-feedback
```

**Protocol:**
1. Compute embedding for target document
2. Find nearest neighbors in vector space
3. Output: Ranked list with similarity scores

**Why it matters:**
- Discovery beyond text matching
- Surfaces unexpected connections
- Enables "more like this" exploration

**Dependency:** Requires embeddings implementation (currently `available: false`)

---

#### `/loomlib:contradict`

**Intent:** research
**What it does:** Find documents that might contradict or tension with target

```
/loomlib:contradict inst-excavate-feedback
```

**Protocol:**
1. Extract key claims from target
2. Search for documents with opposing vocabulary/claims
3. Output: Potential tensions to investigate

**Why it matters:**
- Surfaces **productive conflict**
- Prevents echo chamber composition
- Guides VERSUS instance creation

---

## Composition Quality Metrics

If these commands existed, we could track:

| Metric | What It Measures | Target |
|--------|-----------------|--------|
| **Orphan rate** | % docs with no upstream | < 10% |
| **Dead-end rate** | % docs with no downstream | < 30% |
| **Avg composition depth** | Mean upstream chain length | > 2 |
| **Synthesis ratio** | Syntheses / total instances | > 10% |
| **Verification rate** | % docs verified | > 60% |
| **Review coverage** | % docs with review document | > 50% |

---

## Implementation Priority

| Command | Impact | Complexity | Priority |
|---------|--------|------------|----------|
| `synthesize` | High | Medium | 1 |
| `lineage` | High | Low | 1 |
| `review` | High | Medium | 1 |
| `orphans` | Medium | Low | 2 |
| `status` | Medium | Low | 2 |
| `compare` | Medium | Medium | 2 |
| `cluster` | Medium | Medium | 3 |
| `batch` | Medium | Medium | 3 |
| `similar` | High | High (needs embeddings) | 4 |
| `contradict` | Medium | High | 4 |

---

## New Relation Types Needed

| Relation | Meaning | Used By |
|----------|---------|---------|
| `synthesizes` | Combined multiple docs into new insight | synthesize |
| `reviews` | Quality assessment of target | review |
| `compares` | Structured comparison | compare |
| `tensions` | Identified contradiction | contradict |

---

## The Emergence Thesis

**Current state:** Commands produce documents that link to each other.

**With these additions:** Commands can:
- **Synthesize** — create knowledge not in any single document
- **Navigate** — trace how knowledge was composed
- **Validate** — verify composition quality
- **Surface** — find patterns, gaps, tensions

**Emergence happens when:**
1. Synthesis creates higher-order instances
2. Lineage reveals unexpected dependencies
3. Review forces quality through verification
4. Orphan detection maintains graph health
5. Cluster discovery surfaces implicit structure

**The composable pattern:**
```
/loomlib:survey topic →
/loomlib:excavate TERM →
/loomlib:synthesize survey + excavation →
/loomlib:review synthesis →
/loomlib:promote synthesis verified
```

Each command's output feeds the next. The graph grows richer. Emergence compounds.

---

## Composition

**Upstream (what informed this scope):**
- [Scope Method](fw-scope-method) — structured requirements derivation
- [Invariants/Variants](fw-invariants-variants) — what's fixed vs open
- [Survey: AI Orchestration Evaluation](inst-survey-ai-orchestration-evaluation) — what patterns excel
- [Index: Conducting Frontmatter System](idx-conducting-frontmatter-system) — current architecture

**Downstream (what this enables):**
- Implementation of priority 1 commands
- Command template development
- Composition health dashboard

**Decision needed:**
Which commands to implement first? Recommendation: `synthesize`, `lineage`, `review` as a coherent trio that enables verification of emergent composition.
