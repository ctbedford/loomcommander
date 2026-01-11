---
description: Synthesize multiple documents into emergent insight
argument-hint: <doc-id-1> + <doc-id-2> [+ <doc-id-3>...]
---

# Synthesize: $ARGUMENTS

Combine insights from multiple documents into a new synthesis that creates knowledge not present in any single source.

## The Synthesis Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                     SYNTHESIS                               │
│                                                             │
│   [doc-1] ──┐                                              │
│             ├──→ [extract] ──→ [weave] ──→ [synthesis]    │
│   [doc-2] ──┤                                              │
│             │         ↑                                     │
│   [doc-3] ──┘    tensions, complements, patterns           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Discovery

Parse "$ARGUMENTS" to extract document IDs (separated by `+`).

### 1. Load Source Documents

```bash
# For each document ID, fetch full content
curl -s http://localhost:5173/api/docs | jq '.[] | select(.id == "doc-id-1")'
```

### 2. Load Their Upstreams

```bash
# Get transitive context
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.id == "doc-id-1") | .upstream[].doc] | unique'
```

### 3. Check for Existing Synthesis

```bash
# Has this combination been synthesized before?
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.title | test("synthesis"; "i"))]'
```

---

## Protocol

### 1. Extract

For each source document, extract:
- **Key claims** — The core assertions
- **Vocabulary** — Important terms and definitions
- **Findings** — Conclusions or results
- **Open questions** — What remains unresolved

### 2. Align

Map relationships between sources:
- **Shared vocabulary** — Same terms, same meaning?
- **Complementary claims** — Different aspects of same phenomenon?
- **Contradictory claims** — Genuine tension?
- **Causal relationships** — Does one explain another?

### 3. Weave

Identify emergent patterns:
- What becomes visible when sources are combined?
- What tensions demand resolution?
- What new questions arise?
- What higher-order insight emerges?

### 4. Synthesize

Produce the synthesis document with:
- Clear statement of what was combined
- The emergent insight (not just summary)
- How sources relate to each other
- What this synthesis enables

---

## Output Format

Write to: `loomlib/docs/instance/synthesis-{slug}.md`

```markdown
---
id: inst-synthesis-{slug}
title: "Synthesis: {Topic}"
type: instance
framework_kind: null
framework_ids: []
source_id: null
output: null
perspective: null
status: draft
tags: [synthesis, {relevant}, {tags}]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: produce
execution_state: completed
upstream:
  - doc: {source-doc-1}
    relation: synthesizes
  - doc: {source-doc-2}
    relation: synthesizes
  - doc: {source-doc-3}
    relation: synthesizes
downstream: []
---

# Synthesis: {Topic}

**Date:** {date}
**Sources synthesized:**
- [{Doc 1 Title}]({doc-1-id})
- [{Doc 2 Title}]({doc-2-id})
- [{Doc 3 Title}]({doc-3-id})

---

## The Emergent Insight

{What becomes visible when these sources are combined? This is NOT a summary — it's what you couldn't see from any single source.}

---

## Source Contributions

### From {Doc 1}
- Key claim: {what this doc contributed}
- Vocabulary: {terms that matter}

### From {Doc 2}
- Key claim: {what this doc contributed}
- Vocabulary: {terms that matter}

### From {Doc 3}
- Key claim: {what this doc contributed}
- Vocabulary: {terms that matter}

---

## Alignments

### Shared Ground
{Where sources agree or complement each other}

### Productive Tensions
{Where sources disagree or create useful friction}

### Causal Relationships
{Where one source explains or extends another}

---

## The Weave

{How the sources combine into something new. The pattern that emerges.}

---

## What This Enables

- {What can now be done that couldn't before}
- {What questions this opens}
- {What instances this could inform}

---

## Composition

**Upstream (synthesized sources):**
- [{Doc 1}]({id-1}) — synthesizes
- [{Doc 2}]({id-2}) — synthesizes
- [{Doc 3}]({id-3}) — synthesizes

**Downstream (what this enables):**
- Further instances building on this synthesis
- New research directions identified
```

---

## Quality Criteria

A good synthesis:
- Creates insight not present in any single source
- Makes explicit how sources relate (not just lists them)
- Identifies tensions and resolves or preserves them productively
- Opens new questions rather than just closing old ones

A bad synthesis:
- Is just a summary of each source
- Misses obvious connections between sources
- Forces agreement where genuine tension exists
- Doesn't identify what's new

---

## Examples

```
/loomlib:synthesize inst-excavate-feedback + src-systems-thinking
→ Synthesizes the FEEDBACK excavation with the Systems Thinking source
→ Might reveal: "Feedback lost its loop when it left engineering"

/loomlib:synthesize inst-survey-loomlib + inst-survey-ai-orchestration-evaluation
→ Combines internal architecture survey with external evaluation
→ Might reveal: architectural decisions that align with best practices

/loomlib:synthesize fw-etymon-method + fw-four-knowings
→ Combines two frameworks
→ Might reveal: how etymological recovery requires all four knowings
```

---

Now synthesize: $ARGUMENTS
