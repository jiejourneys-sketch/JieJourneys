-- Keep the database validation in sync with the Planner API's 500-item cap.
-- An item may be a place visit, transport segment, or day divider.

begin;

create or replace function public.planner_book_create(
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
    or jsonb_array_length(p_items) > 500
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
    or jsonb_array_length(p_items) > 500
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
    and (
      b.city is distinct from trim(p_city)
      or b.items is distinct from p_items
      or b.notes is distinct from p_notes
      or b.custom_places is distinct from p_custom_places
      or b.user_links is distinct from p_user_links
    )
  returning b.id, b.read_token, b.updated_at;

  if found then return; end if;

  -- The credentials were valid but the submitted content was identical.
  -- Treat this as a successful no-op without changing updated_at/expiry.
  return query
  select b.id, b.read_token, b.updated_at
  from public.pass_planner_books b
  where b.id = p_id
    and b.edit_token = p_edit_token;
end;
$$;

notify pgrst, 'reload schema';
commit;
