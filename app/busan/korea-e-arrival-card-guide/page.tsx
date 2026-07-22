import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  koreaEArrivalCardGuideCanonical,
  koreaEArrivalCardGuideDescription,
  koreaEArrivalCardGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const E_ARRIVAL_URL = 'https://www.e-arrivalcard.go.kr/portal/main/index.do'

const videoLinks = [
  { label: 'IG Reels', href: 'https://www.instagram.com/reel/DKMrn6dzS4G/', event: 'koreaearrival_video_ig', platform: 'IG', primary: true },
  { label: 'YouTube', href: 'https://www.youtube.com/shorts/L_FmuAzoGzM', event: 'koreaearrival_video_yt', platform: 'YouTube' },
]

const faqItems = [
  {
    q: '韓國電子入境卡什麼時候可以填？',
    a: '從韓國抵達日前 3 天起，以韓國標準時間計算。提交後 72 小時有效；如果有效時間內沒有入境，申報會失效，必須重新填寫。',
  },
  {
    q: '有 K-ETA 還要填電子入境卡嗎？',
    a: '不用。持有有效 K-ETA 的外國人可免提交電子或紙本入境卡。K-ETA 暫免則不等於入境卡也免除，仍須依入境卡規則處理。',
  },
  {
    q: '電子入境卡要付費嗎？',
    a: '不用。官方服務完全免費，唯一官方網址是 e-arrivalcard.go.kr。若網站要求付款資訊或網址不是 .go.kr，請不要輸入個資。',
  },
  {
    q: '提交後需要出示 PDF 或列印畫面嗎？',
    a: '不需要強制出示。入境審查可直接查詢已提交的電子入境卡；不過建議保留申報號碼、Email 或確認畫面，若需要修改或查詢時會更方便。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: koreaEArrivalCardGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: koreaEArrivalCardGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: koreaEArrivalCardGuideCanonical,
  author: { '@type': 'Organization', name: 'JieJourneys(旅杰)', url: SITE_URL },
  publisher: {
    '@type': 'Organization',
    name: 'JieJourneys(旅杰)',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/og-share.png` },
  },
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

type KoreaEArrivalCardGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'busan-video') return '/busan/video'
  if (value === 'preparation' || value === 'busan-preparation-guide') return '/busan/busan-preparation-guide'
  if (value === 'keta' || value === 'k-eta-guide') return '/busan/k-eta-guide'
  return '/busan'
}

export default async function KoreaEArrivalCardGuidePage({ searchParams }: KoreaEArrivalCardGuidePageProps) {
  const params = (await searchParams) ?? {}
  const backHref = sourceBackHref(params.from)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={backHref} eventPrefix="koreaearrival" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="韓國入境教學"
          h1="韓國電子入境卡教學｜e-Arrival card 怎麼填、72 小時與準備資料"
          intro="韓國電子入境卡可以在手機或電腦免費填寫，不用再手寫紙本入境卡。重點不是提早越久越好，而是抵達日前 3 天起才能提交，而且提交後只保留 72 小時有效。"
          eventPrefix="koreaearrival"
          showVisual={false}
          ctaLinks={[
            { label: '前往官方填寫', href: E_ARRIVAL_URL, dataEvent: 'koreaearrival_hero_official', platform: 'Official' },
            { label: '準備資料', href: '#before-you-start', dataEvent: 'koreaearrival_hero_prepare', platform: 'article' },
            { label: '填寫步驟', href: '#steps', dataEvent: 'koreaearrival_hero_steps', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="韓國電子入境卡快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">時間</span>
              <strong>抵達日前 3 天起才能填</strong>
              <p>以韓國標準時間計算；太早填不會保留到旅行日期。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">效期</span>
              <strong>提交後 72 小時有效</strong>
              <p>沒有在 72 小時內入境就失效，需要重新提交。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">費用</span>
              <strong>完全免費</strong>
              <p>只有 e-arrivalcard.go.kr 是官方網站；任何付款要求都是警訊。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">例外</span>
              <strong>有效 K-ETA 持有人免填</strong>
              <p>K-ETA 暫免不等於免填入境卡；請分清楚自己的身分。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="電子入境卡短影音">
          <h2 className="seo-h2">先看短影音：電子入境卡手機填寫</h2>
          <div className="seo-prose">
            <p>影片帶你快速看一次畫面；真正填寫時，再對照下方資料與步驟核對，最不容易因航班或住宿資訊打錯而重填。</p>
            <SeoVideoLinkMenu label="韓國電子入境卡" links={videoLinks} />
          </div>
        </section>

        <section className="seo-content" id="who-needs-it" aria-label="電子入境卡適用對象">
          <h2 className="seo-h2">誰要填韓國電子入境卡？先分清楚 K-ETA 與入境申報</h2>
          <div className="seo-prose">
            <p>
              e-Arrival card 的適用對象和原本紙本入境卡相同：一般短期旅遊的外國人通常需要提交。已完成外國人登錄者、團體（電子）簽證持有人、機組員，以及<strong>持有有效 K-ETA</strong>的旅客則可免填。
            </p>
            <p>
              最容易混淆的是「K-ETA 暫免」：如果你只是暫時不用申請 K-ETA，並不會自動獲得免填入境卡的 K-ETA 權益。是否需要 K-ETA，請另看
              <a href="/busan/k-eta-guide?from=korea-e-arrival-card-guide" data-event="koreaearrival_keta_article" data-platform="article" data-section="article">
                <strong>K-ETA 到底要不要申請？</strong>
              </a>
              。
            </p>
          </div>
        </section>

        <section className="seo-content" id="before-you-start" aria-label="電子入境卡填寫前準備">
          <h2 className="seo-h2">填寫前先準備這些資料</h2>
          <div className="seo-prose">
            <ul>
              <li><strong>可收驗證信的 Email：</strong>填寫與查詢都會用到，別臨時用收不到信的舊帳號。</li>
              <li><strong>有效護照：</strong>姓名、國籍、出生日期、護照號碼與到期日要完全照護照。可依頁面指示用護照資訊快速帶入，但還是要自己核對。</li>
              <li><strong>入境與離境航班：</strong>包含預計抵達／離境日期與航班號，例如 TW672。</li>
              <li><strong>釜山住宿資訊：</strong>飯店英文名稱、英文地址與聯絡方式先放在手機備忘錄，填寫最快。</li>
              <li><strong>入境目的、聯絡方式與職業：</strong>都是官方表單會要求的資料，不要只準備護照和航班。</li>
            </ul>
          </div>
        </section>

        <section className="seo-content" id="steps" aria-label="電子入境卡填寫步驟">
          <h2 className="seo-h2">5 步驟完成 e-Arrival card</h2>
          <div className="seo-prose">
            <ol>
              <li>進入官方網站，確認網址是 <strong>e-arrivalcard.go.kr</strong>，選擇語言後開始填寫。</li>
              <li>輸入 Email 並完成驗證，再同意需要的個資與申報條款。</li>
              <li>依護照逐欄核對個人資料；英文拼音、護照號碼和到期日不要靠記憶填。</li>
              <li>填入抵達日、航班、預定離境資料、住宿地與韓國境內聯絡方式。</li>
              <li>提交後記下申報號碼，或保留 Email／確認畫面方便查詢；入境審查時不必強制出示 PDF 或截圖。</li>
            </ol>
            <p>
              官方服務網址是
              <a href={E_ARRIVAL_URL} target="_blank" rel="noopener noreferrer" data-event="koreaearrival_official" data-platform="Official" data-section="article_link">
                <strong> e-arrivalcard.go.kr</strong>
              </a>
              ，不需要付款。若看到相似網址要求刷卡或付代辦費，請直接關閉；韓國法務部已特別提醒有假網站冒用服務名稱。
            </p>
          </div>
        </section>

        <section className="seo-content" id="changes" aria-label="電子入境卡修改與補填">
          <h2 className="seo-h2">填完後資料變了怎麼辦？</h2>
          <div className="seo-prose">
            <p>
              在入境審查前，住宿地、入境目的或職業等資料仍可透過申報號碼或 Email 驗證修改；若用相同個人資料重新提交，以最新一次為準。萬一來不及線上完成，也能在入境審查前補填電子入境卡或紙本入境卡，但不要把「可以現場補」當成常態，尖峰入境時會更手忙腳亂。
            </p>
            <p>
              電子入境卡的適用對象、資料欄位與有效時間可能調整；若有有效 K-ETA、長期簽證或其他特殊身分，出發前請再確認自己的入境條件。
            </p>
          </div>
        </section>

        <SeoFaqSection title="韓國電子入境卡常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
