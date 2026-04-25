import { NextRequest, NextResponse } from 'next/server'

interface OgResult {
  title: string
  image: string
  description: string
}

function extractOg(html: string): OgResult {
  const get = (name: string): string => {
    // property="og:X" content="…"  or  content="…" property="og:X"
    const re1 = new RegExp(
      `<meta[^>]+property=["']og:${name}["'][^>]+content=["']([^"']+)["']`,
      'i'
    )
    const re2 = new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${name}["']`,
      'i'
    )
    return (html.match(re1) ?? html.match(re2))?.[1]?.trim() ?? ''
  }

  // Fallback to <title> if og:title not found
  const title =
    get('title') ||
    (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? '')

  return {
    title,
    image: get('image'),
    description: get('description'),
  }
}

const ALLOWED_HOSTS = [
  'agoda.com',
  'kkday.com',
  'klook.com',
  'booking.com',
  'trip.com',
  'ctrip.com',
  'airbnb.com',
  'hotels.com',
  'tripadvisor.com',
  'expedia.com',
  'rakuten-travel.com',
]

function isAllowedHost(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return ALLOWED_HOSTS.some((h) => host === h || host.endsWith('.' + h))
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get('url')
  if (!rawUrl) {
    return NextResponse.json({ error: 'missing url' }, { status: 400 })
  }

  // Only fetch from allowlisted travel platforms (prevent SSRF)
  if (!isAllowedHost(rawUrl)) {
    return NextResponse.json({ title: '', image: '', description: '' })
  }

  try {
    const res = await fetch(rawUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; JieJourneys-OGBot/1.0; +https://www.jiejourneys.com)',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
      },
      signal: AbortSignal.timeout(6000),
      // Next.js: don't cache on the CDN, respect user freshness
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return NextResponse.json({ title: '', image: '', description: '' })
    }

    // Limit response body to 512 KB to avoid memory pressure
    const reader = res.body?.getReader()
    const chunks: Uint8Array[] = []
    let total = 0
    const MAX = 512 * 1024

    if (reader) {
      while (true) {
        const { done, value } = await reader.read()
        if (done || !value) break
        chunks.push(value)
        total += value.length
        if (total >= MAX) {
          reader.cancel()
          break
        }
      }
    }

    const html = Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf-8')
    const og = extractOg(html)

    return NextResponse.json(og, {
      headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
    })
  } catch {
    return NextResponse.json({ title: '', image: '', description: '' })
  }
}
