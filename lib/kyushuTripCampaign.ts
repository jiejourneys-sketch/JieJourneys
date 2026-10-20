import campaign from '@/data/kyushu-trip-campaign.json'

const EXPECTED_HOST = 'jp.trip.com'
const EXPECTED_PATH = '/sale/w/3dcskhfy90ul2ffm/kyushu-fukkou.html'

export function isVerifiedKyushuTripAffiliateUrl(value: string) {
  try {
    const url = new URL(value)
    return (
      url.protocol === 'https:'
      && url.hostname === EXPECTED_HOST
      && url.pathname === EXPECTED_PATH
      && url.searchParams.get('Allianceid') === campaign.allianceId
      && url.searchParams.get('SID') === campaign.sid
      && url.searchParams.get('trip_sub3') === campaign.tripSub3
    )
  } catch {
    return false
  }
}

if (!isVerifiedKyushuTripAffiliateUrl(campaign.url)) {
  throw new Error('Kyushu Trip.com campaign affiliate URL is invalid or missing the verified tracking IDs.')
}

export const KYUSHU_TRIP_CAMPAIGN_ID = campaign.campaignId
export const KYUSHU_TRIP_CAMPAIGN_URL = campaign.url
export const KYUSHU_TRIP_ALLIANCE_ID = campaign.allianceId
export const KYUSHU_TRIP_SID = campaign.sid
export const KYUSHU_TRIP_SUB3 = campaign.tripSub3

export function buildKyushuTripHotelAffiliateUrl(hotelId: string | number) {
  const cleanHotelId = String(hotelId).trim()
  if (!/^\d{3,}$/.test(cleanHotelId)) return ''

  const url = new URL('https://tw.trip.com/hotels/detail/')
  url.searchParams.set('hotelId', cleanHotelId)
  url.searchParams.set('Allianceid', campaign.allianceId)
  url.searchParams.set('SID', campaign.sid)
  url.searchParams.set('trip_sub1', '')
  url.searchParams.set('trip_sub3', campaign.tripSub3)
  return url.toString()
}
