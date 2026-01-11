---
description: Scope a feature for UX requirements - understand to derive what ought happen
argument-hint: <feature or area to scope>
---

# Scope: $ARGUMENTS

**CRITICAL: Focus on user experience, not code. Derive requirements, not just observations.**

You are producing a **loomlib instance** using the **Scope Method** toolkit.

## Scope Method

| Step | Action | Output |
|------|--------|--------|
| **Discovery** | Query API for related docs | Upstream surveys, prior scopes |
| **Audit** | Walk through current UX | What user sees and experiences |
| **Affordances** | What does UI suggest? | Mental models and promises |
| **Expectations** | What would user expect? | Natural flows and outcomes |
| **Gaps** | Where does reality diverge? | Is/ought mismatches |
| **Invariants/Variants** | What's fixed vs. open? | Constraints and freedoms |
| **Requirements** | What should change? | Prioritized, testable changes |

## Discovery (before Protocol)

Query the loomlib API to find related documents before producing.

### 1. Check for Related Surveys

```bash
# Find surveys that might inform this scope
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.id | contains("survey")) | select(.title | test("$ARGUMENTS"; "i")) | {id, title, status}]'
```

### 2. Check for Existing Scopes

```bash
# Find scopes on same or related topics
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.id | contains("scope")) | select(.title | test("$ARGUMENTS"; "i")) | {id, title, status}]'
```

### 3. Broader Search

```bash
# Find any related docs
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.title | test("$ARGUMENTS"; "i")) | {id, title, type, status}]'
```

### 4. Report & Decide

Based on discovery:

| Finding | Action |
|---------|--------|
| **Completed survey exists** | Read it, use findings as input, reference as upstream |
| **Draft survey exists** | Consider completing survey first, or proceed noting gap |
| **Prior scope exists** | Check if updating existing scope vs creating new one |
| **No related docs** | Proceed fresh, note that survey may be needed |

**Fallback** (if dev server not running):
```bash
ls loomlib/docs/instance/survey-* | grep -i "{slug}"
ls loomlib/docs/instance/scope-* | grep -i "{slug}"
```

---

## Protocol

### 1. Audit

Experience the feature as a user:
- Read relevant UI code (`src/views/`, `src/components/`, `src/ui/`)
- Note what the user sees, can interact with, and what feedback they get
- Document the current UX flow without judgment

### 2. Affordances

Analyze what the interface suggests is possible:
- What do buttons/icons/layouts imply?
- What mental models does this invoke? (file browser, graph, spreadsheet, etc.)
- What conventions does it follow or break?

Affordances are promises the UI makes.

### 3. Expectations

From a user's perspective:
- What should happen when they do X?
- What's the natural next step after Y?
- What information would they need here?
- What would delight vs frustrate them?

### 4. Gaps

Compare reality to expectation:
- Where does UI promise something it doesn't deliver?
- Where is the flow interrupted?
- Where would users get stuck?
- What's missing that users would expect?

Categorize gaps:
- **Blocking:** Cannot complete intended task
- **Friction:** Can complete but with difficulty
- **Polish:** Works but could be smoother

### 5. Invariants/Variants

Before deriving requirements, identify what's fixed vs. open:

**Invariants (cannot change):**
- What breaks if this changes?
- What do users depend on being stable?
- What's structurally required by the system?

**Variants (can change):**
- What design choices are genuinely open?
- What can expand without breaking anything?
- Where is there room for innovation?

**False invariants:**
- What looks fixed but is actually arbitrary?
- What conventions are treated as requirements but aren't?

**Hidden invariants:**
- What looks flexible but actually constrains?
- Where would "flexibility" break user expectations?

This prevents treating conventions as requirements and requirements as optional.

### 6. Requirements

Derive normative requirements:
- What's the minimum change to close each gap?
- What's the priority?
- What's explicitly out of scope?
- What are user-observable acceptance criteria?

## Output

Write the scope instance to: `loomlib/docs/instance/scope-{slug}.md`

```markdown
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-scope-{slug}
title: "Scope: {Feature/Area}"
type: instance
framework_kind: null
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [scope, ux, {relevant}, {tags}]

# ─── CONDUCTING ─────────────────────────────────────────────
actionable: true
intent: research
execution_state: completed
upstream:
  - doc: {survey-id-from-discovery}
    relation: informs
downstream: []
---

# Scope: {Feature/Area}

**Date:** {date}
**Subject:** {what was scoped}
**Method:** Scope Method (UX analysis)

---

## Audit

### Current UX Flow
{Step-by-step what user experiences}

### Key Interactions
{What user can do, what feedback they get}

---

## Affordances

### What the UI Promises
{Mental models invoked, conventions followed}

### Visual Hierarchy
{What's emphasized, what's de-emphasized}

---

## Expectations

### Natural User Flows
{What users would expect to do}

### Missing Affordances
{What users would expect to exist but doesn't}

---

## Gaps

| Gap | Type | Description |
|-----|------|-------------|
| {name} | Blocking | {user cannot...} |
| {name} | Friction | {user can but...} |
| {name} | Polish | {works but...} |

---

## Invariants/Variants

### Invariants (Cannot Change)
{What breaks if changed, what users depend on, structural requirements}

### Variants (Can Change)
{Open design choices, extensible elements, room for innovation}

### False Invariants
{Conventions mistaken for requirements, arbitrary constraints}

### Hidden Invariants
{Flexibility that would break expectations, disguised constraints}

---

## Requirements

### Must Have (Blocking)
- [ ] {requirement} — *Acceptance: {user-observable outcome}*

### Should Have (Friction)
- [ ] {requirement} — *Acceptance: {outcome}*

### Could Have (Polish)
- [ ] {requirement}

### Out of Scope
- {explicitly excluded items}

---

## Composition

**Upstream (what informed this scope):**
- [{Survey Title}]({survey-id}) — {what it provided}

**Downstream (what this scope enables):**
- Implementation work
- Ticket drafting

**Related (discovered but not upstream):**
- {other related docs found during discovery}

---

## Notes

{Additional context, dependencies, risks}
```

## Difference from Survey

| Survey | Scope |
|--------|-------|
| Descriptive | Normative |
| Code-facing | User-facing |
| "What is here?" | "What ought to happen?" |
| Produces understanding | Produces requirements |
| Read `src/data/`, `src/layout/` | Read `src/views/`, `src/components/`, `src/ui/` |

Use Survey first if you don't understand the implementation.
Use Scope when you need to derive what should change for users.

## Status

Scope instances start as `draft`. Promote to `verified` after:
- [ ] Discovery completed (API queried, related docs checked)
- [ ] All sections complete
- [ ] Gaps properly categorized
- [ ] Requirements have acceptance criteria
- [ ] Out of scope explicitly defined
- [ ] Upstream references accurate (from discovery)
- [ ] Reviewed against actual user needs

## Post-Completion

After writing the scope, report:

1. **What was discovered:** Related surveys, scopes, or other docs found
2. **What was used:** Which docs informed this scope (now in `upstream`)
3. **What this enables:** Next steps (implementation, tickets, etc.)

Example:
```
Discovery found:
- inst-survey-editor-persistence (draft) — used as upstream
- inst-scope-editor-view (verified) — related but different feature

This scope enables:
- Implementation of persistence fixes
- Potential Jira ticket for P2 board
```

Now scope: $ARGUMENTS
