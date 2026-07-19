import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  tokyoToKawaguchikoCanonical,
  tokyoToKawaguchikoDescription,
  tokyoToKawaguchikoTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const FUJI_TRANSPORT_MAP_URL = 'https://www.jiejourneys.com/fuji/map'

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
      {links.map((link) => {
        const isExternal = /^https?:\/\//.test(link.href)
        return (
          <a
            key={`${link.label}-${link.href}`}
            className={link.primary ? 'seo-buy-link primary' : 'seo-buy-link'}
            href={link.href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            data-event={link.event}
            data-platform={link.platform}
            data-section="article_link"
          >
            {link.label}
          </a>
        )
      })}
    </div>
  )
}

const linkGroups = {
  videos: [
    { label: 'IG｜3種方式', href: 'https://www.instagram.com/reel/DX1lCACSFYX/', event: 'fujikawaguchiko_video_3ways_ig', platform: 'IG', primary: true },
    { label: 'YouTube', href: 'https://www.youtube.com/shorts/nj79P4JUujQ', event: 'fujikawaguchiko_video_3ways_yt', platform: 'YouTube' },
  ],
  excursion: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/transportation/list_page/japan-rail/jp-shinjuku-rail-to-jp-kawaguchiko-rail?cid=22312', event: 'fujikawaguchiko_excursion_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/japan-rail/kawaguchiko-station/28-tokyo/?aid=93798', event: 'fujikawaguchiko_excursion_klook', platform: 'KLOOK' },
    { label: '時刻表', href: 'https://www.fujikyu-railway.jp/fujikaiyuu/', event: 'fujikawaguchiko_excursion_timetable', platform: 'Timetable' },
  ],
  bus: [
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/159339-tokyo-mtfuji-highway-bus/?aid=93798', event: 'fujikawaguchiko_bus_klook', platform: 'KLOOK', primary: true },
    { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/68978254/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16062937', event: 'fujikawaguchiko_bus_trip', platform: 'Trip' },
    { label: '官網', href: 'https://highway-buses.jp/chi/course/kawaguchiko.php', event: 'fujikawaguchiko_bus_official', platform: 'Official' },
    { label: '時刻表', href: 'https://japantravel.navitime.com/zh-tw/area/jp/highwaybus/list/tokyo-to-yamanashi/', event: 'fujikawaguchiko_bus_timetable', platform: 'Timetable' },
  ],
  car: [
    { label: 'KLOOK包車', href: 'https://www.klook.com/zh-TW/activity/120898-car-rental-with-driver-tokyo-mtfuji-chinesespeaking/?aid=93798', event: 'fujikawaguchiko_car_klook', platform: 'KLOOK', primary: true },
    { label: 'KKDAY包車', href: 'https://www.kkday.com/zh-tw/product/9558-tokyo-private-day-tour-mt-fuji-hakone-and-downtown-tokyo-japan?cid=22312', event: 'fujikawaguchiko_car_kkday', platform: 'KKDAY' },
    { label: '合作租車', href: 'https://www2.tocoo.jp/cn/?asp_id=2564&utm_source=2564&utm_medium=affiliate', event: 'fujikawaguchiko_self_tocoo', platform: 'TOCOO' },
    { label: 'Trip租車', href: 'https://tw.trip.com/carhire/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16062937', event: 'fujikawaguchiko_self_trip', platform: 'Trip' },
  ],
}

const faqItems = [
  {
    q: '東京到河口湖最快要搭什麼？',
    a: '想快又舒服，優先看富士回遊。它從新宿直達河口湖，約 2 小時，不受高速公路塞車影響，但熱門時段要提早訂票。'
  },
  {
    q: '東京到河口湖最便宜是哪一種？',
    a: '多數情況先看高速巴士。新宿、澀谷、東京車站等路線都能查，票價通常比富士回遊低，但假日、花季、楓葉季可能塞車。'
  },
  {
    q: '一日遊河口湖適合自駕或包車嗎？',
    a: '如果只到河口湖站周邊，大眾交通就夠；如果想把忍野八海、新倉山淺間公園、大石公園、御殿場 Outlet 串在同一天，包車或自駕會更彈性。'
  },
  {
    q: '富士回遊需要提前買票嗎？',
    a: '建議提前查票。富士回遊班次有限，且沒有自由席設定，熱門季節臨時到車站才買，可能遇到想搭的班次沒有座位。'
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: tokyoToKawaguchikoTitle.replace(' | JieJourneys(旅杰)', ''),
  description: tokyoToKawaguchikoDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: tokyoToKawaguchikoCanonical,
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

type TokyoToKawaguchikoPageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video') return '/fuji/video'
  if (value === 'transport') return '/fuji/transport'
  return '/fuji'
}

export default async function TokyoToKawaguchikoPage({ searchParams }: TokyoToKawaguchikoPageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="fujikawaguchiko" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="河口湖交通攻略"
          h1="東京到河口湖｜富士回遊、高速巴士、包車自駕 3 種方式怎麼選？"
          intro="從東京去河口湖，不要只看哪個最便宜。先看你從哪裡出發、想不想轉車、能不能接受塞車，以及當天是不是要跑很多景點。這篇用 3 種方式幫你快速判斷。"
          eventPrefix="fujikawaguchiko"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'fujikawaguchiko_hero_quick', platform: 'article' },
            { label: '購票連結', href: '#ticket-links', dataEvent: 'fujikawaguchiko_hero_links', platform: 'article' },
            { label: '交通地圖', href: FUJI_TRANSPORT_MAP_URL, dataEvent: 'fujikawaguchiko_hero_map', platform: 'map' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="東京到河口湖快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">想快又舒適</span>
              <strong>富士回遊</strong>
              <p>新宿直達河口湖，約 2 小時，不會被高速公路塞車影響。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">想便宜方便</span>
              <strong>高速巴士</strong>
              <p>新宿、東京、澀谷等出發地可查，價格通常漂亮，但要接受塞車風險。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">想自由彈性</span>
              <strong>自駕 / 包車</strong>
              <p>適合多人、親子、長輩，或想把河口湖周邊景點一次串起來。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">我的懶人選法</span>
              <strong>先看行程密度</strong>
              <p>只去河口湖站周邊選車票，要跑多點景點再看包車或自駕。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="東京到河口湖短影音">
          <h2 className="seo-h2">先看短影音：3 種方式先抓方向</h2>
          <div className="seo-prose">
            <p>
              如果你想先用短影音抓重點，可以先看我的東京到河口湖 3 種方式。看完再回來比富士回遊、高速巴士和包車自駕，會比較不容易買錯。
            </p>
            <SeoVideoLinkMenu label="東京到河口湖" links={linkGroups.videos} />
          </div>
        </section>

        <section className="seo-content" id="ticket-links" aria-label="東京到河口湖交通方式與購票連結">
          <h2 className="seo-h2">3 種方式怎麼選？</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">富士回遊：最快、最舒服，也最需要提前規劃</h3>
            <p>
              富士回遊是 JR 與富士急行直通的特急列車，主要從新宿出發，直達富士山站、富士急樂園、河口湖站。它的優點很清楚：不用轉車、不怕高速公路塞車，坐起來也最舒服。
            </p>
            <ul>
              <li>出發地：新宿為主，也可查立川、八王子、大月等停靠站。</li>
              <li>車程：新宿到河口湖約 2 小時。</li>
              <li>適合：想最快、最舒服，或不想拖行李轉車的人。</li>
              <li>提醒：價格較高，班次有限，熱門季節建議提前訂票。</li>
            </ul>
            <ActionLinks label="富士回遊購票與時刻表" links={linkGroups.excursion} />

            <h3 className="seo-h3">高速巴士：便宜、出發點多，缺點是可能塞車</h3>
            <p>
              高速巴士是我覺得最直覺的小資選擇。新宿、東京車站、澀谷等地都有路線可查，也有部分機場或其他城市路線。它通常比富士回遊便宜，而且可以直達河口湖站，不用先到大月轉車。
            </p>
            <ul>
              <li>常見出發地：新宿、東京車站、澀谷，部分路線可查成田、羽田或橫濱。</li>
              <li>車程：新宿到河口湖約 1 小時 45 分到 2 小時，實際會受路況影響。</li>
              <li>適合：想便宜、想直達、住宿離巴士站近的人。</li>
              <li>提醒：週末、花季、楓葉季、連假要預留塞車時間。</li>
            </ul>
            <ActionLinks label="高速巴士購票與時刻表" links={linkGroups.bus} />

            <h3 className="seo-h3">自駕 / 包車：最自由，但成本也最高</h3>
            <p>
              如果你只想從東京到河口湖站，包車或自駕不一定划算；但如果你想一天串忍野八海、新倉山淺間公園、大石公園、河口湖纜車、御殿場 Outlet，車子的彈性就很有價值。
            </p>
            <ul>
              <li>適合：多人同行、親子家庭、長輩同行、想一次跑多個景點的人。</li>
              <li>優點：時間最自由，不用一直等車或搬行李。</li>
              <li>缺點：費用較高，自駕還要考慮國際駕照、高速公路費、停車和路況。</li>
              <li>提醒：熱門季節河口湖周邊也會塞，回東京時間不要抓太緊。</li>
            </ul>
            <ActionLinks label="包車與租車連結" links={linkGroups.car} />
          </div>
        </section>

        <section className="seo-content" aria-label="東京到河口湖最後選法">
          <h2 className="seo-h2">最後怎麼選？我會這樣看</h2>
          <div className="seo-prose">
            <ul className="narita-checklist">
              <li>想快又舒適：選富士回遊。</li>
              <li>想便宜方便：選高速巴士。</li>
              <li>想自由安排時間：選自駕或包車。</li>
              <li>只去河口湖站、大石公園、纜車：大眾交通通常夠用。</li>
              <li>想串忍野八海、新倉山、御殿場 Outlet：包車或自駕會順很多。</li>
            </ul>
          </div>
        </section>

        <section className="seo-content" aria-label="東京到河口湖比較表">
          <h2 className="seo-h2">快速比較表</h2>
          <div className="seo-prose">
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>方式</th>
                    <th>適合的人</th>
                    <th>優點</th>
                    <th>注意事項</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>富士回遊</td>
                    <td>想快、想舒服、想少轉車</td>
                    <td>新宿直達河口湖，不受塞車影響。</td>
                    <td>票價較高，班次有限，座位要早點查。</td>
                  </tr>
                  <tr>
                    <td>高速巴士</td>
                    <td>想省預算、住宿靠巴士站</td>
                    <td>直達河口湖，出發地點選擇多。</td>
                    <td>可能塞車，熱門日期建議提前訂位。</td>
                  </tr>
                  <tr>
                    <td>自駕 / 包車</td>
                    <td>多人、親子、想跑多景點</td>
                    <td>彈性最高，不用配合班次。</td>
                    <td>費用較高，仍可能遇到塞車與停車問題。</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <SeoFaqSection title="東京到河口湖常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
