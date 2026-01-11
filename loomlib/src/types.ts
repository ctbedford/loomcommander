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

// Simplified 4-category types (now primary)
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

// ─────────────────────────────────────────────────────────────────────
// CONDUCTING FRONTMATTER - Production flow tracking
// ─────────────────────────────────────────────────────────────────────

// Intent: what kind of production is this?
export type DocumentIntent = 'research' | 'build' | 'capture' | 'organize' | 'produce';

// Execution state: where is this in its lifecycle?
export type ExecutionState = 'pending' | 'in_progress' | 'completed' | 'resolved';

// Upstream/downstream relation types
export type RelationType = 'informs' | 'method' | 'source' | 'prior' | 'defines';

// Upstream reference: what informed this document
export interface UpstreamRef {
  doc: string;
  relation: RelationType;
}

// Default intent by document type
export const DEFAULT_INTENT: Record<DocumentType, DocumentIntent> = {
  source: 'capture',
  note: 'capture',
  framework: 'build',
  instance: 'produce',
  index: 'organize',
};

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
  // Domain membership (for multi-domain support)
  domain?: string; // 'etymon' | 'studio' | etc. - optional for backward compat
  // Conducting fields (optional for backward compatibility)
  intent?: DocumentIntent;
  execution_state?: ExecutionState;
  upstream?: UpstreamRef[];
  downstream?: UpstreamRef[];
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
export type ViewMode = 'list' | 'constellation' | 'flow' | 'editor' | 'spatial' | 'deck';

// ─────────────────────────────────────────────────────────────────────
// DECK VIEW - Grid-based browsing with lens-based sorting
// ─────────────────────────────────────────────────────────────────────

export type DeckLens = 'type' | 'recency' | 'state' | 'intent' | 'lineage';

export const DECK_LENS_CONFIG: Record<DeckLens, { name: string; key: string; icon: string }> = {
  type: { name: 'Type', key: '1', icon: '◧' },
  recency: { name: 'Recency', key: '2', icon: '◔' },
  state: { name: 'State', key: '3', icon: '●' },
  intent: { name: 'Intent', key: '4', icon: '⚡' },
  lineage: { name: 'Lineage', key: '5', icon: '↗' },
};

// Sort orders for grouped lenses
export const TYPE_SORT_ORDER: DocumentType[] = ['framework', 'instance', 'source', 'note', 'index'];
export const STATE_SORT_ORDER: ExecutionState[] = ['in_progress', 'pending', 'completed', 'resolved'];
export const INTENT_SORT_ORDER: DocumentIntent[] = ['research', 'build', 'produce', 'capture', 'organize'];

// ─────────────────────────────────────────────────────────────────────
// SPATIAL VIEW - UMAP coordinates and overlays
// ─────────────────────────────────────────────────────────────────────

// UMAP-projected 2D coordinates
export interface UmapCoord {
  docId: string;
  x: number;
  y: number;
  updatedAt: number;
}

// Overlay types for spatial view
export type OverlayId = 'type' | 'state' | 'intent' | 'recency' | 'lineage';

// Viewport state for pan/zoom
export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

// Type metadata for UI
export const TYPE_ICONS: Record<DocumentType, string> = {
  framework: '⚙', // toolkit uses same, domain uses ▣
  instance: '◧',
  note: '○',
  source: '◈',
  index: '☰',
};

// Intent icons for conducting frontmatter
export const INTENT_ICONS: Record<DocumentIntent, string> = {
  research: '🔬',
  build: '🔨',
  capture: '📝',
  organize: '📁',
  produce: '⚡',
};

// Execution state display
export const EXECUTION_STATE_DOTS: Record<ExecutionState, string> = {
  pending: '○○○○',
  in_progress: '●●○○',
  completed: '●●●●',
  resolved: '✓',
};

// Get intent icon for document
export function getIntentIcon(doc: Document): string {
  return INTENT_ICONS[doc.intent ?? DEFAULT_INTENT[doc.type]];
}

// Get execution state dots for document
export function getExecutionDots(doc: Document): string {
  return EXECUTION_STATE_DOTS[doc.execution_state ?? 'pending'];
}

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

// Get current domain from env (defaults to 'etymon')
export function getCurrentDomain(): string {
  return (import.meta.env.VITE_LOOMLIB_DOMAIN as string) ?? 'etymon';
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
    // Domain membership
    domain: getCurrentDomain(),
    // Conducting defaults
    intent: DEFAULT_INTENT[type],
    execution_state: 'pending',
    upstream: [],
    downstream: [],
  };
}

// Derive title from content (first line, fallback to 'Untitled')
export function deriveTitle(content: string): string {
  const firstLine = content.split('\n')[0].trim();
  // Remove markdown heading prefix
  const title = firstLine.replace(/^#+\s*/, '');
  return title || 'Untitled';
}
