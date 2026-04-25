create table if not exists public.monitor_link_state (
  state_key text primary key,
  page_url text not null,
  page_name text not null,
  link_url text not null,
  platform text not null,
  link_text text not null,
  last_status text not null,
  last_detail text,
  last_status_code integer,
  last_final_url text,
  last_checked_at timestamptz not null default now(),
  last_fingerprint text,
  active boolean not null default true,
  next_check_at timestamptz,
  consecutive_healthy integer not null default 0
);

create index if not exists monitor_link_state_page_url_idx
  on public.monitor_link_state (page_url);

create index if not exists monitor_link_state_active_idx
  on public.monitor_link_state (active);

create index if not exists monitor_link_state_next_check_at_idx
  on public.monitor_link_state (next_check_at);

create table if not exists public.monitor_link_runs (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  batch_index integer,
  batch_count integer not null,
  checked_pages integer not null,
  checked_links integer not null,
  healthy_count integer not null,
  broken_count integer not null,
  down_count integer not null,
  suspicious_count integer not null,
  manual_review_count integer not null,
  new_problem_count integer not null,
  payload jsonb not null default '{}'::jsonb
);

-- Migration: add scheduling columns (run this if the table already exists)
--
-- alter table public.monitor_link_state
--   add column if not exists next_check_at timestamptz,
--   add column if not exists consecutive_healthy integer not null default 0;
--
-- create index if not exists monitor_link_state_next_check_at_idx
--   on public.monitor_link_state (next_check_at);

-- Example cron: run once per day at 03:10 Asia/Taipei equivalent in UTC.
-- Adjust the URL and JWT before using.
--
-- select
--   cron.schedule(
--     'jiejourneys-link-monitor-daily',
--     '10 19 * * *',
--     $$
--     select
--       net.http_post(
--         url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/link-monitor',
--         headers := jsonb_build_object(
--           'Content-Type', 'application/json',
--           'Authorization', 'Bearer YOUR_SUPABASE_ANON_OR_SERVICE_ROLE_KEY'
--         ),
--         body := '{}'::jsonb
--       );
--     $$
--   );
