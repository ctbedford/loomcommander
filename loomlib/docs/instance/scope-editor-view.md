---
id: inst-scope-editor-view
title: "Scope: Editor View"
type: instance
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [scope, ux, editor, writing, loomlib, resolved]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-scope-method
    relation: method
downstream: []
---

# Scope: Editor View

**Date:** 2026-01-07
**Subject:** Loomlib markdown editor UX
**Method:** Scope Method (UX analysis)

---

## Audit

### Current UX Flow

1. User clicks document in list or constellation view
2. Editor loads with document content in textarea
3. Header shows: ☰ (list) | ◎ (constellation) | **Title** | save status | [Triage]
4. Meta bar shows: type icon | type label | status badge | tags
5. User types in monospace textarea
6. After 500ms pause, content auto-saves
7. Save status cycles: ● (unsaved) → Saving... → Saved → (fades)
8. To return: click ☰ or press Escape

### Key Interactions

| Action | Result |
|--------|--------|
| Type | Content updates, triggers autosave |
| Tab | Inserts tab character (overrides browser default) |
| Escape | Returns to list view |
| Click ☰ | Returns to list view |
| Click ◎ | Opens constellation view |
| Click Triage | Opens triage modal |

### What User Sees

- Clean, minimal interface
- Monospace font, no formatting toolbar
- Title auto-derived from first line
- Tags visible but not editable inline
- Status visible but not changeable inline

---

## Affordances

### What the UI Promises

**Minimalist writing focus:** The lack of toolbars and the full-width textarea promise distraction-free writing. This is the "textarea that feels like paper" ethos.

**Markdown-native:** Monospace font signals "this is code/markdown" — users expect markdown syntax to work.

**Auto-save:** The save indicator promises "you don't need to think about saving."

**Quick navigation:** Two nav buttons promise fast switching between views.

**Triage access:** The button promises "you can classify this document."

### Visual Hierarchy

1. **Textarea** — dominates, correctly emphasized as primary
2. **Title** — centered, establishes identity
3. **Meta bar** — secondary, read-only context
4. **Nav buttons** — tertiary, utility

### Conventions Followed

- Escape to go back (modal/overlay convention)
- Tab for indentation (code editor convention)
- Autosave (modern document editor convention)
- Status badges with color coding

### Conventions Broken

- No Cmd+S (save is automatic, but muscle memory expects it)
- No undo/redo buttons (relies on browser/system)
- No markdown preview toggle (common in markdown editors)
- Tags not editable inline (breaks "edit in place" expectation)

---

## Expectations

### Natural User Flows

**Write and refine:**
1. Open document → write → see title update → close
2. Expectation: content is safe, I can return to it

**Quick metadata adjustment:**
1. Open document → realize wrong type/tags → want to change
2. Current: must click Triage button, interact with modal
3. Expectation: could edit inline

**Preview while writing:**
1. Write markdown → want to see how it renders
2. Current: no preview
3. Expectation: preview pane or toggle

**Focus mode:**
1. Want maximum writing space
2. Current: CSS exists (`.editor-view--focus`) but no way to trigger
3. Expectation: keyboard shortcut or button to enter focus mode

**Word count:**
1. Writing long-form → want to know length
2. Current: no word/character count
3. Expectation: subtle count somewhere

### Missing Affordances

- **Preview toggle** — markdown editors universally have this
- **Focus mode trigger** — the CSS exists, no UI to activate it
- **Keyboard shortcuts help** — no indication of available shortcuts
- **Cmd+S acknowledgment** — users will press it; could show "Auto-saved"
- **Inline tag editing** — tags are read-only in editor
- **Export options** — no way to export the document

---

## Gaps

| Gap | Type | Status | Description |
|-----|------|--------|-------------|
| No preview | Friction | **Closed** | ~~User cannot see rendered markdown while writing~~ |
| Focus mode inaccessible | Friction | **Closed** | ~~CSS exists but no UI to trigger distraction-free mode~~ |
| No Cmd+S handling | Polish | **Closed** | ~~Users press Cmd+S out of habit; no feedback~~ |
| No word count | Polish | Open | Common need for writers, absent |
| Tags read-only | Friction | Deferred | Must open separate modal to edit tags |
| Status read-only | Friction | Deferred | Must open triage modal to change status |
| No keyboard shortcut hints | Polish | Open | User must discover shortcuts by accident |
| No export | Friction | Open | Cannot export document to file |
| No focus mode exit | Polish | **Closed** | ~~If focus mode existed, how would user exit?~~ |

---

## Requirements

### Must Have (Blocking)

*None — editor is functional for basic writing*

### Should Have (Friction)

- [x] **Markdown preview toggle** — *Acceptance: User can press Cmd+P or click button to see rendered preview alongside or instead of source* **Done: Cmd+P toggles side-by-side preview**

- [x] **Focus mode activation** — *Acceptance: User can press Cmd+. or click button to hide chrome and maximize writing space; Escape exits focus mode* **Done: Cmd+. toggles, Escape exits**

- [ ] **Inline status change** — *Acceptance: Clicking status badge in meta bar opens dropdown to change status without full triage modal* *(Deferred)*

- [ ] **Inline tag editing** — *Acceptance: Clicking tags area allows adding/removing tags without triage modal* *(Deferred)*

### Could Have (Polish)

- [x] **Cmd+S feedback** — *Acceptance: Pressing Cmd+S shows "Auto-saved" toast or flash, does not prevent default* **Done: Flashes "Saved" indicator**

- [ ] **Word/character count** — *Acceptance: Subtle count in corner or status bar showing word count*

- [ ] **Keyboard shortcuts overlay** — *Acceptance: Cmd+/ or ? shows overlay of available shortcuts*

- [ ] **Export to file** — *Acceptance: Cmd+E or button exports document as .md file to downloads*

### Out of Scope

- WYSIWYG editing (violates minimalist ethos)
- Formatting toolbar (ditto)
- Split-pane editing (complex, could be future)
- Collaboration features (multiplayer)
- Version history (requires backend)
- Spellcheck beyond browser default
- Custom themes for editor (beyond dark/light)
- Vim keybindings (nice but not core)

---

## Notes

### Priority Recommendation

1. **Focus mode** — easiest, CSS already exists, just add trigger
2. **Markdown preview** — most requested feature class for markdown editors
3. **Inline status/tags** — reduces friction of triage flow
4. **Polish items** — can be done incrementally

### Dependencies

- Focus mode: none (self-contained)
- Preview: may need markdown parser (or reuse existing)
- Inline status: needs dropdown component
- Inline tags: needs tag input component (chips with autocomplete)

### Risks

- Preview toggle adds cognitive load (two modes to understand)
- Inline editing may make triage modal feel redundant
- Feature creep could undermine minimalist promise

### The Core Tension

The editor promises "textarea that feels like paper" — minimal, focused, no chrome. But users have muscle memory from other tools. The question is: which expectations to honor (preview, word count) and which to reject (toolbars, WYSIWYG)?

Recommendation: Honor expectations that serve writing (preview, focus mode) but reject chrome that interrupts it (toolbars, formatting buttons). The goal is *capability without visibility* — power accessed through keyboard, not buttons.

---

## Resolution

**Date:** 2026-01-07
**Outcome:** Core friction gaps closed. Polish items remain open.

### What Was Built

| Feature | Shortcut | Behavior |
|---------|----------|----------|
| Focus Mode | `Cmd+.` | Hides header/meta, centers textarea at 720px max-width |
| Focus Exit | `Escape` | Exits focus mode (then navigates if pressed again) |
| Preview | `Cmd+P` | Side-by-side rendered markdown, live updates |
| Preview Button | Click | Header button toggles preview (highlighted when active) |
| Save Feedback | `Cmd+S` | Flashes "Saved" indicator |

### Gap Summary

- **4 gaps closed:** Preview, focus mode, focus exit, Cmd+S
- **2 gaps deferred:** Inline status, inline tags (triage modal sufficient)
- **3 gaps open:** Word count, shortcuts overlay, export

### The Core Tension — Resolved

The recommendation was followed: *capability without visibility*. All new features are keyboard-driven with minimal UI additions (one "Preview" button). The minimalist ethos is preserved while honoring user expectations for preview and focus mode.

### Related Documents

- `inst-survey-editor-implementation` — Technical implementation survey
