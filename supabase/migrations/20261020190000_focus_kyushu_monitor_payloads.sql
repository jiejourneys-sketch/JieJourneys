-- Keep Kyushu campaign alerts focused on actionable changes. The previous
-- selectors captured entire application sections, so removing a paragraph
-- could look like a new OTA and attribute-only updates could produce an empty
-- Telegram diff. These selectors track dates, platform rows and list links.

with sources(url, selector_or_path, notify_if_matches) as (
  values
    (
      'https://fukuoka-fukkou-wari.jp/',
      '.p-period, #apply .p-ota > li',
      '発売|販売|予約|受付|完売|終了|再開|追加|延長|中止|クーポン|配布|is-ended|sold.?out|ended|closed|available|https?://'
    ),
    (
      'https://oita-fukkou-wari.jp/',
      '#news .p-news__item, .p-period, #apply .p-ota > li',
      '発売|販売|予約|受付|完売|終了|再開|追加|延長|中止|クーポン|配布|is-ended|sold.?out|ended|closed|available|https?://'
    ),
    (
      'https://miyazaki-ouen.jp/',
      '#news .p-top__newsItem, #campaign_info .p-top__campaignDateWrap, #campaign_how .p-top__howListItemLinkWrap, #campaign_how .p-top__how-otaWrap',
      '発売|販売|予約|受付|完売|終了|再開|追加|延長|中止|クーポン|宿泊施設|旅行会社|OTA|hotel_list|travel_agencies|[.]pdf|https?://'
    ),
    (
      'https://fukko-ouenwari.pref.kagoshima.jp/',
      '.p-period, #apply .p-ota > li',
      '発売|販売|予約|受付|完売|終了|再開|追加|延長|中止|クーポン|配布|is-ended|sold.?out|ended|closed|available|https?://'
    )
)
update public.content_monitor_sites as site
set
  selector_or_path = sources.selector_or_path,
  request_headers = coalesce(site.request_headers, '{}'::jsonb) || jsonb_build_object(
    'include_attributes', true,
    'notify_if_matches', jsonb_build_array(sources.notify_if_matches)
  ),
  check_every_minutes = 60,
  next_check_at = least(site.next_check_at, now())
from sources
where site.url = sources.url;

-- Selector changes intentionally alter the monitored payload. Remove pending
-- events and comparison state so the first run records a silent clean baseline.
with source_urls(url) as (
  values
    ('https://fukuoka-fukkou-wari.jp/'),
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
    ('https://oita-fukkou-wari.jp/'),
    ('https://miyazaki-ouen.jp/'),
    ('https://fukko-ouenwari.pref.kagoshima.jp/')
)
delete from public.content_monitor_state as state
using public.content_monitor_sites as site, source_urls
where state.site_id = site.id
  and site.url = source_urls.url;
