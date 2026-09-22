const GETYOURGUIDE_PARTNER_ID = 'HDXRJVZ'
const BOOKING_CJ_CLICK_URL = 'https://www.jdoqocy.com/click-101881539-17293139'
const BOOKING_CJ_HOME_CLICK_URL = 'https://www.anrdoezrs.net/click-101881539-17293139'
const BOOKING_CJ_TRACKING_DOMAINS = new Set(['anrdoezrs.net', 'dpbolvw.net', 'jdoqocy.com', 'kqzyfj.com', 'tkqlhce.com'])
const BOOKING_STAY_QUERY_PARAMS = new Set([
  'checkin',
  'checkout',
  'checkin_year',
  'checkin_month',
  'checkin_monthday',
  'checkout_year',
  'checkout_month',
  'checkout_monthday',
  'group_adults',
  'group_children',
  'no_rooms',
  'req_adults',
  'req_children',
  'age',
  'selected_currency',
  'currency',
])

export const BOOKING_AFFILIATE_HOME_URL = `${BOOKING_CJ_HOME_CLICK_URL}?url=https%3A%2F%2Fwww.booking.com%2Findex.zh-tw.html`

function setAffiliateParam(url: URL, key: string, value: string) {
  const lowerKey = key.toLowerCase()
  Array.from(url.searchParams.keys()).forEach((paramKey) => {
    if (paramKey.toLowerCase() === lowerKey) url.searchParams.delete(paramKey)
  })
  url.searchParams.set(key, value)
}

function isAffiliateHost(hostname: string, domain: string) {
  return hostname === domain || hostname.endsWith(`.${domain}`)
}

function isBookingStayQueryParam(key: string) {
  const normalizedKey = key.toLowerCase()
  return BOOKING_STAY_QUERY_PARAMS.has(normalizedKey) || /^room\d+$/.test(normalizedKey)
}

function cleanBookingDestination(destination: URL) {
  const cleanUrl = new URL(`https://www.booking.com${destination.pathname}`)
  destination.searchParams.forEach((value, key) => {
    if (isBookingStayQueryParam(key)) cleanUrl.searchParams.append(key, value)
  })
  return cleanUrl
}

function getBookingDestination(url: URL, hostname: string) {
  if (isAffiliateHost(hostname, 'booking.com')) return url
  if (![...BOOKING_CJ_TRACKING_DOMAINS].some((domain) => isAffiliateHost(hostname, domain))) return null

  try {
    const destination = new URL(url.searchParams.get('url') ?? '')
    return isAffiliateHost(destination.hostname.toLowerCase().replace(/\.$/, ''), 'booking.com') ? destination : null
  } catch {
    return null
  }
}

function buildBookingAffiliateUrl(destination: URL) {
  const affiliateUrl = new URL(BOOKING_CJ_CLICK_URL)
  affiliateUrl.searchParams.set('url', cleanBookingDestination(destination).toString())
  return affiliateUrl.toString()
}

/**
 * Adds JieJourneys tracking to supported partner URLs. Booking.com links retain
 * stay details but discard existing affiliate and search-tracking data.
 */
export function normalizePlannerAffiliateUrl(url: URL) {
  const hostname = url.hostname.toLowerCase().replace(/\.$/, '')

  if (isAffiliateHost(hostname, 'klook.com')) {
    url.protocol = 'https:'
    setAffiliateParam(url, 'aid', '93798')
    return url.toString()
  }

  if (isAffiliateHost(hostname, 'kkday.com')) {
    url.protocol = 'https:'
    setAffiliateParam(url, 'cid', '22312')
    return url.toString()
  }

  if (isAffiliateHost(hostname, 'agoda.com')) {
    const hotelId = url.searchParams.get('hid')?.trim()
    if (hotelId) {
      const partnerUrl = new URL('https://www.agoda.com/partners/partnersearch.aspx')
      partnerUrl.searchParams.set('pcs', '1')
      partnerUrl.searchParams.set('cid', '1945734')
      partnerUrl.searchParams.set('hid', hotelId)
      return partnerUrl.toString()
    }
    url.protocol = 'https:'
    setAffiliateParam(url, 'pcs', '1')
    setAffiliateParam(url, 'cid', '1945734')
    return url.toString()
  }

  if (isAffiliateHost(hostname, 'trip.com')) {
    url.protocol = 'https:'
    url.hostname = 'tw.trip.com'
    setAffiliateParam(url, 'Allianceid', '6833709')
    setAffiliateParam(url, 'SID', '242535686')
    setAffiliateParam(url, 'trip_sub1', '')
    setAffiliateParam(url, 'trip_sub3', 'D16730765')
    return url.toString()
  }

  if (isAffiliateHost(hostname, 'getyourguide.com')) {
    url.protocol = 'https:'
    setAffiliateParam(url, 'partner_id', GETYOURGUIDE_PARTNER_ID)
    setAffiliateParam(url, 'utm_medium', 'online_publisher')
    return url.toString()
  }

  const bookingDestination = getBookingDestination(url, hostname)
  if (bookingDestination) {
    bookingDestination.protocol = 'https:'
    return buildBookingAffiliateUrl(bookingDestination)
  }

  return null
}
