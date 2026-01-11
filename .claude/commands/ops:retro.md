---
description: Write a retrospective after shipping
argument-hint: [project or brief] - e.g., "brief-vim-mode", "proj-minwrite sprint-3"
---

# Ops: Retro $ARGUMENTS

You are writing a **retro** — a retrospective after shipping work.

---

## What is a Retro?

A retro captures what we learned after completing a brief or significant work:
- What worked well
- What didn't work
- What to do differently next time
- Patterns to extract

```
┌─────────────────────────────────────────────────────────────────┐
│                          RETRO                                   │
│                                                                  │
│   ↺ retro-vim-mode                                              │
│                                                                  │
│   Brief: brief-vim-mode (completed)                             │
│   Duration: 3 sessions over 2 days                              │
│                                                                  │
│   What Worked:                                                  │
│   ✓ Survey before planning caught the keybinding conflict       │
│   ✓ FSM for mode state was the right abstraction                │
│   ✓ Small tasks with clear done criteria                        │
│                                                                  │
│   What Didn't Work:                                             │
│   ✗ Started coding before fully understanding selection model   │
│   ✗ Didn't checkpoint before the 20-turn cliff                  │
│   ✗ Plan was too detailed for early steps, too vague for later  │
│                                                                  │
│   Patterns to Extract:                                          │
│   → "Survey the data model before the control flow"             │
│   → "Checkpoint every 10 turns, not just when confused"         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## When to Write a Retro

Write a retro when:
- A brief is marked completed
- A significant piece of work ships
- Something went notably well or poorly
- After a context reset / recovery

---

## Protocol

### 1. Gather Context

#### 1.1 Find the Completed Work

```bash
# Find the brief/plan
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops") | select(.id | contains("$ARGUMENTS"))]'
```

#### 1.2 Find Related Documents

```bash
# Surveys, plans, tasks, decisions for this work
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops") | select(.upstream[].doc | contains("brief-{slug}"))]'
```

### 2. Reflect on the Work

Consider:
- **Timeline:** How long did it take? How many sessions?
- **Process:** What was the actual workflow?
- **Surprises:** What was unexpected?
- **Pain points:** Where did we struggle?
- **Wins:** What went smoothly?

### 3. Write the Retro

Write to: `loomlib/docs/ops/retro/retro-{slug}.md`

```markdown
---
id: retro-{slug}
title: "Retro: {Work Description}"
type: retro
domain: ops
status: completed
tags: [retro, {category}]

intent: learn
execution_state: completed
upstream:
  - doc: brief-{slug}
    relation: reflects-on
downstream: []

project_id: proj-{project-slug}
---

# Retro: {Work Description}

**Brief:** brief-{slug}
**Completed:** {date}
**Duration:** {time span}

---

## Summary

{One paragraph: what was built, how it went overall}

---

## Timeline

| Phase | Duration | Notes |
|-------|----------|-------|
| Survey | {time} | {notes} |
| Plan | {time} | {notes} |
| Execute | {time} | {notes} |
| Total | {time} | |

---

## What Worked Well

### {Thing 1}
{Description of what worked and why}

### {Thing 2}
{Description}

---

## What Didn't Work

### {Thing 1}
{Description of what didn't work and impact}

**Root cause:** {why it happened}
**Next time:** {what to do differently}

### {Thing 2}
{Description}

**Root cause:** {why}
**Next time:** {what to do}

---

## Surprises

- {Unexpected thing 1}
- {Unexpected thing 2}

---

## Metrics (if applicable)

| Metric | Expected | Actual |
|--------|----------|--------|
| Tasks | {n} | {n} |
| Commits | {n} | {n} |
| Context resets | {n} | {n} |

---

## Patterns to Extract

### {Pattern 1}
{Description of reusable insight}

**When to use:** {context}
**Candidate for:** pat-{slug}

### {Pattern 2}
{Description}

---

## Action Items

- [ ] Extract pattern: {description}
- [ ] Update plan template: {what to add}
- [ ] Create decision doc: {if trade-off worth recording}

---

## Would I Do This Again?

{Honest assessment: was the process worth it? What would change?}
```

---

## The Retro Flow

```
Ship work → Write retro → Extract patterns → Improve process
                             │
                             ▼
                     /ops:pattern {insight}
```

---

## Composition

**Upstream:**
- Brief (the work being reflected on)
- Plan (how it was supposed to go)
- Tasks (what actually happened)
- Decisions (choices made along the way)

**Downstream:**
- Patterns (extracted insights)
- Future briefs (informed by lessons)

---

## Retro Hygiene

### Do
- Be honest about failures
- Credit what worked
- Extract actionable insights
- Link to specific documents

### Don't
- Blame without learning
- Skip the "what didn't work"
- Be vague ("it was hard")
- Forget to extract patterns

---

Now write retro for: $ARGUMENTS
