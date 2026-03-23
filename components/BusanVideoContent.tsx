'use client'

import { useState } from 'react'
import AreaTabs, { type TabItem } from './AreaTabs'

const VIDEO_TABS: TabItem[] = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '認識釜山', label: '認識釜山', dataArea: '認識釜山' },
  { value: '景點攻略', label: '景點攻略', dataArea: '景點攻略' },
  { value: '行前準備', label: '行前準備', dataArea: '行前準備' },
  { value: '釜山通行證', label: '釜山通行證', dataArea: '釜山通行證' },
]

const VIDEO_CARDS: { area: string; content: React.ReactNode }[] = [
  {
    area: '認識釜山',
    content: (
      <article key="intro-is-busan-for-you" className="stay-card" data-area="認識釜山" data-video="intro-is-busan-for-you" data-title="韓國釜山｜適合你？">
        <div>
          <h3 className="title">韓國釜山｜適合你？</h3>
          <p className="meta">認識釜山</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DObDFXuEZFE/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_suitableIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/eYMppYSyIqE" target="_blank" rel="noopener noreferrer" data-event="busanvideo_suitableYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/Afwwt6vbBcq" target="_blank" rel="noopener noreferrer" data-event="busanvideo_suitableXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '認識釜山',
    content: (
      <article key="first-impressions" className="stay-card" data-area="認識釜山" data-video="first-impressions-pros-cons" data-title="印象篇｜好 vs 壞">
        <div>
          <h3 className="title">印象篇｜好 vs 壞</h3>
          <p className="meta">認識釜山</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DO_GKX3kY0F/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_goodvsbadIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/a0hXPor4PfI" target="_blank" rel="noopener noreferrer" data-event="busanvideo_goodvsbadYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/8OJPt7iurEH" target="_blank" rel="noopener noreferrer" data-event="busanvideo_goodvsbadXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '認識釜山',
    content: (
      <article key="food-pros-cons" className="stay-card" data-area="認識釜山" data-video="food-pros-cons" data-title="美食篇｜好 vs 壞">
        <div>
          <h3 className="title">美食篇｜好 vs 壞</h3>
          <p className="meta">認識釜山</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DPG0jR5ElNi/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_goodvsbadfoodIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/CZY0NzKSnOY" target="_blank" rel="noopener noreferrer" data-event="busanvideo_goodvsbadfoodYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/2RYtrtA2yTU" target="_blank" rel="noopener noreferrer" data-event="busanvideo_goodvsbadfoodXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '景點攻略',
    content: (
      <article key="fast-guide-1" className="stay-card" data-area="景點攻略" data-video="fast-guide-part-1" data-title="最速攻略｜上集">
        <div>
          <h3 className="title">最速攻略｜上集</h3>
          <p className="meta">景點攻略</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DK4dIqzzJBE/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_gonglue1IG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/r19k0otvGVE" target="_blank" rel="noopener noreferrer" data-event="busanvideo_gonglue1YT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/5H7XNWErVN8" target="_blank" rel="noopener noreferrer" data-event="busanvideo_gonglue1XHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '景點攻略',
    content: (
      <article key="fast-guide-2" className="stay-card" data-area="景點攻略" data-video="fast-guide-part-2" data-title="最速攻略｜下集">
        <div>
          <h3 className="title">最速攻略｜下集</h3>
          <p className="meta">景點攻略</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DLCwV2yzbSv/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_gonglue2IG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/Mtn35FzOeis" target="_blank" rel="noopener noreferrer" data-event="busanvideo_gonglue2YT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/4BhS0NKboYQ" target="_blank" rel="noopener noreferrer" data-event="busanvideo_gonglue2XHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '景點攻略',
    content: (
      <article key="nampo-1" className="stay-card" data-area="景點攻略" data-video="nampo-part-1" data-title="南浦洞｜上集">
        <div>
          <h3 className="title">南浦洞｜上集</h3>
          <p className="meta">景點攻略</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DLKer30zmDd/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_nanpu1IG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/wN0KHurau78" target="_blank" rel="noopener noreferrer" data-event="busanvideo_nanpu1YT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/7tpySmrFK2M" target="_blank" rel="noopener noreferrer" data-event="busanvideo_nanpu1IGXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '景點攻略',
    content: (
      <article key="nampo-2" className="stay-card" data-area="景點攻略" data-video="nampo-part-2" data-title="南浦洞｜下集">
        <div>
          <h3 className="title">南浦洞｜下集</h3>
          <p className="meta">景點攻略</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DLeby5yTVTm/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_nanpu2IG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/R8bRLgm5HEA" target="_blank" rel="noopener noreferrer" data-event="busanvideo_nanpu2YT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/14X5o08d827" target="_blank" rel="noopener noreferrer" data-event="busanvideo_nanpu2XHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '景點攻略',
    content: (
      <article key="gamcheon" className="stay-card" data-area="景點攻略" data-video="gamcheon-culture-village" data-title="甘川洞文化村">
        <div>
          <h3 className="title">甘川洞文化村</h3>
          <p className="meta">景點攻略</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DL408o_ze1X/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_xiaowangziIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/RZREPyNT-Fo" target="_blank" rel="noopener noreferrer" data-event="busanvideo_xiaowangziYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/2aUewZPzJ9U" target="_blank" rel="noopener noreferrer" data-event="busanvideo_xiaowangziXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '景點攻略',
    content: (
      <article key="busan-tower" className="stay-card" data-area="景點攻略" data-video="busan-tower" data-title="釜山塔">
        <div>
          <h3 className="title">釜山塔</h3>
          <p className="meta">景點攻略</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DMKh_XmzOdG/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_towerIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/e3-R4YEj7Cw" target="_blank" rel="noopener noreferrer" data-event="busanvideo_towerYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/9rE8N60xj96" target="_blank" rel="noopener noreferrer" data-event="busanvideo_towerXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '景點攻略',
    content: (
      <article key="haeundae" className="stay-card" data-area="景點攻略" data-video="haeundae" data-title="海雲台">
        <div>
          <h3 className="title">海雲台</h3>
          <p className="meta">景點攻略</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DLuh1WzzM0c/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_haiyuntaiIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/T0aTv6PPxMQ" target="_blank" rel="noopener noreferrer" data-event="busanvideo_haiyuntaiYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/Bt9siwbllz" target="_blank" rel="noopener noreferrer" data-event="busanvideo_haiyuntaiXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '景點攻略',
    content: (
      <article key="capsule-train" className="stay-card" data-area="景點攻略" data-video="capsule-train" data-title="膠囊列車">
        <div>
          <h3 className="title">膠囊列車</h3>
          <p className="meta">景點攻略</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DMu5uZxTdO8/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_SkycapIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/NojyZ8jfvD4" target="_blank" rel="noopener noreferrer" data-event="busanvideo_SkycapYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/4JILJiyezmL" target="_blank" rel="noopener noreferrer" data-event="busanvideo_SkycapXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '景點攻略',
    content: (
      <article key="yacht" className="stay-card" data-area="景點攻略" data-video="yacht" data-title="水營灣 VS 鑽石灣｜遊艇">
        <div>
          <h3 className="title">水營灣 VS 鑽石灣｜遊艇</h3>
          <p className="meta">景點攻略</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DVTW_MLkpj4/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_YachtIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/N56k5869RVw" target="_blank" rel="noopener noreferrer" data-event="busanvideo_YachtYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/8B2iEV9P095" target="_blank" rel="noopener noreferrer" data-event="busanvideo_YachtXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '行前準備',
    content: (
      <article key="prep-5" className="stay-card" data-area="行前準備" data-video="prep-5-tips" data-title="5個行前準備">
        <div>
          <h3 className="title">5個行前準備</h3>
          <p className="meta">行前準備</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DOixfbBEaCL/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_5prepareIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/6K3yI0WrO9k" target="_blank" rel="noopener noreferrer" data-event="busanvideo_5prepareYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/6GMt6r34xoA" target="_blank" rel="noopener noreferrer" data-event="busanvideo_5prepareXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '行前準備',
    content: (
      <article key="e-arrival" className="stay-card" data-area="行前準備" data-video="korea-e-arrival-card" data-title="電子入境卡">
        <div>
          <h3 className="title">電子入境卡</h3>
          <p className="meta">行前準備</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DKMrn6dzS4G/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_earrivalIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/L_FmuAzoGzM" target="_blank" rel="noopener noreferrer" data-event="busanvideo_earrivalYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/7C7nTIpO8gw" target="_blank" rel="noopener noreferrer" data-event="busanvideo_earrivalXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '行前準備',
    content: (
      <article key="keta" className="stay-card" data-area="行前準備" data-video="keta-need-or-not" data-title="K-ETA是否要申請？">
        <div>
          <h3 className="title">K-ETA是否要申請？</h3>
          <p className="meta">行前準備</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DKetNmXTW3E/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_ketaIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/AXevOEDDzB0" target="_blank" rel="noopener noreferrer" data-event="busanvideo_ketaYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/Y3KqLBooSA" target="_blank" rel="noopener noreferrer" data-event="busanvideo_ketaIGXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '行前準備',
    content: (
      <article key="currency" className="stay-card" data-area="行前準備" data-video="currency-exchange" data-title="韓幣怎麼換？">
        <div>
          <h3 className="title">韓幣怎麼換？</h3>
          <p className="meta">行前準備</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DKetKpgTvd7/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_currencyIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/ROLLp6mm5p8" target="_blank" rel="noopener noreferrer" data-event="busanvideo_currencyYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/2ZXIOZhpkUP" target="_blank" rel="noopener noreferrer" data-event="busanvideo_currencyXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '行前準備',
    content: (
      <article key="powerbank" className="stay-card" data-area="行前準備" data-video="powerbank-rules" data-title="行動電源規定">
        <div>
          <h3 className="title">行動電源規定</h3>
          <p className="meta">行前準備</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DKmbjKIzsAT/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_powerbankIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/e_7nNXvRhzw" target="_blank" rel="noopener noreferrer" data-event="busanvideo_powerbankYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/n23KDIzNFN" target="_blank" rel="noopener noreferrer" data-event="busanvideo_powerbankXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '行前準備',
    content: (
      <article key="lotte-mart" className="stay-card" data-area="行前準備" data-video="lotte-mart-membership" data-title="樂天超市｜會員申請">
        <div>
          <h3 className="title">樂天超市｜會員申請</h3>
          <p className="meta">行前準備</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DKwurF0Te2B/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_lotteIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/-CMAajmCatg" target="_blank" rel="noopener noreferrer" data-event="busanvideo_lotteYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/1RAg32kAWXa" target="_blank" rel="noopener noreferrer" data-event="busanvideo_lotteXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '行前準備',
    content: (
      <article key="5d4n" className="stay-card" data-area="行前準備" data-video="5d4n-ultimate-route" data-title="5天4夜終極攻略">
        <div>
          <h3 className="title">5天4夜終極攻略</h3>
          <p className="meta">行前準備</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DOQv5njkT4I/" target="_blank" rel="noopener noreferrer" data-event="busanvideo_PDFIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/jFq8fhtV4qg" target="_blank" rel="noopener noreferrer" data-event="busanvideo_PDFYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/6pvpm14xKAn" target="_blank" rel="noopener noreferrer" data-event="busanvideo_PDFXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '釜山通行證',
    content: (
      <article key="pass-24-48" className="stay-card" data-area="釜山通行證" data-video="pass-24-48-3-5" data-title="釜山通行證重點">
        <div>
          <h3 className="title">釜山通行證重點</h3>
          <p className="meta">釜山通行證</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DUDiZzQkdUe/" target="_blank" rel="noopener noreferrer" data-event="busan_video_pass2026" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/ppTGbWXDM0k" target="_blank" rel="noopener noreferrer" data-event="busan_video_pass2026YT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/6QHeZo5sDIU" target="_blank" rel="noopener noreferrer" data-event="busan_video_pass2026XHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '釜山通行證',
    content: (
      <article key="paper-vs-e" className="stay-card" data-area="釜山通行證" data-video="paper-vs-e" data-title="選擇重點｜實體 vs 電子">
        <div>
          <h3 className="title">選擇重點｜實體 vs 電子</h3>
          <p className="meta">釜山通行證</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DN-uWhB4gI2/" target="_blank" rel="noopener noreferrer" data-event="busan_video_shitikaIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/rdT-NNXjR-c" target="_blank" rel="noopener noreferrer" data-event="busan_video_shitikaYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/Acl0InJBYX" target="_blank" rel="noopener noreferrer" data-event="busan_video_shitikaXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '釜山通行證',
    content: (
      <article key="pass-24h" className="stay-card" data-area="釜山通行證" data-video="pass-24h-route" data-title="24小時極限走法">
        <div>
          <h3 className="title">24小時極限走法</h3>
          <p className="meta">釜山通行證</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DOJBfeBEdwN/" target="_blank" rel="noopener noreferrer" data-event="busan_video_24hrIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/e2aeNYmKc38" target="_blank" rel="noopener noreferrer" data-event="busan_video_24hrYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/3FDCBVxXvBI" target="_blank" rel="noopener noreferrer" data-event="busan_video_24hrXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '釜山通行證',
    content: (
      <article key="pass-48h" className="stay-card" data-area="釜山通行證" data-video="pass-48h-route" data-title="48小時走法">
        <div>
          <h3 className="title">48小時走法</h3>
          <p className="meta">釜山通行證</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DO0y_wnEUa9/" target="_blank" rel="noopener noreferrer" data-event="busan_video_48hrIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/kuU-6nMmR4Y" target="_blank" rel="noopener noreferrer" data-event="busan_video_48hrYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/3F9AZrkzSsZ" target="_blank" rel="noopener noreferrer" data-event="busan_video_48hrXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '釜山通行證',
    content: (
      <article key="capsule-platform" className="stay-card" data-area="釜山通行證" data-video="capsule-platform" data-title="平台｜膠囊列車訂票">
        <div>
          <h3 className="title">平台｜膠囊列車訂票</h3>
          <p className="meta">釜山通行證</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DNIpqn1TE0k/" target="_blank" rel="noopener noreferrer" data-event="busan_video_skycapKKdayIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/kSCoYLXAMUA" target="_blank" rel="noopener noreferrer" data-event="busan_video_skycapKKdayYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/360E8ch54PQ" target="_blank" rel="noopener noreferrer" data-event="busan_video_skycapKKdayXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
  {
    area: '釜山通行證',
    content: (
      <article key="capsule-official" className="stay-card" data-area="釜山通行證" data-video="capsule-official" data-title="官網｜膠囊列車訂票">
        <div>
          <h3 className="title">官網｜膠囊列車訂票</h3>
          <p className="meta">釜山通行證</p>
          <div className="actions">
            <a className="btn primary" href="https://www.instagram.com/reel/DNarLsDTe2F/" target="_blank" rel="noopener noreferrer" data-event="busan_video_skycapOffIG" data-platform="IG" data-section="video">IG Reels</a>
            <a className="btn" href="https://www.youtube.com/shorts/yoQdWHM6rbY" target="_blank" rel="noopener noreferrer" data-event="busan_video_skycapOffYT" data-platform="YouTube" data-section="video">YouTube</a>
            <a className="btn" href="https://xhslink.com/o/1oBgYLxzIKk" target="_blank" rel="noopener noreferrer" data-event="busan_video_skycapOffXHS" data-platform="小紅書" data-section="video">小紅書</a>
          </div>
        </div>
      </article>
    ),
  },
]

function filterCards(activeTab: string) {
  if (activeTab === 'all') return VIDEO_CARDS
  return VIDEO_CARDS.filter((c) => c.area === activeTab)
}

export default function BusanVideoContent() {
  const [activeTab, setActiveTab] = useState('all')

  const filtered = filterCards(activeTab)

  return (
    <>
      <AreaTabs tabs={VIDEO_TABS} activeTab={activeTab} onTabChange={setActiveTab} gtagEvent="video_tab" />
      <section className="stay-list" id="stayList">
        {filtered.map(({ content }) => content)}
      </section>
    </>
  )
}
