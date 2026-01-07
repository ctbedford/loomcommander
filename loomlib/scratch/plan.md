# Plan: Build-Time Seed Generation

**Goal:** Eliminate manual `/loomlib:sync` by generating `seed-data.ts` from markdown at build time.

**Survey:** `loomlib/docs/instance/survey-seed-architecture.md`

---

## Current State

| Resource | Count | Location |
|----------|-------|----------|
| Documents in `seed-data.ts` | 31 | `loomlib/src/data/seed-data.ts` |
| Markdown files | 6 | `loomlib/docs/**/*.md` |
| Gap (orphaned in TS) | ~25 | Only exist in TypeScript |

---

## Phase 1: Create Markdown Files for Orphaned Documents

**Problem:** 31 documents exist in `seed-data.ts` but only 6 have markdown files.

**Tasks:**
1. Extract all document IDs from `seed-data.ts`
2. Cross-reference against existing `loomlib/docs/**/*.md`
3. For each orphaned document:
   - Create markdown file in `loomlib/docs/{type}/` with proper frontmatter
   - Map type to directory: `framework/`, `instance/`, `source/`, `index/`, `note/`
   - Copy content from seed-data.ts to markdown body

**Output:** All seed documents exist as markdown files (source of truth established).

---

## Phase 2: Create Build Script

**File:** `loomlib/scripts/generate-seed.ts`

**Tasks:**
1. Add `gray-matter` dev dependency for YAML frontmatter parsing
2. Create script that:
   - Globs `loomlib/docs/**/*.md` (exclude `aesthetic-invariants.md`)
   - Parses frontmatter with gray-matter
   - Validates against Document type schema
   - Generates `src/data/seed-data.ts` with proper TypeScript structure
3. Handle edge cases:
   - Escape backticks in content (`\``)
   - Preserve null values explicitly
   - Sort documents by type (frameworks first, then indexes, sources, instances)

**Validation rules (from `/loomlib:sync`):**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `id` | string | Yes | Prefix matches type (`fw-`, `inst-`, `note-`, `src-`, `idx-`) |
| `title` | string | Yes | Non-empty |
| `type` | enum | Yes | `framework`, `instance`, `note`, `source`, `index` |
| `status` | enum | Yes | `incubating`, `draft`, `verified`, `captured` |
| `framework_kind` | enum\|null | Yes | If type=framework: `toolkit` or `domain`. Otherwise: `null` |
| `framework_ids` | string[] | Yes | Array of framework IDs |
| `tags` | string[] | Yes | Array of tags |
| `perspective` | string\|null | No | Default: `null` |
| `source_id` | string\|null | No | Default: `null` |
| `output` | string\|null | No | Default: `null` |

---

## Phase 3: Wire into Build

**File:** `loomlib/package.json`

**Tasks:**
1. Add scripts:
   ```json
   "generate:seed": "tsx scripts/generate-seed.ts",
   "prebuild": "npm run generate:seed",
   "predev": "npm run generate:seed"
   ```
2. Delete legacy `scripts/seed.ts` (970 lines of stale hardcoded data, never used)
3. Decision: Commit generated `seed-data.ts` or add to `.gitignore`?
   - **Commit:** Transparency, simpler CI, works without build
   - **Gitignore:** Cleaner diffs, true single-source

---

## Phase 4: Repurpose /loomlib:sync Command

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A) Deprecate | Remove command entirely | Simpler | Lose validation tool |
| B) Validation-only | Check markdown validity, no generation | Keep validation | Redundant with build errors |

**Recommendation:** Option B — repurpose as a lint command:
- Validate frontmatter schema
- Detect orphaned documents (in seed-data.ts but no markdown)
- Check ID prefix conventions
- Pre-commit hook integration

---

## Phase 5: Cleanup & Verification

**Tasks:**
1. Delete `loomlib/scripts/seed.ts` (unused legacy)
2. Run full flow: edit markdown → build → verify in browser
3. Update documentation if needed

**Verification:**
```bash
cd loomlib
npm run build
npm run dev
# Verify all 31 documents load correctly
```

---

## Dependencies

| Package | Purpose | Type |
|---------|---------|------|
| `gray-matter` | Parse YAML frontmatter from markdown | devDependency |

**Alternative:** Write simple regex-based parser (avoid new dependency, but more fragile).

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Content divergence | Diff generated vs existing before replacing |
| Orphan handling | Phase 1 creates all markdown files first |
| Build time | Parsing 30 files is <100ms, acceptable |
| Backtick escaping | Test with complex content (code blocks) |

---

## Questions for Approval

1. **Commit or gitignore `seed-data.ts`?** (I recommend commit for simplicity)
2. **Approve `gray-matter` dependency?** (Well-maintained, 9M weekly downloads)
3. **Keep `/loomlib:sync` as validation, or fully deprecate?**

---

## Order of Operations

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5
  |          |          |          |          |
  ↓          ↓          ↓          ↓          ↓
Create    Build      Wire       Repurpose  Cleanup
markdown  script     build      command    & verify
files
```

All phases are sequential — each depends on the previous.

---

# Previous: Loomlib Constellation Enhancement Plan

## Executive Summary

Transform the constellation view from "structural connection graph" to "production genealogy map." The layout should answer "How was this made?" not "What's connected?"

Four phases (all complete):
1. **Phase A: Semantic Categories** ✅ — 8 relationship types with spatial meaning
2. **Phase B: Formula Bar + Positioning** ✅ — Visual production recipe
3. **Phase C: Slot Limits + Scroll** ✅ — Paginated exploration per category
4. **Phase D: Lenses** ✅ — Switchable filter/sort modes

---

## Part 1: The Production Model

### Document Model Semantics

From PROJECT_INDEX.md:
```
Instance = Toolkit(s) + Domain(s) + [Source]
```

| Parent Type | Icon | Relationship | Question Answered |
|-------------|------|--------------|-------------------|
| **Toolkit** | ⚙ | Procedural inheritance | "What method produced this?" |
| **Domain** | ▣ | Perspectival inheritance | "What lens shaped attention?" |
| **Source** | ◈ | Material derivation | "What external input was worked?" |

### Current Problem

The current implementation collapses meaningful distinctions:
- All parents in one bucket (toolkit vs domain vs source indistinguishable)
- All siblings in one bucket (formula kin vs channel kin vs perspective kin)
- Layout doesn't encode semantic meaning

### Governing Question Shift

| Before | After |
|--------|-------|
| "What's structurally connected?" | "How was this made? What else was made the same way?" |

---

## Part 2: Spatial Layout

### Semantic Positions

```
                        ┌─────────────────┐
                        │  Source Parent  │
                        │       ◈         │
                        └────────┬────────┘
                                 │
     ┌──────────────┐           │           ┌──────────────┐
     │   Toolkit    │           │           │    Domain    │
     │      ⚙       │←──────────┼──────────→│      ▣       │
     │   Parents    │           │           │   Parents    │
     └──────────────┘           │           └──────────────┘
                                │
                        ┌───────┴───────┐
                        │    FOCUSED    │
                        │   Document    │
                        └───────┬───────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         │                      │                      │
    ┌────┴────┐           ┌─────┴─────┐          ┌────┴────┐
    │Persp.   │           │  Children │          │Channel  │
    │Siblings │           │           │          │Siblings │
    └─────────┘           └───────────┘          └─────────┘
                                │
                        ┌───────┴───────┐
                        │   Formula     │
                        │   Siblings    │
                        └───────────────┘
```

**Spatial encoding:**
- **Above**: Source (material input)
- **Left**: Toolkit parents (procedural *how*)
- **Right**: Domain parents (perspectival *lens*)
- **Below**: Children → Formula siblings
- **Lower-left orbit**: Perspective siblings
- **Lower-right orbit**: Channel siblings

---

## Part 3: Data Structures

### Types (src/types.ts)

```typescript
// ─────────────────────────────────────────────────────────────────────
// SEMANTIC RELATIONSHIP CATEGORIES
// ─────────────────────────────────────────────────────────────────────

export type SemanticCategory =
  | 'toolkitParent'
  | 'domainParent'
  | 'sourceParent'
  | 'child'
  | 'formulaSibling'
  | 'channelSibling'
  | 'perspectiveSibling'
  | 'distant';

export interface SemanticSlotLimits {
  toolkitParent: number;
  domainParent: number;
  sourceParent: number;
  child: number;
  formulaSibling: number;
  channelSibling: number;
  perspectiveSibling: number;
  distant: number;
}

export interface SemanticCategorizedDocs {
  toolkitParent: Document[];
  domainParent: Document[];
  sourceParent: Document[];
  child: Document[];
  formulaSibling: Document[];
  channelSibling: Document[];
  perspectiveSibling: Document[];
  distant: Document[];
}

export interface ProductionFormula {
  toolkits: Document[];
  domains: Document[];
  source: Document | null;
}

// ─────────────────────────────────────────────────────────────────────
// SLOT STATE
// ─────────────────────────────────────────────────────────────────────

export interface SlotState {
  category: SemanticCategory;
  docs: Document[];
  visibleStart: number;
  maxVisible: number;
  totalCount: number;
}

// ─────────────────────────────────────────────────────────────────────
// LENS SYSTEM
// ─────────────────────────────────────────────────────────────────────

export type LensId =
  | 'default'       // all relationships
  | 'formula'       // production lineage only
  | 'production'    // what this framework produced
  | 'lineage'       // parents + children
  | 'channel'       // same output channel
  | 'perspective'   // same perspective field
  | 'incubating'    // status = 'incubating'
  | 'recent'        // last 7 days
  | 'semantic';     // embedding similarity (future)

export interface LensConfig {
  id: LensId;
  name: string;
  description: string;
  icon: string;
  filter: (doc: Document, focus: Document) => boolean;
  sort: (a: Document, b: Document, focus: Document) => number;
  available: boolean;
}

// ─────────────────────────────────────────────────────────────────────
// GRAPH EXTENSIONS
// ─────────────────────────────────────────────────────────────────────

export interface GraphNodeExtended extends GraphNode {
  category: SemanticCategory;
  isVisible: boolean;
  slotIndex: number;
  overflowCount?: number;
}

export interface ConstellationState {
  focusedId: string | null;
  activeLens: LensId;
  slots: Map<SemanticCategory, SlotState>;
  showDistantAsDots: boolean;
}
```

### Configuration (src/data/constellation-config.ts)

```typescript
import type { SemanticSlotLimits, SemanticCategory, LensConfig } from '../types.ts';

// ─────────────────────────────────────────────────────────────────────
// SLOT LIMITS
// ─────────────────────────────────────────────────────────────────────

export const DEFAULT_SLOT_LIMITS: SemanticSlotLimits = {
  toolkitParent: 3,
  domainParent: 3,
  sourceParent: 1,
  child: 4,
  formulaSibling: 4,
  channelSibling: 3,
  perspectiveSibling: 3,
  distant: 4,
};

export function getAdaptiveLimits(totalDocs: number): SemanticSlotLimits {
  if (totalDocs < 20) {
    return {
      toolkitParent: 4,
      domainParent: 4,
      sourceParent: 1,
      child: 6,
      formulaSibling: 5,
      channelSibling: 4,
      perspectiveSibling: 4,
      distant: 6,
    };
  } else if (totalDocs < 50) {
    return DEFAULT_SLOT_LIMITS;
  } else {
    return {
      toolkitParent: 2,
      domainParent: 2,
      sourceParent: 1,
      child: 3,
      formulaSibling: 3,
      channelSibling: 2,
      perspectiveSibling: 2,
      distant: 0,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────
// SLOT POSITIONS (angle in degrees, distance as fraction of radius)
// ─────────────────────────────────────────────────────────────────────

export const SLOT_POSITIONS: Record<SemanticCategory, { angle: number; distance: number }> = {
  sourceParent:       { angle: 270, distance: 0.35 },  // above
  toolkitParent:      { angle: 180, distance: 0.30 },  // left
  domainParent:       { angle: 0,   distance: 0.30 },  // right
  child:              { angle: 90,  distance: 0.35 },  // below
  formulaSibling:     { angle: 90,  distance: 0.60 },  // below children
  channelSibling:     { angle: 45,  distance: 0.55 },  // lower-right orbit
  perspectiveSibling: { angle: 135, distance: 0.55 },  // lower-left orbit
  distant:            { angle: 0,   distance: 0.80 },  // outer ring
};

// ─────────────────────────────────────────────────────────────────────
// LENS CONFIGS
// ─────────────────────────────────────────────────────────────────────

export const LENS_CONFIGS: LensConfig[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'All relationships',
    icon: '◉',
    filter: () => true,
    sort: (a, b) => b.modifiedAt - a.modifiedAt,
    available: true,
  },
  {
    id: 'formula',
    name: 'Formula',
    description: 'Production lineage only',
    icon: '⚗',
    filter: (doc, focus) => {
      // Parents (toolkit, domain, source)
      const isParent = focus.framework_ids.includes(doc.id) || focus.source_id === doc.id;
      if (isParent) return true;

      // Formula siblings (same framework_ids set)
      const focusFormula = new Set(focus.framework_ids);
      const docFormula = new Set(doc.framework_ids);
      if (focusFormula.size === 0) return false;
      if (focusFormula.size !== docFormula.size) return false;
      return [...focusFormula].every(id => docFormula.has(id));
    },
    sort: (a, b, focus) => {
      // Parents first, then siblings by date
      const aIsParent = focus.framework_ids.includes(a.id) || focus.source_id === a.id;
      const bIsParent = focus.framework_ids.includes(b.id) || focus.source_id === b.id;
      if (aIsParent && !bIsParent) return -1;
      if (!aIsParent && bIsParent) return 1;
      return b.modifiedAt - a.modifiedAt;
    },
    available: true,
  },
  {
    id: 'production',
    name: 'Production',
    description: 'What this produced',
    icon: '🏭',
    filter: (doc, focus) => {
      return doc.framework_ids.includes(focus.id) || doc.source_id === focus.id;
    },
    sort: (a, b) => b.modifiedAt - a.modifiedAt,
    available: true,
  },
  {
    id: 'lineage',
    name: 'Lineage',
    description: 'Parents and children',
    icon: '⬍',
    filter: (doc, focus) => {
      const isParent = focus.framework_ids.includes(doc.id) || focus.source_id === doc.id;
      const isChild = doc.framework_ids.includes(focus.id) || doc.source_id === focus.id;
      return isParent || isChild;
    },
    sort: (a, b) => b.modifiedAt - a.modifiedAt,
    available: true,
  },
  {
    id: 'channel',
    name: 'Channel',
    description: 'Same output channel',
    icon: '📺',
    filter: (doc, focus) => focus.output !== null && doc.output === focus.output,
    sort: (a, b) => b.modifiedAt - a.modifiedAt,
    available: true,
  },
  {
    id: 'perspective',
    name: 'Perspective',
    description: 'Same perspective',
    icon: '👁',
    filter: (doc, focus) => focus.perspective !== null && doc.perspective === focus.perspective,
    sort: (a, b) => b.modifiedAt - a.modifiedAt,
    available: true,
  },
  {
    id: 'incubating',
    name: 'Incubating',
    description: 'Status = incubating',
    icon: '🥚',
    filter: (doc) => doc.status === 'incubating',
    sort: (a, b) => a.createdAt - b.createdAt,
    available: true,
  },
  {
    id: 'recent',
    name: 'Recent',
    description: 'Modified in 7 days',
    icon: '🕐',
    filter: (doc) => doc.modifiedAt > Date.now() - 7 * 24 * 60 * 60 * 1000,
    sort: (a, b) => b.modifiedAt - a.modifiedAt,
    available: true,
  },
  {
    id: 'semantic',
    name: 'Semantic',
    description: 'AI-inferred similarity',
    icon: '🧠',
    filter: () => true,
    sort: (a, b) => b.modifiedAt - a.modifiedAt,
    available: false,  // until embeddings
  },
];
```

---

## Part 4: Implementation Phases

### Phase A: Semantic Categories ✅ COMPLETE

**Goal**: Replace 4-category model with 8-category semantic model.

**Files modified**:
- `src/types.ts` — added semantic types
- `src/data/graph.ts` — added categorization functions
- `src/data/constellation-config.ts` — added semantic slot limits and positions
- `src/views/constellation.ts` — updated to use 8-category model
- `src/ui/constellation.css` — updated slot indicator positions

#### A.1: Semantic Categorization (src/data/graph.ts)

```typescript
import type { Document, SemanticCategorizedDocs, ProductionFormula } from '../types.ts';

export function categorizeDocsSemantic(
  docs: Document[],
  focusedId: string | null
): SemanticCategorizedDocs {
  const result: SemanticCategorizedDocs = {
    toolkitParent: [],
    domainParent: [],
    sourceParent: [],
    child: [],
    formulaSibling: [],
    channelSibling: [],
    perspectiveSibling: [],
    distant: [],
  };

  if (!focusedId) {
    result.distant = docs;
    return result;
  }

  const focusDoc = docs.find(d => d.id === focusedId);
  if (!focusDoc) {
    result.distant = docs;
    return result;
  }

  // Build focus formula for sibling comparison
  const focusFormula = new Set(focusDoc.framework_ids);

  for (const doc of docs) {
    if (doc.id === focusedId) continue;

    // ─────────────────────────────────────────────────────────────────
    // PARENT RELATIONSHIPS (mutually exclusive with each other)
    // ─────────────────────────────────────────────────────────────────

    if (focusDoc.framework_ids.includes(doc.id)) {
      if (doc.framework_kind === 'toolkit') {
        result.toolkitParent.push(doc);
        continue;
      } else if (doc.framework_kind === 'domain') {
        result.domainParent.push(doc);
        continue;
      }
    }

    if (focusDoc.source_id === doc.id) {
      result.sourceParent.push(doc);
      continue;
    }

    // ─────────────────────────────────────────────────────────────────
    // CHILD RELATIONSHIP
    // ─────────────────────────────────────────────────────────────────

    if (doc.framework_ids.includes(focusedId) || doc.source_id === focusedId) {
      result.child.push(doc);
      continue;
    }

    // ─────────────────────────────────────────────────────────────────
    // SIBLING RELATIONSHIPS (priority: formula > channel > perspective)
    // ─────────────────────────────────────────────────────────────────

    // Formula sibling: exact same framework_ids set
    const docFormula = new Set(doc.framework_ids);
    const isFormulaSibling =
      focusFormula.size > 0 &&
      docFormula.size === focusFormula.size &&
      [...focusFormula].every(id => docFormula.has(id));

    if (isFormulaSibling) {
      result.formulaSibling.push(doc);
      continue;
    }

    // Channel sibling: same output
    const isChannelSibling =
      focusDoc.output !== null &&
      doc.output === focusDoc.output;

    // Perspective sibling: same perspective
    const isPerspectiveSibling =
      focusDoc.perspective !== null &&
      doc.perspective === focusDoc.perspective;

    if (isChannelSibling) {
      result.channelSibling.push(doc);
    } else if (isPerspectiveSibling) {
      result.perspectiveSibling.push(doc);
    } else {
      result.distant.push(doc);
    }
  }

  // Sort each category by modifiedAt desc
  const sortByModified = (a: Document, b: Document) => b.modifiedAt - a.modifiedAt;
  Object.values(result).forEach(arr => arr.sort(sortByModified));

  return result;
}

export function getProductionFormula(
  docs: Document[],
  focusedId: string
): ProductionFormula {
  const focusDoc = docs.find(d => d.id === focusedId);
  if (!focusDoc) {
    return { toolkits: [], domains: [], source: null };
  }

  const toolkits: Document[] = [];
  const domains: Document[] = [];
  let source: Document | null = null;

  for (const doc of docs) {
    if (focusDoc.framework_ids.includes(doc.id)) {
      if (doc.framework_kind === 'toolkit') {
        toolkits.push(doc);
      } else if (doc.framework_kind === 'domain') {
        domains.push(doc);
      }
    }
    if (focusDoc.source_id === doc.id) {
      source = doc;
    }
  }

  return { toolkits, domains, source };
}
```

#### A.2: Testing Checklist

- [ ] `categorizeDocsSemantic` splits parents correctly by framework_kind
- [ ] Toolkit parents distinct from domain parents
- [ ] Source parent identified separately
- [ ] Formula siblings require exact framework_ids match
- [ ] Channel siblings don't overlap with formula siblings
- [ ] Perspective siblings don't overlap with channel siblings

---

### Phase B: Formula Bar + Positioning ✅ COMPLETE

**Goal**: Visual formula display, semantic spatial layout.

**Files created/modified**:
- `src/components/formula-bar.ts` — created FormulaBar component
- `src/data/graph.ts` — added getProductionFormula function
- `src/ui/constellation.css` — added formula bar styles

#### B.1: Formula Bar Component (src/components/formula-bar.ts)

```typescript
import type { Document, ProductionFormula } from '../types.ts';

export class FormulaBar {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.container.className = 'formula-bar';
  }

  update(focusDoc: Document | null, formula: ProductionFormula | null): void {
    if (!focusDoc || !formula) {
      this.container.classList.remove('formula-bar--visible');
      return;
    }

    // Only show for instances (they have formulas)
    if (focusDoc.type !== 'instance') {
      this.container.classList.remove('formula-bar--visible');
      return;
    }

    const parts: string[] = [];

    for (const toolkit of formula.toolkits) {
      parts.push(`<span class="formula-bar__toolkit">⚙ ${toolkit.title}</span>`);
    }

    for (const domain of formula.domains) {
      parts.push(`<span class="formula-bar__domain">▣ ${domain.title}</span>`);
    }

    if (formula.source) {
      parts.push(`<span class="formula-bar__source">◈ ${formula.source.title}</span>`);
    }

    if (parts.length === 0) {
      this.container.classList.remove('formula-bar--visible');
      return;
    }

    const icon = focusDoc.type === 'instance' ? '◧' : '⚙';
    this.container.innerHTML = `
      <span class="formula-bar__focus">${icon} ${focusDoc.title}</span>
      <span class="formula-bar__equals">=</span>
      <span class="formula-bar__parts">${parts.join(' <span class="formula-bar__plus">+</span> ')}</span>
    `;
    this.container.classList.add('formula-bar--visible');
  }
}
```

#### B.2: Semantic Positioning (src/data/graph.ts)

```typescript
import { SLOT_POSITIONS } from './constellation-config.ts';
import type { SemanticCategorizedDocs, SemanticCategory, SemanticSlotLimits, DepthLayer } from '../types.ts';

export function computeSemanticPositions(
  categorized: SemanticCategorizedDocs,
  focusDoc: Document,
  width: number,
  height: number,
  limits: SemanticSlotLimits,
  offsets: Record<SemanticCategory, number>
): Map<string, { x: number; y: number; layer: DepthLayer }> {
  const positions = new Map<string, { x: number; y: number; layer: DepthLayer }>();

  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = Math.min(width, height) / 2;

  // Focus at center
  positions.set(focusDoc.id, { x: centerX, y: centerY, layer: 'focus' });

  const categories: SemanticCategory[] = [
    'sourceParent', 'toolkitParent', 'domainParent', 'child',
    'formulaSibling', 'channelSibling', 'perspectiveSibling', 'distant'
  ];

  for (const category of categories) {
    const docs = categorized[category];
    const limit = limits[category];
    const offset = offsets[category];
    const visible = docs.slice(offset, offset + limit);
    const config = SLOT_POSITIONS[category];

    // Determine depth layer
    const layer: DepthLayer =
      category.includes('Parent') ? 'context' :
      category === 'child' ? 'context' :
      category.includes('Sibling') ? 'context' : 'distant';

    visible.forEach((doc, i) => {
      const count = visible.length;
      const spread = Math.PI / 6; // 30 degrees spread per slot
      const baseAngle = (config.angle * Math.PI) / 180;

      // Distribute within angular range
      const angleOffset = count > 1
        ? spread * (i - (count - 1) / 2) / (count - 1)
        : 0;
      const angle = baseAngle + angleOffset;

      const distance = config.distance * baseRadius;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      positions.set(doc.id, { x, y, layer });
    });
  }

  return positions;
}
```

#### B.3: Formula Bar CSS (src/ui/constellation.css)

```css
/* ========================================
 * Formula Bar
 * ======================================== */

.formula-bar {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 13px;
  color: var(--text);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 60;
  max-width: 80%;
}

.formula-bar--visible {
  opacity: 1;
  visibility: visible;
}

.formula-bar__focus {
  font-weight: 600;
  color: var(--accent);
}

.formula-bar__equals,
.formula-bar__plus {
  color: var(--text-muted);
  font-weight: 300;
}

.formula-bar__plus {
  margin: 0 4px;
}

.formula-bar__parts {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.formula-bar__toolkit {
  color: #6b9fff;  /* toolkit blue */
}

.formula-bar__domain {
  color: #a78bfa;  /* domain purple */
}

.formula-bar__source {
  color: #34d399;  /* source green */
}
```

#### B.4: Testing Checklist

- [ ] Formula bar appears for instances
- [ ] Formula bar hidden for frameworks
- [ ] Toolkit parents appear on left side
- [ ] Domain parents appear on right side
- [ ] Source parent appears above
- [ ] Children appear below
- [ ] Formula siblings below children
- [ ] Channel/perspective siblings in lower orbits

---

### Phase C: Slot Limits + Scroll ✅ COMPLETE

**Goal**: Paginate each of the 8 categories independently.

**Files modified**:
- `src/views/constellation.ts` — updated slot state and scroll handlers for 8 categories
- `src/ui/constellation.css` — added 8 slot indicator positions

#### C.1: Slot State Management (src/views/constellation.ts)

```typescript
import type { SemanticCategory, SemanticSlotLimits, SemanticCategorizedDocs } from '../types.ts';
import { DEFAULT_SLOT_LIMITS, getAdaptiveLimits } from '../data/constellation-config.ts';
import { categorizeDocsSemantic, computeSemanticPositions, getProductionFormula } from '../data/graph.ts';
import { FormulaBar } from '../components/formula-bar.ts';

// Class properties
private slotOffsets: Record<SemanticCategory, number> = {
  toolkitParent: 0,
  domainParent: 0,
  sourceParent: 0,
  child: 0,
  formulaSibling: 0,
  channelSibling: 0,
  perspectiveSibling: 0,
  distant: 0,
};

private slotLimits: SemanticSlotLimits = DEFAULT_SLOT_LIMITS;
private categorizedDocs: SemanticCategorizedDocs | null = null;
private activeSlot: SemanticCategory = 'child';
private formulaBar: FormulaBar | null = null;

// Scroll methods
private scrollSlot(category: SemanticCategory, direction: -1 | 1): void {
  if (!this.categorizedDocs) return;

  const total = this.categorizedDocs[category].length;
  const max = this.slotLimits[category];
  const current = this.slotOffsets[category];

  const newOffset = Math.max(0, Math.min(current + direction, total - max));

  if (newOffset !== current) {
    this.slotOffsets[category] = newOffset;
    this.computeLayout();
    this.render();
  }
}

private cycleActiveSlot(direction: -1 | 1): void {
  const categories: SemanticCategory[] = [
    'toolkitParent', 'domainParent', 'sourceParent', 'child',
    'formulaSibling', 'channelSibling', 'perspectiveSibling', 'distant'
  ];
  const currentIndex = categories.indexOf(this.activeSlot);
  const newIndex = (currentIndex + direction + categories.length) % categories.length;
  this.activeSlot = categories[newIndex];
  this.render();
}

// Keyboard handling
private handleKeydown = (e: KeyboardEvent): void => {
  switch (e.key) {
    case '[':
      e.preventDefault();
      this.scrollSlot(this.activeSlot, -1);
      break;
    case ']':
      e.preventDefault();
      this.scrollSlot(this.activeSlot, 1);
      break;
    case 'Tab':
      e.preventDefault();
      this.cycleActiveSlot(e.shiftKey ? -1 : 1);
      break;
    // ... existing cases ...
  }
};

// Layout computation
private computeLayout(): void {
  const rect = this.container.getBoundingClientRect();
  const width = rect.width || 800;
  const height = rect.height || 600;

  this.slotLimits = getAdaptiveLimits(this.docs.length);
  this.categorizedDocs = categorizeDocsSemantic(this.docs, this.focusedId);

  const focusDoc = this.docs.find(d => d.id === this.focusedId);
  if (!focusDoc) return;

  // Update formula bar
  const formula = getProductionFormula(this.docs, this.focusedId!);
  this.formulaBar?.update(focusDoc, formula);

  // Compute positions
  const positions = computeSemanticPositions(
    this.categorizedDocs,
    focusDoc,
    width,
    height,
    this.slotLimits,
    this.slotOffsets
  );

  // Convert to nodes...
}
```

#### C.2: Slot Indicator Positions (src/ui/constellation.css)

```css
/* ========================================
 * Slot Indicators
 * ======================================== */

.constellation-slot-indicator {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 11px;
  color: var(--text-muted);
  z-index: 100;
  transition: all 0.15s ease;
}

.constellation-slot-indicator--active {
  border-color: var(--accent);
  box-shadow: 0 0 8px rgba(var(--accent-rgb), 0.3);
}

/* Positions for 8 categories */
.constellation-slot-indicator--toolkitParent {
  top: 50%;
  left: 5%;
  transform: translateY(-50%);
}

.constellation-slot-indicator--domainParent {
  top: 50%;
  right: 5%;
  transform: translateY(-50%);
}

.constellation-slot-indicator--sourceParent {
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
}

.constellation-slot-indicator--child {
  bottom: 35%;
  left: 50%;
  transform: translateX(-50%);
}

.constellation-slot-indicator--formulaSibling {
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
}

.constellation-slot-indicator--channelSibling {
  bottom: 25%;
  right: 15%;
}

.constellation-slot-indicator--perspectiveSibling {
  bottom: 25%;
  left: 15%;
}

.constellation-slot-indicator--distant {
  bottom: 5%;
  right: 5%;
}

/* Indicator buttons */
.constellation-slot-indicator__prev,
.constellation-slot-indicator__next {
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  transition: background 0.1s;
}

.constellation-slot-indicator__prev:hover:not(:disabled),
.constellation-slot-indicator__next:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.constellation-slot-indicator__prev:disabled,
.constellation-slot-indicator__next:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.constellation-slot-indicator__count {
  min-width: 60px;
  text-align: center;
}
```

#### C.3: Testing Checklist

- [ ] Each of 8 categories has independent scroll state
- [ ] `[` and `]` scroll active slot
- [ ] `Tab` cycles through all 8 categories
- [ ] Indicators show "1–3 of 10" style counts
- [ ] Adaptive limits adjust for large doc counts
- [ ] Changing focus resets all offsets to 0

---

### Phase D: Lenses ✅ COMPLETE

**Goal**: Filter/sort modes that work with semantic categories.

**Files modified**:
- `src/components/lens-picker.ts` — already exists
- `src/data/constellation-config.ts` — added Formula and Production lenses
- `src/views/constellation.ts` — lens integration exists

#### D.1: Lens Picker Component (src/components/lens-picker.ts)

```typescript
import type { LensConfig, LensId } from '../types.ts';
import { LENS_CONFIGS } from '../data/constellation-config.ts';

export interface LensPickerOptions {
  onSelect: (lensId: LensId) => void;
  onClose: () => void;
}

export class LensPicker {
  private container: HTMLElement;
  private options: LensPickerOptions;
  private selectedIndex = 0;
  private activeLens: LensId = 'default';

  constructor(container: HTMLElement, options: LensPickerOptions) {
    this.container = container;
    this.options = options;
    this.container.className = 'lens-picker';
    this.container.setAttribute('role', 'listbox');
    this.container.tabIndex = 0;
    this.container.addEventListener('keydown', this.handleKeydown);
  }

  show(currentLens: LensId): void {
    this.activeLens = currentLens;
    this.selectedIndex = LENS_CONFIGS.findIndex(l => l.id === currentLens);
    if (this.selectedIndex === -1) this.selectedIndex = 0;
    this.render();
    this.container.classList.add('lens-picker--visible');
    this.container.focus();
  }

  hide(): void {
    this.container.classList.remove('lens-picker--visible');
  }

  private render(): void {
    const available = LENS_CONFIGS.filter(l => l.available);
    this.container.innerHTML = `
      <div class="lens-picker__header">
        <span class="lens-picker__title">Select Lens</span>
        <span class="lens-picker__hint">↑↓ navigate · Enter select · Esc close</span>
      </div>
      <div class="lens-picker__list">
        ${available.map((lens, i) => `
          <div
            class="lens-picker__item ${lens.id === this.activeLens ? 'lens-picker__item--active' : ''} ${i === this.selectedIndex ? 'lens-picker__item--selected' : ''}"
            data-lens="${lens.id}"
            role="option"
          >
            <span class="lens-picker__icon">${lens.icon}</span>
            <div class="lens-picker__content">
              <span class="lens-picker__name">${lens.name}</span>
              <span class="lens-picker__description">${lens.description}</span>
            </div>
            ${lens.id === this.activeLens ? '<span class="lens-picker__check">✓</span>' : ''}
          </div>
        `).join('')}
      </div>
    `;

    this.container.querySelectorAll('.lens-picker__item').forEach(item => {
      item.addEventListener('click', () => {
        const lensId = item.getAttribute('data-lens') as LensId;
        this.options.onSelect(lensId);
      });
    });
  }

  private handleKeydown = (e: KeyboardEvent): void => {
    const available = LENS_CONFIGS.filter(l => l.available);
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, available.length - 1);
        this.render();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.render();
        break;
      case 'Enter':
        e.preventDefault();
        this.options.onSelect(available[this.selectedIndex].id);
        break;
      case 'Escape':
        e.preventDefault();
        this.options.onClose();
        break;
    }
  };

  destroy(): void {
    this.container.removeEventListener('keydown', this.handleKeydown);
  }
}
```

#### D.2: Lens CSS (src/ui/lens.css)

```css
/* ========================================
 * Lens Picker
 * ======================================== */

.lens-picker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.95);
  width: 320px;
  max-height: 400px;
  background: rgba(20, 20, 25, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.15s ease;
  z-index: 1000;
  overflow: hidden;
}

.lens-picker--visible {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, -50%) scale(1);
}

.lens-picker__header {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lens-picker__title {
  font-size: 13px;
  font-weight: 600;
}

.lens-picker__hint {
  font-size: 10px;
  color: var(--text-muted);
}

.lens-picker__list {
  padding: 8px;
  max-height: 320px;
  overflow-y: auto;
}

.lens-picker__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.1s;
}

.lens-picker__item:hover,
.lens-picker__item--selected {
  background: rgba(255, 255, 255, 0.05);
}

.lens-picker__item--active {
  background: rgba(var(--accent-rgb), 0.15);
}

.lens-picker__item--selected {
  outline: 1px solid var(--accent);
}

.lens-picker__icon {
  font-size: 18px;
  width: 28px;
  text-align: center;
}

.lens-picker__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.lens-picker__name {
  font-size: 13px;
  font-weight: 500;
}

.lens-picker__description {
  font-size: 11px;
  color: var(--text-muted);
}

.lens-picker__check {
  color: var(--accent);
  font-size: 14px;
}

/* Lens indicator */
.constellation-lens-indicator {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  z-index: 50;
}

.constellation-lens-indicator:hover {
  background: rgba(0, 0, 0, 0.7);
  border-color: var(--accent);
}

.constellation-lens-indicator__icon {
  font-size: 14px;
}

.constellation-lens-indicator__name {
  font-weight: 500;
}

.constellation-lens-indicator__shortcut {
  font-size: 10px;
  color: var(--text-muted);
  margin-left: 8px;
}
```

#### D.3: Testing Checklist

- [ ] `Cmd+L` opens lens picker
- [ ] Arrow keys navigate, Enter selects
- [ ] Formula lens shows only parents + formula siblings
- [ ] Production lens shows only children
- [ ] Changing lens resets scroll offsets
- [ ] Lens indicator in top-left shows current lens

---

## Part 5: File Change Summary

### New Files

| File | Purpose |
|------|---------|
| `src/data/constellation-config.ts` | Slot limits, positions, lens configs |
| `src/components/formula-bar.ts` | Production formula display |
| `src/components/lens-picker.ts` | Lens selection modal |
| `src/ui/lens.css` | Lens picker styles |

### Modified Files

| File | Changes |
|------|---------|
| `src/types.ts` | SemanticCategory, ProductionFormula, LensId types |
| `src/data/graph.ts` | categorizeDocsSemantic, computeSemanticPositions |
| `src/views/constellation.ts` | 8-slot state, formula bar, lens integration |
| `src/ui/constellation.css` | Formula bar, 8 slot indicator positions |

---

## Part 6: Keyboard Reference

| Key | Context | Action |
|-----|---------|--------|
| `Cmd+L` | Constellation | Open lens picker |
| `[` | Constellation | Scroll active slot backward |
| `]` | Constellation | Scroll active slot forward |
| `Tab` | Constellation | Cycle active slot (8 categories) |
| `Shift+Tab` | Constellation | Cycle active slot backward |
| `f` | Constellation | Toggle Formula lens |
| `p` | Constellation | Toggle Production lens |
| `Escape` | Constellation | Return to Default lens |
| `↑/↓` | Lens picker | Navigate options |
| `Enter` | Lens picker | Select lens |

---

## Part 7: Testing Scenarios

### Scenario 1: Instance with Multiple Parents

**Focus:** INTEREST (instance with `framework_ids: [fw-etymon-method, fw-oikonomia]`)

**Expected:**
- Left: `⚙ Etymon Method`
- Right: `▣ Oikonomia vs Chrematistics`
- Formula bar: `◧ INTEREST = ⚙ Etymon Method + ▣ Oikonomia vs Chrematistics`

### Scenario 2: Toolkit Framework

**Focus:** Etymon Method (toolkit framework)

**Expected:**
- Left/Right: empty (no parents)
- Below: all instances using this toolkit
- Formula bar: hidden

### Scenario 3: Formula Siblings

**Focus:** CAPITAL (instance with same formula as INTEREST)

**Expected:**
- Formula siblings: INTEREST, CREDIT, CORPORATION (exact same `framework_ids`)
- Channel siblings: other docs with same `output` (distinct from formula siblings)

### Scenario 4: Production Lens

**Focus:** fw-etymon-method
**Lens:** Production

**Expected:**
- Only children visible (instances that use this toolkit)
- All parent/sibling categories hidden

---

## Part 8: What This Makes Salient

| Before | After |
|--------|-------|
| "These are connected" | "This was made with these" |
| Undifferentiated parents | Toolkit ⚙ vs Domain ▣ vs Source ◈ |
| Single sibling bucket | Formula kin vs Channel kin vs Perspective kin |
| Formula invisible | Formula bar makes recipe primary |
| Connection topology | **Production genealogy** |

The constellation becomes a **production map** rather than a **connection graph**.
