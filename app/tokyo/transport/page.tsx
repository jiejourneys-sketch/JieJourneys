import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '通訊', label: '通訊', dataArea: '通訊' },
  { value: '地鐵/鐵路', label: '地鐵/鐵路', dataArea: '地鐵/鐵路' },
  { value: '成田機場交通', label: '成田機場交通', dataArea: '成田機場交通' },
  { value: '羽田機場交通', label: '羽田機場交通', dataArea: '羽田機場交通' },
]

const naritaArticleAction = (event: string) => ({
  label: '文章',
  href: '/tokyo/narita-airport-to-tokyo',
  className: 'btn',
  event,
  platform: 'article',
  section: 'transport_card',
})

const hanedaArticleAction = (event: string) => ({
  label: '文章',
  href: '/tokyo/haneda-airport-to-tokyo',
  className: 'btn',
  event,
  platform: 'article',
  section: 'transport_card',
})

const subwayTicketArticleAction = (event: string) => ({
  label: '文章',
  href: '/tokyo/tokyo-subway-ticket',
  className: 'btn',
  event,
  platform: 'article',
  section: 'transport_card',
})

const cards = [
  { title: 'eSIM卡', meta: '通訊', area: '通訊', datasetKey: 'title' as const, datasetValue: 'eSIM卡', actions: [{ label: '合作eSIM', href: 'https://esimconnect.com.tw/#/access/esimbuy?region=%E6%97%A5%E6%9C%AC&referencecode=jiejourneys', className: 'btn primary recommend', event: 'tokyotransport_esim_connect', platform: 'connect', section: 'comm_card', promoCode: 'jiejourneys' }, { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/131111-japan-4g-unlimited-data-500mb-1gb-esim?cid=22312', className: 'btn', event: 'tokyotransport_esim_kkday', platform: 'KKDAY', section: 'comm_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/109393-japan-esim-high-speed-internet-qr-code-voucher/?aid=93798', className: 'btn', event: 'tokyotransport_esim_klook', platform: 'KLOOK', section: 'comm_card' }, { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/37658069?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D11674280', className: 'btn', event: 'tokyotransport_esim_trip', platform: 'Trip', section: 'comm_card' }] },
  { title: 'SIM卡｜郵寄到府', meta: '通訊', area: '通訊', datasetKey: 'title' as const, datasetValue: 'SIM卡｜郵寄到府', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/126982?cid=22312', className: 'btn primary', event: 'tokyotransport_simhome_kkday', platform: 'KKDAY', section: 'comm_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/17147-softbank-4g-sim-japan/?aid=93798', className: 'btn', event: 'tokyotransport_simhome_klook', platform: 'KLOOK', section: 'comm_card' }] },
  { title: 'SIM卡｜桃園機場領取', meta: '通訊', area: '通訊', datasetKey: 'title' as const, datasetValue: 'SIM卡｜桃園機場領取', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/19991?cid=22312', className: 'btn primary', event: 'tokyotransport_simtpe_kkday', platform: 'KKDAY', section: 'comm_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/40060-4g-sim-card-japan-docomo/?aid=93798', className: 'btn', event: 'tokyotransport_simtpe_klook', platform: 'KLOOK', section: 'comm_card' }] },
  { title: 'Wifi分享器｜台灣機場領取', meta: '通訊', area: '通訊', datasetKey: 'title' as const, datasetValue: 'Wifi分享器｜台灣機場領取', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/11157?cid=22312', className: 'btn primary', event: 'tokyotransport_wifitpe_kkday', platform: 'KKDAY', section: 'comm_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16627-4g-wifi-japan/?aid=93798', className: 'btn', event: 'tokyotransport_wifitpe_klook', platform: 'KLOOK', section: 'comm_card' }] },
  { title: 'Wifi分享器｜日本機場領取', meta: '通訊', area: '通訊', datasetKey: 'title' as const, datasetValue: 'Wifi分享器｜日本機場領取', actions: [{ label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16399-unlimited-4g-lte-wifi-japan-airport-pickup-ninja-wifi/?aid=93798', className: 'btn primary', event: 'tokyotransport_wifijpn_klook', platform: 'KLOOK', section: 'comm_card' }, { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/59496665?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D11674280', className: 'btn', event: 'tokyotransport_wifijpn_trip', platform: 'Trip', section: 'comm_card' }] },
  { title: '西瓜卡(Suica IC)｜成田/羽田機場領取', meta: '地鐵', area: '地鐵/鐵路', datasetKey: 'title' as const, datasetValue: '西瓜卡(Suica IC)', actions: [{ label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16917-suica-ic-card-tokyo/?aid=93798', className: 'btn primary', event: 'tokyotransport_suica_klook', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '東京地鐵券(Tokyo Subway Ticket)', meta: '地鐵', area: '地鐵/鐵路', datasetKey: 'title' as const, datasetValue: '東京地鐵券(Tokyo Subway Ticket)', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/5989-24-48-72-hr-tokyo-subway-ticket-japan?cid=22312', className: 'btn primary', event: 'tokyotransport_subway_kkday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/1552-subway-ticket-tokyo/?aid=93798', className: 'btn', event: 'tokyotransport_subway_klook', platform: 'KLOOK', section: 'transport_card' }, { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/24465457/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7239738', className: 'btn', event: 'tokyotransport_subway_trip', platform: 'Trip', section: 'transport_card' }, subwayTicketArticleAction('tokyotransport_subway_article')] },
  { title: '鐵路周遊券(JR PASS)', meta: '鐵路', area: '地鐵/鐵路', datasetKey: 'title' as const, datasetValue: '鐵路周遊券(JR PASS)', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/6681-jr-east-pass-tohoku-area?cid=22312', className: 'btn primary', event: 'tokyotransport_jr_pass_kkday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/49927-jr-east-tokyo-tokyowidepass/?aid=93798', className: 'btn', event: 'tokyotransport_jr_pass_klook', platform: 'KLOOK', section: 'transport_card' }, { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/44275093/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7239738', className: 'btn', event: 'tokyotransport_jr_pass_trip', platform: 'Trip', section: 'transport_card' }] },
  { title: '成田機場 ⇄ 上野站/日暮里站｜Skyliner', meta: '成田機場交通', area: '成田機場交通', datasetKey: 'title' as const, datasetValue: '成田機場 ⇄ 上野站/日暮里站｜Skyliner', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/7913-keisei-skyliner-narita-airport-express-ticket?cid=22312', className: 'btn primary', event: 'tokyotransport_skyliner_kkday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/1410-skyliner-tokyo/?aid=93798', className: 'btn', event: 'tokyotransport_skyliner_klook', platform: 'KLOOK', section: 'transport_card' }, { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/47313759/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D6253046', className: 'btn', event: 'tokyotransport_skyliner_trip', platform: 'Trip', section: 'transport_card' }, { label: '時刻表', href: 'https://www.keisei.co.jp/keisei/tetudou/skyliner/tc/traffic/skyliner.php', className: 'btn', event: 'tokyotransport_skyliner_timetable', platform: 'Timetable', section: 'transport_card' }, { label: '地圖', href: 'https://www.google.com/maps/d/edit?mid=1ZmBLaHH4TUkIxpwun8PUQETXJGN2rQ4&usp=sharing', className: 'btn', event: 'tokyotransport_skyliner_map', platform: 'GoogleMap', section: 'transport_card' }, naritaArticleAction('tokyotransport_skyliner_article')] },
  { title: "成田機場 ⇄ 東京車站/新宿/澀谷｜N'EX", meta: '成田機場交通', area: '成田機場交通', datasetKey: 'title' as const, datasetValue: "成田機場 ⇄ 東京車站/新宿/澀谷｜N'EX", actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/529712?cid=22312', className: 'btn primary', event: 'tokyotransport_nex_kkday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/173165-narita-express-n-ex-round-trip-train-ticket-narita-airport-tokyo/?aid=93798', className: 'btn', event: 'tokyotransport_nex_klook', platform: 'KLOOK', section: 'transport_card' }, { label: '客制', href: 'https://www.klook.com/zh-TW/japan-rail/narita-express-nex/?aid=93798', className: 'btn', event: 'tokyotransport_nex_custom_klook', platform: 'KLOOK', section: 'transport_card' }, { label: '時刻表', href: 'https://japantravel.navitime.com/zh-tw/area/jp/timetable/00004637/00000161?direction=up&next=00003544&type=%E7%89%B9%E6%80%A5', className: 'btn', event: 'tokyotransport_nex_timetable', platform: 'Timetable', section: 'transport_card' }, { label: '地圖', href: 'https://www.google.com/maps/d/edit?mid=1ZmBLaHH4TUkIxpwun8PUQETXJGN2rQ4&usp=sharing', className: 'btn', event: 'tokyotransport_nex_map', platform: 'GoogleMap', section: 'transport_card' }, naritaArticleAction('tokyotransport_nex_article')] },
  { title: '成田機場 ⇄ 東京市區｜東京利木津巴士', meta: '成田機場交通', area: '成田機場交通', datasetKey: 'title' as const, datasetValue: '成田機場 ⇄ 東京市區｜東京利木津巴士', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/18551-tokyo-narita-airport-limousine-bus-transfer-ticket?cid=22312', className: 'btn primary', event: 'tokyotransport_nrt_limousine_kkday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/2274-narita-airport-limousine-bus-tokyo/?aid=93798', className: 'btn', event: 'tokyotransport_nrt_limousine_klook', platform: 'KLOOK', section: 'transport_card' }, { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/87579423/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7239738', className: 'btn', event: 'tokyotransport_nrt_limousine_trip', platform: 'Trip', section: 'transport_card' }, { label: '時刻表', href: 'https://www.limousinebus.co.jp/zh-tw/busstop/#flow2b', className: 'btn', event: 'tokyotransport_nrt_limousine_timetable', platform: 'Timetable', section: 'transport_card' }, { label: '地圖', href: 'https://www.google.com/maps/d/edit?mid=1ZmBLaHH4TUkIxpwun8PUQETXJGN2rQ4&usp=sharing', className: 'btn', event: 'tokyotransport_nrt_limousine_map', platform: 'GoogleMap', section: 'transport_card' }, naritaArticleAction('tokyotransport_nrt_limousine_article')] },
  { title: '成田機場 ⇄ 東京市區｜包車', meta: '成田機場交通', area: '成田機場交通', datasetKey: 'title' as const, datasetValue: '成田機場 ⇄ 東京市區｜包車', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/174325-narita-haneda-airports-transfer-tokyo-attractions-disney-resorts-suburban-areas?cid=22312', className: 'btn primary', event: 'tokyotransport_nrt_car_kkday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/airport-transfers/?aid=93798', className: 'btn', event: 'tokyotransport_nrt_car_klook', platform: 'KLOOK', section: 'transport_card' }, naritaArticleAction('tokyotransport_nrt_car_article')] },
  { title: '成田機場 ⇄ 東京市區｜自駕', meta: '成田機場交通', area: '成田機場交通', datasetKey: 'title' as const, datasetValue: '成田機場 ⇄ 東京市區｜自駕', actions: [{ label: '合作租車', href: 'https://www2.tocoo.jp/cn/?asp_id=2564&utm_source=2564&utm_medium=affiliate', className: 'btn primary recommend', event: 'tokyotransport_nrt_self_tocoo', platform: 'TOCOO', section: 'transport_card', promoCode: 'K24ZW3' }, { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/car-rentals?cid=22312', className: 'btn', event: 'tokyotransport_nrt_self_kkday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-HK/car-rentals/city/28-tokyo-car-rentals/?aid=93798', className: 'btn', event: 'tokyotransport_nrt_self_klook', platform: 'KLOOK', section: 'transport_card' }, { label: 'Trip', href: 'https://tw.trip.com/carhire/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16062937', className: 'btn', event: 'tokyotransport_nrt_self_trip', platform: 'Trip', section: 'transport_card' }, naritaArticleAction('tokyotransport_nrt_self_article')] },
  { title: '成田機場 ⇄ 淺草/押上｜Access特急', meta: '成田機場交通', area: '成田機場交通', datasetKey: 'title' as const, datasetValue: '成田機場 ⇄ 淺草/押上｜Access特急', actions: [{ label: 'SUICA', href: 'https://www.klook.com/zh-TW/activity/16917-suica-ic-card-tokyo/?aid=93798', className: 'btn primary', event: 'tokyotransport_nrt_access_suica_klook', platform: 'KLOOK', section: 'transport_card' }, { label: '時刻表', href: 'https://www.keisei.co.jp/keisei/tetudou/skyliner/jp/timetable/index.php', className: 'btn', event: 'tokyotransport_nrt_access_timetable', platform: 'Timetable', section: 'transport_card' }, { label: '地圖', href: 'https://www.google.com/maps/d/edit?mid=1ZmBLaHH4TUkIxpwun8PUQETXJGN2rQ4&usp=sharing', className: 'btn', event: 'tokyotransport_nrt_access_map', platform: 'GoogleMap', section: 'transport_card' }, naritaArticleAction('tokyotransport_nrt_access_article')] },
  { title: '成田機場 ⇄ 東京市區｜LCB巴士', meta: '成田機場交通', area: '成田機場交通', datasetKey: 'title' as const, datasetValue: '成田機場 ⇄ 東京市區｜LCB巴士', actions: [{ label: '購票&時刻表', href: 'https://www.narita-airport.jp/zh-tc/access/bus/lcb/', className: 'btn primary', event: 'tokyotransport_nrt_lcb_timetable', platform: 'Timetable', section: 'transport_card' }, { label: '地圖', href: 'https://www.google.com/maps/d/edit?mid=1ZmBLaHH4TUkIxpwun8PUQETXJGN2rQ4&usp=sharing', className: 'btn', event: 'tokyotransport_nrt_lcb_map', platform: 'GoogleMap', section: 'transport_card' }, naritaArticleAction('tokyotransport_nrt_lcb_article')] },
  { title: '羽田機場 ⇄ 東銀座/淺草/押上｜京急電鐵', meta: '羽田機場交通', area: '羽田機場交通', datasetKey: 'title' as const, datasetValue: '羽田機場 ⇄ 品川/新橋/東銀座/淺草/押上｜京急電鐵', actions: [{ label: 'SUICA', href: 'https://www.klook.com/zh-TW/activity/16917-suica-ic-card-tokyo/?aid=93798', className: 'btn primary', event: 'tokyotransport_hnd_keikyu_suica_klook', platform: 'KLOOK', section: 'transport_card' }, { label: '時刻表', href: 'https://www.haneda-tokyo-access.com/tc/', className: 'btn', event: 'tokyotransport_hnd_keikyu_timetable', platform: 'Timetable', section: 'transport_card' }, { label: '地圖', href: 'https://www.google.com/maps/d/edit?mid=1d5zUE9pWTdlrDUplV7Q5ARZ6GoIhOQA&usp=sharing', className: 'btn', event: 'tokyotransport_hnd_keikyu_map', platform: 'GoogleMap', section: 'transport_card' }, hanedaArticleAction('tokyotransport_hnd_keikyu_article')] },
  { title: '羽田機場 ⇄ 秋葉原/新宿/池袋｜單軌電車', meta: '羽田機場交通', area: '羽田機場交通', datasetKey: 'title' as const, datasetValue: '羽田機場 ⇄ 東京車站/新宿/澀谷｜單軌電車', actions: [{ label: 'SUICA', href: 'https://www.klook.com/zh-TW/activity/16917-suica-ic-card-tokyo/?aid=93798', className: 'btn primary', event: 'tokyotransport_hnd_monorail_suica_klook', platform: 'KLOOK', section: 'transport_card' }, { label: '時刻表', href: 'https://www.tokyo-monorail.co.jp/tc/', className: 'btn', event: 'tokyotransport_hnd_monorail_timetable', platform: 'Timetable', section: 'transport_card' }, { label: '地圖', href: 'https://www.google.com/maps/d/edit?mid=1d5zUE9pWTdlrDUplV7Q5ARZ6GoIhOQA&usp=sharing', className: 'btn', event: 'tokyotransport_hnd_monorail_map', platform: 'GoogleMap', section: 'transport_card' }, hanedaArticleAction('tokyotransport_hnd_monorail_article')] },
  { title: '羽田機場 ⇄ 東京市區｜東京利木津巴士', meta: '羽田機場交通', area: '羽田機場交通', datasetKey: 'title' as const, datasetValue: '羽田機場 ⇄ 東京市區｜東京利木津巴士', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/18551-tokyo-narita-airport-limousine-bus-transfer-ticket?cid=22312', className: 'btn primary', event: 'tokyotransport_hnd_limousine_kkday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/150434-haneda-airport-limousine-bus-tokyo/?aid=93798', className: 'btn', event: 'tokyotransport_hnd_limousine_klook', platform: 'KLOOK', section: 'transport_card' }, { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/87596821/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7239738', className: 'btn', event: 'tokyotransport_hnd_limousine_trip', platform: 'Trip', section: 'transport_card' }, { label: '時刻表', href: 'https://www.limousinebus.co.jp/zh-tw/busstop/#flow2b', className: 'btn', event: 'tokyotransport_hnd_limousine_timetable', platform: 'Timetable', section: 'transport_card' }, { label: '地圖', href: 'https://www.google.com/maps/d/edit?mid=1d5zUE9pWTdlrDUplV7Q5ARZ6GoIhOQA&usp=sharing', className: 'btn', event: 'tokyotransport_hnd_limousine_map', platform: 'GoogleMap', section: 'transport_card' }, hanedaArticleAction('tokyotransport_hnd_limousine_article')] },
  { title: '羽田機場 ⇄ 東京市區｜包車', meta: '羽田機場交通', area: '羽田機場交通', datasetKey: 'title' as const, datasetValue: '羽田機場 ⇄ 東京市區｜包車', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/174325-narita-haneda-airports-transfer-tokyo-attractions-disney-resorts-suburban-areas?cid=22312', className: 'btn primary', event: 'tokyotransport_hnd_car_kkday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/airport-transfers/?aid=93798', className: 'btn', event: 'tokyotransport_hnd_car_klook', platform: 'KLOOK', section: 'transport_card' }, hanedaArticleAction('tokyotransport_hnd_car_article')] },
  { title: '羽田機場 ⇄ 東京市區｜自駕', meta: '羽田機場交通', area: '羽田機場交通', datasetKey: 'title' as const, datasetValue: '羽田機場 ⇄ 東京市區｜自駕', actions: [{ label: '合作租車', href: 'https://www2.tocoo.jp/cn/?asp_id=2564&utm_source=2564&utm_medium=affiliate', className: 'btn primary recommend', event: 'tokyotransport_hnd_self_tocoo', platform: 'TOCOO', section: 'transport_card', promoCode: 'K24ZW3' }, { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/car-rentals?cid=22312', className: 'btn', event: 'tokyotransport_hnd_self_kkday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-HK/car-rentals/city/28-tokyo-car-rentals/?aid=93798', className: 'btn', event: 'tokyotransport_hnd_self_klook', platform: 'KLOOK', section: 'transport_card' }, { label: 'Trip', href: 'https://tw.trip.com/carhire/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16062937', className: 'btn', event: 'tokyotransport_hnd_self_trip', platform: 'Trip', section: 'transport_card' }, hanedaArticleAction('tokyotransport_hnd_self_article')] },
]

export default function TokyoTransportPage() {
  return (
    <>
      <CitySubpageHeader backHref="/tokyo" eventPrefix="tokyotransport" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="東京自由行工具"
          h1="東京通訊 & 交通｜eSIM、西瓜卡、機場接送一次整理"
          intro="把東京自由行常用的通訊與交通工具集中在同一頁：依需求切換標籤，快速找到你要的方案與購買連結。"
          eventPrefix="tokyotransport"
          showVisual={false}
          ctaLinks={[
            { label: '東京短影片攻略', href: 'https://www.jiejourneys.com/tokyo/video', dataEvent: 'tokyotransport_allvideos', platform: 'video' },
            { label: '東京住宿推薦', href: 'https://www.jiejourneys.com/tokyo/hotel', dataEvent: 'tokyotransport_allhotels', platform: 'hotel' },
            { label: '東京票券總整理', href: 'https://www.jiejourneys.com/tokyo/ticket', dataEvent: 'tokyotransport_alltickets', platform: 'ticket' },
          ]}
        />

        <h2 className="seo-h2" id="transportListTitle">
          東京通訊與交通整理（依主題分類）
        </h2>
        <CityTabbedList tabs={tabs} cards={cards} tabEvent="tokyo_transport_tab" />

        <SeoCtaSection text="" href="/tokyo/map" linkText="東京熱門景點地圖" newTab dataEvent="tokyotransport_SEO_spotmap" />

        <SeoContentSection title="東京交通與通訊怎麼選？先把三件事分開">
          <p>
            東京自由行先處理三件事：手機網路、機場進市區、市區移動。不要把 Suica、地鐵券、JR Pass 全部混在一起看，因為它們解決的是不同問題。
          </p>

          <h3 className="seo-h3">通訊：一個人 eSIM，多人再看 WiFi</h3>
          <p>
            eSIM 最適合一個人或兩個人旅行，出發前設定好，下機就能用；SIM 卡適合手機不支援 eSIM 的人；WiFi 分享器只有在多人同行、大家會一起行動時才比較有優勢，不然要充電、要歸還、還要有人負責帶著。
          </p>

          <h3 className="seo-h3">市區移動：Suica 是錢包，東京地鐵券是省錢工具</h3>
          <p>
            Suica / PASMO 是儲值 IC 卡，地鐵、JR、公車、便利商店都能用，幾乎可以當交通錢包。東京地鐵券則是 24 / 48 / 72 小時內搭東京 Metro 和都營地鐵不限次數，適合一天會密集搭地鐵的人；但它不能搭 JR，也不能直接拿來從機場進市區。
          </p>
          <p>
            想知道什麼時候划算，可以看
            <a
              href="/tokyo/tokyo-subway-ticket?from=tokyo-transport"
              data-event="tokyotransport_article_subway_ticket"
              data-platform="article"
              data-section="article"
            >
              <strong> 東京地鐵券完整整理</strong>
            </a>
            。我的簡單判斷是：東京市區景點跑兩天以上，地鐵券很值得算；如果每天只搭兩三趟，Suica 就好。
          </p>

          <h3 className="seo-h3">成田機場進市區：先看你住哪裡</h3>
          <p>
            住上野、日暮里，Skyliner 最直覺；住東京車站、品川、澀谷、新宿，N&apos;EX 不用轉車；住飯店門口有停靠點、行李多或帶長輩小孩，利木津巴士比較輕鬆；住淺草、押上且想省預算，可以看 Access 特急。完整比較我放在
            <a
              href="/tokyo/narita-airport-to-tokyo?from=tokyo-transport"
              data-event="tokyotransport_article_narita"
              data-platform="article"
              data-section="article"
            >
              <strong> 成田機場交通文章</strong>
            </a>
            。
          </p>

          <h3 className="seo-h3">羽田機場進市區：通常不用想太複雜</h3>
          <p>
            羽田離東京近很多。住品川、新橋、東銀座、淺草、押上方向，看京急電鐵；住東京車站、秋葉原、新宿、池袋方向，可以搭東京單軌電車到濱松町再接 JR；行李多或想直達飯店，再看利木津巴士或包車。可以搭配
            <a
              href="/tokyo/haneda-airport-to-tokyo?from=tokyo-transport"
              data-event="tokyotransport_article_haneda"
              data-platform="article"
              data-section="article"
            >
              <strong> 羽田機場交通文章</strong>
            </a>
            。
          </p>

          <h3 className="seo-h3">JR Pass 不要先買，先看你有沒有離開東京</h3>
          <p>
            如果只玩東京市區，不需要 JR Pass。只有你會跑日光、輕井澤、東北、長野新潟，或多段新幹線時，才需要把 JR Pass 或 JR Tokyo Wide Pass 拿出來算。市區觀光的核心通常是 Suica + 東京地鐵券，而不是全國 JR Pass。
          </p>
        </SeoContentSection>

        <SeoFaqSection
          title="東京通訊交通常見問題"
          items={[
            { q: '東京自由行要買 Suica 還是東京地鐵券？', a: 'Suica 是必備交通錢包，東京地鐵券是另外用來省錢的票。一天會密集搭東京 Metro 和都營地鐵才買地鐵券；如果每天只搭幾趟，用 Suica 就好。' },
            { q: '東京地鐵券可以搭 JR 嗎？', a: '不行。東京地鐵券主要限東京 Metro 和都營地鐵，JR 山手線、成田機場交通、私鐵路線都要另外付費。' },
            { q: '成田機場怎麼到東京市區最快？', a: '住上野或日暮里通常選 Skyliner；住東京車站、品川、澀谷、新宿可以看 NEX。不要只看最快，住宿點才是關鍵。' },
            { q: '羽田機場進市區哪種最方便？', a: '京急電鐵和東京單軌電車都很方便。住淺草押上方向看京急，住東京車站或山手線沿線可看單軌電車接 JR；行李多再看巴士或包車。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
