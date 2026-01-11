---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-scope-frontmatter-ui-mapping
title: "Scope: Frontmatter-to-UI Mapping and Domain Configuration"
type: instance
framework_kind: null
framework_ids:
  - fw-scope-method
  - fw-loomlib-domains
  - fw-domain-design-audit
  - fw-domain-command-architecture
source_id: null
output: loomcommander
perspective: null
status: draft
tags:
  - scope
  - ui
  - frontmatter
  - domains
  - configuration
  - architecture

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-loomlib-domains
    relation: method
  - doc: fw-domain-design-audit
    relation: informs
  - doc: fw-domain-command-architecture
    relation: informs
downstream: []
---

# Scope: Frontmatter-to-UI Mapping and Domain Configuration

**Date:** 2025-01-11
**Intent:** Derive how UI elements in Editor, List, and Deck views can be populated entirely from frontmatter fields, enabling domains to configure their display without extending the data model.

---

## The Core Insight

The screenshots reveal something important: **every visual element in loomlib's views already maps to frontmatter fields**. We don't need to extend the data model for different domains — we need a **configuration layer** that tells views which frontmatter fields to display and how to label them.

The current data model has:
- Document types → but domains want different type names
- Status values → but domains want different status progressions
- Intent categories → but domains want different workflow stages
- Upstream/downstream → universal, keeps working

**The shift:** Instead of "projects" as a container, use **domains** as the configuration context. A domain configuration remaps:
- What frontmatter fields display in each view slot
- What labels appear for those fields
- What icons/colors represent different values
- What commands are available (domain-specific frameworks become commands)

---

## I. UI Element Inventory from Screenshots

### Editor View (Image 6: Domain Design Audit)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EDITOR VIEW UI ELEMENTS                                                    │
│                                                                             │
│  TOP BAR                                                                    │
│  ├── View switcher icons (≡, ○, ↕, ■)                                      │
│  ├── Title: "Domain Design Audit"                                          │
│  └── Mode buttons: [Editor] [§] [=] [Triage]                               │
│                                                                             │
│  METADATA ROW                                                               │
│  ├── Type badge: "framework / toolkit"  ← type + framework_kind            │
│  ├── Status badge: "draft"              ← status                           │
│  ├── Status dots: ●●●●                  ← status progression indicator     │
│  └── Tags: [architecture] [domains] [audit] ← tags[]                       │
│                                                                             │
│  LEFT PANEL: OUTLINE                                                        │
│  └── Section headers from document content (not frontmatter)               │
│                                                                             │
│  RIGHT PANEL: RELATED                                                       │
│  ├── UPSTREAM section                                                       │
│  │   ├── ⚙ Domain Command Ar... [extends]  ← upstream[].doc + relation    │
│  │   └── ⚙ Loomlib Domains Fra... [method] ← upstream[].doc + relation    │
│  │                                                                          │
│  └── SIMILAR section                                                        │
│      ├── ◧ Scope: Loomlib Studio — Cr...   ← computed similarity           │
│      ├── ◧ Scope: Loomlib Studio Infor...  ← computed similarity           │
│      ├── ⚙ Scope Method                    ← computed similarity           │
│      └── ...                                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Frontmatter fields used:**
| UI Element | Frontmatter Field | Notes |
|------------|------------------|-------|
| Type badge (left) | `type` | "framework" |
| Subtype badge (right) | `framework_kind` | "toolkit" |
| Status badge | `status` | "draft" |
| Status dots | `status` | Position in progression |
| Tags | `tags[]` | Array displayed as pills |
| Upstream docs | `upstream[].doc` | Document ID resolved to title |
| Relation labels | `upstream[].relation` | "extends", "method" |
| Title | `title` | Top bar |

### List View (Image 7: Document List)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LIST VIEW UI ELEMENTS                                                      │
│                                                                             │
│  FILTER BAR                                                                 │
│  ├── Status filters: ○○○○ ●○○○ ●●●● ✓  ← status progression states        │
│  ├── Intent filters: 📖 ✎ ◧ ⚡         ← intent icons                      │
│  └── Tag pills: [taxonomy] [procedural] [instructor] ... ← tags           │
│                                                                             │
│  DOCUMENT ROW                                                               │
│  ├── Type icon: ◧ (instance) or ⚙ (framework) ← type                      │
│  ├── Lineage icon: ↗                           ← has upstream              │
│  ├── Title: "Scope: Outline Panel..."          ← title                     │
│  ├── Upstream preview: "↑ Scope Method"        ← upstream[0].doc          │
│  ├── Type label: [INSTANCE] or [TOOLKIT]       ← type or framework_kind   │
│  ├── Status dots: ●●●●                         ← status                   │
│  ├── Upstream count: ↑2                        ← upstream.length          │
│  └── Recency: "15m ago"                        ← computed from file       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Frontmatter fields used:**
| UI Element | Frontmatter Field | Notes |
|------------|------------------|-------|
| Type icon | `type` | ⚙ for framework, ◧ for instance |
| Lineage indicator | `upstream.length > 0` | ↗ if has upstream |
| Title | `title` | Main text |
| Upstream preview | `upstream[0].doc` | First upstream resolved |
| Type/Kind badge | `type` or `framework_kind` | INSTANCE, TOOLKIT |
| Status dots | `status` | Position in progression |
| Upstream count | `upstream.length` | ↑2 |
| Recency | (computed) | File modification time |

### Deck View (Image 8: Card Grid)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DECK VIEW UI ELEMENTS                                                      │
│                                                                             │
│  FILTER/SORT BAR                                                            │
│  ├── [Type 1]      ← type filter                                           │
│  ├── [Recency 2]   ← sort by modification                                  │
│  ├── [State 3]     ← status filter                                         │
│  ├── [Intent 4]    ← intent filter                                         │
│  └── [Lineage 5]   ← upstream/downstream filter (active)                   │
│                                                                             │
│  TAG BAR                                                                    │
│  └── Tag pills (filterable): [political-the...] [aesthetic] [legitimacy]   │
│                                                                             │
│  CARD                                                                       │
│  ├── Title: "Apologetic: Four Knowings"    ← title                         │
│  ├── Status dots: ●●●                      ← status                        │
│  ├── Lineage icon: ↗                       ← has upstream                  │
│  ├── Type badge: [INSTANCE]                ← type                          │
│  └── (selected state: cyan border)         ← UI state only                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Frontmatter fields used:**
| UI Element | Frontmatter Field | Notes |
|------------|------------------|-------|
| Title | `title` | Card header |
| Status dots | `status` | 2-4 dots based on position |
| Lineage icon | `upstream.length > 0` | ↗ if has upstream |
| Type badge | `type` | INSTANCE, FRAMEWORK, INDEX |
| Filter: Type | `type` | Faceted search |
| Filter: State | `status` | Faceted search |
| Filter: Intent | `intent` | Faceted search |
| Filter: Lineage | `upstream.length` | Has/hasn't relations |

---

## II. The Configuration Model

### Current State: Hardcoded in Views

Right now, each view component has hardcoded:
- Field names ("status", "type", "upstream")
- Labels ("INSTANCE", "TOOLKIT")
- Icons (⚙, ◧, ○)
- Status progression (incubating → draft → verified → captured)

### Target State: Domain Configuration

A domain configuration file that views read:

```typescript
interface DomainUIConfig {
  // What to call the primary classification
  typeField: {
    frontmatterKey: 'type';       // What field to read
    displayName: 'Document Type'; // Label in UI
    values: {
      [value: string]: {
        label: string;            // "Framework", "Instance", etc.
        icon: string;             // ⚙, ◧, ○, etc.
        color: string;            // For badges
      }
    }
  };

  // What to call the status progression
  statusField: {
    frontmatterKey: 'status';
    displayName: 'Maturity';
    progression: string[];        // ['incubating', 'draft', 'verified', 'captured']
    values: {
      [value: string]: {
        label: string;
        position: number;         // For dot display
      }
    }
  };

  // What to call the intent
  intentField: {
    frontmatterKey: 'intent';
    displayName: 'Intent';
    values: {
      [value: string]: {
        label: string;
        icon: string;
      }
    }
  };

  // What to show in relation panels
  relationFields: {
    upstream: {
      frontmatterKey: 'upstream';
      displayName: 'Informed By';  // Could be "Prior Work", "Sources", etc.
    };
    downstream: {
      frontmatterKey: 'downstream';
      displayName: 'Enables';
    };
  };

  // Which fields to show where
  viewSlots: {
    editor: {
      metadataRow: ['type', 'framework_kind', 'status', 'tags'];
      rightPanel: ['upstream', 'similar'];
    };
    list: {
      primaryBadge: 'type';
      secondaryBadge: 'framework_kind';
      statusIndicator: 'status';
      lineagePreview: 'upstream';
    };
    deck: {
      cardBadge: 'type';
      statusDots: 'status';
      filterFields: ['type', 'status', 'intent', 'upstream'];
    };
  };
}
```

---

## III. Domain Examples

### Etymon Domain (Current)

```typescript
const etymonConfig: DomainUIConfig = {
  typeField: {
    frontmatterKey: 'type',
    displayName: 'Document Type',
    values: {
      'framework': { label: 'Framework', icon: '⚙', color: '#7BA3C9' },
      'instance':  { label: 'Instance', icon: '◧', color: '#C9A67B' },
      'source':    { label: 'Source', icon: '◈', color: '#7BC98A' },
      'note':      { label: 'Note', icon: '○', color: '#8A8A8A' },
      'index':     { label: 'Index', icon: '☰', color: '#C9C9C9' },
    }
  },
  statusField: {
    frontmatterKey: 'status',
    displayName: 'Maturity',
    progression: ['incubating', 'draft', 'verified', 'captured'],
    values: {
      'incubating': { label: 'Incubating', position: 1 },
      'draft':      { label: 'Draft', position: 2 },
      'verified':   { label: 'Verified', position: 3 },
      'captured':   { label: 'Captured', position: 4 },
    }
  },
  intentField: {
    frontmatterKey: 'intent',
    displayName: 'Intent',
    values: {
      'research': { label: 'Research', icon: '🔍' },
      'build':    { label: 'Build', icon: '⚙' },
      'capture':  { label: 'Capture', icon: '◈' },
      'organize': { label: 'Organize', icon: '☰' },
      'produce':  { label: 'Produce', icon: '◧' },
    }
  },
  // ...
};
```

### Studio Domain (Creator Tool)

```typescript
const studioConfig: DomainUIConfig = {
  typeField: {
    frontmatterKey: 'type',
    displayName: 'Material Type',
    values: {
      'idea':     { label: 'Idea', icon: '💡', color: '#FFD700' },
      'source':   { label: 'Source', icon: '📚', color: '#7BC98A' },
      'research': { label: 'Research', icon: '🔍', color: '#7BA3C9' },
      'script':   { label: 'Script', icon: '📝', color: '#C9A67B' },
      'asset':    { label: 'Asset', icon: '🎬', color: '#9B59B6' },
      'template': { label: 'Template', icon: '⚙', color: '#3498DB' },
      'series':   { label: 'Series', icon: '📁', color: '#C9C9C9' },
    }
  },
  statusField: {
    frontmatterKey: 'status',
    displayName: 'Readiness',
    progression: ['draft', 'ready', 'used'],
    values: {
      'draft': { label: 'Draft', position: 1 },
      'ready': { label: 'Ready', position: 2 },
      'used':  { label: 'Used', position: 3 },
    }
  },
  // ...
};
```

### Institutional Domain (Policy/Founding)

```typescript
const institutionalConfig: DomainUIConfig = {
  typeField: {
    frontmatterKey: 'type',
    displayName: 'Element Type',
    values: {
      'vision':      { label: 'Vision', icon: '👁', color: '#E74C3C' },
      'theory':      { label: 'Theory', icon: '📖', color: '#9B59B6' },
      'structure':   { label: 'Structure', icon: '🏛', color: '#3498DB' },
      'coalition':   { label: 'Coalition', icon: '🤝', color: '#2ECC71' },
      'reproduction':{ label: 'Reproduction', icon: '🔄', color: '#F39C12' },
      'assessment':  { label: 'Assessment', icon: '📊', color: '#95A5A6' },
    }
  },
  statusField: {
    frontmatterKey: 'status',
    displayName: 'Development Phase',
    progression: ['identified', 'developing', 'built', 'defended'],
    values: {
      'identified': { label: 'Identified', position: 1 },
      'developing': { label: 'Developing', position: 2 },
      'built':      { label: 'Built', position: 3 },
      'defended':   { label: 'Defended', position: 4 },
    }
  },
  intentField: {
    frontmatterKey: 'intent',
    displayName: 'Founding Phase',
    values: {
      'research':  { label: 'Reconnaissance', icon: '🔍' },
      'build':     { label: 'Design', icon: '📐' },
      'organize':  { label: 'Coalition', icon: '🤝' },
      'produce':   { label: 'Founding Act', icon: '⚡' },
      'capture':   { label: 'Documentation', icon: '📄' },
    }
  },
  // ...
};
```

---

## IV. The Key Architectural Shift

### Before: Data Model Extension

```
User wants new domain → Extend types.ts → Add new type values →
  Change view components → Hardcode new icons → Deploy new build
```

### After: Configuration Layer

```
User wants new domain → Create domain-config.ts → Views read config →
  Same views, different display → Hot-reload or env switch
```

### What Changes

| Component | Before | After |
|-----------|--------|-------|
| **types.ts** | Defines all possible values | Defines structure only (type, status, tags) |
| **View components** | Hardcode labels/icons | Read from domain config |
| **Filters** | Hardcode filter options | Generate from config |
| **Status dots** | Hardcode 4-step progression | Read progression from config |
| **Type badges** | Hardcode icons | Look up in config |

### What Doesn't Change

| Component | Stays the Same |
|-----------|----------------|
| **Frontmatter structure** | Still `type`, `status`, `upstream[]`, etc. |
| **Graph relationships** | Upstream/downstream universal |
| **Conducting fields** | intent, execution_state universal |
| **File storage** | Markdown in loomlib/docs/{type}/ |
| **API** | Same endpoints, just different data |

---

## V. Commands as Domain Frameworks

The insight from the request: **commands can do the work of frameworks**. Instead of:

- Etymon domain has `fw-etymon-method` framework
- User runs `/loomlib:excavate` which uses that framework

The pattern becomes:

- Etymon domain has `/loomlib:excavate` command
- The command **is** the framework made operative
- No need for a separate "framework" document type — the command embodies the method

### Domain-Specific Commands

| Domain | Commands (embodied methods) |
|--------|---------------------------|
| **Etymon** | excavate, survey, scope, synthesize, apologetic |
| **Studio** | draft-script, outline, summarize-sources |
| **Institutional** | found, assess-element, map-coalition, plan-reproduction |

### The Command IS the Framework

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  BEFORE: Framework + Command                                                │
│                                                                             │
│  fw-etymon-method.md ← User reads this, understands method                  │
│        ↓                                                                    │
│  /loomlib:excavate ← Command implements method                              │
│        ↓                                                                    │
│  inst-excavate-X.md ← Output references fw-etymon-method as framework_id    │
│                                                                             │
│  AFTER: Command AS Framework                                                │
│                                                                             │
│  /loomlib:excavate ← Command prompt file IS the method documentation        │
│        ↓                                                                    │
│  inst-excavate-X.md ← Output references command as its method               │
│                                                                             │
│  The command prompt file (.claude/commands/loomlib:excavate.md) serves as:  │
│  - User-readable method documentation                                       │
│  - Claude's execution instructions                                          │
│  - The thing referenced as "what produced this"                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Framework Documents Still Valuable

Domain frameworks (▣) remain valuable — they're **contextual lenses** not operative methods:
- `fw-oikonomia-chrematistics` — how to see economic arrangements
- `fw-agonal-identity` — how to see self-constitution
- `fw-institutionalization-elements` — how to see institutions

These inform how you use commands, but aren't themselves commands.

Toolkit frameworks (⚙) might collapse into commands:
- `fw-survey-method` → `/loomlib:survey` command
- `fw-scope-method` → `/loomlib:scope` command
- `fw-etymon-method` → `/loomlib:excavate` command

---

## VI. Implementation Requirements

### 1. Domain Configuration Schema

Create `loomlib/src/config/domain.ts`:

```typescript
interface DomainConfig {
  id: string;
  name: string;

  // UI field mapping
  fields: {
    type: FieldConfig;
    status: StatusFieldConfig;
    intent: FieldConfig;
    // ... other fields
  };

  // View slot configuration
  views: {
    editor: EditorViewConfig;
    list: ListViewConfig;
    deck: DeckViewConfig;
  };

  // Available commands for this domain
  commands: CommandConfig[];
}
```

### 2. Config Loading

```typescript
// main.ts
const DOMAIN = import.meta.env.VITE_LOOMLIB_DOMAIN ?? 'etymon';
const config = await loadDomainConfig(DOMAIN);
// Pass config to all views
```

### 3. View Refactoring

Each view needs to:
1. Accept domain config as prop or context
2. Look up labels/icons from config instead of hardcoding
3. Generate filters from config values
4. Display appropriate fields based on viewSlots config

### 4. Command Discovery

Commands available depends on domain:
- Read `.claude/commands/{domain}:*.md` files
- Present in command palette
- Route based on domain

---

## VII. Migration Path

### Phase 1: Extract Current Config

1. Create `domains/etymon.ts` with current hardcoded values
2. Refactor views to read from config object
3. Verify current behavior unchanged

### Phase 2: Abstract the Pattern

1. Create `DomainConfig` interface
2. Make views fully config-driven
3. Add domain switching capability

### Phase 3: Add New Domains

1. Create `domains/studio.ts`, `domains/institutional.ts`
2. Test views render correctly with different configs
3. Add domain-specific commands

---

## VIII. Composition

**What informed this scope:**
- `fw-loomlib-domains` — the framework establishing variant/invariant distinction
- `fw-domain-design-audit` — the questionnaire for validating domain design
- `fw-domain-command-architecture` — how commands shape views
- `fw-institutionalization-elements` — example of domain that could be configured
- Screenshots of Editor, List, Deck views — actual UI analysis

**What this scope enables:**
- Architectural decision to use configuration over data model extension
- Clear mapping of every UI element to frontmatter field
- Path to multi-domain loomlib without code changes per domain
- Understanding that commands can embody frameworks

**The key insight:** Every UI element already maps to frontmatter. The question isn't "what new fields do we need?" but "how do we make the display configurable?" Domains aren't containers holding documents — they're configurations that tell views how to render the same underlying document structure.

---

## Summary

| Aspect | Finding |
|--------|---------|
| **UI Elements** | All map to existing frontmatter fields |
| **Configuration Need** | Labels, icons, progression values, view slots |
| **Data Model** | No extension needed — structure is sufficient |
| **Domain as...** | Configuration context, not container |
| **Commands as...** | Embodied frameworks for the domain |
| **Migration** | Extract current config → abstract → add domains |

The path forward is clear: don't extend the data model, configure the display. Every visual element in the screenshots has a frontmatter source. Domains configure how to interpret and display those sources.
