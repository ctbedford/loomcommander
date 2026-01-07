---
description: Promote a loomlib document through status workflow
argument-hint: [document id or title] to [target status]
---

# Promote: $ARGUMENTS

Move a document through the status workflow: incubating → draft → verified → captured

## Status Definitions

### incubating
- Core insight present
- Structure incomplete
- Sources may be missing
- Not ready for use

**To exit incubating:**
- [ ] Core thesis articulated
- [ ] Required sources identified (listed if missing)
- [ ] Basic structure present

### draft
- Full structure complete
- Content present
- Not yet pressure-tested
- May have gaps or weaknesses

**To exit draft:**
- [ ] All sections complete
- [ ] Sources consulted and cited
- [ ] No known gaps
- [ ] Ready for verification

### verified
- Survived pressure
- Philologically accurate (for instances)
- Structurally sound
- Practically applicable
- Ready for use and publication

**To exit verified:**
- [ ] Exported to vessel
- [ ] Published or stored in final form

### captured
- Final state
- Lives in its vessel
- Document is archival record

## Verification Checklist by Type

### Framework Verification
- [ ] Core distinction is sharp and defensible
- [ ] Application method is clear
- [ ] Produces instances (can point to examples)
- [ ] Boundary conditions explicit
- [ ] No circular definitions

### Instance Verification (Etymon Method)
- [ ] Etymology is accurate and cited
- [ ] Drift is documented with inflection points
- [ ] Recovery is normative (makes a claim)
- [ ] Application is practical (viewer can wield)
- [ ] Operator choice is justified

### Source Verification
- [ ] Actually read (not just skimmed)
- [ ] Key claims extracted
- [ ] Vocabulary documented
- [ ] Connected to frameworks/instances
- [ ] Can unlock incubating content

### Note Verification
Notes don't get "verified" — they get routed:
- Becomes instance
- Becomes source
- Becomes framework
- Gets archived

### Index Verification
- [ ] Contents accurate
- [ ] Links working
- [ ] Gaps identified
- [ ] Navigation useful

## Promotion Report

```markdown
## Promotion: {document title}

**Current Status:** {status}
**Target Status:** {status}

### Checklist

{Appropriate checklist for document type}

### Assessment

**Ready to promote?** {Yes / No}

**If no, what's blocking?**
- {Blocker 1}
- {Blocker 2}

**If yes, changes made:**
- {Change 1}
- {Change 2}

### Updated Status

`status: {new status}`
```

## Demotion

Documents can also move backward:
- verified → draft (if problems found)
- draft → incubating (if sources missing)

This is not failure — it's honesty about the document's actual state.

Now evaluate: $ARGUMENTS
