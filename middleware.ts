import { NextResponse, type NextRequest } from 'next/server'

const PARAMETERIZED_CONTENT_PATHS = new Set([
  '/busan/ticket',
  '/busan/map',
  '/busan/pass-map',
  '/busan/visit-busan-pass',
  '/busan/busan-yacht-suyeong-diamond-bay',
  '/tokyo/ticket',
  '/tokyo/map',
  '/tokyo/narita-airport-to-tokyo',
  '/tokyo/haneda-airport-to-tokyo',
  '/tokyo/tokyo-subway-ticket',
  '/osaka/ticket',
  '/osaka/map',
  '/osaka/pass-map',
  '/osaka/kansai-airport-to-osaka',
  '/osaka/osaka-amazing-pass',
  '/fuji/ticket',
  '/fuji/map',
  '/fuji/pass-map',
  '/fuji/tokyo-to-kawaguchiko',
  '/fuji/mt-fuji-pass',
  '/northvietnam/ticket',
  '/northvietnam/map',
  '/northvietnam/hanoi-to-sapa-transport',
])

const UI_QUERY_PARAMS = new Set(['from', 'place', 'return', 'source', 'tag'])

function normalizePathname(pathname: string) {
  if (pathname === '/') return pathname
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

function hasUiQueryParam(searchParams: URLSearchParams) {
  for (const key of searchParams.keys()) {
    if (UI_QUERY_PARAMS.has(key)) return true
  }
  return false
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const pathname = normalizePathname(request.nextUrl.pathname)

  if (
    PARAMETERIZED_CONTENT_PATHS.has(pathname) &&
    hasUiQueryParam(request.nextUrl.searchParams)
  ) {
    response.headers.set('X-Robots-Tag', 'noindex, follow')
  }

  return response
}

export const config = {
  matcher: [
    '/busan/:path*',
    '/tokyo/:path*',
    '/osaka/:path*',
    '/fuji/:path*',
    '/northvietnam/:path*',
  ],
}
