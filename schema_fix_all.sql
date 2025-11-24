-- COMPREHENSIVE FIX SCRIPT
-- This script will:
-- 1. Create tables if they are missing
-- 2. Add necessary columns
-- 3. Set up correct permissions (Global Visibility)

-- 1. Create projects table if it doesn't exist
create table if not exists public.projects (
  id text primary key,
  title text not null,
  category text,
  type text,
  password text,
  author text,
  blocks jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create published_contents table if it doesn't exist
create table if not exists public.published_contents (
  id text primary key,
  project_id text references public.projects(id),
  blocks jsonb default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb,
  published_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Add user_id column to projects if missing
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_name = 'projects' and column_name = 'user_id') then
    alter table public.projects add column user_id uuid references auth.users(id);
  end if;
end $$;

-- 4. Enable RLS
alter table public.projects enable row level security;
alter table public.published_contents enable row level security;

-- 5. RESET & APPLY POLICIES

-- Drop all existing policies to ensure a clean slate
drop policy if exists "Allow public read access" on public.projects;
drop policy if exists "Allow public insert access" on public.projects;
drop policy if exists "Allow public update access" on public.projects;
drop policy if exists "Allow public delete access" on public.projects;
drop policy if exists "Users can view their own projects" on public.projects;
drop policy if exists "Users can view their own or team projects" on public.projects;
drop policy if exists "Authenticated users can view all projects" on public.projects;
drop policy if exists "Users can insert their own projects" on public.projects;
drop policy if exists "Users can update their own projects" on public.projects;
drop policy if exists "Users can delete their own projects" on public.projects;

-- Projects: VIEW (Global - All authenticated users can see everything)
create policy "Authenticated users can view all projects" 
on public.projects for select 
to authenticated
using (true);

-- Projects: INSERT (Owner only)
create policy "Users can insert their own projects" 
on public.projects for insert 
with check (auth.uid() = user_id);

-- Projects: UPDATE (Owner only)
create policy "Users can update their own projects" 
on public.projects for update 
using (auth.uid() = user_id);

-- Projects: DELETE (Owner only)
create policy "Users can delete their own projects" 
on public.projects for delete 
using (auth.uid() = user_id);

-- Published Contents: VIEW (Public - Everyone can see)
drop policy if exists "Allow public read access" on public.published_contents;
create policy "Allow public read access" on public.published_contents for select using (true);

-- Published Contents: INSERT/UPDATE (Project Owner only)
drop policy if exists "Users can publish content for their projects" on public.published_contents;
create policy "Users can publish content for their projects" 
on public.published_contents for insert 
with check (
  exists (
    select 1 from public.projects 
    where id = project_id 
    and user_id = auth.uid()
  )
);

drop policy if exists "Users can update published content for their projects" on public.published_contents;
create policy "Users can update published content for their projects" 
on public.published_contents for update 
using (
  exists (
    select 1 from public.projects 
    where id = project_id 
    and user_id = auth.uid()
  )
);
