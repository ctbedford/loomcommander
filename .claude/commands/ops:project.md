---
description: Register or view a tracked codebase in the ops domain
argument-hint: [path-or-name] - e.g., "minwrite", "../other-repo", "."
---

# Ops: Project $ARGUMENTS

You are registering or viewing a **project** — a tracked codebase in the ops domain.

---

## What is a Project?

A project is the container for all ops work within a codebase. It tracks:

- **Path** — Where the codebase lives
- **CLAUDE.md** — The context configuration
- **Health** — Build status, test status, debt indicators
- **Active work** — Briefs, tasks, plans in progress

```
┌─────────────────────────────────────────────────────────────────┐
│                         PROJECT                                  │
│                                                                  │
│   Path: /workspaces/loomcommander/minwrite                      │
│   CLAUDE.md: ✓ exists (42 lines)                                │
│   Build: npm run build (passing)                                │
│   Tests: npm test (12 passing)                                  │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  ACTIVE WORK                                            │   │
│   │  ○ brief-vim-mode (approved)                            │   │
│   │  ○ task-cursor-selection (in_progress)                  │   │
│   │  ○ surv-editor-architecture (completed)                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Protocol

### 1. Parse the Argument

"$ARGUMENTS" could be:
- A path (`minwrite`, `../other-repo`, `/absolute/path`)
- A project name to look up (`minwrite`)
- Empty (list all projects)

### 2. If Registering New Project

#### 2.1 Verify the Path Exists

```bash
ls -la $ARGUMENTS
```

#### 2.2 Check for CLAUDE.md

```bash
cat $ARGUMENTS/CLAUDE.md 2>/dev/null || echo "No CLAUDE.md found"
```

#### 2.3 Check for package.json or similar

```bash
cat $ARGUMENTS/package.json 2>/dev/null | jq '{name, scripts}'
```

#### 2.4 Create Project Document

Write to: `loomlib/docs/ops/project/proj-{slug}.md`

```markdown
---
id: proj-{slug}
title: "{Project Name}"
type: project
domain: ops
status: active
tags: [project, {tech-stack}]

intent: define
execution_state: in_progress
upstream: []
downstream: []

# ─── PROJECT-SPECIFIC ───────────────────────────────────────
path: "{absolute-path}"
claude_md: "{path-to-claude-md}"
build_command: "{build command}"
test_command: "{test command}"
---

# Project: {Name}

**Path:** `{path}`
**Status:** Active
**Stack:** {detected stack}

---

## CLAUDE.md Summary

{Summary of what's in CLAUDE.md, or note that it's missing}

---

## Build & Test

| Command | Status |
|---------|--------|
| Build | `{command}` |
| Test | `{command}` |

---

## Active Work

{Will be populated as briefs/tasks are created}

---

## Health Indicators

- [ ] CLAUDE.md exists and is lean (<50 lines)
- [ ] Build passes
- [ ] Tests pass
- [ ] No stale branches

---

## Notes

{Any initial observations about the codebase}
```

### 3. If Viewing Existing Project

#### 3.1 Find the Project

```bash
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops") | select(.type == "project") | select(.id | contains("$ARGUMENTS") or .title | test("$ARGUMENTS"; "i"))]'
```

#### 3.2 Find Related Documents

```bash
# Find all docs for this project
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops") | select(.project_id == "proj-{slug}")]'
```

#### 3.3 Report Status

Show:
- Project metadata
- Active briefs/tasks/plans
- Recent decisions
- Health indicators

### 4. If Listing All Projects

```bash
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops") | select(.type == "project")] | sort_by(.title)'
```

---

## Output

After creating/viewing, report:

```
## Project: {name}

**ID:** proj-{slug}
**Path:** {path}
**Status:** {status}

### Active Work
- {list of active briefs/tasks}

### Health
- CLAUDE.md: {exists/missing/bloated}
- Build: {passing/failing/unknown}
- Tests: {passing/failing/unknown}

### Next Steps
- {suggested actions}
```

---

## Composition

**Upstream:** None (projects are top-level containers)

**Downstream:**
- Briefs are created within projects
- Surveys explore project codebases
- Tasks execute within projects

---

Now execute: $ARGUMENTS
