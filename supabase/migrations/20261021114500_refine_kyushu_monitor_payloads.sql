-- Monitor only booking dates, availability states and actionable notice rows.
-- Whole-page payloads are long enough that a change can fall outside the
-- stored preview and produce a useless blank old/new Telegram diff.

with sources(url, selector_or_path) as (
  values
    (
      'https://fukuoka-fukkou-wari.jp/',
      '.p-period, #apply .p-ota > li'
    ),
    (
      'https://saga-ouen.jp/',
      '#news .p-news__row, #operators .p-operators__list > li'
    ),
    (
      'https://oita-fukkou-wari.jp/',
      '#news .p-news__item, .p-period, #apply .p-ota > li'
    ),
    (
      'https://miyazaki-ouen.jp/',
      '#news .p-top__newsItem, #campaign_info .p-top__campaignDateWrap, #campaign_how .p-top__howListItemLinkWrap, #campaign_how .p-top__how-otaWrap'
    ),
    (
      'https://fukko-ouenwari.pref.kagoshima.jp/',
      '.p-period, #apply .p-ota > li'
    )
)
update public.content_monitor_sites as site
set
  selector_or_path = sources.selector_or_path,
  request_headers = coalesce(site.request_headers, '{}'::jsonb) || jsonb_build_object(
    'include_attributes', true,
    'notify_if_matches', jsonb_build_array(
      '発売|販売|予約|受付|完売|終了|再開|追加|延長|中止|クーポン|配布|宿泊施設|旅行会社|OTA|hotel_list|travel_agencies|[.]pdf|is-ended|sold.?out|ended|closed|available|https?://'
    )
  ),
  check_every_minutes = 60,
  next_check_at = least(site.next_check_at, now())
from sources
where site.url = sources.url;

-- Selector changes intentionally change the payload. Drop unsent noise and
-- let the first post-deploy run record a silent clean baseline.
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
