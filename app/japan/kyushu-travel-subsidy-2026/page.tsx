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
const RAKUTEN_CAMPAIGN_URL = 'https://travel.rakuten.co.jp/special/kyushuouen/'
const JTB_CAMPAIGN_URL = 'https://www.jtb.co.jp/kokunai/kyushu-ouen/'
const JTB_OVERSEAS_MEMBER_FAQ_URL = 'https://faq.jtb.co.jp/faqs/f5258/'
const NTA_CAMPAIGN_URL = 'https://www.nta.co.jp/kokunai/special/ouen/kyushu/'
const NAGASAKI_STAYNAVI_URL = 'https://kyushuouen-nagasaki.staynavi.direct/campaign/prefecture/nagasaki/kyushuouen'
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

type PrefectureBookingResource = {
  area: string
  hotelLabel: string
  hotelHref: string
  agencyLabel: string
  agencyHref: string
  note: string
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

const prefectureBookingResources: PrefectureBookingResource[] = [
  {
    area: '福岡',
    hotelLabel: '參與飯店名單',
    hotelHref: 'https://fukuoka-fukkou-wari.jp/stay/',
    agencyLabel: '參與旅行社名單',
    agencyHref: 'https://fukuoka-fukkou-wari.jp/agt/',
    note: '直訂時先向飯店表明要使用補助；OTA 入口在縣官方首頁。',
    event: 'fukuoka',
  },
  {
    area: '佐賀',
    hotelLabel: '直訂飯店名單 PDF',
    hotelHref: 'https://saga-ouen.jp/assets/pdf/hotels.pdf',
    agencyLabel: '旅行社名單 PDF',
    agencyHref: 'https://saga-ouen.jp/assets/pdf/travel-agencies.pdf',
    note: '官方列出的 OTA 已完售；飯店名單會逐家標示受付終了。',
    event: 'saga',
  },
  {
    area: '長崎',
    hotelLabel: 'STAYNAVI 飯店與發券',
    hotelHref: NAGASAKI_STAYNAVI_URL,
    agencyLabel: '官方預訂入口',
    agencyHref: NAGASAKI_CAMPAIGN_URL,
    note: '直訂第一期已滿；第二期預定 10/23 10:00 開放發券。',
    event: 'nagasaki',
  },
  {
    area: '熊本',
    hotelLabel: '參與飯店名單',
    hotelHref: 'https://kumamoto-ouenwari.com/accommodation-list.html',
    agencyLabel: '參與旅行社名單',
    agencyHref: 'https://kumamoto-ouenwari.com/travel-list.html',
    note: '各飯店與旅行社分批販售，沒有全縣統一剩餘額度。',
    event: 'kumamoto',
  },
  {
    area: '大分',
    hotelLabel: '參與飯店名單',
    hotelHref: 'https://oita-fukkou-wari.jp/stay/',
    agencyLabel: '參與旅行社名單',
    agencyHref: 'https://oita-fukkou-wari.jp/agt/',
    note: '住宿直訂已於 10/16 開始；是否仍有額度由各飯店回答。',
    event: 'oita',
  },
  {
    area: '宮崎',
    hotelLabel: '參與飯店名單 PDF',
    hotelHref: 'https://miyazaki-ouen.jp/__assets/pdf/hotel_list1014.pdf',
    agencyLabel: '旅行社名單 PDF',
    agencyHref: 'https://miyazaki-ouen.jp/__assets/pdf/travel_agencies1013.pdf',
    note: '飯店直訂後還必須成功取得 STAYNAVI 優惠券。',
    event: 'miyazaki',
  },
  {
    area: '鹿兒島',
    hotelLabel: '參與飯店名單',
    hotelHref: 'https://fukko-ouenwari.pref.kagoshima.jp/stay/',
    agencyLabel: '參與旅行社名單',
    agencyHref: 'https://fukko-ouenwari.pref.kagoshima.jp/agt/',
    note: '直訂最長至 2027/2/28；12/26～2027/1/3 不適用。',
    event: 'kagoshima',
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
  'booking-selector',
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
    a: '不是。楽天與じゃらん雖出現在多個縣的官方名單，仍只有活動指定商品適用；楽天更明確排除外語版網站、JR 新幹線或特急＋住宿，以及跨兩縣訂單。Agoda、Booking.com 或一般國際訂房頁面不能因為有九州住宿就視為補助商品。',
  },
  {
    q: '台灣旅客可以直接在 JTB 或日本旅行買交通＋住宿嗎？',
    a: '不能當成保證可買。JTB 網路補助券要求 JTB Travel Member，但 JTB 官方 FAQ 說海外居住者不屬於會員註冊對象；日本旅行的活動頁則寫明網路方案限日本國內居住者。台灣旅客應先向各縣官方名單中的旅行社確認是否接受海外居住者，以及商品是否已包含本活動補助。',
  },
  {
    q: '自己分開訂福岡與熊本飯店，可以拿跨縣最高 ¥35,000 嗎？',
    a: '不可以因為住過兩縣就自動升級。最高 ¥35,000 適用的是參與旅行社事先包裝、以同一旅行契約販售的跨縣周遊商品；旅客分開成立的兩張飯店訂單仍各自依住宿商品規則計算。楽天也明確排除跨兩縣的活動訂單。',
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

        <section className="seo-content" id="booking-selector" aria-label="九州旅遊補助預訂方式選擇" style={{ scrollMarginTop: '76px' }}>
          <h2 className="seo-h2">我要怎麼領優惠？先看你想省的是哪一種</h2>
          <div className="seo-prose">
            <p>不要先選平台，先選旅行需求。不同商品的入口、上限與能不能讓台灣旅客完成訂購都不一樣。</p>
          </div>
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">只訂九州飯店</span>
              <strong>先查參與飯店直訂</strong>
              <p>向飯店確認補助額度；長崎、宮崎還要另外取得 STAYNAVI 優惠券。</p>
              <a className="seo-buy-link" href="#direct-booking-guide" data-event="kyushusubsidy_selector_direct" data-platform="article" data-section="booking_selector">看飯店直訂教學</a>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">想用楽天訂房</span>
              <strong>只能走日文活動頁</strong>
              <p>外語版訂單不適用；領券後仍要在完成訂單前確認折扣沒有掉券。</p>
              <a className="seo-buy-link" href="#rakuten-guide" data-event="kyushusubsidy_selector_rakuten" data-platform="article" data-section="booking_selector">看楽天領券教學</a>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">JR／日本國內航班＋住宿</span>
              <strong>必須買業者套裝商品</strong>
              <p>不能自己把交通票與飯店合併；平台還必須接受海外居住者購買。</p>
              <a className="seo-buy-link" href="#transport-package-guide" data-event="kyushusubsidy_selector_transport" data-platform="article" data-section="booking_selector">看交通套裝教學</a>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">只買車票、JR Pass 或一日遊</span>
              <strong>不適用政府 50%～60% 補助</strong>
              <p>這些要另外購買；可直接比較一般交通、票券及活動價格。</p>
              <a className="seo-buy-link" href="#travel-next-step" data-event="kyushusubsidy_selector_activities" data-platform="article" data-section="booking_selector">比較一般票券</a>
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
          <h2 className="seo-h2">九州旅遊補助實際訂購教學：先確認通路真的讓台灣旅客完成</h2>
          <div className="seo-prose">
            <p>
              <strong>政府允許訪日旅客使用，不代表每一家日本訂房網站都接受海外居住者購買。</strong>這次沒有全九州共用折扣碼；補助額度分散在各縣的參與飯店、OTA 與旅行社，還要同時符合販售平台自己的會員及商品條件。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>預訂通路</th>
                    <th>台灣旅客怎麼看</th>
                    <th>本文建議</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>參與飯店官方直訂</strong></td>
                    <td>制度確定包含訪日旅客；直接向飯店確認是否仍有補助額度與付款方式。</td>
                    <td><strong>優先查這條路</strong>，但採 STAYNAVI 的縣還要完成發券。</td>
                  </tr>
                  <tr>
                    <td><strong>楽天日文版</strong></td>
                    <td>只有日文活動頁與指定商品可能適用；外語版訂單明確排除。</td>
                    <td>可依下方流程嘗試，付款前一定要看到優惠券仍在訂單上。</td>
                  </tr>
                  <tr>
                    <td><strong>JTB 網路預訂</strong></td>
                    <td>補助券要求 JTB 會員，但 JTB 官方 FAQ 說海外居住者不屬於會員註冊對象。</td>
                    <td>不寫成台灣旅客保證入口；只有本來就符合會員與商品條件者再確認。</td>
                  </tr>
                  <tr>
                    <td><strong>日本旅行網路預訂</strong></td>
                    <td>活動頁目前寫明日本國內居住者適用。</td>
                    <td>不列為台灣旅客建議通路。</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="seo-h3" id="direct-booking-guide" style={{ scrollMarginTop: '76px' }}>方式 A｜飯店官方直訂：目前最值得台灣旅客先確認</h3>
            <ol>
              <li><strong>從下表打開住宿縣的參與飯店名單：</strong>不要直接從搜尋引擎任選同一家飯店。</li>
              <li><strong>從飯店官網或電話建立新訂單：</strong>訂房前先確認是活動適用方案、目前仍有額度，並表明要使用九州旅遊補助。</li>
              <li><strong>確認是否還要自行領券：</strong>長崎、宮崎的飯店直訂採 STAYNAVI 時，飯店訂單完成後還要另外註冊並取得補助優惠券。</li>
              <li><strong>保存兩份證明：</strong>飯店訂單與 STAYNAVI 優惠券缺一不可；飯店訂成功但優惠券沒有發出，仍不能折。</li>
              <li><strong>入住時完成資格確認：</strong>帶護照、訂單與必要優惠券，預訂代表人姓名須和護照一致，並依規定簽署利用證明。</li>
            </ol>
            <p>
              <strong>長崎目前特別注意：</strong>飯店直訂第一期已額滿；第二期預定在<strong>10 月 23 日 10:00</strong>開放，適用 10 月 23 日起入住。取消訂房時，也要分別取消飯店訂單與 STAYNAVI 優惠券。
            </p>

            <h3 className="seo-h3">七縣飯店與旅行社官方名單</h3>
            <p>下列連結直接前往各縣目前公布的名單；PDF 與額度會持續更新，若深層連結變動，可回到上方該縣官方首頁。</p>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>住宿縣</th>
                    <th>飯店直訂入口</th>
                    <th>交通套裝／旅行社入口</th>
                    <th>目前重點</th>
                  </tr>
                </thead>
                <tbody>
                  {prefectureBookingResources.map((resource) => (
                    <tr key={resource.area}>
                      <td><strong>{resource.area}</strong></td>
                      <td>
                        <a href={resource.hotelHref} target="_blank" rel="noopener noreferrer" data-event={`kyushusubsidy_resource_${resource.event}_hotel`} data-platform={`${resource.area} official`} data-section="booking_resources">
                          {resource.hotelLabel}
                        </a>
                      </td>
                      <td>
                        <a href={resource.agencyHref} target="_blank" rel="noopener noreferrer" data-event={`kyushusubsidy_resource_${resource.event}_agency`} data-platform={`${resource.area} official`} data-section="booking_resources">
                          {resource.agencyLabel}
                        </a>
                      </td>
                      <td>{resource.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="seo-h3" id="rakuten-guide" style={{ scrollMarginTop: '76px' }}>方式 B｜楽天日文版：領券後還要成功完成訂單</h3>
            <div className="seo-action-links" aria-label="楽天九州旅遊補助官方入口">
              <a className="seo-buy-link primary" href={RAKUTEN_CAMPAIGN_URL} target="_blank" rel="noopener noreferrer" data-event="kyushusubsidy_rakuten_official" data-platform="Rakuten Travel" data-section="booking_guide">
                打開楽天日文活動頁
              </a>
            </div>
            <ol>
              <li>使用楽天 ID 登入日文版活動頁，再選擇實際住宿縣。</li>
              <li>領取對應人數、住宿天數與商品類型的補助優惠券。</li>
              <li>從優惠券頁的適用設施入口搜尋飯店，不要另開外語版重新搜尋。</li>
              <li>進入付款步驟後，確認活動優惠券已套用、折扣額與最終應付金額正確。</li>
              <li>完成訂單後再次查看預訂明細；只有「完成預訂」才占到名額，領到券不等於保留額度。</li>
            </ol>
            <p>
              楽天官方明確排除<strong>外語版網站、JR 新幹線／特急＋住宿、跨兩縣訂單、日歸與商務用途</strong>。國內航班＋住宿的 ANA 樂包、JAL 樂包屬可能適用商品，但仍要以該縣優惠券與結帳畫面為準。台灣旅客若無法在日文版完成帳號、聯絡資料或付款流程，不要改用外語版並期待入住時補折，應改查飯店官方直訂。
            </p>

            <h3 className="seo-h3" id="transport-package-guide" style={{ scrollMarginTop: '76px' }}>方式 C｜交通＋住宿：先確認是同一份補助旅行商品</h3>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>想省的項目</th>
                    <th>符合條件的訂法</th>
                    <th>不能這樣做</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>日本國內航班＋住宿</strong></td>
                    <td>購買活動指定的國內套裝，例如符合優惠券條件的航空＋飯店商品。</td>
                    <td>不能把台灣往返日本的國際機票或原有機票事後加入。</td>
                  </tr>
                  <tr>
                    <td><strong>JR／特急＋住宿</strong></td>
                    <td>向縣官方名單中的旅行社購買已包裝完成的活動商品。</td>
                    <td>楽天的 JR 新幹線／特急＋住宿明確不適用，也不能自行買 JR 後合併。</td>
                  </tr>
                  <tr>
                    <td><strong>跨兩縣以上周遊</strong></td>
                    <td>購買旅行社以同一旅行契約販售的跨縣周遊商品，才有機會適用每人最高 ¥35,000。</td>
                    <td>分開訂福岡與熊本兩張飯店訂單，不會自動升級成周遊商品。</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              聯絡旅行社前先問清楚三件事：<strong>是否接受海外居住者購買、商品是否明確套用九州旅遊補助、交通與住宿是否在同一份旅行契約內</strong>。三項都有明確答案，再確認折後報價與取消條件。
            </p>
            <p>
              JTB 官方確實提供「先複製優惠碼與密碼，再於付款頁套用」的流程，但網路券要求 JTB Travel Member；其官方會員 FAQ 又將註冊對象限於日本國內居住者，因此本文不把它寫成台灣旅客保證可用的交通入口。日本旅行的活動頁也明載網路方案限日本國內居住者。可查看
              <a href={JTB_CAMPAIGN_URL} target="_blank" rel="noopener noreferrer" data-event="kyushusubsidy_transport_jtb_campaign" data-platform="JTB" data-section="booking_guide"><strong>JTB 活動說明</strong></a>
              、
              <a href={JTB_OVERSEAS_MEMBER_FAQ_URL} target="_blank" rel="noopener noreferrer" data-event="kyushusubsidy_transport_jtb_membership" data-platform="JTB" data-section="booking_guide"><strong>JTB 海外居住者會員規則</strong></a>
              與
              <a href={NTA_CAMPAIGN_URL} target="_blank" rel="noopener noreferrer" data-event="kyushusubsidy_transport_nta_campaign" data-platform="Nippon Travel Agency" data-section="booking_guide"><strong>日本旅行活動頁</strong></a>
              交叉確認。
            </p>

            <h3 className="seo-h3">送出訂單前的最後檢查</h3>
            <ol>
              <li>方案名稱或訂單明細明確寫出住宿縣的九州旅遊補助活動。</li>
              <li>優惠券、補助金額或折後應付價格已經顯示，沒有在最後一步掉券。</li>
              <li>入住日期、人數、住宿縣、房型與預訂代表人姓名都正確。</li>
              <li>已看過取消費；補助訂單取消費可能按折扣前價格計算。</li>
            </ol>
            <p><strong>最簡單的判斷：付款前看不到補助，入住時就不會突然幫你折。</strong></p>
          </div>
        </section>

        <section className="seo-content" id="platforms" aria-label="九州旅遊補助訂房平台與完售狀態">
          <h2 className="seo-h2">台灣旅客可用，不代表所有訂房網站都能用</h2>
          <div className="seo-prose">
            <p>
              「訪日旅客是制度對象」只代表國籍與居住地不會被九州各縣一律排除，實際販售業者仍可設定自己的網站、會員、付款與商品限制。以下是目前官方資料能確認的差別。
            </p>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>網站／通路</th>
                    <th>官方確認內容</th>
                    <th>台灣讀者應怎麼做</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>楽天</strong></td>
                    <td>日文版指定商品可領券；外語版、JR＋住宿與跨縣訂單排除。</td>
                    <td>從日文活動頁開始，完成訂單前確認折扣仍存在。</td>
                  </tr>
                  <tr>
                    <td><strong>JTB</strong></td>
                    <td>補助券需會員；海外居住者不屬於 JTB Travel Member 註冊對象。</td>
                    <td>不要當成所有台灣旅客都能使用的固定入口。</td>
                  </tr>
                  <tr>
                    <td><strong>日本旅行</strong></td>
                    <td>目前活動頁將網路商品對象寫為日本國內居住者。</td>
                    <td>不列入台灣旅客建議通路。</td>
                  </tr>
                  <tr>
                    <td><strong>Agoda／Booking.com／Trip.com</strong></td>
                    <td>一般國際訂房頁面不會因為住宿位於九州就自動成為補助商品。</td>
                    <td>只作一般房價與可取消方案比較。</td>
                  </tr>
                  <tr>
                    <td><strong>KKday／Klook</strong></td>
                    <td>單獨購買 JR Pass、交通票、景點票與一日遊不屬於本次政府補助。</td>
                    <td>住宿確定後再用來補齊一般票券與行程。</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
