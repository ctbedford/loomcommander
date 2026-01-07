---
id: fw-invariants-variants
title: Invariants/Variants
type: framework
framework_kind: toolkit
framework_ids: []
source_id: null
output: null
perspective: null
status: verified
tags: [analysis, architecture, distinction, system-design]
---
# Invariants/Variants

**Type:** Toolkit Framework
**Function:** Distinguish what's fixed from what's open in any system

## The Method

Every system has:
- **Invariants:** What cannot change without breaking the system
- **Variants:** What can expand, contract, or transform

The power is in correctly identifying which is which.

## The Questions

1. What breaks if this changes? → Invariant
2. What can grow without breaking anything? → Variant
3. What looks fixed but is actually arbitrary? → False invariant
4. What looks open but actually constrains everything? → Hidden invariant

## Application Pattern

| Domain | Invariant | Variant |
|--------|-----------|---------|
| Document Types | The five types (source, note, framework, instance, index) | Which documents exist |
| Framework Kinds | Toolkit vs Domain distinction | Which frameworks exist |
| Perspectives | That they're "ways of seeing" | Which perspectives, how many |
| Output Channels | That they're "where work goes" | Which channels exist |
| The Governing Question | "What does this make salient?" | Everything else |

## Common Errors

**Treating variants as invariants:** Refusing to add new perspectives because "the four-part curriculum is complete"

**Treating invariants as variants:** Trying to add a sixth document type because "why not?"

**Missing hidden invariants:** Not noticing that a "flexible" system actually depends on an unstated assumption

## Deployment

When designing or analyzing a system:
1. List what seems fixed
2. List what seems open
3. Test each: what actually breaks?
4. The false invariants are where innovation hides
5. The hidden invariants are where fragility hides