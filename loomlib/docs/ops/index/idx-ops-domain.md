---
id: idx-ops-domain
title: "Ops Domain Index"
type: index
domain: ops
status: active
tags: [ops, domain, index]

intent: organize
execution_state: in_progress
upstream: []
downstream: []
---

# Ops Domain Index

The ops domain is the CTO/Product Director layer for Claude Code orchestration.

---

## Core Workflow

```
PROJECT → BRIEF → SURVEY → PLAN → TASK → RETRO → PATTERN
   ◇        ◈        ◧        ▣       □       ↺        ⚙
```

---

## Document Types

| Type | Symbol | Purpose |
|------|--------|---------|
| **project** | ◇ | Tracked codebase |
| **brief** | ◈ | What to build (Product Director) |
| **survey** | ◧ | Understand before changing |
| **plan** | ▣ | How to build (requires approval) |
| **task** | □ | Atomic work unit |
| **decision** | ⊕ | ADR-style trade-off record |
| **retro** | ↺ | Post-shipping retrospective |
| **pattern** | ⚙ | Extracted reusable approach |
| **checkpoint** | ⏸ | Context snapshot for resume |
| **index** | ☰ | Document collection |

---

## Commands

| Command | Purpose |
|---------|---------|
| `/ops` | Router |
| `/ops:project` | Register a codebase |
| `/ops:brief` | Write product requirements |
| `/ops:survey` | Explore before changing |
| `/ops:plan` | Create implementation plan |
| `/ops:task` | Create work unit |
| `/ops:decision` | Log a decision |
| `/ops:retro` | Write retrospective |
| `/ops:checkpoint` | Preserve context |
| `/ops:status` | View dashboard |

---

## Status Progression

```
draft → approved → active → completed → archived
```

---

## Key Principles

### Context Orchestration
Output quality is downstream of context curation. The ops domain helps you curate context deliberately.

### Survey Before Plan
Never plan without understanding. Surveys prevent wrong approaches.

### Plan Before Code
Never code without approval. Plans prevent wasted effort.

### 20-Turn Cliff Management
Checkpoint early, checkpoint often. Reset before degradation.

### Atomic Tasks
One task, one commit, one concern. Small is better.

---

## Getting Started

1. `/ops:project {path}` — Register your codebase
2. `/ops:brief {feature}` — Define what to build
3. `/ops:survey {target}` — Understand the code
4. `/ops:plan {brief}` — Design the approach
5. Execute tasks, ship, retro, extract patterns

---

## Source

This domain embodies the principles from "Claude Code for Maximum Impact" — context orchestration, the 20-turn cliff, explicit staging, and test-before-commit.
