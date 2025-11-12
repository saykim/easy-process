# Vercel PostgreSQL 설정 가이드

이 프로젝트는 Vercel PostgreSQL을 사용하여 다이어그램을 저장합니다.

## 📋 목차

1. [Vercel에 배포하기](#vercel에-배포하기)
2. [데이터베이스 생성하기](#데이터베이스-생성하기)
3. [데이터베이스 스키마 적용하기](#데이터베이스-스키마-적용하기)
4. [로컬 개발 환경 설정](#로컬-개발-환경-설정)
5. [테이블 구조](#테이블-구조)

---

## 🚀 Vercel에 배포하기

1. **Vercel에 프로젝트 연결**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Git 저장소에서 배포** (권장)
   - GitHub, GitLab, Bitbucket에 코드를 푸시
   - [Vercel Dashboard](https://vercel.com/dashboard)에서 프로젝트 임포트
   - 저장소 선택 후 배포

---

## 💾 데이터베이스 생성하기

### 1. Vercel Dashboard에서 데이터베이스 생성

1. [Vercel Dashboard](https://vercel.com/dashboard)로 이동
2. 프로젝트 선택
3. **Storage** 탭 클릭
4. **Create Database** 선택
5. **Postgres** 선택
6. 데이터베이스 이름 입력 (예: `easy-process-db`)
7. 지역 선택 (가까운 지역 권장)
8. **Create** 클릭

### 2. 프로젝트에 데이터베이스 연결

1. 생성된 데이터베이스 선택
2. **Connect Project** 클릭
3. 프로젝트 선택
4. 환경 변수가 자동으로 추가됩니다

---

## 📊 데이터베이스 스키마 적용하기

### 방법 1: Vercel Dashboard 사용 (가장 쉬운 방법)

1. Vercel Dashboard에서 데이터베이스 선택
2. **Query** 탭으로 이동
3. `lib/db/schema.sql` 파일의 내용을 복사
4. 쿼리 에디터에 붙여넣기
5. **Run Query** 클릭

### 방법 2: Vercel CLI 사용

```bash
# Vercel CLI 설치 (아직 설치하지 않은 경우)
npm install -g vercel

# 프로젝트 디렉토리에서 실행
vercel env pull .env.local

# psql 또는 다른 PostgreSQL 클라이언트 사용
psql $POSTGRES_URL < lib/db/schema.sql
```

---

## 🖥️ 로컬 개발 환경 설정

### 1. 환경 변수 가져오기

```bash
# Vercel CLI로 환경 변수 다운로드
vercel env pull .env.local
```

이 명령어는 Vercel에서 설정된 환경 변수를 `.env.local` 파일로 다운로드합니다.

### 2. 수동 설정 (선택사항)

Vercel Dashboard의 **Settings > Environment Variables**에서 환경 변수 값을 확인하고 `.env.local` 파일을 생성할 수 있습니다:

```bash
# .env.local 파일 생성
cp .env.example .env.local
```

그리고 Vercel Dashboard에서 복사한 값으로 채워넣습니다.

### 3. 로컬 서버 실행

```bash
npm run dev
```

---

## 📋 테이블 구조

### `diagrams` 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| `id` | VARCHAR(255) | 다이어그램 고유 ID (Primary Key) |
| `title` | VARCHAR(500) | 다이어그램 제목 |
| `description` | TEXT | 다이어그램 설명 (선택사항) |
| `nodes` | JSONB | 노드 데이터 (JSON 형식) |
| `edges` | JSONB | 엣지/연결 데이터 (JSON 형식) |
| `is_draft` | BOOLEAN | 임시저장 여부 |
| `created_at` | TIMESTAMP | 생성 시각 |
| `updated_at` | TIMESTAMP | 마지막 수정 시각 (자동 업데이트) |

### 인덱스

- `idx_diagrams_created_at`: 생성 날짜 기준 정렬
- `idx_diagrams_updated_at`: 수정 날짜 기준 정렬
- `idx_diagrams_is_draft`: 임시저장 필터링

---

## 🔧 문제 해결

### 데이터베이스 연결 오류

1. 환경 변수가 올바르게 설정되었는지 확인
   ```bash
   vercel env pull .env.local
   ```

2. Vercel 프로젝트에 데이터베이스가 연결되어 있는지 확인
   - Vercel Dashboard > Storage > Connect Project

### 스키마 오류

스키마를 다시 적용해야 하는 경우:

```sql
-- 테이블 삭제 (주의: 모든 데이터가 삭제됩니다!)
DROP TABLE IF EXISTS diagrams CASCADE;

-- 그리고 schema.sql 다시 실행
```

---

## 📚 추가 자료

- [Vercel Postgres 문서](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js와 Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres/quickstart)
- [@vercel/postgres SDK](https://vercel.com/docs/storage/vercel-postgres/sdk)

---

## 🎉 완료!

이제 Vercel PostgreSQL을 사용하여 다이어그램을 저장하고 불러올 수 있습니다.

- ✅ 데이터가 서버에 영구적으로 저장됩니다
- ✅ 여러 디바이스에서 접근 가능합니다
- ✅ 자동 백업 및 확장성 제공됩니다
