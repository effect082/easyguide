-- Create projects table
create table public.projects (
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

-- Create published_contents table
create table public.published_contents (
  id text primary key,
  project_id text references public.projects(id),
  blocks jsonb default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb,
  published_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.published_contents enable row level security;

-- Create policies (for demonstration purposes, allowing public access)
-- In a real app, you'd want to restrict this based on user authentication
create policy "Allow public read access" on public.projects for select using (true);
create policy "Allow public insert access" on public.projects for insert with check (true);
create policy "Allow public update access" on public.projects for update using (true);
create policy "Allow public delete access" on public.projects for delete using (true);

create policy "Allow public read access" on public.published_contents for select using (true);
create policy "Allow public insert access" on public.published_contents for insert with check (true);
create policy "Allow public update access" on public.published_contents for update using (true);
