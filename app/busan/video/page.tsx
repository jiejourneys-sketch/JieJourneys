import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import type { CityCard } from '@/components/CityTabbedList'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'

export default function BusanVideoPage() {
  const tabs = [
    { value: 'all', label: '全部', dataArea: 'all' },
    { value: '認識釜山', label: '認識釜山', dataArea: '認識釜山' },
    { value: '景點攻略', label: '景點攻略', dataArea: '景點攻略' },
    { value: '行前準備', label: '行前準備', dataArea: '行前準備' },
    { value: '釜山通行證', label: '釜山通行證', dataArea: '釜山通行證' },
  ]

  const cards: CityCard[] = [
    {
      title: '韓國釜山｜適合你？',
      meta: '認識釜山',
      area: '認識釜山',
      datasetKey: 'video',
      datasetValue: 'intro-is-busan-for-you',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DObDFXuEZFE/', className: 'btn primary', event: 'busanvideo_suitableIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/eYMppYSyIqE', className: 'btn', event: 'busanvideo_suitableYT', platform: 'YouTube', section: 'video' },
      ],
    },
    {
      title: '印象篇｜好 vs 壞',
      meta: '認識釜山',
      area: '認識釜山',
      datasetKey: 'video',
      datasetValue: 'first-impressions-pros-cons',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DO_GKX3kY0F/', className: 'btn primary', event: 'busanvideo_goodvsbadIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/a0hXPor4PfI', className: 'btn', event: 'busanvideo_goodvsbadYT', platform: 'YouTube', section: 'video' },
      ],
    },
    {
      title: '美食篇｜好 vs 壞',
      meta: '認識釜山',
      area: '認識釜山',
      datasetKey: 'video',
      datasetValue: 'food-pros-cons',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DPG0jR5ElNi/', className: 'btn primary', event: 'busanvideo_goodvsbadfoodIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/CZY0NzKSnOY', className: 'btn', event: 'busanvideo_goodvsbadfoodYT', platform: 'YouTube', section: 'video' },
      ],
    },
    {
      title: '最速攻略｜上集',
      meta: '景點攻略',
      area: '景點攻略',
      datasetKey: 'video',
      datasetValue: 'fast-guide-part-1',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DK4dIqzzJBE/', className: 'btn primary', event: 'busanvideo_gonglue1IG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/r19k0otvGVE', className: 'btn', event: 'busanvideo_gonglue1YT', platform: 'YouTube', section: 'video' },
        { label: '文章', href: '/busan/busan-fast-guide?from=busan-video', className: 'btn', event: 'busanvideo_gonglue1_article', platform: 'article', section: 'video' },
      ],
    },
    {
      title: '最速攻略｜下集',
      meta: '景點攻略',
      area: '景點攻略',
      datasetKey: 'video',
      datasetValue: 'fast-guide-part-2',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DLCwV2yzbSv/', className: 'btn primary', event: 'busanvideo_gonglue2IG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/Mtn35FzOeis', className: 'btn', event: 'busanvideo_gonglue2YT', platform: 'YouTube', section: 'video' },
        { label: '文章', href: '/busan/busan-fast-guide?from=busan-video', className: 'btn', event: 'busanvideo_gonglue2_article', platform: 'article', section: 'video' },
      ],
    },
    {
      title: '南浦洞｜上集',
      meta: '景點攻略',
      area: '景點攻略',
      datasetKey: 'video',
      datasetValue: 'nampo-part-1',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DLKer30zmDd/', className: 'btn primary', event: 'busanvideo_nanpu1IG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/wN0KHurau78', className: 'btn', event: 'busanvideo_nanpu1YT', platform: 'YouTube', section: 'video' },
        { label: '文章', href: '/busan/nampo-dong-guide?from=busan-video', className: 'btn', event: 'busanvideo_nampo1_article', platform: 'article', section: 'video' },
      ],
    },
    {
      title: '南浦洞｜下集',
      meta: '景點攻略',
      area: '景點攻略',
      datasetKey: 'video',
      datasetValue: 'nampo-part-2',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DLeby5yTVTm/', className: 'btn primary', event: 'busanvideo_nanpu2IG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/R8bRLgm5HEA', className: 'btn', event: 'busanvideo_nanpu2YT', platform: 'YouTube', section: 'video' },
        { label: '文章', href: '/busan/nampo-dong-guide?from=busan-video', className: 'btn', event: 'busanvideo_nampo2_article', platform: 'article', section: 'video' },
      ],
    },
    {
      title: '甘川洞文化村',
      meta: '景點攻略',
      area: '景點攻略',
      datasetKey: 'video',
      datasetValue: 'gamcheon-culture-village',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DL408o_ze1X/', className: 'btn primary', event: 'busanvideo_xiaowangziIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/RZREPyNT-Fo', className: 'btn', event: 'busanvideo_xiaowangziYT', platform: 'YouTube', section: 'video' },
        { label: '文章', href: '/busan/gamcheon-culture-village-guide?from=busan-video', className: 'btn', event: 'busanvideo_gamcheon_article', platform: 'article', section: 'video' },
      ],
    },
    {
      title: '釜山塔',
      meta: '景點攻略',
      area: '景點攻略',
      datasetKey: 'video',
      datasetValue: 'busan-tower',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DMKh_XmzOdG/', className: 'btn primary', event: 'busanvideo_towerIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/e3-R4YEj7Cw', className: 'btn', event: 'busanvideo_towerYT', platform: 'YouTube', section: 'video' },
        { label: '文章', href: '/busan/busan-tower-guide?from=busan-video', className: 'btn', event: 'busanvideo_tower_article', platform: 'article', section: 'video' },
      ],
    },
    {
      title: '海雲台',
      meta: '景點攻略',
      area: '景點攻略',
      datasetKey: 'video',
      datasetValue: 'haeundae',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DLuh1WzzM0c/', className: 'btn primary', event: 'busanvideo_haiyuntaiIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/T0aTv6PPxMQ', className: 'btn', event: 'busanvideo_haiyuntaiYT', platform: 'YouTube', section: 'video' },
        { label: '文章', href: '/busan/haeundae-guide?from=busan-video', className: 'btn', event: 'busanvideo_haeundae_article', platform: 'article', section: 'video' },
      ],
    },
    {
      title: '膠囊列車',
      meta: '景點攻略',
      area: '景點攻略',
      datasetKey: 'video',
      datasetValue: 'capsule-train',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DMu5uZxTdO8/', className: 'btn primary', event: 'busanvideo_SkycapIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/NojyZ8jfvD4', className: 'btn', event: 'busanvideo_SkycapYT', platform: 'YouTube', section: 'video' },
        { label: '文章', href: '/busan/capsule-train-guide?from=busan-video', className: 'btn', event: 'busanvideo_capsule_article', platform: 'article', section: 'video' },
      ],
    },
    {
      title: '水營灣 VS 鑽石灣｜遊艇',
      meta: '景點攻略',
      area: '景點攻略',
      datasetKey: 'video',
      datasetValue: 'yacht',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DVTW_MLkpj4/', className: 'btn primary', event: 'busanvideo_YachtIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/N56k5869RVw', className: 'btn', event: 'busanvideo_YachtYT', platform: 'YouTube', section: 'video' },
        { label: '文章', href: '/busan/busan-yacht-suyeong-diamond-bay?from=video', className: 'btn', event: 'busanvideo_yacht_article', platform: 'article', section: 'video' },
      ],
    },
    {
      title: '5個行前準備',
      meta: '行前準備',
      area: '行前準備',
      datasetKey: 'video',
      datasetValue: 'prep-5-tips',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DOixfbBEaCL/', className: 'btn primary', event: 'busanvideo_5prepareIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/6K3yI0WrO9k', className: 'btn', event: 'busanvideo_5prepareYT', platform: 'YouTube', section: 'video' },
        { label: '文章', href: '/busan/busan-preparation-guide?from=busan-video', className: 'btn', event: 'busanvideo_5prepareArticle', platform: 'article', section: 'video' },
      ],
    },
    {
      title: '電子入境卡',
      meta: '行前準備',
      area: '行前準備',
      datasetKey: 'video',
      datasetValue: 'korea-e-arrival-card',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DKMrn6dzS4G/', className: 'btn primary', event: 'busanvideo_earrivalIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/L_FmuAzoGzM', className: 'btn', event: 'busanvideo_earrivalYT', platform: 'YouTube', section: 'video' },
        { label: '文章', href: '/busan/korea-e-arrival-card-guide?from=busan-video', className: 'btn', event: 'busanvideo_earrivalArticle', platform: 'article', section: 'video' },
      ],
    },
    {
      title: 'K-ETA是否要申請？',
      meta: '行前準備',
      area: '行前準備',
      datasetKey: 'video',
      datasetValue: 'keta-need-or-not',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DKetNmXTW3E/', className: 'btn primary', event: 'busanvideo_ketaIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/AXevOEDDzB0', className: 'btn', event: 'busanvideo_ketaYT', platform: 'YouTube', section: 'video' },
        { label: '文章', href: '/busan/k-eta-guide?from=busan-video', className: 'btn', event: 'busanvideo_ketaArticle', platform: 'article', section: 'video' },
      ],
    },
    {
      title: '韓幣怎麼換？',
      meta: '行前準備',
      area: '行前準備',
      datasetKey: 'video',
      datasetValue: 'currency-exchange',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DKetKpgTvd7/', className: 'btn primary', event: 'busanvideo_currencyIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/ROLLp6mm5p8', className: 'btn', event: 'busanvideo_currencyYT', platform: 'YouTube', section: 'video' },
      ],
    },
    {
      title: '行動電源規定',
      meta: '行前準備',
      area: '行前準備',
      datasetKey: 'video',
      datasetValue: 'powerbank-rules',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DKmbjKIzsAT/', className: 'btn primary', event: 'busanvideo_powerbankIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/e_7nNXvRhzw', className: 'btn', event: 'busanvideo_powerbankYT', platform: 'YouTube', section: 'video' },
      ],
    },
    {
      title: '樂天超市｜會員申請',
      meta: '行前準備',
      area: '行前準備',
      datasetKey: 'video',
      datasetValue: 'lotte-mart-membership',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DKwurF0Te2B/', className: 'btn primary', event: 'busanvideo_lotteIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/-CMAajmCatg', className: 'btn', event: 'busanvideo_lotteYT', platform: 'YouTube', section: 'video' },
      ],
    },
    {
      title: '5天4夜終極攻略',
      meta: '行前準備',
      area: '行前準備',
      datasetKey: 'video',
      datasetValue: '5d4n-ultimate-route',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DOQv5njkT4I/', className: 'btn primary', event: 'busanvideo_PDFIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/jFq8fhtV4qg', className: 'btn', event: 'busanvideo_PDFYT', platform: 'YouTube', section: 'video' },
      ],
    },
    {
      title: '釜山通行證重點',
      meta: '釜山通行證',
      area: '釜山通行證',
      datasetKey: 'video',
      datasetValue: 'pass-24-48-3-5',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DUDiZzQkdUe/', className: 'btn primary', event: 'busanvideo_pass_ig', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/ppTGbWXDM0k', className: 'btn', event: 'busanvideo_pass_youtube', platform: 'YouTube', section: 'video' },
        { label: '文章', href: '/busan/visit-busan-pass?from=video', className: 'btn', event: 'busanvideo_pass_article', platform: 'article', section: 'video' },
      ],
    },
    {
      title: '選擇重點｜實體 vs 電子',
      meta: '釜山通行證',
      area: '釜山通行證',
      datasetKey: 'video',
      datasetValue: 'paper-vs-e',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DN-uWhB4gI2/', className: 'btn primary', event: 'busanvideo_shitikaIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/rdT-NNXjR-c', className: 'btn', event: 'busanvideo_shitikaYT', platform: 'YouTube', section: 'video' },
      ],
    },
    {
      title: '24小時極限走法',
      meta: '釜山通行證',
      area: '釜山通行證',
      datasetKey: 'video',
      datasetValue: 'pass-24h-route',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DOJBfeBEdwN/', className: 'btn primary', event: 'busanvideo_24hrIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/e2aeNYmKc38', className: 'btn', event: 'busanvideo_24hrYT', platform: 'YouTube', section: 'video' },
        { label: '文章', href: '/busan/visit-busan-pass-24h-route?from=busan-video', className: 'btn', event: 'busanvideo_24hr_article', platform: 'article', section: 'video' },
      ],
    },
    {
      title: '48小時走法',
      meta: '釜山通行證',
      area: '釜山通行證',
      datasetKey: 'video',
      datasetValue: 'pass-48h-route',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DO0y_wnEUa9/', className: 'btn primary', event: 'busanvideo_48hrIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/kuU-6nMmR4Y', className: 'btn', event: 'busanvideo_48hrYT', platform: 'YouTube', section: 'video' },
        { label: '文章', href: '/busan/visit-busan-pass-48h-route?from=busan-video', className: 'btn', event: 'busanvideo_48hr_article', platform: 'article', section: 'video' },
      ],
    },
    {
      title: '平台｜膠囊列車訂票',
      meta: '釜山通行證',
      area: '釜山通行證',
      datasetKey: 'video',
      datasetValue: 'capsule-platform',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DNIpqn1TE0k/', className: 'btn primary', event: 'busanvideo_skycapKKdayIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/kSCoYLXAMUA', className: 'btn', event: 'busanvideo_skycapKKdayYT', platform: 'YouTube', section: 'video' },
      ],
    },
    {
      title: '官網｜膠囊列車訂票',
      meta: '釜山通行證',
      area: '釜山通行證',
      datasetKey: 'video',
      datasetValue: 'capsule-official',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DNarLsDTe2F/', className: 'btn primary', event: 'busanvideo_skycapOffIG', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/yoQdWHM6rbY', className: 'btn', event: 'busanvideo_skycapOffYT', platform: 'YouTube', section: 'video' },
      ],
    },
  ]

  return (
    <>
      <CitySubpageHeader backHref="/busan" eventPrefix="busanvideo" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="短影片合輯"
          h1="釜山短影片攻略｜快速找到適合你的玩法"
          intro="這頁有所有短影片連結，讓你用最快速度找到要看的那一支。"
          eventPrefix="busanvideo"
          showVisual={false}
          ctaLinks={[
            {
              label: '釜山住宿推薦',
              href: 'https://www.jiejourneys.com/busan/hotel',
              dataEvent: 'busanvideo_allhotels',
              platform: 'hotel',
            },
            {
              label: '釜山票券總整理',
              href: 'https://www.jiejourneys.com/busan/ticket',
              dataEvent: 'busanvideo_alltickets',
              platform: 'ticket',
            },
            {
              label: '通訊&交通攻略',
              href: 'https://www.jiejourneys.com/busan/transport',
              dataEvent: 'busanvideo_alltransport',
              platform: 'transport',
            },
          ]}
        />

        <h2 className="seo-h2" id="videoListTitle">
          釜山短影片合輯（依主題分類）
        </h2>

        <CityTabbedList tabs={tabs} cards={cards} tabEvent="video_tab" collapseVideoActions />

        <SeoCtaSection text="" href="/busan/map" linkText="釜山熱門景點地圖" newTab dataEvent="busanvideo_SEO_spotmap" />
        <SeoCtaSection text="" href="/busan/pass-map" linkText="釜山通行證地圖" newTab dataEvent="busanvideo_SEO_passmap" />

        <section className="seo-content" aria-label="釜山短影片完整攻略">
          <h2 className="seo-h2">釜山短影片怎麼看：先抓區域，再排景點</h2>
          <div className="seo-prose">
            <p>
              釜山不是把景點塞越多越好，重點是先把城市切成幾個區域：南浦洞看舊市區、市場和甘川洞；海雲台看海景、藍線公園和膠囊列車；西面適合住宿、轉乘和逛街；廣安里則留給夜景、無人機和遊艇。影片可以先看總覽，再挑區域補細節，排起來會順很多。
            </p>

            <h3 className="seo-h3">建議觀看順序</h3>
            <ol>
              <li>
                先看
                <a
                  href="https://www.instagram.com/reel/DObDFXuEZFE/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="busanvideo_article_suitable_ig"
                  data-platform="IG"
                  data-section="article"
                >
                  <strong>韓國釜山｜適合你？</strong>
                </a>
                ，確認釜山是不是你喜歡的旅行節奏。
              </li>
              <li>
                接著看
                <a
                  href="https://www.instagram.com/reel/DK4dIqzzJBE/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="busanvideo_article_fastguide1_ig"
                  data-platform="IG"
                  data-section="article"
                >
                  <strong>最速攻略上集</strong>
                </a>
                和
                <a
                  href="https://www.instagram.com/reel/DLCwV2yzbSv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="busanvideo_article_fastguide2_ig"
                  data-platform="IG"
                  data-section="article"
                >
                  <strong>最速攻略下集</strong>
                </a>
                ，再搭配
                <a
                  href="/busan/busan-fast-guide?from=busan-video"
                  data-event="busanvideo_article_fastguide_article"
                  data-platform="article"
                  data-section="article"
                >
                  <strong>釜山最速攻略文字版</strong>
                </a>
                ，先把南浦洞、海雲台、西面、廣安里、松島、樂天世界這些位置關係抓起來。
              </li>
              <li>
                決定住宿區後，再回頭看南浦洞、海雲台、膠囊列車、遊艇、釜山通行證和行前準備影片。
              </li>
            </ol>

            <h3 className="seo-h3">第一次釜山自由行，區域這樣理解</h3>
            <table>
              <thead>
                <tr>
                  <th>區域</th>
                  <th>適合安排</th>
                  <th>先看影片</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>南浦洞 / 舊市區</td>
                  <td>市場、美食、甘川洞、釜山塔、松島，適合排在同一天或相鄰兩天。</td>
                  <td>
                    <a
                      href="https://www.instagram.com/reel/DLKer30zmDd/"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-event="busanvideo_article_nampo1_ig"
                      data-platform="IG"
                      data-section="article"
                    >
                      <strong>南浦洞上集</strong>
                    </a>
                    、
                    <a
                      href="https://www.instagram.com/reel/DLeby5yTVTm/"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-event="busanvideo_article_nampo2_ig"
                      data-platform="IG"
                      data-section="article"
                    >
                      <strong>南浦洞下集</strong>
                    </a>
                    、
                    <a
                      href="/busan/nampo-dong-guide?from=busan-video"
                      data-event="busanvideo_article_nampo_guide"
                      data-platform="article"
                      data-section="article"
                    >
                      <strong>南浦洞完整攻略</strong>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>海雲台 / 東釜山</td>
                  <td>海雲台海灘、藍線公園、膠囊列車、青沙浦、海東龍宮寺、樂天世界一帶。</td>
                  <td>
                    <a
                      href="https://www.instagram.com/reel/DLuh1WzzM0c/"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-event="busanvideo_article_haeundae_ig"
                      data-platform="IG"
                      data-section="article"
                    >
                      <strong>海雲台</strong>
                    </a>
                    、
                    <a
                      href="/busan/haeundae-guide?from=busan-video"
                      data-event="busanvideo_article_haeundae_guide"
                      data-platform="article"
                      data-section="article"
                    >
                      <strong>海雲台完整攻略</strong>
                    </a>
                    、
                    <a
                      href="https://www.instagram.com/reel/DMu5uZxTdO8/"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-event="busanvideo_article_capsule_ig"
                      data-platform="IG"
                      data-section="article"
                    >
                      <strong>膠囊列車</strong>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>西面</td>
                  <td>市中心轉乘、逛街、住宿基地。想東西兩邊都跑，住西面通常最平均。</td>
                  <td>
                    <a
                      href="https://www.instagram.com/reel/DK4dIqzzJBE/"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-event="busanvideo_article_seomyeon_ig"
                      data-platform="IG"
                      data-section="article"
                    >
                      <strong>最速攻略上集</strong>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>廣安里</td>
                  <td>廣安大橋夜景、週六無人機表演、遊艇。晚上來最有感。</td>
                  <td>
                    <a
                      href="https://www.instagram.com/reel/DVTW_MLkpj4/"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-event="busanvideo_article_yacht_ig"
                      data-platform="IG"
                      data-section="article"
                    >
                      <strong>遊艇影片</strong>
                    </a>
                    、
                    <a
                      href="/busan/busan-yacht-suyeong-diamond-bay?from=video"
                      data-event="busanvideo_article_yacht_article"
                      data-platform="article"
                      data-section="article"
                    >
                      <strong>遊艇完整攻略</strong>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>

            <h3 className="seo-h3">南浦洞：市場、甘川洞、釜山塔一起排</h3>
            <p>
              南浦洞很適合第一次去釜山的人，因為景點密度高，吃東西、逛市場、搭車去甘川洞文化村都方便。甘川洞本身是山坡上的彩色聚落，適合留時間慢慢拍照、走巷弄；看完可以回南浦洞接釜山塔或市場。先看
              <a
                href="https://www.instagram.com/reel/DL408o_ze1X/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_article_gamcheon_ig"
                data-platform="IG"
                data-section="article"
              >
                <strong>甘川洞文化村</strong>
              </a>
              和
              <a
                href="https://www.instagram.com/reel/DMKh_XmzOdG/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_article_tower_ig"
                data-platform="IG"
                data-section="article"
              >
                <strong>釜山塔</strong>
              </a>
              ，再用
              <a
                href="/busan/map"
                data-event="busanvideo_article_spotmap"
                data-platform="internal"
                data-section="article"
              >
                <strong>釜山熱門景點地圖</strong>
              </a>
              看它們的位置，會比單看清單更好排。
            </p>

            <h3 className="seo-h3">海雲台：膠囊列車要先決定時間</h3>
            <p>
              海雲台這區的重點不是只去海灘，而是把海雲台海灘、藍線公園、天空膠囊列車、青沙浦沿線一起想。膠囊列車熱門時段很容易滿，官方訂票通常會提前開放一段時間，現場票也可能售完；如果你想拍順光或夕陽，建議先把膠囊列車時間固定，再回推海雲台和青沙浦的停留時間。
            </p>
            <p>
              訂票可以看
              <a
                href="https://www.instagram.com/reel/DNIpqn1TE0k/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_article_capsule_platform_ig"
                data-platform="IG"
                data-section="article"
              >
                <strong>平台訂票影片</strong>
              </a>
              、
              <a
                href="https://www.instagram.com/reel/DNarLsDTe2F/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_article_capsule_official_ig"
                data-platform="IG"
                data-section="article"
              >
                <strong>官網訂票影片</strong>
              </a>
              ，實際購票連結則放這裡：
              <a
                href="https://www.kkday.com/zh-tw/product/123012-haeundae-blueline-park-sky-capsule-beach-train-ticket?cid=22312"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_article_capsule_kkday"
                data-platform="KKDAY"
                data-section="article"
              >
                <strong>KKDAY</strong>
              </a>
              、
              <a
                href="https://www.klook.com/zh-TW/activity/133293-haeundae-blueline-park-ticket-in-busan/?aid=93798"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_article_capsule_klook"
                data-platform="KLOOK"
                data-section="article"
              >
                <strong>KLOOK</strong>
              </a>
              。
            </p>

            <h3 className="seo-h3">廣安里：夜景、無人機、遊艇放同一晚</h3>
            <p>
              廣安里最適合晚上去，海灘正對廣安大橋，週六還能搭配無人機表演。我的排法會把晚餐、海邊散步、無人機、遊艇放在同一晚，行程感會比白天特地跑一趟更完整。無人機時間可以先看
              <a
                href="https://www.gwangallimdrone.co.kr/en/overview"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_article_drone_official"
                data-platform="official"
                data-section="article"
              >
                <strong>演出資訊</strong>
              </a>
              ，遊艇則先看
              <a
                href="/busan/busan-yacht-suyeong-diamond-bay?from=video"
                data-event="busanvideo_article_yacht_compare"
                data-platform="article"
                data-section="article"
              >
                <strong>水營灣 VS 鑽石灣</strong>
              </a>
              ，再決定要拍照煙火感，還是想用釜山通行證。
            </p>

            <h3 className="seo-h3">釜山通行證：先算景點，不要先買票</h3>
            <p>
              釜山通行證有 24 / 48 小時，也有 Big 3 / Big 5。限時型適合把付費景點集中玩，限制型適合只挑幾個高單價景點。我的做法是先把想去的景點標在地圖上，再看它們能不能排成順路的一天或兩天；如果只是零散用，很容易沒有想像中划算。
            </p>
            <p>
              可以先看
              <a
                href="https://www.instagram.com/reel/DUDiZzQkdUe/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_article_pass_ig"
                data-platform="IG"
                data-section="article"
              >
                <strong>釜山通行證重點</strong>
              </a>
              ，再接
              <a
                href="/busan/visit-busan-pass?from=video"
                data-event="busanvideo_article_pass_article"
                data-platform="article"
                data-section="article"
              >
                <strong>通行證完整攻略</strong>
              </a>
              和
              <a
                href="/busan/pass-map"
                data-event="busanvideo_article_passmap"
                data-platform="internal"
                data-section="article"
              >
                <strong>釜山通行證地圖</strong>
              </a>
              。要買的話，連結放這裡：
              <a
                href="https://www.kkday.com/zh-tw/product/138477-visit-busan-pass-discount-free-attractions?cid=22312"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_article_pass_kkday"
                data-platform="KKDAY"
                data-section="article"
              >
                <strong>KKDAY</strong>
              </a>
              、
              <a
                href="https://www.klook.com/zh-TW/activity/81576-visit-busan-pass/?aid=93798"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_article_pass_klook"
                data-platform="KLOOK"
                data-section="article"
              >
                <strong>KLOOK</strong>
              </a>
              、
              <a
                href="https://tw.trip.com/things-to-do/detail/50618334?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_article_pass_trip"
                data-platform="Trip"
                data-section="article"
              >
                <strong>Trip</strong>
              </a>
              。
            </p>

            <h3 className="seo-h3">行前準備：把文件、現金、電源先處理好</h3>
            <p>
              行前準備不用複雜，但有幾件事最好出發前先確認：電子入境卡通常可在入境前 3 天內線上填寫；K-ETA 是否需要要依國籍和當下規定確認；韓幣可以先抓一部分現金；行動電源則要留意航空公司和機場規定。影片可以照
              <a
                href="https://www.instagram.com/reel/DKMrn6dzS4G/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_article_earrival_ig"
                data-platform="IG"
                data-section="article"
              >
                <strong>電子入境卡</strong>
              </a>
              、
              <a
                href="https://www.instagram.com/reel/DKetNmXTW3E/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_article_keta_ig"
                data-platform="IG"
                data-section="article"
              >
                <strong>K-ETA是否要申請</strong>
              </a>
              、
              <a
                href="https://www.instagram.com/reel/DKetKpgTvd7/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_article_currency_ig"
                data-platform="IG"
                data-section="article"
              >
                <strong>韓幣怎麼換</strong>
              </a>
              、
              <a
                href="https://www.instagram.com/reel/DKmbjKIzsAT/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_article_powerbank_ig"
                data-platform="IG"
                data-section="article"
              >
                <strong>行動電源規定</strong>
              </a>
              這個順序看。
            </p>
          </div>
        </section>

        <SeoFaqSection
          title="釜山短影片合輯常見問題"
          items={[
            {
              q: '第一次去釜山，先看哪幾支影片？',
              a: '先看「韓國釜山｜適合你？」和兩支「最速攻略」，再依住宿區補南浦洞、海雲台、膠囊列車、廣安里遊艇和釜山通行證。這樣比較不會一開始就被景點清單打散。',
            },
            {
              q: '釜山住宿選哪區最方便？',
              a: '第一次去可以先想行程重心。想逛市場、甘川洞、舊市區就選南浦洞；想看海、搭膠囊列車就選海雲台；想東西兩邊都跑、重視交通和逛街就選西面。',
            },
            {
              q: '釜山通行證真的划算嗎？',
              a: (
                <>
                  要看你能不能把高單價景點集中在同一天或兩天。建議先看
                  <a
                    href="/busan/visit-busan-pass?from=video"
                    data-event="busanvideo_faq_pass_article"
                    data-platform="article"
                    data-section="faq"
                  >
                    <strong>通行證完整攻略</strong>
                  </a>
                  和
                  <a
                    href="/busan/pass-map"
                    data-event="busanvideo_faq_passmap"
                    data-platform="internal"
                    data-section="faq"
                  >
                    <strong>通行證地圖</strong>
                  </a>
                  ，再用
                  <a
                    href="https://www.kkday.com/zh-tw/product/138477-visit-busan-pass-discount-free-attractions?cid=22312"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="busanvideo_faq_pass_kkday"
                    data-platform="KKDAY"
                    data-section="faq"
                  >
                    <strong>KKDAY</strong>
                  </a>
                  、
                  <a
                    href="https://www.klook.com/zh-TW/activity/81576-visit-busan-pass/?aid=93798"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="busanvideo_faq_pass_klook"
                    data-platform="KLOOK"
                    data-section="faq"
                  >
                    <strong>KLOOK</strong>
                  </a>
                  或
                  <a
                    href="https://tw.trip.com/things-to-do/detail/50618334?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="busanvideo_faq_pass_trip"
                    data-platform="Trip"
                    data-section="faq"
                  >
                    <strong>Trip</strong>
                  </a>
                  購買。
                </>
              ),
            },
            {
              q: '膠囊列車要買官方還是平台？',
              a: (
                <>
                  如果你要搶熱門時段，可以先看官網訂票邏輯；如果想中文介面或付款方便，就看平台票。連結可以用
                  <a
                    href="https://www.kkday.com/zh-tw/product/123012-haeundae-blueline-park-sky-capsule-beach-train-ticket?cid=22312"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="busanvideo_faq_capsule_kkday"
                    data-platform="KKDAY"
                    data-section="faq"
                  >
                    <strong>KKDAY</strong>
                  </a>
                  或
                  <a
                    href="https://www.klook.com/zh-TW/activity/133293-haeundae-blueline-park-ticket-in-busan/?aid=93798"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="busanvideo_faq_capsule_klook"
                    data-platform="KLOOK"
                    data-section="faq"
                  >
                    <strong>KLOOK</strong>
                  </a>
                  。
                </>
              ),
            },
            {
              q: '廣安里遊艇和無人機怎麼排？',
              a: '建議排同一晚。先吃晚餐，再看廣安大橋夜景；如果是週六，確認無人機表演時間後，把遊艇放在前後銜接。想拍照和煙火感看水營灣，想用釜山通行證就看鑽石灣。',
            },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
