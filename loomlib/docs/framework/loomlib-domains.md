---
id: fw-loomlib-domains
title: "Loomlib Domains Framework"
type: framework
framework_kind: toolkit
perspective: null
framework_ids:
  - fw-invariants-variants
source_id: null
output: loomcommander
status: incubating
tags:
  - loomlib
  - domains
  - invariants
  - variants
  - templating
  - architecture

intent: build
execution_state: in_progress
upstream:
  - doc: fw-invariants-variants
    relation: method
  - doc: inst-scope-loomlib-studio-ia
    relation: informs
  - doc: inst-survey-loomlib-studio-migration
    relation: informs
downstream: []
---

# Loomlib Domains Framework

**Type:** Toolkit Framework
**Function:** Define what's invariant across all loomlib instances vs. what each domain configures

## The Core Insight

Loomlib is not one app — it's a **template** that can be configured for different domains:

```
┌────────────────────────────────────────────────────────────────────┐
│                     LOOMLIB CORE (INVARIANT)                       │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  Production  │  │  Conducting  │  │   Upstream/  │             │
│  │   Formula    │  │  Frontmatter │  │  Downstream  │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │    Status    │  │   Intent/    │  │    Graph     │             │
│  │   Workflow   │  │  Execution   │  │  Structure   │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                              ↓
              ┌───────────────┴───────────────┐
              ↓                               ↓
┌─────────────────────────┐     ┌─────────────────────────┐
│   ETYMON DOMAIN         │     │   STUDIO DOMAIN         │
│   (Current Loomlib)     │     │   (Creator Tool)        │
├─────────────────────────┤     ├─────────────────────────┤
│ Types: source, note,    │     │ Types: idea, source,    │
│   framework, instance,  │     │   research, script,     │
│   index                 │     │   asset, template,      │
│                         │     │   series                │
│ Status: incubating →    │     │                         │
│   draft → verified →    │     │ Status: draft →         │
│   captured              │     │   ready → used          │
│                         │     │                         │
│ Views: List,            │     │ Views: Pipeline,        │
│   Constellation, Deck,  │     │   Project, Ideas,       │
│   Spatial, Flow, Editor │     │   Sources, Assets,      │
│                         │     │   Timeline, Editor      │
│                         │     │                         │
│ Output: etymon,         │     │ Output: user-defined    │
│   loomcommander         │     │   channels              │
│                         │     │                         │
│ Container: none         │     │ Container: Project      │
│                         │     │   (video)               │
└─────────────────────────┘     └─────────────────────────┘
```

---

## I. The Invariant Core

These are the structural elements that **cannot change** without breaking what makes loomlib loomlib:

### 1. Production Formula

```
[input] × [method] → [output]
```

Every domain has:
- **Inputs** — raw material (sources, notes, references)
- **Methods** — reusable approaches (frameworks, templates)
- **Outputs** — produced artifacts (instances, scripts, analysis)

The metaphor of "applying methods to inputs to produce outputs" is invariant.

### 2. Conducting Frontmatter

Every document tracks its production context:

```yaml
intent: research | build | capture | organize | produce
execution_state: pending | in_progress | completed | resolved
upstream:
  - doc: {id}
    relation: informs | method | source | prior
downstream: []
```

**This is invariant.** It's what makes loomlib a *production* system, not just a notes system.

### 3. Graph Structure

Documents are nodes. References are edges. The graph is navigable.

```
[Document A] ──upstream──→ [Document B]
     ↓
[Document C] ←──downstream──
```

**Invariant:** Documents have relationships. The graph is queryable.

### 4. Status Workflow

Documents progress through states of maturity:

```
early_state → middle_state → mature_state → terminal_state
```

**Invariant:** There is a progression. Domains configure the *names* and *number* of states.

### 5. Intent Categories

Documents have purposes:

| Category | Description |
|----------|-------------|
| **Capture** | Grabbing raw material |
| **Research** | Developing understanding |
| **Build** | Creating reusable methods |
| **Organize** | Curating collections |
| **Produce** | Making final outputs |

**Invariant:** These five intents. They're exhaustive of what knowledge work does.

---

## II. The Variant Slots

These are the **configurable categories** that each domain populates:

### Slot 1: Document Types

**Invariant:** Documents have types. Types have icons and colors.

**Variant:** What the types are called, how many there are, what they mean.

| Domain | Types |
|--------|-------|
| Etymon | source, note, framework, instance, index |
| Studio | idea, source, research, script, asset, template, series |
| Legal | case, statute, brief, memo, contract, precedent |
| Academic | source, note, claim, argument, paper, bibliography |

### Slot 2: Status Progression

**Invariant:** Documents progress through statuses.

**Variant:** The status names and count.

| Domain | Progression |
|--------|-------------|
| Etymon | incubating → draft → verified → captured |
| Studio | draft → ready → used |
| Legal | intake → review → approved → filed |
| Academic | hypothesis → drafted → reviewed → published |

### Slot 3: Container Entity

**Invariant:** Documents can be grouped.

**Variant:** What the container is called, what it tracks.

| Domain | Container | Contains |
|--------|-----------|----------|
| Etymon | (none, or tag-based) | — |
| Studio | Project (video) | ideas, research, script, assets |
| Legal | Matter | cases, briefs, memos |
| Academic | Paper | sources, claims, arguments |

### Slot 4: Output Channels

**Invariant:** Work goes somewhere.

**Variant:** Where.

| Domain | Channels |
|--------|----------|
| Etymon | YouTube (etymon), GitHub (loomcommander) |
| Studio | user-defined (YouTube, Substack, Podcast, etc.) |
| Legal | court, client, internal |
| Academic | journal, conference, thesis |

### Slot 5: Views

**Invariant:** Documents are displayed and navigated.

**Variant:** Which views exist, what they emphasize.

| Domain | Views |
|--------|-------|
| Etymon | List, Constellation, Deck, Spatial, Flow, Editor |
| Studio | Pipeline, Project, Ideas, Sources, Assets, Timeline, Editor |
| Legal | Matters, Calendar, Research, Drafting |
| Academic | Library, Outline, Writing, Citations |

### Slot 6: Tags/Categories

**Invariant:** Documents can be categorized beyond type.

**Variant:** The category scheme.

| Domain | Categories |
|--------|------------|
| Etymon | perspective (philosophical-genealogy, etc.), output channel |
| Studio | topic, format, series, priority |
| Legal | practice area, client, urgency |
| Academic | discipline, methodology, status |

### Slot 7: Commands

**Invariant:** Claude orchestrates document production.

**Variant:** Which commands exist, what they produce.

| Domain | Core Commands |
|--------|---------------|
| Etymon | excavate, survey, scope, synthesize, apologetic |
| Studio | draft-script, outline, summarize-sources, generate-ideas |
| Legal | research-case, draft-brief, cite-check |
| Academic | literature-review, argument-map, citation-format |

---

## III. The Domain Configuration Schema

A domain is defined by a configuration object:

```typescript
interface DomainConfig {
  // Identity
  id: string;                    // e.g., 'etymon', 'studio', 'legal'
  name: string;                  // e.g., 'Etymon', 'Loomlib Studio'
  description: string;

  // Document Types
  documentTypes: DocumentTypeConfig[];

  // Status Progression
  statusProgression: StatusConfig[];

  // Container (optional)
  container?: ContainerConfig;

  // Output Channels
  outputChannels: OutputChannelConfig[];

  // Views
  views: ViewConfig[];

  // Tag Categories
  tagCategories: TagCategoryConfig[];

  // Commands
  commands: CommandConfig[];

  // Intent Mapping (which types have which default intent)
  intentMapping: Record<string, DocumentIntent>;
}

interface DocumentTypeConfig {
  id: string;           // e.g., 'idea', 'script'
  name: string;         // e.g., 'Idea', 'Script'
  icon: string;         // e.g., '💡', '📝'
  color: string;        // e.g., '#FFD700'
  intentDefault: DocumentIntent;
}

interface StatusConfig {
  id: string;           // e.g., 'draft', 'ready'
  name: string;
  icon: string;
  order: number;        // progression order
}

interface ContainerConfig {
  id: string;           // e.g., 'project'
  name: string;         // e.g., 'Project'
  icon: string;
  statusProgression: StatusConfig[];  // container has its own status
}

interface OutputChannelConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
}

interface ViewConfig {
  id: string;           // e.g., 'pipeline', 'editor'
  name: string;
  icon: string;
  component: string;    // which view component to use
  isDefault: boolean;
}

interface TagCategoryConfig {
  prefix: string;       // e.g., 'topic:', 'format:'
  name: string;
  values?: string[];    // predefined values, or null for freeform
}

interface CommandConfig {
  id: string;           // e.g., 'excavate', 'draft-script'
  name: string;
  description: string;
  produces: string;     // which document type it produces
  promptPath: string;   // path to command prompt file
}
```

---

## IV. Example Domain Configurations

### Etymon Domain (Current Loomlib)

```typescript
const etymonDomain: DomainConfig = {
  id: 'etymon',
  name: 'Etymon',
  description: 'Knowledge production for philological research and content creation',

  documentTypes: [
    { id: 'source', name: 'Source', icon: '◈', color: '#7BC98A', intentDefault: 'capture' },
    { id: 'note', name: 'Note', icon: '○', color: '#8A8A8A', intentDefault: 'capture' },
    { id: 'framework', name: 'Framework', icon: '⚙', color: '#7BA3C9', intentDefault: 'build' },
    { id: 'instance', name: 'Instance', icon: '◧', color: '#C9A67B', intentDefault: 'produce' },
    { id: 'index', name: 'Index', icon: '☰', color: '#C9C9C9', intentDefault: 'organize' },
  ],

  statusProgression: [
    { id: 'incubating', name: 'Incubating', icon: '🌱', order: 1 },
    { id: 'draft', name: 'Draft', icon: '📝', order: 2 },
    { id: 'verified', name: 'Verified', icon: '✓', order: 3 },
    { id: 'captured', name: 'Captured', icon: '📦', order: 4 },
  ],

  container: undefined,  // No project container in Etymon

  outputChannels: [
    { id: 'etymon', name: 'Etymon (YouTube)', icon: '🎬', color: '#FF0000', isDefault: true },
    { id: 'loomcommander', name: 'Loomcommander (GitHub)', icon: '🛠', color: '#333333', isDefault: false },
  ],

  views: [
    { id: 'list', name: 'List', icon: '☰', component: 'ListView', isDefault: true },
    { id: 'constellation', name: 'Constellation', icon: '✧', component: 'ConstellationView', isDefault: false },
    { id: 'deck', name: 'Deck', icon: '▦', component: 'DeckView', isDefault: false },
    { id: 'spatial', name: 'Spatial', icon: '◎', component: 'SpatialView', isDefault: false },
    { id: 'flow', name: 'Flow', icon: '↕', component: 'FlowView', isDefault: false },
    { id: 'editor', name: 'Editor', icon: '✎', component: 'Editor', isDefault: false },
  ],

  tagCategories: [
    { prefix: 'perspective:', name: 'Perspective', values: ['philosophical-genealogy', 'linguistic-recovery', 'economic-genealogy', 'legal-grammar'] },
    { prefix: 'output:', name: 'Output Channel' },
  ],

  commands: [
    { id: 'excavate', name: 'Excavate', description: 'Etymological investigation', produces: 'instance', promptPath: '.claude/commands/loomlib:excavate.md' },
    { id: 'survey', name: 'Survey', description: 'Codebase investigation', produces: 'instance', promptPath: '.claude/commands/loomlib:survey.md' },
    { id: 'scope', name: 'Scope', description: 'UX requirements', produces: 'instance', promptPath: '.claude/commands/loomlib:scope.md' },
    { id: 'synthesize', name: 'Synthesize', description: 'Combine documents', produces: 'instance', promptPath: '.claude/commands/loomlib:synthesize.md' },
  ],

  intentMapping: {
    'source': 'capture',
    'note': 'capture',
    'framework': 'build',
    'instance': 'produce',
    'index': 'organize',
  },
};
```

### Studio Domain (Creator Tool)

```typescript
const studioDomain: DomainConfig = {
  id: 'studio',
  name: 'Loomlib Studio',
  description: 'Research-to-content pipeline for YouTube creators',

  documentTypes: [
    { id: 'idea', name: 'Idea', icon: '💡', color: '#FFD700', intentDefault: 'capture' },
    { id: 'source', name: 'Source', icon: '📚', color: '#7BC98A', intentDefault: 'capture' },
    { id: 'research', name: 'Research', icon: '🔍', color: '#7BA3C9', intentDefault: 'research' },
    { id: 'script', name: 'Script', icon: '📝', color: '#C9A67B', intentDefault: 'produce' },
    { id: 'asset', name: 'Asset', icon: '🎬', color: '#9B59B6', intentDefault: 'capture' },
    { id: 'template', name: 'Template', icon: '⚙', color: '#3498DB', intentDefault: 'build' },
    { id: 'series', name: 'Series', icon: '📁', color: '#C9C9C9', intentDefault: 'organize' },
  ],

  statusProgression: [
    { id: 'draft', name: 'Draft', icon: '📝', order: 1 },
    { id: 'ready', name: 'Ready', icon: '✓', order: 2 },
    { id: 'used', name: 'Used', icon: '✓✓', order: 3 },
  ],

  container: {
    id: 'project',
    name: 'Video Project',
    icon: '🎥',
    statusProgression: [
      { id: 'idea', name: 'Idea', icon: '💡', order: 1 },
      { id: 'researching', name: 'Researching', icon: '🔍', order: 2 },
      { id: 'scripting', name: 'Scripting', icon: '📝', order: 3 },
      { id: 'producing', name: 'Producing', icon: '🎬', order: 4 },
      { id: 'published', name: 'Published', icon: '✓', order: 5 },
      { id: 'evergreen', name: 'Evergreen', icon: '⭐', order: 6 },
    ],
  },

  outputChannels: [
    // User-defined at runtime, but defaults:
    { id: 'youtube', name: 'YouTube', icon: '🎬', color: '#FF0000', isDefault: true },
    { id: 'substack', name: 'Substack', icon: '✉', color: '#FF6719', isDefault: false },
    { id: 'podcast', name: 'Podcast', icon: '🎙', color: '#8E44AD', isDefault: false },
  ],

  views: [
    { id: 'pipeline', name: 'Pipeline', icon: '◫', component: 'PipelineView', isDefault: true },
    { id: 'project', name: 'Project', icon: '◧', component: 'ProjectView', isDefault: false },
    { id: 'ideas', name: 'Ideas', icon: '💡', component: 'IdeasView', isDefault: false },
    { id: 'sources', name: 'Sources', icon: '📚', component: 'SourcesView', isDefault: false },
    { id: 'assets', name: 'Assets', icon: '🎬', component: 'AssetsView', isDefault: false },
    { id: 'timeline', name: 'Timeline', icon: '📅', component: 'TimelineView', isDefault: false },
    { id: 'editor', name: 'Editor', icon: '✎', component: 'Editor', isDefault: false },
  ],

  tagCategories: [
    { prefix: 'topic:', name: 'Topic' },
    { prefix: 'format:', name: 'Format', values: ['essay', 'explainer', 'interview', 'review', 'reaction'] },
    { prefix: 'series:', name: 'Series' },
    { prefix: 'priority:', name: 'Priority', values: ['high', 'medium', 'low'] },
    { prefix: 'length:', name: 'Length', values: ['short', 'standard', 'long'] },
  ],

  commands: [
    { id: 'draft-script', name: 'Draft Script', description: 'Generate script outline', produces: 'script', promptPath: '.claude/commands/studio:draft-script.md' },
    { id: 'summarize-sources', name: 'Summarize Sources', description: 'Synthesize source material', produces: 'research', promptPath: '.claude/commands/studio:summarize-sources.md' },
    { id: 'generate-ideas', name: 'Generate Ideas', description: 'Brainstorm video ideas', produces: 'idea', promptPath: '.claude/commands/studio:generate-ideas.md' },
  ],

  intentMapping: {
    'idea': 'capture',
    'source': 'capture',
    'asset': 'capture',
    'research': 'research',
    'script': 'produce',
    'template': 'build',
    'series': 'organize',
  },
};
```

---

## V. Architecture Implications

### How Domains Load

```
┌─────────────────────────────────────────────────────────────────────┐
│                         STARTUP                                     │
│                                                                     │
│  1. Read domain config (JSON or TypeScript)                        │
│  2. Initialize types.ts with domain's document types               │
│  3. Initialize db.ts with domain's stores                          │
│  4. Initialize shell.ts with domain's views                        │
│  5. Load commands from domain's command paths                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Domain as Environment Variable

```typescript
// main.ts
const DOMAIN = import.meta.env.VITE_LOOMLIB_DOMAIN ?? 'etymon';
const config = await loadDomainConfig(DOMAIN);
initializeApp(config);
```

### Separate Builds vs. Runtime Config

**Option A: Separate Builds**

```
loomlib/          → npm run build → dist-etymon/
studio/           → npm run build → dist-studio/
```

Different builds, different configs baked in.

**Option B: Runtime Config**

```
loomlib/          → npm run build → dist/
                    ↓
                  config.json (domain config loaded at runtime)
```

Same build, config changes behavior.

**Recommendation:** Start with Option A (separate builds). Simpler. Option B is optimization for later.

---

## VI. What This Enables

### 1. Multi-Domain Deployment

Run etymon loomlib at `etymon.local:5173`
Run studio loomlib at `studio.local:5174`

Same codebase, different configs, different data.

### 2. Domain-Specific Commands

`.claude/commands/loomlib:excavate.md` — for Etymon
`.claude/commands/studio:draft-script.md` — for Studio

Commands only appear in their domain.

### 3. White-Label Potential

"Loomlib for Lawyers" — legal domain config
"Loomlib for Academics" — academic domain config
"Loomlib for [X]" — any knowledge-intensive domain

### 4. Clean Separation of Concerns

Core team maintains the invariant engine.
Domain configs can be contributed/sold separately.

---

## VII. Migration Path

### Phase 1: Extract Domain Config from Current Code

1. Create `domains/etymon.ts` with current hardcoded values
2. Refactor types.ts to read from config
3. Refactor shell.ts to read from config
4. Verify current behavior unchanged

### Phase 2: Create Studio Config

1. Create `domains/studio.ts` with Studio values
2. Add environment variable support
3. Build and test Studio domain

### Phase 3: Abstract Command Loading

1. Commands read from domain config
2. Command router checks domain
3. Commands only appear in their domain

---

## VIII. Composition

**What informed this:**
- `fw-invariants-variants` — the method for distinguishing fixed from open
- `inst-scope-loomlib-studio-ia` — Studio's specific requirements
- `inst-survey-loomlib-studio-migration` — what needs to change

**What this enables:**
- Clear architecture for multi-domain loomlib
- Implementation plan for domain system
- Framework for future domains (legal, academic, etc.)
- White-label/template product strategy

**The key insight:** Loomlib's power is in the *invariant core* (production formula, conducting frontmatter, graph structure). The value of domains is in *correctly configuring the variants* for specific workflows.
