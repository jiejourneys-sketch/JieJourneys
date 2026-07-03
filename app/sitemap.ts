import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.jiejourneys.com'

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>

type SitemapRoute = {
  path: string
  changeFrequency?: ChangeFrequency
  priority?: number
  images?: string[]
}

const sitemapRoutes: SitemapRoute[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/countries', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/tools/planner', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/tools/bill', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/tools/resources', changeFrequency: 'monthly', priority: 0.5 },

  { path: '/busan', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/busan/hotel', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/busan/ticket', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/busan/transport', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/busan/video', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/busan/map', changeFrequency: 'monthly', priority: 0.8, images: ['/assets/busan-map-search.png'] },
  { path: '/busan/pass-map', changeFrequency: 'monthly', priority: 0.8, images: ['/assets/busan-passmap-search.png'] },
  { path: '/busan/journeys', changeFrequency: 'monthly', priority: 0.6 },

  { path: '/northvietnam', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/northvietnam/hotel', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/northvietnam/ticket', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/northvietnam/transport', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/northvietnam/video', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/northvietnam/map', changeFrequency: 'monthly', priority: 0.8, images: ['/assets/northvietnam-map-search.png'] },
  { path: '/northvietnam/journeys', changeFrequency: 'monthly', priority: 0.6 },

  { path: '/tokyo', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/tokyo/hotel', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/tokyo/ticket', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/tokyo/transport', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/tokyo/video', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/tokyo/map', changeFrequency: 'monthly', priority: 0.8, images: ['/assets/tokyo-map-search.png'] },
  { path: '/tokyo/journeys', changeFrequency: 'monthly', priority: 0.6 },

  { path: '/osaka', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/osaka/hotel', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/osaka/ticket', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/osaka/transport', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/osaka/video', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/osaka/map', changeFrequency: 'monthly', priority: 0.8, images: ['/assets/osaka-map-search.png'] },
  { path: '/osaka/pass-map', changeFrequency: 'monthly', priority: 0.8, images: ['/assets/osaka-passmap-search.png'] },
  { path: '/osaka/journeys', changeFrequency: 'monthly', priority: 0.6 },

  { path: '/fuji', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/fuji/hotel', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/fuji/ticket', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/fuji/transport', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/fuji/video', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/fuji/map', changeFrequency: 'monthly', priority: 0.8, images: ['/assets/fuji-map-search.png'] },
  { path: '/fuji/pass-map', changeFrequency: 'monthly', priority: 0.8, images: ['/assets/fuji-passmap-search.png'] },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapRoutes.map(({ path, images, ...route }) => ({
    url: `${SITE_URL}${path}`,
    ...route,
    ...(images ? { images: images.map((image) => `${SITE_URL}${image}`) } : {}),
  }))
}
