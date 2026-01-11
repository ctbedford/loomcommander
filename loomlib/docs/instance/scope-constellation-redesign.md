---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-scope-constellation-redesign
title: "Scope: Constellation View Redesign for Conducting Frontmatter"
type: instance
framework_kind: null
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [scope, constellation, graph, visualization, conducting-frontmatter, ux]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-scope-method
    relation: method
  - doc: inst-survey-constellation-view-frontmatter
    relation: informs
  - doc: inst-scope-constellation-aesthetic
    relation: prior
  - doc: fw-conducting-frontmatter
    relation: informs
downstream: []
---

# Scope: Constellation View Redesign for Conducting Frontmatter

**Date:** 2026-01-08
**Subject:** Rethinking the constellation view to fully leverage conducting frontmatter
**Method:** Scope Method (UX analysis)
**Prerequisite:** survey-constellation-view-frontmatter.md, fw-conducting-frontmatter.md

---

## Audit

### Current State (from Screenshot)

The screenshot shows the current constellation view:

```
┌─────────────────────────────────────────────────────────────────────┐
│  ● Default  ⌘L                                                      │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ ▪ Survey: Editor View for Conducting Frontmatter = ⚙ Survey  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│      ┌───────────┐ ┌───────────┐                Parents 1-2 of 3    │
│      │⚡ Scope: E │ │▪ Survey:E │                                    │
│      └───────────┘ └───────────┘                                    │
│              ╲       ╱                                               │
│               ╲     ╱                                                │
│                ╲   ╱                                                 │
│         ┌─────────────────────────────┐                             │
│         │ ▪ ⚡ Survey: Editor View    │                             │
│         │   for Conducting            │  ← Focus node (selected)    │
│         │   Frontmatter          ✓    │                             │
│         └─────────────────────────────┘                             │
│                    │                                                 │
│            ┌───────────┐                                            │
│            │ ⚡ Survey:C│                Siblings 1-2 of 26          │
│            └───────────┘                                            │
│                                                                      │
│            ┌───────────┐                                            │
│            │ ⚡ Survey:L│                                            │
│            └───────────┘                                            │
│                                                                      │
│                                          Distant  1-0 of 27         │
└─────────────────────────────────────────────────────────────────────┘
```

### Current UX Flow

1. User sees **focused document** at center with tethers to related nodes
2. **4 categories** with slot pagination: parent, child, sibling, distant
3. **Slot indicators** on edges showing overflow counts
4. **Lens selector** (top-left) for filtering views
5. **Formula bar** (top-center) showing production equation for instances
6. **Node cards** showing: type icon + intent icon + title + execution dots
7. Click to focus, click-focused to open, hover for preview

### What Conducting Frontmatter Provides (Not Fully Used)

| Field | Available | Currently Used? |
|-------|-----------|-----------------|
| `intent` | research, build, capture, organize, produce | Icon on card only |
| `execution_state` | pending, in_progress, completed, resolved | Dots on card only |
| `upstream[]` | Array of {doc, relation} | Used for parent detection |
| `downstream[]` | Array of {doc, relation} | Not used |
| `relation` types | method, source, informs, prior | Tether colors only |

### Visual Inventory (Current)

- **Background:** Dark void, radial gradient, subtle noise
- **Nodes:** Glassmorphism cards with type icon, intent icon, title, state dots
- **Tethers:** Colored by relation (blue=toolkit, purple=domain, green=source, amber=child)
- **Categories:** 4 spatial zones (parent above, child below, sibling ring, distant outer)
- **Formula bar:** Shows `◧ TITLE = ⚙ Toolkit + ▣ Domain + ◈ Source`

---

## Affordances

### What the Current UI Promises

| Element | Implied Promise |
|---------|-----------------|
| Spatial layout | "Position tells you relationship type" |
| Tether colors | "Colors tell you relationship quality" |
| Node clustering | "Nearby nodes are similar" |
| Pagination indicators | "There's more beyond what you see" |
| Lens selector | "You can filter the view" |
| Formula bar | "You can see how this was made" |
| Intent/state on cards | "You can see document lifecycle" |

### Mental Models Invoked

- **Star chart** — Central focus with orbiting documents
- **Dependency graph** — Parent → child flow visible
- **Production lineage** — Formula bar shows "ingredients"

### What the UI *Should* Promise (with Conducting Frontmatter)

| New Promise | How |
|-------------|-----|
| "See the flow of production" | Upstream/downstream as navigable paths |
| "Understand what's in progress" | Execution state as first-class visual |
| "Find what you should work on next" | Pending/in_progress documents highlighted |
| "See what this document enabled" | Downstream visible, not just upstream |
| "Understand relation types at a glance" | Relations (method/source/informs/prior) distinct |

---

## Expectations

### What Users Would Expect (with Conducting Frontmatter)

1. **Follow the thread** — Click upstream to see what informed this, click downstream to see what it enabled
2. **See workflow state** — Documents in_progress should be visually distinct from completed
3. **Find work queue** — Pending documents should be findable quickly
4. **Understand relation types** — "This was made with that method" vs "This was informed by that source"
5. **Navigate production flow** — Not just "what is related" but "what led to what"

### Natural User Flows (Not Currently Supported)

| Flow | Expectation | Current Reality |
|------|-------------|-----------------|
| "What informed this?" | See upstream with relation labels | Upstream visible, relations by color only |
| "What did this enable?" | See downstream documents | No downstream visualization |
| "What's in progress?" | Filter/highlight by execution_state | Can filter via lens, but no highlight |
| "Follow the production chain" | Navigate upstream → document → downstream | Can only navigate upstream |
| "What needs work?" | See pending documents prominently | No visual distinction |

---

## Gaps

| Gap | Type | Description |
|-----|------|-------------|
| **No downstream navigation** | Blocking | Can't see what a document enabled |
| **Execution state not scannable** | Friction | Dots on cards are subtle, no filtering by state |
| **Relation types require color decoding** | Friction | Blue vs purple vs green requires learning |
| **No "flow" visualization** | Friction | Graph shows connections, not directionality |
| **Pending/in_progress not prominent** | Friction | Work queue is hidden |
| **Formula bar is instance-only** | Polish | Other types get no "how was this made" context |
| **Upstream array supersedes legacy fields** | Debt | Code still references framework_ids/source_id |

### Gap Categories

**Blocking:**
- No downstream visualization (one-way navigation only)

**Friction:**
- Execution state is decorative, not actionable
- Relation types encoded only in color (accessibility issue)
- No "follow the production chain" flow
- Work queue (pending/in_progress) not prominent

**Polish/Debt:**
- Formula bar limited to instances
- Code still has legacy field references alongside upstream

---

## Requirements

### Must Have (Blocking → Usable)

- [ ] **Show downstream documents**
  - Documents that reference this doc via `upstream[]` should appear in a dedicated zone
  - Acceptance: User can see "what this document enabled" at a glance
  - Implementation: Add `downstream` category to spatial layout

- [ ] **Make execution_state actionable**
  - Execution state should be filterable, not just visible
  - Add "Work Queue" lens showing pending + in_progress documents
  - Acceptance: User can quickly find documents that need work

### Should Have (Friction → Pleasant)

- [ ] **Show relation types explicitly**
  - Tethers or node labels should show relation (method, source, informs, prior)
  - Not just color — text labels on hover or as badges
  - Acceptance: User understands relation without memorizing color codes

- [ ] **Visualize production flow direction**
  - Tethers should have directionality (arrowheads or gradient)
  - Upstream → focus → downstream should read as a flow
  - Acceptance: User can follow production chain visually

- [ ] **Highlight pending/in_progress prominently**
  - Documents with `execution_state: pending` or `in_progress` get visual emphasis
  - Subtle pulse, badge, or border treatment
  - Acceptance: Work queue items are instantly recognizable

- [ ] **Extend formula bar to all types**
  - Frameworks: Show what they've produced (downstream count)
  - Sources: Show what cites them
  - Notes: Show if they've been promoted
  - Acceptance: Formula bar provides context for any focused document type

### Could Have (Polish)

- [ ] **Upstream/downstream counters**
  - Badge on node showing count of upstream + downstream references
  - Helps identify "hub" documents

- [ ] **Relation-type filtering**
  - Lens option to show only "method" relations or only "source" relations
  - Helps understand production by type

- [ ] **Completed chain visualization**
  - Show full upstream → focus → downstream in a single linear view
  - "Lineage view" or "Thread view"

- [ ] **State-based sorting within categories**
  - In_progress documents appear first within each category
  - Keeps active work visible

### Out of Scope

- Full force-directed physics (current spatial algorithm is adequate)
- 3D visualization
- Multi-select operations
- AI-powered semantic similarity
- Real-time collaboration features

---

## Design Direction

### Core Principle: Production Flow as First-Class

The constellation view should visualize the **production graph**, not just document relationships. With conducting frontmatter:

```
[upstream: method] → [upstream: source] → [FOCUS] → [downstream: enables]
     ↑                      ↑                              ↓
  "How was this made?"  "What informed it?"      "What did it enable?"
```

### Spatial Layout Redesign

**Current (4 categories):**
```
              [parent]
                 │
[sibling] ──── FOCUS ──── [sibling]
                 │
              [child]
              [distant]
```

**Proposed (5 categories with directionality):**
```
              [upstream]
                 │
                 ▼
              FOCUS
                 │
                 ▼
             [downstream]

[sibling: same output/perspective]  [distant]
```

Key change: **upstream and downstream are explicit categories**, not just "parent" and "child".

### Execution State Visual Treatment

| State | Visual Treatment |
|-------|------------------|
| `pending` | Dim (70% opacity), dashed border |
| `in_progress` | Normal + subtle pulse animation |
| `completed` | Full brightness, solid border |
| `resolved` | Faded (50% opacity), archived look, grayscale tint |

### Relation Type Visual Treatment

| Relation | Tether Style | Label |
|----------|--------------|-------|
| `method` | Solid blue, arrowhead | "method" |
| `source` | Solid green, arrowhead | "source" |
| `informs` | Dashed gray, arrowhead | "informs" |
| `prior` | Dotted gray, no arrow | "prior" |

### New Lenses

| Lens | Description |
|------|-------------|
| **Work Queue** | Shows pending + in_progress, sorted by urgency |
| **Production Flow** | Shows full upstream → downstream chain |
| **Method Lineage** | Shows only `relation: method` connections |
| **Source Tree** | Shows only `relation: source` connections |

---

## Implementation Plan

### Phase 1: Core Conducting Integration

1. **Add downstream category**
   - Modify `categorizeDocs()` in graph.ts
   - Add downstream slot to spatial layout
   - Update slot indicators

2. **Make execution_state visual**
   - CSS for pending/in_progress/completed/resolved states
   - Node opacity and animation based on state

3. **Add Work Queue lens**
   - New lens that filters by execution_state

### Phase 2: Flow Visualization

4. **Add tether directionality**
   - SVG arrowheads or gradient direction
   - Point from upstream → downstream

5. **Relation type labels**
   - Hover tooltip showing relation type
   - Optional: small label on tether midpoint

6. **Extend formula bar**
   - Show downstream count for frameworks
   - Show citation count for sources

### Phase 3: Polish

7. **Upstream/downstream counters on nodes**
8. **State-based sorting within categories**
9. **Relation-type filtering lenses**

---

## Diagrams

### Current Node Card

```
┌───────────────────────────────┐
│ ⚙ 🔬 Etymon Method      ●●●○ │
└───────────────────────────────┘
  │   │                    │
  │   └── intent icon      └── execution dots
  └── type icon
```

### Proposed Node Card with State Visual

```
┌───────────────────────────────┐
│ ⚙ 🔬 Etymon Method      ●●●○ │ ← completed: solid border, full opacity
└───────────────────────────────┘

┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐
│ ◧ 🔬 Survey: Editor View  ●○○○ │ ← pending: dashed border, dim
└╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘

┌───────────────────────────────┐
│ ◧ 🔨 Scope: Feature X   ●●○○ │ ← in_progress: pulse animation
└───────────────────────────────┘
    ∿∿∿∿∿ (subtle pulse)
```

### Proposed Spatial Layout

```
                    ┌─────────────┐
                    │ UPSTREAM    │
                    │ (method)    │
                    └─────────────┘
                          │
                          ▼
  ┌───────────┐    ┌─────────────┐    ┌───────────┐
  │ UPSTREAM  │ ──→│   FOCUS     │←── │ UPSTREAM  │
  │ (source)  │    │             │    │ (prior)   │
  └───────────┘    └─────────────┘    └───────────┘
                          │
                          ▼
                    ┌─────────────┐
                    │ DOWNSTREAM  │
                    │ (enables)   │
                    └─────────────┘

        ┌───────────┐        ┌───────────┐
        │ SIBLING   │        │ DISTANT   │
        │ (output)  │        │           │
        └───────────┘        └───────────┘
```

### Flow Visualization Concept

```
Lineage View (new lens):

 ┌───────────┐
 │ ⚙ Etymon  │ ─method──┐
 │   Method  │          │
 └───────────┘          │
                        ▼
 ┌───────────┐    ┌─────────────┐
 │ ◈ Source  │───→│   FOCUS     │
 │   X       │    │  ◧ Inst     │
 └───────────┘    └─────────────┘
       source           │
                        │ enables
                        ▼
                  ┌───────────┐
                  │ ◧ Child   │
                  │   Document│
                  └───────────┘
```

---

## Notes

- The conducting frontmatter system is fully implemented — the view just needs to leverage it
- Backward compatibility is maintained (upstream array coexists with legacy fields)
- The slot system pagination is working well — keep it but add downstream as 5th category
- Lens system is powerful but underutilized — Work Queue lens would be high-value
- Performance is acceptable for current scale (~50 docs); no virtualization needed yet

---

## Acceptance Criteria Summary

| Requirement | Acceptance Criteria |
|-------------|---------------------|
| Downstream visible | User can see documents enabled by focus |
| Execution state actionable | Work Queue lens shows pending/in_progress |
| Relation types explicit | Tethers show direction; hover shows relation name |
| State visual treatment | pending=dim, in_progress=pulse, resolved=faded |
| Extended formula bar | All document types get contextual info |

---

## Composition

**Upstream (what informed this scope):**
- [Scope Method](fw-scope-method) — method used
- [Survey: Constellation View Spatial Layout](inst-survey-constellation-view-frontmatter) — technical analysis
- [Scope: Constellation View Aesthetic](inst-scope-constellation-aesthetic) — prior requirements (partially resolved)
- [Conducting Frontmatter](fw-conducting-frontmatter) — schema being visualized

**Downstream (what this enables):**
- Implementation of downstream visualization
- Work Queue lens implementation
- Tether directionality improvements
- Extended formula bar

**Related (discovered but not upstream):**
- `inst-survey-constellation-view` — original implementation survey
- `inst-survey-editor-view-frontmatter` — editor also uses conducting fields
