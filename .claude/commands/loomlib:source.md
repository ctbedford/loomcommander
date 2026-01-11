---
description: Document a source in loomlib - external reference material
argument-hint: [Author] - [Title] or [description of source]
---

# Source: $ARGUMENTS

Generate a source document — reference material that informs instances and frameworks.

## Sources Are Input

Sources feed the system. They're what you read *through* frameworks, and what you cite *in* instances.

## Discovery (before Capture)

Query the loomlib API to find related documents.

### 1. Check for Related Sources

```bash
# Find sources by same author or on same topic
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "source") | select(.title | test("$ARGUMENTS"; "i")) | {id, title, status}]'
```

### 2. Check for Instances That Need This Source

```bash
# Find incubating instances that might need verification
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "instance") | select(.status == "incubating") | {id, title}]'
```

### 3. Report & Decide

Based on discovery:

| Finding | Action |
|---------|--------|
| **Related source exists** | Check if duplicate, or note as companion |
| **Incubating instance needs this** | Note in "Instances This Unlocks" section |
| **No related docs** | Proceed fresh |

---

## Required Fields

```yaml
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: src-{slug}
title: {Title}
type: source
framework_kind: null
framework_ids: []
source_id: null
output: null
perspective: philosophical-genealogy | linguistic-recovery | economic-genealogy | legal-grammar
status: incubating | draft | verified
tags: [relevant, tags, author-name]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: capture
execution_state: completed
upstream: []
downstream: []
```

## Document Structure

```markdown
# {Title}

**Author:** {Author}
**Year:** {Year}
**Type:** {book | article | lecture | primary source | etc.}

---

## Summary

{What is this source about? 2-3 paragraphs.}

## Key Claims

1. {Major argument or finding}
2. {Major argument or finding}
3. {Major argument or finding}

## Vocabulary

| Term | Definition | Significance |
|------|------------|--------------|
| ... | ... | ... |

## Quotable Passages

> "{Passage}" (p. {X})

{Why this passage matters}

---

## Connections

### Frameworks This Informs
- {Framework} — {how}

### Instances This Unlocks
- {Instance} — {what aspect it provides}

### Related Sources
- {Source} — {relationship}

---

## Reading Notes

{Detailed notes, organized by chapter or theme}

### {Section/Chapter}

{Notes}

---

## Status

**Current:** {incubating | draft | verified}

**To verify:**
- [ ] Key claims extracted
- [ ] Vocabulary documented
- [ ] Connections mapped
- [ ] Reading notes complete
```

## Source Lifecycle

```
encounter → capture → read → extract → connect
```

A source moves to `verified` when:
1. You've read it (not just skimmed)
2. Key claims are extracted
3. It's connected to frameworks and instances
4. It can unlock incubating instances

## Known Sources Needed (from seed data)

| Source | For Instance | Domain |
|--------|--------------|--------|
| Graeber - Debt | CREDIT | economic-genealogy |
| Mehrling - Money View | INTEREST | economic-genealogy |
| Berle & Means | CORPORATION | economic-genealogy |
| Marx - Capital | PETTY COMMODITY | economic-genealogy |
| Gleeson-White | ACCOUNT | economic-genealogy |

## Output

Write the source document to:
`loomlib/docs/source/{slug}.md`

Include YAML frontmatter with all required fields.

## Post-Completion

After writing the source, report:

1. **What was discovered:** Related sources, incubating instances found
2. **What this source captures:** Key claims and vocabulary
3. **What this enables:** Instances this can verify, frameworks it informs

Now document: $ARGUMENTS
