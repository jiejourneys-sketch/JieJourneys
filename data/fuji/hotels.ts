import type { CityCard } from '@/components/CityTabbedList'
import type { TabItem } from '@/components/AreaTabs'

export const fujiHotelTabs: TabItem[] = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '逆富士山', label: '逆富士山', dataArea: '逆富士山' },
  { value: '近車站', label: '近車站', dataArea: '近車站' },
]

export const fujiHotelCards: CityCard[] = [
  // ── 逆富士山 ──────────────────────────────────────────────
  {
    title: '河口湖溫泉飯店KUKUNA',
    meta: '逆富士山｜星級、特色描述',
    area: '逆富士山',
    datasetKey: 'hotel',
    datasetValue: '河口湖溫泉飯店KUKUNA',
    lat: 35.5133398,
    lng: 138.7714554,
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/detail/?cityId=50160&hotelId=1497241&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16105119', className: 'btn primary', event: 'fujihotel_A1_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=10565085', className: 'btn', event: 'fujihotel_A1_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/7dLBzT82ZpTBtAkv7', className: 'btn', event: 'fujihotel_A1_map', platform: 'Maps', section: 'hotel_card' },
    ],
  },
  {
    title: '河口湖城市渡假別墅',
    meta: '逆富士山｜星級、特色描述',
    area: '逆富士山',
    datasetKey: 'hotel',
    datasetValue: '河口湖城市渡假別墅',
    lat: 35.5222585,
    lng: 138.7443278,
    actions: [
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=1537458', className: 'btn primary', event: 'fujihotel_A2_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/3RbiCqf3nh3oLQfLA', className: 'btn', event: 'fujihotel_A2_map', platform: 'Maps', section: 'hotel_card' },
    ],
  },
  {
    title: '虹夕諾雅富士',
    meta: '逆富士山｜星級、特色描述',
    area: '逆富士山',
    datasetKey: 'hotel',
    datasetValue: '虹夕諾雅富士',
    lat: 35.5253284,
    lng: 138.7450933,
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/detail/?cityEnName=Fujikawaguchiko&cityId=50160&hotelId=5924009&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16105119', className: 'btn primary', event: 'fujihotel_A3_trip', platform: 'Trip', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/EJkeZoSJcEb61ypc6', className: 'btn', event: 'fujihotel_A3_map', platform: 'Maps', section: 'hotel_card' },
    ],
  },
  {
    title: '雲之上富士飯店',
    meta: '逆富士山｜星級、特色描述',
    area: '逆富士山',
    datasetKey: 'hotel',
    datasetValue: '雲之上富士飯店',
    lat: 35.5259281,
    lng: 138.7496436,
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/detail/?cityEnName=Fujikawaguchiko&cityId=50160&hotelId=71499166&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16105119', className: 'btn primary', event: 'fujihotel_A4_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=18942466', className: 'btn', event: 'fujihotel_A4_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/NeNd6vPN43u44TSh9', className: 'btn', event: 'fujihotel_A4_map', platform: 'Maps', section: 'hotel_card' },
    ],
  },
  {
    title: '富士河口湖拉維斯塔飯店',
    meta: '逆富士山｜星級、特色描述',
    area: '逆富士山',
    datasetKey: 'hotel',
    datasetValue: '富士河口湖拉維斯塔飯店',
    lat: 35.5296567,
    lng: 138.7627726,
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/fujikawaguchiko-hotel-detail-4977280/la-vista-fuji-kawaguchiko/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16105119', className: 'btn primary', event: 'fujihotel_A5_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=1163504', className: 'btn', event: 'fujihotel_A5_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/rsQgXBaipFmGS4rM8', className: 'btn', event: 'fujihotel_A5_map', platform: 'Maps', section: 'hotel_card' },
    ],
  },
  {
    title: 'Sunnide Resort Hotel',
    meta: '逆富士山｜星級、特色描述',
    area: '逆富士山',
    datasetKey: 'hotel',
    datasetValue: 'Sunnide Resort Hotel',
    lat: 35.5235098,
    lng: 138.7541692,
    actions: [
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=15464918', className: 'btn primary', event: 'fujihotel_A6_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/pWWR7VazdVdeDot26', className: 'btn', event: 'fujihotel_A6_map', platform: 'Maps', section: 'hotel_card' },
    ],
  },
  // ── 近車站 ────────────────────────────────────────────────
  {
    title: 'THE TOKI富士河口湖',
    meta: '近車站｜星級、特色描述',
    area: '近車站',
    datasetKey: 'hotel',
    datasetValue: 'THE TOKI富士河口湖',
    lat: 35.5001866,
    lng: 138.7760218,
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/fujikawaguchiko-hotel-detail-120599112/the-toki-fujikawaguchiko/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16105119', className: 'btn primary', event: 'fujihotel_B1_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=63266889', className: 'btn', event: 'fujihotel_B1_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/UTpaRofVoPRFRFy8A', className: 'btn', event: 'fujihotel_B1_map', platform: 'Maps', section: 'hotel_card' },
    ],
  },
  {
    title: '夢富士花之宿旅館',
    meta: '近車站｜星級、特色描述',
    area: '近車站',
    datasetKey: 'hotel',
    datasetValue: '夢富士花之宿旅館',
    lat: 35.4962911,
    lng: 138.7700861,
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/fujikawaguchiko-hotel-detail-18090690/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16105119', className: 'btn primary', event: 'fujihotel_B2_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=5492759', className: 'btn', event: 'fujihotel_B2_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/dJVUEcSABftaYkYZA', className: 'btn', event: 'fujihotel_B2_map', platform: 'Maps', section: 'hotel_card' },
    ],
  },
]
