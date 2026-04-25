export type ItemType = 'hotel' | 'attraction' | 'food' | 'transport' | 'other'

export interface PlanItem {
  id: string
  day: number
  name: string
  type: ItemType
  address?: string
  time: string
  duration: number  // minutes at this stop
  notes?: string
  emoji: string
  lat?: number
  lng?: number
  booking_url?: string
  affiliate_url?: string
  thumbnail?: string
  price?: string
}

export interface Plan {
  id: string
  title: string
  destination?: string
  days: number
  items: PlanItem[]
}

export const TYPE_CFG: Record<ItemType, { label: string; bg: string; color: string }> = {
  hotel:      { label: '住宿',  bg: '#eff6ff', color: '#1d4ed8' },
  attraction: { label: '景點',  bg: '#fffbeb', color: '#b45309' },
  food:       { label: '美食',  bg: '#fff1f2', color: '#be123c' },
  transport:  { label: '交通',  bg: '#f1f5f9', color: '#475569' },
  other:      { label: '其他',  bg: '#f8fafc', color: '#64748b' },
}

export const BRAND = '#1f7a8c'
export const BRAND_LIGHT = '#e8f4f6'
