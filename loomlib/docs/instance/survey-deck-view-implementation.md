---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-survey-deck-view-implementation
title: "Survey: Deck View Implementation"
type: instance
framework_kind: null
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [survey, deck, grid, implementation]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-survey-method
    relation: method
  - doc: inst-scope-deck-view
    relation: prior
downstream: []
---

# Survey: Deck View Implementation

**Date:** 2026-01-10
**Subject:** Technical implementation path for deck view
**Method:** Survey Method (static analysis)

---

## Survey

### Relevant Files

**Core (must create):**
- `loomlib/src/views/deck.ts` — New deck view class
- `loomlib/src/ui/deck.css` — Grid layout and card styles

**Must modify:**
- `loomlib/src/layout/shell.ts` — Add deck view to view cycle
- `loomlib/src/main.ts` — Import deck CSS
- `loomlib/src/types.ts` — Add `DeckLens` type

**Pattern reference (read, don't modify):**
- `loomlib/src/views/list.ts` — View lifecycle pattern
- `loomlib/src/views/spatial.ts` — Alternative spatial approach
- `loomlib/src/components/document-card.ts` — Card rendering
- `loomlib/src/components/lens-picker.ts` — Picker component pattern

**Data layer (use existing):**
- `loomlib/src/data/documents.ts` — `listDocuments()`
- `loomlib/src/types.ts` — `Document`, `ExecutionState`, `DocumentIntent`

---

## Core Sample

### View Class Pattern

All views follow this interface (from `list.ts`, `spatial.ts`):

```typescript
class SomeView {
  constructor(container: HTMLElement, options: ViewOptions)

  // Lifecycle
  async refresh(): Promise<void>  // Fetch data and render
  show(): void                     // Add visibility class
  hide(): void                     // Remove visibility class
  focus(): void                    // Focus keyboard target

  // State
  private docs: Document[]
  private focusedId: string | null
}
```

### Shell Integration

`shell.ts` manages view switching:

```typescript
// Current views
private listView: ListView;
private constellationView: ConstellationView;
private flowView: FlowView;
private spatialView: SpatialView;
private editor: Editor;

// View cycle (Cmd+Shift+V)
toggleView(): void {
  // list -> constellation -> flow -> spatial -> editor -> list
}

// Direct shortcuts
// Cmd+Shift+S → showSpatial()
// Need: Cmd+Shift+D → showDeck()
```

### Sort Functions Needed

Based on scope requirements:

```typescript
type DeckLens = 'type' | 'recency' | 'state' | 'intent' | 'lineage';

// Type lens: group by doc.type
const TYPE_ORDER = ['framework', 'instance', 'source', 'note', 'index'];

// Recency lens: sort by modifiedAt desc
docs.sort((a, b) => b.modifiedAt - a.modifiedAt);

// State lens: group by execution_state
const STATE_ORDER = ['in_progress', 'pending', 'completed', 'resolved'];

// Intent lens: group by intent
const INTENT_ORDER = ['research', 'build', 'produce', 'capture', 'organize'];

// Lineage lens: sort by upstream chain length
const lineageDepth = (doc) => doc.upstream?.length ?? 0;
docs.sort((a, b) => lineageDepth(a) - lineageDepth(b));
```

### CSS Grid Layout

Target: auto-fill columns with min-width 200px

```css
.deck-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  padding: 16px;
}
```

### Keyboard Navigation

List view uses 1D navigation:
```typescript
handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') selectedIndex++;
  if (e.key === 'ArrowUp') selectedIndex--;
}
```

Deck needs 2D grid navigation:
```typescript
// Need to calculate columns based on grid
const columns = Math.floor(containerWidth / (cardWidth + gap));

if (e.key === 'ArrowRight') selectedIndex++;
if (e.key === 'ArrowLeft') selectedIndex--;
if (e.key === 'ArrowDown') selectedIndex += columns;
if (e.key === 'ArrowUp') selectedIndex -= columns;
```

---

## Stratigraphy

### Call Hierarchy (Proposed)

```
Shell
├── DeckView (NEW)
│   ├── listDocuments() → API → IndexedDB
│   ├── sortByLens(lens) → sorted docs array
│   ├── renderGrid() → DOM creation
│   ├── renderLensBar() → lens selector
│   └── handleKeydown() → 2D navigation
│
├── ListView (existing)
├── SpatialView (existing)
└── Editor (existing)
```

### State Location

| State | Location | Notes |
|-------|----------|-------|
| Active lens | `DeckView.activeLens` | `DeckLens` enum |
| Sorted docs | `DeckView.sortedDocs` | Result of lens sort |
| Grid columns | Computed | `Math.floor(width / cellWidth)` |
| Focused index | `DeckView.focusedIndex` | 0-based into sortedDocs |
| Card elements | `DeckView.cardElements` | Map<docId, HTMLElement> for FLIP |

### Animation Strategy

**FLIP technique for lens changes:**

1. **First:** Record current positions of all cards
2. **Last:** Apply new sort, render in new positions
3. **Invert:** Calculate delta from new to old position
4. **Play:** Animate from inverted back to final

```typescript
// Pseudo-code
async switchLens(newLens: DeckLens) {
  // First: capture old positions
  const oldPositions = new Map<string, DOMRect>();
  for (const [id, el] of this.cardElements) {
    oldPositions.set(id, el.getBoundingClientRect());
  }

  // Last: re-sort and re-render
  this.activeLens = newLens;
  this.sortedDocs = this.sortByLens(this.docs, newLens);
  this.renderGrid();

  // Invert + Play
  for (const [id, el] of this.cardElements) {
    const oldRect = oldPositions.get(id);
    const newRect = el.getBoundingClientRect();
    if (oldRect) {
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;
      el.animate([
        { transform: `translate(${dx}px, ${dy}px)` },
        { transform: 'translate(0, 0)' }
      ], { duration: 300, easing: 'ease-out' });
    }
  }
}
```

---

## Findings

### Reusable Components

1. **Card rendering:** `document-card.ts` exports `createDocumentCard()` — can reuse for deck cards, but may want simplified variant

2. **Lens picker pattern:** `lens-picker.ts` shows how constellation does lens selection — can adapt for deck's lens bar

3. **Filter chip pattern:** `list.ts` has state/intent filter chips — deck's lens bar is similar but single-select

### Key Differences from Existing Views

| Aspect | List | Spatial | Deck |
|--------|------|---------|------|
| Layout | Flex column | Absolute positioned | CSS Grid |
| Sort | Date only | UMAP position | Lens-based |
| Navigation | 1D (up/down) | Pan/zoom | 2D grid |
| Filter | Chip toggles | Overlay toggles | Lens single-select |
| Animation | None | None | FLIP on lens change |

### Dependencies

**Internal (existing):**
- `listDocuments()` from `data/documents.ts`
- `Document` type from `types.ts`
- Possibly `createDocumentCard()` from `components/document-card.ts`

**External (none new):**
- CSS Grid (native)
- Web Animations API (native)
- No new npm dependencies needed

### Complexity Hotspots

1. **2D keyboard navigation:** Calculating column count dynamically as viewport resizes

2. **FLIP animation:** Handling cards that enter/exit view (fade vs slide)

3. **Section headers for grouped lenses:** Inserting headers into grid while maintaining correct keyboard navigation order

4. **Responsive column count:** `auto-fill` handles this, but FLIP needs to recalculate on resize

---

## Implementation Plan

### Phase 1: Grid Foundation (~200 lines)

**Files:**
```
loomlib/src/
├── views/deck.ts           # NEW
├── ui/deck.css             # NEW
├── layout/shell.ts         # Modify
├── main.ts                 # Modify (import CSS)
└── types.ts                # Modify (add DeckLens)
```

**Tasks:**
1. Add `DeckLens` type to `types.ts`
2. Create `DeckView` class with basic grid rendering
3. Add deck.css with grid layout
4. Wire into Shell (new container, `showDeck()`, Cmd+Shift+D)
5. Implement basic 2D keyboard navigation

### Phase 2: Lens System (~150 lines)

**Tasks:**
1. Implement `sortByLens()` for all 5 lenses
2. Create lens bar component (5 buttons, active indicator)
3. Wire number keys 1-5 to lens switching
4. Store active lens in view state

### Phase 3: Animation (~100 lines)

**Tasks:**
1. Implement FLIP animation helper
2. Apply FLIP on lens change
3. Handle cards that enter/exit (fade)
4. Test with 112 documents

### Phase 4: Polish (~100 lines)

**Tasks:**
1. Section headers for grouped lenses
2. Type-ahead search filter
3. Lens persistence (localStorage)
4. Focus ring styling
5. Empty state

---

## File Change Summary

| File | Action | Lines Est. |
|------|--------|------------|
| `src/types.ts` | Modify | +10 |
| `src/views/deck.ts` | **Create** | ~350 |
| `src/ui/deck.css` | **Create** | ~200 |
| `src/layout/shell.ts` | Modify | +40 |
| `src/main.ts` | Modify | +1 |

**Total new code:** ~550 lines
**Modification touchpoints:** 3 existing files

---

## Card Component Decision

**Option A: Reuse `createDocumentCard()`**
- Pro: Consistent with list view
- Con: Cards are wide (full-width design), may not fit grid cells

**Option B: New deck-specific card**
- Pro: Optimized for 200px width, 2-line title
- Con: Some duplication

**Recommendation:** Option B — Create `createDeckCard()` optimized for grid cells. The list card has too much horizontal spread (lineage text, connection counts, full timestamp) for a compact grid cell.

### Deck Card Anatomy

```typescript
function createDeckCard(doc: Document): HTMLElement {
  // Compact card for ~200px width
  return `
    <div class="deck-card" data-id="${doc.id}">
      <div class="deck-card__header">
        <span class="deck-card__icon">${getDocumentIcon(doc)}</span>
        <span class="deck-card__title">${doc.title}</span>
      </div>
      <div class="deck-card__footer">
        <span class="deck-card__state">${getExecutionDots(doc)}</span>
        <span class="deck-card__intent">${getIntentIcon(doc)}</span>
        <span class="deck-card__type">${doc.type}</span>
      </div>
    </div>
  `;
}
```

---

## Open Questions

1. **What happens to Cmd+Shift+S (spatial)?**
   - Keep as secondary view for semantic exploration
   - Or deprecate entirely if deck + semantic lens covers the use case

2. **Should deck be the new default view?**
   - Currently list is default
   - Deck might be more useful as browse-all view

3. **How to handle 500+ documents?**
   - CSS Grid should handle it, but may need:
   - Virtual scrolling (defer until needed)
   - Pagination within lens groups

---

## Composition

**Upstream (what informed this survey):**
- [Survey Method](fw-survey-method) — method used
- [Scope: Deck View](inst-scope-deck-view) — requirements

**Downstream (what this survey enables):**
- Implementation of deck view
- Phase-by-phase development

**Related:**
- [Survey: Spatial Canvas Implementation](inst-survey-spatial-canvas-implementation) — alternative approach
- [Scope: List View Aesthetic](inst-scope-list-view-aesthetic) — card design context
