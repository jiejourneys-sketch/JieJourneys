const GETYOURGUIDE_PARTNER_ID = 'HDXRJVZ'

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

/**
 * Adds JieJourneys tracking to supported partner URLs while retaining the
 * original product path, language, and non-affiliate query parameters.
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

  return null
}
