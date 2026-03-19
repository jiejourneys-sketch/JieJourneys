import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CRAWLER_UA = /facebookexternalhit|Facebot|LinkedInBot|Twitterbot|WhatsApp|TelegramBot/i

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') || ''
  if (CRAWLER_UA.test(ua)) {
    const res = NextResponse.next()
    res.headers.set('Accept-Ranges', 'none')
    return res
  }
  return NextResponse.next()
}

export const config = { matcher: ['/', '/index.html', '/contact', '/contact.html', '/busan/:path*', '/tokyo/:path*', '/northvietnam/:path*'] }
