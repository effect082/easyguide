-- Update RLS policies for projects to allow viewing ALL projects for authenticated users

-- Drop existing select policy
drop policy if exists "Users can view their own or team projects" on public.projects;
drop policy if exists "Users can view their own projects" on public.projects;

-- Create new select policy: Allow authenticated users to view ALL projects
create policy "Authenticated users can view all projects" 
on public.projects for select 
to authenticated
using (true);

-- Note: Update/Delete policies remain restricted to the owner (user_id = auth.uid())
-- This allows "Integrated Management" (Viewing) without risking data integrity.
