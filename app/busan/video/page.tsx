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
        { label: '小紅書', href: 'https://xhslink.com/o/Afwwt6vbBcq', className: 'btn', event: 'busanvideo_suitableXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/8OJPt7iurEH', className: 'btn', event: 'busanvideo_goodvsbadXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/2RYtrtA2yTU', className: 'btn', event: 'busanvideo_goodvsbadfoodXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/5H7XNWErVN8', className: 'btn', event: 'busanvideo_gonglue1XHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/4BhS0NKboYQ', className: 'btn', event: 'busanvideo_gonglue2XHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/7tpySmrFK2M', className: 'btn', event: 'busanvideo_nanpu1XHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/14X5o08d827', className: 'btn', event: 'busanvideo_nanpu2XHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/2aUewZPzJ9U', className: 'btn', event: 'busanvideo_xiaowangziXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/9rE8N60xj96', className: 'btn', event: 'busanvideo_towerXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/Bt9siwbllz', className: 'btn', event: 'busanvideo_haiyuntaiXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/4JILJiyezmL', className: 'btn', event: 'busanvideo_SkycapXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/8B2iEV9P095', className: 'btn', event: 'busanvideo_YachtXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/6GMt6r34xoA', className: 'btn', event: 'busanvideo_5prepareXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/7C7nTIpO8gw', className: 'btn', event: 'busanvideo_earrivalXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/Y3KqLBooSA', className: 'btn', event: 'busanvideo_ketaXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/2ZXIOZhpkUP', className: 'btn', event: 'busanvideo_currencyXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/n23KDIzNFN', className: 'btn', event: 'busanvideo_powerbankXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/1RAg32kAWXa', className: 'btn', event: 'busanvideo_lotteXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/6pvpm14xKAn', className: 'btn', event: 'busanvideo_PDFXHS', platform: '小紅書', section: 'video' },
      ],
    },
    {
      title: '釜山通行證重點',
      meta: '釜山通行證',
      area: '釜山通行證',
      datasetKey: 'video',
      datasetValue: 'pass-24-48-3-5',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DUDiZzQkdUe/', className: 'btn primary', event: 'busanvideo_pass2026', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/ppTGbWXDM0k', className: 'btn', event: 'busanvideo_pass2026YT', platform: 'YouTube', section: 'video' },
        { label: '小紅書', href: 'https://xhslink.com/o/6QHeZo5sDIU', className: 'btn', event: 'busanvideo_pass2026XHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/Acl0InJBYX', className: 'btn', event: 'busanvideo_shitikaXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/3FDCBVxXvBI', className: 'btn', event: 'busanvideo_24hrXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/3F9AZrkzSsZ', className: 'btn', event: 'busanvideo_48hrXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/360E8ch54PQ', className: 'btn', event: 'busanvideo_skycapKKdayXHS', platform: '小紅書', section: 'video' },
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
        { label: '小紅書', href: 'https://xhslink.com/o/1oBgYLxzIKk', className: 'btn', event: 'busanvideo_skycapOffXHS', platform: '小紅書', section: 'video' },
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

        <SeoCtaSection text="" href="#videoListTitle" linkText="直接看影片 ↓" />

        <section className="seo-content" aria-label="快速理解摘要">
          <h2 className="seo-h2">釜山自由行快速理解</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">釜山好不好玩</h3>
            <p>
              海景＋膠囊列車為主，節奏舒服好拍。同時有購物（彩妝）＋美食（烤肉 / 海鮮 / 糖餅）
            </p>

            <h3 className="seo-h3">區域怎麼分</h3>
            <p>
            <a
                href="https://www.instagram.com/reels/DK4dIqzzJBE/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_SEOsandaqu"
              >
                <strong>三大區</strong></a>：南浦洞 / 海雲台 / 西面
              <br />
              <a
                href="https://www.instagram.com/reels/DLCwV2yzbSv/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_SEO_sanxiaoqu" 
              >
                <strong>三小區</strong></a>：松島 / 廣安里 / 樂天世界
                <br />
            </p>

            <h3 className="seo-h3">必玩重點</h3>
            <p>
              1. 南浦洞：BIFF糖餅、扎嘎其海鮮、<a
                href="https://www.instagram.com/reels/DL408o_ze1X/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_SEO_ganchuan"
              >
                <strong>甘川洞看小王子</strong>
              </a>、<a
                href="https://www.instagram.com/reels/DMKh_XmzOdG/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_SEO_fushantower"
              >
                <strong>釜山塔</strong>
              </a>、逛市場
              <br />
              2. <a
                href="https://www.instagram.com/reels/DLuh1WzzM0c/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_SEO_haiyuntai"
              >
                <strong>海雲台</strong>
              </a>：海灘＋海雲台大道＋
              <a
                href="https://www.instagram.com/reels/DMu5uZxTdO8/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_SEOcapsule"
              >
                <strong>膠囊列車</strong>
              </a>
              （<a
                href="https://www.kkday.com/zh-tw/product/123012-haeundae-blueline-park-sky-capsule-beach-train-ticket?cid=22312"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_SEO_capsulekkday"
              >
                <strong>購票</strong>
              </a>）→ 可搭配青沙浦踏石、韓版灌籃高手平交道
              <br />
              3. 西面：最中心，交通方便，適合住宿＋逛街
            </p>

            <h3 className="seo-h3">其他景點</h3>
            <p>
              1.  松島：海景纜車
              <br />
              2. 廣安里：看廣安大橋夜景＋無人機(<a
                href="https://www.gwangallimdrone.co.kr/en/information"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_SEO_wurenji"
              >
                <strong>演出表</strong></a>)＋<a
                href="https://www.instagram.com/reels/DVTW_MLkpj4/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_SEO_youting"
              >
                <strong>遊艇</strong>
              </a>
              <br />
              3. 樂天世界：遊樂園＋斜坡滑車＋海東龍宮寺
            </p>

            <h3 className="seo-h3">行前準備</h3>
            <p>
              出發前3天填
              <a
                href="https://www.instagram.com/reels/DKMrn6dzS4G/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_SEO_earrival"
              >
                <strong>電子入境卡</strong>
              </a>(<a
                href="https://www.e-arrivalcard.go.kr/portal/main/index.do"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_SEO_earrivalofficial"
              >
                <strong>官網</strong>
              </a>)
              ＋搞懂
              <a
                href="https://www.instagram.com/reels/DUDiZzQkdUe/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_SEO_pass"
              >
                <strong>釜山通行證</strong>
              </a>
            </p>

            <h3 className="seo-h3">釜山通行證 (<a
                href="https://www.kkday.com/zh-tw/product/138477-visit-busan-pass-discount-free-attractions?cid=22312"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_SEO_passkkday"
              >
                <strong>購票</strong></a>)</h3>
            <p>
              分24/48小時與Big3/Big5，多數人直接選48小時最划算。<a
                href="https://www.google.com/maps/d/u/0/viewer?mid=1XsSQewsHL9iIolJLr7wTnD0bz44jOIs&ll=35.17357693392983%2C129.08391349999997&z=11"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanvideo_SEO_passmap"
              >
                <strong>釜山通行證地圖</strong>
              </a>
            </p>

          </div>
        </section>

        <SeoCtaSection text="" href="/busan/map" linkText="釜山熱門景點地圖" newTab dataEvent="busanvideo_SEO_spotmap" />

        <h2 className="seo-h2" id="videoListTitle">
          釜山短影片合輯（依主題分類）
        </h2>

        <CityTabbedList tabs={tabs} cards={cards} tabEvent="video_tab" />

        <SeoFaqSection
          title="釜山短影片合輯常見問題"
          items={[
            { q: '第一次去釜山看哪支影片最有用？', a: '建議先看「認識釜山」和「景點攻略」，先建立行程框架，再依景點興趣挑海雲台、南浦洞、甘川洞等細節影片。' },
            {
              q: '釜山Pass真的划算嗎？',
              a: (
                <>
                  影片有詳細的24小時和48小時走法比較，以及景點限制說明。建議先看完「釜山通行證重點」；基本上多數人最後都會買 48 小時，建議用
                  <a
                    href="https://www.kkday.com/zh-tw/product/138477-visit-busan-pass-discount-free-attractions?cid=22312"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="busanvideo_faq_pass_kkday"
                  >
                    <strong>KKDAY</strong>
                  </a>{' '}
                  /{' '}
                  <a
                    href="https://www.klook.com/zh-TW/activity/81576-visit-busan-pass/?aid=93798"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="busanvideo_faq_pass_klook"
                  >
                    <strong>KLOOK</strong>
                  </a>{' '}
                  /{' '}
                  <a
                    href="https://tw.trip.com/things-to-do/detail/50618334?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="busanvideo_faq_pass_trip"
                  >
                    <strong>Trip</strong>
                  </a>購買。
                </>
              ),
            },
            {
              q: '膠囊列車怎麼訂最方便？',
              a: (
                <>
                  建議提前訂票，熱門時段很容易滿。你可以用{' '}
                  <a
                    href="https://www.kkday.com/zh-tw/product/123012-haeundae-blueline-park-sky-capsule-beach-train-ticket?cid=22312"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="busanvideo_faq_capsule_kkday"
                  >
                    <strong>KKDAY</strong>
                  </a>{' '}
                  /{' '}
                  <a
                    href="https://www.klook.com/zh-TW/activity/133293-haeundae-blueline-park-ticket-in-busan/?aid=93798"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="busanvideo_faq_capsule_klook"
                  >
                    <strong>KLOOK</strong>
                  </a>{' '}
                  /{' '}
                  <a
                    href="https://tw.trip.com/travel-guide/attraction/busan/haeundae-blueline-park-131154386/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="busanvideo_faq_capsule_trip"
                  >
                    <strong>Trip</strong>
                  </a>{' '}
                  訂票。
                </>
              ),
            },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
