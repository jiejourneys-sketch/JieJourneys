import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_HOSTS = new Set([
  'maps.app.goo.gl',
  'goo.gl',
  'www.google.com',
  'google.com',
  'maps.google.com',
])

function isAllowedGoogleMapsUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && ALLOWED_HOSTS.has(url.hostname)
  } catch {
    return false
  }
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function cleanGoogleMapsTitle(value: string) {
  const normalized = decodeHtml(value)
    .replace(/\\u0026/g, '&')
    .replace(/\s*[-|]\s*(?:Google Maps|Google\s*(?:\u5730\u5716|\u5730\u56fe))\s*$/i, '')
    .replace(/^(?:Google Maps|Google\s*(?:\u5730\u5716|\u5730\u56fe))\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
  return normalized || null
}

function extractGoogleMapsTitle(html: string) {
  const head = html.slice(0, 30000)
  const ogTitle = head.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1]
  const itemPropName = head.match(/<meta[^>]+itemprop=["']name["'][^>]+content=["']([^"']+)["']/i)?.[1]
  const nameMeta = head.match(/<meta[^>]+name=["']title["'][^>]+content=["']([^"']+)["']/i)?.[1]
  const appStateTitle = html.match(/\[\s*"([^"]{2,120})"\s*,\s*null\s*,\s*null\s*,\s*null\s*,\s*\[[^\]]*?\]\s*,\s*null\s*,\s*null\s*,\s*null\s*,\s*null\s*,\s*null\s*,\s*null\s*,\s*null\s*,\s*\[\s*null\s*,\s*null\s*,\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*\]/)?.[1]
  const pageTitle = head.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]
  const candidates = [appStateTitle, ogTitle, itemPropName, nameMeta, pageTitle]
  for (const title of candidates) {
    if (!title) continue
    const cleanTitle = cleanGoogleMapsTitle(title)
    if (cleanTitle) return cleanTitle
  }
  return null
}

function parseCoordinatePair(latValue: string | undefined, lngValue: string | undefined) {
  const lat = Number(latValue)
  const lng = Number(lngValue)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null
  return { lat, lng }
}

function extractGoogleMapsCoordinates(value: string) {
  const patterns = [
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
    /!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/,
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /[?&](?:q|query|destination|ll|center)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
  ]

  for (const pattern of patterns) {
    const match = value.match(pattern)
    if (!match) continue
    const isLngLatPattern = pattern.source.startsWith('!2d')
    const pair = parseCoordinatePair(match[isLngLatPattern ? 2 : 1], match[isLngLatPattern ? 1 : 2])
    if (pair) return pair
  }

  const htmlPatterns = [
    /\[\s*null\s*,\s*null\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]/,
    /"center"\s*:\s*\{\s*"lat"\s*:\s*(-?\d+(?:\.\d+)?)\s*,\s*"lng"\s*:\s*(-?\d+(?:\.\d+)?)\s*\}/,
    /"latitude"\s*:\s*(-?\d+(?:\.\d+)?)\s*,\s*"longitude"\s*:\s*(-?\d+(?:\.\d+)?)/,
  ]

  for (const pattern of htmlPatterns) {
    const match = value.match(pattern)
    if (!match) continue
    const pair = parseCoordinatePair(match[1], match[2])
    if (pair) return pair
  }

  return null
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get('url')?.trim()
  if (!rawUrl || rawUrl.length > 900 || !isAllowedGoogleMapsUrl(rawUrl)) {
    return NextResponse.json({ error: 'invalid_url' }, { status: 400 })
  }

  try {
    const response = await fetch(rawUrl, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
      headers: {
        'user-agent': 'Mozilla/5.0 JieJourneys planner link resolver',
      },
    })

    const html = await response.text()

    const resolvedUrl = response.url || rawUrl
    const coordinates = extractGoogleMapsCoordinates(resolvedUrl) ?? extractGoogleMapsCoordinates(html)

    return NextResponse.json({
      url: resolvedUrl,
      title: extractGoogleMapsTitle(html),
      ...(coordinates ? coordinates : {}),
    })
  } catch {
    return NextResponse.json({ error: 'resolve_failed' }, { status: 502 })
  }
}
