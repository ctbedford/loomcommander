---
description: Create a loomlib index - curated collection of related documents
argument-hint: [index name] for [channel or perspective or theme]
---

# Index: $ARGUMENTS

Generate an index document — a curated collection that provides navigation.

## Indexes Are Navigation

Indexes don't contain content — they organize it. They answer: "What belongs together?"

## Required Fields

```yaml
id: idx-{slug}
title: {Index Name}
type: index
status: draft | verified
channel: etymon | loomcommander | null
perspective: philosophical-genealogy | linguistic-recovery | economic-genealogy | legal-grammar | null
tags: [relevant, tags]
```

## Document Structure

```markdown
# {Index Name}

**Channel:** {output channel, if applicable}
**Perspective:** {perspective, if applicable}
**Status:** {draft | verified}

---

## Purpose

{What this index collects. Why these documents belong together.}

## Contents

### Verified

| Document | Type | Operator | Notes |
|----------|------|----------|-------|
| [[{title}]] | instance | {op} | {brief note} |
| ... | ... | ... | ... |

### In Progress

| Document | Type | Status | Blocking |
|----------|------|--------|----------|
| [[{title}]] | instance | incubating | {what's needed} |
| ... | ... | ... | ... |

### Planned

| Document | Type | Notes |
|----------|------|-------|
| {title} | instance | {not yet created} |
| ... | ... | ... |

---

## Gaps

{What's missing from this collection?}

- {Gap 1}
- {Gap 2}

## Reading Order

{If there's a recommended sequence}

1. {First}
2. {Second}
3. ...

## Related Indexes

- [[{other index}]] — {relationship}
```

## Current Indexes in Seed

| ID | Channel | Contents |
|----|---------|----------|
| idx-etymon-channel | etymon | 11 instances (all Etymon Method products) |
| idx-loomcommander-channel | loomcommander | 0 instances (empty) |

## Index Types

**Channel Index** — What gets published where
- Etymon channel: video scripts
- Loomcommander channel: tools, code, documentation

**Perspective Index** — What belongs to a curriculum track
- Philosophical genealogy
- Linguistic recovery
- Economic genealogy
- Legal grammar

**Thematic Index** — What clusters around a theme
- Across channels and perspectives

## Output

Write the index document to:
`loomlib/docs/index/{slug}.md`

## Quality Standard

An index is `verified` when:
1. Purpose is clear
2. Contents are accurate and linked
3. Gaps are identified
4. It actually helps navigation

Now create index for: $ARGUMENTS
