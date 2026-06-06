import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { tokyoHotelCards, tokyoHotelTabs } from '@/data/tokyo'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'

export default function TokyoHotelPage() {
  return (
    <>
      <CitySubpageHeader backHref="/tokyo" eventPrefix="tokyohotel" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="東京自由行攻略"
          h1="東京住宿推薦｜新宿、淺草、澀谷、上野、東京車站區域完整分析"
          intro="東京住宿區域眾多，選對位置能大幅節省移動時間。本頁整理各區特色與適合對象，幫你快速找到最適合的住宿地點。"
          eventPrefix="tokyohotel"
          showVisual={false}
          videoLinks={[
            {
              label: 'IG Reels',
              href: 'https://www.instagram.com/reel/DW_gXCOy5wO/',
              dataEvent: 'tokyohotel_IGvideo',
              platform: 'IG',
            },
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/shorts/0z0lwoOZCZA',
              dataEvent: 'tokyohotel_YTvideo',
              platform: 'YouTube',
            },
            {
              label: '小紅書',
              href: 'https://xhslink.com/o/2qBEY9jZR0G',
              dataEvent: 'tokyohotel_XHSvideo',
              platform: '小紅書',
            },
          ]}

          ctaLinks={[
            { label: '東京短影片攻略', href: 'https://www.jiejourneys.com/tokyo/video', dataEvent: 'tokyohotel_allvideos', platform: 'video' },
            { label: '東京票券總整理', href: 'https://www.jiejourneys.com/tokyo/ticket', dataEvent: 'tokyohotel_alltickets', platform: 'ticket' },
            { label: '通訊&交通攻略', href: 'https://www.jiejourneys.com/tokyo/transport', dataEvent: 'tokyohotel_alltransport', platform: 'transport' },
          ]}
        />

        <h2 className="seo-h2" id="stayListTitle">東京住宿推薦飯店</h2>
        <CityTabbedList tabs={tokyoHotelTabs} cards={tokyoHotelCards} tabEvent="tokyo_hotel_tab" />

        <SeoCtaSection text="" href="/tokyo/map" linkText="東京住宿地圖" newTab dataEvent="tokyohotel_SEO_map" />

        <SeoContentSection title="東京住宿區域怎麼選？">
          <h3 className="seo-h3">上野（機場進市區最方便）</h3>
          <p>
            上野最大優點是<strong>Skyliner 可以直達</strong>，速度快又省事，對大多數從成田機場進東京的人來說很方便。
          </p>

          <h3 className="seo-h3">淺草寺周邊（相對便宜、偏生活感）</h3>
          <p>
            想找比較便宜的住宿，可以看淺草寺周邊。
            <br />
            交通上通常是上野轉車，或是搭 <strong>Access 特急</strong> 直達淺草方向。
          </p>

          <h3 className="seo-h3">東京車站（最中心，去哪都方便）</h3>
          <p>東京車站周邊就是市中心樞紐，去各區域都順，行程分散的人住這裡會很省心。</p>

          <h3 className="seo-h3">銀座（購物區）</h3>
          <p>銀座主打逛街購物，喜歡精品、百貨氛圍的人會很愛；也能順路搭配東京車站的交通便利性。</p>

          <h3 className="seo-h3">澀谷（逛街購物＋熱鬧）</h3>
          <p>
            澀谷適合喜歡逛街購物、想住熱鬧一點的人。
            <br />
            從機場來的話，<strong>N&apos;EX</strong> 可直達澀谷。
          </p>

          <h3 className="seo-h3">新宿（購物區＋河口湖/富士山交通）</h3>
          <p>
            新宿也是購物熱區，而且很適合要安排河口湖、富士山行程的人（可搭乘<a
                    href="https://www.kkday.com/zh-tw/transportation/list_page/japan-rail/jp-shinjuku-rail-to-jp-kawaguchiko-rail?cid=22312"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="tokyohotel_SEO_fujisan"
                  >
                    <strong>富士回遊</strong>
                  </a>）。
            <br />
            <strong>N&apos;EX</strong> 也可直達新宿、東京車站。
          </p>

          <h3 className="seo-h3">第一次去東京住哪裡？（快速結論）</h3>
          <ul>
            <li>想省機場交通：上野</li>
            <li>想住比較便宜：淺草寺周邊</li>
            <li>想去哪都方便：東京車站</li>
            <li>想逛街購物＋熱鬧：澀谷 / 新宿 / 銀座</li>
            <li>要跑河口湖/富士山：新宿</li>
          </ul>
        </SeoContentSection>

        <SeoFaqSection
          title="東京住宿常見問題"
          items={[
            {
              q: '東京住宿推薦住哪一區？',
              a: '第一次到東京建議住新宿/上野/東京車站/澀谷，全部都可從成田機場直達，交通最方便。',
            },
            {
              q: '東京哪個區域住宿最便宜？',
              a: '淺草通常價格較便宜，生活機能也不錯；如果想要更多飯店選擇與競爭價格，也可以考慮池袋或新宿周邊。',
            },
            {
              q: '東京住宿要靠近哪個車站最方便？',
              a: '基本上新宿、上野、東京車站、澀谷，這四個車站幾乎所有景點都能快速到達，轉乘也最方便。',
            },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
