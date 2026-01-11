---
description: Dashboard of current knowledge graph state
argument-hint: [--detail]
---

# Status: $ARGUMENTS

Dashboard view of the current loomlib knowledge graph — document counts, composition health, and what needs attention.

## Discovery

### Load All Documents

```bash
curl -s http://localhost:5173/api/docs | jq '.'
```

### Parse Arguments

- `--detail` — Include per-document listings, not just summaries

---

## Protocol

### 1. Count Documents

Group by:
- Total count
- By type (source, note, framework, instance, index)
- By status (incubating, draft, verified, captured)
- By intent (research, build, capture, organize, produce)
- By execution_state (pending, in_progress, completed, resolved)

### 2. Analyze Composition

- Documents with upstream refs vs without
- Average upstream ref count
- Most connected documents (highest upstream count)
- Orphan count by severity

### 3. Identify Attention Items

- Incubating documents older than 7 days
- Draft documents older than 14 days
- In-progress work (execution_state: in_progress)
- Recently completed (last 3 days)

### 4. Framework Utilization

- Most-used frameworks (by framework_ids references)
- Unused frameworks (never in framework_ids)

---

## Output Format

**Do not write a file.** Output directly to conversation.

```markdown
# Loomlib Status

**Date:** {date}
**Total documents:** {count}

---

## Document Distribution

### By Type

| Type | Count | % |
|------|-------|---|
| 📄 instance | {n} | {%} |
| ⚙️ framework | {n} | {%} |
| 📖 source | {n} | {%} |
| 📝 note | {n} | {%} |
| 📑 index | {n} | {%} |

### By Status

```
verified  ████████████████████ {n} ({%})
draft     ████████             {n} ({%})
incubating████                 {n} ({%})
captured                       {n} ({%})
```

### By Intent

| Intent | Count | Primary Commands |
|--------|-------|-----------------|
| research | {n} | survey, scope, excavate |
| produce | {n} | instance |
| build | {n} | framework |
| organize | {n} | index |
| capture | {n} | note, source |

### By Execution State

| State | Count | Meaning |
|-------|-------|---------|
| completed | {n} | Done, available |
| in_progress | {n} | Active work |
| pending | {n} | Not started |
| resolved | {n} | Closed out |

---

## Composition Health

### Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Orphan rate | {x}% | < 10% | ✅/⚠️/❌ |
| Unframed instances | {n} | 0 | ✅/⚠️/❌ |
| Avg upstream refs | {x} | > 1.5 | ✅/⚠️/❌ |
| Verification rate | {x}% | > 60% | ✅/⚠️/❌ |

### Most Connected

| Document | Upstream Count |
|----------|---------------|
| [{title}]({id}) | {n} |
| [{title}]({id}) | {n} |
| [{title}]({id}) | {n} |

---

## Framework Utilization

### Most Used

| Framework | Times Applied |
|-----------|---------------|
| [{title}]({id}) | {n} |
| [{title}]({id}) | {n} |
| [{title}]({id}) | {n} |

### Unused Frameworks

| Framework | Status | Consider |
|-----------|--------|----------|
| [{title}]({id}) | {status} | Apply or retire? |

---

## Needs Attention

### Stale Incubating (> 7 days)
*Documents that have been incubating too long*

| Document | Type | Days | Action |
|----------|------|------|--------|
| [{title}]({id}) | {type} | {n} | Develop or archive |

### Stale Draft (> 14 days)
*Drafts that should be reviewed*

| Document | Type | Days | Action |
|----------|------|------|--------|
| [{title}]({id}) | {type} | {n} | Review for promotion |

### In Progress
*Active work — execution_state: in_progress*

| Document | Type | Intent |
|----------|------|--------|
| [{title}]({id}) | {type} | {intent} |

### Recently Completed (last 3 days)
*Fresh work ready for downstream use*

| Document | Type | Completed |
|----------|------|-----------|
| [{title}]({id}) | {type} | {date} |

---

## Quick Actions

- `/loomlib:orphans` — See full orphan report
- `/loomlib:review {doc-id}` — Review a draft for promotion
- `/loomlib:promote {doc-id} verified` — Promote reviewed doc
- `/loomlib:resolve {doc-id}` — Close out completed work

---

## Trends (if historical data available)

*Documents added this week: {n}*
*Documents promoted this week: {n}*
*Net composition health change: {+/-n}%*
```

---

## Detail Mode

If `--detail` is passed, include full document listings:

```markdown
## All Documents by Type

### Instances ({n})

| ID | Title | Status | Frameworks |
|----|-------|--------|------------|
| {id} | {title} | {status} | {framework_ids} |

### Frameworks ({n})

| ID | Title | Kind | Status |
|----|-------|------|--------|
| {id} | {title} | {toolkit/domain} | {status} |

... etc for each type
```

---

## Examples

```
/loomlib:status
→ Summary dashboard

/loomlib:status --detail
→ Full dashboard with document listings
```

---

Now show status: $ARGUMENTS
