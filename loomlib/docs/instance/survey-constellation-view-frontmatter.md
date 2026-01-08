---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-survey-constellation-view-frontmatter
title: "Survey: Constellation View Spatial Layout for Conducting Frontmatter"
type: instance
framework_kind: null
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [survey, constellation-view, frontmatter, spatial, graph, loomlib]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: resolved
upstream:
  - doc: fw-survey-method
    relation: method
  - doc: inst-survey-constellation-view
    relation: prior
  - doc: inst-scope-constellation-aesthetic
    relation: prior
downstream: []
---

# Survey: Constellation View Spatial Layout for Conducting Frontmatter

**Date:** 2026-01-08
**Subject:** How constellation view encodes frontmatter spatially and what conducting fields could improve the layout
**Method:** Survey Method (static analysis)

---

## Survey

Relevant files:
- `src/views/constellation.ts` — Main view class (638 lines)
- `src/data/graph.ts` — Layout computation, categorization (583 lines)
- `src/data/constellation-config.ts` — Slot limits, positions, lens configs (231 lines)
- `src/ui/constellation.css` — All visual styling (678 lines)
- `src/components/formula-bar.ts` — Production formula display (69 lines)
- `src/components/lens-picker.ts` — Lens selection modal (125 lines)
- `src/types.ts` — SemanticCategory, GraphNode, Document interface

---

## Core Sample

### Entry Points

**Constellation instantiation:** `shell.ts`
```typescript
this.constellation = new ConstellationView(constellationContainer, {
  onDocumentSelect: (doc) => this.editor.load(doc.id),
  onDocumentOpen: (doc) => this.showEditor(doc.id),
});
```

**Layout computation:** `constellation.ts:146`
```typescript
private computeLayout(): void {
  this.categorizedDocs = categorizeDocsSemantic(filteredDocs, this.focusedId);
  const visibleDocs = computeVisibleDocsSemantic(this.categorizedDocs, ...);
  const result = computeGraph(allVisible, this.focusedId, width, height);
  this.nodes = result.nodes;
  this.edges = result.edges;
}
```

### Spatial Encoding of Frontmatter

The constellation view **spatially encodes relationships** derived from frontmatter:

| Spatial Position | Frontmatter Field | Relationship |
|------------------|-------------------|--------------|
| Left of focus | `framework_ids` where `framework_kind = 'toolkit'` | Toolkit parent |
| Right of focus | `framework_ids` where `framework_kind = 'domain'` | Domain parent |
| Above focus | `source_id` | Source parent |
| Below focus | `framework_ids` contains focus OR `source_id = focus` | Child |
| Below children | Same `framework_ids` set | Formula sibling |
| Lower-right | Same `output` | Channel sibling |
| Lower-left | Same `perspective` | Perspective sibling |
| Outer ring | No relationship | Distant |

### Current Spatial Layout

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

### Fields Currently Encoded Spatially

| Field | Encoding | Location |
|-------|----------|----------|
| `framework_ids` | Position (left/right based on kind) | toolkitParent, domainParent |
| `source_id` | Position (above) | sourceParent |
| `framework_kind` | Side of focus (left=toolkit, right=domain) | Spatial separation |
| `output` | Position (lower-right) | channelSibling |
| `perspective` | Position (lower-left) | perspectiveSibling |
| `type` | Icon in node card | ⚙/▣/◧/○/◈/☰ |
| `status` | CSS class (`data-status`) | Subtle styling |
| `tags` | Preview panel only | Not encoded in node position |

### Fields NOT Encoded Spatially

| Field | Type | Could encode as |
|-------|------|-----------------|
| `intent` | `research\|build\|capture\|organize\|produce` | Ring/zone, color, icon |
| `execution_state` | `pending\|in_progress\|completed\|resolved` | Glow, opacity, badge |
| `upstream` | `UpstreamRef[]` | Additional tethers with relation type |
| `downstream` | `UpstreamRef[]` | Additional tethers, count indicator |

---

## Stratigraphy

### Categorization Flow

```
categorizeDocsSemantic(docs, focusedId)
  ├── For each doc:
  │   ├── Is toolkit parent? → toolkitParent[]
  │   ├── Is domain parent? → domainParent[]
  │   ├── Is source parent? → sourceParent[]
  │   ├── Is child? → child[]
  │   ├── Is formula sibling? → formulaSibling[]
  │   ├── Is channel sibling? → channelSibling[]
  │   ├── Is perspective sibling? → perspectiveSibling[]
  │   └── Else → distant[]
  └── Sort each by modifiedAt desc
```

### Position Computation

`computePositions()` in `graph.ts:122-240`:

1. Focus at center `(width/2, height/2)`
2. Toolkit parents: left at `centerX - width*0.2`, spreading left
3. Domain parents: right at `centerX + width*0.2`, spreading right
4. Source parents: above at `centerY - height*0.3`
5. Children: below at `centerY + height*0.3`
6. Siblings: ring around focus at 20% radius
7. Distant: outer ring at 40% radius

### Slot System

Adaptive limits based on total doc count:

| Docs | toolkitParent | domainParent | child | distant |
|------|---------------|--------------|-------|---------|
| <20 | 4 | 4 | 6 | 6 |
| 20-50 | 3 | 3 | 4 | 4 |
| >50 | 2 | 2 | 3 | 0 |

Overflow shows pagination: `‹ 1-4 of 12 ›`

### Lens System

10 lens modes filter before categorization:

| Lens | Filter Logic | Use Case |
|------|--------------|----------|
| Default | All | Overview |
| Formula | Parents + formula siblings | Production lineage |
| Production | Children only | What framework produced |
| Lineage | Parents + children | Vertical tree |
| Channel | Same output | Channel clustering |
| Perspective | Same perspective | Perspective clustering |
| Incubating | status = incubating | Work queue |
| Recent | modifiedAt < 7 days | Recent activity |
| Framework | type = framework | Method library |
| Semantic | AI similarity (disabled) | Future feature |

---

## Findings

### Strengths of Current Spatial Encoding

1. **Immediate visual hierarchy** — Parents above, children below, focus center
2. **Type differentiation** — Toolkit vs domain on opposite sides
3. **Relationship clarity** — Tethers show explicit connections
4. **Formula bar** — Shows production recipe for instances
5. **Lens switching** — Multiple focused views available

### Gaps in Conducting Frontmatter Representation

1. **No `intent` encoding** — Can't distinguish research from build documents spatially
2. **No `execution_state` encoding** — Can't see what's in-progress vs completed
3. **`upstream`/`downstream` arrays ignored** — Uses `framework_ids`/`source_id` instead of conducting fields
4. **Relation types invisible** — `informs`, `method`, `source`, `prior` all treated same

### Spatial Opportunities for Conducting Frontmatter

**Option A: Intent as Zone**
```
                    [RESEARCH ZONE - gray/blue]
                         ▲
                         │
   [BUILD ZONE - amber] ←── [FOCUS] ──→ [CAPTURE ZONE - green]
                         │
                         ▼
                    [PRODUCE ZONE - purple]
```

**Option B: Execution State as Glow/Opacity**
| State | Visual |
|-------|--------|
| `pending` | Dim, no glow |
| `in_progress` | Normal, subtle pulse |
| `completed` | Bright, solid |
| `resolved` | Faded, archived look |

**Option C: Upstream/Downstream Tethers with Relation Color**
| Relation | Tether Color |
|----------|--------------|
| `method` | Blue |
| `source` | Green |
| `informs` | Gray |
| `prior` | Dashed |

### Key Files

| File | Role | Frontmatter Used |
|------|------|------------------|
| `src/data/graph.ts` | Categorization logic | framework_ids, source_id, output, perspective, framework_kind |
| `src/data/constellation-config.ts` | Limits, positions | SemanticCategory constants |
| `src/views/constellation.ts` | Rendering | type (icon), status (data-attr) |
| `src/ui/constellation.css` | Visual styling | status (incubating glow disabled) |

### Dependencies

**Internal:**
- `types.ts` — Document, SemanticCategory, GraphNode interfaces
- `documents.ts::listDocuments()` — Data fetching

**External:**
- None (vanilla DOM/SVG)

### Complexity Hotspots

1. **8 semantic categories** — Already complex, adding intent zones would be 5×8=40 combinations
2. **Slot indicator positioning** — 8 hardcoded CSS positions, would need more for new encodings
3. **Full re-render on focus change** — Performance sensitive, adding more encoding may slow down
4. **No animation** — Position changes are instant, adding state transitions could be jarring

---

## Open Questions

1. **Should `execution_state` be visually encoded?** How without cluttering the minimalist aesthetic?
2. **Should `upstream`/`downstream` replace `framework_ids`/`source_id` for tethering?** Migration risk.
3. **Should relation types (`method`, `source`, `informs`) have different tether styles?**
4. **Should `intent` create spatial zones or just visual differentiation (icon/color)?**
5. **Is 8 categories already too many?** Would adding intent/state encoding create cognitive overload?

---

## Decisions

Decisions required before implementation:

| Question | Options | Decision | Rationale |
|----------|---------|----------|-----------|
| Encode execution_state? | Opacity / Glow / Badge / None | **TBD** | Visual clutter vs utility |
| Encode intent? | Zone / Icon / Color / None | **TBD** | May complicate 8-category system |
| Use upstream/downstream? | Replace framework_ids / Supplement / Ignore | **TBD** | Data model migration needed |
| Relation type tethers? | Color / Dash / Label / None | **TBD** | Adds info but complexity |
| Simplify categories? | Keep 8 / Reduce to 4 / Expand | **TBD** | UX testing needed |

### Recommended Changes

**Minimal (low risk):**
1. Add `execution_state` as badge on node card (not spatial)
2. Add `intent` icon next to type icon in node card
3. Color tethers by relation type (from `upstream` array)

**Medium (moderate risk):**
4. Encode `execution_state` via node opacity (pending=0.5, completed=1.0)
5. Add relation type labels on tether hover

**Large (high risk):**
6. Restructure spatial layout around `upstream`/`downstream` arrays instead of `framework_ids`
7. Add intent zones as background regions
8. Animate state transitions

---

## Diagrams

### Current Node Card

```
┌──────────────────────┐
│ ⚙  Etymon Method     │
└──────────────────────┘
```

### Proposed Node Card with Conducting Fields

```
┌──────────────────────┐
│ ⚙ 🔨 Etymon Method   │  ← intent icon (build)
│        ●●●○          │  ← execution_state dots
└──────────────────────┘
```

### Proposed Tether Styling by Relation

```
─────────  method (solid blue)
─ ─ ─ ─ ─  prior (dashed gray)
═════════  source (double green)
···········  informs (dotted)
```

---

## Composition

**Upstream (what informed this survey):**
- [Survey Method](fw-survey-method) — method used
- [Survey: Constellation View Implementation](inst-survey-constellation-view) — prior implementation survey
- [Scope: Constellation View Aesthetic](inst-scope-constellation-aesthetic) — prior scope work

**Downstream (what this survey enables):**
- Implementation decisions for conducting frontmatter visualization
- Spatial refactoring if needed
- Tether styling enhancements

**Related (discovered during survey):**
- `inst-survey-list-view-frontmatter` — list view also needs conducting fields
- `inst-survey-editor-view-frontmatter` — editor needs conducting fields in meta bar
- `fw-conducting-frontmatter` — the schema being visualized

---

## Resolution

**Date:** 2026-01-08
**Status:** resolved

### What Was Done

Implemented findings from this survey as part of the conducting frontmatter UI update:
1. Simplified 8 semantic categories to 4: parent, child, sibling, distant
2. Added colored tethers by relation type (method=blue, source=green, prior=dashed, informs=gray)
3. Added intent icons and execution state dots to node cards
4. Migrated graph computation to use `upstream` array instead of `framework_ids`/`source_id`

### Changes Made

- `loomlib/src/types.ts` — Added simplified SemanticCategory type (4 categories)
- `loomlib/src/data/graph.ts` — Rewrote categorizeDocsSemantic() to use upstream array and return 4 categories; added getTetherColor() for relation-based styling
- `loomlib/src/data/constellation-config.ts` — Updated slot limits for 4 categories
- `loomlib/src/views/constellation.ts` — Updated rendering to use new categories and colored tethers
- `loomlib/src/ui/constellation.css` — Added tether color classes (.tether--method, .tether--source, etc.)

### Outcome

Constellation view now:
- Uses simpler 4-category spatial layout (parent/child/sibling/distant)
- Shows colored tethers that encode relationship types visually
- Computes graph from `upstream` array (conducting frontmatter) instead of legacy fields
- Displays intent icons and execution dots on node cards

### Remaining Items

None - all requirements addressed.
