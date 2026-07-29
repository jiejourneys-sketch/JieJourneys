import { expect, test } from '@playwright/test'
import {
  cleanAgodaAlternateHotelNames,
  findAgodaHotelIndexIdentity,
  searchAgodaAffiliateHotels,
  scoreAgodaHotelNameAliases,
} from '../lib/agodaAffiliate'
import { getApplicableVerifiedHotelAffiliateIdentity } from '../lib/hotelAffiliateIdentity'

test('cleans, deduplicates, and bounds Agoda alternate hotel names', () => {
  const aliases = cleanAgodaAlternateHotelNames([
    '  Centurion Hotel & Spa Ueno Station  ',
    'ＣＥＮＴＵＲＩＯＮ　ＨＯＴＥＬ　＆　ＳＰＡ　ＵＥＮＯ　ＳＴＡＴＩＯＮ',
    '',
    null,
    ...Array.from({ length: 10 }, (_, index) => `Alias ${index + 1}`),
  ], 'centurion hotel & spa ueno station')

  expect(aliases).toEqual(Array.from({ length: 8 }, (_, index) => `Alias ${index + 1}`))
})

test('uses the highest score across every query and candidate alias', () => {
  const primaryOnlyScore = scoreAgodaHotelNameAliases(
    ['日本〒110-'],
    ['Centurion Hotel & Spa Ueno Station -Artificial Radium Hot Spring'],
  )
  const aliasScore = scoreAgodaHotelNameAliases(
    ['日本〒110-', 'Centurion Hotel & Spa Ueno Station -Artificial Radium Hot Spring'],
    ['Unrelated current name', 'Centurion Hotel & Spa Ueno Station -Artificial Radium Hot Spring', 'Former name'],
  )

  expect(primaryOnlyScore).toBeLessThan(0.42)
  expect(aliasScore).toBe(1)
})

test('keeps the dense-area coordinate guard while allowing a canonical alias in the identity lookup', async () => {
  const baseQuery = {
    hotelName: '日本〒110-',
    latitude: 35.7098512,
    longitude: 139.7756721,
    lodgingHint: true,
  }
  const coordinateOnlyIdentity = await findAgodaHotelIndexIdentity(baseQuery)
  const canonicalAliasIdentity = await findAgodaHotelIndexIdentity({
    ...baseQuery,
    alternateHotelNames: ['Centurion Hotel & Spa Ueno Station -Artificial Radium Hot Spring'],
  })

  expect(coordinateOnlyIdentity).toBeNull()
  expect(canonicalAliasIdentity?.hotelId).toBe('2232362')
})

test('finds the Okinawa Kenchomae Agoda identity from the local index without network access', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (() => {
    throw new Error('findAgodaHotelIndexIdentity must not use the network')
  }) as typeof fetch

  try {
    const identity = await findAgodaHotelIndexIdentity({
      hotelName: '沖繩縣廳前大和ROYNET飯店',
      countryCode: 'JP',
      latitude: 26.2132974,
      longitude: 127.6766983,
      lodgingHint: true,
    })

    expect(identity).toEqual({
      hotelId: '247692',
      canonicalNames: ['Daiwa Roynet Hotel Okinawa Kenchomae'],
      city: 'Okinawa Main island',
      countryCode: 'JP',
      cityId: 717899,
      latitude: 26.213292,
      longitude: 127.676727,
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('requires numeric hotel branch identities to agree', async () => {
  const wrongBranchScore = scoreAgodaHotelNameAliases(
    ['Toyoko Inn Seoul Dongdaemun No.2'],
    ['Toyoko Inn Seoul Dongdaemun No.1'],
  )
  const wrongCompactBranchScore = scoreAgodaHotelNameAliases(
    ['Hotel No. 2 Busan'],
    ['Hotel No1 Busan'],
  )
  const correctBranchScore = scoreAgodaHotelNameAliases(
    ['Toyoko Inn Seoul Dongdaemun No.2'],
    ['Seoul Dongdaemun 2 Toyoko Inn Hotel'],
  )
  const currentNameWithFormerBranchScore = scoreAgodaHotelNameAliases(
    ['Toyoko Inn Seoul Dongdaemun No.2'],
    ['Toyoko Inn Seoul Dongdaemun No.2', 'Toyoko Inn Seoul Dongdaemun No.1'],
  )
  const compactNumberScores = [
    scoreAgodaHotelNameAliases(['7 Days Inn Busan'], ['7Days Inn Busan']),
    scoreAgodaHotelNameAliases(['24 Guesthouse Seoul'], ['24Guesthouse Seoul']),
    scoreAgodaHotelNameAliases(['Hotel No. 25 Busan'], ['Hotel No25 Busan']),
  ]
  const identity = await findAgodaHotelIndexIdentity({
    hotelName: 'Toyoko Inn Seoul Dongdaemun No.2',
    countryCode: 'KR',
    latitude: 37.564529,
    longitude: 127.007813,
    lodgingHint: true,
  })

  expect(wrongBranchScore).toBeLessThan(0.78)
  expect(wrongCompactBranchScore).toBeLessThan(0.78)
  expect(correctBranchScore).toBeGreaterThan(0.78)
  expect(currentNameWithFormerBranchScore).toBe(1)
  compactNumberScores.forEach((score) => expect(score).toBeGreaterThan(0.77))
  expect(identity?.hotelId).toBe('86690097')
  expect(identity?.canonicalNames[0]).toContain('2')
})

test('exposes a manually verified Google Place ID before fuzzy matching', () => {
  const identity = getApplicableVerifiedHotelAffiliateIdentity('ChIJzfgJWQCPGGAR2_B6cNH4KIw', {
    latitude: 35.7098512,
    longitude: 139.7756721,
    countryCode: 'JP',
  })

  expect(identity?.agoda?.hotelId).toBe('2232362')
  expect(identity?.agoda?.hotelName).toContain('Centurion')
})

test('uses one Agoda web search as the primary path and preserves only our affiliate parameters', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousSearchProvider = process.env.AGODA_SEARCH_PROVIDER
  const requests: URL[] = []
  process.env.SERPAPI_API_KEY = 'agoda-web-regression'
  process.env.AGODA_SEARCH_PROVIDER = 'serpapi'
  globalThis.fetch = (async (input) => {
    const url = new URL(String(input))
    requests.push(url)
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: [{
        position: 1,
        link: 'https://www.agoda.com/en-us/daiwa-roynet-hotel-okinawa-kenchomae/?cid=another-publisher',
        title: 'Daiwa Roynet Hotel Okinawa Kenchomae - Agoda.com',
        snippet: 'Daiwa Roynet Hotel Okinawa Kenchomae, Naha',
      }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const result = await searchAgodaAffiliateHotels({
      hotelName: 'Daiwa Roynet Hotel Okinawa Kenchomae',
      countryCode: 'JP',
      latitude: 26.2132974,
      longitude: 127.6766983,
      lodgingHint: true,
    })

    expect(requests).toHaveLength(1)
    expect(requests[0]?.searchParams.get('q')).toBe('site:agoda.com Daiwa Roynet Hotel Okinawa Kenchomae Agoda')
    expect(requests[0]?.searchParams.get('hl')).toBe('en')
    expect(requests[0]?.searchParams.get('gl')).toBe('jp')
    expect(result.matchStatus).toBe('matched')
    expect(result.bestMatch?.source).toBe('serpapi')
    const bookingUrl = new URL(result.bestMatch?.bookingUrl ?? '')
    expect(bookingUrl.hostname).toBe('www.agoda.com')
    expect(bookingUrl.pathname).toBe('/en-us/daiwa-roynet-hotel-okinawa-kenchomae/')
    expect(bookingUrl.searchParams.get('cid')).not.toBe('another-publisher')
    expect(bookingUrl.searchParams.get('pcs')).toBe('1')
    expect(bookingUrl.searchParams.has('another-publisher')).toBe(false)
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
    if (typeof previousSearchProvider === 'string') process.env.AGODA_SEARCH_PROVIDER = previousSearchProvider
    else delete process.env.AGODA_SEARCH_PROVIDER
  }
})

test('never treats Agoda attraction or nearby-hotel listing pages as one hotel', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousSearchProvider = process.env.AGODA_SEARCH_PROVIDER
  process.env.SERPAPI_API_KEY = 'agoda-listing-page-regression'
  process.env.AGODA_SEARCH_PROVIDER = 'serpapi'
  globalThis.fetch = (async () => new Response(JSON.stringify({
    search_metadata: { status: 'Success' },
    organic_results: [{
      position: 1,
      link: 'https://www.agoda.com/en-sg/hotels-near-genki-na-sakanayasan/attractions/tokyo-jp.html',
      title: 'Hotels near ART HOTEL Nippori Lungwood, Tokyo - Agoda.com',
      snippet: 'Hotels near ART HOTEL Nippori Lungwood, Tokyo',
    }],
  }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch

  try {
    const result = await searchAgodaAffiliateHotels({
      hotelName: 'ART HOTEL Nippori Lungwood',
      countryCode: 'JP',
      lodgingHint: true,
      forceRefresh: true,
    })

    expect(result.matchStatus).toBe('no_match')
    expect(result.bestMatch).toBeUndefined()
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
    if (typeof previousSearchProvider === 'string') process.env.AGODA_SEARCH_PROVIDER = previousSearchProvider
    else delete process.env.AGODA_SEARCH_PROVIDER
  }
})

test('chooses ART HOTEL Nippori Lungwood property page over nearby-hotel listings', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousSearchProvider = process.env.AGODA_SEARCH_PROVIDER
  process.env.SERPAPI_API_KEY = 'agoda-art-property-regression'
  process.env.AGODA_SEARCH_PROVIDER = 'serpapi'
  globalThis.fetch = (async () => new Response(JSON.stringify({
    search_metadata: { status: 'Success' },
    organic_results: [
      {
        position: 1,
        link: 'https://www.agoda.com/hotels-near-nippori-train-station/attractions/tokyo-jp.html',
        title: 'Hotels near ART HOTEL Nippori Lungwood, Tokyo - Agoda.com',
        snippet: 'ART HOTEL Nippori Lungwood',
      },
      {
        position: 2,
        link: 'https://www.agoda.com/hotel-lungwood/hotel/tokyo-jp.html',
        title: 'ART HOTEL Nippori Lungwood, Tokyo',
        snippet: 'Built in 1990 and renovated in 2021, ART HOTEL Nippori Lungwood is in Tokyo.',
      },
    ],
  }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch

  try {
    const result = await searchAgodaAffiliateHotels({
      hotelName: 'ART HOTEL Nippori Lungwood',
      countryCode: 'JP',
      lodgingHint: true,
      forceRefresh: true,
    })

    expect(result.matchStatus).toBe('matched')
    expect(new URL(result.bestMatch?.bookingUrl ?? '').pathname).toBe('/hotel-lungwood/hotel/tokyo-jp.html')
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
    if (typeof previousSearchProvider === 'string') process.env.AGODA_SEARCH_PROVIDER = previousSearchProvider
    else delete process.env.AGODA_SEARCH_PROVIDER
  }
})

test('treats a compact Agoda property spelling as the exact Fresa Inn hotel and ignores review pages', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousSearchProvider = process.env.AGODA_SEARCH_PROVIDER
  process.env.SERPAPI_API_KEY = 'agoda-fresa-compact-name-regression'
  process.env.AGODA_SEARCH_PROVIDER = 'serpapi'
  globalThis.fetch = (async () => new Response(JSON.stringify({
    search_metadata: { status: 'Success' },
    organic_results: [
      {
        position: 1,
        link: 'https://www.agoda.com/sotetsu-fresa-inn-kyoto-shijokarasuma/hotel/kyoto-jp.html',
        title: 'Sotetsu Fresa Inn Kyoto-Shijokarasuma',
        snippet: 'Sotetsu Fresa Inn Kyoto-Shijokarasuma',
      },
      {
        position: 2,
        link: 'https://www.agoda.com/es-es/sotetsu-fresa-inn-kyoto-shijokarasuma/reviews/kyoto-jp.html',
        title: 'Sotetsu Fresa Inn Kyoto-Shijokarasuma reviews',
        snippet: 'Sotetsu Fresa Inn Kyoto-Shijokarasuma reviews',
      },
    ],
  }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch

  try {
    const result = await searchAgodaAffiliateHotels({
      hotelName: 'Sotetsu Fresa Inn Kyoto-Shijo Karasuma',
      countryCode: 'JP',
      lodgingHint: true,
      forceRefresh: true,
    })

    expect(result.matchStatus).toBe('matched')
    expect(result.candidates).toHaveLength(1)
    expect(new URL(result.bestMatch?.bookingUrl ?? '').pathname).toBe('/sotetsu-fresa-inn-kyoto-shijokarasuma/hotel/kyoto-jp.html')
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
    if (typeof previousSearchProvider === 'string') process.env.AGODA_SEARCH_PROVIDER = previousSearchProvider
    else delete process.env.AGODA_SEARCH_PROVIDER
  }
})

test('uses the Agoda property slug to resolve a Grand Bach same-title tie safely', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousSearchProvider = process.env.AGODA_SEARCH_PROVIDER
  process.env.SERPAPI_API_KEY = 'agoda-grand-bach-slug-regression'
  process.env.AGODA_SEARCH_PROVIDER = 'serpapi'
  globalThis.fetch = (async () => new Response(JSON.stringify({
    search_metadata: { status: 'Success' },
    organic_results: [
      {
        position: 1,
        link: 'https://www.agoda.com/hotel-grand-bach-kyoto/hotel/hatasho-cho-jp.html',
        title: 'Hotel Grand Bach Kyoto Select',
        snippet: 'Hotel Grand Bach Kyoto Select',
      },
      {
        position: 2,
        link: 'https://www.agoda.com/hotel-grand-bach-kyoto-select/hotel/kyoto-jp.html',
        title: 'Hotel Grand Bach Kyoto Select',
        snippet: 'Hotel Grand Bach Kyoto Select',
      },
      {
        position: 3,
        link: 'https://www.agoda.com/pt-br/hotel-grand-bach-kyoto-select-h9074738/hotel/kyoto-jp.html',
        title: 'Hotel Grand Bach Kyoto Select (Quioto)',
        snippet: 'Hotel Grand Bach Kyoto Select',
      },
    ],
  }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch

  try {
    const result = await searchAgodaAffiliateHotels({
      hotelName: 'Hotel Grand Bach Kyoto Select',
      countryCode: 'JP',
      lodgingHint: true,
      forceRefresh: true,
    })

    expect(result.matchStatus).toBe('matched')
    expect(result.candidates).toHaveLength(2)
    expect(new URL(result.bestMatch?.bookingUrl ?? '').pathname).toBe('/hotel-grand-bach-kyoto-select/hotel/kyoto-jp.html')
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
    if (typeof previousSearchProvider === 'string') process.env.AGODA_SEARCH_PROVIDER = previousSearchProvider
    else delete process.env.AGODA_SEARCH_PROVIDER
  }
})

test('does not auto-match a single Agoda family-property prefix or annex URL', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousSearchProvider = process.env.AGODA_SEARCH_PROVIDER
  process.env.SERPAPI_API_KEY = 'agoda-branch-url-regression'
  process.env.AGODA_SEARCH_PROVIDER = 'serpapi'
  let searchCount = 0
  globalThis.fetch = (async () => {
    searchCount += 1
    const result = searchCount === 1
      ? {
          link: 'https://www.agoda.com/hotel-grand-bach-kyoto/hotel/hatasho-cho-jp.html',
          title: 'Hotel Grand Bach Kyoto',
        }
      : {
          link: 'https://www.agoda.com/hotel-grand-bach-kyoto-select-annex/hotel/kyoto-jp.html',
          title: 'Hotel Grand Bach Kyoto Select',
        }
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: [{ position: 1, ...result, snippet: 'Hotel Grand Bach Kyoto Select' }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const baseProperty = await searchAgodaAffiliateHotels({
      hotelName: 'Hotel Grand Bach Kyoto Select',
      countryCode: 'JP',
      lodgingHint: true,
      forceRefresh: true,
    })
    const annexProperty = await searchAgodaAffiliateHotels({
      hotelName: 'Hotel Grand Bach Kyoto Select',
      countryCode: 'JP',
      lodgingHint: true,
      forceRefresh: true,
    })

    expect(baseProperty.matchStatus).toBe('needs_review')
    expect(baseProperty.bestMatch).toBeUndefined()
    expect(annexProperty.matchStatus).toBe('needs_review')
    expect(annexProperty.bestMatch).toBeUndefined()
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
    if (typeof previousSearchProvider === 'string') process.env.AGODA_SEARCH_PROVIDER = previousSearchProvider
    else delete process.env.AGODA_SEARCH_PROVIDER
  }
})

test('rejects an Agoda listing title even when its URL looks like a property page', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousSearchProvider = process.env.AGODA_SEARCH_PROVIDER
  process.env.SERPAPI_API_KEY = 'agoda-listing-title-regression'
  process.env.AGODA_SEARCH_PROVIDER = 'serpapi'
  globalThis.fetch = (async () => new Response(JSON.stringify({
    search_metadata: { status: 'Success' },
    organic_results: [{
      position: 1,
      link: 'https://www.agoda.com/unrelated-property/hotel/tokyo-jp.html',
      title: 'Hotels near ART HOTEL Nippori Lungwood, Tokyo',
      snippet: 'ART HOTEL Nippori Lungwood',
    }],
  }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch

  try {
    const result = await searchAgodaAffiliateHotels({
      hotelName: 'ART HOTEL Nippori Lungwood',
      countryCode: 'JP',
      lodgingHint: true,
      forceRefresh: true,
    })

    expect(result.matchStatus).toBe('no_match')
    expect(result.candidates).toHaveLength(0)
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
    if (typeof previousSearchProvider === 'string') process.env.AGODA_SEARCH_PROVIDER = previousSearchProvider
    else delete process.env.AGODA_SEARCH_PROVIDER
  }
})

test('tries the user name only after the Maps English name has no Agoda result', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousSearchProvider = process.env.AGODA_SEARCH_PROVIDER
  const queries: string[] = []
  process.env.SERPAPI_API_KEY = 'agoda-two-name-regression'
  process.env.AGODA_SEARCH_PROVIDER = 'serpapi'
  globalThis.fetch = (async (input) => {
    const query = new URL(String(input)).searchParams.get('q') ?? ''
    queries.push(query)
    const isUserNameSearch = query.includes('沖繩縣廳前大和ROYNET飯店')
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: isUserNameSearch
        ? [{
            position: 1,
            link: 'https://www.agoda.com/daiwa-roynet-hotel-okinawa-kenchomae/hotel/okinawa-main-island-jp.html',
            title: '沖繩縣廳前大和ROYNET飯店 - Agoda.com',
            snippet: '沖繩縣廳前大和ROYNET飯店',
          }]
        : [],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const result = await searchAgodaAffiliateHotels({
      hotelName: 'Daiwa Roynet Hotel Okinawa Kenchomae',
      alternateHotelNames: ['沖繩縣廳前大和ROYNET飯店', 'This name must never be searched'],
      lodgingHint: true,
      forceRefresh: true,
    })

    expect(queries).toEqual([
      'site:agoda.com Daiwa Roynet Hotel Okinawa Kenchomae Agoda',
      'site:agoda.com 沖繩縣廳前大和ROYNET飯店 Agoda',
    ])
    expect(result.matchStatus).toBe('matched')
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
    if (typeof previousSearchProvider === 'string') process.env.AGODA_SEARCH_PROVIDER = previousSearchProvider
    else delete process.env.AGODA_SEARCH_PROVIDER
  }
})

test('searches Maps English, Maps Traditional Chinese, then the user name as separate Agoda rounds', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousSearchProvider = process.env.AGODA_SEARCH_PROVIDER
  const mapsEnglishName = 'Planner Harbor View Hotel'
  const mapsTraditionalChineseName = '地圖繁中港景飯店'
  const userName = '使用者輸入海灣飯店'
  const queries: string[] = []
  process.env.SERPAPI_API_KEY = 'agoda-three-name-regression'
  process.env.AGODA_SEARCH_PROVIDER = 'serpapi'
  globalThis.fetch = (async (input) => {
    const query = new URL(String(input)).searchParams.get('q') ?? ''
    queries.push(query)
    const candidateName =
      query.includes(mapsEnglishName)
        ? mapsTraditionalChineseName
        : query.includes(mapsTraditionalChineseName)
          ? userName
          : userName
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: [{
        position: 1,
        link: 'https://www.agoda.com/planner-harbor-view-hotel/hotel/okinawa-main-island-jp.html',
        title: `${candidateName} - Agoda.com`,
        snippet: candidateName,
      }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const result = await searchAgodaAffiliateHotels({
      hotelName: mapsEnglishName,
      alternateHotelNames: [
        mapsTraditionalChineseName,
        userName,
        'This name must never be searched',
      ],
      lodgingHint: true,
      forceRefresh: true,
    })

    expect(queries).toEqual([
      `site:agoda.com ${mapsEnglishName} Agoda`,
      `site:agoda.com ${mapsTraditionalChineseName} Agoda`,
      `site:agoda.com ${userName} Agoda`,
    ])
    expect(queries.join(' ')).not.toContain('This name must never be searched')
    expect(result.matchStatus).toBe('matched')
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
    if (typeof previousSearchProvider === 'string') process.env.AGODA_SEARCH_PROVIDER = previousSearchProvider
    else delete process.env.AGODA_SEARCH_PROVIDER
  }
})

test('treats an unavailable Agoda web search as retryable instead of a no-match', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousSearchProvider = process.env.AGODA_SEARCH_PROVIDER
  process.env.SERPAPI_API_KEY = 'agoda-transient-error-regression'
  process.env.AGODA_SEARCH_PROVIDER = 'serpapi'
  globalThis.fetch = (async () => {
    throw new Error('temporary SerpAPI outage')
  }) as typeof fetch

  try {
    const result = await searchAgodaAffiliateHotels({
      hotelName: 'Transient Agoda Retry Lodge',
      lodgingHint: true,
    })

    expect(result.matchStatus).toBe('api_error')
    expect(result.error).toBe('agoda_web_search_unavailable')
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
    if (typeof previousSearchProvider === 'string') process.env.AGODA_SEARCH_PROVIDER = previousSearchProvider
    else delete process.env.AGODA_SEARCH_PROVIDER
  }
})
