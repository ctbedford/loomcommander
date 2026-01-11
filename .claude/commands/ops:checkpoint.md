---
description: Preserve context for session resume (20-turn cliff management)
argument-hint: [description] - e.g., "mid-vim-implementation", "debugging-selection-bug"
---

# Ops: Checkpoint $ARGUMENTS

You are creating a **checkpoint** — a context snapshot for session resume.

---

## Why Checkpoints?

Agent performance degrades after ~15-20 turns:
- Repetition increases
- Instructions drift
- Claims of work not actually done

A checkpoint externalizes state so you can:
1. `/clear` to reset context
2. Resume from the checkpoint
3. Continue with fresh attention

```
┌─────────────────────────────────────────────────────────────────┐
│                        CHECKPOINT                                │
│                                                                  │
│   ⏸ chk-vim-mode-step-3                                         │
│                                                                  │
│   Context: Implementing vim mode, completed steps 1-2           │
│                                                                  │
│   Current State:                                                │
│   ✓ Mode state added to cursor.ts                               │
│   ✓ Keybinding dispatcher refactored                            │
│   → Next: Implement normal mode commands                        │
│                                                                  │
│   Files Changed:                                                │
│   - src/editor/cursor.ts (mode property added)                  │
│   - src/editor/keybindings.ts (dispatcher by mode)              │
│                                                                  │
│   Working Hypothesis:                                           │
│   - Commands should return new cursor state                     │
│   - Need to handle count prefixes (3j = down 3 lines)          │
│                                                                  │
│   Resume With:                                                  │
│   "Continue vim mode implementation from step 3.                │
│    See chk-vim-mode-step-3 for context."                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## When to Checkpoint

### Proactively (recommended)
- Every 10-12 turns
- Before starting a complex sub-task
- After completing a logical step
- Before any risky operation

### Reactively (damage control)
- When you notice repetition
- When instructions seem ignored
- When confusion is building
- Before forced context switch

---

## Protocol

### 1. Capture Current State

#### 1.1 What's Done

List completed tasks/steps:
```bash
git log --oneline -5  # Recent commits
git status  # Current changes
```

#### 1.2 What's In Progress

- Current task
- Current file being edited
- Current hypothesis/approach

#### 1.3 What's Blocked/Open

- Open questions
- Decisions needed
- Risks identified

### 2. Write the Checkpoint

Write to: `loomlib/docs/ops/checkpoint/chk-{slug}.md`

```markdown
---
id: chk-{slug}
title: "Checkpoint: {Description}"
type: checkpoint
domain: ops
status: active
tags: [checkpoint, {context}]

intent: organize
execution_state: in_progress
upstream:
  - doc: plan-{slug}  # or task-{slug}
    relation: pauses
downstream: []

project_id: proj-{project-slug}
turn_count: {estimated turns so far}
---

# Checkpoint: {Description}

**Created:** {timestamp}
**Context:** {plan/task being worked on}
**Turn Count:** ~{n} turns

---

## Current Goal

{What we're trying to accomplish}

---

## Completed

- [x] {Step/task 1}
- [x] {Step/task 2}
- [x] {Step/task 3}

---

## In Progress

**Current task:** {description}

**Current file:** `{path}`

**Current approach:** {what we're trying}

---

## Working State

### Files Changed (uncommitted)
```bash
{git status output or list}
```

### Recent Commits
```bash
{git log --oneline -3}
```

---

## Key Context

### Architecture Understanding
- {Key insight 1}
- {Key insight 2}

### Working Hypothesis
- {Hypothesis about how to proceed}

### Gotchas Discovered
- {Non-obvious thing 1}
- {Non-obvious thing 2}

---

## Open Questions

- [ ] {Question 1}
- [ ] {Question 2}

---

## Next Steps

1. {Immediate next action}
2. {Following action}
3. {And then}

---

## Resume Prompt

Copy this to resume after /clear:

\`\`\`
I'm resuming work on {project/task}.
See checkpoint chk-{slug} for context.

Current state: {one sentence summary}
Next step: {immediate next action}

Please read the checkpoint and continue from there.
\`\`\`
```

### 3. Clear and Resume

After creating checkpoint:

```
1. /clear
2. Paste the resume prompt
3. Claude reads checkpoint, continues work
```

---

## Checkpoint Lifecycle

```
active → resumed → archived
   │        │          │
   │        │          └── No longer needed
   │        └── Work continued from here
   └── Ready for resume
```

When work completes:
- Mark checkpoint as `archived`
- It serves as historical record

---

## Composition

**Upstream:**
- Task (what's being paused)
- Plan (larger context)

**Downstream:**
- Resumed work (continuation)

---

## Checkpoint Hygiene

### Include
- Concrete state (files, commits)
- Working hypothesis
- Next concrete action
- Resume prompt

### Exclude
- Full conversation history
- Irrelevant tangents
- Already-committed work details

---

## Quick Checkpoint

For simple pauses, inline in conversation:

```
CHECKPOINT: {description}
- Done: {list}
- Next: {action}
- Files: {paths}
- Resume: "{prompt}"
```

Then `/clear` and paste the resume.

---

Now create checkpoint: $ARGUMENTS
