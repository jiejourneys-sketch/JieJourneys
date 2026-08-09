-- Planner card images are kept in a private bucket.  Browser clients never
-- receive storage write access; all writes go through planner-images Edge
-- Function, which validates a per-planner owner token using the service role.

create table if not exists public.pass_planner_image_owners (
  book_id text primary key references public.pass_planner_books(id) on delete cascade,
  owner_token text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.pass_planner_images (
  id uuid primary key,
  book_id text not null references public.pass_planner_books(id) on delete cascade,
  place_id text not null,
  storage_path text not null unique,
  width integer not null check (width > 0 and width <= 1600),
  height integer not null check (height > 0 and height <= 1600),
  bytes integer not null check (bytes > 0 and bytes <= 1048576),
  created_at timestamptz not null default now()
);

create index if not exists pass_planner_images_book_id_idx
  on public.pass_planner_images (book_id, created_at);

create index if not exists pass_planner_images_book_place_idx
  on public.pass_planner_images (book_id, place_id, created_at);

alter table public.pass_planner_image_owners enable row level security;
alter table public.pass_planner_images enable row level security;

-- No browser role may read or write image ownership data or image records.
-- The Edge Function uses the service-role client, which bypasses RLS.
revoke all on public.pass_planner_image_owners from anon, authenticated;
revoke all on public.pass_planner_images from anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('planner-images', 'planner-images', false, 1048576, array['image/jpeg'])
on conflict (id) do update
  set public = false,
      file_size_limit = 1048576,
      allowed_mime_types = array['image/jpeg'];

-- Restrictive policies are ANDed with any broad storage policies that may be
-- added elsewhere, so this bucket remains server-only.
drop policy if exists "Planner images are server only" on storage.objects;
create policy "Planner images are server only"
  on storage.objects
  as restrictive
  for all
  to anon, authenticated
  using (bucket_id <> 'planner-images')
  with check (bucket_id <> 'planner-images');
