# Stay22 分批導入紀錄

## 2026/10/27：恢復九州，新增三頁

本次恢復九州補助並新增三頁。實際觀察期間從 Vercel 正式部署成功時開始計算。

使用者提供的 Stay22 設定截圖顯示 LinkSwap Disabled、Spark Enabled、Nova Enabled。延用同一個 LMA ID：`6ad2380fdd2d6b34accebcab`。這些功能開關由 Stay22 後台管理，前端只載入指定 ID，沒有另外覆寫後台設定。

| 本次處理 | 路徑 | 理由 |
|---|---|---|
| 恢復 | `/japan/kyushu-travel-subsidy-2026` | 截圖已有三筆交易；LinkSwap 關閉後恢復限頁測試。一般住宿搜尋不代表符合政府補助。 |
| 新增 | `/busan/busan-fireworks-festival-guide` | 11/7 活動有固定日期與住宿需求，趁活動前小範圍測試。 |
| 新增 | `/osaka/kansai-airport-terminal-guide` | 原分析第二波候選，機場與出發前資訊可承接住宿需求。 |
| 新增 | `/busan/busan-preparation-guide` | 原分析第二波候選，行前規劃意圖明確。 |

## 延續既有五頁

- `/kyoto-nara/video`
- `/kyoto-nara/kyoto-fushimi-inari-guide`
- `/osaka/osaka-castle-guide`
- `/busan/haeundae-guide`
- `/busan/nampo-dong-guide`

本次完成後共九頁，均在各自路由的 `layout.tsx` 使用 `components/Stay22PageScript.tsx`。離開指定路徑時沿用完整文件導覽，避免第三方狀態跨路由殘留。

## 本機驗證

- TypeScript、四個 layout 與共用載入器的 ESLint、差異格式檢查通過。
- 390px 與 1365px 驗證四個變更頁：只載入一次、LMA ID 正確、原有 Agoda／Trip 參數保留；離頁後完整重新載入且 Stay22 全域狀態清除。
- Planner、東京住宿、釜山票券、釜山首頁與網站首頁未載入 Stay22。
- 路由測試攔截並替代第三方腳本，避免測試產生 Stay22 流量；驗證範圍是網站載入與隔離行為，不包含 Stay22 後端實際選字、開啟住宿搜尋或佣金歸因。LinkSwap 關閉的依據是使用者提供的後台截圖。

## 這波維持現況

- Planner、住宿資料庫、地圖、票券與城市首頁。
- 其他區域／交通文章的手動 Agoda、Trip.com 聯盟連結。
- 釜山最速攻略、其他機場進市區交通等候選頁，留待下一次評估。

## 成效基準

以 2026/10/1～10/27 的後台報表作為部署前基準；具體交易與佣金資料保留在使用者後台及本機工作紀錄，不寫入版本庫。

Analytics 與 Page Analytics 的點擊計數尚無法直接對帳，不將它們混用計算轉換率。Views／Interactions 為 0 也不能單憑這點斷定腳本未運作。

報表不足以判定每筆交易來自 Nova 或 Spark，也不能代表原有聯盟收入之外的淨增量；LinkSwap 關閉的確切時間未提供，舊交易不套用目前開關狀態推論。

## 下一次檢查

- 若於 10/27 部署，11/10 做新一波兩週檢查；量不足就延長至四週。日期依實際部署日順延。
- 釜山煙火另於 11/7 活動結束後檢查短期表現。
- 比較各頁流量／載入、Stay22 交易狀態與佣金、原有 Agoda／Trip 點擊、票券點擊及閱讀參與。
- 以「直接聯盟＋Stay22」的總收益和相近流量期間比較，避免把尚待確認的佣金當成已收款，或把單一大額訂單當成穩定趨勢。
- 確認是否出現不合適的 Spark 新連結、一般房價是否被誤解為補助房型，以及 Nova 對閱讀／導航的實際影響。

## 官方參考

- [Nova 運作與 LMA 報表](https://community.stay22.com/how-nova-works)
- [Spark 與既有連結](https://www.stay22.com/publishers-spark)
- [交易狀態與付款狀態](https://community.stay22.com/your-updated-hub-reporting-terms)
