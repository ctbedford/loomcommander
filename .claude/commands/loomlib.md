---
description: Loomlib document production - routes to appropriate document type command
argument-hint: <intent> [topic or content]
---

# Loomlib: $ARGUMENTS

You are producing documents for **loomlib**, a knowledge graph web application.

## App Architecture

Loomlib is a TypeScript/Vite web app at `loomlib/` with:
- **IndexedDB** for browser storage
- **`loomlib/src/data/seed-data.ts`** as the authoritative document definitions
- **Constellation view** showing production genealogy (what made what)

**Workflow:**
```
/loomlib:* command → markdown file → /loomlib:sync → seed-data.ts → app
                     (loomlib/docs/)                  (generated)
```

Documents you produce go to `loomlib/docs/{type}/`. Run `/loomlib:sync` to regenerate `seed-data.ts` and make documents appear in the app.

## Document Types

These match the app's `DocumentType` enum in `loomlib/src/types.ts`:

| Type | Symbol | Function | When to use |
|------|--------|----------|-------------|
| **framework** | ⚙/▣ | Mental models, methods, lenses | Creating a reusable way of seeing |
| **instance** | ◧ | Documents produced by applying frameworks | Applying a framework to specific content |
| **note** | ○ | Raw capture, unstructured thought | Capturing before structuring |
| **source** | ◈ | Reference material, external texts | Documenting something you're reading |
| **index** | ☰ | Curated collection, navigation aid | Organizing a set of related documents |

### Framework Subtypes

- **toolkit** ⚙ — Operative method you *do* (Etymon Method, Diagnostic Frames)
- **domain** ▣ — Contextual lens you *see through* (Oikonomia, Agonal Identity)

### The Production Model

```
Instance = Toolkit(s) + Domain(s) + [Source]
```

Every instance has a **formula** — the frameworks that produced it. The app's constellation view visualizes this genealogy.

## Status Workflow

```
incubating → draft → verified → captured
```

| Status | Meaning | App Behavior |
|--------|---------|--------------|
| **incubating** | Early stage, needs sources or development | Shows in "Incubating" lens |
| **draft** | Shaped but unverified | Normal display |
| **verified** | Survived pressure, ready for use | Full display |
| **captured** | Exported to vessel (video, tool, etc.) | Archival |

## Routing Logic

Parse "$ARGUMENTS" to determine document type and route:

**→ loomlib:framework** if:
- "framework for..." / "method for..." / "lens for..."
- "how to see..." / "way of reading..."
- Creating something reusable across instances

**→ loomlib:instance** if:
- Applying Etymon Method (excavation → drift → recovery)
- Using an operator (AS, FROM, VERSUS, WITHIN, etc.)
- "[TERM] as..." / "[TERM] from..."
- Producing content for a channel (etymon, loomcommander)

**→ loomlib:excavate** if:
- "excavate [TERM]" / "dig into [TERM]"
- Starting research before knowing the full structure
- This produces an **instance** using Etymon Method, not a separate type

**→ loomlib:survey** if:
- "survey [codebase/subsystem]" / "investigate [code]"
- Understanding code before changing it
- This produces an **instance** using Survey Method

**→ loomlib:note** if:
- "capture..." / "note..." / "raw thought..."
- Unstructured, needs triage later
- Pre-framework material

**→ loomlib:source** if:
- "source:" / "reading:" / "from [author]..."
- Documenting external material
- Building bibliography

**→ loomlib:index** if:
- "index of..." / "collection of..."
- Curating existing documents
- Creating navigation structure

**→ loomlib:triage** if:
- "classify..." / "what type is..."
- Uncertain about document type
- Processing raw material

**→ loomlib:promote** if:
- "verify..." / "promote..." / "status..."
- Moving document through workflow

**→ loomlib:sync** if:
- "sync" / "update seed data" / "regenerate"
- After creating/editing markdown documents
- Making markdown files appear in the app

## Output Location

All outputs go to: **`loomlib/docs/{type}/{slug}.md`**

```
loomlib/docs/
├── framework/     # ⚙/▣ toolkits and domains
├── instance/      # ◧ produced documents
├── note/          # ○ raw capture
├── source/        # ◈ external references
├── index/         # ☰ navigation collections
└── research/      # excavation working notes (pre-instance)
```

## Required YAML Frontmatter

Every document needs frontmatter that maps to the app's `Document` interface:

```yaml
id: {type}-{slug}           # unique identifier
title: {Title}              # display name
type: framework|instance|note|source|index
status: incubating|draft|verified|captured
framework_kind: toolkit|domain|null  # if type=framework
perspective: philosophical-genealogy|linguistic-recovery|economic-genealogy|legal-grammar|null
framework_ids: [fw-etymon-method, fw-other]  # parent frameworks
source_id: src-{slug}|null  # parent source
output: etymon|loomcommander|null  # channel
tags: [tag1, tag2]
```

## Current Loomlib State (from seed-data.ts)

**Managed Frameworks (9):** These auto-update on app load
- Etymon Method (toolkit) — excavation → drift → recovery
- Survey Method (toolkit) — survey → core sample → stratigraphy → findings
- Invariants/Variants (toolkit) — structural analysis
- Diagnostic Frames (toolkit) — positioning
- Reading a 10-K (toolkit) — SEC filings
- Oikonomia vs Chrematistics (domain) — economic genealogy
- Four Knowings (domain) — propositional/procedural/perspectival/participatory
- Agonal Identity (domain) — philosophical genealogy
- Context as Weaving (domain) — linguistic recovery

**Instances:** 16 (9 verified, 7 incubating)
**Sources:** 2
**Indexes:** 2

**Operators (for instances):**
AS, FROM, VERSUS, WITHIN, WITHOUT, BEFORE, AFTER, THROUGH, OF, FOR, TO, AGAINST, BEHIND, AND, OR

**Perspectives:**
- philosophical-genealogy
- linguistic-recovery
- economic-genealogy
- legal-grammar (not yet seeded)

**Output Channels:**
- etymon (YouTube)
- loomcommander (GitHub/tools)

## Integration Notes

**To add a document to the app:**
1. Produce markdown with `/loomlib:{type}` command (e.g., `/loomlib:instance`)
2. Output goes to `loomlib/docs/{type}/{slug}.md`
3. Run `/loomlib:sync` to regenerate `seed-data.ts`
4. Verify with `cd loomlib && npm run dev`

**Document IDs:**
- Frameworks: `fw-{slug}`
- Instances: `inst-{slug}`
- Notes: `note-{slug}`
- Sources: `src-{slug}`
- Indexes: `idx-{slug}`

Now route "$ARGUMENTS" to the appropriate command.
