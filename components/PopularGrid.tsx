import Link from 'next/link'
import Image from 'next/image'

export default function PopularGrid() {
  return (
    <div className="popular-grid">
      <Link
        href="/busan"
        className="card"
        data-event="home_card_busan"
        data-item="busan"
        data-section="popular"
        data-tags="韓國 釜山 busan korea"
        aria-label="前往釜山攻略頁面"
      >
        <Image className="thumb" src="/assets/busan.png" alt="釜山 Busan" width={320} height={180} />
        <div className="card-body">
          <h3>韓國｜釜山</h3>
        </div>
      </Link>
      <Link
        href="/tokyo"
        className="card"
        data-event="home_card_tokyo"
        data-item="tokyo"
        data-section="popular"
        data-tags="日本 東京 tokyo japan"
        aria-label="前往東京攻略頁面"
      >
        <Image className="thumb" src="/assets/tokyo.png" alt="東京 Tokyo" width={320} height={180} />
        <div className="card-body">
          <h3>日本｜東京</h3>
        </div>
      </Link>
      <Link
        href="/"
        className="card"
        data-event="home_card_osaka"
        data-item="osaka"
        data-section="popular"
        data-tags="日本 大阪 osaka japan"
        aria-label="前往大阪攻略頁面"
      >
        <Image className="thumb" src="/assets/osaka.png" alt="大阪 Osaka" width={320} height={180} />
        <div className="card-body">
          <h3>大阪(製作中)</h3>
        </div>
      </Link>
      <Link
        href="/countries"
        className="card"
        data-event="home_card_countries"
        data-item="countries"
        data-section="popular"
        data-tags="其他國家 越南 東南亞 更多國家 地區"
        aria-label="前往其他國家與地區攻略列表"
      >
        <Image className="thumb" src="/assets/other.png" alt="其他國家與地區" width={320} height={180} />
        <div className="card-body">
          <h3>其他國家</h3>
        </div>
      </Link>
    </div>
  )
}
