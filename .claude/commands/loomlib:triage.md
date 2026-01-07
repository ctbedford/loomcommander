---
description: Classify material for loomlib - determine document type and routing
argument-hint: [content or description to classify]
---

# Triage: $ARGUMENTS

Classify incoming material to determine the appropriate document type and routing.

## Triage Questions

Answer these in order:

### 1. Is this a way of seeing, or content seen through a way of seeing?

**Way of seeing** → framework
**Content seen** → instance, note, or source

### 2. If it's a way of seeing: Is it operative or contextual?

**Operative** (you *do* it, it has steps) → toolkit framework
**Contextual** (you *see through* it, it provides distinctions) → domain framework

### 3. If it's content: Is it yours or someone else's?

**Someone else's** (external text, reference) → source
**Yours** (your thinking, observation, production) → instance or note

### 4. If it's yours: Is a framework already applied?

**Yes** (structured by Etymon Method, etc.) → instance
**No** (raw, pre-framework) → note

### 5. If it's an instance: What's the formula?

Which frameworks produced this?
- Primary toolkit: {Etymon Method, Diagnostic Frames, etc.}
- Domain lens: {Oikonomia, Agonal Identity, etc.}

### 6. What's the operator? (for instances)

How do the terms relate?
- AS, FROM, VERSUS, WITHIN, WITHOUT, BEFORE, THROUGH, OF, FOR, TO, AGAINST, BEHIND, AND, OR

### 7. What's the output channel?

Where does this go when captured?
- **etymon** — YouTube video content
- **loomcommander** — tools, documentation, code
- **null** — internal only, no public output

### 8. What's the perspective?

Which curriculum track?
- **philosophical-genealogy** — Vervaeke, meaning, participation
- **linguistic-recovery** — philology, etymology, semantic drift
- **economic-genealogy** — oikonomia, accounting, finance
- **legal-grammar** — contracts, entities, operative structure

### 9. What's the status?

- **incubating** — early, needs sources or development
- **draft** — shaped but unverified
- **verified** — survived pressure
- **captured** — exported to vessel

## Output

Produce a classification report:

```markdown
## Triage Report: {brief title}

**Input:** {what was triaged}

### Classification

| Field | Value |
|-------|-------|
| Type | {framework/instance/note/source/index} |
| Subtype | {toolkit/domain if framework} |
| Status | {incubating/draft/verified/captured} |
| Operator | {operator if instance} |
| Formula | {frameworks if instance} |
| Channel | {etymon/loomcommander/null} |
| Perspective | {which curriculum track} |

### Suggested ID

`{type}-{slug}`

### Next Action

{What command to run next}

- [ ] `/loomlib/framework {details}` 
- [ ] `/loomlib/instance {details}`
- [ ] `/loomlib/note {details}`
- [ ] `/loomlib/source {details}`
```

## Decision Tree

```
Material
├─ Way of seeing?
│  ├─ Operative → toolkit framework
│  └─ Contextual → domain framework
└─ Content?
   ├─ External → source
   └─ Internal
      ├─ Structured → instance
      │  ├─ Etymon method → excavation/drift/recovery
      │  └─ Other framework → per framework structure
      └─ Unstructured → note
```

Now triage: $ARGUMENTS
