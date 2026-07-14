import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type GooglePlaceDetailsPayload = {
  status?: string
  error_message?: string
  result?: {
    place_id?: string
    name?: string
    formatted_address?: string
    geometry?: {
      location?: {
        lat?: number
        lng?: number
      }
    }
    types?: string[]
    url?: string
    website?: string
  }
}

type GooglePlaceDetailsNewPayload = {
  id?: string
  displayName?: {
    text?: string
  }
  formattedAddress?: string
  location?: {
    latitude?: number
    longitude?: number
  }
  types?: string[]
  googleMapsUri?: string
  websiteUri?: string
  error?: {
    message?: string
    status?: string
  }
}

export async function GET(request: NextRequest) {
  const placeId = cleanPlaceId(request.nextUrl.searchParams.get('placeId'))
  if (!placeId) return NextResponse.json({ error: 'invalid_place_id' }, { status: 400 })

  const apiKey = readGooglePlacesApiKey()
  if (!apiKey) return NextResponse.json({ configured: false, error: 'google_places_key_missing' }, { status: 503 })

  const language = cleanLanguage(request.nextUrl.searchParams.get('language')) || 'en'
  const mode = cleanDetailsMode(request.nextUrl.searchParams.get('mode'))
  const newApiResult = await fetchGooglePlaceDetailsNew(placeId, apiKey, language, mode)
  if (newApiResult) return NextResponse.json(newApiResult)

  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
  url.searchParams.set('place_id', placeId)
  url.searchParams.set(
    'fields',
    mode === 'classification'
      ? 'place_id,geometry,types'
      : 'place_id,name,formatted_address,geometry,types,url,website',
  )
  url.searchParams.set('language', language)
  url.searchParams.set('key', apiKey)

  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      accept: 'application/json',
    },
  }).catch(() => null)

  if (!response?.ok) {
    return NextResponse.json({ configured: true, error: 'google_places_request_failed' }, { status: 502 })
  }

  const payload = (await response.json().catch(() => null)) as GooglePlaceDetailsPayload | null
  if (!payload || payload.status !== 'OK' || !payload.result) {
    const status = payload?.status || 'UNKNOWN'
    return NextResponse.json(
      {
        configured: true,
        error: status === 'ZERO_RESULTS' ? 'not_found' : 'google_places_error',
        googleStatus: status,
        ...(payload?.error_message ? { message: payload.error_message.slice(0, 160) } : {}),
      },
      { status: status === 'ZERO_RESULTS' ? 404 : 502 },
    )
  }

  const result = payload.result
  const lat = readCoordinate(result.geometry?.location?.lat, -90, 90)
  const lng = readCoordinate(result.geometry?.location?.lng, -180, 180)
  const types = Array.isArray(result.types)
    ? result.types.map((type) => (typeof type === 'string' ? type.trim() : '')).filter(Boolean).slice(0, 20)
    : []

  return NextResponse.json({
    configured: true,
    placeId: result.place_id || placeId,
    ...(result.name?.trim() ? { name: result.name.trim().slice(0, 160) } : {}),
    ...(result.formatted_address?.trim() ? { formattedAddress: result.formatted_address.trim().slice(0, 240) } : {}),
    ...(lat != null && lng != null ? { lat, lng } : {}),
    ...(types.length > 0 ? { types } : {}),
    ...(result.url?.trim() ? { googleMapsUrl: result.url.trim().slice(0, 500) } : {}),
    ...(result.website?.trim() ? { website: result.website.trim().slice(0, 500) } : {}),
  })
}

async function fetchGooglePlaceDetailsNew(placeId: string, apiKey: string, language: string, mode: GooglePlaceDetailsMode) {
  const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`)
  url.searchParams.set('languageCode', language)

  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      accept: 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        mode === 'classification'
          ? 'id,location,types'
          : 'id,displayName,formattedAddress,location,types,googleMapsUri,websiteUri',
    },
  }).catch(() => null)

  if (!response?.ok) return null

  const payload = (await response.json().catch(() => null)) as GooglePlaceDetailsNewPayload | null
  if (!payload || payload.error) return null

  const lat = readCoordinate(payload.location?.latitude, -90, 90)
  const lng = readCoordinate(payload.location?.longitude, -180, 180)
  const types = Array.isArray(payload.types)
    ? payload.types.map((type) => (typeof type === 'string' ? type.trim() : '')).filter(Boolean).slice(0, 20)
    : []

  return {
    configured: true,
    placeId: payload.id || placeId,
    ...(payload.displayName?.text?.trim() ? { name: payload.displayName.text.trim().slice(0, 160) } : {}),
    ...(payload.formattedAddress?.trim() ? { formattedAddress: payload.formattedAddress.trim().slice(0, 240) } : {}),
    ...(lat != null && lng != null ? { lat, lng } : {}),
    ...(types.length > 0 ? { types } : {}),
    ...(payload.googleMapsUri?.trim() ? { googleMapsUrl: payload.googleMapsUri.trim().slice(0, 500) } : {}),
    ...(payload.websiteUri?.trim() ? { website: payload.websiteUri.trim().slice(0, 500) } : {}),
  }
}

function readGooglePlacesApiKey() {
  return (
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    ''
  ).trim()
}

function cleanPlaceId(value: string | null) {
  const clean = value?.trim() ?? ''
  if (clean.length < 6 || clean.length > 180) return ''
  if (!/^[A-Za-z0-9_.:-]+$/.test(clean)) return ''
  return clean
}

function cleanLanguage(value: string | null) {
  const clean = value?.trim() ?? ''
  return /^[a-z]{2}(?:-[A-Z]{2})?$/i.test(clean) ? clean.slice(0, 12) : ''
}

type GooglePlaceDetailsMode = 'classification' | 'full'

function cleanDetailsMode(value: string | null): GooglePlaceDetailsMode {
  return value?.trim().toLowerCase() === 'classification' ? 'classification' : 'full'
}

function readCoordinate(value: unknown, min: number, max: number) {
  const number = typeof value === 'number' ? value : Number.NaN
  if (!Number.isFinite(number) || number < min || number > max) return null
  return number
}
