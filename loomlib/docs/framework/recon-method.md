---
id: fw-recon-method
title: Recon Method
type: framework
framework_kind: toolkit
framework_ids: []
source_id: null
output: null
perspective: null
status: incubating
tags: [intelligence, reconnaissance, strategic, tactical, domain, collection, analysis]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: build
execution_state: completed
upstream: []
downstream: []
---
# Recon Method

**Type:** Toolkit Framework
**Function:** Transform unfamiliar domains into strategic-tactical legibility

## The Distinction

| Mode | Unit | Question | Output |
|------|------|----------|--------|
| **Excavation** | Single concept | What capacity is buried here? | Recovered meaning |
| **Reconnaissance** | Entire domain | What do I need to act here? | Populated categories |

Etymon excavates a single degraded term. Recon maps terrain and populates categories adequate to action.

## The OSINT Analogy

Open Source Intelligence isn't about finding one fact — it's about establishing:
- **Collection disciplines** (what sources, how accessed)
- **Processing pipelines** (how filtered and structured)
- **Analytical frames** (how interpreted)
- **Product formats** (how packaged for action)

Recon Method applies this architecture to intellectual domains.

---

## The Four Operations

```
Domain → Collection → Processing → Analysis → Product → Categories Populated
```

| Operation | Question | Produces |
|-----------|----------|----------|
| **Collection** | What sources exist? What disciplines access them? | Raw material, organized by provenance |
| **Processing** | How do we filter, sequence, and structure? | Taxonomies, timelines, relations |
| **Analysis** | What does this mean? Where's the leverage? | Diagnoses, assessments, estimates |
| **Packaging** | What form delivers this to action? | Products calibrated to decision-type |

---

## Collection Disciplines

Each discipline accesses different source types:

| Discipline | Sources | What It Yields | Instrument |
|------------|---------|----------------|------------|
| **Philological** | Texts, terms, usage history | Buried operational wisdom | Etymon Method |
| **Genealogical** | Historical development, descent | How things became what they are | — |
| **Structural** | Institutions, arrangements, flows | Where power/value/information moves | Survey Method (for code) |
| **Network** | Actors, relationships, influence | Who matters, who's connected | — |
| **Phenomenological** | Lived experience, practice | What it's like to inhabit the domain | — |
| **Doctrinal** | Official statements, standard practices | What the domain says about itself | Source capture |

**Etymon = Philological discipline, deployed.**
**Survey = Structural discipline, deployed (for code domains).**

The others await their instruments.

---

## Processing Modes

How raw material becomes structured:

| Mode | Operation | Output |
|------|-----------|--------|
| **Taxonomic** | Categorize entities | Classification schemes |
| **Relational** | Map connections | Network graphs, dependency maps |
| **Temporal** | Sequence developments | Genealogies, phase diagrams |
| **Comparative** | Identify analogues/contrasts | Pattern libraries |

---

## Analytical Frames

Interpretive reasoning processes:

| Frame | Question | When to Deploy |
|-------|----------|----------------|
| **Diagnostic** | What's actually happening here? | Entering unfamiliar terrain |
| **Strategic** | Where are the leverage points? | Planning intervention |
| **Tactical** | What's the next concrete move? | Preparing for action |
| **Anticipatory** | What's the trajectory? What scenarios? | Positioning for futures |
| **Evaluative** | How does this compare to alternatives? | Decision-making between options |

---

## Intelligence Products

What reconnaissance produces:

| Product | Purpose | Structure |
|---------|---------|-----------|
| **Excavation** | Recover buried meaning | Term → Drift → Recovery (Etymon format) |
| **Terrain Map** | Visualize the domain | Actors, structures, flows, boundaries |
| **Assessment** | Diagnose current state | Situation, key dynamics, uncertainties |
| **Estimate** | Project trajectories | Scenarios, probabilities, trigger conditions |
| **Brief** | Package for decision | Situation, options, recommendation, risks |
| **Dossier** | Compile on specific entity | Profile, history, connections, assessment |

---

## Strategic Categories

These are the slots that tactical information fills:

| Category | What Belongs Here |
|----------|-------------------|
| **Actors** | Who operates in this domain? (individuals, institutions, classes) |
| **Structures** | What arrangements govern? (rules, flows, hierarchies) |
| **Dynamics** | What forces are in play? (tensions, trends, cycles) |
| **Positions** | Where can one stand? (roles, niches, vantage points) |
| **Instruments** | What tools exist? (methods, technologies, vehicles) |
| **Openings** | Where is there play? (gaps, opportunities, leverage) |

The measure shifts from "do I understand this?" to "have I populated my strategic categories with tactical information adequate to action?"

---

## The Workflow

### 1. Declare Domain
Name the domain to be reconned. This determines which collection disciplines apply.

### 2. Select Disciplines
Which collection disciplines yield material for this domain?

*Example for Economic Genealogy:*
- Genealogical (Polanyi, Graeber)
- Doctrinal (10-Ks, regulatory filings)
- Structural (balance sheets, flows)

### 3. Specify Processing
What structure do we need?

*Example:*
- Temporal (history of embeddedness → disembedding)
- Taxonomic (types of financial instruments)

### 4. Apply Analysis
Which frames serve the purpose?

*Example:*
- Diagnostic (how does this arrangement actually work?)
- Strategic (where are positions worth occupying?)

### 5. Select Products
What outputs serve the need?

*Example:*
- Terrain maps
- Dossiers on instruments
- Assessments of specific structures

### 6. Populate Categories
Fill the strategic categories with tactical findings:

*Example:*
- **Actors:** banks, regulators, funds
- **Structures:** debt/equity, derivatives architecture
- **Positions:** creditor/debtor, equity holder
- **Instruments:** leverage vehicles, hedges
- **Openings:** regulatory arbitrage, information asymmetry

---

## Relation to Other Methods

| Method | Scope | Relation to Recon |
|--------|-------|-------------------|
| **Etymon** | Single term | Philological collection discipline |
| **Survey** | Code subsystem | Structural collection discipline (technical domains) |
| **Scope** | UX requirements | Product type (requirements brief) |
| **Apologetic** | Domestication detection | Analytical frame (critical) |

Recon is the meta-method that orchestrates these as instruments.

---

## Campaign Tracking

A recon campaign document (`inst-recon-{domain}`) tracks:

```yaml
domain: {domain name}
disciplines_declared: [philological, structural, ...]
disciplines_run:
  - discipline: philological
    products: [inst-excavate-X, inst-excavate-Y]
  - discipline: structural
    products: [inst-survey-Z]
categories:
  actors: [{entity}, {entity}]
  structures: [{structure}]
  dynamics: [{dynamic}]
  positions: [{position}]
  instruments: [{instrument}]
  openings: [{opening}]
coverage_gaps: [phenomenological discipline not yet run]
```

---

## When to Use Recon

- Entering an unfamiliar domain with intent to act
- Need more than concept excavation — need operational legibility
- Preparing for strategic positioning in a field
- Building comprehensive understanding before intervention

## When NOT to Use Recon

- Single concept inquiry → use Etymon
- Code investigation → use Survey directly
- UX requirements → use Scope
- Just capturing material → use Note/Source
