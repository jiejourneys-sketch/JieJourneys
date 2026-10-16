-- Keep the Kyushu subsidy watch list reproducible instead of relying on
-- dashboard-only rows. Attribute monitoring also catches image/link updates
-- on official pages whose important information is not rendered as text.

with sources(name, url) as (
  values
    ('九州旅遊補助｜日本觀光廳', 'https://www.mlit.go.jp/kankocho/page13_00002.html'),
    ('九州旅遊補助｜九州官方入口', 'https://fightkyushu.welcomekyushu.jp/'),
    ('九州旅遊補助｜福岡', 'https://fukuoka-fukkou-wari.jp/'),
    ('九州旅遊補助｜佐賀', 'https://saga-ouen.jp/'),
    ('九州旅遊補助｜長崎', 'https://nagasaki-fukkou-wari.jp/'),
    ('九州旅遊補助｜熊本', 'https://kumamoto-ouenwari.com/'),
    ('九州旅遊補助｜大分', 'https://oita-fukkou-wari.jp/'),
    ('九州旅遊補助｜宮崎', 'https://miyazaki-ouen.jp/'),
    ('九州旅遊補助｜鹿兒島', 'https://fukko-ouenwari.pref.kagoshima.jp/')
)
update public.content_monitor_sites as site
set
  enabled = true,
  source_type = 'html',
  selector_or_path = 'body',
  request_headers = coalesce(site.request_headers, '{}'::jsonb) || '{"include_attributes":true}'::jsonb,
  check_every_minutes = 60,
  notify_changes = true,
  notify_failures = true,
  next_check_at = least(site.next_check_at, now())
from sources
where site.url = sources.url;

with sources(name, url) as (
  values
    ('九州旅遊補助｜日本觀光廳', 'https://www.mlit.go.jp/kankocho/page13_00002.html'),
    ('九州旅遊補助｜九州官方入口', 'https://fightkyushu.welcomekyushu.jp/'),
    ('九州旅遊補助｜福岡', 'https://fukuoka-fukkou-wari.jp/'),
    ('九州旅遊補助｜佐賀', 'https://saga-ouen.jp/'),
    ('九州旅遊補助｜長崎', 'https://nagasaki-fukkou-wari.jp/'),
    ('九州旅遊補助｜熊本', 'https://kumamoto-ouenwari.com/'),
    ('九州旅遊補助｜大分', 'https://oita-fukkou-wari.jp/'),
    ('九州旅遊補助｜宮崎', 'https://miyazaki-ouen.jp/'),
    ('九州旅遊補助｜鹿兒島', 'https://fukko-ouenwari.pref.kagoshima.jp/')
)
insert into public.content_monitor_sites (
  name,
  url,
  enabled,
  source_type,
  selector_or_path,
  request_headers,
  check_every_minutes,
  notify_changes,
  notify_failures,
  next_check_at
)
select
  sources.name,
  sources.url,
  true,
  'html',
  'body',
  '{"include_attributes":true}'::jsonb,
  60,
  true,
  true,
  now()
from sources
where not exists (
  select 1
  from public.content_monitor_sites as existing
  where existing.url = sources.url
)
on conflict (name) do update
set
  url = excluded.url,
  enabled = true,
  source_type = excluded.source_type,
  selector_or_path = excluded.selector_or_path,
  request_headers = coalesce(public.content_monitor_sites.request_headers, '{}'::jsonb) || excluded.request_headers,
  check_every_minutes = excluded.check_every_minutes,
  notify_changes = true,
  notify_failures = true,
  next_check_at = least(public.content_monitor_sites.next_check_at, now());

-- Attribute-aware extraction changes the compared payload. Rebaseline these
-- sources once so deployment itself does not create nine false change alerts.
with sources(url) as (
  values
    ('https://www.mlit.go.jp/kankocho/page13_00002.html'),
    ('https://fightkyushu.welcomekyushu.jp/'),
    ('https://fukuoka-fukkou-wari.jp/'),
    ('https://saga-ouen.jp/'),
    ('https://nagasaki-fukkou-wari.jp/'),
    ('https://kumamoto-ouenwari.com/'),
    ('https://oita-fukkou-wari.jp/'),
    ('https://miyazaki-ouen.jp/'),
    ('https://fukko-ouenwari.pref.kagoshima.jp/')
)
delete from public.content_monitor_state as state
using public.content_monitor_sites as site, sources
where state.site_id = site.id
  and site.url = sources.url;

with sources(name, url) as (
  values
    ('九州旅遊補助｜日本觀光廳', 'https://www.mlit.go.jp/kankocho/page13_00002.html'),
    ('九州旅遊補助｜九州官方入口', 'https://fightkyushu.welcomekyushu.jp/'),
    ('九州旅遊補助｜福岡', 'https://fukuoka-fukkou-wari.jp/'),
    ('九州旅遊補助｜佐賀', 'https://saga-ouen.jp/'),
    ('九州旅遊補助｜長崎', 'https://nagasaki-fukkou-wari.jp/'),
    ('九州旅遊補助｜熊本', 'https://kumamoto-ouenwari.com/'),
    ('九州旅遊補助｜大分', 'https://oita-fukkou-wari.jp/'),
    ('九州旅遊補助｜宮崎', 'https://miyazaki-ouen.jp/'),
    ('九州旅遊補助｜鹿兒島', 'https://fukko-ouenwari.pref.kagoshima.jp/')
)
insert into public.content_monitor_watchlist (
  name,
  url,
  status,
  focus,
  assessment,
  monitor_site_id,
  reviewed_at
)
select
  sources.name,
  sources.url,
  'active',
  '追蹤開賣、完售、追加額度、期間、平台與旅客資格異動',
  '官方一級來源；每小時監控可見文字、連結與圖片資源。',
  site.id,
  now()
from sources
join public.content_monitor_sites as site on site.url = sources.url
on conflict (name) do update
set
  url = excluded.url,
  status = excluded.status,
  focus = excluded.focus,
  assessment = excluded.assessment,
  monitor_site_id = excluded.monitor_site_id,
  reviewed_at = excluded.reviewed_at;
