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

function extractGoogleMapsTitle(html: string) {
  const head = html.slice(0, 30000)
  const ogTitle = head.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1]
  const title = ogTitle ?? head.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]
  if (!title) return null
  return decodeHtml(title).replace(/\s*[-|]\s*Google Maps\s*$/i, '').trim() || null
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

    return NextResponse.json({
      url: response.url || rawUrl,
      title: extractGoogleMapsTitle(html),
    })
  } catch {
    return NextResponse.json({ error: 'resolve_failed' }, { status: 502 })
  }
}
