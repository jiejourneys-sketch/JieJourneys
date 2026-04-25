import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '通訊', label: '通訊', dataArea: '通訊' },
  { value: '河內交通', label: '河內交通', dataArea: '河內交通' },
  { value: '沙壩交通', label: '沙壩交通', dataArea: '沙壩交通' },
  { value: '下龍灣交通', label: '下龍灣交通', dataArea: '下龍灣交通' },
  { value: '陸龍灣交通', label: '陸龍灣交通', dataArea: '陸龍灣交通' },
]

const cards = [
  { title: 'eSIM卡', meta: '通訊', area: '通訊', datasetKey: 'title' as const, datasetValue: 'eSIM卡', actions: [{ label: '合作eSIM', href: 'https://esimconnect.com.tw/#/access/esimbuy?region=%E8%B6%8A%E5%8D%97&referencecode=jiejourneys', className: 'btn primary recommend', event: 'northvietnamtransport_esimconnect', platform: 'connect', section: 'comm_card', promoCode: 'jiejourneys' }, { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/146719-5-6-7-day-unlimited-data-esim-vietnam?cid=22312', className: 'btn', event: 'northvietnamtransport_esimKKday', platform: 'KKDAY', section: 'comm_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/123902-vietnam-esim-high-speed-internet-qr-code-voucher/?aid=93798', className: 'btn', event: 'northvietnamtransport_esimKLOOK', platform: 'KLOOK', section: 'comm_card' }] },
  { title: 'SIM卡｜郵寄到府', meta: '通訊', area: '通訊', datasetKey: 'title' as const, datasetValue: 'SIM卡｜郵寄到府', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/153022?cid=22312', className: 'btn primary', event: 'northvietnamtransport_SimhomeKKday', platform: 'KKDAY', section: 'comm_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/98253-south-east-asia-sim-card/?aid=93798', className: 'btn', event: 'northvietnamtransport_SimhomeKLOOK', platform: 'KLOOK', section: 'comm_card' }] },
  { title: 'SIM卡｜河內機場(HAN)領取', meta: '通訊', area: '通訊', datasetKey: 'title' as const, datasetValue: 'SIM卡｜河內機場(HAN)領取', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/149742?cid=22312', className: 'btn primary', event: 'northvietnamtransport_SimHANKKday', platform: 'KKDAY', section: 'comm_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/84066-3g-4g-sim-card-vietnam-noi-bai-airport/?aid=93798', className: 'btn', event: 'northvietnamtransport_SimHANKLOOK', platform: 'KLOOK', section: 'comm_card' }] },
  { title: '河內機場 ⇄ 河內市區｜包車', meta: '河內交通', area: '河內交通', datasetKey: 'title' as const, datasetValue: '河內機場 ⇄ 河內市區｜包車', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/100815-noi-bai-airport-private-transfer-to-downtown-ha-noi?cid=22312', className: 'btn primary', event: 'northvietnamtransport_HanoiCarKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/airport-transfers/service/han-noi-bai-international-airport/?aid=93798', className: 'btn', event: 'northvietnamtransport_HanoiCarKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '河內 ⇄ 沙壩｜包車', meta: '沙壩交通', area: '沙壩交通', datasetKey: 'title' as const, datasetValue: '河內 ⇄ 沙壩｜包車', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/27770-ha-noi-sapa-round-trip-transfer-by-sleeper-bus?cid=22312', className: 'btn primary', event: 'northvietnamtransport_SapaCarKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/6363-private-city-transfer-hanoi-other-areas/?aid=93798', className: 'btn', event: 'northvietnamtransport_SapaCarKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '河內 ⇄ 沙壩｜臥鋪巴士', meta: '沙壩交通', area: '沙壩交通', datasetKey: 'title' as const, datasetValue: '河內 ⇄ 沙壩｜臥鋪巴士', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/153323-hanoi-sapa-sleeper-bus-ticket-vietnam?cid=22312', className: 'btn primary', event: 'northvietnamtransport_SapaBusKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/133909-hanoi-sapa-sleeper-bus-by-hk-buslines/?aid=93798', className: 'btn', event: 'northvietnamtransport_SapaBusKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '河內 ⇄ 老街 (沙壩)｜臥舖火車', meta: '沙壩交通', area: '沙壩交通', datasetKey: 'title' as const, datasetValue: '河內 ⇄ 老街 (沙壩)｜臥舖火車', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/152771-premiere-sleeper-train-ticket-hanoi-sapa?cid=22312', className: 'btn primary', event: 'northvietnamtransport_SapaTrainKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/22928-viet-nam-rail-deluxe-train-sapa-hanoi/?aid=93798', className: 'btn', event: 'northvietnamtransport_SapaTrainKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '老街 ⇄ 沙壩｜包車/共乘', meta: '沙壩交通', area: '沙壩交通', datasetKey: 'title' as const, datasetValue: '老街 ⇄ 沙壩｜包車/共乘', actions: [{ label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/127301-lao-cai-sapa-shared-or-private-transfer-to-lao-cai-train-station/?aid=93798', className: 'btn primary', event: 'northvietnamtransport_LaocaiKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '河內 ⇄ 下龍灣｜包車', meta: '下龍灣交通', area: '下龍灣交通', datasetKey: 'title' as const, datasetValue: '河內 ⇄ 下龍灣｜包車', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/128577?cid=22312', className: 'btn primary', event: 'northvietnamtransport_HalongbayCarKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/6363-private-city-transfer-hanoi-other-areas/?aid=93798', className: 'btn', event: 'northvietnamtransport_HalongbayCarKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '河內 ⇄ 下龍灣｜共乘', meta: '下龍灣交通', area: '下龍灣交通', datasetKey: 'title' as const, datasetValue: '河內 ⇄ 下龍灣｜共乘', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/10470-limousine-transfer-between-ha-noi-and-ha-long-bay?cid=22312', className: 'btn primary', event: 'northvietnamtransport_HalongbayBusKKday', platform: 'KKDAY', section: 'transport_card' }] },
  { title: '河內 ⇄ 陸龍灣｜包車', meta: '陸龍灣交通', area: '陸龍灣交通', datasetKey: 'title' as const, datasetValue: '河內 ⇄ 陸龍灣｜包車', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/128575-hanoi-ninh-binh-car-charter-vietnam?cid=22312', className: 'btn primary', event: 'northvietnamtransport_TrangAnCarKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/6363-private-city-transfer-hanoi-other-areas/?aid=93798', className: 'btn', event: 'northvietnamtransport_TrangAnCarKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '河內 ⇄ 陸龍灣｜共乘', meta: '陸龍灣交通', area: '陸龍灣交通', datasetKey: 'title' as const, datasetValue: '河內 ⇄ 陸龍灣｜共乘', actions: [{ label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/76802-shared-limousine-to-ninh-binh-from-ha-noi-and-vice-versa/?aid=93798', className: 'btn primary', event: 'northvietnamtransport_TrangAnBusKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
]

export default function NorthVietnamTransportPage() {
  return (
    <>
      <CitySubpageHeader backHref="/northvietnam" eventPrefix="northvietnamtransport" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="越南北越自由行工具"
          h1="北越通訊 & 交通｜eSIM、河內往各地交通一次整理"
          intro="把北越自由行常用的通訊與城市間交通整理在同一頁，切換標籤找到你需要的選項，比較後直接下單。"
          eventPrefix="northvietnamtransport"
          showVisual={false}
          ctaLinks={[
            { label: '北越短影片攻略', href: 'https://www.jiejourneys.com/northvietnam/video', dataEvent: 'northvietnamtransport_allvideos', platform: 'video' },
            { label: '北越住宿推薦', href: 'https://www.jiejourneys.com/northvietnam/hotel', dataEvent: 'northvietnamtransport_allhotels', platform: 'hotel' },
            { label: '北越票券總整理', href: 'https://www.jiejourneys.com/northvietnam/ticket', dataEvent: 'northvietnamtransport_alltickets', platform: 'ticket' },
          ]}
        />

        <h2 className="seo-h2" id="transportListTitle">
          北越通訊與交通整理（依類別分類）
        </h2>
        <CityTabbedList tabs={tabs} cards={cards} tabEvent="northvietnam_transport_tab" />

        <SeoCtaSection text="" href="/northvietnam/map" linkText="北越熱門景點地圖" newTab dataEvent="northvietnamtransport_SEO_spotmap" />

        <SeoContentSection title="北越通訊 & 交通怎麼選？">
          <h3 className="seo-h3">通訊方案：eSIM vs SIM卡</h3>
          <p>越南 eSIM 覆蓋率高，出發前設定好、抵達後直接使用，是最省事的方案；SIM 卡可在河內機場（HAN）領取，適合不支援 eSIM 的手機。市區移動推薦用 Grab（東南亞版Uber），計費透明、不怕被宰。</p>

          <h3 className="seo-h3">河內 → 沙壩</h3>
          <p>臥鋪巴士是最常見選擇，約 6 小時直達沙壩市區，價格實惠；臥鋪火車到老街車站後再轉包車/共乘到沙壩，適合喜歡火車體驗的旅客；包車最舒適，適合多人分攤費用。</p>

          <h3 className="seo-h3">河內 → 下龍灣</h3>
          <p>下龍灣通常直接訂含接送的遊輪行程，遊輪方會從河內酒店接客；若自行前往，可訂包車或共乘接駁，單程約 2 小時。</p>

          <h3 className="seo-h3">河內 → 陸龍灣（寧平）</h3>
          <p>陸龍灣多為一日來回，從河內包車或共乘，車程約 2 小時。不一定要住宿，可當天往返。</p>
        </SeoContentSection>

        <SeoFaqSection
          title="北越通訊交通常見問題"
          items={[
            { q: '北越自由行通訊怎麼辦？', a: '建議購買越南 eSIM，出發前設定好即可使用；也可在河內機場領取實體 SIM 卡。市區叫車推薦用 Grab APP，比路邊攔車安全且費用透明。' },
            { q: '河內到沙壩最推薦哪種交通方式？', a: '臥鋪巴士最方便，直達沙壩市區；臥鋪火車體驗感較好但需在老街站換車；多人同行可評估包車。' },
            { q: '河內機場到市區怎麼去最安全？回程怎麼安排？', a: '建議事前在 KKDAY 或 KLOOK 訂好包車接送，司機會在出口等你、費用透明。用 Grab 叫車雖然方便，但從機場出發有時會被加收過路費，費用不固定，預訂包車比較省心。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
