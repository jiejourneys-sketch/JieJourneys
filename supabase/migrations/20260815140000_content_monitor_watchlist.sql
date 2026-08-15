create table if not exists public.content_monitor_watchlist (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  url text not null check (url ~ '^https?://'),
  status text not null check (status in ('active', 'reviewed', 'not_recommended', 'needs_custom_rule')),
  focus text not null,
  assessment text not null,
  monitor_site_id uuid references public.content_monitor_sites(id) on delete set null,
  reviewed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists content_monitor_watchlist_updated_at on public.content_monitor_watchlist;
create trigger content_monitor_watchlist_updated_at
before update on public.content_monitor_watchlist
for each row execute function public.content_monitor_set_updated_at();

revoke all on public.content_monitor_watchlist from anon, authenticated;
grant all on public.content_monitor_watchlist to service_role;
alter table public.content_monitor_watchlist enable row level security;
