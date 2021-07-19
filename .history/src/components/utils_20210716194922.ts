/**
 * This module is for general helper interfaces, types, and functions.
 */

/**
 * Interface for all types of 3D points, not just Vector3.
 */
export interface Point3 {
  x: number;
  y: number;
  z: number;
}

export function distance(p1: Point3, p2: Point3): number {
  // Euclidean distance between two points
  return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2 + (p1.z - p2.z)**2);
}

export {};