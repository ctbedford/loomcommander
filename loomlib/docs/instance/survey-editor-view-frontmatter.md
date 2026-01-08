---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-survey-editor-view-frontmatter
title: "Survey: Editor View for Conducting Frontmatter"
type: instance
framework_kind: null
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [survey, editor-view, frontmatter, ui, loomlib]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: resolved
upstream:
  - doc: fw-survey-method
    relation: method
  - doc: inst-survey-editor-implementation
    relation: prior
  - doc: inst-scope-editor-view
    relation: prior
downstream: []
---

# Survey: Editor View for Conducting Frontmatter

**Date:** 2026-01-08
**Subject:** How editor view renders and edits frontmatter, what conducting fields are missing
**Method:** Survey Method (static analysis)

---

## Survey

Relevant files:
- `src/views/editor.ts` — Editor view class (329 lines)
- `src/ui/editor.css` — Editor styles (413 lines)
- `src/components/triage-modal.ts` — Frontmatter editing modal
- `src/types.ts` — Document interface with conducting fields

---

## Core Sample

### Entry Points

**Editor instantiation:** `shell.ts`
```typescript
this.editor = new Editor(editorContainer, {
  onBack: () => this.showList(),
  onTriage: (docId) => this.options.onTriageRequest?.(docId),
  onGoToList: () => this.showList(),
  onGoToConstellation: () => this.showConstellation(),
});
```

**Document loading:** `editor.ts:92`
```typescript
async load(docId: string): Promise<void> {
  const doc = await loadDocument(docId);
  this.currentDoc = doc;
  this.renderMetaBar();
}
```

### Data Flow

```
Editor.load(docId)
  → loadDocument(docId)           // fetch from IndexedDB
  → this.currentDoc = doc
  → this.textarea.value = doc.content
  → renderMetaBar()               // display frontmatter
```

### Meta Bar Structure

The meta bar renders frontmatter in `editor.ts:119-138`:

```typescript
private renderMetaBar(): void {
  const doc = this.currentDoc;
  const icon = getDocumentIcon(doc);
  const color = getDocumentColor(doc);
  const typeLabel = doc.type + (doc.framework_kind ? ` / ${doc.framework_kind}` : '');
  const tags = doc.tags.map(t => `<span class="editor-view__tag">${t}</span>`).join('');

  this.metaBar.innerHTML = `
    <span class="editor-view__type-icon" style="color: ${color}">${icon}</span>
    <span class="editor-view__type-label">${typeLabel}</span>
    <span class="editor-view__status editor-view__status--${doc.status}">${doc.status}</span>
    ${tags ? `<span class="editor-view__tags">${tags}</span>` : ''}
  `;
}
```

### Fields Currently Displayed

| Field | Where | Rendering | Editable? |
|-------|-------|-----------|-----------|
| `type` | `.editor-view__type-icon` | Colored icon (⚙/▣/◧/○/◈/☰) | Via Triage |
| `type` | `.editor-view__type-label` | Text ("framework / toolkit") | Via Triage |
| `status` | `.editor-view__status` | Colored badge | Via Triage |
| `tags` | `.editor-view__tags` | Tag pills | Via Triage |

### Fields NOT Displayed

| Field | Type | Could show as |
|-------|------|---------------|
| `intent` | `research\|build\|capture\|organize\|produce` | Icon or badge |
| `execution_state` | `pending\|in_progress\|completed\|resolved` | Progress indicator |
| `upstream` | `UpstreamRef[]` | Links or relationship panel |
| `downstream` | `UpstreamRef[]` | "Used by" panel |
| `framework_ids` | `string[]` | Parent document links |
| `source_id` | `string\|null` | Parent source link |
| `perspective` | `string\|null` | Badge |
| `output` | `string\|null` | Channel badge |

---

## Stratigraphy

### Call Hierarchy

```
Editor
├── constructor(container, options)
│   └── Creates DOM: header, nav, title area, meta bar, textarea, preview
├── load(docId)
│   └── loadDocument() → currentDoc → renderMetaBar()
├── renderMetaBar()
│   └── Renders type icon, type label, status badge, tags
├── handleInput()
│   └── Debounced save, title update, preview update
├── handleKeydown()
│   └── Cmd+. (focus mode), Cmd+S (save flash), Cmd+P (preview), Tab
├── toggleFocusMode()
│   └── Hides chrome, centers textarea
├── togglePreview()
│   └── Shows markdown preview pane
└── save()
    └── saveDocument(id, content)
```

### State Location

| State | Location | Scope |
|-------|----------|-------|
| `currentDoc` | `Editor.currentDoc` | Full document object |
| `isDirty` | `Editor.isDirty` | Unsaved changes flag |
| `isFocusMode` | `Editor.isFocusMode` | Chrome visibility |
| `showPreview` | `Editor.showPreview` | Preview pane visibility |

### CSS Structure

```
.editor-view
├── .editor-view__header
│   ├── .editor-view__nav (list + constellation buttons)
│   ├── .editor-view__title-area (title + save status)
│   └── .editor-view__actions (preview toggle + triage btn)
├── .editor-view__meta (TYPE ICON | TYPE LABEL | STATUS | TAGS)
└── .editor-view__content
    ├── .editor-view__textarea
    └── .editor-view__preview
```

---

## Findings

The editor's meta bar only surfaces **descriptive** frontmatter (type, status, tags). All **conducting** frontmatter (intent, execution_state, upstream, downstream) is completely invisible.

This means:
1. Users cannot see or update `execution_state` from the editor
2. The production graph (upstream/downstream) is hidden
3. No way to see what frameworks produced this document
4. No way to see what documents this framework produced

### Current Meta Bar Visual

```
⚙ framework / toolkit    [draft]    tag1  tag2
```

### Proposed Meta Bar with Conducting Fields

```
⚙ framework / toolkit    [draft]    🔨build    ●●○○ in_progress    tag1  tag2
                         ↑          ↑          ↑
                         status     intent     execution_state
```

Or with a second row for graph relationships:

```
⚙ framework / toolkit    [draft]    🔨build    ●●○○ in_progress    tag1  tag2
─────────────────────────────────────────────────────────────────────────────
⤴ Survey Method, Etymon Method    →    Used by: 3 documents
↑                                      ↑
upstream (framework_ids)               downstream
```

### Key Files

| File | Role | Frontmatter Used |
|------|------|------------------|
| `src/views/editor.ts` | View class | type, framework_kind, status, tags |
| `src/ui/editor.css` | Styles | status (colored badges) |
| `src/components/triage-modal.ts` | Editing | type, framework_kind, status, tags, framework_ids, source_id, perspective, output |

### Dependencies

**Internal:**
- `data/documents.ts::loadDocument()`, `saveDocument()` — Data operations
- `types.ts::deriveTitle()`, `getDocumentIcon()`, `getDocumentColor()` — Helpers
- `marked` — Markdown preview rendering

**External:**
- `marked` (npm) — Markdown to HTML

### Complexity Hotspots

1. **Meta bar is inline HTML string** — Hard to extend without refactoring
2. **Triage modal is separate concern** — Could inline some fields in meta bar
3. **No inline editing** — All field changes require triage modal
4. **Graph relationships invisible** — upstream/downstream not shown anywhere

---

## Open Questions

1. **Should meta bar show execution_state?** Progress dots or text badge?
2. **Should meta bar show intent?** Icon (🔬🔨📝📁⚡) or text?
3. **Should upstream/downstream be visible?** Links, count, or expandable panel?
4. **Should some fields be inline-editable?** Click status badge to cycle?
5. **Should there be a second meta row for graph relationships?**

---

## Decisions

Decisions required before implementation:

| Question | Options | Decision | Rationale |
|----------|---------|----------|-----------|
| Show execution_state? | Progress dots / Badge / Dropdown | **TBD** | High value for task tracking |
| Show intent? | Icon / Badge / None | **TBD** | Clarifies document purpose |
| Show upstream? | Links / Count / Panel / None | **TBD** | Critical for graph navigation |
| Show downstream? | Links / Count / Panel / None | **TBD** | Shows document influence |
| Inline editing? | Yes / No | **TBD** | UX tradeoff: speed vs modal confirmation |

### Recommended Changes

**Minimal (low risk):**
1. Add `intent` icon after type label
2. Add `execution_state` progress indicator after status

**Medium (moderate risk):**
3. Add second meta row for upstream (clickable links to parent docs)
4. Add downstream count badge ("→ 3 children")

**Large (high risk):**
5. Make status/execution_state clickable for inline cycling
6. Add expandable panel showing full graph relationships

---

## Composition

**Upstream (what informed this survey):**
- [Survey Method](fw-survey-method) — method used
- [Survey: Editor Implementation Path](inst-survey-editor-implementation) — prior implementation survey
- [Scope: Editor View](inst-scope-editor-view) — prior scope work

**Downstream (what this survey enables):**
- Implementation of conducting frontmatter display in editor
- UX decisions about inline editing
- Graph navigation features

**Related (discovered during survey):**
- `inst-survey-list-view-frontmatter` — list view also missing conducting fields
- `inst-survey-constellation-view` — constellation shows graph relationships spatially

---

## Resolution

**Date:** 2026-01-08
**Status:** resolved

### What Was Done

Implemented all findings from this survey as part of the conducting frontmatter UI update:
1. Added intent icons (🔬🔨📝📁⚡) to editor meta bar
2. Added execution state progress dots (○○○○/●●○○/●●●●/✓) to meta bar
3. Added inline click-to-cycle for execution state
4. Added relations bar showing upstream links and downstream count

### Changes Made

- `loomlib/src/types.ts` — Added INTENT_ICONS, EXECUTION_STATE_DOTS constants and getIntentIcon(), getExecutionDots() helpers
- `loomlib/src/views/editor.ts` — Added intent icon, execution state dots, relations bar rendering, and cycleExecutionState() method
- `loomlib/src/ui/editor.css` — Added styles for .editor-view__intent, .editor-view__execution, .editor-view__relations, .editor-view__rel-*

### Outcome

Editor view now displays all conducting frontmatter fields:
- Intent icons show document purpose at a glance
- Progress dots show lifecycle state inline
- Click-to-cycle allows quick state updates without triage modal
- Relations bar exposes graph connectivity with clickable upstream links

### Remaining Items

None - all requirements addressed.
