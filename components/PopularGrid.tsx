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
        aria-label="前往釜山攻略頁面"
      >
        <img className="thumb" src="/assets/busan.png" alt="釜山 Busan" />
        <div className="card-body">
          <h3>韓國｜釜山</h3>
        </div>
      </Link>
      <Link
        href="/northvietnam"
        className="card"
        data-event="home_card_northvietnam"
        data-item="hanoi"
        data-section="popular"
        aria-label="前往河內攻略頁面"
      >
        <img className="thumb" src="/assets/hanoi.png" alt="河內 Hanoi" />
        <div className="card-body">
          <h3>越南｜北越</h3>
        </div>
      </Link>
      <Link
        href="/tokyo"
        className="card"
        data-event="home_card_tokyo"
        data-item="tokyo"
        data-section="popular"
        aria-label="前往東京攻略頁面"
      >
        <img className="thumb" src="/assets/tokyo.png" alt="東京 Tokyo" />
        <div className="card-body">
          <h3>日本｜東京</h3>
        </div>
      </Link>
    </div>
  )
}
