import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const LEGACY_EDIT_TOKEN_PATTERN = /^[a-f0-9]{64}$/
const V2_URL_TOKEN_PATTERN = /^[A-Za-z0-9_-]{22}$/
const BOOK_ID_PATTERN = /^[A-Za-z0-9_-]{7,32}$/
const CUSTOM_PLACE_ID_PATTERN = /^custom:[A-Za-z0-9_-]{1,80}$/

type AffiliateProvider = 'Agoda' | 'Trip'

type AffiliateLinkMutation = {
  id?: string
  read_token?: string
  updated_at?: string
  changed?: boolean
}

function getTripSupabase() {
  const url = process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

function cleanEditToken(value: unknown) {
  const token = typeof value === 'string' ? value.trim() : ''
  return LEGACY_EDIT_TOKEN_PATTERN.test(token) || V2_URL_TOKEN_PATTERN.test(token) ? token : ''
}

function cleanProvider(value: unknown): AffiliateProvider | null {
  return value === 'Agoda' || value === 'Trip' ? value : null
}

function cleanAffiliateUrl(value: unknown, provider: AffiliateProvider | null) {
  if (typeof value !== 'string' || !provider) return ''
  const href = value.trim()
  if (!href || href.length > 500) return ''

  try {
    const url = new URL(href)
    if (url.protocol !== 'https:' || url.port) return ''
    const hostname = url.hostname.toLowerCase().replace(/\.$/, '')
    const domain = provider === 'Agoda' ? 'agoda.com' : 'trip.com'
    return hostname === domain || hostname.endsWith(`.${domain}`) ? url.toString() : ''
  } catch {
    return ''
  }
}

/**
 * Persists only one verified hotel-provider link.  This is deliberately
 * separate from planner-book autosave: merely opening a shared itinerary may
 * enrich Maps metadata locally, but must never write that snapshot back.
 */
export async function POST(req: NextRequest) {
  const supabase = getTripSupabase()
  if (!supabase) return NextResponse.json({ error: 'supabase_env_missing' }, { status: 503 })

  const input = (await req.json().catch(() => null)) as Record<string, unknown> | null
  const id = typeof input?.id === 'string' ? input.id.trim() : ''
  const editToken = cleanEditToken(input?.edit_token)
  const placeId = typeof input?.place_id === 'string' ? input.place_id.trim() : ''
  const provider = cleanProvider(input?.provider)
  const href = cleanAffiliateUrl(input?.href, provider)
  if (!BOOK_ID_PATTERN.test(id) || !editToken || !CUSTOM_PLACE_ID_PATTERN.test(placeId) || !provider || !href) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
  }

  const { data, error } = await supabase
    .rpc('planner_book_add_affiliate_link', {
      p_id: id,
      p_edit_token: editToken,
      p_place_id: placeId,
      p_provider: provider,
      p_href: href,
    })
    .maybeSingle()

  if (error) return NextResponse.json({ error: 'store_failed', code: error.code }, { status: 503 })
  const saved = data as AffiliateLinkMutation | null
  if (!saved?.id) return NextResponse.json({ error: 'edit_forbidden' }, { status: 403 })

  return NextResponse.json({
    id: saved.id,
    ...(typeof saved.read_token === 'string' ? { read_token: saved.read_token } : {}),
    ...(typeof saved.updated_at === 'string' ? { updated_at: saved.updated_at } : {}),
    changed: saved.changed === true,
  })
}
