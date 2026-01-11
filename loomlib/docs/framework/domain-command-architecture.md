---
id: fw-domain-command-architecture
title: "Domain Command Architecture"
type: framework
framework_kind: toolkit
perspective: null
framework_ids:
  - fw-loomlib-domains
  - fw-invariants-variants
source_id: null
output: loomcommander
status: draft
tags:
  - architecture
  - commands
  - domains
intent: build
execution_state: completed
upstream:
  - doc: fw-loomlib-domains
    relation: extends
  - doc: fw-invariants-variants
    relation: method
downstream: []
---

# Domain Command Architecture

**Type:** Toolkit Framework
**Function:** Define how commands divide labor within any loomlib domain and how that division shapes views

---

## The Core Insight

Every domain has a **command space** — the set of operations users can perform. Commands aren't random; they divide labor along predictable lines. Understanding this division reveals what views each domain needs.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMMAND LABOR DIVISION                              │
│                                                                             │
│    Commands serve five invariant intents:                                   │
│                                                                             │
│    CAPTURE ──→ RESEARCH ──→ BUILD ──→ ORGANIZE ──→ PRODUCE                 │
│       │           │           │          │            │                     │
│       ▼           ▼           ▼          ▼            ▼                     │
│    [note]     [survey]   [framework]  [index]    [instance]                │
│    [source]   [excavate]  [template]  [series]   [script]                  │
│    [idea]     [scope]                            [paper]                    │
│                                                                             │
│    Each domain populates these intents with domain-specific commands        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## I. The Invariant Command Categories

Every domain must have commands that cover these five categories:

```
┌──────────────┬────────────────────────────────────────────────────────────┐
│   CATEGORY   │                      PURPOSE                               │
├──────────────┼────────────────────────────────────────────────────────────┤
│   CAPTURE    │  Bring external material INTO the system                   │
│              │  (sources, notes, ideas, references)                       │
├──────────────┼────────────────────────────────────────────────────────────┤
│   RESEARCH   │  Develop understanding WITHIN the system                   │
│              │  (surveys, excavations, scopes, investigations)            │
├──────────────┼────────────────────────────────────────────────────────────┤
│   BUILD      │  Create reusable METHODS for the system                    │
│              │  (frameworks, templates, patterns)                         │
├──────────────┼────────────────────────────────────────────────────────────┤
│   ORGANIZE   │  Structure RELATIONS between documents                     │
│              │  (indexes, series, collections)                            │
├──────────────┼────────────────────────────────────────────────────────────┤
│   PRODUCE    │  Generate OUTPUTS for external consumption                 │
│              │  (instances, scripts, papers, briefs)                      │
└──────────────┴────────────────────────────────────────────────────────────┘
```

**This is invariant.** Every domain needs all five. The variants are:
- Which specific commands populate each category
- What document types each command produces
- What views optimize for each category's workflow

---

## II. Command → Document → View Flow

Commands produce documents. Documents cluster by intent. Views optimize for clusters.

```
                              COMMAND FLOW

    ┌─────────────────────────────────────────────────────────────────┐
    │                                                                 │
    │   COMMAND ──executes──→ PROTOCOL ──produces──→ DOCUMENT        │
    │      │                                             │            │
    │      │                                             ▼            │
    │      │                                      [document type]     │
    │      │                                      [intent field]      │
    │      │                                             │            │
    │      ▼                                             ▼            │
    │   USER INTENT                                VIEW AFFINITY      │
    │   "I want to..."                             "Show me..."       │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘

    Example:

    /excavate "wealth" ──→ Etymon Method ──→ inst-excavate-wealth.md
         │                                          │
         │                                          │
         ▼                                          ▼
    "research term"                           List view (all docs)
                                              Flow view (by status)
                                              Editor (to work on it)
```

---

## III. How Commands Shape Views

### The Principle

**Views are optimized command workspaces.**

A view exists because a cluster of commands share:
1. Similar input patterns (what they need to see)
2. Similar output patterns (what they produce)
3. Similar navigation patterns (what they link to next)

### The Pattern

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMMAND CLUSTERS → VIEW DESIGN                           │
│                                                                             │
│  ┌─────────────┐        ┌─────────────┐        ┌─────────────┐             │
│  │   CAPTURE   │        │  RESEARCH   │        │   PRODUCE   │             │
│  │  commands   │        │  commands   │        │  commands   │             │
│  └──────┬──────┘        └──────┬──────┘        └──────┬──────┘             │
│         │                      │                      │                     │
│         ▼                      ▼                      ▼                     │
│  ┌─────────────┐        ┌─────────────┐        ┌─────────────┐             │
│  │  Need to:   │        │  Need to:   │        │  Need to:   │             │
│  │  - See all  │        │  - See      │        │  - Track    │             │
│  │    raw      │        │    context  │        │    progress │             │
│  │    material │        │  - Navigate │        │  - See what │             │
│  │  - Quick    │        │    graph    │        │    feeds    │             │
│  │    capture  │        │  - Deep     │        │    output   │             │
│  │  - Triage   │        │    read     │        │  - Status   │             │
│  └──────┬──────┘        └──────┬──────┘        └──────┬──────┘             │
│         │                      │                      │                     │
│         ▼                      ▼                      ▼                     │
│  ┌─────────────┐        ┌─────────────┐        ┌─────────────┐             │
│  │  Deck View  │        │ Constell.   │        │  Pipeline   │             │
│  │  or         │        │ or Graph    │        │  or Kanban  │             │
│  │  Ideas View │        │ or Flow     │        │             │             │
│  └─────────────┘        └─────────────┘        └─────────────┘             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## IV. Domain-Specific Command Spaces

### Etymon Domain

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ETYMON COMMAND SPACE                                │
│                                                                             │
│  CAPTURE         RESEARCH           BUILD          ORGANIZE    PRODUCE     │
│  ────────        ────────           ─────          ────────    ───────     │
│  /note           /excavate          /framework     /index      /instance   │
│  /source         /survey            (manual)       (manual)    /synthesize │
│                  /scope                                        /apologetic │
│                  /recon                                                     │
│                                                                             │
│  ▼ Produces      ▼ Produces         ▼ Produces     ▼ Produces  ▼ Produces  │
│  note-*          inst-excavate-*    fw-*           idx-*       inst-*      │
│  src-*           inst-survey-*                                             │
│                  inst-scope-*                                              │
│                  inst-recon-*                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

    VIEW AFFINITIES:

    ┌────────────┬────────────────────────────────────────────────────────┐
    │   VIEW     │  OPTIMIZED FOR                                        │
    ├────────────┼────────────────────────────────────────────────────────┤
    │ List       │ All documents, filtering, quick navigation            │
    │ Constell.  │ Graph exploration, seeing connections                 │
    │ Deck       │ Card-based browsing, capture triage                   │
    │ Spatial    │ Positioning documents in 2D space                     │
    │ Flow       │ Status progression, what's in progress                │
    │ Editor     │ Deep work on single document                          │
    └────────────┴────────────────────────────────────────────────────────┘
```

### Studio Domain

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STUDIO COMMAND SPACE                                │
│                                                                             │
│  CAPTURE           RESEARCH         BUILD         ORGANIZE     PRODUCE     │
│  ────────          ────────         ─────         ────────     ───────     │
│  /capture-idea     /summarize       /template     /create-     /draft-     │
│  /add-source       /research-       (manual)       series       script     │
│  /upload-asset      topic                         /add-to-     /outline    │
│                    /analyze-                       project     /finalize   │
│                     source                                                  │
│                                                                             │
│  ▼ Produces        ▼ Produces       ▼ Produces    ▼ Produces   ▼ Produces  │
│  idea-*            research-*       template-*    series-*     script-*    │
│  source-*                                         project      (updated)   │
│  asset-*                                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

    VIEW AFFINITIES:

    ┌────────────┬────────────────────────────────────────────────────────┐
    │   VIEW     │  OPTIMIZED FOR                                        │
    ├────────────┼────────────────────────────────────────────────────────┤
    │ Pipeline   │ All projects by status (Kanban), PRODUCE workflow     │
    │ Project    │ Single project dashboard, all related docs            │
    │ Ideas      │ Unattached ideas, CAPTURE triage                      │
    │ Sources    │ Research library, CAPTURE/RESEARCH reference          │
    │ Assets     │ Visual material gallery, CAPTURE support              │
    │ Timeline   │ Deadlines, scheduling, PRODUCE planning               │
    │ Editor     │ Deep work on single document                          │
    └────────────┴────────────────────────────────────────────────────────┘
```

---

## V. The View Derivation Method

Given a domain's commands, derive its views:

### Step 1: Map Commands to Intents

```
For each command:
  → What intent does it serve? (capture/research/build/organize/produce)
  → What document type does it produce?
  → What inputs does it need?
```

### Step 2: Cluster by Workflow

```
Group commands that:
  → Serve the same intent
  → Need similar context
  → Are used in sequence
```

### Step 3: Derive View Requirements

```
For each cluster:
  → What must the user SEE? (primary data)
  → What must the user DO? (primary actions)
  → What must the user NAVIGATE to? (linking pattern)
```

### Step 4: Name and Design Views

```
Each cluster becomes a view:
  → Name reflects the intent
  → Layout optimizes for see/do/navigate
  → Commands are accessible from the view
```

---

## VI. Command Categories and View Mapping

### Capture Commands → Capture Views

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CAPTURE COMMANDS                           CAPTURE VIEWS                   │
│                                                                             │
│  /note, /source, /capture-idea              Ideas View (unattached sparks) │
│  /add-source, /upload-asset                 Sources View (reference lib)    │
│                                             Assets View (visual gallery)    │
│                                                                             │
│  User intent: "I encountered something"                                     │
│  View need: Quick entry, minimal friction, triage later                     │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                      IDEAS VIEW (Studio)                         │      │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                        │      │
│  │  │ 💡  │ │ 💡  │ │ 💡  │ │ 💡  │ │ 💡  │  Cards of ideas        │      │
│  │  │idea │ │idea │ │idea │ │idea │ │idea │  - title               │      │
│  │  │     │ │     │ │     │ │     │ │     │  - created date        │      │
│  │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘  - tags                │      │
│  │                                                                  │      │
│  │  [+ Quick Capture] — minimal form, just title                    │      │
│  │  Actions: attach to project, develop into research, archive      │      │
│  └──────────────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Research Commands → Research Views

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  RESEARCH COMMANDS                          RESEARCH VIEWS                  │
│                                                                             │
│  /excavate, /survey, /scope, /recon         Constellation (graph)          │
│  /summarize, /research-topic                Flow (by status)               │
│                                             Editor (deep work)             │
│                                                                             │
│  User intent: "I need to understand something"                              │
│  View need: See context, navigate graph, deep reading                       │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                   CONSTELLATION VIEW (Etymon)                    │      │
│  │                                                                  │      │
│  │            ┌──────┐                                              │      │
│  │            │ fw-X │                                              │      │
│  │            └──┬───┘                                              │      │
│  │               │                                                  │      │
│  │      ┌────────┼────────┐                                         │      │
│  │      │        │        │                                         │      │
│  │   ┌──┴───┐ ┌──┴───┐ ┌──┴───┐                                    │      │
│  │   │inst-A│ │inst-B│ │inst-C│  Documents as nodes                │      │
│  │   └──────┘ └──────┘ └──────┘  Edges = upstream/downstream       │      │
│  │                               Click to navigate                  │      │
│  │                               Drag to connect                    │      │
│  └──────────────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Build Commands → Build Views

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  BUILD COMMANDS                             BUILD VIEWS                     │
│                                                                             │
│  /framework (manual creation)               Templates View (Studio)         │
│  /template (manual creation)                List filtered to frameworks     │
│                                                                             │
│  User intent: "I want to create a reusable method"                          │
│  View need: See existing templates, understand patterns                     │
│                                                                             │
│  Note: BUILD is the least command-automated category                        │
│  Creating frameworks/templates is inherently manual work                    │
│  Views support this by showing what exists, not by automating creation      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Organize Commands → Organize Views

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ORGANIZE COMMANDS                          ORGANIZE VIEWS                  │
│                                                                             │
│  /index, /create-series, /add-to-project    Series View (Studio)           │
│  /cluster, /orphans                         Index View (curated lists)     │
│                                             Project View (container)       │
│                                                                             │
│  User intent: "I want to structure relationships"                           │
│  View need: See collections, manage membership, see gaps                    │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PROJECT VIEW (Studio)                         │      │
│  │                                                                  │      │
│  │   Project: "Video on X"        Status: [Scripting ▼]            │      │
│  │   ───────────────────────────────────────────────────           │      │
│  │                                                                  │      │
│  │   IDEAS (2)          RESEARCH (3)       SCRIPT (1)              │      │
│  │   ┌─────┐ ┌─────┐    ┌─────┐ ┌─────┐    ┌─────────┐            │      │
│  │   │ 💡  │ │ 💡  │    │ 🔍  │ │ 🔍  │    │  📝     │            │      │
│  │   └─────┘ └─────┘    │ ✓✓  │ │ ✓   │    │  draft  │            │      │
│  │                      └─────┘ └─────┘    └─────────┘            │      │
│  │                                                                  │      │
│  │   SOURCES (5)        ASSETS (3)                                 │      │
│  │   ┌─────┐ ┌─────┐    ┌─────┐ ┌─────┐                           │      │
│  │   │ 📚  │ │ 📚  │    │ 🎬  │ │ 🎬  │   ...                     │      │
│  │   └─────┘ └─────┘    └─────┘ └─────┘                           │      │
│  │                                                                  │      │
│  │   [+ Add Document]  [Unattach]  [Change Status]                 │      │
│  └──────────────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Produce Commands → Produce Views

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PRODUCE COMMANDS                           PRODUCE VIEWS                   │
│                                                                             │
│  /instance, /synthesize, /apologetic        Pipeline (all projects)        │
│  /draft-script, /outline, /finalize         Timeline (deadlines)           │
│                                             Flow (status tracking)         │
│                                                                             │
│  User intent: "I want to create output for external use"                    │
│  View need: Track progress, see pipeline, hit deadlines                     │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PIPELINE VIEW (Studio)                        │      │
│  │                                                                  │      │
│  │   IDEA      RESEARCH    SCRIPTING   PRODUCING   PUBLISHED       │      │
│  │   ────────  ──────────  ──────────  ──────────  ──────────      │      │
│  │   ┌─────┐   ┌─────┐     ┌─────┐     ┌─────┐     ┌─────┐        │      │
│  │   │proj │   │proj │     │proj │     │proj │     │proj │        │      │
│  │   │  A  │   │  B  │     │  C  │     │  D  │     │  E  │        │      │
│  │   └─────┘   └─────┘     └─────┘     └─────┘     └─────┘        │      │
│  │   ┌─────┐   ┌─────┐     ┌─────┐                 ┌─────┐        │      │
│  │   │proj │   │proj │     │proj │                 │proj │        │      │
│  │   │  F  │   │  G  │     │  H  │                 │  I  │        │      │
│  │   └─────┘   └─────┘     └─────┘                 └─────┘        │      │
│  │                                                                  │      │
│  │   Drag projects between columns to change status                │      │
│  │   Click project to open Project View                            │      │
│  └──────────────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## VII. The Complete View-Command Matrix

### Etymon Domain

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ETYMON: VIEW-COMMAND MATRIX                            │
│                                                                             │
│              CAPTURE   RESEARCH   BUILD   ORGANIZE   PRODUCE                │
│              ───────   ────────   ─────   ────────   ───────                │
│  List          ●         ●         ●        ●          ●                    │
│  Constell.     ○         ●         ●        ○          ○                    │
│  Deck          ●         ○         ○        ○          ○                    │
│  Spatial       ○         ●         ○        ●          ○                    │
│  Flow          ○         ●         ○        ○          ●                    │
│  Editor        ○         ●         ●        ○          ●                    │
│                                                                             │
│  ● = Primary affinity (view optimizes for this)                            │
│  ○ = Secondary affinity (view supports but doesn't optimize)               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Studio Domain

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      STUDIO: VIEW-COMMAND MATRIX                            │
│                                                                             │
│              CAPTURE   RESEARCH   BUILD   ORGANIZE   PRODUCE                │
│              ───────   ────────   ─────   ────────   ───────                │
│  Pipeline      ○         ○         ○        ●          ●                    │
│  Project       ○         ●         ○        ●          ●                    │
│  Ideas         ●         ○         ○        ○          ○                    │
│  Sources       ●         ●         ○        ○          ○                    │
│  Assets        ●         ○         ○        ○          ○                    │
│  Timeline      ○         ○         ○        ○          ●                    │
│  Editor        ○         ●         ●        ○          ●                    │
│                                                                             │
│  ● = Primary affinity (view optimizes for this)                            │
│  ○ = Secondary affinity (view supports but doesn't optimize)               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## VIII. The Invariant Requirements

Every domain MUST have:

### 1. At Least One Command Per Intent Category

```
Domain must cover:
  □ CAPTURE  — at least one way to get material in
  □ RESEARCH — at least one way to develop understanding
  □ BUILD    — at least one way to create reusables (can be manual)
  □ ORGANIZE — at least one way to structure relations
  □ PRODUCE  — at least one way to create outputs
```

### 2. At Least Three Views

```
Minimum viable views:
  □ LIST     — all documents, filtering (always present)
  □ DETAIL   — single document editing (always present)
  □ WORKFLOW — status/progress tracking (PRODUCE-focused)
```

### 3. View-Intent Coverage

```
Each intent should have at least one view that optimizes for it:
  □ CAPTURE  view where quick entry is frictionless
  □ RESEARCH view where context is visible
  □ PRODUCE  view where progress is trackable

(BUILD and ORGANIZE can share views with others)
```

### 4. Command Discoverability

```
Users must be able to:
  □ Find all available commands
  □ Understand what each produces
  □ Access them from relevant views
```

---

## IX. Designing New Domains

### The Recipe

```
1. Define the domain's OUTPUTS
   → What does success look like?
   → What external vessels receive work?

2. Work backwards to INPUTS
   → What raw material feeds outputs?
   → Where does it come from?

3. Define the METHODS
   → What transforms inputs to outputs?
   → Which are automated (commands)?
   → Which are manual (frameworks/templates)?

4. Design the CONTAINERS
   → How does work chunk?
   → What's the project unit?

5. Derive the VIEWS
   → What clusters of commands need optimization?
   → What's the primary workflow?
```

### Example: Legal Domain

```
1. OUTPUTS: Briefs, memos, contracts, filings
2. INPUTS: Cases, statutes, precedents, client facts
3. METHODS: Research, cite-check, draft, review
4. CONTAINERS: Matter (case/deal)
5. VIEWS:

   ┌───────────────────────────────────────────────────────────────────┐
   │                    LEGAL DOMAIN VIEWS                             │
   │                                                                   │
   │  Matters View ─────── All cases/deals by status (Pipeline)       │
   │  Research View ────── Cases, statutes, precedents (Sources)      │
   │  Drafting View ────── Work in progress, deadlines (Timeline)     │
   │  Calendar View ────── Court dates, filings (Calendar)            │
   │  Editor View ──────── Document editing (Editor)                  │
   │                                                                   │
   └───────────────────────────────────────────────────────────────────┘
```

---

## X. Composition

**What informed this:**
- `fw-loomlib-domains` — the overall domain configuration framework
- `fw-invariants-variants` — the method for distinguishing fixed from open
- `inst-scope-loomlib-studio-ia` — Studio's specific view/type requirements

**What this enables:**
- Clear method for deriving views from commands
- Validation checklist for new domains
- Architecture for domain-specific command routing
- Understanding of why different domains need different views

**The key insight:** Views aren't arbitrary UI choices — they're **command workspaces**. The commands a domain needs determine the views it requires. Understanding command labor division is the key to designing domain-appropriate views.
