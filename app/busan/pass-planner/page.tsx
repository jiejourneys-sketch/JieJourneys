import BusanPassPlannerClient from './BusanPassPlannerClient'
import { busanMapPlaces } from '@/data/busan/map/places'
import { BUSAN_PASS_MAP_CENTER, busanPassMapPlaces } from '@/data/busan/pass-map/places'

export default function BusanPassPlannerPage() {
  return (
    <BusanPassPlannerClient
      mapCenter={BUSAN_PASS_MAP_CENTER}
      places={busanPassMapPlaces}
      config={{
        shareActionLabel: '分享/保存',
        saveReminderEnabled: true,
        matchPlaces: busanMapPlaces,
        customCategoryItems: [
          { key: 'spot', label: '景點' },
          { key: 'restaurant', label: '餐廳' },
          { key: 'shop', label: '商店' },
          { key: 'hotel', label: '住宿' },
          { key: 'transport', label: '機場/車站' },
        ],
      }}
    />
  )
}
