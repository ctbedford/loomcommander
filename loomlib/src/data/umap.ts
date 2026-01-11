// UMAP projection for spatial canvas view
// Computes 2D coordinates from high-dimensional embeddings

import { UMAP } from 'umap-js';
import { forceSimulation, forceX, forceY } from 'd3-force';
import { bboxCollide } from 'd3-bboxCollide';
import type { UmapCoord } from '../types.ts';
import { getAllEmbeddings } from './db.ts';
import { getAllUmapCoords, putUmapCoordsBatch, clearUmapCoords } from './db.ts';

// UMAP parameters tuned for document clustering
const UMAP_CONFIG = {
  nNeighbors: 15,      // Local neighborhood size
  minDist: 0.1,        // Minimum distance between points
  nComponents: 2,      // Output dimensions (2D)
  spread: 1.0,         // Scale of embedded points
};

// Collision resolution parameters (in pixels, for ~1200x800 canvas)
const COLLISION_CONFIG = {
  nodeWidth: 180,      // Max width of document cards
  nodeHeight: 44,      // Approximate height of cards
  nodePadding: 8,      // Gap between cards
  ticks: 150,          // Simulation ticks to run
  strength: 0.8,       // Collision strength
  positionStrength: 0.1, // How strongly to preserve UMAP positions
};

// Hash embeddings to detect changes
function hashEmbeddings(embeddings: Map<string, number[]>): string {
  const ids = [...embeddings.keys()].sort();
  // Simple hash: count + sum of first element of each embedding
  let sum = 0;
  for (const id of ids) {
    const emb = embeddings.get(id);
    if (emb && emb.length > 0) {
      sum += emb[0];
    }
  }
  return `${ids.length}:${sum.toFixed(4)}`;
}

// Node interface for d3-force simulation
interface SimNode {
  x: number;
  y: number;
  targetX: number;  // Original UMAP position to gravitate toward
  targetY: number;
  vx?: number;
  vy?: number;
  index?: number;
}

/**
 * Resolve collisions using d3-force with bboxCollide
 * Uses rectangular bounding boxes for proper card collision
 */
function resolveCollisions(points: Array<{ x: number; y: number }>, canvasWidth: number, canvasHeight: number): void {
  const { nodeWidth, nodeHeight, nodePadding, ticks, strength, positionStrength } = COLLISION_CONFIG;

  // Half dimensions for bounding box (centered on node)
  const halfW = (nodeWidth + nodePadding) / 2;
  const halfH = (nodeHeight + nodePadding) / 2;

  // Create simulation nodes with pixel coordinates
  const nodes: SimNode[] = points.map(p => ({
    x: p.x * canvasWidth,
    y: p.y * canvasHeight,
    targetX: p.x * canvasWidth,
    targetY: p.y * canvasHeight,
  }));

  // Create bounding box collision force
  const collide = bboxCollide(() => [[-halfW, -halfH], [halfW, halfH]])
    .strength(strength)
    .iterations(2);

  // Create simulation with collision + weak position anchoring
  const simulation = forceSimulation<SimNode>(nodes)
    .force('collide', collide)
    .force('x', forceX<SimNode>((d: SimNode) => d.targetX).strength(positionStrength))
    .force('y', forceY<SimNode>((d: SimNode) => d.targetY).strength(positionStrength))
    .stop();

  // Run simulation synchronously
  for (let i = 0; i < ticks; i++) {
    simulation.tick();
  }

  // Copy results back (normalized)
  for (let i = 0; i < points.length; i++) {
    points[i].x = nodes[i].x / canvasWidth;
    points[i].y = nodes[i].y / canvasHeight;
  }
}

/**
 * Re-normalize points to [padding, 1-padding] range after collision resolution
 */
function renormalize(points: Array<{ x: number; y: number }>, padding = 0.02): void {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const targetRange = 1 - 2 * padding;

  for (const p of points) {
    p.x = padding + ((p.x - minX) / rangeX) * targetRange;
    p.y = padding + ((p.y - minY) / rangeY) * targetRange;
  }
}

// Store the hash of last computed embeddings
let lastEmbeddingHash: string | null = null;

/**
 * Check if UMAP coordinates are stale (embeddings changed)
 */
export async function isUmapStale(): Promise<boolean> {
  const embeddings = await getAllEmbeddings();
  const currentHash = hashEmbeddings(embeddings);

  if (lastEmbeddingHash === null) {
    // First check - see if we have cached coords
    const cachedCoords = await getAllUmapCoords();
    if (cachedCoords.size === 0) {
      return true; // No cache, need to compute
    }
    // Check if cached coords match current embeddings
    if (cachedCoords.size !== embeddings.size) {
      return true; // Different count
    }
    // Assume valid for now, update hash
    lastEmbeddingHash = currentHash;
    return false;
  }

  return currentHash !== lastEmbeddingHash;
}

/**
 * Compute UMAP projection from embeddings
 * Returns normalized coordinates in [0, 1] range
 */
export async function computeUmapCoords(): Promise<Map<string, UmapCoord>> {
  const embeddings = await getAllEmbeddings();

  if (embeddings.size < 2) {
    console.warn('[UMAP] Need at least 2 embeddings, got', embeddings.size);
    return new Map();
  }

  console.log(`[UMAP] Computing projection for ${embeddings.size} documents...`);
  const startTime = performance.now();

  // Convert Map to arrays for UMAP
  const docIds: string[] = [];
  const vectors: number[][] = [];

  for (const [id, embedding] of embeddings) {
    docIds.push(id);
    vectors.push(embedding);
  }

  // Run UMAP
  const umap = new UMAP({
    nNeighbors: Math.min(UMAP_CONFIG.nNeighbors, vectors.length - 1),
    minDist: UMAP_CONFIG.minDist,
    nComponents: UMAP_CONFIG.nComponents,
    spread: UMAP_CONFIG.spread,
  });

  const projected = umap.fit(vectors);

  // Find bounds for normalization
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (const [x, y] of projected) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  // Build initial normalized coords
  const points: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < docIds.length; i++) {
    const [x, y] = projected[i];
    points.push({
      x: (x - minX) / rangeX,
      y: (y - minY) / rangeY,
    });
  }

  // Resolve overlapping nodes using d3-force with bboxCollide
  // Calculate canvas size needed to fit all nodes with room to spare
  const { nodeWidth, nodeHeight, nodePadding } = COLLISION_CONFIG;
  const nodeArea = (nodeWidth + nodePadding) * (nodeHeight + nodePadding);
  const totalArea = docIds.length * nodeArea * 1.8; // 80% extra breathing room
  const aspectRatio = 1.5; // wider than tall
  const canvasHeight = Math.sqrt(totalArea / aspectRatio);
  const canvasWidth = canvasHeight * aspectRatio;
  console.log(`[UMAP] Resolving collisions: ${docIds.length} nodes, virtual canvas ${Math.round(canvasWidth)}×${Math.round(canvasHeight)}px`);
  resolveCollisions(points, canvasWidth, canvasHeight);
  renormalize(points);

  // Build final coords
  const now = Date.now();
  const coords = new Map<string, UmapCoord>();
  const coordsArray: UmapCoord[] = [];

  for (let i = 0; i < docIds.length; i++) {
    const coord: UmapCoord = {
      docId: docIds[i],
      x: points[i].x,
      y: points[i].y,
      updatedAt: now,
    };
    coords.set(docIds[i], coord);
    coordsArray.push(coord);
  }

  // Cache to IndexedDB
  await clearUmapCoords();
  await putUmapCoordsBatch(coordsArray);

  // Update hash
  lastEmbeddingHash = hashEmbeddings(embeddings);

  const elapsed = performance.now() - startTime;
  console.log(`[UMAP] Projection complete in ${elapsed.toFixed(0)}ms`);

  return coords;
}

/**
 * Get UMAP coordinates, computing if needed
 * Returns cached coords if available and not stale
 */
export async function getUmapCoords(): Promise<Map<string, UmapCoord>> {
  // Check if we need to recompute
  const stale = await isUmapStale();

  if (!stale) {
    const cached = await getAllUmapCoords();
    if (cached.size > 0) {
      console.log(`[UMAP] Using cached coords for ${cached.size} documents`);
      return cached;
    }
  }

  // Compute fresh
  return computeUmapCoords();
}

/**
 * Force recomputation of UMAP coordinates
 */
export async function recomputeUmapCoords(): Promise<Map<string, UmapCoord>> {
  lastEmbeddingHash = null;
  return computeUmapCoords();
}
