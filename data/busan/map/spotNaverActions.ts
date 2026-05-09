import type { CityCardAction } from '@/components/CityTabbedList'

/**
 * 僅地圖卡片：Naver 地圖連結（**不要**寫進 `tickets.ts`，票券頁才不會出現）。
 * key 須與 `data/busan/tickets.ts` 的 `title` 完全一致。
 */
export const BUSAN_MAP_SPOT_NAVER_ACTIONS: Partial<Record<string, CityCardAction[]>> = {
  樂天世界: [
    { label: 'NaverMap', href: 'https://naver.me/x9BN8XXI', mapEvent: 'busanmap_ticket_lotte_navermap' },
  ],
  '斜坡滑車SkyLine Luge': [
    { label: 'NaverMap', href: 'https://naver.me/IDFUcLWo', mapEvent: 'busanmap_ticket_skyline_navermap' },
  ],
  '釜山 X the Sky 展望台': [
    { label: 'NaverMap', href: 'https://naver.me/GL8dR53P', mapEvent: 'busanmap_ticket_xthesky_navermap' },
  ],
  '汗蒸幕｜新世界SPA LAND': [
    { label: 'NaverMap', href: 'https://naver.me/5Q372Aqt', mapEvent: 'busanmap_ticket_spaland_navermap' },
  ],
  '松島海上纜車': [
    { label: 'NaverMap', href: 'https://naver.me/Fmf6KBhZ', mapEvent: 'busanmap_ticket_songdao_navermap' },
  ],
  '松島龍宮空中步道': [
    { label: 'NaverMap', href: 'https://naver.me/5T4AUbEV', mapEvent: 'busanmap_ticket_songdo_skywalk_navermap' },
  ],
  'Running Man 體驗館': [
    { label: 'NaverMap', href: 'https://naver.me/x9BN6Lg5', mapEvent: 'busanmap_ticket_running_man_navermap' },
  ],
  'Museum 1 ': [
    { label: 'NaverMap', href: 'https://naver.me/GHvq813a', mapEvent: 'busanmap_ticket_museum1_navermap' },
  ],
  '哲秀與英熙｜韓服體驗': [
    { label: 'NaverMap', href: 'https://naver.me/5WOQlWQy', mapEvent: 'busanmap_ticket_jeosoo_navermap' },
  ],
  '韓服體驗｜釜山甘川文化村': [
    { label: 'NaverMap', href: 'https://naver.me/IItc6HR9', mapEvent: 'busanmap_ticket_hanfu_navermap' },
  ],
  '釜山塔': [
    { label: 'NaverMap', href: 'https://naver.me/G65JM8n7', mapEvent: 'busanmap_ticket_busantower_navermap' },
  ],
  'Club D Oasis': [
    { label: 'NaverMap', href: 'https://naver.me/F9N4ni3R', mapEvent: 'busanmap_ticket_club_d_oasis_navermap' },
  ],
  'Hillspa': [
    { label: 'NaverMap', href: 'https://naver.me/FZ275N7M', mapEvent: 'busanmap_ticket_hillspa_navermap' },
  ],
  'Diamond Bay Yacht｜鑽石灣遊艇': [
    { label: 'NaverMap', href: 'https://naver.me/xcn3qM9o', mapEvent: 'busanmap_ticket_diamond_bay_yacht_navermap' },
  ],
  'Yacht Holic｜水營灣遊艇': [
    { label: 'NaverMap', href: 'https://naver.me/GBF7x95e', mapEvent: 'busanmap_ticket_yacht_holic_navermap' },
  ],
  'Yacht G｜水營灣遊艇': [
    { label: 'NaverMap', href: 'https://naver.me/Gct6bVe1', mapEvent: 'busanmap_ticket_yacht_g_navermap' },
  ],
  'GoGo Yacht｜水營灣遊艇': [
    { label: 'NaverMap', href: 'https://naver.me/Gct6bVe1', mapEvent: 'busanmap_ticket_go_go_yacht_navermap' },
  ],
  'Yachtwa｜水營灣遊艇': [
    { label: 'NaverMap', href: 'https://naver.me/Gct6bVe1', mapEvent: 'busanmap_ticket_yachtwa_navermap' },
  ],
  'The Yacht｜水營灣遊艇': [
    { label: 'NaverMap', href: 'https://naver.me/Gct6bVe1', mapEvent: 'busanmap_ticket_the_yacht_navermap' },
  ],
  'Y Holic｜水營灣遊艇': [
    { label: 'NaverMap', href: 'https://naver.me/Gct6bVe1', mapEvent: 'busanmap_ticket_y_holic_navermap' },
  ],
  'Yacht Tale｜水營灣遊艇': [
    { label: 'NaverMap', href: 'https://naver.me/59vo1yZU', mapEvent: 'busanmap_ticket_yacht_tale_navermap' },
  ],
  '膠囊列車&海岸列車': [
    { label: 'NaverMap', href: 'https://naver.me/FafyrnAe', mapEvent: 'busanmap_ticket_blueline_park_navermap' },
  ],
  'SEA LIFE 釜山水族館門票': [
    { label: 'NaverMap', href: 'https://naver.me/FoENALrx', mapEvent: 'busanmap_ticket_sealife_navermap' },
  ],
  '太宗台海洋飛行主題樂園': [
    { label: 'NaverMap', href: 'https://naver.me/xY4siqLv', mapEvent: 'busanmap_ticket_taejongdae_flying_navermap' },
  ],
  '釜山藝術博物館': [
    { label: 'NaverMap', href: 'https://naver.me/FIfsvnna', mapEvent: 'busanmap_ticket_arte_museum_navermap' },
  ],
}
