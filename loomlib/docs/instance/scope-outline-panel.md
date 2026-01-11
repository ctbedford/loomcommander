---
id: inst-scope-outline-panel
title: "Scope: Outline Panel for Preview Navigation"
type: instance
framework_kind: null
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [scope, ux, editor, outline, navigation, loomlib]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: inst-scope-editor-view
    relation: prior
  - doc: inst-survey-editor-implementation
    relation: informs
downstream: []
---

# Scope: Outline Panel for Preview Navigation

**Date:** 2026-01-11
**Subject:** Interactive document outline for navigating sections in preview mode
**Method:** Scope Method (UX analysis)

---

## Audit

### Current UX Flow

1. User opens document in editor
2. Presses `Cmd+P` or clicks "Preview" button to enter preview mode
3. Rendered markdown displays in scrollable pane
4. To navigate: user scrolls manually or uses browser find (`Cmd+F`)
5. No structural overview of document visible
6. To see structure: user must scroll through entire document

### Key Interactions

| Action | Result |
|--------|--------|
| Cmd+P | Toggle preview (full pane, replaces textarea) |
| Scroll | Move through content linearly |
| Cmd+F | Browser find-in-page (text search) |
| Click heading | Nothing (headings are not interactive) |

### What User Sees

- Full-width preview pane with rendered markdown
- Headings styled with size hierarchy (h1 > h2 > h3 > h4)
- No visible document structure/outline
- No heading anchors or IDs
- Related panel available on right (separate feature)
- Preview scrolls independently

### Document Characteristics (Loomlib-Specific)

Loomlib documents are **research-heavy** with deep structure:
- Typical document: 300-800 lines
- Common structure: 5-15 headings across 3-4 levels
- Frontmatter section at top (always present)
- Named sections follow consistent patterns (Audit, Findings, Requirements, etc.)
- Users frequently jump between sections during review

---

## Affordances

### What the UI Currently Promises

**Preview as reading experience:** Full-width rendering suggests "read from top to bottom" — a linear flow. The absence of navigation reinforces this.

**Scrollbar as only orientation:** The browser scrollbar is the only indicator of position in document. This works for short documents but fails for long ones.

**Headings as visual hierarchy only:** Headings use size/weight to show structure but don't promise interactivity. No cursor change, no underline, no indication they're actionable.

### Mental Models Invoked

- **Book/article reader:** Scroll to read, no jumping
- **PDF viewer without TOC:** Content visible, structure hidden
- **NOT invoked:** Documentation site (sidebar TOC), wiki (linked sections), code editor (outline pane)

### Conventions Followed

- Heading size hierarchy (h1 largest)
- Scrollable content area
- Smooth scroll on keyboard navigation

### Conventions Broken

- **No outline panel** — Expected in markdown editors (Typora, Obsidian, VS Code)
- **No heading anchors** — Expected for internal linking
- **No scroll-spy** — Expected to show current position in outline
- **No keyboard navigation between sections** — Common in document readers

---

## Expectations

### Natural User Flows

**Review document structure:**
1. User opens long document in preview
2. Wants to see "what sections exist?"
3. **Current:** Must scroll through entire document
4. **Expected:** Outline panel shows structure at glance

**Jump to specific section:**
1. User knows section name (e.g., "Requirements")
2. Wants to navigate directly to it
3. **Current:** Cmd+F, type section name, navigate through matches
4. **Expected:** Click section in outline, preview scrolls to it

**Maintain orientation while reading:**
1. User scrolls through long document
2. Loses track of current section
3. **Current:** Scroll up to see nearest heading
4. **Expected:** Outline highlights current section

**Quick reference while editing:**
1. User writes in editor mode, occasionally checks preview
2. Wants to verify structure is correct
3. **Current:** Toggle preview, scroll to check, toggle back
4. **Expected:** Outline visible in both modes (optional)

### Missing Affordances

- **Outline panel toggle** — Show/hide document structure
- **Clickable outline items** — Navigate to sections
- **Active state indicator** — Show current section
- **Hierarchical indentation** — Show nesting visually
- **Keyboard shortcut** — Toggle outline (Cmd+O or similar)

---

## Gaps

| Gap | Type | Description |
|-----|------|-------------|
| No structural overview | Friction | User cannot see document structure without scrolling through entire content |
| No section navigation | Friction | User cannot jump to specific sections; must scroll or use Cmd+F |
| No position awareness | Polish | User loses orientation in long documents; no indication of current section |
| No heading anchors | Friction | Cannot link to specific sections; cannot bookmark positions |
| Outline absent in both modes | Friction | Structure hidden whether editing or previewing |

### Gap Severity Assessment

**Most impactful:** "No structural overview" and "No section navigation" — These are **core** for research documents. Loomlib documents are structured knowledge artifacts; hiding structure undermines their utility.

**Secondary:** "No position awareness" — Nice to have, but user can orient by reading nearby headings.

**Tertiary:** "No heading anchors" — Useful for external linking but not critical for internal navigation.

---

## Invariants/Variants

### Invariants (Cannot Change)

| Constraint | Reason |
|------------|--------|
| Preview pane exists | Foundation for outline to navigate |
| Headings rendered as h1-h6 | Source of outline data |
| marked library parses markdown | Already installed, consistent rendering |
| Related panel pattern exists | Provides proven sidebar UX |
| Preview is full-pane (not side-by-side) | Current design; outline doesn't change this |

### Variants (Can Change)

| Decision | Options |
|----------|---------|
| Outline position | Left sidebar, right sidebar, floating overlay |
| Toggle mechanism | Button, keyboard shortcut, always visible |
| Hierarchy display | Flat list, indented tree, collapsible sections |
| Active state indicator | Highlight, dot, left border, background |
| Scroll behavior | Instant jump, smooth scroll, scroll-to-center |
| Depth limit | Show all levels, max 3-4 levels, configurable |

### False Invariants

| Assumption | Actually... |
|------------|-------------|
| "Outline must be visible only in preview mode" | Could be visible in editor mode too (shows structure while writing) |
| "Outline must be separate from Related panel" | Could share same sidebar space with tabs |
| "Need separate toggle button for outline" | Could auto-show for long documents |

### Hidden Invariants

| Appears flexible but... | Constraint |
|-------------------------|------------|
| "Outline position is open" | Placing on left conflicts with future sidebar navigation |
| "Can show all heading levels" | Deep nesting (h5, h6) creates visual noise |
| "Toggle behavior is open" | Must not conflict with existing Cmd+O (common: open file) |

---

## Requirements

### Must Have (Closes Blocking/Friction Gaps)

- [ ] **Outline panel in preview mode** — *Acceptance: When preview is active, user can toggle outline panel showing document headings*

- [ ] **Clickable heading navigation** — *Acceptance: Clicking an outline item scrolls preview to that heading*

- [ ] **Hierarchical indentation** — *Acceptance: h2 items indented under h1, h3 under h2, etc., showing document structure visually*

- [ ] **Toggle mechanism** — *Acceptance: User can show/hide outline via keyboard shortcut (Cmd+Shift+O) or button*

### Should Have (Improves UX)

- [ ] **Scroll-spy active state** — *Acceptance: As user scrolls preview, outline highlights the currently visible section*

- [ ] **Heading anchors in rendered HTML** — *Acceptance: Each heading gets an id attribute; clicking heading shows anchor link*

- [ ] **Smooth scroll animation** — *Acceptance: Clicking outline item animates scroll (not instant jump)*

- [ ] **Depth limit (h1-h4)** — *Acceptance: Outline shows h1-h4 only; h5/h6 excluded to reduce noise*

### Could Have (Polish)

- [ ] **Outline in editor mode** — Show structure while writing (not just preview)

- [ ] **Collapsible sections** — Allow folding outline sections for complex documents

- [ ] **Keyboard navigation in outline** — Arrow keys to move between outline items, Enter to jump

- [ ] **Search/filter outline** — Type to filter visible outline items

- [ ] **Persist outline state** — Remember if outline was open/closed per document

### Out of Scope

- **Drag-to-reorder sections** — Modifying document structure from outline (complex, not essential)
- **Edit headings from outline** — Inline rename (adds complexity)
- **Outline for editor mode (initial release)** — Start with preview only
- **Export outline as TOC** — Generate markdown TOC from outline
- **Minimap** — Visual document preview (different feature)
- **Custom outline styling** — Theme customization for outline

---

## Design Recommendations

### Position: Right Sidebar

**Rationale:**
- Mirrors Related panel pattern (proven UX)
- Preview content stays left-aligned (natural reading position)
- Future left sidebar reserved for document list/navigation
- Consistent with Typora, Obsidian right-side outline placement

### Visual Style: Match Related Panel

```
┌────────────────────────────────────────┬──────────────┐
│  Preview Content                       │  Outline     │
│                                        │              │
│  # Title                               │  § Title     │
│                                        │    • Section │
│  ## Section 1                          │    • Section │
│  Content here...                       │      ○ Sub   │
│                                        │    • Section │
│  ### Subsection                        │              │
│  More content...                       │              │
└────────────────────────────────────────┴──────────────┘
```

### Width: 160px

**Rationale:**
- Narrower than Related panel (200px) — outline items are shorter
- Wide enough for typical heading text (truncate with ellipsis if needed)
- Leaves ample preview width

### Toggle: Cmd+Shift+O

**Rationale:**
- `O` for Outline (mnemonic)
- `Cmd+O` typically means "Open" — avoid conflict
- `Cmd+Shift+O` follows pattern of secondary toggles
- Alternative: `Cmd+\` (split pane convention)

### Active State: Left Border Accent

**Rationale:**
- Subtle but clear
- Matches VS Code/Obsidian pattern
- Works with dark and light themes
- Doesn't require background color changes

### Animation: Staggered Entry

**Rationale:**
- Match Related panel animation pattern (`rel-node-enter`)
- Provides polish without complexity
- 30ms delay between items, 200ms duration

---

## Implementation Notes

### Data Flow

```
markdown content
      ↓
marked.parse() → HTML string
      ↓
querySelectorAll('h1,h2,h3,h4') → heading elements
      ↓
map to outline items: { level, text, element }
      ↓
render outline panel
      ↓
IntersectionObserver on headings → update active state
```

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Extract headings from | Rendered DOM | More reliable than parsing markdown; handles edge cases |
| Scroll method | `scrollIntoView({ behavior: 'smooth', block: 'start' })` | Native, performant, smooth |
| Active state tracking | IntersectionObserver | More efficient than scroll listener math |
| Heading IDs | Slugified heading text | Required for anchor links; generate if missing |

### Potential Complications

1. **Duplicate heading text** — Multiple "## Notes" sections need unique IDs (append index)
2. **Very long headings** — Need text truncation with tooltip
3. **Rapid scrolling** — IntersectionObserver may fire many times; debounce active state updates
4. **Preview re-render** — On content change, must rebuild outline; headings may have changed

---

## Composition

**Upstream (what informed this scope):**
- [inst-scope-editor-view](inst-scope-editor-view) — Prior scope establishing editor UX patterns
- [inst-survey-editor-implementation](inst-survey-editor-implementation) — Technical patterns for editor features

**Downstream (what this scope enables):**
- Implementation of outline panel feature
- Future: outline in editor mode
- Future: heading anchor links for external sharing

**Related (discovered but not upstream):**
- Web research on Typora, Obsidian, Notion outline patterns
- CSS-Tricks articles on IntersectionObserver scroll-spy

---

## Notes

### Priority Recommendation

1. **Core outline** — Panel, toggle, clickable navigation (addresses friction gaps)
2. **Scroll-spy** — Active state tracking (significant UX improvement)
3. **Polish** — Animations, depth limit, heading anchors
4. **Deferred** — Editor mode outline, collapsible sections

### Testing Approach

1. Open long loomlib document (survey or scope with many sections)
2. Toggle outline → verify all headings appear
3. Click outline item → verify smooth scroll to heading
4. Scroll manually → verify active state updates
5. Toggle preview off → verify outline hides
6. Toggle preview on → verify outline restores state

### Risk Assessment

| Risk | Mitigation |
|------|------------|
| Performance on huge documents | Limit to h1-h4; lazy render if > 50 items |
| Visual clutter with many headings | Depth limit, compact styling |
| Conflicts with Related panel | Can coexist; different toggle shortcuts |
| IntersectionObserver browser support | Modern browsers only (IE not supported anyway) |
