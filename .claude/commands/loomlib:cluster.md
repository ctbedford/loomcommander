---
description: Find implicit document clusters that should be connected
argument-hint: --by <tags|perspective|framework|output|topic>
---

# Cluster: $ARGUMENTS

Find documents that share characteristics but aren't explicitly connected — surfaces implicit structure in the knowledge graph.

## The Cluster Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                      CLUSTER                                │
│                                                             │
│   [all documents]                                          │
│        ↓                                                    │
│   [group by dimension]                                      │
│        ↓                                                    │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐                   │
│   │ Cluster │  │ Cluster │  │ Cluster │                   │
│   │    A    │  │    B    │  │    C    │                   │
│   └─────────┘  └─────────┘  └─────────┘                   │
│        ↓            ↓            ↓                         │
│   [check internal connections]                             │
│        ↓                                                    │
│   [suggest: index? synthesize? link?]                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Clustering Dimensions

| Dimension | Groups By | Suggests |
|-----------|-----------|----------|
| `tags` | Shared tags | Index or synthesis |
| `perspective` | Same perspective field | Thematic collection |
| `framework` | Same framework_ids | Method-based cluster |
| `output` | Same output channel | Production queue |
| `topic` | Text similarity in titles | Implicit theme |

## Discovery

### 1. Load All Documents

```bash
curl -s http://localhost:5173/api/docs | jq '.'
```

### 2. Parse Clustering Dimension

Extract dimension from "$ARGUMENTS":
- `--by tags`
- `--by perspective`
- `--by framework`
- `--by output`
- `--by topic`

Default: `--by tags`

---

## Protocol

### 1. Group Documents

#### By Tags
```bash
# Find all unique tags, then group documents by each
curl -s http://localhost:5173/api/docs | jq '[.[].tags] | flatten | unique'
```

#### By Perspective
```bash
curl -s http://localhost:5173/api/docs | jq 'group_by(.perspective)'
```

#### By Framework
```bash
# Group by framework_ids (treating array as key)
curl -s http://localhost:5173/api/docs | jq 'group_by(.framework_ids | sort)'
```

#### By Output
```bash
curl -s http://localhost:5173/api/docs | jq 'group_by(.output)'
```

#### By Topic
- Extract key terms from titles
- Group by term overlap
- Identify implicit themes

### 2. Analyze Clusters

For each cluster with 2+ documents:

**Internal Connectivity:**
- How many documents reference each other?
- What % have upstream/downstream links within cluster?
- Is there an index that groups them?

**Missing Links:**
- Documents that share the dimension but aren't connected
- Potential upstream/downstream relationships not recorded

### 3. Assess Opportunities

For each under-connected cluster:
- **Index opportunity?** — Should these be curated together?
- **Synthesis opportunity?** — Should these be combined?
- **Link opportunity?** — Should explicit upstream/downstream be added?

---

## Output Format

**Do not write a file.** Output directly to conversation.

```markdown
# Cluster Analysis: by {dimension}

**Date:** {date}
**Documents analyzed:** {count}
**Clusters found:** {count}
**Under-connected clusters:** {count}

---

## Cluster Overview

| Cluster | Size | Internal Links | Connectivity | Action |
|---------|------|----------------|--------------|--------|
| {cluster-name} | {n} docs | {m} links | {%}% | {suggest} |
| {cluster-name} | {n} docs | {m} links | {%}% | {suggest} |

---

## Under-Connected Clusters

### Cluster: {name}

**Dimension value:** {tag/perspective/framework/etc}
**Documents:** {n}
**Internal links:** {m} ({%}%)

| Document | Links To | Links From |
|----------|----------|------------|
| [{title}]({id}) | {count} | {count} |
| [{title}]({id}) | {count} | {count} |

**Missing connections:**
- [{doc-a}]({id}) and [{doc-b}]({id}) share {dimension} but aren't linked
- [{doc-c}]({id}) could inform [{doc-d}]({id})

**Suggested action:**
- [ ] Create index: `/loomlib:index {topic} including {id-1}, {id-2}...`
- [ ] Create synthesis: `/loomlib:synthesize {id-1} + {id-2}`
- [ ] Add upstream link from {doc-a} to {doc-b}

---

### Cluster: {name}

... (repeat for each under-connected cluster)

---

## Well-Connected Clusters

*These clusters have good internal connectivity (> 50%)*

| Cluster | Size | Connectivity | Has Index? |
|---------|------|--------------|------------|
| {name} | {n} | {%}% | ✅/❌ |

---

## Singleton Documents

*Documents that don't cluster with anything on this dimension*

| Document | {dimension} value | Suggestion |
|----------|-------------------|------------|
| [{title}]({id}) | {value or null} | Add {dimension}? |

---

## Recommended Actions

### Create Indexes
```
/loomlib:index {topic-1} including {doc-list}
/loomlib:index {topic-2} including {doc-list}
```

### Create Syntheses
```
/loomlib:synthesize {cluster-docs}
```

### Add Links
*Documents that should reference each other:*
1. {doc-a} should have upstream: {doc-b} (relation: informs)
2. {doc-c} should have upstream: {doc-d} (relation: source)

---

## Cluster Health Score

**{score}%** — Cluster connectivity across {dimension}

| Metric | Value |
|--------|-------|
| Clusters with > 50% connectivity | {n}/{total} |
| Singleton documents | {n} |
| Documents in well-connected clusters | {n}/{total} |
```

---

## Multiple Dimensions

Can run multiple cluster analyses:

```
/loomlib:cluster --by tags
/loomlib:cluster --by perspective
/loomlib:cluster --by framework
```

Compare results to find:
- Documents that cluster together across multiple dimensions (strong affinity)
- Documents that never cluster (true outliers)

---

## Examples

```
/loomlib:cluster --by tags
→ Find documents sharing tags but not linked

/loomlib:cluster --by perspective
→ Find thematic clusters (philosophical-genealogy, economic-genealogy, etc.)

/loomlib:cluster --by framework
→ Find documents using same methods

/loomlib:cluster --by output
→ Find production queues (etymon channel, loomcommander channel)
```

---

Now cluster: $ARGUMENTS
