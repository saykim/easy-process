import { SavedDiagram } from '@/types';

const STORAGE_KEY = 'easy-process-diagrams';

/**
 * Get all saved diagrams from localStorage
 */
export function getAllDiagrams(): SavedDiagram[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load diagrams:', error);
    return [];
  }
}

/**
 * Get a single diagram by ID
 */
export function getDiagram(id: string): SavedDiagram | null {
  const diagrams = getAllDiagrams();
  return diagrams.find(d => d.id === id) || null;
}

/**
 * Save a new diagram or update an existing one
 */
export function saveDiagram(diagram: SavedDiagram): void {
  if (typeof window === 'undefined') return;

  try {
    const diagrams = getAllDiagrams();
    const existingIndex = diagrams.findIndex(d => d.id === diagram.id);

    if (existingIndex >= 0) {
      // Update existing - preserve createdAt from original
      diagrams[existingIndex] = {
        ...diagram,
        createdAt: diagrams[existingIndex].createdAt,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Add new
      diagrams.push({
        ...diagram,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
  } catch (error) {
    console.error('Failed to save diagram:', error);
    throw error;
  }
}

/**
 * Delete a diagram by ID
 */
export function deleteDiagram(id: string): void {
  if (typeof window === 'undefined') return;

  try {
    const diagrams = getAllDiagrams();
    const filtered = diagrams.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete diagram:', error);
    throw error;
  }
}

/**
 * Export diagram to JSON file
 */
export function exportDiagram(diagram: SavedDiagram): void {
  const dataStr = JSON.stringify(diagram, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${diagram.title.replace(/[^a-z0-9]/gi, '_')}_${diagram.id}.json`;
  link.click();

  URL.revokeObjectURL(url);
}
