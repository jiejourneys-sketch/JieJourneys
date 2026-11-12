-- Monitor the booking platforms whose reopen/sold-out notices are not
-- repeated on the prefecture campaign pages. This closes the alert gap that
-- missed the 11/12 Big Holiday and Tobu Top Tours status changes.

insert into public.content_monitor_sites (
  name,
  url,
  enabled,
  source_type,
  selector_or_path,
  ignore_patterns,
  request_headers,
  check_every_minutes,
  notify_changes,
  notify_failures,
  next_check_at
)
values
  (
    '九州旅遊補助｜Big Holiday',
    'https://bigs.jp/',
    true,
    'html',
    '#news_summary .NewsList > dl',
    '{}',
    jsonb_build_object(
      'source_page_url', 'https://bigs.jp/',
      'include_attributes', true,
      'structured_rows', true,
      'notify_if_matches', jsonb_build_array(
        'ふっこう応援割|応援割|熊本県|長崎県|鹿児島県|受付|販売|再開|終了|予算上限'
      )
    ),
    30,
    true,
    true,
    now()
  ),
  (
    '九州旅遊補助｜東武 Top Tours',
    'https://tobutoptours.jp/dom/kyushu_ouen/',
    true,
    'html',
    '.news_info_box > .news_info_list > li',
    '{}',
    jsonb_build_object(
      'source_page_url', 'https://tobutoptours.jp/dom/kyushu_ouen/',
      'include_attributes', true,
      'structured_rows', true,
      'notify_if_matches', jsonb_build_array(
        '予約|受付|販売|再開|終了|予算上限|宿泊施設|福岡県|佐賀県|長崎県|熊本県|大分県|宮崎県|宮﨑県|鹿児島県'
      )
    ),
    30,
    true,
    true,
    now()
  )
on conflict (name) do update
set
  url = excluded.url,
  enabled = true,
  source_type = excluded.source_type,
  selector_or_path = excluded.selector_or_path,
  ignore_patterns = excluded.ignore_patterns,
  request_headers = excluded.request_headers,
  check_every_minutes = excluded.check_every_minutes,
  notify_changes = true,
  notify_failures = true,
  next_check_at = least(public.content_monitor_sites.next_check_at, now());

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
  site.name,
  site.url,
  'active',
  case site.name
    when '九州旅遊補助｜Big Holiday' then '追蹤熊本、長崎與鹿兒島補助套裝的重開、額滿及停止受理公告'
    else '追蹤東武 Top Tours 九州七縣的開賣、重開、額滿與住宿名單更新'
  end,
  '平台額度可能與縣官方首頁分開更新；每 30 分鐘比對最新公告列。',
  site.id,
  now()
from public.content_monitor_sites as site
where site.name in (
  '九州旅遊補助｜Big Holiday',
  '九州旅遊補助｜東武 Top Tours'
)
on conflict (name) do update
set
  url = excluded.url,
  status = excluded.status,
  focus = excluded.focus,
  assessment = excluded.assessment,
  monitor_site_id = excluded.monitor_site_id,
  reviewed_at = excluded.reviewed_at;

-- A newly added source should establish a silent baseline on its first run.
-- Clearing any stale state also makes reapplying this migration deterministic.
with affected_sites as (
  select id
  from public.content_monitor_sites
  where name in (
    '九州旅遊補助｜Big Holiday',
    '九州旅遊補助｜東武 Top Tours'
  )
)
delete from public.content_monitor_events as event
using affected_sites
where event.site_id = affected_sites.id
  and event.notified_at is null;

with affected_sites as (
  select id
  from public.content_monitor_sites
  where name in (
    '九州旅遊補助｜Big Holiday',
    '九州旅遊補助｜東武 Top Tours'
  )
)
delete from public.content_monitor_state as state
using affected_sites
where state.site_id = affected_sites.id;
