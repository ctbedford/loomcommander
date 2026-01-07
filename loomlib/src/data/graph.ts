import type {
  Document,
  GraphNode,
  GraphEdge,
  DepthLayer,
  RelationshipCategory,
  SlotLimits,
  SemanticCategory,
  SemanticSlotLimits,
  SemanticCategorizedDocs,
  ProductionFormula,
} from '../types.ts';

// Compute edges from framework_ids relationships
export function computeEdges(docs: Document[]): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const docIds = new Set(docs.map((d) => d.id));

  for (const doc of docs) {
    // Instance -> Framework edges
    for (const frameworkId of doc.framework_ids) {
      if (docIds.has(frameworkId)) {
        edges.push({ source: doc.id, target: frameworkId });
      }
    }
    // Note -> Source edge
    if (doc.source_id && docIds.has(doc.source_id)) {
      edges.push({ source: doc.id, target: doc.source_id });
    }
  }

  return edges;
}

// Compute layer assignments based on focus
export function computeLayers(
  docs: Document[],
  focusedId: string | null
): Map<string, DepthLayer> {
  const layers = new Map<string, DepthLayer>();

  if (!focusedId) {
    // No focus - all documents are context
    for (const doc of docs) {
      layers.set(doc.id, 'context');
    }
    return layers;
  }

  const focusDoc = docs.find((d) => d.id === focusedId);
  if (!focusDoc) {
    for (const doc of docs) {
      layers.set(doc.id, 'context');
    }
    return layers;
  }

  // Build lookup maps
  const docMap = new Map(docs.map((d) => [d.id, d]));

  // Sets for each layer
  const contextIds = new Set<string>();

  // Focus document
  layers.set(focusedId, 'focus');

  // Parents: documents that focus references via framework_ids or source_id
  for (const frameworkId of focusDoc.framework_ids) {
    if (docMap.has(frameworkId)) {
      contextIds.add(frameworkId);
    }
  }
  if (focusDoc.source_id && docMap.has(focusDoc.source_id)) {
    contextIds.add(focusDoc.source_id);
  }

  // Children: documents whose framework_ids include focus's id
  for (const doc of docs) {
    if (doc.framework_ids.includes(focusedId)) {
      contextIds.add(doc.id);
    }
    // Also include notes that reference focus as source
    if (doc.source_id === focusedId) {
      contextIds.add(doc.id);
    }
  }

  // Siblings: same perspective or same output channel
  for (const doc of docs) {
    if (doc.id === focusedId) continue;
    const samePerspective = focusDoc.perspective && doc.perspective === focusDoc.perspective;
    const sameOutput = focusDoc.output && doc.output === focusDoc.output;
    if (samePerspective || sameOutput) {
      contextIds.add(doc.id);
    }
  }

  // Assign context layer
  for (const id of contextIds) {
    if (id !== focusedId) {
      layers.set(id, 'context');
    }
  }

  // Everything else is distant
  for (const doc of docs) {
    if (!layers.has(doc.id)) {
      layers.set(doc.id, 'distant');
    }
  }

  return layers;
}

// Position type for layout
interface Position {
  x: number;
  y: number;
}

// Compute positions for constellation layout
export function computePositions(
  docs: Document[],
  focusedId: string | null,
  width: number,
  height: number
): Map<string, Position> {
  const positions = new Map<string, Position>();

  if (docs.length === 0) return positions;

  const centerX = width / 2;
  const centerY = height / 2;

  if (!focusedId) {
    // No focus - arrange in a circle
    const radius = Math.min(width, height) * 0.35;
    docs.forEach((doc, i) => {
      const angle = (2 * Math.PI * i) / docs.length - Math.PI / 2;
      positions.set(doc.id, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    });
    return positions;
  }

  const focusDoc = docs.find((d) => d.id === focusedId);
  if (!focusDoc) return positions;

  // Focus at center
  positions.set(focusedId, { x: centerX, y: centerY });

  // Categorize documents
  const toolkitParents: Document[] = [];
  const domainParents: Document[] = [];
  const sourceParents: Document[] = [];
  const children: Document[] = [];
  const siblings: Document[] = [];
  const distant: Document[] = [];

  for (const doc of docs) {
    if (doc.id === focusedId) continue;

    const isParent = focusDoc.framework_ids.includes(doc.id);
    const isSourceParent = focusDoc.source_id === doc.id;
    const isChild = doc.framework_ids.includes(focusedId) || doc.source_id === focusedId;
    const isSibling =
      (focusDoc.perspective && doc.perspective === focusDoc.perspective) ||
      (focusDoc.output && doc.output === focusDoc.output);

    if (isParent) {
      if (doc.framework_kind === 'domain') {
        domainParents.push(doc);
      } else {
        toolkitParents.push(doc);
      }
    } else if (isSourceParent) {
      sourceParents.push(doc);
    } else if (isChild) {
      children.push(doc);
    } else if (isSibling) {
      siblings.push(doc);
    } else {
      distant.push(doc);
    }
  }

  // Position toolkit parents (above-left)
  const parentY = centerY - height * 0.3;
  toolkitParents.forEach((doc, i) => {
    const spread = Math.min(100, width * 0.15);
    const x = centerX - width * 0.2 - (toolkitParents.length - 1 - i) * spread;
    positions.set(doc.id, { x, y: parentY });
  });

  // Position domain parents (above-right)
  domainParents.forEach((doc, i) => {
    const spread = Math.min(100, width * 0.15);
    const x = centerX + width * 0.2 + i * spread;
    positions.set(doc.id, { x, y: parentY });
  });

  // Position source parents (above-center)
  sourceParents.forEach((doc, i) => {
    const spread = Math.min(80, width * 0.1);
    const x = centerX + (i - (sourceParents.length - 1) / 2) * spread;
    positions.set(doc.id, { x, y: parentY - 50 });
  });

  // Position children (below)
  const childY = centerY + height * 0.3;
  children.forEach((doc, i) => {
    const spread = Math.min(120, width * 0.2);
    const x = centerX + (i - (children.length - 1) / 2) * spread;
    positions.set(doc.id, { x, y: childY });
  });

  // Position siblings (ring around focus)
  const siblingRadius = Math.min(width, height) * 0.2;
  siblings.forEach((doc, i) => {
    const angle = (2 * Math.PI * i) / siblings.length - Math.PI / 2;
    positions.set(doc.id, {
      x: centerX + siblingRadius * Math.cos(angle),
      y: centerY + siblingRadius * Math.sin(angle),
    });
  });

  // Position distant (outer ring / periphery)
  const distantRadius = Math.min(width, height) * 0.4;
  distant.forEach((doc, i) => {
    const angle = (2 * Math.PI * i) / distant.length;
    positions.set(doc.id, {
      x: centerX + distantRadius * Math.cos(angle),
      y: centerY + distantRadius * Math.sin(angle),
    });
  });

  return positions;
}

// Compute full graph nodes with positions and layers
export function computeGraph(
  docs: Document[],
  focusedId: string | null,
  width: number,
  height: number
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const layers = computeLayers(docs, focusedId);
  const positions = computePositions(docs, focusedId, width, height);
  const edges = computeEdges(docs);

  const nodes: GraphNode[] = docs.map((doc) => ({
    doc,
    x: positions.get(doc.id)?.x ?? width / 2,
    y: positions.get(doc.id)?.y ?? height / 2,
    layer: layers.get(doc.id) ?? 'distant',
  }));

  return { nodes, edges };
}

// Get related documents for a focused document
export interface RelatedDocs {
  parents: Document[];      // Frameworks/sources this doc references
  children: Document[];     // Docs that reference this doc
  siblings: Document[];     // Same perspective or output
}

export function getRelatedDocs(
  docs: Document[],
  focusedId: string
): RelatedDocs {
  const focusDoc = docs.find((d) => d.id === focusedId);
  if (!focusDoc) {
    return { parents: [], children: [], siblings: [] };
  }

  const docMap = new Map(docs.map((d) => [d.id, d]));

  const parents: Document[] = [];
  const children: Document[] = [];
  const siblings: Document[] = [];

  // Parents
  for (const frameworkId of focusDoc.framework_ids) {
    const parent = docMap.get(frameworkId);
    if (parent) parents.push(parent);
  }
  if (focusDoc.source_id) {
    const source = docMap.get(focusDoc.source_id);
    if (source) parents.push(source);
  }

  // Children and siblings
  for (const doc of docs) {
    if (doc.id === focusedId) continue;

    if (doc.framework_ids.includes(focusedId) || doc.source_id === focusedId) {
      children.push(doc);
    } else if (
      (focusDoc.perspective && doc.perspective === focusDoc.perspective) ||
      (focusDoc.output && doc.output === focusDoc.output)
    ) {
      if (!parents.some((p) => p.id === doc.id)) {
        siblings.push(doc);
      }
    }
  }

  return { parents, children, siblings };
}

// ─────────────────────────────────────────────────────────────────────
// SLOT SYSTEM - Categorize docs for pagination
// ─────────────────────────────────────────────────────────────────────

export interface CategorizedDocs {
  parent: Document[];   // toolkit + domain + source parents
  child: Document[];
  sibling: Document[];
  distant: Document[];
}

export function categorizeDocs(
  docs: Document[],
  focusedId: string | null
): CategorizedDocs {
  const result: CategorizedDocs = {
    parent: [],
    child: [],
    sibling: [],
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

  for (const doc of docs) {
    if (doc.id === focusedId) continue;

    const isParent =
      focusDoc.framework_ids.includes(doc.id) ||
      focusDoc.source_id === doc.id;

    const isChild =
      doc.framework_ids.includes(focusedId) ||
      doc.source_id === focusedId;

    const isSibling =
      (focusDoc.perspective && doc.perspective === focusDoc.perspective) ||
      (focusDoc.output && doc.output === focusDoc.output);

    if (isParent) {
      result.parent.push(doc);
    } else if (isChild) {
      result.child.push(doc);
    } else if (isSibling) {
      result.sibling.push(doc);
    } else {
      result.distant.push(doc);
    }
  }

  // Sort each category by modifiedAt desc
  const sortByModified = (a: Document, b: Document) => b.modifiedAt - a.modifiedAt;
  result.parent.sort(sortByModified);
  result.child.sort(sortByModified);
  result.sibling.sort(sortByModified);
  result.distant.sort(sortByModified);

  return result;
}

export function computeVisibleDocs(
  categorized: CategorizedDocs,
  limits: SlotLimits,
  offsets: Record<RelationshipCategory, number>
): CategorizedDocs {
  return {
    parent: categorized.parent.slice(
      offsets.parent,
      offsets.parent + limits.parent
    ),
    child: categorized.child.slice(
      offsets.child,
      offsets.child + limits.child
    ),
    sibling: categorized.sibling.slice(
      offsets.sibling,
      offsets.sibling + limits.sibling
    ),
    distant: categorized.distant.slice(
      offsets.distant,
      offsets.distant + limits.distant
    ),
  };
}

// ─────────────────────────────────────────────────────────────────────
// SEMANTIC CATEGORIZATION - 8 distinct relationship types
// ─────────────────────────────────────────────────────────────────────

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

export function computeVisibleDocsSemantic(
  categorized: SemanticCategorizedDocs,
  limits: SemanticSlotLimits,
  offsets: Record<SemanticCategory, number>
): SemanticCategorizedDocs {
  return {
    toolkitParent: categorized.toolkitParent.slice(
      offsets.toolkitParent,
      offsets.toolkitParent + limits.toolkitParent
    ),
    domainParent: categorized.domainParent.slice(
      offsets.domainParent,
      offsets.domainParent + limits.domainParent
    ),
    sourceParent: categorized.sourceParent.slice(
      offsets.sourceParent,
      offsets.sourceParent + limits.sourceParent
    ),
    child: categorized.child.slice(
      offsets.child,
      offsets.child + limits.child
    ),
    formulaSibling: categorized.formulaSibling.slice(
      offsets.formulaSibling,
      offsets.formulaSibling + limits.formulaSibling
    ),
    channelSibling: categorized.channelSibling.slice(
      offsets.channelSibling,
      offsets.channelSibling + limits.channelSibling
    ),
    perspectiveSibling: categorized.perspectiveSibling.slice(
      offsets.perspectiveSibling,
      offsets.perspectiveSibling + limits.perspectiveSibling
    ),
    distant: categorized.distant.slice(
      offsets.distant,
      offsets.distant + limits.distant
    ),
  };
}
