---
id: inst-scope-constellation-aesthetic
title: "Scope: Constellation View Aesthetic"
type: instance
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [scope, ux, constellation, graph, visualization, aesthetic]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-scope-method
    relation: method
  - doc: inst-survey-constellation-view
    relation: prior
downstream: []
---

# Scope: Constellation View Aesthetic

**Date:** 2026-01-08
**Subject:** Visual design and interaction quality of the constellation graph view
**Method:** Scope Method (UX analysis)
**Prerequisite:** survey-constellation-view.md

---

## Audit

### Current UX Flow

1. User enters constellation view → sees focused document at center
2. Related documents arranged spatially by relationship type
3. SVG tethers connect focus to related nodes
4. Hover on any node → preview panel appears
5. Click → change focus, Double-click → open editor
6. Lens indicator (top-left) → click to change view mode
7. Formula bar (top-center) → shows production formula for instances
8. Slot indicators (edges) → paginate when categories overflow

### Key Interactions

| Element | Interaction | Feedback |
|---------|-------------|----------|
| Node card | Hover | Preview panel appears |
| Node card | Click | 250ms delay, then refocuses constellation |
| Node card | Double-click | Opens document in editor |
| Lens indicator | Click | Opens lens picker modal |
| Slot indicator | ‹/› buttons | Scrolls that category's visible set |
| Keyboard `[`/`]` | Press | Scrolls active slot category |
| Keyboard Tab | Press | Cycles active slot category |
| Keyboard ⌘L | Press | Opens lens picker |

### Visual Inventory

- **Background:** Dark void with radial gradient + subtle noise
- **Nodes:** Glassmorphism cards (blur + gradient + border highlight)
- **Tethers:** SVG lines with glow filter on focused connections
- **Focus node:** 1.06x scale, accent border, max-width 240px
- **Context nodes:** 0.95x scale, 85% opacity, max-width 180px
- **Distant nodes:** 0.9x scale, 70% opacity
- **Slot indicators:** Up to 8 pagination controls around edges
- **Preview panel:** Fixed-width (280px) glassmorphism card

---

## Affordances

### What the UI Promises

| Visual Element | Implied Promise |
|----------------|-----------------|
| Spatial layout | Position encodes relationship type |
| Focus node prominence | "This is what you're looking at" |
| Tethers | "These are connected" |
| Depth scaling | "Closer = more relevant" |
| Lens indicator | "You can change the view" |
| Formula bar | "This is how this was made" |
| Slot pagination | "There's more in this direction" |

### Mental Models Invoked

- **Star map / planetarium** — Central object with orbiting relationships
- **Mind map** — Ideas connected by lines
- **File graph** — Dependencies visualized

### What It *Should* Feel Like (but doesn't)

- **Living organism** — Relationships should breathe, not feel static
- **Navigable space** — Should feel like exploring, not clicking menus
- **Contextual insight** — Should reveal patterns, not just enumerate

---

## Expectations

### What Users Would Expect

1. **Smooth transitions** — Changing focus should animate, not jump
2. **Immediate click response** — No 250ms delay
3. **Spatial navigation** — Arrow keys move spatially, not through list
4. **Zoom/pan** — Explore dense graphs without losing overview
5. **Relationship legibility** — Understand connection types at a glance
6. **Progressive disclosure** — Start simple, reveal complexity on demand
7. **Overview mode** — See entire graph before drilling in

### Natural User Flows

- "What's this connected to?" → Expect to see at a glance (works, but cluttered)
- "How was this made?" → Formula bar (works for instances only)
- "What else is like this?" → Lens change (works, but hidden)
- "Show me everything" → No overview mode (gap)
- "Navigate to related" → Click (250ms delay feels broken)

---

## Gaps

| Gap | Type | Description |
|-----|------|-------------|
| **Click delay** | Blocking | 250ms delay on every click to disambiguate double-click |
| **No layout animation** | Friction | Nodes jump to new positions on focus change |
| **8 slot indicators** | Friction | Visual clutter, cognitive overload |
| **No overview mode** | Friction | Can't see entire graph; always focused |
| **No zoom/pan** | Friction | Dense graphs become unusable |
| **Tethers only show for focus** | Friction | Lose context of overall graph structure |
| **Arrow keys navigate list, not space** | Friction | Mental model mismatch |
| **Depth blur disabled** | Polish | Depth vars exist but set to 0 |
| **Color inconsistency** | Polish | Hex in types.ts vs oklch in CSS |
| **Formula bar instances-only** | Polish | Other types get no contextual info |
| **Slot indicator styling** | Polish | rgba backgrounds don't match glassmorphism |
| **Incubating animation disabled** | Polish | CSS exists but not used |
| **No directionality on tethers** | Polish | Can't tell parent from child visually |
| **Uniform node size** | Polish | Only focus node is larger |
| **Preview can occlude** | Polish | Positioning doesn't guarantee visibility |

### Gap Categories

**Blocking (prevents core task):**
- Click delay (fundamental interaction feels broken)

**Friction (hinders flow):**
- No layout animation
- 8 slot indicators creating clutter
- No overview mode
- No zoom/pan
- Tethers only for focus
- Arrow keys navigate wrong mental model

**Polish (works but rough):**
- Depth blur disabled
- Color inconsistency
- Formula bar scope
- Slot indicator styling
- Animation disabled
- No tether directionality
- Uniform node sizing
- Preview occlusion

---

## Requirements

### Must Have (Blocking → Usable)

- [x] **Remove click delay** — Use pointerdown/pointerup pattern or accept first click as focus change immediately
  - *Acceptance: Click on node changes focus with no perceptible delay*

- [x] **Animate layout transitions** — Nodes lerp to new positions on focus change
  - *Acceptance: Focus change produces smooth 200-300ms animation, not instant jump*

### Should Have (Friction → Pleasant)

- [ ] **Consolidate slot indicators** — Either collapse 8→4 categories or show indicators only on hover/need
  - *Acceptance: User doesn't see 8 pagination controls simultaneously*

- [ ] **Add overview mode** — Way to see entire graph (zoom out, mini-map, or different layout)
  - *Acceptance: User can view all documents at once without focus filtering*

- [ ] **Enable spatial keyboard navigation** — Arrow keys navigate to nearest node in that direction
  - *Acceptance: Pressing → selects node to the right of current focus*

- [ ] **Show relationship tethers beyond focus** — At least show parent→child tethers for context nodes
  - *Acceptance: User can see graph structure without hovering each node*

### Could Have (Polish)

- [ ] **Enable depth blur** — Re-enable the depth system blur for distant nodes
- [ ] **Add tether directionality** — Arrowheads or gradient showing parent→child direction
- [ ] **Vary node size by importance** — More children or references = larger node
- [ ] **Unify color system** — Convert TYPE_COLORS to oklch or vice versa
- [ ] **Add zoom/pan** — Scroll to zoom, drag to pan (or dedicated controls)
- [ ] **Contextual info for all types** — Formula bar equivalent for frameworks/sources
- [ ] **Re-enable incubating animation** — Subtle pulse for incubating nodes
- [ ] **Smart preview positioning** — Guarantee preview doesn't occlude focus node

### Out of Scope

- Full force-directed graph physics (too complex for current architecture)
- 3D visualization
- WebGL/Canvas rewrite (keep DOM-based for now)
- AI-powered semantic lens (marked unavailable in config)
- Multi-select operations

---

## Design Direction

### Core Aesthetic to Preserve

The "planetarium control room" aesthetic is strong:
- Dark void background with subtle gradient
- Glassmorphism cards
- Muted OKLCH colors
- Spatial depth encoding

### What Needs to Change

The interaction model, not the visual language:

1. **Responsiveness** — Clicks should feel instant
2. **Animation** — Transitions should feel smooth, not jarring
3. **Simplicity** — Reduce visual clutter (slot indicators)
4. **Legibility** — Graph structure should be scannable
5. **Navigation** — Movement should feel spatial

### Reference Points

- **Obsidian graph view** — Good overview mode, poor detail
- **Roam graph** — Force-directed but chaotic
- **Notion relation graphs** — Clean but too simplified
- **This could be better than all of them** — The semantic categorization is powerful, just needs better UX

---

## Notes

- The 8-category semantic system is architecturally sound; the problem is visual presentation
- Lens system is powerful but undiscoverable — consider making it more prominent
- Formula bar concept is excellent — extend to other document types
- Consider whether "constellation" metaphor should commit harder (stars, orbits, gravity)
- Performance is fine for current scale but no virtualization means eventual ceiling

---

## Implementation Sequence (Suggested)

1. Remove click delay (quick win, major impact)
2. Add layout animation (CSS transitions on transform)
3. Consolidate slot indicators (reduce from 8 → contextual)
4. Spatial keyboard navigation (medium complexity)
5. Tether improvements (directionality, show more)
6. Overview mode (bigger architectural change)
7. Polish items as time permits

---

## Resolution

**Date:** 2026-01-08
**Status:** partial

### What Was Done

Implemented the two **Must Have** requirements from this scope:

1. **Removed click delay** — Replaced timer-based double-click disambiguation with immediate response:
   - Click on unfocused node → focuses immediately (no 250ms wait)
   - Click on already-focused node → opens document
   - Native double-click → also opens document (works on any node)

2. **Added layout transition animations** — Nodes now animate smoothly to new positions:
   - DOM node elements cached between renders (not recreated)
   - Position updates via style changes instead of innerHTML replacement
   - CSS transitions on `left` and `top` properties (300ms ease-out)

### Changes Made

- `loomlib/src/views/constellation.ts`:
  - Removed `clickTimer` and `CLICK_DELAY` properties
  - Added `nodeElements: Map<string, HTMLElement>` for DOM caching
  - Rewrote click handler: immediate focus, click-on-focused opens
  - Added native `dblclick` listener as fallback
  - Modified `renderNodes()` to update existing nodes instead of recreating
  - Modified `refresh()` to clear cache on data reload

- `loomlib/src/ui/constellation.css`:
  - Added `left var(--transition-slow)` and `top var(--transition-slow)` to node transitions

### Outcome

The constellation view now feels responsive:
- Clicks register instantly (no perceptible delay)
- Focus changes animate smoothly (nodes glide to new positions)
- Double-click still works for opening documents

### Remaining Items

**Should Have (not yet addressed):**
- [ ] Consolidate slot indicators (8 → contextual)
- [ ] Add overview mode
- [ ] Spatial keyboard navigation
- [ ] Show tethers beyond focus node

**Could Have (not yet addressed):**
- [ ] Enable depth blur
- [ ] Tether directionality
- [ ] Variable node sizing
- [ ] Unified color system
- [ ] Zoom/pan controls
- [ ] Formula bar for all types
- [ ] Incubating animation
- [ ] Smart preview positioning

These items remain valid requirements for future work.
