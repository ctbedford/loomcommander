---
description: Generate a loomlib framework document (toolkit or domain)
argument-hint: <toolkit|domain> [framework name and purpose]
---

# Framework: $ARGUMENTS

Generate a framework document for loomlib. Frameworks are reusable lenses — ways of seeing that produce instances when applied.

## Framework Subtypes

**Toolkit ⚙** — Operative method you *do*
- Has steps, procedures, moves
- Examples: Etymon Method, Reading a 10-K, Diagnostic Frames
- Question: "How do I apply this?"

**Domain ▣** — Contextual lens you *see through*
- Provides perspective, distinctions, vocabulary
- Examples: Oikonomia vs Chrematistics, Agonal Identity
- Question: "What does this make visible?"

## Discovery (before Production)

Query the loomlib API to find related documents before producing.

### 1. Check for Related Frameworks

```bash
# Find frameworks on same or related topics
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "framework") | select(.title | test("$ARGUMENTS"; "i")) | {id, title, framework_kind, status}]'
```

### 2. Check for Sources

```bash
# Find sources that might inform this framework
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "source") | select(.title | test("$ARGUMENTS"; "i")) | {id, title}]'
```

### 3. Report & Decide

Based on discovery:

| Finding | Action |
|---------|--------|
| **Related framework exists** | Reference as upstream with `relation: prior` |
| **Source available** | Reference as upstream with `relation: source` |
| **No related docs** | Proceed fresh |

---

## Required Fields

```yaml
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: fw-{slug}
title: {Framework Name}
type: framework
framework_kind: toolkit | domain
framework_ids: []
source_id: {src-id-if-referenced}
output: etymon | loomcommander | null
perspective: philosophical-genealogy | linguistic-recovery | economic-genealogy | legal-grammar
status: incubating | draft | verified
tags: [relevant, tags]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: build
execution_state: completed
upstream:
  - doc: {source-id-from-discovery}
    relation: source
  - doc: {prior-framework-id}
    relation: prior
downstream: []
```

## Document Structure

### For Toolkit Frameworks

```markdown
# {Framework Name}

## Purpose
What this framework is for. What it makes possible.

## Core Distinction
The central cut this framework makes. What it separates.

## Method

### Step 1: {Name}
What you do. What you're looking for.

### Step 2: {Name}
...

### Step 3: {Name}
...

## Operators (if applicable)
How this framework combines with terms or other frameworks.

## Output
What applying this framework produces. What form it takes.

## Examples
Brief examples of the framework in use.

## Boundary Conditions
When this framework applies. When it doesn't.
```

### For Domain Frameworks

```markdown
# {Framework Name}

## Purpose
What this lens makes visible. What perspective it provides.

## Core Distinction
The central opposition or differentiation.

## Vocabulary

| Term | Meaning | Contrast |
|------|---------|----------|
| ... | ... | ... |

## Genealogy
Where this distinction comes from. Historical or intellectual origin.

## Application
How to use this lens. What to look for.

## Limitations
What this lens obscures or doesn't address.
```

## Quality Standard

A framework is ready for `verified` status when:
1. Discovery completed (API queried, related docs checked)
2. The core distinction is sharp and defensible
3. Application is clear — someone could use it
4. It produces instances — you can point to what it generates
5. Boundary conditions are explicit
6. Upstream references accurate (from discovery)

## Output

Write the framework document to:
`loomlib/docs/framework/{slug}.md`

Include YAML frontmatter with all required fields.

Add a **Composition** section at the end of the document:

```markdown
---

## Composition

**Upstream (what informed this framework):**
- [{Source Title}]({source-id}) — reference material
- [{Related Framework}]({fw-id}) — prior work

**Downstream (what this framework enables):**
- Instances applying this method/lens
- Derived frameworks

**Related (discovered but not upstream):**
- {other related docs found during discovery}
```

## Post-Completion

After writing the framework, report:

1. **What was discovered:** Related frameworks, sources found
2. **What was used:** Which docs informed this framework (now in `upstream`)
3. **What this enables:** Types of instances this framework can produce

Now generate the framework for: $ARGUMENTS
