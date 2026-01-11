---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: idx-meta-domain
title: "Meta Domain: Claude Code Orchestration"
type: index
domain: meta
status: draft
tags: [meta, claude-code, orchestration, commands, workflows]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: organize
execution_state: in_progress
upstream:
  - doc: fw-loomlib-domains
    relation: informs
downstream: []
---

# Meta Domain: Claude Code Orchestration

This is the **meta domain** — a knowledge graph for managing Claude Code itself.

---

## Purpose

The meta domain documents, tests, and evolves:

1. **Slash Commands** — The `.claude/commands/*.md` files that orchestrate Claude Code
2. **Workflows** — Multi-step patterns (explore→plan→code→commit, TDD loops)
3. **Patterns** — CLAUDE.md snippets, settings.json templates, configurations
4. **Failure Modes** — Problems and fixes (context contamination, iteration cliff)
5. **Audits** — System health checks and coverage reports
6. **Operations** — One-off autonomous tasks with test/commit cycles

---

## Document Types

| Type | Symbol | Intent | Purpose |
|------|--------|--------|---------|
| **command** | / | build | Slash command documentation |
| **workflow** | ↻ | build | Multi-step orchestration patterns |
| **pattern** | ⎔ | build | Reusable configurations |
| **failure-mode** | ⚠ | research | Problems and their fixes |
| **audit** | ◉ | research | System health reports |
| **operation** | ⚡ | produce | One-off autonomous tasks |
| **index** | ☰ | organize | Collections and catalogs |

---

## Status Progression

```
draft → testing → stable → archived
```

| Status | Meaning |
|--------|---------|
| **draft** | Under development, not validated |
| **testing** | Being validated (run, tried, verified) |
| **stable** | Validated and in use |
| **archived** | Superseded or deprecated |

---

## Commands

| Command | Purpose |
|---------|---------|
| `/meta` | Route to meta domain commands |
| `/meta:command` | Document a slash command |
| `/meta:workflow` | Document a workflow pattern |
| `/meta:pattern` | Document a CLAUDE.md pattern |
| `/meta:failure` | Document a failure mode |
| `/meta:audit` | Run system health check |
| `/meta:operation` | Execute autonomous task |

---

## The Autonomous Cycle

The meta domain's key innovation is the **operation cycle** — full survey→plan→implement→test→commit automation:

```
┌──────────────────────────────────────────────────────────────────────┐
│                        AUTONOMOUS OPERATION                           │
│                                                                       │
│   SURVEY → PLAN → [User Approval] → IMPLEMENT → TEST → COMMIT        │
│                                                                       │
│   Key principles:                                                     │
│   • Never skip survey phase                                           │
│   • Always get plan approval                                          │
│   • Test before commit                                                │
│   • Document after commit                                             │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Core Principles

From "Claude Code for Maximum Impact":

### 1. Context Orchestration

> "Claude Code is context orchestration. The quality of your outputs is downstream of how well you curate the information space Claude operates in."

**Meta application:** Documents are curated context. Commands orchestrate discovery.

### 2. The 20-Iteration Cliff

> "Agent performance craters after ~20 turns."

**Meta application:** Operations include checkpoints. Reset after 15 turns.

### 3. Explicit Staging

> "Read the relevant files and understand the current implementation—don't write code yet."

**Meta application:** Survey before plan, plan before implement.

### 4. CLAUDE.md Lean

> "Keep it under 50 lines. No style guides."

**Meta application:** Pattern documents extract one concern each.

---

## Discovery

```bash
# All meta documents
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "meta")]'

# All stable commands
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "meta") | select(.type == "command") | select(.status == "stable")]'

# All workflows
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "meta") | select(.type == "workflow")]'
```

---

## Running in Meta Domain

```bash
# Switch to meta domain
VITE_LOOMLIB_DOMAIN=meta npm run dev

# Or set in .env
echo "VITE_LOOMLIB_DOMAIN=meta" >> .env
```

---

## What This Enables

1. **Command Discovery** — Find commands by what they produce
2. **Workflow Reuse** — Apply proven patterns to new tasks
3. **Pattern Composition** — Build CLAUDE.md from tested snippets
4. **Failure Prevention** — Know the anti-patterns before hitting them
5. **System Health** — Audit coverage and consistency
6. **Autonomous Ops** — Full test→commit cycles on operational tasks

---

## Composition

**Upstream:**
- [Loomlib Domains Framework](fw-loomlib-domains) — the domain system
- Claude Code best practices article

**Downstream:**
- All meta domain documents
- Command catalogs
- Workflow libraries
- Pattern collections
