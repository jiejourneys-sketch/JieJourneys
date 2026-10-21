import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'

const SITE_URL = 'https://www.jiejourneys.com'
const PAGE_PATH = '/japan/tax-free-2026'
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`
const UPDATED_AT = '2026-10-21'

const OFFICIAL_SOURCES = {
  customs: 'https://www.customs.go.jp/kaigairyoko/taxrefund_e.html',
  tourismAgency: 'https://www.mlit.go.jp/kankocho/tax-free/page01_000001_00021.html',
  travelerFaq: 'https://www.mlit.go.jp/kankocho/tax-free/page01_000001_00023.html',
  taxAgency: 'https://www.nta.go.jp/publication/pamph/shohi/menzei/201805/format/002.htm',
  jnto: 'https://www.japan.travel/en/us/blog/everything-you-need-to-know-japans-new-tax-free-shopping-system/',
  visitJapanWeb: 'https://services.digital.go.jp/visit-japan-web/',
  jTaxRefund: 'https://j-taxfree.jp/tax-free/refund/',
} as const

const taxFreeVideoLinks = [
  { label: 'IG', href: 'https://www.instagram.com/reel/Da72R_yBXam/', event: 'japantaxfree_video_ig', platform: 'IG' },
  { label: 'YouTube', href: 'https://www.youtube.com/shorts/ULH9oonQ7-I', event: 'japantaxfree_video_youtube', platform: 'YouTube' },
]

const title = '日本退稅新制懶人包｜2026/11/1 退稅流程、Visit Japan Web 與 90 天規定'
const description =
  '日本 2026 年 11 月 1 日購買分起改採先付含稅價、出境確認後退款。整理同店同日未稅 5,000 日圓門檻、90 天期限、KIOSK、Visit Japan Web 七座機場、紅綠燈判定與行李托運注意事項。'

const faqItems = [
  {
    q: '2026/11/1 後還能在日本店內直接免稅嗎？',
    a: '2026 年 11 月 1 日起購買的免稅商品改採 Refund Method：店內先付含稅價，出境時經海關確認商品會被帶離日本後，再由免稅店或受託退款業者退款。',
  },
  {
    q: '2026/10/31 購買、11/1 才離境，適用哪一套制度？',
    a: '以購買日期判定。2026 年 10 月 31 日購買仍適用舊制；2026 年 11 月 1 日起的購買才適用新制。',
  },
  {
    q: '新制的 5,000 日圓門檻怎麼算？',
    a: '同一家免稅店、同一天的未稅購買金額合計須達 5,000 日圓以上。一般商品與消耗品不再分開計算。',
  },
  {
    q: '零食、藥妝和化妝品還需要密封袋嗎？衣服可以先穿嗎？',
    a: '新制取消消耗品的特殊密封包裝，但食品、藥品、化妝品等消耗品不能在日本消費。衣服等非消耗品可以使用，只要出境時仍持有並帶離日本；同一筆購買紀錄只要少一件，該筆交易全部無法退稅。',
  },
  {
    q: '退稅手續要在托運行李前還是後？',
    a: '一定要在托運行李前完成。辦理時必須持有每筆交易的全部免稅商品；行李一旦交給航空公司，不能為了退稅手續要求取回。',
  },
  {
    q: 'Visit Japan Web 可以在飯店先完成退稅嗎？',
    a: '不可以。只有成田、羽田、關西、中部、新千歲、福岡與那霸機場，可在國際線出境大廳、安檢前的指定區域連接專用 Wi-Fi，以 Visit Japan Web 取代機場免稅手續機台。若被判定需要查驗，仍須到海關檢查區。',
  },
  {
    q: 'KIOSK 顯示綠燈或紅燈代表什麼？',
    a: '綠燈代表不需進一步實體查驗，海關確認程序完成；紅燈代表必須攜帶該筆免稅商品到指定海關檢查區接受確認。',
  },
  {
    q: '掃完 KIOSK 後，機場海關會直接發現金嗎？',
    a: '不一定。海關負責確認商品持出日本，退款則由免稅店或受託退款業者辦理。信用卡、銀行轉帳、App 或出境港內現金等方式與入帳時間，依各店規定。',
  },
  {
    q: '日本國內線轉國際線，在哪裡辦退稅確認？',
    a: '要在最後離開日本的國際線出境機場辦理，而且須在該機場托運含免稅商品的行李前完成。',
  },
  {
    q: '退稅需要 QR Code 收據嗎？',
    a: '日本官方旅客流程沒有把 QR Code 收據列為所有旅客的必備文件。購買紀錄由免稅店電子傳送；旅客應備妥護照、全部免稅商品，並依店家指示登記退款方式。收據仍建議保留，以便店家或海關需要時核對。',
  },
  {
    q: '哪些旅客可以辦日本免稅？',
    a: '一般外國旅客須屬非居住者，通常是以「短期滯在」身分入境且入境未滿 6 個月；外交、公用或其他指定上陸許可另有規定。購買時須由店家確認護照等資格資料。',
  },
  {
    q: '免稅商品可以自己從郵局寄回台灣嗎？',
    a: '旅客自行以國際郵件寄送、再用寄件單證明出口的做法已於 2025 年 4 月 1 日取消。新制原則上須由本人攜帶商品到出境地接受確認；若要由店家直接寄送海外，應在購買前詢問店家是否提供另外的直送出口方式。',
  },
]

type JapanTaxFree2026PageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'osaka-video') return '/osaka/video'
  if (value === 'tokyo-video') return '/tokyo/video'
  return '/tokyo/video'
}

export default async function JapanTaxFree2026Page({ searchParams }: JapanTaxFree2026PageProps) {
  const params = (await searchParams) ?? {}
  const backHref = sourceBackHref(params.from)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    inLanguage: 'zh-Hant',
    datePublished: '2026-07-14',
    dateModified: UPDATED_AT,
    mainEntityOfPage: PAGE_URL,
    author: {
      '@type': 'Organization',
      name: 'JieJourneys(旅杰)',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'JieJourneys(旅杰)',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/assets/og-share.png`,
      },
    },
    image: [
      `${SITE_URL}/assets/og-share.png`,
      `${SITE_URL}/assets/japan-tax-free-2026-j-taxrefund-flow.png`,
      `${SITE_URL}/assets/japan-tax-free-2026-reminders.png`,
    ],
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <CitySubpageHeader backHref={backHref} eventPrefix="japantaxfree" />
      <main className="busan-main transport-main seo-page japan-tax-free-page">
        <SeoHeroSection
          badge="日本購物攻略"
          h1="日本退稅新制懶人包｜2026/11/1 起先付稅、出境後退款"
          intro="2026 年 11 月 1 日購買分起，日本外國旅客免稅制度改採 Refund Method。購物時先付含稅價，90 天內在最後離開日本的機場或港口完成海關確認，再由免稅店或受託業者退款。"
          eventPrefix="japantaxfree"
          showVisual={false}
          ctaLinks={[
            { label: '新舊制度比較', href: '#comparison', dataEvent: 'japantaxfree_hero_comparison', platform: 'article' },
            { label: '新制完整流程', href: '#after-flow', dataEvent: 'japantaxfree_hero_after_flow', platform: 'article' },
            { label: 'VJW 七座機場', href: '#visit-japan-web', dataEvent: 'japantaxfree_hero_vjw', platform: 'article' },
          ]}
        />

        <section className="seo-content" aria-label="日本退稅新制重點">
          <p className="article-updated">
            最後查核：<time dateTime={UPDATED_AT}>2026/10/21</time>。本文以日本海關、觀光廳、國稅廳、JNTO 與數位廳資料為準。
          </p>
          <div className="tax-free-summary-grid" role="list">
            <div role="listitem">
              <span className="summary-label">適用日期</span>
              <strong>2026/11/1 購買分起</strong>
              <p>以購買日期判定，不是看離境日期。</p>
            </div>
            <div role="listitem">
              <span className="summary-label">退款前提</span>
              <strong>購買後 90 天內出境</strong>
              <p>須在最後出境機場或港口完成海關確認。</p>
            </div>
            <div role="listitem">
              <span className="summary-label">購物門檻</span>
              <strong>同店同日未稅滿 ¥5,000</strong>
              <p>一般商品與消耗品合併計算，不再分類。</p>
            </div>
            <div role="listitem">
              <span className="summary-label">辦理順序</span>
              <strong>先確認，再托運</strong>
              <p>必須帶齊每筆交易的全部免稅商品。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="日本退稅新制短影音">
          <h2 className="seo-h2">日本退稅新制短影音</h2>
          <div className="seo-prose">
            <SeoVideoLinkMenu label="日本退稅新制" links={taxFreeVideoLinks} />
            <p>短影音發布時間早於本次官方資料更新；遇到流程差異時，請以本頁更新後文字與文末官方來源為準。</p>
          </div>
        </section>

        <section className="seo-content" aria-label="日本免稅適用資格與商品">
          <h2 className="seo-h2">先確認：誰可以免稅、哪些商品符合？</h2>
          <div className="seo-prose">
            <ul className="tax-free-checklist">
              <li><strong>旅客資格：</strong>一般外國旅客須為非居住者，通常是以「短期滯在」身分入境且入境未滿 6 個月；外交、公用及部分上陸許可另有規定。</li>
              <li><strong>購買證明：</strong>店家須確認護照等資格資料；支援免稅購物 2D Code 的店家，也可讀取 Visit Japan Web 即時顯示的 Code，但不是每家店都支援。</li>
              <li><strong>金額與數量：</strong>同店同日未稅合計 5,000 日圓以上，而且只能購買本人出境時可全部攜帶的數量。</li>
              <li><strong>不適用商品：</strong>金、白金地金與金幣／白金幣，以及原本就不課消費稅的商品，不在退稅範圍。</li>
              <li><strong>不能自行郵寄：</strong>旅客自行從郵局等處寄往海外的「別送」證明已取消；若有海外直送需求，須事先確認店家是否提供另外的直送出口服務。</li>
            </ul>
          </div>
        </section>

        <section className="seo-content" id="comparison" aria-label="日本退稅新舊制度比較">
          <h2 className="seo-h2">日本退稅新舊制度差在哪裡？</h2>
          <div className="seo-prose">
            <p>
              分界點是<strong>購買日期</strong>。2026 年 10 月 31 日以前的購買適用舊制；2026 年 11 月 1 日起的購買才進入新制。
            </p>

            <div className="tax-free-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>比較項目</th>
                    <th>2026/10/31 前購買</th>
                    <th>2026/11/1 起購買</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>付款方式</td>
                    <td>免稅店以未稅價格銷售</td>
                    <td>先支付含稅價格</td>
                  </tr>
                  <tr>
                    <td>退款成立</td>
                    <td>店內完成免稅購買手續</td>
                    <td>出境時經海關確認持出後才成立</td>
                  </tr>
                  <tr>
                    <td>商品分類</td>
                    <td>一般商品、消耗品分開</td>
                    <td>取消分類，合併計算</td>
                  </tr>
                  <tr>
                    <td>最低金額</td>
                    <td>依舊制商品類別計算</td>
                    <td>同店同日未稅合計 ¥5,000 以上</td>
                  </tr>
                  <tr>
                    <td>消耗品上限</td>
                    <td>未稅 ¥500,000</td>
                    <td>取消上限，但限本人可攜帶出境的數量</td>
                  </tr>
                  <tr>
                    <td>消耗品密封袋</td>
                    <td>需要特殊包裝</td>
                    <td>取消特殊包裝，但不能在日本消費或用完</td>
                  </tr>
                  <tr>
                    <td>出境手續</td>
                    <td>依舊制向海關出示護照並備妥商品</td>
                    <td>90 天內、托運前使用 KIOSK／電子端末或指定機場的 VJW</td>
                  </tr>
                  <tr>
                    <td>退款單位</td>
                    <td>購買時已按適用稅率免稅</td>
                    <td>海關確認後，由免稅店或受託退款業者辦理</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="seo-content" id="after-flow" aria-label="2026 年 11 月 1 日後日本退稅流程">
          <h2 className="seo-h2">2026/11/1 後日本退稅完整流程</h2>
          <div className="seo-prose">
            <p>
              下圖以 <a href={OFFICIAL_SOURCES.jTaxRefund} target="_blank" rel="noopener noreferrer">J-TaxRefund</a> 的實際操作方式為例：店家提供 QR Code，引導旅客用手機登記退款資料。這不是所有免稅店的統一介面，實際登記方式依店家採用的退款系統而異。
            </p>

            <figure className="seo-figure tax-free-portrait-figure">
              <Image
                src="/assets/japan-tax-free-2026-j-taxrefund-flow.png"
                alt="2026 年 11 月 1 日起日本免稅流程圖，以 J-TaxRefund 的 QR Code 退款資料登記方式為操作範例"
                width={1122}
                height={1402}
                sizes="(max-width: 640px) 100vw, 560px"
              />
              <figcaption>J-TaxRefund 操作範例：QR Code 用於登記退款資料；其他免稅店或退款業者可能採用不同方式。</figcaption>
            </figure>

            <ol className="tax-free-steps">
              <li>
                <strong>在免稅店購物：</strong>同一家店、同一天未稅合計滿 5,000 日圓。出示護照等證明，先付含稅價，並依店家說明登記退款方式。
              </li>
              <li>
                <strong>保留完整商品：</strong>購買後 90 天內離境。同一筆交易的全部免稅商品都要留在手上；零食、飲料、化妝品等不能在日本吃掉或用完。
              </li>
              <li>
                <strong>在最後出境地辦理：</strong>抵達最後離開日本的機場或港口後，先帶護照與全部免稅商品到免稅手續區，不能先托運。
              </li>
              <li>
                <strong>使用 KIOSK／電子端末或 VJW：</strong>一般是在免稅手續機台讀取護照；指定七座機場也可在專用 Wi-Fi 區域使用 Visit Japan Web 取代機台手續。
              </li>
              <li>
                <strong>確認綠燈或紅燈：</strong>綠燈代表海關確認完成；紅燈則要把商品帶到指定海關檢查區。稅前單價 100 萬日圓以上商品，建議一併準備鑑定書或保證書。
              </li>
              <li>
                <strong>等待退款：</strong>海關確認後，由免稅店或受託退款業者退款。政府不收退款手續費，但店家或代辦業者是否收費、退款方式與入帳時間並非全日本統一，購買時就要確認清楚。
              </li>
            </ol>

            <h3 className="seo-h3">綠燈不等於海關現場發錢</h3>
            <p>
              KIOSK 或線上手續的功能是完成海關持出確認。退款可能退回信用卡、銀行帳戶、App，或由部分業者在出境港內以現金處理；實際方式由免稅店或受託業者決定。
            </p>

            <h3 className="seo-h3">不是每件商品都一定拿出來檢查</h3>
            <p>
              辦理時必須持有每筆交易的全部免稅商品，以便海關隨時查驗。綠燈代表不需進一步實體檢查；紅燈或海關要求時，才需要前往檢查區出示商品。
            </p>

            <h3 className="seo-h3">三種容易混淆的 QR／線上功能</h3>
            <ul>
              <li><strong>退款業者 QR Code：</strong>例如 J-TaxRefund，用來登記信用卡、銀行帳戶或其他退款資料，是否使用依店家而定。</li>
              <li><strong>VJW 免稅購物 2D Code：</strong>在支援店家提供護照等購買者資料，不能用截圖代替即時畫面。</li>
              <li><strong>VJW 出境海關確認：</strong>僅限七座指定機場的專用 Wi-Fi 區域，用來取代 KIOSK；若需要查驗，仍須前往海關檢查區。</li>
            </ul>
          </div>
        </section>

        <section className="seo-content" id="visit-japan-web" aria-label="Visit Japan Web 退稅確認">
          <h2 className="seo-h2">Visit Japan Web 可用在哪七座機場？</h2>
          <div className="seo-prose">
            <p>
              成田、羽田、關西、中部、新千歲、福岡、那霸機場可使用 Visit Japan Web 取代免稅手續機台。這項功能有三個重要限制：
            </p>
            <ul className="tax-free-checklist">
              <li>必須先備妥可登入使用的 Visit Japan Web 帳號。</li>
              <li>只能在國際線出境大廳、安檢前的指定區域，連接手續專用 Wi-Fi 後操作。</li>
              <li>線上手續不保證免查驗；若系統要求檢查，仍要攜帶商品前往海關檢查區。</li>
            </ul>
            <p>
              若無法使用 Visit Japan Web，直接改用機場的 KIOSK／電子端末即可。這裡的 VJW 出境退稅確認，也不要和免稅店內用來提供護照資料的 2D Code 混為一談。
            </p>
            <p>
              <a href={OFFICIAL_SOURCES.visitJapanWeb} target="_blank" rel="noopener noreferrer">
                前往 Visit Japan Web 官方網站
              </a>
            </p>
          </div>
        </section>

        <section className="seo-content" aria-label="日本退稅容易踩雷的重點">
          <h2 className="seo-h2">最容易踩雷的 6 件事</h2>
          <div className="seo-prose">
            <figure className="seo-figure tax-free-portrait-figure">
              <Image
                src="/assets/japan-tax-free-2026-reminders.png"
                alt="日本退稅三大提醒：先完成海關確認再托運、同張收據商品帶齊、消耗品不能在日本先使用"
                width={1225}
                height={1284}
                sizes="(max-width: 640px) 100vw, 560px"
              />
              <figcaption>出境前最重要的三件事：先確認再托運、同筆商品帶齊、消耗品不要在日本先用掉。</figcaption>
            </figure>

            <ul className="tax-free-checklist">
              <li><strong>先托運才想到退稅：</strong>行李不能為退稅手續取回，必須先完成海關確認。</li>
              <li><strong>同張收據少一件：</strong>同一筆購買紀錄只要少一件，整筆都無法退稅。</li>
              <li><strong>以為取消密封袋就能吃：</strong>食品、藥品、化妝品等消耗品在日本被吃掉或用掉，就不能取得該筆退款；衣服等非消耗品則可使用，但仍須帶出境。</li>
              <li><strong>超過 90 天才離境：</strong>須在購買日後的法定期限內完成出境海關確認。</li>
              <li><strong>把 KIOSK 當成提款機：</strong>海關只確認持出，退款由店家或受託業者處理。</li>
              <li><strong>在國內線起飛地先辦：</strong>應在最後離開日本的國際線機場辦理。</li>
            </ul>
          </div>
        </section>

        <SeoFaqSection title="日本退稅新制常見問題" items={faqItems} />

        <section className="seo-content" aria-label="日本退稅官方資料來源">
          <h2 className="seo-h2">官方資料來源</h2>
          <div className="seo-prose">
            <p>本文以政府與官方旅遊機構的一手資料交叉查核，實際退款方式仍以購買店家及出境地現場公告為準。</p>
            <ul>
              <li><a href={OFFICIAL_SOURCES.customs} target="_blank" rel="noopener noreferrer">日本海關｜Tax Exemption (Refund) Program for Foreign Visitors</a></li>
              <li><a href={OFFICIAL_SOURCES.tourismAgency} target="_blank" rel="noopener noreferrer">日本觀光廳｜旅行者向け新制度特設頁</a></li>
              <li><a href={OFFICIAL_SOURCES.travelerFaq} target="_blank" rel="noopener noreferrer">日本觀光廳｜旅客退稅常見問題</a></li>
              <li><a href={OFFICIAL_SOURCES.taxAgency} target="_blank" rel="noopener noreferrer">日本國稅廳｜免稅制度改採 Refund Method</a></li>
              <li><a href={OFFICIAL_SOURCES.jnto} target="_blank" rel="noopener noreferrer">JNTO｜新退稅制度旅客操作說明</a></li>
              <li><a href={OFFICIAL_SOURCES.jTaxRefund} target="_blank" rel="noopener noreferrer">J&amp;J Tax Free｜J-TaxRefund 操作流程（本文圖解範例）</a></li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
