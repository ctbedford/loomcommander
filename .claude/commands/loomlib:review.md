---
description: Structured review for status promotion
argument-hint: <doc-id>
---

# Review: $ARGUMENTS

Perform structured review against quality criteria to determine if a document is ready for status promotion.

## The Review Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                       REVIEW                                │
│                                                             │
│   [target document]                                         │
│        ↓                                                    │
│   [load claimed upstreams]                                  │
│        ↓                                                    │
│   [verify claims against sources]                          │
│        ↓                                                    │
│   [assess against type-specific criteria]                  │
│        ↓                                                    │
│   [recommendation: PROMOTE / REVISE / HOLD]                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Discovery

### 1. Load Target Document

```bash
curl -s http://localhost:5173/api/docs | jq '.[] | select(.id == "$ARGUMENTS")'
```

### 2. Load Claimed Upstreams

```bash
# Get all documents referenced in upstream
curl -s http://localhost:5173/api/docs | jq '.[] | select(.id == "$ARGUMENTS") | .upstream[].doc'
```

### 3. Check Current Status

```bash
curl -s http://localhost:5173/api/docs | jq '.[] | select(.id == "$ARGUMENTS") | .status'
```

---

## Quality Criteria by Document Type

### Excavation (inst-excavate-*)

| Criterion | Verified Requirement |
|-----------|---------------------|
| **Etymology sourced** | Root language, literal meaning cited from etymological source |
| **Drift documented** | At least 2 inflection points with dates/periods |
| **Recovery claim testable** | "The term should mean X" is actionable, not vague |
| **Contemporary usage identified** | Current dominant meaning stated explicitly |
| **What's lost specified** | Concrete semantic content, not "richness" or "depth" |

### Survey (inst-survey-*)

| Criterion | Verified Requirement |
|-----------|---------------------|
| **Files accurate** | Listed files exist and serve stated roles |
| **Findings reproducible** | Another reader would reach same conclusions |
| **Open questions genuine** | Not laziness — actual gaps in understanding |
| **Dependencies mapped** | Internal and external deps identified |
| **Entry points identified** | Where execution begins is clear |

### Scope (inst-scope-*)

| Criterion | Verified Requirement |
|-----------|---------------------|
| **Expectations derived** | From evidence (surveys, user input), not assumed |
| **Gaps actionable** | Each gap suggests concrete implementation |
| **Affordances mapped** | What the system currently offers is documented |
| **Requirements testable** | Can verify if requirement is met |

### Instance (general)

| Criterion | Verified Requirement |
|-----------|---------------------|
| **Upstream claims verified** | References in `upstream` field are accurate |
| **Operator appropriate** | AS/FROM/VERSUS/etc. matches the actual relation |
| **Framework applied correctly** | If framework_ids set, framework protocol followed |
| **Status warranted** | Current status matches actual completion |

### Framework

| Criterion | Verified Requirement |
|-----------|---------------------|
| **Method articulated** | Clear steps or protocol |
| **Reusable** | Can be applied to multiple instances |
| **Examples present** | At least one application shown |
| **Distinct from existing** | Not duplicate of existing framework |

### Source

| Criterion | Verified Requirement |
|-----------|---------------------|
| **Attribution complete** | Author, year, type identified |
| **Key claims extracted** | Not just metadata — substance captured |
| **Connections mapped** | How this source relates to frameworks/instances |

---

## Protocol

### 1. Identify Document Type

Determine which criteria set applies based on `type` and `id` pattern.

### 2. Assess Each Criterion

For each criterion:
- **PASS ✅** — Criterion fully met
- **PARTIAL ⚠️** — Partially met, minor issues
- **FAIL ❌** — Not met or major issues

### 3. Verify Upstream Claims

For each item in `upstream`:
- Does the referenced document exist?
- Does the `relation` type accurately describe the relationship?
- Is the claim of influence justified?

### 4. Determine Recommendation

| Result | Recommendation |
|--------|----------------|
| All PASS | **PROMOTE** — Ready for next status |
| Some PARTIAL, no FAIL | **REVISE** — Minor fixes needed |
| Any FAIL | **HOLD** — Significant work needed |

---

## Output Format

**Do not write a file.** Output directly to conversation.

```markdown
# Review: {Document Title}

**Target:** [{title}]({id})
**Current status:** {status}
**Reviewing for:** {status} → {next-status}
**Date:** {date}

---

## Criteria Assessment

| Criterion | Status | Notes |
|-----------|--------|-------|
| {criterion-1} | ✅ PASS | {brief note} |
| {criterion-2} | ⚠️ PARTIAL | {what's missing} |
| {criterion-3} | ❌ FAIL | {why it fails} |

---

## Upstream Verification

| Claimed Upstream | Exists? | Relation Accurate? | Influence Justified? |
|-----------------|---------|-------------------|---------------------|
| [{doc-1}]({id}) | ✅ | ✅ | ✅ |
| [{doc-2}]({id}) | ✅ | ⚠️ Should be `source` not `informs` | ✅ |

---

## Detailed Findings

### What's Strong
- {specific strength}
- {specific strength}

### What Needs Work
- {specific issue with suggested fix}
- {specific issue with suggested fix}

---

## Recommendation

### **{PROMOTE / REVISE / HOLD}**

**Rationale:** {Why this recommendation}

**If REVISE, fix these:**
1. {specific fix}
2. {specific fix}

**If PROMOTE:**
Run `/loomlib:promote {doc-id} {next-status}` to advance.

---

## Review Metadata

- **Criteria applied:** {type}-specific + universal
- **Pass rate:** {X}/{Y} criteria
- **Upstream verification:** {A}/{B} refs verified
```

---

## Status Progression Rules

| From | To | Review Required? |
|------|----|-----------------|
| incubating | draft | Optional (self-promote OK) |
| draft | verified | **Required** — must pass review |
| verified | captured | N/A (external action) |

---

## Examples

```
/loomlib:review inst-excavate-feedback
→ Applies excavation criteria
→ Checks etymology sourcing, drift documentation, recovery claim

/loomlib:review inst-survey-loomlib
→ Applies survey criteria
→ Checks file accuracy, findings reproducibility

/loomlib:review fw-etymon-method
→ Applies framework criteria
→ Checks method articulation, reusability, examples
```

---

Now review: $ARGUMENTS
