---
description: Resolve a loomlib document - record what was done and close it out
argument-hint: <doc path or slug> [resolution summary]
---

# Resolve: $ARGUMENTS

You are **resolving** a loomlib document — recording the outcome and closing it out.

## When to Use

After completing work described in a document:
- **Scope** → requirements implemented
- **Survey** → findings acted upon or acknowledged
- **Note** → processed into other documents
- **Instance** → captured to output channel

Resolution updates the conducting frontmatter:
- Sets `execution_state: resolved`
- Optionally updates `status` (draft → verified, etc.)
- Records what was done in a Resolution section

## Protocol

### 1. Identify the Document

Parse "$ARGUMENTS" to find the document:
- If path provided: read directly
- If slug provided: search `loomlib/docs/**/{slug}.md`
- If ambiguous: list matches and ask

### 2. Review Current State

Read the document and summarize:
- What was the original intent?
- What gaps/requirements/findings were identified?
- What is the current status?

### 3. Gather Resolution

Ask or infer:
- What was done to address this?
- What files were changed?
- What remains unaddressed (if any)?
- Should status be promoted?

### 4. Write Resolution Section

Append a `## Resolution` section to the document:

```markdown
---

## Resolution

**Date:** {date}
**Status:** {resolved | partial | deferred}

### What Was Done
{Brief summary of actions taken}

### Changes Made
- `path/to/file.ts` — {what changed}
- `path/to/other.ts` — {what changed}

### Outcome
{Result of the work}

### Remaining Items
{If partial: what's left. If resolved: "None - all requirements addressed."}
```

### 5. Update Frontmatter

**Always update conducting fields:**
```yaml
execution_state: resolved  # Was: completed
```

**If fully resolved, also update status:**
```yaml
status: verified  # Was: draft (if criteria met)
```

**If partially resolved:**
- Keep `execution_state: completed` (not resolved)
- Keep current status
- Document what remains in Resolution section

### 6. Save

The document will auto-save to markdown via the API. The API will preserve the conducting frontmatter.

## Resolution Statuses

| Status | Meaning |
|--------|---------|
| **resolved** | All items addressed, work complete |
| **partial** | Some items done, others remain |
| **deferred** | Acknowledged but intentionally not addressed now |
| **superseded** | Replaced by another document/approach |

## Examples

### Resolving a Scope
```
/loomlib:resolve scope-document-persistence

## Resolution

**Date:** 2026-01-08
**Status:** resolved

### What Was Done
Implemented Option C (two-way sync) from the scope analysis.

### Changes Made
- `vite-plugin-docs-api.ts` — new Vite plugin for /api/docs/:id endpoint
- `src/data/documents.ts` — added saveToMarkdown(), updated saveDocument()
- `src/data/seed.ts` — changed syncSeedData() to not overwrite existing docs
- `vite.config.ts` — added docsApiPlugin

### Outcome
Browser edits now persist to markdown files and survive refresh.

### Remaining Items
None - all requirements addressed.
```

### Resolving a Survey
```
/loomlib:resolve survey-editor-persistence

## Resolution

**Date:** 2026-01-08
**Status:** resolved

### What Was Done
Survey findings led to scope-document-persistence, which was then implemented.

### Changes Made
See inst-scope-document-persistence resolution.

### Outcome
Root cause (syncSeedData overwrite) identified and fixed.

### Remaining Items
None.
```

## Output

Updates the document in place at its current location.
Changes persist automatically via the Vite API — no manual sync needed.

Key changes to make:
1. **Frontmatter:** Set `execution_state: resolved`
2. **Frontmatter:** Optionally promote `status`
3. **Content:** Append `## Resolution` section

## Post-Completion

After resolving, report:

1. **What was resolved:** The document and its original intent
2. **What was done:** Summary of actions taken
3. **Execution state:** Now `resolved`
4. **Status:** Whether it was promoted (draft → verified, etc.)

Now resolve: $ARGUMENTS
