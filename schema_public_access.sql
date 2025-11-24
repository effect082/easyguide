-- Public Access Policies for Mobile Content Builder
-- This allows anyone to read and write content without authentication

-- 1. Enable RLS (if not already enabled)
alter table public.projects enable row level security;
alter table public.published_contents enable row level security;

-- 2. Drop all existing policies to replace with public access
drop policy if exists "Allow public read access" on public.projects;
drop policy if exists "Users can view their own projects" on public.projects;
drop policy if exists "Users can view their own or team projects" on public.projects;
drop policy if exists "Authenticated users can view all projects" on public.projects;
drop policy if exists "Users can insert their own projects" on public.projects;
drop policy if exists "Users can update their own projects" on public.projects;
drop policy if exists "Users can delete their own projects" on public.projects;

drop policy if exists "Allow public read access" on public.published_contents;
drop policy if exists "Users can publish content for their projects" on public.published_contents;

-- Note: Keeping user_id column in schema (not used by public policies)

-- 3. Create public access policies for projects
create policy "Anyone can view projects"
on public.projects for select
using (true);

create policy "Anyone can insert projects"
on public.projects for insert
with check (true);

create policy "Anyone can update projects"
on public.projects for update
using (true);

create policy "Anyone can delete projects"
on public.projects for delete
using (true);

-- 4. Create public access policies for published_contents
create policy "Anyone can view published content"
on public.published_contents for select
using (true);

create policy "Anyone can publish content"
on public.published_contents for insert
with check (true);

create policy "Anyone can update published content"
on public.published_contents for update
using (true);

create policy "Anyone can delete published content"
on public.published_contents for delete
using (true);
