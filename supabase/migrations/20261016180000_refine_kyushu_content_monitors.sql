-- Refine the Kyushu subsidy monitors after the campaign moved from the old
-- earthquake topic page to dedicated national, regional, and prefectural
-- pages. Several prefectures load news from CSV, so those feeds are monitored
-- separately while Telegram still links to the human-readable home page.

with sources(name, url, selector_or_path, request_headers) as (
  values
    ('九州旅遊補助｜日本觀光廳', 'https://www.mlit.go.jp/kankocho/page13_00002.html', 'article.st-article .st-article__cont', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜九州官方入口', 'https://fightkyushu.welcomekyushu.jp/', '#contents', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜福岡', 'https://fukuoka-fukkou-wari.jp/', '#apply, .p-period, #apply .is-ended', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜福岡公告', 'https://fukuoka-fukkou-wari.jp/csv/fukuoka_news.csv', 'body', '{"source_page_url":"https://fukuoka-fukkou-wari.jp/"}'::jsonb),
    ('九州旅遊補助｜佐賀', 'https://saga-ouen.jp/', '#news, #operators, #outline', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜長崎', 'https://nagasaki-fukkou-wari.jp/', '.p-hero__notice, #apply, .p-period, #apply .is-ended', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜長崎公告', 'https://nagasaki-fukkou-wari.jp/csv/nagasaki_news.csv', 'body', '{"source_page_url":"https://nagasaki-fukkou-wari.jp/"}'::jsonb),
    ('九州旅遊補助｜熊本', 'https://kumamoto-ouenwari.com/', 'main .news, main .content-1, main .content-5', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜大分', 'https://oita-fukkou-wari.jp/', '#news, #apply, .p-period, #apply .is-ended', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜宮崎', 'https://miyazaki-ouen.jp/', '#news, #campaign_info, #campaign_how', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜鹿兒島', 'https://fukko-ouenwari.pref.kagoshima.jp/', '#apply, .p-period, #apply .is-ended', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜鹿兒島公告', 'https://fukko-ouenwari.pref.kagoshima.jp/csv/kagoshima_news.csv', 'body', '{"source_page_url":"https://fukko-ouenwari.pref.kagoshima.jp/"}'::jsonb)
)
update public.content_monitor_sites as site
set
  enabled = true,
  source_type = 'html',
  selector_or_path = sources.selector_or_path,
  request_headers = sources.request_headers,
  ignore_patterns = '{}',
  check_every_minutes = 360,
  notify_changes = true,
  notify_failures = true,
  next_check_at = least(site.next_check_at, now())
from sources
where site.url = sources.url;

with sources(name, url, selector_or_path, request_headers) as (
  values
    ('九州旅遊補助｜日本觀光廳', 'https://www.mlit.go.jp/kankocho/page13_00002.html', 'article.st-article .st-article__cont', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜九州官方入口', 'https://fightkyushu.welcomekyushu.jp/', '#contents', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜福岡', 'https://fukuoka-fukkou-wari.jp/', '#apply, .p-period, #apply .is-ended', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜福岡公告', 'https://fukuoka-fukkou-wari.jp/csv/fukuoka_news.csv', 'body', '{"source_page_url":"https://fukuoka-fukkou-wari.jp/"}'::jsonb),
    ('九州旅遊補助｜佐賀', 'https://saga-ouen.jp/', '#news, #operators, #outline', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜長崎', 'https://nagasaki-fukkou-wari.jp/', '.p-hero__notice, #apply, .p-period, #apply .is-ended', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜長崎公告', 'https://nagasaki-fukkou-wari.jp/csv/nagasaki_news.csv', 'body', '{"source_page_url":"https://nagasaki-fukkou-wari.jp/"}'::jsonb),
    ('九州旅遊補助｜熊本', 'https://kumamoto-ouenwari.com/', 'main .news, main .content-1, main .content-5', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜大分', 'https://oita-fukkou-wari.jp/', '#news, #apply, .p-period, #apply .is-ended', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜宮崎', 'https://miyazaki-ouen.jp/', '#news, #campaign_info, #campaign_how', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜鹿兒島', 'https://fukko-ouenwari.pref.kagoshima.jp/', '#apply, .p-period, #apply .is-ended', '{"include_attributes":true}'::jsonb),
    ('九州旅遊補助｜鹿兒島公告', 'https://fukko-ouenwari.pref.kagoshima.jp/csv/kagoshima_news.csv', 'body', '{"source_page_url":"https://fukko-ouenwari.pref.kagoshima.jp/"}'::jsonb)
)
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
select
  sources.name,
  sources.url,
  true,
  'html',
  sources.selector_or_path,
  '{}',
  sources.request_headers,
  360,
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
  ignore_patterns = excluded.ignore_patterns,
  request_headers = excluded.request_headers,
  check_every_minutes = excluded.check_every_minutes,
  notify_changes = true,
  notify_failures = true,
  next_check_at = least(public.content_monitor_sites.next_check_at, now());

-- The obsolete August earthquake topic did not publish the later booking and
-- sell-out updates. Keep its history but stop scheduling it.
update public.content_monitor_sites
set enabled = false
where url = 'https://www.mlit.go.jp/kankocho/topics04_00093.html';

-- The Colosseum ticket checker was exploratory and is no longer wanted. This
-- is intentionally idempotent: it also disables a dashboard-only row if one
-- was ever created outside the repository.
update public.content_monitor_sites
set enabled = false
where lower(url) like '%ticketing.colosseo.it%'
   or lower(name) like '%colosseum%'
   or name like '%羅馬競技場%';

delete from public.content_monitor_events as event
using public.content_monitor_sites as site
where event.site_id = site.id
  and event.notified_at is null
  and (
    lower(site.url) like '%ticketing.colosseo.it%'
    or lower(site.name) like '%colosseum%'
    or site.name like '%羅馬競技場%'
  );

-- Selector and attribute extraction changes alter the compared payload. Clear
-- only the affected states and pending events so the first post-deploy run is
-- a silent baseline rather than a burst of false updates.
with source_urls(url) as (
  values
    ('https://www.mlit.go.jp/kankocho/page13_00002.html'),
    ('https://fightkyushu.welcomekyushu.jp/'),
    ('https://fukuoka-fukkou-wari.jp/'),
    ('https://fukuoka-fukkou-wari.jp/csv/fukuoka_news.csv'),
    ('https://saga-ouen.jp/'),
    ('https://nagasaki-fukkou-wari.jp/'),
    ('https://nagasaki-fukkou-wari.jp/csv/nagasaki_news.csv'),
    ('https://kumamoto-ouenwari.com/'),
    ('https://oita-fukkou-wari.jp/'),
    ('https://miyazaki-ouen.jp/'),
    ('https://fukko-ouenwari.pref.kagoshima.jp/'),
    ('https://fukko-ouenwari.pref.kagoshima.jp/csv/kagoshima_news.csv'),
    ('https://www.mlit.go.jp/kankocho/topics04_00093.html')
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
    ('https://www.mlit.go.jp/kankocho/page13_00002.html'),
    ('https://fightkyushu.welcomekyushu.jp/'),
    ('https://fukuoka-fukkou-wari.jp/'),
    ('https://fukuoka-fukkou-wari.jp/csv/fukuoka_news.csv'),
    ('https://saga-ouen.jp/'),
    ('https://nagasaki-fukkou-wari.jp/'),
    ('https://nagasaki-fukkou-wari.jp/csv/nagasaki_news.csv'),
    ('https://kumamoto-ouenwari.com/'),
    ('https://oita-fukkou-wari.jp/'),
    ('https://miyazaki-ouen.jp/'),
    ('https://fukko-ouenwari.pref.kagoshima.jp/'),
    ('https://fukko-ouenwari.pref.kagoshima.jp/csv/kagoshima_news.csv'),
    ('https://www.mlit.go.jp/kankocho/topics04_00093.html')
)
delete from public.content_monitor_state as state
using public.content_monitor_sites as site, source_urls
where state.site_id = site.id
  and site.url = source_urls.url;

with sources(name, url) as (
  values
    ('九州旅遊補助｜日本觀光廳', 'https://www.mlit.go.jp/kankocho/page13_00002.html'),
    ('九州旅遊補助｜九州官方入口', 'https://fightkyushu.welcomekyushu.jp/'),
    ('九州旅遊補助｜福岡', 'https://fukuoka-fukkou-wari.jp/'),
    ('九州旅遊補助｜福岡公告', 'https://fukuoka-fukkou-wari.jp/csv/fukuoka_news.csv'),
    ('九州旅遊補助｜佐賀', 'https://saga-ouen.jp/'),
    ('九州旅遊補助｜長崎', 'https://nagasaki-fukkou-wari.jp/'),
    ('九州旅遊補助｜長崎公告', 'https://nagasaki-fukkou-wari.jp/csv/nagasaki_news.csv'),
    ('九州旅遊補助｜熊本', 'https://kumamoto-ouenwari.com/'),
    ('九州旅遊補助｜大分', 'https://oita-fukkou-wari.jp/'),
    ('九州旅遊補助｜宮崎', 'https://miyazaki-ouen.jp/'),
    ('九州旅遊補助｜鹿兒島', 'https://fukko-ouenwari.pref.kagoshima.jp/'),
    ('九州旅遊補助｜鹿兒島公告', 'https://fukko-ouenwari.pref.kagoshima.jp/csv/kagoshima_news.csv')
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
  '官方一級來源；監控精準內容區塊，公告資料檔會連回可閱讀的官網。',
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

update public.content_monitor_watchlist
set
  status = 'reviewed',
  focus = '舊的地震觀光公告頁，已由九州旅遊補助專頁取代',
  assessment = '保留紀錄但停用監控；後續改追蹤日本觀光廳與各縣活動官網。',
  monitor_site_id = null,
  reviewed_at = now()
where url = 'https://www.mlit.go.jp/kankocho/topics04_00093.html';
