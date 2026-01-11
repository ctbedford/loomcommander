---
description: Log a decision with trade-offs (ADR-style)
argument-hint: [decision] - e.g., "use state machine for mode", "choose tailwind over css modules"
---

# Ops: Decision $ARGUMENTS

You are logging a **decision** — an ADR-style record of why we chose X over Y.

---

## What is a Decision?

A decision captures:
- What choice was made
- What alternatives were considered
- Why this option was chosen
- What the trade-offs are

```
┌─────────────────────────────────────────────────────────────────┐
│                         DECISION                                 │
│                                                                  │
│   ⊕ dec-vim-state-machine                                       │
│                                                                  │
│   Decision: Use finite state machine for vim mode management    │
│                                                                  │
│   Alternatives Considered:                                      │
│   1. Simple boolean flags (isNormalMode, isInsertMode)          │
│   2. String enum for current mode                               │
│   3. FSM with explicit transitions                              │
│                                                                  │
│   Chose FSM because:                                            │
│   - Prevents invalid state combinations                         │
│   - Makes transitions explicit and testable                     │
│   - Matches vim's actual mental model                           │
│                                                                  │
│   Trade-offs:                                                   │
│   + Type safety for transitions                                 │
│   + Easy to add new modes later                                 │
│   - More code than simple enum                                  │
│   - Learning curve for contributors                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## When to Log a Decision

Create a decision when:
- Multiple valid approaches exist
- Trade-offs are non-obvious
- Future maintainers will wonder "why?"
- The choice has lasting implications

Don't create decisions for:
- Obvious choices (use TypeScript in a TS project)
- Trivial decisions (variable naming)
- Temporary workarounds (log as TODO instead)

---

## Protocol

### 1. Identify the Context

What prompted this decision?
- During plan creation?
- During task execution?
- In response to a problem?

```bash
# Find related documents
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops") | select(.status == "active")]'
```

### 2. Articulate the Alternatives

List 2-4 realistic options. For each:
- What is it?
- What are its pros?
- What are its cons?

### 3. Write the Decision

Write to: `loomlib/docs/ops/decision/dec-{slug}.md`

```markdown
---
id: dec-{slug}
title: "Decision: {Short Description}"
type: decision
domain: ops
status: active
tags: [decision, {category}]

intent: learn
execution_state: completed
upstream:
  - doc: plan-{slug}  # or brief-{slug}
    relation: context
downstream: []

project_id: proj-{project-slug}
---

# Decision: {Short Description}

**Date:** {date}
**Status:** Active
**Context:** {plan/brief/task that prompted this}

---

## Summary

{One sentence: what was decided}

---

## Context

{Why did this decision need to be made? What problem or choice point arose?}

---

## Alternatives Considered

### Option 1: {Name}

{Description}

**Pros:**
- {Pro 1}
- {Pro 2}

**Cons:**
- {Con 1}
- {Con 2}

### Option 2: {Name}

{Description}

**Pros:**
- {Pro 1}

**Cons:**
- {Con 1}

### Option 3: {Name} (if applicable)

...

---

## Decision

**We chose: {Option Name}**

### Rationale

{Why this option over the others. Be specific about which trade-offs were acceptable.}

### Trade-offs Accepted

- {Trade-off 1 — and why it's acceptable}
- {Trade-off 2}

---

## Implications

### What This Means

- {Implication 1}
- {Implication 2}

### What This Doesn't Mean

- {Clarification 1}

---

## Revisit Conditions

This decision should be revisited if:
- {Condition 1}
- {Condition 2}

---

## Related Decisions

- {dec-other if related}
```

---

## Decision States

```
draft → active → superseded
          │          │
          │          └── Replaced by new decision
          └── Current and valid
```

When superseding:
- Create new decision referencing the old
- Update old decision status to `superseded`
- Link to new decision in old document

---

## Composition

**Upstream:**
- Plan (decision arose during planning)
- Task (decision arose during execution)
- Brief (decision about scope)

**Downstream:**
- Future plans (informed by this decision)
- Patterns (if decision becomes standard practice)

---

## ADR Style Guide

### Title
Start with action: "Use X", "Choose X over Y", "Implement X via Y"

### Context
Answer: "Why did we need to decide?"

### Alternatives
Be fair to rejected options. They were considered for a reason.

### Rationale
Be specific about which pros/cons mattered most.

### Implications
What does this decision force or enable?

---

Now log decision: $ARGUMENTS
