import Link from 'next/link'
import Image from 'next/image'

/** 用於城市頁的 header，導航連結指向首頁區塊 */
export default function SiteHeader() {
  return (
    <header>
      <nav className="nav">
        <Link href="/" className="brand" aria-label="回首頁" data-event="home_logo" data-item="brand">
          <Image src="/assets/logo.jpg" alt="旅杰 JieJourneys Logo" width={36} height={36} />
          <span>旅杰 JieJourneys</span>
        </Link>
        <div className="menu">
          <Link href="/#popular" data-event="home_gonglue" data-item="popular">
            熱門攻略
          </Link>
          <Link href="/#tools" data-event="home_tools" data-item="tools">
            旅遊資源
          </Link>
          <Link href="/#follow" data-event="home_follow" data-item="follow">
            追蹤我們
          </Link>
          <Link href="/#about" data-event="home_about" data-item="about">
            關於
          </Link>
          <Link href="/contact/" data-event="home_contact" data-item="contact">
            聯絡我們
          </Link>
        </div>
      </nav>
    </header>
  )
}
