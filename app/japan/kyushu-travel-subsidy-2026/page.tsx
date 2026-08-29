import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  kyushuTravelSubsidy2026Canonical,
  kyushuTravelSubsidy2026Description,
  kyushuTravelSubsidy2026Title,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const UPDATED_AT = '2026-08-28'

const JAPAN_TOURISM_AGENCY_URL = 'https://www.mlit.go.jp/kankocho/page04_00060.html'
const JAPAN_TOURISM_AGENCY_PDF_URL = 'https://www.mlit.go.jp/kankocho/content/002018975.pdf'
const CABINET_OFFICE_URL = 'https://www.bousai.go.jp/updates/r8kumamoto_jishin/index.html'
const RAKUTEN_TRAVEL_URL = 'https://travel.rakuten.co.jp/special/kumamoto-offers/?l-id=dptop_widebnr_dp_kumamoto_202608'

type ActionLink = {
  label: string
  href: string
  event: string
  platform: string
  primary?: boolean
}

function ActionLinks({ label, links }: { label: string; links: ActionLink[] }) {
  return (
    <div className="seo-buy-links seo-action-links" aria-label={label}>
      {links.map((link) => (
        <a
          key={`${link.label}-${link.href}`}
          className={link.primary ? 'seo-buy-link primary' : 'seo-buy-link'}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          data-event={link.event}
          data-platform={link.platform}
          data-section="article_link"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

const officialLinks: ActionLink[] = [
  {
    label: '觀光廳最新公告',
    href: JAPAN_TOURISM_AGENCY_URL,
    event: 'kyushusubsidy_jta_notice',
    platform: 'Japan Tourism Agency',
    primary: true,
  },
  {
    label: '官方事業概要 PDF',
    href: JAPAN_TOURISM_AGENCY_PDF_URL,
    event: 'kyushusubsidy_jta_pdf',
    platform: 'Japan Tourism Agency',
  },
  {
    label: '內閣府支援方案',
    href: CABINET_OFFICE_URL,
    event: 'kyushusubsidy_cabinet_office',
    platform: 'Cabinet Office',
  },
]

const discountRows = [
  {
    area: '熊本、鹿兒島',
    discount: '60% 折抵',
    travelerPays: '旅客實付 40%',
    note: '兩縣因住宿取消對觀光衝擊較大，適用較高補助率。',
  },
  {
    area: '福岡、佐賀、長崎、大分、宮崎',
    discount: '50% 折抵',
    travelerPays: '旅客實付 50%',
    note: '目前公告的其餘五個九州縣。',
  },
]

const capRows = [
  {
    product: '單訂住宿／交通＋住宿 1 晚',
    cap: '最高 ¥20,000',
    note: '至少需有 1 晚九州住宿。',
  },
  {
    product: '交通＋住宿 2 晚以上',
    cap: '最高 ¥30,000',
    note: '交通付住宿旅行商品；國際機票是否可算入尚未公布。',
  },
  {
    product: '跨 2 縣以上住宿的周遊商品',
    cap: '最高 ¥35,000',
    note: '住宿地必須跨公告的九州縣。',
  },
]

const faqItems = [
  {
    q: '九州復興應援割是什麼？',
    a: '這是日本政府針對 2026 年熊本地震後觀光需求推出的旅行與住宿折扣支援。公告對象為九州七縣的至少一晚住宿旅行商品；熊本、鹿兒島折抵 60%，福岡、佐賀、長崎、大分、宮崎折抵 50%。',
  },
  {
    q: '10 月 1 日是開賣日嗎？',
    a: '不是。官方寫的是 2026 年 10 月 1 日住宿分起適用；具體預訂開始日與折扣適用期間會由七個縣分別設定，因此不一定同一天開賣。',
  },
  {
    q: '台灣旅客確定可以用九州旅遊補助嗎？',
    a: '尚未確認。官方資料使用「國內旅客等」的表述，但沒有公開國籍、居住地或訪日外國旅客的適用定義；現階段不能寫成台灣旅客已確定享有熊本、鹿兒島住宿 4 折。',
  },
  {
    q: 'Agoda、Booking.com、楽天、じゃらん可以訂嗎？',
    a: '尚未公布品牌名單。觀光廳的執行架構有列住宿預訂網站、旅行社與住宿業者，但沒有點名任何平台或旅行社，因此只能等待各縣正式公告。',
  },
  {
    q: '已經訂好的住宿可以事後套用補助嗎？',
    a: '尚未公布。不要把其他活動的規則套到政府補助；最穩的做法是先保留可免費取消的訂單，等待實際販售方式與既有訂單處理規定。',
  },
  {
    q: '楽天的熊本、鹿兒島優惠券就是政府補助嗎？',
    a: '不是。楽天 8 月 28 日推出的是自家「熊本・鹿兒島觀光應援優惠券」，目前有熊本住宿最高 10% 與熊本、鹿兒島住宿 5% 等方案；它和政府 50～60% 的九州復興應援割是兩個不同活動。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: kyushuTravelSubsidy2026Title.replace(' | JieJourneys(旅杰)', ''),
  description: kyushuTravelSubsidy2026Description,
  inLanguage: 'zh-Hant',
  datePublished: UPDATED_AT,
  dateModified: UPDATED_AT,
  mainEntityOfPage: kyushuTravelSubsidy2026Canonical,
  author: { '@type': 'Organization', name: 'JieJourneys(旅杰)', url: SITE_URL },
  publisher: {
    '@type': 'Organization',
    name: 'JieJourneys(旅杰)',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/og-share.png` },
  },
  image: `${SITE_URL}/assets/og-share.png`,
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

type KyushuTravelSubsidy2026PageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'home') return '/'
  return '/'
}

export default async function KyushuTravelSubsidy2026Page({ searchParams }: KyushuTravelSubsidy2026PageProps) {
  const params = (await searchParams) ?? {}
  const backHref = sourceBackHref(params.from)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={backHref} eventPrefix="kyushusubsidy" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="九州旅遊速報｜2026/8/28 更新"
          h1="九州旅遊補助最高省 6 成｜2026 九州復興應援割怎麼用？"
          intro="日本政府已公布九州復興應援割，熊本、鹿兒島最高折抵 60%，其餘五縣 50%。不過 10/1 是住宿適用起點，不是統一開賣日；台灣旅客資格、訂房平台與既有訂單能否補折，都還要等各縣細則。"
          eventPrefix="kyushusubsidy"
          showVisual={false}
          ctaLinks={[
            { label: '先看已確認重點', href: '#quick-answer', dataEvent: 'kyushusubsidy_hero_quick', platform: 'article' },
            { label: '折扣與上限', href: '#discount', dataEvent: 'kyushusubsidy_hero_discount', platform: 'article' },
            { label: '台灣旅客資格', href: '#pending', dataEvent: 'kyushusubsidy_hero_pending', platform: 'article' },
            { label: '官方最新公告', href: JAPAN_TOURISM_AGENCY_URL, dataEvent: 'kyushusubsidy_hero_official', platform: 'Japan Tourism Agency' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="九州旅遊補助快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">最早適用</span>
              <strong>2026/10/1 住宿分起</strong>
              <p>這不是統一開賣日；七縣各自決定實際訂購與適用期間。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">最高折扣</span>
              <strong>熊本、鹿兒島省 60%</strong>
              <p>福岡、佐賀、長崎、大分、宮崎則為 50%，日文「6 割引」是省六成。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">最高折抵額</span>
              <strong>¥20,000～¥35,000</strong>
              <p>依單訂住宿、交通＋住宿天數與是否跨兩縣住宿而不同。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">現在最重要</span>
              <strong>台灣旅客仍待確認</strong>
              <p>平台名單、國際機票、既有訂單與排除日期也都還沒有正式細則。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="discount" aria-label="九州復興應援割折扣與上限">
          <h2 className="seo-h2">已確認：九州七縣、折扣率與每人最高折抵額</h2>
          <div className="seo-prose">
            <p>
              日本觀光廳公告的對象是九州地方的一晚以上旅行／住宿商品，目前列出的範圍為<strong>福岡、佐賀、長崎、熊本、大分、宮崎、鹿兒島</strong>七縣。公告沒有將沖繩列入本次方案；本文的「九州」皆指這七縣。
            </p>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>住宿地區</th>
                    <th>旅行／住宿費折抵</th>
                    <th>旅客實付</th>
                    <th>為什麼不同？</th>
                  </tr>
                </thead>
                <tbody>
                  {discountRows.map((row) => (
                    <tr key={row.area}>
                      <td><strong>{row.area}</strong></td>
                      <td>{row.discount}</td>
                      <td>{row.travelerPays}</td>
                      <td>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="seo-h3">上限看旅行商品，不是旅行總價上限</h3>
            <p>下表金額是每人可折抵的最高額度，不是你只能買到這個價格的旅行。符合每人計算規則時，熊本一晚原價 ¥20,000、以 60% 計算可折 ¥12,000，實付 ¥8,000。</p>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>商品類型</th>
                    <th>最高折抵額</th>
                    <th>目前可確認的範圍</th>
                  </tr>
                </thead>
                <tbody>
                  {capRows.map((row) => (
                    <tr key={row.product}>
                      <td><strong>{row.product}</strong></td>
                      <td>{row.cap}</td>
                      <td>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              制度最早從<strong>10 月 1 日的住宿分</strong>開始，但每一縣實際何時開賣、適用到哪一天，均由各縣決定。觀光廳也明確表示，各縣公布後會持續更新在
              <a href={JAPAN_TOURISM_AGENCY_URL} target="_blank" rel="noopener noreferrer" data-event="kyushusubsidy_discount_jta_inline" data-platform="Japan Tourism Agency" data-section="article_link">
                <strong>官方最新公告頁</strong>
              </a>
              。
            </p>
          </div>
        </section>

        <section className="seo-content" id="pending" aria-label="九州旅遊補助尚未公布細則">
          <h2 className="seo-h2">現在不能確定的事：台灣旅客、平台與國際機票都還沒答案</h2>
          <div className="seo-prose">
            <p>
              官方概要使用「<strong>國內旅客等</strong>」的表述，卻尚未公開國籍、居住地或訪日外國旅客的定義。因此現在最保守、也最正確的寫法是：<strong>台灣旅客資格待各縣細則確認</strong>，不能先宣稱「台灣人住熊本、鹿兒島確定打 4 折」。
            </p>
            <h3 className="seo-h3">六個先不要寫滿的重點</h3>
            <ol>
              <li><strong>台灣旅客是否適用：</strong>沒有公布國籍或居住地門檻。</li>
              <li><strong>哪些平台可訂：</strong>官方執行架構列有旅行社、住宿業者與住宿預訂網站，但尚未點名楽天、じゃらん、Agoda、Booking.com 或台灣旅行社。</li>
              <li><strong>國際機票是否算交通：</strong>官方只寫「交通付住宿旅行商品」，不足以推論台灣往返九州的國際航段一定能納入。</li>
              <li><strong>已訂訂單能否補折：</strong>尚未公布，請不要先取消既有預訂。</li>
              <li><strong>兒童、連住、最低消費與排除日：</strong>都要看各縣最終販售規則。</li>
              <li><strong>能否和其他優惠併用：</strong>包括信用卡、訂房網優惠、地方券與餐飲券，目前都不能預設。</li>
            </ol>
            <p>
              內閣府在 8 月 27 日公布的整體災後支援方案中，先以「九州應援割（暫稱）」列為觀光需求振興措施；隔日觀光廳公布最終名稱、折扣與限額。後續的購買細節仍是地方執行階段，請以
              <a href={JAPAN_TOURISM_AGENCY_PDF_URL} target="_blank" rel="noopener noreferrer" data-event="kyushusubsidy_pending_pdf_inline" data-platform="Japan Tourism Agency" data-section="article_link">
                <strong>觀光廳事業概要</strong>
              </a>
              與各縣公告為準。
            </p>
          </div>
        </section>

        <section className="seo-content" id="rakuten" aria-label="楽天熊本鹿兒島觀光應援優惠券">
          <h2 className="seo-h2">楽天已開的 5～10% 優惠券，和政府補助是兩件事</h2>
          <div className="seo-prose">
            <p>
              楽天トラベル已另行推出「熊本・鹿兒島觀光應援優惠券」，這是楽天的自家活動，不是本次政府 50～60% 補助。兩者可以同時出現在搜尋結果中，最容易讓人誤以為政府方案已開始販售。
            </p>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>楽天自家優惠</th>
                    <th>內容</th>
                    <th>使用期間與條件</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>熊本住宿券</strong></td>
                    <td>最高 10% 折扣，上限 ¥5,000</td>
                    <td>住宿至 9/30；限量 1,800 張、每房至少 2 名成人。</td>
                  </tr>
                  <tr>
                    <td><strong>熊本、鹿兒島住宿券</strong></td>
                    <td>5% 折扣，上限 ¥2,000</td>
                    <td>住宿至 10/31；限量 13,500 張、每房至少 2 名成人。</td>
                  </tr>
                  <tr>
                    <td><strong>日本國內交通＋住宿券</strong></td>
                    <td>¥5,000 或 ¥11,000</td>
                    <td>限楽天的 ANA／JAL 國內航班或 JR＋住宿套裝，並有最低金額與日期限制。</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              楽天券只能在預訂流程中使用、不能在訂單成立後補上；但這是<strong>楽天自己的規則</strong>，不代表政府補助已確定採相同方式。想先用現有優惠或查看限量狀態，可直接查看
              <a href={RAKUTEN_TRAVEL_URL} target="_blank" rel="noopener noreferrer" data-event="kyushusubsidy_rakuten_inline" data-platform="Rakuten Travel" data-section="article_link">
                <strong>楽天官方活動頁</strong>
              </a>
              。
            </p>
          </div>
        </section>

        <section className="seo-content" id="plan" aria-label="九州旅遊補助現在怎麼安排">
          <h2 className="seo-h2">現在怎麼訂最穩？先留彈性，不為補助急著取消</h2>
          <div className="seo-prose">
            <ol>
              <li><strong>先看住宿夜，不是出發日：</strong>例如行程落在 9/25～10/13，只有 10/1 晚起的住宿才可能進入本次適用範圍。</li>
              <li><strong>原訂單先保留：</strong>尤其是價格合理、可免費取消的住宿，不要為了未知補助先放掉已確定的房間。</li>
              <li><strong>有彈性再訂可取消方案：</strong>若目的地是熊本或鹿兒島，可優先保留可取消的選項；但不把補助列入已確定旅費。</li>
              <li><strong>只追兩種一級資訊：</strong>觀光廳更新頁與實際入住縣的正式公告。新聞與社群適合得知消息，不適合決定是否取消或付款。</li>
              <li><strong>出發前確認交通：</strong>補助不代表所有交通狀態固定；若行程穿越熊本，仍應在出發前檢查 JR 九州與地方交通公告。</li>
            </ol>
          </div>
        </section>

        <section className="seo-content" id="sources" aria-label="九州旅遊補助官方資料">
          <h2 className="seo-h2">官方資料：更新時先看這三個來源</h2>
          <div className="seo-prose">
            <p>
              這篇以日本政府的一級資料為主。觀光廳頁面目前最適合追各縣的開賣日與適用期間；內閣府頁面則可確認本措施屬於熊本地震災後支援方案的一部分。
            </p>
            <ActionLinks label="九州旅遊補助官方來源" links={officialLinks} />
          </div>
        </section>

        <SeoFaqSection title="九州復興應援割常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
