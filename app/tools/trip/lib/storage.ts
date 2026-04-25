import { createClient } from '@supabase/supabase-js'
import type { PlanItem, Plan, ItemType } from './types'

const URL_ = process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL ?? ''
const KEY_ = process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY ?? ''

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _sb: any = null
function sb() {
  if (!URL_ || !KEY_ || KEY_.includes('貼在這裡')) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (_sb ??= createClient(URL_, KEY_)) as any
}

const EMOJI: Record<ItemType, string> = {
  hotel: '🏨', attraction: '📍', food: '🍜', transport: '🚉', other: '📌',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToItem(r: any): PlanItem {
  const type = (r.type as ItemType) ?? 'attraction'
  return {
    id: r.id, day: r.day, name: r.name, type,
    address: r.address ?? undefined,
    time: r.start_time ?? '09:00',
    duration: r.duration ?? 90,
    notes: r.notes ?? undefined,
    emoji: EMOJI[type],
    lat: r.lat ?? undefined,
    lng: r.lng ?? undefined,
    booking_url: r.booking_url ?? undefined,
    affiliate_url: r.affiliate_url ?? undefined,
    thumbnail: r.thumbnail ?? undefined,
    price: r.price ?? undefined,
  }
}

// ── localStorage recent plan IDs ──────────────────────────────────────────────

const LS_KEY = 'plan:recent'
const MAX_RECENT = 20

export function getRecentPlanIds(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') } catch { return [] }
}

export function addRecentPlanId(id: string) {
  if (typeof window === 'undefined') return
  const ids = getRecentPlanIds().filter((i) => i !== id)
  ids.unshift(id)
  localStorage.setItem(LS_KEY, JSON.stringify(ids.slice(0, MAX_RECENT)))
}

export function removeRecentPlanId(id: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LS_KEY, JSON.stringify(getRecentPlanIds().filter((i) => i !== id)))
}

// ── Fetch helpers ─────────────────────────────────────────────────────────────

export async function fetchPlan(id: string): Promise<{ plan: Plan | null; items: PlanItem[] }> {
  const client = sb()
  if (!client) return { plan: null, items: [] }
  const { data: plan } = await client.from('plans').select('*').eq('id', id).single()
  if (!plan) return { plan: null, items: [] }
  const { data: rows } = await client
    .from('plan_items').select('*').eq('plan_id', id).order('day').order('order_index')
  return {
    plan: { id: plan.id, title: plan.title, destination: plan.destination, days: plan.days, items: [] },
    items: (rows ?? []).map(rowToItem),
  }
}

export async function fetchRecentPlans(ids: string[]): Promise<Plan[]> {
  if (!ids.length) return []
  const client = sb()
  if (!client) return []
  const { data } = await client.from('plans').select('*').in('id', ids)
  if (!data) return []
  return ids
    .map((id) => data.find((r: { id: string }) => r.id === id))
    .filter(Boolean)
    .map((r: { id: string; title: string; destination?: string; days: number }) => ({
      id: r.id, title: r.title, destination: r.destination, days: r.days, items: [],
    }))
}

export async function createPlan(title?: string): Promise<string | null> {
  const client = sb()
  if (!client) return null
  const { data, error } = await client
    .from('plans').insert({ title: title ?? '未命名行程', days: 1 }).select('id').single()
  if (error) { console.error('[plan] create:', error); return null }
  return data.id as string
}

export async function deletePlan(id: string) {
  sb()?.from('plans').delete().eq('id', id)
}

// ── Template / duplicate helpers ──────────────────────────────────────────────

/**
 * Smart copy title:
 *   "東京行程"        → "東京行程（副本）"
 *   "東京行程（副本）" → "東京行程（副本 2）"
 *   "東京行程（副本 2）" → "東京行程（副本 3）"
 */
export function copyTitle(title: string): string {
  const m = title.match(/^(.*?)（副本(?: (\d+))?）$/)
  if (!m) return `${title}（副本）`
  const base = m[1]
  const n = m[2] ? parseInt(m[2]) + 1 : 2
  return `${base}（副本 ${n}）`
}

/**
 * Core duplicate logic — reusable for list page, edit page, share page, and
 * future template system. Returns the new planId or null on failure.
 */
export async function duplicatePlan(planId: string): Promise<string | null> {
  const client = sb()
  if (!client) return null

  // 1. Read original plan
  const { data: orig } = await client.from('plans').select('*').eq('id', planId).single()
  if (!orig) return null

  // 2. Create new plan
  const { data: newPlan, error: planErr } = await client
    .from('plans')
    .insert({ title: copyTitle(orig.title), destination: orig.destination ?? null, days: orig.days })
    .select('id')
    .single()
  if (planErr || !newPlan) { console.error('[plan] duplicate:', planErr); return null }
  const newPlanId = newPlan.id as string

  // 3. Read original items (ordered)
  const { data: rows } = await client
    .from('plan_items').select('*')
    .eq('plan_id', planId).order('day').order('order_index')

  // 4. Batch-insert copies (strip id / plan_id / created_at so DB generates fresh ones)
  if (rows?.length) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newRows = rows.map(({ id: _id, plan_id: _pid, created_at: _ca, ...rest }: any) => ({
      ...rest,
      plan_id: newPlanId,
    }))
    const { error: itemsErr } = await client.from('plan_items').insert(newRows)
    if (itemsErr) console.error('[plan] duplicate items:', itemsErr)
  }

  return newPlanId
}

export async function updatePlanTitle(id: string, title: string) {
  sb()?.from('plans').update({ title, updated_at: new Date().toISOString() }).eq('id', id)
}

export async function updatePlanDays(id: string, days: number) {
  sb()?.from('plans').update({ days, updated_at: new Date().toISOString() }).eq('id', id)
}

export async function addPlanItem(params: {
  plan_id: string; day: number; name: string; type: ItemType
  address?: string; lat?: number; lng?: number; notes?: string
  duration?: number; order_index: number; start_time: string
  booking_url?: string; affiliate_url?: string
  thumbnail?: string; price?: string
}): Promise<PlanItem | null> {
  const client = sb()
  if (!client) return null
  const { data, error } = await client
    .from('plan_items')
    .insert({
      plan_id: params.plan_id, day: params.day, name: params.name, type: params.type,
      address: params.address ?? null, lat: params.lat ?? null, lng: params.lng ?? null,
      notes: params.notes ?? null, duration: params.duration ?? 90,
      order_index: params.order_index, start_time: params.start_time,
      booking_url: params.booking_url ?? null, affiliate_url: params.affiliate_url ?? null,
      thumbnail: params.thumbnail ?? null, price: params.price ?? null,
    })
    .select().single()
  if (error) { console.error('[plan] addItem:', error); return null }
  return rowToItem(data)
}

export async function updatePlanItem(id: string, patch: {
  duration?: number; notes?: string
  booking_url?: string | null; affiliate_url?: string | null
  thumbnail?: string | null; price?: string | null
}) {
  sb()?.from('plan_items').update({
    ...(patch.duration !== undefined && { duration: patch.duration }),
    ...(patch.notes !== undefined && { notes: patch.notes }),
    ...(patch.booking_url !== undefined && { booking_url: patch.booking_url }),
    ...(patch.affiliate_url !== undefined && { affiliate_url: patch.affiliate_url }),
    ...(patch.thumbnail !== undefined && { thumbnail: patch.thumbnail }),
    ...(patch.price !== undefined && { price: patch.price }),
  }).eq('id', id)
}

export async function deletePlanItem(id: string) {
  sb()?.from('plan_items').delete().eq('id', id)
}

export async function saveItemsOrder(items: PlanItem[]) {
  const client = sb()
  if (!client) return
  await Promise.all(
    items.map((item, idx) =>
      client.from('plan_items')
        .update({ order_index: idx, start_time: item.time, day: item.day })
        .eq('id', item.id)
    )
  )
}
