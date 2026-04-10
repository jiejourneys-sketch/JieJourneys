import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '越南北越體驗', label: '越南北越體驗', dataArea: '越南北越體驗' },
  { value: '河內攻略', label: '河內攻略', dataArea: '河內攻略' },
  { value: '下龍灣攻略', label: '下龍灣攻略', dataArea: '下龍灣攻略' },
  { value: '陸龍灣攻略', label: '陸龍灣攻略', dataArea: '陸龍灣攻略' },
  { value: '沙壩攻略', label: '沙壩攻略', dataArea: '沙壩攻略' },
  { value: '行前準備', label: '行前準備', dataArea: '行前準備' },
]

const cards = [
  { title: '景點體驗', meta: '越南北越體驗', area: '越南北越體驗', datasetKey: 'video' as const, datasetValue: 'experience-attractions-overview', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DP1K5uMkfhy/', className: 'btn primary', event: 'northvietnamvideo_attractionIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/ryXABV_hxog', className: 'btn', event: 'northvietnamvideo_attractionYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/16xfYho7D1l', className: 'btn', event: 'northvietnamvideo_attractionXHS', platform: '小紅書', section: 'video' }] },
  { title: '美食體驗', meta: '越南北越體驗', area: '越南北越體驗', datasetKey: 'video' as const, datasetValue: 'experience-food-overview', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DP85OyrEd52/', className: 'btn primary', event: 'northvietnamvideo_foodIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/xZyXU8XyPsg', className: 'btn', event: 'northvietnamvideo_foodYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/YLVmDlfz7u', className: 'btn', event: 'northvietnamvideo_foodXHS', platform: '小紅書', section: 'video' }] },
  { title: '交通住宿體驗', meta: '越南北越體驗', area: '越南北越體驗', datasetKey: 'video' as const, datasetValue: 'experience-transport-hotel', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DQHMfk_EY-x/', className: 'btn primary', event: 'northvietnamvideo_transporthotelIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/2R9SE2KoEaY?si=39u_j-bZVeZF8iZi', className: 'btn', event: 'northvietnamvideo_transporthotelYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/9y1wfvkPv81', className: 'btn', event: 'northvietnamvideo_transporthotelXHS', platform: '小紅書', section: 'video' }] },
  { title: '越南北越最速攻略', meta: '越南北越體驗', area: '越南北越體驗', datasetKey: 'video' as const, datasetValue: 'northvietnam-fast-guide', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DQO63aIEaK3/', className: 'btn primary', event: 'northvietnamvideo_gonglueIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/0qthFCtOmpI?si=NM0_m4cHnOxKYRER', className: 'btn', event: 'northvietnamvideo_gonglueYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/2D6tZd2s92J', className: 'btn', event: 'northvietnamvideo_gonglueXHS', platform: '小紅書', section: 'video' }] },
  { title: '河內攻略｜上集', meta: '河內攻略', area: '河內攻略', datasetKey: 'video' as const, datasetValue: 'hanoi-guide-part1', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DQg8YLfEy8c/', className: 'btn primary', event: 'northvietnamvideo_Hanoi1IG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/z1tW-EeJ2hE?si=Tmq3TAvxhylmq_3D', className: 'btn', event: 'northvietnamvideo_Hanoi1YT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/6QOMc86DvKn', className: 'btn', event: 'northvietnamvideo_Hanoi1XHS', platform: '小紅書', section: 'video' }] },
  { title: '河內攻略｜下集', meta: '河內攻略', area: '河內攻略', datasetKey: 'video' as const, datasetValue: 'hanoi-guide-part2', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DQrPlqXkXiL/', className: 'btn primary', event: 'northvietnamvideo_Hanoi2IG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/VVpthVcEwHE?si=1R9kFMUFrdEt-1j-', className: 'btn', event: 'northvietnamvideo_Hanoi2YT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/6FApkEIjp63', className: 'btn', event: 'northvietnamvideo_Hanoi2XHS', platform: '小紅書', section: 'video' }] },
  { title: '河內古蹟', meta: '河內攻略', area: '河內攻略', datasetKey: 'video' as const, datasetValue: 'hanoi-heritage-spots', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DQy97hwkfGc/', className: 'btn primary', event: 'northvietnamvideo_HanoimonumentIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/VjnepKQgexA?si=QG2OUw_G9KRHYBCy', className: 'btn', event: 'northvietnamvideo_HanoimonumentYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/22ZLDHhl3qQ', className: 'btn', event: 'northvietnamvideo_HanoimonumentXHS', platform: '小紅書', section: 'video' }] },
  { title: '河內火車街', meta: '河內攻略', area: '河內攻略', datasetKey: 'video' as const, datasetValue: 'hanoi-train-street', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DQ9RIxgEaPv/', className: 'btn primary', event: 'northvietnamvideo_TrainstreetIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/qyWikRcJiuw?si=D9fHKp041L-YqCnq', className: 'btn', event: 'northvietnamvideo_TrainstreetYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/2RTUUVt0hP1', className: 'btn', event: 'northvietnamvideo_TrainstreetXHS', platform: '小紅書', section: 'video' }] },
  { title: '下龍灣景點', meta: '下龍灣攻略', area: '下龍灣攻略', datasetKey: 'video' as const, datasetValue: 'halongbay-scenic-spots', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DRE_h_TET0P/', className: 'btn primary', event: 'northvietnamvideo_HaLongBayIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/TMrTeSPH9TY?si=pAyc4FI2so86Mj3a', className: 'btn', event: 'northvietnamvideo_HaLongBayYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/22JHAnH3lpa', className: 'btn', event: 'northvietnamvideo_HaLongBayXHS', platform: '小紅書', section: 'video' }] },
  { title: '下龍灣郵輪', meta: '下龍灣攻略', area: '下龍灣攻略', datasetKey: 'video' as const, datasetValue: 'halongbay-cruise', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DRPStldE662/', className: 'btn primary', event: 'northvietnamvideo_HaLongBayCruiseIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/Ua9Q9E74xRk?si=yJLoedpPq6wJ9h3b', className: 'btn', event: 'northvietnamvideo_HaLongBayCruiseYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/6MkZi9DOOAU', className: 'btn', event: 'northvietnamvideo_HaLongBayCruiseXHS', platform: '小紅書', section: 'video' }] },
  { title: '六星級郵輪體驗', meta: '下龍灣攻略', area: '下龍灣攻略', datasetKey: 'video' as const, datasetValue: 'Sixstar-cruise', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DRXBH_2kSSh/', className: 'btn primary', event: 'northvietnamvideo_GrandpioneersIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/Z29MK6KABnw?si=h5yUEIPm1DuU4iQ0', className: 'btn', event: 'northvietnamvideo_GrandpioneersYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/5lBnaI2LyQ', className: 'btn', event: 'northvietnamvideo_GrandpioneersXHS', platform: '小紅書', section: 'video' }] },
  { title: '陸龍灣5個景點', meta: '陸龍灣攻略', area: '陸龍灣攻略', datasetKey: 'video' as const, datasetValue: 'NinhBình-Spot', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DRhUSOgEaZQ/', className: 'btn primary', event: 'northvietnamvideo_NinhBìnhSpotIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/QSyPtN3sqwE?si=Q88hbFN5C3NzC0V1', className: 'btn', event: 'northvietnamvideo_NinhBìnhSpotYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/4Qwlv9i3BMY', className: 'btn', event: 'northvietnamvideo_NinhBìnhSpotXHS', platform: '小紅書', section: 'video' }] },
  { title: '陸龍灣景點選擇', meta: '陸龍灣攻略', area: '陸龍灣攻略', datasetKey: 'video' as const, datasetValue: 'NinhBình-Choose', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DRpCoyiEUQs/', className: 'btn primary', event: 'northvietnamvideo_NinhBìnhChooseIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/L78C6HEgyqg?si=9vwMMaXZC4djgYEk', className: 'btn', event: 'northvietnamvideo_NinhBìnhChooseYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/A5SB4kcJ2QQ', className: 'btn', event: 'northvietnamvideo_NinhBìnhChooseXHS', platform: '小紅書', section: 'video' }] },
  { title: '龍雲玻璃天空步道', meta: '沙壩攻略', area: '沙壩攻略', datasetKey: 'video' as const, datasetValue: 'Sapa-Rongmay', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DRzV0bckSbY/', className: 'btn primary', event: 'northvietnamvideo_SapaRongmayIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/MGe10lGpqB0?si=gaLpYGhOYJm5jdoV', className: 'btn', event: 'northvietnamvideo_SapaRongmayYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/5Ox1Pds78Ed', className: 'btn', event: 'northvietnamvideo_SapaRongmayXHS', platform: '小紅書', section: 'video' }] },
  { title: '貓貓村', meta: '沙壩攻略', area: '沙壩攻略', datasetKey: 'video' as const, datasetValue: 'Sapa-CatCat', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DR7EOgwkT1w/', className: 'btn primary', event: 'northvietnamvideo_SapaCatCatIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/9dfixxKZ2V8?si=9c_wY72anjHHEIQc', className: 'btn', event: 'northvietnamvideo_SapaCatCatYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/3zl4O3nrbm4', className: 'btn', event: 'northvietnamvideo_SapaCatCatXHS', platform: '小紅書', section: 'video' }] },
  { title: '番西邦峰', meta: '沙壩攻略', area: '沙壩攻略', datasetKey: 'video' as const, datasetValue: 'Sapa-Fansipan', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DSFXWpxEWn1/', className: 'btn primary', event: 'northvietnamvideo_SapaFansipanIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/XdADfZpcSjk?si=14SE004dwhgrfVwc', className: 'btn', event: 'northvietnamvideo_SapaFansipanYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/2QTHBsdTvo6', className: 'btn', event: 'northvietnamvideo_SapaFansipanXHS', platform: '小紅書', section: 'video' }] },
  { title: '沙壩市區', meta: '沙壩攻略', area: '沙壩攻略', datasetKey: 'video' as const, datasetValue: 'Sapa-Moana', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DSNF0KWkfol/', className: 'btn primary', event: 'northvietnamvideo_SapaMoanaIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/Gq99qKJgUDg?si=LSj39b0CXgHACoKn', className: 'btn', event: 'northvietnamvideo_SapaMoanaYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/5XS53pAZbC6', className: 'btn', event: 'northvietnamvideo_SapaMoanaXHS', platform: '小紅書', section: 'video' }] },
  { title: '沙壩3天2夜最佳解', meta: '沙壩攻略', area: '沙壩攻略', datasetKey: 'video' as const, datasetValue: 'Sapa-Route', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DSXY7j9ESML/', className: 'btn primary', event: 'northvietnamvideo_SaparouteIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/-aQ8X_KTN7o', className: 'btn', event: 'northvietnamvideo_SaparouteYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/88wMpNyOSMD', className: 'btn', event: 'northvietnamvideo_SaparouteXHS', platform: '小紅書', section: 'video' }] },
  { title: '沙壩3種交通方式', meta: '沙壩攻略', area: '沙壩攻略', datasetKey: 'video' as const, datasetValue: 'Sapa-Transport', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DSfHYvuEVEW/', className: 'btn primary', event: 'northvietnamvideo_SapatransportIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/jvAutp4FnZY', className: 'btn', event: 'northvietnamvideo_SapatransportYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/1HgJc0fxIOA', className: 'btn', event: 'northvietnamvideo_SapatransportXHS', platform: '小紅書', section: 'video' }] },
  { title: '越南簽證申請', meta: '行前準備', area: '行前準備', datasetKey: 'video' as const, datasetValue: 'prep-vietnam-visa', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DPRHtCUkfer/', className: 'btn primary', event: 'northvietnamvideo_VisaIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/EyavS_sJv0c?si=-vHBuXQq8aOZfVBx', className: 'btn', event: 'northvietnamvideo_VisaYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/5mZs33422yT', className: 'btn', event: 'northvietnamvideo_VisaXHS', platform: '小紅書', section: 'video' }] },
  { title: '越南換匯', meta: '行前準備', area: '行前準備', datasetKey: 'video' as const, datasetValue: 'prep-vietnam-exchange', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DPY2Fp5Ef-4/', className: 'btn primary', event: 'northvietnamvideo_MoneyIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/oGGjHcgfu_Y?si=XpDrh5vj2l4Yd7p1', className: 'btn', event: 'northvietnamvideo_MoneyYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/102wlrrUryr', className: 'btn', event: 'northvietnamvideo_MoneyXHS', platform: '小紅書', section: 'video' }] },
  { title: '河內機場攻略', meta: '行前準備', area: '行前準備', datasetKey: 'video' as const, datasetValue: 'prep-hanoi-airport', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DPjJTCUEUCw/', className: 'btn primary', event: 'northvietnamvideo_AirportIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/JxJGlDEXqPg?si=6Y_2KzgriHAPiomU', className: 'btn', event: 'northvietnamvideo_AirportYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/4XbkhiWannU', className: 'btn', event: 'northvietnamvideo_AirportXHS', platform: '小紅書', section: 'video' }] },
  { title: '河內機場到市區', meta: '行前準備', area: '行前準備', datasetKey: 'video' as const, datasetValue: 'prep-airport-to-city', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DPq3qM5EWxh/', className: 'btn primary', event: 'northvietnamvideo_AirportToCityIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://youtube.com/shorts/tA6c2OnrMQ8?si=rXPIBTP911JxQYlI', className: 'btn', event: 'northvietnamvideo_AirportToCityYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/4wyCMYQDMQG', className: 'btn', event: 'northvietnamvideo_AirportToCityXHS', platform: '小紅書', section: 'video' }] },
]

export default function NorthVietnamVideoPage() {
  return (
    <>
      <CitySubpageHeader backHref="/northvietnam" eventPrefix="northvietnamvideo" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="北越短影片合輯"
          h1="北越短影片攻略｜河內・下龍灣・沙壩・陸龍灣快速掌握"
          intro="用短影片幫你搞懂北越自由行：各地怎麼玩、交通怎麼安排、行前準備要做什麼，切換標籤找到你需要的主題。"
          eventPrefix="northvietnamvideo"
          showVisual={false}
          ctaLinks={[
            { label: '北越住宿推薦', href: 'https://www.jiejourneys.com/northvietnam/hotel', dataEvent: 'northvietnamvideo_allhotels', platform: 'hotel' },
            { label: '北越票券總整理', href: 'https://www.jiejourneys.com/northvietnam/ticket', dataEvent: 'northvietnamvideo_alltickets', platform: 'ticket' },
            { label: '通訊&交通攻略', href: 'https://www.jiejourneys.com/northvietnam/transport', dataEvent: 'northvietnamvideo_alltransport', platform: 'transport' },
          ]}
        />

        <SeoCtaSection text="" href="#videoListTitle" linkText="直接看影片 ↓" />

        <SeoContentSection title="影片分類快速導覽">
          <h3 className="seo-h3">越南北越體驗總覽</h3>
          <p>景點、美食、交通住宿的整體體驗分享，第一次規劃北越行程的人先從這幾支看起，快速建立對河內、沙壩、下龍灣、陸龍灣的整體認識。</p>

          <h3 className="seo-h3">河內攻略</h3>
          <p>河內古城、火車街、古蹟景點的實拍攻略，分上下集完整帶你逛一圈。河內景點多但不好走路、交通混亂，影片幫你整理哪些地方值得排進行程、哪些可以跳過。</p>

          <h3 className="seo-h3">下龍灣攻略</h3>
          <p>下龍灣主要體驗是搭遊輪欣賞石灰岩島嶼，還可以參觀驚訝洞（鐘乳石洞）、登英雄島海灘、划小船穿梭灣內。建議安排兩天一夜比較不趕，從河內出發約兩小時可抵達碼頭。影片包含普通遊輪與六星級郵輪兩種體驗供參考。</p>

          <h3 className="seo-h3">陸龍灣攻略</h3>
          <p>陸龍灣主要景點有華閭古都（歷史遺跡）、白亭寺、長安/三谷（坐小船看河谷美景）、舞洞（爬山俯瞰河谷）。影片有5個景點介紹與選擇攻略，幫你比較不同玩法再做決定。</p>

          <h3 className="seo-h3">沙壩攻略</h3>
          <p>沙壩風景漂亮，貓貓村和番西邦峰是兩大亮點，但兩個都很耗體力，不建議排在同一天。從河內到沙壩最快也要6小時，交通分包車、臥舖巴士、臥舖火車三種，各有優缺。影片從景點到交通方式、3天2夜行程規劃一次整理。</p>

          <h3 className="seo-h3">行前準備</h3>
          <p>越南簽證建議越早申請越好，有時審核不通過需要多送幾次。此外還有換匯攻略、河內機場入境流程與機場到市區交通，把這幾支看完出發就不慌。</p>
        </SeoContentSection>

        <SeoCtaSection text="" href="/northvietnam/map" linkText="熱門景點地圖" newTab dataEvent="northvietnamvideo_SEO_spotmap" />

        <h2 className="seo-h2" id="videoListTitle">
          北越短影片合輯（依主題分類）
        </h2>
        <CityTabbedList tabs={tabs} cards={cards} tabEvent="northvietnam_video_tab" />

        <SeoFaqSection
          title="北越短影片合輯常見問題"
          items={[
            { q: '第一次去北越看哪支影片最有用？', a: '建議先看「越南北越最速攻略」建立整體概念，再依你想去的地區（河內、下龍灣、沙壩）切換標籤找對應影片深入了解。' },
            { q: '沙壩值得去嗎？', a: '沙壩適合喜歡自然風景、健行、慢旅行的人。影片有完整的景點比較和行程建議，可先看「沙壩3天2夜最佳解」和「3種交通方式」再決定。' },
            { q: '越南簽證要注意什麼？', a: '建議越早申請越好，有時審核會不通過，需要多送幾次，所以不要等到出發前才申請。影片有完整的簽證申請流程教學可以參考。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
