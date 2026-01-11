---
description: Outline content structure before scripting
argument-hint: <content to outline>
---

# Studio Outline: $ARGUMENTS

You are creating an **outline** for studio content.

## What is an Outline?

An outline structures content before full scripting:
- Logical flow of the piece
- Key beats and sections
- Enough structure to write from

## Protocol

### 1. Discovery

```bash
# Find related research
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.type == "research") | select(.title | test("$ARGUMENTS"; "i"))]'

# Find applicable templates
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.type == "template")]'

# Find series this might belong to
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.type == "series")]'
```

### 2. Outline Protocol

1. **Hook** — What draws the audience in?
2. **Setup** — What context is needed?
3. **Main beats** — What are the key points/sections?
4. **Payoff** — What's the conclusion or call to action?
5. **Logistics** — Estimated length, format, assets needed

### 3. Output Format

```markdown
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: outline-{slug}
title: "Outline: {Content Title}"
type: research
domain: studio
template_id: {tpl-id if using template}
series_id: {ser-id if part of series}
status: draft
tags: []

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: {research-id}
    relation: prior
downstream: []
---

# Outline: {Content Title}

## Hook

{What grabs attention? First 30 seconds / opening paragraph}

## Setup

{Context needed before main content}

## Main Beats

### Beat 1: {Title}

- Key point
- Supporting detail
- Transition to next

### Beat 2: {Title}

- Key point
- Supporting detail
- Transition to next

### Beat 3: {Title}

- Key point
- Supporting detail

## Payoff

{Conclusion, takeaway, or call to action}

## Logistics

- **Format:** {video, article, etc.}
- **Length:** {estimated}
- **Assets needed:** {visuals, b-roll, etc.}

---

## Composition

**What informed this:** {research, template}
**What this enables:** {script}
```

## Output Location

Write to: `loomlib/docs/research/{slug}.md` (outlines are research-type)

---

Now outline: "$ARGUMENTS"
