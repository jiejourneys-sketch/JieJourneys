import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import type { CityCard } from '@/components/CityTabbedList'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '周遊券', label: '周遊券', dataArea: '周遊券' },
  { value: '主題樂園', label: '主題樂園', dataArea: '主題樂園' },
  { value: '水族館', label: '水族館', dataArea: '水族館' },
  { value: '展望台', label: '展望台', dataArea: '展望台' },
]

const cards: CityCard[] = [
  {
    title: '大阪周遊券 (Osaka Amazing Pass)',
    meta: '周遊券',
    area: '周遊券',
    datasetKey: 'title',
    datasetValue: '大阪周遊券',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/3791-osaka-amazing-pass?cid=22312', className: 'btn primary', event: 'osakaticket_pass_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/3049-osaka-amazing-pass-osaka/?aid=93798', className: 'btn', event: 'osakaticket_pass_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  {
    title: '關西廣域鐵路周遊券',
    meta: '周遊券',
    area: '周遊券',
    datasetKey: 'title',
    datasetValue: '關西廣域鐵路周遊券',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/2060-jr-kansai-wide-area-pass?cid=22312', className: 'btn primary', event: 'osakaticket_jrwide_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/6007-jr-kansai-wide-pass/?aid=93798', className: 'btn', event: 'osakaticket_jrwide_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  {
    title: '環球影城 USJ',
    meta: '主題樂園',
    area: '主題樂園',
    datasetKey: 'title',
    datasetValue: '環球影城 USJ',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/2892?cid=22312', className: 'btn primary', event: 'osakaticket_usj_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/625-universal-studios-japan-ticket-osaka/?aid=93798', className: 'btn', event: 'osakaticket_usj_klook', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/14419057/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7239738', className: 'btn', event: 'osakaticket_usj_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '海遊館',
    meta: '水族館',
    area: '水族館',
    datasetKey: 'title',
    datasetValue: '海遊館',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/11098-osaka-kaiyukan-aquarium-e-ticket?cid=22312', className: 'btn primary', event: 'osakaticket_kaiyukan_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/3316-kaiyukan-aquarium-ticket-osaka/?aid=93798', className: 'btn', event: 'osakaticket_kaiyukan_klook', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/10895009/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7239738', className: 'btn', event: 'osakaticket_kaiyukan_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '空中庭園展望台｜梅田藍天大廈',
    meta: '展望台',
    area: '展望台',
    datasetKey: 'title',
    datasetValue: '空中庭園展望台',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/19382-umeda-sky-building-floating-garden-observatory-ticket-osaka?cid=22312', className: 'btn primary', event: 'osakaticket_skygarden_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/4002-umeda-sky-building-floating-garden-observatory/?aid=93798', className: 'btn', event: 'osakaticket_skygarden_klook', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/8862576/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7239738', className: 'btn', event: 'osakaticket_skygarden_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
]

export default function OsakaTicketPage() {
  return (
    <>
      <CitySubpageHeader backHref="/osaka" eventPrefix="osakaticket" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="大阪自由行票券"
          h1="大阪票券總整理｜周遊券・USJ・海遊館・展望台快速比較"
          intro="把大阪常用票券用標籤分類整理，直接點選你需要的品項，比價後快速下單。"
          eventPrefix="osakaticket"
          showVisual={false}
          ctaLinks={[
            {
              label: '住宿推薦總整理',
              href: 'https://www.jiejourneys.com/osaka/hotel',
              dataEvent: 'osakaticket_allhotels',
              platform: 'hotel',
            },
            {
              label: '通訊&交通攻略',
              href: 'https://www.jiejourneys.com/osaka/transport',
              dataEvent: 'osakaticket_alltransport',
              platform: 'transport',
            },
          ]}
        />

        <h2 className="seo-h2" id="ticketListTitle">
          大阪票券推薦（周遊券、景點門票一次看懂）
        </h2>
        <CityTabbedList tabs={tabs} cards={cards} tabEvent="osaka_ticket_tab" />

        <SeoCtaSection text="" href="/osaka/map" linkText="大阪熱門景點地圖" newTab dataEvent="osakaticket_SEO_spotmap" />

        <SeoContentSection title="大阪票券快速理解">
          <h3 className="seo-h3">👉 大阪周遊券值得買嗎？</h3>
          <p>
            <strong>大阪周遊券（Osaka Amazing Pass）</strong>分 1 日券與 2 日券，包含<strong>大阪地鐵無限搭乘</strong>與多個景點免費入場（空中庭園展望台、天保山摩天輪等）。
            如果一天計劃跑 3 個以上含票景點，通常可以回本；純玩道頓堀、心齋橋等免費區域則不一定划算。
          </p>

          <h3 className="seo-h3">👉 USJ 票券怎麼買最划算？</h3>
          <p>
            環球影城（USJ）門票建議<strong>出發前購買</strong>，旺季現場排隊購票耗時且可能售罄。
            想玩哈利波特禁忌之旅、任天堂世界等熱門設施，旺季可以加購<strong>快速通關券（Express Pass）</strong>，省下等候時間。
          </p>

          <h3 className="seo-h3">👉 海遊館需要提前訂票嗎？</h3>
          <p>
            海遊館是世界規模前幾大的水族館，假日人多建議<strong>提前在線上購票</strong>，可省略現場排隊時間。
            大阪周遊券不含海遊館，需另外購票。
          </p>
        </SeoContentSection>

        <SeoFaqSection
          title="大阪票券常見問題"
          items={[
            { q: '大阪周遊券包含 USJ 嗎？', a: '不包含。USJ 需另外購票，旺季建議提前預購。大阪周遊券涵蓋市區大眾運輸與多個景點，但 USJ、海遊館不在其中。' },
            { q: '第一次去大阪，票券怎麼選？', a: '先確認主要景點再決定：一天跑 3 個以上付費景點可考慮大阪周遊券；只去 USJ 就單買 USJ 票；想省地鐵費可買 ICOCA 卡或地鐵 1 日券。' },
            { q: 'USJ 快速通關券值得買嗎？', a: '旺季（暑假、跨年、連假）強烈推薦，熱門設施等候可能超過 1–2 小時，快速通關可多玩 2–3 個設施。平日淡季可視現場情況決定。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}