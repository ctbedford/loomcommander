---
description: Document a Claude Code slash command with protocol, discovery, and output
argument-hint: [command-name] - e.g., "excavate", "survey", "fix-issue"
allowed-tools: Read, Grep, Glob, Bash(cat:*)
---

# Meta: Document Command $ARGUMENTS

**CRITICAL: Do not modify command files. Only document existing commands.**

You are documenting a slash command as a **meta domain command document**.

## Purpose

This command:
1. Reads an existing `.claude/commands/*.md` file
2. Extracts its structure, protocol, and output format
3. Creates a queryable meta document that describes the command
4. Links the command to the frameworks and document types it uses

This makes commands **discoverable** within the knowledge graph.

---

## Discovery

### 1. Find the Command File

```bash
# Find the command file
ls .claude/commands/ | grep -i "$ARGUMENTS"
```

### 2. Check for Existing Documentation

```bash
# Check if already documented
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "meta") | select(.type == "command") | select(.id | contains("$ARGUMENTS"))]'
```

### 3. Find Related Frameworks

```bash
# What framework does this command use?
grep -l "framework_ids" loomlib/docs/framework/*.md | xargs grep -l "$ARGUMENTS" 2>/dev/null
```

---

## Protocol

### 1. Read the Command

Read the full command file:

```bash
cat ".claude/commands/loomlib:$ARGUMENTS.md" 2>/dev/null || \
cat ".claude/commands/studio:$ARGUMENTS.md" 2>/dev/null || \
cat ".claude/commands/meta:$ARGUMENTS.md" 2>/dev/null || \
cat ".claude/commands/$ARGUMENTS.md" 2>/dev/null
```

### 2. Extract Structure

From the command file, identify:

| Field | Source |
|-------|--------|
| **Description** | YAML frontmatter `description:` |
| **Allowed Tools** | YAML frontmatter `allowed-tools:` |
| **Produces** | Output section → document type |
| **Framework** | References to `fw-*` documents |
| **Discovery Pattern** | API queries in discovery section |
| **Protocol Steps** | Numbered sections in protocol |
| **Output Location** | Path pattern in output section |
| **Constraints** | Explicit constraints section |

### 3. Analyze Patterns

Look for:
- **Discovery-before-protocol** — Does it query the API first?
- **No-write-until-plan** — Does it stage before executing?
- **Composition reporting** — Does it report upstream/downstream?
- **Status criteria** — What makes the output verified?

---

## Output

Write to: `loomlib/docs/meta/command/cmd-{slug}.md`

```markdown
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: cmd-{slug}
title: "Command: {name}"
type: command
domain: meta
status: draft
tags: [command, {domain}, {produces}]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: build
execution_state: completed
upstream:
  - doc: fw-{method}
    relation: method
downstream: []

# ─── COMMAND-SPECIFIC ───────────────────────────────────────
command_path: .claude/commands/{domain}:{slug}.md
produces: {document-type}
tools_used: [{tool1}, {tool2}]
discovery_pattern: {brief description}
---

# Command: {Name}

**Domain:** {domain}
**Path:** `.claude/commands/{domain}:{slug}.md`
**Produces:** {type} documents

---

## Description

{From YAML frontmatter}

---

## Tools Used

| Tool | Purpose |
|------|---------|
| {Tool} | {What it's used for} |

---

## Framework Reference

This command applies: **[{Framework Name}](fw-{method})**

{Brief description of the method}

---

## Discovery Pattern

Before execution, this command:

1. {What it queries}
2. {What it looks for}
3. {How it decides what to reference}

---

## Protocol Summary

| Step | Action |
|------|--------|
| 1. {Step} | {Brief description} |
| 2. {Step} | {Brief description} |
| ... | ... |

---

## Output Structure

**Location:** `{output path pattern}`

**Key sections:**
- {section 1}
- {section 2}
- ...

---

## Constraints

- {constraint 1}
- {constraint 2}
- ...

---

## Promotion Criteria

To reach **stable** status:
- [ ] Command documented accurately
- [ ] Produces expected output
- [ ] Discovery pattern works
- [ ] Framework reference verified
- [ ] Example output exists

---

## Composition

**Upstream:**
- [{Method name}](fw-{method}) — method applied

**Downstream:**
- Enables command discovery in meta domain
- Informs command catalog
```

---

## After Documenting

Report:
1. **Command analyzed:** What command was documented
2. **Method identified:** What framework it uses
3. **Output type:** What it produces
4. **Status:** Draft (needs verification by running the command)

---

## When to Use

- Onboarding a new command to the meta domain
- Auditing command coverage
- Building a command catalog
- Understanding what commands exist and what they do

---

Now document command: $ARGUMENTS
