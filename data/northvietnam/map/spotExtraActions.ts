import type { CityCardAction } from '@/components/CityTabbedList'

/**
 * **僅地圖**票券方塊：接在 `northvietnam/tickets` 的 `actions` 後面（票券頁不會出現）。
 * key 須與 `data/northvietnam/tickets.ts` 該張票的 **`title` 完全一致**。
 * 每筆：`{ label, href, mapEvent }`；多排時使用 `mapNextRow: true`（與釜山／東京相同規則）。
 */
export const NORTH_VIETNAM_MAP_SPOT_EXTRA_ACTIONS: Partial<Record<string, CityCardAction[]>> = {
  '番西邦峰': [
    {
      label: 'IG',
      href: 'https://www.instagram.com/reel/DSFXWpxEWn1/',
      className: 'btn',
      event: 'northvietnamMap_SapaFansipanIG',
      platform: 'IG',
      section: 'video',
      mapNextRow: true,
    },
    {
      label: 'YouTube',
      href: 'https://youtube.com/shorts/XdADfZpcSjk?si=14SE004dwhgrfVwc',
      className: 'btn',
      event: 'northvietnamMap_SapaFansipanYT',
      platform: 'YouTube',
      section: 'video',
    },
    {
      label: '小紅書',
      href: 'https://xhslink.com/o/2QTHBsdTvo6',
      className: 'btn',
      event: 'northvietnamMap_SapaFansipanXHS',
      platform: '小紅書',
      section: 'video',
    },
  ],
  '玻璃天空步道': [
    {
      label: 'IG',
      href: 'https://www.instagram.com/reel/DRzV0bckSbY/',
      className: 'btn',
      event: 'northvietnamMap_SapaRongmayIG',
      platform: 'IG',
      section: 'video',
      mapNextRow: true,
    },
    {
      label: 'YouTube',
      href: 'https://youtube.com/shorts/MGe10lGpqB0?si=gaLpYGhOYJm5jdoV',
      className: 'btn',
      event: 'northvietnamMap_SapaRongmayYT',
      platform: 'YouTube',
      section: 'video',
    },
    {
      label: '小紅書',
      href: 'https://xhslink.com/o/5Ox1Pds78Ed',
      className: 'btn',
      event: 'northvietnamMap_SapaRongmayXHS',
      platform: '小紅書',
      section: 'video',
    },
  ],
  '頂級郵輪｜2日遊、6星級': [
    {
      label: 'IG',
      href: 'https://www.instagram.com/reel/DRXBH_2kSSh/',
      className: 'btn',
      event: 'northvietnamMap_GrandpioneersIG',
      platform: 'IG',
      section: 'video',
      mapNextRow: true,
    },
    {
      label: 'YouTube',
      href: 'https://youtube.com/shorts/Z29MK6KABnw?si=h5yUEIPm1DuU4iQ0',
      className: 'btn',
      event: 'northvietnamMap_GrandpioneersYT',
      platform: 'YouTube',
      section: 'video',
    },
    {
      label: '小紅書',
      href: 'https://xhslink.com/o/5lBnaI2LyQ',
      className: 'btn',
      event: 'northvietnamMap_GrandpioneersXHS',
      platform: '小紅書',
      section: 'video',
    },
  ],
  'Athena Cruise｜2日遊、5星級': [
    {
      label: 'IG',
      href: 'https://www.instagram.com/reel/DRPStldE662/',
      className: 'btn',
      event: 'northvietnamMap_AthenaCruiseIG',
      platform: 'IG',
      section: 'video',
      mapNextRow: true,
    },
    {
      label: 'YouTube',
      href: 'https://youtube.com/shorts/Ua9Q9E74xRk?si=yJLoedpPq6wJ9h3b',
      className: 'btn',
      event: 'northvietnamMap_AthenaCruiseYT',
      platform: 'YouTube',
      section: 'video',
    },
    {
      label: '小紅書',
      href: 'https://xhslink.com/o/6MkZi9DOOAU',
      className: 'btn',
      event: 'northvietnamMap_AthenaCruiseXHS',
      platform: '小紅書',
      section: 'video',
    },
  ],
  '華閭古都': [
    {
      label: 'IG',
      href: 'https://www.instagram.com/reel/DRpCoyiEUQs/',
      className: 'btn',
      event: 'northvietnamMap_NinhBìnhChooseIG',
      platform: 'IG',
      section: 'video',
      mapNextRow: true,
    },
    {
      label: 'YouTube',
      href: 'https://youtube.com/shorts/L78C6HEgyqg?si=9vwMMaXZC4djgYEk',
      className: 'btn',
      event: 'northvietnamMap_NinhBìnhChooseYT',
      platform: 'YouTube',
      section: 'video',
    },
    {
      label: '小紅書',
      href: 'https://xhslink.com/o/A5SB4kcJ2QQ',
      className: 'btn',
      event: 'northvietnamMap_NinhBìnhChooseXHS',
      platform: '小紅書',
      section: 'video',
    },
  ],
}
