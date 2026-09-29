import { NextRequest, NextResponse } from 'next/server'
import {
  buildBookingAffiliateUrl,
  getBookingAffiliatePublicConfig,
  searchBookingAffiliateHotels,
  type BookingAffiliateSearchInput,
  type BookingAffiliateSearchResponse,
} from '@/lib/bookingAffiliate'
import {
  searchBookingAffiliateHotelByGoogleHotelsPropertyToken,
  searchBookingAffiliateHotelsWithGoogleHotels,
  type BookingGoogleHotelsSearchResponse,
} from '@/lib/tripGoogleHotels'
import { searchGoogleHotelsAutocompleteProperty } from '@/lib/googleHotelsAutocomplete'
import { findAgodaHotelIndexIdentity } from '@/lib/agodaAffiliate'
import {
  buildHotelAffiliateSearchNames,
  buildPlannerHotelAffiliateSearchNames,
  getApplicableVerifiedHotelAffiliateIdentity,
} from '@/lib/hotelAffiliateIdentity'
import { getStoredVerifiedHotelAffiliateIdentity } from '@/lib/hotelAffiliateIdentityStore'
import { cleanHotelAffiliateGooglePlaceTypes, hotelAffiliateGooglePlaceTypeSignal } from '@/lib/hotelAffiliatePlaceSignals'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET() {
  return NextResponse.json(getBookingAffiliatePublicConfig())
}

export async function POST(req: NextRequest) {
  const input = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!input) return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })

  const googlePlaceId = cleanString(input.googlePlaceId ?? input.placeId, 180)
  const googleMapsDataId = cleanGoogleMapsDataId(input.googleMapsDataId)
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
    googleMapsDataId,
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
  let result: BookingAffiliateSearchResponse | BookingGoogleHotelsSearchResponse
  let providerRequestCount = googleHotelsResult?.providerRequestCount ?? 0

  if (verifiedResult) {
    result = verifiedResult
  } else if (!googleHotelsResult) {
    result = await searchBookingAffiliateHotels(searchInput)
  } else if (googleHotelsResult.matchStatus === 'matched') {
    result = googleHotelsResult
  } else {
    // All locale aliases share one organic request. A review candidate is not
    // accepted automatically; it remains available only as the best fallback.
    const organicResult = await searchBookingAffiliateHotels(searchInput)
    providerRequestCount += organicResult.providerRequestCount ?? 0
    result = preferBookingResult(googleHotelsResult, organicResult)

    if (result.matchStatus !== 'matched' && googleHotelsResult.googleHotelsPropertyToken) {
      // Google Hotels already identified the property but did not expose a
      // Booking offer for the first stay date. Spend one final request on a
      // different date instead of repeating the same name query.
      const alternateDateResult = await searchBookingAffiliateHotelByGoogleHotelsPropertyToken(searchInput, {
        propertyToken: googleHotelsResult.googleHotelsPropertyToken,
        propertyName: googleHotelsResult.googleHotelsPropertyName,
        dateRangeIndex: 1,
      })
      if (alternateDateResult) {
        providerRequestCount += alternateDateResult.providerRequestCount ?? 0
        result = preferBookingResult(result, alternateDateResult)
      }
    } else if (result.matchStatus !== 'matched' && googleMapsDataId) {
      // Autocomplete is useful only with a Google Maps CID. The exact decimal
      // CID comparison is the identity proof; names never make this branch
      // eligible on their own.
      const autocompleteResult = await searchGoogleHotelsAutocompleteProperty({
        hotelName,
        alternateHotelNames,
        city,
        countryCode,
        googleMapsDataId,
      })
      providerRequestCount += autocompleteResult?.requestCount ?? 0
      if (autocompleteResult?.matchStatus === 'matched' && autocompleteResult.bestMatch) {
        const exactPropertyResult = await searchBookingAffiliateHotelByGoogleHotelsPropertyToken(searchInput, {
          propertyToken: autocompleteResult.bestMatch.propertyToken,
          propertyName: autocompleteResult.bestMatch.canonicalName,
          identityVerified: true,
        })
        if (exactPropertyResult) {
          providerRequestCount += exactPropertyResult.providerRequestCount ?? 0
          result = preferBookingResult(result, exactPropertyResult)
        }
      }
    }

    result = { ...result, providerRequestCount }
  }

  const status = result.matchStatus === 'not_configured' ? 503 : result.matchStatus === 'search_error' ? 502 : 200
  return NextResponse.json(toPublicBookingResult(result), { status })
}

function preferBookingResult(
  current: BookingAffiliateSearchResponse | BookingGoogleHotelsSearchResponse,
  candidate: BookingAffiliateSearchResponse | BookingGoogleHotelsSearchResponse,
) {
  return bookingResultRank(candidate.matchStatus) > bookingResultRank(current.matchStatus) ? candidate : current
}

function bookingResultRank(status: BookingAffiliateSearchResponse['matchStatus']) {
  if (status === 'matched') return 4
  if (status === 'needs_review') return 3
  if (status === 'no_match') return 2
  if (status === 'search_error') return 1
  return 0
}

function toPublicBookingResult(result: BookingAffiliateSearchResponse | BookingGoogleHotelsSearchResponse) {
  const {
    googleHotelsPropertyToken: _propertyToken,
    googleHotelsPropertyName: _propertyName,
    googleHotelsFailureReason: _failureReason,
    ...publicResult
  } = result as BookingGoogleHotelsSearchResponse
  return publicResult
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

function cleanGoogleMapsDataId(value: unknown) {
  if (typeof value !== 'string') return undefined
  const dataId = value.trim().toLowerCase()
  return /^0x[0-9a-f]{6,32}:0x[0-9a-f]{1,16}$/.test(dataId) ? dataId : undefined
}
