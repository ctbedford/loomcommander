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

## Required Fields

```yaml
id: note-{slug}
title: {Descriptive Title}
type: note
status: incubating
tags: [relevant, tags]
candidates: [possible frameworks that might apply]
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

## Output

Write the note document to:
`loomlib/docs/note/{slug}.md`

## Quality Standard

A note doesn't need to be polished. It needs to be:
1. **Captured** — the thought is externalized
2. **Findable** — tags and title allow retrieval
3. **Actionable** — next step is identified, even if not taken

Notes are successful when they become something else or clarify that they're not needed.

Now capture: $ARGUMENTS
