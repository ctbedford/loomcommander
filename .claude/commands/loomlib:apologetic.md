---
description: Domestication detection and strangeness recovery
argument-hint: [FIGURE/TEXT/PRACTICE]
---

# Apologetic: $ARGUMENTS

Perform domestication detection using the Apologetic Method. Surface how interpretive traditions have made something safe; recover what challenges.

**CRITICAL: This is research, not production. Output is analysis and findings, not a finished essay.**

## Apologetic Method

| Phase | Question | Output |
|-------|----------|--------|
| **DOMINANT READING** | What has this been made to mean? | Received view, what it confirms |
| **OPERATION** | How was it domesticated? | Name the move(s) |
| **STRANGENESS** | What resists the reading? | The challenging core |
| **RECOVERY** | What becomes available? | What we can think again |

## Discovery (before Research)

Query the loomlib API to find related documents before starting.

### 1. Check for Prior Apologetics

```bash
# Find apologetics on same or related figures
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.title | test("$ARGUMENTS"; "i")) | {id, title, type, status}]'
```

### 2. Check for Related Excavations

```bash
# Find etymon excavations that might inform this apologetic
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.id | contains("excavate")) | {id, title}]'
```

### 3. Check for Sources

```bash
# Find sources that might inform this analysis
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "source") | {id, title}]'
```

### 4. Report & Decide

Based on discovery:

| Finding | Action |
|---------|--------|
| **Prior apologetic exists** | Reference as upstream with `relation: prior` |
| **Related excavation exists** | Reference as upstream with `relation: informs` |
| **Source available** | Reference as upstream with `relation: source` |
| **No related docs** | Proceed fresh |

---

## Research Protocol

### 1. Identify the Dominant Reading

Search for:
- How is $ARGUMENTS typically described in popular/educational contexts?
- What "lessons" are drawn?
- What present values does this reading confirm?
- What does it make the original a precursor *to*?

**Tools:** Web search, encyclopedias, popular summaries

### 2. Identify the Domestication Operation

Which moves are deployed?

| Operation | Signs |
|-----------|-------|
| **Moralizing** | "teaches us that...", ethical lessons |
| **Psychologizing** | inner states, feelings, "processing" |
| **Secularizing** | gods as metaphor, stripping sacred |
| **Liberalizing** | individual choice, tolerance, cosmopolitanism |
| **Spiritualizing** | "inner journey", metaphorical reading |
| **Aestheticizing** | beauty, form, "great literature" |
| **Historicizing-away** | "they believed...", temporal quarantine |

### 3. Locate the Suppressed Element

What made interpreters uncomfortable?
- Violence they couldn't moralize
- Claims they couldn't psychologize
- Stakes they couldn't aestheticize
- Strangeness they couldn't liberalize

### 4. Articulate the Original Strangeness

What form of life, knowing, or valuation does the original represent?
- What questions was it answering that we've stopped asking?
- What capacities did it assume that we've lost?
- Where does it refuse to be familiar?

### 5. Find Counter-Readers

Who saw through the domestication?
- Scholars who let it be strange
- Readers from outside the tradition
- Moments when the apologetic cracked

### 6. Formulate the Larper Tell

What's the specific misreading that reveals someone only knows the domesticated version?
- The quote that gets it wrong
- The interpretation that proves non-engagement
- The confident claim that shows they haven't read it

### 7. Articulate Recovery

What does the original offer that the domesticated version cannot?
- What question can we ask again?
- What capacity becomes available?
- What gets thinkable?

---

## Output Format

```markdown
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-apologetic-{slug}
title: "Apologetic: {FIGURE/TEXT}"
type: instance
framework_kind: null
framework_ids: [fw-apologetic-method]
source_id: null
output: etymon
perspective: philosophical-genealogy
status: incubating
tags: [apologetic, domestication, {figure/text}, strangeness]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-apologetic-method
    relation: method
  - doc: {related-doc-from-discovery}
    relation: informs
downstream: []
---

# Apologetic: {FIGURE/TEXT}

**Date:** {date}
**Status:** research (pre-production)

---

## Dominant Reading

**Received view:** {What it's been made to mean}

**Confirms:** {Present value served}

**Makes original a precursor to:** {What teleology is imposed}

---

## Domestication Operation

**Primary operation:** {moralizing|psychologizing|secularizing|liberalizing|spiritualizing|aestheticizing|historicizing-away}

**Secondary operations:** {if applicable}

**How it works:** {Specific mechanism}

---

## Suppressed Element

**What's flattened:** {Specific content}

**What made interpreters uncomfortable:** {The resistance}

---

## Original Strangeness

**The challenging core:** {What refuses to be familiar}

**Form of life assumed:** {What world did this come from}

**Question being answered:** {What we've stopped asking}

---

## Counter-Readers

**Who saw clearly:**
- {Reader 1}: {What they saw}
- {Reader 2}: {What they saw}

---

## Larper Tell

**The giveaway:** {Specific misreading}

**What it reveals:** {Why this proves non-engagement}

---

## Recovery

**What becomes available:** {Capacity recovered}

**What question can we ask again:** {The question}

**Stakes:** {Why it matters}

---

## Production Readiness

**Ready for instance?** {Yes / No}

**If no, what's needed:**
- [ ] {More research on X}
- [ ] {Specific source}
- [ ] {Sharpening of recovery}

**Potential compositions:**
- Could compose with excavation of: {related term}
- Could inform apologetic of: {related figure}
```

## Save Location

Write apologetic analysis to:
`loomlib/docs/instance/apologetic-{slug}.md`

Apologetics are instances of Apologetic Method — they belong in the app's document graph.

## Post-Completion

After writing the apologetic, report:

1. **What was discovered:** Prior apologetics, related excavations, sources found
2. **What was used:** Which docs informed this apologetic (now in `upstream`)
3. **Production readiness:** Can this become full content, or does it need more research?
4. **Potential compositions:** What excavations or other apologetics could this connect to?

Now analyze: $ARGUMENTS
