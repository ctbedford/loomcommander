---
id: fw-survey-method
title: Survey Method
type: framework
framework_kind: toolkit
status: verified
perspective: null
framework_ids: []
source_id: null
output: null
tags: [codebase, investigation, structure, archaeology]
---

# Survey Method

## Purpose

Understand a codebase or subsystem before changing it. The Survey Method produces structural knowledge — how code is organized, what calls what, where state lives.

## Core Distinction

**Mapping vs. Modifying** — Survey is read-only investigation. You produce understanding, not changes. The output is a document that captures what you learned so you (or others) can act on it later.

## Method

### Step 1: Survey

Map the terrain. Use grep/glob to identify relevant files without reading them deeply yet.

**Output:** List of candidate files with suspected roles.

### Step 2: Core Sample

Read the 2-3 most central files. Identify:
- Entry points (where does execution begin?)
- Data flow direction (what calls what?)
- Key abstractions (what patterns are used?)
- External dependencies (APIs, databases, services)

**Output:** Understanding of the structural center.

### Step 3: Stratigraphy

Trace the layers:
- Call hierarchy (use git blame for history if helpful)
- State location (where does data live?)
- Boundary conditions (what are the edges?)

**Output:** Understanding of depth and dependencies.

### Step 4: Findings

Synthesize what you learned:
- How the subsystem works (one paragraph)
- Key files and their roles
- Data flow summary
- Dependencies (internal and external)
- Complexity hotspots

**Output:** Actionable summary.

### Step 5: Open Questions

What remains unclear? What would require deeper investigation?

**Output:** Honest assessment of knowledge gaps.

## Operators

Survey Method uses location operators:

| Operator | Reveals | Example |
|----------|---------|---------|
| **OF** | What subsystem | Survey OF authentication |
| **WITHIN** | Scope boundary | Survey WITHIN src/editor |
| **FOR** | Purpose | Survey FOR refactoring |

## Output

Survey produces **instances** — structured documents that capture understanding of a specific codebase area.

- **Channel:** loomcommander
- **Format:** Markdown with standard sections
- **Location:** `loomlib/docs/instance/survey-{slug}.md`

## Boundary Conditions

**Use Survey when:**
- Before refactoring unfamiliar code
- Onboarding to a new codebase
- Before estimating work
- Debugging requires context

**Don't use Survey when:**
- You already understand the code
- The task is trivial
- You need runtime behavior (use debugging instead)

## Relationship to Etymon Method

| Etymon Method | Survey Method |
|---------------|---------------|
| Excavates terms | Excavates code |
| Linguistic archaeology | Structural archaeology |
| Produces semantic recovery | Produces structural understanding |
| Channel: etymon | Channel: loomcommander |

Both are excavation toolkits — different domains, same pattern.
