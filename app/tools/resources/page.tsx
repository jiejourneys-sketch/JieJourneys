'use client'

import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import PromoLink from '@/components/PromoLink'

const resources = [
  {
    title: '\u65e5\u672c\u7dda\u4e0a\u8cfc\u7269(\u5408\u4f5c)',
    tags: '\u65e5\u672c \u7dda\u4e0a\u8cfc\u7269 \u5408\u4f5c wamazing shopping japan',
    href: 'https://af-wamazing.catsys.jp/c5e3c193y273353e/cl/?bId=g222b339',
    event: 'wamazingbuy',
    promoCode: 'SH66U',
  },
  {
    title: '\u65e5\u672c\u79df\u8eca(\u5408\u4f5c)',
    tags: '\u65e5\u672c \u79df\u8eca \u81ea\u99d5 \u5408\u4f5c tocoo car rental japan',
    href: 'https://www2.tocoo.jp/cn/?asp_id=2561&utm_source=2561&utm_medium=affiliate',
    event: 'japancarrental_tocoo',
    promoCode: 'BADN3O',
  },
  {
    title: '\u65e5\u672c\u6ed1\u96ea\u9810\u8a02(\u5408\u4f5c)',
    tags: '\u65e5\u672c \u6ed1\u96ea \u9810\u8a02 \u5408\u4f5c wamazing snow japan',
    href: 'https://af-wamazing.catsys.jp/c5e3c193y273353e/cl/?bId=2i98k457',
    event: 'wamazingsnow',
  },
]

export default function ToolsResourcesPage() {
  return (
    <>
      <CitySubpageHeader backHref="/" eventPrefix="toolsresources" />
      <main className="container">
        <h1>{'\u5176\u4ed6\u65c5\u904a\u8cc7\u6e90'}</h1>
        <section id="tools-resources-list" className="section" aria-label="其他旅遊資源列表" style={{ paddingTop: 0 }}>
          <div className="popular-grid resources-grid">
            {resources.map((resource) =>
              resource.promoCode ? (
                <PromoLink
                  key={resource.event}
                  href={resource.href}
                  promoCode={resource.promoCode}
                  className="card"
                  data-event={resource.event}
                  data-item="tool"
                  data-section="tools_resources"
                  data-tags={resource.tags}
                  aria-label={`${resource.title}\u8cc7\u6e90`}
                >
                  <div className="card-body">
                    <h3>{resource.title}</h3>
                  </div>
                </PromoLink>
              ) : (
                <a
                  key={resource.event}
                  href={resource.href}
                  className="card"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event={resource.event}
                  data-item="tool"
                  data-section="tools_resources"
                  data-tags={resource.tags}
                  aria-label={`${resource.title}\u8cc7\u6e90`}
                >
                  <div className="card-body">
                    <h3>{resource.title}</h3>
                  </div>
                </a>
              ),
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
