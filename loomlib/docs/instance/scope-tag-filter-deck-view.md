---
id: inst-scope-tag-filter-deck-view
title: "Scope: Tag Filter for Deck View"
type: instance
framework_kind: null
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [scope, ux, deck-view, tags, filtering]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-scope-method
    relation: method
  - doc: inst-survey-tag-filter-system
    relation: prior
  - doc: inst-survey-deck-view-implementation
    relation: prior
downstream: []
---

# Scope: Tag Filter for Deck View

**Date:** 2026-01-10
**Subject:** Adapting the scrolling tag filter system for the grid-based deck view
**Method:** Scope Method (UX requirements)

---

## Audit

### Deck View Current State

The deck view (`deck.ts`) is a grid-based document browser with:

| Component | Current Implementation |
|-----------|------------------------|
| **Lens bar** | 5 lenses (Type, Recency, State, Intent, Lineage) — top row |
| **Search bar** | Text filter — dims non-matching cards |
| **Grid** | Auto-fill columns, section headers for grouped lenses |
| **Status bar** | Document count + active lens — bottom row |
| **Navigation** | Arrow keys, number keys for lens switching |
| **FLIP animation** | Cards animate position on lens change |

### List View Tag Filter (from Survey)

The list view tag filter has:
- Scrolling tag row below state/intent chips
- Selected tag breaks out to static position
- Tags respect current filters (state/intent)
- Single selection model

### Key Difference: Deck View Has Lenses

The deck view's primary filter mechanism is **lens switching**, not chip selection. This changes how tag filtering should integrate:

| List View | Deck View |
|-----------|-----------|
| Filters are additive (state + intent + tag) | Lens is primary, filters are secondary |
| Always visible filter row | Lens bar dominates header |
| Tags filter documents | Tags could filter OR group documents |

---

## Affordances

### What Deck View Promises

| Element | Promise |
|---------|---------|
| Lens bar | "Change how you see all documents" |
| Search bar | "Find specific documents by text" |
| Grid layout | "Browse visually, see many at once" |
| Section headers | "Documents are grouped meaningfully" |

### How Tag Filter Should Integrate

Tag filtering in deck view could serve **two different purposes**:

**Option A: Filter (like search)**
- Tag selection dims non-matching cards (like search does)
- Additive with search and lens
- Non-destructive, reversible

**Option B: Group (like lens)**
- Tag selection becomes a "Tags" lens
- Cards group by tag, with section headers
- Mutually exclusive with other lenses

**Recommendation:** Option A (Filter) — it's simpler, consistent with list view, and doesn't compete with the lens system.

---

## Expectations

### What Users Would Expect

1. **Tag filter visible but not dominant** — lens bar is primary
2. **Tags work with current lens** — "Show me Research intent documents tagged 'oikonomia'"
3. **Tags dim cards, not hide** — consistent with search behavior
4. **Tag selection persists across lens switches** — filter is sticky
5. **Clear way to remove tag filter** — click selected tag, or clear button

### Placement Options

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Type] [Recency] [State] [Intent] [Lineage]     ← Lens bar        │
├─────────────────────────────────────────────────────────────────────┤
│  [Search input____________________________]       ← Search          │
├─────────────────────────────────────────────────────────────────────┤
│  [selected?] | [...scrolling tags...]             ← Tag filter     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                        Grid of cards                                │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  48 documents | State lens                        ← Status bar     │
└─────────────────────────────────────────────────────────────────────┘
```

**Alternative: Combine with search bar**

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Type] [Recency] [State] [Intent] [Lineage]                        │
├─────────────────────────────────────────────────────────────────────┤
│  [Search____] | [selected?] | [...scrolling tags...]               │
├─────────────────────────────────────────────────────────────────────┤
│                        Grid of cards                                │
└─────────────────────────────────────────────────────────────────────┘
```

**Recommendation:** Separate row (first option) — keeps header sections visually distinct, easier to scan.

---

## Gaps

### Deck View-Specific Challenges

| Gap | Impact | Mitigation |
|-----|--------|------------|
| **No chip-style filters currently** | Deck view has no precedent for chip filters | Follow list view patterns, adapt styling |
| **Lens changes re-sort cards** | Tag filter must survive lens switch | Store `activeTagFilter` in view state |
| **Cards dim, not filter** | Unlike list view which hides cards | Apply same `.deck-card--dimmed` class |
| **Section headers** | Should they reflect tag filter? | No — headers show lens grouping, not tag |
| **Tag context depends on lens?** | Do tags change based on active lens? | No — show all tags, let user combine |
| **Keyboard shortcut conflict** | 1-5 for lenses, what for tags? | No shortcut for tags; mouse/touch only |

### Edge Cases

| Case | Behavior |
|------|----------|
| Tag selected + lens changes | Cards re-sort, then dimming re-applies |
| Tag selected + search active | Both filters apply (intersection) |
| 0 documents match tag | All cards dimmed, empty-like state |
| Lens "Lineage" + tag "genealogy" | Both active, show matching lineage docs |

---

## Requirements

### Must Have (Core Integration)

- [ ] **Tag filter row below search bar**
  - *Same scrolling animation as list view*
  - *Acceptance: Tags scroll, pause on hover, select on click*

- [ ] **Tag selection dims non-matching cards**
  - *Use existing `.deck-card--dimmed` class*
  - *Acceptance: Same visual treatment as search mismatch*

- [ ] **Tags persist across lens switches**
  - *Store in `DeckView.activeTagFilter`*
  - *Acceptance: Change lens, tag filter still applied*

- [ ] **Tags work with search**
  - *Both filters apply (logical AND)*
  - *Acceptance: Search "survey" + tag "codebase" shows surveys tagged codebase*

- [ ] **Contextual tags based on lens grouping**
  - *If lens = "Type" and grouping = "Frameworks", show tags from frameworks*
  - *Wait — this contradicts. Keep it simple: show all tags.*
  - *Revised: Show all tags. Let user over-constrain if they want.*

### Should Have (Polish)

- [ ] **Status bar shows active tag**
  - *"48 documents | State lens | #oikonomia"*
  - *Acceptance: User sees all active filters at a glance*

- [ ] **Tag count badges**
  - *Each tag chip shows how many cards it would affect*
  - *Acceptance: "economy (12)" — helps user decide*

- [ ] **Animated dim/undim**
  - *Cards fade smoothly when tag filter changes*
  - *Use existing transition on opacity*

- [ ] **Clear tag from status bar**
  - *Click the tag in status bar to clear*
  - *Acceptance: Easy escape hatch*

### Could Have (Advanced)

- [ ] **"Tags" lens option**
  - *Add 6th lens that groups by tag*
  - *Multi-tag documents appear in multiple sections*
  - *Acceptance: Alternative view organized by tag*

- [ ] **Tag affinity visualization**
  - *When tag selected, other related tags glow*
  - *Based on co-occurrence in documents*
  - *Acceptance: Discovery of tag clusters*

### Out of Scope

- Tag creation/editing from deck view
- Multi-tag selection (single selection only)
- Tag-based FLIP animation (lens changes already animate)
- Custom tag ordering (alphabetical only)

---

## Implementation Notes

### Shared Code with List View

The tag filter mechanics are identical:

```typescript
// Could extract to shared utility
interface TagFilterState {
  activeTagFilter: string | null;
  getContextualTags(docs: Document[]): string[];
  matchesTagFilter(doc: Document): boolean;
}
```

Or duplicate the logic in `DeckView` — simpler given the views are separate classes.

### Integration Points

| File | Changes |
|------|---------|
| `deck.ts` | Add `activeTagFilter`, `renderTagFilter()`, update `applySearch()` |
| `deck.css` | Add `.deck-view__tag-filter` styles |
| (shared) | Could extract tag scroll component, but probably not worth it |

### HTML Structure Addition

```html
<div class="deck-view__tag-filter">
  <span class="deck-view__tag-selected"></span>
  <div class="deck-view__tag-scroll">
    <div class="deck-view__tag-scroll-inner">
      <!-- tag chips -->
    </div>
  </div>
</div>
```

Insert after `.deck-view__search-bar`, before `.deck-view__grid`.

### Filter Application Order

```
1. Get all docs
2. Sort by lens
3. Apply search filter (dims cards)
4. Apply tag filter (dims cards)  ← NEW
5. Render grid
```

Since both search and tag filter use dimming (not removal), the order doesn't matter for visual result. Both use the same `.deck-card--dimmed` class.

---

## Visual Design

### Consistency with List View

| Element | List View | Deck View |
|---------|-----------|-----------|
| Tag chip style | `.list-view__chip` | `.deck-view__chip` (same styles) |
| Scroll animation | Same keyframes | Same keyframes |
| Selected breakout | Same behavior | Same behavior |
| Fade edges | Same gradient | Same gradient |

### Deck View-Specific Adjustments

| Element | Adjustment | Reason |
|---------|------------|--------|
| Row height | 32px (vs 28px in list) | More vertical space available |
| Scroll container | Full width below search | No other elements competing |
| Selected chip | Slightly larger | More prominence in sparse header |

---

## Testing Checklist

- [ ] Tags scroll smoothly in deck view
- [ ] Hover pauses animation
- [ ] Click selects tag, dims non-matching cards
- [ ] Lens switch preserves tag filter
- [ ] Search + tag filter work together
- [ ] Status bar shows active tag
- [ ] Click selected tag clears filter
- [ ] Works with 0, 1, 50 tags
- [ ] Cards with no tags are correctly dimmed when any tag selected
- [ ] FLIP animation still works after tag filter changes

---

## Notes

- The deck view is more visual/spatial than list view — tag filter should be **subtle**, not dominant
- Consider whether tag filter should be **collapsed by default** and expandable (saves vertical space)
- The lens system is the primary organizational principle; tags are secondary filtering
- If users frequently combine tag + lens, might eventually want tag as a proper lens — defer until usage patterns are clear
