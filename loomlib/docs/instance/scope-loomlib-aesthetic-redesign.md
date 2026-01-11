---
id: inst-scope-loomlib-aesthetic-redesign
title: "Scope: Loomlib Aesthetic Redesign"
type: instance
framework_kind: null
perspective: null
framework_ids:
  - fw-scope-method
source_id: null
output: loomcommander
status: incubating
tags:
  - scope
  - css
  - aesthetic
  - ui
  - dark-theme
  - loomlib
  - redesign
intent: research
execution_state: pending
upstream:
  - doc: fw-scope-method
    relation: method
  - doc: inst-survey-loomlib-aesthetic
    relation: prior
downstream: []
---

# Scope: Loomlib Aesthetic Redesign

**Goal:** Replace "neon glow gaming aesthetic" with refined, professional dark theme
**Audit Source:** `inst-survey-loomlib-aesthetic`

---

## I. Current State Audit

### What's Being Removed
| Pattern | Where | Why Remove |
|---------|-------|------------|
| 40px outer glow on focus | variables.css | Neon aesthetic |
| 12px blur box-shadows | deck.css, spatial.css, constellation.css | Gaming feel |
| Animated incubating pulse | card.css, flow.css | Distracting in aggregate |
| Glassmorphism backdrop-blur | All card components | Visual noise |
| Multi-layered shadow stacks | variables.css | Overwrought |

### What's Being Kept
| Pattern | Where | Why Keep |
|---------|-------|----------|
| OKLCH color space | variables.css | Perceptually uniform |
| Muted document type colors | variables.css | Appropriate chroma |
| Left border intent indicators | deck.css | Subtle, effective |
| Background type tints (0.05 opacity) | deck.css | Unobtrusive |
| State dots (monospace dots) | card.css | Clean encoding |
| Font system (JetBrains Mono) | variables.css | Developer credibility |

---

## II. Affordances (Current System)

| Element | Current Visual | Meaning |
|---------|---------------|---------|
| Cyan border + 40px glow | Card selected/focused | Active item |
| Amber pulse animation | Status=incubating | Needs attention |
| Amber glow | state=in_progress | Currently working |
| Green glow | state=completed | Done |
| Blue glow | state=resolved | Closed |
| Backdrop blur + transparency | Card surface | Depth/layering |
| Orange/green/blue dots | Execution state | Quick scan |

---

## III. Expectations → Gaps

### E1: Selection Should Be Clear But Not Loud
**Current:** 40px glowing aura + multi-layer shadow
**Expected:** Clear visual distinction without screaming
**Gap:** Selection competes with content for attention

### E2: Status Indicators Should Be Scannable
**Current:** Animated glow + colored border + state dots (3 redundant signals)
**Expected:** One clear indicator per state
**Gap:** Visual overload, especially in deck view with 100+ cards

### E3: Cards Should Feel Solid, Not Ethereal
**Current:** Backdrop-blur glassmorphism, semi-transparent
**Expected:** Grounded surfaces with subtle depth
**Gap:** Glassmorphism creates floating/unanchored feel

### E4: Focus Mode Should Be Calm
**Current:** Selected node pulses and glows
**Expected:** Quiet confidence - knows it's selected without shouting
**Gap:** Animation and glow create anxiety, not focus

### E5: Dark Theme Should Feel Professional
**Current:** "Planetarium control room" aspiration, "gaming terminal" reality
**Expected:** Linear/Notion/Obsidian quality - refined, minimal
**Gap:** Effects-heavy execution undermines the concept

---

## IV. UX Requirements

### R1: Solid Selection States
**Requirement:** Replace glow-based selection with border-based selection
```css
/* FROM */
--shadow-focus:
  0 0 0 1px var(--accent),
  0 4px 16px oklch(0% 0 0 / 0.4),
  0 0 40px oklch(65% 0.15 230 / 0.1);

/* TO */
--shadow-focus:
  0 0 0 2px var(--accent),
  0 2px 8px oklch(0% 0 0 / 0.3);
```
**Rationale:** 2px border provides clear focus, 8px shadow provides subtle lift

### R2: Static Status Indicators
**Requirement:** Remove all animated status treatments
- Delete `@keyframes card-incubating-pulse`
- Delete `@keyframes flow-pulse-pending`
- Delete `@keyframes flow-pulse-progress`
- Replace with static visual treatments

**Static alternatives:**
| State | Treatment |
|-------|-----------|
| incubating | Subtle amber left border (2px) |
| in_progress | Amber background tint (0.08 opacity) |
| completed | Static green state dots |
| resolved | Muted/desaturated appearance |

### R3: Remove Glassmorphism Blur
**Requirement:** Replace backdrop-filter with solid backgrounds
```css
/* FROM */
background: var(--glass-bg), var(--glass-bg-solid);
backdrop-filter: blur(var(--glass-blur));

/* TO */
background: oklch(18% 0.008 270);
border: 1px solid oklch(100% 0 0 / 0.06);
```
**Rationale:** Solid backgrounds render faster, look cleaner at scale

### R4: Simplified Glow Removal
**Requirement:** Remove all box-shadow blur > 4px from status indicators
```css
/* FROM */
box-shadow: 0 0 12px 2px oklch(72% 0.14 70 / 0.3);

/* TO */
border-left: 2px solid var(--color-instance);
```
**Rationale:** Borders communicate state without luminosity effects

### R5: Raise Base Lightness
**Requirement:** Increase void/base lightness
```css
/* FROM */
--bg-void: oklch(8% 0.005 270);
--bg: oklch(12% 0.005 270);

/* TO */
--bg-void: oklch(10% 0.005 270);
--bg: oklch(13% 0.005 270);
```
**Rationale:** Research consensus - 10-12% minimum for comfortable dark themes

### R6: Single Indicator Per State
**Requirement:** Remove redundant state indicators
- State dots remain (compact, scannable)
- Remove glow + pulse + border combination
- Intent indicators use left border only
- Type indicators use icon color only

---

## V. Implementation Specification

### Phase 1: Core Token Changes (variables.css)

```css
/* 1. Raise base lightness */
--bg-void: oklch(10% 0.005 270);
--bg: oklch(13% 0.005 270);
--bg-subtle: oklch(17% 0.008 270);
--bg-elevated: oklch(21% 0.01 270);

/* 2. Remove glow tokens */
--status-incubating-glow: none;        /* DELETE */
--status-incubating-glow-bright: none; /* DELETE */

/* 3. Simplify focus shadow */
--shadow-focus:
  0 0 0 2px var(--accent),
  0 2px 8px oklch(0% 0 0 / 0.25);

/* 4. Remove glass blur */
--glass-blur: 0;

/* 5. Solid glass background */
--glass-bg: transparent;
--glass-bg-solid: oklch(18% 0.008 270);
--glass-border: oklch(100% 0 0 / 0.06);
--glass-border-highlight: oklch(100% 0 0 / 0.10);
```

### Phase 2: Card System (card.css)

```css
/* Remove pulse animation */
.doc-card--incubating {
  /* animation: DELETE */
  border-left: 2px solid var(--color-instance);
}

/* Static selected state */
.doc-card--selected {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent), 0 2px 8px oklch(0% 0 0 / 0.25);
}
```

### Phase 3: Deck View (deck.css)

```css
/* Remove state glows */
.deck-view--lens-state .deck-card[data-state="in_progress"] {
  /* box-shadow: DELETE */
  background: oklch(from var(--color-instance) l c h / 0.08);
}

.deck-view--lens-state .deck-card[data-state="completed"] {
  /* box-shadow: DELETE */
  background: oklch(from var(--color-source) l c h / 0.06);
}

/* Keep intent borders - already good */
/* Keep type tints - already good */
```

### Phase 4: Spatial/Constellation (spatial.css, constellation.css)

```css
/* Remove overlay glows */
.spatial-canvas--overlay-state .spatial-node[data-state="in_progress"] {
  /* box-shadow: DELETE */
  border-left: 2px solid var(--color-instance);
}

/* Simplify focus node */
.constellation-node[data-layer="focus"] {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent), 0 4px 12px oklch(0% 0 0 / 0.3);
}
```

### Phase 5: Flow View (flow.css)

```css
/* Remove pulse animations */
/* DELETE @keyframes flow-pulse-pending */
/* DELETE @keyframes flow-pulse-progress */

.flow-view__node--pending {
  border-style: dashed;
  opacity: 0.7;
  /* animation: DELETE */
}

.flow-view__node--in_progress {
  border-left: 3px solid var(--color-instance);
  /* animation: DELETE */
}
```

---

## VI. Visual Before/After

### Selection State
| Before | After |
|--------|-------|
| 40px cyan glow aura | 2px solid cyan border + subtle shadow |

### Incubating Card
| Before | After |
|--------|-------|
| Pulsing amber glow (3s cycle) | Static 2px amber left border |

### Card Surface
| Before | After |
|--------|-------|
| Backdrop-blur glass effect | Solid dark gray with subtle border |

### State Indicators
| Before | After |
|--------|-------|
| Glow + dots + pulse | Dots only (primary) + subtle border (secondary) |

---

## VII. Acceptance Criteria

1. [ ] No CSS rule uses `box-shadow` with blur radius > 4px for state indication
2. [ ] No `@keyframes` animations for status states
3. [ ] No `backdrop-filter: blur()` on card components
4. [ ] `--bg-void` lightness >= 10%
5. [ ] Selection state uses border, not glow
6. [ ] Deck view with 100+ cards renders without visual chaos
7. [ ] Passes visual inspection: "professional" not "gaming terminal"

---

## VIII. Risk Assessment

### Low Risk
- Token changes cascade through the system
- Removing animations has no dependencies
- Raising lightness is purely aesthetic

### Medium Risk
- Glassmorphism removal changes depth perception
- Selection state change affects all views simultaneously
- Some users may prefer current aesthetic

### Mitigation
- Implement in phases, verify each
- Keep old tokens commented for rollback
- Test all views: deck, spatial, constellation, editor, flow

---

## IX. Estimated Effort

| Phase | Files | LOC Changed | Time |
|-------|-------|-------------|------|
| Phase 1: Tokens | 1 | ~30 | 15m |
| Phase 2: Cards | 1 | ~40 | 15m |
| Phase 3: Deck | 1 | ~30 | 15m |
| Phase 4: Spatial | 2 | ~50 | 20m |
| Phase 5: Flow | 1 | ~30 | 15m |
| Testing | all | - | 30m |
| **Total** | 6 | ~180 | ~2h |

---

## X. Calibration Note

This scope is tight and executable. Per skills calibration:
- CSS is fluent capacity
- Changes are surgical (specific line deletions/edits)
- No new architecture, just refinement

This is a Magician task that serves production quality. The aesthetic directly affects the instrument quality for shipping Etymon content.
