---
description: Dashboard view of ops domain state
argument-hint: [filter] - e.g., empty for all, "proj-minwrite" for project, "active" for active work
---

# Ops: Status $ARGUMENTS

You are viewing the **ops dashboard** — current state across all projects and work.

---

## Protocol

### 1. Query the Ops Domain

```bash
# All ops documents
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops")]'
```

### 2. If Filter Provided

Parse "$ARGUMENTS":
- Project filter: `proj-{name}` → show only that project's work
- Status filter: `active` → show only active/in-progress items
- Type filter: `briefs` → show only briefs

### 3. Generate Dashboard

---

## Dashboard Format

```
┌─────────────────────────────────────────────────────────────────┐
│                       OPS DASHBOARD                              │
│                       {timestamp}                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PROJECTS                                                        │
│  ─────────                                                       │
│  ◇ proj-minwrite      active     3 briefs, 5 tasks              │
│  ◇ proj-loomlib       active     1 brief, 2 tasks               │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ACTIVE WORK                                                     │
│  ───────────                                                     │
│  ◈ brief-vim-mode          active     proj-minwrite             │
│    ▣ plan-vim-mode         approved                             │
│      □ task-add-mode       in_progress                          │
│      □ task-hjkl-nav       todo                                 │
│      □ task-mode-switch    todo                                 │
│                                                                  │
│  ◈ brief-dark-theme        draft      proj-minwrite             │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PENDING DECISIONS                                               │
│  ─────────────────                                               │
│  ⊕ dec-state-machine       draft      needs approval            │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  RECENT ACTIVITY                                                 │
│  ───────────────                                                 │
│  {today}    task-add-mode completed                             │
│  {today}    plan-vim-mode approved                              │
│  {yesterday} surv-editor completed                              │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CHECKPOINTS                                                     │
│  ───────────                                                     │
│  ⏸ chk-vim-step-3    active    "resume vim implementation"      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Sections

### Projects Section

List all projects with:
- Status (active/archived)
- Count of briefs and tasks
- Health indicators if available

### Active Work Section

Hierarchical view:
```
Brief (what)
  └── Plan (how)
        └── Tasks (atomic work)
```

Show only non-archived, non-completed items.

### Pending Decisions Section

Decisions in `draft` status that need review.

### Recent Activity Section

Last 5-10 status changes across all document types.

### Checkpoints Section

Active checkpoints that can be resumed.

---

## Filtered Views

### By Project

`/ops:status proj-minwrite`

Show only work for that project:
```
┌─────────────────────────────────────────────────────────────────┐
│  PROJECT: minwrite                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  BRIEFS                                                          │
│  ◈ brief-vim-mode      active    → plan approved, 3 tasks       │
│  ◈ brief-dark-theme    draft     → needs approval               │
│                                                                  │
│  SURVEYS                                                         │
│  ◧ surv-editor         completed                                │
│  ◧ surv-keybindings    completed                                │
│                                                                  │
│  DECISIONS                                                       │
│  ⊕ dec-state-machine   active                                   │
│                                                                  │
│  PATTERNS                                                        │
│  ⚙ pat-immutable-state extracted from retro-cursor              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Active Only

`/ops:status active`

Show only in-progress work across all projects.

### By Type

`/ops:status briefs` or `/ops:status tasks`

---

## Health Indicators

When displaying projects, note health issues:

```
◇ proj-minwrite    active    ⚠ 2 tasks stale (>7 days)
◇ proj-loomlib     active    ✓ healthy
◇ proj-old         archived
```

Stale indicators:
- Tasks in `in_progress` for >7 days
- Briefs in `approved` with no plan
- Plans in `approved` with no tasks
- Active checkpoints >3 days old

---

## Quick Stats

At the top of any dashboard:

```
Projects: 3 (2 active)
Briefs: 5 (2 active, 1 draft)
Tasks: 12 (3 in_progress, 4 todo, 5 done)
Decisions: 2 (1 pending)
Checkpoints: 1 active
```

---

## Output

Generate the appropriate dashboard based on "$ARGUMENTS" filter.

If no ops documents exist yet:

```
┌─────────────────────────────────────────────────────────────────┐
│                       OPS DASHBOARD                              │
│                                                                  │
│  No projects registered yet.                                     │
│                                                                  │
│  Get started:                                                    │
│  1. /ops:project {path}  — Register a codebase                  │
│  2. /ops:brief {feature} — Define what to build                 │
│  3. /ops:survey {target} — Understand before changing           │
│  4. /ops:plan {brief}    — Create implementation plan           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

Now show status: $ARGUMENTS
