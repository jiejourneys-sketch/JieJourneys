import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  tokyoSensojiGuideCanonical,
  tokyoSensojiGuideDescription,
  tokyoSensojiGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

type ActionLink = {
  label: string
  href: string
  event: string
  platform: string
  primary?: boolean
}

type VisitStep = {
  step: string
  place: string
  focus: string
  note: string
}

type ExtraSpot = {
  place: string
  whyGo: string
  timing: string
}

function ActionLinks({ label, links }: { label: string; links: ActionLink[] }) {
  if (links.length === 0) return null

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
    { label: '淺草寺 IG', href: 'https://www.instagram.com/reel/DXRh-ucSyoW/', event: 'tokyosensoji_video_ig', platform: 'IG', primary: true },
    { label: '淺草寺 YouTube', href: 'https://www.youtube.com/shorts/l893qAnt7TI', event: 'tokyosensoji_video_yt', platform: 'YouTube' },
  ],
  maps: [
    { label: '淺草寺 Google Map', href: 'https://maps.app.goo.gl/A1i5xhQt3ceED98n7', event: 'tokyosensoji_map_temple', platform: 'GoogleMap', primary: true },
    { label: '淺草文化觀光中心 Google Map', href: 'https://maps.app.goo.gl/GaQDoWncQHMqQ8bN7', event: 'tokyosensoji_map_tourist_center', platform: 'GoogleMap' },
    { label: '東京景點地圖', href: '/tokyo/map?from=sensoji-guide', event: 'tokyosensoji_tokyo_map', platform: 'map' },
  ],
  planning: [
    { label: '東京 9 大區域攻略', href: '/tokyo/tokyo-9-areas-guide?from=sensoji-guide', event: 'tokyosensoji_9areas_article', platform: 'article', primary: true },
    { label: '晴空塔攻略', href: '/tokyo/skytree-guide?from=sensoji-guide', event: 'tokyosensoji_skytree_article', platform: 'article' },
    { label: '東京住宿區域', href: '/tokyo/hotel?from=sensoji-guide', event: 'tokyosensoji_hotel', platform: 'hotel' },
    { label: '東京交通攻略', href: '/tokyo/transport?from=sensoji-guide', event: 'tokyosensoji_transport', platform: 'transport' },
    { label: '晴空塔票券整理', href: '/tokyo/ticket?tag=%E6%99%B4%E7%A9%BA%E5%A1%94&from=sensoji-guide#ticketListTitle', event: 'tokyosensoji_skytree_ticket', platform: 'ticket' },
  ],
}

const visitSteps: VisitStep[] = [
  { step: '1', place: '雷門', focus: '入口大燈籠、風神雷神、第一張經典照', note: '先拍正面，再走到背面看燈籠底部和龍雕細節。' },
  { step: '2', place: '仲見世通', focus: '一路逛街、買伴手禮、吃小點心', note: '人多時不要停在路中央，想拍街景可以靠邊或回頭拍。' },
  { step: '3', place: '寶藏門', focus: '進入寺院核心前的大門', note: '從仲見世通走到底就是寶藏門，門旁的大草鞋也很有辨識度。' },
  { step: '4', place: '五重塔', focus: '和寶藏門、正殿一起拍出淺草寺感', note: '塔身就在旁邊，適合用直幅照片收進天空和屋簷。' },
  { step: '5', place: '正殿', focus: '參拜、求籤、買御守', note: '想求籤可以在這裡抽；抽到不喜歡的籤，依現場指示繫在指定位置。' },
]

const extraSpots: ExtraSpot[] = [
  { place: '影向堂', whyGo: '想收御朱印或走比較安靜的殿堂，可以把這裡加進去。', timing: '正殿參拜後順路。' },
  { place: '淡島堂', whyGo: '規模不大，但能避開主線人潮，節奏比較靜。', timing: '有 10 到 15 分鐘空檔再排。' },
  { place: '傳法院', whyGo: '外觀與周邊很有傳統庭院感，庭園開放狀態要看當期安排。', timing: '遇到開放再拉高優先度。' },
  { place: '二天門', whyGo: '在主線旁邊，適合補一個古色古香的門景。', timing: '往淺草神社方向走時順拍。' },
  { place: '弁天堂', whyGo: '人潮通常比雷門和仲見世少，適合收一個安靜結尾。', timing: '正殿後有體力再走。' },
]

const faqItems = [
  {
    q: '淺草寺從哪個出口出來最順？',
    a: '搭東京 Metro 銀座線到淺草站，可以走 1 號出口往雷門方向；搭都營淺草線則看 A4 出口。出站後先認雷門和淺草文化觀光中心，動線就很直覺。',
  },
  {
    q: '淺草文化觀光中心 8 樓值得去嗎？',
    a: '很值得，而且免費。它在雷門對面，8 樓展望露台可以看到晴空塔、仲見世通軸線和淺草寺一帶，適合先上去拍整個區域再開始走。',
  },
  {
    q: '淺草寺參觀順序怎麼排？',
    a: '最順就是雷門、仲見世通、寶藏門、五重塔、正殿。時間夠再加影向堂、淡島堂、傳法院、二天門、弁天堂。',
  },
  {
    q: '淺草寺要排多久？',
    a: '只走主線大約 1 小時；加上觀光中心 8 樓、拍照、吃小吃和買御守，抓 2 到 3 小時比較舒服。要再接晴空塔或隅田川，就排半天。',
  },
  {
    q: '淺草寺適合接晴空塔嗎？',
    a: '適合。淺草寺和晴空塔距離近，可以上午或中午玩淺草，下午到晚上接晴空塔和 Solamachi 商場，最後看夜景。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: tokyoSensojiGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: tokyoSensojiGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: tokyoSensojiGuideCanonical,
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

type TokyoSensojiGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'tokyo-video') return '/tokyo/video'
  if (value === 'map' || value === 'tokyo-map') return '/tokyo/map'
  if (value === 'tokyo-9-areas-guide' || value === '9areas') return '/tokyo/tokyo-9-areas-guide'
  if (value === 'hotel' || value === 'tokyo-hotel') return '/tokyo/hotel'
  if (value === 'transport' || value === 'tokyo-transport') return '/tokyo/transport'
  if (value === 'ticket' || value === 'tokyo-ticket') return '/tokyo/ticket'
  return '/tokyo'
}

export default async function TokyoSensojiGuidePage({ searchParams }: TokyoSensojiGuidePageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="tokyosensoji" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="東京景點攻略"
          h1="淺草寺攻略｜先上免費觀景台，再從雷門一路走到正殿"
          intro="淺草寺不是只拍雷門就結束。最順的玩法是先到淺草文化觀光中心 8 樓看整個淺草和晴空塔，再走雷門、仲見世通、寶藏門、五重塔、正殿，把經典畫面一次收好。"
          eventPrefix="tokyosensoji"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'tokyosensoji_hero_quick', platform: 'article' },
            { label: '參觀順序', href: '#route-order', dataEvent: 'tokyosensoji_hero_route', platform: 'article' },
            { label: '延伸景點', href: '#extra-spots', dataEvent: 'tokyosensoji_hero_extra', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="淺草寺攻略快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">交通</span>
              <strong>淺草站 1 號或 A4 出口</strong>
              <p>出站後往雷門方向走，很快就到淺草寺核心區。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">先拍全景</span>
              <strong>文化觀光中心 8 樓免費觀景台</strong>
              <p>可以看到晴空塔、仲見世通和整個淺草寺方向。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">主線</span>
              <strong>雷門 → 仲見世 → 寶藏門 → 五重塔 → 正殿</strong>
              <p>第一次去照這條走，經典景點都不會漏。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">加碼</span>
              <strong>影向堂、淡島堂、傳法院、二天門、弁天堂</strong>
              <p>時間夠再慢慢繞，能看到比較安靜的淺草寺。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="淺草寺短影音">
          <h2 className="seo-h2">先看短影音：淺草寺現場動線</h2>
          <div className="seo-prose">
            <p>
              想先用畫面抓方向，可以看淺草寺短影音。影片看完後，再照這篇的順序走，會比一出站就衝進人潮裡更好拍。
            </p>
            <SeoVideoLinkMenu label="淺草寺" links={linkGroups.videos} />
          </div>
        </section>

        <section className="seo-content" id="arrival" aria-label="淺草寺交通與免費觀景台">
          <h2 className="seo-h2">抵達後先別急著拍雷門：先上 8 樓看全景</h2>
          <div className="seo-prose">
            <p>
              搭地鐵到淺草站後，走 1 號出口或 A4 出口往雷門方向，出來就是淺草寺一帶。很多人一看到雷門就直接開拍，但我會建議先到對面的淺草文化觀光中心。
            </p>
            <p>
              淺草文化觀光中心 8 樓有免費展望露台，可以看到晴空塔、雷門前街景、仲見世通和淺草寺方向。先在高處看一次，等一下走地面動線時會更有方向感，拍照也比較知道要抓哪個角度。
            </p>
            <ActionLinks label="淺草寺地圖" links={linkGroups.maps} />
          </div>
        </section>

        <section className="seo-content" id="route-order" aria-label="淺草寺參觀順序">
          <h2 className="seo-h2">淺草寺參觀順序：照這條走最順</h2>
          <div className="seo-prose">
            <p>
              淺草寺第一次去不用把路線想複雜。先拍雷門，再沿著仲見世通一路走到寶藏門，旁邊補五重塔，最後進正殿參拜、求籤、買御守。
            </p>

            <figure className="seo-figure seo-portrait-figure">
              <Image
                src="/assets/tokyo-sensoji-guide-map.png"
                alt="淺草寺導覽圖，標出雷門、仲見世通、寶藏門、五重塔、正殿、影向堂、淡島堂、傳法院、二天門與弁天堂"
                width={774}
                height={1000}
                sizes="(max-width: 820px) 100vw, 760px"
              />
              <figcaption>淺草寺導覽圖：先認雷門、仲見世通、寶藏門、五重塔和正殿，再決定要不要加走周邊殿堂。</figcaption>
            </figure>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>順序</th>
                    <th>地點</th>
                    <th>重點</th>
                    <th>小提醒</th>
                  </tr>
                </thead>
                <tbody>
                  {visitSteps.map((item) => (
                    <tr key={item.place}>
                      <td>{item.step}</td>
                      <td>{item.place}</td>
                      <td>{item.focus}</td>
                      <td>{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="seo-h3">雷門：入口大燈籠，必拍</h3>
            <p>
              雷門是淺草寺最經典入口，正面大燈籠一定要拍。人潮多的時候不要只站正中央等空景，可以先拍斜角、背面、燈籠底部細節，再回來補正面照。
            </p>

            <h3 className="seo-h3">仲見世通：一路逛街吃美食</h3>
            <p>
              穿過雷門後就是仲見世通，兩側有和菓子、仙貝、伴手禮、雜貨和小吃。這段很熱鬧，也最容易被人潮卡住；想吃東西可以靠邊停，不要邊走邊擋在路中間。
            </p>

            <h3 className="seo-h3">寶藏門：經典大門</h3>
            <p>
              仲見世通走到底就是寶藏門，視覺上很有「正式進入寺院」的感覺。大門、屋簷和旁邊的大草鞋都可以一起拍，這裡也很適合回頭拍仲見世通的人潮。
            </p>

            <h3 className="seo-h3">五重塔：就在旁邊可以一起拍</h3>
            <p>
              五重塔就在主線旁邊，不需要另外繞很遠。建議用直幅構圖，把塔身、屋簷和天空一起收進畫面；如果人太多，可以稍微退遠一點拍，畫面會更乾淨。
            </p>

            <h3 className="seo-h3">正殿：參拜、求籤、買御守</h3>
            <p>
              最後進到正殿參拜。想求籤、買御守或感受寺院氛圍，都可以放在這裡完成。淺草寺人潮很穩，建議早上來會比較舒服；傍晚來則比較有燈光和街景氣氛。
            </p>
          </div>
        </section>

        <section className="seo-content" id="extra-spots" aria-label="淺草寺加碼景點">
          <h2 className="seo-h2">有時間再去：影向堂、淡島堂、傳法院、二天門、弁天堂</h2>
          <div className="seo-prose">
            <p>
              主線走完後，如果還有時間，不要急著離開。淺草寺旁邊其實還有幾個比較安靜的點，適合慢慢走、避開雷門和仲見世通的人潮。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>加碼點</th>
                    <th>為什麼去</th>
                    <th>怎麼排</th>
                  </tr>
                </thead>
                <tbody>
                  {extraSpots.map((spot) => (
                    <tr key={spot.place}>
                      <td>{spot.place}</td>
                      <td>{spot.whyGo}</td>
                      <td>{spot.timing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="seo-content" id="sample-routes" aria-label="淺草寺行程排法">
          <h2 className="seo-h2">淺草寺行程怎麼排</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">1 小時快閃版</h3>
            <ol>
              <li>淺草站出站，先到文化觀光中心 8 樓看全景。</li>
              <li>回到地面拍雷門。</li>
              <li>走仲見世通、寶藏門、五重塔。</li>
              <li>正殿參拜後離開。</li>
            </ol>

            <h3 className="seo-h3">2 到 3 小時舒服版</h3>
            <ol>
              <li>先上免費觀景台拍晴空塔和淺草全景。</li>
              <li>雷門、仲見世通慢慢拍，沿路買點心或伴手禮。</li>
              <li>寶藏門、五重塔、正殿完整走一輪。</li>
              <li>加影向堂、淡島堂、二天門或弁天堂。</li>
            </ol>

            <h3 className="seo-h3">半日版：淺草寺接晴空塔</h3>
            <p>
              想排半天，最順就是淺草寺加晴空塔。上午或中午走淺草寺，下午散步到隅田川或搭車到押上，接 Tokyo Solamachi 和晴空塔展望台，晚上看夜景收尾。
            </p>
            <ActionLinks label="淺草寺延伸規劃" links={linkGroups.planning} />
          </div>
        </section>

        <SeoRelatedLinksSection
          title="淺草行程接著這樣排"
          intro="淺草適合安排在東京東側的一日；先用東京區域攻略和地圖看周邊位置，再決定當天是否需要地鐵券。"
          links={[
            { label: '東京 9 大區域攻略', href: '/tokyo/tokyo-9-areas-guide?from=sensoji-guide', event: 'sensoji_related_areas', primary: true },
            { label: '東京旅遊地圖', href: '/tokyo/map?from=sensoji-guide', event: 'sensoji_related_map' },
            { label: '東京地鐵券攻略', href: '/tokyo/tokyo-subway-ticket?from=sensoji-guide', event: 'sensoji_related_subway' },
          ]}
        />
        <SeoFaqSection title="淺草寺攻略常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
