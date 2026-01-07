// Document types
export type DocumentType = 'source' | 'note' | 'framework' | 'instance' | 'index';

// ─────────────────────────────────────────────────────────────────────
// SEMANTIC RELATIONSHIP CATEGORIES - 8 distinct relationship types
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

export interface SemanticSlotState {
  category: SemanticCategory;
  docs: Document[];
  visibleStart: number;
  maxVisible: number;
  totalCount: number;
}

// Legacy 4-category types (kept for backward compatibility)
export type RelationshipCategory = 'parent' | 'child' | 'sibling' | 'distant';

export interface SlotState {
  category: RelationshipCategory;
  docs: Document[];
  visibleStart: number;
  maxVisible: number;
  totalCount: number;
}

export interface SlotLimits {
  parent: number;
  child: number;
  sibling: number;
  distant: number;
}

// ─────────────────────────────────────────────────────────────────────
// LENS SYSTEM - Switchable view modes
// ─────────────────────────────────────────────────────────────────────

export type LensId =
  | 'default'
  | 'formula'       // production lineage only
  | 'production'    // what this framework produced
  | 'lineage'
  | 'channel'
  | 'perspective'
  | 'incubating'
  | 'recent'
  | 'framework'
  | 'semantic';

export interface LensConfig {
  id: LensId;
  name: string;
  description: string;
  icon: string;
  filter: (doc: Document, focus: Document) => boolean;
  sort: (a: Document, b: Document, focus: Document) => number;
  available: boolean;
}

// Framework subtypes
export type FrameworkKind = 'toolkit' | 'domain';

// Document status
export type DocumentStatus = 'incubating' | 'draft' | 'verified' | 'captured';

// Depth layers for constellation view
export type DepthLayer = 'focus' | 'context' | 'distant';

// Core document interface
export interface Document {
  id: string;
  title: string;
  content: string;
  type: DocumentType;
  framework_kind: FrameworkKind | null;
  perspective: string | null;
  framework_ids: string[];
  source_id: string | null;
  output: string | null;
  status: DocumentStatus;
  tags: string[];
  createdAt: number;
  modifiedAt: number;
}

// Graph node for constellation view
export interface GraphNode {
  doc: Document;
  x: number;
  y: number;
  layer: DepthLayer;
}

// Graph edge (tether) between instance and framework
export interface GraphEdge {
  source: string; // instance id
  target: string; // framework id
}

// View states
export type ViewMode = 'list' | 'constellation' | 'editor';

// Type metadata for UI
export const TYPE_ICONS: Record<DocumentType, string> = {
  framework: '⚙', // toolkit uses same, domain uses ▣
  instance: '◧',
  note: '○',
  source: '◈',
  index: '☰',
};

export const TYPE_COLORS: Record<DocumentType, string> = {
  framework: '#7BA3C9', // pale blue
  instance: '#C9A67B',  // warm amber
  note: '#8A8A8A',      // neutral gray
  source: '#7BC98A',    // soft green
  index: '#C9C9C9',     // silver
};

// Get icon for document (handles framework subtypes)
export function getDocumentIcon(doc: Document): string {
  if (doc.type === 'framework') {
    return doc.framework_kind === 'domain' ? '▣' : '⚙';
  }
  return TYPE_ICONS[doc.type];
}

// Get color for document type
export function getDocumentColor(doc: Document): string {
  return TYPE_COLORS[doc.type];
}

// Create a new document with defaults
export function createEmptyDocument(type: DocumentType = 'note'): Document {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: '',
    content: '',
    type,
    framework_kind: type === 'framework' ? 'toolkit' : null,
    perspective: null,
    framework_ids: [],
    source_id: null,
    output: null,
    status: 'incubating',
    tags: [],
    createdAt: now,
    modifiedAt: now,
  };
}

// Derive title from content (first line, fallback to 'Untitled')
export function deriveTitle(content: string): string {
  const firstLine = content.split('\n')[0].trim();
  // Remove markdown heading prefix
  const title = firstLine.replace(/^#+\s*/, '');
  return title || 'Untitled';
}
