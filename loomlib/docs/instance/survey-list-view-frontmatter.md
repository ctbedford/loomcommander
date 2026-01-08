---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-survey-list-view-frontmatter
title: "Survey: List View for Conducting Frontmatter"
type: instance
framework_kind: null
framework_ids: [fw-survey-method]
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [survey, list-view, frontmatter, ui, loomlib]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: resolved
upstream:
  - doc: fw-survey-method
    relation: method
  - doc: inst-scope-list-view-aesthetic
    relation: prior
downstream: []
---

# Survey: List View for Conducting Frontmatter

**Date:** 2026-01-08
**Subject:** How list view renders documents and what conducting frontmatter fields are used/missing
**Method:** Survey Method (static analysis)

---

## Survey

Relevant files:
- `src/views/list.ts` — List view class (122 lines)
- `src/components/document-card.ts` — Card rendering (135 lines)
- `src/ui/list.css` — List layout styles (105 lines)
- `src/ui/card.css` — Card component styles
- `src/types.ts` — Document interface with conducting fields

---

## Core Sample

### Entry Points

**List view instantiation:** `shell.ts`
```typescript
this.listView = new ListView(listContainer, {
  onDocumentSelect: (doc) => this.showEditor(doc.id),
  onNewDocument: () => this.options.onTriageRequest?.(),
});
```

**Card rendering:** `document-card.ts:110`
```typescript
export function renderCardList(
  container: HTMLElement,
  docs: Document[],
  allDocs: Document[],
  onClick?: (doc: Document) => void
): void
```

### Data Flow

```
ListView.refresh()
  → listDocuments()              // fetch all docs from IndexedDB
  → this.docs = [...]            // store locally
  → render()
    → renderCardList()           // delegate to document-card.ts
      → for each doc: createDocumentCard(doc, parentDocs, options)
```

### Key Abstractions

**Document fields currently displayed:**
| Field | Where | Rendering |
|-------|-------|-----------|
| `title` | `.doc-card__title` | Text, "Untitled" fallback |
| `type` | `.doc-card__badge` | Text badge |
| `framework_kind` | `.doc-card__badge` | Shows "toolkit" or "domain" instead of "framework" |
| `framework_ids` | `.doc-card__lineage` | Parent doc titles with "⤴" prefix |
| `source_id` | `.doc-card__lineage` | Parent doc title with "⤴" prefix |
| `modifiedAt` | `.doc-card__time` | Relative time via `relativeTime()` |
| `status` | `.doc-card--incubating` | CSS class for glow effect |

**Document fields NOT displayed:**
| Field | Type | Could show as |
|-------|------|---------------|
| `intent` | `research\|build\|capture\|organize\|produce` | Badge or icon |
| `execution_state` | `pending\|in_progress\|completed\|resolved` | Status indicator |
| `upstream` | `UpstreamRef[]` | Relationship count or icons |
| `downstream` | `UpstreamRef[]` | "Used by N" count |
| `perspective` | `string` | Badge |
| `output` | `string` | Channel icon |
| `tags` | `string[]` | Tag pills |

---

## Stratigraphy

### Call Hierarchy

```
ListView
├── constructor(container, options)
│   └── Creates DOM structure, binds events
├── refresh()
│   └── renderCardList() → document-card.ts
├── handleSearch()
│   └── Filters by title, content, tags
├── handleKeydown()
│   └── Arrow nav, Enter to select
└── updateSelection()
    └── Highlights selected card
```

### State Location

| State | Location | Scope |
|-------|----------|-------|
| `docs` | `ListView.docs` | Full document list |
| `filteredDocs` | `ListView.filteredDocs` | Search results |
| `selectedIndex` | `ListView.selectedIndex` | Keyboard nav |

### Boundary Conditions

**Search filters on:**
- `d.title.toLowerCase().includes(query)`
- `d.content.toLowerCase().includes(query)`
- `d.tags.some(t => t.toLowerCase().includes(query))`

**Does NOT filter on:**
- `type`, `status`, `intent`, `execution_state`, `perspective`, `output`

---

## Findings

The list view is a thin wrapper that delegates all card rendering to `document-card.ts`. It currently shows the **descriptive** frontmatter (type, status, lineage) but ignores all **conducting** frontmatter fields (intent, execution_state, upstream, downstream).

This means:
1. Users cannot see which documents are `pending` vs `in_progress` vs `completed`
2. Users cannot filter by `intent` (research vs build vs produce)
3. The graph relationships (`upstream`/`downstream`) are invisible in list view

### Key Files

| File | Role | Frontmatter Used |
|------|------|------------------|
| `src/views/list.ts` | Container, search, nav | None directly |
| `src/components/document-card.ts` | Card rendering | type, framework_kind, framework_ids, source_id, status, modifiedAt |
| `src/ui/card.css` | Card styles | status (for incubating glow) |

### Dependencies

**Internal:**
- `data/documents.ts::listDocuments()` — Data fetching
- `types.ts::getDocumentIcon()`, `getDocumentColor()` — Visual styling
- `utils/time.ts::relativeTime()` — Time formatting

**External:**
- None

### Complexity Hotspots

1. **Search is basic** — Only text matching, no faceted filtering
2. **No sorting options** — Always newest first (modifiedAt desc)
3. **Lineage lookup is eager** — Looks up all parents for all cards on every render

---

## Open Questions

1. **Should list view show `execution_state`?** A progress indicator (●○○○) could help track work.
2. **Should list view allow filtering by conducting fields?** e.g., "show only pending documents"
3. **Should `intent` have an icon?** 🔬research, 🔨build, 📝capture, 📁organize, ⚡produce
4. **Should `downstream` count be shown?** "Used by 3 documents" badge

---

## Decisions

Decisions required before implementation:

| Question | Options | Decision | Rationale |
|----------|---------|----------|-----------|
| Show execution_state? | Badge / Icon / Progress dots / None | **TBD** | Need user input |
| Show intent? | Icon / Badge / None | **TBD** | Need user input |
| Add filter chips? | Type / Status / Intent / State / None | **TBD** | Scope creep risk |
| Show downstream count? | Number / "Used by N" / None | **TBD** | May add clutter |

### Recommended Changes

**Minimal (low risk):**
1. Add `execution_state` indicator to card (colored dot or progress icon)
2. Add `intent` icon next to type icon

**Medium (moderate risk):**
3. Add filter buttons/chips above search: Type, Status, Intent, Execution State
4. Show `downstream` count as badge

**Large (high risk):**
5. Full faceted search with AND/OR logic

---

## Composition

**Upstream (what informed this survey):**
- [Survey Method](fw-survey-method) — method used
- [Scope: List View Aesthetic](inst-scope-list-view-aesthetic) — prior scope work

**Downstream (what this survey enables):**
- Implementation of conducting frontmatter in list view
- UX decisions about which fields to surface

**Related (discovered during survey):**
- `inst-survey-editor-implementation` — editor already shows some meta
- `inst-scope-editor-view` — editor scope work

---

## Resolution

**Date:** 2026-01-08
**Status:** resolved

### What Was Done

Implemented all findings from this survey as part of the conducting frontmatter UI update:
1. Added intent icons (🔬🔨📝📁⚡) to document cards
2. Added execution state progress dots (○○○○/●●○○/●●●●/✓) to cards
3. Added upstream/downstream relationship counts (⤴/↴) to cards
4. Added filter chips for intent and execution_state above search

### Changes Made

- `loomlib/src/types.ts` — Added INTENT_ICONS, EXECUTION_STATE_DOTS constants and getIntentIcon(), getExecutionDots() helpers
- `loomlib/src/components/document-card.ts` — Added intent icon, execution state dots, and relationship counts to card rendering
- `loomlib/src/ui/card.css` — Added styles for .doc-card__intent, .doc-card__state, .doc-card__relations
- `loomlib/src/views/list.ts` — Added filter chips for intent and execution_state with toggle filtering
- `loomlib/src/ui/list.css` — Added styles for filter chips

### Outcome

List view now displays all conducting frontmatter fields:
- Intent icons show at a glance what kind of work each document represents
- Progress dots show lifecycle state without requiring click
- Relationship counts expose graph connectivity
- Filter chips enable filtering by conducting fields

### Remaining Items

None - all requirements addressed.
