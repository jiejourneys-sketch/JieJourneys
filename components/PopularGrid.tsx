import Link from 'next/link'

type Destination = {
  label: string
  href?: string
  event?: string
  comingSoon?: boolean
}

type Country = {
  name: string
  event: string
  destinations: Destination[]
}

const countries: Country[] = [
  {
    name: '日本',
    event: 'home_destination_japan_toggle',
    destinations: [
      { label: '東京', href: '/tokyo', event: 'home_destination_japan_tokyo' },
      { label: '大阪・京都・奈良', href: '/osaka', event: 'home_destination_japan_osaka_kyoto_nara' },
      { label: '富士河口湖', href: '/fuji', event: 'home_destination_japan_fuji' },
    ],
  },
  {
    name: '韓國',
    event: 'home_destination_korea_toggle',
    destinations: [{ label: '釜山', href: '/busan', event: 'home_destination_korea_busan' }],
  },
  {
    name: '越南',
    event: 'home_destination_vietnam_toggle',
    destinations: [{ label: '北越', href: '/northvietnam', event: 'home_destination_vietnam_north' }],
  },
]

export default function PopularGrid() {
  return (
    <div className="destination-grid" aria-label="選擇旅遊目的地">
      {countries.map((country) => (
        <details key={country.name} className="destination-country">
          <summary data-event={country.event} data-item="country" data-section="popular">
            <span className="destination-country-copy">
              <strong>{country.name}</strong>
            </span>
          </summary>
          <div className="destination-city-list" aria-label={`${country.name}目的地`}>
            {country.destinations.map((destination) =>
              destination.comingSoon ? (
                <span key={destination.label} className="destination-city destination-city-coming-soon" aria-label={`${destination.label}攻略即將推出`}>
                  {destination.label}
                  <small>即將推出</small>
                </span>
              ) : (
                <Link
                  key={destination.href}
                  href={destination.href ?? '#'}
                  className="destination-city"
                  data-event={destination.event}
                  data-item={destination.label}
                  data-section="popular"
                >
                  {destination.label}
                </Link>
              ),
            )}
          </div>
        </details>
      ))}
    </div>
  )
}
