import type { CityCard } from '@/components/CityTabbedList'
import TicketQuickGuide, { type TicketQuickGuideScenario } from '@/components/TicketQuickGuide'

const ticketScenarios: TicketQuickGuideScenario[] = [
  {
    id: 'family-rainy-day',
    label: '親子／雨天',
    category: '京都車站周邊',
    tabValue: '景點・體驗',
    summary: '雨天或帶小孩時，先選一個室內主景點，再看體力加第二站。',
    note: '鐵道博物館與水族館都在梅小路；teamLab 靠近京都車站，但要注意指定時段。',
    listLinkLabel: '查看全部京都景點與體驗 ↓',
    tickets: [
      { title: 'teamLab Biovortex 京都', reason: '京都車站步行圈，傍晚與雨天好安排' },
      { title: '京都鐵道博物館', reason: '展示與互動豐富，適合鐵道迷與親子' },
      { title: '京都水族館', reason: '梅小路室內半日，步調比較輕鬆' },
    ],
  },
  {
    id: 'kimono-higashiyama',
    label: '清水寺／和服',
    category: '東山和服體驗',
    tabValue: '景點・體驗',
    summary: '店家都在清水寺山腳一帶，差別主要在方案、攝影與歸還方式。',
    note: '先確認最晚歸還時間、髮型是否包含、行李寄放及跨店或隔日歸還規則。',
    listLinkLabel: '查看全部京都景點與體驗 ↓',
    tickets: [
      { title: '京都和服租借｜Ookini 清水寺店', reason: '和服、髮型與攝影可依方案選擇' },
      { title: '京都和服租借｜Okimono屋 清水寺店', reason: '可比較外拍與隔日歸還方案' },
      { title: '京都和服租借｜MOCOMOCO 清水寺店', reason: '五條坂平地店，寄放行李後好出發' },
    ],
  },
  {
    id: 'arrival-evening',
    label: '抵達日／晚上',
    category: '短時段體驗',
    tabValue: '景點・體驗',
    summary: '不想浪費抵達日，就選交通簡單、時段明確的展望台、展覽或表演。',
    note: '先以飯店位置和當日抵達時間判斷；不要為一個晚間景點跨越整個京都。',
    listLinkLabel: '查看全部京都景點與體驗 ↓',
    tickets: [
      { title: 'Nidec 京都塔展望台', reason: '京都站正對面，抵達日最容易安排' },
      { title: 'teamLab Biovortex 京都', reason: '指定時段入場，適合傍晚室內行程' },
      { title: 'GEAR 無語言劇場', reason: '河原町晚間表演，不受語言限制' },
    ],
  },
  {
    id: 'nearby-day-trip',
    label: '近郊／一日遊',
    category: '京都奈良一日遊',
    tabValue: '一日遊',
    summary: '距離遠、轉乘多，或想一天串多區時，再用一日遊換取固定動線。',
    note: '比較集合地、門票是否包含與每站停留時間；景點越多不一定越划算。',
    tickets: [
      { title: '天橋立View Land+智恩寺+天橋立纜車+伊根舟屋', reason: '京都北部經典組合，自己轉車較費時' },
      { title: '嵐山渡月橋+嵐山竹林+伏見稻荷大社+奈良公園', reason: '第一次關西，集中京都與奈良代表景點' },
      { title: '宇治+平等院+伏見稻荷大社+奈良公園/勝尾寺/東大寺', reason: '宇治主題明確，再搭配京都南側或奈良' },
    ],
  },
]

export default function KyotoTicketQuickGuide({ cards }: { cards: CityCard[] }) {
  return (
    <TicketQuickGuide
      scenarios={ticketScenarios}
      cards={cards}
      eventPrefix="kyotonaraticket"
      badge="30 秒票券決策"
      title="先看行程情境，再選門票或一日遊"
      description="先分清楚市區體驗與遠距離一日遊，再從三個較符合需求的選擇開始比較。"
      listAnchorId="guideListTitle"
    />
  )
}
