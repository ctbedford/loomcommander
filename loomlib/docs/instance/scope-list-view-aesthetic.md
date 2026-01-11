---
id: inst-scope-list-view-aesthetic
title: "Scope: List View Aesthetic"
type: instance
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [scope, ux, list-view, aesthetic, design]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-scope-method
    relation: method
downstream: []
---

# Scope: List View Aesthetic

**Date:** 2026-01-08
**Subject:** Visual design and information hierarchy of the document list view
**Method:** Scope Method (UX analysis)

---

## Audit

### Current UX Flow

1. User enters list view → sees search input at top
2. Below search: vertical stack of glassmorphism cards
3. Each card shows: type icon (left) → title + lineage + badge (center) → timestamp (right)
4. Incubating documents pulse with amber glow
5. Keyboard: ↑↓ to navigate, Enter to select, Escape to blur
6. Bottom: dashed "+ New Document" button

### Key Interactions

| Element | Interaction | Feedback |
|---------|-------------|----------|
| Search input | Type query | Cards filter in real-time |
| Card | Hover | Background lightens, subtle shadow |
| Card | Click/Enter | Navigate to editor |
| Card | Arrow keys | Blue border + scroll into view |
| New button | Hover | Border solidifies, text brightens |

### Visual Inventory

- **Cards**: Glassmorphism (blur + gradient + semi-transparent)
- **Type icons**: ⚙/▣ framework, ◧ instance, ○ note, ◈ source, ☰ index
- **Colors**: Muted pastels per type (blue, amber, gray, green, silver)
- **Typography**: System sans-serif, monospace for inputs
- **Spacing**: 16px padding, 8px gap between cards

---

## Affordances

### What the UI Promises

| Visual Element | Implied Promise |
|----------------|-----------------|
| Uniform card stack | All documents are equal peers |
| Type icon + color | Documents have categorical identity |
| Lineage badge (⤴) | Documents have provenance |
| Incubating pulse | Some documents need attention |
| Glassmorphism | Depth, layering, modern aesthetic |
| Dashed new button | "Add here" affordance |

### Mental Models Invoked

- **File browser**: Flat list of items to select
- **Email inbox**: Timestamped items, most recent visible
- **Notes app**: Quick capture and retrieve

### Mental Models *Not* Invoked (but should be)

- **Knowledge graph**: Relationships between documents
- **Production system**: Documents as outputs of frameworks
- **Incubation pipeline**: Documents maturing through stages

---

## Expectations

### What Users Would Expect

1. **Grouping by type or status** — "Show me all my frameworks" shouldn't require search
2. **Visual hierarchy** — Important/active documents should stand out
3. **Relationship visibility** — See production genealogy at a glance
4. **Content preview** — Snippet or abstract to identify documents without clicking
5. **Status progression** — Visual distinction between draft/verified/captured
6. **Faceted filtering** — Filter by type, status, output channel, perspective
7. **Sorting options** — By date, by type, by status, alphabetical

### Natural User Flows

- "What's incubating?" → Scan for amber pulse (works)
- "What frameworks do I have?" → Must search or scroll (friction)
- "What did Etymon Method produce?" → No way to see this in list (gap)
- "What's ready to capture?" → No verified status indicator (gap)

---

## Gaps

| Gap | Type | Description |
|-----|------|-------------|
| **Flat hierarchy** | Friction | All cards have equal visual weight; no grouping or sectioning |
| **No status indicators beyond incubating** | Friction | Draft, verified, captured look identical |
| **Redundant type display** | Polish | Icon AND badge both show type; one is wasted space |
| **No content preview** | Friction | Can't identify documents without clicking into them |
| **Lineage is text-only** | Polish | "⤴ Etymon Method" doesn't leverage the visual system |
| **No connection to constellation** | Friction | List doesn't hint at graph relationships |
| **Timestamp dominates** | Polish | "When modified" matters less than "what produced this" |
| **No filtering UI** | Friction | Must use search for type/status filtering |
| **Uniform card sizing** | Polish | No visual rhythm; long lists become monotonous |
| **New button is generic** | Polish | Doesn't indicate document type being created |

### Gap Categories

**Friction (should fix):**
- Flat hierarchy
- No status indicators
- No content preview
- No connection to constellation
- No filtering UI

**Polish (could fix):**
- Redundant type display
- Lineage is text-only
- Timestamp dominates
- Uniform card sizing
- Generic new button

---

## Requirements

### Must Have (Friction → Blocking UX Goals)

- [ ] **Visual grouping by type** — Section headers or visual clusters for frameworks, instances, notes, sources, indexes
  - *Acceptance: User can visually scan and find all frameworks without searching*

- [ ] **Status indicator system** — Distinct visual treatment for all four statuses
  - *Acceptance: User can identify draft vs verified vs captured at a glance*

- [ ] **Content preview** — First 1-2 lines of content visible on card
  - *Acceptance: User can identify document purpose without opening*

- [ ] **Filter controls** — Type and status filters above list
  - *Acceptance: User can click to show only "frameworks" or only "incubating"*

### Should Have (Friction → Better UX)

- [ ] **Mini lineage visualization** — Small visual showing production formula (toolkit + domain → instance)
  - *Acceptance: User sees at a glance which frameworks produced an instance*

- [ ] **Card hierarchy variants** — Featured/expanded cards for focus documents, compact cards for context
  - *Acceptance: Recently edited or incubating documents have more visual presence*

### Could Have (Polish)

- [ ] **Remove redundant badge** — Let icon carry type; use badge space for status or output channel
- [ ] **Animated transitions** — Cards slide/fade when filtering
- [ ] **Sort controls** — Toggle between date, type, status, alphabetical
- [ ] **Constellation preview on hover** — Show mini graph of document's relationships
- [ ] **Contextual new button** — "New Framework" vs "New Instance" based on current filter

### Out of Scope

- Full drag-and-drop reordering
- Custom card layouts per document
- Inline editing in list view
- Multi-select and bulk actions
- Virtual scrolling (unless performance requires it)

---

## Design Direction

The current aesthetic ("planetarium control room") is strong. The gaps are about **information architecture** within that aesthetic, not changing the visual language.

**Key insight**: The list view treats loomlib as a *file system* when it's actually a *knowledge graph*. The aesthetic upgrade should make relationships and production genealogy visible without leaving the list.

**Implementation approach**: Use `/frontend-design` skill to generate distinctive card variants and grouping UI that maintains the glassmorphism/OKLCH/dark-mode foundation while adding hierarchy and relationship visibility.

---

## Notes

- The constellation view already visualizes relationships — the list view should provide a **complementary** perspective, not duplicate it
- Consider whether "list" is even the right metaphor — could be "feed", "inbox", "queue", or "catalog"
- Status workflow (incubating → draft → verified → captured) is underexposed in the UI; this scope addresses that gap
- Performance: 30+ documents should remain smooth; avoid heavy DOM for each card
