import { expect, test } from '@playwright/test'
import { NextRequest } from 'next/server'
import { GET as googlePlaceDetails } from '../app/api/pass-planner/google-place-details/route'

const originalFetch = globalThis.fetch
const originalGooglePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY
const originalGoogleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY
const originalPublicGoogleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

test.afterEach(() => {
  globalThis.fetch = originalFetch
  if (originalGooglePlacesApiKey === undefined) delete process.env.GOOGLE_PLACES_API_KEY
  else process.env.GOOGLE_PLACES_API_KEY = originalGooglePlacesApiKey
  if (originalGoogleMapsApiKey === undefined) delete process.env.GOOGLE_MAPS_API_KEY
  else process.env.GOOGLE_MAPS_API_KEY = originalGoogleMapsApiKey
  if (originalPublicGoogleMapsApiKey === undefined) delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  else process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = originalPublicGoogleMapsApiKey
})

test('uses the deployed public Maps SDK key when no server-only Places key exists', async () => {
  delete process.env.GOOGLE_PLACES_API_KEY
  delete process.env.GOOGLE_MAPS_API_KEY
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'public-maps-key'

  globalThis.fetch = (async (input, init) => {
    expect(String(input)).toContain('https://places.googleapis.com/v1/places/ChIJtest123')
    expect(new Headers(init?.headers).get('X-Goog-Api-Key')).toBe('public-maps-key')
    return new Response(
      JSON.stringify({
        id: 'ChIJtest123',
        displayName: { text: 'Planner Hotel' },
        location: { latitude: 34.68, longitude: 135.5 },
        types: ['lodging'],
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    )
  }) as typeof fetch

  const response = await googlePlaceDetails(
    new NextRequest('http://localhost/api/pass-planner/google-place-details?placeId=ChIJtest123&language=en&mode=affiliate'),
  )

  expect(response.status).toBe(200)
  await expect(response.json()).resolves.toMatchObject({
    configured: true,
    placeId: 'ChIJtest123',
    name: 'Planner Hotel',
    types: ['lodging'],
  })
})
