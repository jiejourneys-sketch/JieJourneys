import type { CityCardAction } from '@/components/CityTabbedList'

/**
 * **僅地圖**票券方塊：接在 `tokyo/tickets` 的 `actions` 後面（票券頁不會出現）。
 * key 須與 `data/tokyo/tickets.ts` 該張票的 **`title` 完全一致**。
 * 每筆：`{ label, href, mapEvent }`；要換行排第二排可在該筆加 `mapNextRow: true`（加在「新排第一顆」上，勿加在每張第一顆）。
 */
export const TOKYO_MAP_SPOT_EXTRA_ACTIONS: Partial<Record<string, CityCardAction[]>> = {
  // 這裡只影響 /tokyo/map 的「票券」卡片，不會出現在 /tokyo/ticket
  '晴空塔': [
    {
      label: 'IG',
      href: 'https://www.instagram.com/reel/DV3aGGdFNsc/',
      mapEvent: 'tokyomap_skytree_ig',
      mapNextRow: true,
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/shorts/Q-zM2k47oVY',
      mapEvent: 'tokyomap_skytree_youtube',
    },
  ],
  'SHIBUYA SKY': [
    {
      label: 'IG',
      href: 'https://www.instagram.com/reel/DWJbrmXFDuf/',
      mapEvent: 'tokyomap_shibuya_sky_ig',
      mapNextRow: true,
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/shorts/Y0mGY55bSFs',
      mapEvent: 'tokyomap_shibuya_sky_youtube',
    },
  ],
}
