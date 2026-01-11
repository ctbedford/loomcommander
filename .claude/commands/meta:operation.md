---
description: Execute an autonomous operation with survey→plan→implement→test→commit cycle
argument-hint: [task-description] - e.g., "migrate all commands to new format", "add discovery to scope command"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Meta: Operation $ARGUMENTS

You are executing an **autonomous operation** — a one-off task with a full survey→plan→implement→test→commit cycle.

**This is the meta domain's most powerful command.** It combines all the Claude Code best practices into a single orchestrated workflow.

---

## The Operation Cycle

```
┌──────────────────────────────────────────────────────────────────────┐
│                        AUTONOMOUS OPERATION                           │
│                                                                       │
│   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌────────┐ │
│   │ SURVEY  │ → │  PLAN   │ → │IMPLEMENT│ → │  TEST   │ → │ COMMIT │ │
│   │         │   │         │   │         │   │         │   │        │ │
│   │(read,   │   │(propose,│   │(execute │   │(build,  │   │(if     │ │
│   │ don't   │   │ await   │   │ plan)   │   │ verify) │   │ green) │ │
│   │ write)  │   │ approval│   │         │   │         │   │        │ │
│   └─────────┘   └─────────┘   └─────────┘   └─────────┘   └────────┘ │
│                      ↓                            ↓                   │
│              [User Approval]              [If fail: fix loop]         │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Survey

**CRITICAL: Do not write any code in this phase.**

### 1.1 Understand the Task

Parse "$ARGUMENTS" to understand:
- What needs to change
- Why it needs to change
- What success looks like

### 1.2 Find Relevant Files

```bash
# Use glob/grep to find relevant files
# Document what you find
```

### 1.3 Read Key Files

Read 2-3 central files to understand:
- Current implementation
- Patterns in use
- Dependencies

### 1.4 Check for Prior Work

```bash
# Check for related operations
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "meta") | select(.type == "operation") | select(.title | test("$ARGUMENTS"; "i"))]'
```

### 1.5 Survey Output

Summarize:
- **Relevant files:** List files that need to change
- **Current state:** How things work now
- **Patterns found:** What approaches are in use
- **Dependencies:** What might break

---

## Phase 2: Plan

**CRITICAL: Get user approval before implementing.**

### 2.1 Write the Plan

Create a plan document or state it clearly:

```markdown
## Operation Plan: {Task}

### Goal
{What we're trying to accomplish}

### Approach
1. {Step 1}
2. {Step 2}
3. {Step 3}

### Files to Modify
- `{path}` — {what changes}
- `{path}` — {what changes}

### Files to Create
- `{path}` — {why}

### Test Strategy
- Build: `{command}`
- Manual verification: {what to check}

### Rollback
- `git checkout -- {files}` if needed
```

### 2.2 Request Approval

Ask the user:
> "This is my plan for '$ARGUMENTS'. Should I proceed with implementation?"

**Wait for explicit approval.**

---

## Phase 3: Implement

**Only after user approval.**

### 3.1 Execute the Plan

Work through each step in order.

### 3.2 Checkpoint Often

After every 3-5 edits:
- Review what's changed
- Verify no errors introduced
- Consider intermediate commit

### 3.3 Track Progress

Keep a mental (or written) checklist of plan steps.

---

## Phase 4: Test

**CRITICAL: Always test before committing.**

### 4.1 Run Build

```bash
cd loomlib && npm run build
```

### 4.2 Run Tests (if applicable)

```bash
cd loomlib && npm test
```

### 4.3 Manual Verification

If the task involves UI or runtime behavior:
- Start the dev server
- Verify the change works
- Check for regressions

### 4.4 Handle Failures

If tests fail:
1. Read the error
2. Fix the issue
3. Re-run tests
4. Repeat until green

**Do NOT commit failing tests.**

---

## Phase 5: Commit

**Only after tests pass.**

### 5.1 Stage Changes

```bash
git add {relevant-files}
```

### 5.2 Write Commit Message

Format:
```
{type}({scope}): {description}

{body if needed}

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `meta`

### 5.3 Commit

```bash
git commit -m "$(cat <<'EOF'
{commit message}

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### 5.4 Verify

```bash
git status
git log -1
```

---

## Phase 6: Document (Optional)

If this operation is notable:

Write to: `loomlib/docs/meta/operation/op-{slug}.md`

```markdown
---
id: op-{slug}
title: "Operation: {Task}"
type: operation
domain: meta
status: stable
tags: [operation, {category}]

intent: produce
execution_state: resolved
upstream: []
downstream: []

# ─── OPERATION-SPECIFIC ──────────────────────────────────────
commit_sha: {sha}
files_changed: [{file1}, {file2}]
test_command: {command}
---

# Operation: {Task}

**Date:** {date}
**Commit:** {sha}
**Status:** Completed

---

## Summary

{What was accomplished}

---

## Changes Made

- `{file}` — {description}

---

## Verification

{How it was tested}

---

## Lessons Learned

{Any insights for future operations}
```

---

## Failure Recovery

### Context Degradation

If after 15+ turns things feel unfocused:
1. Create checkpoint document with current state
2. `/clear`
3. Resume from checkpoint

### Build Failures

1. Read error carefully
2. Fix one error at a time
3. Re-run build after each fix

### Wrong Approach

If implementation isn't working:
1. `git checkout -- .` to reset
2. Return to Plan phase
3. Try different approach

---

## Constraints

- **Survey before implement:** Never skip the survey phase
- **Plan approval:** Never implement without user approval
- **Test before commit:** Never commit failing code
- **Atomic commits:** One logical change per commit
- **Context hygiene:** Clear context if confused

---

Now execute operation: $ARGUMENTS
