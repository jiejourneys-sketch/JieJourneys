# Supabase Link Monitor

這份設定是正式上線版：

- Supabase Edge Function 直接抓正式站 `sitemap.xml`
- 每天只跑 `1` 批
- 預設分成 `7` 批
- `7` 天巡完整站一次
- 只在新異常時送 Telegram

## 1. 建表

先在 Supabase SQL Editor 執行：

- [scripts/link_monitor_supabase.sql](/e:/JieJourneysnext/scripts/link_monitor_supabase.sql:1)

## 2. 建 Edge Function

把這個檔案部署到 Supabase：

- [supabase/functions/link-monitor/index.ts](/e:/JieJourneysnext/supabase/functions/link-monitor/index.ts:1)

## 3. 設 secrets

至少需要：

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

建議一起設：

- `SITE_SITEMAP_URL`
  例：`https://www.jiejourneys.com/sitemap.xml`
- `LINK_MONITOR_BATCH_COUNT`
  例：`7`
- `LINK_MONITOR_TIMEOUT_MS`
  例：`12000`
- `LINK_MONITOR_CONCURRENCY`
  例：`6`

## 4. 排程

建議每天跑一次，讓它自動輪到不同批次。

如果要測試：

- `.../functions/v1/link-monitor?dryrun=true`

如果要手動指定批次：

- `.../functions/v1/link-monitor?batch=0`
- `.../functions/v1/link-monitor?batch=1`

如果要全部都跑：

- `.../functions/v1/link-monitor?batch=all`

## 5. 未來新增網址

不用重新登記。

因為這版是直接掃正式網站：

- 新頁面只要出現在 `sitemap.xml`
- 新外連只要出現在頁面 HTML

下次輪到那一批時就會自動被抓到。
