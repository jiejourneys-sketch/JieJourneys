import type { CityCard } from '@/components/CityTabbedList'
import TicketQuickGuide, { type TicketQuickGuideScenario } from '@/components/TicketQuickGuide'

const ticketScenarios: TicketQuickGuideScenario[] = [
  {
    id: 'amazing-pass',
    label: '市區景點／周遊券',
    category: '大阪周遊券',
    tabValue: '周遊券',
    summary: '一天會跑多個付費景點，再考慮用周遊券整合門票與交通。',
    note: '如果主要逛街、吃東西或只去一個付費景點，不一定要為了回本塞滿行程。',
    listLinkLabel: '查看大阪周遊券與完整說明 ↓',
    tickets: [
      { title: '大阪周遊券 (Osaka Amazing Pass)', reason: '先確認使用日期、版本與涵蓋範圍' },
      { title: '通天閣 Dive＆Walk', reason: '新世界行程常見的周遊券涵蓋選擇' },
      { title: '大阪城 天守閣', reason: '大阪城區域順遊，適合市區景點日' },
    ],
  },
  {
    id: 'theme-park',
    label: 'USJ／主題樂園',
    category: '主題樂園',
    tabValue: '周遊券未涵蓋景點',
    summary: '環球影城門票與快速通關是不同商品，先決定日期再看是否需要加購。',
    note: '大阪周遊券不包含 USJ；快速通關也不能代替入園門票，購買前要核對方案。',
    listLinkLabel: '查看全部周遊券未涵蓋景點 ↓',
    tickets: [
      { title: '日本環球影城', reason: '入園基本門票，確定日期後優先處理' },
      { title: '快速通關｜日本環球影城', reason: '想減少排隊，再依想玩的設施加購' },
      { title: '火影忍者｜二次元之森', reason: '動漫主題行程，可獨立安排淡路島半天' },
    ],
  },
  {
    id: 'family-rainy-day',
    label: '親子／雨天',
    category: '親子室內景點',
    tabValue: '周遊券未涵蓋景點',
    summary: '選一個符合孩子年齡、又和當天區域順路的室內景點。',
    note: '海遊館通常需要較完整的半天；兒童樂園與市區行程較容易彈性搭配。',
    listLinkLabel: '查看全部周遊券未涵蓋景點 ↓',
    tickets: [
      { title: '大阪海遊館', reason: '大阪港半日主角，適合親子與雨天' },
      { title: '大阪兒童樂園', reason: '互動設施多，較適合學齡前與小學生' },
      { title: 'Miracle World主題樂園', reason: '室內遊樂選擇，不受天氣影響' },
    ],
  },
  {
    id: 'nearby-day-trip',
    label: '近郊／溫泉',
    category: '近郊一日遊',
    tabValue: '一日遊',
    summary: '想離開大阪市區時，再依溫泉、海景或文化景點選方向。',
    note: '近郊路線距離差異很大，先看集合地、回程時間與每站停留長度。',
    tickets: [
      { title: '有馬溫泉+六甲山+神戶三田Outlet/馬賽克摩天輪/勝尾寺', reason: '溫泉、山景與神戶周邊一次安排' },
      { title: '和歌山城+Toretore漁獲市場+白良濱沙灘+千疊敷+三段壁', reason: '海岸景觀為主，適合不想研究轉車' },
      { title: 'MIHO美術館+舊竹林院+琵琶湖', reason: '建築、庭園與琵琶湖文化路線' },
    ],
  },
]

export default function OsakaTicketQuickGuide({ cards }: { cards: CityCard[] }) {
  return (
    <TicketQuickGuide
      scenarios={ticketScenarios}
      cards={cards}
      eventPrefix="osakaticket"
      badge="30 秒票券決策"
      title="先決定玩法，再看該買什麼"
      description="先分清楚周遊券、樂園門票、親子景點與近郊一日遊，再比較實際需要的商品。"
    />
  )
}
