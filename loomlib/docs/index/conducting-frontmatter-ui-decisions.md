---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: idx-conducting-frontmatter-ui-decisions
title: "Index: Conducting Frontmatter UI Decisions"
type: index
framework_kind: null
framework_ids: []
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [index, decisions, frontmatter, ui, loomlib]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: organize
execution_state: resolved
upstream:
  - doc: inst-survey-list-view-frontmatter
    relation: informs
  - doc: inst-survey-editor-view-frontmatter
    relation: informs
  - doc: inst-survey-constellation-view-frontmatter
    relation: informs
downstream: []
---

# Index: Conducting Frontmatter UI Decisions

**Purpose:** Aggregate all decisions needed to implement conducting frontmatter across loomlib views.

**Source Surveys:**
- [Survey: List View for Conducting Frontmatter](inst-survey-list-view-frontmatter)
- [Survey: Editor View for Conducting Frontmatter](inst-survey-editor-view-frontmatter)
- [Survey: Constellation View Spatial Layout](inst-survey-constellation-view-frontmatter)

---

## The Problem

All three views currently display only **descriptive** frontmatter (type, status, tags). The new **conducting** frontmatter fields are invisible:

| Conducting Field | Type | Purpose |
|------------------|------|---------|
| `intent` | research \| build \| capture \| organize \| produce | What kind of work this is |
| `execution_state` | pending \| in_progress \| completed \| resolved | Where in lifecycle |
| `upstream` | `[{doc, relation}]` | What informed this document |
| `downstream` | `[{doc, relation}]` | What this document enables |

---

## Decision Categories

### A. What to Show

Which conducting fields should be visible in each view?

### B. How to Show

Visual encoding: icons, badges, spatial position, color, opacity, tethers?

### C. Interaction Model

View-only, inline-editable, or modal-required?

---

## Decisions Required

### 1. Intent Visibility

**Question:** Should `intent` be visible? How?

| View | Options | Recommendation |
|------|---------|----------------|
| List | Icon / Badge / None | Icon next to type |
| Editor | Icon / Badge / None | Icon in meta bar |
| Constellation | Icon / Zone / Color / None | Icon in node card |

**Proposed Icons:**
| Intent | Icon | Rationale |
|--------|------|-----------|
| research | 🔬 | Scientific investigation |
| build | 🔨 | Construction/making |
| capture | 📝 | Note-taking |
| organize | 📁 | Filing/structuring |
| produce | ⚡ | Output generation |

**Decision:** ✓ **Icons** — Use 🔬🔨📝📁⚡ across all views

---

### 2. Execution State Visibility

**Question:** Should `execution_state` be visible? How?

| View | Options | Recommendation |
|------|---------|----------------|
| List | Dots / Badge / None | Progress dots (●●○○) |
| Editor | Dots / Badge / Dropdown | Progress dots + inline cycling |
| Constellation | Dots / Opacity / Glow / None | Node opacity encoding |

**Proposed Encodings:**

**Progress Dots:**
| State | Dots |
|-------|------|
| pending | ○○○○ |
| in_progress | ●●○○ |
| completed | ●●●● |
| resolved | ✓ (checkmark) |

**Opacity (Constellation):**
| State | Opacity |
|-------|---------|
| pending | 0.5 |
| in_progress | 0.75 |
| completed | 1.0 |
| resolved | 0.6 (faded) |

**Decision:** ✓ **Progress dots** — ○○○○ / ●●○○ / ●●●● / ✓ across all views

---

### 3. Upstream/Downstream Visibility

**Question:** Should graph relationships be visible? How?

| View | Options | Recommendation |
|------|---------|----------------|
| List | Count badge / Links / None | "⤴ 2 ↴ 3" count |
| Editor | Links / Panel / Count / None | Second meta row with clickable links |
| Constellation | Tethers / Count / None | Already spatial (enhance with relation types) |

**List View Option:**
```
⚙ Etymon Method    [draft]    ⤴2 ↴5    2h ago
                              ↑
                     2 upstream, 5 downstream
```

**Editor Option (second row):**
```
⚙ framework / toolkit    [draft]    🔨build    ●●●○
─────────────────────────────────────────────────────
⤴ Survey Method, Scope Method    →    ↴ 5 children
```

**Decision:** ✓ **View-appropriate** — Counts in list, links in editor, tethers in constellation

---

### 4. Relation Type Differentiation

**Question:** Should `upstream.relation` types be visually distinct?

**Context:** The `upstream` array has a `relation` field: `informs | method | source | prior | defines`

| Relation | Meaning | Proposed Visual |
|----------|---------|-----------------|
| method | Framework that produced this | Blue tether, ⚙ icon |
| source | Source material referenced | Green tether, ◈ icon |
| informs | General influence | Gray tether |
| prior | Previous version/iteration | Dashed tether |
| defines | Schema/type definition | Bold tether |

**Constellation tether styling:**
```
─────────  method (solid blue)
═════════  source (double green)
─ ─ ─ ─ ─  prior (dashed gray)
···········  informs (dotted)
```

**Decision:** ✓ **Colored tethers** — method=blue, source=green, prior=dashed, informs=dotted

---

### 5. Inline Editing

**Question:** Should conducting fields be inline-editable or require triage modal?

| Field | Options | Recommendation |
|-------|---------|----------------|
| `execution_state` | Inline cycle / Dropdown / Modal only | Inline cycle (click dots) |
| `intent` | Inline cycle / Modal only | Modal only (rare changes) |
| `upstream` | Add/remove inline / Modal only | Modal only (complex) |

**Inline cycling UX:**
```
Click: ○○○○ → ●●○○ → ●●●● → ✓ → ○○○○
       pending  in_progress  completed  resolved
```

**Decision:** ✓ **Inline editing** — Click execution_state dots to cycle through states

---

### 6. Filter/Search by Conducting Fields

**Question:** Should list view support filtering by conducting fields?

**Current:** Search only matches title, content, tags

**Proposed filter chips:**
```
[All] [Research] [Build] [Capture] [Pending] [In Progress] [Completed]
      ↑─────────────────────────↑   ↑────────────────────────────────↑
              intent filters              execution_state filters
```

**Decision:** ✓ **Filter chips** — Add intent and execution_state filter chips above search

---

### 7. Constellation Category Simplification

**Question:** Should 8 semantic categories be reduced?

**Current 8 categories:**
1. toolkitParent
2. domainParent
3. sourceParent
4. child
5. formulaSibling
6. channelSibling
7. perspectiveSibling
8. distant

**Option A: Keep 8** — Most precise, but complex

**Option B: Reduce to 5:**
1. parent (toolkit + domain + source)
2. child
3. sibling (formula + channel + perspective)
4. distant
5. (remove one?)

**Option C: Expand with intent zones** — 8 categories × intent = 40 combinations (too complex?)

**Decision:** ✓ **Reduce to 5** — parent, child, sibling, distant, (focus)

**New categories:**
1. **parent** — combines toolkitParent + domainParent + sourceParent
2. **child** — documents that use this as framework/source
3. **sibling** — combines formulaSibling + channelSibling + perspectiveSibling
4. **distant** — no direct relationship
5. **focus** — the selected document (center)

---

### 8. Migration: framework_ids → upstream

**Question:** Should constellation use `upstream` array instead of `framework_ids` for tethering?

**Current:** Tethers computed from `framework_ids` and `source_id` fields

**Proposed:** Tethers computed from `upstream` array with relation types

**Implications:**
- Need to ensure all documents have `upstream` populated
- Backward compatibility with docs missing `upstream`
- Could show richer relationship information

**Decision:** ✓ **Replace** — Migrate to `upstream` array, deprecate `framework_ids`/`source_id` for graph

**Migration plan:**
1. Ensure all documents have `upstream` populated (backfill from framework_ids/source_id)
2. Update graph.ts to read from `upstream` instead of `framework_ids`/`source_id`
3. Update categorization to use `upstream.relation` for parent type differentiation
4. Keep `framework_ids`/`source_id` in schema for backward compatibility but stop using for display

---

## Decisions Summary

| # | Decision | Choice |
|---|----------|--------|
| 1 | Intent visibility | ✓ Icons (🔬🔨📝📁⚡) |
| 2 | Execution state | ✓ Progress dots (○○○○ → ●●●●) |
| 3 | Upstream/downstream | ✓ View-appropriate (counts/links/tethers) |
| 4 | Relation types | ✓ Colored tethers |
| 5 | Inline editing | ✓ Click to cycle state |
| 6 | Filtering | ✓ Filter chips |
| 7 | Categories | ✓ Reduce 8 → 5 |
| 8 | Migration | ✓ Replace with upstream |

---

## Implementation Priority

Based on decisions, recommended implementation order:

| Phase | Feature | Files | Effort |
|-------|---------|-------|--------|
| **1** | Add `intent` icons to all views | types.ts, document-card.ts, editor.ts, constellation.ts | Low |
| **2** | Add `execution_state` progress dots | types.ts, document-card.ts, editor.ts, constellation.ts | Low |
| **3** | Add inline state cycling (editor) | editor.ts, editor.css, documents.ts | Medium |
| **4** | Add upstream/downstream counts (list) | document-card.ts, card.css | Medium |
| **5** | Add relationship links (editor) | editor.ts, editor.css | Medium |
| **6** | Simplify constellation to 5 categories | graph.ts, constellation-config.ts, constellation.ts, constellation.css | Medium |
| **7** | Add filter chips (list) | list.ts, list.css | Medium |
| **8** | Add colored relation tethers | constellation.ts, constellation.css | Medium |
| **9** | Migrate to upstream-based graph | graph.ts, documents.ts (backfill), constellation.ts | High |

### Phase Dependencies

```
Phase 1-2: Independent, can parallelize
Phase 3: Requires Phase 2
Phase 4-5: Requires Phase 1-2
Phase 6: Independent
Phase 7: Requires Phase 1-2
Phase 8-9: Requires Phase 6
```

---

## Decision Template

Use this template to record decisions:

```markdown
### Decision: [Topic]
**Date:** YYYY-MM-DD
**Choice:** [Selected option]
**Rationale:** [Why this choice]
**Implementation:** [What to build]
```

---

## Related Documents

**Surveys (upstream):**
- [inst-survey-list-view-frontmatter](inst-survey-list-view-frontmatter)
- [inst-survey-editor-view-frontmatter](inst-survey-editor-view-frontmatter)
- [inst-survey-constellation-view-frontmatter](inst-survey-constellation-view-frontmatter)

**Framework:**
- [fw-conducting-frontmatter](fw-conducting-frontmatter) — Schema definition

**Prior scope:**
- [inst-scope-list-view-aesthetic](inst-scope-list-view-aesthetic)
- [inst-scope-editor-view](inst-scope-editor-view)
- [inst-scope-constellation-aesthetic](inst-scope-constellation-aesthetic)

---

## Resolution

**Date:** 2026-01-08
**Status:** resolved

### What Was Done

All 8 decisions from this index were implemented across 9 phases:

| # | Decision | Implementation |
|---|----------|----------------|
| 1 | Intent visibility | ✅ Icons (🔬🔨📝📁⚡) added to all views |
| 2 | Execution state | ✅ Progress dots (○○○○ → ●●●●) added to all views |
| 3 | Upstream/downstream | ✅ Counts in list, links in editor, tethers in constellation |
| 4 | Relation types | ✅ Colored tethers (method=blue, source=green, prior=dashed) |
| 5 | Inline editing | ✅ Click to cycle execution state in editor |
| 6 | Filtering | ✅ Filter chips for intent and execution_state in list view |
| 7 | Categories | ✅ Reduced 8 → 4 (parent, child, sibling, distant) |
| 8 | Migration | ✅ Graph uses upstream array instead of framework_ids |

### Changes Made

- `loomlib/src/types.ts` — Added conducting field helpers and simplified SemanticCategory
- `loomlib/src/components/document-card.ts` — Added intent icons, execution dots, relation counts
- `loomlib/src/views/list.ts` — Added filter chips for intent and execution_state
- `loomlib/src/views/editor.ts` — Added meta bar conducting fields and relations bar
- `loomlib/src/views/constellation.ts` — Updated for 4 categories and colored tethers
- `loomlib/src/data/graph.ts` — Rewrote categorization to use upstream array
- `loomlib/src/ui/card.css` — Styles for intent, execution, relations
- `loomlib/src/ui/list.css` — Styles for filter chips
- `loomlib/src/ui/editor.css` — Styles for meta bar and relations bar
- `loomlib/src/ui/constellation.css` — Styles for tether colors

### Outcome

All three views (list, editor, constellation) now display conducting frontmatter:
- Users can see intent, execution state, and relationships at a glance
- Users can filter by conducting fields in list view
- Users can cycle execution state inline in editor
- Constellation shows relationship types via colored tethers

### Remaining Items

None - all 8 decisions implemented.
