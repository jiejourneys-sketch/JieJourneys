import BusanPassPlannerClient from '@/app/busan/pass-planner/BusanPassPlannerClient'
import type { PlannerConfig } from '@/app/busan/pass-planner/BusanPassPlannerClient'
import { NORTH_VIETNAM_MAP_CENTER, northVietnamMapPlaces } from '@/data/northvietnam'

const northVietnamPlannerConfig: Partial<PlannerConfig> = {
  storageKey: 'jiejourneys:northvietnam-map-planner:v1',
  headerBackHref: '/northvietnam/map',
  eventPrefix: 'northvietnammapplanner',
  title: '北越景點排序',
  description: '加入想去的景點、票券、餐廳、商店或住宿，拖曳調整順序，地圖會用數字和連線同步顯示位置。',
  topAriaLabel: '北越景點排序工具',
  workspaceAriaLabel: '排序工作區',
  panelAriaLabel: '景點排序面板',
  shareTitle: '北越景點排序',
  shareText: '我的北越景點順序',
  shareActionLabel: '分享/保存',
  saveReminderEnabled: true,
  backLinkLabel: '回北越地圖',
  mapZoom: 7,
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
  tierItems: [],
}

export default function NorthVietnamPlannerPage() {
  return (
    <BusanPassPlannerClient
      mapCenter={NORTH_VIETNAM_MAP_CENTER}
      places={northVietnamMapPlaces}
      config={northVietnamPlannerConfig}
    />
  )
}
