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

## Output

Write the survey instance to: `loomlib/docs/instance/survey-{slug}.md`

```markdown
---
id: inst-survey-{slug}
title: "Survey: {Topic}"
type: instance
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [survey, {relevant}, {tags}]
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
- [ ] All sections complete
- [ ] Key files accurately identified
- [ ] Dependencies mapped
- [ ] Open questions are genuine gaps, not laziness

Now survey: $ARGUMENTS
