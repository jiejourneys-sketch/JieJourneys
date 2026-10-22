'use client'

import { useState } from 'react'
import hotelDirectory from '@/data/kyushu-trip-hotels.json'
import {
  buildKyushuTripHotelAffiliateUrl,
  KYUSHU_TRIP_CAMPAIGN_URL,
} from '@/lib/kyushuTripCampaign'
import styles from './KyushuTripBookingAssistant.module.css'

type ChannelState = 'open' | 'scheduled' | 'paused' | 'ended'
type DirectoryFilter = 'all' | 'nagasaki' | 'kumamoto' | 'kagoshima' | 'fukuoka'

type PrefectureOption = {
  name: string
  discountRate: 50 | 60
  stayStart: string
  stayEnd: string
  saleStartsAt: string
  saleEndsAt: string
  staticState: 'open' | 'scheduled' | 'paused'
  exclusion?: string
}

const prefectures: PrefectureOption[] = [
  {
    name: '福岡',
    discountRate: 50,
    stayStart: '10/19',
    stayEnd: '12/15',
    saleStartsAt: '2026-10-19T04:00:00Z',
    saleEndsAt: '2026-12-15T14:59:00Z',
    staticState: 'paused',
  },
  {
    name: '長崎',
    discountRate: 50,
    stayStart: '10/19',
    stayEnd: '12/25',
    saleStartsAt: '2026-10-19T04:00:00Z',
    saleEndsAt: '2026-12-25T14:59:00Z',
    staticState: 'open',
  },
  {
    name: '熊本',
    discountRate: 60,
    stayStart: '10/22',
    stayEnd: '12/25',
    saleStartsAt: '2026-10-22T04:00:00Z',
    saleEndsAt: '2026-12-25T14:59:00Z',
    staticState: 'open',
  },
  {
    name: '鹿兒島',
    discountRate: 60,
    stayStart: '10/22',
    stayEnd: '2027/1/31',
    saleStartsAt: '2026-10-22T04:00:00Z',
    saleEndsAt: '2027-01-31T14:59:00Z',
    staticState: 'open',
    exclusion: '12/26～2027/1/3 不適用',
  },
]

const publishedHotelCount = hotelDirectory.prefectures.reduce(
  (total, prefecture) => total + prefecture.hotels.length,
  0,
)

const directoryTabs: Array<{ id: DirectoryFilter; label: string }> = [
  { id: 'all', label: `全部 ${publishedHotelCount}` },
  {
    id: 'nagasaki',
    label: `長崎 ${hotelDirectory.prefectures.find((item) => item.id === 'nagasaki')?.hotels.length ?? 0}`,
  },
  {
    id: 'kumamoto',
    label: `熊本 ${hotelDirectory.prefectures.find((item) => item.id === 'kumamoto')?.hotels.length ?? 0}`,
  },
  {
    id: 'kagoshima',
    label: `鹿兒島 ${hotelDirectory.prefectures.find((item) => item.id === 'kagoshima')?.hotels.length ?? 0}`,
  },
  {
    id: 'fukuoka',
    label: `福岡 ${hotelDirectory.prefectures.find((item) => item.id === 'fukuoka')?.hotels.length ?? 0}`,
  },
]

function normalizedSearchText(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase('zh-Hant').replace(/\s+/g, '')
}

function channelState(option: PrefectureOption, now: number): ChannelState {
  if (option.staticState === 'paused') return 'paused'
  if (now < Date.parse(option.saleStartsAt)) return 'scheduled'
  if (now > Date.parse(option.saleEndsAt)) return 'ended'
  return 'open'
}

function stateLabel(state: ChannelState) {
  if (state === 'paused') return '補助暫停'
  if (state === 'scheduled') return '即將開賣'
  if (state === 'ended') return '販售期已結束'
  return '目前可查詢'
}

export default function KyushuTripBookingAssistant() {
  const [now] = useState(() => Date.now())
  const [activeDirectory, setActiveDirectory] = useState<DirectoryFilter>('all')
  const [hotelSearch, setHotelSearch] = useState('')
  const searchTerm = normalizedSearchText(hotelSearch.trim())
  const filteredPrefectures = activeDirectory === 'all'
    ? hotelDirectory.prefectures
    : hotelDirectory.prefectures.filter((item) => item.id === activeDirectory)
  const visiblePrefectures = filteredPrefectures
    .map((prefecture) => ({
      ...prefecture,
      hotels: prefecture.hotels.filter((hotel) => normalizedSearchText(
        `${prefecture.name}${hotel.city}${hotel.nameZh}${hotel.nameJa}`,
      ).includes(searchTerm)),
    }))
    .filter((prefecture) => prefecture.hotels.length > 0)
  const visibleHotelCount = visiblePrefectures.reduce(
    (total, prefecture) => total + prefecture.hotels.length,
    0,
  )

  return (
    <section
      className={`seo-content ${styles.assistant}`}
      id="booking-assistant"
      aria-labelledby="kyushu-booking-assistant-title"
      style={{ scrollMarginTop: '76px' }}
    >
      <div className={styles.headingRow}>
        <div>
          <p className={styles.eyebrow}>TRIP.COM 補助中文快查</p>
          <h2 className={styles.heading} id="kyushu-booking-assistant-title">
            先找參與住宿，再到 Trip 選日期
          </h2>
          <p className={styles.lead}>
            直接查中文名單，不必在本站重複填日期；選好住宿後，再到 Trip 查一晚是否有補助房型。
          </p>
        </div>
        <a
          className={styles.campaignLink}
          href={KYUSHU_TRIP_CAMPAIGN_URL}
          target="_blank"
          rel="sponsored noopener noreferrer"
          data-event="kyushusubsidy_trip_campaign_outbound"
          data-platform="Trip.com"
          data-section="booking_assistant"
          data-promotion-id="kyushu_trip_subsidy"
          data-promotion-name="九州旅遊補助 Trip.com"
          data-creative-slot="assistant_header"
        >
          Trip 活動原頁 <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className={styles.summaryStrip} aria-label="Trip 九州補助三項重點">
        <span><b>50%／60%</b> 最高折扣</span>
        <span><b>¥20,000</b> 每人上限</span>
        <span><b>限 1 晚</b> 才能套用</span>
      </div>

      <div className={styles.prefectureGrid}>
        {prefectures.map((option) => {
          const state = channelState(option, now)
          return (
            <article className={styles.prefectureCard} data-state={state} key={option.name}>
              <div className={styles.cardHeading}>
                <h3>{option.name}</h3>
                <span data-state={state}>{stateLabel(state)}</span>
              </div>
              <p className={styles.prefectureMeta}>
                <strong>{option.discountRate}%</strong>
                <span>{option.stayStart}～{option.stayEnd}</span>
              </p>
              {option.exclusion && <small className={styles.exclusion}>排除 {option.exclusion}</small>}
            </article>
          )
        })}
      </div>

      <section className={styles.hotelDirectory} id="participant-hotels" aria-labelledby="participant-hotels-title">
        <div className={styles.directoryHeading}>
          <div>
            <p className={styles.panelEyebrow}>目前公開 {publishedHotelCount} 間</p>
            <h3 id="participant-hotels-title">快速找參與住宿</h3>
          </div>
          <p className={styles.directoryRule}>點住宿 → Trip 選 1 晚 → 確認顯示「九州ふっこう応援割」</p>
        </div>

        <div className={styles.directoryToolbar}>
          <div className={styles.directoryTabs} role="group" aria-label="依縣市篩選參與住宿">
            {directoryTabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                className={styles.directoryTab}
                aria-pressed={activeDirectory === tab.id}
                onClick={() => setActiveDirectory(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <label className={styles.searchBox}>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={hotelSearch}
              onChange={(event) => setHotelSearch(event.target.value)}
              placeholder="搜尋飯店或城市"
              aria-label="搜尋參與住宿或城市"
            />
          </label>
        </div>

        <p className={styles.pendingStrip}>熊本、鹿兒島已於 10/22 開賣；顯示的住宿會隨入住日期與剩餘補助房型變動。</p>

        {visibleHotelCount === 0 ? (
          <div className={styles.emptyState} role="status">
            <span>找不到符合「{hotelSearch}」的住宿</span>
            <button type="button" onClick={() => setHotelSearch('')}>清除搜尋</button>
          </div>
        ) : (
          <div className={styles.hotelGroups}>
            {visiblePrefectures.map((prefecture) => (
              <section className={styles.hotelGroup} key={prefecture.id} aria-labelledby={`${prefecture.id}-hotels-title`}>
                <div className={styles.hotelGroupHeading}>
                  <h4 id={`${prefecture.id}-hotels-title`}>{prefecture.name} <small>{prefecture.hotels.length} 間</small></h4>
                  <span data-state={prefecture.status}>{prefecture.statusLabel}</span>
                </div>
                {prefecture.id === 'fukuoka' && (
                  <p className={styles.groupNotice}>
                    官方公告補助暫停；大折扣可能是 Trip 特別優惠，看到「九州ふっこう応援割」才算補助。
                  </p>
                )}

                <div className={styles.hotelGrid}>
                  {prefecture.hotels.map((hotel) => (
                    <a
                      className={styles.hotelCard}
                      key={hotel.hotelId}
                      href={buildKyushuTripHotelAffiliateUrl(hotel.hotelId)}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      aria-label={`到 Trip 查看 ${hotel.nameZh} 的日期與補助房型`}
                      data-event="kyushusubsidy_trip_hotel_outbound"
                      data-platform="Trip.com"
                      data-section="participant_hotels"
                      data-hotel-id={hotel.hotelId}
                      data-hotel-name={hotel.nameJa}
                      data-prefecture={prefecture.name}
                      data-promotion-id="kyushu_trip_subsidy"
                      data-promotion-name="九州旅遊補助 Trip.com"
                      data-creative-slot="hotel_directory_card"
                    >
                      <span className={styles.hotelCardCopy}>
                        <p className={styles.hotelLocation}>{prefecture.name}・{hotel.city}</p>
                        <h5>{hotel.nameZh}</h5>
                      </span>
                      <span className={styles.hotelArrow}>查看 <b aria-hidden="true">→</b></span>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

      </section>
    </section>
  )
}
