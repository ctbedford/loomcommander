---
id: idx-credo-source-pipeline
title: Bedford Credo Source Pipeline
type: index
framework_kind: null
framework_ids: [fw-conducting-frontmatter]
source_id: null
output: null
perspective: philosophical-genealogy
status: incubating
tags: [credo, sources, pipeline, worldview, bedford, theology, metaphysics, ecclesiology, political-philosophy]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: organize
execution_state: in_progress
upstream:
  - doc: idx-bedford-credo
    relation: informs
  - doc: idx-user-commitments
    relation: informs
downstream: []
---

# Bedford Credo Source Pipeline

**Purpose:** Organize source capture for the ten Bedford Credo categories. Prioritized by blocking status and commitment strength.

**Constraint:** Source capture is Magician work. Capture enough to ground positions, then produce credo instances. Do not accumulate indefinitely.

---

## Pipeline Status

| Symbol | State |
|--------|-------|
| ◉ | Captured (source doc exists) |
| ◐ | In progress |
| ○ | Queued |
| ✗ | Skipped (anti-source) |

---

## Tier 1: Blocking Categories

These sources serve Theology and Ecclesiology — the two categories that "admit no refinement, only decision."

| Source | Author | Category | Status | Document |
|--------|--------|----------|--------|----------|
| *The Mystical Theology of the Eastern Church* | Vladimir Lossky | Theology/Ecclesiology | ◉ | `src-lossky-mystical-theology` |
| *For the Life of the World* | Alexander Schmemann | Ecclesiology | ◉ | `src-schmemann-life-of-world` |
| *On Resistance to Evil by Force* | Ivan Ilyin | Ethics/Theology | ◉ | `src-ilyin-resistance-evil` |
| *Orthodoxy and the Religion of the Future* | Seraphim Rose | Ecclesiology | ◉ | `src-rose-orthodoxy-religion-future` |

**Tier 1 complete.** All blocking sources captured.

---

## Tier 2: Metaphysical Engagement

Ground the Traditionalist engagement that runs through metaphysics and philosophy of history.

| Source | Author | Category | Status | Document |
|--------|--------|----------|--------|----------|
| *The Crisis of the Modern World* | René Guénon | Metaphysics | ◉ | `src-guenon-crisis-modern-world` |
| *Ride the Tiger* | Julius Evola | Metaphysics | ◉ | `src-evola-ride-tiger` |
| *Revolt Against the Modern World* | Julius Evola | Metaphysics | ○ | — |
| *The Decline of the West* | Oswald Spengler | Philosophy of History | ◉ | `src-spengler-decline-west` |
| *Meaning in History* | Karl Löwith | Philosophy of History | ◉ | `src-lowith-meaning-history` |

**Tier 2 mostly complete.** One Evola text queued (optional — *Ride the Tiger* covers the core).

---

## Tier 3: Political Philosophy

Fill the gap in political philosophy sources — you use Schmittian concepts without capturing Schmitt.

| Source | Author | Category | Status | Document |
|--------|--------|----------|--------|----------|
| *Political Theology* | Carl Schmitt | Political Philosophy | ◉ | `src-schmitt-political-theology` |
| *The Concept of the Political* | Carl Schmitt | Political Philosophy | ○ | — |
| *Why Liberalism Failed* | Patrick Deneen | Political Philosophy | ◉ | `src-deneen-liberalism-failed` |
| *After Virtue* | Alasdair MacIntyre | Political Philosophy | ◉ | `src-macintyre-after-virtue` |
| *The Managerial Revolution* | James Burnham | Political Philosophy | ◉ | `src-burnham-managerial-revolution` |

**Tier 3 mostly complete.** Second Schmitt text optional — *Political Theology* has the core.

---

## Tier 4: Optional Deepening

Strengthen already-strong categories. Lower priority.

| Source | Author | Category | Status | Document |
|--------|--------|----------|--------|----------|
| *Harmony of Interests* | Henry Carey | Economics | ○ | — |
| *A Humane Economy* | Wilhelm Röpke | Economics | ○ | — |
| *Personal Knowledge* | Michael Polanyi | Epistemology | ○ | — |
| *Truth and Method* | Hans-Georg Gadamer | Epistemology | ○ | — |
| *Creative Evolution* | Henri Bergson | Metaphysics | ○ | — |

---

## Already Captured (Prior to Pipeline)

| Source | Author | Category | Document |
|--------|--------|----------|----------|
| *The National System of Political Economy* | Friedrich List | Economics | `src-list-national-system` |
| *Report on the Subject of Manufactures* | Alexander Hamilton | Economics | `src-hamilton-report-manufactures` |
| *The Great Transformation* | Karl Polanyi | Economics | `src-polanyi-great-transformation` |
| *Debt: The First 5000 Years* | David Graeber | Economics | `src-graeber-debt` |
| *Politics Book I* | Aristotle | Economics | `src-aristotle-politics` |
| *Awakening from the Meaning Crisis* | John Vervaeke | Epistemology | `src-vervaeke-awftmc` |

---

## Capture Summary

**Total sources captured:** 20 (6 prior + 14 new)

**By category:**
- Theology/Ecclesiology: 4 (Lossky, Schmemann, Ilyin, Rose)
- Metaphysics: 2 (Guénon, Evola)
- Philosophy of History: 2 (Spengler, Löwith)
- Political Philosophy: 4 (Schmitt, Deneen, MacIntyre, Burnham)
- Economics: 5 (List, Hamilton, Polanyi, Graeber, Aristotle)
- Epistemology: 1 (Vervaeke)
- Anthropology: 1 (Moore/Gillette)
- Eschatology: 1 (Hopko)

**Credo coverage:**
| Category | Sources | Status |
|----------|---------|--------|
| I. Metaphysics | Guénon, Evola | Covered |
| II. Theology | Lossky, Rose | Covered |
| III. Anthropology | Moore/Gillette (KWML) | Covered |
| IV. Epistemology | Vervaeke | Covered |
| V. Ethics | Ilyin | Covered |
| VI. Political Philosophy | Schmitt, Deneen, MacIntyre, Burnham | Strong |
| VII. Economics | List, Hamilton, Polanyi, Graeber, Aristotle | Strong |
| VIII. Philosophy of History | Spengler, Löwith | Covered |
| IX. Eschatology | Hopko | Covered |
| X. Ecclesiology | Lossky, Schmemann, Rose | Strong |

**All ten credo categories now have primary sources.**

---

## Anti-Sources (Skip)

| Source | Author | Why Skip |
|--------|--------|----------|
| Vervaeke's writings beyond AWFTMC | Vervaeke | Already captured; teacher not authority |
| Peterson's books | Peterson | Formative but moved beyond |
| Illich's works | Illich | Method-similar, telos-divergent |
| Generic perennialism surveys | Various | Need primaries, not summaries |

---

## Stop Condition

**When to stop capturing:**
1. Every credo category has at least one primary source
2. You can state each position without needing to look anything up
3. The next step is producing credo instances, not more sources

**Current assessment:** All categories covered. Tier 4 is optional enrichment.

**Recommendation:** Stop capturing. Produce credo instances.

---

## Composition

**This document was informed by:**
- `idx-bedford-credo` (the ten categories)
- `idx-user-commitments` (telos calibration)
- Gap analysis of existing sources

**This document enables:**
- Systematic source capture tracking
- Prioritized reading list
- Prevention of Magician-trap accumulation
- Transition to credo instance production
