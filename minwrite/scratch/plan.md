# Current Task: Multi-Document Support

## Goal
Command palette for navigating multiple documents. Zero UI when writing.

## Implementation Steps

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
