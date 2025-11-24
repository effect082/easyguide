-- Add user_id column to projects table
alter table public.projects 
add column if not exists user_id uuid references auth.users(id);

-- Update RLS policies for projects

-- 1. Drop existing policies (to avoid conflicts)
drop policy if exists "Allow public read access" on public.projects;
drop policy if exists "Allow public insert access" on public.projects;
drop policy if exists "Allow public update access" on public.projects;
drop policy if exists "Allow public delete access" on public.projects;

-- 2. Create new policies for authenticated users
create policy "Users can view their own projects" 
on public.projects for select 
using (auth.uid() = user_id);

create policy "Users can insert their own projects" 
on public.projects for insert 
with check (auth.uid() = user_id);

create policy "Users can update their own projects" 
on public.projects for update 
using (auth.uid() = user_id);

create policy "Users can delete their own projects" 
on public.projects for delete 
using (auth.uid() = user_id);

-- Note: published_contents remains public as per requirements (anyone can view published content)
-- But we might want to restrict who can publish (only the project owner)

-- Update RLS policies for published_contents
drop policy if exists "Allow public insert access" on public.published_contents;
drop policy if exists "Allow public update access" on public.published_contents;

-- Allow insert/update only if the user owns the project
create policy "Users can publish content for their projects" 
on public.published_contents for insert 
with check (
  exists (
    select 1 from public.projects 
    where id = project_id 
    and user_id = auth.uid()
  )
);

create policy "Users can update published content for their projects" 
on public.published_contents for update 
using (
  exists (
    select 1 from public.projects 
    where id = project_id 
    and user_id = auth.uid()
  )
);
