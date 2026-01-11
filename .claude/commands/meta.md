---
description: Meta domain - Claude Code orchestration, commands, workflows, and system documentation
argument-hint: [action] [target] - e.g., "command fix-issue", "workflow tdd", "audit commands"
---

# Meta: $ARGUMENTS

You are operating in the **meta domain** — a knowledge graph for managing Claude Code itself.

## The Meta Domain

This domain documents and manages:

- **Commands** — Slash commands (`.claude/commands/*.md`) with their protocols and outputs
- **Workflows** — Multi-step patterns (explore→plan→code→commit, TDD loops, parallel instances)
- **Patterns** — CLAUDE.md snippets, settings.json templates, operational configurations
- **Failure Modes** — Documented problems and their fixes (context contamination, iteration cliff)
- **Audits** — System health checks and coverage reports
- **Operations** — One-off orchestration tasks

## Document Types

| Type | Symbol | Purpose |
|------|--------|---------|
| **command** | / | A slash command with protocol, discovery, output |
| **workflow** | ↻ | Multi-step orchestration pattern |
| **pattern** | ⎔ | CLAUDE.md snippet or config template |
| **failure-mode** | ⚠ | Problem + fix documentation |
| **audit** | ◉ | System health or coverage check |
| **operation** | ⚡ | One-off task with test/commit |
| **index** | ☰ | Collection of related documents |

## Status Progression

```
draft → testing → stable → archived
```

| Status | Meaning |
|--------|---------|
| **draft** | Under development, not validated |
| **testing** | Being validated (command run, workflow tried) |
| **stable** | Validated and in use |
| **archived** | Superseded or deprecated |

---

## Routing Logic

Parse "$ARGUMENTS" to route to the appropriate command:

**→ meta:command** if:
- "command [name]" / "document command..." / "create command..."
- Creating or documenting a slash command
- Syncing a `.claude/commands/*.md` file to loomlib

**→ meta:workflow** if:
- "workflow [name]" / "document workflow..." / "pattern for..."
- Creating reusable multi-step patterns
- TDD loop, explore→plan→code→commit, writer-reviewer split

**→ meta:pattern** if:
- "pattern [name]" / "claude.md snippet..." / "config for..."
- Creating CLAUDE.md templates or settings.json patterns

**→ meta:failure** if:
- "failure [name]" / "problem with..." / "anti-pattern..."
- Documenting failure modes and their fixes

**→ meta:audit** if:
- "audit [domain]" / "check coverage..." / "system health..."
- Running system analysis or coverage checks

**→ meta:operation** if:
- "run [task]" / "execute..." / "migrate..."
- One-off orchestration with test/commit cycle

**→ meta:status** if:
- "status" / "dashboard" / "overview"
- Getting current state of the meta domain

---

## The Autonomous Cycle

The meta domain supports a full autonomous workflow for operational tasks:

```
┌──────────────────────────────────────────────────────────────────────┐
│                      META OPERATION CYCLE                             │
│                                                                       │
│   1. SURVEY    — Read existing files, understand current state        │
│   2. PLAN      — Write plan, get approval before coding              │
│   3. IMPLEMENT — Execute the plan (write/edit code)                   │
│   4. TEST      — Run build/test, verify changes work                 │
│   5. COMMIT    — Create descriptive commit if tests pass             │
│   6. DOCUMENT  — Update meta documents with what changed             │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Key principle:** Test before commit, document after commit.

---

## Output Location

All meta documents go to: **`loomlib/docs/meta/{type}/{slug}.md`**

```
loomlib/docs/meta/
├── command/       # / command documentation
├── workflow/      # ↻ multi-step patterns
├── pattern/       # ⎔ CLAUDE.md templates
├── failure-mode/  # ⚠ anti-patterns
├── audit/         # ◉ system reports
├── operation/     # ⚡ one-off tasks
└── index/         # ☰ collections
```

**Document IDs:**
- Commands: `cmd-{slug}`
- Workflows: `wf-{slug}`
- Patterns: `pat-{slug}`
- Failure Modes: `fail-{slug}`
- Audits: `aud-{slug}`
- Operations: `op-{slug}`
- Indexes: `idx-{slug}`

---

## Required Frontmatter

```yaml
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: {prefix}-{slug}
title: "{Title}"
type: command|workflow|pattern|failure-mode|audit|operation|index
domain: meta
status: draft|testing|stable|archived
tags: [relevant, tags]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: build|research|produce|organize
execution_state: pending|in_progress|completed|resolved
upstream:
  - doc: {document-id}
    relation: informs|method|prior
downstream: []

# ─── META-SPECIFIC ──────────────────────────────────────────
# (varies by type)
produces: {document-type}           # for commands
tools_used: [Read, Grep, Bash]      # for commands
test_command: "npm run build"       # for operations
commit_scope: {files or patterns}   # for operations
```

---

## Discovery

Query the loomlib API scoped to meta domain:

```bash
# All meta documents
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "meta")]'

# All commands
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "meta") | select(.type == "command")]'

# Stable workflows
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "meta") | select(.type == "workflow") | select(.status == "stable")]'
```

---

## Context from Claude Code Best Practices

This domain embodies the principles from "Claude Code for Maximum Impact":

### Core Thesis: Context Orchestration
> "Claude Code is context orchestration. The quality of your outputs is downstream of how well you curate the information space Claude operates in."

**Meta domain application:** Documents are the curated context. Commands orchestrate how documents are discovered and used.

### The 20-Iteration Cliff
> "Agent performance craters after ~20 turns."

**Meta domain application:** Operations include checkpoints. After 15 turns, externalize state to a checkpoint document and reset.

### Explicit Staging
> "Read the relevant files and understand the current implementation—don't write code yet."

**Meta domain application:** Every operation starts with survey, then plan, then execute.

### CLAUDE.md Best Practices
> "Keep it lean. Under 50 lines."

**Meta domain application:** Pattern documents extract reusable CLAUDE.md snippets. One pattern per concern.

---

Now route "$ARGUMENTS" to the appropriate meta command.
