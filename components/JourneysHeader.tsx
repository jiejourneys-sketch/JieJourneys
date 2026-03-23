import Link from 'next/link'

/** 自由行攻略 PDF 頁專用 Header，與 HTML jj-topbar 完全一致 */
type Props = {
  backHref: string
  eventPrefix: string
}

export default function JourneysHeader({ backHref, eventPrefix }: Props) {
  return (
    <header className="jj-topbar">
      <Link
        href="/"
        className="jj-brand"
        aria-label="回首頁"
        data-event={`${eventPrefix}_logo`}
        data-item="brand"
      >
        <img src="/assets/logo.jpg" alt="JieJourneys Logo" width={40} height={40} style={{ borderRadius: 8, objectFit: 'cover' }} />
        <span className="jj-title">JieJourneys｜旅杰</span>
      </Link>
      <nav className="jj-actions">
        <Link
          href={backHref}
          className="jj-btn"
          data-event={`${eventPrefix}_back`}
          data-item="brand"
        >
          ← 回上一頁
        </Link>
        <Link
          href="/"
          className="jj-btn"
          data-event={`${eventPrefix}_backhome`}
          data-item="brand"
        >
          回首頁
        </Link>
      </nav>
    </header>
  )
}
