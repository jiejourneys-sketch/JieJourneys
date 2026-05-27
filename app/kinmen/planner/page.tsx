import BusanPassPlannerClient from '@/app/busan/pass-planner/BusanPassPlannerClient'
import type { PlannerConfig } from '@/app/busan/pass-planner/BusanPassPlannerClient'
import type { MapPlace } from '@/lib/mapPlace'

const kinmenMapCenter = { lat: 24.4376, lng: 118.3186 }
const kinmenPlaces: MapPlace[] = []

const kinmenPlannerConfig: Partial<PlannerConfig> = {
  storageKey: 'jiejourneys:kinmen-map-planner:v1',
  headerBackHref: '/',
  eventPrefix: 'kinmenmapplanner',
  title: '金門景點排序',
  description: '加入想去的金門景點、餐廳、商店或住宿，拖曳調整順序，地圖會用數字和連線同步顯示位置。',
  topAriaLabel: '金門景點排序工具',
  workspaceAriaLabel: '排序工作區',
  panelAriaLabel: '景點排序面板',
  shareTitle: '金門景點排序',
  shareText: '我的金門景點順序',
  shareActionLabel: '分享/保存',
  saveReminderEnabled: true,
  backLinkLabel: '回首頁',
  mapZoom: 12,
  categoryLabels: {
    spot: '景點',
    restaurant: '餐廳',
    shop: '商店',
    hotel: '住宿',
  },
  categoryItems: [
    { key: 'spot', label: '景點' },
    { key: 'restaurant', label: '餐廳' },
    { key: 'shop', label: '商店' },
    { key: 'hotel', label: '住宿' },
  ],
  tierItems: [],
}

export default function KinmenPlannerPage() {
  return <BusanPassPlannerClient mapCenter={kinmenMapCenter} places={kinmenPlaces} config={kinmenPlannerConfig} />
}
