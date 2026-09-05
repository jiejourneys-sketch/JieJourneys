import BusanPassPlannerClient from '@/app/busan/pass-planner/BusanPassPlannerClient'
import type { PlannerConfig } from '@/app/busan/pass-planner/BusanPassPlannerClient'
import { fujiMapPlaces } from '@/data/fuji'
import { FUJI_PASS_MAP_CENTER, fujiPassMapPlaces } from '@/data/fuji/pass-map/places'

const fujiPassPlannerConfig: Partial<PlannerConfig> = {
  storageKey: 'jiejourneys:fuji-pass-planner:v1',
  headerBackHref: '/fuji/pass-map',
  eventPrefix: 'fujipassplanner',
  title: '富士山周遊券景點排序',
  description: '加入想去的優惠景點，拖曳調整順序，地圖會用數字和連線同步顯示位置。',
  topAriaLabel: '富士山周遊券景點排序工具',
  workspaceAriaLabel: '排序工作區',
  panelAriaLabel: '景點排序面板',
  shareTitle: '富士山周遊券景點排序',
  shareText: '我的富士山周遊券景點順序',
  shareActionLabel: '分享/保存',
  saveReminderEnabled: true,
  backLinkLabel: '回周遊券地圖',
  mapZoom: 9,
  matchPlaces: fujiMapPlaces,
  categoryLabels: {
    spot: '觀光/遊覽船',
    free: '溫泉優惠',
    food: '飲食購物',
    hotel: '住宿',
  },
  categoryItems: [
    { key: 'spot', label: '觀光/遊覽船' },
    { key: 'free', label: '溫泉優惠' },
    { key: 'food', label: '飲食購物' },
  ],
  customCategoryItems: [
    { key: 'spot', label: '景點' },
    { key: 'restaurant', label: '餐廳' },
    { key: 'shop', label: '商店' },
    { key: 'hotel', label: '住宿' },
    { key: 'transport', label: '機場/車站' },
  ],
  tierItems: [],
}

export default function FujiPassPlannerPage() {
  return (
    <BusanPassPlannerClient
      mapCenter={FUJI_PASS_MAP_CENTER}
      places={fujiPassMapPlaces}
      config={fujiPassPlannerConfig}
    />
  )
}
