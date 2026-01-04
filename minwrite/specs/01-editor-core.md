# Spec: Editor Core

## Goal
A textarea that feels like paper. Nothing else on screen.

## Requirements
- [ ] Full viewport textarea (100vw x 100vh minus minimal padding)
- [ ] Monospace font, ~18px, high line-height (1.6+)
- [ ] Auto-save to localStorage on every keystroke (debounced 500ms)
- [ ] Load saved content on page load
- [ ] Tab key inserts 2 spaces (not focus change)
- [ ] No visible UI elements (no buttons, menus, toolbars)

## Files
- `src/editor/index.ts` - Editor class, handles textarea + persistence
- `src/editor/storage.ts` - localStorage wrapper with typed API
- `src/ui/styles.css` - Typography and layout

## Test: Done When
1. `cd minwrite && npm run dev`
2. Type text
3. Refresh page
4. Text persists

## Anti-requirements
- No markdown rendering in this phase
- No multiple documents
- No undo beyond browser default
