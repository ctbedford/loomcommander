# Current Task: Sidebar Content Reflow Animation

## Goal
When the Related sidebar opens/closes, the editor/preview content should smoothly animate its width to accommodate, creating a beautiful text reflow effect rather than the current overlay behavior.

## Survey Findings

### Current State
- **Sidebar**: Absolutely positioned, overlays content
- **Width transition**: `width 0.25s ease` (0 → 200px)
- **Problem**: Content doesn't reflow — sidebar just covers it

### Desired State
- Content area width **shrinks** when sidebar opens
- Text reflows smoothly with line-by-line animation
- Sidebar slides in from right
- Beautiful, cohesive motion design

## Implementation Approach

### Option A: CSS Grid Animation (Recommended)
Use CSS Grid for layout with `grid-template-columns` animation:

```css
.editor-view__content {
  display: grid;
  grid-template-columns: 1fr 0px;
  transition: grid-template-columns 0.3s ease-out;
}

.editor-view--related .editor-view__content {
  grid-template-columns: 1fr 200px;
}
```

**Pros**: Native browser handling of reflow, hardware-accelerated, clean CSS
**Cons**: Grid column animation has limited browser support for `fr` units

### Option B: Margin/Padding Animation
Animate content area's right margin/padding:

```css
.editor-view__content {
  margin-right: 0;
  transition: margin-right 0.3s ease-out;
}

.editor-view--related .editor-view__content {
  margin-right: 200px;
}
```

**Pros**: Wide browser support, simple implementation
**Cons**: Sidebar still needs positioning adjustment

### Option C: Flexbox with Width Animation (Selected)
Keep flexbox, animate sidebar width while content uses `flex: 1`:

```css
.editor-view__content {
  display: flex;
}

.editor-view__textarea,
.editor-view__preview {
  flex: 1;
  min-width: 0;
  transition: none; /* Text reflows naturally */
}

.editor-view__related {
  width: 0;
  flex-shrink: 0;
  transition: width 0.3s ease-out;
}

.editor-view--related .editor-view__related {
  width: 200px;
}
```

This works because `flex: 1` makes content fill remaining space, and animating the sibling's width causes natural reflow.

## Implementation Steps

### Step 1: CSS Layout Changes (`loomlib/src/ui/editor.css`)

1. Remove absolute positioning from `.editor-view__related`
2. Change related panel to `flex-shrink: 0` with animated width
3. Ensure textarea/preview use `flex: 1` to fill remaining space
4. Add smooth transition timing

Key changes:
```css
/* Content area */
.editor-view__content {
  flex: 1;
  display: flex;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

/* Main editing areas share space */
.editor-view__textarea,
.editor-view__preview {
  flex: 1;
  min-width: 0;
}

/* Sidebar is part of flex, not absolute */
.editor-view__related {
  flex-shrink: 0;
  width: 0;
  overflow: hidden;
  opacity: 0;
  transition:
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease;
}

.editor-view--related .editor-view__related {
  width: 200px;
  opacity: 1;
}
```

### Step 2: Preview Mode Adjustment
Ensure preview mode positioning works with the new layout. The preview and textarea swap via opacity/transform but should both respect the sidebar space.

### Step 3: Focus Mode
Verify focus mode still hides sidebar correctly.

### Step 4: Polish Animation Curve
Use a custom easing curve for natural motion:
- `cubic-bezier(0.4, 0, 0.2, 1)` — Material Design standard easing
- Slightly slower duration (0.3s) for readable text reflow

### Step 5: Staggered Node Animation
Keep existing node entrance animations but adjust timing:
```css
.editor-view__rel-node {
  animation-delay: calc(100ms + var(--rel-index) * 30ms);
}
```
Start node animations 100ms after sidebar begins opening.

## File Changes

| File | Change |
|------|--------|
| `loomlib/src/ui/editor.css` | Modify sidebar layout from absolute to flex |

## Testing

1. `cd loomlib && npm run dev`
2. Open editor with a document
3. Toggle related panel (Cmd+/)
4. Verify:
   - Text reflows smoothly as sidebar opens
   - No layout jump or flicker
   - Related nodes animate in after sidebar opens
   - Focus mode still works
   - Preview mode works correctly with sidebar

## Design Token Alignment

Use existing timing variables where appropriate:
- `--transition-normal: 200ms ease` for opacity
- `--transition-slow: 300ms ease-out` for width

Or introduce new:
- `--transition-reflow: 0.3s cubic-bezier(0.4, 0, 0.2, 1)`

---

# Previous Task: GFM Table Rendering

## Goal
Render GFM tables in markdown preview. Tables pasted from Claude render as tables, not source.

## Implementation Steps

### Step 1: Table Parser (`src/editor/markdown.ts`)
Add GFM table detection and rendering to existing parser:

```ts
// Detect table block: lines starting with |, separator row with |---|
function parseTable(lines: string[]): { html: string; consumed: number } | null

// Table structure:
// | Header 1 | Header 2 |
// |----------|----------|
// | Cell 1   | Cell 2   |
```

Logic:
1. Detect first row starts with `|`
2. Verify second row is separator: `|---|---|` (with optional alignment `:---`, `:---:`, `---:`)
3. Consume subsequent rows starting with `|`
4. Parse alignment from separator row
5. Emit `<table><thead>...</thead><tbody>...</tbody></table>`

### Step 2: Table Styles (`src/ui/styles.css`)
Add minimal table styling:
```css
.preview table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
.preview th, .preview td { border: 1px solid var(--border); padding: 0.5rem; }
.preview th { background: var(--bg-subtle); text-align: left; }
.preview td[align="center"] { text-align: center; }
.preview td[align="right"] { text-align: right; }
```

### Step 3: Integration
Modify `markdownToHtml()` main loop:
- Before paragraph accumulation, check for table start
- If table detected, parse entire table block, skip those lines
- Continue normal parsing after table

## File Changes

| File | Change |
|------|--------|
| `src/editor/markdown.ts` | ADD table parsing logic |
| `src/ui/styles.css` | ADD table styles |

## Verification
```bash
cd minwrite && npm run build && npm run dev
```
1. Create doc with GFM table
2. `Cmd+P` to preview
3. Table renders with headers, borders, alignment
4. Inline formatting works in cells (bold, links, etc.)

## Test Table
```markdown
| Feature | Status |
|---------|--------|
| Headings | ✓ |
| **Bold** | ✓ |
| Tables | pending |
```

---

# Previous Task: Multi-Document Support

## Goal
Command palette for navigating multiple documents. Zero UI when writing.

## Implementation Steps (Completed)

### Step 1: IndexedDB Wrapper (`src/library/db.ts`)
Create typed IndexedDB helper:
```ts
interface Document {
  id: string;
  content: string;
  createdAt: number;
  modifiedAt: number;
}

export function openDB(): Promise<IDBDatabase>
export function getAllDocs(): Promise<Document[]>
export function getDoc(id: string): Promise<Document | undefined>
export function putDoc(doc: Document): Promise<void>
export function deleteDoc(id: string): Promise<void>
```
- Database name: `minwrite`
- Object store: `documents` with keyPath `id`
- Index on `modifiedAt` for sorting

### Step 2: Document Service (`src/library/documents.ts`)
Higher-level CRUD + migration:
```ts
export function createDocument(): Promise<Document>
export function loadDocument(id: string): Promise<Document>
export function saveDocument(id: string, content: string): Promise<void>
export function deleteDocument(id: string): Promise<void>
export function listDocuments(): Promise<Document[]>
export function migrateFromLocalStorage(): Promise<string | null>
```
- `createDocument()` generates nanoid, empty content, returns doc
- `listDocuments()` returns sorted by modifiedAt desc
- `migrateFromLocalStorage()` checks for old key, creates doc, clears old key, returns new id

### Step 3: Current Doc Tracking (`src/editor/storage.ts`)
Add to existing storage module:
```ts
const CURRENT_DOC_KEY = 'minwrite:currentDoc';
export function getCurrentDocId(): string | null
export function setCurrentDocId(id: string): void
```
Keep existing theme functions. Mark content functions as deprecated (remove after migration verified).

### Step 4: Command Palette UI (`src/ui/palette.css`)
Styles for overlay + list:
- `.palette-overlay` - fixed, full viewport, semi-transparent bg
- `.palette` - centered container, max-width 500px
- `.palette-search` - input field, no border, large text
- `.palette-list` - scrollable list, max-height 300px
- `.palette-item` - title + time, highlight on `.selected`
- `.palette-item-new` - "+ New document" style
- Respects `[data-theme="dark"]`

### Step 5: Command Palette Logic (`src/editor/palette.ts`)
New module for palette behavior:
```ts
export class CommandPalette {
  constructor(
    container: HTMLElement,
    onSelect: (id: string | null) => void  // null = new doc
  )
  open(docs: Document[], currentId: string | null): void
  close(): void
  isOpen(): boolean
}
```
- Creates DOM on construct (hidden)
- `open()` populates list, shows overlay, focuses input
- Filters on input, updates list
- Arrow keys move `.selected` class
- Enter calls `onSelect` with selected id
- Escape/click-outside calls `close()`

### Step 6: Editor Integration (`src/editor/index.ts`)
Modify Editor class:
- Add `currentDocId: string | null` property
- Add `palette: CommandPalette` instance
- Init: call `migrateFromLocalStorage()`, then load current doc
- `Cmd+O`: open palette with doc list
- `Cmd+N`: create new doc, switch to it
- `Cmd+W`: close current doc (load previous or create new)
- On palette select: save current, load selected
- Update `handleInput` to save with doc id

### Step 7: Relative Time Helper (`src/library/time.ts`)
Small utility:
```ts
export function relativeTime(timestamp: number): string
// Returns: "just now", "2h ago", "yesterday", "Dec 15", etc.
```

## File Changes Summary

| File | Change |
|------|--------|
| `src/library/db.ts` | NEW - IndexedDB wrapper |
| `src/library/documents.ts` | NEW - Document CRUD |
| `src/library/time.ts` | NEW - Relative time |
| `src/editor/palette.ts` | NEW - Palette component |
| `src/ui/palette.css` | NEW - Palette styles |
| `src/editor/storage.ts` | ADD currentDocId functions |
| `src/editor/index.ts` | ADD palette, multi-doc state |
| `src/ui/styles.css` | IMPORT palette.css |
| `src/main.ts` | MAKE init async |

## Verification
```bash
cd minwrite && npm run build && npm run dev
```
1. Existing content migrates to first doc
2. `Cmd+N` creates new doc
3. `Cmd+O` shows both docs
4. Typing filters list
5. Selecting doc loads it
6. Refresh persists state

---

## Roadmap

### Phase 1: Foundation ✓
- Editor core - single textarea, full viewport, monospace
- Document model - localStorage persistence
- Minimal UI - dark/light themes via CSS vars

### Phase 2: Markdown ✓
- Preview pane - toggle with `Cmd+P`, not inline WYSIWYG
- Minimal parser - headings, bold, italic, links, code, lists

### Phase 3: Library ✓
- Document list - command palette, first line as title
- Persistence - IndexedDB for multiple docs
- Search - fuzzy filter in palette

### Phase 4: Export (pending)
- HTML export - clean, printable
- PDF export - via browser print or jsPDF
- Plain text - strip markdown, just prose

### Phase 5: Capture Pipeline (next)
1. **Table rendering** - GFM table support in markdown parser
2. **Capture mode** - `Cmd+V` in empty doc detects markdown, offers to clean/format
3. **Source metadata** - Optional front matter: `<!-- source: URL/2024-01-04 -->`
4. **Export polish** - PDF/HTML that renders tables properly

## Tech Stack
- Vite + TypeScript (strict mode, no React in editor core)
- CSS custom properties for theming
- IndexedDB for storage (no backend)
- Zero runtime dependencies in editor module
- Vitest + fake-indexeddb for data layer tests

---

## Completed Tasks

### Multi-Document Support
- IndexedDB wrapper (`src/library/db.ts`)
- Document CRUD (`src/library/documents.ts`)
- Command palette (`src/editor/palette.ts`)
- Migration from localStorage

### Markdown Preview
- `src/editor/markdown.ts`
- Toggle with `Cmd+P`

### Dark/Light Mode
- CSS custom properties
- `Cmd+Shift+L` toggle
- System preference default

### Help Overlay
- `Cmd+/` shows shortcuts
- Escape dismisses
