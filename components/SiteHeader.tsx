import Link from 'next/link'

/** 用於城市頁的 header，導航連結指向首頁區塊 */
export default function SiteHeader() {
  return (
    <header>
      <nav className="nav">
        <Link href="/" className="brand" aria-label="回首頁" data-event="home_logo" data-item="brand">
          <img src="/assets/logo.jpg" alt="JieJourneys(旅杰) Logo" />
          <span>JieJourneys｜旅杰</span>
        </Link>
        <div className="menu">
          <Link href="/#popular" data-event="home_gonglue" data-item="popular">
            熱門攻略
          </Link>
          <Link href="/#follow" data-event="home_follow" data-item="follow">
            追蹤我們
          </Link>
          <Link href="/#about" data-event="home_about" data-item="about">
            關於
          </Link>
          <Link href="/#faq" data-event="home_questions" data-item="faq">
            常見問題
          </Link>
          <Link href="/contact/" data-event="home_contact" data-item="contact">
            聯絡我們
          </Link>
        </div>
      </nav>
    </header>
  )
}
