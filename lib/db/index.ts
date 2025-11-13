import { sql } from '@vercel/postgres';
import { SavedDiagram } from '@/types';

/**
 * Get all diagrams from the database
 */
export async function getAllDiagramsFromDB(): Promise<SavedDiagram[]> {
  try {
    const { rows } = await sql`
      SELECT
        id,
        title,
        description,
        nodes,
        edges,
        is_draft as "isDraft",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM diagrams
      ORDER BY updated_at DESC
    `;

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      nodes: row.nodes,
      edges: row.edges,
      isDraft: row.isDraft,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch diagrams from database:', error);
    throw error;
  }
}

/**
 * Get a single diagram by ID from the database
 */
export async function getDiagramFromDB(id: string): Promise<SavedDiagram | null> {
  try {
    const { rows } = await sql`
      SELECT
        id,
        title,
        description,
        nodes,
        edges,
        is_draft as "isDraft",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM diagrams
      WHERE id = ${id}
    `;

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description || '',
      nodes: row.nodes,
      edges: row.edges,
      isDraft: row.isDraft,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Failed to fetch diagram from database:', error);
    throw error;
  }
}

/**
 * Save a diagram to the database (insert or update)
 */
export async function saveDiagramToDB(diagram: SavedDiagram): Promise<SavedDiagram> {
  try {
    const { rows } = await sql`
      INSERT INTO diagrams (id, title, description, nodes, edges, is_draft, created_at, updated_at)
      VALUES (
        ${diagram.id},
        ${diagram.title},
        ${diagram.description || ''},
        ${JSON.stringify(diagram.nodes)}::jsonb,
        ${JSON.stringify(diagram.edges)}::jsonb,
        ${diagram.isDraft},
        ${diagram.createdAt || new Date().toISOString()},
        ${new Date().toISOString()}
      )
      ON CONFLICT (id)
      DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        nodes = EXCLUDED.nodes,
        edges = EXCLUDED.edges,
        is_draft = EXCLUDED.is_draft,
        updated_at = EXCLUDED.updated_at
      RETURNING
        id,
        title,
        description,
        nodes,
        edges,
        is_draft as "isDraft",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    const row = rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description || '',
      nodes: row.nodes,
      edges: row.edges,
      isDraft: row.isDraft,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Failed to save diagram to database:', error);
    throw error;
  }
}

/**
 * Delete a diagram from the database
 */
export async function deleteDiagramFromDB(id: string): Promise<void> {
  try {
    await sql`
      DELETE FROM diagrams
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Failed to delete diagram from database:', error);
    throw error;
  }
}
