-- Fix Foreign Key Constraint to Allow Cascade Delete
-- This allows projects to be deleted even if they have published contents

-- 1. Drop the existing foreign key constraint
alter table public.published_contents 
drop constraint if exists published_contents_project_id_fkey;

-- 2. Add the foreign key constraint with ON DELETE CASCADE
-- When a project is deleted, all its published contents will be automatically deleted
alter table public.published_contents
add constraint published_contents_project_id_fkey
foreign key (project_id)
references public.projects(id)
on delete cascade;
