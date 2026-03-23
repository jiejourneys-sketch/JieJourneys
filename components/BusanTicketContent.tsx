'use client'

import { useState } from 'react'
import AreaTabs, { type TabItem } from './AreaTabs'

const TICKET_TABS: TabItem[] = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '票券', label: '釜山Pass票券', dataArea: '票券' },
  { value: '涵蓋', label: '釜山Pass涵蓋景點票券', dataArea: '涵蓋' },
  { value: '未涵蓋', label: '釜山Pass未涵蓋景點票券', dataArea: '未涵蓋' },
  { value: '一日遊', label: '一日遊票券', dataArea: '一日遊' },
]

const TICKET_CARDS: { area: string; content: React.ReactNode }[] = [
  {
    area: '票券',
    content: (
      <article key="pass" className="stay-card" data-area="票券">
        <div>
          <h3 className="title">釜山通行證(釜山Pass)</h3>
          <p className="meta">釜山Pass票券</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/138477-visit-busan-pass-discount-free-attractions?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busanticket_PassKKday" data-platform="KKDAY" data-section="ticket_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/81576-visit-busan-pass/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_PassKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/things-to-do/detail/50618334?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051" target="_blank" rel="noopener noreferrer" data-event="busanticket_PassTrip" data-platform="Trip" data-section="ticket_card">Trip</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '涵蓋',
    content: (
      <article key="lotte" className="stay-card" data-area="涵蓋">
        <div>
          <h3 className="title">樂天世界</h3>
          <p className="meta">釜山Pass(✔️)</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/19296-busan-lotte-world-adventure-tickets-korea?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busanticket_LotteKKday" data-platform="KKDAY" data-section="ticket_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/75094-lotte-world-busan/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_LotteKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/travel-guide/attraction/busan/lotte-world-adventure-busan-136624941/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7195610" target="_blank" rel="noopener noreferrer" data-event="busanticket_LotteTrip" data-platform="Trip" data-section="ticket_card">Trip</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '涵蓋',
    content: (
      <article key="skyline" className="stay-card" data-area="涵蓋">
        <div>
          <h3 className="title">斜坡滑車SkyLine Luge</h3>
          <p className="meta">釜山Pass(✔️)</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/152412-gijang-skyline-luge-ticket-busan-south-korea?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busanticket_SkylineKKday" data-platform="KKDAY" data-section="ticket_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/95929-skyline-luge-ticket-busan/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_SkylineKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/travel-guide/attraction/busan/skyline-luge-busan-137759829/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7195610" target="_blank" rel="noopener noreferrer" data-event="busanticket_SkylineTrip" data-platform="Trip" data-section="ticket_card">Trip</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '涵蓋',
    content: (
      <article key="xthesky" className="stay-card" data-area="涵蓋">
        <div>
          <h3 className="title">釜山 X the Sky 展望台</h3>
          <p className="meta">釜山Pass(✔️)</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/105514?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busanticket_XtheskyKKday" data-platform="KKDAY" data-section="ticket_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/81280-busan-haeundae-lct-x-the-sky-admission-ticket/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_XtheskyKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/travel-guide/attraction/busan/busan-x-the-sky-131154384/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7195610" target="_blank" rel="noopener noreferrer" data-event="busanticket_XtheskyTrip" data-platform="Trip" data-section="ticket_card">Trip</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '涵蓋',
    content: (
      <article key="spaland" className="stay-card" data-area="涵蓋">
        <div>
          <h3 className="title">汗蒸幕｜新世界SPA LAND</h3>
          <p className="meta">釜山Pass(✔️)</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/12213?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busanticket_SpalandKKday" data-platform="KKDAY" data-section="ticket_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/33180-spa-land-centum-city-ticket-busan/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_SpalandKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/travel-guide/attraction/busan/spa-land-centum-city-52529207/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7195610" target="_blank" rel="noopener noreferrer" data-event="busanticket_SpalandTrip" data-platform="Trip" data-section="ticket_card">Trip</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '涵蓋',
    content: (
      <article key="songdao" className="stay-card" data-area="涵蓋">
        <div>
          <h3 className="title">松島海上纜車</h3>
          <p className="meta">釜山Pass(✔️)</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/19674-busan-air-cruise-songdo-marine-cable-car-ticket-south-korea?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busanticket_SongdaoKKday" data-platform="KKDAY" data-section="ticket_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/29068-busan-air-cruise-cable-car-ticket/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_SongdaoKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/travel-guide/attraction/busan/busan-songdo-sea-cable-car-68151207/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7195610" target="_blank" rel="noopener noreferrer" data-event="busanticket_SongdaoTrip" data-platform="Trip" data-section="ticket_card">Trip</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '涵蓋',
    content: (
      <article key="hanfu" className="stay-card" data-area="涵蓋">
        <div>
          <h3 className="title">韓服體驗｜釜山甘川文化村</h3>
          <p className="meta">釜山Pass(✔️)</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/135365?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busanticket_HanfuKKday" data-platform="KKDAY" data-section="ticket_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/94949-gamcheon-hanbok-rental/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_HanfuKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '涵蓋',
    content: (
      <article key="busantower" className="stay-card" data-area="涵蓋">
        <div>
          <h3 className="title">釜山塔</h3>
          <p className="meta">釜山Pass(✔️)</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/19378?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busanticket_BusantowerKKday" data-platform="KKDAY" data-section="ticket_card">KKDAY</a>
            <a className="btn" href="https://tw.trip.com/travel-guide/attraction/busan/busan-tower-10521758/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7195610" target="_blank" rel="noopener noreferrer" data-event="busanticket_BusantowerTrip" data-platform="Trip" data-section="ticket_card">Trip</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '未涵蓋',
    content: (
      <article key="skycap" className="stay-card" data-area="未涵蓋">
        <div>
          <h3 className="title">膠囊列車&海岸列車</h3>
          <p className="meta">釜山Pass(✖)</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/123012-haeundae-blueline-park-sky-capsule-beach-train-ticket?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busanticket_SkycapKKday" data-platform="KKDAY" data-section="ticket_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/133293-haeundae-blueline-park-ticket-in-busan/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_SkycapKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/travel-guide/attraction/busan/haeundae-blueline-park-131154386/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051" target="_blank" rel="noopener noreferrer" data-event="busanticket_SkycapTrip" data-platform="Trip" data-section="ticket_card">Trip</a>
            <a className="btn" href="https://www.bluelinepark.com/eng/booking.do" target="_blank" rel="noopener noreferrer" data-event="busanticket_SkycapOffbuy" data-platform="官網" data-section="ticket_card">官網</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '涵蓋',
    content: (
      <article key="diamondbay" className="stay-card" data-area="涵蓋">
        <div>
          <h3 className="title">Diamond Bay Yacht｜鑽石灣遊艇</h3>
          <p className="meta">釜山Pass(✔️)</p>
          <div className="actions">
            <a className="btn primary" href="https://diamondbay-tw.imweb.me/22" target="_blank" rel="noopener noreferrer" data-event="busanticket_DiamondBayYachtOfficial" data-platform="Official" data-section="ticket_card">官網釜山Pass預約</a>
            <a className="btn" href="https://www.instagram.com/busan_diamondbay/" target="_blank" rel="noopener noreferrer" data-event="busanticket_DiamondBayYachtIG" data-platform="IG" data-section="ticket_card">IG</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '未涵蓋',
    content: (
      <article key="yachtholic" className="stay-card" data-area="未涵蓋">
        <div>
          <h3 className="title">Yacht Holic｜水營灣遊艇</h3>
          <p className="meta">釜山Pass(✖)</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/134684-yacht-holic-busan-yacht-public-tour-gwangan-ri-haeundae-south-korea?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busanticket_YachtholicKKday" data-platform="KKDAY" data-section="ticket_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/43419-busan-luxury-yacht-experience/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_YachtholicKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/things-to-do/detail/96899974/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D12650990" target="_blank" rel="noopener noreferrer" data-event="busanticket_YachtholicTrip" data-platform="Trip" data-section="ticket_card">Trip</a>
            <a className="btn" href="https://www.instagram.com/yachtholic/" target="_blank" rel="noopener noreferrer" data-event="busanticket_YachtholicIG" data-platform="IG" data-section="ticket_card">IG</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '未涵蓋',
    content: (
      <article key="yachtg" className="stay-card" data-area="未涵蓋">
        <div>
          <h3 className="title">Yacht G｜水營灣遊艇</h3>
          <p className="meta">釜山Pass(✖)</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/135076-busan-fireworks-festival-special-yacht-g-public-yacht-tour-south-korea?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busanticket_YachtGKKday" data-platform="KKDAY" data-section="ticket_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/111742-yacht-tour-in-busan/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_YachtGKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/things-to-do/detail/60344567?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D10278760" target="_blank" rel="noopener noreferrer" data-event="busanticket_YachtGTrip" data-platform="Trip" data-section="ticket_card">Trip</a>
            <a className="btn" href="https://www.instagram.com/yacht_g/" target="_blank" rel="noopener noreferrer" data-event="busanticket_YachtGIG" data-platform="IG" data-section="ticket_card">IG</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '未涵蓋',
    content: (
      <article key="gogoyacht" className="stay-card" data-area="未涵蓋">
        <div>
          <h3 className="title">GoGo Yacht｜水營灣遊艇</h3>
          <p className="meta">釜山Pass(✖)</p>
          <div className="actions">
            <a className="btn primary" href="https://www.klook.com/zh-TW/activity/111769-busan-haeundae-yacht-boat-tour/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_GoGoYachtKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/things-to-do/detail/102547075/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D10278760" target="_blank" rel="noopener noreferrer" data-event="busanticket_GoGoYachtTrip" data-platform="Trip" data-section="ticket_card">Trip</a>
            <a className="btn" href="https://www.instagram.com/gogo_yacht/" target="_blank" rel="noopener noreferrer" data-event="busanticket_GoGoYachtIG" data-platform="IG" data-section="ticket_card">IG</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '未涵蓋',
    content: (
      <article key="yachtwa" className="stay-card" data-area="未涵蓋">
        <div>
          <h3 className="title">Yachtwa｜水營灣遊艇</h3>
          <p className="meta">釜山Pass(✖)</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/261440?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busanticket_YachtwaKKday" data-platform="KKDAY" data-section="ticket_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/113270-busan-yacht-tour-by-yachtwa/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_YachtwaKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/things-to-do/detail/102085641/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D12650990" target="_blank" rel="noopener noreferrer" data-event="busanticket_YachtwaTrip" data-platform="Trip" data-section="ticket_card">Trip</a>
            <a className="btn" href="https://www.instagram.com/yachtwa1/" target="_blank" rel="noopener noreferrer" data-event="busanticket_YachtwaIG" data-platform="IG" data-section="ticket_card">IG</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '未涵蓋',
    content: (
      <article key="theyacht" className="stay-card" data-area="未涵蓋">
        <div>
          <h3 className="title">The Yacht｜水營灣遊艇</h3>
          <p className="meta">釜山Pass(✖)</p>
          <div className="actions">
            <a className="btn primary" href="https://www.klook.com/zh-TW/activity/141657-busan-yacht-tour-the-yacht-experience/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_TheYachtKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
            <a className="btn" href="https://www.instagram.com/__theyacht/" target="_blank" rel="noopener noreferrer" data-event="busanticket_TheYachtIG" data-platform="IG" data-section="ticket_card">IG</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '未涵蓋',
    content: (
      <article key="yholic" className="stay-card" data-area="未涵蓋">
        <div>
          <h3 className="title">Y Holic｜水營灣遊艇</h3>
          <p className="meta">釜山Pass(✖)</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/264977?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busanticket_YholicKKday" data-platform="KKDAY" data-section="ticket_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/136274-y-holic-yacht-experience-in-busan/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_YholicKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
            <a className="btn" href="https://www.instagram.com/yholic_kr/" target="_blank" rel="noopener noreferrer" data-event="busanticket_YholicIG" data-platform="IG" data-section="ticket_card">IG</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '未涵蓋',
    content: (
      <article key="ytale" className="stay-card" data-area="未涵蓋">
        <div>
          <h3 className="title">Yacht Tale｜水營灣遊艇</h3>
          <p className="meta">釜山Pass(✖)</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/146710?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busanticket_YTaleKKday" data-platform="KKDAY" data-section="ticket_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/111721-the-bay-101-public-yacht-in-busan/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_YTaleKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
            <a className="btn" href="https://www.instagram.com/yachttale.global" target="_blank" rel="noopener noreferrer" data-event="busanticket_YTaleIG" data-platform="IG" data-section="ticket_card">IG</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '未涵蓋',
    content: (
      <article key="sealife" className="stay-card" data-area="未涵蓋">
        <div>
          <h3 className="title">SEA LIFE 釜山水族館門票</h3>
          <p className="meta">釜山Pass(✖)</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/2880-sea-life-busan-aquarium-tickets-korea?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busanticket_SealifeKKday" data-platform="KKDAY" data-section="ticket_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/1251-sea-life-aquarium-busan/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_SealifeKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/travel-guide/attraction/busan/sealife-busan-aquarium-92862/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756" target="_blank" rel="noopener noreferrer" data-event="busanticket_SealifeTrip" data-platform="Trip" data-section="ticket_card">Trip</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '未涵蓋',
    content: (
      <article key="taizong" className="stay-card" data-area="未涵蓋">
        <div>
          <h3 className="title">太宗台海洋飛行主題樂園</h3>
          <p className="meta">釜山Pass(✖)</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/261443?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busanticket_TaizongKKday" data-platform="KKDAY" data-section="ticket_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/134035-taejongdae-ocean-flying-theme-park-ticket/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_TaizongKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/travel-guide/attraction/busan/taejongdae-ocean-flying-theme-park-147023939/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756" target="_blank" rel="noopener noreferrer" data-event="busanticket_TaizongTrip" data-platform="Trip" data-section="ticket_card">Trip</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '一日遊',
    content: (
      <article key="yiriyou" className="stay-card" data-area="一日遊">
        <div>
          <h3 className="title">釜山一日遊</h3>
          <p className="meta">一日遊票券</p>
          <div className="actions">
            <a className="btn primary" href="https://www.kkday.com/zh-tw/product/131061-busan-one-day-tour-south-korea?cid=22312" target="_blank" rel="noopener noreferrer" data-event="busanticket_yiriyouKKday" data-platform="KKDAY" data-section="ticket_card">KKDAY</a>
            <a className="btn" href="https://www.klook.com/zh-TW/activity/3298-east-coast-cultural-day-tour-busan/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="busanticket_yiriyouKLOOK" data-platform="KLOOK" data-section="ticket_card">KLOOK</a>
            <a className="btn" href="https://tw.trip.com/things-to-do/detail/89497025/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051" target="_blank" rel="noopener noreferrer" data-event="busanticket_yiriyouTrip" data-platform="Trip" data-section="ticket_card">Trip</a>
          </div>
        </div>
      </article>
    ),
  },
]

function filterCards(activeTab: string) {
  if (activeTab === 'all') return TICKET_CARDS
  return TICKET_CARDS.filter((c) => c.area === activeTab)
}

export default function BusanTicketContent() {
  const [activeTab, setActiveTab] = useState('all')

  const filtered = filterCards(activeTab)

  return (
    <>
      <AreaTabs tabs={TICKET_TABS} activeTab={activeTab} onTabChange={setActiveTab} gtagEvent="ticket_tab" />
      <section className="stay-list" id="stayList">
        {filtered.map(({ content }) => content)}
      </section>
    </>
  )
}
