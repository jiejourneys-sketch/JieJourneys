import type { CityCard } from '@/components/CityTabbedList'
import TicketQuickGuide, { type TicketQuickGuideScenario } from '@/components/TicketQuickGuide'

const ticketScenarios: TicketQuickGuideScenario[] = [
  {
    id: 'classic-photo-spots',
    label: '經典拍照／一日遊',
    category: '河口湖經典路線',
    tabValue: '一日遊',
    summary: '第一次去，先從淺間公園、忍野八海、大石公園與日川時計的組合開始看。',
    note: '景點數量多不代表停留更完整；比較集合地、各站停留時間與是否會因季節調整。',
    tickets: [
      { title: '淺間公園+日川時計+大石公園/櫻花/楓葉+忍野八海+Lawson', reason: '第一次去的代表景點組合' },
      { title: '淺間公園+日川時計+大石公園/櫻花/楓葉+忍野八海+Lawson+山中湖', reason: '想把山中湖也排進同一天' },
      { title: '大石公園+忍野八海+Lawson+纜車+遊覽船+抹茶體驗', reason: '想加入纜車、遊船與體驗' },
    ],
  },
  {
    id: 'fifth-station-outlet',
    label: '五合目／Outlet',
    category: '富士山五合目路線',
    tabValue: '一日遊',
    summary: '想更靠近富士山，就選五合目；想兼顧購物，再看御殿場 Outlet 組合。',
    note: '五合目可能受天候、道路或季節影響而改點，購買前要看替代行程說明。',
    tickets: [
      { title: '淺間公園+忍野八海+五合目+御殿場Outlet/溫泉', reason: '五合目加購物或溫泉的完整路線' },
      { title: '淺間公園+大石公園+忍野八海+五合目', reason: '以景色與經典景點為主' },
      { title: '大石公園+忍野八海+Lawson+御殿場Outlet', reason: '不去五合目，保留較多購物時間' },
    ],
  },
  {
    id: 'hakone',
    label: '箱根／周邊',
    category: '箱根與富士山周邊',
    tabValue: '一日遊',
    summary: '想看神社、蘆之湖、大涌谷或海賊船，可直接從箱根組合縮小選擇。',
    note: '富士河口湖與箱根距離不近；同日跨區會較趕，先確認你更重視哪一側。',
    tickets: [
      { title: '箱根神社+箱根纜車+大涌谷+江之島', reason: '箱根代表景點再接江之島' },
      { title: '山中湖+忍野八海+箱根神社+箱根海賊船+箱根纜車+大涌谷', reason: '富士山與箱根一次走，但行程較滿' },
      { title: '箱根神社/五合目/忍野八海+蘆之湖+大涌谷+御殿場Outlet', reason: '湖景、火山地形與 Outlet 的組合' },
    ],
  },
  {
    id: 'two-day',
    label: '住一晚／二日遊',
    category: '富士箱根二日遊',
    tabValue: '二日遊',
    summary: '想減少當日往返的趕路感，可把河口湖、箱根或伊豆拆成兩天。',
    note: '二日遊要確認住宿等級、房型、餐食、行李處理，以及第二天的解散地點。',
    tickets: [
      { title: '淺間公園+纜車+五合目+大涌谷+蘆之湖+修善寺+大室山+江之島+火山湖/箱根', reason: '範圍最廣，涵蓋富士、箱根與伊豆' },
      { title: '淺間公園+日川時計+大石公園/楓葉+忍野八海+Lawson+纜車+遊覽船+山中湖+抹茶體驗', reason: '集中河口湖周邊，停留較完整' },
      { title: '淺間公園+日川時計+大石公園/楓葉+忍野八海+Lawson+山中湖+大室山+蘆之湖+箱根海賊船', reason: '河口湖再延伸箱根與大室山' },
    ],
  },
  {
    id: 'independent-travel',
    label: '自由行／單點票',
    category: '交通票與單點景點',
    tabValue: '景點',
    summary: '已經會自己搭車，就只買需要的交通票、樂園或纜車，不必綁一日遊。',
    note: '先核對營運日期、預約時段與現場交通；周遊券也要依實際搭乘次數評估。',
    tickets: [
      { title: '富士山周遊券', reason: '自己排行程，先比較交通涵蓋範圍' },
      { title: '富士急樂園', reason: '以樂園為主，建議保留完整一天' },
      { title: '纜車｜河口湖', reason: '只補河口湖代表景點門票' },
    ],
  },
]

export default function FujiTicketQuickGuide({ cards }: { cards: CityCard[] }) {
  return (
    <TicketQuickGuide
      scenarios={ticketScenarios}
      cards={cards}
      eventPrefix="fujiticket"
      badge="30 秒路線決策"
      title="先決定想看哪一側，再比較行程"
      description="河口湖、五合目與箱根不是同一種玩法；先選主題，會比直接比較全部行程快很多。"
    />
  )
}
