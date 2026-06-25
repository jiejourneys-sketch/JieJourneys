import PromoLink from '@/components/PromoLink'

export default function TopBanner() {
  return (
    <div className="top-banner">
      <div className="banner-content">
        <div className="promo-grid">
          <div>
            <strong>KKday 優惠碼：</strong>
            <PromoLink
              href="https://www.kkday.com/zh-tw/?cid=22312"
              promoCode="KKJIE94"
              data-event="promo_KKDAY"
              className="code-link"
              universalLink
            >
              <span className="code">KKJIE94 ↗</span>
            </PromoLink>
          </div>
          <div>
            <strong>Klook 優惠碼：</strong>
            <PromoLink
              href="https://www.klook.com/zh-TW/?aid=93798"
              promoCode="JieJourneys"
              data-event="promo_KLOOK"
              className="code-link"
              universalLink
            >
              <span className="code">JieJourneys ↗</span>
            </PromoLink>
          </div>
          <div>
            <strong>完美行購物 優惠碼：</strong>
            <PromoLink
              href="https://af-wamazing.catsys.jp/c5e3c193y273353e/cl/?bId=g222b339"
              promoCode="SH66U"
              data-event="promo_wamazingbuy"
              className="code-link"
            >
              <span className="code">SH66U ↗</span>
            </PromoLink>
          </div>
          <div>
            <strong>eSIM 優惠碼：</strong>
            <PromoLink
              href="https://esimconnect.com.tw/#/access/esimbuy?referencecode=jiejourneys"
              promoCode="jiejourneys"
              data-event="promo_esimconnect"
              className="code-link"
            >
              <span className="code">JieJourneys ↗</span>
            </PromoLink>
          </div>
          <div>
            <strong>訂房：</strong>
            <a
              href="https://tw.trip.com/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D13969664"
              target="_blank"
              rel="noopener noreferrer"
              data-event="promo_Trip"
              className="code-link"
            >
              <span className="code">Trip ↗</span>
            </a>
            &nbsp;
            <a
              href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw"
              target="_blank"
              rel="noopener noreferrer"
              data-event="promo_Agoda"
              className="code-link"
            >
              <span className="code">Agoda ↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
