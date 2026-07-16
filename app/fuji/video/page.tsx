import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import type { CityCard } from '@/components/CityTabbedList'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'

export default function FujiVideoPage() {
  const tabs = [
    { value: 'all', label: '全部', dataArea: 'all' },
    { value: '景點攻略', label: '景點攻略', dataArea: '景點攻略' },
    { value: '住宿攻略', label: '住宿攻略', dataArea: '住宿攻略' },
    { value: '票券攻略', label: '票券攻略', dataArea: '票券攻略' },
    { value: '交通攻略', label: '交通攻略', dataArea: '交通攻略' },
    { value: '行程攻略', label: '行程攻略', dataArea: '行程攻略' },
  ]

  const cards: CityCard[] = [
    {
      title: '富士河口湖｜攻略',
      meta: '景點攻略',
      area: '景點攻略',
      datasetKey: 'video',
      datasetValue: 'kawaguchiko-30s-guide',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DXjjhEeybz6/', className: 'btn primary', event: 'fujivideo_kawaguchiko_30s_ig', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/9UarsZXV-Bg', className: 'btn', event: 'fujivideo_kawaguchiko_30s_yt', platform: 'YouTube', section: 'video' },
       ],
    },
    {
      title: '新倉山淺間公園｜攻略',
      meta: '景點攻略',
      area: '景點攻略',
      datasetKey: 'video',
      datasetValue: 'arakurayama-sengen-park-30s-guide',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DYZoMf0yQkz/', className: 'btn primary', event: 'fujivideo_arakurayama_sengen_30s_ig', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/bLNGM5FHpfA', className: 'btn', event: 'fujivideo_arakurayama_sengen_30s_yt', platform: 'YouTube', section: 'video' },
        ],
    },
    {
      title: '大石公園｜攻略',
      meta: '景點攻略',
      area: '景點攻略',
      datasetKey: 'video',
      datasetValue: 'oishi-park-30s-guide',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DYrpyjiS5-L/', className: 'btn primary', event: 'fujivideo_oishi_park_30s_ig', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/m67IlemzJNI', className: 'btn', event: 'fujivideo_oishi_park_30s_yt', platform: 'YouTube', section: 'video' },
        { label: '小紅書', href: 'https://xhslink.com/o/1HEwdETh1zm', className: 'btn', event: 'fujivideo_oishi_park_30s_xhs', platform: '小紅書', section: 'video' },
      ],
    },
    {
      title: '河口湖住宿｜攻略',
      meta: '住宿攻略',
      area: '住宿攻略',
      datasetKey: 'video',
      datasetValue: 'kawaguchiko-hotel-guide',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DYrpvj3yPso/', className: 'btn primary', event: 'fujivideo_kawaguchiko_hotel_ig', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/oyBnxGBgYDg', className: 'btn', event: 'fujivideo_kawaguchiko_hotel_yt', platform: 'YouTube', section: 'video' },
        { label: '小紅書', href: 'https://xhslink.com/o/ACXKXbRVJCH', className: 'btn', event: 'fujivideo_kawaguchiko_hotel_xhs', platform: '小紅書', section: 'video' },
      ],
    },
    {
      title: '富士山周遊券｜攻略',
      meta: '票券攻略',
      area: '票券攻略',
      datasetKey: 'video',
      datasetValue: 'mt-fuji-pass-guide',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DY9rYLxy_o7/', className: 'btn primary', event: 'fujivideo_mt_fuji_pass_ig', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/4gnbR3VbNSs', className: 'btn', event: 'fujivideo_mt_fuji_pass_yt', platform: 'YouTube', section: 'video' },
        { label: '小紅書', href: 'https://xhslink.com/o/AimsPvqTE4I', className: 'btn', event: 'fujivideo_mt_fuji_pass_xhs', platform: '小紅書', section: 'video' },
        { label: '文章', href: '/fuji/mt-fuji-pass?from=video', className: 'btn', event: 'fujivideo_mt_fuji_pass_article', platform: 'article', section: 'video' },
      ],
    },
    {
      title: '河口湖玩幾天｜攻略',
      meta: '行程攻略',
      area: '行程攻略',
      datasetKey: 'video',
      datasetValue: 'kawaguchiko-days-guide',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DYj7bS8SHmH/', className: 'btn primary', event: 'fujivideo_kawaguchiko_days_ig', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/WvUrzMfLyQA', className: 'btn', event: 'fujivideo_kawaguchiko_days_yt', platform: 'YouTube', section: 'video' },
        { label: '小紅書', href: 'https://xhslink.com/o/267yhecUsAL', className: 'btn', event: 'fujivideo_kawaguchiko_days_xhs', platform: '小紅書', section: 'video' },
      ],
    },
    {
      title: '東京到河口湖｜3 種方式',
      meta: '交通攻略',
      area: '交通攻略',
      datasetKey: 'video',
      datasetValue: 'tokyo-to-kawaguchiko-transport',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DX1lCACSFYX/', className: 'btn primary', event: 'fujivideo_tokyo_to_kawaguchiko_ig', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/nj79P4JUujQ', className: 'btn', event: 'fujivideo_tokyo_to_kawaguchiko_yt', platform: 'YouTube', section: 'video' },
        { label: '小紅書', href: 'https://xhslink.com/o/3O0UGvYCRaJ', className: 'btn', event: 'fujivideo_tokyo_to_kawaguchiko_xhs', platform: '小紅書', section: 'video' },
        { label: '文章', href: '/fuji/tokyo-to-kawaguchiko?from=video', className: 'btn', event: 'fujivideo_tokyo_to_kawaguchiko_article', platform: 'article', section: 'video' },
      ],
    },
    {
      title: '如何搭富士回遊｜2 個重點',
      meta: '交通攻略',
      area: '交通攻略',
      datasetKey: 'video',
      datasetValue: 'fuji-excursion-train-tips',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/DYHmqrcyvb_/', className: 'btn primary', event: 'fujivideo_fuji_excursion_tips_ig', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/qoDZE_2SiMQ', className: 'btn', event: 'fujivideo_fuji_excursion_tips_yt', platform: 'YouTube', section: 'video' },
        { label: '小紅書', href: 'https://xhslink.com/o/9CmeqVhMQl0', className: 'btn', event: 'fujivideo_fuji_excursion_tips_xhs', platform: '小紅書', section: 'video' },
      ],
    },
  ]

  return (
    <>
      <CitySubpageHeader backHref="/fuji" eventPrefix="fujivideo" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="短影片合輯"
          h1="富士河口湖短影片攻略｜快速找到適合你的玩法"
          intro="這頁有所有短影片連結，讓你用最快速度找到要看的那一支。"
          eventPrefix="fujivideo"
          showVisual={false}
          ctaLinks={[
            {
              label: '富士河口湖住宿推薦',
              href: 'https://www.jiejourneys.com/fuji/hotel',
              dataEvent: 'fujivideo_allhotels',
              platform: 'hotel',
            },
            {
              label: '富士河口湖票券總整理',
              href: 'https://www.jiejourneys.com/fuji/ticket',
              dataEvent: 'fujivideo_alltickets',
              platform: 'ticket',
            },
            {
              label: '通訊&交通攻略',
              href: 'https://www.jiejourneys.com/fuji/transport',
              dataEvent: 'fujivideo_alltransport',
              platform: 'transport',
            },
          ]}
        />

        <h2 className="seo-h2" id="videoListTitle">
          富士河口湖短影片合輯（依主題分類）
        </h2>

        <CityTabbedList tabs={tabs} cards={cards} tabEvent="fujivideo_tab" />

        <SeoCtaSection text="" href="/fuji/map" linkText="富士河口湖熱門景點地圖" newTab dataEvent="fujivideo_SEO_spotmap" />

        <section className="seo-content" aria-label="富士河口湖短影音攻略">
          <h2 className="seo-h2">富士河口湖短影音怎麼看？</h2>

          <div className="seo-prose">
            <h3 className="seo-h3">先看河口湖 30 秒攻略，快速抓到行程重點</h3>
            <p>
              第一次去富士山，最容易卡住的不是景點太少，而是不知道河口湖到底要排多久、該從哪裡開始。
              這支河口湖 30 秒攻略適合先快速建立方向：河口湖是富士山自由行最常見的基地，可以搭配大石公園、河口湖纜車、河口湖遊覽船、Lawson 打卡點和周邊湖景散步。
              如果你只是想從東京出發玩一天，建議先用這支影片判斷自己想走「拍照景點」還是「交通省力」路線。
            </p>

            <h3 className="seo-h3">新倉山淺間公園和大石公園，先用 30 秒抓拍照重點</h3>
            <p>
              新倉山淺間公園是富士山經典構圖，五重塔、富士山和櫻花季最有代表性；大石公園則是河口湖北岸看富士山的熱門點，春天薰衣草、秋天芒草和楓葉都很適合拍照。
              如果你正在排河口湖一日遊，可以先看這兩支 30 秒攻略，再回到地圖確認兩個景點和河口湖站、忍野八海、Lawson 打卡點的相對位置。
            </p>

            <h3 className="seo-h3">東京到河口湖，先搞懂 3 種方式</h3>
            <p>
              東京到河口湖常見方式有高速巴士、富士回遊特急和包車。高速巴士通常最直覺，從新宿出發可直接到河口湖站，適合想省預算的人；
              富士回遊適合喜歡鐵道、想少換車的人，但座位熱門時段要提早訂；包車則適合親子、長輩同行、多人分攤，或想把河口湖、忍野八海、新倉山淺間公園、御殿場 Outlet 串成同一天的人。
              看完「東京到河口湖 3 種方式」後，可以接著看
              <a
                href="/fuji/tokyo-to-kawaguchiko?from=video"
                data-event="fujivideo_SEO_tokyo_kawaguchiko_article"
                data-platform="article"
                data-section="seo_content"
              >
                <strong>東京到河口湖交通文章</strong>
              </a>
              ，再回到交通頁比價會比較不容易選錯。
            </p>

            <h3 className="seo-h3">住宿、周遊券、玩幾天，也先用短影音抓方向</h3>
            <p>
              如果你還在決定要住河口湖站附近、湖景飯店，或是到底要玩一天、兩天、三天，可以先看「河口湖住宿」和「河口湖玩幾天」兩支影片。
              已經確定要自由行慢慢搭車的人，再看
              <a
                href="/fuji/mt-fuji-pass?from=video"
                data-event="fujivideo_SEO_mt_fuji_pass_article"
                data-platform="article"
                data-section="seo_content"
              >
                <strong>富士山周遊券攻略</strong>
              </a>
              ，會比較知道周遊券到底有沒有用到。
            </p>

            <h3 className="seo-h3">搭富士回遊前，最重要的是座位和班次</h3>
            <p>
              富士回遊雖然方便，但不是所有往大月方向的車都能一路直達河口湖，也不是隨到隨有位置。
              影片裡整理的 2 個重點可以先看：一是確認是否需要指定席，二是確認班次是不是直達河口湖。
              如果遇到熱門季節，例如櫻花、楓葉、暑假或天氣預報顯示富士山能見度高，建議提早查票，不要到現場才臨時決定。
            </p>

            <h3 className="seo-h3">短影音適合先看，實際規劃再搭配地圖和票券頁</h3>
            <p>
              短影音可以幫你快速理解富士河口湖怎麼玩，但真正排路線時，還是建議搭配
              <a href="/fuji/map" data-event="fujivideo_SEO_map_inline">
                <strong>富士河口湖景點地圖</strong>
              </a>
              和
              <a href="/fuji/ticket" data-event="fujivideo_SEO_ticket_inline">
                <strong>富士河口湖票券總整理</strong>
              </a>
              一起看。地圖可以確認景點距離，票券頁可以比較一日遊、二日遊、包車與單景點門票，會比只看單支影片更準。
            </p>
          </div>
        </section>

        <SeoFaqSection
          title="富士河口湖短影音常見問題"
          items={[
            {
              q: '第一次去富士河口湖，要先看哪支影片？',
              a: '建議先看河口湖 30 秒攻略，快速抓到河口湖站、大石公園、纜車、遊覽船和富士山景點的大方向；如果重點是拍照，再接著看新倉山淺間公園和大石公園 30 秒攻略。',
            },
            {
              q: '東京到河口湖適合搭富士回遊還是高速巴士？',
              a: '如果想省預算、從新宿直接出發，高速巴士很直覺；如果想搭鐵路、希望少換車，可以看富士回遊。熱門季節兩者都建議提早預訂。',
            },
            {
              q: '看完短影音後，還需要看票券頁嗎？',
              a: '需要。短影音適合快速理解玩法，票券頁則能比較 KKDAY、KLOOK、Trip 的一日遊、包車、景點門票與行程內容，比較適合實際下訂前確認。',
            },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
