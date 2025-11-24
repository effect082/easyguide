# Supabase 백엔드 설정 가이드

이 문서는 모바일 콘텐츠 빌더에 **Supabase** 데이터베이스를 연동하는 방법을 설명합니다.
현재는 기본적으로 **로컬 스토리지(브라우저 저장소)**를 사용하도록 설정되어 있습니다. 데이터베이스를 연동하면 기기 간 데이터 동기화와 영구적인 데이터 보관이 가능해집니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com/)에 가입하고 로그인합니다.
2. **New Project**를 클릭하여 새 프로젝트를 생성합니다.
3. 프로젝트 이름, 비밀번호, 리전(Seoul 추천)을 설정하고 생성합니다.

## 2. 테이블 생성

프로젝트 대시보드의 **SQL Editor** 메뉴로 이동하여 아래 SQL 코드를 복사해 붙여넣고 **Run**을 클릭합니다.

```sql
-- 프로젝트 테이블 생성
create table projects (
  id text primary key,
  title text not null,
  category text,
  type text,
  password text,
  author text,
  blocks jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 게시된 콘텐츠 테이블 생성
create table published_contents (
  id text primary key,
  project_id text references projects(id),
  blocks jsonb,
  metadata jsonb,
  published_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) 설정 (선택 사항: 누구나 읽기/쓰기 가능하게 설정)
alter table projects enable row level security;
alter table published_contents enable row level security;

create policy "Enable read access for all users" on projects for select using (true);
create policy "Enable insert access for all users" on projects for insert with check (true);
create policy "Enable update access for all users" on projects for update using (true);
create policy "Enable delete access for all users" on projects for delete using (true);

create policy "Enable read access for all users" on published_contents for select using (true);
create policy "Enable insert access for all users" on published_contents for insert with check (true);
create policy "Enable update access for all users" on published_contents for update using (true);
```

> **주의**: 위 설정은 모든 사용자가 데이터를 읽고 쓸 수 있게 허용합니다. 실제 서비스 운영 시에는 인증 기능을 추가하고 보안 정책을 강화해야 합니다.

## 3. 환경 변수 설정

1. 프로젝트 루트 디렉토리에 `.env` 파일을 생성합니다. (이미 있다면 내용을 추가합니다.)
2. Supabase 대시보드에서 **Project Settings > API**로 이동합니다.
3. **Project URL**과 **anon public key**를 복사하여 아래와 같이 `.env` 파일에 입력합니다.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_USE_SUPABASE=true
```

- `VITE_USE_SUPABASE=true`로 설정하면 앱이 Supabase를 사용하기 시작합니다.
- 다시 로컬 스토리지를 사용하려면 `false`로 변경하거나 해당 줄을 삭제하세요.

## 4. 앱 재시작

설정을 완료한 후 개발 서버를 재시작합니다.

```bash
npm run dev
```

이제 앱이 Supabase 데이터베이스와 연동되어 동작합니다!
