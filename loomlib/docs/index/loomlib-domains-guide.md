---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: idx-loomlib-domains-guide
title: "Loomlib Domains Guide"
type: index
framework_kind: null
framework_ids:
  - fw-loomlib-domains
source_id: null
output: loomcommander
perspective: null
status: draft
tags:
  - domains
  - architecture
  - configuration
  - operations

# ─── CONDUCTING ─────────────────────────────────────────────
intent: organize
execution_state: completed
upstream:
  - doc: fw-loomlib-domains
    relation: method
  - doc: inst-scope-domain-startup-performance
    relation: prior
  - doc: inst-scope-frontmatter-ui-mapping
    relation: prior
downstream: []
---

# Loomlib Domains Guide

This guide explains how to operate loomlib across multiple domains. Each domain is a separate knowledge graph with its own document types, status progressions, and commands.

---

## What is a Domain?

A domain is a **configuration context** that controls:

1. **What document types exist** — etymon has framework/instance/note, studio has idea/script/template
2. **What status progression applies** — etymon uses incubating→draft→verified→captured, studio uses draft→ready→used
3. **What commands are available** — `/loomlib:excavate` for etymon, `/studio:script` for studio
4. **What documents are visible** — each domain only sees its own documents

Domains are **not containers** — they're configurations. The same underlying data model supports all domains; the domain just changes how it's displayed and what's available.

---

## Available Domains

### Etymon (Default)

The philological/philosophical research domain.

| Aspect | Details |
|--------|---------|
| **ID** | `etymon` |
| **Purpose** | Knowledge graph for research and framework development |
| **Types** | framework (⚙/▣), instance (◧), source (◈), note (○), index (☰) |
| **Status** | incubating → draft → verified → captured |
| **Commands** | /loomlib, /loomlib:survey, /loomlib:scope, /loomlib:excavate, etc. |

### Studio

The content creation domain.

| Aspect | Details |
|--------|---------|
| **ID** | `studio` |
| **Purpose** | Knowledge graph for video/audio/written content production |
| **Types** | idea (💡), source (📚), research (🔍), script (📝), asset (🎬), template (⚙), series (📁) |
| **Status** | draft → ready → used |
| **Commands** | /studio, /studio:idea, /studio:research, /studio:script, etc. |

---

## How to Switch Domains

### Environment Variable

Set `VITE_LOOMLIB_DOMAIN` before starting:

```bash
# Run in etymon domain (default)
npm run dev

# Run in studio domain
VITE_LOOMLIB_DOMAIN=studio npm run dev

# Build for studio
VITE_LOOMLIB_DOMAIN=studio npm run build
```

### What Changes

When you switch domains:

| Component | Behavior |
|-----------|----------|
| **Startup sync** | Only loads documents matching the domain |
| **Document list** | Only shows domain documents |
| **Filters** | Generated from domain's document types |
| **New documents** | Created with `domain: {current}` |
| **Commands** | Route to domain-appropriate sub-commands |

### What Doesn't Change

| Component | Stays the Same |
|-----------|----------------|
| **IndexedDB** | Same database, filtered by domain |
| **Markdown files** | Same location, `domain` field determines visibility |
| **API** | Same endpoints, domain in frontmatter |
| **Graph relationships** | Upstream/downstream work cross-domain |

---

## Domain Field in Documents

Every document has an optional `domain` field:

```yaml
---
id: script-video-intro
title: "Video Introduction Script"
type: script
domain: studio          # ← Domain membership
status: draft
# ...
---
```

### Legacy Documents

Documents without a `domain` field are treated as `etymon` (the default). On startup, a migration backfills the domain field:

```typescript
// If no domain field, use output or default to 'etymon'
doc.domain = doc.domain ?? doc.output ?? 'etymon';
```

---

## Using Commands

### Loomlib Commands (Etymon Domain)

The `/loomlib` command is the router for etymon domain:

```
/loomlib survey the editor implementation
/loomlib:excavate wealth
/loomlib:scope constellation redesign
/loomlib:framework method for X
/loomlib:instance capital AS oikonomia
```

**Available sub-commands:**
- `/loomlib:survey` — Investigate code/systems
- `/loomlib:scope` — Derive UX requirements
- `/loomlib:excavate` — Etymological investigation
- `/loomlib:framework` — Create reusable method/lens
- `/loomlib:instance` — Apply frameworks to produce content
- `/loomlib:note` — Capture raw thought
- `/loomlib:source` — Document external reference
- `/loomlib:index` — Curate document collections
- `/loomlib:synthesize` — Combine multiple documents
- `/loomlib:similar` — Find semantically similar documents
- `/loomlib:status` — Dashboard of graph state

### Studio Commands

The `/studio` command is the router for studio domain:

```
/studio idea for a video about X
/studio:research topic Y
/studio:outline video structure
/studio:script the intro video
/studio:template essay format
/studio:series on political economy
```

**Available sub-commands:**
- `/studio:idea` — Capture initial sparks
- `/studio:research` — Investigate topics
- `/studio:outline` — Structure content
- `/studio:script` — Write production-ready content
- `/studio:template` — Create reusable formats
- `/studio:series` — Organize related content
- `/studio:source` — Document external references

---

## Discovery Within Domains

Commands discover related documents scoped to their domain:

```bash
# Etymon domain discovery
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "etymon" or .domain == null) | {id, title, type}]'

# Studio domain discovery
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.domain == "studio") | {id, title, type}]'
```

### Cross-Domain References

Documents can reference documents in other domains via upstream/downstream:

```yaml
# An etymon instance can reference a studio source
upstream:
  - doc: src-interview-transcript  # studio source
    relation: source
```

This enables research to flow between domains while keeping views focused.

---

## File Organization

All domains share the same file structure:

```
loomlib/docs/
├── framework/     # Etymon frameworks
├── instance/      # Etymon instances (surveys, scopes, etc.)
├── note/          # Notes (any domain)
├── source/        # Sources (shared)
├── index/         # Indexes (any domain)
├── idea/          # Studio ideas
├── research/      # Studio research
├── script/        # Studio scripts
├── template/      # Studio templates
├── series/        # Studio series
└── asset/         # Studio assets
```

The `domain` field in frontmatter determines which domain sees each document.

---

## Configuration Files

Domain configurations live in `loomlib/src/config/domains/`:

```
src/config/domains/
├── index.ts       # Domain registry
├── etymon.ts      # Etymon configuration
└── studio.ts      # Studio configuration
```

Each config defines:
- Document types with icons/colors
- Status progression
- Helper functions for display

---

## Adding a New Domain

1. **Create config file:** `src/config/domains/{domain}.ts`
2. **Register in index:** Add to `domains` object in `index.ts`
3. **Create commands:** Add `.claude/commands/{domain}.md` and sub-commands
4. **Create docs directories:** Add folders for domain-specific types
5. **Set env var:** `VITE_LOOMLIB_DOMAIN={domain}`

---

## Performance Notes

The domain system was designed to improve startup performance:

| Metric | Before | After |
|--------|--------|-------|
| **Startup with 147 docs** | ~2-5s | ~200-500ms |
| **Sync scope** | All documents | Domain documents only |
| **Query scope** | O(n) all docs | O(domain_size) |

Domain-scoped queries mean you only load what you need.

---

## Composition

**What informed this:**
- `fw-loomlib-domains` — The framework establishing domain architecture
- `inst-scope-domain-startup-performance` — Performance requirements
- `inst-scope-frontmatter-ui-mapping` — UI configuration approach

**What this enables:**
- Operating loomlib across multiple knowledge domains
- Focused work without cross-domain noise
- Scalable architecture for growing corpora
