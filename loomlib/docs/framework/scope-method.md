---
id: fw-scope-method
title: Scope Method
type: framework
framework_kind: toolkit
perspective: null
framework_ids: []
source_id: null
output: loomcommander
status: draft
tags: [scope, ux, affordances, requirements, normative]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: build
execution_state: completed
upstream:
  - doc: fw-survey-method
    relation: prior
  - doc: fw-invariants-variants
    relation: informs
downstream: []
---

# Scope Method

**Type:** Toolkit Framework
**Purpose:** Derive requirements from user experience analysis

## The Distinction

**Survey** asks: *What is here?* (descriptive, code-facing)
**Scope** asks: *What ought to happen?* (normative, user-facing)

Survey reads the codebase. Scope reads the experience. Survey produces understanding. Scope produces requirements.

## The Method

| Step | Action | Output |
|------|--------|--------|
| **Audit** | Walk through current UX | What the user sees, touches, experiences |
| **Affordances** | What does UI suggest is possible? | Mental models the interface invokes |
| **Expectations** | What would user expect next? | Natural flows and intuitive outcomes |
| **Gaps** | Where does reality diverge? | Is/ought mismatches |
| **Invariants/Variants** | What's fixed vs. open? | Constraints and design freedoms |
| **Requirements** | What should change? | Scoped, prioritized changes |

## Protocol

### 1. Audit

Experience the feature as a user would:
- What do they see first?
- What can they interact with?
- What feedback do they get?
- What state persists?

Document the current UX without judgment. Pure observation.

### 2. Affordances

Analyze what the interface *suggests*:
- What does this button look like it does?
- What mental models does this layout invoke?
- What conventions does it follow or break?
- What does the visual hierarchy emphasize?

Affordances are promises. The UI is making claims about what's possible.

### 3. Expectations

From a user's perspective:
- If I click this, what should happen?
- After completing this action, what's the natural next step?
- What information would I need here?
- What would delight me? What would frustrate me?

Think in user stories and flows, not implementation details.

### 4. Gaps

Compare reality to expectation:
- Where does the UI promise something it doesn't deliver?
- Where is the flow interrupted or confusing?
- Where are users likely to get stuck?
- What's missing that users would naturally expect?

Gaps are opportunities. They show where the product isn't meeting its own implied promises.

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

**False invariants:** Conventions mistaken for requirements. "We've always done it this way" isn't a constraint.

**Hidden invariants:** Flexibility that would break expectations. Some things *look* open but changing them would confuse users.

This step prevents treating conventions as requirements (rigidity) and requirements as optional (chaos).

### 6. Requirements

Derive what should change:
- What's the minimum change to close each gap?
- What's the priority? (Blocking → Friction → Polish)
- What's the scope boundary? (What's explicitly out?)
- What are the acceptance criteria from user perspective?

Requirements are normative. They describe the future state, not the current one.

## Output Categories

**Blocking:** User cannot complete intended task
**Friction:** User can complete but with unnecessary difficulty
**Polish:** User can complete but experience could be smoother
**Delight:** Opportunities to exceed expectations

## The Scope Document Structure

```markdown
# Scope: {Feature/Area}

**Date:** {date}
**Subject:** {what was scoped}
**Method:** Scope Method (UX analysis)

## Audit
{Current UX walkthrough}

## Affordances
{What the UI promises}

## Expectations
{What users would naturally expect}

## Gaps
| Gap | Type | Description |
|-----|------|-------------|
| {name} | Blocking/Friction/Polish | {description} |

## Invariants/Variants
### Invariants (Cannot Change)
{What breaks if changed, what users depend on}

### Variants (Can Change)
{Open design choices, extensible elements}

### False Invariants
{Conventions mistaken for requirements}

### Hidden Invariants
{Flexibility that would break expectations}

## Requirements
### Must Have
- {requirement with acceptance criteria}

### Should Have
- {requirement}

### Out of Scope
- {explicitly excluded}
```

## When to Use

- Before implementing a new feature (scope the UX first)
- When refactoring user-facing code
- When users report confusion (scope the gap)
- When planning a release (scope priorities)
- After survey, to translate understanding into action

## Relationship to Survey

```
Survey (what is) → Understanding → Scope (what ought) → Requirements → Implementation
```

Survey without Scope = understanding without direction
Scope without Survey = requirements without grounding

The two methods complement each other. Survey the code, then scope the experience.

## Constraints

- **User-facing only:** This method is for UX, not internal architecture
- **Normative output:** End with requirements, not just observations
- **Bounded:** Every scope must have explicit "out of scope" section
- **Testable:** Requirements must have user-observable acceptance criteria
