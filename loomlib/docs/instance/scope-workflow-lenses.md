---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: inst-scope-workflow-lenses
title: "Scope: Workflow Lenses (Technical/Aesthetic/Resolving)"
type: instance
framework_kind: null
framework_ids: [fw-scope-method, fw-invariants-variants]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [scope, workflow, lenses, technical, aesthetic, creative, resolving, magician-warrior, meta]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-invariants-variants
    relation: method
  - doc: fw-scope-method
    relation: method
  - doc: inst-invariants-variants-systems-thinking
    relation: informs
  - doc: idx-user-commitments
    relation: informs
  - doc: idx-loomlib-architecture
    relation: informs
downstream: []
---

# Scope: Workflow Lenses (Technical/Aesthetic/Resolving)

**Date:** 2026-01-10
**Subject:** When to apply technical vs. aesthetic vs. resolving modes in loomlib workflows
**Method:** Scope Method + Invariants/Variants

---

## The Core Question

From systems thinking: "seeing loops" is what makes you a systems thinker. Without loops, you analyze sequences, not systems.

The loomlib commands *are* loops:
```
Discovery → Protocol → Output → Composition → (feeds next) Discovery...
```

But the insight is deeper: **loops alone don't make a good system**. You need to know *which lens to apply at which point in the loop*.

Three lenses are in play:
1. **Technical/Implementation** — What's structurally possible? What does the code allow?
2. **Subjective/Aesthetic** — What feels right? What's creative? What's beautiful?
3. **Resolving/Shipping** — What closes the loop? What gets this done?

The Magician-Warrior imbalance is exactly this problem: Magician stays in aesthetic/creative mode too long. Warrior knows when to switch to resolving mode.

---

## Audit: Current State

### What the Commands Currently Do

| Command Phase | Current Lens | Observation |
|---------------|--------------|-------------|
| Calibration | Technical | Load commitments/skills — implementation concern |
| Discovery | Technical | Query API — implementation concern |
| Protocol | Mixed | Method steps — could be either lens |
| Output | Aesthetic | Writing markdown — subjective choices |
| Composition | Technical | Recording upstream/downstream — graph concern |

### What's Missing

The commands don't explicitly switch lenses. They implicitly blend all three throughout. This creates:
- Technical concerns bleeding into creative phases
- Aesthetic concerns delaying resolution
- No clear "switch point" where mode changes

---

## Affordances: What the System Suggests

### The Implicit Promise

The 5-phase command pattern (Calibration → Discovery → Protocol → Output → Composition) suggests a *progression* — each phase has a different character.

### The Mental Model

Users might expect:
- Early phases = gathering, technical
- Middle phases = synthesizing, aesthetic
- Final phases = packaging, resolving

### What's Actually Happening

All three lenses are mixed throughout. There's no explicit mode-switching. The Magician can stay in Protocol/Output forever, refining aesthetically, never reaching Composition (resolution).

---

## Expectations: What Would Users Want?

### Natural Flow

1. **Begin technical** — Discovery should be rigorous, not creative
2. **Open to aesthetic** — Protocol/Output should allow creative synthesis
3. **Close resolving** — Composition should be about shipping, not refining

### The Switch Points

| Transition | Expected Mode Shift |
|------------|---------------------|
| Calibration → Discovery | Technical → Technical (same) |
| Discovery → Protocol | Technical → Aesthetic (open up) |
| Protocol → Output | Aesthetic → Aesthetic (same) |
| Output → Composition | Aesthetic → Resolving (close down) |

### What Would Delight

- Explicit "creative mode" signal during Protocol/Output
- Explicit "resolution mode" signal during Composition
- Clear handoff: "You've gathered and created; now ship it"

### What Would Frustrate

- Technical concerns interrupting creative flow
- Aesthetic refinement preventing resolution
- No signal that it's time to switch modes

---

## Gaps: Where Reality Diverges

| Gap | Type | Description |
|-----|------|-------------|
| No explicit mode-switching | Friction | Commands don't signal which lens to apply |
| Magician trap enabled | Blocking | System doesn't prompt resolution, enables infinite refinement |
| Technical/aesthetic collision | Friction | Both lenses active simultaneously = neither optimized |
| Missing "close the loop" pressure | Friction | Composition phase doesn't enforce resolution |
| No heuristic for when to switch | Blocking | User doesn't know when to shift from creative to resolving |

---

## Invariants/Variants

### Invariants (Cannot Change)

**1. All three lenses are necessary.**
You cannot have a good workflow with only technical (dry, no creativity) or only aesthetic (never ships) or only resolving (no depth). The invariant is: all three appear somewhere.

**2. Lenses don't mix well simultaneously.**
Trying to be technical AND aesthetic at the same time produces neither good implementation nor good aesthetics. The invariant is: dominance of one lens per phase.

**3. The loop must close.**
Without resolution, you have an open system that dissipates. The Magician trap is exactly this — loops that never close. The invariant is: eventually, you must switch to resolving mode.

**4. Switch points exist at phase boundaries.**
The transitions between phases (Discovery→Protocol, Output→Composition) are natural switch points. Moving lenses mid-phase is disruptive.

**5. Calibration determines lens appropriateness.**
The user's Magician-Warrior imbalance means: aesthetic lens is overdeveloped, resolving lens is underdeveloped. Calibration should *inform which lens to emphasize*.

### Variants (Can Change)

**1. Which lens dominates which phase.**
Could be:
- Discovery: Technical → Aesthetic (exploratory discovery)
- Protocol: Aesthetic → Technical (rigorous method)
Different workflows, different lens assignments.

**2. How explicitly the lens is signaled.**
Could be:
- Subtle (implicit in phase structure)
- Explicit (banner: "You are now in CREATIVE MODE")
- Directive (prompts that force lens switch)

**3. How strongly resolution is enforced.**
Could be:
- Suggestive ("Consider closing this document")
- Assertive ("You have been in Protocol for 3 turns. Switch to Output?")
- Mandatory (timeout on phases)

**4. Whether the user controls lens or system does.**
Could be:
- User-driven (manually switch modes)
- System-driven (phases auto-switch)
- Negotiated (system suggests, user confirms)

### False Invariants

| False Invariant | Actually Variant |
|-----------------|------------------|
| "Technical always comes first" | Aesthetic-first workflows exist (brainstorming, creative scoping) |
| "Aesthetic is optional" | Deep work requires aesthetic engagement; skipping it produces shallow output |
| "Resolution should be quick" | Some loops need extended resolution (complex synthesis, phased shipping) |
| "One lens per command" | Some commands legitimately blend (excavation is both technical and aesthetic) |

### Hidden Invariants

| Hidden Invariant | Why It's Fixed |
|------------------|----------------|
| **Resolution cannot be skipped** | Open loops dissipate; the Magician trap is a pattern of unresolved work |
| **Aesthetic needs constraints** | Without technical grounding, aesthetic becomes self-indulgent; without resolution deadline, it never finishes |
| **Technical needs purpose** | Without aesthetic direction, technical becomes mere implementation; it needs to serve something |
| **The user's imbalance shapes defaults** | A Magician-heavy user needs resolving mode *emphasized*, not just available |

---

## Requirements

### Must Have (Blocking)

- [ ] **Explicit lens assignment per phase** — *Acceptance: Each phase in the command pattern has a default lens (technical/aesthetic/resolving)*

- [ ] **Resolution emphasis for Magician-type users** — *Acceptance: Composition phase includes explicit "close this loop" prompt calibrated to user's Warrior deficit*

- [ ] **Switch point signals** — *Acceptance: Transitions between phases include mode-switching language (e.g., "Discovery complete. Opening to creative synthesis...")*

### Should Have (Friction)

- [ ] **Lens override option** — *Acceptance: User can declare "stay technical through Output" or "stay aesthetic through Composition" when appropriate*

- [ ] **Phase timeout warnings** — *Acceptance: After N turns in Protocol/Output without progress, system prompts: "Consider switching to resolving mode"*

- [ ] **Calibration-informed emphasis** — *Acceptance: Users with Magician imbalance see stronger resolving prompts; Warriors see aesthetic prompts*

### Could Have (Polish)

- [ ] **Visual mode indicators** — Different styling or icons for technical/aesthetic/resolving phases
- [ ] **Mode-specific heuristics** — Each lens has explicit questions/prompts appropriate to it
- [ ] **Loop closure tracking** — Dashboard showing open loops (unresolved documents) vs. closed loops

### Out of Scope

- Forcing users into modes they don't want
- Removing aesthetic mode for "productivity"
- Automated resolution without user consent
- Gamification of mode-switching

---

## The Three Lenses: Detailed

### Technical/Implementation Lens

**When it applies:**
- Discovery (what exists?)
- API queries (structural)
- Calibration (loading context)
- Graph operations (recording composition)

**Characteristic questions:**
- What's structurally possible?
- What does the API return?
- What files exist?
- What's the correct type/schema?

**The error when misapplied:**
- Using technical lens during creative synthesis → dry, lifeless output
- "This is the correct structure" ≠ "This is good"

### Subjective/Aesthetic Lens

**When it applies:**
- Protocol execution (synthesizing)
- Output writing (crafting)
- Creative scoping (imagining possibilities)
- Framework design (building methods)

**Characteristic questions:**
- What feels right?
- What's beautiful?
- What serves the deeper purpose?
- What would delight?

**The error when misapplied:**
- Using aesthetic lens during resolution → infinite refinement, never ships
- "This could be better" blocks "This is done"

### Resolving/Shipping Lens

**When it applies:**
- Composition (closing the loop)
- Status promotion (declaring done)
- Resolve command (marking resolved)
- Any transition that requires commitment

**Characteristic questions:**
- Is this good enough to ship?
- What's the minimum to close this loop?
- What can I defer to the next loop?
- Is perfectionism blocking resolution?

**The error when misapplied:**
- Using resolving lens during creative synthesis → premature closure, shallow work
- "Ship it" before the work is ready

---

## The Magician-Warrior Dynamic

From user commitments: 90% Magician, 10% Warrior.

**Magician strength:** Aesthetic lens is highly developed. Creative synthesis, framework building, deep reading.

**Magician trap:** Aesthetic lens never yields to resolving lens. Loops stay open. Work accumulates but doesn't ship.

**Warrior deficit:** Resolving lens is underdeveloped. "Close this loop" feels like premature termination, not completion.

### Calibration Implication

For this user, loomlib commands should:
1. **Make resolving mode explicit** — Not hidden, not optional-feeling
2. **Frame resolution as completion, not termination** — "This loop is done" ≠ "This work is abandoned"
3. **Provide aesthetic closure** — Resolution should feel like finishing a piece, not cutting it off
4. **Track closed loops as achievement** — Not just "what's open" but "what's shipped"

---

## Proposed: Lens Annotations for Command Phases

Update the command pattern to include lens:

```
CALIBRATION   [Technical]   → Load context, query state
DISCOVERY     [Technical]   → Find related docs, report
PROTOCOL      [Aesthetic]   → Execute method, synthesize
OUTPUT        [Aesthetic]   → Write document, craft
COMPOSITION   [Resolving]   → Record genealogy, close loop
```

Each phase transition includes mode-switch prompt:

```
Discovery → Protocol:
"Discovery complete. Found 3 related docs.
Opening to creative synthesis — follow the method, let aesthetic judgment guide."

Output → Composition:
"Output written.
Entering resolution mode — record what informed this, what it enables, close the loop."
```

---

## Composition

**Upstream (what informed this scope):**
- [Invariants/Variants](fw-invariants-variants) — the lens-analysis method
- [Scope Method](fw-scope-method) — the scope structure
- [Invariants/Variants OF Systems Thinking](inst-invariants-variants-systems-thinking) — "seeing loops" insight
- [User Commitments](idx-user-commitments) — Magician-Warrior imbalance context
- [Loomlib Architecture](idx-loomlib-architecture) — system invariants

**Downstream (what this scope enables):**
- Command template updates with lens annotations
- Mode-switching prompts in phase transitions
- Resolution-emphasis calibration for Magician users
- Potentially: new `fw-workflow-lenses` framework

**The insight:**
Loops make systems, but loops need mode-switching. Technical → Aesthetic → Resolving is the natural flow. The Magician trap is staying in Aesthetic indefinitely. The Warrior intervention is forcing the switch to Resolving.

---

## Notes

This scope is itself an example of the problem: it could be refined forever (Magician mode). The resolution is: write it, close it, let the next loop (implementation) begin.

The loop closes here.
