---
id: inst-scope-resolve-command
title: "Scope: Resolve Command UX"
type: instance
status: draft
framework_kind: null
perspective: null
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
tags: [scope, ux, resolve, workflow, commands]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-scope-method
    relation: method
downstream: []
---

# Scope: Resolve Command UX

**Date:** 2026-01-08
**Subject:** Whether `/loomlib:resolve` works ideally
**Method:** Scope Method (UX analysis)

---

## Audit

### Current Command Protocol

The resolve command at `.claude/commands/loomlib:resolve.md` defines:

1. **Parse arguments** to find document (path or slug)
2. **Review current state** — summarize intent, gaps, current status
3. **Gather resolution** — what was done, what changed, what remains
4. **Append resolution section** to document
5. **Update status** — promote if fully resolved
6. **Note: "will auto-save via API"**

### Current UX Flow

**Flow A: User invokes `/loomlib:resolve scope-document-persistence`**
1. Claude parses slug, searches `loomlib/docs/**/{slug}.md`
2. Claude reads document, summarizes current state
3. Claude asks what was done (or infers from context)
4. Claude appends `## Resolution` section with template
5. Claude updates frontmatter status if appropriate
6. Claude writes changes to markdown file
7. ✅ Changes persist (API writes to filesystem)

**Flow B: User invokes `/loomlib:resolve` without arguments**
1. Claude must ask which document to resolve
2. No listing of "open" documents shown
3. User must remember slug or path

**Flow C: User invokes from router `/loomlib resolve survey-loomlib`**
1. Router matches "resolve..." pattern
2. Routes to `/loomlib:resolve`
3. Resolve command executes

### Key Interactions

| Action | Feedback | Reality |
|--------|----------|---------|
| `/loomlib:resolve {slug}` | Claude reads doc, asks questions | Works as expected |
| `/loomlib:resolve` (no args) | Claude asks for document | No discovery flow |
| View resolved docs | Must check manually | No "resolved" lens in app |

---

## Affordances

### What the Command Promises

The resolve command protocol promises:
- Record completion of work on any actionable document
- Structured resolution section (date, status, changes, outcome)
- Status promotion through workflow (draft → verified)
- Persistence via API ("will auto-save")

The routing in `loomlib.md` promises:
- "resolve..." / "close out..." / "done with..." triggers resolve
- Works with scopes, surveys, and other actionable documents

### Mental Model Invoked

**Expected:** Task management close-out — mark done, record what happened
**Actual:** Document annotation — add a section, update frontmatter

### Conventions Followed

- Explicit resolution statuses (resolved, partial, deferred, superseded)
- Structured template for consistent recording
- Cross-reference to changes made
- Status workflow promotion

---

## Expectations

### Natural User Flows

1. **Close out flow**: Finish work → run resolve → document updated → move on
2. **Partial resolution**: Some work done → resolve as partial → track remaining
3. **Discovery flow**: "What's open?" → see list → pick one to resolve
4. **Batch review**: "What did I resolve today?" → see history

### What Users Would Expect

- Easy way to see unresolved documents
- Status update reflected in app immediately (it is — API sync works)
- Ability to resolve from within the app (not just CLI)
- Resolution history visible somewhere

### Information Needed During Resolve

- What was the original scope/survey about?
- What files were touched?
- What's the outcome for the user?

---

## Gaps

| Gap | Type | Description |
|-----|------|-------------|
| **No discovery** | Friction | Can't list unresolved documents easily |
| **No in-app resolve** | Friction | Must use CLI, not browser editor |
| **No resolution lens** | Polish | App doesn't surface resolved vs open |
| **Ambiguous slug parsing** | Friction | Multiple documents could match partial slug |
| **No changes tracking** | Friction | Must manually list "what files changed" |

### Gap Analysis

**No blocking gaps** — the command works correctly for its core purpose:
- ✅ Finds documents by slug
- ✅ Appends structured resolution section
- ✅ Promotes status appropriately
- ✅ Persists via API

**Friction gaps** reduce workflow efficiency but don't block completion.

---

## Requirements

### Must Have (Blocking)

None — command works for its core purpose.

### Should Have (Friction)

- [ ] Add `/loomlib:open` or similar to list unresolved documents — *Acceptance: Shows documents without Resolution section*
- [ ] Improve slug parsing to handle ambiguity — *Acceptance: Lists matches if multiple found*
- [ ] Auto-detect git changes for "Changes Made" section — *Acceptance: If git shows changed files since document created, suggest them*

### Could Have (Polish)

- [ ] Add "Open Items" lens in app showing unresolved actionable docs
- [ ] Add "resolve" button in browser editor for scope/survey documents
- [ ] Track resolution history (when was this resolved, by whom)

### Out of Scope

- Multi-user resolution tracking
- Automated resolution (detecting completion)
- Integration with external task systems

---

## Analysis

### Does the Resolve Command "Work Ideally"?

**Yes, for its core function.** The command:
- Correctly parses slug/path arguments
- Reads and summarizes documents well
- Produces well-structured resolution sections
- Updates status appropriately
- Persists changes (API sync works)

**Areas for improvement:**
1. **Discovery** — no way to see what's unresolved
2. **Context** — doesn't auto-gather git changes
3. **Access** — CLI-only, not in browser

### Priority

Low priority for changes — the command is functional. The friction is in the surrounding workflow, not the command itself.

---

## Notes

**Evidence that resolve works:**
- `scope-document-persistence.md` has a well-formed Resolution section
- Status correctly promoted to `verified`
- Changes recorded clearly

**The sync workflow evolved:**
- Original: `/loomlib:sync` regenerated seed-data.ts
- Current: Two-way API sync, no manual regeneration needed
- Resolve command references "npm run generate:seed" which is outdated
- Should update to note that save happens automatically via API

**The "auto-save via API" claim is accurate:**
- When Claude writes to markdown file, it saves immediately
- Vite dev server API handles the write
- No refresh needed to see changes in app
