import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import AffiliateDecisionPanel, { type AffiliateDecisionOption } from '@/components/seo/AffiliateDecisionPanel'
import ArticleEngagementTracker from '@/components/seo/ArticleEngagementTracker'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoPurchaseMenu from '@/components/seo/SeoPurchaseMenu'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  kyushuTravelSubsidy2026Canonical,
  kyushuTravelSubsidy2026Description,
  kyushuTravelSubsidy2026Title,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const PUBLISHED_AT = '2026-08-28'
const UPDATED_AT = '2026-10-16'

const JAPAN_TOURISM_AGENCY_URL = 'https://www.mlit.go.jp/kankocho/page13_00002.html'
const KYUSHU_CAMPAIGN_URL = 'https://fightkyushu.welcomekyushu.jp/'
const FUKUOKA_CAMPAIGN_URL = 'https://fukuoka-fukkou-wari.jp/'
const SAGA_CAMPAIGN_URL = 'https://saga-ouen.jp/'
const NAGASAKI_CAMPAIGN_URL = 'https://nagasaki-fukkou-wari.jp/'
const KUMAMOTO_CAMPAIGN_URL = 'https://kumamoto-ouenwari.com/'
const OITA_CAMPAIGN_URL = 'https://oita-fukkou-wari.jp/'
const MIYAZAKI_CAMPAIGN_URL = 'https://miyazaki-ouen.jp/'
const KAGOSHIMA_CAMPAIGN_URL = 'https://fukko-ouenwari.pref.kagoshima.jp/'
const INSTAGRAM_CHANNEL_URL = 'https://www.instagram.com/channel/AbZxb3pZjSFNqWvD/'

type ActionLink = {
  label: string
  href: string
  event: string
  platform: string
  purpose: string
}

type AffiliateLink = {
  label: string
  href: string
  event: string
  platform: string
  affiliate?: boolean
}

type PrefectureRow = {
  area: string
  discount: string
  booking: string
  stay: string
  status: string
  href: string
  event: string
}

const officialSources: ActionLink[] = [
  {
    label: '日本觀光廳總表',
    href: JAPAN_TOURISM_AGENCY_URL,
    event: 'kyushusubsidy_jta_notice',
    platform: 'Japan Tourism Agency',
    purpose: '總覽七縣預訂開始日、適用住宿期間、折扣率與官方入口。',
  },
  {
    label: '九州官方使用指南',
    href: KYUSHU_CAMPAIGN_URL,
    event: 'kyushusubsidy_kyushu_official',
    platform: 'Kyushu Tourism Organization',
    purpose: '一次進入七縣特設網站，確認當下剩餘通路與販售狀態。',
  },
  {
    label: '鹿兒島最新公告',
    href: KAGOSHIMA_CAMPAIGN_URL,
    event: 'kyushusubsidy_kagoshima_official',
    platform: 'Kagoshima Prefecture',
    purpose: '10/14 最新開賣，直訂最長可住到 2027/2/28。',
  },
]

const prefectureRows: PrefectureRow[] = [
  {
    area: '福岡',
    discount: '50%',
    booking: '9/24 起',
    stay: '10/1～12/15',
    status: '仍在官方活動期間；住宿直訂、OTA 與旅行社額度須分別向業者確認。',
    href: FUKUOKA_CAMPAIGN_URL,
    event: 'kyushusubsidy_prefecture_fukuoka',
  },
  {
    area: '佐賀',
    discount: '50%',
    booking: 'OTA 9/24、旅行社 10/2、直訂 10/13 起',
    stay: '10/1～12/25',
    status: '官方列出的 OTA 已完售；旅行社與住宿直訂仍須逐家確認。',
    href: SAGA_CAMPAIGN_URL,
    event: 'kyushusubsidy_prefecture_saga',
  },
  {
    area: '長崎',
    discount: '50%',
    booking: 'OTA 9/15、直訂 9/28、旅行社等 9/30 起',
    stay: '10/1～12/25',
    status: '首波 OTA 與住宿直訂第一期已完售；直訂第二期 10/23 10:00 開放。',
    href: NAGASAKI_CAMPAIGN_URL,
    event: 'kyushusubsidy_prefecture_nagasaki',
  },
  {
    area: '熊本',
    discount: '60%',
    booking: '9/15 起，各業者陸續販售',
    stay: '10/1～12/25',
    status: '查看官方參與住宿、旅行社與 OTA 名單，再向業者確認額度。',
    href: KUMAMOTO_CAMPAIGN_URL,
    event: 'kyushusubsidy_prefecture_kumamoto',
  },
  {
    area: '大分',
    discount: '50%',
    booking: 'OTA 9/25、旅行社 10/9、直訂 10/16 起',
    stay: '10/1～12/25',
    status: '住宿直訂自 10/16 起；各通路與設施額度分開，須確認當下狀態。',
    href: OITA_CAMPAIGN_URL,
    event: 'kyushusubsidy_prefecture_oita',
  },
  {
    area: '宮崎',
    discount: '50%',
    booking: 'OTA 9/25、住宿與旅行社 9/28 起',
    stay: '10/1～12/25',
    status: 'OTA 以楽天、じゃらん為主；直訂需先取得 STAYNAVI 優惠券。',
    href: MIYAZAKI_CAMPAIGN_URL,
    event: 'kyushusubsidy_prefecture_miyazaki',
  },
  {
    area: '鹿兒島',
    discount: '60%',
    booking: '10/14 起，各平台分批開賣',
    stay: 'OTA／旅行社至 2027/1/31；直訂至 2027/2/28',
    status: '12/26～2027/1/3 不適用；ANA X 已完售，另有平台至 10/26 才開賣。',
    href: KAGOSHIMA_CAMPAIGN_URL,
    event: 'kyushusubsidy_prefecture_kagoshima',
  },
]

const affiliateDecisionOptions: AffiliateDecisionOption[] = [
  {
    intent: '想先保留可取消住宿',
    title: 'Agoda｜比較九州可取消住宿',
    description: '先看一般房價與免費取消期限，避免只等追加額度而錯過房間。',
    action: '查看九州住宿',
    href: 'https://www.agoda.com/zh-tw/region/kyushu-region-jp.html?cid=1945734',
    event: 'kyushusubsidy_intent_agoda',
    platform: 'Agoda',
  },
  {
    intent: '以福岡進出，想比較住宿',
    title: 'Trip.com｜先從福岡住宿比價',
    description: '適合以福岡進出九州，再分開檢查其他縣住宿與交通價格。',
    action: '比較福岡住宿',
    href: 'https://tw.trip.com/hotels/fukuoka-hotels-list-248/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D13969664',
    event: 'kyushusubsidy_intent_trip',
    platform: 'Trip.com',
  },
  {
    intent: '住宿已訂好，要補交通或一日遊',
    title: 'KKday｜搜尋九州行程',
    description: '集中比較九州交通、景點票券與一日遊，適合補齊住宿以外的安排。',
    action: '搜尋九州商品',
    href: 'https://www.kkday.com/zh-tw/category?keyword=%E4%B9%9D%E5%B7%9E&cid=22312',
    event: 'kyushusubsidy_intent_kkday',
    platform: 'KKday',
  },
  {
    intent: '住宿已訂好，想再比較活動',
    title: 'Klook｜查看九州玩樂',
    description: '查看九州票券、交通與體驗，補齊住宿以外的行程安排。',
    action: '查看九州玩樂',
    href: 'https://www.klook.com/zh-TW/destination/c40-kyushu-things-to-do/?aid=93798',
    event: 'kyushusubsidy_intent_klook',
    platform: 'Klook',
  },
]

const trackedSectionIds = [
  'quick-answer',
  'booking-status',
  'discount',
  'eligibility',
  'how-to-book',
  'platforms',
  'travel-next-step',
  'updates',
]

const socialFollowLinks: AffiliateLink[] = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/jiejourneys',
    event: 'kyushusubsidy_updates_follow_instagram',
    platform: 'Instagram',
    affiliate: false,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@jiejourneys',
    event: 'kyushusubsidy_updates_follow_youtube',
    platform: 'YouTube',
    affiliate: false,
  },
  {
    label: 'Threads',
    href: 'https://www.threads.net/@jiejourneys',
    event: 'kyushusubsidy_updates_follow_threads',
    platform: 'Threads',
    affiliate: false,
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
    note: '必須由參與旅行業者事先包裝成補助商品；旅客自行加買的交通不能合併計算。',
  },
  {
    product: '跨 2 縣以上住宿的周遊商品',
    cap: '最高 ¥35,000',
    note: '住宿地必須跨公告的九州縣。',
  },
]

const faqItems = [
  {
    q: '九州旅遊補助是什麼？',
    a: '這是日本政府針對 2026 年熊本地震後觀光需求推出的旅行與住宿折扣支援。公告對象為九州七縣的至少一晚住宿旅行商品；熊本、鹿兒島折抵 60%，福岡、佐賀、長崎、大分、宮崎折抵 50%。',
  },
  {
    q: '台灣旅客可以使用九州旅遊補助嗎？',
    a: '可以。各縣最新官方 FAQ 已確認訪日外國旅客適用。重點不是國籍，而是必須在各通路開始販售後，訂到標示為補助對象的住宿或旅行商品，並依規定在入住時核對身分與簽署利用證明。',
  },
  {
    q: '已經訂好的住宿可以事後套用補助嗎？',
    a: '不可以。各縣均以該通路正式開始販售後的新訂單為對象；原訂單不能直接補折。取消再訂仍可能遇到房價改變、沒有補助額度或取消費，請確認新方案確實可訂再決定。',
  },
  {
    q: '九州旅遊補助要怎麼訂？折扣碼在哪裡輸入？',
    a: '先從住宿所在縣的官方特設頁進入指定 OTA、住宿設施或旅行社。OTA 會以活動方案、專用優惠券或結帳折扣的方式套用；住宿直訂若採 STAYNAVI，需先完成飯店預訂，再到 STAYNAVI 取得補助優惠券。付款前沒有顯示活動名稱、優惠券或折後金額，就不是補助訂單，也不能入住後補折。',
  },
  {
    q: '楽天、じゃらん、Agoda、Booking.com 都能訂嗎？',
    a: '不是所有平台、所有住宿方案都適用。楽天與じゃらん已出現在多個縣的官方通路名單；Agoda、Booking.com 或一般國際訂房頁面不能因為有九州住宿就視為補助商品。結帳前一定要看到該縣活動名稱與折扣已套用。',
  },
  {
    q: '兒童與連住怎麼計算？',
    a: '兒童與嬰幼兒原則上可列入人數。連住沒有統一的泊數上限，但單訂住宿的 ¥20,000 上限是每一旅行、每人計算，不是每晚都重新計算；刻意拆單可能被審查。',
  },
  {
    q: '補助訂單入住時要準備什麼？',
    a: '預訂代表人姓名要和實際入住者一致。多數縣要求入住時確認身分並簽署利用證明；台灣旅客應攜帶護照，並使用與護照相同的姓名訂房。',
  },
  {
    q: '可以和平台優惠券、點數或地方補助一起使用嗎？',
    a: '部分通路可以，但不是一律。官方 FAQ 的共通方向是先扣除地方補助或業者優惠，再對剩餘金額計算九州旅遊補助；個人持有的點數、哩程或禮券通常可作為實付金額的付款方式，仍以販售業者規則為準。',
  },
  {
    q: '住宿稅、入湯稅與現場加購也能折嗎？',
    a: '各縣規定不完全相同。福岡、長崎、宮崎原則排除住宿稅或入湯稅，大分 FAQ 則將入湯稅列入；現場另外加購的餐飲、客房服務、計程車等通常不適用。請以預訂通路顯示的補助計算基礎為準。',
  },
  {
    q: '會另外發購物券或餐飲券嗎？',
    a: '目前沒有九州七縣共通的購物或餐飲券。本次核心是旅行與住宿費折抵，不要把其他地方活動贈券誤認為九州旅遊補助的一部分。',
  },
  {
    q: '商務出差、日歸或休息方案可以使用嗎？',
    a: '不可以。官方 FAQ 將商務目的、公費出差、日歸旅行與 day use 休息方案列為補助對象外；至少要有一晚符合規定的九州住宿。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: kyushuTravelSubsidy2026Title.replace(' | 旅杰 JieJourneys', ''),
  description: kyushuTravelSubsidy2026Description,
  inLanguage: 'zh-Hant',
  datePublished: PUBLISHED_AT,
  dateModified: UPDATED_AT,
  mainEntityOfPage: kyushuTravelSubsidy2026Canonical,
  author: { '@type': 'Organization', name: '旅杰 JieJourneys', url: SITE_URL },
  publisher: {
    '@type': 'Organization',
    name: '旅杰 JieJourneys',
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
      <ArticleEngagementTracker
        contentId="kyushu-travel-subsidy-2026"
        sectionIds={trackedSectionIds}
        affiliateSectionId="travel-next-step"
      />
      <CitySubpageHeader backHref={backHref} eventPrefix="kyushusubsidy" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="九州旅遊速報｜2026/10/16 更新"
          h1="九州旅遊補助已開賣｜台灣旅客可用、七縣日期與訂房方式"
          intro="九州旅遊補助已在七縣分批開賣，台灣等訪日旅客確定適用。熊本、鹿兒島最高折抵 60%，其餘五縣 50%；但舊訂單不能事後補折，每個平台、旅行社與住宿設施也都有各自額度，訂房前要先看最新販售狀態。"
          eventPrefix="kyushusubsidy"
          showVisual={false}
          ctaLinks={[
            { label: '追蹤最新進度', href: '#updates', dataEvent: 'kyushusubsidy_hero_updates', platform: 'article' },
            { label: '先看已確認重點', href: '#quick-answer', dataEvent: 'kyushusubsidy_hero_quick', platform: 'article' },
            { label: '折扣與上限', href: '#discount', dataEvent: 'kyushusubsidy_hero_discount', platform: 'article' },
            { label: '補助實際怎麼訂', href: '#how-to-book', dataEvent: 'kyushusubsidy_hero_booking_guide', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="九州旅遊補助快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">最早適用</span>
              <strong>七縣均已開賣</strong>
              <p>鹿兒島 10/14 才開始，部分平台還會在 10/19、10/26 分批開放。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">台灣旅客</span>
              <strong>訪日旅客確定適用</strong>
              <p>需購買官方參與業者的補助商品；一般九州訂房不會自動打折。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">舊訂單</span>
              <strong>不能事後套用</strong>
              <p>必須是各通路開賣後的新訂單；取消重訂可能失去房間或產生取消費。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">現在最重要</span>
              <strong>有活動不等於有額度</strong>
              <p>佐賀多家 OTA、長崎首波額度已完售；各縣與各通路狀態不同。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="booking-status" aria-label="九州七縣旅遊補助開賣狀態">
          <h2 className="seo-h2">七縣開賣日期與最新狀態：先找還有額度的通路</h2>
          <div className="seo-prose">
            <p>
              這次不是全九州同一天、同一平台統一放券，而是由各縣把額度分配給住宿設施、旅行社與 OTA。即使官方活動期間尚未結束，個別通路也可能已經完售；以下為<strong>截至 2026 年 10 月 16 日</strong>的官方資訊。
            </p>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>縣別</th>
                    <th>折扣</th>
                    <th>開始預訂</th>
                    <th>住宿適用期間</th>
                    <th>目前重點</th>
                  </tr>
                </thead>
                <tbody>
                  {prefectureRows.map((row) => (
                    <tr key={row.area}>
                      <td>
                        <a
                          href={row.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-event={row.event}
                          data-platform={`${row.area} official`}
                          data-section="prefecture_status"
                        >
                          <strong>{row.area}</strong>
                        </a>
                      </td>
                      <td>{row.discount}</td>
                      <td>{row.booking}</td>
                      <td>{row.stay}</td>
                      <td>{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              最容易誤會的是「活動期間」不等於「現在還訂得到」。請從縣別名稱進入官方特設頁，再確認該平台或住宿設施是否仍接受補助訂單；結帳畫面沒有顯示活動名稱與折扣，就不要當成補助訂單。
            </p>
            <p>
              <strong>10 月 16 日新增：</strong>鹿兒島目前公開 12 個 OTA／旅行商品入口，其中 ANA X 已標示完售；Jumbo Tours 於 10/16 開賣、Jcation 預定 10/19 13:00、Orion Tour 預定 10/26 開賣。這些日期是「開始販售」，不代表屆時一定仍有額度。
            </p>
          </div>
        </section>

        <section className="seo-content" id="discount" aria-label="九州旅遊補助折扣與上限">
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

        <section className="seo-content" id="eligibility" aria-label="台灣旅客使用九州旅遊補助資格">
          <h2 className="seo-h2">台灣旅客確定可以用，但不是看到九州住宿就自動打折</h2>
          <div className="seo-prose">
            <p>
              答案已經從「待確認」變成<strong>可以</strong>。福岡、佐賀、大分、宮崎、鹿兒島等官方 FAQ 都明確寫出訪日外國旅客適用；台灣旅客不需要日本居住資格。不過，你仍要透過參與活動的住宿設施、旅行社或 OTA，購買明確標示為九州旅遊補助對象的商品。
            </p>
            <h3 className="seo-h3">真正會影響你能不能折到的 8 個條件</h3>
            <ol>
              <li><strong>一定要是新訂單：</strong>各通路開賣日前的既有預訂不能事後補折。</li>
              <li><strong>方案必須標示活動適用：</strong>同一間飯店的一般房價與補助方案可能同時存在。</li>
              <li><strong>預訂姓名要一致：</strong>代表人應使用與護照相同的姓名，入住時接受身分確認並簽署利用證明。</li>
              <li><strong>兒童可以列入人數：</strong>各縣 FAQ 原則上將兒童、嬰幼兒納入計算，但最終金額仍以販售業者為準。</li>
              <li><strong>連住上限按「一旅行」：</strong>單訂住宿最高折 ¥20,000，不是每晚各折 ¥20,000，也不應為提高額度刻意拆單。</li>
              <li><strong>只訂交通不適用：</strong>必須至少包含一晚九州住宿；自行另外購買的機票、JR、租車或現場加購項目不能事後合併。</li>
              <li><strong>整段旅行都要符合期間：</strong>同一旅行契約若包含活動期間外日期，或在九州七縣以外住宿，可能整筆失去資格，不是只把不符合的那晚扣掉。</li>
              <li><strong>商務與日歸不適用：</strong>商務出差、公費差旅、日歸與 day use 休息方案均不在補助範圍。</li>
            </ol>
            <p>
              舊訂單雖然不能直接套用，但不代表一律要取消重訂。先確認同日期、同人數的補助方案仍有房且總價真的更低，再查看原訂單取消費；官方不負擔取消費，也不保證取消後能重新搶回房間。詳細共通規則可從
              <a href={KYUSHU_CAMPAIGN_URL} target="_blank" rel="noopener noreferrer" data-event="kyushusubsidy_eligibility_kyushu_official" data-platform="Kyushu Tourism Organization" data-section="article_link">
                <strong>九州官方使用指南</strong>
              </a>
              進入各縣頁面確認。
            </p>
          </div>
        </section>

        <section className="seo-content" id="how-to-book" aria-label="九州旅遊補助實際預訂教學" style={{ scrollMarginTop: '76px' }}>
          <h2 className="seo-h2">九州旅遊補助怎麼訂？不是輸入共通折扣碼，照這 4 步完成</h2>
          <div className="seo-prose">
            <p>
              <strong>不是從 Agoda、Trip.com、KKday 或 Klook 任意搜尋九州商品，再輸入一組政府折扣碼。</strong>這次沒有全九州共用的折扣碼；補助額度在各縣指定的住宿、OTA 與旅行社手上，必須從官方頁找到仍有額度的通路。
            </p>

            <h3 className="seo-h3">第 1 步：先選「住宿所在縣」，從官方頁開始</h3>
            <p>點入住縣別後，找頁面上的「預約／申込」「対象事業者」「宿泊施設」「旅行会社」或 OTA 名單。跨縣旅行則分別確認每一晚住宿是否符合方案。</p>
            <div className="seo-action-links" aria-label="九州七縣旅遊補助官方預訂入口">
              {prefectureRows.map((row) => (
                <a
                  className="seo-buy-link"
                  href={row.href}
                  key={`booking-${row.area}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event={`${row.event}_booking_guide`}
                  data-platform={`${row.area} official`}
                  data-section="booking_guide"
                >
                  {row.area}官方入口
                </a>
              ))}
            </div>

            <h3 className="seo-h3">第 2 步：依你選的通路完成預訂</h3>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>預訂方式</th>
                    <th>實際操作</th>
                    <th>折扣怎麼出現</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>OTA 線上訂房</strong></td>
                    <td>由縣官方頁進入指定平台，領取活動優惠券或選擇標有活動名稱的住宿方案。</td>
                    <td>優惠券套用或折後金額會在付款前顯示；沒顯示就先不要付款。</td>
                  </tr>
                  <tr>
                    <td><strong>向飯店直接預訂</strong></td>
                    <td>先確認飯店在官方參與名單，再從飯店官網或電話訂房。若採 STAYNAVI，訂房後還要回 STAYNAVI 取得補助優惠券。</td>
                    <td>依飯店規則於線上或入住現場折抵；只有飯店訂單、沒有必要的 STAYNAVI 優惠券，不能使用補助。</td>
                  </tr>
                  <tr>
                    <td><strong>旅行社交通＋住宿</strong></td>
                    <td>從官方名單找旅行社，購買明確標示為活動對象、已把交通與住宿包在一起的商品。</td>
                    <td>旅行社報價或付款明細會列出補助後金額；自己先買的機票、JR 或巴士票不能事後加入。</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="seo-h3">第 3 步：付款前確認這 3 件事</h3>
            <ol>
              <li>畫面或方案名稱明確寫出該縣的九州旅遊補助活動。</li>
              <li>訂單明細已顯示優惠券、補助金額或折後應付價格。</li>
              <li>入住日期、人數、房型與預訂人姓名都正確，且通路尚未標示額度用完。</li>
            </ol>

            <h3 className="seo-h3">第 4 步：入住時帶護照與必要優惠券</h3>
            <p>
              預訂人姓名請和護照一致。入住時依業者要求出示護照、訂單或 STAYNAVI 優惠券，並簽署利用證明。<strong>最簡單的判斷是：付款前看不到補助，入住時就不會突然幫你折。</strong>
            </p>
            <p>
              只想買 JR、巴士、機票或景點票券，可以另外使用一般平台比價，但這些單獨購買的票券不會享有本次 50%～60% 補助；要補助交通，必須買官方參與旅行社事先組合好的「交通＋住宿」商品。
            </p>
          </div>
        </section>

        <section className="seo-content" id="platforms" aria-label="九州旅遊補助訂房平台與完售狀態">
          <h2 className="seo-h2">哪些平台能訂？楽天、じゃらん有參加，但每一縣名單不同</h2>
          <div className="seo-prose">
            <p>
              現在已確認的官方通路包含住宿設施直接預訂、指定旅行社與 OTA。楽天トラベル、じゃらん已出現在多個縣的名單，大分另列 Yahoo!トラベル、一休.com；佐賀還列出 ANA X、るるぶトラベル與 JTB，但佐賀官方標示的這批 OTA 額度目前都已完售。
            </p>
            <h3 className="seo-h3">Agoda、Booking.com、Trip.com 要特別小心</h3>
            <p>
              一般訂房頁面出現九州飯店，不代表它是補助商品。本文下方的 Agoda、Trip.com 等合作連結是一般比價入口，<strong>不是九州旅遊補助官方入口</strong>。要使用補助，請優先從上方七縣官方頁進入指定通路，並在付款前確認折扣已經顯示。
            </p>
            <p>
              住宿直訂也不是訂好飯店就完成。長崎、宮崎等縣使用 STAYNAVI，必須在訂房後另外取得活動優惠券；如果優惠券額度已用完，即使房間訂成功也不能享有補助。
            </p>
            <h3 className="seo-h3">台灣出發的國際機票能不能一起折？</h3>
            <p>
              官方把航空、付費列車、巴士、船舶等列為可能符合的交通服務，但前提是由參與旅行業者在出發前和住宿包成同一個補助旅行商品。<strong>台灣自行購買的九州來回機票不能事後併入</strong>；目前也不能把所有「機票＋飯店」網站方案都當成適用，仍要看到販售業者明確標示本活動。
            </p>
            <h3 className="seo-h3">優惠券、點數與稅費不是全縣同一算法</h3>
            <p>
              多數官方 FAQ 允許部分平台優惠、地方補助或個人點數併用，但通常先扣其他優惠，再計算 50%／60% 補助。住宿稅、入湯稅則存在縣別差異：福岡、長崎、宮崎原則排除，大分 FAQ 將入湯稅列入。最後請以結帳明細與販售業者說明為準。
            </p>
          </div>
        </section>

        <AffiliateDecisionPanel
          id="travel-next-step"
          eyebrow="其他住宿與行程"
          heading="官方補助沒有額度，再比較一般住宿與行程"
          intro="想先保留住宿可查 Agoda、Trip.com；住宿已確定，再到 KKday、Klook 找交通與一日遊。"
          options={affiliateDecisionOptions}
        />

        <section className="seo-content kyushu-update-hub" id="updates" aria-label="九州旅遊補助官方追蹤">
          <div className="kyushu-update-heading">
            <div>
              <p className="kyushu-update-kicker">旅杰官方追蹤台</p>
              <h2 className="seo-h2">有新消息，先在這裡幫你看懂</h2>
            </div>
          </div>
          <div className="seo-prose">
            <p>
              現在最需要追的不是「會不會開賣」，而是各通路是否完售、是否追加額度，以及下一批何時釋出。旅杰會交叉追下面三份官方資料，把<strong>「哪裡還能訂、下一批何時開、入住時要帶什麼」</strong>這些真正影響決定的內容更新在這篇。
            </p>
          </div>
          <ul className="kyushu-source-grid" aria-label="九州旅遊補助追蹤來源">
            {officialSources.map((source) => (
              <li key={source.event}>
                <a
                  className="kyushu-source-card"
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event={source.event}
                  data-platform={source.platform}
                  data-section="official_tracker"
                >
                  <span className="kyushu-source-label">官方來源</span>
                  <strong>{source.label}</strong>
                  <span>{source.purpose}</span>
                  <span className="kyushu-source-link">查看原始公告 <span aria-hidden="true">→</span></span>
                </a>
              </li>
            ))}
          </ul>
          <div className="kyushu-update-actions">
            <div>
              <strong>九州補助更新，第一時間通知</strong>
              <p>追加額度、平台重新開放或規則調整時，會先通知你。</p>
            </div>
            <div className="kyushu-update-action-links">
              <a
                className="kyushu-channel-link"
                href={INSTAGRAM_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-event="kyushusubsidy_updates_ig_channel"
                data-platform="Instagram Channel"
                data-section="official_tracker"
              >
                加入即時通知
              </a>
              <SeoPurchaseMenu
                className="kyushu-follow-details"
                label="其他追蹤方式"
                options={socialFollowLinks}
                dataSection="official_tracker"
                revealOnOpen={false}
              />
            </div>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="訂好九州住宿後，把日本行前安排補齊"
          intro="補助額度變動很快，但入境、退稅與其他旅行準備可以先完成。"
          links={[
            {
              label: '日本入境教學',
              href: '/japan/visit-japan-web-guide',
              event: 'kyushusubsidy_related_visit_japan_web',
              platform: 'internal',
            },
            {
              label: '日本退稅新制度',
              href: '/japan/tax-free-2026',
              event: 'kyushusubsidy_related_tax_free',
              platform: 'internal',
            },
            {
              label: '2026 日本賞楓預測',
              href: '/japan/autumn-leaves-forecast-2026?from=kyushu-travel-subsidy-2026',
              event: 'kyushusubsidy_related_autumn_leaves',
              platform: 'internal',
            },
            {
              label: '旅遊資源優惠',
              href: '/tools/resources',
              event: 'kyushusubsidy_related_resources',
              platform: 'internal',
            },
          ]}
        />

        <SeoFaqSection title="九州旅遊補助常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
