import type { CityCardAction } from '@/components/CityTabbedList'

/**
 * 僅地圖卡片：接在票券 actions 後面的影片連結（與 /busan/video 膠囊列車、釜山塔段落一致）。
 * 第一顆設 `mapNextRow: true` 可與聯盟購票分排；「地圖」仍由 BusanMapClient 接在第一排末。
 */
export const BUSAN_MAP_SPOT_VIDEO_ACTIONS: Partial<Record<string, CityCardAction[]>> = {
  釜山塔: [
    {
      label: 'IG Reels',
      href: 'https://www.instagram.com/reel/DMKh_XmzOdG/',
      className: 'btn',
      event: 'busanmapvideo_towerIG',
      platform: 'IG',
      section: 'video',
      mapNextRow: true,
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/shorts/e3-R4YEj7Cw',
      className: 'btn',
      event: 'busanmapvideo_towerYT',
      platform: 'YouTube',
      section: 'video',
    },
  ],
  'Diamond Bay Yacht｜鑽石灣遊艇': [
    {
      label: 'IG Reels',
      href: 'https://www.instagram.com/reel/DVTW_MLkpj4/',
      className: 'btn',
      event: 'busanmapvideo_DiamondBayYachtIG',
      platform: 'IG',
      section: 'video',
      mapNextRow: true,
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/shorts/N56k5869RVw',
      className: 'btn',
      event: 'busanmapvideo_DiamondBayYachtYT',
      platform: 'YouTube',
      section: 'video',
    },
  ],
  'Yacht Holic｜水營灣遊艇': [
    {
      label: 'IG Reels',
      href: 'https://www.instagram.com/reel/DVTW_MLkpj4/',
      className: 'btn',
      event: 'busanmapvideo_YachtHolicIG',
      platform: 'IG',
      section: 'video',
      mapNextRow: true,
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/shorts/N56k5869RVw',
      className: 'btn',
      event: 'busanmapvideo_YachtHolicYT',
      platform: 'YouTube',
      section: 'video',
    },
  ],
  '膠囊列車&海岸列車': [
    {
      label: 'IG Reels',
      href: 'https://www.instagram.com/reel/DMu5uZxTdO8/',
      className: 'btn',
      event: 'busanmapvideo_SkycapIG',
      platform: 'IG',
      section: 'video',
      mapNextRow: true,
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/shorts/NojyZ8jfvD4',
      className: 'btn',
      event: 'busanmapvideo_SkycapYT',
      platform: 'YouTube',
      section: 'video',
    },
  ],
}
