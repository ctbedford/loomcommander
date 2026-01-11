---
description: Create a reusable template for studio content
argument-hint: <format or structure to template>
---

# Studio Template: $ARGUMENTS

You are creating a **template** for the studio content graph.

## What is a Template?

A template is a reusable structure:
- Format that works across multiple pieces
- Consistent structure for a content type
- Applied to scripts, outlines, series

## Protocol

### 1. Discovery

```bash
# Find existing templates
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.type == "template")]'

# Find scripts that might inform this template
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.type == "script") | select(.status == "used")]'
```

### 2. Template Protocol

1. **Identify the pattern** — What structure recurs?
2. **Abstract the sections** — What's consistent vs. variable?
3. **Document the format** — Clear instructions for use
4. **Note variations** — When to deviate from template

### 3. Output Format

```markdown
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: tpl-{slug}
title: "Template: {Format Name}"
type: template
domain: studio
template_id: null
series_id: null
status: draft
tags: []

# ─── CONDUCTING ─────────────────────────────────────────────
intent: build
execution_state: completed
upstream: []
downstream: []
---

# Template: {Format Name}

## Purpose

{What is this template for? When to use it?}

## Structure

### Section 1: {Name}

**Purpose:** {what this section accomplishes}
**Length:** {target duration/words}
**Content:** {what goes here}

### Section 2: {Name}

**Purpose:** {what this section accomplishes}
**Length:** {target duration/words}
**Content:** {what goes here}

### Section 3: {Name}

**Purpose:** {what this section accomplishes}
**Length:** {target duration/words}
**Content:** {what goes here}

## Variations

{When and how to deviate from this structure}

## Examples

{Links to scripts that use this template}

---

## Composition

**What informed this:** {successful scripts, patterns observed}
**What this enables:** {consistent content production}
```

## Output Location

Write to: `loomlib/docs/template/{slug}.md`

---

Now create template: "$ARGUMENTS"
