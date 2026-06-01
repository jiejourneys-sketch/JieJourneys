import BusanPassPlannerClient from '@/app/busan/pass-planner/BusanPassPlannerClient'
import type { PlannerConfig } from '@/app/busan/pass-planner/BusanPassPlannerClient'
import { BUSAN_MAP_CENTER, busanMapPlaces } from '@/data/busan/map/places'
import { busanPassMapPlaces } from '@/data/busan/pass-map/places'

const busanPlannerConfig: Partial<PlannerConfig> = {
  storageKey: 'jiejourneys:busan-map-planner:v1',
  headerBackHref: '/busan/map',
  eventPrefix: 'busanmapplanner',
  title: '釜山景點排序',
  description: '加入想去的景點、票券、餐廳、商店或住宿，拖曳調整順序，地圖會用數字和連線同步顯示位置。',
  topAriaLabel: '釜山景點排序工具',
  workspaceAriaLabel: '排序工作區',
  panelAriaLabel: '景點排序面板',
  shareTitle: '釜山景點排序',
  shareText: '我的釜山景點順序',
  shareActionLabel: '分享/保存',
  saveReminderEnabled: true,
  backLinkLabel: '回釜山地圖',
  categoryLabels: {
    ticket: '票券',
    spot: '景點',
    restaurant: '餐廳',
    shop: '商店',
    hotel: '住宿',
  },
  categoryItems: [
    { key: 'ticket', label: '票券' },
    { key: 'spot', label: '景點' },
    { key: 'restaurant', label: '餐廳' },
    { key: 'shop', label: '商店' },
    { key: 'hotel', label: '住宿' },
  ],
  matchPlaces: busanPassMapPlaces,
  tierItems: [],
}

export default function BusanPlannerPage() {
  return <BusanPassPlannerClient mapCenter={BUSAN_MAP_CENTER} places={busanMapPlaces} config={busanPlannerConfig} />
}
