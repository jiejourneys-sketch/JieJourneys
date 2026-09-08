-- Dashboard-only convenience columns for quickly opening/copying Planner
-- links from the pass_planner_books table editor.  They are generated from
-- the existing credential columns and do not alter any book or permissions.

begin;

alter table public.pass_planner_books
  add column if not exists admin_edit_query text
    generated always as (
      case
        when coalesce(edit_token, '') <> '' then '?p=' || id || '&e=' || edit_token
        else '?p=' || id
      end
    ) stored,
  add column if not exists admin_edit_url text
    generated always as (
      case
        when link_version = 2 and coalesce(edit_token, '') <> '' then
          'https://www.jiejourneys.com/tools/planner?p=' || id || '&e=' || edit_token
        else null
      end
    ) stored,
  add column if not exists admin_view_url text
    generated always as (
      case
        when link_version = 2 and coalesce(read_token, '') <> '' then
          'https://www.jiejourneys.com/tools/planner?v=' || read_token
        else null
      end
    ) stored;

comment on column public.pass_planner_books.admin_edit_query is
  'Admin convenience: combined Planner query string. Treat it as an edit credential.';
comment on column public.pass_planner_books.admin_edit_url is
  'Admin convenience: complete V2 collaborative editing URL. Treat it as an edit credential.';
comment on column public.pass_planner_books.admin_view_url is
  'Admin convenience: complete V2 read-only Planner URL.';

notify pgrst, 'reload schema';
commit;
