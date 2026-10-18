import HotelQuickGuide, { type HotelQuickGuideScenario } from '@/components/HotelQuickGuide'
import { tokyoHotelCards } from '@/data/tokyo'

const stayScenarios: HotelQuickGuideScenario[] = [
  {
    id: 'narita-first-trip',
    label: '成田進出／第一次東京',
    area: '上野',
    tabValue: '上野站',
    summary: 'Skyliner 進市區直覺，東側景點也好安排。',
    note: '如果每天都要跑新宿、澀谷，住西側會更省交通時間。',
    hotels: [
      { title: '東京上野諾加上飯店', reason: '第一次住上野，位置與舒適度均衡' },
      { title: '上野御徒町多美迎飯店', reason: '重視大浴場、宵夜與 CP 值' },
      { title: '&Here 東京上野', reason: '親子、多人或需要較大空間' },
    ],
  },
  {
    id: 'budget-old-town',
    label: '預算優先／傳統街區',
    area: '淺草',
    tabValue: '淺草寺',
    summary: '住宿相對好控制預算，適合淺草、上野與晴空塔行程。',
    note: '沒有 JR；如果西東京行程多，地鐵轉乘次數會增加。',
    hotels: [
      { title: '淺草雷門竹之宿旅館', reason: '安靜、交通方便，價格取向均衡' },
      { title: '東京淺草遠東鄉村飯店', reason: '乾淨簡單，適合小資旅行' },
      { title: '里士滿淺草國際飯店', reason: '商圈中心，逛街與用餐方便' },
    ],
  },
  {
    id: 'rail-ginza',
    label: '新幹線／銀座／行程分散',
    area: '東京車站',
    tabValue: '東京車站',
    summary: '適合跨區移動、搭新幹線或把銀座排進主要行程。',
    note: '整體房價較高；若每天都在西東京活動，不必為了站名硬住這裡。',
    hotels: [
      { title: '東京丸之內大都會飯店', reason: '東京站旁，交通與高樓景觀兼顧' },
      { title: '東京京橋雷姆飯店', reason: '機能完整，往銀座與東京站都方便' },
      { title: '唐草飯店東京站', reason: '親子友善，靠近八重洲口' },
    ],
  },
  {
    id: 'shopping-fuji',
    label: '購物夜生活／富士山',
    area: '新宿',
    tabValue: '新宿站',
    summary: '西東京交通核心，逛街、夜生活與河口湖行程都順。',
    note: '新宿站很大，拖行李時要特別確認出口與飯店所在方向。',
    hotels: [
      { title: 'JR九州飯店 Blossom 新宿', reason: '近車站，交通與住宿品質均衡' },
      { title: '小田急世紀南悅飯店', reason: '南口、高樓景觀與機場巴士方便' },
      { title: 'WPÜ飯店新宿', reason: '預算優先但仍想住在新宿核心' },
    ],
  },
  {
    id: 'harajuku-nightlife',
    label: '原宿表參道／夜晚熱鬧',
    area: '澀谷',
    tabValue: '涉谷站',
    summary: '潮流購物、原宿與表參道是主軸，晚上也不想太早回飯店。',
    note: '熱門日期房價高，怕吵的人要留意飯店和主要商圈的距離。',
    hotels: [
      { title: '澀谷溪流酒店', reason: '位置方便，房間與整體質感均衡' },
      { title: '澀谷東急卓越大飯店', reason: '靠近車站，第一次住澀谷較直覺' },
      { title: '澀谷飯店EN', reason: '想住澀谷並優先控制預算' },
    ],
  },
]

export default function TokyoHotelQuickGuide() {
  return (
    <HotelQuickGuide
      scenarios={stayScenarios}
      cards={tokyoHotelCards}
      eventPrefix="tokyohotel"
      badge="30 秒住宿決策"
      title="先回答需求，再看三間飯店"
      description="不用先讀完所有飯店。選一個最接近的旅行情境，我會先幫你縮小到適合的區域與三個選擇。"
    />
  )
}
