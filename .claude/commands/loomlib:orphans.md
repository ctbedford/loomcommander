---
description: Find documents with weak or missing composition
argument-hint: [--type <type>] [--severity <high|medium|low>]
---

# Orphans: $ARGUMENTS

Find documents with weak or missing composition — surfaces "composition debt" in the knowledge graph.

## Orphan Types

| Type | Description | Severity |
|------|-------------|----------|
| **Rootless** | No upstream refs (except frameworks with only `method` refs to themselves) | Medium |
| **Dead-end** | No downstream refs (nothing uses this) | Low |
| **Unframed** | Instance with empty `framework_ids` | High |
| **Sourceless** | Makes claims but no `source_id` or source in upstream | Medium |
| **Broken ref** | References document that doesn't exist | High |

## Discovery

### 1. Load All Documents

```bash
curl -s http://localhost:5173/api/docs | jq '.'
```

### 2. Parse Arguments

Check if "$ARGUMENTS" contains filters:
- `--type <type>` — Filter by document type
- `--severity <level>` — Filter by orphan severity

---

## Protocol

### 1. Find Rootless Documents

```bash
# Documents with no upstream OR only self-referential method refs
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.upstream == null or .upstream == [] or (.upstream | length == 0))]'
```

**Exceptions (not orphans):**
- Sources — expected to be roots
- Notes — capture intent, may not have upstream
- Frameworks — may be foundational

### 2. Find Dead-End Documents

```bash
# Documents not referenced in any other document's upstream
# This requires checking all documents' upstream fields
```

**Exceptions:**
- Recently created (< 7 days old)
- Status: captured (terminal state)
- Indexes (organize, not inform)

### 3. Find Unframed Instances

```bash
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "instance") | select(.framework_ids == null or .framework_ids == [])]'
```

### 4. Find Sourceless Claims

Documents that:
- Are type: instance
- Have no `source_id`
- Have no `source` relation in upstream
- Are not purely methodological

### 5. Find Broken References

For each document, check that every `upstream[].doc` exists in the graph.

---

## Output Format

**Do not write a file.** Output directly to conversation.

```markdown
# Orphan Report

**Date:** {date}
**Documents scanned:** {total}
**Orphans found:** {count}

---

## Summary

| Severity | Count | Types |
|----------|-------|-------|
| 🔴 High | {n} | Unframed, Broken ref |
| 🟡 Medium | {n} | Rootless, Sourceless |
| 🟢 Low | {n} | Dead-end |

---

## High Severity 🔴

### Unframed Instances
*Instances without framework_ids — what method produced these?*

| Document | Status | Issue |
|----------|--------|-------|
| [{title}]({id}) | {status} | No frameworks |

### Broken References
*Documents referencing non-existent upstream*

| Document | Broken Ref | Issue |
|----------|------------|-------|
| [{title}]({id}) | `{missing-id}` | Reference not found |

---

## Medium Severity 🟡

### Rootless Documents
*No upstream lineage — where did these come from?*

| Document | Type | Status |
|----------|------|--------|
| [{title}]({id}) | {type} | {status} |

### Sourceless Claims
*Instances without source grounding*

| Document | Status | Expected Source For |
|----------|--------|---------------------|
| [{title}]({id}) | {status} | {topic suggests source needed} |

---

## Low Severity 🟢

### Dead-End Documents
*Not referenced by anything downstream — are these being used?*

| Document | Type | Status | Age |
|----------|------|--------|-----|
| [{title}]({id}) | {type} | {status} | {days} days |

*Note: Recently created or captured documents are expected to be dead-ends.*

---

## Recommended Actions

### Immediate (High)
1. Add `framework_ids` to: {list}
2. Fix broken refs in: {list}

### Soon (Medium)
1. Add upstream to: {list}
2. Add sources to: {list}

### When Convenient (Low)
1. Create downstream uses for: {list}
2. Or resolve as complete if intentionally terminal

---

## Composition Health Score

**{score}%** — ({healthy}/{total} documents with good composition)

| Metric | Value | Target |
|--------|-------|--------|
| Orphan rate | {x}% | < 10% |
| Unframed rate | {x}% | 0% |
| Broken ref rate | {x}% | 0% |
| Avg upstream depth | {x} | > 1.5 |
```

---

## Filters

### By Type
```
/loomlib:orphans --type instance
→ Only check instances

/loomlib:orphans --type framework
→ Only check frameworks
```

### By Severity
```
/loomlib:orphans --severity high
→ Only show critical issues

/loomlib:orphans --severity medium
→ Show medium and high
```

---

## Examples

```
/loomlib:orphans
→ Full orphan report for all documents

/loomlib:orphans --type instance --severity high
→ Only unframed or broken-ref instances

/loomlib:orphans --severity medium
→ Medium and high severity only
```

---

Now scan for orphans: $ARGUMENTS
