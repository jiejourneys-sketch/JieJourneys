import HotelQuickGuide, { type HotelQuickGuideScenario } from '@/components/HotelQuickGuide'
import type { CityCard } from '@/components/CityTabbedList'

const stayScenarios: HotelQuickGuideScenario[] = [
  {
    id: 'first-trip-transfers',
    label: '第一次京都／行李跨城',
    area: '京都車站',
    tabValue: '京都車站',
    summary: '新幹線、JR、地下鐵與巴士集中，往大阪、奈良或機場都省力。',
    note: '中央口與八條口位於車站兩側；訂房前要確認出口，避免拖行李繞路。',
    hotels: [
      { title: '京都比偲奇飯店', reason: '八條口近，重視大浴場與便利性' },
      { title: '京都格蘭比亞大酒店', reason: '車站直結，行李與跨城市移動最省力' },
      { title: 'MIMARU 京都站', reason: '親子、多人與公寓式房型需求' },
    ],
  },
  {
    id: 'shopping-gion',
    label: '逛街美食／祇園散步',
    area: '河原町・祇園',
    tabValue: '河原町・祇園',
    summary: '錦市場、鴨川、祇園與百貨都在生活圈，晚上吃飯逛街最方便。',
    note: '旺季人潮多、房價較高；前往京都站多半需要搭巴士或轉乘。',
    hotels: [
      { title: 'GOOD NATURE HOTEL KYOTO', reason: '河原町站與高島屋旁，購物最方便' },
      { title: 'THE GATE HOTEL 京都高瀨川 by HULIC', reason: '高瀨川景觀與市中心質感兼顧' },
      { title: 'HOTEL THE CELESTINE 京都祇園', reason: '想走祇園、建仁寺與傳統街區' },
    ],
  },
  {
    id: 'design-quiet-center',
    label: '設計旅宿／安靜市中心',
    area: '烏丸・市中心',
    tabValue: '烏丸・市中心',
    summary: '兼顧地下鐵、市中心交通與較安靜的夜晚，設計型住宿選擇也多。',
    note: '景點不像京都站或河原町那麼集中，選房時要先確認靠四條、五條或烏丸御池。',
    hotels: [
      { title: 'Richmond Hotel Premier 京都四條', reason: '超市、四條烏丸與日常機能完整' },
      { title: 'Hotel Kanra Kyoto', reason: '町家設計與檜木浴缸，京都感更強' },
      { title: 'Ace Hotel Kyoto', reason: '喜歡建築、咖啡與新風館生活圈' },
    ],
  },
]

type Props = {
  cards: CityCard[]
}

export default function KyotoHotelQuickGuide({ cards }: Props) {
  return (
    <HotelQuickGuide
      scenarios={stayScenarios}
      cards={cards}
      eventPrefix="kyotonarahotel"
      badge="30 秒住宿決策"
      title="先選每天動線，再看適合飯店"
      description="從行李與跨城市移動、晚上逛街，或設計旅宿需求出發，先選住宿區域，再比較真正適合的飯店。"
      listAnchorId="guideListTitle"
    />
  )
}
