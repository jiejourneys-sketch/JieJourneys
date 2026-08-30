import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import {
  hanedaAirportToTokyoCanonical,
  hanedaAirportToTokyoDescription,
  hanedaAirportToTokyoTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const HANEDA_TRANSPORT_MAP_URL = 'https://www.google.com/maps/d/edit?mid=1d5zUE9pWTdlrDUplV7Q5ARZ6GoIhOQA&usp=sharing'

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

const linkGroups = {
  videos: [
    { label: 'IG｜3種方式', href: 'https://www.instagram.com/reel/DUvT5Etkf4f/', event: 'tokyohaneda_video_3ways_ig', platform: 'IG', primary: true },
    { label: 'YouTube', href: 'https://www.youtube.com/shorts/fTtfgB93DE4', event: 'tokyohaneda_video_3ways_yt', platform: 'YouTube' },
  ],
  keikyu: [
    { label: 'Suica', href: 'https://www.klook.com/zh-TW/activity/16917-suica-ic-card-tokyo/?aid=93798', event: 'tokyohaneda_keikyu_suica', platform: 'KLOOK', primary: true },
    { label: '時刻表', href: 'https://www.haneda-tokyo-access.com/tc/', event: 'tokyohaneda_keikyu_timetable', platform: 'Timetable' },
    { label: '地圖', href: HANEDA_TRANSPORT_MAP_URL, event: 'tokyohaneda_keikyu_map', platform: 'GoogleMap' },
  ],
  monorail: [
    { label: 'Suica', href: 'https://www.klook.com/zh-TW/activity/16917-suica-ic-card-tokyo/?aid=93798', event: 'tokyohaneda_monorail_suica', platform: 'KLOOK', primary: true },
    { label: '時刻表', href: 'https://www.tokyo-monorail.co.jp/tc/', event: 'tokyohaneda_monorail_timetable', platform: 'Timetable' },
    { label: '地圖', href: HANEDA_TRANSPORT_MAP_URL, event: 'tokyohaneda_monorail_map', platform: 'GoogleMap' },
  ],
  limousine: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/18551-tokyo-narita-airport-limousine-bus-transfer-ticket?cid=22312', event: 'tokyohaneda_limousine_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/150434-haneda-airport-limousine-bus-tokyo/?aid=93798', event: 'tokyohaneda_limousine_klook', platform: 'KLOOK' },
    { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/87596821/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7239738', event: 'tokyohaneda_limousine_trip', platform: 'Trip' },
    { label: '時刻表', href: 'https://www.limousinebus.co.jp/zh-tw/busstop/#flow2b', event: 'tokyohaneda_limousine_timetable', platform: 'Timetable' },
    { label: '地圖', href: HANEDA_TRANSPORT_MAP_URL, event: 'tokyohaneda_limousine_map', platform: 'GoogleMap' },
  ],
  transfer: [
    { label: 'KKDAY包車', href: 'https://www.kkday.com/zh-tw/product/174325-narita-haneda-airports-transfer-tokyo-attractions-disney-resorts-suburban-areas?cid=22312', event: 'tokyohaneda_car_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK包車', href: 'https://www.klook.com/zh-TW/airport-transfers/?aid=93798', event: 'tokyohaneda_car_klook', platform: 'KLOOK' },
    { label: '合作租車', href: 'https://www2.tocoo.jp/cn/?asp_id=2564&utm_source=2564&utm_medium=affiliate', event: 'tokyohaneda_self_tocoo', platform: 'TOCOO' },
  ],
}

const faqItems = [
  {
    q: '羽田機場到東京市區最快是哪一種？',
    a: '要看目的地。往品川、東銀座、淺草、押上方向通常先看京急電鐵；往濱松町後接 JR 山手線，東京單軌電車會很順。住飯店門口或行李多時，利木津巴士不一定最快，但最省力。',
  },
  {
    q: '京急電鐵和東京單軌電車怎麼選？',
    a: '住淺草、押上、東銀座、品川一帶，先看京急電鐵；住秋葉原、新宿、池袋、東京車站或山手線沿線，先看東京單軌電車到濱松町再轉 JR。',
  },
  {
    q: '羽田機場利木津巴士適合誰？',
    a: '適合飯店或目的地剛好有停靠、行李多、親子長輩同行、或不想在車站搬行李的人。缺點是會受路況影響，尖峰時間要多抓緩衝。',
  },
  {
    q: '羽田機場搭電車可以用 Suica 嗎？',
    a: '京急電鐵與東京單軌電車都可以用 Suica、PASMO、ICOCA 這類交通 IC 卡進出站。搭巴士前仍建議先確認路線、停靠點與付款方式。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: hanedaAirportToTokyoTitle.replace(' | JieJourneys(旅杰)', ''),
  description: hanedaAirportToTokyoDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: hanedaAirportToTokyoCanonical,
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

export default function HanedaAirportToTokyoPage() {
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
      <CitySubpageHeader backHref="/tokyo/transport" eventPrefix="tokyohaneda" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="東京交通攻略"
          h1="羽田機場到東京市區交通攻略｜京急電鐵、東京單軌電車、利木津巴士怎麼選？"
          intro="從羽田機場進東京市區，比成田單純很多，重點是看你住哪一區。住淺草、押上、東銀座先看京急；住山手線沿線先看單軌電車；想直達飯店就看利木津巴士。"
          eventPrefix="tokyohaneda"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'tokyohaneda_hero_quick', platform: 'article' },
            { label: '方式比較', href: '#comparison', dataEvent: 'tokyohaneda_hero_comparison', platform: 'article' },
            { label: 'IG短影音', href: '#video-guide', dataEvent: 'tokyohaneda_hero_video', platform: 'IG' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="羽田機場到東京快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">住淺草/押上</span>
              <strong>京急電鐵</strong>
              <p>直通都營淺草線方向，東銀座、淺草、押上不用複雜轉乘。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">住山手線沿線</span>
              <strong>東京單軌電車</strong>
              <p>到濱松町後接 JR，東京、秋葉原、新宿、池袋都好延伸。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">想直達飯店</span>
              <strong>利木津巴士</strong>
              <p>停靠點多、行李最輕鬆，適合親子、長輩或大件行李。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">深夜/多人</span>
              <strong>包車</strong>
              <p>抵達時間尷尬、飯店不靠站、三四人以上同行時可以一起比較。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="羽田機場交通短影音">
          <h2 className="seo-h2">先看 IG 短影音：羽田機場進市區 3 種方式</h2>
          <div className="seo-prose">
            <p>想先用一分鐘抓重點，可以先看這支羽田機場進東京市區短影音，再回來對照自己的住宿區域選路線。</p>
            <SeoVideoLinkMenu label="羽田進市區｜3種方式" links={linkGroups.videos} />
          </div>
        </section>

        <section className="seo-content" id="comparison" aria-label="羽田機場交通方式比較">
          <h2 className="seo-h2">先看比較表：你適合哪一種？</h2>
          <div className="seo-prose">
            <p>
              羽田離東京市區近，電車通常又快又省；但如果你帶大行李、飯店剛好有巴士停靠，利木津巴士的省力感會很明顯。先用目的地決定，再看當天班機時間和行李量。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>交通方式</th>
                    <th>最適合住哪裡</th>
                    <th>優點</th>
                    <th>注意事項</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>京急電鐵</td>
                    <td>品川、東銀座、淺草、押上、晴空塔</td>
                    <td>速度快、班次多，可直通都營淺草線方向。</td>
                    <td>要注意列車方向；往新宿、池袋通常會在品川轉 JR。</td>
                  </tr>
                  <tr>
                    <td>東京單軌電車</td>
                    <td>濱松町、東京車站、秋葉原、新宿、池袋</td>
                    <td>接 JR 山手線很直覺，市區移動彈性高。</td>
                    <td>幾乎都要在濱松町轉車，行李多時要留意月台動線。</td>
                  </tr>
                  <tr>
                    <td>利木津巴士</td>
                    <td>新宿、東京車站、迪士尼、部分飯店與大站</td>
                    <td>行李放車底，直達停靠點，不用在車站搬上搬下。</td>
                    <td>受路況影響，尖峰、雨天或回程趕飛機要多抓時間。</td>
                  </tr>
                  <tr>
                    <td>包車 / 自駕</td>
                    <td>深夜抵達、多人同行、飯店位置不靠車站</td>
                    <td>門到門最省心，行李多或親子同行很方便。</td>
                    <td>費用較高；自駕比較適合隔天往郊區，不是單純進市區首選。</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="seo-content" id="area-guide" aria-label="依住宿區域選羽田機場交通">
          <h2 className="seo-h2">照住宿區域選，會比背路線簡單</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">住淺草、押上、晴空塔、東銀座：京急電鐵</h3>
            <p>
              京急電鐵很適合住都營淺草線沿線的人。羽田出發往品川方向，有些列車會直通都營淺草線，所以東銀座、淺草、押上、晴空塔一帶不用硬繞去東京車站。你的飯店如果在這些區域，我會先查京急。
            </p>
            <ActionLinks label="京急電鐵交通連結" links={linkGroups.keikyu} />

            <h3 className="seo-h3">住東京車站、秋葉原、新宿、池袋：東京單軌電車</h3>
            <p>
              東京單軌電車的邏輯很簡單：先到濱松町，再接 JR 山手線或京濱東北線。住東京車站、秋葉原、上野、新宿、池袋這種山手線沿線，單軌電車會很好理解，也很適合第一次來東京的人。
            </p>
            <ActionLinks label="東京單軌電車交通連結" links={linkGroups.monorail} />

            <h3 className="seo-h3">飯店門口、迪士尼、行李很多：利木津巴士</h3>
            <p>
              利木津巴士的重點不是最快，而是省力。羽田機場巴士有連接東京、神奈川、千葉、埼玉等關東地區路線；如果你的飯店或目的地剛好在停靠點附近，可以省掉拖行李轉車的麻煩。
            </p>
            <ActionLinks label="利木津巴士連結" links={linkGroups.limousine} />

            <h3 className="seo-h3">深夜抵達、多人同行：包車或租車</h3>
            <p>
              如果班機抵達時間太晚、帶小孩或長輩、或三四個人一起分攤，包車會比想像中值得比較。自駕則適合隔天要往河口湖、箱根、橫濱等郊區移動的人；只是在東京市區內移動，通常不會是最輕鬆的選項。
            </p>
            <ActionLinks label="包車與租車連結" links={linkGroups.transfer} />
          </div>
        </section>

        <section className="seo-content" aria-label="羽田機場搭車位置">
          <h2 className="seo-h2">到機場後看大指標：Train / Monorail / Bus</h2>
          <div className="seo-prose">
            <div className="narita-terminal-flow">
              <div>
                <span className="narita-summary-label">電車</span>
                <strong>京急電鐵、東京單軌電車</strong>
                <p>入境後跟著 Train、Keikyu Line、Tokyo Monorail 指標走。第 3 航廈是國際線旅客最常用的動線，站體和航廈連在一起。</p>
              </div>
              <div>
                <span className="narita-summary-label">巴士</span>
                <strong>高速巴士、利木津巴士</strong>
                <p>第 1、2 航廈巴士搭乘處在 1 樓；第 3 航廈依官方動線從 2 樓接駁大廳往 1 樓搭乘處。</p>
              </div>
            </div>
            <p>
              真的迷路時不要先找公司名稱，先分成「電車」或「巴士」兩個方向。羽田機場比成田近，通常不用太緊張，但回程去機場仍建議預留排隊、購票和安檢時間。
            </p>
          </div>
        </section>

        <section className="seo-content" aria-label="羽田機場交通票券建議">
          <h2 className="seo-h2">票券怎麼買？我的簡單判斷</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">京急、單軌：交通 IC 卡最簡單</h3>
            <p>
              京急電鐵和東京單軌電車都不需要先研究複雜票券，第一次東京自由行直接準備 Suica、PASMO 或 ICOCA 這類交通 IC 卡就很乾淨。真正要注意的是方向和轉乘站。
            </p>

            <h3 className="seo-h3">利木津巴士：先確認停靠點，再買票</h3>
            <p>
              巴士最重要的是「下車點離飯店近不近」。先用你的飯店地址查最近停靠點，再看班次、預約方式和抵達時間；如果下車後還要拖行李走很久，就改回電車或包車。
            </p>

            <h3 className="seo-h3">包車：多人、深夜、親子長輩再比較</h3>
            <p>
              一兩個人白天抵達，電車通常最划算；但多人同行或紅眼班機，包車能省掉轉乘與拖行李的體力。建議把總價除以人數，再和巴士、電車的便利度一起比。
            </p>
          </div>
        </section>

        <section className="seo-content" aria-label="羽田機場交通最後選法">
          <h2 className="seo-h2">最後用一句話收斂</h2>
          <div className="seo-prose">
            <ul className="narita-checklist">
              <li>住淺草、押上、東銀座：先看京急電鐵。</li>
              <li>住東京車站、秋葉原、新宿、池袋：先看東京單軌電車接 JR。</li>
              <li>飯店有停靠、行李多、親子長輩同行：先看利木津巴士。</li>
              <li>深夜抵達、多人同行、飯店位置尷尬：再比較包車。</li>
              <li>想便宜：京急或單軌用交通 IC 卡通常最直覺。</li>
            </ul>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="抵達東京後，下一步這樣規劃"
          intro="選好進市區的交通後，先依飯店所在區域確認地鐵券與第一天路線；交通和區域先決定，行程會更順。"
          links={[
            { label: '東京交通整理', href: '/tokyo/transport', event: 'haneda_related_transport', primary: true },
            { label: '東京地鐵券攻略', href: '/tokyo/tokyo-subway-ticket?from=haneda-guide', event: 'haneda_related_subway' },
            { label: '東京 9 大區域攻略', href: '/tokyo/tokyo-9-areas-guide?from=haneda-guide', event: 'haneda_related_areas' },
          ]}
        />
        <SeoFaqSection title="羽田機場到東京常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
