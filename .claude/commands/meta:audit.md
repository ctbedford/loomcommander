---
description: Audit system health - command coverage, domain completeness, pattern consistency
argument-hint: [audit-type] - e.g., "commands", "domains", "patterns", "coverage"
allowed-tools: Read, Grep, Glob, Bash
---

# Meta: Audit $ARGUMENTS

You are running a **system audit** — analyzing the Claude Code setup for completeness, consistency, and health.

---

## Audit Types

### 1. `commands` — Command Coverage

Analyze slash commands for:
- **Coverage:** Are all intent categories covered?
- **Consistency:** Do commands follow the same structure?
- **Documentation:** Are commands documented in meta domain?
- **Discovery:** Do commands query the API before producing?

### 2. `domains` — Domain Completeness

Analyze domain configurations for:
- **Types defined:** Does each domain have types for all intents?
- **Status progression:** Is the progression logical?
- **Commands mapped:** Does each domain have its commands?
- **Config consistency:** Do configs follow the same structure?

### 3. `patterns` — CLAUDE.md Patterns

Analyze CLAUDE.md and settings for:
- **Brevity:** Is CLAUDE.md under 50 lines?
- **Relevance:** Are all instructions actually used?
- **Permissions:** Are common operations allowed?
- **MCP coverage:** Are useful MCPs configured?

### 4. `coverage` — Full System Audit

Run all audits and produce a summary report.

---

## Protocol

### 1. Identify Audit Scope

Parse "$ARGUMENTS" to determine what to audit:

| Input | Audit Type |
|-------|------------|
| `commands` | Slash command analysis |
| `domains` | Domain configuration analysis |
| `patterns` | CLAUDE.md/settings analysis |
| `coverage` | Full system audit |
| `{specific}` | Targeted audit |

### 2. Gather Data

#### For Commands Audit:

```bash
# List all commands
ls -la .claude/commands/*.md

# Count by domain
ls .claude/commands/*.md | grep -c "loomlib:"
ls .claude/commands/*.md | grep -c "studio:"
ls .claude/commands/*.md | grep -c "meta:"

# Check for discovery patterns
grep -l "curl.*api/docs" .claude/commands/*.md | wc -l

# Check for conducting frontmatter
grep -l "execution_state" .claude/commands/*.md | wc -l
```

#### For Domains Audit:

```bash
# List domain configs
ls loomlib/src/config/domains/*.ts

# Check type counts
grep "id:" loomlib/src/config/domains/etymon.ts | wc -l
grep "id:" loomlib/src/config/domains/studio.ts | wc -l
grep "id:" loomlib/src/config/domains/meta.ts | wc -l
```

#### For Patterns Audit:

```bash
# Check CLAUDE.md size
wc -l CLAUDE.md

# Check for common patterns
grep -c "npm run" CLAUDE.md
grep -c "git" CLAUDE.md

# Check settings.json
cat .claude/settings.json 2>/dev/null || echo "No settings.json"
```

### 3. Analyze Findings

#### Command Coverage Matrix

| Intent | capture | research | build | organize | produce |
|--------|---------|----------|-------|----------|---------|
| Etymon | source, note | survey, excavate, scope, recon | framework | index | instance, synthesize |
| Studio | idea, source | research | template | series | script |
| Meta | ? | ? | ? | ? | ? |

Mark gaps with ❌.

#### Domain Consistency Check

| Check | etymon | studio | meta |
|-------|--------|--------|------|
| Has types | ✓/❌ | ✓/❌ | ✓/❌ |
| Has statuses | ✓/❌ | ✓/❌ | ✓/❌ |
| Has helpers | ✓/❌ | ✓/❌ | ✓/❌ |
| Commands exist | ✓/❌ | ✓/❌ | ✓/❌ |

#### Pattern Quality Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| CLAUDE.md lines | X | <50 | ✓/❌ |
| Build commands defined | ✓/❌ | ✓ | ✓/❌ |
| Key paths documented | ✓/❌ | ✓ | ✓/❌ |
| Generic advice absent | ✓/❌ | ✓ | ✓/❌ |

### 4. Generate Report

---

## Output

Write to: `loomlib/docs/meta/audit/aud-{type}-{date}.md`

```markdown
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: aud-{type}-{date}
title: "Audit: {Type} ({date})"
type: audit
domain: meta
status: draft
tags: [audit, {type}, {date}]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream: []
downstream: []

# ─── AUDIT-SPECIFIC ─────────────────────────────────────────
audit_type: {type}
audit_date: {date}
files_analyzed: {count}
issues_found: {count}
---

# Audit: {Type}

**Date:** {date}
**Scope:** {what was audited}
**Files Analyzed:** {count}

---

## Summary

{One-paragraph summary of findings}

**Health Score:** {X}/10

---

## Findings

### {Category 1}

| Check | Status | Notes |
|-------|--------|-------|
| {item} | ✓/❌ | {notes} |

### {Category 2}

...

---

## Issues Found

### Issue 1: {Title}

**Severity:** {high/medium/low}
**Location:** {where}
**Problem:** {description}
**Recommended Fix:** {action}

### Issue 2: {Title}

...

---

## Gaps Identified

| Gap | Impact | Priority |
|-----|--------|----------|
| {gap} | {impact} | {priority} |

---

## Recommendations

1. **{Action}** — {why}
2. **{Action}** — {why}

---

## Next Steps

- [ ] {Follow-up task 1}
- [ ] {Follow-up task 2}

---

## Composition

**Upstream:**
- Files analyzed: {list}

**Downstream:**
- Informs: operations to address issues
```

---

## Specific Audits

### Commands: Intent Coverage

For each intent, check that at least one command exists:

```
capture    → note, source (etymon), idea (studio), ??? (meta)
research   → survey, excavate, scope, recon
build      → framework (manual), ??? (meta needs workflow, pattern)
organize   → index
produce    → instance, synthesize, operation (meta)
```

### Commands: Structure Consistency

Check that all commands have:
- [ ] YAML frontmatter with description
- [ ] Discovery section with API queries
- [ ] Protocol section with steps
- [ ] Output section with location
- [ ] Constraints section
- [ ] Composition section

### Domains: Type-Intent Mapping

Verify each domain maps types to intents:

```yaml
# Expected pattern
intentMapping:
  note: capture
  source: capture
  framework: build
  instance: produce
  index: organize
```

### Patterns: CLAUDE.md Health

Check for anti-patterns:
- [ ] No style guides (use linter)
- [ ] No obvious folder descriptions
- [ ] No generic advice ("write clean code")
- [ ] Build commands present
- [ ] Key paths documented

---

Now audit: $ARGUMENTS
