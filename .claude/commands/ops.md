---
description: Ops domain - operational product development across codebases
argument-hint: [action] [target] - e.g., "project minwrite", "brief auth-feature", "survey src/editor"
---

# Ops: $ARGUMENTS

You are operating in the **ops domain** — the CTO/Product Director layer for Claude Code orchestration.

## The Ops Domain

This domain operationalizes context orchestration across codebases. It embodies the insight that **output quality is downstream of context curation**.

### Core Workflow

```
PROJECT → BRIEF → SURVEY → PLAN → TASK → (DECISION) → RETRO → PATTERN
   ◇        ◈        ◧        ▣       □        ⊕         ↺        ⚙
```

### Document Types

| Type | Symbol | Purpose |
|------|--------|---------|
| **project** | ◇ | Tracked codebase with path, CLAUDE.md, health |
| **brief** | ◈ | What to build, why, success criteria (Product Director) |
| **survey** | ◧ | Codebase understanding before changing (read-only) |
| **plan** | ▣ | Implementation approach, requires approval (CTO) |
| **task** | □ | Atomic work unit, single commit scope |
| **decision** | ⊕ | ADR-style, why X over Y, trade-offs |
| **retro** | ↺ | Retrospective after shipping |
| **pattern** | ⚙ | Extracted reusable approach |
| **checkpoint** | ⏸ | Context snapshot for session resume |
| **index** | ☰ | Collection of related documents |

### Status Progression

```
draft → approved → active → completed → archived
```

| Status | Meaning |
|--------|---------|
| **draft** | Under development, not approved |
| **approved** | Ready to execute |
| **active** | Currently being worked on |
| **completed** | Done, shipped |
| **archived** | Superseded or deprecated |

---

## Routing Logic

Parse "$ARGUMENTS" to route to the appropriate command:

**→ ops:project** if:
- "project [path/name]" / "register [codebase]" / "track..."
- Creating or viewing a tracked codebase

**→ ops:brief** if:
- "brief [feature]" / "what to build..." / "requirements for..."
- Writing product requirements before implementation

**→ ops:survey** if:
- "survey [target]" / "understand [code]" / "explore..."
- Read-only codebase exploration before changing

**→ ops:plan** if:
- "plan [brief-id]" / "how to build..." / "implementation for..."
- Creating implementation approach for a brief

**→ ops:task** if:
- "task [description]" / "todo..." / "work item..."
- Creating atomic work unit

**→ ops:decision** if:
- "decision [choice]" / "why we chose..." / "adr..."
- Logging a decision with trade-offs

**→ ops:retro** if:
- "retro [project]" / "lessons from..." / "what we learned..."
- Post-shipping retrospective

**→ ops:checkpoint** if:
- "checkpoint" / "save context" / "pause..."
- Preserving context for later resume

**→ ops:status** if:
- "status" / "dashboard" / "overview"
- Current state across all projects

---

## The 20-Turn Cliff

Agent performance degrades after ~15-20 turns. The ops domain handles this:

1. **Checkpoint** — Externalize state before degradation
2. **Task decomposition** — Break work into atomic units
3. **Plan approval** — Get human checkpoint at plan phase

If you notice repetition, instruction drift, or confusion:
```
→ Create checkpoint document
→ /clear
→ Resume from checkpoint
```

---

## Context Orchestration Principles

From "Claude Code for Maximum Impact":

### 1. Curate What Enters Context
- Be deliberate about which files you reference
- Use surveys to understand before loading code

### 2. Prune What Pollutes Context
- /clear between unrelated tasks
- Don't let debugging contaminate feature work

### 3. Explicit Staging
- Survey before plan
- Plan before implement
- Never code without understanding first

### 4. Test Before Commit
- Always verify changes work
- Never commit failing code

---

## Output Location

All ops documents go to: **`loomlib/docs/ops/{type}/{slug}.md`**

```
loomlib/docs/ops/
├── project/       # ◇ tracked codebases
├── brief/         # ◈ product requirements
├── survey/        # ◧ codebase explorations
├── plan/          # ▣ implementation approaches
├── task/          # □ work items
├── decision/      # ⊕ ADRs
├── retro/         # ↺ retrospectives
├── pattern/       # ⚙ extracted patterns
├── checkpoint/    # ⏸ context snapshots
└── index/         # ☰ collections
```

**Document IDs:**
- Projects: `proj-{slug}`
- Briefs: `brief-{slug}`
- Surveys: `surv-{slug}`
- Plans: `plan-{slug}`
- Tasks: `task-{slug}`
- Decisions: `dec-{slug}`
- Retros: `retro-{slug}`
- Patterns: `pat-{slug}`
- Checkpoints: `chk-{slug}`
- Indexes: `idx-{slug}`

---

## Required Frontmatter

```yaml
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: {prefix}-{slug}
title: "{Title}"
type: project|brief|survey|plan|task|decision|retro|pattern|checkpoint|index
domain: ops
status: draft|approved|active|completed|archived
tags: [relevant, tags]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: define|research|execute|learn|organize
execution_state: pending|in_progress|completed|resolved
upstream:
  - doc: {document-id}
    relation: informs|requires|prior
downstream: []

# ─── PROJECT REFERENCE ──────────────────────────────────────
project_id: proj-{slug}  # Which project this belongs to (if applicable)
```

---

## Discovery

Query the ops domain:

```bash
# All ops documents
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops")]'

# All projects
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops") | select(.type == "project")]'

# Active briefs
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops") | select(.type == "brief") | select(.status == "active")]'

# Tasks for a project
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "ops") | select(.type == "task") | select(.project_id == "proj-minwrite")]'
```

---

Now route "$ARGUMENTS" to the appropriate ops command.
