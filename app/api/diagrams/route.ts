import { NextRequest, NextResponse } from 'next/server';
import { getAllDiagramsFromDB, saveDiagramToDB } from '@/lib/db';
import { SavedDiagram } from '@/types';

/**
 * GET /api/diagrams
 * Get all saved diagrams
 */
export async function GET() {
  try {
    const diagrams = await getAllDiagramsFromDB();
    return NextResponse.json(diagrams);
  } catch (error) {
    console.error('GET /api/diagrams error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diagrams' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/diagrams
 * Save a new diagram or update an existing one
 */
export async function POST(request: NextRequest) {
  try {
    const diagram: SavedDiagram = await request.json();

    // Validate required fields
    if (!diagram.id || !diagram.title) {
      return NextResponse.json(
        { error: 'Missing required fields: id, title' },
        { status: 400 }
      );
    }

    const savedDiagram = await saveDiagramToDB(diagram);
    return NextResponse.json(savedDiagram);
  } catch (error) {
    console.error('POST /api/diagrams error:', error);
    return NextResponse.json(
      { error: 'Failed to save diagram' },
      { status: 500 }
    );
  }
}
