import type { CityCardAction } from '@/components/CityTabbedList'

/**
 * 僅地圖卡片：Naver 地圖連結（**不要**寫進 `tickets.ts`，票券頁才不會出現）。
 * key 須與 `data/busan/tickets.ts` 的 `title` 完全一致。
 */
export const BUSAN_MAP_SPOT_NAVER_ACTIONS: Partial<Record<string, CityCardAction[]>> = {
  樂天世界: [
    { label: 'NaverMap', href: 'https://naver.me/x9BN8XXI', mapEvent: 'busanmap_NaverLotte' },
  ],
  '斜坡滑車SkyLine Luge': [
    { label: 'NaverMap', href: 'https://naver.me/IDFUcLWo', mapEvent: 'busanmap_NaverSkyline' },
  ],
  '釜山 X the Sky 展望台': [
    { label: 'NaverMap', href: 'https://naver.me/GL8dR53P', mapEvent: 'busanmap_NaverXthesky' },
  ],
  '汗蒸幕｜新世界SPA LAND': [
    { label: 'NaverMap', href: 'https://naver.me/5Q372Aqt', mapEvent: 'busanmap_NaverSpaland' },
  ],
  '松島海上纜車': [
    { label: 'NaverMap', href: 'https://naver.me/Fmf6KBhZ', mapEvent: 'busanmap_NaverSongdao' },
  ],
  '松島龍宮空中步道': [
    { label: 'NaverMap', href: 'https://naver.me/5T4AUbEV', mapEvent: 'busanmap_NaverSongdoSkywalk' },
  ],
  'Running Man 體驗館': [
    { label: 'NaverMap', href: 'https://naver.me/xdpFI0fg', mapEvent: 'busanmap_NaverRunningMan' },
  ],
  'Museum 1 ': [
    { label: 'NaverMap', href: 'https://naver.me/54LpAJfn', mapEvent: 'busanmap_NaverMuseum1' },
  ],
  '哲秀與英熙｜韓服體驗': [
    { label: 'NaverMap', href: 'https://naver.me/5WOQlWQy', mapEvent: 'busanmap_NaverJeosoo' },
  ],
  '韓服體驗｜釜山甘川文化村': [
    { label: 'NaverMap', href: 'https://naver.me/IItc6HR9', mapEvent: 'busanmap_NaverHanfu' },
  ],
  '釜山塔': [
    { label: 'NaverMap', href: 'https://naver.me/G65JM8n7', mapEvent: 'busanmap_NaverBusantower' },
  ],
  'Club D Oasis': [
    { label: 'NaverMap', href: 'https://naver.me/F9N4ni3R', mapEvent: 'busanmap_NaverClubDOasis' },
  ],
  'Hillspa': [
    { label: 'NaverMap', href: 'https://naver.me/xOxHBnLG', mapEvent: 'busanmap_NaverHillspa' },
  ],
  'Diamond Bay Yacht｜鑽石灣遊艇': [
    { label: 'NaverMap', href: 'https://naver.me/xcn3qM9o', mapEvent: 'busanmap_NaverDiamondBayYacht' },
  ],
  'Yacht Holic｜水營灣遊艇': [
    { label: 'NaverMap', href: 'https://naver.me/GBF7x95e', mapEvent: 'busanmap_NaverYachtHolic' },
  ],
  'Yacht G｜水營灣遊艇': [
    { label: 'NaverMap', href: 'https://naver.me/Gct6bVe1', mapEvent: 'busanmap_NaverYachtG' },
  ],
  'GoGo Yacht｜水營灣遊艇': [
    { label: 'NaverMap', href: 'https://naver.me/Gct6bVe1', mapEvent: 'busanmap_NaverGoGoYacht' },
  ],
  'Yachtwa｜水營灣遊艇': [
    { label: 'NaverMap', href: 'https://naver.me/Gct6bVe1', mapEvent: 'busanmap_NaverYachtwa' },
  ],
  'The Yacht｜水營灣遊艇': [
    { label: 'NaverMap', href: 'https://naver.me/Gct6bVe1', mapEvent: 'busanmap_NaverTheYacht' },
  ],
  'Y Holic｜水營灣遊艇': [
    { label: 'NaverMap', href: 'https://naver.me/Gct6bVe1', mapEvent: 'busanmap_NaverYHolic' },
  ],
  'Yacht Tale｜水營灣遊艇': [
    { label: 'NaverMap', href: 'https://naver.me/59vo1yZU', mapEvent: 'busanmap_NaverYachtTale' },
  ],
  '膠囊列車&海岸列車': [
    { label: 'NaverMap', href: 'https://naver.me/FafyrnAe', mapEvent: 'busanmap_NaverBluelinePark' },
  ],
  'SEA LIFE 釜山水族館門票': [
    { label: 'NaverMap', href: 'https://naver.me/FoENALrx', mapEvent: 'busanmap_NaverSealife' },
  ],
  '太宗台海洋飛行主題樂園': [
    { label: 'NaverMap', href: 'https://naver.me/xY4siqLv', mapEvent: 'busanmap_NaverTaejongdaeFlying' },
  ],
  '釜山藝術博物館': [
    { label: 'NaverMap', href: 'https://naver.me/FIfsvnna', mapEvent: 'busanmap_NaverArteMuseum' },
  ],
}
