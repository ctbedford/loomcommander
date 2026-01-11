---
description: Find semantically similar documents
argument-hint: <doc-id> [--limit <n>]
---

# Similar: $ARGUMENTS

Find documents semantically similar to a target — enables "more like this" exploration.

## The Similarity Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                      SIMILAR                                │
│                                                             │
│   [target document]                                         │
│        ↓                                                    │
│   [compute similarity features]                             │
│        ↓                                                    │
│   [compare against all documents]                          │
│        ↓                                                    │
│   [rank by similarity score]                               │
│        ↓                                                    │
│   [top N similar documents]                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Similarity Dimensions

Since vector embeddings are not yet implemented, similarity is computed from:

| Dimension | Weight | How Computed |
|-----------|--------|--------------|
| **Tags overlap** | 25% | Jaccard similarity of tag sets |
| **Framework overlap** | 20% | Shared framework_ids |
| **Perspective match** | 15% | Same perspective field |
| **Type match** | 10% | Same document type |
| **Title similarity** | 15% | Word overlap in titles |
| **Upstream overlap** | 15% | Shared upstream references |

## Discovery

### 1. Load Target Document

```bash
curl -s http://localhost:5173/api/docs | jq '.[] | select(.id == "$ARGUMENTS")'
```

### 2. Load All Documents

```bash
curl -s http://localhost:5173/api/docs | jq '.'
```

### 3. Parse Options

- `--limit <n>` — Return top N results (default: 10)

---

## Protocol

### 1. Extract Target Features

From target document:
- `tags[]`
- `framework_ids[]`
- `perspective`
- `type`
- Title words (normalized)
- `upstream[].doc`

### 2. Compute Similarity Scores

For each other document, compute:

**Tag Similarity (Jaccard):**
```
tag_sim = |tags_target ∩ tags_other| / |tags_target ∪ tags_other|
```

**Framework Similarity (Jaccard):**
```
fw_sim = |fw_target ∩ fw_other| / |fw_target ∪ fw_other|
```

**Perspective Match:**
```
persp_sim = 1.0 if same, 0.0 if different
```

**Type Match:**
```
type_sim = 1.0 if same, 0.5 if related (e.g., survey/scope), 0.0 otherwise
```

**Title Similarity:**
```
title_sim = |words_target ∩ words_other| / |words_target ∪ words_other|
```

**Upstream Overlap:**
```
upstream_sim = |upstream_target ∩ upstream_other| / |upstream_target ∪ upstream_other|
```

**Combined Score:**
```
score = 0.25*tag + 0.20*fw + 0.15*persp + 0.10*type + 0.15*title + 0.15*upstream
```

### 3. Rank Results

Sort by combined score descending, return top N.

### 4. Analyze Connections

For top results, check:
- Already connected via upstream/downstream?
- Share any common ancestors?
- Synthesis potential?

---

## Output Format

**Do not write a file.** Output directly to conversation.

```markdown
# Similar to: {Target Title}

**Target:** [{title}]({id})
**Type:** {type}
**Tags:** {tags}
**Perspective:** {perspective}

---

## Top {N} Similar Documents

| Rank | Document | Score | Why Similar |
|------|----------|-------|-------------|
| 1 | [{title}]({id}) | {0.XX} | {top similarity factors} |
| 2 | [{title}]({id}) | {0.XX} | {top similarity factors} |
| 3 | [{title}]({id}) | {0.XX} | {top similarity factors} |
| ... | ... | ... | ... |

---

## Similarity Breakdown

### #1: {Title}

| Dimension | Target | Match | Score |
|-----------|--------|-------|-------|
| Tags | {tags} | {overlap} | {0.XX} |
| Frameworks | {fws} | {overlap} | {0.XX} |
| Perspective | {persp} | {match?} | {0/1} |
| Type | {type} | {match?} | {0/0.5/1} |
| Title words | {words} | {overlap} | {0.XX} |
| Upstream | {refs} | {overlap} | {0.XX} |
| **Combined** | | | **{0.XX}** |

**Already connected?** {Yes: via {relation} / No}
**Synthesis potential?** {Yes/No — rationale}

---

### #2: {Title}

... (repeat for top 3-5)

---

## Connection Opportunities

*Similar documents not yet connected:*

| Pair | Similarity | Connected? | Suggested Action |
|------|------------|------------|------------------|
| Target ↔ {doc-1} | {0.XX} | ❌ | Add upstream? |
| Target ↔ {doc-2} | {0.XX} | ❌ | Synthesize? |

---

## Unexpected Similarities

*Documents similar despite different type/perspective:*

| Document | Score | Surprising Because |
|----------|-------|-------------------|
| [{title}]({id}) | {0.XX} | Different type but high tag overlap |

---

## Recommended Actions

1. **Connect:** Add upstream link from target to {doc}
2. **Synthesize:** `/loomlib:synthesize {target} + {similar-1}`
3. **Compare:** `/loomlib:compare {target} {similar-1} {similar-2}`
```

---

## Future Enhancement: Vector Embeddings

When embeddings are implemented:

```yaml
# In loomlib config
embeddings:
  enabled: true
  model: text-embedding-3-small
  dimensions: 1536
```

Similarity would then use:
- Cosine similarity of document embeddings
- Combined with metadata similarity (current approach)
- Much better semantic matching

---

## Examples

```
/loomlib:similar inst-excavate-feedback
→ Find documents similar to FEEDBACK excavation

/loomlib:similar fw-etymon-method --limit 5
→ Find top 5 documents similar to Etymon Method

/loomlib:similar src-systems-thinking
→ Find documents that might use this source
```

---

Now find similar to: $ARGUMENTS
