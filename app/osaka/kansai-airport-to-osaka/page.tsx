import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  kansaiAirportToOsakaCanonical,
  kansaiAirportToOsakaDescription,
  kansaiAirportToOsakaTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const KIX_TRANSPORT_MAP_URL = 'https://www.google.com/maps/d/edit?mid=11LrZQhbY4ULNh46Oxe4NWci5Zas6UCA&usp=sharing'

type ActionLink = {
  label: string
  href: string
  event: string
  platform: string
  primary?: boolean
}

function ActionLinks({ label, links }: { label: string; links: ActionLink[] }) {
  return (
    <div className="seo-buy-links" aria-label={label}>
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

const linkGroups = {
  videos: [
    { label: 'IG｜3種方式', href: 'https://www.instagram.com/reel/DZhualih3oF/', event: 'osakakix_video_3ways_ig', platform: 'IG', primary: true },
  ],
  rapit: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/19691-nankai-rapit-airport-express-kix-to-osaka?cid=22312', event: 'osakakix_rapit_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/599-kansai-airport-namba-train-ticket-osaka/?aid=93798', event: 'osakakix_rapit_klook', platform: 'KLOOK' },
    { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/57078589/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16697837', event: 'osakakix_rapit_trip', platform: 'Trip' },
    { label: '時刻表', href: 'https://www.nankai.co.jp/tc_railway/access-timetable', event: 'osakakix_rapit_timetable', platform: 'Timetable' },
    { label: '地圖', href: KIX_TRANSPORT_MAP_URL, event: 'osakakix_rapit_map', platform: 'GoogleMap' },
  ],
  haruka: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/18940-kansai-airport-haruka-ticket-japan?cid=22312', event: 'osakakix_haruka_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/18400-jr-haruka-airport-express-train-tickets-osaka/?aid=93798', event: 'osakakix_haruka_klook', platform: 'KLOOK' },
    { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/87364606/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16697837', event: 'osakakix_haruka_trip', platform: 'Trip' },
    { label: '地圖', href: KIX_TRANSPORT_MAP_URL, event: 'osakakix_haruka_map', platform: 'GoogleMap' },
  ],
  limousine: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/4835-limousine-bus-ticket-kansai-airport-kix-kyoto-osaka-city?cid=22312', event: 'osakakix_limousine_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/18203-kansai-airport-one-way-transfer-osaka/?aid=93798', event: 'osakakix_limousine_klook', platform: 'KLOOK' },
    { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/93684157?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16697837', event: 'osakakix_limousine_trip', platform: 'Trip' },
    { label: '時刻表', href: 'https://www.kate.co.jp/tcn/timetable/index', event: 'osakakix_limousine_timetable', platform: 'Timetable' },
    { label: '地圖', href: KIX_TRANSPORT_MAP_URL, event: 'osakakix_limousine_map', platform: 'GoogleMap' },
  ],
  transfer: [
    { label: 'KKDAY包車', href: 'https://www.kkday.com/zh-tw/product/129909-japan-kansai-international-airport-private-transfer-to-osaka-kyoto-nara-kobe-nagoya?cid=22312', event: 'osakakix_transfer_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK包車', href: 'https://www.klook.com/zh-TW/activity/15716-osaka-surrounding-areas-private-charter/?aid=93798', event: 'osakakix_transfer_klook', platform: 'KLOOK' },
  ],
}

const faqItems = [
  {
    q: '關西機場到難波最快怎麼搭？',
    a: '住難波、新今宮、心齋橋一帶，通常先看南海電鐵 Rapi:t。它到難波很直覺，全車指定席，也比較適合帶行李移動。',
  },
  {
    q: 'HARUKA 可以直達奈良或神戶嗎？',
    a: 'HARUKA 主要直達天王寺、大阪、新大阪、京都等 JR 大站。奈良和神戶通常要轉乘，或直接改看利木津巴士與其他 JR 路線。',
  },
  {
    q: '利木津巴士適合誰？',
    a: '適合行李多、親子家庭、帶長輩，或飯店附近剛好有停靠點的人。缺點是車程可能受塞車影響，班次也要先確認。',
  },
  {
    q: '凌晨或深夜抵達關西機場怎麼辦？',
    a: '先查當天最後一班電車與巴士。如果抵達時間太晚，建議看機場附近住宿、包車，或隔天早上再進市區，不要硬抓剛好銜接的末班車。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: kansaiAirportToOsakaTitle.replace(' | JieJourneys(旅杰)', ''),
  description: kansaiAirportToOsakaDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: kansaiAirportToOsakaCanonical,
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

type KansaiAirportToOsakaPageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video') return '/osaka/video'
  if (value === 'transport') return '/osaka/transport'
  return '/osaka'
}

export default async function KansaiAirportToOsakaPage({ searchParams }: KansaiAirportToOsakaPageProps) {
  const params = (await searchParams) ?? {}
  const backHref = sourceBackHref(params.from)

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
      <CitySubpageHeader backHref={backHref} eventPrefix="osakakix" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="大阪機場交通攻略"
          h1="關西機場到大阪市區｜Rapi:t、HARUKA、利木津巴士怎麼選？"
          intro="從關西機場進大阪市區，先不要急著比票價，先看你住哪裡、行李多不多、要不要直達飯店。這篇用 3 種主要方式幫你快速判斷。"
          eventPrefix="osakakix"
          showVisual={false}
          ctaLinks={[
            { label: '快速比較', href: '#quick-answer', dataEvent: 'osakakix_hero_quick', platform: 'article' },
            { label: '購票連結', href: '#ticket-links', dataEvent: 'osakakix_hero_links', platform: 'article' },
            { label: '交通地圖', href: KIX_TRANSPORT_MAP_URL, dataEvent: 'osakakix_hero_map', platform: 'GoogleMap' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="關西機場到大阪快速比較">
          <div className="narita-summary-grid kix-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">住難波/心齋橋</span>
              <strong>Rapi:t</strong>
              <p>最快到難波，全車指定席，適合第一次大阪自由行。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">住天王寺/大阪/新大阪/京都</span>
              <strong>HARUKA</strong>
              <p>接 JR 大站最清楚，住宿靠 JR 時很省心。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">行李多/親子/飯店直達</span>
              <strong>利木津巴士</strong>
              <p>不用拖行李轉車，但要先看班次與停靠點。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="關西機場交通短影片">
          <h2 className="seo-h2">先看短影片：3 種方式先抓方向</h2>
          <div className="seo-prose">
            <p>
              如果你想先用短影音抓概念，可以先看我的關西機場到大阪市區 3 種方式。看完再回來比住宿區域和購票連結，會比較不容易買錯。
            </p>
            <ActionLinks label="關西機場交通短影片" links={linkGroups.videos} />
          </div>
        </section>

        <section className="seo-content" id="ticket-links" aria-label="關西機場交通方式與購票連結">
          <h2 className="seo-h2">3 種方式怎麼選？</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">南海電鐵 Rapi:t：最快到難波</h3>
            <p>
              Rapi:t 主要停靠新今宮、難波方向。住難波、心齋橋、日本橋一帶的人，我會先看這個，因為下車後接大阪 Metro 或步行到飯店都很直覺。Rapi:t 是指定席，拖行李會比一般車舒服。
            </p>
            <ul>
              <li>主要停靠：新今宮站、難波站。</li>
              <li>適合：住難波、心齋橋、日本橋、新今宮的人。</li>
              <li>提醒：如果你的飯店其實在大阪站、梅田、新大阪，Rapi:t 不是最順。</li>
            </ul>
            <ActionLinks label="Rapi:t 購票與地圖" links={linkGroups.rapit} />

            <h3 className="seo-h3">關西機場特快 HARUKA：住 JR 大站最方便</h3>
            <p>
              HARUKA 適合住天王寺、大阪站、新大阪、京都的人。它不是「所有地方都直達」，但只要住宿靠 JR 大站，就很省轉乘心力。奈良、神戶通常要再轉乘，或改看巴士是否有更直覺的路線。
            </p>
            <ul>
              <li>主要停靠：天王寺站、大阪站、新大阪站、京都站。</li>
              <li>適合：住大阪站、新大阪、京都，或行程第一天直接往京都的人。</li>
              <li>提醒：住難波通常不用硬搭 HARUKA，Rapi:t 更直接。</li>
            </ul>
            <ActionLinks label="HARUKA 購票與地圖" links={linkGroups.haruka} />

            <h3 className="seo-h3">利木津巴士：行李最輕鬆</h3>
            <p>
              利木津巴士的優勢是停靠點多，許多飯店、轉運站或熱門區域都有路線。它不一定最快，但最適合不想拖行李上下樓梯的人。親子、長輩、大型行李、深夜抵達，都可以優先確認巴士。
            </p>
            <ul>
              <li>主要停靠：大阪站、難波 OCAT、上本町、天王寺、USJ、神戶、奈良、京都等方向。</li>
              <li>適合：行李多、親子家庭、飯店附近有巴士站的人。</li>
              <li>提醒：要看班次和路況，尖峰或假日車程可能變長。</li>
            </ul>
            <ActionLinks label="利木津巴士購票與地圖" links={linkGroups.limousine} />
          </div>
        </section>

        <section className="seo-content" aria-label="關西機場交通最後選法">
          <h2 className="seo-h2">我的結論：先看住宿區域，再買票</h2>
          <div className="seo-prose">
            <ol>
              <li>住難波、心齋橋、新今宮：先看 Rapi:t。</li>
              <li>住天王寺、大阪站、新大阪、京都：先看 HARUKA。</li>
              <li>行李多、親子、長輩或飯店有巴士站：先看利木津巴士。</li>
              <li>深夜抵達或多人同行：再評估包車。</li>
            </ol>
            <ActionLinks label="關西機場包車" links={linkGroups.transfer} />
          </div>
        </section>

        <SeoFaqSection title="關西機場到大阪常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
