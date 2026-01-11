---
id: inst-survey-spatial-canvas-implementation
title: "Survey: Spatial Canvas Implementation"
type: instance
framework_kind: null
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [survey, spatial, canvas, implementation]

intent: research
execution_state: completed
upstream:
  - doc: fw-survey-method
    relation: method
  - doc: inst-scope-spatial-canvas-list
    relation: prior
  - doc: inst-survey-constellation-view
    relation: prior
downstream: []
---

# Survey: Spatial Canvas Implementation

**Date:** 2025-01-10
**Subject:** Implementation path for spatial canvas list view
**Method:** Survey Method (static analysis)

---

## Survey

### Relevant Files

**Core (must modify):**
- `loomlib/src/views/list.ts` — Current list view, to be replaced/extended
- `loomlib/src/types.ts` — Document interface needs `x`, `y` coords
- `loomlib/scripts/generate-seed.ts` — Build-time processing, add UMAP
- `loomlib/package.json` — Add umap-js dependency

**Shell integration:**
- `loomlib/src/layout/shell.ts` — View switching, may need new view slot
- `loomlib/src/ui/list.css` — Replace with spatial canvas styles

**Data layer (reference):**
- `loomlib/src/data/embeddings.ts` — Voyage AI integration (existing)
- `loomlib/src/data/similarity.ts` — Cosine similarity (existing)
- `loomlib/src/data/db.ts` — IndexedDB, embeddings store (existing)
- `loomlib/src/data/seed-data.ts` — Auto-generated, will include coords

**Pattern reference (don't modify):**
- `loomlib/src/views/constellation.ts` — Existing spatial view pattern
- `loomlib/src/ui/constellation.css` — SVG + positioned nodes pattern
- `loomlib/src/data/graph.ts` — Layout computation pattern

**Components (may extend):**
- `loomlib/src/components/document-card.ts` — Card rendering
- `loomlib/src/components/lens-picker.ts` — Overlay picker pattern

---

## Core Sample

### Entry Points

1. **Build-time:** `npm run dev` → `npm run generate:seed` → `scripts/generate-seed.ts`
   - Reads markdown from `docs/`
   - Validates frontmatter
   - Outputs `src/data/seed-data.ts`
   - **Gap:** No UMAP projection here

2. **Runtime initialization:** `main.ts` → `Shell` constructor → `ListView` constructor
   - Shell creates view containers
   - ListView creates DOM structure (header, filters, list, footer)
   - `init()` calls `listView.refresh()` which fetches documents

3. **Data flow:** `ListView.refresh()` → `listDocuments()` → API/IndexedDB → `renderCardList()`

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│ BUILD TIME                                                               │
│                                                                          │
│ docs/*.md ──parse──→ seed-data.ts ──(missing)──→ coords in seed         │
│                           │                                              │
│ Voyage API ←─────────────(embeddings stored in IndexedDB at runtime)    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ RUNTIME                                                                  │
│                                                                          │
│ seed-data ──→ IndexedDB ──→ listDocuments() ──→ ListView.render()       │
│                                                                          │
│ embeddings ──→ IndexedDB ──→ getAllEmbeddings() ──→ (used by FlowView)  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Abstractions

1. **View pattern:** Each view class has `show()`, `hide()`, `refresh()`, `focus()`, constructor takes container + options
2. **Document type:** Lives in `types.ts`, includes all frontmatter fields
3. **Card rendering:** `document-card.ts` exports `createDocumentCard()` and `renderCardList()`
4. **Layout computation:** `graph.ts` computes positions based on relationships (not embeddings)
5. **SVG + DOM hybrid:** Constellation uses SVG for tethers, absolute-positioned divs for nodes

---

## Stratigraphy

### Call Hierarchy

```
Shell
├── ListView
│   ├── listDocuments() → API → IndexedDB
│   ├── renderCardList() → createDocumentCard()
│   └── applyFilters() → render()
│
├── ConstellationView
│   ├── listDocuments()
│   ├── computeGraph() → graph.ts
│   ├── renderTethers() → SVG manipulation
│   └── renderNodes() → DOM creation/update
│
├── FlowView
│   ├── listDocuments()
│   ├── getAllEmbeddings() → db.ts
│   ├── findMostSimilar() → similarity.ts
│   └── render() → DOM zones
│
└── Editor
    └── load() / save()
```

### State Location

| State | Location | Notes |
|-------|----------|-------|
| Documents | IndexedDB (`documents` store) | Source of truth |
| Embeddings | IndexedDB (`embeddings` store) | 1024-dim vectors from Voyage |
| Current view | `Shell.currentView` | `'list' | 'constellation' | 'flow' | 'editor'` |
| Focused doc | Per-view (e.g., `focusedId`) | Not shared across views |
| Filter state | `ListView.activeStateFilters`, `activeIntentFilters` | Sets |
| Lens state | `ConstellationView.activeLens` | LensId |

### Boundary Conditions

- **No server in production:** Build compiles to static files, IndexedDB is client-only
- **Embeddings require API key:** Stored in localStorage, optional feature
- **No 2D coords currently:** Embeddings exist but no UMAP projection
- **Card size fixed:** Cards don't adapt to zoom level
- **No pan/zoom:** List scrolls vertically, no 2D navigation

---

## Findings

The loomlib codebase has a clean separation: Shell manages view switching, views handle their own rendering, data layer provides IndexedDB access. The **ConstellationView** already implements a spatial layout pattern (SVG tethers + positioned DOM nodes), but positions are computed from relationship semantics (parent/child/sibling), not from embedding similarity.

**Key insight:** FlowView already fetches embeddings and uses `findMostSimilar()` for semantic siblings. The missing piece is **UMAP projection** to convert 1024-dim embeddings → 2D coordinates.

**Implementation strategy:** Create a new `SpatialView` that:
1. Uses UMAP-projected coordinates for document positions
2. Borrows the SVG + positioned-node pattern from ConstellationView
3. Adds overlay system for toggling rendering modes
4. Implements pan/zoom via d3-zoom or CSS transforms

### Key Files

| File | Role | Change Required |
|------|------|-----------------|
| `types.ts` | Document interface | Add `umap_x?: number`, `umap_y?: number` |
| `generate-seed.ts` | Build-time processing | Add UMAP computation |
| `package.json` | Dependencies | Add `umap-js` |
| `views/spatial.ts` | **NEW** | Spatial canvas view |
| `ui/spatial.css` | **NEW** | Styles for spatial view |
| `shell.ts` | View management | Add spatial view slot |
| `components/overlay-picker.ts` | **NEW** | Overlay toggle UI |

### Dependencies

**Internal:**
- `data/documents.ts` — `listDocuments()`
- `data/db.ts` — `getAllEmbeddings()`
- `data/similarity.ts` — May extend for UMAP
- `types.ts` — Document interface

**External (new):**
- `umap-js` — UMAP implementation for JS/TS
- Optionally: `d3-zoom` for pan/zoom (or custom)

### Complexity Hotspots

1. **Build-time embedding fetch:** UMAP needs all embeddings at build time, but embeddings are fetched at runtime from Voyage API. **Decision required.**

2. **Pan/zoom performance:** With 100+ documents, DOM-based positioning may lag. May need canvas or WebGL for large graphs.

3. **Overlay compositing:** Multiple overlays (type color + state pulse + recency fade) need clean compositing.

4. **Coordinate persistence:** If user drags documents, need to store custom positions.

---

## Open Questions

1. **Where do embeddings come from at build time?**
   - Option A: Pre-compute embeddings and store in markdown frontmatter
   - Option B: Fetch at build time (requires API key in CI)
   - Option C: Compute UMAP at runtime (first load only, cache in IndexedDB)

2. **Replace list view or add new view?**
   - Replace: Simpler shell, spatial becomes default list
   - Add: Keep traditional list, spatial is opt-in (Cmd+Shift+S)

3. **Canvas vs DOM for nodes?**
   - DOM: Easier text rendering, existing card component
   - Canvas/WebGL: Better performance for 500+ nodes

4. **Overlay architecture?**
   - CSS classes toggle (`.overlay-type`, `.overlay-state`)
   - Or full re-render per overlay

---

## Decisions

Decisions required before implementation:

| Question | Options | Decision | Rationale |
|----------|---------|----------|-----------|
| Embedding source at build time | A: frontmatter / B: build-time fetch / **C: runtime UMAP** | **C** | Embeddings already runtime-fetched; UMAP can cache result in IndexedDB after first computation |
| View architecture | A: replace list / **B: add spatial view** | **B** | Traditional list still useful for quick scan; spatial is exploratory mode |
| Rendering tech | **A: DOM** / B: Canvas | **A** | <200 docs, DOM is fine; reuse card component; defer canvas optimization |
| Overlay system | **A: CSS class toggle** / B: re-render | **A** | Performance; overlays are visual modifiers, not structural changes |

### Implementation Constraints (from decisions)

1. **Runtime UMAP:** Add `umap-js` as runtime dependency, compute on first `SpatialView.show()`, cache `{docId, x, y}` in IndexedDB
2. **New view slot:** Shell gets `spatialView` alongside existing views, toggled via Cmd+Shift+S
3. **DOM-based nodes:** Extend ConstellationView pattern, absolute-positioned cards
4. **CSS overlay classes:** `.spatial-node--overlay-type`, `.spatial-node--overlay-state`, etc.

---

## Implementation Plan

### Phase 1: Infrastructure

**Files to create/modify:**

```
loomlib/
├── package.json              # Add umap-js
├── src/
│   ├── types.ts              # Add UmapCoord interface, optional coords on Document
│   ├── data/
│   │   ├── umap.ts           # NEW: UMAP computation + IndexedDB cache
│   │   └── db.ts             # Add umap coords store
│   └── ...
```

**Tasks:**
1. `npm install umap-js`
2. Add `UmapCoordsStore` to IndexedDB (version 3)
3. Create `data/umap.ts`:
   - `computeUmapCoords(embeddings: Map<string, number[]>): Promise<Map<string, {x, y}>>`
   - `getCachedUmapCoords()`: Load from IndexedDB
   - `cacheUmapCoords()`: Save to IndexedDB
   - `isUmapStale(embeddingHashes)`: Check if recomputation needed

### Phase 2: Spatial View Core

**Files to create:**

```
loomlib/src/
├── views/
│   └── spatial.ts            # NEW: SpatialView class
├── ui/
│   └── spatial.css           # NEW: Spatial canvas styles
```

**SpatialView structure:**
```typescript
class SpatialView {
  // State
  private docs: Document[]
  private coords: Map<string, {x, y}>
  private viewport: {x, y, zoom}
  private activeOverlays: Set<OverlayId>

  // Lifecycle
  async refresh(): Promise<void>  // Fetch docs + embeddings + UMAP
  show(): void
  hide(): void
  focus(): void

  // Rendering
  private renderNodes(): void      // Positioned cards
  private applyOverlays(): void    // CSS class manipulation

  // Interaction
  private handlePan(dx, dy): void
  private handleZoom(scale): void
  private handleNodeClick(id): void
}
```

**Tasks:**
1. Create `SpatialView` class following ConstellationView pattern
2. Implement viewport state (pan/zoom via CSS transform on container)
3. Render nodes at UMAP-derived positions
4. Add to Shell view cycle

### Phase 3: Overlay System

**Files to create/modify:**

```
loomlib/src/
├── components/
│   └── overlay-picker.ts     # NEW: Overlay selection UI
├── ui/
│   └── spatial.css           # Overlay-specific styles
```

**Overlays:**
| ID | CSS class | Effect |
|----|-----------|--------|
| `type` | `.spatial-node--type-{type}` | Background color by document type |
| `state` | `.spatial-node--state-{state}` | Border/glow by execution state |
| `intent` | `.spatial-node--intent-{intent}` | Icon tint by intent |
| `recency` | `.spatial-node--recency-{bucket}` | Opacity by age |
| `lineage` | (special) | Show/hide tether lines |

**Tasks:**
1. Create `OverlayPicker` component (based on LensPicker pattern)
2. Add overlay CSS rules to `spatial.css`
3. Bind number keys 1-5 to overlay toggles
4. Implement overlay compositing (multiple overlays active)

### Phase 4: Polish

**Tasks:**
1. Semantic zoom (cluster labels when zoomed out, cards when zoomed in)
2. Minimap for navigation
3. Custom position persistence (drag override)
4. Keyboard navigation (arrow keys move between neighbors)
5. Search highlight (matching docs glow)

---

## File Change Summary

| File | Action | Lines Est. |
|------|--------|------------|
| `package.json` | Modify | +1 |
| `src/types.ts` | Modify | +10 |
| `src/data/db.ts` | Modify | +50 |
| `src/data/umap.ts` | **Create** | ~150 |
| `src/views/spatial.ts` | **Create** | ~400 |
| `src/ui/spatial.css` | **Create** | ~300 |
| `src/components/overlay-picker.ts` | **Create** | ~150 |
| `src/layout/shell.ts` | Modify | +30 |

**Total new code:** ~1,100 lines
**Modification touchpoints:** 4 existing files

---

## Composition

**Upstream (what informed this survey):**
- [Survey Method](fw-survey-method) — method used
- [Scope: Spatial Canvas List View](inst-scope-spatial-canvas-list) — requirements
- [Survey: Constellation View Implementation](inst-survey-constellation-view) — pattern reference

**Downstream (what this survey enables):**
- Implementation of spatial canvas view
- Phase-by-phase development tickets

**Related (discovered but not upstream):**
- `inst-scope-constellation-aesthetic` — visual design reference
- `inst-scope-list-view-aesthetic` — list design context
