import { NextRequest, NextResponse } from 'next/server'
import { POST as resolveAgoda } from '@/app/api/pass-planner/hotel-affiliate/agoda/route'
import { POST as resolveTrip } from '@/app/api/pass-planner/hotel-affiliate/trip/route'
import { POST as resolveBooking } from '@/app/api/pass-planner/hotel-affiliate/booking/route'
import { searchGoogleHotelsAutocompleteProperty } from '@/lib/googleHotelsAutocomplete'
import { buildPlannerHotelAffiliateSearchNames } from '@/lib/hotelAffiliateIdentity'
import { searchExactGoogleHotelsAffiliateSources } from '@/lib/tripGoogleHotels'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function providerDiagnostic(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { matchStatus: 'missing' }
  const result = value as Record<string, unknown>
  const text = (key: string, fallback = '') =>
    typeof result[key] === 'string' ? String(result[key]).slice(0, 80) : fallback
  const count = (key: string) =>
    typeof result[key] === 'number' && Number.isFinite(result[key]) ? result[key] : 0
  return {
    matchStatus: text('matchStatus', result.error ? 'error' : 'missing'),
    discoveryMethod: text('discoveryMethod'),
    providerRequestCount: count('providerRequestCount'),
    rawCount: count('rawCount'),
    error: text('error'),
  }
}

type ProviderResult = Record<string, unknown> | null | undefined

function providerNeedsExactIdentity(value: ProviderResult) {
  const status = typeof value?.matchStatus === 'string' ? value.matchStatus : ''
  return status !== 'matched' && status !== 'not_configured'
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function cleanNumber(value: unknown, min: number, max: number) {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : Number.NaN
  return Number.isFinite(number) && number >= min && number <= max ? number : undefined
}

function cleanInteger(value: unknown, min: number, max: number) {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : Number.NaN
  return Number.isInteger(number) && number >= min && number <= max ? number : undefined
}

function closeAgodaIndexCandidateName(value: ProviderResult) {
  if (!Array.isArray(value?.candidates)) return ''
  for (const item of value.candidates.slice(0, 3)) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue
    const candidate = item as Record<string, unknown>
    const distanceKm = cleanNumber(candidate.distanceKm, 0, 100)
    const hotelName = cleanText(candidate.hotelName, 160)
    // A close catalogue label is useful only as an autocomplete query. It is
    // never identity evidence: the exact Maps CID comparison below remains
    // mandatory before any provider source is accepted.
    if (hotelName && distanceKm != null && distanceKm <= 0.03) return hotelName
  }
  return ''
}

function addProviderRequestCount(value: ProviderResult, additionalCount: number) {
  if (!value || additionalCount <= 0) return value
  const currentCount = cleanNumber(value.providerRequestCount, 0, 1_000) ?? 0
  return { ...value, providerRequestCount: currentCount + additionalCount }
}

function applyExactIdentityMatch(
  value: ProviderResult,
  candidate: unknown,
  additionalRequestCount: number,
) {
  if (!value || !candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return value
  const currentCount = cleanNumber(value.providerRequestCount, 0, 1_000) ?? 0
  return {
    ...value,
    configured: true,
    searchProvider: 'serpapi',
    matchStatus: 'matched',
    confidence: 'high',
    bestMatch: candidate,
    candidates: [candidate],
    rawCount: 1,
    discoveryMethod: 'google_hotels',
    identityMethod: 'google_maps_cid',
    providerRequestCount: currentCount + additionalRequestCount,
    error: undefined,
  }
}

/**
 * Resolve hotel providers inside one server request. Besides avoiding a
 * browser race, this lets Agoda, Trip and Booking share the same metered Google
 * Hotels payload and its strict property verification.
 */
export async function POST(req: NextRequest) {
  const input = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!input) return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })

  const requestedProviders = new Set(
    Array.isArray(input.providers)
      ? input.providers.filter((provider) => provider === 'Agoda' || provider === 'Trip' || provider === 'Booking')
      : ['Trip', 'Agoda'],
  )
  if (requestedProviders.size === 0) {
    return NextResponse.json({ error: 'missing_provider' }, { status: 400 })
  }

  const body = JSON.stringify(input)
  const makeRequest = (provider: 'agoda' | 'trip' | 'booking') => new NextRequest(
    new URL(`/api/pass-planner/hotel-affiliate/${provider}`, req.url),
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    },
  )

  const [tripResponse, agodaResponse, bookingResponse] = await Promise.all([
    requestedProviders.has('Trip') ? resolveTrip(makeRequest('trip')) : null,
    requestedProviders.has('Agoda') ? resolveAgoda(makeRequest('agoda')) : null,
    requestedProviders.has('Booking') ? resolveBooking(makeRequest('booking')) : null,
  ])
  let [trip, agoda, booking] = await Promise.all([
    tripResponse?.json().catch(() => ({ error: 'trip_invalid_response' })),
    agodaResponse?.json().catch(() => ({ error: 'agoda_invalid_response' })),
    bookingResponse?.json().catch(() => ({ error: 'booking_invalid_response' })),
  ])

  const unresolvedProviders = [
    ...(requestedProviders.has('Trip') && providerNeedsExactIdentity(trip) ? ['Trip' as const] : []),
    ...(requestedProviders.has('Agoda') && providerNeedsExactIdentity(agoda) ? ['Agoda' as const] : []),
    ...(requestedProviders.has('Booking') && providerNeedsExactIdentity(booking) ? ['Booking' as const] : []),
  ]
  const googleMapsDataId = cleanText(input.googleMapsDataId, 80).toLowerCase()
  let exactCidRequestCount = 0
  let exactCidStatus = ''

  if (
    unresolvedProviders.length > 0 &&
    /^0x[0-9a-f]{6,32}:0x[0-9a-f]{1,16}$/.test(googleMapsDataId)
  ) {
    const hotelNames = buildPlannerHotelAffiliateSearchNames({
      googlePlaceName: cleanText(input.googlePlaceName, 160) || cleanText(input.hotelName, 160),
      googlePlaceNameZhTw: cleanText(input.googlePlaceNameZhTw, 160),
      userName: input.name,
    })
    const closeAgodaName = closeAgodaIndexCandidateName(agoda)
    const exactSearchNames = [closeAgodaName, ...hotelNames]
      .filter(Boolean)
      .filter((name, index, names) => names.findIndex((item) => item.localeCompare(name, undefined, { sensitivity: 'base' }) === 0) === index)
      .slice(0, 2)
    const city = cleanText(input.city, 80)
    const countryCode = cleanText(input.countryCode, 2).toUpperCase()
    let autocompleteMatch: Awaited<ReturnType<typeof searchGoogleHotelsAutocompleteProperty>> = null

    for (const [index, searchName] of exactSearchNames.entries()) {
      const autocomplete = await searchGoogleHotelsAutocompleteProperty({
        hotelName: searchName,
        alternateHotelNames: exactSearchNames.filter((_, nameIndex) => nameIndex !== index),
        city,
        countryCode,
        googleMapsDataId,
      })
      exactCidRequestCount += autocomplete?.requestCount ?? 0
      exactCidStatus = autocomplete?.matchStatus ?? ''
      if (autocomplete?.matchStatus === 'matched' && autocomplete.bestMatch) {
        autocompleteMatch = autocomplete
        break
      }
      if (autocomplete?.matchStatus === 'search_error') break
    }

    if (autocompleteMatch?.bestMatch) {
      const exactSources = await searchExactGoogleHotelsAffiliateSources({
        propertyToken: autocompleteMatch.bestMatch.propertyToken,
        propertyName: autocompleteMatch.bestMatch.canonicalName,
        hotelName: hotelNames[0] || autocompleteMatch.bestMatch.canonicalName,
        alternateHotelNames: hotelNames.slice(1),
        googlePlaceId: cleanText(input.googlePlaceId ?? input.placeId, 180),
        city,
        countryCode,
        latitude: cleanNumber(input.latitude ?? input.lat, -90, 90),
        longitude: cleanNumber(input.longitude ?? input.lng, -180, 180),
        checkInDate: cleanText(input.checkInDate, 10),
        checkOutDate: cleanText(input.checkOutDate, 10),
        tripSub1: cleanText(input.tripSub1, 120),
        tripSub3: cleanText(input.tripSub3, 80),
        adults: cleanInteger(input.adults, 1, 16),
        children: cleanInteger(input.children, 0, 8),
        rooms: cleanInteger(input.rooms, 1, 8),
        currency: cleanText(input.currency, 10),
        language: cleanText(input.language, 12),
      })
      exactCidRequestCount += exactSources?.requestCount ?? 0
      exactCidStatus = exactSources?.matchStatus ?? exactCidStatus

      let unassignedRequestCount = exactCidRequestCount
      if (unresolvedProviders.includes('Trip') && exactSources?.trip) {
        trip = applyExactIdentityMatch(trip, exactSources.trip, unassignedRequestCount)
        unassignedRequestCount = 0
      }
      if (unresolvedProviders.includes('Agoda') && exactSources?.agoda) {
        agoda = applyExactIdentityMatch(agoda, exactSources.agoda, unassignedRequestCount)
        unassignedRequestCount = 0
      }
      if (unresolvedProviders.includes('Booking') && exactSources?.booking) {
        booking = applyExactIdentityMatch(booking, exactSources.booking, unassignedRequestCount)
        unassignedRequestCount = 0
      }
      if (unassignedRequestCount > 0) {
        const owner = unresolvedProviders[0]
        if (owner === 'Trip') trip = addProviderRequestCount(trip, unassignedRequestCount)
        else if (owner === 'Agoda') agoda = addProviderRequestCount(agoda, unassignedRequestCount)
        else if (owner === 'Booking') booking = addProviderRequestCount(booking, unassignedRequestCount)
      }
    } else if (exactCidRequestCount > 0) {
      const owner = unresolvedProviders[0]
      if (owner === 'Trip') trip = addProviderRequestCount(trip, exactCidRequestCount)
      else if (owner === 'Agoda') agoda = addProviderRequestCount(agoda, exactCidRequestCount)
      else if (owner === 'Booking') booking = addProviderRequestCount(booking, exactCidRequestCount)
    }
  }

  if (process.env.NODE_ENV !== 'test') {
    const googlePlaceId = typeof input.googlePlaceId === 'string' ? input.googlePlaceId.trim().slice(0, 180) : ''
    console.info('[planner-hotel-affiliate]', JSON.stringify({
      googlePlaceId,
      providers: [...requestedProviders],
      forceRefresh: input.forceRefresh === true,
      exactCidStatus,
      exactCidRequestCount,
      results: {
        ...(trip ? { Trip: providerDiagnostic(trip) } : {}),
        ...(agoda ? { Agoda: providerDiagnostic(agoda) } : {}),
        ...(booking ? { Booking: providerDiagnostic(booking) } : {}),
      },
    }))
  }

  return NextResponse.json({
    ...(trip ? { trip } : {}),
    ...(agoda ? { agoda } : {}),
    ...(booking ? { booking } : {}),
    ...(exactCidStatus ? { exactCidStatus, exactCidRequestCount } : {}),
  })
}
