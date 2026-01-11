---
description: Create a loomlib index - curated collection of related documents
argument-hint: [index name] for [channel or perspective or theme]
---

# Index: $ARGUMENTS

Generate an index document — a curated collection that provides navigation.

## Indexes Are Navigation

Indexes don't contain content — they organize it. They answer: "What belongs together?"

## Discovery (before Organizing)

Query the loomlib API to find documents to include.

### 1. Find Documents for This Index

```bash
# Find documents by channel/perspective/theme
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.output == "$ARGUMENTS" or .perspective == "$ARGUMENTS") | {id, title, type, status}]'
```

### 2. Check for Existing Indexes

```bash
# Find indexes that might overlap
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "index") | {id, title, status}]'
```

### 3. Report & Decide

Based on discovery:

| Finding | Action |
|---------|--------|
| **Related index exists** | Check if updating vs creating new |
| **Documents found** | Include in Contents section |
| **Few documents found** | Note gaps, proceed or wait |

---

## Required Fields

```yaml
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: idx-{slug}
title: {Index Name}
type: index
framework_kind: null
framework_ids: []
source_id: null
output: etymon | loomcommander | null
perspective: philosophical-genealogy | linguistic-recovery | economic-genealogy | legal-grammar | null
status: draft | verified
tags: [index, relevant, tags]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: organize
execution_state: completed
upstream:
  - doc: {doc-id-included}
    relation: informs
downstream: []
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
1. Discovery completed (API queried for documents)
2. Purpose is clear
3. Contents are accurate and linked
4. Gaps are identified
5. Upstream references accurate (documents included)
6. It actually helps navigation

## Post-Completion

After writing the index, report:

1. **What was discovered:** Documents found for inclusion
2. **What this organizes:** The collection created
3. **Gaps identified:** What's missing from the collection

Now create index for: $ARGUMENTS
