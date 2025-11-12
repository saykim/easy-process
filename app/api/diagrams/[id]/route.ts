import { NextRequest, NextResponse } from 'next/server';
import { getDiagramFromDB, deleteDiagramFromDB } from '@/lib/db';

/**
 * GET /api/diagrams/[id]
 * Get a single diagram by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const diagram = await getDiagramFromDB(id);

    if (!diagram) {
      return NextResponse.json(
        { error: 'Diagram not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(diagram);
  } catch (error) {
    console.error('GET /api/diagrams/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diagram' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/diagrams/[id]
 * Delete a diagram by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteDiagramFromDB(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/diagrams/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete diagram' },
      { status: 500 }
    );
  }
}
