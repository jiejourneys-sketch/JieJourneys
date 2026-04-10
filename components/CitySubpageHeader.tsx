import Link from 'next/link'
import Image from 'next/image'

/** 城市子頁面與主頁專用 Header：品牌 + 「← 上一頁」「回首頁」按鈕，與 HTML 設計一致 */
type Props = {
  /** 上一頁連結（子頁：/busan、/northvietnam、/tokyo；主頁：/） */
  backHref: string
  /** 用於 GA 的 data-event 前綴（可選） */
  eventPrefix?: string
}

export default function CitySubpageHeader({ backHref, eventPrefix = 'page' }: Props) {
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
          <Image src="/assets/logo.jpg" alt="JieJourneys(旅杰) Logo" width={36} height={36} />
          <span>JieJourneys｜旅杰</span>
        </Link>
        <div className="nav-actions">
          <Link
            href={backHref}
            className="home-link"
            data-event={`${eventPrefix}_back`}
            data-item="back"
          >
            ← 上一頁
          </Link>
          <Link
            href="/"
            className="home-link"
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
