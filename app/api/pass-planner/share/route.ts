import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const TABLE = 'pass_planner_shares'
const ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const MAX_ITEMS = 240
const MAX_NOTES = 80
const MAX_NOTE_LENGTH = 500
const PLANNER_RETENTION_DAYS = 365

type PlannerSharePayload = {
  city: string
  items: string[]
  notes?: Record<string, string>
}

function getTripSupabase() {
  const url = process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

function shortId(length = 7) {
  const values = new Uint8Array(length)
  crypto.getRandomValues(values)
  return Array.from(values, (value) => ID_ALPHABET[value % ID_ALPHABET.length]).join('')
}

async function contentHash(payload: PlannerSharePayload) {
  const noteEntries = Object.entries(payload.notes ?? {}).sort(([a], [b]) => a.localeCompare(b))
  const stablePayload = JSON.stringify({
    city: payload.city,
    items: payload.items,
    notes: Object.fromEntries(noteEntries),
  })
  const bytes = new TextEncoder().encode(stablePayload)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, '0')).join('')
}

function cleanPayload(value: unknown): PlannerSharePayload | null {
  if (!value || typeof value !== 'object') return null
  const input = value as Record<string, unknown>
  const city = typeof input.city === 'string' ? input.city.trim().slice(0, 32) : ''
  const rawItems = Array.isArray(input.items) ? input.items : []
  const items = rawItems
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, MAX_ITEMS)

  if (!city || items.length === 0) return null

  const notes: Record<string, string> = {}
  const rawNotes = input.notes && typeof input.notes === 'object' ? (input.notes as Record<string, unknown>) : {}
  Object.entries(rawNotes)
    .slice(0, MAX_NOTES)
    .forEach(([key, note]) => {
      if (typeof note !== 'string') return
      const cleanKey = key.trim()
      const cleanNote = note.trim().slice(0, MAX_NOTE_LENGTH)
      if (cleanKey && cleanNote) notes[cleanKey] = cleanNote
    })

  return {
    city,
    items,
    notes: Object.keys(notes).length > 0 ? notes : undefined,
  }
}

export async function POST(req: NextRequest) {
  const supabase = getTripSupabase()
  if (!supabase) return NextResponse.json({ error: 'supabase_env_missing' }, { status: 503 })

  const payload = cleanPayload(await req.json().catch(() => null))
  if (!payload) return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
  const hash = await contentHash(payload)
  const expiresAt = new Date(Date.now() + PLANNER_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { data: existing, error: findError } = await supabase
    .from(TABLE)
    .select('id')
    .eq('content_hash', hash)
    .maybeSingle()

  if (!findError && existing?.id) {
    await supabase.from(TABLE).update({ expires_at: expiresAt }).eq('id', existing.id)
    return NextResponse.json({ id: existing.id, reused: true })
  }

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const id = shortId()
    const { error } = await supabase.from(TABLE).insert({
      id,
      content_hash: hash,
      city: payload.city,
      items: payload.items,
      notes: payload.notes ?? {},
      expires_at: expiresAt,
    })

    if (!error) return NextResponse.json({ id })
    if (error.code === '23505') {
      const { data: duplicate } = await supabase
        .from(TABLE)
        .select('id')
        .eq('content_hash', hash)
        .maybeSingle()
      if (duplicate?.id) return NextResponse.json({ id: duplicate.id, reused: true })
      continue
    }
    return NextResponse.json({ error: 'store_failed', code: error.code }, { status: 503 })
  }

  return NextResponse.json({ error: 'id_collision' }, { status: 503 })
}

export async function GET(req: NextRequest) {
  const supabase = getTripSupabase()
  if (!supabase) return NextResponse.json({ error: 'supabase_env_missing' }, { status: 503 })

  const id = req.nextUrl.searchParams.get('id')?.trim()
  if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 })

  const { data, error } = await supabase
    .from(TABLE)
    .select('city, items, notes, expires_at')
    .eq('id', id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: 'load_failed' }, { status: 503 })
  if (!data) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: 'expired' }, { status: 410 })
  }

  return NextResponse.json({
    city: data.city,
    items: Array.isArray(data.items) ? data.items : [],
    notes: data.notes && typeof data.notes === 'object' ? data.notes : {},
  })
}
