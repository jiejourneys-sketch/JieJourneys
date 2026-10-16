-- Repair two long-running failures found in content_monitor_state.
-- Busan changed its empty-list markup; KIX blocks server-side requests with
-- HTTP 403 across its public site and needs a browser-backed monitor.

update public.content_monitor_sites
set
  selector_or_path = '.gw_tb01',
  request_headers = '{"include_attributes":true}'::jsonb,
  enabled = true,
  notify_failures = true,
  next_check_at = now()
where url = 'https://busanfireworks.com/notice_en';

delete from public.content_monitor_state as state
using public.content_monitor_sites as site
where state.site_id = site.id
  and site.url = 'https://busanfireworks.com/notice_en';

delete from public.content_monitor_events as event
using public.content_monitor_sites as site
where event.site_id = site.id
  and event.notified_at is null
  and site.url = 'https://busanfireworks.com/notice_en';

update public.content_monitor_sites
set enabled = false
where url = 'https://www.kansai-airport.or.jp/en/notices/important';

delete from public.content_monitor_events as event
using public.content_monitor_sites as site
where event.site_id = site.id
  and event.notified_at is null
  and site.url = 'https://www.kansai-airport.or.jp/en/notices/important';

update public.content_monitor_watchlist
set
  status = 'active',
  focus = '追蹤官方公告表；即使目前沒有公告，新增第一則時也會通知',
  assessment = '已配合 2026-10 網站結構更新選擇器。',
  reviewed_at = now()
where url = 'https://busanfireworks.com/notice_en';

update public.content_monitor_watchlist
set
  status = 'needs_custom_rule',
  focus = '關西機場重要公告',
  assessment = '官網對 Supabase Edge/server-side 請求固定回 HTTP 403；已停用以停止無效錯誤，日後需瀏覽器型監控。',
  reviewed_at = now()
where url = 'https://www.kansai-airport.or.jp/en/notices/important';
