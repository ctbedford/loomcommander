---
description: Write a product brief - what to build and why (Product Director function)
argument-hint: [feature-name] - e.g., "vim-mode", "auth-system", "dark-theme"
---

# Ops: Brief $ARGUMENTS

You are writing a **brief** — the Product Director document that defines what to build and why.

---

## What is a Brief?

A brief captures the **what** and **why** before any code is written. It does NOT specify the how — that comes from surveys and plans.

```
┌─────────────────────────────────────────────────────────────────┐
│                           BRIEF                                  │
│                                                                  │
│   What: Add vim-style keybindings to the editor                 │
│                                                                  │
│   Why:                                                          │
│   - Power users expect modal editing                            │
│   - Reduces mouse usage for text manipulation                   │
│   - Differentiator from other writing apps                      │
│                                                                  │
│   Success Criteria:                                             │
│   □ Normal mode with hjkl navigation                            │
│   □ Insert mode with i/a/o entry                                │
│   □ Visual mode for selection                                   │
│   □ Common commands: dd, yy, p, u                               │
│                                                                  │
│   NOT in scope:                                                 │
│   - Ex commands (:w, :q)                                        │
│   - Macros                                                      │
│   - Registers beyond default                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Protocol

### 1. Identify the Project

Which codebase is this for?

```bash
# List active projects
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops") | select(.type == "project") | select(.status == "active")] | .[].id'
```

If not obvious from "$ARGUMENTS", ask the user.

### 2. Check for Existing Work

```bash
# Related briefs
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops") | select(.type == "brief") | select(.title | test("$ARGUMENTS"; "i"))]'

# Related surveys (might inform the brief)
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops") | select(.type == "survey") | select(.title | test("$ARGUMENTS"; "i"))]'
```

### 3. Gather Requirements

Ask the user (or derive from "$ARGUMENTS"):

1. **What** is being built? (one sentence)
2. **Why** is it needed? (user need, business goal)
3. **Success criteria** — how do we know it's done?
4. **Not in scope** — what are we explicitly NOT doing?
5. **Constraints** — timeline, dependencies, risks?

### 4. Write the Brief

Write to: `loomlib/docs/ops/brief/brief-{slug}.md`

```markdown
---
id: brief-{slug}
title: "Brief: {Feature Name}"
type: brief
domain: ops
status: draft
tags: [brief, {category}]

intent: define
execution_state: pending
upstream: []
downstream: []

project_id: proj-{project-slug}
---

# Brief: {Feature Name}

**Project:** {project name}
**Status:** Draft
**Created:** {date}

---

## What

{One paragraph describing what will be built}

---

## Why

### User Need
{What problem does this solve for users?}

### Business Goal
{Why does this matter for the product?}

### Evidence
{Any data, feedback, or research supporting this}

---

## Success Criteria

When this is done, we will have:

- [ ] {Criterion 1 — specific, testable}
- [ ] {Criterion 2}
- [ ] {Criterion 3}

---

## Not In Scope

Explicitly excluded from this brief:

- {Thing 1 — and why it's out}
- {Thing 2}

---

## Constraints

### Dependencies
- {What must exist before this can start?}

### Risks
- {What could go wrong?}

### Timeline
- {Any deadlines or urgency?}

---

## Open Questions

- [ ] {Question 1}
- [ ] {Question 2}

---

## Next Steps

1. [ ] Get brief approved
2. [ ] Run survey on relevant code
3. [ ] Create implementation plan
```

### 5. Request Approval

A brief moves from `draft` → `approved` when:
- Success criteria are clear and testable
- Scope is defined (including NOT in scope)
- Open questions are resolved or deferred

Ask the user:
> "This brief is ready for review. Should I mark it as approved so we can proceed with a survey?"

---

## Status Flow

```
draft → approved → active → completed
  │        │          │         │
  │        │          │         └── All success criteria met
  │        │          └── Implementation in progress
  │        └── Ready to execute
  └── Still defining requirements
```

---

## Composition

**Upstream:**
- Project (container)
- User feedback, research (informal)

**Downstream:**
- Survey (to understand current state)
- Plan (to define implementation)
- Tasks (to execute)

---

## Anti-Patterns

**Too vague:** "Make the editor better" — needs specific criteria
**Too detailed:** Specifying implementation — that's for the plan
**No scope boundary:** Everything is in scope — needs NOT in scope
**No success criteria:** Can't tell when it's done

---

Now create brief for: $ARGUMENTS
