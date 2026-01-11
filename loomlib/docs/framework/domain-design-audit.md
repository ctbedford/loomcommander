---
id: fw-domain-design-audit
title: "Domain Design Audit"
type: framework
framework_kind: toolkit
perspective: null
framework_ids:
  - fw-domain-command-architecture
  - fw-loomlib-domains
  - fw-invariants-variants
source_id: null
output: loomcommander
status: draft
tags:
  - architecture
  - domains
  - audit
intent: build
execution_state: completed
upstream:
  - doc: fw-domain-command-architecture
    relation: extends
  - doc: fw-loomlib-domains
    relation: method
downstream: []
---

# Domain Design Audit

**Type:** Toolkit Framework
**Function:** Comprehensive questionnaire for validating loomlib domain design

---

## How to Use This Audit

Work through each section in order. Each section must be complete before moving to the next. If you can't answer a question clearly, that's a signal the domain isn't well-defined yet.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DOMAIN DESIGN FLOW                                  │
│                                                                             │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐ │
│   │    I    │───▶│   II    │───▶│   III   │───▶│   IV    │───▶│    V    │ │
│   │ OUTPUTS │    │ INPUTS  │    │ METHODS │    │CONTAINER│    │  VIEWS  │ │
│   └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘ │
│        │              │              │              │              │        │
│        ▼              ▼              ▼              ▼              ▼        │
│   What leaves    What enters    What trans-   How work       How users     │
│   the system     the system     forms I→O     chunks         see/navigate  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## I. OUTPUTS — What Leaves the System

### A. The Terminal Question

**What is the FINAL artifact this domain produces for EXTERNAL consumption?**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Fill in the blank:                                                         │
│                                                                             │
│  "Users of this domain ultimately produce _________________ that go to     │
│   _________________ for the purpose of _________________."                  │
│                                                                             │
│  Examples:                                                                  │
│  - Etymon: "video scripts" → "YouTube" → "educating audience"              │
│  - Studio: "video content" → "YouTube/Substack/Podcast" → "building brand" │
│  - Legal:  "briefs/memos" → "courts/clients" → "winning cases"             │
│  - Academic: "papers" → "journals/conferences" → "advancing knowledge"     │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Your answer:**
```
Users of this domain ultimately produce _________________
that go to _________________
for the purpose of _________________.
```

### B. Output Channels

**Where does finished work GO?**

| Channel | What goes there | How often | Success metric |
|---------|-----------------|-----------|----------------|
| 1. _____ | ______________ | _________ | ______________ |
| 2. _____ | ______________ | _________ | ______________ |
| 3. _____ | ______________ | _________ | ______________ |

**Validation questions:**
- [ ] Can you name at least ONE output channel?
- [ ] Is the channel EXTERNAL to the system (not just internal organization)?
- [ ] Would a user recognize this as "where my work goes"?

### C. Output Document Types

**What document types represent FINISHED work?**

| Type | Icon | Example | Typical length |
|------|------|---------|----------------|
| _____ | ____ | _______ | ______________ |
| _____ | ____ | _______ | ______________ |

**Validation questions:**
- [ ] Is this type something you'd EXPORT or PUBLISH?
- [ ] Does it have value OUTSIDE the system?
- [ ] Could you show it to someone unfamiliar with loomlib?

---

## II. INPUTS — What Enters the System

### A. The Source Question

**What RAW MATERIAL feeds the outputs?**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Fill in the blank:                                                         │
│                                                                             │
│  "To produce [OUTPUT], users need to capture _________________ from        │
│   _________________ which they encounter while _________________."          │
│                                                                             │
│  Examples:                                                                  │
│  - Etymon: "quotes/concepts" from "books/articles" while "reading"         │
│  - Studio: "ideas/clips/sources" from "everywhere" while "consuming media" │
│  - Legal:  "cases/statutes" from "databases" while "researching"           │
│  - Academic: "papers/data" from "journals/experiments" while "researching" │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Your answer:**
```
To produce [OUTPUT], users need to capture _________________
from _________________
which they encounter while _________________.
```

### B. Input Document Types

**What document types represent RAW MATERIAL?**

| Type | Icon | Source | Capture friction |
|------|------|--------|------------------|
| _____ | ____ | _______ | high/med/low |
| _____ | ____ | _______ | high/med/low |
| _____ | ____ | _______ | high/med/low |

**Validation questions:**
- [ ] Does this type come from OUTSIDE the system?
- [ ] Is it captured before any transformation?
- [ ] Would losing it mean losing irreplaceable material?

### C. The Capture Moment

**WHEN and HOW do users capture inputs?**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Describe the typical capture scenario:                                     │
│                                                                             │
│  "User is doing _________________ when they encounter _________________    │
│   and need to capture it within _________________ seconds/minutes          │
│   or they'll lose it because _________________."                            │
│                                                                             │
│  Examples:                                                                  │
│  - "reading a book" → "a striking quote" → "30 seconds" → "flow state"     │
│  - "watching YouTube" → "a video idea" → "10 seconds" → "will forget"      │
│  - "client call" → "key facts" → "real-time" → "meeting pace"              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Your answer:**
```
User is doing _________________
when they encounter _________________
and need to capture it within _________________
or they'll lose it because _________________.
```

**This determines:**
- How frictionless capture must be
- Whether mobile capture is essential
- What the "quick add" interface needs

---

## III. METHODS — What Transforms Inputs to Outputs

### A. The Transformation Question

**What HAPPENS to inputs on the way to outputs?**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TRANSFORMATION MAP                                     │
│                                                                             │
│   INPUT                    TRANSFORMATION                    OUTPUT         │
│   ─────                    ──────────────                    ──────         │
│                                                                             │
│   [raw material] ──→ [process 1] ──→ [intermediate] ──→ [process 2] ──→   │
│                                                                             │
│   Fill in your domain's transformation chain:                               │
│                                                                             │
│   _____________ ──→ _____________ ──→ _____________ ──→ _____________      │
│                                                                             │
│   Examples:                                                                 │
│   Etymon:  source → excavate → instance → synthesize → video script        │
│   Studio:  idea → research → outline → draft → script                      │
│   Legal:   case → analyze → argument → draft → brief                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### B. Research Commands

**What commands develop UNDERSTANDING?**

| Command | Input | Output | Question it answers |
|---------|-------|--------|---------------------|
| /______ | _____ | ______ | "What is...?" |
| /______ | _____ | ______ | "How does...?" |
| /______ | _____ | ______ | "What should...?" |

**Validation questions:**
- [ ] Does this command help user UNDERSTAND something?
- [ ] Does it consume existing documents as input?
- [ ] Does it produce a document that informs future work?

**Reference (Etymon research commands):**
- `/excavate` — "What does this term really mean?"
- `/survey` — "What exists in this codebase?"
- `/scope` — "What should the UX be?"
- `/recon` — "What do I need to know to act in this domain?"

### C. Production Commands

**What commands generate OUTPUT?**

| Command | Input | Output | What it produces |
|---------|-------|--------|------------------|
| /______ | _____ | ______ | ________________ |
| /______ | _____ | ______ | ________________ |

**Validation questions:**
- [ ] Does this command produce something for EXTERNAL use?
- [ ] Does it synthesize multiple inputs?
- [ ] Is the output closer to "finished" than the inputs?

**Reference (Etymon production commands):**
- `/instance` — Apply framework to create content
- `/synthesize` — Combine multiple documents into emergent insight
- `/apologetic` — Defend a position against objections

### D. The Command Coverage Check

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMMAND COVERAGE MATRIX                                  │
│                                                                             │
│   INTENT        COMMAND(S)           PRODUCES           AUTOMATED?          │
│   ──────        ──────────           ────────           ──────────          │
│                                                                             │
│   CAPTURE       /____________        ____________        yes/no             │
│                 /____________        ____________        yes/no             │
│                                                                             │
│   RESEARCH      /____________        ____________        yes/no             │
│                 /____________        ____________        yes/no             │
│                                                                             │
│   BUILD         /____________        ____________        yes/no             │
│                 (manual?)            ____________        yes/no             │
│                                                                             │
│   ORGANIZE      /____________        ____________        yes/no             │
│                 /____________        ____________        yes/no             │
│                                                                             │
│   PRODUCE       /____________        ____________        yes/no             │
│                 /____________        ____________        yes/no             │
│                                                                             │
│   Requirements:                                                             │
│   □ At least ONE entry per intent                                          │
│   □ CAPTURE and PRODUCE must be automated                                  │
│   □ BUILD can be manual (creating frameworks is inherently manual)         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## IV. CONTAINERS — How Work Chunks

### A. The Project Unit Question

**What is the NATURAL UNIT of work in this domain?**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Fill in the blank:                                                         │
│                                                                             │
│  "A user works on one _________________ at a time, which contains          │
│   _________________ documents and takes _________________ to complete."     │
│                                                                             │
│  Examples:                                                                  │
│  - Etymon: "no explicit container" / "tag-based grouping"                  │
│  - Studio: "video project" → "10-50 docs" → "1-4 weeks"                    │
│  - Legal:  "matter (case/deal)" → "20-100 docs" → "weeks to months"        │
│  - Academic: "paper" → "50-200 docs" → "months"                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Your answer:**
```
A user works on one _________________ at a time,
which contains _________________ documents
and takes _________________ to complete.
```

### B. Container Decision

**Does this domain NEED an explicit container?**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CONTAINER NECESSITY TEST                                │
│                                                                             │
│   Answer yes or no:                                                         │
│                                                                             │
│   □ Do documents naturally GROUP into discrete units?                       │
│   □ Do those units have their OWN STATUS (beyond document status)?         │
│   □ Do users need to see "all documents for project X"?                    │
│   □ Do users ask "what's the status of project X"?                         │
│   □ Are there DEADLINES at the project level?                              │
│                                                                             │
│   Scoring:                                                                  │
│   - 4-5 yes → Container is ESSENTIAL                                       │
│   - 2-3 yes → Container is HELPFUL                                         │
│   - 0-1 yes → Container is UNNECESSARY (use tags instead)                  │
│                                                                             │
│   Your score: ___/5                                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### C. Container Design (if needed)

**If you need a container, define it:**

| Property | Value |
|----------|-------|
| Name | ________________ |
| Icon | ________________ |
| Contains (doc types) | ________________ |
| Status progression | ________________ → ________________ → ________________ |
| Typical lifespan | ________________ |
| Success state | ________________ |

### D. Document-Container Relationship

**How do documents relate to containers?**

```
□ One-to-one: Each document belongs to exactly one container
□ Many-to-one: Documents belong to one container, containers have many docs
□ Many-to-many: Documents can belong to multiple containers
□ Optional: Documents may or may not belong to containers
```

**Your choice:** ________________

---

## V. VIEWS — How Users See and Navigate

### A. The Workflow Question

**What is the PRIMARY workflow this domain supports?**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Describe the typical work session:                                         │
│                                                                             │
│  "User opens the app wanting to _________________. They first              │
│   _________________, then _________________, and finish by                 │
│   _________________. This takes about _________________."                   │
│                                                                             │
│  Examples:                                                                  │
│  - Etymon: "develop an idea" → "review notes" → "excavate a term" →        │
│            "write an instance" → "2-4 hours"                               │
│  - Studio: "work on a video" → "check pipeline" → "open project" →         │
│            "write script" → "1-2 hours"                                    │
│  - Legal: "advance a case" → "check deadlines" → "research issue" →        │
│           "draft section" → "2-4 hours"                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Your answer:**
```
User opens the app wanting to _________________.
They first _________________,
then _________________,
and finish by _________________.
This takes about _________________.
```

### B. View Derivation

**Based on your workflow, what views do you need?**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        VIEW DERIVATION TABLE                                │
│                                                                             │
│   WORKFLOW STEP          USER NEED              VIEW                        │
│   ─────────────          ─────────              ────                        │
│                                                                             │
│   "check pipeline"       see all projects       Pipeline/List View         │
│   "open project"         see project contents   Project/Detail View        │
│   "research issue"       see sources/context    Research/Graph View        │
│   "write script"         edit document          Editor View                │
│                                                                             │
│   Your mapping:                                                             │
│                                                                             │
│   ________________       ________________       ________________           │
│   ________________       ________________       ________________           │
│   ________________       ________________       ________________           │
│   ________________       ________________       ________________           │
│   ________________       ________________       ________________           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### C. View-Intent Coverage

**Map your views to intents:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      VIEW-INTENT COVERAGE CHECK                             │
│                                                                             │
│              CAPTURE   RESEARCH   BUILD   ORGANIZE   PRODUCE                │
│              ───────   ────────   ─────   ────────   ───────                │
│                                                                             │
│  View 1:     □ ●/○     □ ●/○     □ ●/○    □ ●/○     □ ●/○                 │
│  View 2:     □ ●/○     □ ●/○     □ ●/○    □ ●/○     □ ●/○                 │
│  View 3:     □ ●/○     □ ●/○     □ ●/○    □ ●/○     □ ●/○                 │
│  View 4:     □ ●/○     □ ●/○     □ ●/○    □ ●/○     □ ●/○                 │
│  View 5:     □ ●/○     □ ●/○     □ ●/○    □ ●/○     □ ●/○                 │
│                                                                             │
│  Mark ● for primary affinity, ○ for secondary                              │
│                                                                             │
│  Requirements:                                                              │
│  □ CAPTURE has at least one ● view                                         │
│  □ RESEARCH has at least one ● view                                        │
│  □ PRODUCE has at least one ● view                                         │
│  □ Every view has at least one ● (no orphan views)                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### D. View Specifications

**For each view, specify:**

| View | Name | Icon | Primary intent | Primary data | Primary action |
|------|------|------|----------------|--------------|----------------|
| 1 | _____ | ____ | ______________ | ____________ | ______________ |
| 2 | _____ | ____ | ______________ | ____________ | ______________ |
| 3 | _____ | ____ | ______________ | ____________ | ______________ |
| 4 | _____ | ____ | ______________ | ____________ | ______________ |
| 5 | _____ | ____ | ______________ | ____________ | ______________ |

### E. Default View

**Which view should open by default?**

View: ________________

Why: ________________

---

## VI. STATUS WORKFLOW — How Documents Progress

### A. Document Status

**What states do documents move through?**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DOCUMENT STATUS PROGRESSION                              │
│                                                                             │
│   State 1         State 2         State 3         State 4                  │
│   ───────         ───────         ───────         ───────                  │
│   __________  →   __________  →   __________  →   __________               │
│                                                                             │
│   Meaning:        Meaning:        Meaning:        Meaning:                 │
│   __________      __________      __________      __________               │
│                                                                             │
│   Reference (Etymon):                                                       │
│   incubating → draft → verified → captured                                 │
│   (early)      (shaped) (tested)   (exported)                              │
│                                                                             │
│   Reference (Studio):                                                       │
│   draft → ready → used                                                     │
│   (WIP)   (done)  (in project)                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### B. Container Status (if applicable)

**What states do containers move through?**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   CONTAINER STATUS PROGRESSION                              │
│                                                                             │
│   State 1    State 2    State 3    State 4    State 5    State 6           │
│   ───────    ───────    ───────    ───────    ───────    ───────           │
│   ________→  ________→  ________→  ________→  ________→  ________          │
│                                                                             │
│   Reference (Studio video project):                                         │
│   idea → researching → scripting → producing → published → evergreen       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## VII. TAGS AND CATEGORIES — How Documents Are Classified

### A. Tag Categories

**What dimensions do users classify documents on?**

| Prefix | Name | Values (predefined or freeform) |
|--------|------|--------------------------------|
| ____: | __________ | □ predefined: __________ / □ freeform |
| ____: | __________ | □ predefined: __________ / □ freeform |
| ____: | __________ | □ predefined: __________ / □ freeform |
| ____: | __________ | □ predefined: __________ / □ freeform |

**Validation questions:**
- [ ] Would users actually USE this tag?
- [ ] Does it help FIND documents later?
- [ ] Is it distinct from other classification (type, status)?

---

## VIII. VALIDATION CHECKLIST

### Final Checks

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DOMAIN DESIGN VALIDATION                               │
│                                                                             │
│   COMPLETENESS                                                              │
│   □ At least 1 output document type defined                                │
│   □ At least 1 output channel defined                                      │
│   □ At least 2 input document types defined                                │
│   □ Transformation chain is clear (input → output)                         │
│   □ At least 1 command per intent category                                 │
│   □ At least 3 views defined                                               │
│   □ Document status progression defined                                    │
│                                                                             │
│   COHERENCE                                                                 │
│   □ Output types are what users would EXPORT                               │
│   □ Input types are what users would CAPTURE                               │
│   □ Commands connect inputs to outputs                                     │
│   □ Views optimize for command workflows                                   │
│   □ Container (if any) matches natural work unit                          │
│                                                                             │
│   DISTINCTIVENESS                                                           │
│   □ Domain is NOT just Etymon with renamed types                           │
│   □ At least 2 document types differ from Etymon                          │
│   □ At least 2 commands are domain-specific                               │
│   □ Workflow is genuinely different from Etymon                           │
│                                                                             │
│   FEASIBILITY                                                               │
│   □ Commands can be implemented with current LLM capabilities              │
│   □ Views can be built with current loomlib architecture                   │
│   □ No external integrations required for MVP                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## IX. Example: Studio Domain Audit (Completed)

### I. OUTPUTS

**Terminal question:**
```
Users of this domain ultimately produce VIDEO SCRIPTS/CONTENT
that go to YOUTUBE, SUBSTACK, PODCAST PLATFORMS
for the purpose of BUILDING AN AUDIENCE AND BRAND.
```

**Output channels:**

| Channel | What goes there | How often | Success metric |
|---------|-----------------|-----------|----------------|
| YouTube | Video scripts → videos | Weekly | Views, subs |
| Substack | Written essays | Weekly | Subscribers |
| Podcast | Audio scripts | Weekly | Downloads |

**Output document types:**

| Type | Icon | Example | Typical length |
|------|------|---------|----------------|
| script | 📝 | Video script | 2000-5000 words |
| research | 🔍 | Topic synthesis | 500-2000 words |

### II. INPUTS

**Source question:**
```
To produce VIDEO SCRIPTS, users need to capture IDEAS, SOURCES, CLIPS
from EVERYWHERE (books, videos, conversations, shower thoughts)
which they encounter while CONSUMING MEDIA AND LIVING LIFE.
```

**Input document types:**

| Type | Icon | Source | Capture friction |
|------|------|--------|------------------|
| idea | 💡 | Anywhere | Must be LOW |
| source | 📚 | Books, articles, videos | Medium |
| asset | 🎬 | Video clips, images | Medium |

**Capture moment:**
```
User is doing WATCHING A VIDEO
when they encounter A TOPIC THAT WOULD MAKE A GOOD VIDEO
and need to capture it within 10 SECONDS
or they'll lose it because THEY'LL FORGET THE SPARK.
```

### III. METHODS

**Transformation chain:**
```
idea → source collection → research synthesis → outline → script → video
```

**Command coverage:**

| INTENT | COMMAND | PRODUCES | AUTOMATED |
|--------|---------|----------|-----------|
| CAPTURE | /capture-idea | idea | yes |
| CAPTURE | /add-source | source | yes |
| RESEARCH | /summarize | research | yes |
| RESEARCH | /research-topic | research | yes |
| BUILD | (manual) | template | no |
| ORGANIZE | /create-project | project | yes |
| PRODUCE | /draft-script | script | yes |
| PRODUCE | /outline | script | yes |

### IV. CONTAINERS

**Project unit:**
```
A user works on one VIDEO PROJECT at a time,
which contains 10-50 documents
and takes 1-4 WEEKS to complete.
```

**Container necessity test:** 5/5 yes → Container is ESSENTIAL

**Container design:**

| Property | Value |
|----------|-------|
| Name | Project |
| Icon | 🎥 |
| Contains | ideas, sources, research, scripts, assets |
| Status progression | idea → researching → scripting → producing → published |
| Typical lifespan | 1-4 weeks |
| Success state | published |

### V. VIEWS

**Primary workflow:**
```
User opens the app wanting to MAKE PROGRESS ON VIDEOS.
They first CHECK THE PIPELINE TO SEE WHAT'S IN PROGRESS,
then OPEN A PROJECT TO WORK ON,
and finish by WRITING OR EDITING SCRIPT.
This takes about 1-2 HOURS.
```

**View specifications:**

| View | Name | Icon | Primary intent | Primary data | Primary action |
|------|------|------|----------------|--------------|----------------|
| 1 | Pipeline | ◫ | PRODUCE | All projects | Drag to change status |
| 2 | Project | ◧ | ORGANIZE | Project docs | Add/remove docs |
| 3 | Ideas | 💡 | CAPTURE | Unattached ideas | Capture, attach |
| 4 | Sources | 📚 | CAPTURE/RESEARCH | All sources | Browse, search |
| 5 | Editor | ✎ | PRODUCE | Single doc | Write |

**Default view:** Pipeline (because "check status" is first workflow step)

---

## X. Composition

**What informed this:**
- `fw-domain-command-architecture` — how commands shape views
- `fw-loomlib-domains` — the variant/invariant structure
- `fw-invariants-variants` — the method for system analysis

**What this enables:**
- Rigorous validation of new domain designs
- Consistent thinking across different domains
- Identification of gaps before implementation
- Clear documentation of domain decisions

**How to use:**
1. Copy Section VIII checklist
2. Work through Sections I-VII in order
3. Fill in all blanks
4. Validate against checklist
5. Iterate until all checks pass
