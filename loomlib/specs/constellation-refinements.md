# Constellation View Refinements

Visual polish and bug fixes for the focus-driven graph view.

---

## Summary

Eight issues identified in the current constellation implementation. Fixes address tether logic, depth layer clarity, card hierarchy, and incubating status visibility.

---

## 1. Tether Logic Bug

**Problem:** Tethers render for all edges in the graph, including relationships between non-focused documents. When Oikonomia is focused, tethers appear connecting it to Etymon Method—but Oikonomia has `framework_ids: []` (no parents).

**Root cause:** `renderTethers()` draws all edges from `computeEdges()`, which computes the full graph regardless of focus. When CAPITAL (child of Oikonomia) is positioned below focus, its tether to its *other* parent (Etymon Method) creates a visual line that appears to connect through the focus area.

**Fix:** Filter edges to only render tethers where at least one endpoint is the focused document.

```ts
// constellation.ts - renderTethers()
for (const edge of this.edges) {
  // Only render tethers connected to focus
  if (edge.source !== this.focusedId && edge.target !== this.focusedId) {
    continue;
  }
  // ... existing rendering
}
```

**Verification:** Focus on `fw-oikonomia-chrematistics`. No upward tethers should appear. Downward tethers to CAPITAL, CREDIT visible.

---

## 2. Toolkit vs Domain Parent Positioning

**Problem:** When an instance has multiple framework parents (toolkit + domain), both appear in similar positions. Spec requires toolkit left, domain right.

**Current behavior:** `computePositions()` already separates toolkit/domain parents into `toolkitParents` and `domainParents` arrays with correct positioning logic.

**Suspected issue:** Tether visibility from §1 makes it hard to see the distinction. Once tether bug is fixed, verify positioning is correct.

**Verification:** Focus on CAPITAL. Etymon Method (⚙) should appear upper-left. Oikonomia (▣) should appear upper-right. If positions are swapped, check `computePositions()` x-offset calculations.

---

## 3. Blur Gradation Too Subtle

**Problem:** Distant layer cards are too readable. Should be barely legible shapes with color hints.

**Current values:**
```css
--depth-context-blur: 2px;
--depth-context-opacity: 0.8;
--depth-distant-blur: 4px;
--depth-distant-opacity: 0.4;
```

**New values:**
```css
--depth-context-blur: 3px;
--depth-context-opacity: 0.7;
--depth-distant-blur: 6px;
--depth-distant-opacity: 0.35;
```

**File:** `src/ui/variables.css`

**Verification:** Distant cards should be color blobs, not readable text. Context cards readable but soft.

---

## 4. Card Width / Title Truncation

**Problem:** "Oikonomia vs Chre..." truncates too aggressively on focus card.

**Options (pick one):**
- A) Wider max-width for focus layer (220px vs 180px)
- B) Two-line title wrapping
- C) Tooltip on hover

**Recommended:** Option A—minimal change, focus card deserves prominence.

```css
/* constellation.css */
.constellation-node[data-layer="focus"] {
  max-width: 240px;
}

.constellation-node[data-layer="focus"] .constellation-node__title {
  white-space: normal;
  line-height: 1.3;
}
```

**Verification:** "Oikonomia vs Chrematistics" fully visible on focus card. May wrap to two lines.

---

## 5. Type Icons Not Prominent

**Problem:** Type icons (▣ ⚙ ◧ ◈ ○ ☰) not visible or too small.

**Current:**
```css
.constellation-node__icon {
  font-size: 1rem;
}
```

**Fix:**
```css
.constellation-node__icon {
  font-size: 1.25rem;
  font-weight: 600;
  opacity: 1;
}

.constellation-node[data-layer="focus"] .constellation-node__icon {
  font-size: 1.5rem;
}
```

**Verification:** Icons clearly visible on all cards. Focus card icon largest.

---

## 6. Focus Card Elevation

**Problem:** Focus card needs more visual prominence beyond just sharpness.

**Current:**
```css
.constellation-node[data-layer="focus"] {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

**Fix:**
```css
.constellation-node[data-layer="focus"] {
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.25),
    0 0 40px rgba(123, 163, 201, 0.15);
  border-width: 2px;
}
```

Dark theme adjustment:
```css
[data-theme="dark"] .constellation-node[data-layer="focus"] {
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(123, 163, 201, 0.2);
}
```

**Verification:** Focus card visually "floats" above others. Subtle halo effect.

---

## 7. Tether Styling Enhancement

**Problem:** Tethers are thin flat lines. Could benefit from gradient and glow.

**Current:**
```css
.tether {
  stroke: var(--tether-color);
  stroke-width: 1px;
  opacity: 0.4;
}
```

**Enhancement:** Gradient from type color to focus, stronger glow on focused tethers.

```css
.tether {
  stroke: var(--tether-color);
  stroke-width: 1.5px;
  opacity: 0.5;
  stroke-linecap: round;
}

.tether--focused {
  stroke-width: 2.5px;
  opacity: 0.9;
  filter: url(#tether-glow);
}
```

**Optional:** Animate tethers on focus change (draw-in effect). Lower priority.

**Verification:** Focused tethers clearly visible with soft glow. Non-focused tethers subtle.

---

## 8. Incubating Glow Missing

**Problem:** CAPITAL and CREDIT are `status: 'incubating'` but pulse animation not visible.

**Diagnosis needed:** Check if:
1. `data-status="incubating"` attribute is being set
2. Animation keyframes are loaded
3. Box-shadow is being overridden by layer styles

**Likely fix:** Layer-specific box-shadow in `[data-layer="focus"]` may override incubating glow. Need to merge shadows.

**Current (problematic):**
```css
.constellation-node[data-layer="focus"] {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.constellation-node[data-status="incubating"] {
  animation: constellation-pulse 2s ease-in-out infinite;
}
```

The animation changes box-shadow, but the layer rule has higher specificity.

**Fix already exists** at lines 125-136 of constellation.css for `[data-layer="focus"][data-status="incubating"]`. Verify it's working by:

1. Ensure animation keyframes use correct color: warm amber `rgba(201, 166, 123, 0.4)` not generic `rgba(255, 200, 100, 0.5)`
2. Add similar rules for context and distant layers if needed

```css
/* Context layer incubating */
.constellation-node[data-layer="context"][data-status="incubating"] {
  animation: constellation-pulse 2.5s ease-in-out infinite;
}

/* Distant layer - subtle pulse through blur */
.constellation-node[data-layer="distant"][data-status="incubating"] {
  animation: constellation-pulse-distant 3s ease-in-out infinite;
}

@keyframes constellation-pulse-distant {
  0%, 100% { box-shadow: 0 0 8px rgba(201, 166, 123, 0.2); }
  50% { box-shadow: 0 0 16px rgba(201, 166, 123, 0.35); }
}
```

**Verification:** CAPITAL and CREDIT cards pulse with warm amber glow in any layer.

---

## Implementation Order

1. **Tether logic bug** (§1) — Biggest visual fix, blocks verification of other issues
2. **Blur gradation** (§3) — Quick CSS change
3. **Incubating glow** (§8) — Status visibility important
4. **Focus card elevation** (§6) — Quick CSS change
5. **Type icons** (§5) — Quick CSS change
6. **Card width** (§4) — Quick CSS change
7. **Tether styling** (§7) — Polish
8. **Toolkit/domain positions** (§2) — Verify after §1 fixed

---

## Files Changed

| File | Changes |
|------|---------|
| `src/views/constellation.ts` | Filter tethers to focus-connected only |
| `src/ui/variables.css` | Depth layer values |
| `src/ui/constellation.css` | Card width, icons, elevation, incubating |

---

## Acceptance Criteria

- [ ] Focus on root framework → no upward tethers
- [ ] Focus on instance with two parents → toolkit left, domain right
- [ ] Distant cards are blurred color shapes, not readable text
- [ ] Focus card title "Oikonomia vs Chrematistics" fully visible
- [ ] Type icons (▣ ⚙ ◧) visible on all cards
- [ ] Focus card has elevated shadow + subtle halo
- [ ] Focused tethers have glow, non-focused are subtle
- [ ] Incubating documents pulse warm amber in all layers
