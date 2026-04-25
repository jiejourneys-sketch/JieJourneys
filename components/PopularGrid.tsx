import Link from 'next/link'

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
        <div className="card-body">
          <h3>日本｜東京</h3>
        </div>
      </Link>
      <Link
        href="/fuji"
        className="card"
        data-event="home_card_fuji"
        data-item="fuji"
        data-section="popular"
        data-tags="日本 富士河口湖 富士山 fuji kawaguchiko japan"
        aria-label="前往富士河口湖攻略頁面"
      >
        <div className="card-body">
          <h3>日本｜富士河口湖</h3>
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
        <div className="card-body">
          <h3>其他國家</h3>
        </div>
      </Link>
    </div>
  )
}
