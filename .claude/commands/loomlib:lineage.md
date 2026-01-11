---
description: Trace production genealogy of a document
argument-hint: <doc-id>
---

# Lineage: $ARGUMENTS

Trace and visualize the production genealogy of a document — where it came from and what it enables.

## The Lineage Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                      LINEAGE                                │
│                                                             │
│   [root sources]                                           │
│        ↓                                                    │
│   [frameworks applied]                                      │
│        ↓                                                    │
│   [intermediate instances]                                  │
│        ↓                                                    │
│   >>> TARGET DOCUMENT <<<                                   │
│        ↓                                                    │
│   [what this enables]                                       │
│        ↓                                                    │
│   [terminal outputs]                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Discovery

### 1. Load Target Document

```bash
curl -s http://localhost:5173/api/docs | jq '.[] | select(.id == "$ARGUMENTS")'
```

### 2. Walk Upstream (Recursive)

```bash
# Get immediate upstream
curl -s http://localhost:5173/api/docs | jq '.[] | select(.id == "$ARGUMENTS") | .upstream'

# For each upstream doc, get its upstream (recursive until root)
```

### 3. Walk Downstream

```bash
# Find documents that reference this one in their upstream
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.upstream[]?.doc == "$ARGUMENTS")]'
```

### 4. Collect All Nodes

Build the full lineage graph by traversing both directions.

---

## Protocol

### 1. Upstream Trace

Starting from target, recursively collect:
- Direct upstream refs (from `upstream` field)
- Their upstream refs (transitive)
- Stop at root nodes (documents with no upstream)

Track the relation type at each edge (`method`, `source`, `informs`, `prior`, `synthesizes`).

### 2. Downstream Trace

Find all documents that:
- Reference target in their `upstream` field
- Recursively find what references those

### 3. Build Graph

Construct:
- Nodes (documents with id, title, type, status)
- Edges (upstream→downstream with relation type)
- Depth levels (distance from target)

### 4. Render

Output in multiple formats:
- ASCII tree (for terminal)
- Markdown table (for documents)
- Narrative summary

---

## Output Format

**Do not write a file.** Output directly to conversation.

```markdown
# Lineage: {Document Title}

**Target:** [{title}]({id})
**Type:** {type}
**Status:** {status}

---

## Upstream Lineage (what informed this)

```
{root-source-1}
    ↓ [source]
{intermediate-framework}
    ↓ [method]
>>> {TARGET DOCUMENT} <<<
```

### Upstream Summary

| Depth | Document | Type | Relation |
|-------|----------|------|----------|
| -3 | [{title}]({id}) | source | source |
| -2 | [{title}]({id}) | framework | method |
| -1 | [{title}]({id}) | instance | informs |
| 0 | **{TARGET}** | {type} | — |

---

## Downstream Lineage (what this enables)

```
>>> {TARGET DOCUMENT} <<<
    ↓ [informs]
{instance-using-this}
    ↓ [method]
{further-instance}
```

### Downstream Summary

| Depth | Document | Type | Relation |
|-------|----------|------|----------|
| 0 | **{TARGET}** | {type} | — |
| +1 | [{title}]({id}) | instance | informs |
| +2 | [{title}]({id}) | instance | method |

---

## Lineage Metrics

- **Upstream depth:** {N} levels (root: {root-doc-id})
- **Downstream reach:** {M} documents
- **Total lineage:** {N+M+1} documents
- **Relation types:** {method: X, source: Y, informs: Z}

---

## Composition Health

✅ / ⚠️ / ❌ **Root sources identified:** {Are there actual sources at the root?}
✅ / ⚠️ / ❌ **Method chain clear:** {Is the framework application traceable?}
✅ / ⚠️ / ❌ **No orphan branches:** {Do all paths lead to roots?}
✅ / ⚠️ / ❌ **Downstream documented:** {Is this document being used?}

---

## Narrative

{One paragraph explaining the lineage story: "This document began with X source, was shaped by Y framework, and now enables Z. The production chain shows..."}
```

---

## Edge Cases

### Circular References
If A → B → A detected, report as error:
```
⚠️ Circular reference detected: A → B → A
This indicates a data integrity issue.
```

### Missing References
If upstream references a doc that doesn't exist:
```
⚠️ Missing upstream: {doc-id} referenced but not found
```

### Root Detection
A document is a root if:
- `upstream` is empty or null
- OR `upstream` only contains `method` relations to frameworks

---

## Examples

```
/loomlib:lineage inst-excavate-feedback
→ Shows: src-systems-thinking → fw-etymon-method → inst-excavate-feedback

/loomlib:lineage fw-four-knowings
→ Shows: src-vervaeke-awftmc → fw-four-knowings → (downstream instances)

/loomlib:lineage idx-conducting-frontmatter-system
→ Shows: Complex lineage with 6 upstream refs
```

---

Now trace lineage for: $ARGUMENTS
