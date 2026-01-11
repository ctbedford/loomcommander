---
description: Understand a codebase before changing it (read-only exploration)
argument-hint: [target] - e.g., "src/editor", "auth system", "the build process"
---

# Ops: Survey $ARGUMENTS

You are conducting a **survey** — read-only codebase exploration before making changes.

**CRITICAL: Do not write any code during a survey. Read, understand, document.**

---

## What is a Survey?

A survey answers: "What exists and how does it work?" before you change anything.

```
┌─────────────────────────────────────────────────────────────────┐
│                          SURVEY                                  │
│                                                                  │
│   Target: src/editor/                                           │
│                                                                  │
│   Key Files:                                                    │
│   ├── cursor.ts (342 lines) — cursor position, selection        │
│   ├── markdown.ts (567 lines) — parsing, rendering              │
│   ├── keybindings.ts (89 lines) — keyboard shortcuts            │
│   └── index.ts (45 lines) — exports                             │
│                                                                  │
│   Architecture:                                                 │
│   - Cursor manages position via {x, y} coordinates              │
│   - Selection is cursor range, not separate concept             │
│   - Keybindings dispatch to command functions                   │
│                                                                  │
│   Patterns:                                                     │
│   - Commands return new state (immutable)                       │
│   - No external dependencies                                    │
│   - Tests in __tests__/ mirror structure                        │
│                                                                  │
│   Gotchas:                                                      │
│   - Line wrapping handled in render, not model                  │
│   - Selection can be backwards (anchor > focus)                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Protocol

### Phase 1: Scope the Survey

#### 1.1 Parse the Target

"$ARGUMENTS" could be:
- A path (`src/editor`, `lib/auth`)
- A concept (`the auth system`, `how builds work`)
- A brief reference (`for brief-vim-mode`)

#### 1.2 Identify the Project

```bash
# Which project context?
pwd
cat CLAUDE.md 2>/dev/null | head -20
```

#### 1.3 Check for Existing Surveys

```bash
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops") | select(.type == "survey") | select(.title | test("$ARGUMENTS"; "i"))]'
```

### Phase 2: Find Relevant Files

#### 2.1 Glob for Structure

```bash
# Find files in target area
find {target} -type f -name "*.ts" -o -name "*.tsx" | head -20
```

#### 2.2 Grep for Key Patterns

```bash
# Find entry points, exports, main functions
grep -r "export" {target} --include="*.ts" | head -20
```

### Phase 3: Read Key Files

**Read 3-5 central files to understand:**

1. **Entry point** — How is this code accessed?
2. **Core logic** — What does the main work?
3. **Data structures** — What shapes flow through?
4. **Tests** — What behavior is expected?

For each file, note:
- Purpose (one sentence)
- Key exports
- Dependencies (imports from elsewhere)
- Patterns used

### Phase 4: Document Findings

Write to: `loomlib/docs/ops/survey/surv-{slug}.md`

```markdown
---
id: surv-{slug}
title: "Survey: {Target}"
type: survey
domain: ops
status: completed
tags: [survey, {area}]

intent: research
execution_state: completed
upstream:
  - doc: brief-{slug}  # if surveying for a brief
    relation: informs
downstream: []

project_id: proj-{project-slug}
---

# Survey: {Target}

**Project:** {project}
**Target:** `{path or concept}`
**Date:** {date}

---

## Summary

{2-3 sentences: what is this, what does it do, key insight}

---

## File Structure

```
{target}/
├── {file1} ({lines} lines) — {purpose}
├── {file2} ({lines} lines) — {purpose}
└── {file3} ({lines} lines) — {purpose}
```

---

## Architecture

### Data Flow

```
{diagram showing how data moves through the system}
```

### Key Abstractions

| Concept | Location | Purpose |
|---------|----------|---------|
| {Name} | `{file}:{line}` | {what it represents} |

---

## Patterns Found

### {Pattern 1}
{Description and example}

### {Pattern 2}
{Description and example}

---

## Dependencies

### Internal
- `{path}` — {what it provides}

### External
- `{package}` — {what it's used for}

---

## Gotchas

- {Non-obvious thing 1}
- {Non-obvious thing 2}

---

## Implications for Change

If modifying this area:
- {Consideration 1}
- {Consideration 2}

---

## Files Read

| File | Lines | Purpose |
|------|-------|---------|
| `{path}` | {n} | {purpose} |
```

---

## Survey Hygiene

### Do
- Read before writing
- Document what you find
- Note patterns and gotchas
- Reference line numbers

### Don't
- Write any code
- Make changes "while you're here"
- Assume without reading
- Skip the documentation step

---

## Composition

**Upstream:**
- Brief (if surveying for implementation)
- Project (container)

**Downstream:**
- Plan (uses survey findings)
- Decision (if survey reveals trade-offs)

---

## Output

After surveying, report:

```
## Survey Complete: {target}

**Key insight:** {one sentence}

### Files Examined
- {file1}: {purpose}
- {file2}: {purpose}

### Architecture
{brief description}

### Gotchas
- {gotcha 1}
- {gotcha 2}

### Ready for Plan?
{yes/no, and what's needed if no}
```

---

Now survey: $ARGUMENTS
