---
description: Capture raw material as a loomlib note - pre-framework, awaiting triage
argument-hint: [topic or content to capture]
---

# Note: $ARGUMENTS

Generate a note document — raw capture before structuring. Notes are the intake layer.

## Notes Are Pre-Framework

Notes exist because not everything arrives structured. They hold:
- Observations before you know what framework applies
- Fragments that might become instances
- Connections noticed but not yet articulated
- Questions that need a home

## Discovery (before Capture)

Query the loomlib API to find related documents.

### 1. Check for Related Notes

```bash
# Find notes on same or related topics
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "note") | select(.title | test("$ARGUMENTS"; "i")) | {id, title, status}]'
```

### 2. Check for Frameworks That Might Apply

```bash
# Find frameworks that might structure this note later
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "framework") | {id, title, framework_kind}]'
```

### 3. Report & Decide

Based on discovery:

| Finding | Action |
|---------|--------|
| **Related note exists** | Consider merging or linking |
| **Framework might apply** | Note in "Possible Frameworks" section |
| **No related docs** | Proceed fresh |

---

## Required Fields

```yaml
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: note-{slug}
title: {Descriptive Title}
type: note
framework_kind: null
framework_ids: []
source_id: null
output: null
perspective: null
status: incubating
tags: [relevant, tags]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: capture
execution_state: completed
upstream: []
downstream: []
```

## Document Structure

```markdown
# {Title}

**Captured:** {date}
**Status:** incubating

---

## Content

{The actual note content. Can be:
- A quote or passage
- An observation
- A question
- A connection between things
- Raw thinking}

---

## Possible Frameworks

{Which frameworks might apply to this material?}

- [ ] Etymon Method — if there's a term to excavate
- [ ] Diagnostic Frames — if there's a positioning question
- [ ] Invariants/Variants — if there's structural analysis needed
- [ ] {Domain framework} — if a perspective applies

## Connections

{What does this relate to? Other notes, instances, sources?}

## Next Action

{What would move this from note to something else?}
- Needs reading: {source}
- Needs excavation: {term}
- Needs structuring: {framework}
- Needs conversation: {topic}
```

## Note Lifecycle

```
capture → triage → route
                    ├→ instance (if framework applies)
                    ├→ source (if it's reference material)
                    ├→ framework (if it's a new lens)
                    └→ stays note (if still gestating)
```

## Quality Standard

A note doesn't need to be polished. It needs to be:
1. **Captured** — the thought is externalized
2. **Findable** — tags and title allow retrieval
3. **Actionable** — next step is identified, even if not taken

Notes are successful when they become something else or clarify that they're not needed.

## Output

Write the note document to:
`loomlib/docs/note/{slug}.md`

Include YAML frontmatter with all required fields.

## Post-Completion

After writing the note, report:

1. **What was discovered:** Related notes, potential frameworks found
2. **What this captures:** The raw thought or observation
3. **Possible next steps:** Triage to instance, merge with other notes, etc.

Now capture: $ARGUMENTS
