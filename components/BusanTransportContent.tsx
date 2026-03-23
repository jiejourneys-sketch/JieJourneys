'use client'

import { useState } from 'react'
import TransportTabs, { type TransportTab } from './TransportTabs'

const CARDS: { area: '通訊' | '交通'; content: React.ReactNode }[] = [
  {
    area: '通訊',
    content: (
      <article key="esim" className="stay-card" data-area="通訊">
        <div>
          <h3 className="title">eSIM卡</h3>
          <p className="meta">通訊</p>
          <div className="actions">
            <a className="btn primary recommend" href="https://esimconnect.com.tw/#/access/esimbuy?region=%E9%9F%93%E5%9C%8B&referencecode=jiejourneys" target="_blank" rel="noopener noreferrer" data-event="busantransport_esimconnect" data-platform="connect" data-section="comm_card">輸入JieJourneys</a>
            <a className="btn" href="https://www.kkday.com/zh-tw/product/268527?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busantransport_esimKKday" data-platform="KKDAY" data-section="comm_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/109354-south-korea-esim-high-speed-internet-qr-code-voucher/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busantransport_esimKLOOK" data-platform="KLOOK" data-section="comm_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/things-to-do/detail/37694225/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051" target="_blank" rel="noopener noreferrer" data-event="busantransport_esimTrip" data-platform="Trip" data-section="comm_card">Trip</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '通訊',
    content: (
      <article key="sim" className="stay-card" data-area="通訊">
        <div>
          <h3 className="title">SIM卡</h3>
          <p className="meta">通訊</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/20721-4g-lte-sim-card-with-t-money-card-calls-pick-up-south-korea-airports-south-korea?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busantransport_simKKday" data-platform="KKDAY" data-section="comm_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/16469-kt-olleh-4g-sim-south-korea/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busantransport_simKLOOK" data-platform="KLOOK" data-section="comm_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/things-to-do/detail/53602741/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051" target="_blank" rel="noopener noreferrer" data-event="busantransport_simTrip" data-platform="Trip" data-section="comm_card">Trip</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '通訊',
    content: (
      <article key="wifi-kr" className="stay-card" data-area="通訊">
        <div>
          <h3 className="title">Wifi分享器｜韓國機場領取</h3>
          <p className="meta">通訊</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/7452-unlimited-4g-pocket-wi-fi-rental-with-airports-and-seoul-pick-up-south-korea?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busantransport_WifiKoreaKKday" data-platform="KKDAY" data-section="comm_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/16463-4g-wifi-south-korea/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busantransport_WifiKoreaKLOOK" data-platform="KLOOK" data-section="comm_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/things-to-do/detail/48575899?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D11674280" target="_blank" rel="noopener noreferrer" data-event="busantransport_WifiKoreaTrip" data-platform="Trip" data-section="comm_card">Trip</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '通訊',
    content: (
      <article key="wifi-tpe" className="stay-card" data-area="通訊">
        <div>
          <h3 className="title">Wifi分享器｜台灣機場領取</h3>
          <p className="meta">通訊</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/9675-south-korea-kt-olleh-unlimited-4g-wi-fi-rental-taiwan-airports-delivery?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busantransport_WifiTPEKKday" data-platform="KKDAY" data-section="comm_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/16959-4g-wifi-south-korea/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busantransport_WifiTPEKLOOK" data-platform="KLOOK" data-section="comm_card">KLOOK</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '交通',
    content: (
      <article key="wowpass" className="stay-card" data-area="交通">
        <div>
          <h3 className="title">WOWPASS卡</h3>
          <p className="meta">交通</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/149562?qs=WOWPASS%E5%8D%A1&cid=22312" target="_blank" rel="noopener noreferrer" data-event="busantransport_wowKKday" data-platform="KKDAY" data-section="transport_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/86208-wowpass-card-seoul/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busantransport_wowKLOOK" data-platform="KLOOK" data-section="transport_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/things-to-do/detail/66033197/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756" target="_blank" rel="noopener noreferrer" data-event="busantransport_wowTrip" data-platform="Trip" data-section="transport_card">Trip</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '交通',
    content: (
      <article key="tmoney" className="stay-card" data-area="交通">
        <div>
          <h3 className="title">T money 交通卡</h3>
          <p className="meta">交通</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/132542-korea-4g-high-speed-esim?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busantransport_TmoneyKKday" data-platform="KKDAY" data-section="transport_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/18054-klook-t-money-card-seoul/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busantransport_TmoneyKLOOK" data-platform="KLOOK" data-section="transport_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/things-to-do/detail/83635246/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756" target="_blank" rel="noopener noreferrer" data-event="busantransport_TmoneyTrip" data-platform="Trip" data-section="transport_card">Trip</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '交通',
    content: (
      <article key="ktx" className="stay-card" data-area="交通">
        <div>
          <h3 className="title">KTX 韓國鐵路通票</h3>
          <p className="meta">交通</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/2930-korea-ktx-train-discounted-korail-day-pass?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busantransport_KTXKKday" data-platform="KKDAY" data-section="transport_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/47751-ktx-one-way-ticket-busan/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busantransport_KTXKLOOK" data-platform="KLOOK" data-section="transport_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/trains/korail/route/seoul-to-busan/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051" target="_blank" rel="noopener noreferrer" data-event="busantransport_KTXTrip" data-platform="Trip" data-section="transport_card">Trip</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '交通',
    content: (
      <article key="airport" className="stay-card" data-area="交通">
        <div>
          <h3 className="title">釜山金海機場 ↔ 釜山市區</h3>
          <p className="meta">交通</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/18410?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busantransport_KTXKKday" data-platform="KKDAY" data-section="transport_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/airport-transfers/service/pus-gimhae-international-airport/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busantransport_KTXKLOOK" data-platform="KLOOK" data-section="transport_card">KLOOK</a>
          </div>
        </div>
      </article>
    ),
  },
]

function filterCards(activeTab: TransportTab) {
  if (activeTab === 'all') return CARDS
  const area = activeTab === 'sim' ? '通訊' : '交通'
  return CARDS.filter((c) => c.area === area)
}

export default function BusanTransportContent() {
  const [activeTab, setActiveTab] = useState<TransportTab>('all')
  const filtered = filterCards(activeTab)

  return (
    <>
      <TransportTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <section className="stay-list" id="stayList">
        {filtered.map(({ content }) => content)}
      </section>
    </>
  )
}
