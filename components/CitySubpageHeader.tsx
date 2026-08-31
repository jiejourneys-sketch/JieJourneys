import Link from 'next/link'
import Image from 'next/image'

/** 城市子頁面與主頁專用 Header：品牌 + 「← 上一頁」「回首頁」按鈕，與 HTML 設計一致 */
type Props = {
  /** 上一頁連結（子頁：/busan、/northvietnam、/tokyo；主頁：/） */
  backHref: string
  /** 用於 GA 的 data-event 前綴（可選） */
  eventPrefix?: string
  /** 同頁狀態式工具需要完整重載，才能真的回到入口畫面 */
  forceBackReload?: boolean
}

export default function CitySubpageHeader({ backHref, eventPrefix = 'page', forceBackReload = false }: Props) {
  const backAttrs = {
    className: 'home-link print-hidden',
    'data-event': `${eventPrefix}_back`,
    'data-item': 'back',
  }

  return (
    <header>
      <nav className="nav nav-city">
        <Link
          href="/"
          className="brand"
          aria-label="回首頁"
          data-event={`${eventPrefix}_logo`}
          data-item="brand"
        >
          <Image src="/assets/logo.jpg" alt="旅杰 JieJourneys Logo" width={36} height={36} />
          <span>旅杰 JieJourneys</span>
        </Link>
        <div className="nav-actions">
          {forceBackReload ? (
            <a href={backHref} {...backAttrs}>
              ← 上一頁
            </a>
          ) : (
            <Link href={backHref} {...backAttrs}>
              ← 上一頁
            </Link>
          )}
          <Link
            href="/"
            className="home-link print-hidden"
            data-event={`${eventPrefix}_backhome`}
            data-item="home"
          >
            回首頁
          </Link>
        </div>
      </nav>
    </header>
  )
}
