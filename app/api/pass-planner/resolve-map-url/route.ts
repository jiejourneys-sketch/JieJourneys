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

    return NextResponse.json({
      url: response.url || rawUrl,
    })
  } catch {
    return NextResponse.json({ error: 'resolve_failed' }, { status: 502 })
  }
}
