---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-scope-political-economy-study
title: "Scope: Political Economy Study Framework"
type: instance
framework_kind: null
framework_ids: [fw-scope-method]
source_id: null
output: etymon
perspective: economic-genealogy
status: incubating
tags: [scope, political-economy, framework, study, capital, finance, list, developmental]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-scope-method
    relation: method
  - doc: fw-oikonomia-chrematistics
    relation: informs
  - doc: inst-recon-economic-genealogy
    relation: prior
  - doc: idx-user-commitments
    relation: informs
downstream: []
---

# Scope: Political Economy Study Framework

**Date:** 2025-01-09
**Purpose:** Derive requirements for a framework that orchestrates study of political economies, systems, and capital/finance — aligned to stated commitments.

---

## 1. Audit: What Exists

### Current Instruments

| Instrument | Type | Function | Gap |
|------------|------|----------|-----|
| **Oikonomia/Chrematistics** | Domain lens | Diagnoses bounded vs unbounded | Evaluative only — no entry procedure |
| **Reading 10-K** | Toolkit | Extracts signal from SEC filings | Company-level only |
| **Etymon Method** | Toolkit | Excavates degraded terms | Term-level only |
| **Recon Method** | Toolkit | Populates strategic categories | General, not specialized for political economy |
| **Economic Genealogy Recon** | Instance (in progress) | Populates economic vocabulary | Content collection, not study method |

### Commitment Constraints

From `idx-user-commitments`:

| Commitment | Implication for Framework |
|------------|---------------------------|
| Friedrich List / developmental nationalism | Must distinguish national productive capacity from free-trade abstraction |
| American System tradition | Must recognize Hamilton/Clay/Lincoln as reference class |
| Oikonomia over chrematistics | Must evaluate arrangements against bounded flourishing |
| Skepticism of financialization | Must identify chrematistic drift in structures |
| Particularity over universalism | Must account for specific national/regional conditions |

### Skill Constraints

From `idx-user-skills`:

| Skill | Status | Implication |
|-------|--------|-------------|
| Etymon Method | Fluent | Can excavate terms |
| Oikonomia lens | Fluent | Can diagnose bounded/unbounded |
| 10-K reading | Developed | Can analyze specific companies |
| Macro-level analysis | **Gap** | No systematic approach to national/system-level |
| Policy analysis | **Gap** | No framework for evaluating arrangements |
| Legal/institutional | **Gap** | Legal grammar curriculum not started |

---

## 2. Affordances: What Should Be Possible

A Political Economy Study Framework should afford:

### Multi-Scale Analysis

| Scale | Example | Current Instrument | Gap |
|-------|---------|-------------------|-----|
| **Term** | "capital," "credit," "wealth" | Etymon Method | ✓ Covered |
| **Institution** | A specific corporation, bank, exchange | Reading 10-K | Partial — no banks, exchanges |
| **Sector** | Manufacturing, finance, agriculture | None | **Missing** |
| **National** | US industrial policy, German developmental model | None | **Missing** |
| **System** | Capitalism varieties, financial regimes | None | **Missing** |

### Movement Between Scales

The framework should afford:
- **Zoom out:** From a term → to its institutional instantiation → to its sectoral role → to its national character → to its system position
- **Zoom in:** From a system critique → to national arrangements → to sector structure → to specific institutions → to the vocabulary that naturalizes it

### Diagnostic Application

At each scale, the framework should afford asking:
1. **Oikonomic/Chrematistic:** Is this bounded or unbounded? Who is the "household"?
2. **Developmental/Extractive:** Does this build productive capacity or extract from it?
3. **Embedded/Disembedded:** Is this subordinate to social relations or separated from them?
4. **National/Cosmopolitan:** Does this serve particular development or abstract universalism?

### Genealogical Context

The framework should afford:
- Tracing how an arrangement came to be (not taking it as natural)
- Identifying when chrematistic drift occurred
- Recovering prior arrangements that were oikonomic
- Connecting to sources (Polanyi, Graeber, List, Hamilton, etc.)

---

## 3. Expectations: What Users Would Expect

### Entry Modes

A user approaching political economy study would expect to enter via:

| Entry Mode | Example | What Framework Should Do |
|------------|---------|--------------------------|
| **Term** | "What is capital really?" | Route to Etymon excavation → connect to institutions |
| **Institution** | "How does Goldman Sachs work?" | Route to 10-K analysis → connect to sector/system |
| **Event** | "What happened in 2008?" | Route to system analysis → connect to institutions → terms |
| **Policy** | "Should we have industrial policy?" | Route to national analysis → connect to List/Hamilton |
| **Author** | "What does Polanyi say?" | Route to source → connect to system analysis |

### Output Forms

Users would expect the framework to produce:

| Output | Example | Current Capability |
|--------|---------|-------------------|
| Excavation | DEBT = Schuld = guilt | ✓ Etymon Method |
| Institutional analysis | Goldman 10-K reading | Partial (10-K for public companies) |
| Sector map | US manufacturing structure | **Missing** |
| National arrangement | American System vs British Empire | **Missing** |
| System comparison | Listian vs Ricardian economics | **Missing** |
| Policy evaluation | Tariffs through developmental lens | **Missing** |

### Integration with Existing Work

Users would expect:
- New analyses to connect to existing excavations (CAPITAL, DEBT, etc.)
- National/system analysis to inform term excavations and vice versa
- Oikonomia/Chrematistics lens to apply at all scales
- Outputs to flow to Etymon channel

---

## 4. Gaps: What's Missing

### Critical Gaps

| Gap | Why Critical | Existing Partial Coverage |
|----|--------------|---------------------------|
| **National-scale method** | Commitments are about developmental nationalism — need method for analyzing national arrangements | Recon Method (general) |
| **Sector analysis method** | Bridge between institution and nation | None |
| **Policy evaluation lens** | Commitments imply policy positions — need to evaluate arrangements | Oikonomia/Chrematistics (evaluative but not prescriptive) |
| **System comparison method** | Need to compare varieties of capitalism, not just critique | None |

### Methodological Gaps

| Gap | What's Needed |
|-----|---------------|
| **Entry heuristics** | How to decide which scale to start at |
| **Scale-linking** | How to move between term → institution → sector → nation → system |
| **Source integration** | How to bring sources (List, Polanyi, Graeber, Hamilton) into analysis |
| **Developmental criterion** | How to operationalize "productive capacity building" as diagnostic |

### Content Gaps (from Recon)

| Missing | Priority | Why |
|---------|----------|-----|
| List source capture | High | Core commitment, not yet documented |
| Hamilton source capture | High | American System origin |
| Mehrling source | Medium | Money view for financial analysis |
| Sector analysis template | High | No existing instrument |
| National arrangement template | High | No existing instrument |

---

## 5. Requirements: What the Framework Must Do

### Core Structure

The framework should be a **toolkit** (operative method) with the following components:

```
┌─────────────────────────────────────────────────────────────┐
│           POLITICAL ECONOMY STUDY FRAMEWORK                 │
│                                                             │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐    │
│  │  TERM   │ → │  INST   │ → │ SECTOR  │ → │ NATION  │    │
│  │         │ ← │         │ ← │         │ ← │         │    │
│  └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘    │
│       │             │             │             │          │
│       ▼             ▼             ▼             ▼          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                    DIAGNOSTICS                       │  │
│  │  • Oikonomic/Chrematistic                           │  │
│  │  • Developmental/Extractive                         │  │
│  │  • Embedded/Disembedded                             │  │
│  │  • Particular/Universal                             │  │
│  └─────────────────────────────────────────────────────┘  │
│                           │                                │
│                           ▼                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                  GENEALOGICAL                        │  │
│  │  • How did this arrangement arise?                  │  │
│  │  • When did drift occur?                            │  │
│  │  • What was the prior form?                         │  │
│  │  • Who benefits from naturalization?                │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Scale-Specific Methods

| Scale | Method Name | Core Operation |
|-------|-------------|----------------|
| Term | Etymon Method (existing) | Excavation → Drift → Recovery |
| Institution | Institution Analysis (extend 10-K) | Structure → Position → Diagnostic |
| Sector | Sector Mapping (new) | Boundaries → Actors → Dynamics → Diagnostic |
| Nation | National Arrangement (new) | Policy regime → Institutions → Sources → Diagnostic |
| System | System Comparison (new) | Varieties → Contrast → Evaluation |

### Diagnostic Questions (at each scale)

**Oikonomic/Chrematistic:**
1. What are the limits? (If none → chrematistic)
2. What is the telos? (If "more" → chrematistic)
3. Who is the household? (If no one → chrematistic)
4. What counts as enough? (If no satiation → chrematistic)

**Developmental/Extractive:**
1. Does this build productive capacity or extract from it?
2. Who develops and who stagnates under this arrangement?
3. What is the time horizon? (Developmental = long; extractive = short)
4. Is there infant industry logic? Technology transfer? Skill building?

**Embedded/Disembedded:**
1. Is economic activity subordinate to social relations?
2. Are labor/land/money treated as commodities or protected?
3. Is there a double movement (social protection against commodification)?
4. What violence was required to create this arrangement?

**Particular/Universal:**
1. Does this serve specific national development or abstract theory?
2. Are conditions acknowledged or assumed away?
3. Is there a national interest or only individual/global interest?
4. What is the role of the state?

### Integration Requirements

| Requirement | How |
|-------------|-----|
| Connect to existing excavations | Each institution/sector/nation analysis references relevant term excavations |
| Connect to sources | Each analysis cites genealogical sources (List, Polanyi, Graeber, etc.) |
| Apply oikonomia lens | Every analysis answers the four diagnostic questions |
| Flow to Etymon | Analysis outputs become research for videos |

### Source Capture Priorities

| Source | Why Needed | Priority |
|--------|------------|----------|
| Friedrich List, *National System of Political Economy* | Core commitment, developmental nationalism origin | **Immediate** |
| Alexander Hamilton, *Report on Manufactures* | American System origin | **Immediate** |
| Henry Clay, American System speeches | Policy implementation | High |
| Ha-Joon Chang, *Kicking Away the Ladder* | Contemporary developmental economics | High |
| Perry Mehrling, *The New Lombard Street* | Money view for finance analysis | Medium |

---

## 6. Proposed Framework Structure

### Name: **Political Economy Analysis**

### Type: Toolkit (operative method)

### Components:

1. **Entry Protocol**
   - Determine scale (term / institution / sector / nation / system)
   - Select appropriate sub-method
   - Identify relevant sources and prior work

2. **Scale Methods** (composable)
   - Etymon Method (term) — already exists
   - Institution Analysis (institution) — extend 10-K
   - Sector Mapping (sector) — new
   - National Arrangement (nation) — new
   - System Comparison (system) — new

3. **Diagnostic Grid**
   - Oikonomic/Chrematistic (from existing framework)
   - Developmental/Extractive (from List)
   - Embedded/Disembedded (from Polanyi)
   - Particular/Universal (from developmental nationalism)

4. **Genealogical Protocol**
   - Trace origin
   - Identify drift
   - Name naturalization
   - Recover alternative

5. **Output Templates**
   - Term excavation (existing)
   - Institution profile (new)
   - Sector map (new)
   - National arrangement (new)
   - System comparison (new)

---

## 7. Implementation Path

### Phase 1: Source Capture (Immediate)

| Task | Type | Warrior Check |
|------|------|---------------|
| Capture List, *National System* | Source | Research (Magician) — but enables Phase 2 |
| Capture Hamilton, *Report on Manufactures* | Source | Research (Magician) — but enables Phase 2 |

### Phase 2: Framework Draft

| Task | Type | Warrior Check |
|------|------|---------------|
| Draft `fw-political-economy-analysis` | Framework | Build (Magician) — but enables production |
| Include diagnostic grid | Framework | Build |
| Define scale methods | Framework | Build |

### Phase 3: Instance Testing

| Task | Type | Warrior Check |
|------|------|---------------|
| Apply to one sector (e.g., US manufacturing) | Instance | **Produce** — tests framework |
| Apply to one national arrangement (e.g., American System) | Instance | **Produce** — tests framework |

### Phase 4: Integration

| Task | Type | Warrior Check |
|------|------|---------------|
| Connect to existing excavations | Integration | Strengthens graph |
| Update Economic Genealogy Recon | Instance | Updates strategic categories |

---

## 8. Magician-Warrior Assessment

**Honest check:** This scope is Magician work. Building the framework is Magician work. But the framework enables:

| Warrior Outcome | How Framework Serves It |
|-----------------|-------------------------|
| Etymon Episode 1 | Economic genealogy content is video-ready |
| Economic analysis of real arrangements | Framework enables concrete analysis |
| Policy evaluation | Can assess actual policies through developmental lens |
| BeeSafe context | Understanding capital/finance structures for business |

**Risk:** Building yet another framework before shipping Episode 1.

**Mitigation:**
- Phase 1 (source capture) can happen in parallel with video production
- Framework draft can be minimal — diagnostic grid already exists in oikonomia/chrematistics
- The existing tools (Etymon, 10-K, Oikonomia lens) already work for term and institution scales
- What's actually missing is nation/sector templates — not a whole new framework

**Recommendation:** Don't build a new framework. Instead:
1. Capture List and Hamilton sources
2. Add sector/nation templates to Recon Method
3. Create one national arrangement instance (American System) as exemplar
4. Let the framework emerge from instances, not precede them

---

## 9. Summary

**What's needed:** A method for studying political economies at sector/nation/system scales, applying developmental nationalism lens, integrating with existing term and institution methods.

**What exists:** Strong term method (Etymon), strong evaluative lens (Oikonomia), partial institution method (10-K), active recon (Economic Genealogy).

**Key gaps:**
- List and Hamilton sources not captured
- No sector/nation/system templates
- Developmental/Extractive criterion not operationalized

**Recommendation:** Capture sources, create exemplar instances (American System, US Manufacturing), let framework emerge. Don't front-load framework building — that's the Magician trap.

**Output channel:** Etymon (economic genealogy track)

**Perspective:** Economic Genealogy

---

## Composition

**Upstream:**
- `fw-scope-method` — method
- `fw-oikonomia-chrematistics` — core diagnostic lens
- `inst-recon-economic-genealogy` — prior work in domain
- `idx-user-commitments` — calibration

**Downstream potential:**
- `src-list-national-system` — source capture
- `src-hamilton-report-manufactures` — source capture
- `fw-political-economy-analysis` — if framework is built
- `inst-american-system` — exemplar national arrangement
