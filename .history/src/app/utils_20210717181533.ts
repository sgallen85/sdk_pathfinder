import { Vector3 } from "../mp/sdk";

/**
 * This module is for general helper interfaces, types, and methods.
 */

/**
 * Euclidean distance between two points.
 * @param {Vector3} p1 
 * @param {Vector3} p2 
 * @returns {number}
 */
export function distance(p1: Vector3, p2: Vector3): number {
  return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2 + (p1.z - p2.z)**2);
}

export interface Dict<V = any> {
  [key: string]: V;
}

export {};