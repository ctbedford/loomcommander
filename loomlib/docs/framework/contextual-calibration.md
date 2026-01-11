---
id: fw-contextual-calibration
title: Contextual Calibration
type: framework
framework_kind: domain
framework_ids: [fw-context-weaving]
source_id: null
output: loomcommander
perspective: null
status: incubating
tags: [llm, context, calibration, relevance-realization, attention, memory, overfitting, underfitting, telos]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: build
execution_state: completed
upstream:
  - doc: fw-context-weaving
    relation: informs
  - doc: inst-scope-context-orchestration
    relation: informs
  - doc: inst-context
    relation: informs
  - doc: inst-recon-loomlib-system-evaluation
    relation: prior
downstream: []
---

# Contextual Calibration

**Type:** Domain Framework
**Purpose:** Diagnose structural failure modes in LLM relevance realization and design context architectures that achieve calibration for specific users

---

## The Problem

When an LLM with persistent memory (facts stored across sessions) produces assessments of a person, it can systematically mis-calibrate. The failure isn't random — it's structural.

**The Case Study:**

Claude Code, with no memory of you, was asked to assess you based solely on the loomlib corpus. It produced:
- Accurate method observations (philological sensibility, systematic tendency, synthesis orientation)
- Wildly incorrect peer assignments (Illich, McLuhan, Vervaeke)

A different Claude, with persistent memory (List, Guénon, Virginia Cavalier heritage, KWML framework), identified the mismatch immediately:
- "The document matched you on method without asking toward what"
- "It saw the engineering but not the telos"

**The Diagnosis:**

The memoryless Claude matched *structural features* (how you think) without accessing *commitments* (what you think toward). It saw the engineering but not the telos. This is a specific calibration failure with identifiable causes.

---

## The Two Failure Modes

### Overfitting: Facts Tainting Output

When an LLM has persistent memory, early facts create attentional grooves:

```
Session 1: User mentions they like Python
Session 2: User asks about programming languages
→ LLM overfits to Python preference even when context suggests otherwise
```

**Mechanism:** Each stored fact creates a prior. Facts stored earlier have more influence because they shape how later facts are processed. The sequence of storage matters — not just what's stored but when.

**Example from Your Case:**

If memory stores "Tyler → philosophical, etymological, systematic" first, later facts ("Tyler → Friedrich List, developmental nationalism") are *interpreted through* the earlier frame. The philological Tyler becomes the interpretive lens through which the nationalist Tyler is seen — possibly distorting or ignoring commitments that don't fit the established pattern.

**The Pattern:**
- First impressions crystallize into frames
- New information is assimilated rather than accommodated
- Contradictory facts are minimized or ignored
- The user becomes their early profile

### Underfitting: Missing What Matters

When an LLM lacks memory or key facts, it pattern-matches on surface features:

```
User shows: Systematic method, philological attention, humanistic orientation
LLM matches: Illich, McLuhan, Vervaeke (similar surface features)
→ LLM underfits because it can't access actual commitments
```

**Mechanism:** Without access to what the person is *actually committed to*, the LLM clusters by type. "Philosophical engineer" is a type. Types have exemplars. The LLM grabs exemplars without knowing if the person would endorse them.

**Example from Your Case:**

The loomlib recon saw:
- Philological excavation (like Illich's etymology work)
- System-building (like Victor's tool-making)
- Critical genealogy (like Vervaeke's wisdom tradition synthesis)

It didn't see:
- Friedrich List (developmental nationalism — opposite of Illich's anti-institutionalism)
- Evola/Guénon (traditionalism — different from Vervaeke's syncretism)
- Virginia Cavalier heritage (lineage consciousness — unlike the "rootless cosmopolitan" of the peer list)
- KWML framework (archetypal development — not just vocabulary but theory of maturation)

**The Pattern:**
- Surface features are visible; commitments are not
- Type-matching replaces person-knowing
- Peers are grabbed by structural similarity, not substantive alignment
- The person becomes a type, not a telos

---

## Why Both Fail

### The Attention Problem

LLMs use attention mechanisms to weight what's salient. Etymologically: *attendere* = "to stretch toward."

**Overfitting:** Memory facts become permanent attention weights. Early facts create grooves that later processing follows. Attention stretches toward what's already been established.

**Underfitting:** Without memory, attention stretches toward whatever's present in context. Surface features are present. Commitments are not. Attention can only stretch toward what's there.

**The Structural Issue:** Neither failure is about processing power or reasoning ability. Both are about *what gets attended to*. Calibration requires getting the right things into attention.

### The Sequence Problem

Information arrives sequentially. The order matters.

**In Overfitting:** Earlier facts frame later facts. "Tyler is philosophical" → "Tyler reads List" becomes "philosophical Tyler reads List" rather than "nationalist Tyler does philosophy."

**In Underfitting:** All information is simultaneous (the context window). There's no sequence, so there's no priority. Everything is equally present, which means surface features (more numerous, more visible) dominate.

**The Structural Issue:** Neither pure memory nor pure context handles sequence correctly. Memory privileges the early. Context privileges the visible. Calibration requires *right sequencing* — telos before features.

### The Telos Problem

Both failures are failures of *relevance realization* — knowing what matters for this purpose.

**The Question:** What should an LLM attend to when assessing a person?

| Surface Features | Commitments (Telos) |
|------------------|---------------------|
| How they think | What they think toward |
| Methods they use | Goals the methods serve |
| Styles they exhibit | Values the styles express |
| Types they resemble | Persons they actually are |

**The Structural Issue:** Types are easy to detect (pattern-match on features). Telos is hard to detect (requires access to *what for*). Without explicit telos representation, any system will drift toward type-matching.

---

## The Loomlib Hypothesis

Loomlib's architecture addresses these failures through three mechanisms:

### 1. Conducting Frontmatter: Explicit Telos

Every document declares:
- `intent`: What kind of production (research, build, capture, organize, produce)
- `upstream`: What informed this
- `downstream`: What this enables

**Calibration Effect:** Telos is not inferred from surface features — it's *declared*. When loomlib documents include their intent and their genealogy, the LLM doesn't have to guess purpose from structure. The purpose is stated.

**For Personal Calibration:**

A loomlib document could explicitly encode:
```yaml
commitments:
  political_economy: developmental_nationalism
  tradition: Virginia_Cavalier_frontier_gentry
  psychology: KWML_archetypal_integration
  genealogical: Evola_Guenon_as_live_options
```

This makes telos queryable. An LLM with access to loomlib can *look up* commitments rather than inferring them from type-matching.

### 2. Frameworks as Explicit Lenses

Frameworks are named and documented. When an Etymon excavation is produced, it declares:
```yaml
framework_ids: [fw-etymon-method]
```

**Calibration Effect:** The *frame* is visible. The LLM knows it applied Etymon Method. If the user says "that frame doesn't fit my commitments," the mismatch is locatable.

**For Personal Calibration:**

Different frameworks could be created for different commitment profiles:
- `fw-listian-analysis`: How to assess institutions through productive capacity lens
- `fw-traditionalist-reading`: How to interpret texts through perennialist criteria
- `fw-lineage-consciousness`: How to situate thought within inheritance

When the LLM applies a framework, it's explicit about the lens. When the lens is wrong, the user can see and correct.

### 3. Discovery Before Production

Every loomlib command starts with API queries:
```bash
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.title | test("topic"; "i"))]'
```

**Calibration Effect:** The LLM doesn't just produce — it first *discovers what exists*. If commitment documents exist, they're found before production begins. Context is not inferred from the task; it's queried from the graph.

**For Personal Calibration:**

A "commitments" document or index could be created:
```yaml
id: idx-user-commitments
title: User Commitments
type: index
```

Every loomlib command would discover this index first, loading commitments into context before production. The telos would be present at the start of every session.

---

## Calibration Architecture

### The Problem Restated

| Failure | Cause | Solution |
|---------|-------|----------|
| **Overfitting** | Early memory facts create attentional grooves | Sequence telos first; structure memory to front-load commitments |
| **Underfitting** | Surface features dominate when commitments are absent | Make commitments explicit and discoverable |

### The Proposed Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CALIBRATION FLOW                            │
│                                                                 │
│   ┌───────────────┐                                             │
│   │  Commitments  │ ← idx-user-commitments (telos, not type)   │
│   │    Index      │                                             │
│   └───────┬───────┘                                             │
│           │                                                     │
│           ▼ Discovery (loaded first)                            │
│   ┌───────────────┐                                             │
│   │   Framework   │ ← Selected based on commitment fit          │
│   │   Selection   │                                             │
│   └───────┬───────┘                                             │
│           │                                                     │
│           ▼                                                     │
│   ┌───────────────┐                                             │
│   │  Production   │ ← Framework applied with commitment context │
│   │   (Output)    │                                             │
│   └───────────────┘                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Sketch

**1. Commitments Index**

Create `idx-user-commitments.md`:
```yaml
id: idx-user-commitments
title: User Commitments
type: index
---
## Political Economy
- Developmental nationalism (List)
- American System tradition
- Productive capacity > free trade abstraction

## Philosophical Orientation
- Traditionalism as live option (Evola, Guénon)
- Not endorsement — serious engagement
- Counter to universalist synthesis

## Lineage
- Virginia Cavalier heritage
- Frontier gentry values
- 14-generation genealogy
- Bedfordsonian synthesis

## Psychology
- KWML archetypal framework
- Magician-Warrior imbalance (developmental edge)
- Integration through action, not abstraction

## Anti-Peers
People who share surface features but not commitments:
- Illich (anti-institutional; you're pro-developmental-state)
- Vervaeke (syncretist; you're lineage-conscious)
- McLuhan (Catholic universalist; you're particular)
```

**2. Discovery Modification**

Modify loomlib commands to always query commitments first:
```bash
# Before any production
COMMITMENTS=$(curl -s http://localhost:5173/api/docs | jq '.[] | select(.id == "idx-user-commitments") | .content')
```

**3. Peer Selection Protocol**

When assessing the user, require:
- Query commitments index first
- Match on commitments, not features
- Explicitly state if peers share commitments or only methods
- Flag "surface-match only" peers as such

---

## The Deeper Insight

### Context Is Not Information

The original loomlib recon failed not because it lacked information (the corpus was available) but because it lacked *calibration* — the right things weren't salient.

**Context as Weaving** (from fw-context-weaving) teaches:
- Context is relational, not additive
- What's present determines what patterns emerge
- The loom constrains the fabric

The commitments weren't woven into the assessment. They were absent from the loom. The pattern that emerged (Illich, McLuhan) was constrained by what threads were present (philological method, systematic tendency) rather than what threads were *actually central* (List, lineage, traditionalism).

### Calibration Is Telos-First

The correction is structural:
1. **Load commitments before features** — sequence matters
2. **Make commitments explicit** — don't infer from surface
3. **Select frameworks by commitment fit** — not just method applicability
4. **Flag type-matches vs. telos-matches** — make the distinction visible

### For Loomlib

If loomlib is to achieve better contextual realizations for its user, it needs:

1. **A commitments index** that's always discovered first
2. **Framework selection logic** that checks commitment fit, not just topic fit
3. **Output transparency** about which frames were applied and why
4. **Anti-peer documentation** — people who share features but not commitments, to prevent the underfitting error

This isn't just about this one recon. It's about how loomlib commands *in general* should handle user-specific calibration. The system currently optimizes for document production. It should also optimize for *calibrated* production — output that fits the person, not just the method.

---

## Application

### Diagnostic Questions

When an LLM-mediated system produces user assessments:

1. **What facts were present?** Memory, context window, or discovered?
2. **What sequence were they in?** Early facts frame later facts
3. **Were commitments explicit or inferred?** Explicit = calibrated; inferred = type-matched
4. **What frames were applied?** Named or implicit?
5. **Do peers share commitments or just features?** Telos-match vs. type-match

### For Loomlib Commands

Before producing any assessment of the user:

1. **Query `idx-user-commitments`** if it exists
2. **Load commitments into context first** (before corpus analysis)
3. **Select frameworks that align with commitments** (not just topic)
4. **In peer identification, check commitment alignment** — not just method similarity
5. **Flag "surface peers" explicitly** — "shares method but not telos"

### For Other AI Systems with Memory

The failure modes here are general:
- Memory systems overfit to early facts
- Context-only systems underfit to surface features
- Both fail on telos unless it's explicitly represented

The solution is also general:
- Make telos explicit and queryable
- Load telos first (sequence matters)
- Distinguish type-matching from person-knowing
- Make frames visible so miscalibration is correctable

---

## Composition

**Upstream (what informed this):**
- [Context as Weaving](fw-context-weaving) — foundational insight that context is relational, not additive
- [Scope: Context Orchestration](inst-scope-context-orchestration) — analysis of how context frames production
- [CONTEXT](inst-context) — excavation of context etymology
- [Recon: Loomlib System Evaluation](inst-recon-loomlib-system-evaluation) — the failure case that prompted this framework

**Downstream (what this enables):**
- Creation of `idx-user-commitments` for calibrated production
- Modification of loomlib commands to include commitment discovery
- Framework selection logic based on commitment fit
- Anti-peer documentation to prevent type-matching errors
