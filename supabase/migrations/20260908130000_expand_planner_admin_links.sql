-- Show a complete, copy-ready admin URL for both Planner link generations in
-- the table editor.  This only changes generated convenience columns; it does
-- not modify any existing planner book or user-facing URL.

begin;

alter table public.pass_planner_books
  drop column if exists admin_edit_url,
  drop column if exists admin_view_url;

alter table public.pass_planner_books
  add column admin_edit_url text
    generated always as (
      case
        when link_version = 2 and coalesce(edit_token, '') <> '' then
          'https://www.jiejourneys.com/tools/planner?p=' || id || '&e=' || edit_token
        when city ~* '釜山|busan' then
          'https://www.jiejourneys.com/tools/planner?region=busan&p=' || id
        when city ~* '大阪|osaka' then
          'https://www.jiejourneys.com/tools/planner?region=osaka&p=' || id
        when city ~* '東京|tokyo' then
          'https://www.jiejourneys.com/tools/planner?region=tokyo&p=' || id
        when city ~* '富士|fuji|河口湖|kawaguchiko' then
          'https://www.jiejourneys.com/tools/planner?region=fuji&p=' || id
        when city ~* '金門|kinmen' then
          'https://www.jiejourneys.com/tools/planner?region=kinmen&p=' || id
        when city ~* '越南|hanoi|河內|northvietnam' then
          'https://www.jiejourneys.com/tools/planner?region=northvietnam&p=' || id
        else null
      end
    ) stored,
  add column admin_view_url text
    generated always as (
      case
        when link_version = 2 and coalesce(read_token, '') <> '' then
          'https://www.jiejourneys.com/tools/planner?v=' || read_token
        when city ~* '釜山|busan' then
          'https://www.jiejourneys.com/tools/planner?region=busan&v=' || read_token
        when city ~* '大阪|osaka' then
          'https://www.jiejourneys.com/tools/planner?region=osaka&v=' || read_token
        when city ~* '東京|tokyo' then
          'https://www.jiejourneys.com/tools/planner?region=tokyo&v=' || read_token
        when city ~* '富士|fuji|河口湖|kawaguchiko' then
          'https://www.jiejourneys.com/tools/planner?region=fuji&v=' || read_token
        when city ~* '金門|kinmen' then
          'https://www.jiejourneys.com/tools/planner?region=kinmen&v=' || read_token
        when city ~* '越南|hanoi|河內|northvietnam' then
          'https://www.jiejourneys.com/tools/planner?region=northvietnam&v=' || read_token
        else null
      end
    ) stored;

comment on column public.pass_planner_books.admin_edit_url is
  'Admin convenience: full edit URL. V1 uses its legacy tools/planner region and p format.';
comment on column public.pass_planner_books.admin_view_url is
  'Admin convenience: full view URL. V1 uses its legacy tools/planner region and v format.';

notify pgrst, 'reload schema';
commit;
