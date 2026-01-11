---
description: Document a Claude Code workflow pattern (explore→plan→code→commit, TDD loop, etc.)
argument-hint: [workflow-name] - e.g., "tdd", "explore-plan-code", "parallel-instances"
allowed-tools: Read, Grep, Glob, WebSearch
---

# Meta: Document Workflow $ARGUMENTS

You are documenting a **workflow pattern** — a reusable multi-step orchestration approach.

## What is a Workflow?

A workflow is a **sequence of steps** that Claude Code follows to accomplish a class of tasks. Unlike a single command, workflows involve:

- Multiple distinct phases
- Decision points between phases
- Different tools/commands at each phase
- Explicit checkpoints or handoffs

---

## Core Workflow Patterns

These are the canonical patterns from Claude Code best practices:

### 1. Explore → Plan → Code → Commit

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ Explore │ → │  Plan   │ → │  Code   │ → │ Commit  │
│(read,   │   │(propose,│   │(execute │   │(git add,│
│ don't   │   │ review) │   │ plan)   │   │ commit) │
│ write)  │   │         │   │         │   │         │
└─────────┘   └─────────┘   └─────────┘   └─────────┘
```

**Key constraint:** "Don't write code yet" in explore phase.

### 2. TDD Loop

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ Write   │ → │  Run    │ → │Implement│ → │ Commit  │
│ Tests   │   │ (fail)  │   │(pass)   │   │(separate│
│         │   │         │   │         │   │ commits)│
└─────────┘   └─────────┘   └─────────┘   └─────────┘
```

**Key constraint:** Tests define "done" before implementation.

### 3. Visual Feedback Loop

```
┌─────────┐   ┌─────────┐   ┌─────────┐
│Implement│ → │Screenshot│ → │  Fix    │ ──┐
│         │   │(compare) │   │         │   │
└─────────┘   └─────────┘   └─────────┘   │
      ▲                                    │
      └────────────────────────────────────┘
```

**Key constraint:** Iterate until visual match.

### 4. Parallel Multi-Claude

```
┌──────────────────────────────────────────────────┐
│                 PARALLEL EXECUTION                │
│                                                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│  │Instance1│  │Instance2│  │Instance3│           │
│  │(worktree│  │(worktree│  │(worktree│           │
│  │ task A) │  │ task B) │  │ task C) │           │
│  └─────────┘  └─────────┘  └─────────┘           │
│       │            │            │                 │
│       └────────────┴────────────┘                │
│                    ↓                              │
│              MERGE RESULTS                        │
└──────────────────────────────────────────────────┘
```

**Key constraint:** Tasks must be independent.

### 5. Writer-Reviewer Split

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ Claude  │ → │ /clear  │ → │ Claude  │ → │  Fix    │
│ writes  │   │(or new  │   │ reviews │   │ issues  │
│ code    │   │instance)│   │         │   │         │
└─────────┘   └─────────┘   └─────────┘   └─────────┘
```

**Key constraint:** Separate context for objectivity.

### 6. Checklist-Driven Work

```
┌─────────────────────────────────────────────────┐
│              EXTERNALIZED STATE                  │
│                                                  │
│  CHECKLIST.md:                                   │
│  [x] Step 1                                      │
│  [x] Step 2                                      │
│  [ ] Step 3 ← CURRENT                            │
│  [ ] Step 4                                      │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Key constraint:** File is the state, survives context resets.

---

## Protocol

### 1. Identify the Workflow

Match "$ARGUMENTS" to a known pattern or describe a new one:

| Pattern | Triggers |
|---------|----------|
| explore-plan-code | "epcc", "survey first", "understand then implement" |
| tdd | "test first", "red green", "test driven" |
| visual-feedback | "ui iteration", "screenshot compare", "visual match" |
| parallel | "multi-claude", "worktrees", "independent tasks" |
| writer-reviewer | "review split", "fresh eyes", "quality check" |
| checklist | "externalized state", "migration", "multi-file" |

### 2. Document the Workflow

For each workflow, capture:

| Field | Description |
|-------|-------------|
| **Name** | Short identifier |
| **Purpose** | What class of tasks this addresses |
| **Phases** | Distinct steps in the workflow |
| **Transitions** | What triggers moving to next phase |
| **Constraints** | Rules that must be followed |
| **Tools** | What commands/tools each phase uses |
| **Checkpoints** | Where state is externalized |
| **Failure Modes** | What goes wrong, how to fix |

### 3. Provide Examples

Include at least one concrete example of the workflow in action.

---

## Output

Write to: `loomlib/docs/meta/workflow/wf-{slug}.md`

```markdown
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: wf-{slug}
title: "Workflow: {Name}"
type: workflow
domain: meta
status: draft
tags: [workflow, {category}]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: build
execution_state: completed
upstream: []
downstream: []

# ─── WORKFLOW-SPECIFIC ──────────────────────────────────────
phases: [{phase1}, {phase2}, ...]
tools_per_phase:
  {phase1}: [{tool1}, {tool2}]
  {phase2}: [{tool3}]
checkpoint_files: [{file-patterns}]
---

# Workflow: {Name}

**Purpose:** {What class of tasks this addresses}

---

## Overview

{Brief description of what this workflow accomplishes}

```
{ASCII diagram of the workflow}
```

---

## Phases

### Phase 1: {Name}

**Goal:** {What this phase accomplishes}
**Tools:** {What commands/tools are used}
**Constraint:** {Key rule to follow}
**Output:** {What this phase produces}

### Phase 2: {Name}

...

---

## Transitions

| From | To | Trigger |
|------|-----|---------|
| {Phase 1} | {Phase 2} | {What triggers the transition} |
| ... | ... | ... |

---

## Constraints

1. **{Constraint name}:** {Description}
   - Why: {Reason}
   - Violation symptom: {What happens if broken}

---

## Checkpoints

| Checkpoint | File/State | Purpose |
|------------|------------|---------|
| {Name} | {Where saved} | {Why} |

---

## Failure Modes

### {Failure 1}

**Symptom:** {What goes wrong}
**Cause:** {Why it happens}
**Fix:** {How to recover}

---

## Example

### Scenario: {Description}

**Phase 1: {Name}**
```
{Example of what happens}
```

**Phase 2: {Name}**
```
{Example}
```

...

---

## Promotion Criteria

To reach **stable** status:
- [ ] All phases documented
- [ ] Transitions clear
- [ ] Constraints verified (tested)
- [ ] At least one example completed
- [ ] Failure modes documented

---

## Composition

**Upstream:**
- {What informs this workflow}

**Downstream:**
- {What this workflow enables}
```

---

## When to Use

- Documenting a proven pattern for reuse
- Training on Claude Code workflows
- Building a workflow catalog
- Debugging why a pattern isn't working

---

Now document workflow: $ARGUMENTS
