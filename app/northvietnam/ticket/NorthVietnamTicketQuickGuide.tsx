import type { CityCard } from '@/components/CityTabbedList'
import TicketQuickGuide, { type TicketQuickGuideScenario } from '@/components/TicketQuickGuide'

const ticketScenarios: TicketQuickGuideScenario[] = [
  {
    id: 'hanoi-first-visit',
    label: '河內初訪',
    category: '河內市區與體驗',
    tabValue: '河內',
    summary: '市區景點密集，可用一日導覽認識城市，再把表演或美食安排在晚上。',
    note: '多數一日遊的接送範圍集中老城區；水上木偶秀則要確認場次與取票方式。',
    tickets: [
      { title: '水上木偶秀', reason: '時間固定、容易放進抵達日或晚上' },
      { title: '胡志明陵寢+文廟+鎮國寺+越南民族學博物館+火爐監獄博物館', reason: '第一次去，集中看城市代表景點' },
      { title: '河內美食之旅', reason: '用在地帶路降低點餐與找店門檻' },
    ],
  },
  {
    id: 'sapa-classic',
    label: '沙壩山景',
    category: '沙壩經典景點',
    tabValue: '沙壩',
    summary: '先決定以番西邦峰、村落或玻璃步道為主，再看要一日往返或住一晚。',
    note: '山區能見度與交通受天候影響；多日遊還要確認河內往返交通、住宿與行李安排。',
    tickets: [
      { title: '番西邦峰', reason: '已在沙壩自由行，只需要纜車票' },
      { title: '番西邦峰+番西邦纜車+貓貓村+Moana Sapa+/-沙壩高山滑車｜1日遊', reason: '一天集中沙壩代表景點' },
      { title: '玻璃天空步道+銀瀑+天堂之門｜1日遊', reason: '想看山景與高空步道的路線' },
    ],
  },
  {
    id: 'halong-cruise',
    label: '下龍灣遊輪',
    category: '下龍灣遊輪',
    tabValue: '下龍灣',
    summary: '先決定一日往返或船宿兩日，再比較船型、房型、餐食與接送。',
    note: '星級名稱不一定能直接互比；要逐一看實際船隻、房型、航線及是否含河內接送。',
    tickets: [
      { title: '頂級郵輪｜2日遊、6星級', reason: '重視船宿設備與完整體驗' },
      { title: 'Alisa Premier Cruise｜2日遊、5星級', reason: '兩日船宿的主流選擇' },
      { title: 'Ambassador Cruise｜1日遊、5星級', reason: '時間有限，從河內一日往返' },
    ],
  },
  {
    id: 'ninh-binh',
    label: '陸龍灣山水',
    category: '陸龍灣一日遊',
    tabValue: '陸龍灣',
    summary: '想坐船選長安或三谷，想看高處全景加舞洞，再依興趣搭配古都或寺院。',
    note: '從河內出發的一日遊時間長；比較船遊路線、腳踏車、午餐與舞洞是否都包含。',
    tickets: [
      { title: '長安船票', reason: '已自行抵達，只需要生態區船票' },
      { title: '華閭古都+三谷/長安+舞洞｜1日遊', reason: '古都、船遊與全景一次安排' },
      { title: '白亭寺+長安+舞洞｜1日遊', reason: '寺院、船遊與舞洞的經典組合' },
    ],
  },
]

export default function NorthVietnamTicketQuickGuide({ cards }: { cards: CityCard[] }) {
  return (
    <TicketQuickGuide
      scenarios={ticketScenarios}
      cards={cards}
      eventPrefix="northvietnamticket"
      badge="30 秒區域決策"
      title="先選地區，再看票券與行程"
      description="河內、沙壩、下龍灣與陸龍灣的玩法差異很大；先定區域，就不必在全部商品裡慢慢找。"
    />
  )
}
