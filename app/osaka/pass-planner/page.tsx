import BusanPassPlannerClient from '@/app/busan/pass-planner/BusanPassPlannerClient'
import type { PlannerConfig } from '@/app/busan/pass-planner/BusanPassPlannerClient'
import { OSAKA_PASS_MAP_CENTER, osakaPassMapPlaces } from '@/data/osaka/pass-map/places'

const osakaPlannerConfig: Partial<PlannerConfig> = {
  storageKey: 'jiejourneys:osaka-pass-planner:v1',
  headerBackHref: '/osaka/pass-map',
  eventPrefix: 'osakapassplanner',
  title: '大阪周遊券景點排序',
  description: '加入想去的設施，拖曳調整順序，地圖會用數字和連線同步顯示位置。',
  topAriaLabel: '大阪周遊券景點排序工具',
  workspaceAriaLabel: '排序工作區',
  panelAriaLabel: '景點排序面板',
  shareTitle: '大阪周遊券景點排序',
  shareText: '我的大阪周遊券景點順序',
  shareActionLabel: '分享/保存',
  saveReminderEnabled: true,
  backLinkLabel: '回周遊券地圖',
  categoryLabels: {
    spot: '免費設施',
    free: '優惠設施',
    food: '店家優惠',
    hotel: '住宿',
  },
  categoryItems: [
    { key: 'spot', label: '免費設施' },
    { key: 'free', label: '優惠設施' },
    { key: 'food', label: '店家優惠' },
  ],
  tierItems: [],
}

export default function OsakaPassPlannerPage() {
  return (
    <BusanPassPlannerClient
      mapCenter={OSAKA_PASS_MAP_CENTER}
      places={osakaPassMapPlaces}
      config={osakaPlannerConfig}
    />
  )
}
