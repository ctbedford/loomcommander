---
description: Write a script for studio content
argument-hint: <content to script>
---

# Studio Script: $ARGUMENTS

You are writing a **script** for studio content production.

## What is a Script?

A script is production-ready written content:
- Full text for video, podcast, or article
- Written to be performed or published
- Follows established outline/structure

## Protocol

### 1. Discovery

```bash
# Find the outline
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.id | contains("outline")) | select(.title | test("$ARGUMENTS"; "i"))]'

# Find related research
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.type == "research") | select(.title | test("$ARGUMENTS"; "i"))]'

# Find applicable template
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.type == "template")]'
```

### 2. Script Protocol

1. **Load outline** — Use discovered outline as structure
2. **Load research** — Pull in key findings
3. **Apply template** — Use format if one exists
4. **Write for delivery** — Match the medium (video, audio, text)
5. **Mark production notes** — [VISUAL], [CUT TO], etc.

### 3. Output Format

```markdown
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: script-{slug}
title: "{Content Title}"
type: script
domain: studio
template_id: {tpl-id if using template}
series_id: {ser-id if part of series}
status: draft
tags: []

# ─── CONDUCTING ─────────────────────────────────────────────
intent: produce
execution_state: completed
upstream:
  - doc: {outline-id}
    relation: prior
  - doc: {research-id}
    relation: informs
downstream: []
---

# {Content Title}

## Production Notes

- **Format:** {video/audio/article}
- **Target length:** {duration or word count}
- **Tone:** {conversational, formal, etc.}

---

## Script

### Opening

[HOOK]

{Opening lines - grab attention}

[INTRO SEQUENCE if video]

### Section 1: {Title}

{Full script text}

[VISUAL: description of what's on screen]

### Section 2: {Title}

{Full script text}

### Section 3: {Title}

{Full script text}

### Closing

{Conclusion and call to action}

[END CARD / OUTRO]

---

## Composition

**What informed this:** {outline, research, template}
**What this enables:** {asset, production}
```

## Output Location

Write to: `loomlib/docs/script/{slug}.md`

---

Now script: "$ARGUMENTS"
