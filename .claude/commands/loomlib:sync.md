---
description: Validate loomlib markdown documents and regenerate seed-data.ts
argument-hint: [--check]
---

# Loomlib Sync

Validate markdown documents in `loomlib/docs/` and regenerate `seed-data.ts`.

**This is now a build-time operation.** The `npm run build` and `npm run dev` commands automatically regenerate `seed-data.ts` from markdown files.

## When to Use

- After creating/editing markdown files with `/loomlib:instance`, `/loomlib:framework`, etc.
- To validate frontmatter before committing
- To check for orphaned documents

## Protocol

### Step 1: Run the generator

```bash
cd loomlib && npm run generate:seed
```

This will:
1. Parse all `loomlib/docs/**/*.md` files
2. Validate frontmatter against Document schema
3. Report any errors (invalid fields, missing required fields, duplicate IDs)
4. Generate `src/data/seed-data.ts` if validation passes

### Step 2: Report results

**If the command succeeds:**
```
=== SUCCESS ===
Generated: loomlib/src/data/seed-data.ts
Documents: N
```

**If validation fails:**
```
=== VALIDATION ERRORS ===
path/to/file.md:
  - Missing or invalid "id" field
  - Invalid "status" field: foo. Must be one of: incubating, draft, verified, captured
```

### Step 3: Refresh the app

After regenerating seed-data.ts:
1. If `npm run dev` is running, the browser will hot-reload
2. Otherwise run `npm run dev` to start the dev server
3. `syncSeedData()` will automatically add/update documents in IndexedDB

## Validation Rules

**Required fields:**
| Field | Type | Validation |
|-------|------|------------|
| `id` | string | Must match pattern: `{type-prefix}-{slug}` |
| `title` | string | Non-empty |
| `type` | enum | `framework`, `instance`, `note`, `source`, `index` |
| `status` | enum | `incubating`, `draft`, `verified`, `captured` |
| `framework_kind` | enum\|null | If type=framework: `toolkit` or `domain`. Otherwise: `null` |
| `framework_ids` | string[] | Array of framework IDs |
| `tags` | string[] | Array of tags |

**ID prefix rules:**
- `framework` -> `fw-{slug}`
- `instance` -> `inst-{slug}`
- `note` -> `note-{slug}`
- `source` -> `src-{slug}`
- `index` -> `idx-{slug}`

## Arguments

- `--check`: Only validate, don't regenerate (useful for CI)

## Check-only Mode

If `--check` is passed, just run validation without regenerating:

```bash
cd loomlib && npm run generate:seed
# Then report if there are errors
```

## Excluded Files

- `loomlib/docs/aesthetic-invariants.md` - Legacy design spec without frontmatter

## How It Works

```
loomlib/docs/**/*.md (markdown files)
        |
        v
npm run generate:seed (or prebuild/predev hook)
        |
        v
loomlib/src/data/seed-data.ts (generated TypeScript)
        |
        v
Vite bundles into app
        |
        v
syncSeedData() -> IndexedDB
```

Markdown is the **single source of truth**. The TypeScript file is auto-generated.

## Now Execute

Run the sync: $ARGUMENTS
