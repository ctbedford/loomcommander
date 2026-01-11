---
id: inst-survey-tag-filter-system
title: "Survey: Tag Filter System Implementation"
type: instance
framework_kind: null
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [survey, tags, filtering, list-view, ux, animation]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-survey-method
    relation: method
  - doc: inst-scope-list-view-aesthetic
    relation: prior
downstream: []
---

# Survey: Tag Filter System Implementation

**Date:** 2026-01-10
**Subject:** Implementing a unique tag list with scrolling animation and selection filtering
**Method:** Survey Method (codebase investigation)

---

## Core Sample

### Request Analysis

The user wants a tag filter row below the existing type/state filter chips that:

1. **Extracts unique tags** from all documents
2. **Respects current lens/filters** (e.g., if viewing only "research" intent, show tags from research documents only)
3. **Displays as animating "rollover" scroll** — tags continuously scroll horizontally
4. **Selected tag becomes static** — pinned to the left
5. **Clicking a tag filters** the document list to only those with that tag

### Existing Infrastructure

#### Tag Data Already Available

```typescript
// loomlib/src/data/documents.ts:183-192
export async function getUniqueTags(): Promise<string[]> {
  const docs = await getAllDocs();
  const tags = new Set<string>();
  for (const doc of docs) {
    for (const tag of doc.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}
```

This function already exists but doesn't filter by current view context. It returns ALL tags across ALL documents.

#### Current Filter System

```typescript
// loomlib/src/views/list.ts:14-28
const EXECUTION_STATES: ExecutionState[] = ['pending', 'in_progress', 'completed', 'resolved'];
const INTENTS: DocumentIntent[] = ['research', 'build', 'capture', 'organize', 'produce'];

// Active filters stored as Sets
private activeStateFilters: Set<ExecutionState> = new Set();
private activeIntentFilters: Set<DocumentIntent> = new Set();
```

Tags would need a third filter dimension:
```typescript
private activeTagFilter: string | null = null; // Single selection, not multi-select
```

#### Filter Application Logic

```typescript
// loomlib/src/views/list.ts:141-171
private applyFilters(): void {
  const query = this.searchInput.value.toLowerCase();

  this.filteredDocs = this.docs.filter(doc => {
    // Text search
    if (query) {
      const matchesQuery =
        doc.title.toLowerCase().includes(query) ||
        doc.content.toLowerCase().includes(query) ||
        doc.tags.some(t => t.toLowerCase().includes(query));
      if (!matchesQuery) return false;
    }

    // Execution state filter
    if (this.activeStateFilters.size > 0) {
      const docState = doc.execution_state ?? 'pending';
      if (!this.activeStateFilters.has(docState)) return false;
    }

    // Intent filter
    if (this.activeIntentFilters.size > 0) {
      const docIntent = doc.intent ?? DEFAULT_INTENT[doc.type];
      if (!this.activeIntentFilters.has(docIntent)) return false;
    }

    return true;
  });
  // ...
}
```

Tag filtering would add:
```typescript
// Tag filter (single selection)
if (this.activeTagFilter) {
  if (!doc.tags.includes(this.activeTagFilter)) return false;
}
```

---

## Stratigraphy

### Layer 1: Data Extraction (tags respecting current filters)

**Challenge:** `getUniqueTags()` returns all tags. We need tags from currently visible documents only.

**Solution:** Compute tags from `this.filteredDocs` (before tag filter is applied), or from docs matching state/intent filters (excluding tag filter to avoid chicken-and-egg).

```typescript
private getContextualTags(): string[] {
  // Get docs that match state/intent filters (but ignore tag filter)
  const contextDocs = this.docs.filter(doc => {
    if (this.activeStateFilters.size > 0) {
      const docState = doc.execution_state ?? 'pending';
      if (!this.activeStateFilters.has(docState)) return false;
    }
    if (this.activeIntentFilters.size > 0) {
      const docIntent = doc.intent ?? DEFAULT_INTENT[doc.type];
      if (!this.activeIntentFilters.has(docIntent)) return false;
    }
    return true;
  });

  // Extract unique tags from these docs
  const tags = new Set<string>();
  for (const doc of contextDocs) {
    for (const tag of doc.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}
```

### Layer 2: UI Structure

Current filter HTML structure:

```html
<div class="list-view__filters">
  <div class="list-view__filter-group list-view__filter-group--state"></div>
  <div class="list-view__filter-group list-view__filter-group--intent"></div>
</div>
```

Add a third row for tags:

```html
<div class="list-view__filters">
  <div class="list-view__filter-group list-view__filter-group--state"></div>
  <div class="list-view__filter-group list-view__filter-group--intent"></div>
</div>
<div class="list-view__tag-filter">
  <span class="list-view__tag-selected"></span>  <!-- Static selected tag (or empty) -->
  <div class="list-view__tag-scroll">             <!-- Animating container -->
    <!-- Tag chips injected here -->
  </div>
</div>
```

### Layer 3: Animation Mechanics

**"Rollover scroll"** — Tags scroll left continuously like a ticker. User can:
- Let it scroll to discover tags
- Click any tag to select it
- Clicking pauses or the selected tag "pulls out" to the static left position

**Implementation Options:**

**Option A: CSS `marquee` / `animation`**
```css
.list-view__tag-scroll {
  overflow: hidden;
  white-space: nowrap;
}

.list-view__tag-scroll-inner {
  display: inline-block;
  animation: scroll-left 20s linear infinite;
}

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

Duplicate tags once so the loop is seamless:
```
[tag1] [tag2] [tag3] [tag1] [tag2] [tag3]
                     ↑ when this reaches 0, reset to start
```

**Option B: JavaScript `requestAnimationFrame`**
More control over speed, pause on hover, resume after selection. Heavier but more flexible.

**Option C: CSS scroll-snap + JS nudge**
Horizontal scroll container with periodic scroll nudges.

**Recommendation:** Option A (CSS animation) for simplicity, with hover pause via:
```css
.list-view__tag-scroll:hover .list-view__tag-scroll-inner {
  animation-play-state: paused;
}
```

### Layer 4: Selection Behavior

When a tag is clicked:

1. **Selected tag moves to static position** on the left
2. **Tag filter is applied** to document list
3. **Remaining tags continue scrolling** (minus the selected one)
4. **Click selected tag again to deselect** (clears filter)

```typescript
private activeTagFilter: string | null = null;

private selectTag(tag: string): void {
  if (this.activeTagFilter === tag) {
    // Deselect
    this.activeTagFilter = null;
  } else {
    this.activeTagFilter = tag;
  }
  this.renderTagFilter();  // Re-render tag row
  this.applyFilters();     // Re-filter documents
}
```

### Layer 5: CSS Structure

```css
.list-view__tag-filter {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
  height: 28px;  /* Fixed height */
  overflow: hidden;
}

.list-view__tag-selected {
  flex-shrink: 0;
  /* Same styling as active chip */
}

.list-view__tag-selected:empty {
  display: none;
}

.list-view__tag-scroll {
  flex: 1;
  overflow: hidden;
  position: relative;
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );  /* Fade edges */
}

.list-view__tag-scroll-inner {
  display: inline-flex;
  gap: var(--space-xs);
  animation: tag-scroll 30s linear infinite;
}

.list-view__tag-scroll:hover .list-view__tag-scroll-inner {
  animation-play-state: paused;
}

@keyframes tag-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

---

## Findings

### 1. Tag Data Pipeline Exists

`getUniqueTags()` in `documents.ts` already extracts unique tags. Needs modification or a parallel function to accept a document subset.

### 2. Filter System is Composable

State and intent filters use the same pattern (Set of active values, toggle function, applyFilters rerun). Tag filter follows the same shape but is single-select (string | null) not multi-select.

### 3. Animation is CSS-Native

CSS `animation` with `translateX(-50%)` on a duplicated tag list creates infinite scroll. No JavaScript loop needed. Pause on hover is one line.

### 4. Selected Tag as "Breakout" Element

The selected tag should visually "break out" of the scroll and anchor left. This is a layout change, not just styling:
- Before selection: `[scroll container with all tags]`
- After selection: `[selected chip] | [scroll container minus selected]`

### 5. Fade Edges Give Infinite Feel

`mask-image: linear-gradient(...)` fades left/right edges, hiding the loop seam and creating a "window into infinite scroll" aesthetic.

### 6. Performance Considerations

- **Tag count:** Typical loomlib has 20-50 unique tags — no virtualization needed
- **Animation:** CSS transforms are GPU-accelerated, 60fps trivial
- **Re-render:** Only on filter change, not per-frame

### 7. Integration Points

| File | Changes Needed |
|------|----------------|
| `list.ts` | Add `activeTagFilter`, `getContextualTags()`, `renderTagFilter()`, update `applyFilters()` |
| `list.css` | Add `.list-view__tag-filter`, `.list-view__tag-scroll`, animation keyframes |
| `documents.ts` | Optional: add `getTagsFromDocs(docs: Document[])` helper |

### 8. Edge Cases

- **No tags match current filters:** Hide tag row or show "No tags" message
- **Only one tag:** Still scrolls (just slower/single item loop)
- **Very long tag:** Truncate with ellipsis, full text on hover
- **Tag with special characters:** Already handled (tags are plain strings)

---

## Implementation Sketch

```typescript
// In ListView class

private activeTagFilter: string | null = null;
private tagScrollContainer: HTMLElement | null = null;

// After existing renderFilterChips(), add:
private renderTagFilter(): void {
  const tags = this.getContextualTags();
  const tagFilter = this.container.querySelector('.list-view__tag-filter');
  if (!tagFilter) return;

  const selectedEl = tagFilter.querySelector('.list-view__tag-selected')!;
  const scrollEl = tagFilter.querySelector('.list-view__tag-scroll')!;

  // Render selected tag (if any)
  if (this.activeTagFilter) {
    selectedEl.innerHTML = `
      <button class="list-view__chip list-view__chip--tag list-view__chip--active" data-tag="${this.activeTagFilter}">
        ${this.activeTagFilter}
      </button>
    `;
    selectedEl.querySelector('button')?.addEventListener('click', () => this.selectTag(this.activeTagFilter!));
  } else {
    selectedEl.innerHTML = '';
  }

  // Filter out selected tag from scroll
  const scrollTags = tags.filter(t => t !== this.activeTagFilter);

  if (scrollTags.length === 0) {
    scrollEl.innerHTML = '';
    return;
  }

  // Duplicate for seamless loop
  const tagsHtml = scrollTags.map(t => `
    <button class="list-view__chip list-view__chip--tag" data-tag="${t}">${t}</button>
  `).join('');

  scrollEl.innerHTML = `
    <div class="list-view__tag-scroll-inner">
      ${tagsHtml}
      ${tagsHtml}
    </div>
  `;

  // Bind click handlers
  scrollEl.querySelectorAll('.list-view__chip--tag').forEach(chip => {
    chip.addEventListener('click', () => {
      const tag = (chip as HTMLElement).dataset.tag!;
      this.selectTag(tag);
    });
  });
}

private getContextualTags(): string[] {
  // Filter by state/intent but NOT by tag (avoid circular)
  const contextDocs = this.docs.filter(doc => {
    if (this.activeStateFilters.size > 0) {
      const docState = doc.execution_state ?? 'pending';
      if (!this.activeStateFilters.has(docState)) return false;
    }
    if (this.activeIntentFilters.size > 0) {
      const docIntent = doc.intent ?? DEFAULT_INTENT[doc.type];
      if (!this.activeIntentFilters.has(docIntent)) return false;
    }
    return true;
  });

  const tags = new Set<string>();
  for (const doc of contextDocs) {
    for (const tag of doc.tags) tags.add(tag);
  }
  return Array.from(tags).sort();
}

private selectTag(tag: string): void {
  this.activeTagFilter = this.activeTagFilter === tag ? null : tag;
  this.renderTagFilter();
  this.applyFilters();
}

// Modify applyFilters to include tag:
private applyFilters(): void {
  // ... existing logic ...

  // Add after intent filter:
  if (this.activeTagFilter) {
    if (!doc.tags.includes(this.activeTagFilter)) return false;
  }

  // Also re-render tag filter (tags may have changed)
  this.renderTagFilter();
}
```

---

## Composition

### Upstream (What Informed This)
- `fw-survey-method`: structural investigation approach
- `inst-scope-list-view-aesthetic`: prior UX analysis, filter controls as a "should have"

### Downstream (What This Enables)
- Direct implementation of tag filtering in `list.ts`
- Scope document for animation polish (if needed)
- Could extend to other views (deck, spatial) with same tag data

### Warrior Assessment
This is Magician work (research/architecture) that directly enables Warrior work (implementation). The implementation sketch is concrete enough to code from.
