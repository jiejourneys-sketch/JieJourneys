import { expect, test } from '@playwright/test'
import {
  cleanAgodaAlternateHotelNames,
  searchAgodaAffiliateHotels,
  scoreAgodaHotelNameAliases,
} from '../lib/agodaAffiliate'

test('cleans, deduplicates, and bounds Agoda alternate hotel names', () => {
  const aliases = cleanAgodaAlternateHotelNames([
    '  Centurion Hotel & Spa Ueno Station  ',
    'ＣＥＮＴＵＲＩＯＮ　ＨＯＴＥＬ　＆　ＳＰＡ　ＵＥＮＯ　ＳＴＡＴＩＯＮ',
    '',
    null,
    ...Array.from({ length: 10 }, (_, index) => `Alias ${index + 1}`),
  ], 'centurion hotel & spa ueno station')

  expect(aliases).toEqual(Array.from({ length: 8 }, (_, index) => `Alias ${index + 1}`))
})

test('uses the highest score across every query and candidate alias', () => {
  const primaryOnlyScore = scoreAgodaHotelNameAliases(
    ['日本〒110-'],
    ['Centurion Hotel & Spa Ueno Station -Artificial Radium Hot Spring'],
  )
  const aliasScore = scoreAgodaHotelNameAliases(
    ['日本〒110-', 'Centurion Hotel & Spa Ueno Station -Artificial Radium Hot Spring'],
    ['Unrelated current name', 'Centurion Hotel & Spa Ueno Station -Artificial Radium Hot Spring', 'Former name'],
  )

  expect(primaryOnlyScore).toBeLessThan(0.42)
  expect(aliasScore).toBe(1)
})

test('keeps the dense-area coordinate guard while allowing a canonical alias to match', async () => {
  const baseQuery = {
    hotelName: '日本〒110-',
    latitude: 35.7098512,
    longitude: 139.7756721,
    lodgingHint: true,
  }
  const coordinateOnlyResult = await searchAgodaAffiliateHotels(baseQuery)
  const canonicalAliasResult = await searchAgodaAffiliateHotels({
    ...baseQuery,
    alternateHotelNames: ['Centurion Hotel & Spa Ueno Station -Artificial Radium Hot Spring'],
  })

  expect(coordinateOnlyResult.matchStatus).toBe('no_match')
  expect(canonicalAliasResult.matchStatus).toBe('matched')
  expect(canonicalAliasResult.bestMatch?.hotelId).toBe('2232362')
})

test('requires numeric hotel branch identities to agree', async () => {
  const wrongBranchScore = scoreAgodaHotelNameAliases(
    ['Toyoko Inn Seoul Dongdaemun No.2'],
    ['Toyoko Inn Seoul Dongdaemun No.1'],
  )
  const wrongCompactBranchScore = scoreAgodaHotelNameAliases(
    ['Hotel No. 2 Busan'],
    ['Hotel No1 Busan'],
  )
  const correctBranchScore = scoreAgodaHotelNameAliases(
    ['Toyoko Inn Seoul Dongdaemun No.2'],
    ['Seoul Dongdaemun 2 Toyoko Inn Hotel'],
  )
  const currentNameWithFormerBranchScore = scoreAgodaHotelNameAliases(
    ['Toyoko Inn Seoul Dongdaemun No.2'],
    ['Toyoko Inn Seoul Dongdaemun No.2', 'Toyoko Inn Seoul Dongdaemun No.1'],
  )
  const compactNumberScores = [
    scoreAgodaHotelNameAliases(['7 Days Inn Busan'], ['7Days Inn Busan']),
    scoreAgodaHotelNameAliases(['24 Guesthouse Seoul'], ['24Guesthouse Seoul']),
    scoreAgodaHotelNameAliases(['Hotel No. 25 Busan'], ['Hotel No25 Busan']),
  ]
  const result = await searchAgodaAffiliateHotels({
    hotelName: 'Toyoko Inn Seoul Dongdaemun No.2',
    cityId: 14690,
    city: 'Seoul',
    countryCode: 'KR',
    latitude: 37.564529,
    longitude: 127.007813,
    lodgingHint: true,
  })

  expect(wrongBranchScore).toBeLessThan(0.78)
  expect(wrongCompactBranchScore).toBeLessThan(0.78)
  expect(correctBranchScore).toBeGreaterThan(0.78)
  expect(currentNameWithFormerBranchScore).toBe(1)
  compactNumberScores.forEach((score) => expect(score).toBeGreaterThan(0.77))
  expect(result.matchStatus).toBe('matched')
  expect(result.bestMatch?.hotelId).toBe('86690097')
  expect(result.bestMatch?.hotelName).toContain('2')
})

test('uses a manually verified Google Place ID before fuzzy matching', async () => {
  const result = await searchAgodaAffiliateHotels({
    hotelName: '日本〒110-',
    googlePlaceId: 'ChIJzfgJWQCPGGAR2_B6cNH4KIw',
    latitude: 35.7098512,
    longitude: 139.7756721,
    lodgingHint: true,
  })

  expect(result.matchStatus).toBe('matched')
  expect(result.confidence).toBe('verified')
  expect(result.bestMatch?.hotelId).toBe('2232362')
  expect(result.bestMatch?.source).toBe('verified')
})
