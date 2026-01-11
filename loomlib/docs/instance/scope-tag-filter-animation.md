---
id: inst-scope-tag-filter-animation
title: "Scope: Tag Filter Animation Polish"
type: instance
framework_kind: null
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [scope, ux, animation, tags, list-view, polish]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-scope-method
    relation: method
  - doc: inst-survey-tag-filter-system
    relation: prior
downstream: []
---

# Scope: Tag Filter Animation Polish

**Date:** 2026-01-10
**Subject:** Animation and interaction polish for the scrolling tag filter
**Method:** Scope Method (UX requirements)

---

## Audit

### Current State (from Survey)

The survey established the core mechanics:
- CSS `translateX(-50%)` animation on duplicated tag list
- Pause on hover via `animation-play-state: paused`
- Selected tag "breaks out" to static left position
- Fade edges with `mask-image` gradient

This scope focuses on **polish** — the micro-interactions and timing that make it feel good.

### Reference Patterns

| Pattern | Where Seen | Feel |
|---------|------------|------|
| Marquee scroll | Stock tickers, news chyrons | Steady, informational |
| Carousel auto-advance | Hero sliders | Rhythmic, discoverable |
| Tag cloud animation | Tagxedo, word clouds | Playful, exploratory |
| Static-to-scroll breakout | macOS Dock magnification | Responsive, immediate |

The loomlib aesthetic is "planetarium control room" — calm, precise, functional. The animation should feel like **instrumentation**, not decoration.

---

## Affordances

### What the Animation Promises

| Visual Cue | Implied Promise |
|------------|-----------------|
| Continuous scroll | "There are more tags than you can see" |
| Pause on hover | "Stop to explore" |
| Selected tag breaks out | "Your filter is active and prominent" |
| Fade edges | "Infinite pool of options" |

### Interaction States

```
┌─────────────────────────────────────────────────────────────┐
│ IDLE: Tags scroll left at constant velocity                 │
├─────────────────────────────────────────────────────────────┤
│ HOVER: Animation pauses, tags become clickable targets      │
├─────────────────────────────────────────────────────────────┤
│ SELECTED: Clicked tag animates to static position,          │
│           remaining tags resume scrolling                    │
├─────────────────────────────────────────────────────────────┤
│ DESELECTED: Static tag fades, scrolling includes all tags   │
└─────────────────────────────────────────────────────────────┘
```

---

## Expectations

### What Users Would Expect

1. **Scroll speed is comfortable** — slow enough to read, fast enough to discover
2. **Hover pause is immediate** — no lag, no "finishing" current motion
3. **Selected tag transition is smooth** — not a jump cut
4. **Re-hover after selection doesn't break** — can still browse remaining tags
5. **Click target is the whole chip** — not just text
6. **Visual feedback on click** — confirmation the action registered

### Timing Expectations (from reference patterns)

| Element | Expected Duration |
|---------|-------------------|
| Full scroll cycle | 20-40s (depends on tag count) |
| Hover pause | Instant (0ms) |
| Breakout transition | 150-250ms |
| Click feedback | 100-150ms |
| Fade edge | 10% of width each side |

---

## Gaps

### Potential Polish Issues

| Issue | Risk | Mitigation |
|-------|------|------------|
| **Jank on animation resume** | Medium | Use `animation-play-state` not JS timers |
| **Breakout jump cut** | High | Animate position, don't just swap DOM |
| **Click during scroll is hard** | Medium | Pause on hover solves this |
| **Too fast for reading** | Medium | Tune duration based on tag count |
| **No feedback on click** | Low | Add scale/color pulse |
| **Selected chip orphaned visually** | Low | Subtle connector line to scroll area |
| **Scroll loop jank at seam** | Medium | Duplicate list exactly, fade edges hide seam |

### Edge Cases

| Edge Case | Expected Behavior |
|-----------|-------------------|
| 0 tags in context | Hide tag filter row entirely |
| 1 tag in context | Show static, no scroll needed |
| 2-5 tags | Scroll slowly or don't scroll at all |
| 50+ tags | Normal scroll speed |
| Very long tag name | Truncate with ellipsis, full on hover |
| Tag with special chars | Escape HTML, no styling issues |

---

## Requirements

### Must Have (Functional Polish)

- [ ] **Adaptive scroll speed** — Duration scales with tag count
  - *Formula: `max(15, tags.length * 0.8)` seconds per cycle*
  - *Acceptance: 10 tags = 15s, 50 tags = 40s*

- [ ] **Smooth breakout animation** — Selected tag slides to static position
  - *Use CSS `transition` on the static container*
  - *Acceptance: No jump cut when selecting/deselecting*

- [ ] **Immediate hover pause** — No easing out, no momentum
  - *Use `animation-play-state: paused`*
  - *Acceptance: Tags stop within 16ms of hover start*

- [ ] **Click feedback** — Visual confirmation of selection
  - *Brief scale pulse or background flash*
  - *Acceptance: User knows click registered before DOM updates*

### Should Have (Refined Polish)

- [ ] **Momentum resume** — After hover ends, slight acceleration before constant speed
  - *CSS easing on resume: `ease-in` for first 500ms*
  - *Acceptance: Feels intentional, not jarring*

- [ ] **Stagger entrance** — Tags fade in sequentially on initial load
  - *Delay each chip by 30-50ms*
  - *Acceptance: "Revealing" effect on first render*

- [ ] **Scroll direction indicator** — Subtle arrow or gradient showing scroll direction
  - *Right-side gradient slightly brighter than left*
  - *Acceptance: Subconscious cue that more is coming from the right*

- [ ] **Selected chip distinction** — Slightly larger or different treatment
  - *Add subtle glow or border accent*
  - *Acceptance: Clear which chip is active filter*

### Could Have (Delight Polish)

- [ ] **Parallax scroll rates** — Some tags scroll faster (foreground/background effect)
  - *Different rows at different speeds*
  - *Acceptance: Adds depth without distraction*

- [ ] **Hover preview** — Hovering a tag shows count of matching docs
  - *Tooltip: "economy (12)"*
  - *Acceptance: Helps decide before clicking*

- [ ] **Keyboard navigation** — Tab into scroll, arrow to select
  - *Focus ring on active chip*
  - *Acceptance: Fully keyboard accessible*

- [ ] **Clear all button** — Reset tag filter with animation
  - *X icon at far left when tag selected*
  - *Acceptance: Easy escape from filtered state*

### Out of Scope

- Multi-tag selection (design specifies single selection)
- Drag-and-drop tag reordering
- Tag creation from this UI
- Tag frequency visualization (size based on usage)

---

## Design Specifications

### CSS Variables (add to variables.css)

```css
:root {
  --tag-scroll-speed: 30s;           /* Base cycle duration */
  --tag-breakout-duration: 200ms;    /* Selection transition */
  --tag-click-feedback: 100ms;       /* Click pulse duration */
  --tag-fade-width: 10%;             /* Edge fade gradient */
  --tag-gap: var(--space-xs);        /* Between chips */
  --tag-height: 24px;                /* Chip height */
}
```

### Animation Keyframes

```css
@keyframes tag-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes tag-click-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes tag-entrance {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Mask Gradient (fade edges)

```css
.list-view__tag-scroll {
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black var(--tag-fade-width),
    black calc(100% - var(--tag-fade-width)),
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black var(--tag-fade-width),
    black calc(100% - var(--tag-fade-width)),
    transparent 100%
  );
}
```

### Breakout Animation

```css
.list-view__tag-selected {
  display: flex;
  align-items: center;
  overflow: hidden;
  max-width: 0;
  opacity: 0;
  transition:
    max-width var(--tag-breakout-duration) ease-out,
    opacity var(--tag-breakout-duration) ease-out;
}

.list-view__tag-selected--active {
  max-width: 150px;  /* Adjust based on max expected tag length */
  opacity: 1;
}
```

---

## Interaction Flow Diagram

```
User Action              System Response                    Visual Result
───────────────────────────────────────────────────────────────────────────
Page loads          →    Render tags, start scroll      →   Tags animate
                                                            left smoothly

Mouse enters        →    animation-play-state: paused  →   Tags stop
scroll area                                                 immediately

Mouse hovers        →    No change                      →   Chip slightly
over chip                                                   brightens

Mouse clicks        →    1. Play click pulse           →   Chip scales 1.05x
chip                     2. Update activeTagFilter          then returns
                         3. Move chip to static area    →   Smooth slide left
                         4. Resume scroll sans chip     →   Other tags
                                                            continue

Mouse leaves        →    animation-play-state: running →   Tags resume
scroll area                                                 scrolling

Click selected      →    1. Play click pulse           →   Same pulse
chip again               2. Clear activeTagFilter
                         3. Return chip to scroll       →   Chip slides back
                         4. Scroll includes all tags         into stream
```

---

## Testing Checklist

- [ ] Tags scroll smoothly at 60fps
- [ ] Hover pauses immediately (no drift)
- [ ] Click registers on first try
- [ ] Selected tag transition is smooth (no jump)
- [ ] Deselection returns chip to stream cleanly
- [ ] Edge fade hides loop seam
- [ ] Works with 0, 1, 5, 20, 100 tags
- [ ] Long tag names truncate properly
- [ ] Tags with special characters render correctly
- [ ] Filter respects current state/intent filters
- [ ] Document list updates after tag selection

---

## Notes

- The animation should feel **inevitable** — like a stream flowing, not a carousel advancing
- Pause on hover is critical; without it, clicking a moving target is frustrating
- The breakout animation is the most complex piece; get it right or cut it (fallback: instant swap)
- Consider `prefers-reduced-motion` — users who disable animations should get static tag list
- Performance: CSS animations are GPU-composited; should be smooth even on modest hardware
