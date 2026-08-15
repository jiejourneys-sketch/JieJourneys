-- These sources were reviewed and intentionally left out of the monitor.
delete from public.content_monitor_watchlist
where url in (
  'https://www.gotokyo.org/tw/travel-directory/result/index/template/155,215',
  'https://www.mlit.go.jp/kankocho/en/index.html',
  'https://osaka-info.jp/zh-Hant-TW/event/'
);
