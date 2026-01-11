---
description: Create an implementation plan (requires approval before coding)
argument-hint: [brief-id or feature] - e.g., "brief-vim-mode", "add auth to api"
---

# Ops: Plan $ARGUMENTS

You are creating a **plan** — the implementation approach that requires approval before coding.

**CRITICAL: Get user approval before implementing. Never code without an approved plan.**

---

## What is a Plan?

A plan answers: "How will we build this?" It bridges the brief (what) and tasks (execution).

```
┌─────────────────────────────────────────────────────────────────┐
│                           PLAN                                   │
│                                                                  │
│   For: brief-vim-mode                                           │
│   Status: AWAITING APPROVAL                                     │
│                                                                  │
│   Approach:                                                     │
│   1. Add mode state to editor (normal/insert/visual)            │
│   2. Create keybinding dispatcher by mode                       │
│   3. Implement normal mode commands (hjkl, dd, yy)              │
│   4. Implement mode transitions (i, a, v, Esc)                  │
│   5. Add visual mode selection                                  │
│                                                                  │
│   Files to Modify:                                              │
│   - src/editor/cursor.ts — add mode awareness                   │
│   - src/editor/keybindings.ts — mode-based dispatch             │
│                                                                  │
│   Files to Create:                                              │
│   - src/editor/vim/mode.ts — mode state machine                 │
│   - src/editor/vim/commands.ts — vim command implementations    │
│                                                                  │
│   Risks:                                                        │
│   - Keybinding conflicts with existing shortcuts                │
│   - Performance of command dispatch                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Protocol

### Phase 1: Gather Context

#### 1.1 Find the Brief

```bash
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops") | select(.type == "brief") | select(.id | contains("$ARGUMENTS") or .title | test("$ARGUMENTS"; "i"))]'
```

Read the brief to understand:
- Success criteria (what "done" looks like)
- Scope boundaries (what's NOT included)
- Constraints (dependencies, risks)

#### 1.2 Find Related Surveys

```bash
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops") | select(.type == "survey") | select(.upstream[].doc | contains("brief-"))]'
```

Read surveys to understand:
- Current architecture
- Patterns to follow
- Gotchas to avoid

#### 1.3 If No Survey Exists

Ask:
> "I don't see a survey for this area. Should I run `/ops:survey {target}` first, or do you want me to plan based on quick exploration?"

### Phase 2: Design the Approach

#### 2.1 Break Down the Work

List the logical steps to achieve the brief's success criteria.
Each step should be:
- Independently testable
- Small enough for one commit
- Clear about what changes

#### 2.2 Identify Files to Touch

For each step:
- Which files need modification?
- Which files need creation?
- Which files might break?

#### 2.3 Identify Risks

- What could go wrong?
- What's the fallback if this approach fails?
- Are there alternative approaches?

### Phase 3: Write the Plan

Write to: `loomlib/docs/ops/plan/plan-{slug}.md`

```markdown
---
id: plan-{slug}
title: "Plan: {Feature}"
type: plan
domain: ops
status: draft
tags: [plan, {category}]

intent: execute
execution_state: pending
upstream:
  - doc: brief-{slug}
    relation: implements
  - doc: surv-{slug}
    relation: informs
downstream: []

project_id: proj-{project-slug}
---

# Plan: {Feature}

**Brief:** brief-{slug}
**Status:** Awaiting Approval
**Created:** {date}

---

## Summary

{One paragraph: what we're building and the high-level approach}

---

## Approach

### Step 1: {Title}
{Description of what this step accomplishes}

**Files:**
- Modify: `{path}` — {what changes}
- Create: `{path}` — {why}

**Verification:**
- {How to test this step works}

### Step 2: {Title}
{Description}

**Files:**
- Modify: `{path}` — {what changes}

**Verification:**
- {How to test}

### Step 3: {Title}
...

---

## Files Summary

### To Modify
| File | Changes |
|------|---------|
| `{path}` | {description} |

### To Create
| File | Purpose |
|------|---------|
| `{path}` | {description} |

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| {Risk 1} | {H/M/L} | {How to handle} |
| {Risk 2} | {H/M/L} | {How to handle} |

---

## Alternative Approaches Considered

### {Alternative 1}
- **Approach:** {description}
- **Rejected because:** {reason}

---

## Test Strategy

### Unit Tests
- {What to test at unit level}

### Integration Tests
- {What to test at integration level}

### Manual Verification
- {What to check manually}

---

## Rollback

If this doesn't work:
```bash
git checkout -- {files}
```

---

## Approval Checklist

- [ ] Brief success criteria are addressed
- [ ] Survey findings are incorporated
- [ ] Risks are identified and mitigated
- [ ] Test strategy is clear
- [ ] Files to touch are enumerated

---

## Ready for Approval

This plan is ready for review. Once approved, I will create tasks for each step.
```

### Phase 4: Request Approval

Present the plan summary and ask:

> "Here's my plan for {feature}:
>
> **Approach:** {1-2 sentence summary}
> **Steps:** {count} steps
> **Files:** {count} to modify, {count} to create
> **Risks:** {main risk and mitigation}
>
> Should I proceed with implementation?"

**WAIT FOR EXPLICIT APPROVAL.**

---

## After Approval

Once approved:
1. Update plan status to `approved`
2. Create tasks for each step: `/ops:task {step description}`
3. Execute tasks in order

---

## Composition

**Upstream:**
- Brief (what we're implementing)
- Survey (understanding of current state)

**Downstream:**
- Tasks (atomic execution units)
- Decisions (if trade-offs arise during implementation)

---

## Anti-Patterns

**Planning without survey:** "I'll figure it out as I go" — leads to wrong approach
**Over-planning:** 20 steps for a simple change — break into smaller briefs
**Vague steps:** "Implement the feature" — needs specific files and changes
**No rollback:** Can't undo if things go wrong

---

Now create plan for: $ARGUMENTS
