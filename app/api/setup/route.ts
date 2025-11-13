import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * GET /api/setup
 * 데이터베이스 테이블을 자동으로 생성합니다.
 * 배포 후 딱 한 번만 실행하면 됩니다!
 */
export async function GET() {
  try {
    // 1. diagrams 테이블 생성
    await sql`
      CREATE TABLE IF NOT EXISTS diagrams (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
        edges JSONB NOT NULL DEFAULT '[]'::jsonb,
        is_draft BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `;

    // 2. 인덱스 생성 (검색 속도 향상)
    await sql`CREATE INDEX IF NOT EXISTS idx_diagrams_created_at ON diagrams(created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_diagrams_updated_at ON diagrams(updated_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_diagrams_is_draft ON diagrams(is_draft)`;

    // 3. 자동 업데이트 트리거 함수 생성
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;

    // 4. 트리거 생성
    await sql`
      DROP TRIGGER IF EXISTS update_diagrams_updated_at ON diagrams;
    `;

    await sql`
      CREATE TRIGGER update_diagrams_updated_at
        BEFORE UPDATE ON diagrams
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `;

    // 5. 테이블 확인
    const { rows } = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'diagrams'
    `;

    return NextResponse.json({
      success: true,
      message: '✅ 데이터베이스 설정이 완료되었습니다!',
      details: {
        tablesCreated: ['diagrams'],
        indexesCreated: [
          'idx_diagrams_created_at',
          'idx_diagrams_updated_at',
          'idx_diagrams_is_draft'
        ],
        triggersCreated: ['update_diagrams_updated_at'],
        tableExists: rows.length > 0
      }
    });
  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      },
      { status: 500 }
    );
  }
}
