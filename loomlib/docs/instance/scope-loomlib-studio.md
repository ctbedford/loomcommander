---
id: inst-scope-loomlib-studio
title: "Scope: Loomlib Studio — Creator Tool"
type: instance
framework_kind: null
perspective: economic-genealogy
framework_ids:
  - fw-scope-method
  - fw-oikonomia-chrematistics
source_id: null
output: loomcommander
status: incubating
tags:
  - loomlib-studio
  - commercialization
  - creator-tools
  - product-scope
  - ux-requirements

intent: research
execution_state: in_progress
upstream:
  - doc: fw-scope-method
    relation: method
  - doc: inst-recon-loomlib-commercialization
    relation: prior
  - doc: inst-survey-loomlib
    relation: informs
  - doc: idx-user-commitments
    relation: informs
downstream: []
---

# Scope: Loomlib Studio — Creator Tool

**Date:** 2026-01-11
**Subject:** Redesign loomlib as "Loomlib Studio" for content creators
**Method:** Scope Method (UX analysis)

**Positioning:** "The research-to-content pipeline for serious creators"

---

## I. The Creator Persona

Before auditing, define who we're designing for:

### Primary User: The Research-Heavy Creator

| Attribute | Description |
|-----------|-------------|
| **Role** | YouTuber, podcaster, newsletter writer, essayist |
| **Content style** | Long-form, research-intensive, episodic |
| **Pain** | Ideas scattered across tools; research doesn't flow to production |
| **Current tools** | Notion + Obsidian + Google Docs + scattered notes |
| **Time** | Hours/days of research per piece of content |
| **Output cadence** | Weekly or biweekly shipping target |

### What They Need (Not Want)

| Need | Why |
|------|-----|
| **Single source of truth** | Stop context-switching between research and writing tools |
| **Research → draft → ship** | Explicit pipeline, not just note hoarding |
| **Progress visibility** | Know where each project stands |
| **Reusable research** | Sources and frameworks compound across projects |
| **AI augmentation** | Speed up research without losing depth |

### Anti-User: The Quick-Note Taker

Loomlib Studio is NOT for:
- People who want instant capture (use Apple Notes)
- People who want beautiful WYSIWYG (use Notion)
- People who want maximum flexibility (use Obsidian)
- Teams needing real-time collaboration (use Coda)

---

## II. Audit: Current Loomlib UX

### What Exists Today

**Entry Points:**
1. Open app → List view of all documents
2. Cmd+O → Command palette search
3. Click document → Editor view
4. Click constellation → Graph view of relationships

**Document Types (5):**
- `source` ◈ — External reference material
- `note` ○ — Raw capture
- `framework` ⚙/▣ — Reusable method or lens
- `instance` ◧ — Produced document (applies frameworks)
- `index` ☰ — Curated collection

**Views (6):**
- List — Document table with columns
- Constellation — Graph of relationships
- Deck — Grid of cards grouped by lens
- Spatial — UMAP-based semantic clustering
- Editor — Markdown editing
- Flow — Unknown (in types but unclear)

**Metadata System:**
- Descriptive: type, status, tags, framework_ids, source_id, output, perspective
- Conducting: intent, execution_state, upstream, downstream

**Current Workflow:**
```
1. Capture source → source document
2. Apply framework → instance document
3. Build up instances → toward "captured" status
4. Export manually → copy-paste to publishing platform
```

### What's Missing for Creators

| Current | Gap for Creator |
|---------|-----------------|
| Documents exist in flat list | No "project" grouping |
| `output: etymon \| loomcommander` | Hardcoded channels |
| Status tracks document state | No project-level progress |
| Export = copy-paste | No publishing integrations |
| AI via Claude Code commands | Not embedded in app |
| Single user, local storage | No sharing, no sync |

---

## III. Affordances: What Current UI Suggests

### The Production Formula Promise

The constellation view and `framework_ids` field suggest:
> "Your documents are produced by combining frameworks with sources"

**This is powerful.** Creators understand recipes. The formula metaphor says: "Apply methods to material, get output."

### The Status Workflow Promise

The `incubating → draft → verified → captured` progression suggests:
> "Documents mature through stages until they become content"

**But** there's no connection to actual shipping. "Captured" is a status, not an export.

### The Lens System Promise

Multiple lenses (formula, lineage, channel, perspective) suggest:
> "See your knowledge from different angles"

**But** creators need: "See my project's progress" — no project lens exists.

### The Conducting Frontmatter Promise

`upstream/downstream` tracking suggests:
> "Know what informed this and what it enables"

**This is unique.** No competitor tracks production genealogy. Creators could show: "This video's sources → these 5 research docs → this script."

---

## IV. Expectations: What Creators Would Want

### Project-Centric Workflow

A creator expects:

```
[New Project: "Video on X"]
    │
    ├── Research phase
    │   ├── Sources added
    │   ├── Notes captured
    │   └── Frameworks applied → Instances
    │
    ├── Production phase
    │   ├── Script draft
    │   ├── Visual notes
    │   └── Speaking outline
    │
    └── Published
        └── Linked to published URL
```

**Current UX doesn't support this.** Documents exist without project context.

### Visible Progress

A creator expects:
- "This project is 60% researched"
- "I have 3 projects in development"
- "This project is blocked on X"

**Current:** Document-level status only. No aggregation.

### Output-First Thinking

A creator expects:
- "I make YouTube videos" → `output: youtube`
- "I make Substack posts" → `output: substack`
- "This project will become a podcast episode" → project-level output

**Current:** `output` field is hardcoded to `etymon | loomcommander`.

### AI Partnership

A creator expects:
- "Summarize these 5 sources for my project"
- "Draft an outline from these research notes"
- "What am I missing?"

**Current:** Claude Code commands exist but require CLI context. Not embedded in app.

### Simple Sharing

A creator expects:
- "Share this research with my editor"
- "Let my research assistant add sources"
- "Publish my project notes as a companion piece"

**Current:** Local-only. No sharing.

---

## V. Gaps: Is/Ought Mismatches

### Gap 1: No Project Container (Blocking)

| Is | Ought |
|-----|-------|
| Documents exist independently | Documents belong to projects |
| Status is per-document | Progress is per-project |
| Output is per-document | Output channel is per-project |

**Requirement:** Add `Project` entity that groups documents and tracks project-level state.

### Gap 2: Hardcoded Output Channels (Blocking)

| Is | Ought |
|-----|-------|
| `output: etymon \| loomcommander \| null` | `output: {user-defined}` |
| No UI to configure channels | Settings to create/edit channels |
| No channel-level views | "All my YouTube projects" view |

**Requirement:** User-defined output channels with custom names, icons, colors.

### Gap 3: No Publishing Integration (Friction)

| Is | Ought |
|-----|-------|
| Export = copy-paste | Export to formats (Markdown, JSON, HTML) |
| No "captured" → "published" | Published state with URL reference |
| No companion content | Public research notes / sources page |

**Requirement:** Export functionality and optional public sharing.

### Gap 4: AI Not Embedded (Friction)

| Is | Ought |
|-----|-------|
| AI via Claude Code CLI | AI commands in app |
| User needs API key elsewhere | User provides API key in settings |
| Manual command invocation | Suggested actions based on context |

**Requirement:** Embedded LLM with user-provided API key. Start with summary/outline commands.

### Gap 5: No Team/Sharing (Friction → Future)

| Is | Ought |
|-----|-------|
| Local IndexedDB only | Optional cloud sync |
| No auth | Simple accounts |
| No sharing | View-only links for projects |

**Requirement (v2):** Cloud sync and simple sharing. NOT v1 priority.

### Gap 6: No Asset Type (Polish)

| Is | Ought |
|-----|-------|
| 5 document types | 6 types: add `asset` |
| Images/clips referenced in text | First-class asset management |
| No visual research collection | Image/video/audio references |

**Requirement:** Add `asset` type for non-text research materials.

### Gap 7: No Project View (Polish)

| Is | Ought |
|-----|-------|
| Global list/constellation | Project-scoped views |
| All documents together | "Documents in this project" filter |
| Lens changes apply globally | Project as viewing context |

**Requirement:** Project as filter/context for all views.

---

## VI. Invariants and Variants

### Invariants (Cannot Change)

| Invariant | Why |
|-----------|-----|
| **5 core document types** | Instance/framework/source relationship is structural |
| **Production formula metaphor** | Core differentiator from competitors |
| **Conducting frontmatter** | Unique value; remove = lose differentiation |
| **Markdown as content format** | Technical simplicity, export flexibility |
| **Local-first architecture (v1)** | Cloud sync is v2; don't block on it |
| **Status progression** | incubating→draft→verified→captured is coherent |

### Variants (Can Change)

| Variant | Options |
|---------|---------|
| **Output channels** | Make user-defined |
| **Project container** | Add new entity type |
| **Asset type** | Add to document types |
| **AI integration** | Embed with user API key |
| **Export formats** | Add multiple |
| **Views** | Add project-scoped versions |
| **Published state** | Add beyond "captured" |

### False Invariants (Conventions, Not Requirements)

| False Invariant | Truth |
|-----------------|-------|
| "Only 5 document types" | Asset type doesn't break anything |
| "Output is metadata" | Could be project-level |
| "AI is external" | Can be embedded |
| "Single user" | View-only sharing possible without full auth |

### Hidden Invariants (Flexibility That Would Break)

| Hidden | Why Preserve |
|--------|--------------|
| **Document-level granularity** | Projects contain documents, not replace them |
| **Explicit production tracking** | Don't make upstream/downstream optional |
| **Status as maturity** | Don't overload with project state |

---

## VII. Requirements

### Must Have (MVP)

#### R1: Project Entity

```typescript
interface Project {
  id: string;
  name: string;
  description?: string;
  output_channel_id: string;
  document_ids: string[];
  status: 'planning' | 'researching' | 'producing' | 'published';
  published_url?: string;
  created_at: number;
  modified_at: number;
}
```

**Acceptance criteria:**
- [ ] User can create a new project with name and output channel
- [ ] User can add/remove documents from project
- [ ] Project status visible in list view
- [ ] Documents show which project(s) they belong to

#### R2: User-Defined Output Channels

```typescript
interface OutputChannel {
  id: string;
  name: string;           // "YouTube", "Substack", etc.
  icon: string;           // emoji or icon reference
  color: string;          // hex color
  is_default: boolean;
}
```

**Acceptance criteria:**
- [ ] Settings UI to create/edit/delete channels
- [ ] New project requires selecting channel
- [ ] Channel visible in project list
- [ ] Filter projects by channel

#### R3: Project View

**Acceptance criteria:**
- [ ] New view mode: project dashboard
- [ ] Shows all documents in project, grouped by type
- [ ] Shows project progress (% by document status)
- [ ] Quick actions: add document, change status, open editor

#### R4: Asset Document Type

```typescript
// Add to DocumentType
type DocumentType = 'source' | 'note' | 'framework' | 'instance' | 'index' | 'asset';

interface AssetMetadata {
  asset_type: 'image' | 'video' | 'audio' | 'pdf' | 'link';
  url?: string;           // for links/external
  file_path?: string;     // for local files
  thumbnail?: string;     // base64 preview
  caption?: string;
}
```

**Acceptance criteria:**
- [ ] User can create asset documents
- [ ] Assets display preview in list/deck view
- [ ] Assets can be referenced in other documents
- [ ] Assets can belong to projects

#### R5: Export Functionality

**Acceptance criteria:**
- [ ] Export single document as Markdown
- [ ] Export project as Markdown zip (all documents)
- [ ] Export project as JSON (for migration/backup)
- [ ] "Published" status with optional URL field

### Should Have (v1.1)

#### R6: Embedded AI Assistant

**Acceptance criteria:**
- [ ] Settings: enter API key (Claude, OpenAI, etc.)
- [ ] In editor: "Summarize" button for sources
- [ ] In project: "Generate outline from research" command
- [ ] AI responses saved as new documents (linked upstream)

#### R7: Project Templates

**Acceptance criteria:**
- [ ] Template for common project types (video, article, podcast)
- [ ] Templates include suggested document structure
- [ ] User can create custom templates

#### R8: Simple Sharing (View-Only)

**Acceptance criteria:**
- [ ] Generate shareable link for project
- [ ] Viewer sees read-only project page
- [ ] No auth required (security through obscurity)
- [ ] Owner can revoke link

### Out of Scope (v1)

| Feature | Reason |
|---------|--------|
| **Real-time collaboration** | Requires significant architecture change |
| **User accounts / auth** | v2 when sync is needed |
| **Mobile app** | Web-first, responsive design instead |
| **Publishing integrations** | Start with export; integrations v2 |
| **Team permissions** | View-only sharing is sufficient for v1 |
| **Billing/subscriptions** | Manual payment for beta; Stripe later |
| **Plugin system** | Focus on core workflow first |

---

## VIII. Data Model Changes

### New Types (add to types.ts)

```typescript
// ─────────────────────────────────────────────────────────────────────
// PROJECT - Container for content production
// ─────────────────────────────────────────────────────────────────────

export type ProjectStatus = 'planning' | 'researching' | 'producing' | 'published';

export interface Project {
  id: string;
  name: string;
  description: string;
  output_channel_id: string;
  status: ProjectStatus;
  published_url?: string;
  document_ids: string[];
  created_at: number;
  modified_at: number;
}

// ─────────────────────────────────────────────────────────────────────
// OUTPUT CHANNEL - User-defined content destinations
// ─────────────────────────────────────────────────────────────────────

export interface OutputChannel {
  id: string;
  name: string;
  icon: string;
  color: string;
  is_default: boolean;
}

// ─────────────────────────────────────────────────────────────────────
// ASSET - Non-text research materials
// ─────────────────────────────────────────────────────────────────────

export type AssetType = 'image' | 'video' | 'audio' | 'pdf' | 'link';

export interface AssetMetadata {
  asset_type: AssetType;
  url?: string;
  file_path?: string;
  thumbnail?: string;
  caption?: string;
  duration?: number;      // for video/audio
  dimensions?: { width: number; height: number };  // for images
}

// Extend DocumentType
export type DocumentType = 'source' | 'note' | 'framework' | 'instance' | 'index' | 'asset';

// Extend Document
export interface Document {
  // ... existing fields
  project_ids?: string[];           // documents can belong to multiple projects
  asset_metadata?: AssetMetadata;   // if type === 'asset'
}
```

### New Database Schema

```typescript
// db.ts additions

// Projects store
const projectsStore = db.createObjectStore('projects', { keyPath: 'id' });
projectsStore.createIndex('status', 'status', { unique: false });
projectsStore.createIndex('output_channel_id', 'output_channel_id', { unique: false });
projectsStore.createIndex('modified_at', 'modified_at', { unique: false });

// Output channels store
const channelsStore = db.createObjectStore('output_channels', { keyPath: 'id' });
channelsStore.createIndex('is_default', 'is_default', { unique: false });
```

### Migration Path

1. Existing `output` field on documents remains (backward compat)
2. New projects use `output_channel_id`
3. Documents gain optional `project_ids` array
4. Seed default channels from current `output` values (etymon, loomcommander)

---

## IX. UI Changes

### New Components

| Component | Purpose |
|-----------|---------|
| `ProjectList` | List of all projects with status/channel |
| `ProjectView` | Dashboard for single project |
| `ProjectModal` | Create/edit project |
| `ChannelPicker` | Select output channel |
| `ChannelSettings` | Manage output channels |
| `AssetUpload` | Add asset document |
| `ExportModal` | Export project/document options |

### View Modifications

| View | Changes |
|------|---------|
| **Shell** | Add project nav item; project context in header |
| **List** | Add "Project" column; filter by project |
| **Deck** | Add project grouping lens |
| **Editor** | Show project membership; quick add to project |
| **Constellation** | Filter by project; project node in center |

### New Routes

```
/                       → Project list (new default)
/project/:id            → Project dashboard
/project/:id/edit       → Project settings
/documents              → All documents (current list)
/document/:id           → Editor (current)
/settings/channels      → Output channel management
```

---

## X. Viability Check

### Technical Effort Estimate

| Requirement | Effort | Complexity |
|-------------|--------|------------|
| R1: Project Entity | Medium | New data type, CRUD, UI |
| R2: Output Channels | Low | Simple config UI |
| R3: Project View | Medium | New view component |
| R4: Asset Type | Medium | File handling, previews |
| R5: Export | Low | Markdown/JSON generation |
| R6: AI Assistant | Medium | API integration, UI |
| R7: Templates | Low | JSON config |
| R8: Sharing | High | Backend required |

**MVP (R1-R5):** ~2-3 weeks focused work
**v1.1 (R6-R8):** ~2-3 additional weeks

### Warrior Gap Check

From `idx-user-skills`:

| Skill | Status | Requirement |
|-------|--------|-------------|
| TypeScript | Strong | Can build this |
| React patterns | Strong | Can build this |
| UI/UX | Developing | Need to validate with users |
| Sales | Untested | Critical gap remains |
| Customer discovery | Untested | Must do before building |

**Calibration warning:** Building Loomlib Studio is Magician work. Selling it is the Warrior test. Consider: 10 customer conversations before coding.

---

## XI. Alternative: Simpler First Step

If full project system feels like over-engineering:

### Minimal Viable Studio

1. **User-defined output channels** (2 days)
   - Settings UI
   - Replace hardcoded `output` values
   - Filter by channel in list view

2. **Document tagging for projects** (1 day)
   - Use tags like `project:video-xyz`
   - No new entity, just convention
   - Filter by tag

3. **Export** (1 day)
   - Markdown export for documents
   - Filtered export (all docs with tag)

4. **Ship and learn** (ongoing)
   - Use it yourself for Etymon
   - See what's actually missing

**This takes 1 week, not 3.** And it's shippable.

---

## XII. Composition

**What informed this:**
- `fw-scope-method` — the scoping structure
- `inst-recon-loomlib-commercialization` — market analysis and formulation
- `inst-survey-loomlib` — technical architecture
- `idx-user-commitments` — telos (oikonomia, production over capture)
- `idx-user-skills` — Warrior gap awareness

**What this enables:**
- Implementation plan for Loomlib Studio
- Data model specification
- UI component list
- Prioritized backlog

**Magician-Warrior note:** This is a detailed scope. The Warrior move is: pick the minimal version (Section XI), build it in a week, use it to ship Etymon Episode 1, then iterate.

---

## XIII. Decision Required

**Option A:** Full Project System (R1-R5)
- ~3 weeks to MVP
- Complete creator workflow
- Risk: over-building before validation

**Option B:** Minimal Viable Studio (Section XI)
- ~1 week to shippable
- Output channels + export + tag conventions
- Learn what's actually needed

**Option C:** Ship Etymon First
- 0 additional loomlib work
- Use current loomlib for Etymon Episode 1
- Scope Loomlib Studio based on real experience

**Recommendation:** Option C → Option B → Option A

Ship Etymon with current loomlib. Note friction points. Build minimal studio features. Then expand if validated.

This is the Warrior path: action first, then refinement.
