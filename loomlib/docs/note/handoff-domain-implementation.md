---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: note-handoff-domain-implementation
title: "Handoff: Domain System Implementation"
type: note
framework_kind: null
framework_ids: []
source_id: null
output: loomcommander
perspective: null
status: draft
tags:
  - handoff
  - implementation
  - domains
  - architecture

# ─── CONDUCTING ─────────────────────────────────────────────
intent: capture
execution_state: pending
upstream:
  - doc: inst-scope-frontmatter-ui-mapping
    relation: prior
  - doc: inst-scope-domain-startup-performance
    relation: prior
downstream: []
---

# Handoff: Domain System Implementation

**Context:** Two scope documents have been completed that design a domain system for loomlib. This note captures the implementation prompt for the next session.

---

## Copy This Prompt for Next Session

```
I need to implement a domain system for loomlib based on two completed scope documents.

## Read First (CRITICAL)

1. `loomlib/docs/instance/scope-frontmatter-ui-mapping.md` — How UI elements map to frontmatter fields and how domains configure display
2. `loomlib/docs/instance/scope-domain-startup-performance.md` — How domains identify membership and performance solutions

These scopes establish:
- Every UI element already maps to frontmatter (no new fields needed for display)
- Domains are CONFIGURATIONS that tell views how to render, not containers
- A `domain` field should be added to Document interface for membership
- Existing 144 docs should be backfilled with `domain: 'etymon'`
- Performance requires domain-scoped queries, not `getAllDocs()` everywhere

## Implementation Plan

### Phase 1: Schema Changes (types.ts, db.ts)

1. Add `domain` field to Document interface in `types.ts`:
   ```typescript
   interface Document {
     // ... existing fields
     domain: string;  // 'etymon' | 'studio' | etc.
   }
   ```

2. Update `createEmptyDocument()` to set domain from env:
   ```typescript
   const DOMAIN = import.meta.env.VITE_LOOMLIB_DOMAIN ?? 'etymon';
   return { ...defaults, domain: DOMAIN };
   ```

3. Upgrade IndexedDB to version 4 in `db.ts`:
   - Add `domain` index to documents store
   - Handle upgrade path from version 3

4. Add `getDocsByDomain(domain)` function to `db.ts`

### Phase 2: Migration (seed.ts, documents.ts)

5. Update `syncSeedData()` to backfill domain:
   ```typescript
   // When syncing, ensure domain exists
   const domain = doc.domain ?? doc.output ?? 'etymon';
   ```

6. Update existing markdown files to include `domain` in frontmatter (or let backfill handle it)

### Phase 3: Query Refactoring (documents.ts)

7. Refactor these functions to be domain-scoped:
   - `listDocuments()` → `listDocuments(domain)`
   - `getUniqueTags()` → `getUniqueTags(domain)`
   - `getUniquePerspectives()` → `getUniquePerspectives(domain)`
   - `getUniqueOutputs()` → `getUniqueOutputs(domain)`
   - `filterDocuments()` → `filterDocuments(domain, criteria)`
   - `getFrameworks()` → `getFrameworks(domain)`

### Phase 4: View Updates (shell.ts, views/*.ts)

8. Update `Shell` to read domain from env and pass to views
9. Update each view to use domain-scoped queries
10. Views should only show docs from current domain

### Phase 5: Domain Configuration (NEW files)

11. Create `src/config/domain.ts` with DomainConfig interface
12. Create `src/config/etymon.ts` with Etymon domain config
13. Update views to read labels/icons from config instead of hardcoding

### Phase 6: Environment Setup

14. Add to `.env.local`:
    ```
    VITE_LOOMLIB_DOMAIN=etymon
    ```

15. Update `vite.config.ts` if needed to expose env var

## Key Files to Modify

- `loomlib/src/types.ts` — Add domain field
- `loomlib/src/data/db.ts` — Version 4 upgrade, domain index, getDocsByDomain
- `loomlib/src/data/seed.ts` — Domain backfill
- `loomlib/src/data/documents.ts` — Domain-scoped queries
- `loomlib/src/main.ts` — Domain env reading
- `loomlib/src/layout/shell.ts` — Pass domain to views

## Testing Checkpoints

After each phase, verify:
- [ ] `npm run build` succeeds
- [ ] App loads without errors
- [ ] Existing 144 docs still appear
- [ ] No console errors about missing domain

## Performance Goals

Current: ~2-5 sec startup with 144 docs
Target: ~200-500ms startup (domain-scoped loading)

The key insight: change `getAllDocs()` calls to `getDocsByDomain(currentDomain)` everywhere. This makes every query O(domain_size) instead of O(total_corpus).

## Do NOT

- Create new document types (frontmatter structure is sufficient)
- Add fields beyond `domain` (UI display comes from configuration, not schema)
- Break existing doc loading (backfill handles migration)
- Implement pagination yet (that's Phase 2 optimization)

Start with Phase 1 (schema changes) and work through sequentially. Each phase should result in a working app.
```

---

## Summary of What Was Scoped

### Scope 1: Frontmatter-to-UI Mapping

**Key insight:** Every visual element in loomlib views already maps to frontmatter fields:
- Type badges → `type`, `framework_kind`
- Status dots → `status` (position in progression)
- Tags → `tags[]`
- Upstream panel → `upstream[].doc` + `upstream[].relation`
- Filters → `type`, `status`, `intent`

**Domains are configurations** that tell views:
- What labels to show for values ("INSTANCE" vs "IDEA")
- What icons to use (⚙ vs 💡)
- What status progression exists (4-step vs 3-step)
- What fields appear in each view slot

### Scope 2: Domain Startup & Performance

**Key insight:** Current architecture loads ALL 144 docs for every query. Adding `domain` field + domain-scoped queries fixes both:
1. "Which docs belong to this domain?" → `doc.domain === currentDomain`
2. "Why is it slow?" → Query O(domain_size) not O(total_corpus)

**Migration path:**
- Add `domain` field to types
- Add `domain` index to IndexedDB (version 4)
- Backfill existing docs: `domain = output ?? 'etymon'`
- Refactor queries to use `getDocsByDomain()`

---

## Files Created This Session

1. `loomlib/docs/instance/scope-frontmatter-ui-mapping.md`
2. `loomlib/docs/instance/scope-domain-startup-performance.md`
3. `loomlib/docs/note/handoff-domain-implementation.md` (this file)
