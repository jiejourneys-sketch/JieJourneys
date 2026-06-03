import type { CityCardAction } from '@/components/CityTabbedList'
import type { MapPlace } from '@/lib/mapPlace'

export const FUJI_PASS_MAP_CENTER = { lat: 35.5112, lng: 138.7630 }

type FujiPassPlaceInput = Omit<MapPlace, 'spotActions' | 'mapButtonMapEvent'> & {
  slug: string
  spotActions?: CityCardAction[]
}

function place(input: FujiPassPlaceInput): MapPlace {
  const { slug, ...rest } = input

  return {
    ...rest,
    mapButtonMapEvent: `fujipassmap_${slug}_map`,
  }
}

export const fujiPassMapPlaces: MapPlace[] = [
  place({
    id: 'fuji-pass-gateway-fujiyama-kawaguchiko',
    slug: 'gateway_fujiyama_kawaguchiko',
    category: 'food',
    plannerCategory: 'shop',
    name: 'Gateway Fujiyama 河口湖站店',
    description: '河口湖站內的伴手禮商店，冰淇淋或飲品95折優惠。',
    lat: 35.498232,
    lng: 138.7687283,
    spotGoogleMapsUrl:
      'https://maps.app.goo.gl/4Y48ZCHvth7TioQE6',
  }),
  place({
    id: 'fuji-pass-fujiyamaya-fujisan',
    slug: 'fujiyamaya_fujisan',
    category: 'food',
    plannerCategory: 'shop',
    name: 'FUJIYAMAYA 富士山站店',
    description: '富士山站內的當地特色商品店，冰淇淋或飲品95折優惠。',
    lat: 35.4835157,
    lng: 138.7959987,
    spotGoogleMapsUrl:
      'https://maps.app.goo.gl/iEfnLiFdJg1dnDhK9',
  }),
  place({
    id: 'fuji-pass-unjokaku',
    slug: 'unjokaku',
    category: 'food',
    plannerCategory: 'shop',
    name: '富士急雲上閣',
    description: '富士山五合目商店與餐飲設施，購物滿 1000 日圓可享9折優惠。',
    lat: 35.3939662,
    lng: 138.7326402,
    spotGoogleMapsUrl:
      'https://maps.app.goo.gl/nR1oG37Kx9fGH1Mg7',
  }),
  place({
    id: 'fuji-pass-morinoeki-fujiyama',
    slug: 'morinoeki_fujiyama',
    category: 'food',
    plannerCategory: 'restaurant',
    name: '森之驛富士山',
    description: '富士山南麓的休息站與餐飲設施，用餐可獲贈1杯飲料。',
    lat: 35.3058192,
    lng: 138.7699834,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/Gb6epwqksNZ731e37',
  }),
  place({
    id: 'fuji-pass-oshino-ninja',
    slug: 'oshino_ninja',
    category: 'food',
    plannerCategory: 'ticket',
    name: '忍野 忍者主題村',
    description: '忍野八海附近的忍者主題設施，入園費可優惠 100 日圓。',
    lat: 35.4567699,
    lng: 138.8180809,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/s6QBpWaNkfvCzLBh9',
  }),
  place({
    id: 'fuji-pass-fujiq-bus-terminal',
    slug: 'fujiq_bus_terminal',
    category: 'food',
    plannerCategory: 'shop',
    name: '富士急樂園巴士總站',
    description: '富士急樂園旁的巴士總站商店，冰淇淋或飲品95折優惠。',
    lat: 35.4845555,
    lng: 138.7767335,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/8ngLVFue1Qq41Kh37',
  }),
  place({
    id: 'fuji-pass-kawaguchiko-ropeway',
    slug: 'kawaguchiko_ropeway',
    category: 'spot',
    plannerCategory: 'ticket',
    name: '纜車｜河口湖',
    description: '天上山公園纜車，可俯瞰整個河口湖與富士山全景，免費乘坐。',
    lat: 35.5040321,
    lng: 138.7720895,
    spotActions: [
      {
        label: 'KLOOK',
        href: 'https://www.klook.com/zh-TW/activity/89462-mt-fuji-panoramic-ropeway-round-trip-ticket-yamanashi/?aid=93798',
        className: 'btn primary',
        event: 'fujipassmap_ropeway_klook',
        platform: 'KLOOK',
        section: 'map_bar',
      },
      {
        label: 'Trip',
        href: 'https://tw.trip.com/travel-guide/attraction/fujikawaguchiko/mt-fuji-panoramic-ropeway-23487867?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D15968339',
        className: 'btn',
        event: 'fujipassmap_ropeway_trip',
        platform: 'Trip',
        section: 'map_bar',
      },
    ],
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/87qi3yMZoWTcNBYy9',
    relatedTicketHref: '/fuji/ticket?tag=%E6%B2%B3%E5%8F%A3%E6%B9%96%E7%BA%9C%E8%BB%8A&from=pass-map&place=fuji-pass-kawaguchiko-ropeway#ticketListTitle',
  }),
  place({
    id: 'fuji-pass-fujiq-highland',
    slug: 'fujiq_highland',
    category: 'spot',
    plannerCategory: 'ticket',
    name: '富士急樂園',
    description: '富士山腳下的高刺激遊樂園，可免費搭乘1次指定遊樂設施。',
    lat: 35.4869467,
    lng: 138.7805511,
    spotActions: [
      {
        label: 'KKDAY',
        href: 'https://www.kkday.com/zh-tw/product/20133-fuji-q-highland-e-ticket?cid=22312',
        className: 'btn primary',
        event: 'fujipassmap_highland_kkday',
        platform: 'KKDAY',
        section: 'map_bar',
      },
      {
        label: 'KLOOK',
        href: 'https://www.klook.com/zh-TW/activity/95879-fujiq-highland-admission-ticket/?aid=93798',
        className: 'btn',
        event: 'fujipassmap_highland_klook',
        platform: 'KLOOK',
        section: 'map_bar',
      },
      {
        label: 'Trip',
        href: 'https://tw.trip.com/travel-guide/attraction/fujiyoshida/fuji-q-highland-90440/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D15968339',
        className: 'btn',
        event: 'fujipassmap_highland_trip',
        platform: 'Trip',
        section: 'map_bar',
      },
    ],
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/t4hFcuuLKJpg8rZ78',
    relatedTicketHref: '/fuji/ticket?tag=%E5%AF%8C%E5%A3%AB%E6%80%A5%E6%A8%82%E5%9C%92&from=pass-map&place=fuji-pass-fujiq-highland#ticketListTitle',
  }),
  place({
    id: 'fuji-pass-fujiyama-onsen',
    slug: 'fujiyama_onsen',
    category: 'free',
    plannerCategory: 'ticket',
    name: '富士山溫泉',
    description: '富士急樂園旁的日歸溫泉，成人優惠 100 日圓、兒童優惠 50 日圓。',
    lat: 35.4834879,
    lng: 138.7794548,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/XwSHFHEG2pwcFHXq9',
  }),
  place({
    id: 'fuji-pass-grinpa',
    slug: 'grinpa',
    category: 'spot',
    plannerCategory: 'ticket',
    name: '遊樂園 Grinpa',
    description: '富士山南麓的親子遊樂園，持富士山周遊券可免費入場。',
    lat: 35.2906851,
    lng: 138.7826278,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/Ez4kgyDhjR7ULWHS8',
  }),
  place({
    id: 'fuji-pass-kawaguchiko-appare',
    slug: 'kawaguchiko_appare',
    category: 'spot',
    plannerCategory: 'ticket',
    name: '河口湖遊覽船 Appare',
    description: '河口湖上的觀光遊覽船，持富士山周遊券可免費搭乘。',
    lat: 35.5037494,
    lng: 138.7705261,
    spotActions: [
      {
        label: 'KKDAY',
        href: 'https://www.kkday.com/zh-tw/product/574488?cid=22312',
        className: 'btn primary',
        event: 'fujipassmap_cruise_kkday',
        platform: 'KKDAY',
        section: 'map_bar',
      },
      {
        label: 'Trip',
        href: 'https://tw.trip.com/travel-guide/attraction/fujikawaguchiko/lake-kawaguchiko-sightseeing-boat-appare-29874636?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D15968339',
        className: 'btn',
        event: 'fujipassmap_cruise_trip',
        platform: 'Trip',
        section: 'map_bar',
      },
    ],
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/qEMVGkzUG6WbvHm2A',
    relatedTicketHref: '/fuji/ticket?tag=%E6%B2%B3%E5%8F%A3%E6%B9%96%E9%81%8A%E8%A6%BD%E8%88%B9&from=pass-map&place=fuji-pass-kawaguchiko-appare#ticketListTitle',
  }),
  place({
    id: 'fuji-pass-yamanakako-swan-lake',
    slug: 'yamanakako_swan_lake',
    category: 'spot',
    plannerCategory: 'ticket',
    name: '山中湖遊覽船 白鳥之湖',
    description: '山中湖上的白鳥造型遊覽船，可免費搭乘。',
    lat: 35.4082095,
    lng: 138.8765327,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/8A6u6dzux9YNLukL8',
    relatedTicketHref: '/fuji/ticket?tag=%E5%B1%B1%E4%B8%AD%E6%B9%96&from=pass-map&place=fuji-pass-yamanakako-swan-lake#ticketListTitle',
  }),
]
