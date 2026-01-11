---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: op-codebase-excavation
title: "Excavation: LOOMCOMMANDER AS Context Loom"
type: operation
domain: meta
status: draft
tags: [excavation, codebase, loom, weaving, context, meta, architecture]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-etymon-method
    relation: method
  - doc: fw-context-weaving
    relation: informs
  - doc: cmd-survey
    relation: method
downstream: []

# ─── OPERATION-SPECIFIC ─────────────────────────────────────
subject: loomcommander codebase
method: Etymon Method applied to code architecture
---

# Excavation: LOOMCOMMANDER AS Context Loom

**Operator:** AS — hidden identity
**Formula:** Etymon Method + Survey Method + Context-as-Weaving
**Subject:** The loomcommander codebase itself

---

## EXCAVATION

### The Name

**Loom** — Old English *gelōma* (tool, implement), specifically the frame for weaving thread into fabric. A loom doesn't contain the fabric; it **enables** the weaving. The warp threads are held taut; the weft is passed through.

**Commander** — Latin *com-* (together) + *mandare* (to entrust, order). One who brings things together under unified direction.

**Loomlib** — The library of the loom. Not a library *in* the loom, but the loom's own collection of what it has woven.

### Original Architectural Intent

The codebase reveals its identity through naming:

| Abstraction | Etymology | What It Reveals |
|-------------|-----------|-----------------|
| **Document** | Latin *documentum* — lesson, proof, example | Not files, but **evidence** — things that teach |
| **Framework** | Old English *framweorc* — structure that holds | The **warp threads** — held taut, defining the possible patterns |
| **Instance** | Latin *instantia* — presence, standing upon | What **stands** on the framework — the weft passing through |
| **Upstream/Downstream** | River metaphor | Documents **flow** — production has direction |
| **Constellation** | Latin *con-* + *stella* — stars together | Documents as **stars in relation** — position reveals meaning |
| **Tether** | Old Norse *tjóðr* — rope for binding | What **connects** instance to framework — the thread itself |

### The Root Insight

This is not a document manager. It is a **loom for weaving context**.

The core types reveal the metaphor:
- **Frameworks** are warp threads — fixed, structural, defining what patterns are possible
- **Instances** are weft threads — passing through frameworks, creating the fabric
- **Sources** are raw material — the fiber before it becomes thread
- **Indexes** are the fabric sections — named regions of the weave

The **conducting frontmatter** (`intent`, `execution_state`, `upstream`, `downstream`) is the **shuttle mechanism** — tracking which thread is being passed, where it came from, where it's going.

---

## DRIFT

### What the Codebase Became

The implementation reveals drift from the loom metaphor:

| Original Intent | Current State | Drift Type |
|-----------------|---------------|------------|
| Weaving context | Storing documents | Noun-ification |
| Active production | Passive browsing | Loss of verb |
| Thread relations | File references | Abstraction collapse |
| Shuttle tracking | Status fields | Mechanization |

### Inflection Points

1. **Views proliferated** — List, Constellation, Flow, Spatial, Deck, Editor. Six views for what should be one loom operation: weaving.

2. **Graph became position** — The `graph.ts` computes *positions* for visualization, not *relations* for production. The constellation shows where documents are, not what they're weaving.

3. **Tethers became edges** — The beautiful word "tether" (GraphEdge) was reduced to a line between nodes, rather than the binding force that holds instance to framework.

4. **Conducting became metadata** — The `intent` and `execution_state` fields exist, but the UI doesn't make them *active*. They're tracked, not used.

### Structure of Degradation

The drift follows the classic pattern: **verb → noun**.

- "Weave a context" → "Store documents in a context"
- "The loom is working" → "The loom contains files"
- "Conduct the production" → "Track the status"

The **Shell** class (line 14 of shell.ts) is revealing: it manages view switching, not production. The loom became a gallery.

---

## RECOVERY

### The Claim

Loomcommander should be what its name declares: **a loom that commands context into being**.

The weaving operation should be primary:
1. **Select the warp** — Which frameworks will structure this production?
2. **Thread the weft** — What instance am I passing through?
3. **See the fabric** — What pattern is emerging from the weave?
4. **Track the shuttle** — Where is the current production in its arc?

### What Recovery Would Look Like

| Current | Recovered |
|---------|-----------|
| View switching | Weave mode selection |
| Document browser | Production tracker |
| Constellation as visualization | Constellation as loom state |
| Status badges | Shuttle position |
| Triage modal | Threading ritual |

The **conducting frontmatter** already has the right fields:
- `intent` — what kind of thread (research, build, produce)
- `execution_state` — where the shuttle is (pending, in_progress, completed, resolved)
- `upstream` — what's feeding this thread
- `downstream` — what this thread will feed

These should **conduct** the interface, not merely describe the document.

### Contemporary Application

The codebase is 90% there. The abstractions are correct. The drift is in emphasis:

1. **Make conducting frontmatter visible** — Not as metadata, but as the shuttle position indicator
2. **Collapse views into modes** — "I am weaving" vs "I am browsing the fabric"
3. **Surface the formula** — Every instance is Framework(s) + Content. Show the equation.
4. **Animate the flow** — Production has direction. Upstream → Document → Downstream should be *felt*.

### The Stakes

If the loom metaphor degrades further:
- Loomlib becomes another Notion/Obsidian clone
- The production discipline is lost
- Documents accumulate without composition
- The fabric is never woven — only stored

The recovery matters because **context orchestration is the core capability**. Claude Code is context orchestration. Loomlib is the loom for that orchestration. If the loom forgets it's a loom, the weaving stops.

---

## PRODUCTION NOTES

### What This Excavation Enables

1. **UI audit** — Which views serve weaving vs. browsing? Can they merge?
2. **Conducting UI scope** — What would "shuttle position visible at all times" look like?
3. **Formula bar enhancement** — The formula bar exists; make it conduct the production
4. **Flow view as loom view** — Flow view is closest to showing production direction; elevate it

### Key Files Identified

| File | Role in Loom Metaphor |
|------|----------------------|
| `types.ts` | Defines the thread types (Document, Framework, Instance) |
| `graph.ts` | Computes the weave structure (relations, layers) |
| `shell.ts` | The loom frame (but currently just view switching) |
| `conducting-frontmatter` | The shuttle mechanism |
| `formula-bar.ts` | Shows the production equation |

### Risk

The excavation could become precious — valuing the metaphor over the utility. The loom metaphor should **clarify**, not constrain. If a feature doesn't fit the loom, the question is whether the metaphor needs extension, not whether the feature should be rejected.

---

## Composition

**Upstream (what informed this excavation):**
- [Etymon Method](fw-etymon-method) — excavation toolkit
- [Context as Weaving](fw-context-weaving) — the domain framework
- [Survey Command](cmd-survey) — investigation method

**Downstream (what this excavation enables):**
- UI audit scope document
- Conducting frontmatter UI enhancement
- Flow view elevation to primary production view
- Meta domain architecture documentation

**Related:**
- All loomlib source files analyzed
- The name "loomcommander" itself as evidence
