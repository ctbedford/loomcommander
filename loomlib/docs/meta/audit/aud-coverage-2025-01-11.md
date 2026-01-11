---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: aud-coverage-2025-01-11
title: "Audit: Full System Coverage (2025-01-11)"
type: audit
domain: meta
status: draft
tags: [audit, coverage, commands, domains, patterns, loomlib, meta]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: idx-meta-domain
    relation: informs
downstream: []

# ─── AUDIT-SPECIFIC ─────────────────────────────────────────
audit_type: coverage
audit_date: 2025-01-11
files_analyzed: 188
issues_found: 8
---

# Audit: Full System Coverage

**Date:** 2025-01-11
**Scope:** Commands, domains, patterns, loomlib document corpus
**Files Analyzed:** 38 commands, 4 domain configs, 150 loomlib documents

---

## Summary

This codebase has a sophisticated **context orchestration system** built around:

1. **Loomlib** — A knowledge graph with 150 documents across 3 domains (etymon, studio, meta)
2. **Slash Commands** — 38 commands that orchestrate document production with discovery-before-production patterns
3. **Conducting Frontmatter** — A system for tracking document workflow state (intent, execution_state, upstream/downstream)
4. **Multi-Domain Architecture** — Etymon (philological research), Studio (content production), Meta (Claude Code orchestration)

The system is **healthy but incomplete** in the meta domain.

**Health Score:** 7/10

---

## Findings

### 1. Commands Coverage

| Metric | Value | Assessment |
|--------|-------|------------|
| Total commands | 38 | Good |
| Loomlib commands | 22 | Comprehensive |
| Studio commands | 7 | Adequate |
| Meta commands | 6 | Foundational |
| Router commands | 3 | Present |
| Commands with Discovery section | 31/38 (82%) | Good |
| Commands querying API | 32/38 (84%) | Good |

#### Command Coverage by Intent

| Intent | Etymon/Loomlib | Studio | Meta |
|--------|----------------|--------|------|
| **capture** | note, source | idea, source | - |
| **research** | survey, excavate, scope, recon, apologetic, compare, contradict, similar, cluster, orphans, lineage, status | research | audit |
| **build** | framework | template | command, workflow, pattern, failure |
| **organize** | index, synthesize, triage, promote, review, resolve | series | - |
| **produce** | instance | script | operation |

**Gaps identified:**
- Meta domain missing capture commands (no `meta:note`)
- Meta domain missing organize commands (no `meta:index` distinct from router)

### 2. Domain Configuration

| Domain | Types | Statuses | Helper Functions | Commands |
|--------|-------|----------|------------------|----------|
| Etymon | 5 | 4 | 4 | 22 |
| Studio | 7 | 3 | 4 | 7 |
| Meta | 7 | 4 | 4 | 6 |

**Assessment:** All domains follow consistent structure with types, statuses, and helper functions.

### 3. CLAUDE.md Patterns

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| CLAUDE.md lines | 81 | <50 | Over |
| Build commands defined | Yes | Yes | Pass |
| Key paths documented | Yes | Yes | Pass |
| Generic advice absent | Yes | Yes | Pass |
| Jira context tools documented | Yes | Yes | Pass |

**Issue:** CLAUDE.md exceeds 50 lines (81 lines). However, content is substantive (minwrite workflow + Jira context tools).

### 4. Loomlib Document Corpus

| Metric | Count |
|--------|-------|
| Total documents | 150 |
| Instance documents | 93 |
| Source documents | 23 |
| Framework documents | 20 |
| Index documents | 11 |
| Note documents | 2 |
| Meta domain docs | 1 |

#### Status Distribution

| Status | Count | Percentage |
|--------|-------|------------|
| Incubating | 73 | 49% |
| Draft | 41 | 27% |
| Verified | 40 | 27% |

**Assessment:** Nearly half the corpus is in incubating status — this is appropriate for a knowledge graph with active research.

#### Execution State Distribution

| State | Count |
|-------|-------|
| completed | 110 |
| in_progress | 33 |
| resolved | 11 |
| pending | 2 |
| (malformed) | ~8 |

**Issue:** 8 documents have malformed execution_state values (e.g., "resolved`" with backtick, template text).

#### Intent Distribution

| Intent | Count |
|--------|-------|
| research | 70 |
| produce | 32 |
| capture | 25 |
| build | 20 |
| organize | 10 |
| (malformed) | ~6 |

**Assessment:** Healthy distribution weighted toward research (surveys, scopes, recons).

#### Conducting Frontmatter Adoption

| Field | Documents with Field | Percentage |
|-------|----------------------|------------|
| intent | 148/150 | 99% |
| execution_state | 148/150 | 99% |
| upstream | 148/150 | 99% |

**Assessment:** Excellent adoption of conducting frontmatter system.

### 5. Codebase Structure

| Component | Location | Purpose |
|-----------|----------|---------|
| Loomlib | `/loomlib/` | Knowledge graph UI |
| Minwrite | `/minwrite/` | Markdown writing app |
| Jira Tools | `/scripts/jira/` | Board context for tickets |
| Config Editor | `/config-editor/` | Configuration UI |

**Assessment:** Multi-project monorepo with clear separation.

---

## Issues Found

### Issue 1: Malformed Execution States

**Severity:** Low
**Location:** 8 documents in loomlib/docs/
**Problem:** execution_state values contain template text or backticks (e.g., "resolved`")
**Recommended Fix:** Run cleanup script to normalize values

### Issue 2: Meta Domain Underpopulated

**Severity:** Medium
**Location:** loomlib/docs/meta/
**Problem:** Only 1 document (idx-meta-domain) exists in meta domain despite 7 types defined and 6 commands available
**Recommended Fix:** Use meta commands to populate:
- `/meta:command` for each slash command
- `/meta:workflow` for key patterns (explore-plan-code, TDD)
- `/meta:pattern` for CLAUDE.md snippets
- `/meta:failure` for known anti-patterns

### Issue 3: CLAUDE.md Over Length Target

**Severity:** Low
**Location:** CLAUDE.md (81 lines)
**Problem:** Exceeds 50-line target from best practices
**Recommended Fix:** Consider extracting Jira section to JIRA_CONTEXT.md and referencing via `# Instructions: See JIRA_CONTEXT.md`

### Issue 4: Missing Meta Capture Commands

**Severity:** Low
**Location:** .claude/commands/
**Problem:** No `meta:note` command for capturing raw observations about Claude Code
**Recommended Fix:** Create meta:note.md for quick capture without full document structure

### Issue 5: Studio Domain Output Location

**Severity:** Low
**Location:** .claude/commands/studio:script.md
**Problem:** Output location `loomlib/docs/script/{slug}.md` doesn't match folder structure (no `/script/` folder exists)
**Recommended Fix:** Either create script folder or use `/research/` for research type scripts

### Issue 6: No Meta Index Command

**Severity:** Low
**Location:** .claude/commands/
**Problem:** Meta domain has no dedicated index command (router exists but not specialized index creator)
**Recommended Fix:** Consider if `meta:index` distinct from router is needed

### Issue 7: Unpopulated Meta Subfolders

**Severity:** Low
**Location:** loomlib/docs/meta/
**Problem:** Subdirectories exist (audit/, command/, workflow/, etc.) but are empty except index/
**Recommended Fix:** Populate through normal command usage or dedicated operation

### Issue 8: Some Commands Missing allowed-tools

**Severity:** Low
**Location:** .claude/commands/
**Problem:** Not all commands specify allowed-tools in frontmatter
**Recommended Fix:** Add allowed-tools to standardize command capabilities

---

## Gaps Identified

| Gap | Impact | Priority |
|-----|--------|----------|
| Meta domain has only 1 document | Commands exist but aren't documented as loomlib docs | Medium |
| No meta:note command | Can't quickly capture Claude Code observations | Low |
| 8 malformed execution_states | Minor data quality issue | Low |
| CLAUDE.md over 50 lines | Exceeds best practice target | Low |
| Studio script folder missing | Output location doesn't exist | Low |

---

## Recommendations

1. **Populate Meta Domain** — Run `/meta:command` for key commands (survey, instance, excavate) to create documentation. This is the most impactful improvement.

2. **Clean Malformed Frontmatter** — Create operation to fix 8 documents with backtick in execution_state.

3. **Create meta:note Command** — Simple capture command for Claude Code observations.

4. **Fix Studio Script Path** — Either create `/loomlib/docs/script/` folder or update command to use existing folder.

5. **Consider CLAUDE.md Split** — If more sections added, extract project-specific sections to separate files.

---

## Audit Strategy for Full Codebase Understanding

To fully understand this codebase, use these commands in sequence:

### Phase 1: Orientation (5 min)
```bash
# Get current state
/loomlib:status

# List all commands
ls .claude/commands/*.md | xargs -I{} head -5 {}
```

### Phase 2: Domain Deep Dive (15 min each)
```bash
# Etymon domain
/loomlib:survey etymon domain and types

# Studio domain
/loomlib:survey studio domain and types

# Meta domain
/loomlib:survey meta domain and types
```

### Phase 3: Codebase Survey (20 min)
```bash
# Loomlib UI
/loomlib:survey loomlib views and components

# Minwrite (if relevant)
/loomlib:survey minwrite editor
```

### Phase 4: Command Understanding (10 min)
```bash
# Understand command patterns
/meta:workflow explore-plan-code-commit

# Document key commands
/meta:command survey
/meta:command instance
```

### Phase 5: Gap Analysis (ongoing)
```bash
# Find orphaned documents
/loomlib:orphans

# Find similar documents that should be linked
/loomlib:cluster

# Audit specific areas
/meta:audit domains
```

---

## Next Steps

- [ ] Run `/meta:command survey` to document survey command in meta domain
- [ ] Run `/meta:command instance` to document instance command
- [ ] Run `/meta:workflow explore-plan-code` to document the core workflow
- [ ] Fix 8 malformed execution_state values
- [ ] Create `loomlib/docs/script/` folder for studio scripts

---

## Composition

**Upstream:**
- Files analyzed: 38 commands, 4 domain configs, 150 loomlib documents, CLAUDE.md
- [Meta Domain Index](idx-meta-domain) — domain structure reference

**Downstream:**
- Informs: operations to address issues
- Enables: prioritized improvement work
