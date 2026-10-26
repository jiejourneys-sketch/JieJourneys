-- Make Telegram alerts explain the actual change and keep technical notices
-- away from the travel-content queue. The Edge Function now renders the
-- stored before/after previews; these rules make those previews focused.

-- The Saga operator list is actionable on every row change. Monitor news in a
-- separate rule so a security or maintenance announcement cannot look like a
-- new booking channel.
update public.content_monitor_sites
set
  selector_or_path = '#operators .p-operators__list > li',
  request_headers = (coalesce(request_headers, '{}'::jsonb) - 'notify_if_matches') || jsonb_build_object(
    'include_attributes', true,
    'structured_rows', true
  ),
  check_every_minutes = 60,
  next_check_at = least(next_check_at, now())
where url = 'https://saga-ouen.jp/'
  and name = '九州旅遊補助｜佐賀';

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
values (
  '九州旅遊補助｜佐賀公告',
  'https://saga-ouen.jp/',
  true,
  'html',
  '#news .p-news__row',
  '{}',
  jsonb_build_object(
    'source_page_url', 'https://saga-ouen.jp/',
    'include_attributes', true,
    'structured_rows', true,
    'notify_if_matches', jsonb_build_array(
      '発売|販売|予約|受付|完売|終了|再開|追加|延長|中止|クーポン|配布|宿泊施設|旅行会社|OTA|楽天|じゃらん|一休|JTB|ANA|JAL|Trip[.]com|Agoda|エアトリ|ゆこゆこ|Relux|るるぶ|HIS|日本旅行|近畿日本|Jcation|J-TRIP'
    )
  ),
  60,
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
  '追蹤佐賀補助開賣、完售、恢復與新增通路公告',
  '公告與通路清單分開監控；排除 PHP、安全性及一般維護公告。',
  site.id,
  now()
from public.content_monitor_sites as site
where site.name = '九州旅遊補助｜佐賀公告'
on conflict (name) do update
set
  url = excluded.url,
  status = excluded.status,
  focus = excluded.focus,
  assessment = excluded.assessment,
  monitor_site_id = excluded.monitor_site_id,
  reviewed_at = excluded.reviewed_at;

-- This evergreen URL changes its CSS/JS cache suffixes independently of the
-- forecast. Compare only the edition, publication date and city forecast rows.
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
values (
  '日本紅葉預測｜日本氣象官方',
  'https://n-kishou.com/corp/news-contents/autumn/',
  true,
  'html',
  '.news_section > .title, .news_section > .date, #section02 .caption, #section02 table.autumn_ja tr',
  '{}',
  '{"structured_rows":true}'::jsonb,
  360,
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

-- Selector/canonical-URL changes intentionally alter comparison payloads.
-- Remove only unsent events, then establish a silent clean baseline.
with affected_sites as (
  select id
  from public.content_monitor_sites
  where name in (
    '九州旅遊補助｜佐賀',
    '九州旅遊補助｜佐賀公告',
    '日本紅葉預測｜日本氣象官方'
  )
     or request_headers->>'include_attributes' = 'true'
)
delete from public.content_monitor_events as event
using affected_sites
where event.site_id = affected_sites.id
  and event.notified_at is null;

with affected_sites as (
  select id
  from public.content_monitor_sites
  where name in (
    '九州旅遊補助｜佐賀',
    '九州旅遊補助｜佐賀公告',
    '日本紅葉預測｜日本氣象官方'
  )
     or request_headers->>'include_attributes' = 'true'
)
delete from public.content_monitor_state as state
using affected_sites
where state.site_id = affected_sites.id;
