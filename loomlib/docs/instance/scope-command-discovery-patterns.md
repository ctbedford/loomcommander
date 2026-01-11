---
id: inst-scope-command-discovery-patterns
title: "Scope: Command Discovery Patterns for Conducting Frontmatter"
type: instance
framework_kind: null
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [scope, commands, discovery, conducting, frontmatter, composition]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: resolved
upstream:
  - doc: fw-scope-method
    relation: method
  - doc: inst-scope-conducting-frontmatter-agent-pov
    relation: informs
downstream:
  - doc: inst-scope-conducting-frontmatter-implementation
    relation: informs
---
# Scope: Command Discovery Patterns for Conducting Frontmatter

**Date:** 2026-01-08
**Subject:** How loomlib commands discover related documents and write appropriate frontmatter
**Method:** Scope Method
**Precursor:** inst-scope-conducting-frontmatter-agent-pov

---

## The Real Problem

The commands in `.claude/commands/loomlib*.md` are **isolated**. Each command:
- Receives `$ARGUMENTS`
- Follows its protocol
- Writes a document
- Doesn't know what else exists

With conducting frontmatter, commands should:
- **Discover** related documents before producing
- **Read** their state (completed? blocked?)
- **Compose** by referencing upstream work
- **Write** frontmatter that enables downstream discovery

This isn't infrastructure — it's **command behavior**.

---

## Audit: Current Command Structure

### The Router (`loomlib.md`)

```markdown
## Current Loomlib State (from seed-data.ts)
**Managed Frameworks (10):** ...
**Instances:** 16 (9 verified, 7 incubating)
```

The router injects **static state** — framework names, counts. It doesn't show:
- Which documents are actionable
- What's pending vs completed
- What relates to the current `$ARGUMENTS`

### Individual Commands (`loomlib:scope.md`, etc.)

```markdown
## Protocol
1. Audit the current UX
2. Identify affordances
3. Derive expectations
...

## Output
Write to: `loomlib/docs/instance/scope-{slug}.md`
```

Commands have **no discovery step**. They go straight to production.

### What's Missing

| Current | Needed |
|---------|--------|
| Static state injection | Dynamic discovery of related docs |
| Isolated production | Composition with upstream docs |
| Descriptive frontmatter only | Conducting frontmatter in output |
| No precondition awareness | Check if upstream work exists |

---

## Affordances: What Discovery Enables

### Scenario: `/loomlib:scope editor-persistence`

**Without discovery:**
```
Claude: *receives command*
Claude: *follows Scope Method protocol*
Claude: *produces scope document*
```

**With discovery:**
```
Claude: *receives command*
Claude: *globs for related docs*
        → Found: survey-editor-persistence.md
Claude: *reads survey frontmatter*
        → status: draft, execution.state: completed
Claude: *reads survey content*
        → Key files: editor.ts, documents.ts
        → Findings: persistence uses IndexedDB + markdown sync
Claude: *follows Scope Method, informed by survey*
Claude: *produces scope with upstream reference*
```

### What Discovery Provides

1. **Context** — what's already known about this topic
2. **Preconditions** — is there a survey? Is it complete?
3. **Content** — findings to build on, not rediscover
4. **Relationships** — explicit upstream linkage

---

## Expectations: Command Behavior Patterns

### Pattern 1: Discovery Phase (via API)

Every actionable command should start with discovery using the loomlib API:

```markdown
## Discovery

Before producing, query the loomlib API for related documents:

1. **Call the API:**
   ```bash
   # Get all documents (requires dev server running on port 5173)
   curl -s http://localhost:5173/api/docs
   ```

2. **Filter for related docs:**
   ```bash
   # Find surveys related to topic
   curl -s http://localhost:5173/api/docs | jq '[.[] | select(.id | contains("survey")) | select(.title | test("{topic}"; "i"))]'

   # Find any docs mentioning topic
   curl -s http://localhost:5173/api/docs | jq '[.[] | select(.title | test("{topic}"; "i"))]'
   ```

3. **Check state of matches:**
   - `status` — incubating, draft, verified
   - `execution_state` — pending, completed, blocked (if conducting fields present)
   - `framework_ids` — what method produced it

4. **Report findings:**
   - "Found completed survey: inst-survey-X"
   - "Found related scope (draft): inst-scope-Y"
   - "No prior work found for this topic"

5. **Decide:**
   - If precursor exists and is complete → proceed, reference as upstream
   - If precursor exists but incomplete → suggest completing it first
   - If no precursor needed → proceed fresh

**Note:** If dev server is not running, fall back to glob/read on `loomlib/docs/`.
```

### Pattern 2: Conducting Frontmatter Output

Commands should write conducting fields appropriate to their type:

**Survey (actionable, research):**
```yaml
# ─── CONDUCTING ─────────────────────────────────────────────
actionable: true
intent: research
execution:
  state: completed  # Survey is done when written
upstream: []  # Surveys typically start fresh
downstream: []  # Populated when scope references this
```

**Scope (actionable, research → enables build):**
```yaml
# ─── CONDUCTING ─────────────────────────────────────────────
actionable: true
intent: research
execution:
  state: completed
upstream:
  - doc: inst-survey-{topic}
    relation: informs
downstream: []  # Populated when implementation references this
```

**Excavation (sometimes actionable):**
```yaml
# ─── CONDUCTING ─────────────────────────────────────────────
actionable: true
intent: research
execution:
  state: completed
upstream:
  - doc: fw-etymon-method
    relation: method
```

**Framework, Source, Index (not actionable):**
```yaml
# ─── CONDUCTING ─────────────────────────────────────────────
actionable: false
# No execution tracking needed
```

### Pattern 3: Composition Suggestion

After discovery, suggest how documents compose:

```markdown
## Composition

Based on discovery:

**This scope builds on:**
- `inst-survey-editor-persistence` — provides file mapping and findings

**This scope enables:**
- Implementation work (code changes to editor.ts, documents.ts)
- Ticket drafting (Jira P2-XXXX)

**Related but not upstream:**
- `inst-scope-list-view-aesthetic` — different feature, same subsystem
```

---

## Gaps: What Commands Can't Currently Do

### Gap 1: No Discovery Step in Templates (Blocking)

Current templates go straight to protocol. Need to add discovery as Step 0.

**Fix:** Add `## Discovery` section to actionable commands (survey, scope, excavate).

### Gap 2: Router Doesn't Use the API (Friction)

`loomlib.md` shows static framework counts, but **the API already exists**:

```bash
# Returns ALL documents with frontmatter (when dev server running)
curl -s http://localhost:5173/api/docs
```

**Fix:** Commands should call the API for discovery:
```bash
# Find related surveys
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "instance") | select(.id | contains("survey")) | select(.title | test("editor"; "i"))]'

# Find pending actionable docs (once conducting fields exist)
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.actionable == true) | select(.execution_state == "pending")]'
```

This is simpler than glob/read — the API aggregates everything and returns JSON.

### Gap 3: No Standard for Grep-Friendly Frontmatter (Friction)

Nested YAML is hard to grep:
```yaml
execution:
  state: pending  # grep "state: pending" won't find this reliably
```

**Fix:** Design frontmatter to be grep-friendly where possible:
```yaml
execution_state: pending  # Flat field, easy to grep
```

Or accept that reading files is needed (not just grep).

### Gap 4: Conducting Fields Don't Exist Yet (Blocking)

Can't discover or write conducting frontmatter until schema is implemented.

**Fix:** This scope depends on schema implementation (Phases 1-2 of survey).

---

## Requirements: Command Template Updates

### Must Have

#### 1. Discovery Section for Actionable Commands

Add to `loomlib:scope.md`, `loomlib:survey.md`, `loomlib:excavate.md`:

```markdown
## Discovery (before Protocol)

Query loomlib API for related documents:

1. **Call API** (if dev server running):
   ```bash
   curl -s http://localhost:5173/api/docs | jq '[.[] | select(.title | test("{topic}"; "i"))]'
   ```

   **Fallback** (if no dev server):
   ```bash
   ls loomlib/docs/instance/*{slug}*
   ```

2. For matches, note:
   - Document ID and title
   - `status` and `execution_state`
   - Key findings (read content if relevant)

3. Report to user:
   - What related documents exist
   - Their state (complete? draft?)
   - Whether they should be used as upstream

4. Proceed based on findings:
   - Reference completed upstream work
   - Suggest completing incomplete precursors
   - Note if starting fresh
```

*Acceptance criteria:*
- [ ] Scope command queries API for related surveys before producing
- [ ] Survey command checks for existing surveys on same topic
- [ ] Excavate command checks for prior excavations of same term
- [ ] Commands gracefully handle dev server not running (fallback to glob)

#### 2. Conducting Frontmatter in Output Templates

Update output templates in each command:

**Survey output:**
```yaml
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-survey-{slug}
title: "Survey: {Topic}"
type: instance
status: draft
framework_ids: [fw-survey-method]
# ...existing fields...

# ─── CONDUCTING ─────────────────────────────────────────────
actionable: true
intent: research
execution_state: completed
upstream: []
downstream: []
---
```

**Scope output:**
```yaml
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-scope-{slug}
title: "Scope: {Topic}"
type: instance
status: draft
framework_ids: [fw-scope-method]
# ...existing fields...

# ─── CONDUCTING ─────────────────────────────────────────────
actionable: true
intent: research
execution_state: completed
upstream:
  - doc: {discovered-survey-id}
    relation: informs
downstream: []
---
```

*Acceptance criteria:*
- [ ] Survey, scope, excavate commands write conducting frontmatter
- [ ] Upstream references populated from discovery
- [ ] Non-actionable commands (source, index, framework) omit conducting fields or set `actionable: false`

#### 3. Flat Conducting Fields (Grep-Friendly)

Design conducting frontmatter with flat fields where possible:

```yaml
# Instead of nested:
execution:
  state: completed
  started_at: ...

# Use flat:
execution_state: completed
execution_started_at: 2026-01-08T14:00:00Z
```

This makes grep work:
```bash
grep -l "execution_state: pending" loomlib/docs/instance/*.md
```

*Acceptance criteria:*
- [ ] Core state fields are flat (execution_state, intent, actionable)
- [ ] Complex fields (upstream, downstream, requires) remain structured
- [ ] Grep patterns documented in command templates

### Should Have

#### 4. Router Enhancement (Dynamic State)

Update `loomlib.md` to include dynamic discovery:

```markdown
## Actionable Documents (discovered)

Before routing, Claude should glob `loomlib/docs/instance/` to identify:
- Pending surveys/scopes that might relate to "$ARGUMENTS"
- Completed work that could inform production

This discovery informs routing decisions.
```

#### 5. Composition Section in Output

Commands should write a composition section in document body:

```markdown
---

## Composition

**Upstream (what informed this):**
- [Survey: Editor Persistence](inst-survey-editor-persistence) — file mapping, architecture findings

**Downstream (what this enables):**
- Implementation work
- Ticket drafting

**Related:**
- [Scope: List View Aesthetic](inst-scope-list-view-aesthetic) — different feature
```

### Out of Scope

- **Automatic state updates** — commands write state at production time; no runtime engine
- **Blocking enforcement** — discovery suggests, doesn't prevent
- **Cross-document validation** — commands trust what they find

---

## Implementation Order

### Phase 1: Schema (from survey)
Implement conducting fields in `types.ts`, parsing in vite-plugin.

### Phase 2: Command Templates
1. Add Discovery section to scope, survey, excavate
2. Update output templates with conducting frontmatter
3. Update resolve command to mark `execution_state: resolved`

### Phase 3: Router Enhancement
1. Add discovery guidance to `loomlib.md`
2. Consider dynamic state injection (if feasible)

### Phase 4: Existing Document Migration
1. Add conducting frontmatter to existing surveys/scopes
2. Or leave them as-is (backward compatible)

---

## Example: Updated Scope Command

```markdown
---
description: Scope a feature for UX requirements
argument-hint: [feature or subsystem to scope]
---

# Scope: $ARGUMENTS

## Discovery

Before producing, search for related work:

1. **Search for surveys:**
   ```
   Glob: loomlib/docs/instance/survey-*{slug}*
   ```

2. **Search for prior scopes:**
   ```
   Glob: loomlib/docs/instance/scope-*{slug}*
   ```

3. **For each match, read and report:**
   - ID, title, status
   - execution_state (if present)
   - Key findings summary

4. **Decide:**
   - If completed survey exists → use as upstream, reference findings
   - If incomplete survey exists → suggest completing first
   - If no survey → proceed, but note gap

## Protocol

[...existing Scope Method steps...]

## Output

Write to: `loomlib/docs/instance/scope-{slug}.md`

```yaml
---
id: inst-scope-{slug}
title: "Scope: {Topic}"
type: instance
status: draft
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
perspective: null
tags: [scope, {topic}, {tags}]

# ─── CONDUCTING ─────────────────────────────────────────────
actionable: true
intent: research
execution_state: completed
upstream:
  - doc: {survey-id-from-discovery}
    relation: informs
downstream: []
---
```

## Composition

After writing, report:
- What upstream documents informed this scope
- What downstream work this enables
- Related documents discovered but not used
```

---

## Scope Status

**Status:** verified → resolved

**Resolution criteria met:**
- [x] Discovery section added to all document-producing commands
- [x] Output templates include conducting frontmatter
- [x] Commands successfully discover and reference upstream work

---

## Resolution

**Date:** 2026-01-08
**Status:** resolved

### What Was Done

Discovery patterns implemented across all 8 document-producing commands:
- Each command now has a Discovery section with API queries
- Each command outputs conducting frontmatter
- Post-completion reporting added to all commands

### Outcome

The Universal Discovery Pattern from this scope is now the standard for all loomlib commands.

### Remaining Items

None — scope requirements implemented.
