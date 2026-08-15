-- Content Monitor: durable, low-noise website change notifications.
--
-- Run this once in the Supabase SQL Editor for the project that will own the
-- monitor. This script creates no monitored sites and no Cron job by itself.

create extension if not exists pgcrypto;

create table if not exists public.content_monitor_sites (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  url text not null check (url ~ '^https?://'),
  enabled boolean not null default true,
  source_type text not null default 'html' check (source_type in ('html', 'json')),
  -- HTML: CSS selector for the part to compare. Empty means the page body.
  -- JSON: dot path, for example "data.items.0.updated_at".
  selector_or_path text,
  -- Optional patterns removed before comparison. Use these for timestamps or
  -- other deliberately changing text, not for selecting the target content.
  ignore_patterns text[] not null default '{}',
  request_headers jsonb not null default '{}'::jsonb,
  check_every_minutes integer not null default 60 check (check_every_minutes between 5 and 10080),
  notify_changes boolean not null default true,
  notify_failures boolean not null default true,
  next_check_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_monitor_state (
  site_id uuid primary key references public.content_monitor_sites(id) on delete cascade,
  last_hash text,
  -- A short preview only; full pages are intentionally not retained.
  last_content_preview text,
  last_checked_at timestamptz,
  last_changed_at timestamptz,
  consecutive_failures integer not null default 0,
  last_error text,
  -- Set only after an error notification is queued. It makes recovery and
  -- repeat-error notifications deterministic.
  alerted_error_fingerprint text,
  updated_at timestamptz not null default now()
);

create table if not exists public.content_monitor_events (
  id bigint generated always as identity primary key,
  site_id uuid not null references public.content_monitor_sites(id) on delete cascade,
  site_name text not null,
  site_url text not null,
  event_type text not null check (event_type in ('change', 'error', 'recovered')),
  -- Unique per site and event type. This is the duplicate-notification guard.
  fingerprint text not null,
  old_content_preview text,
  new_content_preview text,
  error_message text,
  detected_at timestamptz not null default now(),
  notification_claim_token uuid,
  notification_claimed_at timestamptz,
  notification_attempts integer not null default 0,
  last_notification_error text,
  notified_at timestamptz,
  unique (site_id, event_type, fingerprint)
);

create index if not exists content_monitor_sites_due_idx
  on public.content_monitor_sites (next_check_at)
  where enabled;

create index if not exists content_monitor_events_pending_idx
  on public.content_monitor_events (detected_at)
  where notified_at is null;

create table if not exists public.content_monitor_runs (
  id bigint generated always as identity primary key,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  dry_run boolean not null default false,
  checked_count integer not null default 0,
  baseline_count integer not null default 0,
  changed_count integer not null default 0,
  failed_count integer not null default 0,
  queued_event_count integer not null default 0,
  notified_event_count integer not null default 0,
  summary jsonb not null default '{}'::jsonb
);

create or replace function public.content_monitor_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists content_monitor_sites_updated_at on public.content_monitor_sites;
create trigger content_monitor_sites_updated_at
before update on public.content_monitor_sites
for each row execute function public.content_monitor_set_updated_at();

drop trigger if exists content_monitor_state_updated_at on public.content_monitor_state;
create trigger content_monitor_state_updated_at
before update on public.content_monitor_state
for each row execute function public.content_monitor_set_updated_at();

-- Atomically reserve pending notifications. A second overlapping Cron run
-- cannot send the same event while the first one owns the claim.
create or replace function public.claim_content_monitor_events(p_limit integer default 20)
returns setof public.content_monitor_events
language sql
security definer
set search_path = public
as $$
  update public.content_monitor_events
  set
    notification_claim_token = gen_random_uuid(),
    notification_claimed_at = now(),
    notification_attempts = notification_attempts + 1
  where id in (
    select id
    from public.content_monitor_events
    where notified_at is null
      and (
        notification_claimed_at is null
        or notification_claimed_at < now() - interval '15 minutes'
      )
    order by detected_at asc
    for update skip locked
    limit greatest(1, least(p_limit, 50))
  )
  returning *;
$$;

revoke all on public.content_monitor_sites from anon, authenticated;
revoke all on public.content_monitor_state from anon, authenticated;
revoke all on public.content_monitor_events from anon, authenticated;
revoke all on public.content_monitor_runs from anon, authenticated;
revoke all on function public.claim_content_monitor_events(integer) from public, anon, authenticated;

grant all on public.content_monitor_sites to service_role;
grant all on public.content_monitor_state to service_role;
grant all on public.content_monitor_events to service_role;
grant all on public.content_monitor_runs to service_role;
grant usage, select on all sequences in schema public to service_role;
grant execute on function public.claim_content_monitor_events(integer) to service_role;

alter table public.content_monitor_sites enable row level security;
alter table public.content_monitor_state enable row level security;
alter table public.content_monitor_events enable row level security;
alter table public.content_monitor_runs enable row level security;

-- Example site (edit the values, then run separately):
-- insert into public.content_monitor_sites
--   (name, url, source_type, selector_or_path, check_every_minutes)
-- values
--   ('Example notices', 'https://example.com/notices', 'html', 'main .notice-list', 60);
