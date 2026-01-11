---
description: Generate a loomlib instance document by applying frameworks
argument-hint: [TERM] <operator> [TERM] or just [TERM] for single-term excavation
---

# Instance: $ARGUMENTS

Generate an instance document — the product of applying frameworks to specific content.

## Instances Are Products

Every instance has a **formula**: the frameworks that produced it.
```
Instance = Framework(s) applied to Content
```

Most instances in loomlib use **Etymon Method** as the primary toolkit, often combined with a domain framework.

## Operators

Operators structure how terms relate. Choose based on what the relation reveals:

| Operator | Reveals | Example |
|----------|---------|---------|
| **AS** | Hidden identity | TUTOR AS (what tutoring really is) |
| **FROM** | Unexpected origin | CAPITAL FROM (caput → cattle → property) |
| **VERSUS** | Genuine opposition | OIKONOMIA VERSUS CHREMATISTICS |
| **WITHIN** | Hidden interiority | SPECTATORSHIP WITHIN (what's inside the watching) |
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

## Discovery (before Production)

Query the loomlib API to find related documents before producing.

### 1. Check for Related Instances

```bash
# Find instances on same or related terms
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "instance") | select(.title | test("$ARGUMENTS"; "i")) | {id, title, status}]'
```

### 2. Check for Frameworks to Apply

```bash
# Find frameworks that might apply
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "framework") | {id, title, framework_kind}]'
```

### 3. Check for Sources

```bash
# Find sources that might inform this instance
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "source") | select(.title | test("$ARGUMENTS"; "i")) | {id, title}]'
```

### 4. Report & Decide

Based on discovery:

| Finding | Action |
|---------|--------|
| **Prior instance exists** | Reference as upstream with `relation: prior` |
| **Framework applies** | Reference as upstream with `relation: method` |
| **Source available** | Reference as upstream with `relation: source` |
| **No related docs** | Proceed fresh |

---

## Required Fields

```yaml
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-{slug}
title: {TERM} or {TERM operator TERM}
type: instance
framework_kind: null
framework_ids: [fw-etymon-method, fw-{other-framework}]
source_id: {src-id-if-referenced}
output: etymon | loomcommander | null
perspective: philosophical-genealogy | linguistic-recovery | economic-genealogy | legal-grammar
status: incubating | draft | verified
tags: [relevant, tags]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: produce
execution_state: completed
upstream:
  - doc: fw-etymon-method
    relation: method
  - doc: {source-id-from-discovery}
    relation: source
downstream: []
```

## Document Structure (Etymon Method)

```markdown
# {TITLE}

**Operator:** {OPERATOR} — {what it reveals}
**Formula:** Etymon Method + {Domain Framework if applicable}
**Channel:** {output destination}

---

## EXCAVATION

### Etymology
The word's origin. Root language, literal meaning, original concrete referent.

### Original Usage
How the term was first used. What conditions of life generated the need for this name.

### The Root Insight
What the etymology reveals that contemporary usage obscures.

---

## DRIFT

### Inflection Points
Key moments when meaning shifted. Name the transitions.

### What Was Lost
The specific semantic content that degraded. Not vague "richness" — the particular distinction.

### Structure of Degradation
How the drift happened. Generalization? Abstraction? Appropriation? Inversion?

---

## RECOVERY

### The Claim
What this term should mean. Normative, not merely descriptive.

### Contemporary Application
How to wield this recovered meaning. What it makes possible.

### The Stakes
Why this recovery matters. What's at risk if the degraded meaning persists.

---

## PRODUCTION NOTES (for channel output)

- Runtime target
- Visual approach
- Tonal calibration
- Key risks
```

## Status Criteria

**incubating**: Core insight present but sources needed. List what's missing.
**draft**: Full structure, needs verification pressure.
**verified**: Philologically accurate, structurally sound, practically applicable.
**captured**: Exported to vessel (video script, document, etc.)

## Output

Write the instance document to:
`loomlib/docs/instance/{slug}.md`

Include YAML frontmatter with all required fields.

Add a **Composition** section at the end of the document:

```markdown
---

## Composition

**Upstream (what informed this instance):**
- [Etymon Method](fw-etymon-method) — method applied
- [{Source Title}]({source-id}) — reference material

**Downstream (what this instance enables):**
- Video production
- Further instances building on this

**Related (discovered but not upstream):**
- {other related docs found during discovery}
```

## Incubating Instance Template

If sources are needed, use this abbreviated form:

```markdown
# {TITLE}

**Status:** incubating
**Operator:** {OPERATOR}
**Formula:** [frameworks]

## Core Insight
The thesis in 2-3 sentences.

## Sources Needed
- {Author/Text} — for {what aspect}
- {Author/Text} — for {what aspect}

## Notes
Any preliminary excavation or thinking.
```

## Post-Completion

After writing the instance, report:

1. **What was discovered:** Related instances, frameworks, sources found
2. **What was used:** Which docs informed this instance (now in `upstream`)
3. **What this enables:** Next steps (video, further instances, etc.)

Now generate the instance for: $ARGUMENTS
