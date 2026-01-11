---
description: Loomlib document production - routes to appropriate document type command
argument-hint: <intent> [topic or content]
---

# Loomlib: $ARGUMENTS

You are producing documents for **loomlib**, a knowledge graph web application.

## The Production Model

Loomlib is a graph of documents that inform each other:

```
┌──────────────────────────────────────────────────────────────────────┐
│                         KNOWLEDGE GRAPH                              │
│                                                                      │
│                         ┌──────────┐                                 │
│                         │  recon   │ ← orchestrates collection       │
│                         └────┬─────┘                                 │
│                              │                                       │
│              ┌───────────────┼───────────────┐                       │
│              ▼               ▼               ▼                       │
│   [framework] ──method──→ [instance] ←── [survey/excavate/scope]    │
│        ↑                      ↑                      ↑               │
│        │                      │                      │               │
│   [source] ──────────────────┘                      │               │
│                                                      │               │
│   [note] ────────────────────────────────────────────┘               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Recon** is the meta-research layer that orchestrates collection disciplines (survey, excavate, source capture) and populates strategic categories.

**Every document:**
- Was informed by something (upstream)
- Enables something (downstream)
- Has production state (execution_state)

**Every command:**
0. Loads user calibration first (idx-user-commitments + idx-user-skills)
1. Discovers related documents via API
2. Follows its protocol, informed by discoveries and calibrated to commitments/skills
3. Outputs document with conducting frontmatter
4. Reports composition (what informed this, what it enables)

---

## Calibration First

Before any discovery or routing, load user calibration documents:

```bash
# Load commitments AND skills (ALWAYS FIRST)
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.id == "idx-user-commitments" or .id == "idx-user-skills")]'
```

**The commitments index defines (telos):**
- Political economy orientation (List, developmental nationalism, oikonomia)
- Lineage consciousness (Virginia Cavalier, Bedfordsonian synthesis)
- Psychological framework (KWML, Magician-Warrior imbalance)
- Anti-peers (surface-similar but telos-divergent figures)
- Strategic posture (prudence, phased approach)

**The skills index defines (capacity):**
- Technical skills (TypeScript, React, Python — what can be built)
- Intellectual skills (frameworks mastered vs. known propositionally)
- Business skills (PathX expertise, BeeSafe gaps)
- Skill-commitment alignment (where capacity matches or falls short of telos)
- Magician-Warrior skill distribution (research strong, shipping weak)

**Calibration protocol:**
- When matching peers, check commitments first — not surface features
- When selecting frameworks, prefer those that serve stated commitments
- When assessing the user, the Magician-Warrior imbalance is live context
- Flag "method-similar, telos-divergent" matches explicitly
- When planning tasks, check if required skills exist or need development
- Flag Warrior tasks (shipping, sales) as developmental priorities over Magician tasks (research, frameworks)

---

## Discovery Second

After loading commitments, query the API to understand what exists:

```bash
# What relates to this topic?
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.title | test("$ARGUMENTS"; "i")) | {id, title, type, status, intent, execution_state}]'
```

This informs routing:
- If survey exists → scope might be appropriate
- If framework exists → instance might apply it
- If nothing exists → survey or note might be the starting point

**The routed command will do its own detailed discovery.** This pre-routing check helps choose the right command.

---

## Document Types

| Type | Symbol | Intent | When to use |
|------|--------|--------|-------------|
| **framework** | ⚙/▣ | build | Creating a reusable method or lens |
| **instance** | ◧ | produce | Applying frameworks to make content |
| **recon** | ◧ | research | Domain reconnaissance — orchestrates collection, populates categories |
| **survey** | ◧ | research | Understanding code before changing (structural collection) |
| **scope** | ◧ | research | Deriving UX requirements |
| **excavate** | ◧ | research | Etymological investigation (philological collection) |
| **note** | ○ | capture | Raw thought, pre-structure |
| **source** | ◈ | capture | External reference material |
| **index** | ☰ | organize | Curating document collections |

### Framework Subtypes

- **toolkit** ⚙ — Operative method you *do* (Etymon Method, Survey Method)
- **domain** ▣ — Contextual lens you *see through* (Oikonomia, Agonal Identity)

---

## Routing Logic

Parse "$ARGUMENTS" to determine document type and route:

**→ loomlib:recon** if:
- "recon [DOMAIN]" / "map [DOMAIN]" / "intelligence on..."
- Entering unfamiliar domain with intent to act
- Need comprehensive strategic-tactical legibility
- More than excavation — need populated categories
- "what do I need to know to act in [DOMAIN]?"

**→ loomlib:survey** if:
- "survey [codebase/subsystem]" / "investigate [code]"
- Understanding something before changing it
- Need to map terrain, find files, understand architecture
- *Note: Survey is the structural collection discipline within Recon for code domains*

**→ loomlib:scope** if:
- "scope [feature]" / "ux for..." / "requirements for..."
- Deriving what ought to happen from user perspective
- Typically follows a survey

**→ loomlib:excavate** if:
- "excavate [TERM]" / "dig into [TERM]"
- Etymological/semantic investigation
- Starting research before knowing the structure

**→ loomlib:framework** if:
- "framework for..." / "method for..." / "lens for..."
- Creating something reusable across instances

**→ loomlib:instance** if:
- Applying frameworks to produce content
- Using an operator (AS, FROM, VERSUS, WITHIN, etc.)
- "[TERM] as..." / "[TERM] from..."

**→ loomlib:note** if:
- "capture..." / "note..." / "raw thought..."
- Unstructured, needs triage later

**→ loomlib:source** if:
- "source:" / "reading:" / "from [author]..."
- Documenting external material

**→ loomlib:index** if:
- "index of..." / "collection of..."
- Curating existing documents

**→ loomlib:triage** if:
- "classify..." / "what type is..."
- Uncertain about document type

**→ loomlib:promote** if:
- "verify..." / "promote..." / "status..."
- Moving document through status workflow

**→ loomlib:resolve** if:
- "resolve..." / "close out..." / "done with..."
- Recording outcome and closing document

---

## Composition Commands

These commands operate across multiple documents:

**→ loomlib:synthesize** if:
- "synthesize..." / "combine..." / "merge insights from..."
- Arguments contain `+` joining document IDs
- Creating emergent insight from multiple sources

**→ loomlib:lineage** if:
- "lineage of..." / "trace..." / "where did X come from..."
- Understanding production genealogy
- Single document ID as argument

**→ loomlib:review** if:
- "review..." / "assess..." / "ready for promotion?"
- Structured quality assessment before status change
- Single document ID as argument

**→ loomlib:compare** if:
- "compare..." / "difference between..."
- Multiple document IDs (space-separated)
- Preparing for VERSUS instance or synthesis

---

## Graph Analysis Commands

These commands analyze the knowledge graph:

**→ loomlib:orphans** if:
- "orphans" / "find unconnected..." / "composition debt..."
- Finding documents with missing relationships
- Optional filters: `--type`, `--severity`

**→ loomlib:status** if:
- "status" / "dashboard" / "overview"
- Getting current state of the knowledge graph
- Optional: `--detail` for full listings

**→ loomlib:cluster** if:
- "cluster..." / "group by..." / "find related..."
- Finding implicit document groupings
- Requires: `--by tags|perspective|framework|output|topic`

**→ loomlib:similar** if:
- "similar to..." / "more like..." / "find documents like..."
- Finding semantically similar documents
- Single document ID as argument

**→ loomlib:contradict** if:
- "contradict..." / "challenge..." / "tensions with..."
- Finding documents that might oppose target
- Single document ID as argument

---

## Required Frontmatter

Every document needs both descriptive and conducting frontmatter:

```yaml
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: {type}-{slug}           # unique identifier
title: {Title}              # display name
type: framework|instance|note|source|index
framework_kind: toolkit|domain|null  # if type=framework
framework_ids: [fw-method]  # frameworks that produced this
source_id: src-{slug}|null  # source referenced
output: etymon|loomcommander|null  # channel
perspective: philosophical-genealogy|linguistic-recovery|economic-genealogy|legal-grammar|null
status: incubating|draft|verified|captured
tags: [tag1, tag2]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research|build|capture|organize|produce
execution_state: pending|in_progress|completed|resolved
upstream:
  - doc: {document-id}
    relation: informs|method|source|prior
downstream: []
```

### Conducting Fields

| Field | Values | Purpose |
|-------|--------|---------|
| `intent` | research, build, capture, organize, produce | What kind of production |
| `execution_state` | pending, in_progress, completed, resolved | Lifecycle state |
| `upstream` | `[{doc, relation}]` | What informed this document |
| `downstream` | `[{doc, relation}]` | What this document enables |

### Intent by Type

| Document | Intent |
|----------|--------|
| recon, survey, scope, excavate | research |
| framework | build |
| instance | produce |
| source, note | capture |
| index | organize |

---

## Status Workflow

```
incubating → draft → verified → captured
```

| Status | Meaning |
|--------|---------|
| **incubating** | Early stage, needs development |
| **draft** | Shaped but unverified |
| **verified** | Survived pressure, ready for use |
| **captured** | Exported to vessel (video, tool) |

### Execution State (Conducting)

```
pending → in_progress → completed → resolved
```

| State | Meaning |
|-------|---------|
| **pending** | Not yet started |
| **in_progress** | Being worked on |
| **completed** | Done, available for downstream |
| **resolved** | Closed out via /loomlib:resolve |

---

## App Architecture

Loomlib is a TypeScript/Vite web app at `loomlib/`:

```
┌──────────────┐     GET /api/docs      ┌──────────────┐
│   Browser    │ ◄────────────────────  │  Markdown    │
│  (IndexedDB) │                        │   Files      │
└──────────────┘                        └──────────────┘
       │                                       ▲
       │ Browser edit                          │
       └───────────────── POST /api/docs/:id ──┘
```

**The API is the source of truth for discovery:**
```bash
# Get all documents with frontmatter
curl -s http://localhost:5173/api/docs

# Find surveys
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.id | contains("survey"))]'

# Find completed research
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.intent == "research") | select(.execution_state == "completed")]'

# Find what informed a document
curl -s http://localhost:5173/api/docs | jq '.[] | select(.id == "inst-scope-X") | .upstream'
```

---

## Output Location

All outputs go to: **`loomlib/docs/{type}/{slug}.md`**

```
loomlib/docs/
├── framework/     # ⚙/▣ toolkits and domains
├── instance/      # ◧ produced documents (surveys, scopes, excavations, etc.)
├── note/          # ○ raw capture
├── source/        # ◈ external references
└── index/         # ☰ navigation collections
```

**Document IDs:**
- Frameworks: `fw-{slug}`
- Instances: `inst-{slug}` (includes surveys, scopes, excavations)
- Notes: `note-{slug}`
- Sources: `src-{slug}`
- Indexes: `idx-{slug}`

---

## The Command Pattern

Every routed command follows:

```
0. CALIBRATION
   └── Load idx-user-commitments (telos) + idx-user-skills (capacity)
   └── Commitments: political economy, lineage, psychology, anti-peers
   └── Skills: what can be done, Magician-Warrior distribution, gaps
   └── This shapes all subsequent steps

1. DISCOVERY
   └── Query API for related documents
   └── Report what exists, what state it's in
   └── Decide what to reference as upstream

2. PROTOCOL
   └── Follow the method (Survey Method, Scope Method, etc.)
   └── Informed by discovered documents
   └── Check framework fit against user commitments
   └── Check task fit against user skills

3. OUTPUT
   └── Write markdown with conducting frontmatter
   └── Include upstream references from discovery
   └── Flag any telos-divergent peers or frames
   └── Flag any skill gaps required for execution

4. COMPOSITION
   └── Report what informed this document
   └── Report what this document enables
   └── Note if output serves or diverges from stated commitments
   └── Note if output is Magician (research) or Warrior (shipping)
```

---

## Reference: Available Frameworks

Query the API for current frameworks:
```bash
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "framework") | {id, title, framework_kind}]'
```

**Core Methods (toolkits):**
- **Recon Method** — collection → processing → analysis → packaging → populated categories
- **Etymon Method** — excavation → drift → recovery (philological collection discipline)
- **Survey Method** — survey → core sample → stratigraphy → findings (structural collection discipline)
- **Scope Method** — audit → affordances → expectations → gaps → requirements
- **Conducting Frontmatter** — discovery → protocol → output → composition

**Operators (for instances):**
AS, FROM, VERSUS, WITHIN, WITHOUT, BEFORE, AFTER, THROUGH, OF, FOR, TO, AGAINST, BEHIND, AND, OR

**Output Channels:**
- etymon (YouTube)
- loomcommander (GitHub/tools)

---

## Domain System

Loomlib supports multiple knowledge domains. The `/loomlib` command operates in the **etymon** domain by default.

### This Domain: Etymon

| Aspect | Details |
|--------|---------|
| **ID** | `etymon` |
| **Purpose** | Philological/philosophical research graph |
| **Types** | framework (⚙/▣), instance (◧), source (◈), note (○), index (☰) |
| **Status** | incubating → draft → verified → captured |
| **Commands** | `/loomlib:*` (survey, scope, excavate, framework, instance, etc.) |

### Switching Domains

```bash
# Run in etymon domain (default)
npm run dev

# Run in studio domain (content creation)
VITE_LOOMLIB_DOMAIN=studio npm run dev
```

When running in studio domain, use `/studio` commands instead.

### Domain-Scoped Discovery

All discovery is scoped to the current domain:

```bash
# Find documents in etymon domain
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "etymon" or .domain == null)]'
```

### Other Domains

- **studio** — Content creation (idea → research → script → asset). Use `/studio` commands.

See `idx-loomlib-domains-guide` for full domain documentation.

---

## Integration Notes

**Dev mode (`npm run dev`):**
- Changes appear on refresh
- API reads markdown directly

**Production (`npm run build`):**
- Regenerates seed-data.ts automatically

**For more context:**
- See `idx-loomlib-domains-guide` for domain switching and configuration
- See `idx-conducting-frontmatter-system` for the full system documentation
- See `fw-conducting-frontmatter` for the schema definition
- See `idx-user-commitments` for telos calibration (what you're committed to)
- See `idx-user-skills` for capacity calibration (what you can do)

---

Now route "$ARGUMENTS" to the appropriate command.
