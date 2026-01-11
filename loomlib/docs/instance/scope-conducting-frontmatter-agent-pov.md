---
id: inst-scope-conducting-frontmatter-agent-pov
title: "Scope: Conducting Frontmatter from Agent POV"
type: instance
framework_kind: null
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [scope, conducting, frontmatter, claude-code, agent, runtime]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: resolved
upstream:
  - doc: fw-scope-method
    relation: method
  - doc: inst-survey-conducting-frontmatter-deps
    relation: informs
downstream:
  - doc: inst-scope-command-discovery-patterns
    relation: informs
---
# Scope: Conducting Frontmatter from Agent POV

**Date:** 2026-01-08
**Subject:** Does conducting frontmatter make sense from Claude Code's runtime perspective?
**Method:** Scope Method (applied to agent execution)
**Precursor:** inst-survey-conducting-frontmatter-deps

---

## The Question

The conducting frontmatter schema adds fields like `actionable`, `execution.state`, `requires`, `completion`. But **who reads these fields and when?**

From my perspective as Claude Code executing a `/loomlib:survey` command:
1. What do I currently do?
2. What would conducting frontmatter change?
3. Does this actually help me work better with you?

---

## Audit: Current Claude Code Behavior

### What Happens Now (Runtime)

```
User: /loomlib:survey editor persistence

┌─────────────────────────────────────────────────────────────┐
│ Claude Code receives:                                        │
│ - Command template (loomlib:survey.md)                       │
│ - $ARGUMENTS = "editor persistence"                          │
│ - Injected context (loomlib state, frameworks, etc.)         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Claude Code executes:                                        │
│ 1. Read command template → understand protocol               │
│ 2. Glob/Grep → find relevant files                          │
│ 3. Read files → understand code                             │
│ 4. Write markdown → produce survey document                 │
│ 5. Done                                                     │
└─────────────────────────────────────────────────────────────┘
```

**Key observation:** I don't read the frontmatter of existing documents to decide what to do. The command template tells me what to do. The frontmatter I *write* is for the loomlib app, not for my future self.

### What I Actually Use

| Input | How I Use It |
|-------|--------------|
| Command template | Protocol to follow (Survey Method steps) |
| $ARGUMENTS | What to investigate |
| Injected context | Current loomlib state (what frameworks exist) |
| Codebase files | Source of truth for investigation |

| Output | Who Uses It |
|--------|-------------|
| Markdown document | Loomlib app (displays in UI) |
| Frontmatter | Loomlib app (indexes, filters, graphs) |

**I don't consume my own output.** Each command invocation is stateless from my perspective. I don't remember previous surveys or check if preconditions are met.

---

## Affordances: What Conducting Frontmatter Promises

The schema promises:

### 1. Precondition Checking
```yaml
requires:
  docs: [inst-survey-editor-persistence]
  files: [loomlib/src/views/editor.ts]
  state: ["Survey completed"]
```

**Promise:** Before running `/loomlib:scope editor-persistence`, I would check that the survey exists.

### 2. State Tracking
```yaml
execution:
  state: pending | in_progress | completed
  started_at: 2026-01-08T14:30:00Z
```

**Promise:** Track where documents are in their lifecycle.

### 3. Chain Orchestration
```yaml
completion:
  next: inst-implement-editor-persistence
downstream:
  - { doc: inst-implement-feature, relation: "enables" }
```

**Promise:** Know what document comes next, trigger it automatically.

---

## Expectations: What Would This Look Like in Practice?

### Scenario: User says "implement conducting frontmatter"

**Without conducting frontmatter (current):**
```
User: implement conducting frontmatter
Claude: *reads CLAUDE.md, sees workflow*
Claude: *searches for relevant context*
Claude: *finds survey document by grepping*
Claude: *reads survey, understands what to do*
Claude: *implements*
```

**With conducting frontmatter (proposed):**
```
User: implement conducting frontmatter
Claude: *reads CLAUDE.md, sees workflow*
Claude: *queries loomlib for docs where downstream contains "conducting frontmatter"*
Claude: *finds survey with execution.state = "ready for implementation"*
Claude: *reads survey, sees requires.docs are met*
Claude: *implements*
```

### The Difference

| Without | With |
|---------|------|
| Grep for related documents | Query by relationship |
| Read prose to understand state | Read structured field |
| Infer what's next | Read `completion.next` |
| Hope preconditions are met | Check `requires` explicitly |

**But here's the catch:** Both paths require me to *do the checking*. The conducting frontmatter doesn't execute itself. It's structured data that I (or you) can query, but someone has to write the code that queries it.

---

## Gaps: Where the Proposal Falls Short

### Gap 1: No Execution Layer (Blocking)

The schema defines `execution.state`, but **nothing updates it automatically.**

Current proposal says: "Claude commands update execution.state on completion."

But this means I need to:
1. Know I just completed a scope document
2. Update that document's frontmatter to set `execution.state: completed`
3. Check if any downstream documents are now unblocked
4. Update their state too

**This is a lot of bookkeeping.** Right now, I just write the document and I'm done. With conducting frontmatter, I'd need to manage state across multiple documents.

### Gap 2: No Query Interface (Blocking)

To use conducting frontmatter, I'd need to:
```
Find all documents where:
  - actionable = true
  - execution.state = pending
  - requires.docs are all completed
```

**Loomlib has no API for this.** I can read individual markdown files, but I can't query the document graph. I'd have to:
1. Glob for all markdown files
2. Parse each one's frontmatter
3. Build the dependency graph in memory
4. Query it

This is expensive and error-prone.

### Gap 3: Commands Don't Know About Each Other (Friction)

When I run `/loomlib:scope`, I don't know:
- What survey preceded this (unless you tell me)
- What documents this scope will enable
- Whether this scope is part of a larger workflow

The command template is self-contained. It doesn't say "first check if inst-survey-X exists."

### Gap 4: State Mutation Is Manual (Friction)

If I complete a survey and write:
```yaml
execution:
  state: completed
  completed_at: 2026-01-08T15:00:00Z
```

Then you run `/loomlib:scope` in a new conversation. That new Claude instance:
- Doesn't know the survey is completed
- Doesn't automatically check `requires.docs`
- Has to be told "the survey is at inst-survey-X"

**The state is there, but it's passive.** Nobody reads it unless explicitly told to.

---

## Requirements: What Would Actually Help

### Must Have (for conducting frontmatter to be useful)

**1. Query Tool for Document Graph**

I need a way to ask loomlib:
```
GET /api/docs?actionable=true&execution.state=pending
GET /api/docs?downstream.doc=inst-scope-X
```

Without this, conducting frontmatter is just documentation that humans read.

*Implementation:* Extend `vite-plugin-docs-api.ts` with query parameters.

**2. Command-Level Precondition Checking**

Commands should declare their preconditions:
```yaml
# In loomlib:scope.md
preconditions:
  - "Survey exists for this topic"
  - "Survey has findings documented"
```

And I should check these before producing output.

*Implementation:* Add precondition block to command templates, Claude checks before executing.

**3. Automatic State Updates**

When I complete a document, the frontmatter should update automatically. This could be:
- Part of the Write tool (loomlib-aware)
- A post-write hook
- An explicit "finalize document" step

*Implementation:* Command templates include "update execution.state" as final step.

### Should Have

**4. Workflow Awareness**

Commands could accept workflow context:
```
/loomlib:scope editor-persistence --after inst-survey-editor-persistence
```

This tells me explicitly what preceded, so I can check its state.

**5. Document Chain Visualization**

Show me (and you) the workflow state:
```
inst-survey-X (completed) → inst-scope-X (in_progress) → inst-implement-X (pending)
```

This already exists in constellation view conceptually.

### Out of Scope (for v1)

- **Automatic triggering:** Running next document when current completes
- **Parallel orchestration:** Running independent documents concurrently
- **Error recovery:** Retrying failed documents

These require an execution engine that doesn't exist yet.

---

## The Honest Assessment

### What Conducting Frontmatter Actually Does (v1)

1. **Documents intent** — `actionable: true` says "this is meant to be executed"
2. **Records state** — `execution.state` tracks progress (if manually updated)
3. **Declares relationships** — `upstream`/`downstream` name the workflow
4. **Defines completion** — `completion.criteria` says what "done" means

### What It Doesn't Do (v1)

1. **Execute anything** — No automation, just data
2. **Enforce preconditions** — I have to check manually
3. **Update state** — I have to write it manually
4. **Query efficiently** — No index, just grep

### Is It Worth Implementing?

**Yes, but with realistic expectations.**

Conducting frontmatter in v1 is **structured documentation for workflows**. It makes implicit state explicit. Even without automation:

- You can see what state a document is in
- You can see what it depends on
- You can see what it enables
- I can be told to check these fields

This is better than prose like "This survey is ready for implementation. Next step: scope document."

The value is **queryability** even if the queries are manual:
- "Show me all pending actionable documents"
- "What does this scope enable?"
- "Is the survey for this feature done?"

### What Would Make It Actually Useful

The minimum viable automation:

1. **Command templates check preconditions** — Survey command doesn't exist for scope? Say so.
2. **Commands update their own state** — When I finish writing, set `execution.state: completed`.
3. **Query API exists** — I can ask "what documents have execution.state = pending".

This turns conducting frontmatter from documentation into **lightweight orchestration**.

---

## Proposed Changes to Commands

### Before (current survey command)

```markdown
## Output
Write the survey instance to: `loomlib/docs/instance/survey-{slug}.md`
```

### After (with conducting frontmatter)

```markdown
## Preconditions
Before executing, verify:
- [ ] Topic is specific enough to investigate
- [ ] No existing survey for this topic (check `loomlib/docs/instance/survey-*`)

## Output
Write the survey instance to: `loomlib/docs/instance/survey-{slug}.md`

Include conducting frontmatter:
```yaml
actionable: true
intent: research
execution:
  state: completed  # Survey is done when written
  completed_at: {timestamp}
completion:
  criteria:
    - "All sections complete"
    - "Key files identified"
    - "Open questions documented"
  next: null  # Filled in if scope follows
```

## Post-Completion
After writing:
1. If this survey enables a scope, update `completion.next`
2. Tell user: "Survey complete. Next: `/loomlib:scope {topic}` if implementation needed."
```

### What This Changes for Me

| Before | After |
|--------|-------|
| Just write the document | Check preconditions first |
| Frontmatter is metadata | Frontmatter includes state |
| Done when written | Update state, suggest next step |
| Stateless | State-aware (within single conversation) |

---

## Summary

| Question | Answer |
|----------|--------|
| Does conducting frontmatter help Claude Code? | **Partially** — provides structure, but needs query API and command updates to be useful |
| What actions will Claude Code make? | Check preconditions, write document with state, update state on completion, suggest next step |
| Is the schema well-designed? | **Yes** — comprehensive, backward compatible, extensible |
| Is it implementable as proposed? | **Yes for schema** — but execution layer is missing |
| What's the minimum viable version? | Schema + parsing + commands that write state + basic query API |

### The Real Value

Conducting frontmatter turns implicit workflow knowledge into explicit, queryable data. Even without full automation, this helps because:

1. **You** can see document state in loomlib UI
2. **I** can be told to check state before acting
3. **Future Claude** can query for next actions
4. **The system** has a foundation for automation

The v1 implementation (Phases 1-4 from the survey) is worth doing. The execution engine (Phase 5+) is where the real orchestration happens, but it needs this foundation.

---

## Recommendations

1. **Implement Phases 1-4** as specified in the survey (schema, parsing, storage, commands)

2. **Add query API** to vite-plugin-docs-api.ts:
   ```
   GET /api/docs?actionable=true
   GET /api/docs?execution.state=pending
   ```

3. **Update command templates** to:
   - Check preconditions (grep for related docs)
   - Write conducting frontmatter
   - Update state on completion
   - Suggest next action

4. **Defer execution engine** until the manual workflow is proven useful

---

## Scope Status

**Status:** verified → resolved

**Resolution criteria met:**
- [x] Decision: proceeded with v1 (schema + commands)
- [x] Query API: uses existing /api/docs with jq filtering
- [x] Command template changes: all 8 commands updated

---

## Resolution

**Date:** 2026-01-08
**Status:** resolved

### What Was Done

This scope validated the agent-centric approach to conducting frontmatter. The implementation followed Recommendations 1 and 3:
- Phases 1-4 implemented (schema, parsing, commands)
- Command templates updated with Discovery sections
- API queries use jq filtering (simpler than dedicated endpoints)

### Outcome

The "What Would Help Claude Code" analysis from this scope shaped the Discovery pattern. Commands now query for related documents before producing, exactly as this scope recommended.

### Remaining Items

None — scope questions answered, recommendations implemented.
