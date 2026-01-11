---
description: Domain reconnaissance - map terrain, populate strategic categories with tactical information
argument-hint: [DOMAIN] or [DOMAIN] --execute
allowed-tools: Skill, Read, Write, Edit, Bash, Glob, Grep, Task
---

# Recon: $ARGUMENTS

**This command ORCHESTRATES other loomlib commands to build domain legibility.**

You are producing a **loomlib instance** using the **Recon Method** toolkit.

## Execution Modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| **Plan** | No `--execute` flag | Create campaign doc, identify gaps, recommend next actions |
| **Execute** | `--execute` flag present | Create campaign, then invoke sub-commands via Skill tool |

Parse $ARGUMENTS to determine mode:
- If contains `--execute`: Run in Execute mode
- Otherwise: Run in Plan mode

## Recon Method

The distinction:
- **Excavation** recovers a single buried concept
- **Reconnaissance** maps terrain and populates actionable categories

| Operation | Question | Produces |
|-----------|----------|----------|
| **Collection** | What sources exist? What disciplines access them? | Raw material by provenance |
| **Processing** | How do we filter, sequence, structure? | Taxonomies, timelines, relations |
| **Analysis** | What does this mean? Where's leverage? | Diagnoses, assessments |
| **Packaging** | What form delivers to action? | Products calibrated to decision |

## Discovery (before Protocol)

Query the loomlib API to find related documents.

### 1. Check for Existing Recon on This Domain

```bash
# Find existing recon campaigns
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.id | contains("recon")) | select(.title | test("$ARGUMENTS"; "i")) | {id, title, status, execution_state}]'
```

### 2. Check for Related Work

```bash
# Find excavations, surveys, sources on this domain
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.title | test("$ARGUMENTS"; "i")) | {id, title, type, status, execution_state}]'
```

### 3. Check Available Frameworks

```bash
# What methods/lenses might apply?
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.type == "framework") | {id, title, framework_kind}]'
```

### 4. Report & Decide

| Finding | Action |
|---------|--------|
| **Existing recon campaign** | Resume it (update rather than create new) |
| **Related excavations exist** | Reference as prior collection |
| **Related surveys exist** | Reference as prior collection |
| **Sources exist** | Reference as input material |
| **Nothing exists** | Start fresh campaign |

---

## Protocol

### 1. Declare Domain

State clearly what domain is being reconned:
- **Domain name:** $ARGUMENTS
- **Intent:** Why reconnaissance? What action is this preparing for?
- **Scope boundaries:** What's included/excluded?

### 2. Select Collection Disciplines

Which disciplines yield material for this domain?

| Discipline | Sources | Applicable? | Instrument |
|------------|---------|-------------|------------|
| **Philological** | Texts, terms, usage | [ ] | Etymon Method |
| **Genealogical** | Historical development | [ ] | — |
| **Structural** | Institutions, arrangements | [ ] | Survey Method |
| **Network** | Actors, relationships | [ ] | — |
| **Phenomenological** | Lived experience | [ ] | — |
| **Doctrinal** | Official statements | [ ] | Source capture |

### 3. Plan Collection

For each selected discipline, identify:
- What sources to access
- What instrument to use (existing command or manual)
- Expected product type

### 4. Track What Exists

List related documents already in loomlib:
- Prior excavations on this domain
- Prior surveys
- Captured sources
- Related instances

### 5. Identify Gaps

What collection is needed that doesn't exist yet?

### 6. Specify Strategic Categories

Define the slots to populate:

| Category | To Populate |
|----------|-------------|
| **Actors** | Who operates here? |
| **Structures** | What arrangements govern? |
| **Dynamics** | What forces are in play? |
| **Positions** | Where can one stand? |
| **Instruments** | What tools exist? |
| **Openings** | Where is there play? |

---

## Output

Write the recon campaign to: `loomlib/docs/instance/recon-{slug}.md`

```markdown
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-recon-{slug}
title: "Recon: {Domain}"
type: instance
framework_kind: null
framework_ids: [fw-recon-method]
source_id: null
output: null
perspective: null
status: incubating
tags: [recon, {domain}, {relevant-tags}]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: in_progress
upstream:
  - doc: fw-recon-method
    relation: method
downstream: []
---

# Recon: {Domain}

**Date initiated:** {date}
**Domain:** {domain name}
**Intent:** {why this reconnaissance}
**Scope:** {what's included/excluded}

---

## Collection Plan

### Disciplines Selected

| Discipline | Sources | Instrument | Status |
|------------|---------|------------|--------|
| Philological | {sources} | Etymon | {pending/done} |
| Structural | {sources} | Survey | {pending/done} |
| Doctrinal | {sources} | Source capture | {pending/done} |

### Products Generated

| Product | ID | Type | Status |
|---------|-----|------|--------|
| {Excavation of X} | inst-excavate-x | excavation | completed |
| {Survey of Y} | inst-survey-y | survey | completed |
| {Source: Z} | src-z | source | completed |

### Gaps (collection needed)

- [ ] {Discipline}: {what's missing}
- [ ] {Discipline}: {what's missing}

---

## Processing

### Taxonomic
{Classification schemes developed}

### Relational
{Network maps, dependency structures}

### Temporal
{Genealogies, phase diagrams}

### Comparative
{Pattern libraries, analogues identified}

---

## Analysis

### Diagnostic Assessment
{What's actually happening in this domain?}

### Strategic Assessment
{Where are the leverage points?}

### Key Dynamics
{Forces in play, tensions, trends}

### Uncertainties
{What remains unclear?}

---

## Strategic Categories

### Actors
| Entity | Role | Notes |
|--------|------|-------|
| {actor} | {role} | {notes} |

### Structures
| Structure | Function | Notes |
|-----------|----------|-------|
| {structure} | {function} | {notes} |

### Dynamics
| Dynamic | Direction | Implications |
|---------|-----------|--------------|
| {dynamic} | {trend} | {implications} |

### Positions
| Position | Characteristics | Accessibility |
|----------|-----------------|---------------|
| {position} | {characteristics} | {accessibility} |

### Instruments
| Instrument | Purpose | Availability |
|------------|---------|--------------|
| {instrument} | {purpose} | {availability} |

### Openings
| Opening | Nature | Risk/Reward |
|---------|--------|-------------|
| {opening} | {nature} | {assessment} |

---

## Coverage Assessment

| Discipline | Coverage | Products |
|------------|----------|----------|
| Philological | {%} | {count} excavations |
| Genealogical | {%} | {count} docs |
| Structural | {%} | {count} surveys |
| Network | {%} | {count} maps |
| Phenomenological | {%} | {count} docs |
| Doctrinal | {%} | {count} sources |

**Overall legibility:** {assessment}

**Adequate for action?** {yes/no — why}

---

## Next Actions

1. {Next collection task}
2. {Next processing task}
3. {Next analysis task}

---

## Composition

**Upstream (what informed this campaign):**
- [Recon Method](fw-recon-method) — method used

**Downstream (what this campaign enables):**
- {Strategic planning on this domain}
- {Specific interventions}

**Products generated:**
- {list of excavations, surveys, sources produced}
```

---

## When to Use This Command

- Entering a new intellectual domain with intent to act
- Need comprehensive strategic-tactical legibility
- More than single concept excavation required
- Preparing for strategic positioning

---

## Orchestration Protocol (Execute Mode)

When `--execute` flag is present, actively orchestrate collection:

### Phase 1: Planning
1. Complete Discovery (API queries above)
2. Create initial campaign doc with disciplines selected
3. Identify specific collection tasks from gaps

### Phase 2: Collection Orchestration

For each identified collection task, invoke the appropriate command via **Skill tool**:

**Philological Collection (Etymon):**
```
Use Skill tool: skill="loomlib:excavate", args="{term}"
```

**Structural Collection (Survey):**
```
Use Skill tool: skill="loomlib:survey", args="{subsystem}"
```

**Doctrinal Collection (Source):**
```
Use Skill tool: skill="loomlib:source", args="{source-reference}"
```

**Parallel Execution:** When multiple collection tasks are independent, invoke multiple Skill calls in a single response to run them in parallel.

### Phase 3: Result Aggregation

After each sub-command completes:
1. Read the output document it created
2. Extract findings relevant to strategic categories
3. Update the campaign doc with:
   - Products Generated (add the new doc)
   - Strategic Categories (populate from findings)
   - Coverage Assessment (update percentages)

### Phase 4: Synthesis

Once collection is complete:
1. Perform Diagnostic and Strategic analysis
2. Populate all six strategic categories from collected material
3. Assess overall legibility
4. Determine if adequate for intended action

---

## Workflow

### Plan Mode (default)

1. **Create campaign** — Run `/loomlib:recon {domain}`
2. Campaign doc identifies gaps and recommends next actions
3. User manually runs sub-commands as needed
4. User updates campaign doc with results

### Execute Mode

1. **Create & execute** — Run `/loomlib:recon {domain} --execute`
2. Command automatically invokes sub-commands via Skill tool
3. Results aggregated into campaign doc
4. Strategic categories populated from collection
5. Coverage assessed, further collection suggested if needed

## Status Progression

- `incubating` — Campaign just started
- `draft` — Collection underway, categories partially populated
- `verified` — Adequate legibility for intended action achieved
- `captured` — Domain legibility used in downstream action

## Post-Completion

### Plan Mode Report

After creating the campaign doc, report:

1. **Domain declared:** What's being reconned
2. **Disciplines selected:** What collection methods apply
3. **Existing work found:** What discovery revealed
4. **Gaps identified:** What collection is needed
5. **Next action:** What to run next (or suggest `--execute` to auto-run)

Example:
```
Recon campaign created: inst-recon-economic-genealogy

Discovery found:
- inst-excavate-capital (verified) — prior philological collection
- inst-excavate-credit (verified) — prior philological collection
- src-aristotle-politics (verified) — source material
- fw-oikonomia-chrematistics (verified) — applicable lens

Disciplines selected:
- Philological (partial — 2 excavations exist)
- Genealogical (pending — Polanyi, Graeber needed)
- Doctrinal (pending — 10-K analysis needed)

Next action:
- /loomlib:source on Polanyi "The Great Transformation"
- /loomlib:excavate on "interest" (philological gap)

Or run: /loomlib:recon economic-genealogy --execute
```

### Execute Mode Report

After orchestrating collection, report:

1. **Collection completed:**
   - Commands invoked (list)
   - Documents created (list)
2. **Strategic categories populated:**
   - Summary of what's in each category
3. **Coverage assessment:**
   - Which disciplines covered, which still have gaps
4. **Legibility assessment:**
   - Is the domain now actionable?
   - What remains unclear?

Example:
```
Recon executed: inst-recon-economic-genealogy

Collection completed:
- /loomlib:excavate interest → inst-excavate-interest (completed)
- /loomlib:source Polanyi → src-polanyi-great-transformation (completed)

Strategic categories populated:
- Actors: banks, regulators, shadow banking entities
- Structures: debt/equity distinction, collateral chains
- Instruments: repos, derivatives, money market funds
- Openings: regulatory arbitrage, information asymmetry

Coverage: 60% (genealogical discipline still pending)

Legibility: Partial — adequate for understanding current structures,
            need Graeber/Polanyi for historical context
```

---

Now recon: $ARGUMENTS
