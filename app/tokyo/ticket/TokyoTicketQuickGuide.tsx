import TicketQuickGuide, { type TicketQuickGuideScenario } from '@/components/TicketQuickGuide'
import { tokyoTicketCards } from '@/data/tokyo'

const ticketScenarios: TicketQuickGuideScenario[] = [
  {
    id: 'city-view',
    label: '夜景／城市景觀',
    category: '展望台',
    tabValue: '展望台',
    summary: '先看行程區域與想要的視野，不必每座展望台都去。',
    note: '熱門夕陽時段可能提早售完；先確認日期、入場時間與天候備案。',
    tickets: [
      { title: 'SHIBUYA SKY', reason: '戶外感最強，適合夕陽與澀谷夜景' },
      { title: '晴空塔', reason: '淺草、押上順遊，室內不怕天氣' },
      { title: '東京鐵塔', reason: '經典東京地標，適合芝公園周邊' },
    ],
  },
  {
    id: 'theme-park',
    label: '樂園／影城',
    category: '主題類',
    tabValue: '主題類',
    summary: '這類通常會占半天到一天，先卡日期再排其他行程。',
    note: '迪士尼與哈利波特影城要特別確認日期；teamLab 則要留意指定入場時段。',
    tickets: [
      { title: '東京迪士尼', reason: '安排完整一天，日期確定後優先訂' },
      { title: '哈利波特影城', reason: '熱門時段容易滿，適合影迷優先卡位' },
      { title: 'TeamLab Borderless', reason: '麻布台室內展覽，雨天也好安排' },
    ],
  },
  {
    id: 'family-rainy-day',
    label: '親子／雨天',
    category: '親子類',
    tabValue: '親子類',
    summary: '選一個和住宿、當日區域順路的室內景點就夠。',
    note: '三麗鷗位置較遠，適合獨立排半天；台場景點則較容易和購物行程組合。',
    tickets: [
      { title: '迷你世界博物館', reason: '室內模型世界，台場周邊順遊' },
      { title: '樂高樂園', reason: '適合學齡前、樂高迷與雨天備案' },
      { title: '三麗鷗彩虹樂園', reason: '角色樂園，建議保留完整半天' },
    ],
  },
  {
    id: 'aquarium',
    label: '水族館／半日',
    category: '水族館',
    tabValue: '水族館',
    summary: '水族館差異不只規模，最重要的是能否和附近行程一起排。',
    note: '同一趟通常選一間即可；先以淺草押上、銀座或池袋的當日動線判斷。',
    tickets: [
      { title: '墨田水族館', reason: '和晴空塔、淺草安排在同一天最順' },
      { title: '東京銀座藝術水族館', reason: '銀座室內景點，交通與購物方便' },
      { title: '池袋陽光水族館', reason: '池袋半日，親子與購物行程兼顧' },
    ],
  },
  {
    id: 'day-trip',
    label: '近郊／不想轉車',
    category: '一日遊',
    tabValue: '一日遊',
    summary: '景點分散、轉乘多時，用一日遊換取固定動線最有價值。',
    note: '比較時要看集合地、每站停留時間、餐食與門票是否包含，不要只看景點數量。',
    tickets: [
      { title: '鎌倉大佛+鎌倉高中+江之島+鶴岡八幡宮+江之電體驗+/-小町通', reason: '經典鎌倉江之島，省去多次轉車' },
      { title: '東照宮+伊呂波山道+中禪寺湖+華嚴瀑布', reason: '日光景點分散，跟團減少交通壓力' },
      { title: '富士山・河口湖一日遊｜看富士山專區', reason: '富士路線選項多，先到專區比較行程' },
    ],
  },
]

export default function TokyoTicketQuickGuide() {
  return (
    <TicketQuickGuide
      scenarios={ticketScenarios}
      cards={tokyoTicketCards}
      eventPrefix="tokyoticket"
      badge="30 秒票券決策"
      title="先選想玩的類型，再看三張票券"
      description="不用先讀完所有商品。選一個最接近的需求，我會先縮小到三個值得比較的選擇。"
    />
  )
}
