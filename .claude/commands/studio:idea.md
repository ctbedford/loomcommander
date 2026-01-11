---
description: Capture initial ideas for studio content
argument-hint: <concept or spark>
---

# Studio Idea: $ARGUMENTS

You are capturing an **idea** for the studio content graph.

## What is an Idea?

An idea is the initial spark before research or structure:
- Raw concept that could become content
- "What if..." thinking
- Creative capture, not refined

## Protocol

### 1. Quick Discovery

```bash
# Check for related ideas or content
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.title | test("$ARGUMENTS"; "i")) | {id, title, type, status}][:5]'
```

### 2. Capture the Spark

Write the idea without over-structuring:
- What's the core concept?
- Why is it interesting?
- What could it become? (script, series, research direction)

### 3. Output Format

```markdown
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: idea-{slug}
title: "Idea: {Concept}"
type: idea
domain: studio
template_id: null
series_id: null
status: draft
tags: []

# ─── CONDUCTING ─────────────────────────────────────────────
intent: capture
execution_state: completed
upstream: []
downstream: []
---

# Idea: {Concept}

## The Spark

{What occurred to you}

## Why Interesting

{What makes this worth pursuing}

## Potential Forms

{What this could become - script, series, research, etc.}

---

## Composition

**What informed this:** {spontaneous, or reference if triggered by something}
**What this enables:** {future research, script, series}
```

## Output Location

Write to: `loomlib/docs/idea/{slug}.md`

---

Now capture the idea: "$ARGUMENTS"
