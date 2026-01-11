---
description: Semantic excavation of a term using Etymon Method
argument-hint: [TERM] or [TERM] <operator> [TERM]
---

# Excavate: $ARGUMENTS

Perform semantic excavation using the Etymon Method. This is pre-production research — understanding before producing.

**CRITICAL: This is research, not production. Output is notes and findings, not a finished instance.**

## Etymon Method

| Phase | Question | Output |
|-------|----------|--------|
| **EXCAVATION** | What did the word originally name? | Etymology, root, original usage |
| **DRIFT** | How did meaning shift? | Inflection points, what was lost |
| **RECOVERY** | What should it mean? | Normative claim, application |

## Discovery (before Research)

Query the loomlib API to find related documents before starting.

### 1. Check for Prior Excavations

```bash
# Find excavations on same or related terms
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.title | test("$ARGUMENTS"; "i")) | {id, title, type, status}]'
```

### 2. Check for Sources

```bash
# Find sources that might inform this excavation
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "source") | {id, title}]'
```

### 3. Report & Decide

Based on discovery:

| Finding | Action |
|---------|--------|
| **Prior excavation exists** | Reference as upstream with `relation: prior` |
| **Related instance exists** | Check if this is redundant or extends it |
| **Source available** | Reference as upstream with `relation: source` |
| **No related docs** | Proceed fresh |

---

## Research Protocol

### 1. Etymology

Search for:
- Root language (Latin, Greek, Proto-Indo-European, Germanic, etc.)
- Literal/concrete original meaning
- Earliest attested usage
- Cognates in other languages

**Tools:** Web search, etymological dictionaries (Etymonline, OED, Wiktionary)

### 2. Semantic History

Search for:
- Major shifts in meaning
- When shifts occurred
- What caused them (cultural, political, economic)
- Key texts that mark transitions

**Tools:** Web search, historical dictionaries, scholarly sources

### 3. Contemporary Usage

Identify:
- Current dominant meaning
- What's lost from original
- What's gained or distorted
- Contested usages

### 4. Recovery Candidates

Propose:
- What the term *should* mean
- What recovery enables
- What stakes are involved

## Output Format

```markdown
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-excavate-{slug}
title: "Excavation: {TERM}"
type: instance
framework_kind: null
framework_ids: [fw-etymon-method]
source_id: null
output: null
perspective: linguistic-recovery
status: incubating
tags: [excavation, {term}, etymology]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-etymon-method
    relation: method
  - doc: {source-id-from-discovery}
    relation: source
downstream: []
---

# Excavation: {TERM}

**Date:** {date}
**Status:** research (pre-production)

---

### Etymology

**Root:** {root word/language}
**Literal meaning:** {concrete original}
**First attested:** {date/source if known}

**Sources consulted:**
- {source 1}
- {source 2}

**Findings:**
{What the etymology reveals}

---

### Semantic History

**Key inflection points:**

1. {Date/Period}: {What shifted}
2. {Date/Period}: {What shifted}
3. ...

**Sources:**
- {source}

---

### Contemporary Usage

**Dominant meaning:** {current usage}

**What's lost:** {specific semantic content}

**What's distorted:** {how meaning is wrong}

---

### Recovery Hypothesis

**Claim:** {what the term should mean}

**Application:** {how to wield it}

**Stakes:** {why it matters}

---

### Production Readiness

**Ready for instance?** {Yes / No}

**If no, what's needed:**
- [ ] {More etymological research}
- [ ] {Specific source}
- [ ] {Clarification of drift}
- [ ] {Sharpening of recovery}

**Suggested operator:** {AS, FROM, WITHIN, etc.}

**Suggested formula:** Etymon Method + {domain framework if applicable}
```

## Operator Selection Guide

After excavation, choose operator based on what the research revealed:

| If you found... | Consider operator... |
|-----------------|---------------------|
| Hidden identity beneath surface meaning | AS |
| Surprising etymological origin | FROM |
| Genuine opposition to another term | VERSUS |
| Interior structure within the term | WITHIN |
| Essential element that's now absent | WITHOUT |
| Temporal priority over something | BEFORE |
| Mediation between other concepts | THROUGH |
| Characteristic quality of a source | OF |
| Hidden beneficiary or purpose | FOR |
| Transformation from one state to another | TO |
| Opposition or resistance | AGAINST |
| Something operating while attention is elsewhere | BEHIND |
| Systematic connection with another term | AND |
| False binary to dissolve | OR |

## Save Location

Write excavation notes to:
`loomlib/docs/instance/excavate-{slug}.md`

Excavations are instances of Etymon Method — they belong in the app's document graph. When research is complete and findings are solid, the excavation can be:
1. Promoted to a full instance via status update
2. Used as upstream reference for a more polished instance

## Post-Completion

After writing the excavation, report:

1. **What was discovered:** Prior excavations, related instances, sources found
2. **What was used:** Which docs informed this excavation (now in `upstream`)
3. **Production readiness:** Can this become a full instance, or does it need more research?
4. **Suggested next steps:** Operator selection, sources needed, etc.

Now excavate: $ARGUMENTS
