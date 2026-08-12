import type { CityCardAction } from '@/components/CityTabbedList'
import type { MapPlace } from '@/lib/mapPlace'
import { busanMapPlaces } from '@/data/busan/map/places'
import { busanPassMapPlaces } from '@/data/busan/pass-map/places'

type Area = 'haeundae' | 'songdo' | 'nampo' | 'seomyeon' | 'cheongsapo'

const AREA_COORDINATES: Record<Area, { lat: number; lng: number }> = {
  haeundae: { lat: 35.1604, lng: 129.1604 },
  songdo: { lat: 35.0764, lng: 129.0236 },
  nampo: { lat: 35.1012, lng: 129.0282 },
  seomyeon: { lat: 35.1577, lng: 129.0596 },
  cheongsapo: { lat: 35.164, lng: 129.1967 },
}

/** 由原 PDF 的 Google Maps 連結解析出的實際釘點，不再以行政區中心代替。 */
const EXTRA_PLACE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'busan-journey-abalone-porridge': { lat: 35.1605788, lng: 129.171241 },
  'busan-journey-and-coffee': { lat: 35.1622396, lng: 129.1651165 },
  'busan-journey-ant-house': { lat: 35.1611033, lng: 129.160662 },
  'busan-journey-artbox': { lat: 35.1545621, lng: 129.0613605 },
  'busan-journey-avivere': { lat: 35.154644, lng: 129.0626 },
  'busan-journey-bean-field': { lat: 35.1001669, lng: 129.0307726 },
  'busan-journey-butter-shop': { lat: 35.1546432, lng: 129.061575 },
  'busan-journey-cafe-1994': { lat: 35.1633117, lng: 129.1586235 },
  'busan-journey-capsule-train': { lat: 35.1613733, lng: 129.1918758 },
  'busan-journey-cod-soup': { lat: 35.1610798, lng: 129.1700367 },
  'busan-journey-daiso-haeundae': { lat: 35.1629553, lng: 129.159743 },
  'busan-journey-daiso-nampo': { lat: 35.0984681, lng: 129.0309443 },
  'busan-journey-egg-drop': { lat: 35.1632912, lng: 129.1587251 },
  'busan-journey-frank-burger': { lat: 35.1632931, lng: 129.1588005 },
  'busan-journey-haemok': { lat: 35.1617808, lng: 129.1596666 },
  'busan-journey-hong-kong': { lat: 35.1562438, lng: 129.0573781 },
  'busan-journey-hotel-kolon-haeundae': { lat: 35.1604404, lng: 129.1622156 },
  'busan-journey-hotel-l7-haeundae': { lat: 35.1600959, lng: 129.1600932 },
  'busan-journey-hotel-shilla-stay': { lat: 35.1600161, lng: 129.1630504 },
  'busan-journey-hotel-uh-suite': { lat: 35.1598173, lng: 129.1611312 },
  'busan-journey-hotteok': { lat: 35.0988394, lng: 129.029148 },
  'busan-journey-isaac': { lat: 35.1578928, lng: 129.0569553 },
  'busan-journey-jeju-porridge': { lat: 35.1557981, lng: 129.0566887 },
  'busan-journey-lotte-outlet-restaurant': { lat: 35.1916524, lng: 129.2137288 },
  'busan-journey-lotte-world-restaurant': { lat: 35.1962453, lng: 129.2149345 },
  'busan-journey-marinated-crab': { lat: 35.1597081, lng: 129.1595155 },
  'busan-journey-mijangwang': { lat: 35.1610861, lng: 129.1590465 },
  'busan-journey-nampo-noodle': { lat: 35.0989315, lng: 129.031225 },
  'busan-journey-nampo-seolleongtang': { lat: 35.0984667, lng: 129.0320586 },
  'busan-journey-object': { lat: 35.1553121, lng: 129.0644697 },
  'busan-journey-obok-gukbap': { lat: 35.1626121, lng: 129.1600382 },
  'busan-journey-olive-haeundae': { lat: 35.1617535, lng: 129.1608721 },
  'busan-journey-olive-nampo': { lat: 35.0986158, lng: 129.0287567 },
  'busan-journey-pufferfish': { lat: 35.1624205, lng: 129.1645061 },
  'busan-journey-salt-bread': { lat: 35.1603382, lng: 129.1706577 },
  'busan-journey-samgyetang': { lat: 35.1626284, lng: 129.1650085 },
  'busan-journey-seomyeon-youth': { lat: 35.1554358, lng: 129.0612696 },
  'busan-journey-songdo-hotpot': { lat: 35.0777315, lng: 129.021307 },
  'busan-journey-songdo-seafood-1': { lat: 35.0762309, lng: 129.0230317 },
  'busan-journey-songdo-seafood-2': { lat: 35.076788, lng: 129.0224199 },
  'busan-journey-songdo-sky-park': { lat: 35.0615784, lng: 129.0205256 },
  'busan-journey-songjeong-gukbap': { lat: 35.1556037, lng: 129.0585412 },
  'busan-journey-twin-etoile': { lat: 35.1564749, lng: 129.0649151 },
  'busan-journey-workingholiday': { lat: 35.1599125, lng: 129.161721 },
  'busan-journey-wubanjang': { lat: 35.1615099, lng: 129.1591675 },
}

const action = (label: string, href: string, platform?: string): CityCardAction => ({ label, href, platform })

const mapPlace = (
  id: string,
  name: string,
  area: Area,
  description: string,
  googleUrl: string,
  naverUrl: string | undefined,
  actions: CityCardAction[] = [],
  category: MapPlace['category'] = 'restaurant',
): MapPlace => ({
  id,
  category,
  name,
  description,
  ...(EXTRA_PLACE_COORDINATES[id] ?? AREA_COORDINATES[area]),
  spotGoogleMapsUrl: googleUrl,
  spotActions: [naverUrl ? action('NaverMap', naverUrl, 'NaverMap') : null, ...actions].filter(
    (item): item is CityCardAction => item !== null,
  ),
})

const exactMapLinks: Record<string, { google: string; naver: string }> = {
  'haeundae-road': { google: 'https://maps.app.goo.gl/ZtCzHyazjo2D1wKG9', naver: 'https://naver.me/xmxIx8kL' },
  'haeundae-market': { google: 'https://maps.app.goo.gl/Nx5JN264Jx48aawk7', naver: 'https://naver.me/GzE9ensG' },
  'busan-haeundae': { google: 'https://maps.app.goo.gl/HGzwiWyRgc9R1DN18', naver: 'https://naver.me/F0z2RxAs' },
  'Cultural-village': { google: 'https://maps.app.goo.gl/6dn8uinTKRKp73M58', naver: 'https://naver.me/FPn5Lbco' },
  'busan-pass-mid-cheolsu-younghee-hanbok': { google: 'https://maps.app.goo.gl/j3W1NmeKhQZDbV8P7', naver: 'https://naver.me/IgJUwUeg' },
  'busan-pass-mid-flipbook-studio': { google: 'https://maps.app.goo.gl/bLgmQueodjVEveM27', naver: 'https://naver.me/xyTGIESn' },
  'Songdo-skywalk': { google: 'https://maps.app.goo.gl/ur4FdFEv37XBMWRL6', naver: 'https://naver.me/FJbW3smn' },
  'busan-pass-high-songdo-cable-car': { google: 'https://maps.app.goo.gl/KFATJGbEpLVK4Poi9', naver: 'https://naver.me/Fmf6KBhZ' },
  'busan-pass-low-songdo-yonggung-cloud-bridge': { google: 'https://maps.app.goo.gl/gADNYYS8GM7yNZbE8', naver: 'https://naver.me/5T4AUbEV' },
  'Canning-market': { google: 'https://maps.app.goo.gl/JvNMwmEhFEvWmwgq7', naver: 'https://naver.me/GCvq48kt' },
  'International-market': { google: 'https://maps.app.goo.gl/KrsQVVr96KRCeHhW6', naver: 'https://naver.me/GYC92eZR' },
  'busan-pass-low-busan-tower': { google: 'https://maps.app.goo.gl/r3fyL9J4q1qpmtXv5', naver: 'https://naver.me/G65JM8n7' },
  'busan-pass-low-blueline-park-mipo': { google: 'https://maps.app.goo.gl/Esd9RytWVezpc4oM6', naver: 'https://naver.me/FafyrnAe' },
  'haeundae-crossing': { google: 'https://maps.app.goo.gl/x8QKBt3erXht4Wvg8', naver: 'https://naver.me/Faf7IJXO' },
  'haeundae-stone': { google: 'https://maps.app.goo.gl/V3RcfbJMJqK9NHGp6', naver: 'https://naver.me/53lKWBRN' },
  'busan-pass-high-club-d-oasis': { google: 'https://maps.app.goo.gl/FYsz7RonyjDVyaqN7', naver: 'https://naver.me/F9N4ni3R' },
  'busan-pass-high-x-the-sky': { google: 'https://maps.app.goo.gl/5FkEjDZzCKST3yxZ7', naver: 'https://naver.me/5IS92bMA' },
  'busan-pass-high-diamond-bay-yacht': { google: 'https://maps.app.goo.gl/m695isPJ5h8AZW887', naver: 'https://naver.me/GrqCFoQT' },
  'busan-pass-high-skyline-luge': { google: 'https://maps.app.goo.gl/HwMBrZQPhB65NLEo9', naver: 'https://naver.me/IDFUcLWo' },
  'busan-pass-high-lotte-world-adventure': { google: 'https://maps.app.goo.gl/wkRCFJndgAee27da8', naver: 'https://naver.me/FaenS0MK' },
  'busan-lotteoutlet': { google: 'https://maps.app.goo.gl/pcTGJqpw9da3zExC7', naver: 'https://naver.me/GwpMkOIT' },
  'haeundae-temple': { google: 'https://maps.app.goo.gl/M1wTgUzz1Bs6haiC8', naver: 'https://naver.me/58NdWaSm' },
  'Gwangalli-beach': { google: 'https://maps.app.goo.gl/CcG37iL3NUZfir379', naver: 'https://naver.me/xzxmzK1j' },
  'busan-Seomyeonlotte': { google: 'https://maps.app.goo.gl/zW2T66HQeWtifg8H8', naver: 'https://naver.me/xZVbDc9R' },
}

function withExactMapLinks(places: MapPlace[]) {
  return places.map((place) => {
    const exact = exactMapLinks[place.id]
    if (!exact) return place
    const nonNaverActions = (place.spotActions ?? []).filter(
      (item) => item.platform?.toLowerCase() !== 'navermap' && item.label.toLowerCase() !== 'navermap',
    )
    return {
      ...place,
      spotGoogleMapsUrl: exact.google,
      spotActions: [action('NaverMap', exact.naver, 'NaverMap'), ...nonNaverActions],
    }
  })
}

const extraPlaces: MapPlace[] = [
  mapPlace('busan-journey-daiso-haeundae', '大創 DAISO', 'haeundae', '購物；10:00–22:00', 'https://maps.app.goo.gl/cQhKtgBp44cuL47L9', 'https://naver.me/F5DoD8rA', [], 'shop'),
  mapPlace('busan-journey-olive-haeundae', 'Olive Young', 'haeundae', '購買彩妝；10:00–23:00', 'https://maps.app.goo.gl/aRDvuXU8nxEk5xNp9', 'https://naver.me/x9BYjf19', [], 'shop'),
  mapPlace('busan-journey-wubanjang', '伍班長烤肉', 'haeundae', '烤肉；12:00–01:00', 'https://maps.app.goo.gl/nLJHtGiktEYWS5D47', 'https://naver.me/xgNS7Ylg'),
  mapPlace('busan-journey-ant-house', '螞蟻家辣炒章魚', 'haeundae', '辣炒章魚；24 小時', 'https://maps.app.goo.gl/grMnMJz7NkoheTEz7', 'https://naver.me/54LbaG5O'),
  mapPlace('busan-journey-mijangwang', '味贊王鹽烤肉', 'haeundae', '烤肉；12:00–15:00、17:00–23:00', 'https://maps.app.goo.gl/rJtBX7HPjy2bp66LA', 'https://naver.me/GSDACPH7'),

  mapPlace('busan-journey-egg-drop', 'Egg Drop', 'haeundae', '蛋吐司；08:00–22:00', 'https://maps.app.goo.gl/2tjjZe9qzj8mqqnF8', 'https://naver.me/FN747zwP'),
  mapPlace('busan-journey-songdo-seafood-1', '海鮮食堂', 'songdo', '海鮮鍋；11:00–23:00，週二公休', 'https://maps.app.goo.gl/3zEHfkbEMJmVdTdu8', 'https://naver.me/FHlk6DdP'),
  mapPlace('busan-journey-songdo-seafood-2', '海底貝殼王國', 'songdo', '海鮮餐；11:00–00:00', 'https://maps.app.goo.gl/UnYGq9b7iGQtYqNx6', 'https://naver.me/Gq84VWjF'),
  mapPlace('busan-journey-songdo-hotpot', '松島海鮮鍋', 'songdo', '韓式套餐；10:30–21:00', 'https://maps.app.goo.gl/oxDHMkhbNFHUc7b16', 'https://naver.me/xE6LDdw7'),
  mapPlace('busan-journey-nampo-noodle', '老奶奶伽倻小麥冷麵', 'nampo', '冷麵和水餃；10:15–21:30', 'https://maps.app.goo.gl/7xdr9GD98uW7vhTM8', 'https://naver.me/FTXwcWeX'),
  mapPlace('busan-journey-nampo-seolleongtang', '南浦雪濃湯', 'nampo', '雪濃湯和豬肉湯飯；24 小時', 'https://maps.app.goo.gl/B537p439SEkb4U1q7', 'https://naver.me/GctrSsLb'),
  mapPlace('busan-journey-bean-field', '豆田裡', 'nampo', '豆腐鍋、豬排、牛肉片、辣炒年糕；10:30–21:00', 'https://maps.app.goo.gl/wpwLSs16c64kesi56', 'https://naver.me/FQVGBAmB'),
  mapPlace('busan-journey-hotteok', '元祖糖餅', 'nampo', '糖餅必吃；10:30–22:00', 'https://maps.app.goo.gl/n5QixQqyfMX6pd6w6', 'https://naver.me/FMcgFvvZ'),
  mapPlace('busan-journey-olive-nampo', 'Olive Young（南浦）', 'nampo', '購買彩妝；10:30–22:30', 'https://maps.app.goo.gl/2bZX8a3FKr6qXJWz5', 'https://naver.me/x8tpgm68', [], 'shop'),
  mapPlace('busan-journey-daiso-nampo', 'DAISO（南浦）', 'nampo', '購物；10:00–22:00', 'https://maps.app.goo.gl/16Q2aWrYcqvXnxFZ8', 'https://naver.me/x0UABelr', [], 'shop'),
  mapPlace('busan-journey-songdo-sky-park', '松島 Sky Park 站', 'songdo', '松島海上纜車終點站', 'https://maps.app.goo.gl/W6vVvc1QBgLXenXj8', 'https://naver.me/xCB7Ujqk', [], 'spot'),

  mapPlace('busan-journey-cafe-1994', 'Cafe Haeundae 1994', 'haeundae', '可頌／鬆餅；07:00–00:00', 'https://maps.app.goo.gl/Nq7EDUPayngReoqy7', 'https://naver.me/5hoVEyuy'),
  mapPlace('busan-journey-frank-burger', 'Frank Burger Busan Haeundae stn.', 'haeundae', '漢堡；08:00–21:00', 'https://maps.app.goo.gl/APkMJRD8RZMzVbCv7', 'https://naver.me/x7n4clgG'),
  mapPlace('busan-journey-capsule-train', '膠囊列車', 'cheongsapo', 'KKday 訂票；建議 11:30 先到月台', 'https://maps.app.goo.gl/jjiZbZxjR458kkFd6', undefined, [
    action('KKDAY 訂票', 'https://www.kkday.com/zh-tw/product/123012-haeundae-blueline-park-sky-capsule-beach-train-ticket?cid=22312', 'KKday'),
    action('訂票教學 IG Reels', 'https://www.instagram.com/reel/DNIpqn1TE0k/', 'IG'),
  ], 'spot'),
  mapPlace('busan-journey-salt-bread', '自然島鹽麵包', 'haeundae', '人氣麵包；09:00–22:00', 'https://maps.app.goo.gl/1jNDEE9aw5aRoiAQ7', 'https://naver.me/xrSQSF2f'),
  mapPlace('busan-journey-abalone-porridge', '大海鮑魚粥', 'haeundae', '07:00–14:30；16:00–20:00', 'https://maps.app.goo.gl/LUe3R9roJdXw1vse7', 'https://naver.me/5mI03xa7'),
  mapPlace('busan-journey-cod-soup', '瓦房鳕魚湯', 'haeundae', '08:00–20:40', 'https://maps.app.goo.gl/qe8KSiL7fowe8afRA', 'https://naver.me/GHvq5X0h'),
  mapPlace('busan-journey-pufferfish', '錦繡河豚湯', 'haeundae', '24 小時營業', 'https://maps.app.goo.gl/We4NUTacYiynmR5Z7', 'https://naver.me/FJbWRcbc'),
  mapPlace('busan-journey-samgyetang', '名品海雲台蔘雞湯', 'haeundae', '10:30–15:00；17:00–21:00', 'https://maps.app.goo.gl/hMgAACQBHrKfggTc7', 'https://naver.me/GQ1lFQT6'),

  mapPlace('busan-journey-workingholiday', 'workingholiday brunch cafe bakery', 'haeundae', '早午餐；08:00–21:00，週二休', 'https://maps.app.goo.gl/EjZigVJ3Cxp2KWjj7', 'https://naver.me/FBalWbQp'),
  mapPlace('busan-journey-and-coffee', 'AND COFFEE', 'haeundae', '早午餐；08:00–21:30', 'https://maps.app.goo.gl/TgYw7iTUSyF5iUY28', 'https://naver.me/55rmidCi'),
  mapPlace('busan-journey-obok-gukbap', 'Haeundae Obok Dwaeji-gukbap Restaurant', 'haeundae', '豬肉湯飯；24 小時營業', 'https://maps.app.goo.gl/HLjchPBe2Mp8eZhBA', 'https://naver.me/5WOQstf0'),
  mapPlace('busan-journey-haemok', '海木', 'haeundae', '鰻魚／海鮮；11:00–15:00，17:00–22:00', 'https://maps.app.goo.gl/PAPkGjooWdBVPkWs6', 'https://naver.me/5HkaI55U'),
  mapPlace('busan-journey-marinated-crab', 'Haeundae Marinated Crab', 'haeundae', '海鮮／螃蟹；11:00–00:00', 'https://maps.app.goo.gl/KCwxbURFFHFQEsuL9', 'https://naver.me/G1mEmw5H'),

  mapPlace('busan-journey-seomyeon-youth', '青春街', 'seomyeon', '商店街', 'https://maps.app.goo.gl/KHGBV1rJdrsq595X7', 'https://naver.me/x8taJs30', [], 'shop'),
  mapPlace('busan-journey-artbox', 'Artbox', 'seomyeon', '可愛玩物；11:00–22:30', 'https://maps.app.goo.gl/3HEQnXx6D8D7SyWX7', 'https://naver.me/GXAac0Ue', [], 'shop'),
  mapPlace('busan-journey-butter-shop', 'Butter Shop', 'seomyeon', '可愛玩物；10:30–23:00', 'https://maps.app.goo.gl/TZVtRX8J5CaF27e46', 'https://naver.me/5tJtw23T', [], 'shop'),
  mapPlace('busan-journey-avivere', 'AVIVERE', 'seomyeon', '可愛玩物；11:00–23:00', 'https://maps.app.goo.gl/GS9j5zTA6neHKdJ68', 'https://naver.me/IFgdPelN', [], 'shop'),
  mapPlace('busan-journey-object', 'Object Seomyeon', 'seomyeon', '可愛玩物；12:00–21:00', 'https://maps.app.goo.gl/CiLxbxWkmR5G1RcWA', 'https://naver.me/xSFa5C4C', [], 'shop'),
  mapPlace('busan-journey-twin-etoile', 'TWIN ÉTOILE', 'seomyeon', '可愛玩物；12:00–20:30', 'https://maps.app.goo.gl/2yyJAXLf3697DZUs6', 'https://naver.me/FUQ9o3pN', [], 'shop'),
  mapPlace('busan-journey-isaac', 'ISAAC 吐司', 'seomyeon', '吃吐司，9 號出口；09:00–20:00', 'https://maps.app.goo.gl/N7WLjcgHWV4dFkJ79', 'https://naver.me/xyTGk7n5'),
  mapPlace('busan-journey-songjeong-gukbap', '松亭 3 代豬肉湯飯', 'seomyeon', '24 小時', 'https://maps.app.goo.gl/EePKU4SQrRqCAjQ29', 'https://naver.me/GfCsEbvp'),
  mapPlace('busan-journey-jeju-porridge', '濟州家海鮮粥', 'seomyeon', '08:00–22:00', 'https://maps.app.goo.gl/UJd3zCDHRGoo7dhR9', 'https://naver.me/5pwc6kzj'),
  mapPlace('busan-journey-hong-kong', '香港飯店', 'seomyeon', '炸醬麵；11:00–20:30', 'https://maps.app.goo.gl/qbaaRWCiWSms7tHE7', 'https://naver.me/5fIprHLC'),

  mapPlace('busan-journey-lotte-world-restaurant', '樂天世界餐廳（午餐）', 'haeundae', 'Day 4 午餐選項：樂天世界園內餐廳', 'https://maps.app.goo.gl/wkRCFJndgAee27da8', 'https://naver.me/FaenS0MK', [
    action('樂天世界餐廳', 'https://adventurebusan.lotteworld.com/enjoy/restaurant/list', 'Official'),
  ]),
  mapPlace('busan-journey-lotte-outlet-restaurant', '樂天 Outlet 餐廳（3 樓）', 'haeundae', 'Day 4 午餐備選：樂天 Outlet 3 樓', 'https://maps.app.goo.gl/pcTGJqpw9da3zExC7', 'https://naver.me/GwpMkOIT', [
    action('Outlet 樓層指南', 'https://m.global.lotteshopping.com/cht/store/main?cstrCd=0352', 'Official'),
  ]),

  mapPlace('busan-journey-hotel-shilla-stay', '釜山朝昕經典飯店', 'haeundae', '5★・9.5 分；海雲台站 3 號出口；15:00 後入住／11:00 前退房', 'https://maps.app.goo.gl/prepCxvvJZHpboNA8', 'https://naver.me/5JpyJnmn', [
    action('Trip 訂房', 'https://tw.trip.com/hotels/detail/?hotelId=67688375&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5850035', 'Trip'),
    action('Agoda 訂房', 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=16933389', 'Agoda'),
  ], 'hotel'),
  mapPlace('busan-journey-hotel-l7-haeundae', 'L7 海雲台', 'haeundae', '4★・9.3 分；海雲台站 5 號出口；15:00 後入住／11:00 前退房', 'https://maps.app.goo.gl/iqQ3y9HkpMjbngdX8', 'https://naver.me/GBFHgVBy', [
    action('Trip 訂房', 'https://tw.trip.com/hotels/detail/?hotelId=118354608&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D4729370', 'Trip'),
    action('Agoda 訂房', 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=52027642', 'Agoda'),
  ], 'hotel'),
  mapPlace('busan-journey-hotel-kolon-haeundae', '柯榮海雲飯店', 'haeundae', '4★・8.6 分；海雲台站 3 號出口；15:00 後入住／11:00 前退房', 'https://maps.app.goo.gl/JUqCAkfVAq4tXkuJ6', 'https://naver.me/GdymWL1B', [
    action('Trip 訂房', 'https://tw.trip.com/hotels/detail/?hotelId=689035&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D4729370', 'Trip'),
    action('Agoda 訂房', 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=108254', 'Agoda'),
  ], 'hotel'),
  mapPlace('busan-journey-hotel-uh-suite', 'UH 海雲台套房飯店', 'haeundae', '3★・8.3 分；海雲台站 5 號出口；15:00 後入住／11:00 前退房', 'https://maps.app.goo.gl/aBkyneDug5oZfxZi8', 'https://naver.me/GtURVWFr', [
    action('Trip 訂房', 'https://tw.trip.com/hotels/detail/?hotelId=80920363&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756', 'Trip'),
    action('Agoda 訂房', 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=34716204', 'Agoda'),
  ], 'hotel'),
]

export const busanJourneyPlaces = [...withExactMapLinks(busanMapPlaces), ...extraPlaces]
export const busanJourneyMatchPlaces = withExactMapLinks(busanPassMapPlaces)

const journeyLookupPlaces = [...busanJourneyPlaces, ...busanJourneyMatchPlaces].filter((place, index, places) => {
  return places.findIndex((candidate) => candidate.id === place.id) === index
})
const indexById = new Map(journeyLookupPlaces.map((place, index) => [place.id, index]))

function placeToken(placeId: string) {
  const index = indexById.get(placeId)
  if (index === undefined) throw new Error(`busan journey preset: unknown place ${placeId}`)
  return index.toString(36)
}

function journeyDay(placeIds: string[]) {
  return placeIds.map(placeToken).join('.')
}

/** 依照 PDF 五天行程與附錄連結建立預設旅杰規劃順序。 */
const busanJourneyDays = [
  {
    title: '第一天．抵達海雲台',
    placeIds: [
      'haeundae-road', 'haeundae-market', 'busan-journey-wubanjang',
      'busan-haeundae', 'busan-journey-daiso-haeundae', 'busan-journey-olive-haeundae',
    ],
  },
  {
    title: '第二天．松島・南浦洞',
    placeIds: [
      'busan-journey-egg-drop', 'Cultural-village', 'busan-pass-mid-cheolsu-younghee-hanbok', 'busan-pass-mid-flipbook-studio',
      'Songdo-skywalk', 'busan-journey-songdo-seafood-1',
      'busan-pass-high-songdo-cable-car', 'busan-journey-songdo-sky-park', 'busan-pass-low-songdo-yonggung-cloud-bridge',
      'Canning-market', 'International-market', 'busan-pass-low-busan-tower', 'busan-journey-nampo-noodle',
      'busan-journey-hotteok', 'busan-journey-olive-nampo', 'busan-journey-daiso-nampo',
    ],
  },
  {
    title: '第三天．海雲台・膠囊列車',
    placeIds: [
      'busan-journey-cafe-1994', 'busan-pass-low-blueline-park-mipo', 'haeundae-crossing',
      'haeundae-stone', 'busan-journey-capsule-train', 'busan-journey-salt-bread', 'busan-journey-abalone-porridge',
      'busan-pass-high-club-d-oasis', 'busan-pass-high-x-the-sky', 'busan-journey-pufferfish',
      'busan-pass-high-diamond-bay-yacht',
    ],
  },
  {
    title: '第四天．樂天世界・廣安里海灘',
    placeIds: [
      'busan-journey-workingholiday', 'busan-pass-high-skyline-luge', 'busan-pass-high-lotte-world-adventure',
      'busan-lotteoutlet', 'haeundae-temple', 'busan-journey-obok-gukbap',
      'busan-haeundae', 'Gwangalli-beach',
    ],
  },
  {
    title: '第五天．西面站半日遊・返程',
    placeIds: [
      'busan-Seomyeonlotte', 'busan-journey-seomyeon-youth', 'busan-journey-butter-shop', 'busan-journey-avivere',
      'busan-journey-artbox', 'busan-journey-object', 'busan-journey-twin-etoile', 'busan-journey-isaac',
      'busan-journey-songjeong-gukbap',
    ],
  },
] as const

function dayItem(dayNumber: number, title: string) {
  return `day:${dayNumber}|${encodeURIComponent(title)}`
}

function transportItem(id: string, mode: 'walk' | 'subway' | 'train' | 'taxi', note: string, href = '', duration = '') {
  return `transport:${id}|${mode}|${encodeURIComponent(duration)}|${encodeURIComponent(note)}|${encodeURIComponent(href)}|`
}

/** 直接寫入 pass_planner_books 的完整五日行程項目，供 /tools/planner?p=... 使用。 */
export const busanJourneyItems = [
  dayItem(1, '第一天．抵達海雲台'),
  'custom:busan-gimhae-airport',
  transportItem('journey-d1-airport', 'subway', '2 號出口旁櫃檯領取釜山 Pass → 機場 3 號出口（過馬路右轉）→ 機場輕軌 → 地鐵沙上站 → 海雲台站 → 入住。也可使用計程車接送。', 'https://www.kkday.com/zh-tw/product/18410?cid=22312'),
  'busan-journey-hotel-shilla-stay',
  'busan-journey-hotel-l7-haeundae',
  'busan-journey-hotel-kolon-haeundae',
  'busan-journey-hotel-uh-suite',
  ...busanJourneyDays[0].placeIds,

  dayItem(2, '第二天．松島・南浦洞'),
  'busan-journey-egg-drop',
  transportItem('journey-d2-subway', 'subway', '早餐後：海雲台站 → 西面站 → 南浦站；再搭計程車前往甘川洞文化村。'),
  ...busanJourneyDays[1].placeIds.slice(1, 4),
  transportItem('journey-d2-songdo', 'taxi', '從 Flipbook Studio 搭計程車前往松島天空步道。'),
  ...busanJourneyDays[1].placeIds.slice(4, 9),
  transportItem('journey-d2-nampo', 'taxi', '松島龍宮空中步道後，搭纜車回松島灣站；再搭計程車前往富平罐頭市場。'),
  ...busanJourneyDays[1].placeIds.slice(9, 10),
  transportItem('journey-d2-market-walk', 'walk', '步行至國際市場，再步行至釜山塔。'),
  ...busanJourneyDays[1].placeIds.slice(10),
  transportItem('journey-d2-return', 'subway', '回住宿：南浦站 → 西面站 → 海雲台站。'),

  dayItem(3, '第三天．海雲台・膠囊列車'),
  ...busanJourneyDays[2].placeIds.slice(0, 2),
  transportItem('journey-d3-mipo', 'taxi', '早餐後搭計程車到海雲台藍線公園尾浦站。'),
  ...busanJourneyDays[2].placeIds.slice(2, 10),
  transportItem('journey-d3-yacht', 'taxi', '搭計程車到鑽石灣遊艇碼頭；行程後搭計程車回住宿。'),
  ...busanJourneyDays[2].placeIds.slice(10),

  dayItem(4, '第四天．樂天世界・廣安里海灘'),
  ...busanJourneyDays[3].placeIds.slice(0, 1),
  transportItem('journey-d4-luge', 'taxi', '09:20 搭計程車前往斜坡滑車。'),
  ...busanJourneyDays[3].placeIds.slice(1, 3),
  'busan-journey-lotte-world-restaurant',
  ...busanJourneyDays[3].placeIds.slice(3, 5),
  transportItem('journey-d4-haeundae', 'taxi', '海東龍宮寺後搭計程車回海雲台。'),
  ...busanJourneyDays[3].placeIds.slice(5, 6),
  'visit:journey-d4-haeundae|busan-haeundae',
  transportItem('journey-d4-gwangalli', 'taxi', '可依體力選擇搭計程車或地鐵前往廣安里海灘。'),
  ...busanJourneyDays[3].placeIds.slice(7),

  dayItem(5, '第五天．西面站半日遊・返程'),
  transportItem('journey-d5-seomyeon', 'subway', '09:00 退房 → 搭地鐵到西面站；在 6／8 號出口附近寄放行李。'),
  ...busanJourneyDays[4].placeIds,
  transportItem('journey-d5-airport', 'subway', '取回行李 → 搭地鐵前往機場返程。'),
]

/** 相容既有 planner 的短版 plan 參數；正式商品入口使用 p= 行程 book。 */
export const busanJourneyPlan = busanJourneyDays.map((day) => journeyDay([...day.placeIds])).join('|')

type JourneyPlannerLink = { label: string; href: string }

/**
 * 原 PDF 的行前資訊不是實體景點，仍以自訂景點形式存到公開範本：
 * 使用者可在 planner 的景點清單開啟原始連結，複製行程時也會一併帶走。
 */
export const busanJourneyCustomPlaces = {
  'custom:busan-gimhae-airport': {
    name: '金海國際機場（PUS）', category: 'spot', lat: 35.1796, lng: 128.9382,
    links: [
      { label: '機場接送', href: 'https://www.kkday.com/zh-tw/product/18410?cid=22312' },
      { label: '釜山 Pass 領取資訊', href: 'https://www.kkday.com/zh-tw/product/138477-visit-busan-pass-discount-free-attractions?cid=22312' },
    ],
  },
  'custom:busan-entry': {
    name: '行前｜入境簽證', category: 'spot', lat: 35.1796, lng: 128.9382,
    links: [
      { label: 'K-ETA IG 教學', href: 'https://www.instagram.com/reel/DKetNmXTW3E/' },
      { label: 'K-ETA 官網申請', href: 'https://www.k-eta.go.kr/portal/newapply/index.do' },
      { label: '電子入境卡官網', href: 'https://www.e-arrivalcard.go.kr/portal/main/index.do' },
      { label: '電子入境卡 IG 教學', href: 'https://www.instagram.com/reel/DKMrn6dzS4G/' },
    ],
  },
  'custom:busan-tickets': {
    name: '行前｜釜山票券與預約', category: 'spot', lat: 35.1796, lng: 128.9382,
    links: [
      { label: '釜山 Pass 介紹 IG', href: 'https://www.instagram.com/reel/DUDiZzQkdUe/' },
      { label: '釜山 Pass 購買', href: 'https://www.kkday.com/zh-tw/product/138477-visit-busan-pass-discount-free-attractions?cid=22312' },
      { label: '實體／電子 Pass 選擇', href: 'https://www.instagram.com/reel/DN-uWhB4gI2/' },
      { label: '釜山 Pass 景點地圖', href: 'https://www.google.com/maps/d/edit?mid=1XsSQewsHL9iIolJLr7wTnD0bz44jOIs&usp=sharing' },
      { label: '膠囊列車訂票', href: 'https://www.kkday.com/zh-tw/product/123012-haeundae-blueline-park-sky-capsule-beach-train-ticket?cid=22312' },
      { label: '鑽石灣遊艇官網', href: 'https://diamondbay-tw.imweb.me/vbp-tw' },
    ],
  },
  'custom:busan-connectivity': {
    name: '行前｜網路、WOWPASS 與 T-money', category: 'spot', lat: 35.1796, lng: 128.9382,
    links: [
      { label: 'eSIM（JieJourneys 折扣）', href: 'https://esimconnect.com.tw/#/access/esimbuy?referencecode=jiejourneys' },
      { label: 'SIM 卡（含 T-money）', href: 'https://www.kkday.com/zh-tw/product/20721-4g-lte-sim-card-with-t-money-card-calls-pick-up-south-korea-airports-south-korea?cid=22312' },
      { label: 'Wifi 分享器', href: 'https://www.kkday.com/zh-tw/product/7452-unlimited-4g-pocket-wi-fi-rental-with-airports-and-seoul-pick-up-south-korea?cid=22312' },
      { label: 'WOWPASS', href: 'https://www.kkday.com/zh-tw/product/149562?cid=22312' },
      { label: 'T-money', href: 'https://www.kkday.com/zh-tw/product/132542-korea-4g-high-speed-esim?cid=22312' },
    ],
  },
  'custom:busan-transport-apps': {
    name: '行前｜叫車、導航與規定', category: 'spot', lat: 35.1796, lng: 128.9382,
    links: [
      { label: 'Uber Android', href: 'https://play.google.com/store/apps/details?id=com.ubercab&hl=zh_TW' },
      { label: 'Uber iOS', href: 'https://apps.apple.com/tw/app/%E5%84%AA%E6%AD%A5-%E9%9A%A8%E6%99%82%E9%A0%90%E7%B4%84%E6%90%AD%E4%B9%98%E8%A8%88%E7%A8%8B%E8%BB%8A/id368677368' },
      { label: 'Kakao T Android', href: 'https://play.google.com/store/apps/details?id=com.kakao.taxi&hl=zh_TW' },
      { label: 'Kakao T iOS', href: 'https://apps.apple.com/us/app/kakao-t/id981110422' },
      { label: 'Naver Map Android', href: 'https://play.google.com/store/apps/details?id=com.nhn.android.nmap&hl=zh_TW' },
      { label: 'Naver Map iOS', href: 'https://apps.apple.com/tw/app/naver-map-navigation/id311867728' },
      { label: '韓幣現金換匯建議', href: 'https://www.instagram.com/reel/DKetKpgTvd7/' },
      { label: '行動電源規定', href: 'https://www.instagram.com/reel/DKmbjKIzsAT/' },
    ],
  },
  'custom:busan-booking-info': {
    name: '行前｜訂房與釜山資訊', category: 'hotel', lat: 35.1796, lng: 128.9382,
    links: [
      { label: 'Trip.com 訂房／機票', href: 'https://tw.trip.com/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5551709' },
      { label: 'Agoda 訂房', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw' },
      { label: '旅杰釜山攻略', href: 'https://www.jiejourneys.com/busan/' },
    ],
  },
} satisfies Record<string, {
  name: string
  category: 'spot' | 'hotel'
  lat: number
  lng: number
  links: JourneyPlannerLink[]
}>

/** 每一張「我的順序」卡片會顯示的完整行程提醒。 */
const busanJourneyBookNotesRaw: Record<string, string> = {
  'custom:busan-gimhae-airport': '抵達後依行程領取釜山 Pass，再前往機場 3 號出口搭輕軌轉地鐵到海雲台站；也可使用機場接送。返程從住宿取回行李後回到此處。',
  'custom:busan-entry': '依 PDF：先確認是否需要 K-ETA；若免申請，填寫電子入境卡即可。兩種流程的原始教學與官網都保留在連結中。',
  'custom:busan-tickets': '依 PDF：釜山 Pass 建議購買 48 小時；膠囊列車預約 Day 3 12:00，鑽石灣遊艇預約 Day 3 19:30／20:30。',
  'custom:busan-connectivity': '依 PDF：可選 eSIM、SIM 卡或 Wifi 分享器；交通可準備 WOWPASS 與 T-money。',
  'custom:busan-transport-apps': '依 PDF：Google Maps 可設定位點但不適合規劃路線，請先下載 Naver Map；叫車可使用 Uber 或 Kakao T。',
  'custom:busan-booking-info': 'PDF 的訂房／機票入口與釜山攻略首頁。原始住宿選項也完整保留在景點清單的住宿分類。',
  'haeundae-road': 'Day 1 下午入住後開始逛海雲台：海理團路 → 海雲台傳統市場 → 海雲台海灘。住宿請選海雲台站附近，15:00 後入住、11:00 前退房。',
  'haeundae-market': '在地傳統市場；從海理團路步行前往。',
  'busan-haeundae': 'Day 1 海雲台散步終點；可接晚餐與逛街。',
  'busan-journey-wubanjang': 'Day 1 晚餐三選一；只保留想吃的一間即可。烤肉，12:00–01:00。',
  'busan-journey-ant-house': 'Day 1 晚餐三選一；只保留想吃的一間即可。辣炒章魚，24 小時。',
  'busan-journey-mijangwang': 'Day 1 晚餐三選一；只保留想吃的一間即可。烤肉，12:00–15:00、17:00–23:00。',
  'busan-journey-daiso-haeundae': 'Day 1 晚上逛街：DAISO；10:00–22:00。',
  'busan-journey-olive-haeundae': 'Day 1 晚上逛街：Olive Young 買彩妝；10:00–23:00。',

  'busan-journey-egg-drop': 'Day 2 09:00 出門早餐；吃完搭地鐵從海雲台站經西面站到南浦站。',
  'Cultural-village': '甘川洞文化村：小王子、新小王子。接著前往哲秀與英熙，建議約 11:00 到。',
  'busan-pass-mid-cheolsu-younghee-hanbok': '釜山 Pass 第 1 景點：高級韓服 1 小時＋免費配飾，09:00–17:00。這樣 Day 4 能在 Pass 48 小時內進樂天世界／斜坡滑車。怕太趕可另購韓服體驗並略過 Flipbook。',
  'busan-pass-mid-flipbook-studio': '釜山 Pass 第 2 景點：兩張 Pass 可製作一本手翻書，10:00–17:30。怕太趕可略過。',
  'Songdo-skywalk': '松島天空步道；搭計程車從甘川洞區域前往，接著在附近午餐。',
  'busan-journey-songdo-seafood-1': 'Day 2 午餐三選一；只保留想吃的一間即可。海鮮鍋，11:00–23:00，週二公休。',
  'busan-journey-songdo-seafood-2': 'Day 2 午餐三選一；只保留想吃的一間即可。海鮮餐，11:00–00:00。',
  'busan-journey-songdo-hotpot': 'Day 2 午餐三選一；只保留想吃的一間即可。韓式套餐，10:30–21:00。',
  'busan-pass-high-songdo-cable-car': '釜山 Pass 第 3 景點：步行到松島灣纜車站，搭纜車前往 Sky Park。',
  'busan-journey-songdo-sky-park': '松島纜車終點站；接著前往松島龍宮空中步道。',
  'busan-pass-low-songdo-yonggung-cloud-bridge': '釜山 Pass 第 4 景點：松島龍宮空中步道。走完後再搭纜車回松島灣站。',
  'Canning-market': '搭計程車到富平罐頭市場；傳統市場，09:30–23:30。接著步行至國際市場與釜山塔。',
  'International-market': '生活雜貨市場，09:00–18:00；步行前往釜山塔。',
  'busan-pass-low-busan-tower': '釜山 Pass 第 5 景點：釜山塔展望台，10:00–22:00。',
  'busan-journey-nampo-noodle': 'Day 2 晚餐三選一；只保留想吃的一間即可。冷麵和水餃，10:15–21:30。',
  'busan-journey-nampo-seolleongtang': 'Day 2 晚餐三選一；只保留想吃的一間即可。雪濃湯和豬肉湯飯，24 小時。',
  'busan-journey-bean-field': 'Day 2 晚餐三選一；只保留想吃的一間即可。豆腐鍋、豬排、牛肉片、辣炒年糕，10:30–21:00。',
  'busan-journey-hotteok': 'Day 2 宵夜：元祖糖餅必吃，10:30–22:00。',
  'busan-journey-olive-nampo': 'Day 2 視體力逛 Olive Young；10:30–22:30。',
  'busan-journey-daiso-nampo': 'Day 2 視體力逛 DAISO；10:00–22:00。',

  'busan-journey-cafe-1994': 'Day 3 08:30 出門早餐二選一；吃完搭計程車到海雲台藍線公園尾浦站。可頌／鬆餅，07:00–00:00。',
  'busan-journey-frank-burger': 'Day 3 08:30 出門早餐二選一；吃完搭計程車到海雲台藍線公園尾浦站。漢堡，08:00–21:00。',
  'busan-pass-low-blueline-park-mipo': '10:00 海岸列車：尾浦站 → 青沙浦站。釜山 Pass 第 6 景點；請提前 10 分鐘到，不用預約；營業 09:00–20:30。',
  'haeundae-crossing': '灌籃高手平交道；海岸列車抵達青沙浦後順路停留。',
  'haeundae-stone': '青沙浦天空步道；海岸列車抵達青沙浦後順路停留。',
  'busan-journey-capsule-train': '12:00 膠囊列車：青沙浦 → 尾浦；建議 11:30 先到月台，車程約 30 分鐘。請事先購票。',
  'busan-journey-salt-bread': 'Day 3 小吃：自然島鹽麵包，09:00–22:00。',
  'busan-journey-abalone-porridge': 'Day 3 午餐二選一；只保留想吃的一間即可。07:00–14:30、16:00–20:00。',
  'busan-journey-cod-soup': 'Day 3 午餐二選一；只保留想吃的一間即可。08:00–20:40。',
  'busan-pass-high-club-d-oasis': '釜山 Pass 第 7 景點：戶外 Spa（需帶泳衣）＋汗蒸房 4 小時，10:00–22:30。',
  'busan-pass-high-x-the-sky': '釜山 Pass 第 8 景點：BUSAN X the SKY 釜山展望台，10:00–21:00。',
  'busan-journey-pufferfish': 'Day 3 晚餐二選一；只保留想吃的一間即可。錦繡河豚湯，24 小時營業。',
  'busan-journey-samgyetang': 'Day 3 晚餐二選一；只保留想吃的一間即可。10:30–15:00、17:00–21:00。',
  'busan-pass-high-diamond-bay-yacht': '釜山 Pass 第 9 景點：19:30／20:30 夜間遊艇；現場夜間加收 5,000 韓元。請先官網預約。',

  'busan-journey-workingholiday': 'Day 4 08:20 出門早餐二選一；早午餐，08:00–21:00，週二休。',
  'busan-journey-and-coffee': 'Day 4 08:20 出門早餐二選一；早午餐，08:00–21:30。',
  'busan-pass-high-skyline-luge': '釜山 Pass 第 10 景點：09:20 搭計程車前往。斜坡滑車 2 次或高空滑索 1 次，10:00–18:00。',
  'busan-pass-high-lotte-world-adventure': '釜山 Pass 第 11 景點：斜坡滑車後搭計程車前往。請在 Pass 48 小時結束前進場；若太趕，斜坡滑車與樂天世界擇一即可。10:00–19:00。',
  'busan-journey-lotte-world-restaurant': 'Day 4 午餐二選一：樂天世界園內餐廳。',
  'busan-journey-lotte-outlet-restaurant': 'Day 4 午餐二選一：樂天 Outlet 3 樓餐廳。',
  'busan-lotteoutlet': '午餐後步行至樂天 Outlet 逛街購物；10:30–20:30。',
  'haeundae-temple': '搭計程車前往海東龍宮寺；海上寺廟，04:00–20:00。',
  'busan-journey-obok-gukbap': 'Day 4 晚餐三選一；只保留想吃的一間即可。豬肉湯飯，24 小時。',
  'busan-journey-haemok': 'Day 4 晚餐三選一；只保留想吃的一間即可。鰻魚／海鮮，11:00–15:00、17:00–22:00。',
  'busan-journey-marinated-crab': 'Day 4 晚餐三選一；只保留想吃的一間即可。海鮮／螃蟹，11:00–00:00。',
  'visit:journey-d4-haeundae|busan-haeundae': '海東龍宮寺後搭計程車回海雲台晚餐；若還有體力，再前往廣安里海灘。',
  'Gwangalli-beach': 'Day 4 晚上可依體力搭計程車／地鐵前往廣安里海灘。',

  'busan-Seomyeonlotte': 'Day 5 西面站逛街：樂天百貨，10:30–20:00；先在西面站 6／8 號出口附近寄放行李。',
  'busan-journey-seomyeon-youth': '西面青春街商店街；依序逛 Butter Shop、AVIVERE、Artbox、Object Seomyeon、TWIN ÉTOILE。',
  'busan-journey-butter-shop': 'Day 5 西面購物；可愛玩物，10:30–23:00。',
  'busan-journey-avivere': 'Day 5 西面購物；可愛玩物，11:00–23:00。',
  'busan-journey-artbox': 'Day 5 西面購物；可愛玩物，11:00–22:30。',
  'busan-journey-object': 'Day 5 西面購物；可愛玩物，12:00–21:00。',
  'busan-journey-twin-etoile': 'Day 5 西面購物；可愛玩物，12:00–20:30。',
  'busan-journey-isaac': 'Day 5 早餐：ISAAC 吐司，西面站 9 號出口，09:00–20:00。',
  'busan-journey-songjeong-gukbap': 'Day 5 午餐三選一；只保留想吃的一間即可。24 小時。',
  'busan-journey-jeju-porridge': 'Day 5 午餐三選一；只保留想吃的一間即可。08:00–22:00。',
  'busan-journey-hong-kong': 'Day 5 午餐三選一；只保留想吃的一間即可。炸醬麵，11:00–20:30。',
}

const busanJourneyManualUserLinks: Record<string, JourneyPlannerLink[]> = {
  'haeundae-road': [
    { label: '機場計程車接送', href: 'https://www.kkday.com/zh-tw/product/18410?cid=22312' },
  ],
  'busan-haeundae': [
    { label: '海雲台 IG Reels', href: 'https://www.instagram.com/reel/DLuh1WzzM0c/' },
  ],
  'Cultural-village': [
    { label: '甘川洞 IG Reels', href: 'https://www.instagram.com/reel/DL408o_ze1X/' },
  ],
  'busan-pass-mid-cheolsu-younghee-hanbok': [
    { label: '韓服體驗（替代）', href: 'https://www.kkday.com/zh-tw/product/18874-busan-hanbok-costume-experience-gamcheon-culture-village-korea?cid=22312' },
  ],
  'busan-pass-low-busan-tower': [
    { label: '釜山塔 IG Reels', href: 'https://www.instagram.com/reel/DMKh_XmzOdG/' },
  ],
  'busan-pass-low-blueline-park-mipo': [
    { label: '海雲台藍線公園 IG Reels', href: 'https://www.instagram.com/reel/DMu5uZxTdO8/' },
  ],
  'busan-pass-high-club-d-oasis': [
    { label: 'Club D Oasis 樓層指南', href: 'https://www.clubdoasis.com/guide/cn/floor' },
  ],
  'busan-pass-high-diamond-bay-yacht': [
    { label: '鑽石灣遊艇預約', href: 'https://diamondbay-tw.imweb.me/vbp-tw' },
  ],
  'busan-pass-high-lotte-world-adventure': [
    { label: '遊樂設施', href: 'https://adventurebusan.lotteworld.com/enjoy/attrctn/list' },
    { label: '表演', href: 'https://adventurebusan.lotteworld.com/enjoy/performance/list' },
    { label: '樂天世界餐廳', href: 'https://adventurebusan.lotteworld.com/enjoy/restaurant/list' },
  ],
  'busan-lotteoutlet': [
    { label: 'Outlet 樓層指南', href: 'https://m.global.lotteshopping.com/cht/store/main?cstrCd=0352' },
  ],
  'busan-Seomyeonlotte': [
    { label: '樂天百貨樓層指南', href: 'https://m.global.lotteshopping.com/cht/store/main?cstrCd=0005' },
  ],
}

const busanJourneyHotelPlaceIds = [
  'busan-journey-hotel-shilla-stay',
  'busan-journey-hotel-l7-haeundae',
  'busan-journey-hotel-kolon-haeundae',
  'busan-journey-hotel-uh-suite',
]

const busanJourneySourcePlaceIds = Array.from(new Set([
  ...busanJourneyDays.flatMap((day) => day.placeIds),
  ...busanJourneyHotelPlaceIds,
]))

function uniqueJourneyLinks(links: JourneyPlannerLink[]) {
  const seen = new Set<string>()
  return links.filter((link) => {
    if (!link.label || !link.href || seen.has(link.href)) return false
    seen.add(link.href)
    return true
  }).slice(0, 8)
}

function sourceLinksForJourneyPlace(placeId: string): JourneyPlannerLink[] {
  const place = journeyLookupPlaces.find((candidate) => candidate.id === placeId)
  if (!place) return []
  return (place.spotActions ?? []).map(({ label, href }) => ({ label, href }))
}

function isJourneyMapLink(href: string) {
  return /(?:maps\.app\.goo\.gl|google\.[^/]+\/maps|naver\.me|map\.naver\.com)/i.test(href)
}

function restaurantAlternativeMapLink(placeId: string): JourneyPlannerLink | null {
  const place = journeyLookupPlaces.find((candidate) => candidate.id === placeId)
  if (!place?.spotGoogleMapsUrl) return null
  return { label: `備選｜${place.name}`, href: place.spotGoogleMapsUrl }
}

const busanJourneyRestaurantAlternativeIds: Record<string, string[]> = {
  'busan-journey-wubanjang': ['busan-journey-ant-house', 'busan-journey-mijangwang'],
  'busan-journey-songdo-seafood-1': ['busan-journey-songdo-seafood-2', 'busan-journey-songdo-hotpot'],
  'busan-journey-nampo-noodle': ['busan-journey-nampo-seolleongtang', 'busan-journey-bean-field'],
  'busan-journey-cafe-1994': ['busan-journey-frank-burger'],
  'busan-journey-abalone-porridge': ['busan-journey-cod-soup'],
  'busan-journey-pufferfish': ['busan-journey-samgyetang'],
  'busan-journey-workingholiday': ['busan-journey-and-coffee'],
  'busan-journey-lotte-world-restaurant': ['busan-journey-lotte-outlet-restaurant'],
  'busan-journey-obok-gukbap': ['busan-journey-haemok', 'busan-journey-marinated-crab'],
  'busan-journey-songjeong-gukbap': ['busan-journey-jeju-porridge', 'busan-journey-hong-kong'],
}

const busanJourneyRestaurantAlternativeLinks: Record<string, JourneyPlannerLink[]> = Object.fromEntries(
  Object.entries(busanJourneyRestaurantAlternativeIds).map(([primaryPlaceId, alternativePlaceIds]) => [
    primaryPlaceId,
    alternativePlaceIds
      .map(restaurantAlternativeMapLink)
      .filter((link): link is JourneyPlannerLink => Boolean(link)),
  ]),
)

/**
 * 地圖由 planner 的「地圖」操作統一提供；這裡只保留 PDF 的資源、票券與訂位連結。
 */
export const busanJourneyBookUserLinks: Record<string, JourneyPlannerLink[]> = Object.fromEntries(
  Array.from(new Set([
    ...busanJourneySourcePlaceIds,
    ...Object.keys(busanJourneyManualUserLinks),
    ...Object.keys(busanJourneyRestaurantAlternativeLinks),
  ]))
    .map((placeId) => [
      placeId,
      uniqueJourneyLinks([
        ...sourceLinksForJourneyPlace(placeId),
        ...(busanJourneyManualUserLinks[placeId] ?? []),
        ...(busanJourneyRestaurantAlternativeLinks[placeId] ?? []),
      ]).filter((link) => !isJourneyMapLink(link.href) || link.label.startsWith('備選｜')),
    ])
    .filter(([, links]) => links.length > 0),
)

function stripJourneyDayReferences(value: string) {
  return value.replace(/\bDay\s*\d+\s*/gi, '').replace(/\s{2,}/g, ' ').trim()
}

const busanJourneyRestaurantAlternatives: Record<string, string> = {
  'busan-journey-wubanjang': '晚餐首選。備選：螞蟻家辣炒章魚、味贊王鹽烤肉；可直接點本卡片「連結」中的店名開啟 Google Maps。',
  'busan-journey-songdo-seafood-1': '午餐首選。備選：海底貝殼王國、松島海鮮鍋；可直接點本卡片「連結」中的店名開啟 Google Maps。',
  'busan-journey-nampo-noodle': '晚餐首選。備選：南浦雪濃湯、豆田裡；可直接點本卡片「連結」中的店名開啟 Google Maps。',
  'busan-journey-cafe-1994': '早餐首選。備選：Frank Burger；可直接點本卡片「連結」中的店名開啟 Google Maps。',
  'busan-journey-abalone-porridge': '午餐首選。備選：瓦房鱈魚湯；可直接點本卡片「連結」中的店名開啟 Google Maps。',
  'busan-journey-pufferfish': '晚餐首選。備選：名品海雲台蔘雞湯；可直接點本卡片「連結」中的店名開啟 Google Maps。',
  'busan-journey-workingholiday': '早餐首選。備選：AND COFFEE；可直接點本卡片「連結」中的店名開啟 Google Maps。',
  'busan-journey-lotte-world-restaurant': '午餐首選。備選：樂天 Outlet 3 樓餐廳；可直接點本卡片「連結」中的店名開啟 Google Maps。',
  'busan-journey-obok-gukbap': '晚餐首選。備選：海木、Haeundae Marinated Crab；可直接點本卡片「連結」中的店名開啟 Google Maps。',
  'busan-journey-songjeong-gukbap': '晚餐首選。備選：濟州家海鮮粥、香港飯店；可直接點本卡片「連結」中的店名開啟 Google Maps。',
}

const busanJourneyHotelSelectionNotes: Record<string, string> = Object.fromEntries(
  busanJourneyHotelPlaceIds.map((placeId) => [
    placeId,
    '住宿四選一：比較本卡片的訂房連結後選定一間入住；複製行程後可刪除其餘住宿卡片。',
  ]),
)

export const busanJourneyBookNotes: Record<string, string> = Object.fromEntries(
  Array.from(new Set([
    ...Object.keys(busanJourneyBookNotesRaw),
    ...Object.keys(busanJourneyHotelSelectionNotes),
  ])).map((placeId) => [
    placeId,
    [
      busanJourneyBookNotesRaw[placeId] ? stripJourneyDayReferences(busanJourneyBookNotesRaw[placeId]) : '',
      busanJourneyRestaurantAlternatives[placeId],
      busanJourneyHotelSelectionNotes[placeId],
    ].filter(Boolean).join('｜'),
  ]),
)

/** planner 既有的「行前準備」面板預載項目。 */
export const busanJourneyPreDeparture = {
  version: 2 as const,
  travelers: [{ id: 'traveler-owner', name: '我' }],
  checked: {},
  notes: {
    general: '入境：先確認是否需 K-ETA；若免申請，僅填電子入境卡。票券：48 小時釜山 Pass、12:00 膠囊列車、19:30／20:30 鑽石灣遊艇。交通：WOWPASS／T-money、Uber 或 Kakao T、Naver Map。提醒：Club D Oasis 戶外 Spa 要帶泳衣；另備韓國轉接頭並確認行動電源規定。',
  },
  customItems: [
    { id: 'custom-busan-keta', label: '確認 K-ETA／電子入境卡', custom: true, categoryId: 'essentials', scope: 'personal', travelerIds: ['traveler-owner'] },
    { id: 'custom-busan-pass', label: '購買 48 小時釜山 Pass', custom: true, categoryId: 'essentials', scope: 'personal', travelerIds: ['traveler-owner'] },
    { id: 'custom-busan-capsule', label: '預訂 12:00 膠囊列車', custom: true, categoryId: 'essentials', scope: 'personal', travelerIds: ['traveler-owner'] },
    { id: 'custom-busan-yacht', label: '預約鑽石灣遊艇', custom: true, categoryId: 'essentials', scope: 'personal', travelerIds: ['traveler-owner'] },
    { id: 'custom-busan-wowpass', label: '準備 WOWPASS／T-money', custom: true, categoryId: 'essentials', scope: 'personal', travelerIds: ['traveler-owner'] },
    { id: 'custom-busan-naver', label: '安裝 Naver Map、Uber 或 Kakao T', custom: true, categoryId: 'digital', scope: 'personal', travelerIds: ['traveler-owner'] },
    { id: 'custom-busan-swimwear', label: 'Club D Oasis 戶外 Spa 泳衣', custom: true, categoryId: 'clothing', scope: 'personal', travelerIds: ['traveler-owner'] },
    { id: 'custom-busan-exchange', label: '韓幣現金換匯', custom: true, categoryId: 'essentials', scope: 'personal', travelerIds: ['traveler-owner'] },
  ],
  removedItemIds: [],
  hiddenCategoryIds: [],
}

/** 可直接上傳到 pass_planner_books 的釜山 PDF 完整範本。 */
export const busanJourneyBook = {
  city: '釜山五日',
  items: busanJourneyItems,
  notes: busanJourneyBookNotes,
  custom_places: busanJourneyCustomPlaces,
  user_links: busanJourneyBookUserLinks,
  pre_departure: busanJourneyPreDeparture,
}
