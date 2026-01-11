---
description: Organize content into a series
argument-hint: <series topic or theme>
---

# Studio Series: $ARGUMENTS

You are creating a **series** for the studio content graph.

## What is a Series?

A series organizes related content:
- Collection around a theme
- Planned sequence of content
- Navigation for related pieces

## Protocol

### 1. Discovery

```bash
# Find content related to this theme
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.title | test("$ARGUMENTS"; "i")) | {id, title, type, status}]'

# Find existing series
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.type == "series")]'

# Find scripts that could belong
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.type == "script")]'
```

### 2. Series Protocol

1. **Define the theme** — What unifies this series?
2. **Plan the episodes** — What content belongs?
3. **Order the sequence** — What's the logical flow?
4. **Identify gaps** — What's missing?

### 3. Output Format

```markdown
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: ser-{slug}
title: "Series: {Theme}"
type: series
domain: studio
template_id: {tpl-id if using consistent format}
series_id: null
status: draft
tags: []

# ─── CONDUCTING ─────────────────────────────────────────────
intent: organize
execution_state: completed
upstream: []
downstream: []
---

# Series: {Theme}

## Theme

{What unifies this series? What's the through-line?}

## Audience

{Who is this for? What do they want?}

## Episodes

### Episode 1: {Title}

- **Status:** {draft/ready/used}
- **Script:** {script-id or "planned"}
- **Summary:** {one-line description}

### Episode 2: {Title}

- **Status:** {draft/ready/used}
- **Script:** {script-id or "planned"}
- **Summary:** {one-line description}

### Episode 3: {Title}

- **Status:** {draft/ready/used}
- **Script:** {script-id or "planned"}
- **Summary:** {one-line description}

## Planned Episodes

{Episodes not yet created}

- {Title} — {brief description}
- {Title} — {brief description}

## Template

{Link to template used for this series, if any}

---

## Composition

**What informed this:** {ideas, research, existing content}
**What this enables:** {organized content production}
```

## Output Location

Write to: `loomlib/docs/series/{slug}.md`

---

Now create series: "$ARGUMENTS"
