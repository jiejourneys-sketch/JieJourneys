import { expect, test } from '@playwright/test'
import { NextRequest } from 'next/server'
import { GET as resolveMapUrl } from '../app/api/pass-planner/resolve-map-url/route'

const shortGoogleMapsUrl = 'https://maps.app.goo.gl/GCPepUUGQ75cQiUs5'
const expandedGoogleMapsUrl =
  'https://www.google.com/maps/place/%E6%B2%96%E7%B9%A9%E7%B8%A3%E5%BB%B3%E5%89%8D%E5%A4%A7%E5%92%8CROYNET%E9%A3%AF%E5%BA%97/@26.2133022,127.6741234,17z/data=!4m2!3d26.2132974!4d127.6766983'
const originalFetch = globalThis.fetch

function resolverRequest(url: string) {
  return new NextRequest(
    `http://localhost/api/pass-planner/resolve-map-url?url=${encodeURIComponent(url)}`,
  )
}

test.afterEach(() => {
  globalThis.fetch = originalFetch
})

test('follows a Google Maps short link and preserves the resolved hotel identity', async () => {
  const requestedUrls: string[] = []
  globalThis.fetch = (async (input, init) => {
    const url = String(input)
    requestedUrls.push(url)
    expect(init?.redirect).toBe('manual')

    if (url === shortGoogleMapsUrl) {
      return new Response(null, {
        status: 302,
        headers: { location: expandedGoogleMapsUrl },
      })
    }
    if (url === expandedGoogleMapsUrl) {
      return new Response('<title>Google 地圖</title>', {
        status: 200,
        headers: { 'content-type': 'text/html' },
      })
    }
    throw new Error(`unexpected_url:${url}`)
  }) as typeof fetch

  const response = await resolveMapUrl(resolverRequest(shortGoogleMapsUrl))
  const payload = await response.json()

  expect(response.status).toBe(200)
  expect(requestedUrls).toEqual([shortGoogleMapsUrl, expandedGoogleMapsUrl])
  expect(payload).toMatchObject({
    url: expandedGoogleMapsUrl,
    title: '沖繩縣廳前大和ROYNET飯店',
    query: '沖繩縣廳前大和ROYNET飯店',
    lat: 26.2132974,
    lng: 127.6766983,
  })
})

test('rejects Google and Naver lookalike hosts before making a request', async () => {
  let fetchCount = 0
  globalThis.fetch = (async () => {
    fetchCount += 1
    throw new Error('fetch_must_not_run')
  }) as typeof fetch

  const invalidUrls = [
    'https://maps.google.evil.com/maps/place/hotel',
    'https://google.evil.com/maps/place/hotel',
    'https://www.google.com.evil.com/maps/place/hotel',
    'https://maps.app.goo.gl.evil.com/hotel',
    'https://maps.app.goo.gl@evil.example/maps/place/hotel',
    'https://goo.gl/not-a-maps-link',
    'http://maps.app.goo.gl/GCPepUUGQ75cQiUs5',
    'https://map.naver.com.evil.com/p/entry/place/123456',
    'https://naver.me.evil.com/example',
  ]

  for (const url of invalidUrls) {
    const response = await resolveMapUrl(resolverRequest(url))
    expect(response.status, url).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'invalid_url' })
  }
  expect(fetchCount).toBe(0)
})

test('rejects a short-link redirect that leaves the Google Maps allowlist', async () => {
  let fetchCount = 0
  globalThis.fetch = (async () => {
    fetchCount += 1
    return new Response(null, {
      status: 302,
      headers: { location: 'https://evil.example/maps/place/hotel' },
    })
  }) as typeof fetch

  const response = await resolveMapUrl(resolverRequest(shortGoogleMapsUrl))

  expect(response.status).toBe(502)
  await expect(response.json()).resolves.toEqual({ error: 'resolve_failed' })
  expect(fetchCount).toBe(1)
})

test('follows an allowed Naver short link and extracts its place ID', async () => {
  const shortUrl = 'https://naver.me/example'
  const expandedUrl = 'https://map.naver.com/p/entry/place/1234567890'
  const requestedUrls: string[] = []
  globalThis.fetch = (async (input) => {
    const url = String(input)
    requestedUrls.push(url)
    if (url === shortUrl) {
      return new Response(null, {
        status: 302,
        headers: { location: expandedUrl },
      })
    }
    return new Response('', { status: 200 })
  }) as typeof fetch

  const response = await resolveMapUrl(resolverRequest(shortUrl))
  const payload = await response.json()

  expect(response.status).toBe(200)
  expect(requestedUrls).toEqual([shortUrl, expandedUrl])
  expect(payload).toEqual({
    url: expandedUrl,
    naverPlaceId: '1234567890',
  })
})

test('stops an allowed redirect loop at the configured hop limit', async () => {
  let fetchCount = 0
  globalThis.fetch = (async () => {
    fetchCount += 1
    return new Response(null, {
      status: 302,
      headers: {
        location: `https://www.google.com/maps/place/hotel?hop=${fetchCount}`,
      },
    })
  }) as typeof fetch

  const response = await resolveMapUrl(resolverRequest(shortGoogleMapsUrl))

  expect(response.status).toBe(502)
  await expect(response.json()).resolves.toEqual({ error: 'resolve_failed' })
  expect(fetchCount).toBe(5)
})
