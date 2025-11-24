-- Update RLS policies for projects to allow viewing 'Team' projects

-- Drop existing select policy
drop policy if exists "Users can view their own projects" on public.projects;

-- Create new select policy
create policy "Users can view their own or team projects" 
on public.projects for select 
using (
  auth.uid() = user_id 
  or 
  category = '팀'
);

-- Optional: Allow updating team projects? 
-- For now, let's keep update/delete restricted to the owner to prevent accidental deletions by others.
-- If collaborative editing is needed, we can update this later.
