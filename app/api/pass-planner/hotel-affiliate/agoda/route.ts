import { NextRequest, NextResponse } from 'next/server'
import { getAgodaAffiliatePublicConfig, searchAgodaAffiliateHotels } from '@/lib/agodaAffiliate'
import { searchAgodaAffiliateHotelsWithGoogleHotels } from '@/lib/tripGoogleHotels'
import { buildPlannerHotelAffiliateSearchNames } from '@/lib/hotelAffiliateIdentity'
import { cleanHotelAffiliateGooglePlaceTypes, hotelAffiliateGooglePlaceTypeSignal } from '@/lib/hotelAffiliatePlaceSignals'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(getAgodaAffiliatePublicConfig())
}

export async function POST(req: NextRequest) {
  const input = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!input) return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })

  const googlePlaceId = cleanString(input.googlePlaceId ?? input.placeId, 180)
  const countryCode = cleanString(input.countryCode, 2)
  const latitude = cleanNumber(input.latitude ?? input.lat, -90, 90)
  const longitude = cleanNumber(input.longitude ?? input.lng, -180, 180)
  const hotelNames = buildPlannerHotelAffiliateSearchNames({
    googlePlaceName: cleanString(input.googlePlaceName, 160) ?? cleanString(input.hotelName, 160),
    googlePlaceNameZhTw: cleanString(input.googlePlaceNameZhTw, 160),
    userName: input.name,
  })
  const hotelName = hotelNames[0]
  if (!hotelName) return NextResponse.json({ error: 'missing_hotel_name' }, { status: 400 })
  const googlePlaceTypes = cleanHotelAffiliateGooglePlaceTypes(input.googlePlaceTypes ?? input.placeTypes, 12)
  const placeTypeSignal = hotelAffiliateGooglePlaceTypeSignal(googlePlaceTypes)
  const explicitLodgingHint = cleanBoolean(input.lodgingHint ?? input.isLodging ?? input.hotelAffiliateEligible)
  const lodgingHint = placeTypeSignal === 'lodging' || (explicitLodgingHint && placeTypeSignal !== 'non_lodging')

  const searchInput = {
    hotelName,
    alternateHotelNames: hotelNames.slice(1),
    googlePlaceId,
    cityId: cleanInteger(input.cityId, 1, 9999999),
    city: cleanString(input.city, 80),
    countryCode,
    latitude,
    longitude,
    lodgingHint,
    checkInDate: cleanDate(input.checkInDate),
    checkOutDate: cleanDate(input.checkOutDate),
    adults: cleanInteger(input.adults, 1, 16),
    children: cleanInteger(input.children, 0, 8),
    rooms: cleanInteger(input.rooms, 1, 8),
    currency: cleanString(input.currency, 10),
    language: cleanString(input.language, 12),
    maxResult: cleanInteger(input.maxResult, 1, 50),
    forceRefresh: cleanBoolean(input.forceRefresh ?? input.refresh),
  }
  let result = await searchAgodaAffiliateHotels(searchInput)

  // The bundled Agoda catalogue is the free first layer. If a new/rebranded
  // property is absent or ambiguous, use the exact Google Hotels property as
  // a generic discovery layer. Its name and coordinates must pass the same
  // strict branch verifier before an Agoda booking source can be accepted.
  if (result.matchStatus === 'no_match' || result.matchStatus === 'needs_review') {
    const googleHotelsResult = await searchAgodaAffiliateHotelsWithGoogleHotels(searchInput)
    if (googleHotelsResult?.matchStatus === 'matched' && googleHotelsResult.bestMatch) {
      result = {
        ...result,
        configured: true,
        searchProvider: 'serpapi',
        matchStatus: 'matched',
        confidence: 'high',
        bestMatch: googleHotelsResult.bestMatch,
        candidates: googleHotelsResult.candidates,
        rawCount: googleHotelsResult.candidates.length,
        searchUrl: googleHotelsResult.searchUrl,
        discoveryMethod: 'google_hotels',
        providerRequestCount: googleHotelsResult.requestCount,
      }
    } else if (googleHotelsResult?.matchStatus === 'search_error' && result.matchStatus === 'no_match') {
      result = {
        ...result,
        matchStatus: 'api_error',
        error: googleHotelsResult.error ?? 'google_hotels_search_failed',
        searchUrl: googleHotelsResult.searchUrl,
        discoveryMethod: 'google_hotels',
        providerRequestCount: googleHotelsResult.requestCount,
      }
    } else if (googleHotelsResult) {
      result = {
        ...result,
        searchUrl: googleHotelsResult.searchUrl,
        discoveryMethod: 'google_hotels',
        providerRequestCount: googleHotelsResult.requestCount,
      }
    }
  }

  const status =
    result.matchStatus === 'not_configured'
      ? 503
      : result.matchStatus === 'api_error'
        ? 502
        : 200
  return NextResponse.json(result, { status })
}

function cleanString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : undefined
}

function cleanBoolean(value: unknown) {
  if (value === true) return true
  if (typeof value === 'string') return value.trim().toLowerCase() === 'true'
  return false
}

function cleanInteger(value: unknown, min: number, max: number) {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : Number.NaN
  if (!Number.isInteger(number) || number < min || number > max) return undefined
  return number
}

function cleanNumber(value: unknown, min: number, max: number) {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : Number.NaN
  if (!Number.isFinite(number) || number < min || number > max) return undefined
  return number
}

function cleanDate(value: unknown) {
  if (typeof value !== 'string') return undefined
  const clean = value.trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(clean) ? clean : undefined
}
