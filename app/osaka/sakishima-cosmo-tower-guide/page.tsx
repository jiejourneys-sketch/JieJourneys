import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import Image from 'next/image'
import {
  sakishimaCosmoTowerGuideCanonical,
  sakishimaCosmoTowerGuideDescription,
  sakishimaCosmoTowerGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const OFFICIAL_INFO_URL = 'https://sakishima-observatory.com/information/'
const AMAZING_PASS_URL = 'https://osaka-amazing-pass.com/service_free.html'

const faqItems = [
  {
    q: '咲洲宇宙塔展望台最近的車站是哪一站？',
    a: '最近是 Osaka Metro 中央線貿易中心前站（Trade Center-mae／P10）。從 2 號出口往 ATC 方向走，接著依「大阪府咲洲廳舍連絡通路」的指標穿過連絡橋即可抵達。',
  },
  {
    q: '咲洲宇宙塔展望台可以使用大阪周遊券嗎？',
    a: '可以，2026 年大阪周遊券列為免費設施，成人一般票參考價格為 1,200 日圓。但 1 月 1 日、6 月 6 日及展望台指定的特別營業日不能使用，出發前要再確認官方公告。',
  },
  {
    q: '咲洲宇宙塔展望台從哪一層進、怎麼離開？',
    a: '入場口搭上行透明電梯到 52 樓，再轉電扶梯到 55 樓展望台；離場則由 55 樓搭電扶梯下到 51 樓，再搭高樓層電梯回 1 樓。',
  },
  {
    q: '咲洲宇宙塔展望台營業到幾點？',
    a: '一般營業時間為 11:00～22:00，最晚入場 21:30；每週一休館，週一遇國定假日則改為隔天休館。活動、天候或設備工程可能讓營業方式調整。',
  },
  {
    q: '輪椅或嬰兒車可以上 55 樓嗎？',
    a: '52 樓到 55 樓之間只有電扶梯。輪椅使用者可事先聯絡展望台，官方會視當日狀況引導至 52 樓可看市區景色的空間；詳細安排請先向設施確認。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: sakishimaCosmoTowerGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: sakishimaCosmoTowerGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: sakishimaCosmoTowerGuideCanonical,
  image: `${SITE_URL}/assets/sakishima-cosmo-tower/building-entrance.jpg`,
  author: {
    '@type': 'Organization',
    name: 'JieJourneys(旅杰)',
    url: SITE_URL,
  },
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

type SakishimaCosmoTowerGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'osaka-video') return '/osaka/video'
  if (value === 'map' || value === 'osaka-map') return '/osaka/map'
  if (value === 'pass-map' || value === 'osaka-pass-map') return '/osaka/pass-map'
  if (value === 'osaka-amazing-pass') return '/osaka/osaka-amazing-pass'
  return '/osaka'
}

export default async function SakishimaCosmoTowerGuidePage({ searchParams }: SakishimaCosmoTowerGuidePageProps) {
  const params = (await searchParams) ?? {}
  const backHref = sourceBackHref(params.from)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={backHref} eventPrefix="sakishimacosmotower" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="大阪攻略｜大阪灣區"
          h1="咲洲宇宙塔展望台攻略｜貿易中心前站 2 號出口、ATC 連絡橋與大阪周遊券"
          intro="咲洲宇宙塔展望台位在大阪府咲洲廳舍，離貿易中心前站不遠，但第一次走最容易卡在 ATC 與連絡橋的室內動線。這篇直接用現場照片帶你從 2 號出口走到入口，再整理 55 樓展望台、票價、開放時間與大阪周遊券限制。"
          eventPrefix="sakishimacosmotower"
          showVisual={false}
          ctaLinks={[
            { label: '從車站怎麼走', href: '#access', dataEvent: 'sakishimacosmotower_hero_access', platform: 'article' },
            { label: '館內參觀動線', href: '#observatory-route', dataEvent: 'sakishimacosmotower_hero_route', platform: 'article' },
            { label: '大阪周遊券', href: '#amazing-pass', dataEvent: 'sakishimacosmotower_hero_pass', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="咲洲宇宙塔展望台快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">最近車站</span>
              <strong>貿易中心前站 P10・2 號出口</strong>
              <p>從出口經 ATC 室內通道與連絡橋走過去，不用在建築外繞路找入口。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">展望台</span>
              <strong>55 樓・地上 252m</strong>
              <p>透明電梯上 52 樓，再搭長電扶梯到 55 樓，能看大阪灣與市區的 360 度景觀。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">一般票價</span>
              <strong>成人 ¥1,200</strong>
              <p>中小學生 ¥600、70 歲以上 ¥1,000；票價若調整請以官方現場資訊為準。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">大阪周遊券</span>
              <strong>一般營業日可免費進</strong>
              <p>元旦、特別營業日不能使用；安排前先看展望台公告，避免白跑一趟。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="access" aria-label="從貿易中心前站前往咲洲宇宙塔展望台">
          <h2 className="seo-h2">咲洲宇宙塔展望台怎麼走？從貿易中心前站 2 號出口接 ATC 連絡橋</h2>
          <div className="seo-prose">
            <p>
              最順的起點是 Osaka Metro 中央線的<strong>貿易中心前站（Trade Center-mae／P10）2 號出口</strong>。出站後不要直接往戶外找高樓，先沿 ATC 的室內動線前進；看到「大阪府咲洲廳舍連絡通路」就代表方向正確，穿過連絡橋便會接到展望台所在的大樓。
            </p>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/sakishima-cosmo-tower/trade-center-mae-route-map.png"
                alt="從貿易中心前站 2 號出口經 ATC 與連絡橋前往咲洲宇宙塔展望台的步行地圖"
                width={1169}
                height={2391}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>先從貿易中心前站 2 號出口進 ATC，再接連絡橋通往大阪府咲洲廳舍；這條路線比在外面繞大樓更直覺。</figcaption>
            </figure>

            <ol>
              <li><strong>貿易中心前站 2 號出口出來：</strong>往 ATC 方向走，先進入商場與辦公區的室內通道。</li>
              <li><strong>找「大阪府咲洲廳舍連絡通路」：</strong>看到這個日文指標就照箭頭走，它會帶你去連接展望台大樓的通路。</li>
              <li><strong>走過連絡橋：</strong>橋的另一端就是大阪府咲洲廳舍（舊 WTC）；抵達後再找「展望台入口」或售票處指標。</li>
            </ol>

            <figure className="seo-figure seo-portrait-figure">
              <Image
                src="/assets/sakishima-cosmo-tower/atc-connection-bridge-map.png"
                alt="ATC、貿易中心前站與大阪府咲洲廳舍連絡橋的現場位置圖"
                width={2386}
                height={2597}
                sizes="(max-width: 820px) 100vw, 760px"
              />
              <figcaption>ATC 和大阪府咲洲廳舍不是同一棟；中間有連絡橋，跟著指標走就能避開在建築群裡繞路的狀況。</figcaption>
            </figure>

            <figure className="seo-figure seo-portrait-figure">
              <Image
                src="/assets/sakishima-cosmo-tower/atc-passageway-sign.png"
                alt="ATC 內寫著大阪府咲洲廳舍連絡通路的方向指標"
                width={3024}
                height={4032}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>看到「大阪府咲洲廳舍連絡通路」的指標後往箭頭方向走，這是從 ATC 接上展望台大樓的關鍵。</figcaption>
            </figure>

            <figure className="seo-figure seo-portrait-figure">
              <Image
                src="/assets/sakishima-cosmo-tower/building-entrance.jpg"
                alt="大阪府咲洲廳舍入口，咲洲宇宙塔展望台所在建築"
                width={3024}
                height={4032}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>穿過連絡橋後會進入大阪府咲洲廳舍；展望台設在這棟大樓高樓層，不是在 ATC 本館裡。</figcaption>
            </figure>
          </div>
        </section>

        <section className="seo-content" id="entrance" aria-label="咲洲宇宙塔展望台入口與售票處">
          <h2 className="seo-h2">進到大樓後：先找紅色的展望台售票處與入口</h2>
          <div className="seo-prose">
            <p>
              接上咲洲廳舍後，從連絡橋方向進來<strong>往右前方走</strong>，依館內的<strong>「展望台入口」</strong>與<strong>「展望台入場券売場」</strong>指標前進。你提供的館內圖已標出這段路線：先到售票處或出示大阪周遊券，再依工作人員指示進入上行電梯。大型辦公大樓裡電梯很多，記住「展望台入口」比只找一般電梯更不會走錯。
            </p>

            <figure className="seo-figure seo-portrait-figure">
              <Image
                src="/assets/sakishima-cosmo-tower/observatory-entrance-floor-map.png"
                alt="大阪府咲洲廳舍館內展望台售票處、入口與高樓層電梯位置圖"
                width={3024}
                height={2744}
                sizes="(max-width: 820px) 100vw, 760px"
              />
              <figcaption>紅色區塊是展望台售票處與入口；從連絡橋方向進入後，照展望台指標走就對了。</figcaption>
            </figure>
          </div>
        </section>

        <section className="seo-content" id="observatory-route" aria-label="咲洲宇宙塔展望台樓層與參觀路線">
          <h2 className="seo-h2">上樓、看景、下樓怎麼走？52 樓轉電扶梯到 55 樓</h2>
          <div className="seo-prose">
            <p>
              咲洲宇宙塔不是搭一趟電梯就直接到最高處。官方規劃的單向動線是：從展望台入口搭<strong>上行透明電梯到 52 樓</strong>，再轉乘 52 樓到 55 樓的長電扶梯；看完後則由 55 樓下到 51 樓，最後從 51 樓搭下行高樓層電梯回到 1 樓。
            </p>
            <ol>
              <li><strong>展望台入口：</strong>購票或出示大阪周遊券後，搭上行透明電梯。</li>
              <li><strong>52 樓：</strong>轉乘往 55 樓的長電扶梯；透明電梯與電扶梯本身就是這座展望台的特色之一。</li>
              <li><strong>55 樓：</strong>在地上 252m 的全景空間看大阪灣、市區與夜景；窗戶延伸到腳邊，能看到正下方的街景。</li>
              <li><strong>離場：</strong>由 55 樓搭電扶梯下到 51 樓，再搭下行高樓層電梯回 1 樓，不要原路找上行電梯。</li>
            </ol>
            <p>
              特殊活動日或設備保養時，電扶梯與入場方式可能調整；若是為夕陽、花火或夜景專程前往，出發當天再看一次官方最新公告最保險。
            </p>
          </div>
        </section>

        <section className="seo-content" id="amazing-pass" aria-label="咲洲宇宙塔展望台票價與大阪周遊券">
          <h2 className="seo-h2">票價與大阪周遊券：一般營業日免費，但特別營業日不可用</h2>
          <div className="seo-prose">
            <p>
              一般入場票目前為<strong>成人（高中生以上）¥1,200</strong>、中小學生 ¥600、70 歲以上 ¥1,000。持大阪周遊券在一般營業日可免費入場，若你要去大阪灣區、天保山或 ATC 一帶，將它排進周遊券行程相當有價值。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>一般入場</th>
                    <th>大阪周遊券</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>成人（高中生以上）</strong></td>
                    <td>¥1,200</td>
                    <td>一般營業日免費</td>
                  </tr>
                  <tr>
                    <td><strong>使用限制</strong></td>
                    <td>依現場售票規則</td>
                    <td>元旦、6 月 6 日與展望台指定特別營業日不可用</td>
                  </tr>
                  <tr>
                    <td><strong>確認方式</strong></td>
                    <td>出發前看官方營業資訊</td>
                    <td>同時確認大阪周遊券設施頁與展望台最新公告</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              大阪周遊券官方會標示可用設施與限制，但也明確提醒各設施營業時間、休館日可能變更。使用前可直接查看
              <a href={AMAZING_PASS_URL} target="_blank" rel="noopener noreferrer" data-event="sakishimacosmotower_amazing_pass_official" data-platform="AmazingPass" data-section="article">
                <strong>大阪周遊券的咲洲宇宙塔設施頁</strong>
              </a>
              ，再交叉確認
              <a href={OFFICIAL_INFO_URL} target="_blank" rel="noopener noreferrer" data-event="sakishimacosmotower_official_info" data-platform="official" data-section="article">
                <strong>展望台官方營業、票價與最新公告</strong>
              </a>
              。
            </p>
          </div>
        </section>

        <section className="seo-content" id="viewing-tips" aria-label="咲洲宇宙塔展望台看景建議">
          <h2 className="seo-h2">什麼時候去最好？把它排在大阪灣區傍晚的收尾</h2>
          <div className="seo-prose">
            <p>
              這裡最大的優點是視野沒有被市中心高樓切碎：白天能看大阪灣、港區與夢洲方向，天色暗下來後則適合看神戶與明石海峽大橋方向的夜景。若白天已排海遊館、天保山、ATC 或大阪南港，傍晚來看夕陽再待到夜景，會比特地從市中心來回更順。
            </p>
            <p>
              首次走這條路建議多留一點找出口與室內通道的時間；重點不是走得遠，而是 ATC、連絡橋與廳舍入口在不同建築之間。跟著本文的 2 號出口與「大阪府咲洲廳舍連絡通路」兩個關鍵，就不會在大阪灣區的大樓群裡迷路。
            </p>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="把咲洲宇宙塔排進大阪灣行程"
          intro="先用周遊券完整攻略確認使用日，再到地圖把大阪灣區與其他免費設施排在同一段，傍晚進展望台看夜景最順。"
          links={[
            { label: '大阪周遊券完整攻略', href: '/osaka/osaka-amazing-pass?from=sakishima-guide', event: 'sakishimacosmotower_related_pass', primary: true },
            { label: '打開大阪周遊券地圖', href: '/osaka/pass-map?from=sakishima-guide', event: 'sakishimacosmotower_related_passmap' },
          ]}
          purchaseLabel="購票"
          purchaseOptions={[
            { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/12156-osaka-amazing-pass-e-ticket-japan?cid=22312', event: 'sakishimacosmotower_purchase_kkday', platform: 'KKDAY' },
            { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/82312-amazing-pass-osaka/?aid=93798', event: 'sakishimacosmotower_purchase_klook', platform: 'KLOOK' },
            { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/48361291?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17058162', event: 'sakishimacosmotower_purchase_trip', platform: 'Trip' },
          ]}
        />
        <SeoFaqSection title="咲洲宇宙塔展望台常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
