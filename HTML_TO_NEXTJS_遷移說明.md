# JieJourneys：HTML 轉 Next.js 遷移說明

> 供工程師了解整個遷移架構、對應關係與技術決策的技術文件

---

## 一、專案概覽

**原架構：** 純靜態 HTML 網站（多個 `.html` 檔案）  
**現架構：** Next.js 15（App Router）+ React 19 + TypeScript + Tailwind CSS 4

**遷移原則：**
- 保持原有 URL 結構與使用者行為一致
- 完整保留 GA4 追蹤（`data-event`、`gtag`）
- 視覺與互動與原 HTML 版本對齊
- 訂單流程（order.html、paid.html）仍為靜態 HTML，放在 `public/` 直接提供

---

## 二、URL 對照表（HTML → Next.js）

| 原 HTML 路徑 | Next.js 路由 | 說明 |
|-------------|-------------|------|
| `index.html` | `/` | 首頁 |
| `contact.html` | `/contact` | 聯絡我們 |
| `busan/index.html` | `/busan` | 釜山城市頁 |
| `busan/video.html` | `/busan/video` | 釜山短影音 |
| `busan/hotel.html` | `/busan/hotel` | 釜山住宿 |
| `busan/ticket.html` | `/busan/ticket` | 釜山票券 |
| `busan/transport.html` | `/busan/transport` | 釜山交通 |
| `busan/journeys/index.html` | `/busan/journeys` | 釜山行程 PDF 介紹頁 |
| `busan/journeys/order.html` | `/busan/journeys/order.html` | 訂單頁（**仍為 HTML**） |
| `busan/journeys/paid.html` | `/busan/journeys/paid.html` | 付款成功頁（**仍為 HTML**） |
| `northvietnam/index.html` | `/northvietnam` | 北越城市頁 |
| `northvietnam/video.html` | `/northvietnam/video` | 北越短影音 |
| `northvietnam/hotel.html` | `/northvietnam/hotel` | 北越住宿 |
| `northvietnam/ticket.html` | `/northvietnam/ticket` | 北越票券 |
| `northvietnam/transport.html` | `/northvietnam/transport` | 北越交通 |
| `northvietnam/journeys/index.html` | `/northvietnam/journeys` | 北越行程 PDF 介紹頁 |
| `northvietnam/journeys/order.html` | 同上，HTML 保留 | |
| `northvietnam/journeys/paid.html` | 同上，HTML 保留 | |
| `tokyo/index.html` | `/tokyo` | 東京城市頁 |
| `tokyo/video.html` | `/tokyo/video` | 東京短影音 |
| `tokyo/hotel.html` | `/tokyo/hotel` | 東京住宿 |
| `tokyo/ticket.html` | `/tokyo/ticket` | 東京票券 |
| `tokyo/transport.html` | `/tokyo/transport` | 東京交通 |
| `tokyo/journeys/index.html` | `/tokyo/journeys` | 東京行程 PDF 介紹頁 |
| `tokyo/journeys/order.html` | 同上，HTML 保留 | |
| `tokyo/journeys/paid.html` | 同上，HTML 保留 | |

**訂單流程保留 HTML 的原因：** order.html、paid.html 可能含金流、表單或第三方流程，暫時不遷移，放在 `public/` 直接提供，Next.js 的 Journeys 頁以 `<a href="/xxx/journeys/order.html">` 導向。

---

## 三、專案結構

```
jiejourneysnext/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 根 layout（GA、GtagCapture、metadata）
│   ├── page.tsx                  # 首頁
│   ├── globals.css               # 全站樣式（由原 HTML inline/style 整合）
│   ├── contact/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── busan/
│   │   ├── layout.tsx            # 釜山 metadata
│   │   ├── page.tsx              # 釜山城市頁
│   │   ├── video/
│   │   ├── hotel/
│   │   ├── ticket/
│   │   ├── transport/
│   │   └── journeys/
│   │       └── page.tsx          # PDF 介紹頁
│   ├── northvietnam/             # 結構同 busan
│   └── tokyo/                    # 結構同 busan
├── components/
│   ├── GtagCapture.tsx           # 全站 data-event 點擊追蹤（client）
│   ├── SiteHeader.tsx            # 首頁用 header
│   ├── TopBanner.tsx
│   ├── SearchBox.tsx
│   ├── PopularGrid.tsx           # 熱門攻略區塊
│   ├── FAQ.tsx
│   ├── Footer.tsx
│   ├── CitySubpageHeader.tsx     # 城市子頁 header（上一頁 / 回首頁）
│   ├── JourneysHeader.tsx        # Journeys 專用 header（jj-topbar 風格）
│   ├── CityTabbedList.tsx        # 通用 tab + 卡片列表（北越/東京 hotel/ticket/video）
│   ├── BusanHotelContent.tsx     # 釜山住宿（含影片、卡片）
│   ├── BusanVideoContent.tsx     # 釜山短影音
│   ├── BusanTicketContent.tsx    # 釜山票券
│   ├── BusanTransportContent.tsx # 釜山交通（eSIM、SIM、Wifi、KTX、機場等）
│   ├── AreaTabs.tsx
│   └── TransportTabs.tsx
├── lib/
│   └── gtag.ts                   # getGtag() 供 client 端呼叫
├── public/
│   ├── assets/                   # 圖片、logo 等
│   ├── busan/journeys/           # 釜山 journeys 圖片 + order.html, paid.html
│   ├── northvietnam/journeys/
│   ├── tokyo/journeys/
│   └── *.html                    # 原 HTML（部分保留作對照或靜態提供）
```

---

## 四、城市頁面實作差異

| 城市 | 子頁（video/hotel/ticket/transport） | 說明 |
|------|-------------------------------------|------|
| **釜山** | 使用專用元件 | `BusanHotelContent`、`BusanVideoContent`、`BusanTicketContent`、`BusanTransportContent`，內容較複雜、有影片嵌入、分區 tab 等 |
| **北越** | 使用 `CityTabbedList` | 以 `tabs` + `cards` 資料驅動，結構較一致 |
| **東京** | 使用 `CityTabbedList` | 同上，資料結構類似北越 |

**原因：** 釜山為最早、內容最豐富的線路，有客製化 UI；北越、東京採通用 `CityTabbedList` 加快開發與維護。

---

## 五、GA 追蹤架構

### 1. 全站點擊追蹤（data-event）

- **元件：** `components/GtagCapture.tsx`
- **掛載位置：** `app/layout.tsx`（根 layout）
- **機制：** document 層級 `click` 事件（capture: true），偵測 `[data-event]` 並呼叫 `gtag('event', name, {...})`
- **參數：** 從元素及上層卡片收集 `page_path`、`label`、`hotel`、`platform`、`area`、`url`、`item`、`section`、`video`、`title`

### 2. FAQ 展開追蹤（bt_faq_open）

- **位置：** `app/*/journeys/page.tsx` 內 `<Script>`
- **機制：** 對 `#faq details` 綁定 `toggle` 事件，展開時送出 `bt_faq_open`，含 `qid`、`question`

### 3. gtag 載入

- **位置：** `app/layout.tsx`
- **ID：** `G-NCTMJ4F5XP`
- **輔助：** `lib/gtag.ts` 提供 `getGtag()`，供 client 元件在需要時呼叫

### 4. 使用方式

任何需要追蹤的連結或按鈕加上 `data-event="事件名稱"`，必要時加上 `data-item`、`data-platform`、`data-section` 等，無需額外 JS。

---

## 六、重要元件與對應 HTML

| 元件 | 對應原 HTML | 用途 |
|------|-------------|------|
| `CitySubpageHeader` | 城市子頁的 header（上一頁、回首頁、logo） | 城市 video/hotel/ticket/transport 頁 |
| `JourneysHeader` | Journeys 頁的 jj-topbar | PDF 介紹頁專用 |
| `CityTabbedList` | 北越/東京的 tab 式卡片列表 | 住宿、票券、短影音 |
| `BusanTransportContent` | 釜山 transport 的 eSIM、SIM、Wifi、KTX、機場等卡片 | 僅釜山交通 |
| `BusanTicketContent` | 釜山 ticket 票券卡片 | 僅釜山票券 |
| `BusanHotelContent` | 釜山 hotel（含影片介紹） | 僅釜山住宿 |
| `BusanVideoContent` | 釜山 video 短影音列表 | 僅釜山短影音 |

---

## 七、樣式來源

- **`app/globals.css`**：由原 HTML 的 `<style>` 與各頁 CSS 整合而成
- 使用 CSS 變數（`:root`）維持品牌色、間距等
- 保留並擴充了 jj-topbar、cta-secondary、secondary-btn、feature thumbnails、#faq details、buy-bar 等樣式

---

## 八、圖片與靜態資源

- 首頁／共通：`/assets/...`
- 城市頁：`/assets/...`（與原 HTML 路徑對齊）
- Journeys 頁：依城市使用 `/busan/journeys/assets/...`、`/northvietnam/journeys/assets/...`、`/tokyo/journeys/assets/...`

---

## 九、聯絡表單

- **位置：** `app/contact/page.tsx`
- **後端：** Supabase Edge Function `contact-submit`
- **頁面結構：** 僅 back-chip + form card，無 SiteHeader/Footer，與原 HTML 一致

---

## 十、技術棧

- **框架：** Next.js 15.5、React 19
- **樣式：** Tailwind CSS 4
- **部署：** Vercel（含 Vercel Analytics）
- **分析：** GA4 (G-NCTMJ4F5XP)、Vercel Analytics

---

## 十一、參考：原 HTML 檔案位置

原 HTML 保留在 `public/` 作為對照與靜態資源提供，例如：

- `public/index.html` — 首頁
- `public/contact.html` — 聯絡
- `public/busan/index.html`、`video.html`、`hotel.html`、`ticket.html`、`transport.html`
- `public/busan/journeys/index.html`、`order.html`、`paid.html`
- 北越、東京結構同上

遷移時以這些檔案為「視覺與互動基準」，確保 Next.js 版本與之對齊。

---

**文件版本：** 2025-03-23
