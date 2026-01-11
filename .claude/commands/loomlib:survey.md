---
description: Deep codebase investigation - understand before changing (project)
argument-hint: [topic or subsystem to investigate]
allowed-tools: Read, Grep, Glob, Bash(find:*), Bash(git log:*), Bash(git blame:*)
---

# Survey: $ARGUMENTS

**CRITICAL: Do not write any code. Do not propose changes. Only investigate and report.**

You are producing a **loomlib instance** using the **Survey Method** toolkit.

## Survey Method

| Step | Action | Output |
|------|--------|--------|
| **Survey** | Map terrain with grep/glob | List of relevant files |
| **Core Sample** | Read 2-3 central files | Entry points, data flow, abstractions |
| **Stratigraphy** | Trace layers and history | Call hierarchy, state location, boundaries |
| **Findings** | Synthesize understanding | One-paragraph summary + key files |
| **Open Questions** | Identify gaps | What remains unclear |

## Discovery (before Protocol)

Query the loomlib API to find related documents before producing.

### 1. Check for Related Surveys

```bash
# Find surveys on same or related topics
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.id | contains("survey")) | select(.title | test("$ARGUMENTS"; "i")) | {id, title, status, execution_state}]'
```

### 2. Check for Related Frameworks

```bash
# Find frameworks that might provide method or context
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "framework") | select(.title | test("$ARGUMENTS"; "i")) | {id, title, framework_kind}]'
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
| **Prior survey exists** | Reference as upstream with `relation: prior` |
| **Related scope exists** | Note as related context |
| **Framework applies** | Reference as upstream with `relation: method` |
| **No related docs** | Proceed fresh |

**Fallback** (if dev server not running):
```bash
ls loomlib/docs/instance/survey-* | grep -i "{slug}"
ls loomlib/docs/framework/ | grep -i "{slug}"
```

---

## Protocol

### 1. Survey
List all files that might be relevant to "$ARGUMENTS". Use grep/glob to identify candidates.
Don't read everything yet—just map the terrain.

### 2. Core Sample
Read the 2-3 most central files. Identify:
- Entry points (where does execution begin?)
- Data flow direction (what calls what?)
- Key abstractions (what patterns are used?)
- External dependencies (APIs, databases, services)

### 3. Stratigraphy
Trace the layers:
- Call hierarchy (use git blame for history if helpful)
- State location (where does data live?)
- Boundary conditions (what are the edges?)

### 4. Findings
Synthesize what you learned:
- How the subsystem works (one paragraph)
- Key files and their roles
- Data flow summary
- Dependencies (internal and external)
- Potential risks or complexity hotspots

### 5. Open Questions
What remains unclear? What would require deeper investigation?

### 6. Decisions (if implementation follows)
If this survey informs implementation work, resolve open questions before coding:
- Document decision options considered
- Record the choice made and rationale
- Derive implementation constraints from decisions

Skip this section for pure research surveys with no immediate implementation.

## Output

Write the survey instance to: `loomlib/docs/instance/survey-{slug}.md`

```markdown
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-survey-{slug}
title: "Survey: {Topic}"
type: instance
framework_kind: null
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [survey, {relevant}, {tags}]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-survey-method
    relation: method
  - doc: {prior-survey-id-from-discovery}
    relation: prior
downstream: []
---

# Survey: {Topic}

**Date:** {date}
**Subject:** {what was investigated}
**Method:** Survey Method (static analysis)

---

## Survey

Relevant files:
- `path/to/file.ts` — {role}
- `path/to/other.ts` — {role}

---

## Core Sample

### Entry Points
{Where execution begins}

### Data Flow
{What calls what, how data moves}

### Key Abstractions
{Patterns, interfaces, core types}

---

## Stratigraphy

### Call Hierarchy
{What calls what}

### State Location
{Where data lives, how it's structured}

### Boundary Conditions
{Edges, limits, external interfaces}

---

## Findings

{Synthesis paragraph — how the subsystem works}

### Key Files

| File | Role |
|------|------|
| `path/file.ts` | {description} |

### Dependencies
- Internal: {what this subsystem depends on}
- External: {APIs, services, libraries}

### Complexity Hotspots
- {area of concern}

---

## Open Questions

- {What remains unclear}
- {What needs deeper investigation}

---

## Decisions

*(Include this section only if survey informs implementation. Otherwise omit.)*

Decisions required before implementation:

| Question | Options | Decision | Rationale |
|----------|---------|----------|-----------|
| {Open question} | {Option A / Option B / ...} | **{Choice}** | {Why this choice} |

### Implementation Constraints (from decisions)

1. {Constraint derived from decisions}
2. {Another constraint}

---

## Composition

**Upstream (what informed this survey):**
- [Survey Method](fw-survey-method) — method used
- [{Prior Survey Title}]({prior-survey-id}) — prior work referenced

**Downstream (what this survey enables):**
- Scope work on this topic
- Implementation planning

**Related (discovered but not upstream):**
- {other related docs found during discovery}
```

## When to Use This Command

- Before refactoring a subsystem you don't understand
- When onboarding to unfamiliar code
- Before estimating work on a feature
- When debugging requires understanding context

## Constraints

- **Read-only:** Do not modify any files
- **No proposals:** Do not suggest changes (that comes after understanding)
- **Report first:** Write findings before any other action

## Status

Survey instances typically start as `draft`. Promote to `verified` after:
- [ ] Discovery completed (API queried, related docs checked)
- [ ] All sections complete
- [ ] Key files accurately identified
- [ ] Dependencies mapped
- [ ] Open questions are genuine gaps, not laziness
- [ ] Upstream references accurate (from discovery)
- [ ] If implementation follows: Decisions section resolves blocking questions

## Post-Completion

After writing the survey, report:

1. **What was discovered:** Related surveys, frameworks, or other docs found
2. **What was used:** Which docs informed this survey (now in `upstream`)
3. **What this enables:** Next steps (scope, implementation, etc.)

Example:
```
Discovery found:
- inst-survey-editor-implementation (verified) — referenced as prior
- fw-survey-method (verified) — used as method

This survey enables:
- Scope work on editor persistence
- Implementation planning for persistence fixes
```

Now survey: $ARGUMENTS
