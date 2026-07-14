import { NextRequest, NextResponse } from 'next/server'

function isAllowedGoogleMapsUrl(value: string) {
  try {
    const url = new URL(value)
    return (
      url.protocol === 'https:' &&
      (url.hostname === 'maps.app.goo.gl' ||
        url.hostname === 'goo.gl' ||
        url.hostname.startsWith('maps.google.') ||
        ((url.hostname === 'google.com' || url.hostname.startsWith('google.') || url.hostname.startsWith('www.google.')) &&
          url.pathname.startsWith('/maps')))
    )
  } catch {
    return false
  }
}

function isAllowedNaverMapsUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && (url.hostname === 'naver.me' || url.hostname === 'map.naver.com')
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
  if (/^(?:Google Maps|Google\s*(?:\u5730\u5716|\u5730\u56fe))(?:\s+\S+)?$/i.test(normalized)) return null
  return normalized || null
}

function decodeGoogleMapsPathPlaceName(value: string) {
  try {
    const url = new URL(value)
    const match = url.pathname.match(/\/maps\/(?:place|search)\/([^/?@]+)/)
    if (!match?.[1]) return null
    return cleanGoogleMapsQueryTitle(decodeURIComponent(match[1].replace(/\+/g, ' ')))
  } catch {
    const match = value.match(/\/maps\/(?:place|search)\/([^/?@]+)/)
    if (!match?.[1]) return null
    try {
      return cleanGoogleMapsQueryTitle(decodeURIComponent(match[1].replace(/\+/g, ' ')))
    } catch {
      return cleanGoogleMapsQueryTitle(match[1].replace(/\+/g, ' '))
    }
  }
}

function decodeGoogleMapsQuery(value: string) {
  try {
    const url = new URL(value)
    const query = url.searchParams.get('q') || url.searchParams.get('query')
    if (!query || /^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/.test(query.trim())) return null
    return query.replace(/\s+/g, ' ').trim()
  } catch {
    return null
  }
}

function extractGoogleMapsPlaceId(value: string) {
  try {
    const url = new URL(value)
    for (const key of ['query_place_id', 'place_id', 'origin_place_id', 'destination_place_id']) {
      const id = url.searchParams.get(key)?.trim()
      if (id) return id
    }
  } catch {
    // Fall through to loose text matching.
  }

  const paramMatch = value.match(/[?&](?:query_place_id|place_id|origin_place_id|destination_place_id)=([^&#]+)/i)
  if (paramMatch?.[1]) return decodeURIComponent(paramMatch[1]).trim()
  const dataMatch = value.match(/!1s(ChI[A-Za-z0-9_-]{12,})/)
  return dataMatch?.[1] ?? null
}

function extractNaverPlaceId(value: string) {
  try {
    const url = new URL(value)
    const match = url.pathname.match(/\/(?:p\/)?(?:entry\/)?place\/(\d+)/)
    return match?.[1] ?? null
  } catch {
    const match = value.match(/\/(?:p\/)?(?:entry\/)?place\/(\d+)/)
    return match?.[1] ?? null
  }
}

function cleanGoogleMapsQueryTitle(value: string | null) {
  if (!value) return null
  const normalized = stripGoogleMapsPlusCode(value)
    .replace(/\s+/g, ' ')
    .trim()
  const locationTailStripped = stripGoogleMapsLocationTail(normalized)
  if (locationTailStripped !== normalized) return cleanGoogleMapsTitle(locationTailStripped)
  const embeddedPlaceName = extractEmbeddedNonLatinPlaceName(normalized)
  if (embeddedPlaceName && isLikelyGoogleMapsAddress(normalized)) return cleanGoogleMapsTitle(embeddedPlaceName)
  if (isLikelyGoogleMapsAddress(normalized)) return null
  const addressStart = normalized.search(
    /\d{1,6}\s*(?:[A-Za-z]|$)|\s(?:[A-Za-z0-9.-]+\s+)?(?:ro|gil|gu|dong|myeon|eup|si),|\s(?:[A-Za-z0-9.-]+-)?\d{1,5},/i,
  )
  if (addressStart > 1) return cleanGoogleMapsTitle(normalized.slice(0, addressStart).trim())
  const stripped = normalized
    .replace(/^(.{2,70}?)(?=\d{1,6}\s*[A-Za-z])/u, '$1')
    .replace(/^(.{2,70}?)(?=\s+\d{1,6}\s)/u, '$1')
    .replace(/^(.{2,70}?)(?=\s+(?:[A-Za-z0-9.-]+\s+)?(?:ro|gil|gu|dong|myeon|eup|si),)/iu, '$1')
    .replace(/^(.{2,70}?)(?=\s+(?:[A-Za-z0-9.-]+-)?\d{1,5},)/u, '$1')
    .replace(/^(.{2,70}?)(?=\s+(?:韓國|南韓|日本|台灣|臺灣|越南|Korea|Japan|Taiwan|Vietnam)\b)/iu, '$1')
    .trim()
  const candidate = stripped || normalized
  return isLikelyGoogleMapsAddress(candidate) ? null : cleanGoogleMapsTitle(candidate)
}

function stripGoogleMapsLocationTail(value: string) {
  const commaIndex = value.lastIndexOf(',')
  if (commaIndex <= 0) return value

  const beforeCountry = value.slice(0, commaIndex).trim()
  const country = value.slice(commaIndex + 1).trim()
  const countryLooksLikeCountry =
    /[^\x00-\x7F]/.test(country) ||
    /^(?:South Korea|Korea|Japan|Taiwan|Vietnam|China|Thailand)$/i.test(country)
  if (!countryLooksLikeCountry || country.length > 40) return value

  const beforeCountryWithoutPlusCode = stripGoogleMapsPlusCode(beforeCountry)
  const roadStart = beforeCountryWithoutPlusCode.search(
    /\s+(?:(?:[A-Za-z0-9()'.-]+)\s+){0,4}(?:Road|Rd\.?|Street|St\.?|Avenue|Ave\.?|Boulevard|Blvd\.?|Lane|Ln\.?|Drive|Dr\.?)\b|\s+(?:Thanon|Soi)\s+[A-Za-z]/i,
  )
  if (roadStart > 1) return beforeCountryWithoutPlusCode.slice(0, roadStart).trim()

  const adminStart = beforeCountryWithoutPlusCode.search(
    /\s+(?:[A-Za-z0-9()'.-]+-)?(?:dong|gu|si|ga|ro|gil|daero|myeon|eup)\b/i,
  )
  if (adminStart > 1) return beforeCountryWithoutPlusCode.slice(0, adminStart).trim()

  const asciiTailMatch = beforeCountryWithoutPlusCode.match(/^(.+?)\s+[A-Za-z][A-Za-z .'-]{1,40}$/u)
  if (asciiTailMatch?.[1] && /[^\x00-\x7F]/.test(asciiTailMatch[1])) return asciiTailMatch[1].trim()

  const stripped = beforeCountryWithoutPlusCode
    .replace(
      /\s+(?:Busan|Seoul|Tokyo|Osaka|Kyoto|Kobe|Nara|Fukuoka|Kawaguchiko|Fujikawaguchiko|Kinmen|Taipei|Hanoi|Ho Chi Minh City|Da Nang)$/iu,
      '',
    )
    .trim()
  return stripped.length >= 2 && stripped !== beforeCountry ? stripped : value
}

function stripGoogleMapsPlusCode(value: string) {
  return value.replace(/^[23456789CFGHJMPQRVWX]{4,8}(?:\+|\s+)[23456789CFGHJMPQRVWX]{2,3}\s+/i, '').trim()
}

function extractEmbeddedNonLatinPlaceName(value: string) {
  const normalized = stripGoogleMapsPlusCode(value).replace(/\s+/g, ' ').trim()
  const matches = Array.from(
    normalized.matchAll(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Thai}]{2,}/gu),
  )
    .map((match) =>
      match[0]
        .replace(/(?:新加坡|泰國|泰国|南韓|韓國|韩国|日本|台灣|臺灣|台湾|越南|中國|中国)$/u, '')
        .trim(),
    )
    .filter((text) => text.length >= 2 && !isLikelyGoogleMapsAddress(text))

  return matches.sort((a, b) => b.length - a.length)[0] ?? ''
}

function isLikelyGoogleMapsAddress(value: string) {
  const normalized = value.trim()
  return (
    /^\d{1,6}\b/.test(normalized) ||
    /\d+.*(?:\u8def|\u8857|\u5df7|\u5f04|\u865f|\u53f7|\u6bb5|Road|Rd\.?|Street|St\.?|Avenue|Ave\.?)/i.test(normalized) ||
    /\b(?:Thanon|Soi)\s+[A-Za-z]/i.test(normalized) ||
    /\b(?:[A-Za-z0-9()'.-]+-)?(?:dong|gu|si|ga|ro|gil|daero|myeon|eup)\b.*,/i.test(normalized)
  )
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
  const isGoogleUrl = rawUrl ? isAllowedGoogleMapsUrl(rawUrl) : false
  const isNaverUrl = rawUrl ? isAllowedNaverMapsUrl(rawUrl) : false
  if (!rawUrl || rawUrl.length > 900 || (!isGoogleUrl && !isNaverUrl)) {
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
    if (isNaverUrl) {
      const naverPlaceId = extractNaverPlaceId(resolvedUrl) ?? extractNaverPlaceId(html)
      return NextResponse.json({
        url: resolvedUrl,
        ...(naverPlaceId ? { naverPlaceId } : {}),
      })
    }

    const coordinates = extractGoogleMapsCoordinates(resolvedUrl) ?? extractGoogleMapsCoordinates(html)
    const pathPlaceName = decodeGoogleMapsPathPlaceName(resolvedUrl)
    const query = decodeGoogleMapsQuery(resolvedUrl) ?? pathPlaceName
    const title = cleanGoogleMapsQueryTitle(query) ?? pathPlaceName ?? extractGoogleMapsTitle(html)
    const googlePlaceId = extractGoogleMapsPlaceId(resolvedUrl) ?? extractGoogleMapsPlaceId(html)

    return NextResponse.json({
      url: resolvedUrl,
      title,
      ...(query ? { query } : {}),
      ...(coordinates ? coordinates : {}),
      ...(googlePlaceId ? { googlePlaceId } : {}),
    })
  } catch {
    return NextResponse.json({ error: 'resolve_failed' }, { status: 502 })
  }
}
