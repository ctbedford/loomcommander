---
id: inst-scope-loomlib-studio-ia
title: "Scope: Loomlib Studio Information Architecture"
type: instance
framework_kind: null
perspective: null
framework_ids:
  - fw-scope-method
source_id: null
output: loomcommander
status: incubating
tags:
  - loomlib-studio
  - information-architecture
  - youtube-creators
  - views
  - document-types
  - taxonomy

intent: research
execution_state: in_progress
upstream:
  - doc: fw-scope-method
    relation: method
  - doc: inst-scope-loomlib-studio
    relation: prior
  - doc: inst-survey-loomlib
    relation: informs
downstream: []
---

# Scope: Loomlib Studio Information Architecture

**Date:** 2026-01-11
**Subject:** Views, document types, tags, and progressions for YouTube creators
**Method:** Scope Method (UX analysis)

**Goal:** Reimagine loomlib's information architecture for the best studio experience across all YouTube creator niches.

---

## I. YouTube Creator Niches

Before defining IA, understand the diversity of creators who'd use this:

### Creator Archetypes

| Archetype | Content Type | Research Depth | Production Complexity |
|-----------|--------------|----------------|----------------------|
| **Essayist** | Long-form analysis (30-90 min) | Very High | Medium (VO + visuals) |
| **Educator** | Tutorials, explainers | High | Medium (demos + talking head) |
| **Interviewer** | Conversations, podcasts | Medium | Low (two cameras) |
| **Storyteller** | Documentary, narrative | Very High | Very High (B-roll, archive) |
| **Commentator** | Reactions, news, takes | Low-Medium | Low (face cam + screen) |
| **Reviewer** | Products, media, experiences | Medium | Medium (product shots) |
| **Lifestyle** | Vlogs, day-in-life | Low | Medium (lots of footage) |
| **How-To** | Practical demonstrations | Medium | Medium (process shots) |

### What They All Share

Despite different niches, research-heavy creators share:

| Universal Need | Why |
|----------------|-----|
| **Capture ideas before they're ready** | Inspiration is random |
| **Collect sources/references** | Videos need evidence |
| **Develop thoughts into scripts** | Research → structure → words |
| **Track video status** | Know what's in development |
| **Reuse research across videos** | Topics compound |
| **See what's blocked/stalled** | Manage the pipeline |

### What Differs

| Variable | Essayist | Educator | Commentator |
|----------|----------|----------|-------------|
| Research depth | 50+ hours | 10-20 hours | 2-5 hours |
| Source count | 20-50 | 5-15 | 1-5 |
| Script length | 10k+ words | 2-5k words | Outline/bullets |
| Production phases | Many | Standard | Few |
| Visual research | Heavy | Medium | Light |

---

## II. Current IA vs. Creator Needs

### Current Document Types (Loomlib)

| Type | Symbol | Intent | Creator Translation |
|------|--------|--------|---------------------|
| `source` | ◈ | capture | "A video I watched" / "An article I read" |
| `note` | ○ | capture | "A raw idea" / "Something I noticed" |
| `framework` | ⚙ | build | "My approach to X" / "How I structure essays" |
| `instance` | ◧ | produce | "Analysis using that approach" |
| `index` | ☰ | organize | "Collection of related stuff" |

**Gap:** No explicit "video project" or "script" type. The production metaphor is abstract where creators think concretely.

### Current Status Progression

```
incubating → draft → verified → captured
```

**Gap:** These are document maturity states, not production stages. Creators think:
- "This video is in research"
- "This video is being scripted"
- "This video is in production"
- "This video is published"

### Current Views

| View | What It Shows | Creator Value |
|------|---------------|---------------|
| List | All documents in table | Medium — need project filtering |
| Constellation | Relationship graph | Low — too abstract for workflow |
| Deck | Cards grouped by lens | High — visual scanning |
| Spatial | Semantic clustering | Low — exploratory, not task-focused |
| Editor | Single document | High — writing interface |

**Gap:** No "Video Dashboard" view. No "What's Next" view. No "Pipeline" view.

---

## III. Reimagined Document Types

### The Creator Type System

Replace abstract types with creator-native concepts:

| New Type | Symbol | Maps From | What It Is |
|----------|--------|-----------|------------|
| `idea` | 💡 | note | Raw spark, unvalidated |
| `source` | 📚 | source | External material (video, article, book, paper) |
| `research` | 🔍 | instance | Analysis, synthesis, structured thought |
| `script` | 📝 | instance | Written content for video |
| `asset` | 🎬 | NEW | Visual/audio material (clips, images, music) |
| `template` | ⚙ | framework | Reusable structure (essay format, intro style) |
| `series` | 📁 | index | Collection of related videos |

### Type Relationships

```
[idea] → captures initial spark
    ↓
[source] → informs the idea
    ↓
[research] → applies templates to sources
    ↓
[script] → becomes the video
    ↓
[asset] → supports the script

[template] ← reused across research/scripts
[series] ← groups related videos
```

### Type Details

#### `idea` 💡

The raw spark. Unstructured. Just enough to not forget.

```yaml
type: idea
status: sparked | developing | promoted | archived
```

**Lifecycle:**
- Sparked → just captured
- Developing → being explored
- Promoted → became a video project
- Archived → won't pursue

**Minimum content:** One sentence. Title is the idea.

#### `source` 📚

External material that informs videos.

```yaml
type: source
source_type: video | article | book | paper | podcast | website
url: https://...
author: ...
date: ...
```

**Fields:**
- `source_type` — what kind of material
- `url` — link to original
- `author` / `date` — attribution
- `key_points` — extracted insights (manual or AI)
- `timestamps` — for video sources, notable moments

#### `research` 🔍

Structured analysis that develops ideas using sources.

```yaml
type: research
applies_templates: [template-id]
uses_sources: [source-ids]
for_video: video-project-id
```

**This is where thinking happens.** Research docs apply templates (frameworks) to sources to produce insight that goes into scripts.

#### `script` 📝

The written content that becomes a video.

```yaml
type: script
for_video: video-project-id
script_type: full | outline | talking_points
version: 1
```

**Script types:**
- `full` — word-for-word script
- `outline` — structured bullets
- `talking_points` — minimal notes for improv

#### `asset` 🎬

Visual and audio material.

```yaml
type: asset
asset_type: image | video_clip | audio | b_roll | screenshot | graphic
file_path: ...
thumbnail: ...
for_video: video-project-id
```

**Assets are first-class.** Creators think in visuals. A "B-roll list" is a document type, not a note.

#### `template` ⚙

Reusable structure.

```yaml
type: template
template_for: research | script | video
```

**Examples:**
- "My essay structure" (intro → thesis → evidence → synthesis → call)
- "Interview prep template" (bio, questions, follow-ups)
- "Review format" (overview, pros, cons, verdict)

#### `series` 📁

Collection of related videos.

```yaml
type: series
videos: [video-ids]
release_order: ...
```

**Not just a folder.** Series tracks:
- Which videos belong
- Release order
- Series-level metadata (intro/outro, branding)

---

## IV. Reimagined Status Progression

### Document Status vs. Video Status

**Keep document status simple:**

```
draft → ready → used
```

| Status | Meaning |
|--------|---------|
| `draft` | Still being developed |
| `ready` | Complete enough to use |
| `used` | Referenced in a published video |

**Add video/project status separately:**

```
idea → researching → scripting → producing → published → evergreen
```

| Video Status | Meaning |
|--------------|---------|
| `idea` | Just a spark, not committed |
| `researching` | Actively gathering sources and analysis |
| `scripting` | Writing the script |
| `producing` | Recording, editing, post-production |
| `published` | Live on YouTube |
| `evergreen` | Published and still performing |

### The Video Project Entity

```typescript
interface VideoProject {
  id: string;
  title: string;
  status: 'idea' | 'researching' | 'scripting' | 'producing' | 'published' | 'evergreen';

  // Content
  idea_id?: string;           // original idea
  research_ids: string[];     // research docs
  script_id?: string;         // current script
  asset_ids: string[];        // visual/audio assets

  // Metadata
  channel_id: string;         // YouTube, Podcast, etc.
  series_id?: string;         // if part of series
  target_date?: Date;         // when aiming to publish
  published_url?: string;     // YouTube URL when live

  // Tracking
  created_at: number;
  modified_at: number;
}
```

---

## V. Reimagined Views

### What Views Do Creators Need?

| View | Question It Answers |
|------|---------------------|
| **Pipeline** | "What's the status of all my videos?" |
| **Project** | "What's in this specific video?" |
| **Ideas** | "What sparks are waiting to become videos?" |
| **Research** | "What have I learned about this topic?" |
| **Assets** | "What visual material do I have?" |
| **Sources** | "What have I collected?" |
| **Timeline** | "What's coming up? What's overdue?" |
| **Editor** | "Let me write/edit this document" |

### View Specifications

#### 1. Pipeline View (Default Home)

**Question:** "What's the status of all my videos?"

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PIPELINE                                              [+ New Video]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  IDEAS (12)          RESEARCHING (3)      SCRIPTING (2)                │
│  ┌─────────────┐     ┌─────────────┐      ┌─────────────┐              │
│  │ Debt video  │     │ Fed Reserve │      │ Odysseus    │              │
│  │ 💡 sparked  │     │ 🔍 sources  │      │ 📝 v2 draft │              │
│  └─────────────┘     │    ready    │      └─────────────┘              │
│  ┌─────────────┐     └─────────────┘      ┌─────────────┐              │
│  │ Algorithm   │     ┌─────────────┐      │ Interest    │              │
│  │ 💡 sparked  │     │ Wealth etym │      │ 📝 outline  │              │
│  └─────────────┘     │ 🔍 in prog  │      └─────────────┘              │
│  ...                 └─────────────┘                                    │
│                                                                         │
│  PRODUCING (1)       PUBLISHED (24)       EVERGREEN (8)                │
│  ┌─────────────┐     ┌─────────────┐      ┌─────────────┐              │
│  │ Mortgage    │     │ Credit vid  │      │ Account vid │              │
│  │ 🎬 editing  │     │ ✓ 2.4k views│      │ ⭐ 45k views│              │
│  └─────────────┘     └─────────────┘      └─────────────┘              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Kanban-style columns by video status.** Drag to change status. Click to open project.

#### 2. Project View (Video Dashboard)

**Question:** "What's in this specific video?"

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back to Pipeline                                                     │
│                                                                         │
│  THE FED RESERVE VIDEO                             Status: RESEARCHING │
│  Channel: Etymon │ Series: Economic Genealogy      Target: Feb 15      │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  IDEA                    RESEARCH (4)                SCRIPT            │
│  ┌─────────────────┐     ┌─────────────────┐        ┌────────────────┐ │
│  │ "What if the    │     │ Fed founding    │        │ Not started    │ │
│  │  Fed was never  │     │ 📚 sources: 5   │        │                │ │
│  │  democratic?"   │     │ ✓ ready         │        │ [Start Script] │ │
│  │                 │     └─────────────────┘        └────────────────┘ │
│  │ Sparked: Jan 3  │     ┌─────────────────┐                          │
│  └─────────────────┘     │ Fed structure   │        ASSETS (2)        │
│                          │ 🔍 in progress  │        ┌────────────────┐ │
│  SOURCES (8)             └─────────────────┘        │ 🎬 Fed bldg    │ │
│  ┌─────────────────┐     ┌─────────────────┐        │ 🎬 Chart 1     │ │
│  │ 📚 Creature... │     │ Institutiona... │        └────────────────┘ │
│  │ 📚 Fed papers  │     │ 🔍 draft        │                          │
│  │ 📚 Graeber...  │     └─────────────────┘        [+ Add Asset]     │
│  │ ...            │                                                   │
│  └─────────────────┘     [+ Add Research]                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**All materials for one video in one place.** Progress visible at a glance.

#### 3. Ideas View

**Question:** "What sparks are waiting to become videos?"

```
┌─────────────────────────────────────────────────────────────────────────┐
│  IDEAS                                                  [+ Quick Idea] │
├─────────────────────────────────────────────────────────────────────────┤
│  Filter: [All] [Sparked] [Developing] [Ready to Commit]                │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐│
│  │ 💡 What if "algorithm" originally meant a person, not a process?  ││
│  │    Sparked Jan 10 │ No sources yet │ [Develop] [Archive]          ││
│  └────────────────────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────────────────┐│
│  │ 💡 The word "debt" and the word "guilt" — same root?              ││
│  │    Sparked Jan 8 │ 2 sources │ [Develop] [→ Video]                ││
│  └────────────────────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────────────────┐│
│  │ 💡 Feedback loops in nature vs. in finance — parallel?            ││
│  │    Developing │ 5 sources │ 1 research doc │ [→ Video]            ││
│  └────────────────────────────────────────────────────────────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**The idea backlog.** Not project-attached yet. Raw material.

#### 4. Sources View

**Question:** "What have I collected?"

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SOURCES                                               [+ Add Source]  │
├─────────────────────────────────────────────────────────────────────────┤
│  Filter: [All] [Video] [Article] [Book] [Paper] [Unread]               │
│  Group: [None] [Topic] [Author] [Date]                                 │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 📚 The Creature from Jekyll Island                               │  │
│  │    Book │ G. Edward Griffin │ Used in: Fed Reserve video        │  │
│  │    Key points: Federal Reserve founding, private banking...      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 📚 Debt: The First 5000 Years                                    │  │
│  │    Book │ David Graeber │ Used in: Debt video, Credit video     │  │
│  │    Key points: Debt precedes money, social relations...          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 📺 How The Economic Machine Works                                │  │
│  │    Video │ Ray Dalio │ Not yet used                              │  │
│  │    Timestamps: 3:45 credit cycle, 12:30 deleveraging...          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**The research library.** Filterable, searchable, shows usage.

#### 5. Timeline View

**Question:** "What's coming up? What's overdue?"

```
┌─────────────────────────────────────────────────────────────────────────┐
│  TIMELINE                                              [This Month ▼]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  OVERDUE                                                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ ⚠️ Odysseus video │ Target: Jan 5 │ Status: Scripting            │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  THIS WEEK                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 🟡 Interest video │ Target: Jan 15 │ Status: Scripting           │  │
│  │ 🟢 Mortgage video │ Target: Jan 18 │ Status: Producing           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  LATER THIS MONTH                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ ⚪ Fed Reserve │ Target: Jan 25 │ Status: Researching             │  │
│  │ ⚪ Wealth etym │ Target: Jan 30 │ Status: Researching             │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  UNSCHEDULED (4 videos in development with no target date)             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Production calendar.** When things are due, what's slipping.

#### 6. Assets View

**Question:** "What visual material do I have?"

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ASSETS                                                [+ Add Asset]   │
├─────────────────────────────────────────────────────────────────────────┤
│  Filter: [All] [Image] [Video Clip] [B-Roll] [Graphic] [Unused]        │
│                                                                         │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐           │
│  │ 🖼️    │  │ 🎬    │  │ 🖼️    │  │ 🎬    │  │ 🖼️    │           │
│  │ Fed    │  │ Chart  │  │ Dollar │  │ Banks  │  │ 1913   │           │
│  │ bldg   │  │ anim   │  │ bill   │  │ panic  │  │ doc    │           │
│  │        │  │        │  │        │  │        │  │        │           │
│  │ Fed vid│  │ Fed vid│  │ Unused │  │ Unused │  │ Fed vid│           │
│  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Visual library.** Grid of thumbnails. Shows which video uses each.

#### 7. Editor View (Existing, Enhanced)

**Enhancements:**
- Show video project context in header
- "Insert source reference" command
- "Link to research doc" command
- Split view: script + sources
- Word count / estimated video length

---

## VI. Tag Taxonomy

### Tag Categories

| Category | Prefix | Examples |
|----------|--------|----------|
| **Topic** | `topic:` | `topic:economics`, `topic:etymology`, `topic:history` |
| **Format** | `format:` | `format:essay`, `format:explainer`, `format:interview` |
| **Series** | `series:` | `series:economic-genealogy`, `series:word-origins` |
| **Status** | `status:` | `status:blocked`, `status:needs-review`, `status:sponsor-pending` |
| **Priority** | `priority:` | `priority:high`, `priority:low`, `priority:next` |
| **Source-Type** | `source:` | `source:book`, `source:paper`, `source:video` |
| **Length** | `length:` | `length:short` (<10min), `length:standard` (10-30), `length:long` (30+) |

### Suggested Tags by Niche

| Niche | Recommended Tags |
|-------|------------------|
| **Essayist** | `format:essay`, `length:long`, `topic:*` |
| **Educator** | `format:tutorial`, `format:explainer`, `skill-level:*` |
| **Interviewer** | `format:interview`, `guest:*`, `topic:*` |
| **Commentator** | `format:reaction`, `format:take`, `topic:news` |
| **Reviewer** | `format:review`, `product:*`, `verdict:*` |

### Tag UI

- Autocomplete from existing tags
- Create new tags inline
- Color-coding by category
- Filter views by tag
- Tag cloud in sidebar

---

## VII. Templates for Creators

### Pre-Built Templates

#### Essay Template

```markdown
# {Title}

## Hook
{Opening that grabs attention}

## Thesis
{The main argument in one sentence}

## Context
{What the audience needs to know first}

## Evidence
### Point 1
{Argument + source}

### Point 2
{Argument + source}

### Point 3
{Argument + source}

## Synthesis
{What this all means together}

## Implications
{Why this matters}

## Call to Action
{What the viewer should do/think/feel}
```

#### Research Template

```markdown
# Research: {Topic}

## Question
{What am I trying to understand?}

## Sources
- {Source 1}: {Key insight}
- {Source 2}: {Key insight}

## Key Findings
1. {Finding}
2. {Finding}

## Tensions/Contradictions
{Where sources disagree}

## Open Questions
{What I still don't know}

## Connections
{How this relates to other videos}
```

#### Interview Prep Template

```markdown
# Interview: {Guest Name}

## Guest Bio
{Background, credentials, why they're interesting}

## Interview Angle
{What's the unique take for this conversation}

## Core Questions
1. {Question}
2. {Question}
3. {Question}

## Follow-Up Threads
{Where to go deeper based on answers}

## Potential Clips
{Moments that could stand alone}

## Logistics
{Date, platform, length target}
```

---

## VIII. Navigation Structure

### Primary Navigation

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo]  Pipeline  Ideas  Sources  Assets  Timeline     [Search] [⚙]  │
└─────────────────────────────────────────────────────────────────────────┘
```

| Nav Item | Goes To |
|----------|---------|
| **Pipeline** | Kanban of all video projects |
| **Ideas** | Idea backlog (not yet videos) |
| **Sources** | Source library |
| **Assets** | Visual asset library |
| **Timeline** | Calendar/deadline view |
| **Search** | Global search across all content |
| **Settings** | Channels, templates, preferences |

### Contextual Navigation

When inside a video project:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Pipeline  │  Fed Reserve Video  │  [Idea] [Research] [Script] [Assets]
└─────────────────────────────────────────────────────────────────────────┘
```

Tabs for each content type within the project.

---

## IX. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+N` | New idea (quick capture) |
| `Cmd+Shift+N` | New video project |
| `Cmd+O` | Open / search |
| `Cmd+P` | Go to Pipeline |
| `Cmd+1-5` | Switch to tab 1-5 in project |
| `Cmd+E` | Open in editor |
| `Cmd+S` | Save current document |
| `Cmd+Shift+S` | Save and mark ready |
| `Cmd+/` | Command palette |

---

## X. Progressive Disclosure

### Beginner Mode

- Only show: Pipeline, Ideas, Sources
- Hide: Assets, Timeline, Templates
- Default to simple document types

### Creator Mode

- All views available
- Full document type system
- Template library
- Series management

### Power User Mode

- Keyboard shortcuts
- Bulk operations
- Export/import
- API access

---

## XI. Summary: The IA Redesign

### Document Types

| Old | New | Why |
|-----|-----|-----|
| `note` | `idea` | Creator language |
| `source` | `source` | Same, enhanced |
| `instance` | `research` | Clearer purpose |
| NEW | `script` | First-class artifact |
| NEW | `asset` | Visual material |
| `framework` | `template` | Creator language |
| `index` | `series` | Video collections |

### Status Progression

| Level | Old | New |
|-------|-----|-----|
| Document | incubating→draft→verified→captured | draft→ready→used |
| Video | (none) | idea→researching→scripting→producing→published→evergreen |

### Views

| Old | New |
|-----|-----|
| List | Pipeline (kanban) |
| Constellation | (removed or hidden) |
| Deck | (merged into other views) |
| Spatial | (removed or hidden) |
| Editor | Editor (enhanced) |
| NEW | Project (video dashboard) |
| NEW | Ideas, Sources, Assets, Timeline |

### Tags

Structured prefix taxonomy: `topic:`, `format:`, `series:`, `status:`, `priority:`

---

## XII. Implementation Notes

### Phase 1: Core Views (MVP)

1. Pipeline view (kanban)
2. Project view (video dashboard)
3. Enhanced editor with project context

### Phase 2: Content Management

1. Ideas view with quick capture
2. Sources view with usage tracking
3. Assets view with thumbnails

### Phase 3: Planning Features

1. Timeline view with deadlines
2. Templates library
3. Series management

### What to Preserve

| Keep | Why |
|------|-----|
| Production formula metaphor | Differentiator — templates produce research |
| Upstream/downstream tracking | Unique — lineage visibility |
| Markdown format | Export flexibility |
| Local-first storage | Privacy, no lock-in |

### What to Simplify

| Remove/Hide | Why |
|-------------|-----|
| Constellation view | Too abstract for task focus |
| Spatial view | Exploratory, not workflow |
| Complex lens system | Replace with view-specific filters |
| `perspective` field | Too academic |
| `framework_kind` | Just use `template` |

---

## XIII. Composition

**What informed this:**
- `inst-scope-loomlib-studio` — prior scope on Studio concept
- `fw-scope-method` — the scoping structure
- `inst-survey-loomlib` — current architecture understanding

**What this enables:**
- UI design mockups
- TypeScript type definitions
- View implementation specs
- Tag system implementation

**Calibration note:** This is detailed IA design — Magician territory. The Warrior test: can you sell this before building it? Consider showing wireframes to 5 creators before coding.
