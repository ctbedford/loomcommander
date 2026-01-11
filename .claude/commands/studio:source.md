---
description: Document a source for studio content
argument-hint: <source material to document>
---

# Studio Source: $ARGUMENTS

You are documenting a **source** for the studio content graph.

## What is a Source?

A source is external reference material:
- Book, article, video, interview
- Material that informs content
- Citable reference

## Protocol

### 1. Discovery

```bash
# Check if source already exists
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "source") | select(.title | test("$ARGUMENTS"; "i"))]'

# Find content that might reference this
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.type == "research" or .type == "script")]'
```

### 2. Source Protocol

1. **Identify the material** — What is this source?
2. **Extract key insights** — What's useful for content?
3. **Note quotables** — What can be cited?
4. **Assess relevance** — What content could use this?

### 3. Output Format

```markdown
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: src-{slug}
title: "{Author}: {Title}"
type: source
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

# {Author}: {Title}

## Source Information

- **Author:** {name}
- **Title:** {full title}
- **Type:** {book/article/video/interview/etc.}
- **Date:** {publication date}
- **Link:** {URL if available}

## Summary

{Brief overview of the source}

## Key Insights

### {Insight 1}

{Detail with page/timestamp reference}

### {Insight 2}

{Detail with page/timestamp reference}

## Quotables

> "{Direct quote that could be used in content}"
> — {attribution}

> "{Another useful quote}"
> — {attribution}

## Relevance

{What content could use this source? What topics does it inform?}

---

## Composition

**What informed this:** {discovery, research need}
**What this enables:** {research, scripts that can cite this}
```

## Output Location

Write to: `loomlib/docs/source/{slug}.md`

---

Now document source: "$ARGUMENTS"
