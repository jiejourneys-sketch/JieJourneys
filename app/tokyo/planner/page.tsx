import BusanPassPlannerClient from '@/app/busan/pass-planner/BusanPassPlannerClient'
import type { PlannerConfig } from '@/app/busan/pass-planner/BusanPassPlannerClient'
import { TOKYO_MAP_CENTER, tokyoMapPlaces } from '@/data/tokyo'

const tokyoPlannerConfig: Partial<PlannerConfig> = {
  storageKey: 'jiejourneys:tokyo-map-planner:v1',
  headerBackHref: '/tokyo/map',
  eventPrefix: 'tokyomapplanner',
  title: '東京景點排序',
  description: '加入想去的景點、票券、餐廳、商店或住宿，拖曳調整順序，地圖會用數字和連線同步顯示位置。',
  topAriaLabel: '東京景點排序工具',
  workspaceAriaLabel: '排序工作區',
  panelAriaLabel: '景點排序面板',
  shareTitle: '東京景點排序',
  shareText: '我的東京景點順序',
  shareActionLabel: '分享/保存',
  saveReminderEnabled: true,
  backLinkLabel: '回東京地圖',
  mapZoom: 11,
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

export default function TokyoPlannerPage() {
  return <BusanPassPlannerClient mapCenter={TOKYO_MAP_CENTER} places={tokyoMapPlaces} config={tokyoPlannerConfig} />
}
