-- Give every legacy Planner row a copy-ready tools/planner URL in the table
-- editor.  Known cities use their existing region keys; arbitrary historical
-- trip titles fall back to their own city text as the legacy custom region.
-- This only replaces generated admin convenience columns.

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
        when coalesce(btrim(city), '') <> '' then
          'https://www.jiejourneys.com/tools/planner?region=' ||
          replace(replace(replace(replace(replace(replace(replace(city, '%', '%25'), '&', '%26'), '#', '%23'), '?', '%3F'), '=', '%3D'), '+', '%2B'), ' ', '%20') ||
          '&p=' || id
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
        when coalesce(btrim(city), '') <> '' then
          'https://www.jiejourneys.com/tools/planner?region=' ||
          replace(replace(replace(replace(replace(replace(replace(city, '%', '%25'), '&', '%26'), '#', '%23'), '?', '%3F'), '=', '%3D'), '+', '%2B'), ' ', '%20') ||
          '&v=' || read_token
        else null
      end
    ) stored;

notify pgrst, 'reload schema';
commit;
