---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-scope-deck-view
title: "Scope: Deck View"
type: instance
framework_kind: null
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [scope, ux, deck, grid, lens, sortable]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-scope-method
    relation: method
  - doc: inst-scope-spatial-canvas-list
    relation: prior
  - doc: inst-survey-spatial-canvas-implementation
    relation: informs
  - doc: inst-scope-list-view-aesthetic
    relation: informs
downstream: []
---

# Scope: Deck View

**Date:** 2026-01-10
**Subject:** Grid-based document navigation with lens-based reordering
**Method:** Scope Method (UX analysis)

---

## Context: Why Not Spatial?

The current spatial view (Ctrl+Shift+S) uses UMAP projection with d3-force collision resolution. Despite collision handling, the result is a **semantic blob**:

| Problem | Evidence |
|---------|----------|
| **Collision clusters** | `image copy 3.png` shows 50+ nodes piled in overlapping heaps |
| **Truncated titles** | Cards max at 180px, titles read "Survey: Edi...", "Scope: Con..." |
| **No sorting** | Overlays change colors, not arrangement |
| **No discrete navigation** | Pan/zoom, not "flip through" |

The spatial view answers: "What's semantically nearby?" But it fails at: "Show me all frameworks" or "What's most recent?"

**The deck metaphor addresses a different need:** sortable, browsable, readable document navigation where the user feels like they're going through organized stacks, not looking at a star map.

---

## Audit: Current Navigation Options

### List View (default)
- **Layout:** Vertical scroll of full-width cards
- **Sorting:** By `modifiedAt` (implicit, newest first)
- **Filtering:** State chips, intent chips, text search
- **Navigation:** Arrow keys + scroll
- **Strengths:** Readable, searchable, filterable
- **Weakness:** 1D — no spatial relationships visible

### Spatial View (Ctrl+Shift+S)
- **Layout:** UMAP 2D projection with pan/zoom
- **Sorting:** None (position is semantic similarity)
- **Filtering:** Overlay toggles (type, state, intent, recency, lineage)
- **Navigation:** Pan/zoom, click to select
- **Strengths:** Shows semantic clustering
- **Weakness:** Collisions, unreadable, unsortable

### Missing: Deck View
- **Layout:** Discrete grid slots (no overlaps)
- **Sorting:** By active lens (type, recency, intent, status, lineage depth)
- **Filtering:** Lens is both filter and sort
- **Navigation:** Arrow keys through grid, or "shuffle" animation on lens change
- **Metaphor:** Physical deck of cards you can reorder by different criteria

---

## Affordances

### What a Deck Should Promise

| Visual Element | Implied Promise |
|----------------|-----------------|
| Grid of discrete slots | Every document has one place, no overlaps |
| Lens selector | "Reshuffle by this criterion" |
| Animated reorder | Documents move to new positions, not replaced |
| Card faces with full titles | Every document is readable |
| Keyboard navigation | Arrow keys move through the deck |
| Current lens indicator | "You're viewing by [type/recency/etc.]" |

### Mental Models Invoked

- **Card catalog:** Flip through organized entries
- **Trello/Kanban:** Columns of categorized cards
- **Photo grid:** Thumbnails you can sort by date/name/size
- **iTunes album view:** Grid that re-sorts when you change criteria

### Mental Models Avoided

- **Star map:** No "nearest neighbors" — that's what spatial does
- **Mind map:** No free-form positioning
- **File tree:** No hierarchy by folder

---

## Expectations

### What Users Would Expect to Do

1. **"Show me all frameworks"** → Select "Type" lens → frameworks group together or come first
2. **"What's most recent?"** → Select "Recency" lens → newest cards at top-left
3. **"What's in progress?"** → Select "State" lens → in_progress cards grouped/first
4. **"What's research vs production?"** → Select "Intent" lens → research/build/capture/produce groups
5. **"Go through one by one"** → Arrow keys move focus through the deck order
6. **"Open this one"** → Enter on focused card → opens editor

### Lens-Based Reordering

| Lens | Sort/Group Logic | Visual Treatment |
|------|------------------|------------------|
| **Type** | Group by type (framework → instance → source → note → index) | Section headers or color bands |
| **Recency** | Sort by `modifiedAt` descending | Gradient fade (newest bright, oldest dim) |
| **State** | Group by execution_state (in_progress → pending → completed → resolved) | State colors as backgrounds |
| **Intent** | Group by intent (research → build → produce → capture → organize) | Intent icons prominent |
| **Lineage** | Sort by upstream chain length (roots first, derivatives later) | Depth indicators |
| **Semantic** | UMAP-derived row assignment (similar docs on same row) | Subtle clustering hint |

### Interaction Model

| Action | Result |
|--------|--------|
| Select lens | Grid reshuffles with animation |
| Arrow keys | Move focus through deck in lens order |
| Enter | Open focused document |
| Escape | Return to list view |
| Number keys 1-6 | Quick lens switch |
| Type to search | Filter visible cards (grays out non-matches) |

---

## Gaps: What Deck View Needs That Doesn't Exist

| Gap | Type | Description |
|-----|------|-------------|
| **No grid layout** | Blocking | Current views are list (1D) or canvas (2D continuous) |
| **No lens-based sorting** | Blocking | List sorts by date only; spatial doesn't sort |
| **No shuffle animation** | Friction | Need FLIP animation when reordering |
| **No discrete focus** | Friction | Spatial has focus but navigation is pan-based |
| **No grouping headers** | Polish | Type/intent lenses need visual section breaks |
| **No semantic lens** | Polish | UMAP as row-assignment (keeping semantic without collision) |

### Technical Gaps

| Need | Current State | Required |
|------|---------------|----------|
| Grid component | None | CSS grid with dynamic cell count |
| Lens state | `activeOverlays` in spatial | `activeLens` single selection |
| Sort functions | None | Sort by type, recency, state, intent, lineage |
| FLIP animation | None | `d3-transition` or Web Animations API |
| Keyboard grid nav | List has 1D nav | 2D arrow key navigation |

---

## Requirements

### Must Have (Blocking)

- [ ] **CSS Grid layout with discrete slots**
  - *Acceptance: 112 documents display without overlap, readable titles*
  - Grid auto-fills columns based on viewport width
  - Cards have fixed min-width (200px) for readability

- [ ] **Lens selector with 5 options**
  - *Acceptance: User can switch between Type, Recency, State, Intent, Lineage lenses*
  - Single active lens (not toggleable overlays)
  - Number keys 1-5 for quick switch

- [ ] **Sort implementation for each lens**
  - *Acceptance: Changing lens reorders the grid correctly*
  - Type: group by `doc.type`
  - Recency: sort by `doc.modifiedAt` desc
  - State: group by `doc.execution_state`
  - Intent: group by `doc.intent`
  - Lineage: sort by `doc.upstream.length` asc

- [ ] **Keyboard navigation through grid**
  - *Acceptance: Arrow keys move focus, Enter opens document*
  - Focus ring visible on current card
  - Tab/Shift+Tab also navigates

### Should Have (Friction)

- [ ] **FLIP shuffle animation when lens changes**
  - *Acceptance: Cards animate to new positions over 300ms*
  - Use `requestAnimationFrame` + CSS transforms
  - Cards that stay visible slide; cards that enter/exit fade

- [ ] **Section headers for grouped lenses**
  - *Acceptance: Type lens shows "Frameworks", "Instances", etc. headers*
  - Headers stick at top of section while scrolling

- [ ] **Search filter (type-ahead)**
  - *Acceptance: Typing dims non-matching cards, focuses first match*
  - Filter applies within current lens order

- [ ] **Readable cards with full titles**
  - *Acceptance: Titles don't truncate at reasonable card widths*
  - Two-line title wrapping allowed
  - Type icon, state dots, intent icon visible

### Could Have (Polish)

- [ ] **Semantic lens (6th option)**
  - Uses UMAP Y-coordinate to assign rows, X for position within row
  - "Similar documents on same row" without overlap

- [ ] **Card size toggle** (compact/normal/expanded)
  - Compact: icon + truncated title only
  - Normal: icon + title + state
  - Expanded: icon + title + state + preview snippet

- [ ] **Lens persistence**
  - Remember last active lens in localStorage

- [ ] **Multi-select for batch operations**
  - Shift+click to select range
  - Cmd+click to toggle selection

### Out of Scope

- Drag-and-drop reordering (deck is sorted by lens, not user)
- Custom card positions (that's spatial view's domain)
- Comparison mode (separate feature)
- Inline editing
- Virtual scrolling (unless 500+ docs require it)

---

## Design Direction

### Visual Language

Maintain the planetarium aesthetic:
- Dark void background with subtle gradient
- Glassmorphism cards
- OKLCH colors for type/state/intent
- Monospace for metadata, system sans for titles

### Grid Specifications

```
┌─────────────────────────────────────────────────────────────────┐
│  [1 Type] [2 Recency] [3 State] [4 Intent] [5 Lineage]  ← lens │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ ⚙       │ │ ⚙       │ │ ▣       │ │ ▣       │ │ ◧       │   │
│  │ Etymon  │ │ Survey  │ │ Oikono- │ │ Four    │ │ Credo   │   │
│  │ Method  │ │ Method  │ │ mia...  │ │ Knowings│ │ Ethics  │   │
│  │ ●●●● ✓  │ │ ●●○○    │ │ ●●●○    │ │ ●●●●    │ │ ●●○○    │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ ...     │ │ ...     │ │ ...     │ │ ...     │ │ ...     │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│                                                                 │
│  [112 documents]                              [Type lens active]│
└─────────────────────────────────────────────────────────────────┘
```

### Card Anatomy (Normal Size)

```
┌────────────────────────┐
│ ⚙  Etymon Method       │  ← type icon + title (2 lines max)
│    ●●●● ⚡ verified     │  ← state dots + intent + status
└────────────────────────┘
```

Width: 200-240px
Height: ~70px (2-line title)
Gap: 12px

### Lens Bar

```
┌───────────────────────────────────────────────────────────┐
│ [1 Type●] [2 Recency] [3 State] [4 Intent] [5 Lineage]   │
└───────────────────────────────────────────────────────────┘
```

- Active lens has filled indicator
- Number key hints visible
- Horizontal, top of view

---

## Implementation Path

### Phase 1: Grid Foundation
1. Create `views/deck.ts` following ListView pattern
2. Create `ui/deck.css` with CSS grid layout
3. Add to Shell view cycle (Cmd+Shift+D)
4. Render all docs in grid with placeholder sort

### Phase 2: Lens System
1. Define `DeckLens` type and sort functions
2. Implement lens selector component
3. Wire number keys to lens switching
4. Implement all 5 sort/group functions

### Phase 3: Animation
1. Implement FLIP animation on lens change
2. Add section headers for grouped lenses
3. Smooth focus transitions

### Phase 4: Polish
1. Type-ahead search filtering
2. Card size variants
3. Lens persistence
4. Semantic lens (UMAP-row)

---

## Composition

**Upstream (what informed this scope):**
- [Scope Method](fw-scope-method) — method used
- [Scope: Spatial Canvas List View](inst-scope-spatial-canvas-list) — original spatial concept
- [Survey: Spatial Canvas Implementation](inst-survey-spatial-canvas-implementation) — technical context
- [Scope: List View Aesthetic](inst-scope-list-view-aesthetic) — visual design context

**Downstream (what this scope enables):**
- Implementation of deck view
- Potential deprecation or demotion of spatial view
- New keyboard shortcut (Cmd+Shift+D)

**Related:**
- `inst-survey-constellation-view` — another spatial approach
- `inst-scope-editor-view` — card rendering patterns

---

## Notes

### Why Not Fix Spatial?

The spatial view's collision problem could be "fixed" by increasing node spacing, but this misses the point:

1. **Spatial answers the wrong question.** It shows semantic similarity (UMAP), but users want sortable browsing.
2. **Overlays aren't lenses.** Changing overlay colors doesn't help you "go through" documents.
3. **Pan/zoom isn't navigation.** A deck you flip through is different from a map you explore.

The deck view is a **different tool for a different job**, not a fix for spatial.

### Keyboard Shortcut Proposal

| Shortcut | View |
|----------|------|
| Cmd+Shift+L | List (existing, or keep as default) |
| Cmd+Shift+D | **Deck** (new) |
| Cmd+Shift+S | Spatial (existing, but demoted) |
| Cmd+Shift+V | Cycle through views |

### Performance Consideration

With 112 documents at 70px height + 12px gap = ~9240px total if single column. CSS Grid with `auto-fill` should handle this fine. Virtual scrolling not needed unless doc count exceeds ~500.

### Relationship to Spatial

Keep spatial view for:
- "What's semantically near X?" queries
- Embedding debugging
- Users who prefer the map metaphor

Deck becomes the new "browse all documents" view, replacing the role spatial was supposed to fill but couldn't due to collisions.
