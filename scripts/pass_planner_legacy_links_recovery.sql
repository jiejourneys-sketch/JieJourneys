-- Run this once in the JieJourneysTrip Supabase SQL Editor.
--
-- Restores pre-edit-token planner URLs (`?p=<id>`) as editor links to the
-- same existing itinerary. No copy or duplicate row is created. Protected
-- source templates remain excluded.
--
-- Historical recovery only: on a database using Planner link v2, apply
-- supabase/migrations/20260908110000_planner_book_link_v2.sql afterwards;
-- otherwise this script would also expose new v2 `p` identifiers.

begin;

drop function if exists public.planner_book_read_legacy(text);

create or replace function public.planner_book_read_legacy(p_id text)
returns table (
  id text,
  read_token text,
  edit_token text,
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
    b.city,
    b.items,
    b.notes,
    b.custom_places,
    b.user_links,
    b.updated_at
  from public.pass_planner_books b
  where b.id = p_id
    and b.is_template = false
    and (b.expires_at is null or b.expires_at >= now())
  limit 1;
$$;

revoke all on function public.planner_book_read_legacy(text) from public;
grant execute on function public.planner_book_read_legacy(text) to anon, authenticated;

notify pgrst, 'reload schema';
commit;
