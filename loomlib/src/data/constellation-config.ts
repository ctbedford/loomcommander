import type { SlotLimits, LensConfig, Document, SemanticSlotLimits, SemanticCategory } from '../types.ts';

// ─────────────────────────────────────────────────────────────────────
// SEMANTIC SLOT LIMITS - 8 category limits
// ─────────────────────────────────────────────────────────────────────

export const DEFAULT_SEMANTIC_SLOT_LIMITS: SemanticSlotLimits = {
  toolkitParent: 3,
  domainParent: 3,
  sourceParent: 1,
  child: 4,
  formulaSibling: 4,
  channelSibling: 3,
  perspectiveSibling: 3,
  distant: 4,
};

export function getAdaptiveSemanticLimits(totalDocs: number): SemanticSlotLimits {
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
    return DEFAULT_SEMANTIC_SLOT_LIMITS;
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
// SLOT POSITIONS - Spatial encoding for semantic categories
// angle: degrees (0 = right, 90 = down, 180 = left, 270 = up)
// distance: fraction of radius (0-1)
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

// Semantic category cycle order for Tab navigation
export const SEMANTIC_CATEGORY_ORDER: SemanticCategory[] = [
  'toolkitParent',
  'domainParent',
  'sourceParent',
  'child',
  'formulaSibling',
  'channelSibling',
  'perspectiveSibling',
  'distant',
];

// ─────────────────────────────────────────────────────────────────────
// LEGACY SLOT LIMITS - 4 category limits (backward compatibility)
// ─────────────────────────────────────────────────────────────────────

export const DEFAULT_SLOT_LIMITS: SlotLimits = {
  parent: 4,
  child: 4,
  sibling: 5,
  distant: 6,
};

const ADAPTIVE_SLOT_LIMITS: Record<'small' | 'medium' | 'large', SlotLimits> = {
  small: { parent: 6, child: 6, sibling: 6, distant: 8 },   // <20 docs
  medium: { parent: 4, child: 4, sibling: 4, distant: 4 },  // 20-50 docs
  large: { parent: 2, child: 2, sibling: 2, distant: 0 },   // >50 docs
};

export function getAdaptiveLimits(totalDocs: number): SlotLimits {
  if (totalDocs < 20) return ADAPTIVE_SLOT_LIMITS.small;
  if (totalDocs < 50) return ADAPTIVE_SLOT_LIMITS.medium;
  return ADAPTIVE_SLOT_LIMITS.large;
}

// ─────────────────────────────────────────────────────────────────────
// LENS CONFIGURATIONS - Switchable view modes
// ─────────────────────────────────────────────────────────────────────

export const LENS_CONFIGS: LensConfig[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'All relationships',
    icon: '◉',
    filter: () => true,
    sort: (a: Document, b: Document) => b.modifiedAt - a.modifiedAt,
    available: true,
  },
  {
    id: 'formula',
    name: 'Formula',
    description: 'Production lineage only',
    icon: '⚗',
    filter: (doc: Document, focus: Document) => {
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
    sort: (a: Document, b: Document, focus: Document) => {
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
    filter: (doc: Document, focus: Document) => {
      return doc.framework_ids.includes(focus.id) || doc.source_id === focus.id;
    },
    sort: (a: Document, b: Document) => b.modifiedAt - a.modifiedAt,
    available: true,
  },
  {
    id: 'lineage',
    name: 'Lineage',
    description: 'Parents and children',
    icon: '⬍',
    filter: (doc: Document, focus: Document) => {
      const isParent = focus.framework_ids.includes(doc.id) || focus.source_id === doc.id;
      const isChild = doc.framework_ids.includes(focus.id) || doc.source_id === focus.id;
      return isParent || isChild;
    },
    sort: (a: Document, b: Document) => b.modifiedAt - a.modifiedAt,
    available: true,
  },
  {
    id: 'channel',
    name: 'Channel',
    description: 'Same output channel',
    icon: '📺',
    filter: (doc: Document, focus: Document) => focus.output !== null && doc.output === focus.output,
    sort: (a: Document, b: Document) => b.modifiedAt - a.modifiedAt,
    available: true,
  },
  {
    id: 'perspective',
    name: 'Perspective',
    description: 'Same perspective cluster',
    icon: '👁',
    filter: (doc: Document, focus: Document) => focus.perspective !== null && doc.perspective === focus.perspective,
    sort: (a: Document, b: Document) => b.modifiedAt - a.modifiedAt,
    available: true,
  },
  {
    id: 'incubating',
    name: 'Incubating',
    description: 'Status = incubating',
    icon: '🥚',
    filter: (doc: Document) => doc.status === 'incubating',
    sort: (a: Document, b: Document) => a.createdAt - b.createdAt, // oldest first
    available: true,
  },
  {
    id: 'recent',
    name: 'Recent',
    description: 'Modified in last 7 days',
    icon: '🕐',
    filter: (doc: Document) => {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return doc.modifiedAt > sevenDaysAgo;
    },
    sort: (a: Document, b: Document) => b.modifiedAt - a.modifiedAt,
    available: true,
  },
  {
    id: 'framework',
    name: 'Frameworks',
    description: 'Framework documents only',
    icon: '⚙',
    filter: (doc: Document) => doc.type === 'framework',
    sort: (a: Document, b: Document) => {
      // toolkit before domain
      if (a.framework_kind !== b.framework_kind) {
        return a.framework_kind === 'toolkit' ? -1 : 1;
      }
      return a.title.localeCompare(b.title);
    },
    available: true,
  },
  {
    id: 'semantic',
    name: 'Semantic',
    description: 'AI-inferred similarity',
    icon: '🧠',
    filter: () => true,
    sort: (a: Document, b: Document) => b.modifiedAt - a.modifiedAt, // placeholder
    available: false, // Enable when embeddings are implemented
  },
];

export function getLensById(id: string): LensConfig {
  return LENS_CONFIGS.find(l => l.id === id) ?? LENS_CONFIGS[0];
}
