import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  mtFujiPassCanonical,
  mtFujiPassDescription,
  mtFujiPassTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const PASS_MAP_URL = '/fuji/pass-map'

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
    { label: 'IG｜周遊券', href: 'https://www.instagram.com/reel/DY9rYLxy_o7/', event: 'fujipass_video_ig', platform: 'IG', primary: true },
    { label: 'YouTube', href: 'https://www.youtube.com/shorts/4gnbR3VbNSs', event: 'fujipass_video_yt', platform: 'YouTube' },
    { label: '小紅書', href: 'https://xhslink.com/o/AimsPvqTE4I', event: 'fujipass_video_xhs', platform: '小紅書' },
  ],
  pass: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/20106-mt-fuji-pass-lake-kawaguchi-attraction-ticket-japan?cid=22312', event: 'fujipass_article_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/132532-mt-fuji-pass/?aid=93798', event: 'fujipass_article_klook', platform: 'KLOOK' },
  ],
  tools: [
    { label: '優惠地圖', href: PASS_MAP_URL, event: 'fujipass_article_map', platform: 'map', primary: true },
    { label: '排序工具', href: '/tools/planner?region=fuji&source=pass', event: 'fujipass_article_planner', platform: 'planner' },
    { label: '票券總整理', href: '/fuji/ticket?from=article', event: 'fujipass_article_ticket', platform: 'ticket' },
  ],
}

const faqItems = [
  {
    q: '富士山周遊券適合買 1 日券、2 日券還是 3 日券？',
    a: '只玩河口湖站周邊一天，先精算單買票券；會住河口湖或富士吉田，並且會搭多段巴士、富士急行線、纜車或遊覽船，2 日券和 3 日券比較容易發揮價值。',
  },
  {
    q: '從東京出發可以直接用富士山周遊券嗎？',
    a: '不行。從東京出發要先搭 JR 到大月站，富士山周遊券主要從大月站之後開始派上用場，可用在富士急行線大月到河口湖，以及指定巴士路線。',
  },
  {
    q: '富士山周遊券包含富士回遊嗎？',
    a: '富士山周遊券可用在富士急行線指定範圍，但特急、觀光列車或指定席相關費用可能需要另外支付。若你從新宿搭富士回遊，請另外確認 JR 與特急券費用。',
  },
  {
    q: '只去大石公園需要買富士山周遊券嗎？',
    a: '不一定。大石公園可搭河口湖紅線前往，但如果你只有單點來回，單買巴士或交通券可能更單純；若同一天還會搭纜車、遊覽船或多段巴士，再把周遊券拿來比較。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: mtFujiPassTitle.replace(' | JieJourneys(旅杰)', ''),
  description: mtFujiPassDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: mtFujiPassCanonical,
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

type MtFujiPassPageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video') return '/fuji/video'
  if (value === 'ticket') return '/fuji/ticket'
  if (value === 'pass-map') return '/fuji/pass-map'
  return '/fuji'
}

export default async function MtFujiPassPage({ searchParams }: MtFujiPassPageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="fujipass" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="富士山周遊券攻略"
          h1="富士山周遊券攻略｜1日券、2日券、3日券怎麼選？"
          intro="富士山周遊券不是只看票價就能決定，要看你會不會真的用到免費設施、優惠卡片和交通範圍。這篇先抓 2 個重點，再用地圖確認哪些點順路。"
          eventPrefix="fujipass"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'fujipass_hero_quick', platform: 'article' },
            { label: '購票連結', href: '#ticket-links', dataEvent: 'fujipass_hero_links', platform: 'article' },
            { label: '優惠地圖', href: PASS_MAP_URL, dataEvent: 'fujipass_hero_map', platform: 'map' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="富士山周遊券快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">票種</span>
              <strong>1 / 2 / 3 日券</strong>
              <p>用幾天買幾天，適合住河口湖或富士吉田、會慢慢玩的人。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">好處 1</span>
              <strong>免費設施＋優惠</strong>
              <p>纜車、遊覽船、樂園、溫泉、餐廳與商店優惠要看地點是否順路。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">好處 2</span>
              <strong>指定交通免費</strong>
              <p>河口湖紅線、西湖綠線、本棲湖藍線和富士急行線是最常用重點。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">東京出發</span>
              <strong>先到大月</strong>
              <p>新宿到大月的 JR 不在周遊券範圍內，大月之後才開始好用。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="ticket-links" aria-label="富士山周遊券購票與影片">
          <h2 className="seo-h2">先看影片，再買票</h2>
          <div className="seo-prose">
            <p>
              如果你想先用短影音抓重點，可以先看我的富士山周遊券影片。看完再回來看地圖和購票連結，會比較知道自己要買 1 日、2 日還是 3 日。
            </p>
            <ActionLinks label="富士山周遊券短影片" links={linkGroups.videos} />
            <ActionLinks label="富士山周遊券購票連結" links={linkGroups.pass} />
          </div>
        </section>

        <section className="seo-content" aria-label="富士山周遊券兩個重點">
          <h2 className="seo-h2">2 個重點一定要知道</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">第一個好處：免費設施＋專屬優惠</h3>
            <p>
              富士山周遊券的第一個價值，是景點、溫泉、美食餐廳和商店優惠。有些設施可以免費進入或搭乘，有些則是折扣優惠。重點不是看到「優惠很多」就買，而是要看你真的會不會經過。
            </p>
            <ul>
              <li>常見免費或高價值項目：河口湖纜車、河口湖遊覽船、山中湖遊覽船、富士急樂園指定體驗。</li>
              <li>常見折扣項目：溫泉、餐飲、商店和部分觀光設施。</li>
              <li>我的做法：先把想去的點標在地圖上，再看哪些免費設施剛好在同一條路線。</li>
            </ul>
            <ActionLinks label="富士山周遊券地圖工具" links={linkGroups.tools} />

            <h3 className="seo-h3">第二個好處：交通免費</h3>
            <p>
              第二個價值是交通。富士山周遊券可用在指定範圍內的電車和巴士，自由行要慢慢玩河口湖、西湖、本棲湖、山中湖時，這個才是最容易回本的地方。
            </p>
            <ul>
              <li>河口湖紅線：河口湖站、大石公園、河口湖周邊景點最常用。</li>
              <li>西湖綠線：適合排西湖療癒之里、風穴、冰穴等西湖周邊。</li>
              <li>本棲湖藍線：適合往精進湖、本棲湖區域延伸。</li>
              <li>富士急行線：可從大月站搭到河口湖站，串富士山站、富士急樂園等站點。</li>
            </ul>

            <h3 className="seo-h3">從東京出發要注意：新宿到大月要另外處理</h3>
            <p>
              如果你從東京出發，流程通常是先從新宿搭 JR 到大月站，再使用周遊券搭富士急行線往富士山、富士急樂園、河口湖方向。也就是說，周遊券不是從新宿就開始包到底，前段 JR 和特急相關費用要另外算。
            </p>
            <p>
              另外，特急、觀光列車或指定席可能有額外費用。想省麻煩的人可以直接搭高速巴士到河口湖，再把周遊券用在當地巴士和景點；想鐵道體驗的人，就先把新宿到大月、富士急行線、周遊券三段分開算。
            </p>
          </div>
        </section>

        <section className="seo-content" aria-label="富士山周遊券怎麼選">
          <h2 className="seo-h2">我的結論：這樣選最不容易買錯</h2>
          <div className="seo-prose">
            <ul className="narita-checklist">
              <li>只玩河口湖站、大石公園半天：先不要急著買周遊券。</li>
              <li>會搭纜車＋遊覽船＋多段紅線巴士：開始值得比較 1 日券。</li>
              <li>住河口湖或富士吉田一晚以上：2 日券通常更有發揮空間。</li>
              <li>想跑西湖、本棲湖、山中湖或多個溫泉優惠：再看 3 日券。</li>
              <li>從東京當天來回、又想少研究交通：一日遊或包車可能比周遊券省心。</li>
            </ul>
          </div>
        </section>

        <SeoFaqSection title="富士山周遊券常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
