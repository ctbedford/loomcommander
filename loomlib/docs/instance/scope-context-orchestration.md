---
id: inst-scope-context-orchestration
title: "Scope: Context Orchestration as Frame-Making"
type: instance
framework_kind: null
framework_ids: [fw-scope-method]
source_id: null
output: loomcommander
perspective: null
status: verified
tags: [context, orchestration, claude-code, commands, frames, meta]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-scope-method
    relation: method
  - doc: inst-scope-framing-as-practice
    relation: prior
downstream: []
---
# Scope: Context Orchestration as Frame-Making

**Date:** 2026-01-08
**Subject:** How context orchestration in Claude Code creates frames within which problems become legible
**Method:** Scope Method (applied to the orchestration system itself)
**Precursor:** inst-scope-framing-as-practice

---

## The System Under Examination

This project uses Claude Code with:
- **CLAUDE.md** — project-level instructions, workflows, stop conditions
- **`.claude/commands/`** — 12 loomlib commands forming a routing system
- **loomlib frameworks** — 10 methods (toolkits + domains) that produce instances
- **Document types** — framework, instance, note, source, index
- **Frontmatter schema** — required metadata linking documents to their production genealogy

The question: what does this system *do* when understood as frame-making?

---

## Audit: The Current Architecture

### Layer 1: CLAUDE.md (Project Frame)

```markdown
## Read First (GLOB then READ)
## Workflow: EXPLORE → PLAN → CODE → TEST → COMMIT → VERIFY
## Stop If: [conditions]
## Before Any Change: Have I read the spec?
```

**What it does:**
- Defines what "working on this project" means
- Establishes mandatory sequences (read before code)
- Creates stop conditions (what terminates action)
- Sets quality gates (no spec read = no code)

**Frame effect:** A Claude instance working here operates within a specific discipline. The frame makes certain behaviors *unthinkable* — you can't just start coding. The project frame pre-filters what actions are legitimate.

### Layer 2: Command Router (`loomlib.md`)

```markdown
## Routing Logic
Parse "$ARGUMENTS" to determine document type and route:
→ loomlib:excavate if: "excavate [TERM]" / "dig into..."
→ loomlib:scope if: "scope [feature]" / "ux for..."
→ loomlib:note if: "capture..." / "raw thought..."
```

**What it does:**
- Takes raw user input (natural language intent)
- Pattern-matches to document types
- Routes to type-specific commands

**Frame effect:** The router decides *what kind of thing* the user is trying to make. Before this routing, input is undifferentiated. After routing, it has a type, and types carry expectations. "Dig into algorithm" becomes an excavation. "Scope this feature" becomes a requirements document. The router is an ontological classifier.

### Layer 3: Type Commands (`loomlib:excavate`, `loomlib:scope`, etc.)

Each command provides:
- Protocol (what steps to follow)
- Output structure (sections, format)
- Framework references (what method applies)
- Frontmatter template (metadata schema)

**Frame effect:** Once routed, the document type determines *how production happens*. An excavation follows Etymon Method (excavation → drift → recovery). A scope follows Scope Method (audit → affordances → expectations → gaps → requirements). The type is a mold.

### Layer 4: Frameworks (Etymon Method, Scope Method, etc.)

Frameworks are the methods themselves — reusable ways of seeing that produce instances when applied to content.

**Frame effect:** Frameworks are portable frames. They can be applied to any content that fits. The Etymon Method frames any term as having an original operational meaning that drifted. The Scope Method frames any feature as having affordances that create expectations.

### Layer 5: Frontmatter Schema

```yaml
id: inst-{slug}
framework_ids: [fw-etymon-method]
status: draft
output: etymon
```

**Frame effect:** Every document declares its lineage. The schema enforces genealogy — you can't produce an instance without naming what framework produced it. This makes the frame visible. The constellation view then renders this genealogy as a graph.

---

## Affordances: What the Orchestration Makes Possible

### 1. Raw Input → Typed Output

User says: "dig into the word algorithm"
System produces: `inst-excavate-algorithm.md` with Etymon Method structure, frontmatter, genealogy

**The frame creates legibility.** Unstructured intent becomes structured document. The routing system is a legibility machine.

### 2. Method Accumulation

Frameworks persist. Once you have Etymon Method, you can excavate any term. Once you have Scope Method, you can scope any feature. Methods are reusable frames.

**The system accumulates frames.** Each new framework increases what kinds of things can be produced. The ontology grows.

### 3. Production Genealogy

Every instance links back to its frameworks. The constellation view shows what made what.

**The frames are visible.** Unlike implicit framing (where you don't see the lens), this system externalizes frames as first-class objects. You can inspect, modify, contest them.

### 4. Conversation Continuity

When you `/loomlib scope X`, the command injects:
- The routing system
- The current loomlib state (frameworks, instances)
- The type-specific protocol

**Context orchestration is frame injection.** Each command sets up a frame for Claude to operate within. The "context" is the frame.

### 5. Multi-Level Coherence

CLAUDE.md disciplines the project. Commands discipline production. Frameworks discipline content. Frontmatter disciplines metadata.

**Frames at every level.** This isn't just one frame — it's nested frames, each constraining a different scope.

---

## Expectations: What Taking This Seriously Implies

### Context Orchestration IS Frame-Making

When you write a CLAUDE.md, you're not just "providing context." You're deciding:
- What behaviors are legitimate
- What sequences are required
- What conditions terminate action
- What quality looks like

This is ontology design. The "context" is a frame that makes certain problems legible and certain actions thinkable.

### Commands Are Routing Decisions

The routing logic in `loomlib.md` isn't neutral classification. It decides what *kind of thing* something is. "Dig into X" → excavation. "Scope Y" → requirements. These are ontological commitments.

Different routing = different output = different reality-cuts.

### Frameworks Are Portable Frames

Etymon Method isn't just "a way to analyze words." It's a frame that makes any term appear as:
- Having an original operational meaning
- Having undergone drift
- Being recoverable

The framework is the lens. Apply it to "algorithm" or "economy" or "credit" — same frame, different content.

### The Constellation Is Frame Genealogy

The production graph (what made what) is a map of frame application. Instance X was produced by Framework Y applied to Source Z. The genealogy shows how frames generated content.

**Visible frames are contestable frames.** When you can see that this document was produced by this method, you can ask: was that the right method? What would a different frame reveal?

---

## Gaps: Where the System Falls Short

### Gap 1: Router Bias (Friction)

The routing logic has defaults. Pattern-matching "dig into" to excavation is a choice. What if the user wanted something else? The router makes assumptions.

**Risk:** The frame constrains before the user confirms. "Algorithm" could be scoped (user expectations of the term), surveyed (how codebases use it), or excavated (etymological analysis). The router picks one.

### Gap 2: Framework Lock-In (Friction)

Once routed, the document follows a specific framework. The Etymon Method has three phases (excavation, drift, recovery). What if the content doesn't fit?

**Risk:** The frame becomes a Procrustean bed. Content stretches or compresses to fit the structure. Some insights get lost because they don't match the protocol.

### Gap 3: Invisible Meta-Frame (Blocking)

The system has a meta-frame: "knowledge production is document production via framework application." This is itself a frame, but it's not surfaced.

**Risk:** The meta-frame is invisible. You can see frameworks and instances, but not the assumption that *this is how knowledge works*. The deepest frame is the least visible.

### Gap 4: Human Abdication (Friction)

The system is designed to run autonomously. Give it input, get output. The human reviews but may not participate in frame selection.

**Risk:** The frame-making happens *to* the user rather than *with* them. "I asked for algorithm analysis and got an etymological excavation." Did the user want that frame?

---

## Requirements: What Good Context Orchestration Demands

### Must Have

**1. Frame Transparency**

The user should see what frame is being applied before full production. "I'm routing this to excavation using Etymon Method — this will analyze the word's original meaning, how it drifted, and what recovery looks like. Is that what you want?"

*Acceptance criteria:* User can redirect routing before production completes.

**2. Meta-Frame Documentation**

The assumptions underneath the system should be explicit. "This system assumes knowledge production works via framework application. That's a choice. Alternative systems might..."

*Acceptance criteria:* The meta-frame is stated somewhere accessible.

**3. Framework Fit Warnings**

When content doesn't fit a framework well, surface the friction. "This term doesn't have a clear etymological root — the excavation may be speculative."

*Acceptance criteria:* Production acknowledges when the frame is strained.

### Should Have

**4. Alternative Routing Offers**

After routing, offer alternatives. "I routed to excavation. You could also: scope (user expectations of 'algorithm'), survey (how codebases use the term), or note (capture raw thoughts)."

**5. Frame Composition**

Allow multiple frameworks. "Algorithm" could be both excavated (Etymon Method) and scoped (user expectations). The document could have both lenses.

**6. User Frame Creation**

Users should be able to propose new frameworks. "I want a method for analyzing how terms get weaponized in discourse." → potential new toolkit.

### Out of Scope

- Fully automated production (humans must confirm frame selection)
- Universal routing (some inputs genuinely don't fit any type)
- Framework rigidity (structures should guide, not mandate)

---

## The Value Proposition

### What This System Demonstrates

**1. Context is not neutral.**

CLAUDE.md isn't "background information." It's a frame that shapes what Claude does. Every instruction is a constraint. Every workflow is a sequence that excludes alternatives.

**2. Commands are ontological.**

Routing user intent to document types is deciding what exists. "This is an excavation" is a claim about the nature of the thing being produced.

**3. Frameworks are reusable frames.**

Etymon Method, Scope Method, Survey Method — these are portable lenses. They can apply to any content that fits. The value is accumulation: more frameworks = more ways to see.

**4. Genealogy enables contestability.**

When production is visible (this instance came from this framework), frames become discussable. "Why did we excavate this instead of scoping it?" The question is askable because the frame is named.

**5. Meta-work is real work.**

Designing the routing system, writing the frameworks, structuring the commands — this is frame-making. It's upstream of any specific document. The leverage is at the meta-level.

---

## Summary: Context Orchestration as Frame-Making

| Layer | Frame Function |
|-------|----------------|
| **CLAUDE.md** | Project discipline — what behaviors are legitimate |
| **Command router** | Ontological classification — what kind of thing is this |
| **Type commands** | Production protocol — how is this type made |
| **Frameworks** | Reusable lenses — what method applies to content |
| **Frontmatter** | Genealogy schema — where did this come from |
| **Constellation** | Frame visualization — what made what |

**The insight applied:**

When you orchestrate context for Claude Code, you are not providing information. You are building frames within which certain problems become legible and certain actions become possible.

The loomlib command system is a demonstration: raw input enters, typed output exits. The routing is a series of frame applications. The value is not just the documents produced but the *visibility of the production process* — frames you can see, name, and contest.

**The meta-frame:**

This document is itself produced by the Scope Method, demonstrating the system it describes. It audited the orchestration architecture, analyzed its affordances, identified gaps, and derived requirements. The frame is both the subject and the lens.

That recursion — using the system to examine the system — is what "taking frames seriously" looks like in practice.
