-- Secure planner books and make copied planner photos reference the original
-- asset instead of cloning Storage objects.
--
-- Part 1 of 2. Run this once in the Supabase SQL editor BEFORE deploying the
-- matching app and planner-images function changes. It is additive and keeps
-- the currently published planner working until the final lockdown script.

begin;

create extension if not exists pgcrypto;

alter table public.pass_planner_books
  add column if not exists edit_token text;

alter table public.pass_planner_books
  add column if not exists is_template boolean not null default false;

alter table public.pass_planner_books
  add column if not exists allow_legacy_image_owner boolean not null default true;

-- The two products currently sold as fixed source templates. Future products
-- can be marked with `update ... set is_template = true where id = '...'`.
update public.pass_planner_books
set is_template = true
where id in ('fdUxi2k', 'd6OpvoA');

-- Existing planners keep working after their owner activates the new private
-- management link. New planners receive an edit token at creation time.
update public.pass_planner_books
set edit_token = encode(gen_random_bytes(32), 'hex')
where edit_token is null or edit_token = '';

alter table public.pass_planner_books
  alter column edit_token set not null;

create unique index if not exists pass_planner_books_edit_token_idx
  on public.pass_planner_books (edit_token);

-- A copied plan stores lightweight references to source image assets. Each
-- referenced image keeps the copied plan's own place_id, so future moves in
-- the source plan never alter an existing buyer's snapshot.
create table if not exists public.pass_planner_image_references (
  book_id text not null references public.pass_planner_books(id) on delete cascade,
  image_id uuid not null references public.pass_planner_images(id) on delete restrict,
  place_id text not null,
  created_at timestamptz not null default now(),
  primary key (book_id, image_id)
);

create index if not exists pass_planner_image_references_image_id_idx
  on public.pass_planner_image_references (image_id);

alter table public.pass_planner_images
  add column if not exists deleted_at timestamptz;

alter table public.pass_planner_image_references enable row level security;
revoke all on public.pass_planner_image_references from anon, authenticated;

update storage.buckets
set file_size_limit = 614400,
    allowed_mime_types = array['image/jpeg']
where id = 'planner-images';

-- Public viewer: deliberately does not return the source book id.
create or replace function public.planner_book_read_public(p_read_token text)
returns table (
  read_token text,
  city text,
  items jsonb,
  notes jsonb,
  custom_places jsonb,
  user_links jsonb,
  expires_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    b.read_token,
    b.city,
    b.items,
    b.notes,
    b.custom_places,
    b.user_links,
    b.expires_at,
    b.updated_at
  from public.pass_planner_books b
  where b.read_token = p_read_token
    and (b.expires_at is null or b.expires_at >= now())
  limit 1;
$$;

create or replace function public.planner_book_read_edit(p_id text, p_edit_token text)
returns table (
  id text,
  read_token text,
  city text,
  items jsonb,
  notes jsonb,
  custom_places jsonb,
  user_links jsonb,
  expires_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    b.id,
    b.read_token,
    b.city,
    b.items,
    b.notes,
    b.custom_places,
    b.user_links,
    b.expires_at,
    b.updated_at
  from public.pass_planner_books b
  where b.id = p_id
    and b.edit_token = p_edit_token
    and (b.expires_at is null or b.expires_at >= now())
  limit 1;
$$;

create or replace function public.planner_book_create(
  p_id text,
  p_read_token text,
  p_edit_token text,
  p_city text,
  p_items jsonb,
  p_notes jsonb,
  p_custom_places jsonb,
  p_user_links jsonb
)
returns table (id text, read_token text)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_id !~ '^[A-Za-z0-9]{4,32}$'
    or p_read_token !~ '^[A-Za-z0-9]{8,64}$'
    or p_edit_token !~ '^[a-f0-9]{64}$'
    or coalesce(length(trim(p_city)), 0) = 0
    or jsonb_typeof(p_items) <> 'array'
    or jsonb_array_length(p_items) > 240
    or jsonb_typeof(p_notes) <> 'object'
    or jsonb_typeof(p_custom_places) <> 'object'
    or jsonb_typeof(p_user_links) <> 'object' then
    return;
  end if;

  insert into public.pass_planner_books (
    id, read_token, edit_token, city, items, notes, custom_places, user_links, expires_at, updated_at
  ) values (
    p_id, p_read_token, p_edit_token, trim(p_city), p_items, p_notes, p_custom_places, p_user_links,
    now() + interval '365 days', now()
  );

  return query select p_id, p_read_token;
end;
$$;

create or replace function public.planner_book_update(
  p_id text,
  p_edit_token text,
  p_city text,
  p_items jsonb,
  p_notes jsonb,
  p_custom_places jsonb,
  p_user_links jsonb
)
returns table (id text, read_token text, updated_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_edit_token !~ '^[a-f0-9]{64}$'
    or coalesce(length(trim(p_city)), 0) = 0
    or jsonb_typeof(p_items) <> 'array'
    or jsonb_array_length(p_items) > 240
    or jsonb_typeof(p_notes) <> 'object'
    or jsonb_typeof(p_custom_places) <> 'object'
    or jsonb_typeof(p_user_links) <> 'object' then
    return;
  end if;

  return query
  update public.pass_planner_books b
  set
    city = trim(p_city),
    items = p_items,
    notes = p_notes,
    custom_places = p_custom_places,
    user_links = p_user_links,
    expires_at = now() + interval '365 days',
    updated_at = now()
  where b.id = p_id
    and b.edit_token = p_edit_token
  returning b.id, b.read_token, b.updated_at;
end;
$$;

create or replace function public.planner_book_rename(
  p_id text,
  p_edit_token text,
  p_city text
)
returns table (id text, city text, updated_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_edit_token !~ '^[a-f0-9]{64}$' or coalesce(length(trim(p_city)), 0) = 0 then
    return;
  end if;

  return query
  update public.pass_planner_books b
  set city = trim(p_city), updated_at = now()
  where b.id = p_id
    and b.edit_token = p_edit_token
  returning b.id, b.city, b.updated_at;
end;
$$;

create or replace function public.planner_book_delete(p_id text, p_edit_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_edit_token !~ '^[a-f0-9]{64}$' then
    return false;
  end if;

  delete from public.pass_planner_books b
  where b.id = p_id
    and b.edit_token = p_edit_token;
  return found;
end;
$$;

-- Compatibility bridge for planners created before edit_token existed. The
-- old image-owner token was private to the creator's original browser, so it
-- can safely unlock the new local edit token once. No public view token can
-- use this function.
create or replace function public.planner_book_recover_edit_token(p_id text, p_image_owner_token text)
returns text
language sql
security definer
set search_path = public
as $$
  select b.edit_token
  from public.pass_planner_books b
  join public.pass_planner_image_owners o on o.book_id = b.id
  where b.id = p_id
    and o.owner_token = p_image_owner_token
  limit 1;
$$;

revoke all on function public.planner_book_read_public(text) from public;
revoke all on function public.planner_book_read_edit(text, text) from public;
revoke all on function public.planner_book_create(text, text, text, text, jsonb, jsonb, jsonb, jsonb) from public;
revoke all on function public.planner_book_update(text, text, text, jsonb, jsonb, jsonb, jsonb) from public;
revoke all on function public.planner_book_rename(text, text, text) from public;
revoke all on function public.planner_book_delete(text, text) from public;
revoke all on function public.planner_book_recover_edit_token(text, text) from public;

grant execute on function public.planner_book_read_public(text) to anon, authenticated;
grant execute on function public.planner_book_read_edit(text, text) to anon, authenticated;
grant execute on function public.planner_book_create(text, text, text, text, jsonb, jsonb, jsonb, jsonb) to anon, authenticated;
grant execute on function public.planner_book_update(text, text, text, jsonb, jsonb, jsonb, jsonb) to anon, authenticated;
grant execute on function public.planner_book_rename(text, text, text) to anon, authenticated;
grant execute on function public.planner_book_delete(text, text) to anon, authenticated;
grant execute on function public.planner_book_recover_edit_token(text, text) to anon, authenticated;

commit;
