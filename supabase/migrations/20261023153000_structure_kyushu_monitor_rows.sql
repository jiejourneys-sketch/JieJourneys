-- Keep campaign alerts readable by storing each monitored result row as one
-- canonical line. This prevents image paths and unrelated OTA rows from
-- burying the actual added or changed booking status in Telegram.

with source_urls(url) as (
  values
    ('https://fukuoka-fukkou-wari.jp/'),
    ('https://saga-ouen.jp/'),
    ('https://oita-fukkou-wari.jp/'),
    ('https://miyazaki-ouen.jp/'),
    ('https://fukko-ouenwari.pref.kagoshima.jp/')
)
update public.content_monitor_sites as site
set
  request_headers = coalesce(site.request_headers, '{}'::jsonb) || '{"structured_rows":true}'::jsonb,
  next_check_at = least(site.next_check_at, now())
from source_urls
where site.url = source_urls.url;

-- The canonical row format intentionally changes the comparison payload.
-- Remove only undelivered events for these sources, then let the next run
-- establish a silent baseline in the new format.
with source_urls(url) as (
  values
    ('https://fukuoka-fukkou-wari.jp/'),
    ('https://saga-ouen.jp/'),
    ('https://oita-fukkou-wari.jp/'),
    ('https://miyazaki-ouen.jp/'),
    ('https://fukko-ouenwari.pref.kagoshima.jp/')
), affected_sites as (
  select site.id
  from public.content_monitor_sites as site
  join source_urls on source_urls.url = site.url
)
delete from public.content_monitor_events as event
using affected_sites
where event.site_id = affected_sites.id
  and event.notified_at is null;

with source_urls(url) as (
  values
    ('https://fukuoka-fukkou-wari.jp/'),
    ('https://saga-ouen.jp/'),
    ('https://oita-fukkou-wari.jp/'),
    ('https://miyazaki-ouen.jp/'),
    ('https://fukko-ouenwari.pref.kagoshima.jp/')
)
delete from public.content_monitor_state as state
using public.content_monitor_sites as site, source_urls
where state.site_id = site.id
  and site.url = source_urls.url;
