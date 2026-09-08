-- Planner link v2:
-- * Existing books keep their legacy `?p=<id>` behaviour unchanged.
-- * Newly created books require an editor token and keep their region/source
--   in the database, so saved links no longer need a mutable `region` query.

begin;

alter table public.pass_planner_books
  add column if not exists link_version smallint not null default 1 check (link_version in (1, 2)),
  add column if not exists region_key text,
  add column if not exists planner_source text;

-- The legacy reader must remain scoped to books that existed before v2.  It
-- deliberately keeps returning the old edit token so old owner URLs continue
-- to work exactly as they do today.
drop function if exists public.planner_book_read_legacy(text);
create function public.planner_book_read_legacy(p_id text)
returns table (
  id text,
  read_token text,
  edit_token text,
  link_version smallint,
  region_key text,
  planner_source text,
  city text,
  items jsonb,
  notes jsonb,
  custom_places jsonb,
  user_links jsonb,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    b.id,
    b.read_token,
    b.edit_token,
    b.link_version,
    b.region_key,
    b.planner_source,
    b.city,
    b.items,
    b.notes,
    b.custom_places,
    b.user_links,
    b.updated_at
  from public.pass_planner_books b
  where b.id = p_id
    and b.is_template = false
    and b.link_version = 1
    and (b.expires_at is null or b.expires_at >= now())
  limit 1;
$$;

drop function if exists public.planner_book_read_public(text);
create function public.planner_book_read_public(p_read_token text)
returns table (
  read_token text,
  link_version smallint,
  region_key text,
  planner_source text,
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
    b.link_version,
    b.region_key,
    b.planner_source,
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

drop function if exists public.planner_book_read_edit(text, text);
create function public.planner_book_read_edit(p_id text, p_edit_token text)
returns table (
  id text,
  read_token text,
  link_version smallint,
  region_key text,
  planner_source text,
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
    b.link_version,
    b.region_key,
    b.planner_source,
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

-- Keep the legacy overloaded create function during rollout.  That lets an
-- already-open old browser save normally while this migration is applied;
-- the new app calls the v2 signature below.  It can be retired separately
-- after old frontend assets have aged out.
create function public.planner_book_create(
  p_id text,
  p_read_token text,
  p_edit_token text,
  p_link_version smallint,
  p_region_key text,
  p_planner_source text,
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
    or p_read_token !~ '^([A-Za-z0-9]{12}|[A-Za-z0-9_-]{22})$'
    or p_edit_token !~ '^([a-f0-9]{64}|[A-Za-z0-9_-]{22})$'
    or p_link_version <> 2
    or coalesce(length(trim(p_region_key)), 0) > 40
    or coalesce(length(trim(p_region_key)), 0) = 0
    or p_planner_source not in ('map', 'pass')
    or coalesce(length(trim(p_city)), 0) = 0
    or jsonb_typeof(p_items) <> 'array'
    or jsonb_array_length(p_items) > 240
    or jsonb_typeof(p_notes) <> 'object'
    or jsonb_typeof(p_custom_places) <> 'object'
    or jsonb_typeof(p_user_links) <> 'object' then
    return;
  end if;

  insert into public.pass_planner_books (
    id,
    read_token,
    edit_token,
    link_version,
    region_key,
    planner_source,
    city,
    items,
    notes,
    custom_places,
    user_links,
    expires_at,
    updated_at
  ) values (
    p_id,
    p_read_token,
    p_edit_token,
    2,
    trim(p_region_key),
    p_planner_source,
    trim(p_city),
    p_items,
    p_notes,
    p_custom_places,
    p_user_links,
    now() + interval '365 days',
    now()
  );

  return query select p_id, p_read_token;
end;
$$;

-- These functions keep their existing signatures, but must recognise the
-- compact v2 editor token in addition to the legacy 64-character hex token.
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
  if p_edit_token !~ '^([a-f0-9]{64}|[A-Za-z0-9_-]{22})$'
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
  if p_edit_token !~ '^([a-f0-9]{64}|[A-Za-z0-9_-]{22})$' or coalesce(length(trim(p_city)), 0) = 0 then
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
  if p_edit_token !~ '^([a-f0-9]{64}|[A-Za-z0-9_-]{22})$' then
    return false;
  end if;

  delete from public.pass_planner_books b
  where b.id = p_id
    and b.edit_token = p_edit_token;
  return found;
end;
$$;

revoke all on function public.planner_book_read_legacy(text) from public;
revoke all on function public.planner_book_read_public(text) from public;
revoke all on function public.planner_book_read_edit(text, text) from public;
revoke all on function public.planner_book_create(text, text, text, smallint, text, text, text, jsonb, jsonb, jsonb, jsonb) from public;

grant execute on function public.planner_book_read_legacy(text) to anon, authenticated;
grant execute on function public.planner_book_read_public(text) to anon, authenticated;
grant execute on function public.planner_book_read_edit(text, text) to anon, authenticated;
grant execute on function public.planner_book_create(text, text, text, smallint, text, text, text, jsonb, jsonb, jsonb, jsonb) to anon, authenticated;

notify pgrst, 'reload schema';
commit;
