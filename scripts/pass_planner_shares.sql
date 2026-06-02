create table if not exists public.pass_planner_books (
  id text primary key,
  read_token text unique,
  city text not null,
  items jsonb not null default '[]'::jsonb,
  notes jsonb not null default '{}'::jsonb,
  custom_places jsonb not null default '{}'::jsonb,
  user_links jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null
);

alter table public.pass_planner_books
  add column if not exists read_token text,
  add column if not exists city text,
  add column if not exists items jsonb not null default '[]'::jsonb,
  add column if not exists notes jsonb not null default '{}'::jsonb,
  add column if not exists custom_places jsonb not null default '{}'::jsonb,
  add column if not exists user_links jsonb not null default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists expires_at timestamptz;

create index if not exists pass_planner_books_expires_at_idx
  on public.pass_planner_books (expires_at);

create unique index if not exists pass_planner_books_read_token_idx
  on public.pass_planner_books (read_token)
  where read_token is not null;

alter table public.pass_planner_books enable row level security;

grant select, insert, update, delete on public.pass_planner_books to anon, authenticated;

drop policy if exists "Anyone can read planner books" on public.pass_planner_books;
create policy "Anyone can read planner books"
  on public.pass_planner_books
  for select
  using (true);

drop policy if exists "Anyone can create planner books" on public.pass_planner_books;
create policy "Anyone can create planner books"
  on public.pass_planner_books
  for insert
  with check (
    jsonb_typeof(items) = 'array'
    and jsonb_array_length(items) <= 240
    and jsonb_typeof(notes) = 'object'
    and jsonb_typeof(custom_places) = 'object'
    and jsonb_typeof(user_links) = 'object'
  );

drop policy if exists "Anyone can update planner books" on public.pass_planner_books;
create policy "Anyone can update planner books"
  on public.pass_planner_books
  for update
  using (true)
  with check (
    jsonb_typeof(items) = 'array'
    and jsonb_array_length(items) <= 240
    and jsonb_typeof(notes) = 'object'
    and jsonb_typeof(custom_places) = 'object'
    and jsonb_typeof(user_links) = 'object'
  );

drop policy if exists "Anyone can delete planner books" on public.pass_planner_books;
create policy "Anyone can delete planner books"
  on public.pass_planner_books
  for delete
  using (true);

notify pgrst, 'reload schema';
