-- Fix Foreign Key Constraint ONLY
-- Run this script separately to add CASCADE DELETE to existing database

-- 1. Drop the existing foreign key constraint
alter table public.published_contents 
drop constraint if exists published_contents_project_id_fkey;

-- 2. Add the foreign key constraint with ON DELETE CASCADE
alter table public.published_contents
add constraint published_contents_project_id_fkey
foreign key (project_id)
references public.projects(id)
on delete cascade;

-- Done! Now projects can be deleted even if they have published contents.
