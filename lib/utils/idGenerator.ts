/**
 * Generates a unique ID for nodes and edges
 * Uses combination of timestamp and random value to prevent collisions
 */
let idCounter = 0;

export function generateNodeId(): string {
  idCounter = (idCounter + 1) % 10000;
  return `node-${Date.now()}-${idCounter}`;
}

export function generateEdgeId(): string {
  idCounter = (idCounter + 1) % 10000;
  return `edge-${Date.now()}-${idCounter}`;
}

/**
 * Resets the ID counter (useful for testing)
 */
export function resetIdCounter(): void {
  idCounter = 0;
}
