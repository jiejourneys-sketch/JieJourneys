import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  busanPreparationGuideCanonical,
  busanPreparationGuideDescription,
  busanPreparationGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

const videoLinks = [
  { label: 'IG Reels', href: 'https://www.instagram.com/reel/DOixfbBEaCL/', event: 'busanpreparation_video_prep_ig', platform: 'IG', primary: true },
  { label: 'YouTube', href: 'https://www.youtube.com/shorts/6K3yI0WrO9k', event: 'busanpreparation_video_prep_yt', platform: 'YouTube' },
]

const faqItems = [
  {
    q: '釜山第一次自由行建議幾天？',
    a: '5 天 4 夜很剛好：可以把南浦洞／甘川洞、海雲台、廣安里或機張分開排，再保留一天給天氣、咖啡廳、購物或釜山通行證景點。若只去 3 天 2 夜，建議先選南浦洞和海雲台兩大區，不要硬塞全釜山。',
  },
  {
    q: '入境韓國前要先確認什麼？',
    a: '先確認護照效期與自己的國籍是否需要簽證或 K-ETA，再確認是否需提交電子入境卡。這三件事不是同一件事，規則也可能調整；文章內分別連到 K-ETA 與電子入境卡的完整教學。',
  },
  {
    q: '釜山通行證 48 小時要什麼時候啟用？',
    a: '第一個免費景點換票或入場時才會自動啟用。先把最想去的付費景點集中在 48 小時內，再在第一站開始用；不要在還沒確定路線時就隨意啟用。',
  },
  {
    q: '在釜山叫車要用 Uber 還是 Kakao T？',
    a: '已經有 Uber 帳號與信用卡的人可直接用 Uber Taxi；想用韓國常見的叫車系統，Kakao T 可以選擇直接付給司機（現金或卡），但需先有 KakaoTalk 帳號。若想避開註冊 KakaoTalk，外國旅客版 k.ride 可綁海外信用卡、提供繁中介面與翻譯功能。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: busanPreparationGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: busanPreparationGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: busanPreparationGuideCanonical,
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

type BusanPreparationGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'busan-video') return '/busan/video'
  if (value === 'ticket' || value === 'busan-ticket') return '/busan/ticket'
  if (value === 'pass-map') return '/busan/pass-map'
  if (value === 'visit-busan-pass') return '/busan/visit-busan-pass'
  return '/busan'
}

export default async function BusanPreparationGuidePage({ searchParams }: BusanPreparationGuidePageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="busanpreparation" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="釜山行前準備"
          h1="釜山自由行｜行前準備 5 大重點"
          intro="第一次釜山自由行，先把行程天數、入境資料、釜山通行證、叫車 App 和地圖準備好，再開始排景點。這篇只處理出發前最重要的 5 件事；K-ETA 與電子入境卡各有獨立教學。"
          eventPrefix="busanpreparation"
          showVisual={false}
          ctaLinks={[
            { label: '5 個重點', href: '#five-prep', dataEvent: 'busanpreparation_hero_five', platform: 'article' },
            { label: 'K-ETA 教學', href: '/busan/k-eta-guide?from=busan-preparation-guide', dataEvent: 'busanpreparation_hero_keta', platform: 'article' },
            { label: '電子入境卡', href: '/busan/korea-e-arrival-card-guide?from=busan-preparation-guide', dataEvent: 'busanpreparation_hero_earrival', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="釜山行前準備快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">天數</span>
              <strong>第一次抓 5 天 4 夜最舒服</strong>
              <p>南浦洞、海雲台、廣安里或機張可以分天玩，遇到下雨或想慢逛也還有彈性。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">入境</span>
              <strong>護照、K-ETA、電子入境卡分開看</strong>
              <p>先確認自己的國籍與旅行目的，再分別處理；不要把 K-ETA 暫免誤解成所有申報都免除。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">票券</span>
              <strong>先排景點，再啟用 48 小時通行證</strong>
              <p>第一個免費景點才開始倒數；不要在還沒確定路線時就隨意啟用。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">移動</span>
              <strong>地圖裝 Naver，叫車準備兩個 App</strong>
              <p>走路和大眾運輸用 Naver Map；Uber、k.ride 或 Kakao T 則看付款與語言習慣選擇。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="釜山行前準備短影音">
          <h2 className="seo-h2">先看短影音：釜山自由行 5 個行前準備</h2>
          <div className="seo-prose">
            <p>
              想先用一分鐘抓方向，可以先看這支 5 個行前準備。看完再依自己的班機、住宿和想去的景點，回來把下面五項一個一個完成。
            </p>
            <SeoVideoLinkMenu label="釜山自由行｜5 個行前準備" links={videoLinks} />
          </div>
        </section>

        <section className="seo-content" id="five-prep" aria-label="釜山自由行五個行前準備">
          <h2 className="seo-h2">釜山自由行｜行前準備 5 大重點</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">1. 行程先抓 5 天 4 夜：有重點，也留得住彈性</h3>
            <p>
              釜山的景點很分散：南浦洞／甘川洞在西南側，海雲台、青沙浦和機張在東側，廣安里與西面又是不同節奏。5 天 4 夜可以把這些區域拆開，不需要每天跨半個城市；也能保留一段時間給下雨、咖啡廳、購物或臨時想加的景點。
            </p>
            <p>
              我的基本排法是先用 3 天放南浦洞、海雲台和廣安里／機張，再用 1 天安排釜山通行證景點或海邊行程，最後一天留給回程前的西面、南浦洞或金海機場。想先建立每個區域的感覺，可看
              <a href="/busan/busan-fast-guide?from=busan-preparation-guide" data-event="busanpreparation_fastguide" data-platform="article" data-section="article">
                <strong>釜山最速攻略</strong>
              </a>
              。
            </p>

            <h3 className="seo-h3">2. 入境資料提早確認：護照、K-ETA、電子入境卡各自核對</h3>
            <p>
              出發前一週，先確認護照資料與自己的國籍／旅行目的，再查 K-ETA 或簽證資格；最後在正確時間填電子入境卡。這三件事不能用同一個答案帶過：有些旅客要申請 K-ETA，有些是暫免 K-ETA 但仍須提交入境卡，也有些人要另外辦簽證。
            </p>
            <p>
              這裡分成兩篇獨立教學，填寫時直接照自己的情況看：
              <a href="/busan/k-eta-guide?from=busan-preparation-guide" data-event="busanpreparation_keta_article" data-platform="article" data-section="article">
                <strong>K-ETA 到底要不要申請？</strong>
              </a>
              與
              <a href="/busan/korea-e-arrival-card-guide?from=busan-preparation-guide" data-event="busanpreparation_earrival_article" data-platform="article" data-section="article">
                <strong>韓國電子入境卡教學</strong>
              </a>
              。
            </p>

            <h3 className="seo-h3">3. 釜山通行證 48 小時：先排好路線，再從第一個景點開始用</h3>
            <p>
              48 小時 VISIT BUSAN PASS 適合會集中跑多個付費景點的人，不是每個人都必買。官方規則是：第一個免費景點換票或入場時，通行證才會自動啟用並開始 48 小時倒數；每個景點通常限用一次。想買可以先買，但不要在還沒確定路線前就隨意開始使用。
            </p>
            <p>
              現行 48H 行動版售價為 85,000 韓元，行動版不能當交通卡、需要在購買平台的 App／我的頁面出示 QR code，截圖與列印通常不接受；實體卡則需先到指定處換卡。景點名單與售價會變動，出發前再核對購買頁面的顯示。
            </p>
            <p>
              已經確定會買的人，可以接著看
              <a href="/busan/visit-busan-pass?from=busan-preparation-guide" data-event="busanpreparation_pass_article" data-platform="article" data-section="article">
                <strong>釜山通行證完整攻略</strong>
              </a>
              和
              <a href="/busan/pass-map" data-event="busanpreparation_passmap" data-platform="map" data-section="article">
                <strong>釜山通行證地圖</strong>
              </a>
              ，先看景點集中在哪一區再決定。
            </p>

            <h3 className="seo-h3">4. 叫車不要只準備一種：Uber、k.ride、Kakao T 各有適合情況</h3>
            <p>
              已經有 Uber 帳號和信用卡的人，在釜山可以直接叫 Uber Taxi；想要韓國本地常用的叫車系統，Kakao T 可以在付款時選擇直接付給司機，現金、信用卡或交通卡都可用，但要先有 KakaoTalk 帳號。對第一次去韓國、想少一個註冊步驟的人，<strong>k.ride</strong>是 Kakao Mobility 的外國旅客版，提供繁中介面、目的地／聊天翻譯，也能綁海外信用卡自動付款。
            </p>
            <p>
              所以最簡單的準備不是「刷卡只能 Uber、付現只能 Kakao T」：刷卡可用 Uber 或 k.ride；想付現或直接刷司機車上的讀卡機，可用 Kakao T 的直接付款選項。出發前先安裝至少兩個，遇到尖峰時段或某個 App 沒車時比較不慌。
            </p>

            <h3 className="seo-h3">5. 一定要下載 Naver Map：在韓國移動更實用</h3>
            <p>
              Google Maps 可以拿來看店家評價或收藏點位，但在韓國的路線與導航體驗常不如當地地圖；釜山又有許多坡路、轉乘和不同出口，建議把 Naver Map 當成主要移動工具。它提供多語介面，適合找公車、地鐵出口、步行動線和景點名稱。
            </p>
            <p>
              出發前先把飯店、每天第一站和預約景點存好，搭車時直接複製韓文店名或地址比只傳中文更穩。
            </p>
          </div>
        </section>

        <section className="seo-content" id="before-leaving" aria-label="釜山出發前最後檢查">
          <h2 className="seo-h2">出發前最後 10 分鐘檢查清單</h2>
          <div className="seo-prose">
            <ol>
              <li>確認護照效期、自己的國籍是否需要簽證或 K-ETA，以及電子入境卡是否已提交。</li>
              <li>把飯店英文名稱、英文地址、電話與第一晚入住資訊存到手機離線備忘錄。</li>
              <li>下載 Naver Map、Uber，以及 k.ride 或 Kakao T；登入並確認通知與網路可用。</li>
              <li>把釜山通行證要去的免費景點集中在 24／48 小時內，確認營業日、是否預約、是否需要換票。</li>
              <li>第一天不要排太滿，預留金海機場進市區、飯店寄放行李與換錢的緩衝時間。</li>
            </ol>
            <p>
              行程順序還沒定的話，先打開
              <a href="/busan/map" data-event="busanpreparation_map" data-platform="map" data-section="article">
                <strong>釜山景點地圖</strong>
              </a>
              看點位，再用
              <a href="/busan/pass-map" data-event="busanpreparation_passmap_bottom" data-platform="pass-map" data-section="article">
                <strong>釜山通行證地圖</strong>
              </a>
              檢查通行證景點是否順路，會比先買票再硬排行程穩很多。
            </p>
          </div>
        </section>

        <SeoCtaSection text="" href="/busan/map" linkText="打開釜山景點地圖開始排 5 天 4 夜" newTab dataEvent="busanpreparation_cta_map" />
        <SeoFaqSection title="釜山行前準備常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
