---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: cmd-survey
title: "Command: survey"
type: command
domain: meta
status: draft
tags: [command, loomlib, research, codebase, investigation]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: build
execution_state: completed
upstream:
  - doc: fw-survey-method
    relation: method
downstream: []

# ─── COMMAND-SPECIFIC ───────────────────────────────────────
command_path: .claude/commands/loomlib:survey.md
produces: instance
tools_used: [Read, Grep, Glob, Bash]
discovery_pattern: queries API for prior surveys, related frameworks, and any matching docs
---

# Command: survey

**Domain:** loomlib
**Path:** `.claude/commands/loomlib:survey.md`
**Produces:** instance documents (survey-{slug}.md)

---

## Description

Deep codebase investigation — understand before changing. This is the primary research command for understanding code before modifying it.

**Argument hint:** `[topic or subsystem to investigate]`

---

## Tools Used

| Tool | Purpose |
|------|---------|
| Glob | Map terrain — find relevant files by pattern |
| Grep | Locate specific code patterns and references |
| Read | Core sample — read central files deeply |
| Bash (find) | Supplementary file discovery |
| Bash (git log) | History — when was code changed |
| Bash (git blame) | Stratigraphy — who changed what and when |

---

## Framework Reference

This command applies: **[Survey Method](fw-survey-method)**

Survey Method is a **toolkit framework** for structural archaeology of code. It produces understanding of how code is organized, what calls what, and where state lives — without modifying anything.

The method draws a parallel to Etymon Method:
- Etymon excavates **terms** (linguistic archaeology)
- Survey excavates **code** (structural archaeology)

---

## Discovery Pattern

Before execution, this command:

1. **Checks for prior surveys** — Queries API for existing surveys on same/related topics
2. **Finds applicable frameworks** — Looks for domain frameworks that might provide context
3. **Broader search** — Searches all docs for any related content
4. **Reports & decides** — Documents what was found and how it affects the new survey

```bash
# Example discovery queries
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.id | contains("survey")) | select(.title | test("TOPIC"; "i"))]'
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "framework") | select(.title | test("TOPIC"; "i"))]'
```

**Fallback** (if dev server not running):
```bash
ls loomlib/docs/instance/survey-* | grep -i "{slug}"
```

---

## Protocol Summary

| Step | Action |
|------|--------|
| 1. Survey | Map terrain with grep/glob — list relevant files without deep reading |
| 2. Core Sample | Read 2-3 central files — identify entry points, data flow, abstractions |
| 3. Stratigraphy | Trace layers — call hierarchy, state location, boundary conditions |
| 4. Findings | Synthesize understanding — one-paragraph summary + key files |
| 5. Open Questions | Identify gaps — what remains unclear |
| 6. Decisions | (Optional) Resolve open questions if implementation follows |

**Critical constraint:** This is a **read-only** command. No code modifications, no proposals — only investigation and reporting.

---

## Output Structure

**Location:** `loomlib/docs/instance/survey-{slug}.md`

**Frontmatter fields:**
- `id`: inst-survey-{slug}
- `type`: instance
- `framework_ids`: [fw-survey-method]
- `intent`: research
- `execution_state`: completed

**Key sections:**
- Survey — List of relevant files with roles
- Core Sample — Entry points, data flow, key abstractions
- Stratigraphy — Call hierarchy, state location, boundaries
- Findings — Synthesis paragraph, key files table, dependencies, complexity hotspots
- Open Questions — Honest gaps in understanding
- Decisions — (Optional) Resolved questions if implementation follows
- Composition — Upstream/downstream references

---

## Constraints

- **Read-only:** Do not modify any files
- **No proposals:** Do not suggest changes (that comes after understanding)
- **Report first:** Write findings before any other action
- **Discovery required:** Query API for related docs before producing

---

## When to Use

| Scenario | Use Survey? |
|----------|-------------|
| Before refactoring unfamiliar code | Yes |
| Onboarding to a new codebase | Yes |
| Before estimating work on a feature | Yes |
| Debugging requires understanding context | Yes |
| You already understand the code | No |
| The task is trivial | No |
| You need runtime behavior | No (use debugging) |

---

## Promotion Criteria

Survey instances start as `draft`. Promote to `verified` after:

- [ ] Discovery completed (API queried, related docs checked)
- [ ] All sections complete
- [ ] Key files accurately identified
- [ ] Dependencies mapped
- [ ] Open questions are genuine gaps, not laziness
- [ ] Upstream references accurate (from discovery)
- [ ] If implementation follows: Decisions section resolves blocking questions

---

## Example Output

A well-formed survey instance:

```
Survey: Editor Implementation
Date: 2025-01-10
Subject: How the editor view handles document editing
Method: Survey Method (static analysis)

## Survey
- src/views/editor.ts — Main editor view
- src/components/markdown.ts — Markdown rendering
- src/types.ts — Document type definitions

## Core Sample
### Entry Points
EditorView.render() is called by Shell when route matches...

## Findings
The editor is a stateless view that renders markdown content...

## Open Questions
- How is document persistence triggered?
- What happens on conflict?
```

---

## Composition

**Upstream:**
- [Survey Method](fw-survey-method) — toolkit applied by this command

**Downstream:**
- Enables command discovery in meta domain
- Informs command catalog
- Referenced by scope and implementation workflows
