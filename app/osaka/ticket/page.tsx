import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import type { CityCard } from '@/components/CityTabbedList'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import { osakaPassMapPlaces } from '@/data/osaka/pass-map/places'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '周遊券', label: '周遊券', dataArea: '周遊券' },
  { value: '周遊券涵蓋景點', label: '周遊券涵蓋景點', dataArea: '周遊券涵蓋景點' },
  { value: '周遊券優惠景點', label: '周遊券優惠景點', dataArea: '周遊券優惠景點' },
  { value: '周遊券未涵蓋景點', label: '周遊券未涵蓋景點', dataArea: '周遊券未涵蓋景點' },
  { value: '一日遊', label: '一日遊', dataArea: '一日遊' },
]

const osakaOneDayTagOrder = [
  '天橋立View Land',
  '天橋立傘松公園',
  '伊根舟屋',
  '美山合掌村',
  '勝尾寺',
  '嵐山竹林',
  '嵐山小火車',
  '金閣寺',
  '清水寺',
  '二條城',
  '伏見稻荷大社',
  '奈良公園',
  '東大寺',
  '友禪光林',
  '宇治',
  '平等院',
  '三千院',
  '琵琶湖纜車',
  '有馬溫泉',
  '六甲山',
  '和歌山城',
  'MIHO美術館',
]

const customOneDayTitle = '客制化行程｜包車'

const ticketEventPlatformSlug: Record<string, string> = {
  KKDAY: 'kkday',
  KLOOK: 'klook',
  Trip: 'trip',
}

const ticketEventSlugByTitle: Record<string, string> = {
  '大阪周遊券 (Osaka Amazing Pass)': 'pass',
  日本環球影城: 'usj',
  '快速通關｜日本環球影城': 'usj_express',
  大阪海遊館: 'kaiyukan',
  大阪枚方公園: 'hirakata_park',
  大阪兒童樂園: 'kids_plaza',
  'Miracle World主題樂園': 'miracle_world',
  '纜車｜琵琶湖谷': 'biwako_valley',
  '火影忍者｜二次元之森': 'nijigen_no_mori',
  箕面勝尾寺: 'katsuoji',
  '天然溫泉泉州｜關西機場': 'senshu_onsen',
  千葉京成玫瑰園: 'keisei_rose_garden',
}

const formatPassMapTitle = (name: string) =>
  name
    .replace(/\s+(?:折|打|送|付).+$/, '')
    .replace(/\s+\(.+?\)$/, '')
    .replace(/\s+\d+元(?:\/\d+元)?(?:\(.+?\))?$/, '')

const getTagIndex = (tag: string) => {
  const index = osakaOneDayTagOrder.indexOf(tag)
  return index >= 0 ? index : Number.MAX_SAFE_INTEGER
}

const getOneDayGroupSortIndex = (group: string) =>
  getTagIndex(group.split('/')[0]?.trim() ?? '')

const hasSortableOneDayGroup = (group: string) => getOneDayGroupSortIndex(group) < Number.MAX_SAFE_INTEGER

const normalizeOneDayTitle = (title: string) =>
  title === customOneDayTitle
    ? title
    : title
        .split('+')
        .map((group, index) => ({ group: group.trim(), index }))
        .sort((a, b) => {
          if (!hasSortableOneDayGroup(a.group) || !hasSortableOneDayGroup(b.group)) return a.index - b.index
          const sortDiff = getOneDayGroupSortIndex(a.group) - getOneDayGroupSortIndex(b.group)
          return sortDiff || a.index - b.index
        })
        .map(({ group }) => group)
        .join('+')

const getOneDayTags = (title: string) => {
  if (title === customOneDayTitle) return osakaOneDayTagOrder
  const titleTags = new Set(title.split(/[+/]/).map((tag) => tag.trim()))
  return osakaOneDayTagOrder.filter((tag) => titleTags.has(tag))
}

const getOneDaySortIndex = (card: CityCard) =>
  card.title === customOneDayTitle
    ? Number.MAX_SAFE_INTEGER
    : getOneDayGroupSortIndex(card.title.split('+')[0] ?? '')

const addOneDayTags = (cards: CityCard[]): CityCard[] => {
  const oneDayCards = cards
    .map((card, index) => {
      if (card.area !== '一日遊') return { card, index }
      const title = normalizeOneDayTitle(card.title)
      return {
        card: {
          ...card,
          title,
          datasetValue: card.datasetValue === card.title ? title : card.datasetValue,
          tags: getOneDayTags(title),
        },
        index,
      }
    })
    .filter(({ card }) => card.area === '一日遊')
    .sort((a, b) => {
      const sortDiff = getOneDaySortIndex(a.card) - getOneDaySortIndex(b.card)
      return sortDiff || a.index - b.index
    })
    .map(({ card }) => card)

  let oneDayIndex = 0
  return cards.map((card) => (card.area === '一日遊' ? oneDayCards[oneDayIndex++] : card))
}

const addTicketActionEvents = (cards: CityCard[]): CityCard[] => {
  let oneDayIndex = 0
  return cards.map((card) => {
    const cardSlug =
      card.area === '一日遊'
        ? card.title === customOneDayTitle
          ? 'oneday_custom'
          : `oneday_${String(++oneDayIndex).padStart(2, '0')}`
        : ticketEventSlugByTitle[card.title]

    if (!cardSlug) return card

    return {
      ...card,
      actions: card.actions.map((action) => {
        const platformSlug = ticketEventPlatformSlug[action.label]
        return platformSlug ? { ...action, event: `osakaticket_${cardSlug}_${platformSlug}` } : action
      }),
    }
  })
}

const createPassMapCards = (category: 'spot' | 'free', area: string, meta: string): CityCard[] =>
  osakaPassMapPlaces
    .filter((place) => place.category === category)
    .map((place): CityCard | null => {
      const actions = (place.spotActions ?? [])
        .filter((action) => action.href)
        .map((action) => ({
          ...action,
          event: action.event?.replace('osakapassmap_', 'osakaticket_'),
          section: 'ticket_card',
        }))

      return actions.length > 0
        ? {
            title: formatPassMapTitle(place.name),
            meta,
            area,
            datasetKey: 'title',
            datasetValue: formatPassMapTitle(place.name),
            actions,
          }
        : null
    })
    .filter((card): card is CityCard => card !== null)

const passCoveredCards = createPassMapCards('spot', '周遊券涵蓋景點', '周遊券(✔️)')
const passDiscountCards = createPassMapCards('free', '周遊券優惠景點', '周遊券(%)')

const cards: CityCard[] = addTicketActionEvents(addOneDayTags([
  {
    title: '大阪周遊券 (Osaka Amazing Pass)',
    meta: '周遊券',
    area: '周遊券',
    datasetKey: 'title',
    datasetValue: '大阪周遊券',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/12156-osaka-amazing-pass-e-ticket-japan?cid=22312', className: 'btn primary', event: 'osakaticket_pass_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/82312-amazing-pass-osaka/?aid=93798', className: 'btn', event: 'osakaticket_pass_klook', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/48361291?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17058162', className: 'btn', event: 'osakaticket_pass_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  ...passCoveredCards,
  ...passDiscountCards,
  {
    title: '日本環球影城',
    meta: '周遊券(✖)',
    area: '周遊券未涵蓋景點',
    datasetKey: 'title',
    datasetValue: '日本環球影城',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/2247-universal-studios-japan-ticket-osaka?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/192375-universal-studios-japan-super-value-combo/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/osaka/universal-studios-japan-81012?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16477085', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '快速通關｜日本環球影城',
    meta: '周遊券(✖)',
    area: '周遊券未涵蓋景點',
    datasetKey: 'title',
    datasetValue: '日本環球影城',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/18618-universal-studios-japan-express-pass-osaka?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/3407-universal-studios-japan-express-pass-osaka/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/osaka/universal-studios-japan-81012?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16477085', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '大阪海遊館',
    meta: '周遊券(✖)',
    area: '周遊券未涵蓋景點',
    datasetKey: 'title',
    datasetValue: '大阪海遊館',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/4849-osaka-aquarium-kaiyukan-ticket?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/598-osaka-aquarium-kaiyukan-japan/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/osaka/osaka-aquarium-kaiyukan-85082?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16637252', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '大阪枚方公園',
    meta: '周遊券(✖)',
    area: '周遊券未涵蓋景點',
    datasetKey: 'title',
    datasetValue: '大阪枚方公園',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/267933-hirakata-park-osaka-ticket?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/49191-hirakata-park/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/hirakata/hirakata-park-33116025?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16637252', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '大阪兒童樂園',
    meta: '周遊券(✖)',
    area: '周遊券未涵蓋景點',
    datasetKey: 'title',
    datasetValue: '大阪兒童樂園',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/29583-kids-plaza-osaka-admission-ticket-japan?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/37845-kids-plaza-osaka-admission-ticket/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/osaka/kids-plaza-osaka-22950750?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16477085', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: 'Miracle World主題樂園',
    meta: '周遊券(✖)',
    area: '周遊券未涵蓋景點',
    datasetKey: 'title',
    datasetValue: 'Miracle World主題樂園',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/569796?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/190774-osaka-miracleworld-admission-pass/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/osaka/miracle-world-osaka-153503047/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16637252', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '纜車｜琵琶湖谷',
    meta: '周遊券(✖)',
    area: '周遊券未涵蓋景點',
    datasetKey: 'title',
    datasetValue: '纜車｜琵琶湖谷',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/138724-biwako-valley-ropeway-round-trip-ticket-japan?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/47068-biwako-valley-ropeway-ticket/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      ],
  },
  {
    title: '火影忍者｜二次元之森',
    meta: '周遊券(✖)',
    area: '周遊券未涵蓋景點',
    datasetKey: 'title',
    datasetValue: '火影忍者｜二次元之森',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/119625-awaji-island-anime-theme-park-naruto-boruto-village-admission-ticket-japan?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/121686-nijigen-no-mori/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/awaji-city/nijigen-no-mori-141964023/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16637252', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '箕面勝尾寺',
    meta: '周遊券(✖)',
    area: '周遊券未涵蓋景點',
    datasetKey: 'title',
    datasetValue: '箕面勝尾寺',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/573710?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/145411-osaka-katsuo-ji-temple/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/minoh/katsuo-ji-13456016?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16477085', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '天然溫泉泉州｜關西機場',
    meta: '周遊券(✖)',
    area: '周遊券未涵蓋景點',
    datasetKey: 'title',
    datasetValue: '天然溫泉泉州｜關西機場',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/263445?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/50890-senshu-onsen-in-aqua-ignis-kansai-airport/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/izumisano/natural-hot-spring-senshu-no-yu-kansai-airport-144941951/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16637252', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '千葉京成玫瑰園',
    meta: '周遊券(✖)',
    area: '周遊券未涵蓋景點',
    datasetKey: 'title',
    datasetValue: '千葉京成玫瑰園',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/284299?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/116025-keisei-rose-garden/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      ],
  },
  {
    title: '天橋立View Land+智恩寺+天橋立纜車+伊根舟屋',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '天橋立View Land+智恩寺+天橋立纜車+伊根舟屋',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/25439-amanohashidate-day-trip-kyoto-ine-funaya-ine-bay-cruise-depart-from-osaka?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/154563-japan-s-three-most-scenic-spots-amanohashidate-ine-funaya-and-ine/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/64951281?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16658154', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '天橋立View Land+智恩寺+元伊勢籠神社+天橋立觀光船+天橋立傘松公園',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '天橋立View Land+智恩寺+元伊勢籠神社+天橋立觀光船+天橋立傘松公園',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/163483?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
     ],
  },
  {
    title: '天橋立傘松公園+智恩寺+天橋立觀光船+天橋立纜車+美山合掌村',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '天橋立傘松公園+智恩寺+天橋立觀光船+天橋立纜車+美山合掌村',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/147488-amanohashidate-tour-miyama-gassho-village-crab-osaka-namba-kyoto?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/19058-amanohashidate-miyama-day-tour-kyoto/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      ],
  },
  {
    title: '天橋立View Land+天橋立傘松公園+伊根舟屋+美山合掌村',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '天橋立View Land+天橋立傘松公園+伊根舟屋+美山合掌村',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/155289?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/110091-amanohashidate-ine-no-funaya-miyama-kayabuki-no-sato-day-trip/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      ],
  },
  {
    title: '天橋立View Land+智恩寺+伊根舟屋+美山合掌村',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '天橋立View Land+智恩寺+伊根舟屋+美山合掌村',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/184538?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/123586-amanohashidate-ine-no-funaya-miyama-kayabuki-no-sato-day-tour/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      ],
  },
  {
    title: '勝尾寺+嵐山渡月橋+嵐山竹林+金閣寺',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '勝尾寺+嵐山渡月橋+嵐山竹林+金閣寺',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/286142?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/158704-kyoto-osaka-top-attractions-day-tour-from-osaka/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/87078148/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16661234', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '勝尾寺+嵐山渡月橋+嵐山竹林+清水寺/美山合掌村',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '勝尾寺+嵐山渡月橋+嵐山竹林+清水寺/美山合掌村',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/263298?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/159276-one-day-tour-of-famous-scenic-spots-in-kyoto-and-osaka/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/93178236?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16661234', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '勝尾寺+嵐山渡月橋+嵐山竹林+伏見稻荷大社',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '勝尾寺+嵐山渡月橋+嵐山竹林+伏見稻荷大社',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/531168?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/142228-kyoto-nara-arashiyama-spring-cherry-blossom-day-tour-from-osaka/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      ],
  },
  {
    title: '勝尾寺+嵐山渡月橋+嵐山竹林+嵐山小火車+清水寺',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '勝尾寺+嵐山渡月橋+嵐山竹林+嵐山小火車+清水寺',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/284721?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
       ],
  },
  {
    title: '勝尾寺+嵐山竹林+奈良公園+東大寺',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '勝尾寺+嵐山竹林+奈良公園+東大寺',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/139634-kyoto-day-tour-arashiyama-yasaka-shrine-hanamikoji-nara-park-todaiji-temple-kimono-experience-japan?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/84040-narakyotobustour-osaka/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      ],
  },
  {
    title: '嵐山竹林+嵐山小火車+保津川遊船',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '嵐山竹林+嵐山小火車+保津川遊船',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/138380?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/168956-sagano-romantic-train-hozugawa-river-boat-ride-hozugawa-kudari-one-day-sightseeing-tour/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
     ],
  },
  {
    title: '嵐山渡月橋+嵐山竹林+金閣寺+清水寺+伏見稻荷大社',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '嵐山渡月橋+嵐山竹林+金閣寺+清水寺+伏見稻荷大社',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/4073-kyoto-day-tour-from-osaka-arashiyama-fushimi-inari-taisha-shrine-kinkaku-ji-kiyomizu-temple?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/3208-kyoto-temples-shrines-day-tour-osaka/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
     ],
  },
  {
    title: '嵐山渡月橋+嵐山竹林+金閣寺+二條城+伏見稻荷大社',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '嵐山渡月橋+嵐山竹林+金閣寺+二條城+伏見稻荷大社',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/279525?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/144196-kyoto-panoramic-day-tour-kinkakuji-temple-arashiyama-nijo-castle/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
     ],
  },
  {
    title: '嵐山渡月橋+嵐山竹林+金閣寺+伏見稻荷大社+奈良公園+東大寺',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '嵐山渡月橋+嵐山竹林+金閣寺+伏見稻荷大社+奈良公園+東大寺',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/13894-kyoto-nara-ushimi-inari-taisha-shrine-arashiyama-nara-park?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16167-nara-day-tour-kyoto/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      ],
  },
  {
    title: '嵐山竹林+嵐山小火車+友禪光林+伏見稻荷大社+奈良公園',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '嵐山竹林+嵐山小火車+友禪光林+伏見稻荷大社+奈良公園',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/186877?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/143719-kyoto-scenic-exploration-and-nara-deer-interaction-experience-tour/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      ],
  },
  {
    title: '嵐山渡月橋+嵐山竹林+伏見稻荷大社+奈良公園',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '嵐山渡月橋+嵐山竹林+伏見稻荷大社+奈良公園',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/270423-kyoto-nara-day-tour-arashiyama-nara-park-fushimi-inari-bamboo?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/110001-kyoto-nara-deer-arashiyama-train-cherry-blossom-one-day-tour/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      ],
  },
  {
    title: '清水寺+伏見稻荷大社+奈良公園+東大寺',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '清水寺+伏見稻荷大社+奈良公園+東大寺',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/135949-japan-kyoto-nara-day-tour-kiyomizu-temple-hanami-koji-fushimi-toka-shrine-nara-park?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/87236-kyoto-tour-nara/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/67875292/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16661234', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '宇治+平等院+金閣寺+清水寺',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '宇治+平等院+金閣寺+清水寺',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/269284?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/122392-kinkakuji-kiyomizudera-uji-river-byodoin-one-day-tour/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      ],
  },
  {
    title: '宇治+平等院+伏見稻荷大社+奈良公園/勝尾寺/東大寺',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '宇治+平等院+伏見稻荷大社+奈良公園/勝尾寺',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/268864?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/156282-uji-byodo-in-fushimi-inari-taisha-katsuoji-minoh-falls-day-tour/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/91759340/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16661234', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '三千院+貴船神社+嵐山竹林+嵐山小火車+友禪光林',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '三千院+貴船神社+嵐山竹林+嵐山小火車+友禪光林',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/251019?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/199514-one-day-sagano-scenic-railway-in-arashiyama/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/85773583/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16661234', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '有馬溫泉+六甲山+神戶三田Outlet/馬賽克摩天輪/勝尾寺',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '有馬溫泉+六甲山+神戶三田Outlet/馬賽克摩天輪/勝尾寺',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/140011-kobe-day-tou-from-osaka-sanda-premium-outlet-arima-onsen-mt-rokko-night-view-round-trip-transfer?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/141926-kobe-port-arima-onsen-mt-rokko-night-view-tour-from-osaka/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/102098996/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16661234', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '姬路城+有馬溫泉+六甲山',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '姬路城+有馬溫泉+六甲山',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/29760-hyogo-kobe-tour-himeji-castle-arima-onsen-osaka?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/94348-himeji-castle-arima-onse-mt-rokko-day-tour-osaka/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      ],
  },
  {
    title: '和歌山城+Toretore漁獲市場+白良濱沙灘+千疊敷+三段壁',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '和歌山城+Toretore漁獲市場+白良濱沙灘+千疊敷+三段壁',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/39099-osaka-namba-wakayama-shirahama-tour-kimiiji-temple-toretore-fish-market-shirahama-sandanbi-senjojiki?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/169948-shirahama-seafood-market-tour/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/91666282/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16661234', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: 'MIHO美術館+舊竹林院+琵琶湖',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: 'MIHO美術館+舊竹林院+琵琶湖',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/151968-shiga-otsu-tour-miho-museum-chikurinin-temple-lake-biwa-shirahige-shrine-japan?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/94940-miho-museum-former-chikurinin-temple-day-tour-shiga/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/71846392/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16661234', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '白鬚神社+琵琶湖觀景台+琵琶湖纜車+三千院+滿月寺+La Collina 近江八幡',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '白鬚神社+琵琶湖觀景台+琵琶湖纜車+三千院+滿月寺+La Collina 近江八幡',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/196165?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/127158-lake-biwa-shirahige-shrine-ukimido-one-day-tour-from-osaka-kyoto/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/izumisano/natural-hot-spring-senshu-no-yu-kansai-airport-144941951/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16637252', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '客制化行程｜包車',
    meta: '一日遊票券',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '客制化行程｜包車',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/133661-10-hour-private-charter-tour-osaka-kyoto-nara-japan?cid=22312', className: 'btn primary', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/159338-depart-from-osaka-osaka-city-and-kyoto-nara-kobe-private-car-charter/?aid=93798', className: 'btn', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/48423783/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16661234', className: 'btn', platform: 'Trip', section: 'ticket_card' },
    ],
  },
]))

export default function OsakaTicketPage() {
  return (
    <>
      <CitySubpageHeader backHref="/osaka" eventPrefix="osakaticket" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="大阪自由行票券"
          h1="大阪票券總整理｜周遊券・USJ・海遊館・展望台快速比較"
          intro="把大阪常用票券用標籤分類整理，直接點選你需要的品項，比價後快速下單。"
          eventPrefix="osakaticket"
          showVisual={false}
          ctaLinks={[
            {
              label: '住宿推薦總整理',
              href: 'https://www.jiejourneys.com/osaka/hotel',
              dataEvent: 'osakaticket_allhotels',
              platform: 'hotel',
            },
            {
              label: '通訊&交通攻略',
              href: 'https://www.jiejourneys.com/osaka/transport',
              dataEvent: 'osakaticket_alltransport',
              platform: 'transport',
            },
          ]}
        />

        <h2 className="seo-h2" id="ticketListTitle">
          大阪票券推薦（周遊券、景點門票一次看懂）
        </h2>
        <CityTabbedList
          tabs={tabs}
          cards={cards}
          tabEvent="osaka_ticket_tab"
          tagFilterArea="一日遊"
          tagOrder={osakaOneDayTagOrder}
        />

        <SeoCtaSection text="" href="/osaka/map" linkText="大阪熱門景點地圖" newTab dataEvent="osakaticket_SEO_spotmap" />
        <SeoCtaSection text="" href="/osaka/pass-map" linkText="大阪周遊券地圖" newTab dataEvent="osakaticket_SEO_passmap" />

        <SeoContentSection title="大阪票券快速理解">
          <h3 className="seo-h3">👉 先決定這趟要不要買大阪周遊券</h3>
          <p>
            <strong>大阪周遊券（Osaka Amazing Pass）</strong>適合把市區景點排得比較密集的人。它通常會搭配大阪市區交通，以及通天閣、梅田藍天大廈、天保山摩天輪、大阪城相關設施等周遊券涵蓋景點一起使用。
            <br />
            如果你一天內會跑多個付費景點，再加上地鐵移動，周遊券就比較容易回本；如果主要是逛心齋橋、道頓堀、黑門市場、梅田商場這類免費區域，就不一定需要為了「有票券」而硬買。
          </p>

          <h3 className="seo-h3">👉 周遊券涵蓋、優惠、未涵蓋要分開看</h3>
          <p>
            上方票券卡片把景點拆成<strong>周遊券涵蓋景點</strong>、<strong>周遊券優惠景點</strong>和<strong>周遊券未涵蓋景點</strong>，原因是三種使用方式不同。
            <br />
            涵蓋景點通常代表可以用周遊券入場；優惠景點則是買票時有折扣或特典；未涵蓋景點像 <strong>USJ</strong>、<strong>大阪海遊館</strong>、<strong>琵琶湖谷纜車</strong>、<strong>二次元之森</strong> 等，就要另外買票。規劃時先把「必去」挑出來，再決定要單買門票還是搭配周遊券，會比先買票券再塞行程更順。
          </p>

          <h3 className="seo-h3">👉 USJ 門票和快速通關分開判斷</h3>
          <p>
            <strong>日本環球影城（USJ）</strong>不包含在大阪周遊券裡，所以門票要獨立購買。第一次去的人可以先決定入園日期，再比較 KKDAY、KLOOK、Trip 的門票方案。
            <br />
            <strong>快速通關券（Express Pass）</strong>不是門票，而是縮短熱門設施排隊時間的加購票。想玩任天堂世界、哈利波特禁忌之旅或熱門雲霄飛車，又不想把時間耗在排隊上，就可以把快速通關列入預算；如果只是輕鬆逛園區、拍照、看表演，則可以先以一般門票為主。
          </p>

          <h3 className="seo-h3">👉 海遊館、親子樂園和近郊景點適合單買</h3>
          <p>
            <strong>大阪海遊館</strong>、<strong>大阪枚方公園</strong>、<strong>大阪兒童樂園</strong>、<strong>Miracle World 主題樂園</strong>這類景點，適合依照當天行程單買。親子行程尤其建議不要把景點塞太滿，選一個主景點加附近用餐、購物會比較舒服。
            <br />
            如果要去<strong>琵琶湖谷纜車</strong>、<strong>二次元之森</strong>、<strong>勝尾寺</strong>、<strong>關西機場附近溫泉</strong>等大阪市區外景點，記得一起看交通時間。票券便宜不代表整天一定順，移動成本也要算進去。
          </p>

          <h3 className="seo-h3">👉 大阪出發一日遊：用景點 tag 先縮小範圍</h3>
          <p>
            大阪出發一日遊選擇很多，上方可以直接用景點 tag 篩選。想看海景和京都北部，可以從<strong>天橋立</strong>、<strong>伊根舟屋</strong>、<strong>美山合掌村</strong>開始看；想跑經典京都，可以看<strong>嵐山竹林</strong>、<strong>金閣寺</strong>、<strong>清水寺</strong>、<strong>伏見稻荷大社</strong>；想一次安排京都加奈良，就用<strong>奈良公園</strong>、<strong>東大寺</strong>篩選。
            <br />
            神戶方向可以看<strong>有馬溫泉</strong>和<strong>六甲山</strong>，和歌山方向可以看<strong>和歌山城</strong>，滋賀方向則可以看<strong>MIHO 美術館</strong>。如果同行人數多、想要彈性停留時間，最後也可以比較<strong>客制化行程｜包車</strong>。
          </p>
        </SeoContentSection>

        <SeoFaqSection
          title="大阪票券常見問題"
          items={[
            { q: '大阪周遊券到底要不要買？', a: '不要先問票券划不划算，先看你那天會不會密集跑周遊券涵蓋景點。如果一天只逛商店街、吃飯、拍照，通常不用硬買；如果會連跑展望台、摩天輪、大阪城周邊設施，再來算周遊券會比較準。' },
            { q: '周遊券涵蓋景點和優惠景點差在哪？', a: '涵蓋景點通常是可以用周遊券入場；優惠景點比較像折扣或特典，不等於免費。規劃時可以先看「涵蓋」決定要不要買周遊券，再看「優惠」有沒有剛好排進行程。' },
            { q: '大阪一日遊要怎麼從這一頁挑？', a: '先點你最想去的景點 tag，不要一開始就比較所有路線。想看海景就看天橋立、伊根舟屋；想跑京都經典就看嵐山竹林、清水寺、伏見稻荷大社；想少煩惱交通就看有馬溫泉、六甲山、和歌山城或客制化包車。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
