---
id: inst-survey-constellation-view
title: "Survey: Constellation View Implementation"
type: instance
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [survey, constellation, graph, visualization]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-survey-method
    relation: method
downstream: []
---

# Survey: Constellation View Implementation

**Date:** 2026-01-08
**Subject:** Spatial knowledge graph visualization in loomlib
**Method:** Survey Method (codebase investigation)

---

## Core Sample

### File Inventory

| File | LOC | Purpose |
|------|-----|---------|
| `src/views/constellation.ts` | 615 | Main view class, rendering, event handling |
| `src/ui/constellation.css` | 676 | All visual styling including overlays |
| `src/data/graph.ts` | 583 | Layout computation, categorization, positioning |
| `src/data/constellation-config.ts` | 231 | Slot limits, positions, lens configs |
| `src/components/formula-bar.ts` | 69 | Production formula display |
| `src/components/lens-picker.ts` | 125 | Lens selection modal |

**Total:** ~2,300 lines dedicated to constellation view

### Entry Points

```
ConstellationView.show()
  → refresh()
    → listDocuments()           // fetch all docs
    → computeLayout()           // categorize + position
      → categorizeDocsSemantic()   // 8 categories
      → computeVisibleDocsSemantic()  // apply pagination
      → computeGraph()             // nodes + edges
    → render()
      → renderTethers()    // SVG lines
      → renderNodes()      // DOM cards
      → renderSlotIndicators()  // pagination controls
```

---

## Stratigraphy

### Layer 1: Semantic Categorization (8 types)

Documents around the focused node are categorized into:

| Category | Relationship | Spatial Position |
|----------|--------------|------------------|
| `toolkitParent` | Focus uses this toolkit | Left (180°) |
| `domainParent` | Focus uses this domain | Right (0°) |
| `sourceParent` | Focus references this source | Top (270°) |
| `child` | This doc uses focus as framework/source | Bottom (90°) |
| `formulaSibling` | Same framework_ids set | Below children |
| `channelSibling` | Same output channel | Lower-right |
| `perspectiveSibling` | Same perspective | Lower-left |
| `distant` | No direct relationship | Outer ring |

### Layer 2: Slot System (Pagination)

Each category has configurable limits based on total doc count:

```typescript
// <20 docs: generous limits
{ toolkitParent: 4, domainParent: 4, child: 6, distant: 6, ... }

// 20-50 docs: moderate limits
{ toolkitParent: 3, domainParent: 3, child: 4, distant: 4, ... }

// >50 docs: tight limits
{ toolkitParent: 2, domainParent: 2, child: 3, distant: 0, ... }
```

Overflow shows pagination indicators with `‹ 1-4 of 12 ›` controls.

### Layer 3: Lens System (10 modes)

| Lens | Filter Logic | Available |
|------|--------------|-----------|
| Default | All relationships | ✓ |
| Formula | Production lineage only | ✓ |
| Production | What this framework produced | ✓ |
| Lineage | Parents and children | ✓ |
| Channel | Same output channel | ✓ |
| Perspective | Same perspective cluster | ✓ |
| Incubating | status = incubating | ✓ |
| Recent | Modified in last 7 days | ✓ |
| Framework | type = framework | ✓ |
| Semantic | AI-inferred similarity | ✗ (planned) |

### Layer 4: Depth System (3 layers)

| Layer | CSS Treatment |
|-------|--------------|
| `focus` | scale(1.06), opacity 1, max-width 240px, accent border |
| `context` | scale(0.95), opacity 0.85 |
| `distant` | scale(0.9), opacity 0.7 |

**Note:** Blur variables exist (`--depth-focus-blur`, etc.) but all set to 0.

### Layer 5: Visual Components

**Node Cards:**
- Glassmorphism background
- Type icon (colored) + title
- Position via absolute CSS transform
- Click: focus, Double-click: open editor
- Hover: show preview panel

**Tethers (SVG):**
- Only rendered when connected to focused node
- Focused tethers get glow filter + thicker stroke
- Draw-in animation via stroke-dasharray

**Formula Bar:**
- Only shows for instances
- Format: `◧ TITLE = ⚙ Toolkit + ▣ Domain + ◈ Source`
- Positioned at top center

**Preview Panel:**
- Shows on hover (any node)
- Icon, title, type/status, tags, content snippet
- Smart positioning to avoid edges

**Slot Indicators:**
- Fixed positions per category
- Show only when overflow exists
- Tab cycles active slot, `[` `]` scrolls

---

## Findings

### Architectural Patterns

1. **Everything recomputes on focus change** — `setFocus()` → `computeLayout()` → `render()` does full rebuild
2. **No animation between states** — Nodes jump to new positions instantly
3. **Click/double-click disambiguation** — 250ms timer delay on all clicks
4. **Event delegation absent** — Each node gets individual listeners
5. **Canvas is just DOM positioning** — Not actually canvas/webgl, uses absolute positioning

### Complexity Hotspots

1. **8 semantic categories** — Cognitive load for users, visual clutter for UI
2. **Slot indicator positioning** — 8 hardcoded CSS position rules
3. **Layout algorithm** — Purely mathematical, no physics or force-direction
4. **Lens × Category interaction** — Lens filters docs, then categories partition remainder

### Dormant/Incomplete Features

1. **Blur depth disabled** — All `--depth-*-blur` = 0
2. **Semantic lens** — Marked `available: false`
3. **Incubating animation** — CSS exists but commented "disabled for cleaner visual"
4. **Noise texture** — 2.5% opacity, barely visible

### Inconsistencies

1. **Color definitions** — `TYPE_COLORS` uses hex (`#7BA3C9`), CSS uses oklch
2. **Slot positions** — Config uses angle/distance, but `computePositions()` uses different algorithm
3. **Preview vs Formula Bar** — Preview shows for all, Formula Bar only for instances

### Performance Characteristics

- Full re-render on any focus change
- SVG recreation (innerHTML = '') on each render
- No virtualization
- No caching of categorization results

---

## Dependencies

### Internal

- `types.ts` — Document interface, enums, type guards
- `documents.ts` — `listDocuments()` for data fetching
- `time.ts` — `relativeTime()` (used in preview)

### External

- None (vanilla DOM/SVG)

---

## Questions Raised

1. **Why are all depth blurs disabled?** Was this a performance decision or visual preference?
2. **Why does the slot position config exist if computePositions() doesn't use it?** Legacy code or planned refactor?
3. **Should lens and category be independent axes?** Currently lens filters first, then categories subdivide.
4. **Is 8 categories too many?** Could toolkit/domain collapse to "parent"?
5. **Why no animation?** Is instant layout change intentional or missing feature?

---

## Diagrams

### Spatial Layout (Default Lens)

```
                    [sourceParent]
                         ▲
                         │
   [toolkitParent] ←── [FOCUS] ──→ [domainParent]
                         │
                         ▼
                      [child]
                         │
                         ▼
                  [formulaSibling]
                    /         \
[perspectiveSibling]         [channelSibling]
                    \         /
                     [distant]
```

### Component Hierarchy

```
ConstellationView
├── svg.constellation-tethers
│   └── line.tether (×n)
├── div.constellation-canvas
│   ├── div.constellation-node (×n)
│   └── div.constellation-slot-indicator (×8 max)
├── div.constellation-preview
├── div.formula-bar
├── div.constellation-lens-indicator
└── div.constellation-lens-picker (LensPicker component)
```
