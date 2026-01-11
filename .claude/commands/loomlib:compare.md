---
description: Structured comparison of two or more documents
argument-hint: <doc-id-1> <doc-id-2> [<doc-id-3>...]
---

# Compare: $ARGUMENTS

Perform structured comparison of documents to surface similarities, differences, and synthesis opportunities.

## The Compare Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                      COMPARE                                │
│                                                             │
│   [doc-1]          [doc-2]          [doc-3]                │
│      ↓                ↓                ↓                   │
│   [extract structure from each]                            │
│      ↓                ↓                ↓                   │
│   ┌─────────────────────────────────────┐                 │
│   │           ALIGNMENT MATRIX          │                 │
│   │  vocabulary | claims | structure    │                 │
│   └─────────────────────────────────────┘                 │
│                     ↓                                      │
│   [similarities] [differences] [tensions] [synthesis?]    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Discovery

### 1. Parse Document IDs

Extract document IDs from "$ARGUMENTS" (space-separated).

### 2. Load Documents

```bash
# For each document ID
curl -s http://localhost:5173/api/docs | jq '.[] | select(.id == "doc-id")'
```

### 3. Check for Existing Comparisons

```bash
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.title | test("compare|versus"; "i"))]'
```

---

## Protocol

### 1. Extract Structure

For each document, extract:

**Metadata:**
- Type, status, intent
- Frameworks applied
- Upstream sources

**Content:**
- Key vocabulary/terms
- Core claims/assertions
- Structure/organization
- Conclusions/findings

### 2. Build Alignment Matrix

| Dimension | Doc 1 | Doc 2 | Doc 3 |
|-----------|-------|-------|-------|
| Type | | | |
| Status | | | |
| Frameworks | | | |
| Key terms | | | |
| Core claims | | | |
| Conclusions | | | |

### 3. Identify Relationships

**Similarities:**
- Shared vocabulary
- Aligned claims
- Common sources
- Similar structure

**Differences:**
- Different scope/focus
- Different methods
- Different conclusions
- Different terminology for same concept

**Tensions:**
- Contradictory claims
- Incompatible frameworks
- Conflicting conclusions

**Complements:**
- One fills gap in other
- Different perspectives on same topic
- Sequential relationship

### 4. Assess Synthesis Potential

Does this comparison suggest:
- A VERSUS instance?
- A synthesis opportunity?
- A need for reconciliation?
- An index grouping?

---

## Output Format

**Do not write a file.** Output directly to conversation.

```markdown
# Comparison: {n} Documents

**Date:** {date}
**Documents compared:**
1. [{title-1}]({id-1}) — {type}, {status}
2. [{title-2}]({id-2}) — {type}, {status}
3. [{title-3}]({id-3}) — {type}, {status}

---

## Metadata Comparison

| Dimension | {Doc 1} | {Doc 2} | {Doc 3} |
|-----------|---------|---------|---------|
| **Type** | {type} | {type} | {type} |
| **Status** | {status} | {status} | {status} |
| **Intent** | {intent} | {intent} | {intent} |
| **Frameworks** | {list} | {list} | {list} |
| **Perspective** | {persp} | {persp} | {persp} |

---

## Content Alignment

### Vocabulary

| Term | {Doc 1} | {Doc 2} | {Doc 3} |
|------|---------|---------|---------|
| {term-1} | ✓ defined | ✓ uses | ✗ absent |
| {term-2} | ✓ | ✓ (different def) | ✓ |
| {term-3} | ✗ | ✓ | ✓ |

**Shared vocabulary:** {list of terms all documents share}
**Unique to each:**
- Doc 1: {terms}
- Doc 2: {terms}
- Doc 3: {terms}

### Claims

| Claim | {Doc 1} | {Doc 2} | {Doc 3} |
|-------|---------|---------|---------|
| {claim-1} | Asserts | Supports | Silent |
| {claim-2} | Asserts | Contradicts | — |

---

## Relationships

### Similarities ✓
*Where documents align*

- **{similarity-1}:** Both {doc-1} and {doc-2} argue that...
- **{similarity-2}:** All three share the assumption that...

### Differences ≠
*Where documents diverge (not necessarily in conflict)*

- **{difference-1}:** {doc-1} focuses on X while {doc-2} focuses on Y
- **{difference-2}:** Different terminology: {doc-1} uses "A", {doc-2} uses "B" for same concept

### Tensions ⚡
*Where documents conflict*

- **{tension-1}:** {doc-1} claims X, but {doc-2} claims not-X
  - *This tension might be resolved by...*
- **{tension-2}:** Incompatible frameworks applied

### Complements ↔
*Where documents fill each other's gaps*

- **{complement-1}:** {doc-1} provides context that {doc-2} assumes
- **{complement-2}:** {doc-2} extends {doc-1}'s findings to new domain

---

## Synthesis Opportunities

### VERSUS Instance?
*Is there a genuine opposition worth documenting?*

{Yes/No} — {rationale}

If yes: `/loomlib:instance {term-1} VERSUS {term-2}`

### Synthesis?
*Would combining these create emergent insight?*

{Yes/No} — {rationale}

If yes: `/loomlib:synthesize {id-1} + {id-2} + {id-3}`

### Index?
*Should these be grouped in a collection?*

{Yes/No} — {rationale}

If yes: `/loomlib:index {topic} including {id-1}, {id-2}, {id-3}`

---

## Recommended Next Steps

1. {specific action based on comparison}
2. {specific action}
3. {specific action}
```

---

## Special Comparisons

### Comparing Excavations

Focus on:
- Etymology alignment (same roots?)
- Drift patterns (similar or different?)
- Recovery claims (compatible?)

### Comparing Surveys

Focus on:
- File overlap
- Finding consistency
- Open question alignment

### Comparing Frameworks

Focus on:
- Method overlap
- Applicable domains
- Composability (can they work together?)

---

## Examples

```
/loomlib:compare inst-excavate-feedback inst-excavate-system
→ Compare two excavations for synthesis potential

/loomlib:compare fw-etymon-method fw-survey-method
→ Compare frameworks for composability

/loomlib:compare inst-survey-loomlib inst-survey-ai-orchestration-evaluation
→ Compare surveys for consistent findings
```

---

Now compare: $ARGUMENTS
