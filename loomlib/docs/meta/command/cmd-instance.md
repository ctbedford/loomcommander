---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: cmd-instance
title: "Command: instance"
type: command
domain: meta
status: draft
tags: [command, loomlib, produce, etymon, excavation]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: build
execution_state: completed
upstream:
  - doc: fw-etymon-method
    relation: method
downstream: []

# ─── COMMAND-SPECIFIC ───────────────────────────────────────
command_path: .claude/commands/loomlib:instance.md
produces: instance
tools_used: [Read, Write, Bash]
discovery_pattern: queries API for prior instances, applicable frameworks, and relevant sources
---

# Command: instance

**Domain:** loomlib
**Path:** `.claude/commands/loomlib:instance.md`
**Produces:** instance documents ({slug}.md)

---

## Description

Generate a loomlib instance document by applying frameworks. This is the primary **production command** — it creates the knowledge graph's core content.

**Argument hint:** `[TERM] <operator> [TERM]` or just `[TERM]` for single-term excavation

---

## Core Concept

**Instances are products.** Every instance has a formula:

```
Instance = Framework(s) applied to Content
```

Most instances use **Etymon Method** as the primary toolkit, often combined with a domain framework (e.g., Oikonomia vs Chrematistics, Agonal Identity).

---

## The Operator System

Operators structure how terms relate. They're the key to the instance command's expressiveness:

| Operator | Reveals | Example |
|----------|---------|---------|
| **AS** | Hidden identity | TUTOR AS (what tutoring really is) |
| **FROM** | Unexpected origin | CAPITAL FROM (caput → cattle → property) |
| **VERSUS** | Genuine opposition | OIKONOMIA VERSUS CHREMATISTICS |
| **WITHIN** | Hidden interiority | SPECTATORSHIP WITHIN |
| **WITHOUT** | Privation/hollow form | CREDIT WITHOUT (what's missing) |
| **BEFORE** | Priority/precedence | ALLIANCE BEFORE EMPIRE |
| **THROUGH** | Mediation | IDENTITY THROUGH CONTEST |
| **OF** | Characteristic quality | CARTOGRAPHY OF PHILOLOGY |
| **FOR** | Hidden purpose/beneficiary | EDUCATION FOR (whose benefit) |
| **TO** | Transformation arc | REPUBLIC TO EMPIRE |
| **AGAINST** | Resistance/opposition | TRADITION AGAINST PROGRESS |
| **BEHIND** | What operates while attention is elsewhere | VERB BEHIND NOUN |
| **AND** | System/causal loop | CREDIT AND DEBT |
| **OR** | False binary to dissolve | NATURE OR NURTURE |

---

## Tools Used

| Tool | Purpose |
|------|---------|
| Bash (curl) | Query loomlib API for discovery |
| Read | Load related frameworks and sources |
| Write | Create the instance document |

---

## Framework Reference

This command primarily applies: **[Etymon Method](fw-etymon-method)**

Etymon Method is a **toolkit framework** for philological excavation. It follows the arc:

**Excavation → Drift → Recovery**

- **Excavation:** What did the word originally mean? What capacity did it carry?
- **Drift:** How did that meaning degrade? Through abstraction, institutionalization, metaphor collapse?
- **Recovery:** What would it look like to have this capacity back?

---

## Discovery Pattern

Before production, this command:

1. **Checks for prior instances** — Queries API for existing instances on same/related terms
2. **Finds applicable frameworks** — Lists all frameworks to identify which to apply
3. **Checks for sources** — Finds sources that might inform the instance
4. **Reports & decides** — Documents findings and determines upstream references

```bash
# Example discovery queries
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "instance") | select(.title | test("TERM"; "i"))]'
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "framework")]'
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "source") | select(.title | test("TERM"; "i"))]'
```

---

## Protocol Summary

| Step | Action |
|------|--------|
| 1. Discovery | Query API for related instances, frameworks, sources |
| 2. Select Operator | Choose operator based on what relation reveals |
| 3. Apply Framework | Use Etymon Method structure (+ domain framework if applicable) |
| 4. Excavation | Etymology, original usage, root insight |
| 5. Drift | Inflection points, what was lost, structure of degradation |
| 6. Recovery | The claim, contemporary application, the stakes |
| 7. Composition | Document upstream/downstream references |

---

## Output Structure

**Location:** `loomlib/docs/instance/{slug}.md`

**Frontmatter fields:**
- `id`: inst-{slug}
- `type`: instance
- `framework_ids`: [fw-etymon-method, fw-{other}]
- `source_id`: {src-id if referenced}
- `output`: etymon | loomcommander | null
- `perspective`: philosophical-genealogy | linguistic-recovery | economic-genealogy | legal-grammar
- `intent`: produce
- `execution_state`: completed

**Key sections:**
- Operator & Formula — What structures this excavation
- Excavation — Etymology, original usage, root insight
- Drift — Inflection points, what was lost, structure of degradation
- Recovery — The claim, contemporary application, stakes
- Production Notes — For channel output (runtime, visuals, tone)
- Composition — Upstream/downstream references

---

## Status Progression

| Status | Meaning |
|--------|---------|
| **incubating** | Core insight present but sources needed. List what's missing. |
| **draft** | Full structure, needs verification pressure |
| **verified** | Philologically accurate, structurally sound, practically applicable |
| **captured** | Exported to vessel (video script, document, etc.) |

---

## Incubating Template

When sources are needed, use abbreviated form:

```markdown
# {TITLE}

**Status:** incubating
**Operator:** {OPERATOR}
**Formula:** [frameworks]

## Core Insight
The thesis in 2-3 sentences.

## Sources Needed
- {Author/Text} — for {what aspect}

## Notes
Any preliminary excavation or thinking.
```

---

## Constraints

- **Discovery required:** Query API for related docs before producing
- **Operator selection:** Choose operator based on what it reveals, not arbitrarily
- **Framework reference:** Always specify which frameworks were applied
- **Composition required:** Document upstream/downstream at end

---

## When to Use

| Scenario | Use Instance? |
|----------|---------------|
| Excavating a degraded term | Yes |
| Applying a framework to specific content | Yes |
| Producing content for etymon channel | Yes |
| Pure research without production goal | No (use survey) |
| Capturing raw observations | No (use note) |

---

## Relationship to Other Commands

| Command | Relationship |
|---------|--------------|
| **survey** | Research that might inform an instance |
| **scope** | UX requirements that might become instances |
| **excavate** | Single-term deep dive (specialized instance) |
| **source** | Reference material that instances draw from |
| **framework** | Method that instances apply |

---

## Promotion Criteria

To reach **stable** status:
- [ ] Command documented accurately
- [ ] Produces expected output with correct structure
- [ ] Discovery pattern works
- [ ] Framework reference verified (fw-etymon-method)
- [ ] Operator system documented
- [ ] Example instance exists with all sections

---

## Example Output

A well-formed instance:

```markdown
# CAPITAL

**Operator:** FROM — unexpected origin
**Formula:** Etymon Method + Oikonomia vs Chrematistics
**Channel:** etymon

## EXCAVATION

### Etymology
Latin *caput* (head) → *capitale* (chief, principal) → cattle as
countable wealth → abstract "capital"

### Original Usage
Cattle were the original form of countable, moveable wealth...

## DRIFT

### What Was Lost
The concrete referent — capital as living, reproducing wealth...

## RECOVERY

### The Claim
Capital should mean productive capacity, not abstract accumulation...
```

---

## Composition

**Upstream:**
- [Etymon Method](fw-etymon-method) — primary toolkit applied by this command

**Downstream:**
- Enables command discovery in meta domain
- Informs command catalog
- Core production command for loomlib content
