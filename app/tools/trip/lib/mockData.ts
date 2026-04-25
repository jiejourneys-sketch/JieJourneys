import type { PlanItem } from './types'
import { recalculateTimes } from './time'

const RAW: Omit<PlanItem, 'time'>[] = [
  { id: 'a1', day: 1, name: '釜山金海國際機場', type: 'transport', emoji: '✈️', duration: 60,
    address: '釜山廣域市 江西區', notes: '入境後搭機場鐵路進市區，約 35 分鐘' },
  { id: 'a2', day: 1, name: '海雲台海水浴場', type: 'attraction', emoji: '🏖️', duration: 120,
    address: '釜山廣域市 海雲台區', notes: '韓國最著名海水浴場，沙灘綿延 1.5 公里', lat: 35.1587, lng: 129.1604 },
  { id: 'a3', day: 1, name: '市場豬肉湯飯', type: 'food', emoji: '🍲', duration: 60,
    address: '釜山廣域市 海雲台區 해운대시장', notes: '在地必吃，份量超大，湯頭濃郁鮮甜' },
  { id: 'a4', day: 1, name: '廣安里夜景', type: 'attraction', emoji: '🌊', duration: 90,
    address: '釜山廣域市 水營區 廣安洞', notes: '廣安大橋夜景絕美，建議傍晚前來', lat: 35.1530, lng: 129.1183 },
  { id: 'b1', day: 2, name: '札嘎其水產市場', type: 'food', emoji: '🦀', duration: 90,
    address: '釜山廣域市 中區 南浦洞', notes: '活海鮮現買現吃，二樓有代客料理服務', lat: 35.0978, lng: 129.0297 },
  { id: 'b2', day: 2, name: '影島天空步道', type: 'attraction', emoji: '🌁', duration: 60,
    address: '釜山廣域市 影島區 東三洞', notes: '步道懸空延伸入海，俯瞰釜山港全景', lat: 35.0690, lng: 129.0587 },
  { id: 'b3', day: 2, name: '甘川文化村', type: 'attraction', emoji: '🎨', duration: 120,
    address: '釜山廣域市 沙下區 甘川洞', notes: '彩色梯田村落，韓國版馬丘比丘，迷宮小巷超好拍', lat: 35.0975, lng: 129.0104 },
  { id: 'b4', day: 2, name: '南浦洞街頭美食', type: 'food', emoji: '🥘', duration: 75,
    address: '釜山廣域市 中區 南浦洞', notes: 'BIFF 廣場周邊傳統小吃街，魚板、雞蛋糕必試' },
  { id: 'c1', day: 3, name: '太宗台自然公園', type: 'attraction', emoji: '🪨', duration: 120,
    address: '釜山廣域市 影島區 東三洞', notes: '絕壁海景震撼，遊覽車環繞園區約 1 小時', lat: 35.0461, lng: 129.0803 },
  { id: 'c2', day: 3, name: '松島天空步道', type: 'attraction', emoji: '🚶', duration: 60,
    address: '釜山廣域市 西區 暗南洞', notes: '玻璃底海上步道，俯瞰松島海水浴場', lat: 35.0763, lng: 129.0140 },
  { id: 'c3', day: 3, name: '回程出發', type: 'transport', emoji: '✈️', duration: 30,
    address: '釜山金海國際機場' },
]

export const MOCK_ITEMS: PlanItem[] = [...new Set(RAW.map((r) => r.day))].sort()
  .flatMap((day) =>
    recalculateTimes(RAW.filter((r) => r.day === day).map((r) => ({ ...r, time: '' })))
  )
