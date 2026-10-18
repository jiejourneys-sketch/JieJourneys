import HotelQuickGuide, { type HotelQuickGuideScenario } from '@/components/HotelQuickGuide'
import type { CityCard } from '@/components/CityTabbedList'

const stayScenarios: HotelQuickGuideScenario[] = [
  {
    id: 'kix-first-trip',
    label: '關西機場／第一次大阪',
    area: '道頓堀／難波',
    tabValue: '道頓堀/難波',
    summary: '南海電鐵可直達難波，晚上吃飯、購物和逛道頓堀都直覺。',
    note: '難波站體很大；訂房前要確認靠南海、地下鐵、JR 還是 OCAT。',
    hotels: [
      { title: '大阪瑞士南海飯店', reason: '南海難波站樓上，機場進出最省力' },
      { title: '大阪皇家古典飯店', reason: '站旁設計飯店，位置與質感兼顧' },
      { title: '日和飯店大阪難波站前', reason: '靠近南海難波，交通與價格較均衡' },
    ],
  },
  {
    id: 'shopping-cafe',
    label: '購物／咖啡／晚上逛街',
    area: '心齋橋',
    tabValue: '心齋橋',
    summary: '百貨、商店街與美國村集中，白天跑景點、晚上購物最順。',
    note: '心齋橋到難波可步行，但拖行李時仍要留意飯店離地鐵出口的距離。',
    hotels: [
      { title: '大阪日航飯店', reason: '心齋橋站直通，移動與購物最輕鬆' },
      { title: 'MIMARU 大阪心齋橋 WEST', reason: '親子、多人與連住需求更合適' },
      { title: 'HOTEL THE FLAG 心齋橋', reason: '重視設計感，也想靠近商店街' },
    ],
  },
  {
    id: 'kansai-day-trips',
    label: '京都神戶／跨城市移動',
    area: '梅田／大阪站',
    tabValue: '梅田/大阪站',
    summary: 'JR、阪急與阪神路線集中，把大阪當作關西旅行基地最有效率。',
    note: '車站與地下街範圍很大；要確認飯店位於大阪站哪一側，減少拖行李繞路。',
    hotels: [
      { title: '阪急大阪龍仕柏飯店', reason: '大阪站旁商場樓上，親子購物都方便' },
      { title: '大阪格蘭比亞飯店', reason: 'JR 大阪站直結，跨城市移動最省力' },
      { title: '大阪梅田Intergate飯店', reason: '大浴場與點心服務，住宿機能完整' },
    ],
  },
  {
    id: 'value-airport',
    label: '預算優先／機場交通',
    area: '天王寺',
    tabValue: '天王寺',
    summary: '房價通常比難波、梅田好控制，HARUKA 往返關西機場也方便。',
    note: '如果每天主要逛難波、心齋橋，仍需搭地鐵往返，宵夜便利度較低。',
    hotels: [
      { title: '大阪萬豪都酒店', reason: '高樓景觀與交通都強，想升級住宿首選' },
      { title: '大阪天王寺都城市飯店', reason: 'JR 天王寺站連通，生活機能完整' },
      { title: 'VIA INN 阿倍野天王寺', reason: '預算較好抓，採買與車站都方便' },
    ],
  },
  {
    id: 'usj-family',
    label: 'USJ 早入園／親子',
    area: '環球影城',
    tabValue: '環球影城',
    summary: '把樂園日的交通與體力留給玩樂，適合早入園、親子或連玩兩天。',
    note: '如果只玩一天且其他行程都在市中心，整趟都住園區旁未必最有效率。',
    hotels: [
      { title: '環球影城前飯店', reason: '就在 USJ 門口，早入園與親子最省力' },
      { title: 'LIBER HOTEL 大阪', reason: '櫻島站旁，想要大浴場與較完整住宿感' },
    ],
  },
]

type Props = {
  cards: CityCard[]
}

export default function OsakaHotelQuickGuide({ cards }: Props) {
  return (
    <HotelQuickGuide
      scenarios={stayScenarios}
      cards={cards}
      eventPrefix="osakahotel"
      badge="30 秒住宿決策"
      title="先選旅行動線，再看適合飯店"
      description="從機場進出、跨城市移動、購物或環球影城需求出發，先縮小住宿區域，再比較真正適合的飯店。"
    />
  )
}
