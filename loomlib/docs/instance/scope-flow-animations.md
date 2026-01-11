---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-scope-flow-animations
title: "Scope: Flow View Animations"
type: instance
framework_kind: null
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [scope, flow-view, animations, microinteractions, ux]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-scope-method
    relation: method
  - doc: inst-scope-constellation-redesign
    relation: prior
downstream: []
---

# Scope: Flow View Animations

**Date:** 2026-01-08
**Subject:** Animation requirements for the flow view
**Method:** Scope Method (UX analysis)
**Prerequisite:** scope-constellation-redesign.md

---

## Audit

### Current State

The flow view has **no animations**:
- Nodes appear instantly on render
- Focus changes cause full re-render with no transition
- No feedback on hover beyond CSS `:hover` states
- No indication of loading or data changes

### What Exists (CSS Variables)

From `styles.css`:
```css
--transition-fast: 150ms ease-out;
--transition-normal: 200ms ease-out;
--transition-slow: 300ms ease-out;
```

These are defined but underutilized in the flow view.

---

## Affordances

### What Animations Should Communicate

| Animation | Message |
|-----------|---------|
| Entrance stagger | "These items are distinct but related" |
| Focus transition | "You're moving through a connected space" |
| Hover feedback | "This is interactive" |
| Loading state | "Data is being fetched" |
| State change | "Something just happened" |

### Mental Models

- **Spatial continuity** — When focus changes, nodes should animate to new positions, not teleport
- **Cause and effect** — User action should have visible, immediate response
- **Hierarchy through timing** — More important elements animate first or more prominently

---

## Expectations

### What Users Expect

1. **Immediate feedback** — Click/hover should respond within 100ms
2. **Smooth transitions** — No jarring jumps or flashes
3. **Staggered entrances** — List items should cascade in, not pop simultaneously
4. **Consistent timing** — Similar actions should have similar animation durations
5. **Interruptible** — New actions should override in-progress animations gracefully

### Natural Flows

| Action | Expected Animation |
|--------|-------------------|
| View loads | Nodes fade/slide in with stagger |
| Click node to focus | Old nodes fade out, new layout fades in |
| Hover node | Subtle lift or glow |
| Click focused node to open | Expand or zoom transition to editor |
| Data updates | Changed nodes pulse or highlight |

---

## Gaps

| Gap | Type | Description |
|-----|------|-------------|
| **No entrance animation** | Friction | Nodes appear instantly, feels static |
| **No focus transition** | Friction | Re-render on focus change is jarring |
| **No hover microinteraction** | Polish | Hover state exists but no motion |
| **No loading indication** | Polish | No feedback during data fetch |
| **No stagger** | Polish | All nodes appear simultaneously |

---

## Requirements

### Must Have

#### 1. Entrance Animation (Staggered Fade + Slide)
When the flow view renders, nodes should animate in with stagger:

```
Zone appears → Nodes fade in one by one (50ms delay each)
```

**Spec:**
- Duration: 200ms per node
- Easing: `ease-out`
- Stagger delay: 50ms between nodes
- Transform: `translateY(8px) → translateY(0)`
- Opacity: `0 → 1`

**Acceptance:** When flow view loads, nodes cascade in from top to bottom with visible stagger effect.

---

#### 2. Focus Transition Animation
When user clicks a node to change focus:

```
Current layout → Cross-fade → New layout
```

**Spec:**
- Duration: 250ms
- Old nodes: fade out + scale down slightly (0.98)
- New nodes: fade in + scale up from 0.98
- Focus node: stays prominent, transitions position smoothly
- Use `will-change: transform, opacity` for GPU acceleration

**Acceptance:** Clicking a node produces smooth transition, not instant re-render.

---

### Should Have

#### 3. Hover Microinteraction
Nodes should respond to hover with subtle motion:

**Spec:**
- Duration: 150ms
- Transform: `translateY(-2px)` (slight lift)
- Box-shadow: subtle increase
- Easing: `ease-out`

**Acceptance:** Hovering a node produces immediate, subtle lift effect.

---

#### 4. Arrow/Connector Animation
The flow arrows should draw in on render:

**Spec:**
- Duration: 300ms
- Use `stroke-dasharray` + `stroke-dashoffset` animation
- Delay until after nodes are visible

**Acceptance:** Arrows draw from upstream to downstream after nodes appear.

---

#### 5. Execution State Animations

| State | Animation |
|-------|-----------|
| `pending` | Subtle opacity pulse (0.5 → 0.7 → 0.5), 3s cycle |
| `in_progress` | Border glow pulse, 2s cycle |
| `completed` | None (static) |
| `resolved` | None (static, faded) |

**Acceptance:** Pending and in-progress nodes have subtle ambient animation indicating their state.

---

### Could Have

#### 6. Downstream Reveal Animation
When focusing a node that has downstream documents not previously visible:

**Spec:**
- New downstream nodes slide in from below
- Duration: 200ms
- Stagger: 30ms

**Acceptance:** Navigating to a node with downstream produces "reveal" effect.

---

#### 7. Sidebar Collapse/Expand
Siblings sidebar should animate when expanding or collapsing:

**Spec:**
- Duration: 200ms
- Height transition with overflow hidden
- Opacity fade for content

---

#### 8. View Transition (to/from Editor)
When opening a document from flow view:

**Spec:**
- Focus node scales up slightly and fades
- Other nodes fade out faster
- Creates sense of "zooming into" the document

---

### Out of Scope

- Physics-based animations (spring, bounce)
- 3D transforms
- Canvas/WebGL animations
- Reduced-motion media query (future iteration)
- Gesture-based animations (drag, swipe)

---

## Technical Approach

### CSS-First Strategy

Prefer CSS transitions and animations over JavaScript:

```css
/* Entrance animation with stagger */
.flow-view__node {
  opacity: 0;
  transform: translateY(8px);
  animation: flow-node-enter 200ms ease-out forwards;
  animation-delay: calc(var(--stagger-index) * 50ms);
}

@keyframes flow-node-enter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Performance Guidelines

From [Josh Comeau](https://www.joshwcomeau.com/animation/css-transitions/):
- Only animate `transform` and `opacity` for 60fps
- Avoid animating `margin`, `padding`, `width`, `height`
- Use `will-change` sparingly and remove after animation

### Stagger Implementation

From [CSS-Tricks](https://css-tricks.com/different-approaches-for-creating-a-staggered-animation/):

```css
/* Set index via inline style or data attribute */
.flow-view__node {
  --stagger-index: 0;
}

/* Or use nth-child */
.flow-view__zone-nodes .flow-view__node:nth-child(1) { --stagger-index: 0; }
.flow-view__zone-nodes .flow-view__node:nth-child(2) { --stagger-index: 1; }
.flow-view__zone-nodes .flow-view__node:nth-child(3) { --stagger-index: 2; }
.flow-view__zone-nodes .flow-view__node:nth-child(4) { --stagger-index: 3; }
```

### Focus Transition Implementation

```typescript
// In flow.ts
private transitionFocus(newId: string): void {
  // Add exit class to current nodes
  this.container.querySelectorAll('.flow-view__node').forEach(node => {
    node.classList.add('flow-view__node--exiting');
  });

  // Wait for exit animation
  setTimeout(() => {
    this.focusedId = newId;
    this.render(); // Re-render with new focus
  }, 150);
}
```

```css
.flow-view__node--exiting {
  opacity: 0;
  transform: scale(0.98);
  transition: opacity 150ms ease-out, transform 150ms ease-out;
}
```

---

## Timing Reference

| Animation | Duration | Delay | Easing |
|-----------|----------|-------|--------|
| Node entrance | 200ms | stagger 50ms | ease-out |
| Focus transition | 250ms | 0 | ease-out |
| Hover lift | 150ms | 0 | ease-out |
| Arrow draw | 300ms | 200ms | ease-in-out |
| State pulse | 2-3s | 0 | ease-in-out |

---

## Implementation Order

1. **Entrance stagger** — Highest impact, establishes animation vocabulary
2. **Hover microinteraction** — Quick win, immediate polish
3. **Focus transition** — Core navigation improvement
4. **State animations** — Communicates conducting frontmatter visually
5. **Arrow animation** — Polish
6. **View transitions** — Integration with editor

---

## Acceptance Criteria Summary

| Requirement | Acceptance |
|-------------|------------|
| Entrance stagger | Nodes cascade in visibly, not instant |
| Focus transition | Click produces smooth cross-fade, not jump |
| Hover lift | Immediate subtle motion on hover |
| Arrow draw | Connectors animate after nodes |
| State pulse | Pending/in-progress have ambient motion |

---

## References

- [Josh Comeau - CSS Transitions](https://www.joshwcomeau.com/animation/css-transitions/)
- [CSS-Tricks - Staggered Animation](https://css-tricks.com/different-approaches-for-creating-a-staggered-animation/)
- [Pixel Free Studio - Animating Data Visualizations](https://blog.pixelfreestudio.com/best-practices-for-animating-data-visualizations/)
- [Gapsy Studio - UI Animation Best Practices](https://gapsystudio.com/blog/ui-animation-best-practices/)
- [Cambridge Intelligence - Graph UX](https://cambridge-intelligence.com/graph-visualization-ux-how-to-avoid-wrecking-your-graph-visualization/)

---

## Composition

**Upstream:**
- [Scope Method](fw-scope-method) — method used
- [Scope: Constellation Redesign](inst-scope-constellation-redesign) — parent scope

**Downstream:**
- Animation implementation in flow.ts and flow.css

**Related:**
- Constellation view already has some animation (tether draw-in)
- Editor view has no entrance animation
