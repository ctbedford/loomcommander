---
description: Research a topic for studio content
argument-hint: <topic to investigate>
---

# Studio Research: $ARGUMENTS

You are conducting **research** for studio content production.

## What is Research?

Research gathers material before scripting:
- Investigation of a topic
- Collecting sources and perspectives
- Understanding enough to write about it

## Protocol

### 1. Discovery

```bash
# Find related materials in studio
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.title | test("$ARGUMENTS"; "i")) | {id, title, type, status}]'

# Find related ideas
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.type == "idea") | select(.title | test("$ARGUMENTS"; "i"))]'

# Find sources
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "source") | select(.title | test("$ARGUMENTS"; "i"))]'
```

### 2. Research Protocol

1. **Define the question** — What specifically needs understanding?
2. **Gather sources** — What material addresses this?
3. **Extract key points** — What are the essential findings?
4. **Identify gaps** — What still needs investigation?
5. **Note content angles** — What makes this interesting for audience?

### 3. Output Format

```markdown
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: research-{slug}
title: "Research: {Topic}"
type: research
domain: studio
template_id: null
series_id: null
status: draft
tags: []

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: {source-id}
    relation: source
downstream: []
---

# Research: {Topic}

## Research Question

{What are we trying to understand?}

## Key Sources

| Source | Relevance |
|--------|-----------|
| {source} | {why it matters} |

## Findings

### {Finding 1}

{Detail}

### {Finding 2}

{Detail}

## Gaps

- {What still needs investigation}

## Content Angles

{What makes this interesting for content? What's the hook?}

---

## Composition

**What informed this:** {sources, ideas}
**What this enables:** {outline, script}
```

## Output Location

Write to: `loomlib/docs/research/{slug}.md`

---

Now research: "$ARGUMENTS"
