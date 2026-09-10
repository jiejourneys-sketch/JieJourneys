-- Store a verified Agoda/Trip link without sending a locally enriched planner
-- snapshot back to the database. The link is intentionally the sole automatic
-- write, and must not change the itinerary's user-visible updated_at timestamp.

begin;

create or replace function public.planner_book_add_affiliate_link(
  p_id text,
  p_edit_token text,
  p_place_id text,
  p_provider text,
  p_href text
)
returns table (id text, read_token text, updated_at timestamptz, changed boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_custom_places jsonb;
  current_user_links jsonb;
  current_place jsonb;
  current_place_links jsonb;
  next_place_links jsonb;
  provider_domain text;
begin
  if p_edit_token is null
    or p_edit_token !~ '^([a-f0-9]{64}|[A-Za-z0-9_-]{22})$'
    or p_id is null
    or p_id !~ '^[A-Za-z0-9_-]{7,32}$'
    or p_place_id is null
    or p_place_id !~ '^custom:[A-Za-z0-9_-]{1,80}$'
    or p_provider is null
    or p_provider not in ('Agoda', 'Trip')
    or p_href is null
    or coalesce(length(trim(p_href)), 0) > 500
    or p_href !~ '^https://' then
    return;
  end if;

  provider_domain := case when p_provider = 'Agoda' then 'agoda\.com' else 'trip\.com' end;
  if lower(p_href) !~ ('^https://([a-z0-9-]+\.)*' || provider_domain || '(/|$)') then
    return;
  end if;

  select
    coalesce(b.custom_places, '{}'::jsonb),
    coalesce(b.user_links, '{}'::jsonb)
  into current_custom_places, current_user_links
  from public.pass_planner_books b
  where b.id = p_id and b.edit_token = p_edit_token
  for update;

  if not found then return; end if;

  current_place := current_custom_places -> p_place_id;
  if jsonb_typeof(current_place) <> 'object' then return; end if;

  current_place_links := case
    when jsonb_typeof(current_place -> 'links') = 'array' then current_place -> 'links'
    else '[]'::jsonb
  end;

  -- Preserve manual links in user_links and any previously stored provider
  -- link.  A later automatic result must never replace either one.
  if exists (
    select 1
    from jsonb_array_elements(current_place_links) item
    where lower(coalesce(item ->> 'label', '')) = lower(p_provider)
      or lower(coalesce(item ->> 'href', '')) ~ ('^https://([a-z0-9-]+\.)*' || provider_domain || '(/|$)')
  ) or exists (
    select 1
    from jsonb_array_elements(case when jsonb_typeof(current_user_links -> p_place_id) = 'array' then current_user_links -> p_place_id else '[]'::jsonb end) item
    where lower(coalesce(item ->> 'label', '')) = lower(p_provider)
      or lower(coalesce(item ->> 'href', '')) ~ ('^https://([a-z0-9-]+\.)*' || provider_domain || '(/|$)')
  ) then
    return query
    select b.id, b.read_token, b.updated_at, false
    from public.pass_planner_books b
    where b.id = p_id and b.edit_token = p_edit_token;
    return;
  end if;

  if jsonb_array_length(current_place_links) >= 8 then
    return query
    select b.id, b.read_token, b.updated_at, false
    from public.pass_planner_books b
    where b.id = p_id and b.edit_token = p_edit_token;
    return;
  end if;

  next_place_links := current_place_links || jsonb_build_array(jsonb_build_object('label', p_provider, 'href', p_href));

  return query
  update public.pass_planner_books b
  set
    custom_places = jsonb_set(
      current_custom_places,
      array[p_place_id],
      jsonb_set(current_place, '{links}', next_place_links, true),
      true
    ),
    expires_at = now() + interval '365 days'
  where b.id = p_id and b.edit_token = p_edit_token
  returning b.id, b.read_token, b.updated_at, true;
end;
$$;

revoke all on function public.planner_book_add_affiliate_link(text, text, text, text, text) from public;
grant execute on function public.planner_book_add_affiliate_link(text, text, text, text, text) to anon, authenticated;

notify pgrst, 'reload schema';
commit;
