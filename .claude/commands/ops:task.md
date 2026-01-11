---
description: Create an atomic work unit (single commit scope)
argument-hint: [description] - e.g., "add mode state to cursor.ts", "implement hjkl navigation"
---

# Ops: Task $ARGUMENTS

You are creating a **task** — an atomic work unit with single commit scope.

---

## What is a Task?

A task is the smallest unit of executable work. It should:
- Be completable in one focused session
- Result in a single commit
- Have clear "done" criteria
- Be independently verifiable

```
┌─────────────────────────────────────────────────────────────────┐
│                           TASK                                   │
│                                                                  │
│   □ task-add-mode-state                                         │
│                                                                  │
│   Description: Add mode state (normal/insert/visual) to cursor  │
│                                                                  │
│   Files:                                                        │
│   - src/editor/cursor.ts (modify)                               │
│                                                                  │
│   Done when:                                                    │
│   - Mode type exists: 'normal' | 'insert' | 'visual'           │
│   - Cursor has mode property                                    │
│   - Mode can be changed via setMode()                           │
│   - Tests pass for mode transitions                             │
│                                                                  │
│   Status: todo → in_progress → done → verified                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Protocol

### 1. Context Check

#### 1.1 Find Parent Plan (if exists)

```bash
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops") | select(.type == "plan") | select(.status == "approved" or .status == "active")]'
```

If creating from an approved plan, the task should map to a plan step.

#### 1.2 Identify Project

```bash
pwd
```

### 2. Define the Task

From "$ARGUMENTS", extract:
- **What** to do (one sentence)
- **Files** to touch
- **Done criteria** (how to verify)

### 3. Create Task Document

Write to: `loomlib/docs/ops/task/task-{slug}.md`

```markdown
---
id: task-{slug}
title: "Task: {Description}"
type: task
domain: ops
status: todo
tags: [task, {category}]

intent: execute
execution_state: pending
upstream:
  - doc: plan-{slug}  # if from a plan
    relation: step-of
downstream: []

project_id: proj-{project-slug}
---

# Task: {Description}

**Plan:** {plan-id or "standalone"}
**Status:** Todo
**Created:** {date}

---

## Description

{What this task accomplishes}

---

## Files

| Action | File | Changes |
|--------|------|---------|
| Modify | `{path}` | {what changes} |
| Create | `{path}` | {purpose} |

---

## Done Criteria

This task is done when:

- [ ] {Criterion 1}
- [ ] {Criterion 2}
- [ ] {Criterion 3}
- [ ] Build passes
- [ ] Tests pass (if applicable)

---

## Execution Notes

{Space for notes during execution}

---

## Commit Message (template)

```
{type}({scope}): {description}

{body if needed}

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```
```

### 4. Execute the Task (if requested)

When user says to execute:

#### 4.1 Update Status

Change `status: todo` → `status: in_progress` (or just note it)

#### 4.2 Do the Work

Follow the task definition:
1. Read relevant files first
2. Make the changes
3. Verify done criteria

#### 4.3 Test

```bash
# Build
cd {project} && npm run build

# Test
cd {project} && npm test
```

#### 4.4 Commit

```bash
git add {files}
git commit -m "$(cat <<'EOF'
{type}({scope}): {description}

{body}

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

#### 4.5 Update Status

Change `status: in_progress` → `status: done`
Update `execution_state: completed`

---

## Task States

```
todo → in_progress → done → verified
  │         │          │        │
  │         │          │        └── Confirmed working in broader context
  │         │          └── Criteria met, committed
  │         └── Being worked on
  └── Defined, not started
```

---

## Composition

**Upstream:**
- Plan (parent container)
- Brief (original requirement)

**Downstream:**
- None (tasks are leaf nodes)
- May trigger Decision if trade-offs arise

---

## Task Hygiene

### Good Tasks
- "Add mode type to cursor.ts" — specific file, specific change
- "Implement hjkl navigation in normal mode" — clear scope
- "Write tests for mode transitions" — verifiable

### Bad Tasks
- "Implement vim mode" — too big, should be multiple tasks
- "Fix the editor" — too vague
- "Make it work" — no criteria

---

## Quick Task Creation

For simple tasks, you can create inline:

```
Task: {description}
Files: {file1}, {file2}
Done: {criteria}
```

This can be tracked in the plan document rather than creating a separate file.

---

Now create task: $ARGUMENTS
