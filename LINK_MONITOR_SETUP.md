# Link Monitor Setup

最小使用方式：

1. 先列出目前程式碼裡的外部連結
   `npm run links:list`
2. 正式檢查所有外部連結
   `npm run links:check`

預設排程邏輯：

- 預設分成 `7` 批
- 每次執行只檢查 `1` 批
- 用台北時區的星期自動決定今天跑哪一批
- 也就是 `7 天巡完整站一次`

手動模式：

- 全部都跑：`node scripts/link-monitor.mjs --all`
- 指定批數：`node scripts/link-monitor.mjs --batch-count=7 --batch-index=0`

輸出位置：

- `monitor-data/link-monitor-report.json`
- `monitor-data/link-monitor-state.json`

只有偵測到新的異常時才會發 Telegram。

需要的環境變數：

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

可選環境變數：

- `LINK_MONITOR_TIMEOUT_MS`
- `LINK_MONITOR_CONCURRENCY`
- `LINK_MONITOR_BATCH_COUNT`
- `LINK_MONITOR_BATCH_INDEX`

目前第一版判斷：

- `healthy`: 正常
- `broken`: 404 / 410
- `down`: timeout / DNS / SSL / 5xx
- `suspicious`: 連到子頁卻被導回同網域首頁
- `manual_review`: 403 / 429

設計重點：

- 每天跑一次即可
- 同一個異常不會每天重複通知
- 只有新異常才通知 Telegram
