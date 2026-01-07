---
description: Document a source in loomlib - external reference material
argument-hint: [Author] - [Title] or [description of source]
---

# Source: $ARGUMENTS

Generate a source document — reference material that informs instances and frameworks.

## Sources Are Input

Sources feed the system. They're what you read *through* frameworks, and what you cite *in* instances.

## Required Fields

```yaml
id: src-{slug}
title: {Title}
type: source
status: incubating | draft | verified
author: {Author Name}
year: {Year if known}
perspective: philosophical-genealogy | linguistic-recovery | economic-genealogy | legal-grammar
tags: [relevant, tags]
unlocks: [inst-{instances this source would verify}]
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

Now document: $ARGUMENTS
