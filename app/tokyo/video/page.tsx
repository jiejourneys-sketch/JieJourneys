import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '景點攻略', label: '景點攻略', dataArea: '景點攻略' },
  { value: '交通', label: '交通', dataArea: '交通' },
  { value: '行前準備', label: '行前準備', dataArea: '行前準備' },
]
const cards = [
  { title: 'SHIBUYA SKY', meta: '景點攻略', area: '景點攻略', datasetKey: 'video' as const, datasetValue: 'ShibuyaSky', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DWJbrmXFDuf/', className: 'btn primary', event: 'tokyovideo_ShibuyaSkyIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/Y0mGY55bSFs', className: 'btn', event: 'tokyovideo_ShibuyaSkyYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/8QZ9KU3S1sa', className: 'btn', event: 'tokyovideo_ShibuyaSkyXHS', platform: '小紅書', section: 'video' }] },
  { title: '晴空塔', meta: '景點攻略', area: '景點攻略', datasetKey: 'video' as const, datasetValue: 'SkyTree', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DV3aGGdFNsc/', className: 'btn primary', event: 'tokyovideo_SkyTreeIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/Q-zM2k47oVY', className: 'btn', event: 'tokyovideo_SkyTreeYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/29145lvSHW4', className: 'btn', event: 'tokyovideo_SkyTreeXHS', platform: '小紅書', section: 'video' }] },
  { title: '東京市區｜9大區域', meta: '景點攻略', area: '景點攻略', datasetKey: 'video' as const, datasetValue: 'Tokyo9Areas', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DVlYnZjksc7/', className: 'btn primary', event: 'tokyovideo_Tokyo9AreasIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/ca2ny5UJb4k', className: 'btn', event: 'tokyovideo_Tokyo9AreasYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/4PfP2PJBkCE', className: 'btn', event: 'tokyovideo_Tokyo9AreasXHS', platform: '小紅書', section: 'video' }] },
  { title: '六本木點燈｜最佳路線', meta: '景點攻略', area: '景點攻略', datasetKey: 'video' as const, datasetValue: 'RoppongiIllumination', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DSfemOTEqbL/', className: 'btn primary', event: 'tokyovideo_RoppongiIlluminationIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/yZ8eH_jOKYM', className: 'btn', event: 'tokyovideo_RoppongiIlluminationYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/2DymZx52KpT', className: 'btn', event: 'tokyovideo_RoppongiIlluminationXHS', platform: '小紅書', section: 'video' }] },
  { title: '惠比壽花園點燈｜最佳路線', meta: '景點攻略', area: '景點攻略', datasetKey: 'video' as const, datasetValue: 'HibiyaGardenIllumination', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DShsI6gEa8u/', className: 'btn primary', event: 'tokyovideo_HibiyaGardenIlluminationIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/I6VfBsc9YJE', className: 'btn', event: 'tokyovideo_HibiyaGardenIlluminationYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/9qXKYa7AxGZ', className: 'btn', event: 'tokyovideo_HibiyaGardenIlluminationXHS', platform: '小紅書', section: 'video' }] },
  { title: '地鐵 vs JR｜攻略', meta: '交通', area: '交通', datasetKey: 'video' as const, datasetValue: 'MetroVSJR', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DTVMB2FkTt5/', className: 'btn primary', event: 'tokyovideo_MetroVSJRIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/xNN5iQLFGcU', className: 'btn', event: 'tokyovideo_MetroVSJRYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/3MITM21zfli', className: 'btn', event: 'tokyovideo_MetroVSJRXHS', platform: '小紅書', section: 'video' }] },
  { title: 'JR vs 新幹線｜攻略', meta: '交通', area: '交通', datasetKey: 'video' as const, datasetValue: 'JRVSXinganxian', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DVBVYRckTUG/', className: 'btn primary', event: 'tokyovideo_JRVSXGXIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/j_Ws48TTzbE', className: 'btn', event: 'tokyovideo_JRVSXGXYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/2h8p1nd33PE', className: 'btn', event: 'tokyovideo_JRVSXGXXHS', platform: '小紅書', section: 'video' }] },
  { title: '東京地鐵票券｜攻略', meta: '交通', area: '交通', datasetKey: 'video' as const, datasetValue: 'TokyoSubwayTicket', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DTnNqDgkZOm/', className: 'btn primary', event: 'tokyovideo_TokyoSubwayTicketIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/dz2aJtW3y9c', className: 'btn', event: 'tokyovideo_TokyoSubwayTicketYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/3CIm2CzXmSI', className: 'btn', event: 'tokyovideo_TokyoSubwayTicketXHS', platform: '小紅書', section: 'video' }] },
  { title: '東京地鐵搭乘｜3個重點', meta: '交通', area: '交通', datasetKey: 'video' as const, datasetValue: 'TokyoSubwayTips', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DT5PNXdk4DM/', className: 'btn primary', event: 'tokyovideo_TokyoSubwayTipsIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/9KtpGIZE9wk', className: 'btn', event: 'tokyovideo_TokyoSubwayTipsYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/4nx9iQs8ukJ', className: 'btn', event: 'tokyovideo_TokyoSubwayTipsXHS', platform: '小紅書', section: 'video' }] },
  { title: '成田機場到市區｜3種方式', meta: '交通', area: '交通', datasetKey: 'video' as const, datasetValue: 'NaritaAirportToCity', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DULQxKUkVR2/', className: 'btn primary', event: 'tokyovideo_NaritaAirportToCityIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/vdFwmQd8CLQ', className: 'btn', event: 'tokyovideo_NaritaAirportToCityYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/6SAdU1cGAHr', className: 'btn', event: 'tokyovideo_NaritaAirportToCityXHS', platform: '小紅書', section: 'video' }] },
  { title: '成田機場到市區｜最便宜方式', meta: '交通', area: '交通', datasetKey: 'video' as const, datasetValue: 'NaritaAirportToCity2', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DUdSUu1kdXn/', className: 'btn primary', event: 'tokyovideo_NaritaAirportToCity2IG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/rKJejwOTIw0', className: 'btn', event: 'tokyovideo_NaritaAirportToCity2YT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/AgcJoBlsdj8', className: 'btn', event: 'tokyovideo_NaritaAirportToCity2XHS', platform: '小紅書', section: 'video' }] },
  { title: '羽田機場到市區｜3種方式', meta: '交通', area: '交通', datasetKey: 'video' as const, datasetValue: 'HNDToCity', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DUvT5Etkf4f/', className: 'btn primary', event: 'tokyovideo_HNDToCityIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/fTtfgB93DE4', className: 'btn', event: 'tokyovideo_HNDToCityYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/5Un3Rc5yHnU', className: 'btn', event: 'tokyovideo_HNDToCityXHS', platform: '小紅書', section: 'video' }] },
  { title: 'Visit Japan Web｜入境卡填寫', meta: '行前準備', area: '行前準備', datasetKey: 'video' as const, datasetValue: 'VisitJapanWeb', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DSxI34Nkebp/', className: 'btn primary', event: 'tokyovideo_visitjapanwebIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/DWKvXvEHyKk', className: 'btn', event: 'tokyovideo_visitjapanwebYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/3g4dVW46U4I', className: 'btn', event: 'tokyovideo_visitjapanwebXHS', platform: '小紅書', section: 'video' }] },
  { title: '日幣換匯攻略', meta: '行前準備', area: '行前準備', datasetKey: 'video' as const, datasetValue: 'JPYExchange', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DTDKcCoEZBS/', className: 'btn primary', event: 'tokyovideo_JPYExchangeIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/FfMj7w2R7BA', className: 'btn', event: 'tokyovideo_JPYExchangeYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/83JoRvRQFSc', className: 'btn', event: 'tokyovideo_JPYExchangeXHS', platform: '小紅書', section: 'video' }] },
]

export default function TokyoVideoPage() {
  return (
    <>
      <CitySubpageHeader backHref="/tokyo" eventPrefix="tokyovideo" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="東京短影片合輯"
          h1="東京自由行，不用做功課也能玩"
          intro="用短影片快速搞懂東京怎麼玩：景點怎麼排、交通怎麼搭、行程怎麼順，直接帶你走最簡單的玩法。"
          eventPrefix="tokyovideo"
          showVisual={false}
          ctaLinks={[
            {
              label: '東京住宿推薦',
              href: 'https://www.jiejourneys.com/tokyo/hotel',
              dataEvent: 'tokyovideo_allhotels',
              platform: 'hotel',
            },
            {
              label: '東京票券總整理',
              href: 'https://www.jiejourneys.com/tokyo/ticket',
              dataEvent: 'tokyovideo_alltickets',
              platform: 'ticket',
            },
            {
              label: '通訊&交通攻略',
              href: 'https://www.jiejourneys.com/tokyo/transport',
              dataEvent: 'tokyovideo_alltransport',
              platform: 'transport',
            },
          ]}
        />

        <SeoCtaSection text="" href="#videoListTitle" linkText="直接看影片 ↓" />

        <section className="seo-content" aria-label="快速理解摘要">
          <h2 className="seo-h2">東京自由行快速理解</h2>

          <div className="seo-prose space-y-6">
            <div>
              <h3 className="seo-h3">👉 東京怎麼玩？</h3>
              <p>
                抓一個原則就好：<strong>一半景點 + 一半逛街購物</strong>。
              </p>
              <p>
                交通很簡單，地鐵為主，有些路線搭 JR，用 Google Maps 幾乎都能順利移動。
              </p>
            </div>

            <div>
              <h3 className="seo-h3">👉 東京其實只要分 <a
                href="https://www.instagram.com/reel/DVlYnZjksc7/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="tokyovideo_SEO_3areas"
              >
                <strong>3區</strong>
              </a></h3>
              <ul>
                <li>① 上野 / 淺草寺 / 晴空塔（偏傳統 + 第一天）</li>
                <li>② 皇居 / 銀座 / 築地市場（市中心 + 美食）</li>
                <li>③ 新宿 / 原宿 / 澀谷（逛街 + 夜生活）</li>
              </ul>
            </div>

            <div>
              <h3 className="seo-h3">👉 各區重點</h3>
              <ul>
                <li>上野：恩賜公園、阿美橫町</li>
                <li>淺草寺：雷門、參拜走走</li>
                <li><a
                href="https://www.instagram.com/reel/DV3aGGdFNsc/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="tokyovideo_SEO_skytreeIG"
              >
                <strong>晴空塔</strong>
              </a>(<a
                href="https://www.kkday.com/zh-tw/product/10759-tokyo-skytree-observatory-advance-ticket-japan?cid=22312"
                target="_blank"
                rel="noopener noreferrer"
                data-event="tokyovideo_SEO_skytreeKKday"
              >
                <strong>購票</strong>)
              </a>
              ：商場 + 夜景</li>
                <li>皇居：天皇住所</li>
                <li>銀座：主要逛街購物</li>
                <li>築地市場：吃美食</li>
                <li>新宿：也是購物熱區</li>
                <li>原宿：<a
                href="https://www.instagram.com/reel/DWte3LWzhea/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="tokyovideo_SEO_harajukuIG"
              >
                <strong>明治神宮</strong>
              </a></li>
                <li>澀谷：購物 + <a
                href="https://www.instagram.com/reel/DWJbrmXFDuf/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="tokyovideo_SEO_shibuyaIG"
              >
                <strong>澀谷展望台</strong>
              </a>(<a
                href="https://www.kkday.com/zh-tw/product/133300-shibuya-sky-observatory-e-ticket-tokyo?cid=22312"
                target="_blank"
                rel="noopener noreferrer"
                data-event="tokyovideo_SEO_shibuyaKKday"
              >
                <strong>購票</strong>)
              </a></li>
              </ul>
            </div>

            <div>
              <h3 className="seo-h3">👉 東京吃什麼？</h3>
              <p>
                生魚片、壽司、丼飯、壽喜燒、拉麵、燒肉、和牛，基本上隨便吃都很好吃，不太會踩雷。
              </p>
            </div>

            <div>
              <h3 className="seo-h3">👉 <a
                href="https://www.instagram.com/reel/DT5PNXdk4DM/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="tokyovideo_SEO_googlemapIG"
              >
                <strong>東京交通怎麼搭</strong>
              </a>？</h3>
              <p>
                地鐵為主，部分搭 JR，用 Google Maps 幾乎都能搞定。
              </p>
              <p>如果行程都在市區，可以考慮<a
                href="https://www.instagram.com/reel/DTnNqDgkZOm/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="tokyovideo_SEO_tokyosubwayticketIG"
              >
                <strong>東京地鐵券</strong>
              </a>(<a
                href="https://www.kkday.com/zh-tw/product/5989-24-48-72-hr-tokyo-subway-ticket-japan?cid=22312"
                target="_blank"
                rel="noopener noreferrer"
                data-event="tokyovideo_SEO_tokyosubwayticketKKday"
              >
                <strong>購票</strong>)</a>。</p>
            </div>

            <div>
              <h3 className="seo-h3">👉 機場怎麼進市區？</h3>
              <p>
                成田：Skyliner、N&apos;EX、利木津巴士，去淺草可搭 Access 特急；<a
                href="https://www.google.com/maps/d/u/0/viewer?mid=1ZmBLaHH4TUkIxpwun8PUQETXJGN2rQ4&ll=35.577416342687144%2C139.92618605&z=10"
                target="_blank"
                rel="noopener noreferrer"
                data-event="tokyovideo_SEO_naritaMap"
              >
                <strong>交通地圖</strong></a>。
              </p>
              <p>羽田：京急電鐵、東京單軌電車、利木津巴士；<a
                href="https://www.google.com/maps/d/u/0/viewer?mid=1d5zUE9pWTdlrDUplV7Q5ARZ6GoIhOQA&ll=36.03124517546043%2C139.83772095&z=9"
                target="_blank"
                rel="noopener noreferrer"
                data-event="tokyovideo_SEO_hanedaMap"
              >
                <strong>交通地圖</strong></a>。</p>
              <p>雖然看起來複雜，但 Google Maps 幾乎都能帶你走。</p>
            </div>
          </div>
        </section>

        <SeoCtaSection text="" href="/tokyo/map" linkText="熱門景點地圖" newTab dataEvent="tokyovideo_SEO_spotmap" />

        <h2 className="seo-h2" id="videoListTitle">
          東京短影片合輯（依主題分類）
        </h2>

        <CityTabbedList tabs={tabs} cards={cards} tabEvent="tokyo_video_tab" />

        <section className="seo-faq" id="seo-faq" aria-label="FAQ">
          <h2 className="seo-h2">東京短影片合輯常見問題</h2>
          <ul className="seo-faq-list seo-prose seo-faq-prose" role="list">
            <li className="seo-faq-item">
              <h3 className="seo-h3 seo-faq-q">
                <span className="seo-faq-qicon" aria-hidden="true">
                  Q
                </span>
                <span>👉 第一次去東京看哪支影片最有用？</span>
              </h3>
              <p className="seo-faq-a">先看「東京三大區怎麼分」，再看「地鐵 vs JR」，最後補你想去的景點影片就夠了。</p>
            </li>

            <li className="seo-faq-item">
              <h3 className="seo-h3 seo-faq-q">
                <span className="seo-faq-qicon" aria-hidden="true">
                  Q
                </span>
                <span>👉 成田機場到市區怎麼選？</span>
              </h3>
              <p className="seo-faq-a">
                想快：Skyliner或N&apos;EX
                <br />
                想到指定地點：利木津巴士
                <br />
                想到淺草寺：搭Access特急
              </p>
            </li>

            <li className="seo-faq-item">
              <h3 className="seo-h3 seo-faq-q">
                <span className="seo-faq-qicon" aria-hidden="true">
                  Q
                </span>
                <span>👉 Visit Japan Web 要填嗎？</span>
              </h3>
              <p className="seo-faq-a">建議填，就不用現場填紙本，出發前 6 小時內完成即可；<a
                href="https://services.digital.go.jp/zh-cmn-hant/visit-japan-web/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="tokyovideo_SEO_visitjapanweb"
              >
                <strong>官網在這裡</strong></a>。</p>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  )
}
