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

        <SeoContentSection title="東京住宿怎麼選？先看機場和每天會去的區域">
          <p>
            東京住宿不要只看哪一站有名，先把行程分成東側、西側和市中心。住對區域，每天少轉一次車，體感差很多；住錯區域，就算飯店很漂亮，也會一直被轉乘和拖行李消耗。
          </p>

          <h3 className="seo-h3">五大住宿區域快速比較</h3>
          <table>
            <thead>
              <tr>
                <th>區域</th>
                <th>適合誰</th>
                <th>注意點</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>上野</td>
                <td>成田進出、第一次東京、想去淺草和晴空塔。</td>
                <td>往澀谷、新宿比較像跨區移動。</td>
              </tr>
              <tr>
                <td>淺草</td>
                <td>想住傳統街區、房價想壓低、行程偏上野淺草。</td>
                <td>沒有 JR，去西東京通常要轉地鐵。</td>
              </tr>
              <tr>
                <td>東京車站 / 銀座</td>
                <td>行程分散、要搭新幹線、喜歡百貨和乾淨街區。</td>
                <td>住宿預算通常比較高。</td>
              </tr>
              <tr>
                <td>新宿</td>
                <td>想逛街、夜生活、安排河口湖或富士山。</td>
                <td>車站大又複雜，第一次拖行李要留時間。</td>
              </tr>
              <tr>
                <td>澀谷</td>
                <td>喜歡潮流購物、原宿表參道、晚上想熱鬧。</td>
                <td>熱門區房價高，安靜度看飯店位置。</td>
              </tr>
            </tbody>
          </table>

          <h3 className="seo-h3">我的選法：先看你從哪個機場進東京</h3>
          <p>
            成田機場進市區，如果想快又直覺，上野很適合，因為 Skyliner 能到上野、日暮里；如果住新宿、澀谷或東京車站，N&apos;EX 會比較不用搬行李轉車。想看完整機場交通比較，可以先看
            <a
              href="/tokyo/narita-airport-to-tokyo?from=tokyo-hotel"
              data-event="tokyohotel_article_narita"
              data-platform="article"
              data-section="article"
            >
              <strong> 成田機場到市區文章</strong>
            </a>
            。
          </p>
          <p>
            羽田機場離市區近很多，京急電鐵和東京單軌電車都方便。住銀座、東京車站、品川一帶會很順；如果住淺草、押上方向，京急直通都營淺草線也很好用。可以搭配
            <a
              href="/tokyo/haneda-airport-to-tokyo?from=tokyo-hotel"
              data-event="tokyohotel_article_haneda"
              data-platform="article"
              data-section="article"
            >
              <strong> 羽田機場到市區文章</strong>
            </a>
            一起看。
          </p>

          <h3 className="seo-h3">東側行程多：上野或淺草最省力</h3>
          <p>
            如果你的東京行程有淺草寺、晴空塔、上野公園、阿美橫町、秋葉原，住宿直接放上野或淺草就很舒服。上野交通比較全面，淺草更有傳統街區感，晚上也比新宿澀谷安靜。
          </p>

          <h3 className="seo-h3">西側逛街多：新宿或澀谷比較順</h3>
          <p>
            如果每天都在新宿、原宿、表參道、澀谷、明治神宮移動，住西側會少很多跨城時間。新宿更像交通總站，澀谷更像逛街和夜生活核心；如果你有安排
            <a
              href="https://www.kkday.com/zh-tw/transportation/list_page/japan-rail/jp-shinjuku-rail-to-jp-kawaguchiko-rail?cid=22312"
              target="_blank"
              rel="noopener noreferrer"
              data-event="tokyohotel_article_fuji_train"
              data-platform="KKDAY"
              data-section="article"
            >
              <strong> 富士回遊</strong>
            </a>
            或河口湖，新宿通常更好接。
          </p>

          <h3 className="seo-h3">結論：第一次東京我會這樣選</h3>
          <ul>
            <li>成田進出、想簡單：上野。</li>
            <li>預算想壓低、喜歡傳統街區：淺草。</li>
            <li>行程分散、要搭新幹線：東京車站。</li>
            <li>購物夜生活、河口湖富士山：新宿。</li>
            <li>原宿表參道澀谷為主：澀谷。</li>
          </ul>
        </SeoContentSection>

        <SeoFaqSection
          title="東京住宿常見問題"
          items={[
            {
              q: '第一次東京住宿最推薦哪一區？',
              a: '如果沒有特別偏好，我會先看上野或新宿。上野適合成田進出和東側行程；新宿適合購物、夜生活和河口湖富士山。',
            },
            {
              q: '東京住宿哪裡比較便宜？',
              a: '通常淺草、上野外圍、池袋會比銀座、東京車站、澀谷好找價格。不要只看行政區，重點是離地鐵站或 JR 站走路幾分鐘。',
            },
            {
              q: '東京車站適合住嗎？',
              a: '適合行程分散、會搭新幹線或想住乾淨安靜街區的人。不過房價通常較高，如果每天都在新宿澀谷逛街，住西側會更順。',
            },
            {
              q: '住淺草會不會不方便？',
              a: '如果主要玩上野、淺草、晴空塔、築地、銀座，其實很方便；但如果每天都跑新宿澀谷，就會比較常跨區轉車。',
            },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
