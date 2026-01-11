---
id: inst-survey-loomlib-aesthetic
title: "Survey: Loomlib Aesthetic Implementation"
type: instance
framework_kind: null
perspective: null
framework_ids:
  - fw-survey-method
source_id: null
output: loomcommander
status: incubating
tags:
  - survey
  - css
  - aesthetic
  - ui
  - dark-theme
  - loomlib
intent: research
execution_state: in_progress
upstream:
  - doc: fw-survey-method
    relation: method
  - doc: idx-user-skills
    relation: informs
downstream:
  - doc: inst-scope-loomlib-aesthetic-redesign
    relation: enables
---

# Survey: Loomlib Aesthetic Implementation

**Terrain:** CSS styling system for loomlib knowledge graph application
**Goal:** Understand current aesthetic approach before changing it

---

## I. Core Sample: variables.css (141 lines)

The design token system establishes the visual foundation.

### Current Aesthetic Concept
```
Aesthetic: Planetarium control room - dark, spatial, frosted glass
Color space: OKLCH for perceptual uniformity
```

### Base Canvas (lines 8-14)
```css
--bg-void: oklch(8% 0.005 270);     /* deepest background */
--bg: oklch(12% 0.005 270);         /* primary background */
--bg-subtle: oklch(16% 0.008 270);  /* hover states */
--bg-elevated: oklch(20% 0.01 270); /* cards, inputs */
```
**Assessment:** Good foundation. Uses dark grays, not pure black. The 8% lightness for void is borderline - research suggests 10-12% minimum.

### Document Type Colors (lines 32-38)
```css
--color-framework: oklch(70% 0.12 230);  /* steel blue */
--color-instance: oklch(72% 0.14 70);    /* warm amber */
--color-note: oklch(60% 0.02 270);       /* neutral gray */
--color-source: oklch(70% 0.14 145);     /* sage green */
--color-index: oklch(80% 0.02 270);      /* silver */
```
**Assessment:** Good muted palette. Chroma values (0.12-0.14) are appropriate - not too saturated. Instance amber (0.14 at hue 70) could be slightly muted.

### Problem Area: Glassmorphism System (lines 43-52)
```css
--glass-blur: 10px;
--glass-bg: linear-gradient(135deg, oklch(100% 0 0 / 0.06) 0%, oklch(100% 0 0 / 0.02) 100%);
--glass-bg-solid: oklch(18% 0.008 270 / 0.92);
--glass-border: oklch(100% 0 0 / 0.08);
--glass-border-highlight: oklch(100% 0 0 / 0.15);
```
**Assessment:** Glassmorphism is overused. The gradient + blur + transparency creates visual noise when many cards are visible.

### Problem Area: Status Indicators (lines 85-88)
```css
--status-incubating-color: oklch(72% 0.14 70);
--status-incubating-glow: 0 0 12px 2px oklch(72% 0.14 70 / 0.3);
--status-incubating-glow-bright: 0 0 20px 4px oklch(72% 0.14 70 / 0.45);
```
**Assessment:** This is the neon glow problem. 12px and 20px blur radii create harsh, gaming-aesthetic glows.

### Problem Area: Shadow/Focus System (lines 94-100)
```css
--shadow-focus:
  0 0 0 1px var(--accent),
  0 4px 16px oklch(0% 0 0 / 0.4),
  0 0 40px oklch(65% 0.15 230 / 0.1);
```
**Assessment:** The 40px glow is excessive. The layered approach is correct but the outermost glow creates the "neon" feel.

---

## II. Stratigraphy: Card System

### card.css - Incubating Pulse Animation (lines 159-170)
```css
.doc-card--incubating {
  animation: card-incubating-pulse 3s ease-in-out infinite;
}

@keyframes card-incubating-pulse {
  0%, 100% { box-shadow: var(--status-incubating-glow); }
  50% { box-shadow: var(--status-incubating-glow-bright); }
}
```
**Assessment:** Animated pulsing is distracting. In a deck view with many incubating items, this creates visual chaos.

### deck.css - State Lens Glows (lines 401-412)
```css
.deck-view--lens-state .deck-card[data-state="in_progress"] {
  box-shadow: 0 0 12px 2px oklch(72% 0.14 70 / 0.3);
}

.deck-view--lens-state .deck-card[data-state="completed"] {
  box-shadow: 0 0 10px 2px oklch(70% 0.14 145 / 0.25);
}
```
**Assessment:** More neon glows. These compound with card selection glows.

### spatial.css - State Overlay Glows (lines 332-342)
```css
.spatial-canvas--overlay-state .spatial-node[data-state="in_progress"] {
  box-shadow: 0 0 12px 2px oklch(72% 0.14 70 / 0.4);
}

.spatial-canvas--overlay-state .spatial-node[data-state="completed"] {
  box-shadow: 0 0 12px 2px oklch(70% 0.14 145 / 0.3);
}
```
**Assessment:** Same pattern repeated. The 12px blur radius is the recurring problem.

---

## III. Stratigraphy: Selection/Focus States

### Current Selection Pattern
```css
.doc-card--selected {
  border-color: var(--accent);
  box-shadow: var(--shadow-focus);
}
```

Where `--shadow-focus` includes:
- 1px solid accent border
- 16px shadow
- 40px outer glow

**Assessment:** The selection state is visually heavy. Competing with content rather than framing it.

### Constellation Focus (constellation.css lines 266-276)
```css
.constellation-node[data-layer="focus"] {
  /* ... */
  border-color: var(--accent);
  box-shadow: var(--shadow-focus);
}
```
**Assessment:** Focus node gets full glow treatment. Makes it pop but feels overwrought.

---

## IV. Stratigraphy: Intent/Type Indicators

### Left Border Pattern (deck.css lines 415-433)
```css
.deck-view--lens-intent .deck-card[data-intent="research"] {
  border-left: 3px solid #60a5fa;
}
.deck-view--lens-intent .deck-card[data-intent="build"] {
  border-left: 3px solid #f59e0b;
}
```
**Assessment:** Actually good. Subtle, directional, doesn't compete with content.

### Type Tint Pattern (deck.css lines 366-394)
```css
.deck-view--lens-type .deck-card[data-type="framework"]::before {
  background: var(--color-framework);
  opacity: 0.05;
}
```
**Assessment:** Good. Very subtle background tint.

---

## V. Diagnostic Summary

### What Works
1. **OKLCH color space** - Perceptually uniform, good choice
2. **Dark gray foundation** - Not pure black
3. **Muted document type colors** - Appropriate chroma
4. **Left border indicators** - Subtle, effective
5. **Background tints** - Low opacity, unobtrusive
6. **Font choices** - JetBrains Mono, system sans-serif appropriate

### What Doesn't Work
1. **Glow-based selection/focus** - 40px outer glow is neon-esque
2. **Animated status pulse** - Distracting in aggregate
3. **12px blur box-shadows** - Gaming aesthetic
4. **Glassmorphism overuse** - Visual noise when cards overlap
5. **Multiple competing indicators** - State dots + glow + border + animation
6. **Void background too dark** - 8% might be too low

### The Core Problem
The design tries to communicate hierarchy through luminosity (glows, brightness) rather than through subtle structural cues. This creates the "neon glow" feel.

---

## VI. Industry Reference Analysis

### Linear (from research)
- Uses only 3 colors to generate everything: base, accent, contrast
- LCH color space (same approach as OKLCH)
- "Professional to engineers" - black coding environment feel
- High contrast, clean, clutter-free

### Dark Mode Best Practices (2025 consensus)
- Avoid pure black - use #121212, #1b1b1b (10-12% lightness)
- Shadows don't work well in dark mode - use subtle highlights instead
- Elevation through bright borders, not shadows
- Transitions should be gentle, not flashy
- Focus indicators need special attention for visibility

### Neomorphism (alternative to glassmorphism)
- Soft 3D aesthetic through dual shadows (one light, one dark)
- Minimal yet textured
- Fresh, futuristic without loud colors

### Notion/Obsidian Themes
- Transparent callout backgrounds with faint outlines
- Surface layer system (base, surface0, surface1, surface2)
- Muted text hierarchy (text, subtext1, subtext0)
- Helper classes for tables and cards

---

## VII. Recommendations (for scope document)

### 1. Replace Glow System
- Remove all `box-shadow` glows with blur > 4px
- Use solid 2px accent borders for selection
- Use subtle background color shifts instead of luminosity

### 2. Kill the Pulse Animation
- Replace animated incubating indicator with static treatment
- Consider subtle left border or icon treatment instead

### 3. Simplify Glassmorphism
- Reduce or eliminate backdrop-filter blur
- Use solid semi-transparent backgrounds
- Keep subtle border highlights only

### 4. Unified Indicator System
- Choose ONE primary indicator per state (not glow + dots + border)
- State dots are actually good - make them the primary
- Remove redundant visual signals

### 5. Raise Base Lightness
- Increase `--bg-void` from 8% to 10-12%
- Adjust other layers proportionally

### 6. Adopt Linear-style Theming
- Define 3 core colors, derive everything else
- Remove manual color definitions where possible
- Use CSS custom property calculations

---

## VIII. Files Requiring Changes

| File | Lines | Changes |
|------|-------|---------|
| variables.css | 141 | Core tokens, remove glows |
| card.css | 264 | Remove pulse animation |
| deck.css | 509 | Remove state glows |
| spatial.css | 416 | Remove state glows |
| constellation.css | 755 | Remove focus glow |
| list.css | 213 | Update selection state |
| editor.css | 718 | Update focus states |
| flow.css | 582 | Update pulse animations |

**Total:** ~3,600 lines of CSS, estimate 200-300 lines of changes.

---

## IX. Calibration Note

This is a **Magician task** (research, design, CSS refinement) that serves a **Warrior outcome** (better tool for shipping Etymon). The aesthetic matters because loomlib is the instrument for production. A calmer, more refined interface reduces cognitive load during actual work.

Per skill calibration: CSS/TypeScript is fluent capacity. This task is executable.
