import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  busanGamcheonGuideCanonical,
  busanGamcheonGuideDescription,
  busanGamcheonGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

type ActionLink = {
  label: string
  href: string
  event: string
  platform: string
  primary?: boolean
}

type GamcheonStep = {
  step: string
  time: string
  focus: string
  note: string
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
    { label: 'IG Reels', href: 'https://www.instagram.com/reel/DL408o_ze1X/', event: 'busangamcheon_video_ig', platform: 'IG', primary: true },
    { label: 'YouTube', href: 'https://www.youtube.com/shorts/RZREPyNT-Fo', event: 'busangamcheon_video_yt', platform: 'YouTube' },
  ],
  planning: [
    { label: '南浦洞攻略', href: '/busan/nampo-dong-guide?from=gamcheon-culture-village-guide', event: 'busangamcheon_nampo_article', platform: 'article', primary: true },
    { label: '釜山最速攻略', href: '/busan/busan-fast-guide?from=gamcheon-culture-village-guide', event: 'busangamcheon_fastguide', platform: 'article' },
    { label: '釜山景點地圖', href: '/busan/map?from=gamcheon-culture-village-guide', event: 'busangamcheon_map', platform: 'map' },
    { label: '釜山住宿區域', href: '/busan/hotel?from=gamcheon-culture-village-guide', event: 'busangamcheon_hotel', platform: 'hotel' },
  ],
}

const routeSteps: GamcheonStep[] = [
  { step: '直接搭計程車上山', time: '出發後先做', focus: '把體力留給拍照和逛巷子', note: '從南浦洞、札嘎其或土城站一帶出發都可，目的地抓甘川洞文化村入口或遊客中心。' },
  { step: '主路走到交叉口', time: '抵達後 10 到 20 分鐘', focus: '先看現場指標，決定左右順序', note: '左轉找經典小王子，右轉找新版小王子和小王子之家方向。' },
  { step: '慢慢拍彩色屋和小巷', time: '至少 2 小時', focus: '壁畫、裝置藝術、階梯、海景和屋頂線', note: '拍照控不要只排 30 分鐘，這裡真正好拍的是整個街區。' },
  { step: '回南浦洞吃午餐', time: '中午前後', focus: '接富平罐頭市場或國際市場', note: '回程再搭計程車或村巴下山，接南浦洞最順。' },
]

const faqItems = [
  {
    q: '甘川洞文化村一定要搭計程車上山嗎？',
    a: '不一定，但第一次去、想省體力拍照，我會建議直接搭計程車上山。甘川洞是山坡地，從下面一路爬上去很耗體力，尤其夏天或帶長輩小孩時更明顯。',
  },
  {
    q: '小王子和新版小王子怎麼找？',
    a: '先從甘川洞文化村入口沿主路走，看到分岔或交叉口後，左轉找經典小王子，右轉找新版小王子和小王子之家方向。現場指標可能會調整，最後仍以現場標示為準。',
  },
  {
    q: '甘川洞文化村要排多久？',
    a: '只拍經典小王子，大約 1 小時可以很趕地走完；拍照控至少留 2 小時，想喝咖啡、逛小店、拍巷弄和新版小王子，抓 2.5 到 3 小時會比較舒服。',
  },
  {
    q: '甘川洞文化村適合早上還是下午？',
    a: '建議早上去。人比較少、光線比較乾淨，山坡走起來也比較不熱。下午去也可以，但熱門拍照點比較容易排隊。',
  },
  {
    q: '甘川洞文化村可以和南浦洞排同一天嗎？',
    a: '很適合。早上先搭計程車上甘川洞，中午回南浦洞吃富平罐頭市場或國際市場，下午逛樂天超市，晚上接札嘎其市場和釜山塔。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: busanGamcheonGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: busanGamcheonGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: busanGamcheonGuideCanonical,
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

type BusanGamcheonGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'busan-video') return '/busan/video'
  if (value === 'map' || value === 'busan-map') return '/busan/map'
  if (value === 'hotel' || value === 'busan-hotel') return '/busan/hotel'
  if (value === 'nampo' || value === 'nampo-dong-guide') return '/busan/nampo-dong-guide'
  if (value === 'fast-guide' || value === 'busan-fast-guide') return '/busan/busan-fast-guide'
  return '/busan'
}

export default async function BusanGamcheonGuidePage({ searchParams }: BusanGamcheonGuidePageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="busangamcheon" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="甘川洞文化村攻略"
          h1="甘川洞文化村攻略｜3 個重點：計程車上山、小王子動線、拍照時間"
          intro="甘川洞文化村不是只去看彩色屋，它是一整片山坡聚落、壁畫小巷、裝置藝術和小王子拍照點。第一次去最重要的是不要把體力花在上山，直接搭計程車到入口，再照小王子動線慢慢拍，會舒服很多。"
          eventPrefix="busangamcheon"
          showVisual={false}
          ctaLinks={[
            { label: '3 個重點', href: '#three-tips', dataEvent: 'busangamcheon_hero_tips', platform: 'article' },
            { label: '拍照動線', href: '#route-order', dataEvent: 'busangamcheon_hero_route', platform: 'article' },
            { label: '常見問題', href: '#seo-faq', dataEvent: 'busangamcheon_hero_faq', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="甘川洞文化村快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">重點 1</span>
              <strong>直接搭計程車上山</strong>
              <p>甘川洞是山坡地，先坐車到入口，把體力留給拍照、逛巷子和找小王子。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">重點 2</span>
              <strong>交叉口左轉、右轉都要記</strong>
              <p>左轉找經典小王子，右轉找新版小王子和小王子之家方向；現場指標也要一起看。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">重點 3</span>
              <strong>拍照控至少留 2 小時</strong>
              <p>這裡不是打一個卡就走，彩繪、裝置藝術、小巷風景和屋頂線都很好拍。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">建議時間</span>
              <strong>早上來最舒服</strong>
              <p>人少、光線漂亮，山坡走起來也比較不熱，拍經典小王子比較不容易卡隊伍。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="甘川洞文化村短影音">
          <h2 className="seo-h2">先看短影音：甘川洞小王子和山城畫面</h2>
          <div className="seo-prose">
            <p>
              如果你只看地圖，很難感覺甘川洞文化村其實是山坡上的彩色聚落。先看短影音抓一下路線、坡度和拍照點，再回來照這篇的三個重點走，現場會比較不慌。
            </p>
            <SeoVideoLinkMenu label="甘川洞文化村" links={linkGroups.videos} />
          </div>
        </section>

        <section className="seo-content" id="three-tips" aria-label="甘川洞文化村三個重點">
          <h2 className="seo-h2">甘川洞文化村攻略：3 個重點先記起來</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">重點 1｜直接搭計程車上山最省力</h3>
            <p>
              甘川洞文化村最容易低估的不是景點，而是坡度。它本來就是沿山坡發展的聚落，巷子會上上下下，拍照點也不是全都在同一條平路上。第一次去，我會建議從南浦洞、札嘎其或土城站一帶直接搭計程車到甘川洞文化村入口或遊客中心。
            </p>
            <p>
              這樣做的好處很直接：不用一開始就爬到累，把體力留給走巷子、拍彩色屋、排小王子、逛小店。回程再搭計程車或村巴下山，接南浦洞吃午餐會最順。
            </p>

            <h3 className="seo-h3">重點 2｜看到交叉口後記得左轉＆右轉</h3>
            <p>
              甘川洞最常見的卡點，是只跟著人潮走，結果只拍到一個小王子就離開。我的走法是：進村後沿主路走，看到分岔或交叉口時，左轉找經典小王子；右轉找新版小王子和小王子之家方向。兩邊都值得拍，但時間不夠時先拍經典小王子。
            </p>
            <p>
              新版小王子更像一個可以多停留的拍照與展覽點，經典小王子則是最代表甘川洞的畫面。現場巷弄標示、排隊動線有可能調整，到了分岔口先看指標，再決定先左還是先右。
            </p>

            <h3 className="seo-h3">重點 3｜拍照控至少預留 2 小時</h3>
            <p>
              甘川洞不是只看彩色屋。整區到處都有彩繪、裝置藝術、小巷風景、階梯、屋頂線和海景角度，真的很好拍。如果你只留 30 到 60 分鐘，很可能只拍到小王子，還沒開始享受巷弄就得離開。
            </p>
            <p>
              拍照控至少留 2 小時；想喝咖啡、逛小店、拍新版小王子，抓 2.5 到 3 小時更剛好。這裡同時也是居民生活區，拍照時不要闖進住宅、不要大聲喧嘩，也不要使用空拍機。
            </p>
          </div>
        </section>

        <section className="seo-content" id="route-order" aria-label="甘川洞文化村建議動線">
          <h2 className="seo-h2">甘川洞文化村建議動線：早上上山，中午回南浦洞</h2>
          <div className="seo-prose">
            <p>
              下面這個順序適合第一次去，也最符合你要的「省力＋好拍」。重點是不要下午才上山，也不要從山下硬爬到入口。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>順序</th>
                    <th>時間</th>
                    <th>重點</th>
                    <th>提醒</th>
                  </tr>
                </thead>
                <tbody>
                  {routeSteps.map((step) => (
                    <tr key={step.step}>
                      <td>{step.step}</td>
                      <td>{step.time}</td>
                      <td>{step.focus}</td>
                      <td>{step.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="seo-h3">我的半日排法</h3>
            <ol>
              <li>早上從南浦洞或札嘎其搭計程車上甘川洞文化村。</li>
              <li>先到入口或遊客中心，沿主路走到分岔處。</li>
              <li>左轉拍經典小王子，再回頭或接右轉找新版小王子。</li>
              <li>保留時間慢慢拍壁畫、階梯、小巷和屋頂線。</li>
              <li>中午回南浦洞，接富平罐頭市場或國際市場午餐。</li>
            </ol>

            <h3 className="seo-h3">早上來的理由</h3>
            <p>
              早上光線比較乾淨，人也比較少，拍小王子和巷弄不用一直等。天氣熱的時候，早上走山坡也明顯舒服很多。下午才來不是不行，但熱門拍照點會更容易排隊，體力也比較容易被坡度消耗掉。
            </p>
          </div>
        </section>

        <section className="seo-content" id="next-steps" aria-label="甘川洞文化村延伸規劃">
          <h2 className="seo-h2">甘川洞之後怎麼接南浦洞</h2>
          <div className="seo-prose">
            <p>
              甘川洞文化村最適合和南浦洞排同一天。早上上山拍照，中午回南浦洞吃富平罐頭市場或國際市場，下午逛樂天超市，晚上去札嘎其市場吃海鮮，再用釜山塔夜景收尾。這條線不需要跨到海雲台，整天會順很多。
            </p>
            <ActionLinks label="甘川洞延伸攻略" links={linkGroups.planning} />
          </div>
        </section>

        <SeoFaqSection title="甘川洞文化村攻略常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
