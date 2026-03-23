'use client'

import { useEffect } from 'react'
import { getGtag } from '@/lib/gtag'

export default function FAQ() {
  useEffect(() => {
    document.querySelectorAll('#faq details').forEach((d) => {
      d.addEventListener('toggle', () => {
        const fn = getGtag()
        if (typeof fn !== 'function') return
        const q = d.querySelector('summary')?.textContent?.trim() || ''
        fn('event', 'faq_toggle', {
          page_path: location.pathname,
          question: q,
          open: (d as HTMLDetailsElement).open,
        })
      })
    })
  }, [])

  return (
    <div className="faq">
      <details data-event="faq_first">
        <summary>🌏 為什麼會有 JieJourneys？</summary>
        <p>JieJourneys 致力於幫助旅人，用最短時間掌握重點、規劃順暢的自助行程。</p>
      </details>
      <details data-event="faq_second">
        <summary>🗺️ 這些攻略可以免費使用嗎？</summary>
        <p>大部分內容（景點、地圖、教學）是免費公開的，行程 PDF 屬於付費下載項目。</p>
      </details>
      <details data-event="faq_third">
        <summary>💳 付款後多久可以收到行程 PDF？</summary>
        <p>付款成功後系統會立即自動寄送下載連結到信箱，通常幾秒內就能收到。</p>
      </details>
      <details data-event="faq_fourth">
        <summary>📱 可以用手機開啟 PDF 嗎？</summary>
        <p>可以，建議使用 iPhone 的「檔案」或 Android 的「Adobe Acrobat Reader」開啟即可。</p>
      </details>
      <details data-event="faq_fifth">
        <summary>🌏 之後會增加其他國家嗎？</summary>
        <p>會的，我們接下來會製作大阪、東京、首爾、香港等地的自由行攻略，敬請期待！</p>
      </details>
    </div>
  )
}
