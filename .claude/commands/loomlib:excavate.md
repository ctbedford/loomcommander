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
## Excavation Notes: {TERM}

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
`loomlib/docs/research/{slug}-excavation.md`

This is working material. When research is complete, the excavation becomes an **instance** document. Either:
1. Continue directly to full instance structure (if ready)
2. Save research notes and use `/loomlib:instance` later

Excavations are instances of Etymon Method — they belong in the app's document graph once ready.

Now excavate: $ARGUMENTS
