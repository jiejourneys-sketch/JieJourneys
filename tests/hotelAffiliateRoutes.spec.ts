import { expect, test } from '@playwright/test'
import { NextRequest } from 'next/server'
import { POST as postAgodaAffiliate } from '../app/api/pass-planner/hotel-affiliate/agoda/route'
import { POST as postTripAffiliate } from '../app/api/pass-planner/hotel-affiliate/trip/route'

const centurionRequest = {
  hotelName: '日本〒110-',
  name: '上野车站世纪温泉酒店-人工镭温泉',
  googlePlaceId: 'ChIJzfgJWQCPGGAR2_B6cNH4KIw',
  city: 'Tokyo',
  countryCode: 'JP',
  lat: 35.7098512,
  lng: 139.7756721,
  lodgingHint: true,
  googlePlaceTypes: ['lodging'],
}

function affiliateRequest(path: string) {
  return new NextRequest(`http://localhost${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(centurionRequest),
  })
}

test('verified routes recover from a polluted Google name without fuzzy matching', async () => {
  const [agodaResponse, tripResponse] = await Promise.all([
    postAgodaAffiliate(affiliateRequest('/api/pass-planner/hotel-affiliate/agoda')),
    postTripAffiliate(affiliateRequest('/api/pass-planner/hotel-affiliate/trip')),
  ])
  const agoda = await agodaResponse.json()
  const trip = await tripResponse.json()

  expect(agodaResponse.status).toBe(200)
  expect(agoda.matchStatus).toBe('matched')
  expect(agoda.confidence).toBe('verified')
  expect(agoda.bestMatch?.hotelId).toBe('2232362')
  expect(agoda.bestMatch?.bookingUrl).toContain('hid=2232362')

  expect(tripResponse.status).toBe(200)
  expect(trip.matchStatus).toBe('matched')
  expect(trip.confidence).toBe('verified')
  expect(trip.bestMatch?.hotelId).toBe('10748373')
  expect(trip.bestMatch?.bookingUrl).toContain('hotelId=10748373')
})
