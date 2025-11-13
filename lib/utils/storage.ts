import { SavedDiagram } from '@/types';

/**
 * Get all saved diagrams from the database via API
 */
export async function getAllDiagrams(): Promise<SavedDiagram[]> {
  if (typeof window === 'undefined') return [];

  try {
    const response = await fetch('/api/diagrams');
    if (!response.ok) {
      throw new Error('Failed to fetch diagrams');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to load diagrams:', error);
    return [];
  }
}

/**
 * Get a single diagram by ID from the database via API
 */
export async function getDiagram(id: string): Promise<SavedDiagram | null> {
  if (typeof window === 'undefined') return null;

  try {
    const response = await fetch(`/api/diagrams/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch diagram');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to load diagram:', error);
    return null;
  }
}

/**
 * Save a new diagram or update an existing one via API
 */
export async function saveDiagram(diagram: SavedDiagram): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const response = await fetch('/api/diagrams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(diagram),
    });

    if (!response.ok) {
      throw new Error('Failed to save diagram');
    }
  } catch (error) {
    console.error('Failed to save diagram:', error);
    throw error;
  }
}

/**
 * Delete a diagram by ID via API
 */
export async function deleteDiagram(id: string): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const response = await fetch(`/api/diagrams/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete diagram');
    }
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
