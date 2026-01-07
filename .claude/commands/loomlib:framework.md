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

## Required Fields

```yaml
id: fw-{slug}
title: {Framework Name}
type: framework
subtype: toolkit | domain
status: incubating | draft | verified
perspective: philosophical-genealogy | linguistic-recovery | economic-genealogy | legal-grammar
tags: [relevant, tags]
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

## Output

Write the framework document to:
`loomlib/docs/framework/{slug}.md`

Include YAML frontmatter with all required fields.

## Quality Standard

A framework is ready for `verified` status when:
1. The core distinction is sharp and defensible
2. Application is clear — someone could use it
3. It produces instances — you can point to what it generates
4. Boundary conditions are explicit

Now generate the framework for: $ARGUMENTS
