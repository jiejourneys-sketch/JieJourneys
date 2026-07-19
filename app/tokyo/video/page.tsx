import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '景點攻略', label: '景點攻略', dataArea: '景點攻略' },
  { value: '交通', label: '交通', dataArea: '交通' },
  { value: '行前準備', label: '行前準備', dataArea: '行前準備' },
]
const cards = [
  { title: '淺草寺', meta: '景點攻略', area: '景點攻略', datasetKey: 'video' as const, datasetValue: 'AsakusaTemple', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DXRh-ucSyoW/', className: 'btn primary', event: 'tokyovideo_AsakusaTempleIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/l893qAnt7TI', className: 'btn', event: 'tokyovideo_AsakusaTempleYT', platform: 'YouTube', section: 'video' }, { label: '文章', href: '/tokyo/sensoji-guide?from=tokyo-video', className: 'btn', event: 'tokyovideo_AsakusaTempleArticle', platform: 'article', section: 'video' }] },
  { title: '明治神宮', meta: '景點攻略', area: '景點攻略', datasetKey: 'video' as const, datasetValue: 'MeijiShrine', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DWte3LWzhea/', className: 'btn primary', event: 'tokyovideo_MeijiShrineIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/SPeJ3kugpu8', className: 'btn', event: 'tokyovideo_MeijiShrineYT', platform: 'YouTube', section: 'video' }, { label: '文章', href: '/tokyo/meiji-jingu-guide?from=tokyo-video', className: 'btn', event: 'tokyovideo_MeijiShrineArticle', platform: 'article', section: 'video' }] },
  { title: 'SHIBUYA SKY', meta: '景點攻略', area: '景點攻略', datasetKey: 'video' as const, datasetValue: 'ShibuyaSky', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DWJbrmXFDuf/', className: 'btn primary', event: 'tokyovideo_ShibuyaSkyIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/Y0mGY55bSFs', className: 'btn', event: 'tokyovideo_ShibuyaSkyYT', platform: 'YouTube', section: 'video' }, { label: '文章', href: '/tokyo/shibuya-sky-guide?from=tokyo-video', className: 'btn', event: 'tokyovideo_ShibuyaSkyArticle', platform: 'article', section: 'video' }] },
  { title: '晴空塔', meta: '景點攻略', area: '景點攻略', datasetKey: 'video' as const, datasetValue: 'SkyTree', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DV3aGGdFNsc/', className: 'btn primary', event: 'tokyovideo_SkyTreeIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/Q-zM2k47oVY', className: 'btn', event: 'tokyovideo_SkyTreeYT', platform: 'YouTube', section: 'video' }, { label: '文章', href: '/tokyo/skytree-guide?from=tokyo-video', className: 'btn', event: 'tokyovideo_SkyTreeArticle', platform: 'article', section: 'video' }] },
  { title: '東京市區｜9大區域', meta: '景點攻略', area: '景點攻略', datasetKey: 'video' as const, datasetValue: 'Tokyo9Areas', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DVlYnZjksc7/', className: 'btn primary', event: 'tokyovideo_Tokyo9AreasIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/ca2ny5UJb4k', className: 'btn', event: 'tokyovideo_Tokyo9AreasYT', platform: 'YouTube', section: 'video' }, { label: '文章', href: '/tokyo/tokyo-9-areas-guide?from=tokyo-video', className: 'btn', event: 'tokyovideo_Tokyo9AreasArticle', platform: 'article', section: 'video' }] },
  { title: '六本木點燈｜最佳路線', meta: '景點攻略', area: '景點攻略', datasetKey: 'video' as const, datasetValue: 'RoppongiIllumination', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DSfemOTEqbL/', className: 'btn primary', event: 'tokyovideo_RoppongiIlluminationIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/yZ8eH_jOKYM', className: 'btn', event: 'tokyovideo_RoppongiIlluminationYT', platform: 'YouTube', section: 'video' }] },
  { title: '惠比壽花園點燈｜最佳路線', meta: '景點攻略', area: '景點攻略', datasetKey: 'video' as const, datasetValue: 'HibiyaGardenIllumination', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DShsI6gEa8u/', className: 'btn primary', event: 'tokyovideo_HibiyaGardenIlluminationIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/I6VfBsc9YJE', className: 'btn', event: 'tokyovideo_HibiyaGardenIlluminationYT', platform: 'YouTube', section: 'video' }] },
  { title: '地鐵 vs JR｜攻略', meta: '交通', area: '交通', datasetKey: 'video' as const, datasetValue: 'MetroVSJR', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DTVMB2FkTt5/', className: 'btn primary', event: 'tokyovideo_MetroVSJRIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/xNN5iQLFGcU', className: 'btn', event: 'tokyovideo_MetroVSJRYT', platform: 'YouTube', section: 'video' }] },
  { title: 'JR vs 新幹線｜攻略', meta: '交通', area: '交通', datasetKey: 'video' as const, datasetValue: 'JRVSXinganxian', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DVBVYRckTUG/', className: 'btn primary', event: 'tokyovideo_JRVSXGXIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/j_Ws48TTzbE', className: 'btn', event: 'tokyovideo_JRVSXGXYT', platform: 'YouTube', section: 'video' }] },
  { title: '東京地鐵票券｜攻略', meta: '交通', area: '交通', datasetKey: 'video' as const, datasetValue: 'TokyoSubwayTicket', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DTnNqDgkZOm/', className: 'btn primary', event: 'tokyovideo_TokyoSubwayTicketIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/dz2aJtW3y9c', className: 'btn', event: 'tokyovideo_TokyoSubwayTicketYT', platform: 'YouTube', section: 'video' }, { label: '文章', href: '/tokyo/tokyo-subway-ticket?from=tokyo-video', className: 'btn', event: 'tokyovideo_TokyoSubwayTicketArticle', platform: 'article', section: 'video' }] },
  { title: '東京地鐵搭乘｜3個重點', meta: '交通', area: '交通', datasetKey: 'video' as const, datasetValue: 'TokyoSubwayTips', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DT5PNXdk4DM/', className: 'btn primary', event: 'tokyovideo_TokyoSubwayTipsIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/9KtpGIZE9wk', className: 'btn', event: 'tokyovideo_TokyoSubwayTipsYT', platform: 'YouTube', section: 'video' }] },
  { title: '成田機場到市區｜3種方式', meta: '交通', area: '交通', datasetKey: 'video' as const, datasetValue: 'NaritaAirportToCity', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DULQxKUkVR2/', className: 'btn primary', event: 'tokyovideo_NaritaAirportToCityIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/vdFwmQd8CLQ', className: 'btn', event: 'tokyovideo_NaritaAirportToCityYT', platform: 'YouTube', section: 'video' }, { label: '文章', href: '/tokyo/narita-airport-to-tokyo?from=tokyo-video', className: 'btn', event: 'tokyovideo_NaritaAirportToCityArticle', platform: 'article', section: 'video' }] },
  { title: '成田機場到市區｜最便宜方式', meta: '交通', area: '交通', datasetKey: 'video' as const, datasetValue: 'NaritaAirportToCity2', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DUdSUu1kdXn/', className: 'btn primary', event: 'tokyovideo_NaritaAirportToCity2IG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/rKJejwOTIw0', className: 'btn', event: 'tokyovideo_NaritaAirportToCity2YT', platform: 'YouTube', section: 'video' }, { label: '文章', href: '/tokyo/narita-airport-to-tokyo?from=tokyo-video', className: 'btn', event: 'tokyovideo_NaritaAirportToCity2Article', platform: 'article', section: 'video' }] },
  { title: '羽田機場到市區｜3種方式', meta: '交通', area: '交通', datasetKey: 'video' as const, datasetValue: 'HNDToCity', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DUvT5Etkf4f/', className: 'btn primary', event: 'tokyovideo_HNDToCityIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/fTtfgB93DE4', className: 'btn', event: 'tokyovideo_HNDToCityYT', platform: 'YouTube', section: 'video' }, { label: '文章', href: '/tokyo/haneda-airport-to-tokyo?from=tokyo-video', className: 'btn', event: 'tokyovideo_HNDToCityArticle', platform: 'article', section: 'video' }] },
  { title: 'Visit Japan Web｜入境卡填寫', meta: '行前準備', area: '行前準備', datasetKey: 'video' as const, datasetValue: 'VisitJapanWeb', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DSxI34Nkebp/', className: 'btn primary', event: 'tokyovideo_visitjapanwebIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/DWKvXvEHyKk', className: 'btn', event: 'tokyovideo_visitjapanwebYT', platform: 'YouTube', section: 'video' }] },
  { title: '日幣換匯攻略', meta: '行前準備', area: '行前準備', datasetKey: 'video' as const, datasetValue: 'JPYExchange', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DTDKcCoEZBS/', className: 'btn primary', event: 'tokyovideo_JPYExchangeIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/FfMj7w2R7BA', className: 'btn', event: 'tokyovideo_JPYExchangeYT', platform: 'YouTube', section: 'video' }] },
  { title: '日本退稅新制｜2026懶人包', meta: '行前準備', note: '整理 2026/11/1 後日本免稅流程、新舊制度差異、機場退稅與完美行購物注意事項。', area: '行前準備', datasetKey: 'video' as const, datasetValue: 'japan-tax-free-2026-article', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/Da72R_yBXam/', className: 'btn primary', event: 'tokyovideo_taxfree2026_ig', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/ULH9oonQ7-I', className: 'btn', event: 'tokyovideo_taxfree2026_youtube', platform: 'YouTube', section: 'video' }, { label: '文章', href: '/japan/tax-free-2026?from=tokyo-video', className: 'btn primary', event: 'tokyovideo_taxfree2026_article', platform: 'article', section: 'video' }] },
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

        <h2 className="seo-h2" id="videoListTitle">
          東京短影片合輯（依主題分類）
        </h2>

        <CityTabbedList tabs={tabs} cards={cards} tabEvent="tokyo_video_tab" collapseVideoActions />

        <SeoCtaSection text="" href="/tokyo/map" linkText="熱門景點地圖" newTab dataEvent="tokyovideo_SEO_spotmap" />

        <SeoContentSection title="東京短影音怎麼看？先用影片抓路線，再回卡片找連結">
          <p>
            這頁不是只放短影音連結，而是幫你把東京自由行的觀看順序排好。第一次去東京，先看區域和交通，再看景點票券；已經排好行程的人，就直接用上方標籤找你要的影片。
          </p>

          <h3 className="seo-h3">第一次東京，先看這三類</h3>
          <ol>
            <li>
              先看東京區域影片，搭配
              <a
                href="/tokyo/tokyo-9-areas-guide?from=tokyo-video"
                data-event="tokyovideo_article_tokyo_9_areas"
                data-platform="article"
                data-section="article"
              >
              <strong> 東京 9 大區域完整攻略</strong>
              </a>
              ，理解上野淺草、東京車站銀座、新宿澀谷這幾個核心。
            </li>
            <li>再看地鐵 vs JR、東京地鐵券，避免一開始就亂買 Pass。</li>
            <li>最後看成田或羽田機場交通，決定住宿區域和進市區方式。</li>
          </ol>

          <h3 className="seo-h3">東側路線：上野、淺草、晴空塔</h3>
          <p>
            想玩傳統東京，先從淺草寺、晴空塔、上野開始。淺草適合排半天走雷門、仲見世、淺草寺；晴空塔可以接商場和夜景；上野則適合阿美橫町、上野公園和博物館。可以先看
            <a
              href="https://www.instagram.com/reel/DXRh-ucSyoW/"
              target="_blank"
              rel="noopener noreferrer"
              data-event="tokyovideo_article_asakusa_ig"
              data-platform="IG"
              data-section="article"
            >
              <strong> 淺草寺影片</strong>
            </a>
            、
            <a
              href="/tokyo/sensoji-guide?from=tokyo-video"
              data-event="tokyovideo_article_asakusa_guide"
              data-platform="article"
              data-section="article"
            >
              <strong> 淺草寺完整攻略</strong>
            </a>
            和
            <a
              href="https://www.instagram.com/reel/DV3aGGdFNsc/"
              target="_blank"
              rel="noopener noreferrer"
              data-event="tokyovideo_article_skytree_ig"
              data-platform="IG"
              data-section="article"
            >
              <strong> 晴空塔影片</strong>
            </a>
            、
            <a
              href="/tokyo/skytree-guide?from=tokyo-video"
              data-event="tokyovideo_article_skytree_guide"
              data-platform="article"
              data-section="article"
            >
              <strong> 晴空塔完整攻略</strong>
            </a>
            。
          </p>

          <h3 className="seo-h3">西側路線：新宿、原宿、澀谷</h3>
          <p>
            想逛街、拍城市感、晚上想熱鬧，就看新宿、原宿、澀谷這一組。明治神宮適合放白天，澀谷和 SHIBUYA SKY 適合放下午到晚上。想先抓感覺可以看
            <a
              href="https://www.instagram.com/reel/DWte3LWzhea/"
              target="_blank"
              rel="noopener noreferrer"
              data-event="tokyovideo_article_meiji_ig"
              data-platform="IG"
              data-section="article"
            >
              <strong> 明治神宮影片</strong>
            </a>
            、
            <a
              href="/tokyo/meiji-jingu-guide?from=tokyo-video"
              data-event="tokyovideo_article_meiji_guide"
              data-platform="article"
              data-section="article"
            >
              <strong> 明治神宮完整攻略</strong>
            </a>
            和
            <a
              href="https://www.instagram.com/reel/DWJbrmXFDuf/"
              target="_blank"
              rel="noopener noreferrer"
              data-event="tokyovideo_article_shibuya_sky_ig"
              data-platform="IG"
              data-section="article"
            >
              <strong> SHIBUYA SKY 影片</strong>
            </a>
            、
            <a
              href="/tokyo/shibuya-sky-guide?from=tokyo-video"
              data-event="tokyovideo_article_shibuya_sky_guide"
              data-platform="article"
              data-section="article"
            >
              <strong> SHIBUYA SKY 完整攻略</strong>
            </a>
            。
          </p>

          <h3 className="seo-h3">交通影片：看完再決定要買什麼票</h3>
          <p>
            東京市區以地鐵和 JR 為主，Google Maps 基本上能帶你走，但票券還是要先分清楚。地鐵券只適合東京 Metro 和都營地鐵密集搭乘，不是萬用交通卡；如果你還不確定，可以先看
            <a
              href="/tokyo/tokyo-subway-ticket?from=tokyo-video"
              data-event="tokyovideo_article_subway_ticket"
              data-platform="article"
              data-section="article"
            >
              <strong> 東京地鐵券完整攻略</strong>
            </a>
            。
          </p>

          <h3 className="seo-h3">機場影片：成田和羽田不要混著看</h3>
          <p>
            成田距離市區遠，重點是選 Skyliner、N&apos;EX、Access 特急、利木津巴士或 LCB；羽田離市區近，通常看京急電鐵、東京單軌電車和巴士就好。完整文字版可以看
            <a
              href="/tokyo/narita-airport-to-tokyo?from=tokyo-video"
              data-event="tokyovideo_article_narita"
              data-platform="article"
              data-section="article"
            >
              <strong> 成田機場完整攻略</strong>
            </a>
            和
            <a
              href="/tokyo/haneda-airport-to-tokyo?from=tokyo-video"
              data-event="tokyovideo_article_haneda"
              data-platform="article"
              data-section="article"
            >
              <strong> 羽田機場完整攻略</strong>
            </a>
            。
          </p>

          <h3 className="seo-h3">行前準備：入境、換匯、退稅放最後確認</h3>
          <p>
            影片看完之後，再補 Visit Japan Web、換匯和退稅。這些不是決定行程路線的核心，但會影響抵達和購物流程；出發前再確認一次即可。
          </p>
        </SeoContentSection>

        <SeoFaqSection
          title="東京短影片合輯常見問題"
          items={[
            { q: '第一次去東京先看哪支影片？', a: '先看東京區域影片，再看地鐵 vs JR 和地鐵券，最後看你抵達機場的交通影片。這樣比較不會一開始就被票券和景點清單打散。' },
            { q: '成田機場和羽田機場交通影片都要看嗎？', a: '不用。你飛哪個機場就看哪個。成田重點是距離遠、路線選擇多；羽田重點是離市區近，通常京急或單軌電車就能解決。' },
            { q: '東京地鐵券影片看完還需要看文章嗎？', a: '建議看。影片適合抓重點，文章會把 24/48/72 小時、使用範圍、什麼時候划算講得比較完整。' },
            { q: '景點影片看完要去哪裡買票？', a: '回到東京票券頁，用展望台、主題類、親子類、水族館或一日遊標籤找卡片，再比較 KKDAY、KLOOK、Trip。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
