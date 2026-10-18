import type { CityCard } from '@/components/CityTabbedList'
import TicketQuickGuide, { type TicketQuickGuideScenario } from '@/components/TicketQuickGuide'

const ticketScenarios: TicketQuickGuideScenario[] = [
  {
    id: 'visit-busan-pass',
    label: '多景點／Pass',
    category: '釜山 Pass',
    tabValue: '票券',
    summary: '一天會去多個付費景點，再用 Pass 涵蓋清單估算是否比較省。',
    note: 'Pass 有時數與景點版本差異；先排行程，再確認各景點是否涵蓋及是否需預約。',
    listLinkLabel: '查看釜山 Pass 與完整票券 ↓',
    tickets: [
      { title: '釜山通行證(釜山Pass)', reason: '先看版本、使用時間與涵蓋景點' },
      { title: '樂天世界', reason: '大型付費景點，適合拿來評估 Pass 價值' },
      { title: '釜山 X the Sky 展望台', reason: '海雲台代表景點，可搭配附近行程' },
    ],
  },
  {
    id: 'haeundae-seaside',
    label: '海雲台／海景',
    category: '海雲台海景體驗',
    tabValue: '未涵蓋',
    summary: '膠囊列車、水族館與遊艇各自需要時間，選一至兩個主角比較剛好。',
    note: '膠囊列車熱門時段容易額滿；遊艇則要看碼頭位置、航程時間與天候規則。',
    listLinkLabel: '查看全部 Pass 未涵蓋景點 ↓',
    tickets: [
      { title: '膠囊列車&海岸列車', reason: '海雲台至青沙浦的代表海岸體驗' },
      { title: 'SEA LIFE 釜山水族館門票', reason: '海雲台室內景點，親子或雨天好安排' },
      { title: 'Yacht Holic｜水營灣遊艇', reason: '想看廣安大橋與夜景，可獨立安排' },
    ],
  },
  {
    id: 'busan-day-trip',
    label: '釜山經典／一日遊',
    category: '釜山市區一日遊',
    tabValue: '一日遊',
    summary: '想一天串東西兩側景點，用固定接送減少研究轉乘與拖行李的時間。',
    note: '先比較東部與西部各站停留時間；同時包含太多景點時，每站通常只能短暫拍照。',
    tickets: [
      { title: '甘川文化村+白淺灘文化村+海東龍宮寺/膠囊列車/海岸列車/青沙浦踏石展望台', reason: '釜山東西兩側的經典組合' },
      { title: '甘川文化村+膠囊列車/海岸列車+海東龍宮寺+青沙浦踏石展望台+南浦洞+聯合國紀念公墓', reason: '加入南浦洞與歷史景點' },
      { title: '甘川文化村+膠囊列車+遊艇+白淺灘文化村+海東龍宮寺+青沙浦踏石展望台+五六島天空步道', reason: '海景體驗最多，但行程也最滿' },
    ],
  },
  {
    id: 'gyeongju-day-trip',
    label: '慶州／一日遊',
    category: '慶州古都一日遊',
    tabValue: '一日遊',
    summary: '想看佛國寺、古陵與夜景，可直接從釜山出發，不必另外研究城際交通。',
    note: '慶州行程通常較長，先確認回到釜山的時間，以及東宮與月池是否安排在入夜後。',
    tickets: [
      { title: '海東龍宮寺+膠囊列車+佛國寺+大陵苑+皇理團路+東宮與月池', reason: '釜山東部再接慶州代表景點' },
      { title: '佛國寺+大陵苑+皇理團路+慶州校村+東宮與月池+月精橋', reason: '經典古都與夜景路線' },
      { title: '佛國寺+大陵苑+皇理團路+慶州良洞村+東宮與月池+月精橋', reason: '加入傳統村落，文化主題更完整' },
    ],
  },
]

export default function BusanTicketQuickGuide({ cards }: { cards: CityCard[] }) {
  return (
    <TicketQuickGuide
      scenarios={ticketScenarios}
      cards={cards}
      eventPrefix="busanticket"
      badge="30 秒票券決策"
      title="先分清楚 Pass、海景與一日遊"
      description="市區 Pass、海雲台單點票與跨區一日遊的用途不同；先選玩法，再比較商品。"
    />
  )
}
