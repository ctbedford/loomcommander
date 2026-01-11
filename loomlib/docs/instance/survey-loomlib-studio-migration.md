---
id: inst-survey-loomlib-studio-migration
title: "Survey: Loomlib to Studio Migration"
type: instance
framework_kind: null
perspective: null
framework_ids:
  - fw-survey-method
source_id: null
output: loomcommander
status: incubating
tags:
  - loomlib-studio
  - migration
  - architecture
  - codebase

intent: research
execution_state: in_progress
upstream:
  - doc: fw-survey-method
    relation: method
  - doc: inst-scope-loomlib-studio-ia
    relation: prior
  - doc: inst-scope-loomlib-studio
    relation: prior
  - doc: inst-survey-loomlib
    relation: informs
downstream: []
---

# Survey: Loomlib to Studio Migration

**Date:** 2026-01-11
**Subject:** What needs to change to migrate loomlib to Loomlib Studio
**Method:** Survey Method (static analysis)

---

## Survey

### File Inventory

```
loomlib/src/
├── types.ts                    (304 lines) — Core type definitions
├── main.ts                     (entry point)
├── data/
│   ├── db.ts                   (352 lines) — IndexedDB operations
│   ├── documents.ts            — Document CRUD helpers
│   ├── seed.ts                 — Seed data sync
│   ├── seed-data.ts            — Generated from markdown
│   ├── graph.ts                — Relationship computation
│   ├── constellation-config.ts — Lens configs
│   ├── embeddings.ts           — Embedding storage
│   ├── similarity.ts           — Similarity computation
│   └── umap.ts                 — UMAP projection
├── views/
│   ├── list.ts                 (368 lines) — Document list
│   ├── constellation.ts       (680 lines) — Graph view
│   ├── deck.ts                 (704 lines) — Card grid
│   ├── spatial.ts              (439 lines) — UMAP view
│   ├── flow.ts                 (378 lines) — Vertical flow
│   └── editor.ts               (590 lines) — Markdown editor
├── layout/
│   └── shell.ts                (317 lines) — View orchestration
├── components/
│   ├── document-card.ts        — Card rendering
│   ├── triage-modal.ts         — Metadata editor
│   ├── command-palette.ts      — Search/open
│   ├── formula-bar.ts          — Production formula display
│   └── lens-picker.ts          — Lens selection
└── ui/
    └── *.css                   — Styles
```

**Total TypeScript:** ~3,500 lines (excluding tests)

---

## Core Sample

### Layer 1: Types (types.ts)

**What exists:**

```typescript
// Document types
type DocumentType = 'source' | 'note' | 'framework' | 'instance' | 'index';

// Status
type DocumentStatus = 'incubating' | 'draft' | 'verified' | 'captured';

// Conducting
type DocumentIntent = 'research' | 'build' | 'capture' | 'organize' | 'produce';
type ExecutionState = 'pending' | 'in_progress' | 'completed' | 'resolved';

// Document interface
interface Document {
  id: string;
  title: string;
  content: string;
  type: DocumentType;
  framework_kind: FrameworkKind | null;
  perspective: string | null;
  framework_ids: string[];
  source_id: string | null;
  output: string | null;
  status: DocumentStatus;
  tags: string[];
  createdAt: number;
  modifiedAt: number;
  intent?: DocumentIntent;
  execution_state?: ExecutionState;
  upstream?: UpstreamRef[];
  downstream?: UpstreamRef[];
}

// View modes
type ViewMode = 'list' | 'constellation' | 'flow' | 'editor' | 'spatial' | 'deck';
```

**What needs to change for Studio:**

| Current | Studio Change | Effort |
|---------|---------------|--------|
| `DocumentType` = 5 types | Add `'asset'` type; optionally rename types | Low |
| `DocumentStatus` = 4 states | Simplify to `'draft' \| 'ready' \| 'used'` | Medium |
| No `Project` type | Add full `Project` interface | Medium |
| No `OutputChannel` type | Add `OutputChannel` interface | Low |
| Hardcoded `output` field | Make reference to `OutputChannel.id` | Low |
| `ViewMode` = 6 views | Replace with Studio views | Medium |

**Migration impact:** types.ts is the foundation. Changes here cascade everywhere.

---

### Layer 2: Database (db.ts)

**What exists:**

```typescript
// IndexedDB setup
const DB_NAME = 'loomlib';
const DB_VERSION = 3;

// Object stores
const STORE_NAME = 'documents';
const EMBEDDINGS_STORE = 'embeddings';
const UMAP_COORDS_STORE = 'umap_coords';

// Document indexes
store.createIndex('modifiedAt', 'modifiedAt');
store.createIndex('type', 'type');
store.createIndex('status', 'status');
store.createIndex('output', 'output');
```

**What needs to change for Studio:**

| Current | Studio Change | Effort |
|---------|---------------|--------|
| 1 document store | Add `projects` store | Medium |
| No channel store | Add `output_channels` store | Low |
| No project indexes | Add `project_ids` index on documents | Low |
| `DB_VERSION = 3` | Increment to 4 with migration | Low |
| No `project_id` field | Add optional `project_ids: string[]` to Document | Low |

**New stores needed:**

```typescript
// Projects store
const PROJECTS_STORE = 'projects';
// Indexes: status, output_channel_id, modified_at

// Output channels store
const CHANNELS_STORE = 'output_channels';
// Indexes: is_default
```

**Migration path:**
1. Increment `DB_VERSION` to 4
2. In `onupgradeneeded`, create new stores
3. Add new indexes to documents store
4. Existing documents remain valid (no breaking changes)

---

### Layer 3: Shell (shell.ts)

**What exists:**

```typescript
class Shell {
  private listView: ListView;
  private constellationView: ConstellationView;
  private flowView: FlowView;
  private spatialView: SpatialView;
  private deckView: DeckView;
  private editor: Editor;
  private currentView: ViewMode = 'list';

  // Navigation
  showList() / showConstellation() / showFlow() / showSpatial() / showDeck() / showEditor()

  // Entry point
  async init() → listView.refresh() → showList()
}
```

**What needs to change for Studio:**

| Current | Studio Change | Effort |
|---------|---------------|--------|
| 6 views instantiated | Replace with 7 Studio views | High |
| List as default home | Pipeline as default home | Low |
| No project context | Add `currentProjectId` state | Medium |
| Global view navigation | Project-scoped navigation | Medium |
| No nav bar | Add top navigation bar | Medium |

**New Shell structure:**

```typescript
class Shell {
  // New views
  private pipelineView: PipelineView;     // replaces list as home
  private projectView: ProjectView;       // new
  private ideasView: IdeasView;           // new
  private sourcesView: SourcesView;       // enhances sources
  private assetsView: AssetsView;         // new
  private timelineView: TimelineView;     // new
  private editor: Editor;                 // enhanced

  // Removed views
  // private constellationView — removed
  // private spatialView — removed (or hidden)
  // private flowView — removed (or hidden)

  // Project context
  private currentProjectId: string | null = null;

  // Navigation
  private navBar: NavBar;
}
```

---

### Layer 4: Views

**Current views and their fate:**

| View | Lines | Keep/Replace/Remove | Reason |
|------|-------|---------------------|--------|
| `list.ts` | 368 | **Replace** → PipelineView | Kanban instead of table |
| `constellation.ts` | 680 | **Remove** | Too abstract for creators |
| `deck.ts` | 704 | **Adapt** → IdeasView / AssetsView | Grid layout useful |
| `spatial.ts` | 439 | **Remove** | Exploratory, not workflow |
| `flow.ts` | 378 | **Remove** | Replaced by project view |
| `editor.ts` | 590 | **Keep + Enhance** | Core, add project context |

**New views to create:**

| View | Purpose | Based On |
|------|---------|----------|
| `pipeline.ts` | Kanban by video status | New (kanban pattern) |
| `project.ts` | Video dashboard | New |
| `ideas.ts` | Idea backlog | Adapt from deck.ts |
| `sources.ts` | Source library | Adapt from list.ts |
| `assets.ts` | Visual gallery | Adapt from deck.ts |
| `timeline.ts` | Calendar/deadline view | New |

**Code reuse potential:**
- `deck.ts` grid layout → reuse for `ideas.ts`, `assets.ts`
- `list.ts` filtering → reuse for `sources.ts`
- `editor.ts` → enhance, don't rewrite

---

### Layer 5: Components

**Current components:**

| Component | Keep/Change |
|-----------|-------------|
| `document-card.ts` | **Adapt** — needs project badge |
| `triage-modal.ts` | **Adapt** — needs project assignment |
| `command-palette.ts` | **Keep** — works as-is |
| `formula-bar.ts` | **Remove** — too academic |
| `lens-picker.ts` | **Remove** — replaced by view filters |

**New components needed:**

| Component | Purpose |
|-----------|---------|
| `nav-bar.ts` | Top navigation |
| `project-modal.ts` | Create/edit project |
| `channel-picker.ts` | Select output channel |
| `status-column.ts` | Kanban column |
| `video-card.ts` | Project card for pipeline |
| `asset-preview.ts` | Image/video thumbnail |

---

### Layer 6: Data Operations

**Current document operations (documents.ts):**

```typescript
listDocuments()
getDocument(id)
createDocument(type)
updateDocument(id, updates)
deleteDocument(id)
```

**New operations needed:**

```typescript
// Projects
listProjects()
getProject(id)
createProject(name, channelId)
updateProject(id, updates)
deleteProject(id)
getProjectDocuments(projectId)
addDocumentToProject(docId, projectId)
removeDocumentFromProject(docId, projectId)

// Output Channels
listChannels()
createChannel(name, icon, color)
updateChannel(id, updates)
deleteChannel(id)
getDefaultChannel()
```

---

## Stratigraphy

### Dependency Graph

```
types.ts (FOUNDATION)
    ↓
db.ts (STORAGE)
    ↓
documents.ts (OPERATIONS)
    ↓
┌───────────────────────────────────┐
│           VIEWS                   │
├───────────────────────────────────┤
│ list.ts  constellation.ts  ...    │
└───────────────────────────────────┘
    ↓
shell.ts (ORCHESTRATION)
    ↓
main.ts (ENTRY)
```

**Migration order must follow this dependency graph:**
1. First: types.ts (add new types, don't break existing)
2. Second: db.ts (add stores, don't migrate data yet)
3. Third: documents.ts (add project/channel operations)
4. Fourth: views (build new views, keep old ones working)
5. Fifth: shell.ts (swap views when ready)
6. Last: main.ts (update initialization)

---

## Findings

### Migration Strategy

**Phase 1: Additive Changes (Non-Breaking)**

| Change | Files | Effort |
|--------|-------|--------|
| Add `Project` interface to types.ts | types.ts | Low |
| Add `OutputChannel` interface | types.ts | Low |
| Add `asset` to DocumentType | types.ts | Low |
| Add `project_ids` to Document | types.ts | Low |
| Add projects store to db.ts | db.ts | Medium |
| Add channels store to db.ts | db.ts | Low |
| Add project/channel operations | documents.ts | Medium |

**Phase 2: New Views (Parallel Development)**

| View | Based On | Effort |
|------|----------|--------|
| PipelineView | New | High |
| ProjectView | New | High |
| IdeasView | deck.ts | Medium |
| SourcesView | list.ts | Medium |
| AssetsView | deck.ts | Medium |
| TimelineView | New | Medium |

**Phase 3: Shell Swap (Breaking)**

| Change | Effort |
|--------|--------|
| Replace Shell views | Medium |
| Add NavBar component | Medium |
| Update keyboard shortcuts | Low |
| Update routing | Medium |

**Phase 4: Cleanup**

| Change | Effort |
|--------|--------|
| Remove constellation.ts | Low |
| Remove spatial.ts | Low |
| Remove flow.ts | Low |
| Remove lens-picker.ts | Low |
| Remove formula-bar.ts | Low |

---

### Effort Estimates

| Component | Lines to Write | Lines to Modify | Lines to Delete |
|-----------|----------------|-----------------|-----------------|
| types.ts | ~100 | ~20 | 0 |
| db.ts | ~100 | ~20 | 0 |
| documents.ts | ~150 | ~30 | 0 |
| shell.ts | ~200 | ~100 | ~100 |
| New views | ~2000 | 0 | 0 |
| New components | ~500 | 0 | 0 |
| Removed views | 0 | 0 | ~1500 |
| **Total** | **~3050** | **~170** | **~1600** |

**Net change:** +1450 lines (from ~3500 to ~5000)

---

### Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Breaking existing documents | Low | Additive changes only in Phase 1 |
| IndexedDB migration issues | Medium | Keep old stores, add new ones |
| Keyboard shortcut conflicts | Low | Review shortcuts in Phase 3 |
| Performance with more views | Low | Lazy-load new views |
| CSS conflicts | Medium | New BEM classes for Studio views |

---

### File-by-File Migration Checklist

#### types.ts

- [ ] Add `StudioDocumentType` with `'idea' | 'source' | 'research' | 'script' | 'asset' | 'template' | 'series'`
- [ ] Add `Project` interface
- [ ] Add `ProjectStatus` type
- [ ] Add `OutputChannel` interface
- [ ] Add `AssetMetadata` interface
- [ ] Extend `Document` with `project_ids?: string[]`
- [ ] Extend `Document` with `asset_metadata?: AssetMetadata`
- [ ] Add `StudioViewMode` type
- [ ] Add Studio-specific icons and colors

#### db.ts

- [ ] Increment `DB_VERSION` to 4
- [ ] Add `PROJECTS_STORE` constant
- [ ] Add `CHANNELS_STORE` constant
- [ ] Create projects store in `onupgradeneeded`
- [ ] Create channels store in `onupgradeneeded`
- [ ] Add project index to documents store
- [ ] Add CRUD functions for projects
- [ ] Add CRUD functions for channels
- [ ] Add `getProjectDocuments(projectId)`

#### documents.ts

- [ ] Add `listProjects()`
- [ ] Add `createProject()`
- [ ] Add `updateProject()`
- [ ] Add `deleteProject()`
- [ ] Add `addDocumentToProject()`
- [ ] Add `removeDocumentFromProject()`
- [ ] Add channel operations

#### shell.ts

- [ ] Add NavBar component
- [ ] Replace view instances
- [ ] Add `currentProjectId` state
- [ ] Update keyboard shortcuts
- [ ] Update `toggleView()` for Studio views
- [ ] Add project-scoped navigation methods

#### New Files to Create

- [ ] `views/pipeline.ts` — Kanban view
- [ ] `views/project.ts` — Project dashboard
- [ ] `views/ideas.ts` — Idea backlog
- [ ] `views/sources.ts` — Source library
- [ ] `views/assets.ts` — Asset gallery
- [ ] `views/timeline.ts` — Calendar view
- [ ] `components/nav-bar.ts` — Top navigation
- [ ] `components/project-modal.ts` — Create/edit project
- [ ] `components/video-card.ts` — Project card
- [ ] `components/channel-picker.ts` — Channel selection
- [ ] `ui/studio.css` — Studio-specific styles

#### Files to Remove (Phase 4)

- [ ] `views/constellation.ts` (680 lines)
- [ ] `views/spatial.ts` (439 lines)
- [ ] `views/flow.ts` (378 lines)
- [ ] `components/lens-picker.ts`
- [ ] `components/formula-bar.ts`
- [ ] `data/constellation-config.ts`

---

### Backward Compatibility

**What must remain working during migration:**

1. **Existing documents** — Must open in editor
2. **Document CRUD** — Must work throughout
3. **Seed sync** — Must continue working
4. **Command palette** — Must work throughout
5. **Editor** — Must work throughout

**Strategy:** Keep old views functional until new views are complete. Use feature flag or `STUDIO_MODE` constant to switch.

```typescript
// In shell.ts during migration
const STUDIO_MODE = false;

if (STUDIO_MODE) {
  this.pipelineView = new PipelineView(...);
} else {
  this.listView = new ListView(...);
}
```

---

### Timeline Estimate

| Phase | Duration | Output |
|-------|----------|--------|
| Phase 1: Types + DB | 2-3 days | New types, stores, operations |
| Phase 2: Pipeline + Project views | 3-4 days | Core Studio views |
| Phase 3: Supporting views | 3-4 days | Ideas, Sources, Assets, Timeline |
| Phase 4: Shell swap | 2-3 days | Full Studio UX |
| Phase 5: Cleanup | 1-2 days | Remove deprecated code |
| **Total** | **11-16 days** | Loomlib Studio MVP |

---

## Composition

**What informed this:**
- `inst-scope-loomlib-studio-ia` — target IA specification
- `inst-scope-loomlib-studio` — Studio requirements
- `inst-survey-loomlib` — original architecture survey
- Direct codebase reading

**What this enables:**
- Implementation plan with specific files
- Effort estimation for prioritization
- Risk awareness for migration
- Checklist for tracking progress

**Calibration note:** This is 2-3 weeks of focused coding. The Warrior question: is building this the right next action, or should you ship Etymon Episode 1 first using current loomlib?
