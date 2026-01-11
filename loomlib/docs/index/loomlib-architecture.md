---
id: idx-loomlib-architecture
title: "Index: Loomlib Architecture Invariants"
type: index
framework_kind: null
framework_ids: [fw-invariants-variants]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [architecture, invariants, variants, meta, system-design, commands]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: organize
execution_state: completed
upstream:
  - doc: fw-invariants-variants
    relation: method
  - doc: idx-conducting-frontmatter-system
    relation: informs
  - doc: fw-conducting-frontmatter
    relation: informs
downstream: []
---

# Index: Loomlib Architecture Invariants

**Purpose:** Document what's eternal (invariant) versus temporal (variant) in loomlib's architecture — the constitutional elements that cannot change without breaking the system, and the extensible elements that can grow.

**Method:** Invariants/Variants framework applied to loomlib itself.

---

## The Core Distinction

Every system has:
- **Invariants:** What cannot change without breaking the system
- **Variants:** What can expand, contract, or transform freely

Loomlib's power comes from correctly identifying which is which. Treating variants as invariants creates rigidity. Treating invariants as variants creates chaos.

---

## INVARIANTS (The Eternal Configuration)

These cannot change without breaking loomlib. They are the system's **constitutional grammar**.

### 1. Documents Inform Each Other

**The invariant:** Loomlib is a graph, not a folder. Documents have upstream (what informed them) and downstream (what they enable).

**What breaks if absent:** Without composition, you have isolated files. The knowledge graph becomes a knowledge pile. Discovery becomes impossible.

**Test:** Can you trace any document back to what produced it? If not, the graph is broken.

### 2. Discovery Precedes Production

**The invariant:** Every command queries the API before producing. Query-then-produce is what makes commands graph-aware.

**What breaks if absent:** Commands become isolated generators. They can't blend context, reference prior work, or avoid duplication.

**Test:** Does the command know what already exists before it creates something new?

### 3. Calibration First

**The invariant:** User commitments (telos) and skills (capacity) must be loaded before any production. This shapes what gets produced and how.

**What breaks if absent:** Output becomes generic — not calibrated to the user's actual orientation, anti-peers, or skill gaps.

**Test:** Does the command know the user's commitments before it produces?

### 4. The Command Sequence

**The invariant:** Every document-producing command follows:

```
CALIBRATION → DISCOVERY → PROTOCOL → OUTPUT → COMPOSITION
```

**What breaks if absent:**
- Skip calibration → generic output
- Skip discovery → isolated production
- Skip protocol → inconsistent method
- Skip composition → orphaned documents

**Test:** Does the command follow all five phases?

### 5. Intent × Execution State

**The invariant:** Every document has two-dimensional tracking:
- **Intent:** What kind of production (research, build, capture, organize, produce)
- **Execution State:** Where in lifecycle (pending, in_progress, completed, resolved)

**What breaks if absent:** You can't query "what research is completed?" or "what's still pending?" The graph becomes unnavigable.

**Test:** Can you filter documents by both what they are and where they are?

### 6. Frameworks Produce Instances

**The invariant:** Frameworks are methods. Instances are applications of methods. The relationship is generative, not symmetric.

**What breaks if absent:** If instances could produce frameworks, the production hierarchy inverts. Methods would emerge from applications rather than guiding them.

**Test:** Is every instance traceable to at least one framework method?

### 7. Conducting Frontmatter Exists

**The invariant:** Not the specific fields, but that production metadata exists and is queryable.

**What breaks if absent:** Documents become opaque. You can't ask "what informed this?" or "is this complete?"

**Test:** Does every document have machine-readable production state?

---

## VARIANTS (The Temporal Configuration)

These can expand, contract, or transform without breaking the system. They are **vocabulary, not grammar**.

### 1. Document Types

**Current:** framework, instance, note, source, index (5 types)

**Why variant:** Could add "thesis", "argument", "decision", "prompt". The type system is extensible. What matters is that types exist and have distinct intents — not which specific types.

**Constraint:** New types need defined intent and frontmatter schema.

### 2. Commands

**Current:** 22 commands (survey, scope, excavate, framework, instance, note, source, index, recon, resolve, promote, triage, synthesize, lineage, review, compare, orphans, status, cluster, similar, contradict, apologetic)

**Why variant:** Can add more commands. Each is a production pathway. The command set is open.

**Constraint:** New commands must follow the invariant sequence (calibration → discovery → protocol → output → composition).

### 3. Frameworks

**Current:** Etymon Method, Survey Method, Scope Method, Recon Method, Conducting Frontmatter, Invariants/Variants, Four Knowings, etc.

**Why variant:** New methods can be defined. Etymon isn't the only excavation technique. Survey isn't the only investigation method.

**Constraint:** Frameworks need defined steps and application criteria.

### 4. Perspectives

**Current:** philosophical-genealogy, linguistic-recovery, economic-genealogy, legal-grammar (4 perspectives)

**Why variant:** Could be six or three. The number is arbitrary. What matters is that perspectives exist as "ways of seeing" — not which specific perspectives.

**Constraint:** Perspectives should be distinct lenses, not overlapping.

### 5. Output Channels

**Current:** etymon (YouTube), loomcommander (GitHub/tools)

**Why variant:** Could add more channels. Channels are where work gets exported — the specific channels are arbitrary.

**Constraint:** Channels need defined format and audience.

### 6. Operators

**Current:** AS, FROM, VERSUS, WITHIN, WITHOUT, BEFORE, AFTER, THROUGH, OF, FOR, TO, AGAINST, BEHIND, AND, OR

**Why variant:** These are combinatorial tools for instance production. Could add DESPITE, TOWARD, UNDERNEATH.

**Constraint:** Operators need defined semantics (what relationship they express).

### 7. Relation Types

**Current:** informs, method, source, prior

**Why variant:** Could add "contradicts", "refines", "extends", "supersedes".

**Constraint:** Relations need clear semantics for graph queries.

### 8. Framework Kinds

**Current:** toolkit (methods you do), domain (lenses you see through)

**Why variant:** Could add "hybrid", "meta", "operational".

**Constraint:** Kinds need distinct characteristics.

---

## FALSE INVARIANTS

Things that **look fixed but aren't**:

| False Invariant | Actually Variant | The Error |
|-----------------|------------------|-----------|
| "The five document types" | Types are extensible | Refusing to add types when needed |
| "Operators are fixed at 15" | Operators can expand | Not adding DESPITE when it would help |
| "Only etymon and loomcommander outputs" | Channels can expand | Not creating channels for new vessels |
| "Four perspectives exactly" | Perspectives can change | Forcing content into ill-fitting lenses |
| "Relation types are complete" | Relations can expand | Not expressing nuanced connections |

**The cost:** Treating variants as invariants creates artificial rigidity. The system becomes unable to grow in directions it could naturally accommodate.

---

## HIDDEN INVARIANTS

Things that **look open but actually constrain**:

| Hidden Invariant | Why It's Fixed | The Error |
|------------------|----------------|-----------|
| Discovery must use the API | File reads don't see frontmatter; API does | Bypassing API breaks graph-awareness |
| Calibration must happen first | Later phases depend on user context | Skipping creates generic output |
| Upstream must be recorded | Composition requires traceability | Omitting breaks the graph |
| Commands must produce documents | Non-producing commands break the model | "Analysis only" commands orphan work |
| Frontmatter must be YAML | Parser expects YAML; other formats break | Switching to TOML breaks tooling |
| IDs must be unique | Graph queries assume uniqueness | Duplicate IDs corrupt the graph |

**The cost:** Treating invariants as variants creates chaos. "Flexibility" in these areas breaks the system's assumptions.

---

## THE META-SEQUENCE

The invariant command sequence, with variant contents:

| Phase | Invariant (Must Do) | Variant (What Specifically) |
|-------|---------------------|----------------------------|
| **Calibration** | Load user context | Which indices, how much context |
| **Discovery** | Query for related docs | Which queries, which filters |
| **Protocol** | Follow a method | Which framework's protocol |
| **Output** | Write with frontmatter | Which sections, which emphasis |
| **Composition** | Report genealogy | How verbose, which relations |

**The grammar is fixed. The vocabulary is open.**

---

## ARCHITECTURAL LAYERS

Loomlib has three architectural layers, each with distinct invariants:

### Layer 1: Graph Structure (Most Invariant)

- Documents exist
- Documents have IDs
- Documents have frontmatter
- Documents reference each other
- API exposes the graph

**This layer is constitutional.** Changing it changes what loomlib is.

### Layer 2: Production System (Moderately Invariant)

- Commands produce documents
- Commands follow the 5-phase sequence
- Frameworks guide production
- Conducting frontmatter tracks state

**This layer is procedural.** It could theoretically change, but doing so would require rebuilding the command system.

### Layer 3: Content Categories (Most Variant)

- Which document types
- Which frameworks exist
- Which perspectives
- Which output channels
- Which operators

**This layer is categorical.** It changes regularly as loomlib grows.

---

## IMPLICATIONS FOR COMMAND DESIGN

When creating new commands:

### Must Follow (Invariant)

1. Implement all 5 phases (calibration, discovery, protocol, output, composition)
2. Query API for discovery (not raw file reads)
3. Load user calibration first
4. Produce a document with conducting frontmatter
5. Record upstream references
6. Report composition

### Can Vary (Variant)

1. Which specific queries for discovery
2. Which protocol steps
3. Which frontmatter fields beyond required
4. How verbose the output
5. Which frameworks to apply
6. Which operators to use

---

## IMPLICATIONS FOR SCOPE METHOD

Add to every scope:

### Invariants/Variants Section

When scoping any feature, ask:

1. **What's invariant in this feature space?**
   - What cannot change without breaking the feature?
   - What do users depend on being stable?

2. **What's variant?**
   - What design choices are open?
   - What can expand without breaking anything?

3. **False invariants?**
   - What looks fixed but is actually arbitrary?
   - Where is artificial rigidity hiding?

4. **Hidden invariants?**
   - What looks open but actually constrains?
   - Where would "flexibility" break things?

This prevents scopes from treating conventions as requirements, and requirements as optional.

---

## Composition

**Upstream (what informed this index):**
- [Invariants/Variants](fw-invariants-variants) — the method applied
- [Index: Conducting Frontmatter System](idx-conducting-frontmatter-system) — the system analyzed
- [fw-conducting-frontmatter](fw-conducting-frontmatter) — schema reference

**Downstream (what this index enables):**
- Command authors understanding what's fixed vs. open
- Scope method integration (invariants/variants section)
- System evolution without breaking changes
- Clear criteria for "is this change safe?"

**Related:**
- [Invariants/Variants OF Systems Thinking](inst-invariants-variants-systems-thinking) — similar analysis on different domain
