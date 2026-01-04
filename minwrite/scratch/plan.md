# Build Plan: Minimalist Writing App

## Phase 1: Foundation (get something on screen)
1. **Editor core** - Single textarea, full viewport, monospace font
2. **Document model** - Plain text first, localStorage persistence
3. **Minimal UI** - No chrome. Just the textarea. Dark/light theme via CSS vars.

## Phase 2: Markdown
4. **Parser** - Markdown → AST (use marked or write minimal parser)
5. **Preview pane** - Side-by-side or toggle, not inline WYSIWYG
6. **Syntax hints** - Subtle color for headers/bold/links in editor

## Phase 3: Library
7. **Document list** - Sidebar, show first line as title
8. **Persistence** - IndexedDB for multiple docs
9. **Search** - Full-text across all docs

## Phase 4: Export
10. **HTML export** - Clean, printable
11. **PDF export** - Via browser print or jsPDF
12. **Plain text** - Strip markdown, just prose

## Tech Stack (minimal)
- Vite + TypeScript (strict mode, no React in editor core)
- CSS custom properties for theming
- IndexedDB for storage (no backend)
- Zero runtime dependencies in editor module

## First Commit Target
- `src/editor/index.ts` - textarea that auto-saves to localStorage
- `src/editor/storage.ts` - localStorage wrapper with typed API
- `src/ui/styles.css` - typography-first styles
- `index.html` - loads editor, nothing else

## Verify Completion
`cd minwrite && npm run build` succeeds, opens in browser, typing persists on refresh.

---

# Current Task: Help Overlay

## Approach
Press `?` to show/hide a minimal shortcut overlay. Zero footprint otherwise.

## Changes

### 1. `src/ui/styles.css`
- Add `.help-overlay` styles (centered, semi-transparent bg, matches theme)
- Hidden by default, shown with `.visible` class

### 2. `src/editor/index.ts`
- Create overlay DOM element with shortcut list
- `?` toggles overlay visibility
- `Escape` dismisses overlay
- Overlay lists: `?` Help, `Cmd+Shift+L` Toggle theme

## Done When
1. Press `?` → overlay appears
2. Press `?` or `Escape` → overlay hides
3. Works in both light/dark themes
4. Build passes

---

# Previous: Dark/Light Mode

## Approach
CSS custom properties + system preference + keyboard toggle. No visible UI.

## Changes

### 1. `src/ui/styles.css`
- Replace hardcoded colors with CSS custom properties
- Add `:root` light theme (current colors)
- Add `[data-theme="dark"]` dark theme
- Use `@media (prefers-color-scheme: dark)` as system default

### 2. `src/editor/storage.ts`
- Add `loadTheme()` / `saveTheme()` functions
- Key: `minwrite:theme` (values: `light`, `dark`, or absent for system)

### 3. `src/editor/index.ts`
- Add `Cmd/Ctrl+Shift+L` keyboard shortcut to toggle
- Apply saved theme on load

## Colors
| Token       | Light     | Dark      |
|-------------|-----------|-----------|
| --bg        | #fafafa   | #1a1a1a   |
| --text      | #1a1a1a   | #e5e5e5   |
| --placeholder | #999    | #666      |

## Done When
1. Fresh load respects system preference
2. `Cmd+Shift+L` toggles light/dark
3. Preference persists on refresh
4. `npm test` passes
