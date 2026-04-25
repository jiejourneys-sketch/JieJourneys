export type ItemSource = 'agoda' | 'kkday' | 'klook' | 'booking' | 'trip' | 'manual'

/** Strip common UTM / referral noise from a URL before processing */
function cleanUrl(url: string): string {
  try {
    const u = new URL(url)
    const drop = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'referral']
    drop.forEach((k) => u.searchParams.delete(k))
    return u.toString()
  } catch {
    return url
  }
}

/** Detect affiliate source from URL hostname */
export function detectSource(url: string): ItemSource {
  try {
    const host = new URL(url).hostname
    if (host.includes('agoda.com'))   return 'agoda'
    if (host.includes('kkday.com'))   return 'kkday'
    if (host.includes('klook.com'))   return 'klook'
    if (host.includes('booking.com')) return 'booking'
    if (host.includes('trip.com') || host.includes('ctrip.com')) return 'trip'
  } catch { /* invalid URL */ }
  return 'manual'
}

/**
 * Convert an original product URL to an affiliate tracking URL.
 *
 * Env vars (.env.local):
 *   NEXT_PUBLIC_AGODA_AFF_CID
 *   NEXT_PUBLIC_KKDAY_AFF_CID
 *   NEXT_PUBLIC_KLOOK_AFF_AID
 *   NEXT_PUBLIC_TRIP_AFF_ALLIANCE_ID
 *   NEXT_PUBLIC_TRIP_AFF_SID
 *   NEXT_PUBLIC_TRIP_AFF_SUB3_HOTEL / _ACT / _ATTRACTION (optional per-type sub3)
 *   NEXT_PUBLIC_TRIP_AFF_SUB3 (fallback)
 */
export function toAffiliateUrl(originalUrl: string, source: ItemSource): string {
  if (!originalUrl) return originalUrl
  const base = cleanUrl(originalUrl)

  switch (source) {
    case 'agoda': {
      const cid = process.env.NEXT_PUBLIC_AGODA_AFF_CID
      if (!cid) return base
      try {
        const u = new URL(base)
        if (u.pathname.includes('/partners/partnersearch')) {
          u.searchParams.set('cid', cid)
          return u.toString()
        }
        const hid = u.searchParams.get('hotelId') || u.searchParams.get('selectedproperty') || u.searchParams.get('hid')
        if (hid) return `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=${cid}&hl=zh-tw&hid=${hid}`
        return `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=${cid}&hl=zh-tw&url=${encodeURIComponent(base)}`
      } catch { return base }
    }
    case 'kkday': {
      const cid = process.env.NEXT_PUBLIC_KKDAY_AFF_CID
      if (!cid) return base
      try {
        const u = new URL(base)
        u.searchParams.set('cid', cid)
        return u.toString()
      } catch { return base }
    }
    case 'klook': {
      const aid = process.env.NEXT_PUBLIC_KLOOK_AFF_AID
      if (!aid) return base
      try {
        const u = new URL(base)
        u.searchParams.set('aid', aid)
        return u.toString()
      } catch { return base }
    }
    case 'trip': {
      const allianceId = process.env.NEXT_PUBLIC_TRIP_AFF_ALLIANCE_ID
      const sid = process.env.NEXT_PUBLIC_TRIP_AFF_SID
      if (!allianceId || !sid) return base
      try {
        const u = new URL(base)
        const p = u.pathname
        const sub3 =
          p.includes('/hotel')        ? (process.env.NEXT_PUBLIC_TRIP_AFF_SUB3_HOTEL      ?? '') :
          p.includes('/travel-guide') ? (process.env.NEXT_PUBLIC_TRIP_AFF_SUB3_ATTRACTION ?? '') :
          p.includes('/trains')       ? (process.env.NEXT_PUBLIC_TRIP_AFF_SUB3_ACT        ?? '') :
                                        (process.env.NEXT_PUBLIC_TRIP_AFF_SUB3_ACT        ?? process.env.NEXT_PUBLIC_TRIP_AFF_SUB3 ?? '')
        u.searchParams.set('Allianceid', allianceId)
        u.searchParams.set('SID', sid)
        u.searchParams.set('trip_sub1', '')
        if (sub3) u.searchParams.set('trip_sub3', sub3)
        return u.toString()
      } catch { return base }
    }
    default:
      return base
  }
}

export function hasAffiliateId(source: ItemSource): boolean {
  switch (source) {
    case 'agoda':   return !!process.env.NEXT_PUBLIC_AGODA_AFF_CID
    case 'kkday':   return !!process.env.NEXT_PUBLIC_KKDAY_AFF_CID
    case 'klook':   return !!process.env.NEXT_PUBLIC_KLOOK_AFF_AID
    case 'trip':    return !!process.env.NEXT_PUBLIC_TRIP_AFF_ALLIANCE_ID
    default:        return false
  }
}
