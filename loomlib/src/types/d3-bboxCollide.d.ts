// Type declarations for d3-bboxCollide
declare module 'd3-bboxCollide' {
  import { Force } from 'd3-force';

  // Bounding box: [[x1, y1], [x2, y2]] relative to node center
  type BBox = [[number, number], [number, number]];
  type BBoxAccessor<NodeDatum> = (node: NodeDatum, index: number, nodes: NodeDatum[]) => BBox;

  interface BBoxCollideForce<NodeDatum> extends Force<NodeDatum, never> {
    strength(): number;
    strength(strength: number): this;
    iterations(): number;
    iterations(iterations: number): this;
    bbox(): BBoxAccessor<NodeDatum>;
    bbox(bbox: BBox | BBoxAccessor<NodeDatum>): this;
  }

  export function bboxCollide<NodeDatum = any>(
    bbox?: BBox | BBoxAccessor<NodeDatum>
  ): BBoxCollideForce<NodeDatum>;
}
