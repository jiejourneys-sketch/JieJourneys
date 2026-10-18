import HotelQuickGuide, { type HotelQuickGuideScenario } from '@/components/HotelQuickGuide'
import type { CityCard } from '@/components/CityTabbedList'

const stayScenarios: HotelQuickGuideScenario[] = [
  {
    id: 'beach-resort',
    label: '海景度假／膠囊列車',
    area: '海雲台',
    tabValue: '海雲台',
    summary: '海灘、藍線公園與東釜山行程集中，想看海放鬆最適合。',
    note: '離南浦洞與甘川洞較遠；如果每天跑舊市區，交通時間會明顯增加。',
    hotels: [
      { title: '釜山朝昕經典飯店', reason: '海景、泳池與桑拿，度假設施完整' },
      { title: 'L7海雲台', reason: '位置方便，海景與住宿品質較均衡' },
      { title: 'UH Suite 海雲台飯店', reason: '預算較好控制，也想住海雲台核心' },
    ],
  },
  {
    id: 'night-view-yacht',
    label: '夜景遊艇／海邊咖啡',
    area: '廣安里',
    tabValue: '廣安里',
    summary: '廣安大橋夜景、遊艇與海景餐廳是主軸，晚上氣氛最好。',
    note: '不少海景飯店離地鐵站有一段距離；行李多時要確認步行與坡度。',
    hotels: [
      { title: '廣安裡凱星頓肯特飯店', reason: '頂樓景觀與海邊位置表現穩定' },
      { title: '霍默斯飯店', reason: '靠近沙灘，海景與生活便利性兼顧' },
      { title: 'HyoiStay 廣安', reason: '想看廣安里夜景並優先控制預算' },
    ],
  },
  {
    id: 'first-trip-transit',
    label: '第一次釜山／跨區交通',
    area: '西面',
    tabValue: '西面',
    summary: '地鐵 1、2 號線交會，往海雲台、南浦洞與機場方向都較平均。',
    note: '這裡不是海邊；優勢是交通、商圈與餐廳，不適合把海景當住宿重點。',
    hotels: [
      { title: '釜山樂天飯店', reason: '交通、百貨與完整飯店設施一次兼顧' },
      { title: '阿爾班飯店', reason: '商圈中心、房間寬敞且 CP 值較好' },
      { title: '釜山商務飯店', reason: '位置方便，重視實用與移動效率' },
    ],
  },
  {
    id: 'markets-old-town',
    label: '市場美食／甘川洞舊市區',
    area: '南浦洞',
    tabValue: '南浦洞',
    summary: '札嘎其、BIFF、國際市場與甘川洞都好接，喜歡吃逛最省時間。',
    note: '到海雲台與東釜山較遠；如果旅程主軸是海線，不建議全程住這裡。',
    hotels: [
      { title: '釜山斯坦福飯店', reason: '札嘎其與 BIFF 近，第一次住南浦很直覺' },
      { title: '南浦獵犬尊貴飯店', reason: '房間較寬敞，鄰近札嘎其站' },
      { title: '格里芬灣飯店', reason: '位置、景觀與價格取向較均衡' },
    ],
  },
]

type Props = {
  cards: CityCard[]
}

export default function BusanHotelQuickGuide({ cards }: Props) {
  return (
    <HotelQuickGuide
      scenarios={stayScenarios}
      cards={cards}
      eventPrefix="busanhotel"
      badge="30 秒住宿決策"
      title="先選行程重心，再看適合飯店"
      description="從海景度假、夜景遊艇、跨區交通或市場美食出發，先選對住宿區域，再比較真正適合的飯店。"
    />
  )
}
