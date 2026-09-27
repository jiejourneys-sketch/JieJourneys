import { NextRequest, NextResponse } from 'next/server'
import {
  buildBookingAffiliateUrl,
  getBookingAffiliatePublicConfig,
  searchBookingAffiliateHotels,
  type BookingAffiliateSearchInput,
  type BookingAffiliateSearchResponse,
} from '@/lib/bookingAffiliate'
import { searchBookingAffiliateHotelsWithGoogleHotels } from '@/lib/tripGoogleHotels'
import { findAgodaHotelIndexIdentity } from '@/lib/agodaAffiliate'
import {
  buildHotelAffiliateSearchNames,
  buildPlannerHotelAffiliateSearchNames,
  getApplicableVerifiedHotelAffiliateIdentity,
} from '@/lib/hotelAffiliateIdentity'
import { getStoredVerifiedHotelAffiliateIdentity } from '@/lib/hotelAffiliateIdentityStore'
import { cleanHotelAffiliateGooglePlaceTypes, hotelAffiliateGooglePlaceTypeSignal } from '@/lib/hotelAffiliatePlaceSignals'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(getBookingAffiliatePublicConfig())
}

export async function POST(req: NextRequest) {
  const input = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!input) return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })

  const googlePlaceId = cleanString(input.googlePlaceId ?? input.placeId, 180)
  const city = cleanString(input.city, 80)
  const countryCode = cleanString(input.countryCode, 2)
  const latitude = cleanNumber(input.latitude ?? input.lat, -90, 90)
  const longitude = cleanNumber(input.longitude ?? input.lng, -180, 180)
  const providedHotelNames = buildPlannerHotelAffiliateSearchNames({
    googlePlaceName: cleanString(input.googlePlaceName, 160) ?? cleanString(input.hotelName, 160),
    googlePlaceNameZhTw: cleanString(input.googlePlaceNameZhTw, 160),
    userName: input.name,
  })
  const providedHotelName = providedHotelNames[0]
  if (!providedHotelName) return NextResponse.json({ error: 'missing_hotel_name' }, { status: 400 })
  const googlePlaceTypes = cleanHotelAffiliateGooglePlaceTypes(input.googlePlaceTypes ?? input.placeTypes, 12)
  const placeTypeSignal = hotelAffiliateGooglePlaceTypeSignal(googlePlaceTypes)
  const explicitLodgingHint = cleanBoolean(input.lodgingHint ?? input.isLodging ?? input.hotelAffiliateEligible)
  const lodgingHint = placeTypeSignal === 'lodging' || (explicitLodgingHint && placeTypeSignal !== 'non_lodging')
  const builtInIdentity = getApplicableVerifiedHotelAffiliateIdentity(googlePlaceId, {
    latitude,
    longitude,
    countryCode,
  })
  const storedIdentity = builtInIdentity?.booking ? undefined : await getStoredVerifiedHotelAffiliateIdentity(googlePlaceId, {
    latitude,
    longitude,
    countryCode,
  })
  // Built-in Agoda/Trip identities predate Booking. A promoted Booking mapping
  // must therefore be allowed to augment (and take precedence over) them.
  const verifiedBookingIdentity = storedIdentity?.booking ?? builtInIdentity?.booking
  const verifiedIdentity = verifiedBookingIdentity
    ? { ...(builtInIdentity ?? storedIdentity), ...(storedIdentity ?? {}), booking: verifiedBookingIdentity }
    : builtInIdentity ?? storedIdentity
  const agodaIdentity = verifiedIdentity
    ? { canonicalNames: verifiedIdentity.canonicalNames }
    : await findAgodaHotelIndexIdentity({
        hotelName: providedHotelName,
        alternateHotelNames: providedHotelNames.slice(1),
        countryCode,
        latitude,
        longitude,
        lodgingHint,
      })
  const hotelNames = buildHotelAffiliateSearchNames({
    verifiedNames: agodaIdentity?.canonicalNames,
    googlePlaceName: providedHotelName,
    alternateNames: providedHotelNames.slice(1),
    maxNames: 3,
  })
  const hotelName = hotelNames[0] ?? providedHotelName
  const alternateHotelNames = hotelNames.slice(1)
  const searchInput: BookingAffiliateSearchInput = {
    hotelName,
    alternateHotelNames,
    googlePlaceId,
    city,
    countryCode,
    latitude,
    longitude,
    forceRefresh: cleanBoolean(input.forceRefresh ?? input.refresh),
    maxResult: cleanInteger(input.maxResult, 1, 10),
    checkInDate: cleanDate(input.checkInDate),
    checkOutDate: cleanDate(input.checkOutDate),
  }
  const config = getBookingAffiliatePublicConfig()
  const verifiedBooking = verifiedIdentity?.booking
  const verifiedBookingSourceUrl = verifiedBooking?.sourceUrl ?? ''
  const verifiedBookingUrl = verifiedBookingSourceUrl ? buildBookingAffiliateUrl(verifiedBookingSourceUrl) : ''
  const verifiedResult: BookingAffiliateSearchResponse | null = verifiedBooking && verifiedBookingUrl
    ? {
        configured: true,
        searchProvider: config.searchProvider,
        query: {
          hotelName,
          alternateHotelNames,
          ...(googlePlaceId ? { googlePlaceId } : {}),
          ...(city ? { city } : {}),
          ...(countryCode ? { countryCode } : {}),
          ...(latitude != null ? { latitude } : {}),
          ...(longitude != null ? { longitude } : {}),
          maxResult: searchInput.maxResult ?? 5,
        },
        matchStatus: 'matched',
        confidence: 'verified',
        bestMatch: {
          hotelId: verifiedBooking.hotelId,
          hotelName: verifiedBooking.hotelName,
          score: 1,
          bookingUrl: verifiedBookingUrl,
          source: 'verified',
          originalUrl: verifiedBookingSourceUrl,
          latitude: verifiedIdentity.latitude,
          longitude: verifiedIdentity.longitude,
          distanceKm: 0,
        },
        candidates: [],
        rawCount: 1,
        discoveryMethod: 'verified',
        providerRequestCount: 0,
      }
    : null
  const googleHotelsResult = verifiedResult
    ? null
    : await searchBookingAffiliateHotelsWithGoogleHotels(searchInput)
  let result = verifiedResult ?? googleHotelsResult ?? await searchBookingAffiliateHotels(searchInput)

  if (
    googleHotelsResult &&
    (googleHotelsResult.matchStatus === 'no_match' || googleHotelsResult.matchStatus === 'search_error')
  ) {
    const fallbackResult = await searchBookingAffiliateHotels({ ...searchInput, alternateHotelNames: [] })
    if (fallbackResult.matchStatus === 'matched' || fallbackResult.matchStatus === 'needs_review') {
      result = {
        ...fallbackResult,
        providerRequestCount: (googleHotelsResult.providerRequestCount ?? 0) + 1,
      }
    } else if (googleHotelsResult.matchStatus === 'no_match') {
      result = {
        ...googleHotelsResult,
        providerRequestCount: (googleHotelsResult.providerRequestCount ?? 0) + 1,
      }
    }
  }

  const status = result.matchStatus === 'not_configured' ? 503 : result.matchStatus === 'search_error' ? 502 : 200
  return NextResponse.json(result, { status })
}

function cleanString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : undefined
}

function cleanInteger(value: unknown, min: number, max: number) {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : Number.NaN
  return Number.isInteger(number) && number >= min && number <= max ? number : undefined
}

function cleanNumber(value: unknown, min: number, max: number) {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : Number.NaN
  return Number.isFinite(number) && number >= min && number <= max ? number : undefined
}

function cleanBoolean(value: unknown) {
  return value === true || (typeof value === 'string' && value.trim().toLowerCase() === 'true')
}

function cleanDate(value: unknown) {
  if (typeof value !== 'string') return undefined
  const date = value.trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined
}
