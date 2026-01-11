---
description: Document a Claude Code failure mode with symptoms, causes, and fixes
argument-hint: [failure-name] - e.g., "context-contamination", "iteration-cliff", "premature-execution"
allowed-tools: Read, Grep, WebSearch
---

# Meta: Failure Mode $ARGUMENTS

You are documenting a **failure mode** — a pattern of Claude Code failing and how to fix it.

---

## The Core Failure Modes

From Claude Code best practices, these are the canonical failure modes:

### 1. Premature Execution

**Symptom:** Claude starts coding before understanding the problem
**Cause:** No explicit "don't write yet" staging
**Fix:** Survey → Plan → Implement phases

### 2. Context Contamination

**Symptom:** Claude drags assumptions from unrelated previous work
**Cause:** Not clearing context between tasks
**Fix:** `/clear` between unrelated tasks

### 3. The 20-Iteration Cliff

**Symptom:** Claude repeats itself, ignores instructions, hallucinates
**Cause:** Too many turns without reset
**Fix:** Treat 15-20 turns as hard limit; decompose or reset

### 4. CLAUDE.md Bloat

**Symptom:** Claude follows irrelevant instructions, performance degrades
**Cause:** Stuffing CLAUDE.md with everything
**Fix:** Keep under 50 lines, no style guides

### 5. One-Shot Syndrome

**Symptom:** Expecting complex tasks to work first try
**Cause:** Not building in verification loops
**Fix:** Treat outputs as drafts, iterate with feedback

### 6. Over-Specification

**Symptom:** Wasted effort, anchoring to suboptimal approach
**Cause:** 500-word prompts specifying implementation details
**Fix:** Specify what, be loose on how

### 7. Permission Friction

**Symptom:** Claude waits for approval, breaking flow
**Cause:** Default permissions, not configured allowlist
**Fix:** Configure allowlist or `--dangerously-skip-permissions`

### 8. Ignoring Terminal Output

**Symptom:** Claude struggles with errors it could read
**Cause:** User not monitoring output
**Fix:** Read terminal output, help Claude understand

### 9. Not Using Subagents

**Symptom:** Context polluted with exploration dead ends
**Cause:** Research in main context
**Fix:** "Use a subagent to research X"

---

## Protocol

### 1. Identify the Failure Mode

Parse "$ARGUMENTS" to match a known failure or describe a new one:

| Pattern | Common Names |
|---------|--------------|
| premature-execution | "codes too fast", "doesn't understand first" |
| context-contamination | "remembers wrong stuff", "confused context" |
| iteration-cliff | "degrades after 20 turns", "repeats itself" |
| claudemd-bloat | "follows irrelevant instructions" |
| one-shot-syndrome | "fails on first try", "no iteration" |
| over-specification | "too detailed prompt" |
| permission-friction | "keeps asking permission" |
| ignoring-output | "doesn't read errors" |
| no-subagents | "polluted context" |

### 2. Document the Failure

For each failure mode, capture:

| Field | Description |
|-------|-------------|
| **Name** | Short identifier |
| **Category** | Context, execution, configuration, workflow |
| **Symptoms** | How you know this is happening |
| **Root Cause** | Why it happens |
| **Fix** | How to prevent or recover |
| **Detection** | How to catch it early |
| **Example** | Concrete scenario |

### 3. Link to Prevention

Connect to patterns and workflows that prevent this failure.

---

## Output

Write to: `loomlib/docs/meta/failure-mode/fail-{slug}.md`

```markdown
---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: fail-{slug}
title: "Failure Mode: {Name}"
type: failure-mode
domain: meta
status: draft
tags: [failure-mode, {category}]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream: []
downstream: []

# ─── FAILURE-SPECIFIC ────────────────────────────────────────
category: context|execution|configuration|workflow
severity: high|medium|low
detection_difficulty: easy|medium|hard
recovery_difficulty: easy|medium|hard
---

# Failure Mode: {Name}

**Category:** {context / execution / configuration / workflow}
**Severity:** {high / medium / low}

---

## Summary

{One-paragraph description of what goes wrong}

---

## Symptoms

How you know this is happening:

1. {Observable symptom 1}
2. {Observable symptom 2}
3. {Observable symptom 3}

---

## Root Cause

Why this happens:

{Explanation of the underlying mechanism}

---

## Example Scenario

### The Setup

{What the user was trying to do}

### What Went Wrong

{How the failure manifested}

### What Should Have Happened

{The correct behavior}

---

## Detection

### Early Warning Signs

- {Sign 1}
- {Sign 2}

### Automated Detection

```bash
# Commands or patterns that detect this
```

---

## Prevention

### Workflow Changes

{What to do differently}

### Configuration

```{language}
{Settings that prevent this}
```

### Related Patterns

- [pat-{related}](pat-{related}) — prevents this by {how}

---

## Recovery

### Immediate Steps

1. {First thing to do}
2. {Second thing}

### Reset Strategy

{How to get back to a good state}

---

## Related Failure Modes

| Failure | Relationship |
|---------|--------------|
| [fail-{related}](fail-{related}) | {how related} |

---

## Promotion Criteria

To reach **stable** status:
- [ ] Symptoms clearly described
- [ ] Root cause understood
- [ ] Prevention documented
- [ ] Recovery tested
- [ ] Example is realistic

---

## Composition

**Upstream:**
- Claude Code documentation
- User experience

**Downstream:**
- Informs prevention patterns
- Informs workflow design
```

---

## Failure Categories

### Context Failures

Problems with the information Claude is reasoning over:
- Context contamination
- CLAUDE.md bloat
- MCP overload
- Irrelevant history

### Execution Failures

Problems with how Claude executes tasks:
- Premature execution
- One-shot syndrome
- Iteration cliff
- Ignoring output

### Configuration Failures

Problems with setup:
- Permission friction
- Missing tools
- Wrong domain
- Incorrect paths

### Workflow Failures

Problems with the process:
- No staging phases
- No verification loop
- No checkpoints
- Over-specification

---

Now document failure mode: $ARGUMENTS
