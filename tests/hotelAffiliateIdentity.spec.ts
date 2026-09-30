import { expect, test } from '@playwright/test'
import {
  buildHotelAffiliateSearchNames,
  buildPlannerHotelAffiliateSearchNames,
  getApplicableVerifiedHotelAffiliateIdentity,
  getVerifiedHotelAffiliateIdentity,
  isUsableHotelAffiliateName,
} from '../lib/hotelAffiliateIdentity'
import { hotelAffiliateLodgingHint } from '../lib/hotelAffiliatePlaceSignals'

test('rejects postal and address fragments as hotel identity names', () => {
  expect(isUsableHotelAffiliateName('日本〒110-')).toBe(false)
  expect(isUsableHotelAffiliateName('〒110-0005')).toBe(false)
  expect(isUsableHotelAffiliateName('6 Chome-8-16')).toBe(false)
  expect(isUsableHotelAffiliateName('Tokyo 0005')).toBe(false)
  expect(isUsableHotelAffiliateName('Japan 110-0005 Tokyo')).toBe(false)
  expect(isUsableHotelAffiliateName('Tokyo 110-0005')).toBe(false)
  expect(isUsableHotelAffiliateName('Japan, Tokyo, Taito City, Ueno')).toBe(false)
  expect(isUsableHotelAffiliateName('Vietnam 100000 Hanoi')).toBe(false)
  expect(isUsableHotelAffiliateName('Vietnam, Hanoi, Hoan Kiem, 12 Hang Bac')).toBe(false)
  expect(isUsableHotelAffiliateName('대한민국 서울특별시 중구 을지로 30')).toBe(false)
  expect(isUsableHotelAffiliateName('대한민국 서울특별시 중구 을지로')).toBe(false)
  expect(isUsableHotelAffiliateName('South Korea 04533 Seoul')).toBe(false)
  expect(isUsableHotelAffiliateName('中国北京市朝阳区建国路88号')).toBe(false)
  expect(isUsableHotelAffiliateName('中国北京市朝阳区')).toBe(false)
  expect(isUsableHotelAffiliateName('35.7098512, 139.7756721')).toBe(false)
})

test('falls back to the user name when the Google-derived name is unusable', () => {
  expect(buildHotelAffiliateSearchNames({
    googlePlaceName: '日本〒110-',
    userName: '上野世紀SPA酒店-鐳溫泉',
  })).toEqual(['上野世紀SPA酒店-鐳溫泉'])
})

test('uses a marked apartment name when Google resolves only a Japanese street address', () => {
  expect(isUsableHotelAffiliateName('1-chōme-6-17 Ebisuhonmachi')).toBe(false)
  expect(isUsableHotelAffiliateName('公寓')).toBe(false)
  expect(isUsableHotelAffiliateName('住一11號公寓')).toBe(true)
  expect(buildPlannerHotelAffiliateSearchNames({
    googlePlaceName: '1-chōme-6-17 Ebisuhonmachi',
    googlePlaceNameZhTw: '1-chōme-6-17 Ebisuhonmachi',
    userName: '住一11號公寓',
  })).toEqual(['住一11號公寓'])
})

test('uses an explicit hotel category only when Google and the name are not non-lodging', () => {
  expect(hotelAffiliateLodgingHint({
    googlePlaceTypes: ['premise', 'street_address'],
    placeNameSignal: 'unknown',
    userMarkedHotel: true,
  })).toBe(true)
  expect(hotelAffiliateLodgingHint({
    googlePlaceTypes: ['restaurant'],
    placeNameSignal: 'unknown',
    userMarkedHotel: true,
  })).toBe(false)
  expect(hotelAffiliateLodgingHint({
    googlePlaceTypes: ['premise'],
    placeNameSignal: 'non_lodging',
    userMarkedHotel: true,
  })).toBe(false)
  expect(hotelAffiliateLodgingHint({
    googlePlaceTypes: ['premise'],
    placeNameSignal: 'unknown',
    userMarkedHotel: false,
  })).toBe(false)
})

test('keeps valid Google and user aliases without duplicates', () => {
  expect(buildHotelAffiliateSearchNames({
    googlePlaceName: 'Centurion Hotel & Spa Ueno Station',
    userName: '上野世紀SPA酒店-鐳溫泉',
    alternateNames: ['centurion hotel & spa ueno station'],
  })).toEqual([
    'Centurion Hotel & Spa Ueno Station',
    '上野世紀SPA酒店-鐳溫泉',
  ])
})

test('keeps planner lookup to Maps English, Maps Traditional Chinese, then the user name only', () => {
  expect(buildPlannerHotelAffiliateSearchNames({
    googlePlaceName: 'Daiwa Roynet Hotel Okinawa Kenchomae',
    googlePlaceNameZhTw: '大和ROYNET酒店那霸國際通',
    userName: '沖繩縣廳前大和ROYNET飯店',
  })).toEqual([
    'Daiwa Roynet Hotel Okinawa Kenchomae',
    '大和ROYNET酒店那霸國際通',
    '沖繩縣廳前大和ROYNET飯店',
  ])
})

test('does not reject numeric hotel brands', () => {
  expect(isUsableHotelAffiliateName('9h')).toBe(true)
  expect(isUsableHotelAffiliateName('Hotel 81')).toBe(true)
  expect(isUsableHotelAffiliateName('1899')).toBe(true)
  expect(isUsableHotelAffiliateName('界')).toBe(true)
  expect(isUsableHotelAffiliateName('Hotel 1899 Tokyo')).toBe(true)
  expect(isUsableHotelAffiliateName('Megu Fuji 2021')).toBe(true)
})

test('returns only manually verified provider identities by Google Place ID', () => {
  const identity = getVerifiedHotelAffiliateIdentity('ChIJzfgJWQCPGGAR2_B6cNH4KIw')

  expect(identity?.agoda?.hotelId).toBe('2232362')
  expect(identity?.trip?.hotelId).toBe('10748373')
  expect(getVerifiedHotelAffiliateIdentity('ChIJmRrGXnVZSjER_vjDMPLm1lI')?.agoda?.hotelId).toBe('78250696')
  expect(getVerifiedHotelAffiliateIdentity('ChIJ_wZajIRaGGAR87A3xmKJcQc')?.trip?.hotelId).toBe('6236690')
  expect(getVerifiedHotelAffiliateIdentity('ChIJ-d-BZACPGGARzReC-9g1tB4')).toMatchObject({
    agoda: { hotelId: '86827358' },
    trip: { hotelId: '134107878' },
    booking: { hotelId: 'jp/t-hotelru-gu' },
  })
  expect(getVerifiedHotelAffiliateIdentity('ChIJ_4AIjDbnAGARV489qXmh8vE')).toMatchObject({
    agoda: { hotelId: '22886034' },
    trip: { hotelId: '69197985' },
    booking: { hotelId: 'jp/eslead-namba-south-iii' },
  })
  expect(getVerifiedHotelAffiliateIdentity('unknown-place-id')).toBeUndefined()
})

test('does not apply a verified Place ID when its country or coordinates conflict', () => {
  const placeId = 'ChIJzfgJWQCPGGAR2_B6cNH4KIw'

  expect(getApplicableVerifiedHotelAffiliateIdentity(placeId, {
    latitude: 35.7098512,
    longitude: 139.7756721,
    countryCode: 'JP',
  })?.trip?.hotelId).toBe('10748373')
  expect(getApplicableVerifiedHotelAffiliateIdentity(placeId, {
    latitude: 34.6937,
    longitude: 135.5023,
    countryCode: 'JP',
  })).toBeUndefined()
  expect(getApplicableVerifiedHotelAffiliateIdentity(placeId, {
    countryCode: 'KR',
  })).toBeUndefined()
})
