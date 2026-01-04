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
