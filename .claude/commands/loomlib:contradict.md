---
description: Find documents that might contradict or tension with target
argument-hint: <doc-id>
---

# Contradict: $ARGUMENTS

Find documents that might contradict, tension with, or oppose the target — surfaces productive conflict and prevents echo chamber composition.

## The Contradiction Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTRADICT                               │
│                                                             │
│   [target document]                                         │
│        ↓                                                    │
│   [extract claims, vocabulary, conclusions]                │
│        ↓                                                    │
│   [search for opposing content]                            │
│        ↓                                                    │
│   ┌──────────────────────────────────────┐                │
│   │  POTENTIAL TENSIONS                   │                │
│   │  - contradictory claims              │                │
│   │  - opposing vocabulary               │                │
│   │  - incompatible frameworks           │                │
│   │  - VERSUS relationships              │                │
│   └──────────────────────────────────────┘                │
│        ↓                                                    │
│   [productive conflict or genuine error?]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Types of Contradiction

| Type | Description | Value |
|------|-------------|-------|
| **Claim opposition** | Doc A asserts X, Doc B asserts not-X | High — needs resolution |
| **Framework conflict** | Incompatible methods applied to same topic | Medium — may be complementary |
| **Vocabulary tension** | Same term, different definitions | Medium — clarification needed |
| **Conclusion divergence** | Same premises, different conclusions | High — logic error or missing context |
| **Perspective clash** | Different lenses on same phenomenon | Low — often productive |

## Discovery

### 1. Load Target Document

```bash
curl -s http://localhost:5173/api/docs | jq '.[] | select(.id == "$ARGUMENTS")'
```

### 2. Extract Claims and Vocabulary

Parse target for:
- Key assertions/claims
- Defined terms
- Conclusions
- Recovery claims (for excavations)
- Findings (for surveys)

### 3. Search for Opposition

Look for documents that:
- Use negating language about target's claims
- Define same terms differently
- Reach different conclusions about same topic
- Apply conflicting frameworks

---

## Protocol

### 1. Extract Target Content

**For Excavations:**
- Original meaning claimed
- Drift described
- Recovery proposed
- Key vocabulary

**For Surveys:**
- Findings stated
- Architecture described
- Dependencies claimed

**For Instances:**
- Core thesis
- Operator relationship
- Framework application

**For Frameworks:**
- Method steps
- Applicable domains
- Expected outcomes

### 2. Search for Contradictions

#### Vocabulary Conflicts
```bash
# Find documents using same key terms
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.content | test("term"; "i"))]'
```

Compare definitions/usage.

#### Claim Opposition
Search for documents that:
- Discuss same topic
- Make different claims
- Use opposing language (not X, against, contrary, however)

#### Framework Conflicts
```bash
# Find documents on same topic using different frameworks
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.title | test("topic")) | select(.framework_ids != ["target-fw"])]'
```

#### Existing VERSUS Relationships
```bash
# Check if target is already in a VERSUS instance
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.title | test("versus"; "i"))]'
```

### 3. Assess Tensions

For each potential contradiction:

| Question | Assessment |
|----------|------------|
| Is this genuine opposition? | Yes/No/Unclear |
| Is one simply wrong? | Possible/Unlikely |
| Is this productive tension? | Could enable VERSUS instance |
| What would resolution require? | More research/Synthesis/Accept plurality |

### 4. Recommend Actions

- Investigate further
- Create VERSUS instance
- Synthesize to resolve
- Accept as productive plurality

---

## Output Format

**Do not write a file.** Output directly to conversation.

```markdown
# Contradictions for: {Target Title}

**Target:** [{title}]({id})
**Type:** {type}
**Key claims extracted:** {n}

---

## Target Summary

### Core Claims
1. {claim-1}
2. {claim-2}
3. {claim-3}

### Key Vocabulary
- **{term-1}:** {definition as used in target}
- **{term-2}:** {definition as used in target}

### Conclusions
- {conclusion-1}
- {conclusion-2}

---

## Potential Contradictions Found

### High Tension ⚡⚡⚡

#### {Doc Title} vs Target

**Document:** [{title}]({id})
**Tension type:** {claim opposition / vocabulary conflict / etc.}

| Target Claims | Contradicting Claims |
|---------------|---------------------|
| {claim} | {opposing claim} |

**Analysis:**
- Is this genuine opposition? {Yes/No/Unclear}
- Is one wrong? {Assessment}
- Productive tension? {Yes — could create VERSUS instance}

**Recommended action:** {Investigate / Create VERSUS / Synthesize}

---

### Medium Tension ⚡⚡

#### {Doc Title} vs Target

**Document:** [{title}]({id})
**Tension type:** {type}

{Similar analysis...}

---

### Low Tension ⚡

*Different perspectives, not true contradictions*

| Document | Tension | Assessment |
|----------|---------|------------|
| [{title}]({id}) | {description} | Productive plurality |

---

## Vocabulary Conflicts

*Same terms used differently*

| Term | Target Definition | Other Definition | In Document |
|------|-------------------|------------------|-------------|
| {term} | {def} | {def} | [{doc}]({id}) |

---

## No Contradictions Found For

*Claims that went unchallenged*

- {claim-1} — No opposing documents found
- {claim-2} — Universally accepted in graph

**Consider:** Are these claims well-established or just unchallenged?

---

## VERSUS Opportunities

*Productive tensions that could become instances*

| Target Concept | Opposing Concept | Document | Suggested Title |
|----------------|------------------|----------|-----------------|
| {concept} | {counter} | [{doc}]({id}) | {X} VERSUS {Y} |

```
/loomlib:instance {concept} VERSUS {counter-concept}
```

---

## Echo Chamber Risk

**Assessment:** {Low / Medium / High}

**Indicators:**
- [ ] Target's claims widely reinforced, never challenged
- [ ] Same frameworks applied across related docs
- [ ] No VERSUS instances in this topic area
- [ ] All documents share same perspective

**If high risk:** Actively seek external sources that challenge assumptions.

---

## Recommended Actions

1. **Investigate:** {specific tension to explore}
2. **Create VERSUS:** `/loomlib:instance {X} VERSUS {Y}`
3. **Synthesize:** `/loomlib:synthesize {target} + {contradicting-doc}`
4. **Add source:** Find external source challenging {claim}
```

---

## Why This Matters

### Productive Conflict

Good knowledge graphs have tension:
- VERSUS instances make opposition explicit
- Contradictions force precision
- Plurality prevents dogmatism

### Echo Chamber Prevention

Warning signs:
- Every document reinforces the others
- No VERSUS instances
- Same frameworks everywhere
- Single perspective dominates

This command surfaces where the graph might be too agreeable.

---

## Examples

```
/loomlib:contradict inst-excavate-feedback
→ Find documents that might challenge the FEEDBACK excavation

/loomlib:contradict fw-etymon-method
→ Find frameworks that conflict with Etymon Method

/loomlib:contradict inst-survey-ai-orchestration-evaluation
→ Find documents that challenge the evaluation's conclusions
```

---

Now find contradictions for: $ARGUMENTS
