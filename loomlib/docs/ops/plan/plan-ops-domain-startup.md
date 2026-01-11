---
# ─── DESCRIPTIVE ────────────────────────────────────────────
id: plan-ops-domain-startup
title: "Fix ops domain startup - documents not visible"
type: plan
domain: ops
status: completed
tags: [bug-fix, domain-scoping, startup]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: execute
execution_state: completed
upstream:
  - doc: idx-ops-domain
    relation: informs
downstream: []

# ─── PROJECT REFERENCE ──────────────────────────────────────
project_id: proj-loomlib
---

# Problem Statement

When starting loomlib with `VITE_LOOMLIB_DOMAIN=ops`, no documents appear in the list view. The user expects to see ops-domain documents.

## Root Cause Analysis

Two-layer failure:

### Layer 1: ListView ignores domain scoping

**Location:** `loomlib/src/views/list.ts:305`

```typescript
this.docs = await listDocuments();  // ← getAllDocs() - NO DOMAIN FILTER
```

The `listDocuments()` function (aliased to `getAllDocs()`) returns all documents from all domains. A domain-scoped function exists but isn't used:

```typescript
// documents.ts:13-16 - THIS EXISTS BUT ISN'T CALLED
export async function listDomainDocuments(domain?: string): Promise<Document[]> {
  const targetDomain = domain ?? getCurrentDomain();
  return getDocsByDomain(targetDomain);
}
```

### Layer 2: No ops documents in seed data

**Location:** `loomlib/scripts/generate-seed.ts:57`

```typescript
const EXCLUDED_FOLDERS = ['ops', 'meta', 'studio'];
```

Ops/meta/studio documents are explicitly excluded from `seed-data.ts`. Currently only one ops document exists: `loomlib/docs/ops/index/idx-ops-domain.md`.

This is **by design** — each domain has different types/statuses and shouldn't share the same validation. But it means ops documents must come from somewhere else.

---

## Proposed Fix

### Phase 1: Fix domain-scoped document listing (Code Change)

Change `list.ts:305` from:
```typescript
this.docs = await listDocuments();
```

To:
```typescript
this.docs = await listDomainDocuments();
```

This is a one-line change. The `listDomainDocuments()` function already exists and correctly uses `getCurrentDomain()`.

**Files to modify:**
- `loomlib/src/views/list.ts` — import and use `listDomainDocuments`

### Phase 2: Create per-domain seed generation (Build Process)

The current architecture assumes one seed file for one domain. To support multiple domains:

**Option A: Multiple seed files (Recommended)**
- `seed-data-etymon.ts` (existing, renamed)
- `seed-data-ops.ts` (new)
- `seed-data-meta.ts` (new)
- `seed-data-studio.ts` (new)
- Modify `generate-seed.ts` to accept domain parameter
- Build process generates domain-specific bundle or loads at runtime

**Option B: Combined seed with domain field**
- Remove folder exclusions from `generate-seed.ts`
- Add domain validation per folder
- Each domain folder has its own type/status enums
- Runtime filters by domain

**Option C: API-only for other domains (Dev mode only)**
- Keep etymon in seed-data
- Ops/meta/studio load exclusively via `/api/docs` in dev mode
- Production build only includes etymon domain

**Recommendation:** Option C for now (simplest), then Option A when production multi-domain is needed.

### Phase 3: Validate environment variable passing

Current `vite.config.ts` doesn't explicitly define the env var. Vite should auto-expose `VITE_*` variables, but verify:

```typescript
// vite.config.ts - may need this if auto-expose doesn't work
export default defineConfig({
  define: {
    'import.meta.env.VITE_LOOMLIB_DOMAIN': JSON.stringify(process.env.VITE_LOOMLIB_DOMAIN ?? 'etymon')
  },
  // ...
});
```

---

## Implementation Tasks

1. [ ] Change `list.ts` to use `listDomainDocuments()` instead of `listDocuments()`
2. [ ] Verify `VITE_LOOMLIB_DOMAIN` env var works in dev mode
3. [ ] Add more ops documents to `loomlib/docs/ops/` (or confirm API sync works)
4. [ ] Test: `VITE_LOOMLIB_DOMAIN=ops npm run dev` shows ops docs only
5. [ ] Test: default startup still shows etymon docs

---

## Success Criteria

- Starting with `VITE_LOOMLIB_DOMAIN=ops` shows only ops-domain documents
- Starting with default (etymon) shows only etymon documents
- No cross-domain document leakage in list view

---

## Dependencies

- Ops documents must exist (either in seed data or via API sync in dev mode)
- `listDomainDocuments` function must work correctly (already implemented)
