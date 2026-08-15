# 網頁內容監控（Supabase 全雲端）

這套監控不使用本機狀態檔，也不需要電腦開機。它的資料、排程、通知佇列與執行紀錄都放在 Supabase；這個 repo 只保存可再次部署的原始碼。

`content_monitor_watchlist` 是來源總表：它記錄目前啟用中的監控，以及已評估但暫不啟用或需要客製規則的網址。可在 Supabase Table Editor 查看。

## 行為

- 首次讀到網站只建立基準，不發通知。
- 後續內容雜湊改變時，建立一個唯一的 `change` 事件。
- 事件先寫入資料庫、再由通知佇列送 Telegram；Telegram 暫時失敗會重試，不會因狀態先更新而遺失通知。
- 相同內容只會有一個事件；即使兩個排程重疊，也用資料庫唯一鍵與原子認領避免重複發送。
- 連續 3 次（可調整）讀取失敗才通知一次；恢復後通知一次。

## 一次性安裝

1. 在目標 Supabase 專案的 SQL Editor 執行 [supabase/content_monitor.sql](/e:/JieJourneysnext/supabase/content_monitor.sql:1)。
2. 在 Edge Functions Secrets 設定：
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `CONTENT_MONITOR_CRON_SECRET`：至少 32 字元的隨機字串
3. 部署：`supabase functions deploy content-monitor --project-ref YOUR_PROJECT_REF`
4. 建立第一個網站規則後，先用下方的 Telegram 測試，再建立 Cron 排程。

建立 Cron 前，請在 Dashboard 的 Database Extensions 確認已啟用 `pg_cron`、`pg_net` 與 `supabase_vault`。

Supabase 自帶 `SUPABASE_URL` 與服務端金鑰。Function 也相容於舊的 `SUPABASE_SERVICE_ROLE_KEY` 與新的 `SUPABASE_SECRET_KEYS` 環境變數。

## 新增被監控網站

HTML 網站，`selector_or_path` 為 CSS selector；例如只比較公告列表而非整頁：

```sql
insert into public.content_monitor_sites
  (name, url, source_type, selector_or_path, check_every_minutes)
values
  ('範例公告', 'https://example.com/notices', 'html', 'main .notice-list', 60);
```

一個 selector 可刻意命中多個項目（例如公告列表內所有標題與日期）；系統會依頁面順序把它們合併後比對，而不是只看第一列。

JSON API，`selector_or_path` 為 dot path；陣列索引也可用：

```sql
insert into public.content_monitor_sites
  (name, url, source_type, selector_or_path, check_every_minutes)
values
  ('範例 API', 'https://example.com/api/notices', 'json', 'data.items.0', 30);
```

若 API 回傳的每筆資料很大，可以用 `資料陣列路徑|欄位1,欄位2` 只比較必要欄位。例如下列規則只比較每篇新聞的 ID、標題與日期，不會保存全文、圖片或瀏覽數：

```sql
insert into public.content_monitor_sites
  (name, url, source_type, selector_or_path, check_every_minutes)
values
  ('範例新聞 API', 'https://example.com/api/news', 'json', 'data.contents|id,title,published_at', 360);
```

如果頁面每次都有變動日期，可在 `ignore_patterns` 填正則，先移除那段文字再比對。不要把會改變的時間戳放在 selector 選到的內容裡。

## 測試

以下所有請求都需要 `x-content-monitor-secret`。用 Postman、curl 或 Supabase Dashboard HTTP request 測試皆可。

```bash
# 只測 Telegram，不讀取網站
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/content-monitor?test=telegram' \
  -H 'x-content-monitor-secret: YOUR_SECRET'

# 抓取和解析、但不寫入資料庫也不發 Telegram
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/content-monitor?dryrun=true' \
  -H 'x-content-monitor-secret: YOUR_SECRET'
```

第一次正式執行會建立基準，預期 `baselineCount` 大於 0、`notifiedEventCount` 為 0。

## 建立 Supabase Cron（範例：每 6 小時）

先在 SQL Editor 建立一份和 `CONTENT_MONITOR_CRON_SECRET` **相同值**的 Vault secret。不要把這個值寫進 repo：

```sql
select vault.create_secret('REPLACE_WITH_THE_SAME_RANDOM_SECRET', 'content_monitor_cron_secret');
```

接著排程。請將 `YOUR_PROJECT_REF` 換為你的 Supabase project ref：

```sql
select cron.schedule(
  'content-monitor-every-6-hours',
  '0 */6 * * *',
  $$
    select net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/content-monitor',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-content-monitor-secret', (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'content_monitor_cron_secret'
        )
      ),
      body := '{}'::jsonb
    );
  $$
);
```

在 Supabase Dashboard 的 Cron 頁面可查看每次執行。停用排程：

```sql
select cron.unschedule('content-monitor-every-6-hours');
```

## 適用範圍

這個版本可抓取公開 HTML 或 JSON。若目標內容只能在登入後、需要 CAPTCHA，或必須執行大量前端 JavaScript 才出現，就要改用外接的瀏覽器服務；不要讓 Supabase Cron 直接重試該類網站，以免被封鎖。
