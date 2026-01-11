---
description: Studio document production - routes to appropriate content type command
argument-hint: <intent> [topic or content]
---

# Studio: $ARGUMENTS

You are producing documents for **studio**, a content creation knowledge graph.

## The Production Model

Studio is a graph of materials that flow toward published content:

```
┌──────────────────────────────────────────────────────────────────────┐
│                         CONTENT GRAPH                                 │
│                                                                       │
│                         ┌──────────┐                                  │
│                         │  series  │ ← organizes content              │
│                         └────┬─────┘                                  │
│                              │                                        │
│              ┌───────────────┼───────────────┐                        │
│              ▼               ▼               ▼                        │
│   [template] ──method──→ [script] ←── [research/outline]             │
│        ↑                      ↑                      ↑                │
│        │                      │                      │                │
│   [source] ──────────────────┘                      │                │
│                                                      │                │
│   [idea] ────────────────────────────────────────────┘                │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

**Every document:**
- Was informed by something (upstream)
- Enables something (downstream)
- Has readiness state (draft → ready → used)

**Every command:**
1. Discovers related materials via API
2. Follows its protocol, informed by discoveries
3. Outputs document with conducting frontmatter
4. Reports composition (what informed this, what it enables)

---

## Document Types

| Type | Symbol | Intent | When to use |
|------|--------|--------|-------------|
| **idea** | 💡 | capture | Initial spark, raw concept |
| **source** | 📚 | capture | External reference material |
| **research** | 🔍 | research | Investigation for content |
| **script** | 📝 | produce | Written content for production |
| **asset** | 🎬 | produce | Production-ready material |
| **template** | ⚙ | build | Reusable structure or format |
| **series** | 📁 | organize | Collection of related content |

---

## Routing Logic

Parse "$ARGUMENTS" to determine document type and route:

**→ studio:idea** if:
- "idea..." / "what if..." / "concept..."
- Initial spark before research
- Raw creative capture

**→ studio:research** if:
- "research [topic]" / "investigate..."
- Gathering material for content
- Understanding a topic before scripting

**→ studio:outline** if:
- "outline [topic]" / "structure..."
- Planning content before full script
- Typically follows research

**→ studio:script** if:
- "script [topic]" / "write..."
- Creating the actual content
- Follows research/outline

**→ studio:template** if:
- "template for..." / "format for..."
- Creating reusable structure
- Applied to multiple scripts

**→ studio:source** if:
- "source:" / "reference:" / "from [author]..."
- Documenting external material

**→ studio:series** if:
- "series on..." / "collection of..."
- Organizing related content

**→ studio:asset** if:
- "asset..." / "production material..."
- Creating production-ready elements

---

## Required Frontmatter

Every document needs both descriptive and conducting frontmatter:

```yaml
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: {type}-{slug}           # unique identifier
title: {Title}              # display name
type: idea|source|research|script|asset|template|series
domain: studio              # domain membership
template_id: tpl-{slug}|null  # template applied
series_id: ser-{slug}|null    # series membership
status: draft|ready|used
tags: [tag1, tag2]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research|build|capture|organize|produce
execution_state: pending|in_progress|completed|resolved
upstream:
  - doc: {document-id}
    relation: informs|method|source|prior
downstream: []
```

### Status Workflow (Readiness)

```
draft → ready → used
```

| Status | Meaning |
|--------|---------|
| **draft** | In development, not ready for production |
| **ready** | Complete, available for use |
| **used** | Published/produced |

---

## Discovery

Query the API to understand what exists:

```bash
# What relates to this topic? (filtered by studio domain)
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.title | test("$ARGUMENTS"; "i")) | {id, title, type, status}]'

# Find ideas
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.type == "idea")]'

# Find ready scripts
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.type == "script") | select(.status == "ready")]'
```

---

## Output Location

All outputs go to: **`loomlib/docs/{type}/{slug}.md`**

```
loomlib/docs/
├── idea/          # 💡 initial concepts
├── source/        # 📚 external references
├── research/      # 🔍 investigations
├── script/        # 📝 written content
├── asset/         # 🎬 production materials
├── template/      # ⚙ reusable formats
└── series/        # 📁 organized collections
```

**Document IDs:**
- Ideas: `idea-{slug}`
- Sources: `src-{slug}`
- Research: `research-{slug}`
- Scripts: `script-{slug}`
- Assets: `asset-{slug}`
- Templates: `tpl-{slug}`
- Series: `ser-{slug}`

---

## The Command Pattern

Every routed command follows:

```
1. DISCOVERY
   └── Query API for related materials
   └── Report what exists, what state it's in
   └── Decide what to reference as upstream

2. PROTOCOL
   └── Follow the method (Research, Outline, Script, etc.)
   └── Informed by discovered documents

3. OUTPUT
   └── Write markdown with conducting frontmatter
   └── Include upstream references from discovery
   └── Set domain: studio

4. COMPOSITION
   └── Report what informed this document
   └── Report what this document enables
```

---

## Domain System

Loomlib supports multiple knowledge domains. The `/studio` command operates in the **studio** domain.

### This Domain: Studio

| Aspect | Details |
|--------|---------|
| **ID** | `studio` |
| **Purpose** | Content creation knowledge graph |
| **Types** | idea (💡), source (📚), research (🔍), script (📝), asset (🎬), template (⚙), series (📁) |
| **Status** | draft → ready → used |
| **Commands** | `/studio:*` (idea, research, outline, script, template, series, source) |

### Running in Studio Domain

```bash
# Start in studio domain
VITE_LOOMLIB_DOMAIN=studio npm run dev

# Build for studio
VITE_LOOMLIB_DOMAIN=studio npm run build
```

### Switching to Other Domains

```bash
# Run in etymon domain (default, research/philosophy)
npm run dev
```

When running in etymon domain, use `/loomlib` commands instead.

### Domain-Scoped Discovery

All discovery is scoped to the studio domain:

```bash
# Find documents in studio domain
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio")]'

# Find ready scripts
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | select(.type == "script") | select(.status == "ready")]'
```

### Other Domains

- **etymon** — Philological/philosophical research (framework → instance). Use `/loomlib` commands.

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

---

Now route "$ARGUMENTS" to the appropriate command.
