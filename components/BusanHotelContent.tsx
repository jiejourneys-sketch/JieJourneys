'use client'

import { useState } from 'react'
import AreaTabs, { type TabItem } from './AreaTabs'

const HOTEL_TABS: TabItem[] = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '海雲台', label: '海雲台', dataArea: '海雲台' },
  { value: '廣安里', label: '廣安里', dataArea: '廣安里' },
  { value: '西面', label: '西面', dataArea: '西面' },
  { value: '南浦洞', label: '南浦洞', dataArea: '南浦洞' },
]

const HOTEL_CARDS: { area: string; content: React.ReactNode }[] = [
  {
    area: '海雲台',
    content: (
      <article key="h1" className="stay-card" data-area="海雲台" data-hotel="釜山朝昕經典飯店">
        <div>
          <h3 className="title">釜山朝昕經典飯店</h3>
          <p className="meta">海雲台｜5星級、看海景/室內外泳池/桑拿</p>
          <div className="actions">
            <a className="btn primary" href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=16933389" target="_blank" rel="noopener noreferrer" data-event="busanhotel_h1agoda" data-platform="Agoda" data-section="hotel_card">Agoda</a>
            <a className="btn" href="https://tw.trip.com/hotels/detail/?hotelId=67688375&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756" target="_blank" rel="noopener noreferrer" data-event="busanhotel_h1trip" data-platform="Trip" data-section="hotel_card">Trip</a>
            <a className="btn" href="https://maps.app.goo.gl/eEpyMhuq6zHcgZ4o6" target="_blank" rel="noopener noreferrer" data-event="busanhotel_h1map" data-platform="Maps" data-section="hotel_card">地圖</a>
            <a className="btn" href="https://naver.me/5JpyJnmn" target="_blank" rel="noopener noreferrer" data-event="busanhotel_h1navermap" data-platform="Navermap" data-section="hotel_card">Navermap</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '海雲台',
    content: (
      <article key="h2" className="stay-card" data-area="海雲台" data-hotel="L7海雲台">
        <div>
          <h3 className="title">L7海雲台</h3>
          <p className="meta">海雲台｜4星級/推海景房/服務好/位置佳</p>
          <div className="actions">
            <a className="btn primary" href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=52027642" target="_blank" rel="noopener noreferrer" data-event="busanhotel_h2agoda" data-platform="Agoda" data-section="hotel_card">Agoda</a>
            <a className="btn" href="https://tw.trip.com/hotels/detail/?hotelId=118354608&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5657612" target="_blank" rel="noopener noreferrer" data-event="busanhotel_h2trip" data-platform="Trip" data-section="hotel_card">Trip</a>
            <a className="btn" href="https://maps.app.goo.gl/X6oMig8hjY1qMFNWA" target="_blank" rel="noopener noreferrer" data-event="busanhotel_h2map" data-platform="Maps" data-section="hotel_card">地圖</a>
            <a className="btn" href="https://naver.me/GBFHgVBy" target="_blank" rel="noopener noreferrer" data-event="busanhotel_h2navermap" data-platform="Navermap" data-section="hotel_card">Navermap</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '海雲台',
    content: (
      <article key="h3" className="stay-card" data-area="海雲台" data-hotel="柯榮海雲飯店">
        <div>
          <h3 className="title">柯榮海雲飯店</h3>
          <p className="meta">海雲台｜4星級、房間乾淨/員工親切/早餐好吃</p>
          <div className="actions">
            <a className="btn primary" href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=108254" target="_blank" rel="noopener noreferrer" data-event="busanhotel_h3agoda" data-platform="Agoda" data-section="hotel_card">Agoda</a>
            <a className="btn" href="https://tw.trip.com/hotels/detail/?hotelId=689035&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756" target="_blank" rel="noopener noreferrer" data-event="busanhotel_h3trip" data-platform="Trip" data-section="hotel_card">Trip</a>
            <a className="btn" href="https://maps.app.goo.gl/B1KajwWoH7RPqJNAA" target="_blank" rel="noopener noreferrer" data-event="busanhotel_h3map" data-platform="Maps" data-section="hotel_card">地圖</a>
            <a className="btn" href="https://naver.me/GdymWL1B" target="_blank" rel="noopener noreferrer" data-event="busanhotel_h3navermap" data-platform="Navermap" data-section="hotel_card">Navermap</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '海雲台',
    content: (
      <article key="h4" className="stay-card" data-area="海雲台" data-hotel="UH Suite 海雲台飯店">
        <div>
          <h3 className="title">UH Suite 海雲台飯店</h3>
          <p className="meta">海雲台｜3星級、高CP值/乾淨舒適/員工貼心</p>
          <div className="actions">
            <a className="btn primary" href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=34716204" target="_blank" rel="noopener noreferrer" data-event="busanhotel_h4agoda" data-platform="Agoda" data-section="hotel_card">Agoda</a>
            <a className="btn" href="https://tw.trip.com/hotels/detail/?hotelId=80920363&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756" target="_blank" rel="noopener noreferrer" data-event="busanhotel_h4trip" data-platform="Trip" data-section="hotel_card">Trip</a>
            <a className="btn" href="https://maps.app.goo.gl/aBkyneDug5oZfxZi8" target="_blank" rel="noopener noreferrer" data-event="busanhotel_h4map" data-platform="Maps" data-section="hotel_card">地圖</a>
            <a className="btn" href="https://naver.me/GtURVWFr" target="_blank" rel="noopener noreferrer" data-event="busanhotel_h4navermap" data-platform="Navermap" data-section="hotel_card">Navermap</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '廣安里',
    content: (
      <article key="g1" className="stay-card" data-area="廣安里" data-hotel="廣安裡凱星頓肯特飯店">
        <div>
          <h3 className="title">廣安裡凱星頓肯特飯店</h3>
          <p className="meta">廣安里｜4星級、頂樓景色/房間舒適/員工友善</p>
          <div className="actions">
            <a className="btn primary" href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=1200577" target="_blank" rel="noopener noreferrer" data-event="busanhotel_g1agoda" data-platform="Agoda" data-section="hotel_card">Agoda</a>
            <a className="btn" href="https://tw.trip.com/hotels/detail/?hotelId=5215454&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5657612" target="_blank" rel="noopener noreferrer" data-event="busanhotel_g1trip" data-platform="Trip" data-section="hotel_card">Trip</a>
            <a className="btn" href="https://maps.app.goo.gl/JUVJ4wqsmy6Mcj8D9" target="_blank" rel="noopener noreferrer" data-event="busanhotel_g1map" data-platform="Maps" data-section="hotel_card">地圖</a>
            <a className="btn" href="https://naver.me/58Ndpwlc" target="_blank" rel="noopener noreferrer" data-event="busanhotel_g1navermap" data-platform="Navermap" data-section="hotel_card">Navermap</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '廣安里',
    content: (
      <article key="g2" className="stay-card" data-area="廣安里" data-hotel="霍默斯飯店">
        <div>
          <h3 className="title">霍默斯飯店</h3>
          <p className="meta">廣安里｜4星級/海景/方便/員工客氣</p>
          <div className="actions">
            <a className="btn primary" href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=240305" target="_blank" rel="noopener noreferrer" data-event="busanhotel_g2agoda" data-platform="Agoda" data-section="hotel_card">Agoda</a>
            <a className="btn" href="https://tw.trip.com/hotels/detail/?hotelId=1171946&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756" target="_blank" rel="noopener noreferrer" data-event="busanhotel_g2trip" data-platform="Trip" data-section="hotel_card">Trip</a>
            <a className="btn" href="https://maps.app.goo.gl/wvvMxn2ey7WUpAgJ7" target="_blank" rel="noopener noreferrer" data-event="busanhotel_g2map" data-platform="Maps" data-section="hotel_card">地圖</a>
            <a className="btn" href="https://naver.me/xl0DZUXO" target="_blank" rel="noopener noreferrer" data-event="busanhotel_g2navermap" data-platform="Navermap" data-section="hotel_card">Navermap</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '廣安里',
    content: (
      <article key="g3" className="stay-card" data-area="廣安里" data-hotel="水上皇宮大飯店">
        <div>
          <h3 className="title">水上皇宮大飯店</h3>
          <p className="meta">廣安里｜4星級、推薦海景房/位置好/服務好</p>
          <div className="actions">
            <a className="btn primary" href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=240303" target="_blank" rel="noopener noreferrer" data-event="busanhotel_g3agoda" data-platform="Agoda" data-section="hotel_card">Agoda</a>
            <a className="btn" href="https://tw.trip.com/hotels/detail/?hotelId=689065&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5657612" target="_blank" rel="noopener noreferrer" data-event="busanhotel_g3trip" data-platform="Trip" data-section="hotel_card">Trip</a>
            <a className="btn" href="https://maps.app.goo.gl/sbokB8q8js3mtuSz9" target="_blank" rel="noopener noreferrer" data-event="busanhotel_g3map" data-platform="Maps" data-section="hotel_card">地圖</a>
            <a className="btn" href="https://naver.me/x7ndal5i" target="_blank" rel="noopener noreferrer" data-event="busanhotel_g3navermap" data-platform="Navermap" data-section="hotel_card">Navermap</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '廣安里',
    content: (
      <article key="g4" className="stay-card" data-area="廣安里" data-hotel="HyoiStay 廣安">
        <div>
          <h3 className="title">HyoiStay 廣安</h3>
          <p className="meta">廣安里｜3星級、高CP值</p>
          <div className="actions">
            <a className="btn primary" href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=71872051" target="_blank" rel="noopener noreferrer" data-event="busanhotel_g4agoda" data-platform="Agoda" data-section="hotel_card">Agoda</a>
            <a className="btn" href="https://tw.trip.com/hotels/detail/?hotelId=123248283&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756" target="_blank" rel="noopener noreferrer" data-event="busanhotel_g4trip" data-platform="Trip" data-section="hotel_card">Trip</a>
            <a className="btn" href="https://maps.app.goo.gl/tBbaaX3X2udKxfTR8" target="_blank" rel="noopener noreferrer" data-event="busanhotel_g4map" data-platform="Maps" data-section="hotel_card">地圖</a>
            <a className="btn" href="https://naver.me/x7ndal5i" target="_blank" rel="noopener noreferrer" data-event="busanhotel_g4navermap" data-platform="Navermap" data-section="hotel_card">Navermap</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '西面',
    content: (
      <article key="x1" className="stay-card" data-area="西面" data-hotel="釜山樂天飯店">
        <div>
          <h3 className="title">釜山樂天飯店</h3>
          <p className="meta">西面｜5星級、泳池/水療/高爾夫/早餐豐富</p>
          <div className="actions">
            <a className="btn primary" href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=42958" target="_blank" rel="noopener noreferrer" data-event="busanhotel_x1agoda" data-platform="Agoda" data-section="hotel_card">Agoda</a>
            <a className="btn" href="https://tw.trip.com/hotels/detail/?hotelId=19517030&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756" target="_blank" rel="noopener noreferrer" data-event="busanhotel_x1trip" data-platform="Trip" data-section="hotel_card">Trip</a>
            <a className="btn" href="https://maps.app.goo.gl/4iq7zmYd7GqLouem7" target="_blank" rel="noopener noreferrer" data-event="busanhotel_x1map" data-platform="Maps" data-section="hotel_card">地圖</a>
            <a className="btn" href="https://naver.me/5oE5yZxp" target="_blank" rel="noopener noreferrer" data-event="busanhotel_x1navermap" data-platform="Navermap" data-section="hotel_card">Navermap</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '西面',
    content: (
      <article key="x2" className="stay-card" data-area="西面" data-hotel="釜山商務飯店">
        <div>
          <h3 className="title">釜山商務飯店</h3>
          <p className="meta">西面｜3星級、位置便利/客房寬敞/員工友好</p>
          <div className="actions">
            <a className="btn primary" href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=872338" target="_blank" rel="noopener noreferrer" data-event="busanhotel_x2agoda" data-platform="Agoda" data-section="hotel_card">Agoda</a>
            <a className="btn" href="https://tw.trip.com/hotels/detail/?hotelId=1800916&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5657612" target="_blank" rel="noopener noreferrer" data-event="busanhotel_x2trip" data-platform="Trip" data-section="hotel_card">Trip</a>
            <a className="btn" href="https://maps.app.goo.gl/PriDj76ZkV3iHw3M9" target="_blank" rel="noopener noreferrer" data-event="busanhotel_x2map" data-platform="Maps" data-section="hotel_card">地圖</a>
            <a className="btn" href="https://naver.me/xVBxH62B" target="_blank" rel="noopener noreferrer" data-event="busanhotel_x2navermap" data-platform="Navermap" data-section="hotel_card">Navermap</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '西面',
    content: (
      <article key="x3" className="stay-card" data-area="西面" data-hotel="西面棕色點點商務飯店">
        <div>
          <h3 className="title">西面棕色點點商務飯店</h3>
          <p className="meta">西面｜3星級、乾淨寬敞/浴缸/服務親切</p>
          <div className="actions">
            <a className="btn primary" href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=6587451" target="_blank" rel="noopener noreferrer" data-event="busanhotel_x3agoda" data-platform="Agoda" data-section="hotel_card">Agoda</a>
            <a className="btn" href="https://tw.trip.com/hotels/detail/?hotelId=26595397&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756" target="_blank" rel="noopener noreferrer" data-event="busanhotel_x3trip" data-platform="Trip" data-section="hotel_card">Trip</a>
            <a className="btn" href="https://maps.app.goo.gl/HGm6431LXQSaL8mh9" target="_blank" rel="noopener noreferrer" data-event="busanhotel_x3map" data-platform="Maps" data-section="hotel_card">地圖</a>
            <a className="btn" href="https://naver.me/GXAa98fL" target="_blank" rel="noopener noreferrer" data-event="busanhotel_x3navermap" data-platform="Navermap" data-section="hotel_card">Navermap</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '西面',
    content: (
      <article key="x4" className="stay-card" data-area="西面" data-hotel="釜山西面皇后飯店">
        <div>
          <h3 className="title">釜山西面皇后飯店</h3>
          <p className="meta">西面｜3星級、高CP值/浴缸/洗衣機/用餐區</p>
          <div className="actions">
            <a className="btn primary" href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=276008" target="_blank" rel="noopener noreferrer" data-event="busanhotel_x4agoda" data-platform="Agoda" data-section="hotel_card">Agoda</a>
            <a className="btn" href="https://tw.trip.com/hotels/detail/?hotelId=689041&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756" target="_blank" rel="noopener noreferrer" data-event="busanhotel_x4trip" data-platform="Trip" data-section="hotel_card">Trip</a>
            <a className="btn" href="https://maps.app.goo.gl/U117AYPWgSFzFhhv5" target="_blank" rel="noopener noreferrer" data-event="busanhotel_x4map" data-platform="Maps" data-section="hotel_card">地圖</a>
            <a className="btn" href="https://naver.me/5mIHoOK4" target="_blank" rel="noopener noreferrer" data-event="busanhotel_x4navermap" data-platform="Navermap" data-section="hotel_card">Navermap</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '南浦洞',
    content: (
      <article key="n1" className="stay-card" data-area="南浦洞" data-hotel="釜山斯坦福飯店">
        <div>
          <h3 className="title">釜山斯坦福飯店</h3>
          <p className="meta">南浦洞｜4星級、客房乾淨/浴缸/位置好</p>
          <div className="actions">
            <a className="btn primary" href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=2233941" target="_blank" rel="noopener noreferrer" data-event="busanhotel_n1agoda" data-platform="Agoda" data-section="hotel_card">Agoda</a>
            <a className="btn" href="https://tw.trip.com/hotels/detail/?hotelId=11221494&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5657612" target="_blank" rel="noopener noreferrer" data-event="busanhotel_n1trip" data-platform="Trip" data-section="hotel_card">Trip</a>
            <a className="btn" href="https://maps.app.goo.gl/Xp7v5medDsYhNP989" target="_blank" rel="noopener noreferrer" data-event="busanhotel_n1map" data-platform="Maps" data-section="hotel_card">地圖</a>
            <a className="btn" href="https://naver.me/xP8mLa2B" target="_blank" rel="noopener noreferrer" data-event="busanhotel_n1navermap" data-platform="Navermap" data-section="hotel_card">Navermap</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '南浦洞',
    content: (
      <article key="n2" className="stay-card" data-area="南浦洞" data-hotel="弗萊特普瑞米爾南浦飯店">
        <div>
          <h3 className="title">弗萊特普瑞米爾南浦飯店</h3>
          <p className="meta">南浦洞｜4星級、客房整潔/咖啡機/大廳按摩椅</p>
          <div className="actions">
            <a className="btn primary" href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=1979568" target="_blank" rel="noopener noreferrer" data-event="busanhotel_n2agoda" data-platform="Agoda" data-section="hotel_card">Agoda</a>
            <a className="btn" href="https://tw.trip.com/hotels/detail/?hotelId=1245935&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756" target="_blank" rel="noopener noreferrer" data-event="busanhotel_n2trip" data-platform="Trip" data-section="hotel_card">Trip</a>
            <a className="btn" href="https://maps.app.goo.gl/E5RoALJ2v948s32aA" target="_blank" rel="noopener noreferrer" data-event="busanhotel_n2map" data-platform="Maps" data-section="hotel_card">地圖</a>
            <a className="btn" href="https://naver.me/5uIYbdXN" target="_blank" rel="noopener noreferrer" data-event="busanhotel_n2navermap" data-platform="Navermap" data-section="hotel_card">Navermap</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '南浦洞',
    content: (
      <article key="n3" className="stay-card" data-area="南浦洞" data-hotel="格里芬灣飯店">
        <div>
          <h3 className="title">格里芬灣飯店</h3>
          <p className="meta">南浦洞｜4星級、服務親切/乾淨舒適/有景觀</p>
          <div className="actions">
            <a className="btn primary" href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=29383239" target="_blank" rel="noopener noreferrer" data-event="busanhotel_n3agoda" data-platform="Agoda" data-section="hotel_card">Agoda</a>
            <a className="btn" href="https://tw.trip.com/hotels/detail/?hotelId=83246612&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5657612" target="_blank" rel="noopener noreferrer" data-event="busanhotel_n3trip" data-platform="Trip" data-section="hotel_card">Trip</a>
            <a className="btn" href="https://maps.app.goo.gl/QUy64Xqy6QdNp5867" target="_blank" rel="noopener noreferrer" data-event="busanhotel_n3map" data-platform="Maps" data-section="hotel_card">地圖</a>
            <a className="btn" href="https://naver.me/5huaDzae" target="_blank" rel="noopener noreferrer" data-event="busanhotel_n3navermap" data-platform="Navermap" data-section="hotel_card">Navermap</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '南浦洞',
    content: (
      <article key="n4" className="stay-card" data-area="南浦洞" data-hotel="都市精品南浦BIFF飯店">
        <div>
          <h3 className="title">都市精品南浦BIFF飯店</h3>
          <p className="meta">南浦洞｜3星級、高CP值/位置好/洗衣機/咖啡機</p>
          <div className="actions">
            <a className="btn primary" href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw&hid=37001556" target="_blank" rel="noopener noreferrer" data-event="busanhotel_n4agoda" data-platform="Agoda" data-section="hotel_card">Agoda</a>
            <a className="btn" href="https://tw.trip.com/hotels/detail/?hotelId=108840703&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756" target="_blank" rel="noopener noreferrer" data-event="busanhotel_n4trip" data-platform="Trip" data-section="hotel_card">Trip</a>
            <a className="btn" href="https://maps.app.goo.gl/YWBYX1srDPvJVGXr7" target="_blank" rel="noopener noreferrer" data-event="busanhotel_n4map" data-platform="Maps" data-section="hotel_card">地圖</a>
            <a className="btn" href="https://naver.me/xzxwDC6N" target="_blank" rel="noopener noreferrer" data-event="busanhotel_n4navermap" data-platform="Navermap" data-section="hotel_card">Navermap</a>
          </div>
        </div>
      </article>
    ),
  },
]

function filterCards(activeTab: string) {
  if (activeTab === 'all') return HOTEL_CARDS
  return HOTEL_CARDS.filter((c) => c.area === activeTab)
}

export default function BusanHotelContent() {
  const [activeTab, setActiveTab] = useState('all')

  const filtered = filterCards(activeTab)

  return (
    <>
      <section className="stay-list" id="videoList">
        <article className="stay-card" data-video="hotel-20s" data-title="住宿選擇，20秒看懂">
          <h3 className="title">住宿選擇，20秒看懂</h3>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DNarO86zk_v/" target="_blank" rel="noopener noreferrer" data-event="busanhotel_IGvideo" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/BJxtiKK-Lxk" target="_blank" rel="noopener noreferrer" data-event="busanhotel_YTvideo" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/5qAuAKeAyZA" target="_blank" rel="noopener noreferrer" data-event="busanhotel_XHSvideo" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </article>
      </section>

      <h2>釜山住宿精選</h2>

      <AreaTabs tabs={HOTEL_TABS} activeTab={activeTab} onTabChange={setActiveTab} gtagEvent="hotel_tab" />
      <section className="stay-list" id="stayList">
        {filtered.map(({ content }) => content)}
      </section>
    </>
  )
}
