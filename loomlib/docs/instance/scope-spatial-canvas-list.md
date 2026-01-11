---
id: inst-scope-spatial-canvas-list
title: "Scope: Spatial Canvas List View"
type: instance
framework_kind: null
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [ux, list-view, spatial, embeddings]

intent: research
execution_state: completed
upstream:
  - doc: fw-scope-method
    relation: method
downstream: []
---

# Scope: Spatial Canvas List View

## Context

The current list view (shown in `image copy.png`) displays loomlib entries as a vertical card stack with:
- Search bar at top
- Filter chips (execution state dots, intent icons)
- Cards showing: title, upstream frameworks, type badge, state dots, connection counts, recency

This is functional but fundamentally **1-dimensional** — documents only relate via position in a sorted list. The embedding vectors and relationship categorizations in your data model (8 semantic categories, upstream/downstream, similarity scores) are invisible.

---

## Audit: What the Current UI Lacks

**Lost Information:**
1. **Semantic clustering** — Documents with high cosine similarity aren't visually grouped
2. **Relationship topology** — Parent/child/sibling links only visible in Flow View
3. **Temporal landscape** — Modified dates compress to "2h ago" badges
4. **Density perception** — Can't see where knowledge is dense vs. sparse
5. **State patterns** — Hard to spot clusters of `in_progress` vs `completed`
6. **Formula families** — Documents sharing the same upstream aren't visually connected

**ONI/Papers Please Inspiration Gap:**
- ONI's overlay system (O2, power, pipes, temperature) — we have semantic categories but no overlay toggle
- ONI's grid density — we scroll instead of surveying
- Papers Please's document comparison workspace — we have focus+context but not side-by-side
- Papers Please's information extraction rhythm — drag documents, compare fields

---

## Affordance Analysis

### What the Data Model Enables

Your data model has **5 independent axes** for spatial mapping:

| Axis | Field(s) | Visualization Potential |
|------|----------|------------------------|
| **Semantic similarity** | embedding vectors (1024-dim) → UMAP to 2D | X/Y position on canvas |
| **Genealogy depth** | upstream chain length | Y-axis (production tree depth) |
| **Temporal** | `createdAt`, `modifiedAt` | Color saturation, timeline band |
| **Type/Intent** | `type`, `intent`, `execution_state` | Shape, color, glow |
| **Channel/Perspective** | `output`, `perspective` | Swimlane grouping |

### Semantic Similarity → 2D Position

You already have:
- `getEmbedding()` / `getEmbeddingsBatch()` from Voyage AI
- `cosineSimilarity()` for pairwise comparison
- `findMostSimilar()` for k-NN queries

**Missing:** Dimensionality reduction to map 1024-dim embeddings → 2D coordinates.

Options:
1. **UMAP via WebAssembly** — `umap-js` library, runs client-side
2. **t-SNE** — More local structure preservation, slower
3. **PCA** — Fast but loses non-linear structure
4. **Server-side precompute** — Generate 2D coords at build time

Recommendation: **UMAP-js at build time** (in `vite-plugin-docs-api.ts`), store `x`, `y` in seed data. This gives semantic positioning without runtime cost.

---

## UX Patterns Research

### 1. Semantic Canvas (Heptabase/Scrintal Model)

**Pattern:** Infinite canvas where documents cluster by meaning, not folder.

**Adaptation for Loomlib:**
```
┌─────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────────┐  │
│  │              SEMANTIC CANVAS                           │  │
│  │                                                        │  │
│  │     ○ note-X          ◧ survey-A                      │  │
│  │                   ◧ excavate-B                        │  │
│  │  ⚙ fw-method                                          │  │
│  │                       ◧ credo-ethics                  │  │
│  │      ◈ src-aristotle                                  │  │
│  │                                                        │  │
│  │             ◧ credo-economics   ◧ credo-politics      │  │
│  │                                                        │  │
│  │     ▣ fw-domain                                       │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│  [Semantic] [Timeline] [Genealogy] [Grid]  ← View modes     │
└─────────────────────────────────────────────────────────────┘
```

**Key features:**
- UMAP-derived positions place similar docs nearby
- Zoom in/out to see cluster density
- Drag to pan (no focus required)
- Click node → open, Cmd+click → add to selection

### 2. ONI Overlay System

**Pattern:** Same spatial layout, different data layer rendered.

**Adaptation for Loomlib:**
```
Overlays (toggle with number keys):
[1] Type        — color by framework/instance/source/note/index
[2] State       — pulse by pending/in_progress/completed/resolved
[3] Intent      — hue by research/build/capture/organize/produce
[4] Recency     — opacity by modifiedAt (faded = old)
[5] Density     — background heatmap by semantic clustering
[6] Lineage     — show upstream/downstream edges
```

This lets the same canvas answer different questions:
- "Where's my incubating work?" → State overlay
- "What's research vs. production?" → Intent overlay
- "What's gotten stale?" → Recency overlay

### 3. Zoomable Treemap (Hierarchical Nesting)

**Pattern:** Nested rectangles sized by child count or importance.

**Adaptation for Loomlib:**
```
┌──────────────────────────────────────────────────────────┐
│ ┌─────────────────────────┬─────────────────────────────┐│
│ │      FRAMEWORKS         │          INSTANCES          ││
│ │ ┌─────────┬───────────┐ │ ┌─────────────────────────┐ ││
│ │ │ Toolkit │  Domain   │ │ │   survey   │   scope    │ ││
│ │ │ ┌─────┐ │ ┌───────┐ │ │ │ ┌───────┐  │ ┌───────┐  │ ││
│ │ │ │fw-X │ │ │ fw-Y  │ │ │ │ │inst-A │  │ │inst-B │  │ ││
│ │ │ └─────┘ │ └───────┘ │ │ │ └───────┘  │ └───────┘  │ ││
│ │ └─────────┴───────────┘ │ │ excavate   │  recon     │ ││
│ └─────────────────────────┴─────────────────────────────┘│
│ ┌────────────────────────────────────────────────────────┐│
│ │              SOURCES                 NOTES             ││
│ └────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

**Key features:**
- Click to zoom into a section
- Rectangle area = doc count or word count
- Hierarchy: type → subtype → perspective → individual

**Pro:** Great for surveying where content mass lives
**Con:** Loses semantic similarity information

### 4. Timeline + Swimlanes (Temporal-Categorical)

**Pattern:** X-axis = time, Y-axis = category (type or channel).

**Adaptation for Loomlib:**
```
                    Jan 2025          Feb 2025          Mar 2025
                    ────────────────────────────────────────────→
FRAMEWORKS     ⚙────⚙─────────⚙──────────────────────────────⚙──
INSTANCES      ◧──◧───◧──◧─◧───◧──◧──◧──◧──────◧───◧──◧──◧──◧──
SOURCES        ◈────────◈──────────◈─────────────────────────◈──
NOTES          ○─○──○────────○──────────────────○────────────○──
```

**Key features:**
- See production rhythm over time
- Identify periods of high/low activity
- Swimlanes by type, perspective, or output channel
- Vertical markers for significant commits/exports

### 5. Papers Please Workspace (Comparison Mode)

**Pattern:** Split view for side-by-side document inspection.

**Adaptation for Loomlib:**
```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────┬─────────────────────────────────┐
│ │       DOCUMENT A        │         DOCUMENT B              │
│ │                         │                                 │
│ │  Title: Credo Ethics    │  Title: Credo Economics         │
│ │  Type: instance         │  Type: instance                 │
│ │  Status: verified       │  Status: draft                  │
│ │  Frameworks:            │  Frameworks:                    │
│ │    - fw-worldview ✓     │    - fw-worldview ✓             │
│ │    - fw-oikonomia ✗     │    - fw-oikonomia ✓             │
│ │  Perspective:           │  Perspective:                   │
│ │    philosophical-gen ✓  │    economic-gen ✗               │
│ │                         │                                 │
│ │  [Content preview...]   │  [Content preview...]           │
│ └─────────────────────────┴─────────────────────────────────┘
│ RACK: [doc1] [doc2] [doc3] [doc4] ← drag docs here          │
└─────────────────────────────────────────────────────────────┘
```

**Key features:**
- Highlight matching/mismatching fields (✓/✗)
- Rack at bottom holds documents for quick comparison
- Useful before synthesis or contradiction analysis

---

## Expectations from User Perspective

### What a "Better List" Should Answer

1. **"What's nearby?"** — See documents semantically similar to current focus
2. **"What's aging out?"** — Spot stale work visually (temporal fade)
3. **"Where's the density?"** — See which topic clusters are rich vs. sparse
4. **"What's my pipeline?"** — See pending → in_progress → completed flow
5. **"What produced what?"** — See genealogy without switching views

### Interaction Model

**Desktop metaphor:** Your desk, covered in papers you can shuffle and arrange.

| Action | Result |
|--------|--------|
| Scroll/Pan | Move viewport over semantic canvas |
| Pinch/Zoom | Adjust detail level (zoomed out = clusters, zoomed in = cards) |
| Click doc | Select (show preview) |
| Double-click | Open in editor |
| Drag doc | Move to custom position (override UMAP) |
| Cmd+click | Multi-select |
| 1-6 keys | Toggle overlays |
| Tab | Cycle lens focus |

---

## Gap Analysis

### What's Missing to Implement

| Gap | Current State | Required |
|-----|---------------|----------|
| 2D coordinates | Only semantic similarity scores | UMAP projection at build time |
| Canvas rendering | DOM-based card list | Canvas/WebGL or SVG for pan/zoom |
| Overlay system | Single-mode views | Layer toggle infrastructure |
| Zoom levels | Fixed card size | Semantic zoom (LOD) |
| Custom positions | None | IndexedDB storage for user adjustments |
| Comparison mode | None | Split-pane component |

### Technical Path

1. **Phase 1: Semantic positioning**
   - Add `umap-js` dependency
   - Compute 2D coords in `vite-plugin-docs-api.ts`
   - Store `x`, `y` in document data

2. **Phase 2: Canvas view**
   - Replace list container with `<canvas>` or SVG
   - Implement pan/zoom with d3-zoom or custom
   - Render documents at UMAP-derived positions

3. **Phase 3: Overlays**
   - Add overlay toggle state
   - Implement rendering modes (type color, state pulse, etc.)
   - Keyboard shortcuts for overlay switching

4. **Phase 4: Polish**
   - Semantic zoom (cluster labels at far zoom, cards at near)
   - Custom position persistence
   - Comparison mode

---

## Recommendation

**Primary view: Semantic Canvas with ONI-style overlays**

This preserves your embedding investment, makes semantic siblings visible, and gives ONI's "same space, different information layer" pattern.

**Secondary feature: Papers Please comparison rack**

For synthesis/contradict workflows, the ability to "pull documents aside" into a comparison workspace.

**Defer:** Treemap and timeline views — these are useful but orthogonal; they don't leverage your embeddings, which is your distinctive data asset.

---

## Sources

- [Scrintal infinite canvas approach](https://scrintal.com/comparisons/obsidian-alternatives-with-robust-graph-features)
- [UMAP for layout](https://umap-learn.readthedocs.io/en/latest/interactive_viz.html)
- [Building embedding visualizations](https://cprimozic.net/blog/building-embedding-visualizations-from-user-profiles/)
- [D3 zoomable treemap](https://observablehq.com/@d3/zoomable-treemap)
- [Papers Please mobile port UX adaptations](https://dukope.com/devlogs/papers-please/mobile/)
- [Neobrutalism design patterns](https://www.nngroup.com/articles/neobrutalism/)
- [ONI overlay system](https://guides.gamepressure.com/oxygen_not_included/guide.asp?ID=40188)
