---
description: Document a CLAUDE.md pattern, settings.json template, or configuration snippet
argument-hint: [pattern-name] - e.g., "build-commands", "permission-allowlist", "mcp-github"
allowed-tools: Read, Grep, Glob
---

# Meta: Pattern $ARGUMENTS

You are documenting a **pattern** — a reusable CLAUDE.md snippet, settings.json template, or operational configuration.

---

## What is a Pattern?

Patterns are **extracted configurations** that can be copied or adapted:

| Pattern Type | Example |
|--------------|---------|
| **CLAUDE.md snippet** | Build commands section, key paths section |
| **settings.json template** | Permission allowlist for web development |
| **MCP configuration** | GitHub MCP server setup |
| **hooks configuration** | Pre-commit hook integration |
| **Environment pattern** | Docker sandbox setup |

---

## Protocol

### 1. Identify the Pattern

Parse "$ARGUMENTS" to identify what to document:

| Input | Pattern Type |
|-------|--------------|
| `build-commands` | CLAUDE.md: build/test commands |
| `key-paths` | CLAUDE.md: important file locations |
| `permission-*` | settings.json: permission allowlist |
| `mcp-*` | .mcp.json: MCP server config |
| `hook-*` | Hooks configuration |
| `sandbox-*` | Docker/isolation setup |

### 2. Find Examples

Look for existing patterns in:

```bash
# CLAUDE.md patterns
cat CLAUDE.md

# Settings patterns
cat .claude/settings.json 2>/dev/null

# MCP patterns
cat .mcp.json 2>/dev/null

# Project-specific patterns
find . -name "*.claude*" -o -name ".mcp*" | head -20
```

### 3. Extract the Pattern

Isolate the specific configuration:
- Remove project-specific details
- Keep structural elements
- Add placeholders for customization
- Document what each part does

### 4. Document Best Practices

Based on Claude Code guidance:
- **CLAUDE.md:** Keep under 50 lines, no style guides, no obvious descriptions
- **Permissions:** Start restrictive, expand as needed
- **MCP:** Only enable servers you use
- **Hooks:** Don't block on non-critical issues

---

## Output

Write to: `loomlib/docs/meta/pattern/pat-{slug}.md`

```markdown
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: pat-{slug}
title: "Pattern: {Name}"
type: pattern
domain: meta
status: draft
tags: [pattern, {category}]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: build
execution_state: completed
upstream: []
downstream: []

# ─── PATTERN-SPECIFIC ────────────────────────────────────────
pattern_type: claude-md|settings|mcp|hooks|environment
applies_to: [{project-types}]
---

# Pattern: {Name}

**Type:** {CLAUDE.md snippet / settings.json / MCP config / etc.}
**Applies to:** {What kinds of projects}

---

## Overview

{What this pattern configures and why}

---

## The Pattern

### {Component Name}

```{language}
{The actual pattern with placeholders}
```

#### Placeholders

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{placeholder}` | {what to replace with} | {example value} |

---

## Usage

### Installation

{How to add this pattern to a project}

### Customization

{What should be customized}

### Integration

{How this works with other patterns}

---

## Rationale

### Why This Approach

{Explanation of design choices}

### Anti-Patterns Avoided

| Anti-Pattern | Why Avoided |
|--------------|-------------|
| {thing not done} | {reason} |

---

## Variants

### Minimal Version

```{language}
{Stripped down version}
```

### Extended Version

```{language}
{Full-featured version}
```

---

## Related Patterns

- [pat-{related}](pat-{related}) — {relationship}

---

## Promotion Criteria

To reach **stable** status:
- [ ] Pattern tested in real project
- [ ] Placeholders documented
- [ ] Rationale clear
- [ ] Anti-patterns noted

---

## Composition

**Upstream:**
- Claude Code best practices
- {source documentation}

**Downstream:**
- Can be composed with other patterns
- Informs project setup
```

---

## Common Patterns to Document

### CLAUDE.md Patterns

1. **Build Commands** — npm/python/rust/go build/test commands
2. **Key Paths** — Important directories and files
3. **Project Gotchas** — Non-obvious project-specific constraints
4. **Branch Conventions** — Git workflow preferences

### Settings Patterns

1. **Web Dev Allowlist** — Permissions for React/Vue/etc. projects
2. **API Development** — Permissions for backend work
3. **Infrastructure** — Terraform/Docker permissions
4. **Minimal Safety** — Most restrictive starting point

### MCP Patterns

1. **GitHub Integration** — For issue/PR workflows
2. **Database Access** — PostgreSQL/MySQL query access
3. **Monitoring** — Sentry error monitoring
4. **Browser Automation** — Puppeteer for screenshots

### Environment Patterns

1. **Docker Sandbox** — Isolated execution environment
2. **Git Worktrees** — Parallel development setup
3. **CI Integration** — Headless mode in pipelines

---

Now document pattern: $ARGUMENTS
