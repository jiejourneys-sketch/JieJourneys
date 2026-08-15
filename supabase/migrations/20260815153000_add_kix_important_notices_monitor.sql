insert into public.content_monitor_sites (
  name,
  url,
  source_type,
  selector_or_path,
  check_every_minutes,
  enabled,
  notify_changes,
  notify_failures
)
values (
  '關西機場｜重要公告',
  'https://www.kansai-airport.or.jp/en/notices/important',
  'html',
  '#block-views-block-notices-list-block-1 .card-notice',
  720,
  true,
  true,
  true
)
on conflict (name) do update
set
  url = excluded.url,
  source_type = excluded.source_type,
  selector_or_path = excluded.selector_or_path,
  check_every_minutes = excluded.check_every_minutes,
  enabled = true,
  notify_changes = true,
  notify_failures = true,
  next_check_at = now();

insert into public.content_monitor_watchlist (
  name,
  url,
  status,
  focus,
  assessment,
  monitor_site_id
)
select
  '關西機場｜重要公告',
  'https://www.kansai-airport.or.jp/en/notices/important',
  'active',
  '僅追蹤 Important Notice：入出境、交通與重要設施異動。',
  '使用機場的獨立重要公告頁，排除商店、活動與停車會員資訊，通知訊號乾淨。',
  id
from public.content_monitor_sites
where name = '關西機場｜重要公告'
on conflict (name) do update
set
  url = excluded.url,
  status = excluded.status,
  focus = excluded.focus,
  assessment = excluded.assessment,
  monitor_site_id = excluded.monitor_site_id,
  reviewed_at = now();
