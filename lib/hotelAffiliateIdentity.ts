export type VerifiedHotelAffiliateProvider = {
  hotelId: string
  hotelName: string
  sourceUrl?: string
}

export type VerifiedHotelAffiliateIdentity = {
  googlePlaceId: string
  canonicalNames: readonly string[]
  latitude: number
  longitude: number
  countryCode: string
  agoda?: VerifiedHotelAffiliateProvider
  trip?: VerifiedHotelAffiliateProvider
  verifiedAt: string
}

export type HotelAffiliateSearchNamesInput = {
  googlePlaceName?: unknown
  userName?: unknown
  verifiedNames?: unknown
  alternateNames?: unknown
  maxNames?: number
}

export type PlannerHotelAffiliateSearchNamesInput = Pick<
  HotelAffiliateSearchNamesInput,
  'googlePlaceName' | 'userName'
> & {
  googlePlaceNameZhTw?: unknown
}

const MAX_HOTEL_NAME_LENGTH = 160

const VERIFIED_HOTEL_AFFILIATE_IDENTITIES: Readonly<Record<string, VerifiedHotelAffiliateIdentity>> = Object.freeze({
  ChIJzfgJWQCPGGAR2_B6cNH4KIw: Object.freeze({
    googlePlaceId: 'ChIJzfgJWQCPGGAR2_B6cNH4KIw',
    canonicalNames: Object.freeze([
      'Centurion Hotel & Spa Ueno Station',
      'センチュリオンホテル＆スパ上野駅前',
      'Centurion Hotel & Spa Ueno Station -Artificial Radium Hot Spring',
      '上野车站世纪温泉酒店-人工镭温泉',
      '上野站前百夫長飯店及水療中心',
    ]),
    latitude: 35.7098512,
    longitude: 139.7756721,
    countryCode: 'JP',
    agoda: Object.freeze({
      hotelId: '2232362',
      hotelName: 'Centurion Hotel & Spa Ueno Station -Artificial Radium Hot Spring',
    }),
    trip: Object.freeze({
      hotelId: '10748373',
      hotelName: 'Centurion Hotel & Spa Ueno Station',
      sourceUrl: 'https://tw.trip.com/hotels/tokyo-hotel-detail-10748373/centurion-hotelandspa-ueno-station/',
    }),
    verifiedAt: '2026-07-23',
  }),
})

const URL_PATTERN = /^(?:https?:\/\/|www\.)/i
const COORDINATE_PATTERN = /^@?\s*-?\d{1,3}(?:\.\d+)?\s*[,/]\s*-?\d{1,3}(?:\.\d+)?\s*$/
const COUNTRY_POSTCODE_PATTERN =
  /^(?:(?:日本|japan|대한민국|south\s*korea|korea|台灣|台湾|taiwan)\s*(?:〒\s*)?[a-z]?\d{2,}(?:[\s-]\d*){0,2}|〒\s*[a-z]?\d{2,}(?:[\s-]\d*){0,2}|\d{3,}[-\s]\d*)\s*[,.;-]*$/i
const LEADING_POSTAL_ADDRESS_PATTERN =
  /^(?:(?:日本|japan|대한민국|south\s*korea|korea|台灣|台湾|taiwan)\s*)?〒\s*\d/i
const CITY_POSTCODE_PATTERN =
  /^(?:tokyo|osaka|busan|seoul|taipei|hanoi|sapa|東京|东京|大阪|釜山|首爾|首尔|台北|河內|河内|沙壩|沙坝)\s*(?:〒\s*)?\d[\d\s-]*$/i
const JAPAN_POSTCODE_PATTERN = /(?:^|[^\d])\d{3}-\d{4}(?:[^\d]|$)/
const LEADING_COUNTRY_POSTCODE_ADDRESS_PATTERN =
  /^(?:日本|japan|대한민국|south\s*korea|korea|台灣|台湾|taiwan|vi(?:ệ|e)t\s*nam|vietnam|中國|中国|china)\s*(?:〒\s*)?[a-z]?\d{3,6}(?:[-\s]\d{1,4})?\b.+/i
const LEADING_COUNTRY_PATTERN =
  /^(?:(?:japan|south\s*korea|korea|taiwan|vi(?:ệ|e)t\s*nam|vietnam|china)\b|日本|대한민국|台灣|台湾|中國|中国)/i
const LEADING_LOCATION_LIST_PATTERN =
  /^(?:日本|japan|대한민국|south\s*korea|korea|台灣|台湾|taiwan|vi(?:ệ|e)t\s*nam|vietnam|中國|中国|china|tokyo|osaka|busan|seoul|taipei|hanoi|sapa|beijing|shanghai|東京|东京|大阪|釜山|首爾|首尔|台北|河內|河内|沙壩|沙坝|北京|上海)\s*[,，]\s*.+/i
const ADDRESS_WORD_PATTERN =
  /\b(?:street|st|road|rd|avenue|ave|boulevard|blvd|lane|ln|drive|dr|highway|hwy|chome|district)\b|丁目|番地|番|号|號|区|區|市|県|縣|都|府|道|특별시|광역시|시|군|구|읍|면|동|로|길/i
const LODGING_WORD_PATTERN =
  /\b(?:hotel|hotels|hostel|motel|inn|resort|ryokan|guest\s*house|guesthouse|pension|b&b|bnb|aparthotel|villa|stay|lodge)\b|大?飯店|大?饭店|酒店|旅館|旅馆|旅店|旅舍|民宿|住宿|ホテル|旅籠|リゾート|ステイ|ゲストハウス|ペンション|호텔|모텔|리조트/i
const IDENTITY_STOP_WORD_PATTERN =
  /\b(?:hotel|hotels|hostel|motel|inn|resort|ryokan|guest|house|guesthouse|pension|bnb|aparthotel|villa|stay|lodge|japan|korea|taiwan)\b|日本|대한민국|한국|台灣|台湾|飯店|饭店|酒店|旅館|旅馆|旅店|旅舍|民宿|住宿|ホテル|旅籠|リゾート|ステイ|ゲストハウス|ペンション|호텔|모텔|리조트/gi

export function normalizeHotelAffiliateIdentityName(value: unknown) {
  if (typeof value !== 'string') return ''
  return value
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_HOTEL_NAME_LENGTH)
}

export function hotelAffiliateDistinctiveNameTokens(value: unknown) {
  const name = normalizeHotelAffiliateIdentityName(value).toLowerCase()
  if (!name) return []

  return name
    .replace(IDENTITY_STOP_WORD_PATTERN, ' ')
    .replace(/〒\s*[a-z]?\d[\da-z\s-]*/gi, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) =>
      token.length >= 2 ||
      /^\p{Script=Han}$/u.test(token) ||
      /^\d{2,4}$/.test(token) ||
      /^(?:9h)$/i.test(token),
    )
}

export function isUsableHotelAffiliateName(value: unknown) {
  const name = normalizeHotelAffiliateIdentityName(value)
  if (!name || URL_PATTERN.test(name) || COORDINATE_PATTERN.test(name)) return false
  if (
    COUNTRY_POSTCODE_PATTERN.test(name) ||
    LEADING_POSTAL_ADDRESS_PATTERN.test(name) ||
    CITY_POSTCODE_PATTERN.test(name) ||
    JAPAN_POSTCODE_PATTERN.test(name) ||
    LEADING_COUNTRY_POSTCODE_ADDRESS_PATTERN.test(name) ||
    (LEADING_LOCATION_LIST_PATTERN.test(name) && !LODGING_WORD_PATTERN.test(name))
  ) {
    return false
  }
  if (!/[\p{L}\p{N}]/u.test(name)) return false

  const numberGroups = name.match(/\d+/g)?.length ?? 0
  if (
    !LODGING_WORD_PATTERN.test(name) &&
    ADDRESS_WORD_PATTERN.test(name) &&
    (numberGroups > 0 || LEADING_COUNTRY_PATTERN.test(name))
  ) {
    return false
  }

  return hotelAffiliateDistinctiveNameTokens(name).length > 0
}

export function buildHotelAffiliateSearchNames(input: HotelAffiliateSearchNamesInput) {
  const maxNames = Number.isInteger(input.maxNames)
    ? Math.max(1, Math.min(input.maxNames as number, 6))
    : 3
  const verifiedNames = Array.isArray(input.verifiedNames) ? input.verifiedNames : []
  const alternateNames = Array.isArray(input.alternateNames) ? input.alternateNames : []
  const values = [...verifiedNames, input.googlePlaceName, input.userName, ...alternateNames]
  const seen = new Set<string>()
  const names: string[] = []

  for (const value of values) {
    const name = normalizeHotelAffiliateIdentityName(value)
    if (!isUsableHotelAffiliateName(name)) continue
    const key = name.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')
    if (!key || seen.has(key)) continue
    seen.add(key)
    names.push(name)
    if (names.length >= maxNames) break
  }

  return names
}

// Planner lookup deliberately has only three search rounds: Google's English
// Place name, Google's Traditional-Chinese Place name, then the name the user
// entered. Keep aliases out of this helper so a later caller cannot silently
// turn one hotel into many searches.
export function buildPlannerHotelAffiliateSearchNames(input: PlannerHotelAffiliateSearchNamesInput) {
  const seen = new Set<string>()
  const names: string[] = []

  for (const value of [input.googlePlaceName, input.googlePlaceNameZhTw, input.userName]) {
    const name = normalizeHotelAffiliateIdentityName(value)
    if (!isUsableHotelAffiliateName(name)) continue
    const key = name.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')
    if (!key || seen.has(key)) continue
    seen.add(key)
    names.push(name)
  }

  return names
}

export function getVerifiedHotelAffiliateIdentity(googlePlaceId: unknown) {
  const placeId = typeof googlePlaceId === 'string' ? googlePlaceId.trim() : ''
  return placeId ? VERIFIED_HOTEL_AFFILIATE_IDENTITIES[placeId] : undefined
}

export function getApplicableVerifiedHotelAffiliateIdentity(
  googlePlaceId: unknown,
  context: {
    latitude?: unknown
    longitude?: unknown
    countryCode?: unknown
    maxDistanceMeters?: number
  } = {},
) {
  const identity = getVerifiedHotelAffiliateIdentity(googlePlaceId)
  if (!identity) return undefined

  const countryCode =
    typeof context.countryCode === 'string'
      ? context.countryCode.trim().toUpperCase()
      : ''
  if (countryCode && countryCode !== identity.countryCode) return undefined

  const latitude = typeof context.latitude === 'number' && Number.isFinite(context.latitude)
    ? context.latitude
    : undefined
  const longitude = typeof context.longitude === 'number' && Number.isFinite(context.longitude)
    ? context.longitude
    : undefined
  if (latitude != null && longitude != null) {
    const maxDistanceMeters = Math.max(50, Math.min(context.maxDistanceMeters ?? 500, 5_000))
    if (
      hotelIdentityDistanceMeters(
        latitude,
        longitude,
        identity.latitude,
        identity.longitude,
      ) > maxDistanceMeters
    ) {
      return undefined
    }
  }

  return identity
}

function hotelIdentityDistanceMeters(
  fromLatitude: number,
  fromLongitude: number,
  toLatitude: number,
  toLongitude: number,
) {
  const toRadians = (value: number) => (value * Math.PI) / 180
  const latitudeDelta = toRadians(toLatitude - fromLatitude)
  const longitudeDelta = toRadians(toLongitude - fromLongitude)
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(fromLatitude)) *
      Math.cos(toRadians(toLatitude)) *
      Math.sin(longitudeDelta / 2) ** 2
  return 6_371_000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
