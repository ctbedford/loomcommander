---
id: inst-survey-editor-implementation
title: "Survey: Editor Implementation Path"
type: instance
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [survey, implementation, editor, loomlib, resolved]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-survey-method
    relation: method
downstream: []
---

# Survey: Editor Implementation Path

**Date:** 2026-01-07
**Subject:** How to implement editor enhancements from scope-editor-view
**Method:** Survey Method (static analysis)

---

## Survey

Relevant files for implementation:
- `src/views/editor.ts` — The editor component (231 lines)
- `src/ui/editor.css` — Editor styles, includes unused `.editor-view--focus`
- `src/components/triage-modal.ts` — Pattern for modal/picker components
- `src/components/lens-picker.ts` — Pattern for dropdown pickers (125 lines)
- `src/layout/shell.ts` — Keyboard shortcut handling pattern
- `src/main.ts` — Global keyboard shortcuts pattern
- `package.json` — No markdown parser dependency currently

---

## Core Sample

### Entry Points

**Editor instantiation:** `shell.ts:50`
```typescript
this.editor = new Editor(editorContainer, {
  onBack: () => this.showList(),
  onTriage: (docId) => this.options.onTriageRequest?.(docId),
  onGoToList: () => this.showList(),
  onGoToConstellation: () => this.showConstellation(),
});
```

**Keyboard handling:** Two layers
1. `editor.ts:139` — Local (Tab for indent)
2. `shell.ts:66` — Global (Cmd+Shift+V, Cmd+N, Cmd+I, Escape)

### Existing Patterns

**Component pattern:** Class with constructor, render methods, event binding
- See `LensPicker` for dropdown component pattern
- See `TriageModal` for modal pattern

**State management:** Instance properties, re-render on change
- `LensPicker.selectedIndex`, `LensPicker.activeLens`
- `TriageModal.selectedType`, `TriageModal.selectedStatus`

**CSS class toggling:** `classList.add/remove` for visibility
- `.lens-picker--visible`
- `.triage-modal-backdrop--visible`
- `.editor-view--focus` (exists but unused!)

### Key Abstractions

**No external markdown parser.** Would need to add dependency for preview.

Options:
1. `marked` — Popular, 28kb minified
2. `micromark` — Smaller, 14kb
3. Native regex — Minimal but limited
4. Iframe sandbox — Most isolated

---

## Stratigraphy

### Call Hierarchy for Keyboard Shortcuts

```
document.addEventListener('keydown')
  ├── main.ts:84 (Cmd+O, Cmd+Shift+L)
  └── shell.ts:58 (Cmd+Shift+V, Cmd+N, Cmd+I, Escape)
        └── this.handleGlobalKeydown
              └── editor.ts:139 (Tab only, local)
```

**Gap:** No Cmd+. or Cmd+P handled anywhere.

### State Location for Focus Mode

**CSS ready:** `.editor-view--focus` already defined in editor.css:234
```css
.editor-view--focus .editor-view__header {
  display: none;
}
.editor-view--focus .editor-view__textarea {
  padding: var(--space-xl);
  max-width: 720px;
  margin: 0 auto;
}
```

**Missing:** Toggle mechanism and state tracking in editor.ts

### Inline Editing Boundaries

**Current flow:**
1. Click status badge in meta bar → nothing happens (read-only)
2. Click Triage button → opens full modal

**Proposed inline flow:**
1. Click status badge → show dropdown (like LensPicker)
2. Select new status → save immediately

---

## Findings

The editor implementation path is straightforward because the codebase already has patterns for every feature:

- **Focus mode:** CSS exists, just add `isFocusMode` state and `Cmd+.` handler to toggle `editor-view--focus` class
- **Status dropdown:** Clone `LensPicker` pattern, bind to status badge click
- **Tag inline edit:** More complex — need chip input component (new pattern)
- **Preview:** Requires external dependency — most complex addition

The codebase follows a consistent component pattern: class with constructor, private state, `render()` method, event binding. All four features can follow this pattern.

### Key Files

| File | Role | Changes Needed |
|------|------|----------------|
| `src/views/editor.ts` | Editor component | Add focus toggle, preview pane, inline pickers |
| `src/ui/editor.css` | Editor styles | Add preview styles, focus mode already exists |
| `src/components/status-picker.ts` | **New** | Dropdown for status (clone LensPicker) |
| `src/components/tag-input.ts` | **New** | Chip input for tags |
| `package.json` | Dependencies | Add markdown parser if preview needed |

### Dependencies

**Internal:**
- `documents.ts::updateDocumentMetadata` — Already exists for saving inline changes
- `types.ts::DocumentStatus` — Already has status enum

**External (new):**
- Markdown parser for preview (marked, micromark, or none if skip preview)

### Complexity Hotspots

1. **Tag inline editing** — No existing chip input pattern, must build new component
2. **Preview sync** — Need to decide: side-by-side, toggle, or live preview
3. **Keyboard shortcut conflicts** — Cmd+. and Cmd+P must not conflict with browser

---

## Implementation Plan

### Phase 1: Focus Mode (Easiest)
**Effort:** 30 minutes
**Files:** editor.ts, editor.css (already done)

1. Add `private isFocusMode = false` to Editor class
2. Add `Cmd+.` handler in `handleKeydown`:
   ```typescript
   if ((e.metaKey || e.ctrlKey) && e.key === '.') {
     e.preventDefault();
     this.toggleFocusMode();
   }
   ```
3. Add `toggleFocusMode()`:
   ```typescript
   private toggleFocusMode(): void {
     this.isFocusMode = !this.isFocusMode;
     this.container.classList.toggle('editor-view--focus', this.isFocusMode);
   }
   ```
4. Add Escape handler to exit focus mode before navigating

### Phase 2: Inline Status Picker
**Effort:** 1-2 hours
**Files:** editor.ts, new status-picker.ts, editor.css

1. Create `StatusPicker` component (clone LensPicker pattern)
   - Same dropdown structure
   - Options from `STATUS_OPTIONS` (already in triage-modal.ts)
2. In editor.ts:
   - Add click handler to `.editor-view__status` badge
   - On selection, call `updateDocumentMetadata()` and re-render meta bar
3. Add CSS for status picker positioning

### Phase 3: Cmd+S Acknowledgment (Polish)
**Effort:** 15 minutes
**Files:** editor.ts

1. Add `Cmd+S` handler:
   ```typescript
   if ((e.metaKey || e.ctrlKey) && e.key === 's') {
     e.preventDefault();
     this.showSaveStatus('saved');  // Flash "Saved" indicator
   }
   ```

### Phase 4: Markdown Preview (Most Complex)
**Effort:** 3-4 hours
**Files:** editor.ts, editor.css, package.json

1. Add dependency: `npm install marked` (or micromark)
2. Add `private showPreview = false` state
3. Add `Cmd+P` handler to toggle
4. Modify render to include preview pane:
   ```html
   <div class="editor-view__content">
     <textarea class="editor-view__textarea"></textarea>
     <div class="editor-view__preview"></div>
   </div>
   ```
5. Add CSS for side-by-side or stacked layout
6. Add `updatePreview()` method called on input

### Phase 5: Tag Inline Editing (Deferred)
**Effort:** 4+ hours
**Files:** new tag-input.ts, editor.ts, editor.css

This is most complex because:
- Need chip/pill UI with X buttons
- Need autocomplete from existing tags
- Need keyboard navigation within chips
- Consider deferring or using triage modal

---

## Open Questions

- **Preview toggle vs split:** Should preview replace textarea or show alongside?
- **Preview live vs manual:** Update on every keystroke or on toggle/button?
- **Tag input complexity:** Worth building or keep using triage modal?
- **Mobile:** Does focus mode work on mobile? Touch targets for inline pickers?
- **Undo across saves:** If inline picker saves immediately, can user undo?

---

## Recommended Order

1. **Focus mode** — Trivial, immediate value, CSS already exists
2. **Cmd+S** — Trivial, respects user muscle memory
3. **Status picker** — Moderate, high value, proven pattern
4. **Preview** — Complex but expected, requires dependency decision
5. **Tag input** — Defer, triage modal works fine

---

## Resolution

**Date:** 2026-01-07
**Status:** Phases 1, 3, 4 complete. Phases 2, 5 deferred.

### Implemented

| Phase | Feature | Status | Notes |
|-------|---------|--------|-------|
| 1 | Focus Mode | **Done** | `Cmd+.` toggles, `Escape` exits, auto-exits on hide/load |
| 3 | Cmd+S Feedback | **Done** | Flashes "Saved" indicator |
| 4 | Markdown Preview | **Done** | `Cmd+P` or button toggles side-by-side preview |

### Files Changed

- `src/views/editor.ts` — Added `isFocusMode`, `showPreview`, keyboard handlers, preview rendering
- `src/ui/editor.css` — Added preview pane styles, actions group, updated focus mode for new structure
- `package.json` — Added `marked` dependency

### Keyboard Shortcuts Added

| Shortcut | Action |
|----------|--------|
| `Cmd+.` | Toggle focus mode (hide chrome, center textarea) |
| `Cmd+S` | Flash "Saved" indicator (muscle memory acknowledgment) |
| `Cmd+P` | Toggle markdown preview (side-by-side) |
| `Escape` | Exit focus mode (then navigate if not in focus mode) |

### Open Questions Resolved

- **Preview toggle vs split:** Side-by-side (both visible simultaneously)
- **Preview live vs manual:** Live update on every keystroke
- **Dependency choice:** `marked` (GFM support, widely used)

### Remaining Work

| Phase | Feature | Status | Recommendation |
|-------|---------|--------|----------------|
| 2 | Inline Status Picker | Deferred | Clone LensPicker pattern when needed |
| 5 | Inline Tag Editing | Deferred | Triage modal sufficient for now |

### Bundle Impact

- CSS: +2.7kb (preview pane styling)
- JS: +42kb (marked library)
- Total bundle: 230kb (was 188kb)
