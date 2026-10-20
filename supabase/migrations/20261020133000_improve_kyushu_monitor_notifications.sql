-- Make Kyushu campaign alerts actionable: ignore cosmetic/carousel-only
-- changes, check the short-lived campaign more often, and monitor the two
-- booking platforms added on October 19-20 directly.

update public.content_monitor_sites
set
  request_headers = coalesce(request_headers, '{}'::jsonb) || jsonb_build_object(
    'notify_if_matches',
    jsonb_build_array(
      '発売|販売|予約|受付|完売|終了|再開|追加|延長|中止|対象|割引|宿泊|旅行会社|OTA|クーポン|配布|利用期間|受付期間|is-ended|sold.?out|ended|closed|available'
    )
  ),
  check_every_minutes = 60,
  next_check_at = least(next_check_at, now())
where url in (
  'https://saga-ouen.jp/',
  'https://oita-fukkou-wari.jp/',
  'https://fukko-ouenwari.pref.kagoshima.jp/'
);

update public.content_monitor_sites
set
  check_every_minutes = 60,
  next_check_at = least(next_check_at, now())
where name like '九州旅遊補助｜%';

with sources(name, url, selector_or_path, request_headers) as (
  values
    (
      '九州旅遊補助｜Trip.com',
      'https://jp.trip.com/sale/w/3dcskhfy90ul2ffm/kyushu-fukkou.html',
      '.tcp-rich-text-con, .cf9s-block-text__cnt',
      '{"source_page_url":"https://jp.trip.com/sale/w/3dcskhfy90ul2ffm/kyushu-fukkou.html","notify_if_matches":["予約|宿泊|福岡県|長崎県|熊本県|鹿児島県|予算上限|受付|停止|終了|再開|追加|販売"]}'::jsonb
    ),
    (
      '九州旅遊補助｜AEON 福岡',
      'https://www.aeoncompass.com/campaign/26kyusyufukkou/fukuoka/',
      '#coupons .fukuokaCoupon',
      '{"include_attributes":true,"notify_if_matches":["クーポン|配布|終了|上限|獲得|受付|再開|追加|ended|disabled"]}'::jsonb
    ),
    (
      '九州旅遊補助｜AEON 熊本',
      'https://www.aeoncompass.com/campaign/26kyusyufukkou/kumamoto/',
      '#coupons .kumamotoCoupon',
      '{"include_attributes":true,"notify_if_matches":["クーポン|配布|終了|上限|獲得|受付|再開|追加|ended|disabled"]}'::jsonb
    )
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
  name,
  url,
  true,
  'html',
  selector_or_path,
  '{}',
  request_headers,
  30,
  true,
  true,
  now()
from sources
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
  '追蹤指定補助方案的開賣、額滿、釋回與追加',
  '平台原始活動頁；僅監控方案與優惠券狀態區塊。',
  site.id,
  now()
from public.content_monitor_sites as site
where site.name in (
  '九州旅遊補助｜Trip.com',
  '九州旅遊補助｜AEON 福岡',
  '九州旅遊補助｜AEON 熊本'
)
on conflict (name) do update
set
  url = excluded.url,
  status = excluded.status,
  focus = excluded.focus,
  assessment = excluded.assessment,
  monitor_site_id = excluded.monitor_site_id,
  reviewed_at = excluded.reviewed_at;
