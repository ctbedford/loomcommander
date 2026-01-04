# Spec: Multi-Document Support

## Goal
Navigate and manage multiple documents without breaking the "paper" feel. Hidden until invoked.

## UI Approach

### Primary: Command Palette (Cmd+O)
```
┌─────────────────────────────────────┐
│ ○ Search documents...               │
├─────────────────────────────────────┤
│   Draft novel chapter 3      2h ago │
│   Meeting notes Dec          1d ago │
│   Project ideas              3d ago │
│   + New document                    │
└─────────────────────────────────────┘
```
- Zero screen presence when writing
- Fuzzy search by title (first line) and content
- Recent docs sorted by last modified
- Arrow keys + Enter to select
- Escape dismisses
- "New document" option always at bottom

### Secondary: Quick Actions
- `Cmd+N` - New document (immediate, no dialog)
- `Cmd+W` - Close current doc (returns to last doc or empty state)
- `Cmd+Shift+Backspace` - Delete current doc (with confirm)

## Requirements

### Storage
- [ ] Migrate from localStorage to IndexedDB
- [ ] Document schema: `{ id, content, createdAt, modifiedAt }`
- [ ] Title derived from first non-empty line (not stored separately)
- [ ] Track "current document" ID in localStorage for reload

### Command Palette
- [ ] `Cmd+O` opens overlay, focuses search input
- [ ] Filter docs by fuzzy match on title + content
- [ ] Display: title (first line), relative time (2h ago, yesterday, etc)
- [ ] Arrow Up/Down navigates list
- [ ] Enter opens selected doc
- [ ] Escape or click outside closes
- [ ] Match existing theme (dark/light)

### Document Lifecycle
- [ ] New doc: create with empty content, switch to it
- [ ] Open doc: save current first, then load selected
- [ ] Delete doc: confirm dialog, remove from DB, open previous or new
- [ ] Auto-save works per document (existing debounce logic)

### Migration
- [ ] On first load, migrate `minwrite:content` → new doc in IndexedDB
- [ ] Clear old localStorage key after migration
- [ ] Silent migration, no user action needed

## Files

### New
- `src/library/db.ts` - IndexedDB wrapper (open, get, put, delete, list)
- `src/library/documents.ts` - Document CRUD operations
- `src/ui/palette.css` - Command palette styles

### Modified
- `src/editor/index.ts` - Add palette, multi-doc state, new keybindings
- `src/editor/storage.ts` - Add currentDocId get/set, deprecate content funcs
- `src/ui/styles.css` - Import palette styles

## Keyboard Reference
| Key | Action |
|-----|--------|
| `Cmd+O` | Open command palette |
| `Cmd+N` | New document |
| `Cmd+W` | Close document |
| `↑/↓` | Navigate palette |
| `Enter` | Select in palette |
| `Escape` | Close palette |

## Test: Done When
1. `npm run dev`
2. Type in editor, press `Cmd+N` → new blank doc
3. Type some content
4. `Cmd+O` → see both docs listed
5. Type to filter → list narrows
6. Select first doc → content loads
7. Refresh → still on same doc with content
8. `npm run build` passes

## Anti-requirements
- No folders/tags (future spec)
- No drag-drop reordering
- No sidebar in this phase
- No document renaming (title = first line)
- No cloud sync

## Future Considerations
- Sidebar (Cmd+\) for browsing when library grows large
- Folders/tags for organization
- Full-text search highlighting
- Document export from palette
