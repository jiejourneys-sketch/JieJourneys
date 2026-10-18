import HotelQuickGuide, { type HotelQuickGuideScenario } from '@/components/HotelQuickGuide'
import { fujiHotelCards } from '@/data/fuji'

const stayScenarios: HotelQuickGuideScenario[] = [
  {
    id: 'mount-fuji-view',
    label: '富士山景／自駕度假',
    area: '富士山景',
    tabValue: '富士山景',
    summary: '把富士山視野與飯店體驗放在第一位，適合自駕、拍照或放慢步調。',
    note: '富士山景受天氣影響；下訂前也要確認是房內景觀，還是只有公共區域看得到。',
    hotels: [
      { title: '秀峰閣湖月', reason: '全房富士山景，露天溫泉與一泊二食' },
      { title: '馥府河口湖', reason: '私人溫泉、料理與頂級住宿體驗' },
      { title: '富士河口湖拉維斯塔飯店', reason: '富士山景與溫泉兼顧，度假感完整' },
    ],
  },
  {
    id: 'lake-onsen',
    label: '湖景溫泉／一泊二食',
    area: '湖景溫泉',
    tabValue: '湖景溫泉',
    summary: '想把泡湯、湖畔景觀與旅館餐食當成行程主角，優先看湖南岸。',
    note: '湖景不一定等於富士山景；晚到旅客要先確認接駁與最後晚餐時間。',
    hotels: [
      { title: '湖山亭產屋', reason: '湖畔富士山景與日式溫泉體驗完整' },
      { title: '河口湖溫泉飯店KUKUNA', reason: '露天溫泉、餐飲與景觀表現均衡' },
      { title: '富士河口湖溫泉鄉湖南莊', reason: '屋頂足湯與私人湯屋選擇豐富' },
    ],
  },
  {
    id: 'transit-value',
    label: '大眾交通／預算優先',
    area: '交通方便／高 CP',
    tabValue: '交通方便/高CP',
    summary: '靠近河口湖站、富士山站或富士急樂園，減少接駁與拖行李負擔。',
    note: '河口湖站和富士山站不是同一住宿圈；下訂前要確認實際站點與末班交通。',
    hotels: [
      { title: '夢富士花之宿旅館', reason: '靠近河口湖站，房間空間與便利性兼顧' },
      { title: 'MYSTAYS富士山展望溫泉酒店', reason: '富士急樂園站近，中價位也有溫泉' },
      { title: 'Megu Fuji 2021', reason: '富士山站近，小資乾淨並有景觀露台' },
    ],
  },
]

export default function FujiHotelQuickGuide() {
  return (
    <HotelQuickGuide
      scenarios={stayScenarios}
      cards={fujiHotelCards}
      eventPrefix="fujihotel"
      badge="30 秒住宿決策"
      title="先選旅行體驗，再看適合飯店"
      description="先決定最重視富士山景、湖景溫泉，還是大眾交通與預算，再比較真正符合這趟旅行的住宿。"
    />
  )
}
